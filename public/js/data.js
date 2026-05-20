// ===== PLZ DATENBANK (Deutschland - erweitert) =====
const PLZ_DB = {
  // Mannheim
  "68159":"Mannheim","68161":"Mannheim","68163":"Mannheim","68165":"Mannheim",
  "68167":"Mannheim","68169":"Mannheim","68199":"Mannheim","68219":"Mannheim",
  "68229":"Mannheim","68239":"Mannheim","68259":"Mannheim","68305":"Mannheim",
  "68307":"Mannheim","68309":"Mannheim",
  // Heidelberg
  "69115":"Heidelberg","69117":"Heidelberg","69118":"Heidelberg","69120":"Heidelberg",
  "69121":"Heidelberg","69123":"Heidelberg","69124":"Heidelberg","69126":"Heidelberg",
  // Stuttgart
  "70173":"Stuttgart","70174":"Stuttgart","70176":"Stuttgart","70178":"Stuttgart",
  "70180":"Stuttgart","70182":"Stuttgart","70184":"Stuttgart","70186":"Stuttgart",
  "70188":"Stuttgart","70190":"Stuttgart","70192":"Stuttgart","70193":"Stuttgart",
  "70195":"Stuttgart","70197":"Stuttgart","70199":"Stuttgart","70327":"Stuttgart",
  "70329":"Stuttgart","70372":"Stuttgart","70374":"Stuttgart","70376":"Stuttgart",
  "70378":"Stuttgart","70435":"Stuttgart","70437":"Stuttgart","70439":"Stuttgart",
  "70469":"Stuttgart","70499":"Stuttgart","70563":"Stuttgart","70565":"Stuttgart",
  "70567":"Stuttgart","70569":"Stuttgart","70597":"Stuttgart","70599":"Stuttgart",
  "70619":"Stuttgart","70629":"Stuttgart",
  // Karlsruhe
  "76131":"Karlsruhe","76133":"Karlsruhe","76135":"Karlsruhe","76137":"Karlsruhe",
  "76139":"Karlsruhe","76149":"Karlsruhe","76185":"Karlsruhe","76187":"Karlsruhe",
  "76189":"Karlsruhe","76199":"Karlsruhe","76227":"Karlsruhe","76228":"Karlsruhe",
  "76229":"Karlsruhe",
  // Frankfurt
  "60306":"Frankfurt","60308":"Frankfurt","60310":"Frankfurt","60311":"Frankfurt",
  "60313":"Frankfurt","60314":"Frankfurt","60316":"Frankfurt","60318":"Frankfurt",
  "60320":"Frankfurt","60322":"Frankfurt","60323":"Frankfurt","60325":"Frankfurt",
  "60326":"Frankfurt","60327":"Frankfurt","60329":"Frankfurt","60385":"Frankfurt",
  "60386":"Frankfurt","60388":"Frankfurt","60389":"Frankfurt","60431":"Frankfurt",
  "60433":"Frankfurt","60435":"Frankfurt","60437":"Frankfurt","60438":"Frankfurt",
  "60439":"Frankfurt","60486":"Frankfurt","60487":"Frankfurt","60488":"Frankfurt",
  "60489":"Frankfurt","60528":"Frankfurt","60529":"Frankfurt","60549":"Frankfurt",
  "60594":"Frankfurt","60596":"Frankfurt","60598":"Frankfurt","60599":"Frankfurt",
  "65929":"Frankfurt","65931":"Frankfurt","65933":"Frankfurt","65934":"Frankfurt",
  "65936":"Frankfurt",
  // München
  "80331":"München","80333":"München","80335":"München","80336":"München",
  "80337":"München","80339":"München","80469":"München","80538":"München",
  "80539":"München","80634":"München","80636":"München","80637":"München",
  "80638":"München","80639":"München","80686":"München","80687":"München",
  "80689":"München","80796":"München","80797":"München","80798":"München",
  "80799":"München","80801":"München","80802":"München","80803":"München",
  "80804":"München","80805":"München","80807":"München","80809":"München",
  "80933":"München","80935":"München","80937":"München","80939":"München",
  "80992":"München","80993":"München","80995":"München","80997":"München",
  "80999":"München","81241":"München","81243":"München","81245":"München",
  "81247":"München","81249":"München","81369":"München","81371":"München",
  "81373":"München","81375":"München","81377":"München","81379":"München",
  "81475":"München","81477":"München","81479":"München","81539":"München",
  "81541":"München","81543":"München","81545":"München","81547":"München",
  "81549":"München","81667":"München","81669":"München","81671":"München",
  "81673":"München","81675":"München","81677":"München","81679":"München",
  "81735":"München","81737":"München","81739":"München","81825":"München",
  "81827":"München","81829":"München","81925":"München","81927":"München",
  "81929":"München",
  // Berlin
  "10115":"Berlin","10117":"Berlin","10119":"Berlin","10178":"Berlin",
  "10179":"Berlin","10243":"Berlin","10245":"Berlin","10247":"Berlin",
  "10249":"Berlin","10315":"Berlin","10317":"Berlin","10318":"Berlin",
  "10319":"Berlin","10365":"Berlin","10367":"Berlin","10369":"Berlin",
  "10405":"Berlin","10407":"Berlin","10409":"Berlin","10435":"Berlin",
  "10437":"Berlin","10439":"Berlin","10551":"Berlin","10553":"Berlin",
  "10555":"Berlin","10557":"Berlin","10559":"Berlin","10585":"Berlin",
  "10587":"Berlin","10589":"Berlin","10623":"Berlin","10625":"Berlin",
  "10627":"Berlin","10629":"Berlin","10707":"Berlin","10709":"Berlin",
  "10711":"Berlin","10713":"Berlin","10715":"Berlin","10717":"Berlin",
  "10719":"Berlin","10777":"Berlin","10779":"Berlin","10781":"Berlin",
  "10783":"Berlin","10785":"Berlin","10787":"Berlin","10789":"Berlin",
  "10823":"Berlin","10825":"Berlin","10827":"Berlin","10829":"Berlin",
  "10961":"Berlin","10963":"Berlin","10965":"Berlin","10967":"Berlin",
  "10969":"Berlin","10997":"Berlin","10999":"Berlin",
  // Hamburg
  "20095":"Hamburg","20097":"Hamburg","20099":"Hamburg","20144":"Hamburg",
  "20146":"Hamburg","20148":"Hamburg","20149":"Hamburg","20249":"Hamburg",
  "20251":"Hamburg","20253":"Hamburg","20255":"Hamburg","20257":"Hamburg",
  "20259":"Hamburg","20354":"Hamburg","20355":"Hamburg","20357":"Hamburg",
  "20359":"Hamburg","20457":"Hamburg","20459":"Hamburg","20535":"Hamburg",
  "20537":"Hamburg","20539":"Hamburg",
  // Köln
  "50667":"Köln","50668":"Köln","50670":"Köln","50672":"Köln",
  "50674":"Köln","50676":"Köln","50677":"Köln","50678":"Köln",
  "50679":"Köln","50733":"Köln","50735":"Köln","50737":"Köln",
  "50739":"Köln","50765":"Köln","50767":"Köln","50769":"Köln",
  "50823":"Köln","50825":"Köln","50827":"Köln","50829":"Köln",
  "50858":"Köln","50859":"Köln","50931":"Köln","50933":"Köln",
  "50935":"Köln","50937":"Köln","50939":"Köln","50968":"Köln",
  "50969":"Köln","50996":"Köln","50997":"Köln","50999":"Köln",
  "51061":"Köln","51063":"Köln","51065":"Köln","51067":"Köln",
  "51069":"Köln","51103":"Köln","51105":"Köln","51107":"Köln",
  "51109":"Köln","51143":"Köln","51145":"Köln","51147":"Köln",
  "51149":"Köln",
  // Düsseldorf
  "40210":"Düsseldorf","40211":"Düsseldorf","40212":"Düsseldorf","40213":"Düsseldorf",
  "40215":"Düsseldorf","40217":"Düsseldorf","40219":"Düsseldorf","40221":"Düsseldorf",
  "40223":"Düsseldorf","40225":"Düsseldorf","40227":"Düsseldorf","40229":"Düsseldorf",
  "40231":"Düsseldorf","40233":"Düsseldorf","40235":"Düsseldorf","40237":"Düsseldorf",
  "40239":"Düsseldorf","40468":"Düsseldorf","40470":"Düsseldorf","40472":"Düsseldorf",
  "40474":"Düsseldorf","40476":"Düsseldorf","40477":"Düsseldorf","40479":"Düsseldorf",
  "40489":"Düsseldorf","40545":"Düsseldorf","40547":"Düsseldorf","40549":"Düsseldorf",
  "40589":"Düsseldorf","40591":"Düsseldorf","40593":"Düsseldorf","40595":"Düsseldorf",
  "40597":"Düsseldorf","40599":"Düsseldorf","40625":"Düsseldorf","40627":"Düsseldorf",
  "40629":"Düsseldorf",
  // Nürnberg
  "90402":"Nürnberg","90403":"Nürnberg","90408":"Nürnberg","90409":"Nürnberg",
  "90411":"Nürnberg","90419":"Nürnberg","90425":"Nürnberg","90427":"Nürnberg",
  "90429":"Nürnberg","90431":"Nürnberg","90439":"Nürnberg","90441":"Nürnberg",
  "90443":"Nürnberg","90449":"Nürnberg","90451":"Nürnberg","90453":"Nürnberg",
  "90455":"Nürnberg","90457":"Nürnberg","90459":"Nürnberg","90461":"Nürnberg",
  "90469":"Nürnberg","90471":"Nürnberg","90473":"Nürnberg","90475":"Nürnberg",
  "90478":"Nürnberg","90480":"Nürnberg","90482":"Nürnberg","90489":"Nürnberg",
  "90491":"Nürnberg",
  // Leipzig
  "04103":"Leipzig","04105":"Leipzig","04107":"Leipzig","04109":"Leipzig",
  "04129":"Leipzig","04155":"Leipzig","04157":"Leipzig","04158":"Leipzig",
  "04159":"Leipzig","04177":"Leipzig","04178":"Leipzig","04179":"Leipzig",
  "04205":"Leipzig","04207":"Leipzig","04209":"Leipzig","04229":"Leipzig",
  "04249":"Leipzig","04275":"Leipzig","04277":"Leipzig","04279":"Leipzig",
  "04289":"Leipzig","04299":"Leipzig","04315":"Leipzig","04316":"Leipzig",
  "04317":"Leipzig","04318":"Leipzig","04319":"Leipzig","04328":"Leipzig",
  "04329":"Leipzig","04347":"Leipzig","04349":"Leipzig","04356":"Leipzig",
  "04357":"Leipzig",
  // Dresden
  "01067":"Dresden","01069":"Dresden","01097":"Dresden","01099":"Dresden",
  "01108":"Dresden","01109":"Dresden","01127":"Dresden","01129":"Dresden",
  "01139":"Dresden","01156":"Dresden","01157":"Dresden","01159":"Dresden",
  "01169":"Dresden","01187":"Dresden","01189":"Dresden","01217":"Dresden",
  "01219":"Dresden","01237":"Dresden","01239":"Dresden","01257":"Dresden",
  "01259":"Dresden","01277":"Dresden","01279":"Dresden","01307":"Dresden",
  "01309":"Dresden","01324":"Dresden","01326":"Dresden","01328":"Dresden",
  // Hannover
  "30159":"Hannover","30161":"Hannover","30163":"Hannover","30165":"Hannover",
  "30167":"Hannover","30169":"Hannover","30171":"Hannover","30173":"Hannover",
  "30175":"Hannover","30177":"Hannover","30179":"Hannover","30419":"Hannover",
  "30449":"Hannover","30451":"Hannover","30453":"Hannover","30455":"Hannover",
  "30457":"Hannover","30459":"Hannover","30519":"Hannover","30521":"Hannover",
  "30523":"Hannover","30525":"Hannover","30527":"Hannover","30539":"Hannover",
  "30559":"Hannover","30625":"Hannover","30627":"Hannover","30629":"Hannover",
  "30655":"Hannover","30657":"Hannover","30659":"Hannover","30669":"Hannover",
  // Bremen
  "28195":"Bremen","28197":"Bremen","28199":"Bremen","28201":"Bremen",
  "28203":"Bremen","28205":"Bremen","28207":"Bremen","28209":"Bremen",
  "28211":"Bremen","28213":"Bremen","28215":"Bremen","28217":"Bremen",
  "28219":"Bremen","28237":"Bremen","28239":"Bremen","28259":"Bremen",
  "28277":"Bremen","28279":"Bremen","28307":"Bremen","28309":"Bremen",
  "28325":"Bremen","28327":"Bremen","28329":"Bremen","28355":"Bremen",
  "28357":"Bremen","28359":"Bremen","28717":"Bremen","28719":"Bremen",
  "28755":"Bremen","28757":"Bremen","28759":"Bremen","28777":"Bremen",
  "28779":"Bremen",
  // Freiburg
  "79098":"Freiburg","79100":"Freiburg","79102":"Freiburg","79104":"Freiburg",
  "79106":"Freiburg","79108":"Freiburg","79110":"Freiburg","79111":"Freiburg",
  "79112":"Freiburg","79114":"Freiburg","79115":"Freiburg","79117":"Freiburg",
  // Dortmund
  "44135":"Dortmund","44137":"Dortmund","44139":"Dortmund","44141":"Dortmund",
  "44143":"Dortmund","44145":"Dortmund","44147":"Dortmund","44149":"Dortmund",
  "44225":"Dortmund","44227":"Dortmund","44229":"Dortmund","44263":"Dortmund",
  "44265":"Dortmund","44267":"Dortmund","44269":"Dortmund","44287":"Dortmund",
  "44289":"Dortmund","44309":"Dortmund","44319":"Dortmund","44328":"Dortmund",
  "44329":"Dortmund","44339":"Dortmund","44357":"Dortmund","44359":"Dortmund",
  "44369":"Dortmund","44379":"Dortmund","44388":"Dortmund",
  // Essen
  "45127":"Essen","45128":"Essen","45130":"Essen","45131":"Essen",
  "45133":"Essen","45134":"Essen","45136":"Essen","45138":"Essen",
  "45139":"Essen","45141":"Essen","45143":"Essen","45144":"Essen",
  "45145":"Essen","45147":"Essen","45149":"Essen","45219":"Essen",
  "45239":"Essen","45257":"Essen","45259":"Essen","45276":"Essen",
  "45277":"Essen","45279":"Essen","45289":"Essen","45307":"Essen",
  "45309":"Essen","45326":"Essen","45327":"Essen","45329":"Essen",
  "45355":"Essen","45356":"Essen","45357":"Essen","45359":"Essen",
  // Ludwigshafen (Nachbarstadt Mannheim)
  "67059":"Ludwigshafen","67061":"Ludwigshafen","67063":"Ludwigshafen",
  "67065":"Ludwigshafen","67067":"Ludwigshafen","67069":"Ludwigshafen",
  "67071":"Ludwigshafen","67227":"Frankenthal","67229":"Frankenthal",
  // Wiesbaden
  "65183":"Wiesbaden","65185":"Wiesbaden","65187":"Wiesbaden","65189":"Wiesbaden",
  "65191":"Wiesbaden","65193":"Wiesbaden","65195":"Wiesbaden","65197":"Wiesbaden",
  "65199":"Wiesbaden","65201":"Wiesbaden","65203":"Wiesbaden","65205":"Wiesbaden",
  "65207":"Wiesbaden","65232":"Wiesbaden","65388":"Schlangenbad",
  // Augsburg
  "86150":"Augsburg","86152":"Augsburg","86153":"Augsburg","86154":"Augsburg",
  "86156":"Augsburg","86157":"Augsburg","86159":"Augsburg","86161":"Augsburg",
  "86163":"Augsburg","86165":"Augsburg","86167":"Augsburg","86169":"Augsburg",
  "86179":"Augsburg","86199":"Augsburg",
};

