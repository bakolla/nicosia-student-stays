export type ListingStatus = "available" | "reserved" | "unavailable";
export type Neighborhood =
  | "Engomi"
  | "Strovolos"
  | "Agios Dometios"
  | "Lakatamia"
  | "Aglantzia"
  | "City Centre";

export type Amenity = "ac" | "bills" | "balcony" | "private_bath" | "washer" | "bus" | "wifi";

export const AMENITY_LABELS: Record<Amenity, string> = {
  ac: "Klimatyzacja",
  bills: "Rachunki wliczone",
  balcony: "Balkon",
  private_bath: "Prywatna łazienka",
  washer: "Pralka",
  bus: "Autobus w pobliżu",
  wifi: "Wi-Fi",
};

export const NEIGHBORHOODS: Neighborhood[] = [
  "Engomi",
  "Strovolos",
  "Agios Dometios",
  "Lakatamia",
  "Aglantzia",
  "City Centre",
];

export const NEIGHBORHOOD_INFO: Record<Neighborhood, { description: string; nearby: string[] }> = {
  Engomi: {
    description:
      "Spokojna dzielnica akademicka, blisko Uniwersytetu Cypryjskiego i Uniwersytetu Europejskiego.",
    nearby: ["Uniwersytet", "Supermarket", "Przystanek autobusowy", "Kawiarnia"],
  },
  Strovolos: {
    description: "Największa dzielnica mieszkaniowa Nikozji z dobrym połączeniem z centrum.",
    nearby: ["Supermarket", "Siłownia", "Przystanek autobusowy", "Kawiarnia"],
  },
  "Agios Dometios": {
    description: "Zielona dzielnica z lokalnym klimatem, blisko zachodnich kampusów.",
    nearby: ["Uniwersytet", "Przystanek autobusowy", "Kawiarnia"],
  },
  Lakatamia: {
    description:
      "Cicha, rodzinna okolica z przystępnymi cenami i bezpośrednim autobusem do centrum.",
    nearby: ["Supermarket", "Przystanek autobusowy", "Siłownia"],
  },
  Aglantzia: {
    description: "Studencki klimat, blisko kampusu University of Cyprus, dużo kawiarni.",
    nearby: ["Uniwersytet", "Kawiarnia", "Siłownia", "Supermarket"],
  },
  "City Centre": {
    description:
      "Serce Nikozji — Stare Miasto, Ledra Street, restauracje, dworzec autobusowy międzymiastowy.",
    nearby: [
      "Centrum miasta",
      "Dworzec autobusowy międzymiastowy",
      "Weekendowy dostęp do plaży autobusem międzymiastowym",
      "Kawiarnia",
    ],
  },
};

export type Listing = {
  id: string;
  title: string;
  neighborhood: Neighborhood;
  pricePerMonth: number;
  availableFrom: string; // ISO
  roomType: string; // e.g. "Pokój prywatny w mieszkaniu współdzielonym"
  shortDescription: string;
  description: string;
  status: ListingStatus;
  amenities: Amenity[];
  images: string[];
  houseRules: string[];
  nearby: string[];
  whatsapp: string;
  facebookUrl: string;
};

export type InquiryStatus = "new" | "read" | "answered" | "archived";

export type Inquiry = {
  id: string;
  listingId: string;
  listingTitle: string;
  fullName: string;
  email: string;
  whatsapp: string;
  institution: string;
  moveIn: string;
  moveOut: string;
  tenants: number;
  message: string;
  status: InquiryStatus;
  ownerNote?: string;
  createdAt: string;
};

