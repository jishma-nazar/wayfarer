/**
 * Mock catalogue. Facts only — every human-readable string (names, blurbs, alt text)
 * lives in /messages/{locale}.json under `content.*`, keyed by the same id.
 * Photos are real Unsplash images of the named places.
 */
import type { Article, Destination, Experience, Stay, Story, TripPackage } from "./types";

export const destinations: Destination[] = [
  { id: "lisbon", lat: 38.72, lon: -9.14, timeZone: "Europe/Lisbon", fromPrice: 139, trending: true, mapOrder: 4, photo: { id: "1585208798174-6cedd86e019a" }, aliases: ["Lisbon", "Lisboa", "Lisbonne"] },
  { id: "kyoto", lat: 35.01, lon: 135.77, timeZone: "Asia/Tokyo", fromPrice: 268, trending: true, mapOrder: 9, photo: { id: "1624253321171-1be53e12f5f4" }, aliases: ["Kyoto", "Kioto", "Kyōto"] },
  { id: "oaxaca", lat: 17.07, lon: -96.73, timeZone: "America/Mexico_City", fromPrice: 92, trending: true, mapOrder: 3, photo: { id: "1763824951292-b082ea414774" }, aliases: ["Oaxaca", "Oaxaca de Juárez", "Teotitlán"] },
  { id: "tbilisi", lat: 41.72, lon: 44.79, timeZone: "Asia/Tbilisi", fromPrice: 74, mapOrder: 6, photo: { id: "1603350576276-24747f7bbf40" }, aliases: ["Tbilisi", "Tiflis", "Georgia", "Sakartvelo"] },
  { id: "hoiAn", lat: 15.88, lon: 108.33, timeZone: "Asia/Ho_Chi_Minh", fromPrice: 58, trending: true, mapOrder: 8, photo: { id: "1563354860-799d15199ac3" }, aliases: ["Hoi An", "Hội An", "Hoian"] },
  { id: "valparaiso", lat: -33.05, lon: -71.62, timeZone: "America/Santiago", fromPrice: 84, trending: true, mapOrder: 1, photo: { id: "1490782300182-697b80ad4293" }, aliases: ["Valparaíso", "Valparaiso", "Valpo"] },
  { id: "cancun", lat: 21.16, lon: -86.85, timeZone: "America/Cancun", fromPrice: 152, photo: { id: "1602088113235-229c19758e9f" }, aliases: ["Cancún", "Cancun", "Riviera Maya", "Tulum"] },
  { id: "marrakech", lat: 31.63, lon: -7.99, timeZone: "Africa/Casablanca", fromPrice: 96, trending: true, mapOrder: 5, photo: { id: "1597212618440-806262de4f6b" }, aliases: ["Marrakech", "Marrakesh", "Marraquech", "Marruecos", "Morocco"] },
  { id: "seville", lat: 37.39, lon: -5.98, timeZone: "Europe/Madrid", fromPrice: 118, trending: true, photo: { id: "1509840841025-9088ba78a826" }, aliases: ["Seville", "Sevilla", "Andalusia", "Andalucía"] },
  { id: "kerala", lat: 9.5, lon: 76.34, timeZone: "Asia/Kolkata", fromPrice: 121, trending: true, mapOrder: 7, photo: { id: "1602216056096-3b40cc0c9944" }, aliases: ["Kerala", "Alappuzha", "Alleppey", "Kochi", "Cochin"] },
  { id: "cusco", lat: -13.53, lon: -71.97, timeZone: "America/Lima", fromPrice: 97, trending: true, mapOrder: 2, photo: { id: "1526697675318-89790adec369" }, aliases: ["Cusco", "Cuzco", "Qosqo", "Machu Picchu", "Sacred Valley", "Valle Sagrado"] },
  { id: "porto", lat: 41.15, lon: -8.61, timeZone: "Europe/Lisbon", fromPrice: 112, photo: { id: "1555881400-74d7acaacd8b" }, aliases: ["Porto", "Oporto"] },
  { id: "douro", lat: 41.19, lon: -7.55, timeZone: "Europe/Lisbon", fromPrice: 214, photo: { id: "1638664370752-8188076afbab" }, aliases: ["Douro", "Douro Valley", "Valle del Duero", "Pinhão", "Pinhao"] },
  { id: "puglia", lat: 40.73, lon: 17.58, timeZone: "Europe/Rome", fromPrice: 176, photo: { id: "1742281325875-7df165d53a46" }, aliases: ["Puglia", "Apulia", "Ostuni", "Italy", "Italia"] },
  { id: "tulum", lat: 20.21, lon: -87.47, timeZone: "America/Cancun", fromPrice: 152, photo: { id: "1621275718772-731c989b5d79" }, aliases: ["Tulum", "Yucatán", "Yucatan", "Riviera Maya", "Cancún", "Cancun", "Quintana Roo", "Valladolid"] },
  { id: "atacama", lat: -22.91, lon: -68.2, timeZone: "America/Santiago", fromPrice: 238, photo: { id: "1587661031836-50b3734995ed" }, aliases: ["Atacama", "San Pedro de Atacama", "Chile"] },
  { id: "patagonia", lat: -50.94, lon: -73.41, timeZone: "America/Punta_Arenas", fromPrice: 310, photo: { id: "1558517286-8a9cb0b8c793" }, aliases: ["Patagonia", "Torres del Paine"] },
  { id: "comporta", lat: 38.38, lon: -8.78, timeZone: "Europe/Lisbon", fromPrice: 198, photo: { id: "1704658015193-22b7a420e97a" }, aliases: ["Comporta", "Alentejo"] },
  { id: "dolomites", lat: 46.41, lon: 11.84, timeZone: "Europe/Rome", fromPrice: 165, photo: { id: "1606771967934-f516d3dc907c" }, aliases: ["Dolomites", "Dolomitas", "Dolomiti"] },
  { id: "lofoten", lat: 68.2, lon: 13.6, timeZone: "Europe/Oslo", fromPrice: 205, photo: { id: "1785500818843-2588e8faf3e8" }, aliases: ["Lofoten", "Norway", "Noruega", "Reine"] },
  { id: "mexicoCity", lat: 19.43, lon: -99.13, timeZone: "America/Mexico_City", fromPrice: 88, photo: { id: "1580934738416-ad531f2920f7" }, aliases: ["Mexico City", "Ciudad de México", "CDMX", "México"] },
  { id: "cappadocia", lat: 38.64, lon: 34.83, timeZone: "Europe/Istanbul", fromPrice: 110, trending: true, photo: { id: "1604156789095-3348604c0f43" }, aliases: ["Cappadocia", "Capadocia", "Kapadokya", "Göreme", "Goreme", "Turkey", "Turquía"] },
  { id: "amalfi", lat: 40.63, lon: 14.48, timeZone: "Europe/Rome", fromPrice: 290, trending: true, photo: { id: "1583844056361-4418a8f2a985" }, aliases: ["Amalfi", "Amalfi Coast", "Costa Amalfitana", "Positano", "Italy", "Italia"] },
  { id: "maldives", lat: 3.2, lon: 73.22, timeZone: "Indian/Maldives", fromPrice: 420, trending: true, photo: { id: "1514282401047-d79a71a590e8" }, aliases: ["Maldives", "Maldivas", "Malé", "Male"] },
  { id: "sahara", lat: 31.1, lon: -4.01, timeZone: "Africa/Casablanca", fromPrice: 140, trending: true, photo: { id: "1559586616-361e18714958" }, aliases: ["Sahara", "Sáhara", "Merzouga", "Erg Chebbi", "Desert", "Desierto"] },
  { id: "iceland", lat: 63.42, lon: -19.01, timeZone: "Atlantic/Reykjavik", fromPrice: 260, trending: true, photo: { id: "1500043357865-c6b8827edf10" }, aliases: ["Iceland", "Islandia", "Vík", "Vik", "Reykjavík", "Reykjavik"] },
  { id: "bali", lat: -8.43, lon: 115.28, timeZone: "Asia/Makassar", fromPrice: 85, trending: true, photo: { id: "1555400038-63f5ba517a47" }, aliases: ["Bali", "Ubud", "Tegallalang", "Indonesia"] },
  { id: "swissAlps", lat: 46.66, lon: 9.68, timeZone: "Europe/Zurich", fromPrice: 240, photo: { id: "1572041341933-57caa3b8f6d5" }, aliases: ["Swiss Alps", "Alpes suizos", "Switzerland", "Suiza", "Graubünden", "Zermatt"] },
  { id: "serengeti", lat: -2.33, lon: 34.83, timeZone: "Africa/Dar_es_Salaam", fromPrice: 380, photo: { id: "1580145575237-75fec2a0320b" }, aliases: ["Serengeti", "Serengueti", "Tanzania", "Safari"] },
];