// Fallback: Für unbekannte PLZ den Ort anhand Bereichs schätzen
function lookupPLZ(plz) {
  if (!plz || plz.length !== 5) return null;
  // Exakter Treffer
  if (PLZ_DB[plz]) return PLZ_DB[plz];
  // Bereichs-Fallback (erste 3 Stellen)
  const prefix3 = plz.substring(0, 3);
  const prefix2 = plz.substring(0, 2);
  for (const [key, val] of Object.entries(PLZ_DB)) {
    if (key.startsWith(prefix3)) return val + ' (Umgebung)';
  }
  for (const [key, val] of Object.entries(PLZ_DB)) {
    if (key.startsWith(prefix2)) return val + ' (Region)';
  }
  return 'Deutschland';
}

// ===== DEMO LISTINGS =====
const DEMO_CARS = [
  {
    id: 1, title: "VW Golf 8 1.5 TSI Life",
    year: 2023, km: 12400, price: 24900,
    dist: 8, src: "mobile.de", cat: "kleinwagen",
    age: "vor 2 Std.", fuel: "Benzin", power: "130 PS",
    color: "Weiß", doors: 5, transmission: "Automatik",
    url: "https://www.mobile.de", img: "🚗",
    description: "Gepflegtes Fahrzeug, 1 Vorbesitzer, Scheckheft lückenlos, inkl. Winterräder"
  },
  {
    id: 2, title: "BMW 320d Touring xDrive",
    year: 2022, km: 28500, price: 31500,
    dist: 15, src: "AutoScout24", cat: "kombi",
    age: "vor 4 Std.", fuel: "Diesel", power: "190 PS",
    color: "Schwarz Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.autoscout24.de", img: "🚗",
    description: "BMW Professional Navigation, Sitzheizung, Panoramadach, wie neu"
  },
  {
    id: 3, title: "Mercedes-Benz A 200 AMG Line",
    year: 2024, km: 5200, price: 28700,
    dist: 22, src: "AutoHero", cat: "limousine",
    age: "vor 6 Std.", fuel: "Benzin", power: "163 PS",
    color: "Polar White", doors: 4, transmission: "Automatik",
    url: "https://www.autohero.com", img: "🏎",
    description: "Neuwagen-ähnlicher Zustand, LED-Scheinwerfer, MBUX Navi, Parkassistent"
  },
  {
    id: 4, title: "Toyota RAV4 2.5 Hybrid",
    year: 2023, km: 18000, price: 39900,
    dist: 31, src: "mobile.de", cat: "suv",
    age: "vor 1 Tag", fuel: "Hybrid", power: "218 PS",
    color: "Grau Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.mobile.de", img: "🛻",
    description: "Vollhybrid, kein Stecker nötig, sehr sparsam, Allradantrieb"
  },
  {
    id: 5, title: "Skoda Octavia 2.0 TDI Style",
    year: 2022, km: 44000, price: 19800,
    dist: 12, src: "Kleinanzeigen", cat: "kombi",
    age: "vor 1 Tag", fuel: "Diesel", power: "150 PS",
    color: "Blau Metallic", doors: 5, transmission: "Schaltgetriebe",
    url: "https://www.kleinanzeigen.de", img: "🚙",
    description: "Sehr sparsam, 8-fach bereift, Anhängerkupplung, TÜV neu"
  },
  {
    id: 6, title: "Tesla Model 3 Long Range",
    year: 2023, km: 22000, price: 34500,
    dist: 41, src: "AutoScout24", cat: "elektro",
    age: "vor 2 Tagen", fuel: "Elektro", power: "351 PS",
    color: "Midnight Silver", doors: 4, transmission: "Automatik",
    url: "https://www.autoscout24.de", img: "⚡",
    description: "550 km Reichweite WLTP, Autopilot, Over-the-Air Updates"
  },
  {
    id: 7, title: "Ford Puma ST-Line X 1.0 EcoBoost",
    year: 2023, km: 9000, price: 22500,
    dist: 19, src: "pkw.de", cat: "suv",
    age: "vor 3 Std.", fuel: "Benzin", power: "125 PS",
    color: "Frozen White", doors: 5, transmission: "Automatik",
    url: "https://www.pkw.de", img: "🚗",
    description: "Mild-Hybrid, großer MegaBox Kofferraum, B&O Soundsystem"
  },
  {
    id: 8, title: "Audi A3 Sportback 35 TFSI",
    year: 2022, km: 31000, price: 26900,
    dist: 27, src: "AutoHero", cat: "limousine",
    age: "vor 5 Std.", fuel: "Benzin", power: "150 PS",
    color: "Navi Blau Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.autohero.com", img: "🏎",
    description: "Virtual Cockpit Plus, MMI Plus, LED-Scheinwerfer"
  },
  {
    id: 9, title: "Renault Zoe Intens R135",
    year: 2023, km: 14500, price: 16900,
    dist: 6, src: "Kleinanzeigen", cat: "elektro",
    age: "vor 30 Min.", fuel: "Elektro", power: "135 PS",
    color: "Zinnoberrot Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.kleinanzeigen.de", img: "⚡",
    description: "395 km Reichweite, Batterie inkl., schnell ladbar CCS"
  },
  {
    id: 10, title: "Seat Ibiza FR 1.0 TSI",
    year: 2023, km: 8000, price: 14900,
    dist: 35, src: "mobile.de", cat: "kleinwagen",
    age: "vor 1 Std.", fuel: "Benzin", power: "115 PS",
    color: "Mystery Blue", doors: 5, transmission: "Schaltgetriebe",
    url: "https://www.mobile.de", img: "🚗",
    description: "Junges Fahrzeug, sportliches FR-Paket, Digital Cockpit"
  },
  {
    id: 11, title: "Opel Zafira Life 2.0 CDTI",
    year: 2021, km: 55000, price: 29500,
    dist: 44, src: "AutoScout24", cat: "van",
    age: "vor 8 Std.", fuel: "Diesel", power: "177 PS",
    color: "Schwarz Metallic", doors: 5, transmission: "Automatik",
    url: "https://www.autoscout24.de", img: "🚐",
    description: "8-Sitzer, Business Innovation Paket, Kamera, ACC"
  },
  {
    id: 12, title: "BMW Z4 sDrive20i",
    year: 2022, km: 19000, price: 42500,
    dist: 38, src: "heycar", cat: "cabrio",
    age: "vor 3 Tagen", fuel: "Benzin", power: "197 PS",
    color: "San Francisco Rot Metallic", doors: 2, transmission: "Automatik",
    url: "https://www.heycar.de", img: "🏖",
    description: "Softtop, M-Sportpaket, Harman/Kardon, LED, Kamera"
  },
];
