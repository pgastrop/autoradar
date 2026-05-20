const store = require('./store');
const autoscoutScraper = require('./autoscout');
const mobileScraper = require('./mobile');
const kleinanzeigenScraper = require('./kleinanzeigen');

async function runAllScrapers(params) {
  const { plz, radius, cat, priceMin, priceMax } = params;
  console.log(`[Orchestrator] PLZ ${plz}, ${radius}km, Kat: ${cat}`);

  const scrapers = [
    { name: 'AutoScout24',   fn: autoscoutScraper },
    { name: 'mobile.de',     fn: mobileScraper },
    { name: 'Kleinanzeigen', fn: kleinanzeigenScraper },
  ];

  let totalAdded = 0;
  const results = await Promise.allSettled(
    scrapers.map(s =>
      s.fn({ plz, radius, cat, priceMin, priceMax })
        .then(items => ({ name: s.name, items }))
        .catch(err => { console.error(`[${s.name}] Fehler:`, err.message); return { name: s.name, items: [] }; })
    )
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { name, items } = result.value;
      const added = store.addListings(items);
      console.log(`[${name}] ${items.length} gescrapt, ${added} neu`);
      totalAdded += added;
    }
  }
  return totalAdded;
}

module.exports = { runAllScrapers };