export const stays: Stay[] = [
  { id: "quintaVale", destinationId: "douro", photo: { id: "1603657289433-e4983d2114b9", focus: "50% 60%" }, pricePerNight: 214, rating: 4.9, reviews: 612, freeCancellation: true, favorite: true, editorsPick: true },
  { id: "ryokanKurama", destinationId: "kyoto", photo: { id: "1614301246509-d1fc7d78b6b6" }, pricePerNight: 268, rating: 4.8, reviews: 1108, freeCancellation: false, editorsPick: true },
  { id: "masseriaUlivi", destinationId: "puglia", photo: { id: "1689085382918-eab80bd3b708" }, pricePerNight: 176, rating: 4.7, reviews: 389, freeCancellation: true, favorite: true, editorsPick: true },
  { id: "casaSelva", destinationId: "tulum", photo: { id: "1520483601560-389dff434fdf" }, pricePerNight: 152, rating: 4.6, reviews: 942, freeCancellation: true, editorsPick: true },
  { id: "lodgeLicancabur", destinationId: "atacama", photo: { id: "1494783435443-c15feee0a80a" }, pricePerNight: 238, rating: 4.8, reviews: 274, freeCancellation: false, editorsPick: true },
  { id: "cabanasComporta", destinationId: "comporta", photo: { id: "1656106345218-439f55037c59" }, pricePerNight: 198, rating: 4.7, reviews: 211, freeCancellation: true },
  { id: "kettuvallam", destinationId: "kerala", photo: { id: "1593693411515-c20261bcad6e" }, pricePerNight: 121, rating: 4.8, reviews: 530, freeCancellation: true, favorite: true },
  { id: "casaAlfama", destinationId: "lisbon", photo: { id: "1536663815808-535e2280d2c2" }, pricePerNight: 139, rating: 4.6, reviews: 1422, freeCancellation: true },
  { id: "casonaSanBlas", destinationId: "cusco", photo: { id: "1769358730767-ea63216351b7" }, pricePerNight: 97, rating: 4.5, reviews: 807, freeCancellation: false },
  { id: "refugioPaine", destinationId: "patagonia", photo: { id: "1546569397-ab326af881f5" }, pricePerNight: 310, rating: 4.9, reviews: 168, freeCancellation: false, favorite: true },
  { id: "cerroAlegre", destinationId: "valparaiso", photo: { id: "1773992476452-72b42409d4fd" }, pricePerNight: 84, rating: 4.4, reviews: 655, freeCancellation: true },
  { id: "riadZitoun", destinationId: "marrakech", photo: { id: "1653323792487-6ecc6217040b" }, pricePerNight: 96, rating: 4.7, reviews: 1290, freeCancellation: true },
];

