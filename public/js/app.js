// ===== STATE =====
const state = {
  currentPage: 'search',
  results: [],
  savedCars: JSON.parse(localStorage.getItem('ar_saved') || '[]'),
  savedSearches: JSON.parse(localStorage.getItem('ar_searches') || '[]'),
  lastSearch: null,
  monitorInterval: null,
  monitorActive: false,
  priceHistory: generatePriceHistory(),
};

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  // Splash
  setTimeout(() => {
    document.getElementById('splash').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      document.getElementById('app').classList.remove('hidden');
    }, 500);
  }, 2000);

  initNav();
  initSearch();
  initCategories();
  initSources();
  initPricePresets();
  updateSavedBadge();
  updateLastUpdate();
  renderSavedList();
  renderSavedSearches();
});

// ===== NAVIGATION =====
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(page) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
  document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add('active');
  document.getElementById(`page-${page}`).classList.add('active');
  state.currentPage = page;
}

// ===== SEARCH =====
function initSearch() {
  const plzInput = document.getElementById('input-plz');
  const radiusSlider = document.getElementById('radius-slider');

  plzInput.addEventListener('input', () => {
    const plz = plzInput.value.trim();
    const city = lookupPLZ(plz) || (plz.length === 5 ? 'PLZ ' + plz : '');
    document.getElementById('plz-city').textContent = city;
  });

  radiusSlider.addEventListener('input', () => {
    document.getElementById('radius-val').textContent = radiusSlider.value + ' km';
  });

  document.getElementById('btn-search').addEventListener('click', doSearch);
  document.getElementById('btn-save-search').addEventListener('click', saveCurrentSearch);
  document.getElementById('sort-select').addEventListener('change', e => sortAndRender(e.target.value));
}

function initCategories() {
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function initSources() {
  document.querySelectorAll('.source-btn').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('active'));
  });
}

function initPricePresets() {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('price-min').value = btn.dataset.min > 0 ? btn.dataset.min : '';
      document.getElementById('price-max').value = btn.dataset.max < 999999 ? btn.dataset.max : '';
    });
  });
}

// ===== DO SEARCH =====
function doSearch() {
  const plz = document.getElementById('input-plz').value.trim();
  if (!plz || plz.length !== 5) {
    showToast('⚠️ Bitte gültige 5-stellige PLZ eingeben');
    return;
  }

  const btn = document.getElementById('btn-search');
  document.getElementById('search-btn-text').textContent = 'Suche läuft…';
  document.getElementById('search-spinner').classList.remove('hidden');
  btn.disabled = true;

  const filters = {
    plz,
    city: lookupPLZ(plz) || plz,
    radius: parseInt(document.getElementById('radius-slider').value),
    cat: document.querySelector('.cat-btn.active')?.dataset.cat || 'alle',
    priceMin: parseInt(document.getElementById('price-min').value) || 0,
    priceMax: parseInt(document.getElementById('price-max').value) || 999999,
    yearFrom: document.getElementById('year-from').value,
    yearTo: document.getElementById('year-to').value,
    kmMin: parseInt(document.getElementById('km-min').value) || 0,
    kmMax: parseInt(document.getElementById('km-max').value) || 999999,
    sources: [...document.querySelectorAll('.source-btn.active')].map(s => s.dataset.src),
  };

  state.lastSearch = filters;

  // Sofort Demo-Daten zeigen, parallel echten Scrape versuchen
  const demoResults = filterCars(filters);
  state.results = demoResults;
  document.getElementById('search-btn-text').textContent = 'Jetzt suchen';
  document.getElementById('search-spinner').classList.add('hidden');
  btn.disabled = false;
  renderResults(demoResults, filters);
  updateMonitor(demoResults);
  navigateTo('results');
  showToast(`📦 ${demoResults.length} Demo-Fahrzeuge · Suche läuft…`);

  // Echten Scrape im Hintergrund versuchen
  triggerScrape({ plz: filters.plz, radius: filters.radius,
    cat: filters.cat, priceMin: filters.priceMin, priceMax: filters.priceMax })
    .then(data => {
      if (data && data.listings && data.listings.length > 0) {
        state.results = data.listings;
        renderResults(data.listings, filters);
        updateMonitor(data.listings);
        showToast(`✓ ${data.listings.length} echte Inserate gefunden!`);
        document.getElementById('notif-dot').classList.remove('hidden');
      }
    })
    .catch(() => {});

  startMonitor();
}

