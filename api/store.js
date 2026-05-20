const MAX = 2000;
let _listings = [];
let _lastRun = null;
let _lastSearch = null;

function getAll() {
  return [..._listings].sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt));
}
function count() { return _listings.length; }
function getLastRun() { return _lastRun; }
function getLastSearch() { return _lastSearch; }
function setLastSearch(s) { _lastSearch = s; }

function addListings(items) {
  const seen = new Set(_listings.map(l => l.id));
  let added = 0;
  for (const item of items) {
    if (!seen.has(item.id)) { _listings.push(item); added++; }
  }
  if (_listings.length > MAX) {
    _listings.sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt));
    _listings = _listings.slice(0, MAX);
  }
  if (added > 0) _lastRun = new Date().toISOString();
  return added;
}

function clear() { _listings = []; }

module.exports = { getAll, addListings, count, getLastRun, setLastSearch, getLastSearch, clear };
