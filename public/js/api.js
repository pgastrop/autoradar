// Railway-Server URL – wird nach dem Deploy eingetragen
// Solange leer: Demo-Modus
const RAILWAY_URL = 'https://gastrop.synology.me';
const API_BASE = RAILWAY_URL;
let serverAvailable = false;

async function checkServer() {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
    serverAvailable = res.ok;
  } catch { serverAvailable = false; }
  return serverAvailable;
}

async function triggerScrape(params) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    serverAvailable = true;
    return data;
  } catch {
    serverAvailable = false;
    return null; // Fallback auf Demo-Daten in app.js
  }
}

async function fetchListings(filters = {}) {
  const p = new URLSearchParams();
  if (filters.cat && filters.cat !== 'alle') p.set('cat', filters.cat);
  if (filters.priceMin > 0)      p.set('priceMin', filters.priceMin);
  if (filters.priceMax < 999999) p.set('priceMax', filters.priceMax);
  if (filters.yearFrom) p.set('yearFrom', filters.yearFrom);
  if (filters.yearTo)   p.set('yearTo',   filters.yearTo);
  if (filters.sources?.length) p.set('sources', filters.sources.join(','));
  try {
    const res = await fetch(`/api/listings?${p}`);
    const data = await res.json();
    return data.ok ? data.listings : null;
  } catch { return null; }
}

async function fetchNewListings() {
  try {
    const res = await fetch('/api/listings/new');
    const data = await res.json();
    return data.ok ? data.listings : [];
  } catch { return []; }
}

async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    return data.ok ? data : null;
  } catch { return null; }
}
