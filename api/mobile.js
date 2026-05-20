/**
 * scraper/mobile.js
 * Scrapt mobile.de Suchergebnisse.
 *
 * mobile.de URL-Schema:
 * https://suchen.mobile.de/fahrzeuge/search.html?zipcode=68163&radius=50&maxPrice=30000&sortOption.sortBy=creationTime&sortOption.sortOrder=DESCENDING
 */
const cheerio = require('cheerio');
const { fetchPage, parsePrice, parseKm, parseYear, makeId } = require('./http');

const CAT_MAP = {
  'kombi':      'Station+Wagon',
  'suv':        'SUV',
  'limousine':  'Saloon',
  'kleinwagen': 'Small+Car',
  'van':        'Van',
  'cabrio':     'Convertible',
};

async function scrape({ plz, radius, cat, priceMin, priceMax }) {
  const params = new URLSearchParams({
    zipcode: plz,
    radius,
    'sortOption.sortBy':    'creationTime',
    'sortOption.sortOrder': 'DESCENDING',
  });

  if (priceMin > 0)    params.set('minPrice', priceMin);
  if (priceMax < 999999) params.set('maxPrice', priceMax);
  if (cat === 'elektro') params.set('fuel', 'ELECTRICITY');
  else if (cat && cat !== 'alle' && CAT_MAP[cat]) params.set('category.codes', CAT_MAP[cat]);

  const url = `https://suchen.mobile.de/fahrzeuge/search.html?${params.toString()}`;
  console.log(`[mobile.de] URL: ${url}`);

  const res  = await fetchPage(url);
  const $    = cheerio.load(res.data);
  const now  = new Date().toISOString();
  const results = [];

  // mobile.de nutzt data-testid oder klassische Klassen
  const selectors = [
    '[data-testid="result-listing"]',
    '.cBox-body--resultitem',
    '.result-item',
    'article[data-listing-id]',
  ];

  let items = $();
  for (const sel of selectors) {
    items = $(sel);
    if (items.length > 0) break;
  }

  items.each((_, el) => {
    const $el = $(el);

    const title = $el.find('h2, h3, [class*="title"], [data-testid="title"]').first().text().trim();
    if (!title || title.length < 5) return;

    const priceText = $el.find('[data-testid="price"], [class*="price"], [class*="Price"]').first().text().trim();
    const price     = parsePrice(priceText);

    const detailText = $el.find('[class*="detail"], [class*="specs"], [data-testid="vehicle-specs"]').text();
    const km    = parseKm(detailText.match(/[\d.,]+\s*km/i)?.[0]);
    const year  = parseYear(detailText.match(/EZ\s*\d{2}\/\d{4}|\b20\d{2}\b/)?.[0]);
    const power = detailText.match(/(\d{2,3}\s*(?:PS|kW))/i)?.[1] || null;

    const href = $el.find('a').first().attr('href') || '';
    const link = href.startsWith('http') ? href : `https://suchen.mobile.de${href}`;

    const img = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src') || null;

    const id = makeId('mobile', title, price);

    results.push({
      id,
      source:    'mobile',
      sourceName: 'mobile.de',
      title, price, km, year,
      fuel:  detectFuel(detailText),
      power,
      cat:   cat !== 'alle' ? cat : detectCat(title),
      link,
      img,
      scrapedAt: now,
    });
  });

  console.log(`[mobile.de] ${results.length} Inserate gefunden`);
  return results;
}

function detectFuel(text) {
  if (/elektro|electric|e-motor/i.test(text)) return 'Elektro';
  if (/hybrid/i.test(text))                   return 'Hybrid';
  if (/diesel/i.test(text))                   return 'Diesel';
  if (/benzin|petrol|gasoline/i.test(text))   return 'Benzin';
  return null;
}

function detectCat(title) {
  const t = title.toLowerCase();
  if (t.includes('suv') || t.includes('crossover'))               return 'suv';
  if (t.includes('kombi') || t.includes('touring') || t.includes('variant')) return 'kombi';
  if (t.includes('cabrio') || t.includes('roadster'))             return 'cabrio';
  if (t.includes('van') || t.includes('bus'))                     return 'van';
  return 'limousine';
}

module.exports = scrape;
