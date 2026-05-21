
// ===== QUELLEN-FARBEN & LOGOS =====
const SOURCE_CONFIG = {
  'autoscout':     { name: 'AutoScout24',   color: '#FF6B00', bg: 'rgba(255,107,0,0.12)',  icon: '🔶' },
  'mobile':        { name: 'mobile.de',     color: '#005EA8', bg: 'rgba(0,94,168,0.12)',   icon: '🔵' },
  'kleinanzeigen': { name: 'Kleinanzeigen', color: '#C4001A', bg: 'rgba(196,0,26,0.12)',   icon: '🔴' },
  'autohero':      { name: 'AutoHero',      color: '#00A94F', bg: 'rgba(0,169,79,0.12)',   icon: '🟢' },
  'heycar':        { name: 'heycar',        color: '#6B2D8B', bg: 'rgba(107,45,139,0.12)', icon: '🟣' },
  'pkw':           { name: 'pkw.de',        color: '#E4002B', bg: 'rgba(228,0,43,0.12)',   icon: '🔴' },
  'autouncle':     { name: 'AutoUncle',     color: '#1A73E8', bg: 'rgba(26,115,232,0.12)', icon: '🔵' },
  'instamotion':   { name: 'Instamotion',   color: '#FF4081', bg: 'rgba(255,64,129,0.12)', icon: '🟠' },
  // Demo-Daten Fallback
  'AutoScout24':   { name: 'AutoScout24',   color: '#FF6B00', bg: 'rgba(255,107,0,0.12)',  icon: '🔶' },
  'mobile.de':     { name: 'mobile.de',     color: '#005EA8', bg: 'rgba(0,94,168,0.12)',   icon: '🔵' },
  'Kleinanzeigen': { name: 'Kleinanzeigen', color: '#C4001A', bg: 'rgba(196,0,26,0.12)',   icon: '🔴' },
  'AutoHero':      { name: 'AutoHero',      color: '#00A94F', bg: 'rgba(0,169,79,0.12)',   icon: '🟢' },
  'heycar':        { name: 'heycar',        color: '#6B2D8B', bg: 'rgba(107,45,139,0.12)', icon: '🟣' },
  'pkw.de':        { name: 'pkw.de',        color: '#E4002B', bg: 'rgba(228,0,43,0.12)',   icon: '🔴' },
};

function getSource(car) {
  const key = car.source || car.src || '';
  return SOURCE_CONFIG[key] || { name: key || 'Unbekannt', color: '#888', bg: 'rgba(136,136,136,0.12)', icon: '⚪' };
}

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
      const isAlle = btn.dataset.cat === 'alle';
      if (isAlle) {
        // "Alle" deselektiert alles andere
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      } else {
        // Einzelne Kategorie togglen
        btn.classList.toggle('active');
        // "Alle" deaktivieren wenn spezifische Kategorie gewählt
        const alleBtn = document.querySelector('.cat-btn[data-cat="alle"]');
        const anyActive = [...document.querySelectorAll('.cat-btn:not([data-cat="alle"])')].some(b => b.classList.contains('active'));
        if (anyActive) {
          alleBtn.classList.remove('active');
        } else {
          // Wenn nichts mehr aktiv → "Alle" aktivieren
          alleBtn.classList.add('active');
        }
      }
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
    cat: getSelectedCats(),
    priceMin: parseInt(document.getElementById('price-min').value) || 0,
    priceMax: parseInt(document.getElementById('price-max').value) || 999999,
    yearFrom: document.getElementById('year-from').value,
    yearTo: document.getElementById('year-to').value,
    kmMin: parseInt(document.getElementById('km-min').value) || 0,
    kmMax: parseInt(document.getElementById('km-max').value) || 999999,
    sources: [...document.querySelectorAll('.source-btn.active')].map(s => s.dataset.src),
    brands: getSelectedBrandsQuery(),
  };

  state.lastSearch = filters;

  // Sofort Demo-Daten zeigen
  const demoResults = filterCars(filters);
  state.results = demoResults;
  renderResults(demoResults, filters);
  updateMonitor(demoResults);
  navigateTo('results');
  showToast(`⏳ Suche läuft auf ${filters.city || filters.plz}…`);

  // Scrape starten, dann nach 15 Sek. Ergebnisse abholen
  console.log('[AutoRadar] Sende Scrape-Request an:', window.RAILWAY_URL || 'lokal');
  triggerScrape({
    plz: filters.plz, radius: filters.radius,
    cat: filters.cat, priceMin: filters.priceMin, priceMax: filters.priceMax,
    brands: getSelectedBrandsQuery(),
  }).then(async () => {
    // 15 Sekunden warten bis Scraper fertig ist
    showToast(`🔍 Scraper läuft… Ergebnisse in ~15 Sek.`);
    await new Promise(r => setTimeout(r, 15000));

    // Ergebnisse vom Server holen
    const liveData = await fetchListings({
      cat:      filters.cat,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      yearFrom: filters.yearFrom,
      yearTo:   filters.yearTo,
      kmMax:    filters.kmMax < 999999 ? filters.kmMax : null,
      sources:  filters.sources,
      brands:   filters.brands,
    });

    if (liveData && liveData.length > 0) {
      state.results = liveData;
      document.getElementById('search-btn-text').textContent = 'Jetzt suchen';
      document.getElementById('search-spinner').classList.add('hidden');
      btn.disabled = false;
      renderResults(liveData, filters);
      updateMonitor(liveData);
      showToast(`✅ ${liveData.length} echte Inserate von ${filters.city || filters.plz}!`);
      document.getElementById('notif-dot').classList.remove('hidden');
    } else {
      showToast(`📦 Demo-Daten · Server hat ${demoResults.length} Treffer`);
    }
  }).catch(() => {
    showToast(`📦 ${demoResults.length} Demo-Fahrzeuge`);
  });

  document.getElementById('search-btn-text').textContent = 'Jetzt suchen';
  document.getElementById('search-spinner').classList.add('hidden');
  btn.disabled = false;

  startMonitor();
}

