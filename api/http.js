/**
 * scraper/http.js
 * Gemeinsamer HTTP-Client mit rotierenden User-Agents,
 * Retry-Logik und Zufalls-Delays (gegen Rate-Limiting).
 */
const axios = require('axios');

// Bekannte Desktop-Browser User-Agents
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:126.0) Gecko/20100101 Firefox/126.0',
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Holt eine URL mit zufälligem Delay und Retry.
 * @param {string} url
 * @param {object} options – axios-Optionen
 * @param {number} retries – Wiederholungsversuche bei Fehler
 */
async function fetchPage(url, options = {}, retries = 3) {
  // Zufälliger Delay zwischen 1 und 3 Sekunden (höfliches Scraping)
  await sleep(1000 + Math.random() * 2000);

  const config = {
    url,
    method: 'GET',
    timeout: 15000,
    headers: {
      'User-Agent': randomUA(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'de-DE,de;q=0.9,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache',
      ...options.headers,
    },
    ...options,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await axios(config);
      return res;
    } catch (err) {
      const status = err.response?.status;
      console.warn(`[HTTP] Versuch ${attempt}/${retries} fehlgeschlagen: ${url} → ${status || err.code}`);

      if (attempt === retries) throw err;

      // Bei 429 (Too Many Requests) länger warten
      const delay = status === 429 ? 10000 : 3000 * attempt;
      await sleep(delay);
    }
  }
}

/**
 * Normiert einen Preis-String zu einer Zahl.
 * "24.900 €" → 24900
 */
function parsePrice(str) {
  if (!str) return null;
  const n = parseInt(str.replace(/[^\d]/g, ''));
  return isNaN(n) ? null : n;
}

/**
 * Normiert km-Angabe zu Zahl.
 * "28.500 km" → 28500
 */
function parseKm(str) {
  if (!str) return null;
  const n = parseInt(str.replace(/[^\d]/g, ''));
  return isNaN(n) ? null : n;
}

/**
 * Extrahiert Jahreszahl aus String.
 * "EZ 04/2022" → 2022
 */
function parseYear(str) {
  if (!str) return null;
  const match = str.match(/20\d{2}|19\d{2}/);
  return match ? parseInt(match[0]) : null;
}

/**
 * Generiert eine stabile ID aus Titel + Preis + Quelle.
 */
function makeId(source, title, price) {
  const raw = `${source}::${title}::${price}`.toLowerCase().replace(/\s+/g, '-');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return `${source}-${Math.abs(hash).toString(36)}`;
}

module.exports = { fetchPage, parsePrice, parseKm, parseYear, makeId, sleep };