const IMG = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=80`;

export const SEED_LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Jasny pokój prywatny przy kampusie",
    neighborhood: "Aglantzia",
    pricePerMonth: 420,
    availableFrom: "2026-07-01",
    roomType: "Pokój prywatny w mieszkaniu współdzielonym (3 osoby)",
    shortDescription: "Prywatny pokój 5 minut pieszo od University of Cyprus.",
    description:
      "Cichy, słoneczny pokój w odnowionym mieszkaniu współdzielonym z dwiema innymi studentkami. Wspólna kuchnia i salon. Idealne dla studentów Erasmusa na semestr.",
    status: "available",
    amenities: ["ac", "wifi", "washer", "bus", "balcony"],
    images: [
      IMG("1522708323590-d24dbb6b0267"),
      IMG("1505691938895-1758d7feb511"),
      IMG("1493809842364-78817add7ffb"),
    ],
    houseRules: ["Bez palenia w środku", "Cisza nocna 23:00–08:00", "Bez zwierząt"],
    nearby: ["Uniwersytet", "Supermarket", "Przystanek autobusowy", "Kawiarnia"],
    whatsapp: "+357 99 000 001",
    facebookUrl: "https://facebook.com/nicosiastays.demo",
  },
  {
    id: "l2",
    title: "Studio z balkonem w Strovolos",
    neighborhood: "Strovolos",
    pricePerMonth: 580,
    availableFrom: "2026-09-01",
    roomType: "Niezależne studio",
    shortDescription: "Kompletne studio z prywatną łazienką i balkonem.",
    description:
      "W pełni umeblowane studio z aneksem kuchennym, prywatną łazienką i balkonem. Bezpośredni autobus do centrum miasta w 15 minut.",
    status: "available",
    amenities: ["ac", "bills", "wifi", "washer", "private_bath", "balcony", "bus"],
    images: [
      IMG("1502672260266-1c1ef2d93688"),
      IMG("1484154218962-a197022b5858"),
      IMG("1556909114-f6e7ad7d3136"),
    ],
    houseRules: ["Bez palenia", "Bez imprez"],
    nearby: ["Supermarket", "Siłownia", "Przystanek autobusowy", "Kawiarnia"],
    whatsapp: "+357 99 000 002",
    facebookUrl: "https://facebook.com/nicosiastays.demo",
  },
  {
    id: "l3",
    title: "Przytulny pokój w Engomi",
    neighborhood: "Engomi",
    pricePerMonth: 380,
    availableFrom: "2026-08-15",
    roomType: "Pokój prywatny w mieszkaniu współdzielonym (2 osoby)",
    shortDescription: "Spokojna dzielnica akademicka, blisko European University.",
    description:
      "Przyjemny pokój w mieszkaniu współdzielonym z jedną studentką. Wspólna kuchnia, w pełni wyposażona. Rachunki wliczone w cenę.",
    status: "reserved",
    amenities: ["ac", "bills", "wifi", "washer", "bus"],
    images: [IMG("1540518614846-7eded433c457"), IMG("1505693416388-ac5ce068fe85")],
    houseRules: ["Bez palenia", "Cisza nocna 22:00–08:00"],
    nearby: ["Uniwersytet", "Supermarket", "Przystanek autobusowy"],
    whatsapp: "+357 99 000 003",
    facebookUrl: "https://facebook.com/nicosiastays.demo",
  },
  {
    id: "l4",
    title: "Mieszkanie 2-pokojowe w City Centre",
    neighborhood: "City Centre",
    pricePerMonth: 780,
    availableFrom: "2026-07-15",
    roomType: "Całe mieszkanie 2-pokojowe",
    shortDescription: "Dwupokojowe mieszkanie tuż obok Ledra Street.",
    description:
      "Stylowe mieszkanie w sercu Starego Miasta. Idealne dla pary stażystów lub dwóch studentów. Dworzec autobusowy międzymiastowy 5 minut pieszo — łatwe wyjazdy na plażę w weekendy.",
    status: "available",
    amenities: ["ac", "wifi", "washer", "private_bath", "balcony"],
    images: [
      IMG("1560448204-e02f11c3d0e2"),
      IMG("1522444690501-d72b3e88c3c0"),
      IMG("1493663284031-b7e3aefcae8e"),
    ],
    houseRules: ["Bez palenia w środku", "Bez zwierząt"],
    nearby: [
      "Centrum miasta",
      "Dworzec autobusowy międzymiastowy",
      "Weekendowy dostęp do plaży autobusem międzymiastowym",
      "Kawiarnia",
    ],
    whatsapp: "+357 99 000 004",
    facebookUrl: "https://facebook.com/nicosiastays.demo",
  },
  {
    id: "l5",
    title: "Niedrogi pokój w Lakatamia",
    neighborhood: "Lakatamia",
    pricePerMonth: 320,
    availableFrom: "2026-09-10",
    roomType: "Pokój prywatny w mieszkaniu współdzielonym (4 osoby)",
    shortDescription: "Najlepsza cena, bezpośredni autobus do centrum.",
    description:
      "Najtańsza opcja w naszej ofercie. Pokój w spokojnym mieszkaniu współdzielonym z trzema innymi studentami. Bezpośredni autobus do uczelni.",
    status: "available",
    amenities: ["wifi", "washer", "bus"],
    images: [IMG("1554995207-c18c203602cb"), IMG("1486304873000-235643847519")],
    houseRules: ["Bez palenia", "Sprzątanie wspólne"],
    nearby: ["Supermarket", "Przystanek autobusowy", "Siłownia"],
    whatsapp: "+357 99 000 005",
    facebookUrl: "https://facebook.com/nicosiastays.demo",
  },
  {
    id: "l6",
    title: "Studio dla stażysty w Agios Dometios",
    neighborhood: "Agios Dometios",
    pricePerMonth: 520,
    availableFrom: "2026-10-01",
    roomType: "Niezależne studio",
    shortDescription: "Idealne na 3-miesięczny staż, wszystko w cenie.",
    description:
      "Kompaktowe studio z prywatną łazienką, klimatyzacją i pralką. Rachunki i internet wliczone. Świetne dla stażystów na krótkie kontrakty.",
    status: "unavailable",
    amenities: ["ac", "bills", "wifi", "washer", "private_bath", "bus"],
    images: [IMG("1551776235-dde6d482980b"), IMG("1502005229762-cf1b2da7c5d6")],
    houseRules: ["Bez palenia", "Bez imprez"],
    nearby: ["Uniwersytet", "Przystanek autobusowy", "Kawiarnia"],
    whatsapp: "+357 99 000 006",
    facebookUrl: "https://facebook.com/nicosiastays.demo",
  },
];
