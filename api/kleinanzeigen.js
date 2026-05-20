/**
 * scraper/kleinanzeigen.js
 * Scrapt Kleinanzeigen.de – nutzt RSS-Feed (kein JS nötig)
 * und fällt auf HTML-Scraping zurück wenn RSS nichts liefert.
 *
 * RSS-URL:
 * https://www.kleinanzeigen.de/s-autos/k0.rss?distance=50&zip=68163
 */
const cheerio   = require('cheerio');
const RSSParser = require('rss-parser');
const { fetchPage, parsePrice, parseKm, parseYear, makeId, sleep } = require('./http');

const parser = new RSSParser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; AutoRadar/1.0)',
    'Accept':     'application/rss+xml, application/xml, text/xml',
  },
});

async function scrape({ plz, radius, priceMin, priceMax, cat }) {
  const results = [];
  const now     = new Date().toISOString();

  // ── 1. RSS-Feed (einfachste Methode) ──────────────────────────
  try {
    const rssUrl = `https://www.kleinanzeigen.de/s-autos/k0.rss?distance=${radius}&zip=${plz}`;
    console.log(`[Kleinanzeigen] RSS: ${rssUrl}`);

    const feed = await parser.parseURL(rssUrl);

    for (const item of (feed.items || [])) {
      const title = item.title?.trim() || '';
      if (!title) continue;

      const desc      = item.contentSnippet || item.content || '';
      const price     = parsePrice(desc.match(/[\d.,]+\s*€/)?.[0]);
      const km        = parseKm(desc.match(/[\d.,]+\s*km/i)?.[0]);
      const year      = parseYear(desc.match(/\b20\d{2}\b|\b19\d{2}\b/)?.[0]);
      const link      = item.link || '';
      const img       = extractFirstImg(item['content:encoded'] || item.content || '');

      // Preis-Filter
      if (price && priceMin > 0   && price < priceMin) continue;
      if (price && priceMax < 999999 && price > priceMax) continue;

      const id = makeId('kleinanzeigen', title, price);
      results.push({
        id,
        source:    'kleinanzeigen',
        sourceName: 'Kleinanzeigen',
        title, price, km, year,
        fuel:  null, power: null,
        cat:   cat !== 'alle' ? cat : detectCat(title),
        link,
        img,
        scrapedAt: now,
      });
    }

    console.log(`[Kleinanzeigen] RSS: ${results.length} Inserate`);
  } catch (rssErr) {
    console.warn('[Kleinanzeigen] RSS fehlgeschlagen:', rssErr.message);
  }

  // ── 2. Fallback: HTML-Scraping ─────────────────────────────────
  if (results.length === 0) {
    try {
      await sleep(1500);
      const htmlUrl = `https://www.kleinanzeigen.de/s-autos/k0?distance=${radius}&zip=${plz}`;
      console.log(`[Kleinanzeigen] HTML: ${htmlUrl}`);
      const res = await fetchPage(htmlUrl);
      const $   = cheerio.load(res.data);

      $('article.aditem, [class*="aditem"]').each((_, el) => {
        const $el   = $(el);
        const title = $el.find('h2, .ellipsis, [class*="title"]').first().text().trim();
        if (!title) return;

        const priceText = $el.find('[class*="price"], .aditem-main--middle--price').text().trim();
        const price     = parsePrice(priceText);

        if (price && priceMin > 0    && price < priceMin) return;
        if (price && priceMax < 999999 && price > priceMax) return;

        const href = $el.find('a').first().attr('href') || '';
        const link = href.startsWith('http') ? href : `https://www.kleinanzeigen.de${href}`;
        const img  = $el.find('img').first().attr('src') || null;

        const id = makeId('kleinanzeigen', title, price);
        results.push({
          id,
          source:    'kleinanzeigen',
          sourceName: 'Kleinanzeigen',
          title, price, km: null, year: null,
          fuel: null, power: null,
          cat:  cat !== 'alle' ? cat : detectCat(title),
          link, img,
          scrapedAt: now,
        });
      });

      console.log(`[Kleinanzeigen] HTML: ${results.length} Inserate`);
    } catch (htmlErr) {
      console.error('[Kleinanzeigen] HTML fehlgeschlagen:', htmlErr.message);
    }
  }

  return results;
}

function extractFirstImg(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

function detectCat(title) {
  const t = title.toLowerCase();
  if (t.includes('suv') || t.includes('crossover'))               return 'suv';
  if (t.includes('kombi') || t.includes('touring'))               return 'kombi';
  if (t.includes('cabrio') || t.includes('roadster'))             return 'cabrio';
  if (t.includes('van') || t.includes('bus'))                     return 'van';
  if (t.includes('elektro') || t.includes('electric') || t.includes('tesla') || t.includes('zoe') || t.includes('e-auto')) return 'elektro';
  return 'limousine';
}

module.exports = scrape;
