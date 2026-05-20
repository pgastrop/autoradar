// ===== PLZ DATABASE (Auswahl DE) =====
const PLZ_DB = {
  "68163": "Mannheim", "68159": "Mannheim", "68161": "Mannheim", "68165": "Mannheim",
  "69115": "Heidelberg", "69120": "Heidelberg", "69121": "Heidelberg",
  "70173": "Stuttgart", "70174": "Stuttgart", "70176": "Stuttgart",
  "76131": "Karlsruhe", "76133": "Karlsruhe", "76135": "Karlsruhe",
  "60311": "Frankfurt", "60313": "Frankfurt", "60316": "Frankfurt",
  "80331": "München", "80333": "München", "80335": "München",
  "10115": "Berlin", "10117": "Berlin", "10119": "Berlin",
  "20095": "Hamburg", "20097": "Hamburg", "20099": "Hamburg",
  "50667": "Köln", "50668": "Köln", "50670": "Köln",
  "40210": "Düsseldorf", "40211": "Düsseldorf", "40212": "Düsseldorf",
  "90402": "Nürnberg", "90403": "Nürnberg", "90408": "Nürnberg",
  "01067": "Dresden", "01069": "Dresden", "01097": "Dresden",
  "04103": "Leipzig", "04105": "Leipzig", "04107": "Leipzig",
  "28195": "Bremen", "28197": "Bremen", "28199": "Bremen",
  "30159": "Hannover", "30161": "Hannover", "30163": "Hannover",
};

// ===== DEMO LISTINGS =====
const DEMO_CARS = [
  {
    id: 1, title: "VW Golf 8 1.5 TSI Life",
    year: 2023, km: 12400, price: 24900,
    dist: 8, src: "mobile.de", cat: "kleinwagen",
    age: "vor 2 Std.", fuel: "Benzin", power: "130 PS",
    color: "Weiß", doors: 5, transmission: "Automatik",
    url: "https://www.mobile.de",
    img: "🚗",
    description: "Gepflegtes Fahrzeug, 1 Vorbesitzer, Scheckheft lückenlos, inkl. Winterräder"
  },
  {
    id: 2, title: "BMW 320d Touring xDrive",
    year: 2022, km: 28500, price: 31500,
    dist: 15, src: "AutoScout24", cat: "kombi",
    age: "vor 4 Std.", fuel: "Diesel", power: "190 PS",
    color: "Schwarz Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.autoscout24.de",
    img: "🚗",
    description: "BMW Professional Navigation, Sitzheizung, Panoramadach, wie neu"
  },
  {
    id: 3, title: "Mercedes-Benz A 200 AMG Line",
    year: 2024, km: 5200, price: 28700,
    dist: 22, src: "AutoHero", cat: "limousine",
    age: "vor 6 Std.", fuel: "Benzin", power: "163 PS",
    color: "Polar White", doors: 4, transmission: "Automatik",
    url: "https://www.autohero.com",
    img: "🏎",
    description: "Neuwagen-ähnlicher Zustand, LED-Scheinwerfer, MBUX Navi, Parkassistent"
  },
  {
    id: 4, title: "Toyota RAV4 2.5 Hybrid",
    year: 2023, km: 18000, price: 39900,
    dist: 31, src: "mobile.de", cat: "suv",
    age: "vor 1 Tag", fuel: "Hybrid", power: "218 PS",
    color: "Grau Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.mobile.de",
    img: "🛻",
    description: "Vollhybrid, kein Stecker nötig, sehr sparsam, Allradantrieb"
  },
  {
    id: 5, title: "Skoda Octavia 2.0 TDI Style",
    year: 2022, km: 44000, price: 19800,
    dist: 12, src: "Kleinanzeigen", cat: "kombi",
    age: "vor 1 Tag", fuel: "Diesel", power: "150 PS",
    color: "Blau Metallic", doors: 5, transmission: "Schaltgetriebe",
    url: "https://www.kleinanzeigen.de",
    img: "🚙",
    description: "Sehr sparsam, 8-fach bereift, Anhängerkupplung, TÜV neu"
  },
  {
    id: 6, title: "Tesla Model 3 Long Range",
    year: 2023, km: 22000, price: 34500,
    dist: 41, src: "AutoScout24", cat: "elektro",
    age: "vor 2 Tagen", fuel: "Elektro", power: "351 PS",
    color: "Midnight Silver", doors: 4, transmission: "Automatik",
    url: "https://www.autoscout24.de",
    img: "⚡",
    description: "550 km Reichweite WLTP, Autopilot, Over-the-Air Updates, 8 Jahre Garantie Akku"
  },
  {
    id: 7, title: "Ford Puma ST-Line X 1.0 EcoBoost",
    year: 2023, km: 9000, price: 22500,
    dist: 19, src: "pkw.de", cat: "suv",
    age: "vor 3 Std.", fuel: "Benzin", power: "125 PS",
    color: "Frozen White", doors: 5, transmission: "Automatik",
    url: "https://www.pkw.de",
    img: "🚗",
    description: "Mild-Hybrid, großer MegaBox Kofferraum, B&O Soundsystem, Winterpaket"
  },
  {
    id: 8, title: "Audi A3 Sportback 35 TFSI",
    year: 2022, km: 31000, price: 26900,
    dist: 27, src: "AutoHero", cat: "limousine",
    age: "vor 5 Std.", fuel: "Benzin", power: "150 PS",
    color: "Navi Blau Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.autohero.com",
    img: "🏎",
    description: "Virtual Cockpit Plus, MMI Plus, LED-Scheinwerfer, Sitzheizung vorne"
  },
  {
    id: 9, title: "Renault Zoe Intens R135",
    year: 2023, km: 14500, price: 16900,
    dist: 6, src: "Kleinanzeigen", cat: "elektro",
    age: "vor 30 Min.", fuel: "Elektro", power: "135 PS",
    color: "Zinnoberrot Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.kleinanzeigen.de",
    img: "⚡",
    description: "395 km Reichweite, Batterie inkl., schnell ladbar CCS, perfekter Stadtflitzer"
  },
  {
    id: 10, title: "Seat Ibiza FR 1.0 TSI",
    year: 2023, km: 8000, price: 14900,
    dist: 35, src: "mobile.de", cat: "kleinwagen",
    age: "vor 1 Std.", fuel: "Benzin", power: "115 PS",
    color: "Mystery Blue", doors: 5, transmission: "Schaltgetriebe",
    url: "https://www.mobile.de",
    img: "🚗",
    description: "Junges Fahrzeug, sportliches FR-Paket, Digital Cockpit, Full LED"
  },
  {
    id: 11, title: "Opel Zafira Life 2.0 CDTI",
    year: 2021, km: 55000, price: 29500,
    dist: 44, src: "AutoScout24", cat: "van",
    age: "vor 8 Std.", fuel: "Diesel", power: "177 PS",
    color: "Schwarz Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.autoscout24.de",
    img: "🚐",
    description: "8-Sitzer, Business Innovation Paket, Kamera, ACC"
  },
  {
    id: 12, title: "BMW Z4 sDrive20i",
    year: 2022, km: 19000, price: 42500,
    dist: 38, src: "heycar", cat: "cabrio",
    age: "vor 3 Tagen", fuel: "Benzin", power: "197 PS",
    color: "San Francisco Rot Metallic", doors: 2, transmission: "Automatik",
    url: "https://www.heycar.de",
    img: "🏖",
    description: "Softtop, M-Sportpaket, Harman/Kardon, LED, Kamera, wie neu"
  },
];