export const experiences: Experience[] = [
  { id: "teaKyoto", destinationId: "kyoto", photo: { id: "1757507423608-ae47cddef75f" }, price: 65, hours: 2, moods: ["slow", "culture"], rating: 4.9, reviews: 488, freeCancellation: true, favorite: true },
  { id: "oliveHarvest", destinationId: "puglia", photo: { id: "1785440944109-4021897d9e13" }, price: 84, hours: 5, moods: ["slow", "food", "family"], rating: 4.8, reviews: 156, freeCancellation: true },
  { id: "portLodge", destinationId: "douro", photo: { id: "1531055530101-0ee8766b4a10" }, price: 48, hours: 3, moods: ["food", "slow"], rating: 4.7, reviews: 902, freeCancellation: true },
  { id: "pastaBologna", destinationId: "puglia", photo: { id: "1642354571956-d77dfd9596bb" }, price: 72, hours: 3, moods: ["food", "family"], rating: 4.9, reviews: 1340, freeCancellation: true, favorite: true },
  { id: "spiceSouk", destinationId: "marrakech", photo: { id: "1580746738099-1cb74f972feb" }, price: 39, hours: 3, moods: ["food", "culture"], rating: 4.6, reviews: 712, freeCancellation: true },
  { id: "surfEriceira", destinationId: "lisbon", photo: { id: "1526342256246-b67e94be5c79" }, price: 55, hours: 3, moods: ["coast"], rating: 4.8, reviews: 433, freeCancellation: true },
  { id: "cenoteSwim", destinationId: "tulum", photo: { id: "1546838849-6eb6269ae2db" }, price: 69, hours: 6, moods: ["coast", "family"], rating: 4.7, reviews: 1876, freeCancellation: true },
  { id: "kayakLofoten", destinationId: "lofoten", photo: { id: "1521336575822-6da63fb45455" }, price: 118, hours: 5, moods: ["coast", "mountains"], rating: 4.9, reviews: 204, freeCancellation: false, favorite: true },
  { id: "hutDolomites", destinationId: "dolomites", photo: { id: "1519904981063-b0cf448d479e" }, price: 340, hours: 72, moods: ["mountains"], rating: 4.8, reviews: 97, freeCancellation: false },
  { id: "wTrek", destinationId: "patagonia", photo: { id: "1558517286-8a9cb0b8c793" }, price: 1290, hours: 120, moods: ["mountains"], rating: 4.9, reviews: 318, freeCancellation: false },
  { id: "flamencoTriana", destinationId: "seville", photo: { id: "1773708370809-be6ba557078d" }, price: 42, hours: 2, moods: ["culture"], rating: 4.7, reviews: 1104, freeCancellation: true },
  { id: "weavingTeotitlan", destinationId: "oaxaca", photo: { id: "1562869929-bda0650edb1f" }, price: 58, hours: 4, moods: ["culture", "family"], rating: 4.9, reviews: 266, freeCancellation: true, favorite: true },
  { id: "lanternHoiAn", destinationId: "hoiAn", photo: { id: "1761150285751-c593ab20159c" }, price: 22, hours: 2, moods: ["family", "culture"], rating: 4.8, reviews: 1532, freeCancellation: true },
  { id: "sintraTram", destinationId: "lisbon", photo: { id: "1562195168-c82fea0f0953" }, price: 61, hours: 7, moods: ["culture", "family"], rating: 4.5, reviews: 2210, freeCancellation: true },
];

