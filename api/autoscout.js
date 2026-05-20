/**
 * scraper/autoscout.js
 * Scrapt AutoScout24 Suchergebnisse.
 *
 * AutoScout24 URL-Schema:
 * https://www.autoscout24.de/lst?zip=68163&zipr=50&priceto=30000&atype=C&sort=age&desc=1
 */
const cheerio = require('cheerio');
const { fetchPage, parsePrice, parseKm, parseYear, makeId } = require('./http');

const CAT_MAP = {
  'kombi':      'E',   // Estate
  'suv':        'J',   // SUV / Off-Road
  'limousine':  'S',   // Saloon
  'kleinwagen': 'B',   // Small car
  'van':        'M',   // Minivan
  'cabrio':     'C',   // Cabriolet
  'elektro':    null,  // wird über Kraftstoff gefiltert
};

async function scrape({ plz, radius, cat, priceMin, priceMax }) {
  const params = new URLSearchParams({
    zip:      plz,
    zipr:     radius,
    sort:     'age',   // neueste zuerst
    desc:     1,
    pricefrom: priceMin > 0 ? priceMin : '',
    priceto:   priceMax < 999999 ? priceMax : '',
  });

  // Kategorie
  if (cat && cat !== 'alle' && CAT_MAP[cat]) {
    params.set('body', CAT_MAP[cat]);
  }
  if (cat === 'elektro') {
    params.set('fuel', '7'); // AutoScout Kraftstoff-ID für Elektro
  }

  const url = `https://www.autoscout24.de/lst?${params.toString()}`;
  console.log(`[AutoScout24] URL: ${url}`);

  const res  = await fetchPage(url);
  const $    = cheerio.load(res.data);
  const now  = new Date().toISOString();
  const results = [];

  // AutoScout24 listet Fahrzeuge in article-Tags
  $('article.cldt-summary-full-item, [data-testid="regular-car-item"]').each((_, el) => {
    const $el = $(el);

    const title = $el.find('h2, [data-testid="title"]').first().text().trim();
    if (!title) return;

    const priceText = $el.find('[data-testid="price"], .cldt-summary-price .Price_price__APlgs').first().text().trim();
    const price     = parsePrice(priceText);

    const kmText   = $el.find('[data-testid="mileage-readout"]').text().trim();
    const yearText = $el.find('[data-testid="first-registration-readout"]').text().trim();

    const km   = parseKm(kmText);
    const year = parseYear(yearText);

    const fuelText = $el.find('[data-testid="fuel-type-readout"]').text().trim().toLowerCase();
    const powerText = $el.find('[data-testid="power-readout"]').text().trim();

    // Link zum Inserat
    const href    = $el.find('a').first().attr('href') || '';
    const link    = href.startsWith('http') ? href : `https://www.autoscout24.de${href}`;

    // Bild
    const img = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src') || null;

    const id = makeId('autoscout', title, price);

    results.push({
      id,
      source:    'autoscout',
      sourceName: 'AutoScout24',
      title,
      price,
      km,
      year,
      fuel:      fuelText || null,
      power:     powerText || null,
      cat:       cat !== 'alle' ? cat : detectCat(title),
      link,
      img,
      scrapedAt: now,
    });
  });

  // Fallback: anderes DOM-Format (AutoScout24 ändert gelegentlich Selektoren)
  if (results.length === 0) {
    $('[class*="ListItem"], [class*="list-item"]').each((_, el) => {
      const $el   = $(el);
      const title = $el.find('h2, h3, [class*="title"]').first().text().trim();
      if (!title || title.length < 5) return;
      const priceText = $el.find('[class*="price"], [class*="Price"]').first().text().trim();
      const price     = parsePrice(priceText);
      if (!price) return;
      const id = makeId('autoscout', title, price);
      results.push({
        id,
        source:    'autoscout',
        sourceName: 'AutoScout24',
        title, price,
        km:   null, year: null, fuel: null, power: null,
        cat:  detectCat(title),
        link: `https://www.autoscout24.de/lst?zip=${plz}`,
        img:  null,
        scrapedAt: now,
      });
    });
  }

  console.log(`[AutoScout24] ${results.length} Inserate gefunden`);
  return results;
}

function detectCat(title) {
  const t = title.toLowerCase();
  if (t.includes('suv') || t.includes('crossover') || t.includes('geländewagen')) return 'suv';
  if (t.includes('kombi') || t.includes('touring') || t.includes('variant') || t.includes('estate')) return 'kombi';
  if (t.includes('cabrio') || t.includes('roadster') || t.includes('convertible')) return 'cabrio';
  if (t.includes('van') || t.includes('bus') || t.includes('transporter')) return 'van';
  return 'limousine';
}

module.exports = scrape;