function filterCars(f) {
  let results = DEMO_CARS.filter(car => {
    if (f.cat !== 'alle' && car.cat !== f.cat) return false;
    if (f.priceMin > 0 && car.price < f.priceMin) return false;
    if (f.priceMax < 999999 && car.price > f.priceMax) return false;
    if (f.yearFrom && car.year < parseInt(f.yearFrom)) return false;
    if (f.yearTo && car.year > parseInt(f.yearTo)) return false;
    if (f.kmMax < 999999 && car.km > f.kmMax) return false;
    return true;
  });
  // Immer mindestens 3 Ergebnisse zeigen (Demo-Modus)
  if (results.length === 0) results = DEMO_CARS.slice(0, 6);
  return results;
}

// ===== RENDER RESULTS =====
function renderResults(cars, filters) {
  const list = document.getElementById('results-list');
  const countLabel = document.getElementById('results-count-label');
  const plzLabel = document.getElementById('results-plz-label');

  countLabel.textContent = `${cars.length} Fahrzeug${cars.length !== 1 ? 'e' : ''}`;
  if (filters) {
    plzLabel.textContent = `${filters.city || filters.plz} · ${filters.radius} km Umkreis`;
  }

  const badge = document.getElementById('results-badge');
  badge.textContent = cars.length;
  badge.classList.toggle('hidden', cars.length === 0);

  if (cars.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">Keine Fahrzeuge gefunden.<br>Passe die Filter an oder erweitere den Umkreis.</div>
      </div>`;
    return;
  }

  list.innerHTML = cars.map(car => buildCarCard(car)).join('');
  // Click-Handler bereits inline in buildCarCard via onclick
  // Kein zusätzlicher addEventListener nötig
}

function buildCarCard(car) {
  const saved = state.savedCars.includes(car.id);
  const url = car.url || car.link || '#';
  return `
    <div class="car-card" data-id="${car.id}" data-url="${url}">
      <div class="car-card-img" style="cursor:pointer" onclick="openCarUrl('${url}')">
        <div class="placeholder-icon">${car.img || '🚗'}</div>
        <span class="car-badge-new">${car.age || 'Neu'}</span>
        <span class="car-badge-src">${car.src || car.sourceName || ''}</span>
      </div>
      <div class="car-card-body">
        <div class="car-card-title" style="cursor:pointer" onclick="openCarUrl('${url}')">${car.title}</div>
        <div class="car-card-meta">${car.year || '—'} · ${car.km ? car.km.toLocaleString('de-DE') + ' km' : '—'} · ${car.fuel || '—'} · ${car.power || '—'}</div>
        <div class="car-card-footer">
          <div class="car-card-price" style="cursor:pointer" onclick="openCarUrl('${url}')">
            ${car.price ? '€ ' + car.price.toLocaleString('de-DE') : 'Preis auf Anfrage'}
          </div>
          <div class="car-card-right">
            <span class="dist-tag" style="cursor:pointer" onclick="openCarUrl('${url}')">📍 ${car.dist || '—'} km</span>
            <button class="btn-heart ${saved ? 'saved' : ''}" data-id="${car.id}" aria-label="Speichern"
              onclick="event.stopPropagation(); toggleHeartBtn(this, ${car.id})">
              ${saved ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function sortAndRender(by) {
  let sorted = [...state.results];
  if (by === 'price_asc') sorted.sort((a, b) => a.price - b.price);
  else if (by === 'price_desc') sorted.sort((a, b) => b.price - a.price);
  else if (by === 'dist_asc') sorted.sort((a, b) => a.dist - b.dist);
  else if (by === 'km_asc') sorted.sort((a, b) => a.km - b.km);
  renderResults(sorted, null);
}

// ===== CAR MODAL =====
function openCarModal(id) {
  const car = DEMO_CARS.find(c => c.id === id);
  if (!car) return;
  const saved = state.savedCars.includes(car.id);
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-car-img"><div style="font-size:64px">${car.img}</div></div>
    <div class="modal-title">${car.title}</div>
    <div class="modal-price">€ ${car.price.toLocaleString('de-DE')}</div>
    <div class="modal-details">
      <div class="detail-item"><div class="detail-label">Baujahr</div><div class="detail-val">${car.year}</div></div>
      <div class="detail-item"><div class="detail-label">Kilometerstand</div><div class="detail-val">${car.km.toLocaleString('de-DE')} km</div></div>
      <div class="detail-item"><div class="detail-label">Kraftstoff</div><div class="detail-val">${car.fuel}</div></div>
      <div class="detail-item"><div class="detail-label">Leistung</div><div class="detail-val">${car.power}</div></div>
      <div class="detail-item"><div class="detail-label">Getriebe</div><div class="detail-val">${car.transmission}</div></div>
      <div class="detail-item"><div class="detail-label">Farbe</div><div class="detail-val">${car.color}</div></div>
      <div class="detail-item"><div class="detail-label">Türen</div><div class="detail-val">${car.doors}</div></div>
      <div class="detail-item"><div class="detail-label">Entfernung</div><div class="detail-val">${car.dist} km</div></div>
    </div>
    <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:16px">${car.description}</p>
    <div class="modal-actions">
      <button class="btn-primary" onclick="openCarUrl('${car.url || car.link}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Inserat auf ${car.src || car.sourceName || 'Börse'} öffnen ↗
      </button>
      <button class="btn-secondary" onclick="toggleSaveModal(${car.id})" id="modal-save-btn">
        ${saved ? '♥ Gespeichert' : '♡ Merken'}
      </button>
    </div>
    <p style="font-size:11px;color:var(--text-tertiary);text-align:center;margin-top:10px">Quelle: ${car.src}</p>
  `;
  document.getElementById('car-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('car-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function openLink(url) {
  window.open(url, '_blank');
}

function openCarUrl(url) {
  if (!url || url === '#' || url === 'undefined') {
    showToast('⚠️ Kein Link verfügbar');
    return;
  }
  window.open(url, '_blank');
}

function toggleHeartBtn(btn, id) {
  toggleSave(id);
  const saved = state.savedCars.includes(id);
  btn.textContent = saved ? '♥' : '♡';
  btn.classList.toggle('saved', saved);
}

function toggleSaveModal(id) {
  toggleSave(id);
  const btn = document.getElementById('modal-save-btn');
  const saved = state.savedCars.includes(id);
  btn.textContent = saved ? '♥ Gespeichert' : '♡ Merken';
  showToast(saved ? '♥ Gespeichert' : 'Entfernt');
}

// ===== SAVE / MERKLISTE =====
function toggleSave(id) {
  const idx = state.savedCars.indexOf(id);
  if (idx > -1) {
    state.savedCars.splice(idx, 1);
    showToast('Aus Merkliste entfernt');
  } else {
    state.savedCars.push(id);
    showToast('♥ Zur Merkliste hinzugefügt');
  }
  localStorage.setItem('ar_saved', JSON.stringify(state.savedCars));
  updateSavedBadge();
  renderSavedList();
}

function updateSavedBadge() {
  const badge = document.getElementById('saved-badge');
  badge.textContent = state.savedCars.length;
  badge.classList.toggle('hidden', state.savedCars.length === 0);
}

function renderSavedList() {
  const list = document.getElementById('saved-list');
  if (state.savedCars.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔖</div>
        <div class="empty-text">Noch keine Fahrzeuge gespeichert.<br>Tippe beim Inserat auf ♥</div>
      </div>`;
    return;
  }
  const cars = DEMO_CARS.filter(c => state.savedCars.includes(c.id));
  list.innerHTML = cars.map(car => buildCarCard(car)).join('');
  // Click-Handler inline in buildCarCard
}

// ===== SAVED SEARCHES =====
function saveCurrentSearch() {
  if (!state.lastSearch) {
    showToast('Bitte zuerst eine Suche durchführen');
    return;
  }
  const s = state.lastSearch;
  const name = `${s.city || s.plz} · ${s.radius}km · ${s.cat}`;
  if (!state.savedSearches.find(x => x.name === name)) {
    state.savedSearches.unshift({ name, filters: s, date: new Date().toLocaleDateString('de-DE') });
    localStorage.setItem('ar_searches', JSON.stringify(state.savedSearches));
    renderSavedSearches();
    showToast('Suche gespeichert ✓');
  } else {
    showToast('Diese Suche ist bereits gespeichert');
  }
}

function renderSavedSearches() {
  const container = document.getElementById('saved-searches-list');
  if (state.savedSearches.length === 0) {
    container.innerHTML = `
      <div class="empty-state" id="no-saved-searches">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">Keine gespeicherten Suchen</div>
      </div>`;
    return;
  }
  container.innerHTML = state.savedSearches.map((s, i) => `
    <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:13px;font-weight:500">${s.name}</div>
        <div style="font-size:11px;color:var(--text-tertiary);margin-top:2px">${s.date}</div>
      </div>
      <button onclick="rerunSearch(${i})" style="font-size:12px;color:var(--accent);padding:6px 12px;background:var(--accent-dim);border-radius:var(--radius-sm)">Erneut suchen</button>
    </div>`).join('');
}

function rerunSearch(idx) {
  const s = state.savedSearches[idx];
  if (s) {
    document.getElementById('input-plz').value = s.filters.plz;
    document.getElementById('plz-city').textContent = s.filters.city || '';
    navigateTo('search');
    showToast('Filter wiederhergestellt');
  }
}

// ===== MONITOR =====
function updateMonitor(cars) {
  if (!cars.length) return;
  state.monitorActive = true;

  const today = Math.floor(cars.length * 0.55);
  const week = cars.length;
  const prices = cars.map(c => c.price);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const low = Math.min(...prices);

  document.getElementById('stat-today').textContent = today;
  document.getElementById('stat-week').textContent = week;
  document.getElementById('stat-avg').textContent = '€' + Math.round(avg / 1000) + 'k';
  document.getElementById('stat-low').textContent = '€' + Math.round(low / 1000) + 'k';

  renderActivity(cars);
  renderPriceChart();
}

function renderActivity(cars) {
  const feed = document.getElementById('activity-feed');
  const icons = [
    { cls: 'green', emoji: '🆕' },
    { cls: 'blue', emoji: '💰' },
    { cls: 'amber', emoji: '📍' },
  ];
  feed.innerHTML = cars.slice(0, 8).map((car, i) => {
    const ic = icons[i % 3];
    const url = car.url || car.link || '#';
    const price = car.price ? '€ ' + car.price.toLocaleString('de-DE') : 'Preis auf Anfrage';
    const src = car.src || car.sourceName || '';
    const dist = car.dist ? car.dist + ' km' : '';
    return `
      <div class="activity-item" onclick="openCarUrl('${url}')"
        style="cursor:pointer; transition:background 0.15s;"
        onmouseover="this.style.background='var(--bg-raised)'"
        onmouseout="this.style.background=''">
        <div class="activity-dot ${ic.cls}">${ic.emoji}</div>
        <div class="activity-info">
          <div class="activity-name">${car.title}</div>
          <div class="activity-meta">${src} · ${price}${dist ? ' · ' + dist : ''}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
          <div class="activity-time">${car.age || car.scrapedAt ? new Date(car.scrapedAt).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}) : ''}</div>
          <div style="font-size:10px;color:var(--accent)">↗ öffnen</div>
        </div>
      </div>`;
  }).join('');
}

function startMonitor() {
  if (state.monitorInterval) clearInterval(state.monitorInterval);
  const interval = parseInt(document.getElementById('refresh-interval').value) * 1000;
  state.monitorInterval = setInterval(() => {
    if (state.lastSearch) {
      const results = filterCars(state.lastSearch);
      updateMonitor(results);
    }
  }, interval);
}

// ===== PRICE CHART =====
function generatePriceHistory() {
  const base = 26000;
  return Array.from({ length: 7 }, (_, i) => ({
    label: getDayLabel(i),
    value: Math.round(base + (Math.random() - 0.5) * 4000),
  }));
}

function getDayLabel(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - (6 - daysAgo));
  return d.toLocaleDateString('de-DE', { weekday: 'short' });
}

let chartInstance = null;
function renderPriceChart() {
  const ctx = document.getElementById('price-chart');
  if (!ctx) return;
  if (chartInstance) chartInstance.destroy();
  const isDark = !document.body.classList.contains('light');
  const accent = isDark ? '#00ff88' : '#00aa55';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#55556a' : '#aaaacc';

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: state.priceHistory.map(d => d.label),
      datasets: [{
        label: 'Ø Preis',
        data: state.priceHistory.map(d => d.value),
        borderColor: accent,
        backgroundColor: isDark ? 'rgba(0,255,136,0.08)' : 'rgba(0,170,85,0.08)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: accent,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 10 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor, font: { size: 10 },
            callback: v => '€' + Math.round(v / 1000) + 'k'
          }
        }
      }
    }
  });
}

// ===== SETTINGS =====
function toggleThis(wrap) {
  wrap.querySelector('.toggle').classList.toggle('on');
}

function toggleDark(wrap) {
  wrap.querySelector('.toggle').classList.toggle('on');
  document.body.classList.toggle('light');
  if (chartInstance) {
    setTimeout(renderPriceChart, 100);
  }
}

function clearAllData() {
  if (confirm('Alle gespeicherten Daten löschen?')) {
    localStorage.clear();
    state.savedCars = [];
    state.savedSearches = [];
    state.results = [];
    renderSavedList();
    renderSavedSearches();
    updateSavedBadge();
    showToast('Alle Daten gelöscht');
  }
}

// ===== UTILS =====
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function updateLastUpdate() {
  const el = document.getElementById('last-update');
  if (el) el.textContent = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
