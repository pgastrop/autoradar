const express = require('express');
const cors = require('cors');
const store = require('./store');
const { runAllScrapers } = require('./orchestrator');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/listings', (req, res) => {
  try {
    let list = store.getAll();
    const { cat, priceMin, priceMax, yearFrom, yearTo, kmMax, sources, limit, since } = req.query;
    if (cat && cat !== 'alle') list = list.filter(l => l.cat === cat);
    if (priceMin) list = list.filter(l => l.price >= +priceMin);
    if (priceMax) list = list.filter(l => l.price <= +priceMax);
    if (yearFrom) list = list.filter(l => l.year >= +yearFrom);
    if (yearTo)   list = list.filter(l => l.year <= +yearTo);
    if (kmMax)    list = list.filter(l => l.km <= +kmMax);
    if (sources)  list = list.filter(l => sources.split(',').includes(l.source));
    if (since)    list = list.filter(l => new Date(l.scrapedAt) > new Date(since));
    list = list.slice(0, +(limit) || 60);
    res.json({ ok: true, count: list.length, listings: list });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/listings/new', (_req, res) => {
  const cut = new Date(Date.now() - 30 * 60 * 1000);
  const fresh = store.getAll().filter(l => new Date(l.scrapedAt) > cut);
  res.json({ ok: true, count: fresh.length, listings: fresh });
});

app.get('/api/stats', (_req, res) => {
  const all = store.getAll();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const prices = all.map(l => l.price).filter(Boolean);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const bySource = {};
  all.forEach(l => { bySource[l.source] = (bySource[l.source] || 0) + 1; });
  res.json({
    ok: true,
    total: all.length,
    today: all.filter(l => new Date(l.scrapedAt) >= today).length,
    avgPrice: avg,
    minPrice: prices.length ? Math.min(...prices) : 0,
    bySource,
    lastRun: store.getLastRun(),
  });
});

app.post('/api/scrape', async (req, res) => {
  const { plz, radius = 50, cat = 'alle', priceMin = 0, priceMax = 999999 } = req.body;
  if (!plz) return res.status(400).json({ ok: false, error: 'PLZ fehlt' });
  store.setLastSearch({ plz, radius, cat, priceMin, priceMax });
  try {
    const added = await runAllScrapers({ plz, radius, cat, priceMin, priceMax });
    const listings = store.getAll().slice(0, 60);
    res.json({ ok: true, added, count: listings.length, listings });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, uptime: Math.round(process.uptime()), listings: store.count() })
);

module.exports = app;