function filterCars(f) {
  let results = DEMO_CARS.filter(car => {
    // Mehrere Kategorien: "suv,limousine" oder "alle"
    if (f.cat && f.cat !== 'alle') {
      const cats = f.cat.split(',');
      if (!cats.includes(car.cat)) return false;
    }
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
  const src = getSource(car);
  return `
    <div class="car-card" data-id="${car.id}" data-url="${url}" onclick="openCarUrl('${url}')" style="cursor:pointer">
      
      <!-- Quellen-Banner oben – sofort sichtbar -->
      <div style="
        display:flex; align-items:center; justify-content:space-between;
        padding:7px 12px;
        background:${src.bg};
        border-bottom:1px solid ${src.color}44;
        border-radius:var(--radius-lg) var(--radius-lg) 0 0;
      ">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:14px">${src.icon}</span>
          <span style="font-size:12px;font-weight:700;color:${src.color};letter-spacing:0.3px">${src.name}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:11px;color:var(--text-tertiary)">${car.age || ''}</span>
          <span style="font-size:11px;color:${src.color};font-weight:600">↗ öffnen</span>
        </div>
      </div>

      <div class="car-card-img" style="border-radius:0">
        <div class="placeholder-icon">${car.img || '🚗'}</div>
      </div>

      <div class="car-card-body">
        <div class="car-card-title">${car.title}</div>
        <div class="car-card-meta">${car.year || '—'} · ${car.km ? car.km.toLocaleString('de-DE') + ' km' : '—'} · ${car.fuel || '—'} · ${car.power || '—'}</div>
        <div class="car-card-footer">
          <div class="car-card-price">
            ${car.price ? '€ ' + car.price.toLocaleString('de-DE') : 'Preis auf Anfrage'}
          </div>
          <div class="car-card-right">
            <span class="dist-tag">📍 ${car.dist || '—'} km</span>
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
    const url = car.url || car.link || '#';
    const price = car.price ? '€ ' + car.price.toLocaleString('de-DE') : 'Preis auf Anfrage';
    const dist = car.dist ? ' · 📍 ' + car.dist + ' km' : '';
    const src = getSource(car);
    const time = car.age || (car.scrapedAt ? new Date(car.scrapedAt).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}) + ' Uhr' : '');
    return `
      <div onclick="openCarUrl('${url}')"
        style="
          display:flex; align-items:center; gap:12px;
          padding:12px; margin-bottom:6px;
          background:var(--bg-surface);
          border:1px solid var(--border);
          border-left:3px solid ${src.color};
          border-radius:var(--radius-md);
          cursor:pointer; transition:background 0.15s;
        "
        onmouseover="this.style.background='var(--bg-raised)'"
        onmouseout="this.style.background='var(--bg-surface)'">
        <!-- Quellen-Icon -->
        <div style="
          width:40px; height:40px; border-radius:8px; flex-shrink:0;
          background:${src.bg};
          display:flex; align-items:center; justify-content:center;
          font-size:20px;
        ">${src.icon}</div>
        <!-- Info -->
        <div style="flex:1;min-width:0">
          <div style="
            font-size:11px; font-weight:700; color:${src.color};
            letter-spacing:0.5px; margin-bottom:2px;
          ">${src.name}</div>
          <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${car.title}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${price}${dist}</div>
        </div>
        <!-- Zeit + Pfeil -->
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
          <div style="font-size:11px;color:var(--text-tertiary)">${time}</div>
          <div style="font-size:11px;color:${src.color};font-weight:700">↗</div>
        </div>
      </div>`;
  }).join('');
}

function startMonitor() {
  if (state.monitorInterval) clearInterval(state.monitorInterval);
  state.monitorInterval = setInterval(async () => {
    // Echte Daten vom Server holen
    const s = state.lastSearch || {};
    const liveListings = await fetchListings({
      cat:      s.cat,
      priceMin: s.priceMin,
      priceMax: s.priceMax,
      yearFrom: s.yearFrom,
      yearTo:   s.yearTo,
      sources:  s.sources,
      brands:   s.brands,
    });
    if (liveListings && liveListings.length > 0) {
      // Neue Inserate erkennen
      const newOnes = liveListings.filter(l => !state.results.find(r => r.id === l.id));
      if (newOnes.length > 0) {
        state.results = [...newOnes, ...state.results];
        showToast(`🆕 ${newOnes.length} neue Inserate!`);
        document.getElementById('notif-dot').classList.remove('hidden');
      }
      updateMonitor(liveListings);
    } else if (state.lastSearch) {
      updateMonitor(filterCars(state.lastSearch));
    }
    // Stats aktualisieren
    const stats = await fetchStats();
    if (stats) {
      document.getElementById('stat-today').textContent = stats.today || 0;
      document.getElementById('stat-week').textContent  = stats.total || 0;
      document.getElementById('stat-avg').textContent   = stats.avgPrice ? '€'+Math.round(stats.avgPrice/1000).toLocaleString('de-DE')+'k' : '—';
      document.getElementById('stat-low').textContent   = stats.minPrice ? '€'+Math.round(stats.minPrice/1000)+'k' : '—';
    }
  }, 60000);
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

// ===== MARKEN & MODELLE LOGIK =====

// State: { "BMW": ["3er","5er"], "VW": [] (=alle Modelle) }
state.selectedBrands = {};
let _currentBrandForModels = null;

function initBrandSearch() {
  const input    = document.getElementById('brand-search-input');
  const dropdown = document.getElementById('brand-dropdown');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { dropdown.style.display = 'none'; return; }

    const matches = BRANDS_SORTED.filter(b => b.toLowerCase().includes(q)).slice(0, 12);
    if (!matches.length) { dropdown.style.display = 'none'; return; }

    dropdown.innerHTML = matches.map(b => `
      <div onclick="selectBrand('${b}')" style="
        padding:10px 14px;font-size:14px;cursor:pointer;
        border-bottom:1px solid var(--border);
        transition:background 0.1s;
      " onmouseover="this.style.background='var(--bg-raised)'"
         onmouseout="this.style.background=''">
        ${b}
        <span style="font-size:11px;color:var(--text-tertiary);margin-left:6px">
          ${BRANDS_DB[b]?.length || 0} Modelle
        </span>
      </div>`).join('');
    dropdown.style.display = 'block';
  });

  // Dropdown schließen bei Klick außerhalb
  document.addEventListener('click', e => {
    if (!e.target.closest('#brand-search-input') && !e.target.closest('#brand-dropdown')) {
      dropdown.style.display = 'none';
    }
  });
}

function selectBrand(brand) {
  const dropdown = document.getElementById('brand-dropdown');
  const input    = document.getElementById('brand-search-input');
  dropdown.style.display = 'none';
  input.value = '';
  _currentBrandForModels = brand;

  // Modell-Panel anzeigen
  const models = BRANDS_DB[brand] || [];
  const panel  = document.getElementById('model-panel');
  const tags   = document.getElementById('model-tags');

  tags.innerHTML = `
    <div onclick="toggleAllModels('${brand}')" style="
      padding:5px 12px;border-radius:99px;font-size:12px;cursor:pointer;
      background:var(--accent-dim);color:var(--accent);
      border:1px solid var(--border-accent);font-weight:600;margin-bottom:4px;
    ">Alle Modelle</div>
    ${models.map(m => `
      <div class="model-tag" data-model="${m}" onclick="toggleModel(this,'${brand}','${m}')" style="
        padding:5px 12px;border-radius:99px;font-size:12px;cursor:pointer;
        background:var(--bg-surface);color:var(--text-secondary);
        border:1px solid var(--border);transition:all 0.15s;
      ">${m}</div>`).join('')}`;

  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleModel(el, brand, model) {
  el.classList.toggle('active');
  if (el.classList.contains('active')) {
    el.style.background = 'var(--accent-dim)';
    el.style.color = 'var(--accent)';
    el.style.borderColor = 'var(--border-accent)';
  } else {
    el.style.background = 'var(--bg-surface)';
    el.style.color = 'var(--text-secondary)';
    el.style.borderColor = 'var(--border)';
  }
}

function toggleAllModels(brand) {
  // Alle deselektieren
  document.querySelectorAll('.model-tag.active').forEach(el => {
    el.classList.remove('active');
    el.style.background = 'var(--bg-surface)';
    el.style.color = 'var(--text-secondary)';
    el.style.borderColor = 'var(--border)';
  });
}

function confirmModels() {
  const brand = _currentBrandForModels;
  if (!brand) return;

  const selectedModels = [...document.querySelectorAll('.model-tag.active')]
    .map(el => el.dataset.model);

  // Marke mit Modellen speichern (leeres Array = alle Modelle)
  state.selectedBrands[brand] = selectedModels;

  // Panel ausblenden
  document.getElementById('model-panel').style.display = 'none';
  _currentBrandForModels = null;

  renderSelectedBrands();
}

function removeBrand(brand) {
  delete state.selectedBrands[brand];
  renderSelectedBrands();
}

function renderSelectedBrands() {
  const container = document.getElementById('selected-brands-list');
  const brands    = Object.keys(state.selectedBrands);

  if (!brands.length) { container.innerHTML = ''; return; }

  container.innerHTML = brands.map(brand => {
    const models  = state.selectedBrands[brand];
    const modelTx = models.length ? models.join(', ') : 'Alle Modelle';
    return `
      <div style="
        display:flex;align-items:center;justify-content:space-between;
        padding:10px 12px;margin-bottom:6px;
        background:var(--bg-surface);border:1px solid var(--border-accent);
        border-radius:var(--radius-md);border-left:3px solid var(--accent);
      ">
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--accent)">${brand}</div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${modelTx}</div>
        </div>
        <button onclick="removeBrand('${brand}')" style="
          width:28px;height:28px;border-radius:50%;font-size:16px;
          background:var(--bg-raised);color:var(--text-secondary);
          display:flex;align-items:center;justify-content:center;
        ">×</button>
      </div>`;
  }).join('');
}

function getSelectedCats() {
  const active = [...document.querySelectorAll('.cat-btn.active')].map(b => b.dataset.cat);
  if (!active.length || active.includes('alle')) return 'alle';
  return active.join(','); // z.B. "suv,limousine"
}

function getSelectedBrandsQuery() {
  const brands = Object.keys(state.selectedBrands);
  if (!brands.length) return null;
  // Format: "BMW:3er,5er|VW:|Audi:A4"
  return brands.map(b => {
    const models = state.selectedBrands[b];
    return `${b}:${models.join(',')}`;
  }).join('|');
}

// Init beim Laden
document.addEventListener('DOMContentLoaded', () => {
  initBrandSearch();
});