export const packages: TripPackage[] = [
  { id: "douroSeven", destinationId: "douro", photo: { id: "1555881400-74d7acaacd8b" }, fromCode: "LIS", toCode: "OPO", nights: 7, price: 1840, fareCode: "WF-DOU-07", departures: "2027-03", rating: 4.9, reviews: 214 },
  { id: "oaxacaSlow", destinationId: "oaxaca", photo: { id: "1763821530010-89534ec80d19" }, fromCode: "MEX", toCode: "OAX", nights: 6, price: 1320, fareCode: "WF-OAX-06", departures: "2027-01", rating: 4.8, reviews: 167 },
  { id: "cuscoValley", destinationId: "cusco", photo: { id: "1526392060635-9d6019884377" }, fromCode: "LIM", toCode: "CUZ", nights: 8, price: 2260, fareCode: "WF-CUZ-08", departures: "2027-04", rating: 4.8, reviews: 139 },
  { id: "keralaWater", destinationId: "kerala", photo: { id: "1772729315540-415f2db20d98" }, fromCode: "BOM", toCode: "COK", nights: 5, price: 980, fareCode: "WF-KER-05", departures: "2026-12", rating: 4.7, reviews: 302 },
];

export const stories: Story[] = [
  { id: "lucia", destinationId: "douro", photo: { id: "1768501363555-85f477d5420d" }, rating: 5 },
  { id: "iyer", destinationId: "kyoto", photo: { id: "1545569341-9eb8b30979d9" }, rating: 5 },
  { id: "marcus", destinationId: "valparaiso", photo: { id: "1629537745251-57c3bc5b8670", focus: "50% 40%" }, rating: 4 },
  { id: "sofia", destinationId: "oaxaca", photo: { id: "1660670173026-ec491dd3dd1a" }, rating: 5 },
];

export const articles: Article[] = [
  { id: "porto48", photo: { id: "1513735492246-483525079686" }, readMinutes: 8, date: "2026-09-14" },
  { id: "japanTrains", photo: { id: "1575203445546-8ed6205a7121" }, readMinutes: 11, date: "2026-08-30" },
  { id: "cdmxBreakfast", photo: { id: "1585464231875-d9ef1f5ad396" }, readMinutes: 6, date: "2026-08-02" },
  { id: "tbilisiNow", photo: { id: "1565008576549-57569a49371d" }, readMinutes: 9, date: "2026-07-11" },
];

export const heroPhoto = { id: "1638664370752-8188076afbab", focus: "50% 55%" } as const;

/** Hero slideshow, in order. Captions come from content.destinations.<id>. */
export const heroSlides: { destinationId: string; photo: { id: string; focus?: string } }[] = [
  { destinationId: "cappadocia", photo: { id: "1641128324972-af3212f0f6bd", focus: "50% 60%" } },
  { destinationId: "amalfi", photo: { id: "1583844056361-4418a8f2a985", focus: "60% 50%" } },
  { destinationId: "maldives", photo: { id: "1574226780565-388f10f8121e", focus: "50% 50%" } },
  { destinationId: "sahara", photo: { id: "1559586616-361e18714958", focus: "50% 60%" } },
  { destinationId: "douro", photo: { id: "1638664370752-8188076afbab", focus: "50% 55%" } },
];

/** "Seen on the road" gallery. Alt text and captions live in content.gallery.<id>. */
export const gallery: { id: string; photo: { id: string; focus?: string } }[] = [
  { id: "sahCamp", photo: { id: "1613169620329-6785c004d900" } },
  { id: "baliTerraces", photo: { id: "1559628233-eb1b1a45564b" } },
  { id: "alpTrain", photo: { id: "1577953521789-b1e88d5785a8" } },
  { id: "cheetah", photo: { id: "1597877774402-d04cad0b7596" } },
  { id: "balloon", photo: { id: "1695415683093-ae5f213ea898" } },
  { id: "fjadra", photo: { id: "1531168556467-80aace0d0144" } },
  { id: "jokul", photo: { id: "1473654729523-203e25dfda10" } },
  { id: "positanoDay", photo: { id: "1561956021-947f09ae0101" } },
  { id: "lanterns", photo: { id: "1563354860-799d15199ac3" } },
  { id: "flamenco", photo: { id: "1568891707029-d23e74760db6" } },
  { id: "surf", photo: { id: "1482531007909-192ac913980a" } },
  { id: "market", photo: { id: "1577110905059-99e821bb9852" } },
];
export const whyPhoto = { id: "1489573280374-2e193c63726c", focus: "50% 60%" } as const;
export const newsletterPhoto = { id: "1590523277543-a94d2e4eb00b", focus: "50% 50%" } as const;
export const notFoundPhoto = { id: "1656106345218-439f55037c59" } as const;

export const contact = {
  phone: "+351 220 000 128",
  phoneHref: "tel:+351220000128",
  whatsapp: "https://wa.me/351910000128",
  email: "hello@wayfarer.example",
} as const;

export function photoUrl(photo: { id: string }) {
  return `https://images.unsplash.com/photo-${photo.id}`;
}

export const byId = {
  destination: (id: string) => destinations.find((d) => d.id === id),
  stay: (id: string) => stays.find((s) => s.id === id),
  experience: (id: string) => experiences.find((e) => e.id === id),
  package: (id: string) => packages.find((p) => p.id === id),
};
