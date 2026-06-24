import React, { createContext, useContext, useState, useEffect } from "react";
import type { Listing, Neighborhood, Amenity, ListingStatus, InquiryStatus } from "@/lib/types";

export type Language = "pl" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tCount: (count: number) => string;
  getListing: (listing: Listing) => Listing;
  getNeighborhoodDesc: (n: Neighborhood) => string;
  getNeighborhoodNearby: (n: Neighborhood) => string[];
  translateAmenity: (a: Amenity) => string;
  translateStatus: (s: ListingStatus) => string;
  translateInquiryStatus: (s: InquiryStatus) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Neighborhood Info translations
const NEIGHBORHOOD_TRANSLATIONS: Record<Neighborhood, Record<Language, { description: string; nearby: string[] }>> = {
  Engomi: {
    pl: {
      description: "Spokojna dzielnica akademicka, blisko Uniwersytetu Cypryjskiego i Uniwersytetu Europejskiego.",
      nearby: ["Uniwersytet", "Supermarket", "Przystanek autobusowy", "Kawiarnia"],
    },
    en: {
      description: "A quiet academic district close to the University of Nicosia and European University Cyprus.",
      nearby: ["University", "Supermarket", "Bus stop", "Cafe"],
    },
  },
  Strovolos: {
    pl: {
      description: "Największa dzielnica mieszkaniowa Nikozji z dobrym połączeniem z centrum.",
      nearby: ["Supermarket", "Siłownia", "Przystanek autobusowy", "Kawiarnia"],
    },
    en: {
      description: "The largest residential district in Nicosia, with good connections to the city center.",
      nearby: ["Supermarket", "Gym", "Bus stop", "Cafe"],
    },
  },
  "Agios Dometios": {
    pl: {
      description: "Zielona dzielnica z lokalnym klimatem, blisko zachodnich kampusów.",
      nearby: ["Uniwersytet", "Przystanek autobusowy", "Kawiarnia"],
    },
    en: {
      description: "A green area with local charm, located close to the western university campuses.",
      nearby: ["University", "Bus stop", "Cafe"],
    },
  },
  Lakatamia: {
    pl: {
      description: "Cicha, rodzinna okolica z przystępnymi cenami i bezpośrednim autobusem do centrum.",
      nearby: ["Supermarket", "Przystanek autobusowy", "Siłownia"],
    },
    en: {
      description: "A quiet, family-friendly area with affordable prices and a direct bus route to the center.",
      nearby: ["Supermarket", "Bus stop", "Gym"],
    },
  },
  Aglantzia: {
    pl: {
      description: "Studencki klimat, blisko kampusu University of Cyprus, dużo kawiarni.",
      nearby: ["Uniwersytet", "Kawiarnia", "Siłownia", "Supermarket"],
    },
    en: {
      description: "Student vibes, near the University of Cyprus campus, with plenty of cafes.",
      nearby: ["University", "Cafe", "Gym", "Supermarket"],
    },
  },
  "City Centre": {
    pl: {
      description: "Serce Nikozji — Stare Miasto, Ledra Street, restauracje, dworzec autobusowy międzymiastowy.",
      nearby: [
        "Centrum miasta",
        "Dworzec autobusowy międzymiastowy",
        "Weekendowy dostęp do plaży autobusem międzymiastowym",
        "Kawiarnia",
      ],
    },
    en: {
      description: "The heart of Nicosia — Old Town, Ledra Street, restaurants, and the intercity bus station.",
      nearby: [
        "City centre",
        "Intercity bus station",
        "Weekend beach access by intercity bus",
        "Cafe",
      ],
    },
  },
};

// Predefined Listings translations (l1 to l6)
const LISTING_TRANSLATIONS: Record<string, Record<Language, Partial<Listing>>> = {
  l1: {
    pl: {
      title: "Jasny pokój prywatny przy kampusie",
      roomType: "Pokój prywatny w mieszkaniu współdzielonym (3 osoby)",
      shortDescription: "Prywatny pokój 5 minut pieszo od University of Cyprus.",
      description:
        "Cichy, słoneczny pokój w odnowionym mieszkaniu współdzielonym z dwiema innymi studentkami. Wspólna kuchnia i salon. Idealne dla studentów Erasmusa na semestr.",
      houseRules: ["Bez palenia w środku", "Cisza nocna 23:00–08:00", "Bez zwierząt"],
      nearby: ["Uniwersytet", "Supermarket", "Przystanek autobusowy", "Kawiarnia"],
    },
    en: {
      title: "Bright private room next to campus",
      roomType: "Private room in a shared apartment (3 people)",
      shortDescription: "Private room 5 minutes walk from the University of Cyprus.",
      description:
        "Quiet, sunny room in a renovated shared apartment with two other female students. Shared kitchen and living room. Perfect for Erasmus students for a semester.",
      houseRules: ["No smoking inside", "Quiet hours 23:00–08:00", "No pets"],
      nearby: ["University", "Supermarket", "Bus stop", "Cafe"],
    },
  },
  l2: {
    pl: {
      title: "Studio z balkonem w Strovolos",
      roomType: "Niezależne studio",
      shortDescription: "Kompletne studio z prywatną łazienką i balkonem.",
      description:
        "W pełni umeblowane studio z aneksem kuchennym, prywatną łazienką i balkonem. Bezpośredni autobus do centrum miasta w 15 minut.",
      houseRules: ["Bez palenia", "Bez imprez"],
      nearby: ["Supermarket", "Siłownia", "Przystanek autobusowy", "Kawiarnia"],
    },
    en: {
      title: "Studio with a balcony in Strovolos",
      roomType: "Self-contained studio",
      shortDescription: "Complete studio with private bathroom and balcony.",
      description:
        "Fully furnished studio with kitchenette, private bathroom, and balcony. Direct bus connection to the city center in 15 minutes.",
      houseRules: ["No smoking", "No parties"],
      nearby: ["Supermarket", "Gym", "Bus stop", "Cafe"],
    },
  },
  l3: {
    pl: {
      title: "Przytulny pokój w Engomi",
      roomType: "Pokój prywatny w mieszkaniu współdzielonym (2 osoby)",
      shortDescription: "Spokojna dzielnica akademicka, blisko European University.",
      description:
        "Przyjemny pokój w mieszkaniu współdzielonym z jedną studentką. Wspólna kuchnia, w pełni wyposażona. Rachunki wliczone w cenę.",
      houseRules: ["Bez palenia", "Cisza nocna 22:00–08:00"],
      nearby: ["Uniwersytet", "Supermarket", "Przystanek autobusowy"],
    },
    en: {
      title: "Cozy room in Engomi",
      roomType: "Private room in a shared apartment (2 people)",
      shortDescription: "Quiet academic area, close to European University Cyprus.",
      description:
        "Pleasant room in a shared apartment with one other female student. Shared kitchen, fully equipped. Utility bills included in the price.",
      houseRules: ["No smoking", "Quiet hours 22:00–08:00"],
      nearby: ["University", "Supermarket", "Bus stop"],
    },
  },
  l4: {
    pl: {
      title: "Mieszkanie 2-pokojowe w City Centre",
      roomType: "Całe mieszkanie 2-pokojowe",
      shortDescription: "Dwupokojowe mieszkanie tuż obok Ledra Street.",
      description:
        "Stylowe mieszkanie w sercu Starego Miasta. Idealne dla pary stażystów lub dwóch studentów. Dworzec autobusowy międzymiastowy 5 minut pieszo — łatwe wyjazdy na plażę w weekendy.",
      houseRules: ["Bez palenia w środku", "Bez zwierząt"],
      nearby: [
        "Centrum miasta",
        "Dworzec autobusowy międzymiastowy",
        "Weekendowy dostęp do plaży autobusem międzymiastowym",
        "Kawiarnia",
      ],
    },
    en: {
      title: "2-bedroom apartment in City Centre",
      roomType: "Entire 2-bedroom apartment",
      shortDescription: "Two-room apartment right next to Ledra Street.",
      description:
        "Stylish apartment in the heart of the Old Town. Ideal for a couple of interns or two students. Intercity bus station is a 5-minute walk — easy weekend trips to the beach.",
      houseRules: ["No smoking inside", "No pets"],
      nearby: [
        "City centre",
        "Intercity bus station",
        "Weekend beach access by intercity bus",
        "Cafe",
      ],
    },
  },
  l5: {
    pl: {
      title: "Niedrogi pokój w Lakatamia",
      roomType: "Pokój prywatny w mieszkaniu współdzielonym (4 osoby)",
      shortDescription: "Najlepsza cena, bezpośredni autobus do centrum.",
      description:
        "Najtańsza opcja w naszej ofercie. Pokój w spokojnym mieszkaniu współdzielonym z trzema innymi studentami. Bezpośredni autobus do uczelni.",
      houseRules: ["Bez palenia", "Sprzątanie wspólne"],
      nearby: ["Supermarket", "Przystanek autobusowy", "Siłownia"],
    },
    en: {
      title: "Affordable room in Lakatamia",
      roomType: "Private room in a shared apartment (4 people)",
      shortDescription: "Best price, direct bus to the city center.",
      description:
        "The most affordable option in our listings. Room in a quiet shared apartment with three other students. Direct bus route to the universities.",
      houseRules: ["No smoking", "Shared cleaning schedule"],
      nearby: ["Supermarket", "Bus stop", "Gym"],
    },
  },
  l6: {
    pl: {
      title: "Studio dla stażysty w Agios Dometios",
      roomType: "Niezależne studio",
      shortDescription: "Idealne na 3-miesięczny staż, wszystko w cenie.",
      description:
        "Kompaktowe studio z prywatną łazienką, klimatyzacją i pralką. Rachunki i internet wliczone. Świetne dla stażystów na krótkie kontrakty.",
      houseRules: ["Bez palenia", "Bez imprez"],
      nearby: ["Uniwersytet", "Przystanek autobusowy", "Kawiarnia"],
    },
    en: {
      title: "Studio for an intern in Agios Dometios",
      roomType: "Self-contained studio",
      shortDescription: "Ideal for a 3-month internship, all-inclusive.",
      description:
        "Compact studio with private bathroom, air conditioning, and washing machine. Utility bills and internet included. Great for interns on short-term contracts.",
      houseRules: ["No smoking", "No parties"],
      nearby: ["University", "Bus stop", "Cafe"],
    },
  },
};

const AMENITY_TRANSLATIONS: Record<Amenity, Record<Language, string>> = {
  ac: { pl: "Klimatyzacja", en: "Air conditioning" },
  bills: { pl: "Rachunki wliczone", en: "Bills included" },
  balcony: { pl: "Balkon", en: "Balcony" },
  private_bath: { pl: "Prywatna łazienka", en: "Private bathroom" },
  washer: { pl: "Pralka", en: "Washing machine" },
  bus: { pl: "Autobus w pobliżu", en: "Bus nearby" },
  wifi: { pl: "Wi-Fi", en: "Wi-Fi" },
};

const STATUS_TRANSLATIONS: Record<ListingStatus, Record<Language, string>> = {
  available: { pl: "Dostępny", en: "Available" },
  reserved: { pl: "Zarezerwowany", en: "Reserved" },
  unavailable: { pl: "Niedostępny", en: "Unavailable" },
};

const INQUIRY_STATUS_TRANSLATIONS: Record<InquiryStatus, Record<Language, string>> = {
  new: { pl: "Nowe", en: "New" },
  read: { pl: "Przeczytane", en: "Read" },
  answered: { pl: "Odpowiedziane", en: "Answered" },
  archived: { pl: "Zarchiwizowane", en: "Archived" },
};

const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.home": { pl: "Start", en: "Home" },
  "nav.listings": { pl: "Oferty", en: "Listings" },
  "nav.inquire": { pl: "Zapytaj", en: "Inquire" },
  "nav.about": { pl: "O nas", en: "About us" },
  "nav.faq": { pl: "FAQ", en: "FAQ" },
  "nav.ownerPanel": { pl: "Panel właściciela", en: "Owner panel" },
  "nav.homepage": { pl: "Strona główna", en: "Home ↗" },
  "nav.logout": { pl: "Wyloguj", en: "Logout" },
  "nav.dashboard": { pl: "Dashboard", en: "Dashboard" },
  "nav.myListings": { pl: "Moje oferty", en: "My listings" },
  "nav.addListing": { pl: "Dodaj ofertę", en: "Add listing" },
  "nav.inquiries": { pl: "Zapytania", en: "Inquiries" },
  "nav.openMenu": { pl: "Otwórz menu", en: "Open menu" },
  "nav.closeMenu": { pl: "Zamknij menu", en: "Close menu" },

  // Footer
  "footer.sub": { pl: "Krótkoterminowe zakwaterowanie studenckie w Nikozji.", en: "Short-term student accommodation in Nicosia." },
  "footer.notice": { pl: "Wszystkie oferty, kontakty i zdjęcia są fikcyjne — projekt demonstracyjny.", en: "All listings, contacts, and photos are fictional — demonstration project." },

  // Home Page
  "home.heroEyebrow": { pl: "Nikozja, Cypr · Krótkoterminowo", en: "Nicosia, Cyprus · Short-term" },
  "home.heroTitle": { pl: "Znajdź zakwaterowanie dla studentów w Nikozji", en: "Find student accommodation in Nicosia" },
  "home.heroSubtitle": { pl: "Krótkoterminowe pokoje i mieszkania dla studentów Erasmusa, stażystów i studentów zagranicznych.", en: "Short-term rooms and apartments for Erasmus students, interns, and international students." },
  "home.browseBtn": { pl: "Przeglądaj zakwaterowanie", en: "Browse accommodation" },
  "home.inquireBtn": { pl: "Zapytaj o dostępność", en: "Inquire about availability" },
  "home.feature1": { pl: "Zweryfikowane pokoje przyjazne studentom", en: "Verified student-friendly rooms" },
  "home.feature2": { pl: "Ręczne potwierdzenie dostępności", en: "Manual availability confirmation" },
  "home.feature3": { pl: "Brak automatycznej rezerwacji", en: "No automatic booking" },
  "home.feature4": { pl: "Lokalne dzielnice Nikozji", en: "Local Nicosia neighborhoods" },
  "home.avgPriceLabel": { pl: "Średnia cena pokoju", en: "Average room price" },
  "home.avgPriceVal": { pl: "€420 / mies.", en: "€420 / mo." },
  "home.featuredEyebrow": { pl: "Polecane", en: "Featured" },
  "home.featuredTitle": { pl: "Wybrane oferty", en: "Selected offers" },
  "home.featuredAction": { pl: "Zobacz wszystkie →", en: "See all →" },
  "home.neighborhoodsEyebrow": { pl: "Dzielnice", en: "Neighborhoods" },
  "home.neighborhoodsTitle": { pl: "Gdzie zamieszkać w Nikozji", en: "Where to stay in Nicosia" },
  "home.seeOffersLink": { pl: "Zobacz oferty →", en: "See listings →" },
  "home.faqEyebrow": { pl: "FAQ", en: "FAQ" },
  "home.faqTitle": { pl: "Najczęstsze pytania", en: "Frequently Asked Questions" },
  "home.faqAction": { pl: "Wszystkie pytania →", en: "All questions →" },

  // FAQ Page Short / Full
  "faq.q1": { pl: "Czy mogę zarezerwować online?", en: "Can I book online?" },
  "faq.a1": { pl: "Nie. Składasz zapytanie, a właściciel ręcznie potwierdza dostępność i kontaktuje się z Tobą bezpośrednio.", en: "No. You submit an inquiry, and the owner manually confirms availability and contacts you directly." },
  "faq.q2": { pl: "Jak długo mogę zostać?", en: "How long can I stay?" },
  "faq.a2": { pl: "Oferty są przeznaczone na pobyty krótkoterminowe — od 1 miesiąca do całego semestru lub stażu.", en: "The listings are intended for short-term stays — from 1 month up to a full semester or internship." },
  "faq.q3": { pl: "Czy rachunki są wliczone?", en: "Are bills included?" },
  "faq.a3": { pl: "Zależy od oferty — sprawdź sekcję udogodnień. Filtrujemy także oferty z rachunkami w cenie.", en: "It depends on the listing — check the amenities section. You can also filter for listings with bills included." },
  "faq.q4": { pl: "Jak właściciel mnie zweryfikuje?", en: "How does the owner verify me?" },
  "faq.a4": { pl: "Właściciel poprosi o krótkie informacje o Tobie i Twojej uczelni / stażu przez WhatsApp lub e-mail.", en: "The owner will ask for brief information about you and your university / internship via WhatsApp or email." },
  "faq.q5": { pl: "Czy mogę przyjechać z drugą osobą?", en: "Can I stay with another person?" },
  "faq.a5": { pl: "Tak — w formularzu zapytania podaj liczbę najemców. Właściciel potwierdzi możliwość.", en: "Yes — specify the number of tenants in the inquiry form. The owner will confirm if it is possible." },
  "faq.q6": { pl: "Czy to blisko plaży?", en: "Is it close to the beach?" },
  "faq.a6": { pl: "Nikozja leży w głębi lądu. Z dworca autobusowego międzymiastowego są regularne weekendowe połączenia do miast nadmorskich.", en: "Nicosia is located inland. There are regular weekend bus connections from the intercity bus station to coastal cities." },

  // Listings page
  "listings.title": { pl: "Oferty zakwaterowania", en: "Accommodation listings" },
  "listings.metaTitle": { pl: "Oferty zakwaterowania — Nicosia Student Stays", en: "Accommodation listings — Nicosia Student Stays" },
  "listings.metaDesc": { pl: "Przeglądaj zweryfikowane pokoje i mieszkania w Nikozji.", en: "Browse verified rooms and apartments in Nicosia." },
  "listings.filters": { pl: "Filtry", en: "Filters" },
  "listings.clear": { pl: "Wyczyść", en: "Clear" },
  "listings.neighborhood": { pl: "Dzielnica", en: "Neighborhood" },
  "listings.all": { pl: "Wszystkie", en: "All" },
  "listings.maxPrice": { pl: "Cena max (€ / mies.)", en: "Max price (€ / mo.)" },
  "listings.maxPricePlaceholder": { pl: "np. 500", en: "e.g. 500" },
  "listings.availableNow": { pl: "Dostępne od zaraz", en: "Available immediately" },
  "listings.noOffers": { pl: "Brak ofert spełniających kryteria", en: "No offers matching the criteria" },
  "listings.noOffersSub": { pl: "Spróbuj rozluźnić filtry.", en: "Try relaxing your filters." },
  "listings.clearFilters": { pl: "Wyczyść filtry", en: "Clear filters" },

  // Listing details
  "details.back": { pl: "Wszystkie oferty", en: "All listings" },
  "details.backTo": { pl: "← Wróć do ofert", en: "← Back to listings" },
  "details.from": { pl: "od", en: "from" },
  "details.amenities": { pl: "Udogodnienia", en: "Amenities" },
  "details.rules": { pl: "Regulamin", en: "House Rules" },
  "details.nearby": { pl: "Pobliskie miejsca", en: "Nearby places" },
  "details.neighborhood": { pl: "Okolica", en: "Neighborhood" },
  "details.seeAllIn": { pl: "Zobacz wszystkie oferty w", en: "See all offers in" },
  "details.priceSuffix": { pl: "/ miesiąc", en: "/ month" },
  "details.seeDetails": { pl: "Zobacz szczegóły →", en: "See details →" },
  "details.manualNotice": { pl: "Brak automatycznej rezerwacji. Właściciel sprawdza studentów ręcznie.", en: "No automatic booking. The owner verifies students manually." },
  "details.notFound": { pl: "Oferta nie została znaleziona", en: "Listing not found" },
  "details.waMessageDraft": { pl: "Witam, mam pytanie o ofertę", en: "Hello, I have a question about the listing" },

  // Inquiry Form
  "inquiry.metaTitle": { pl: "Zapytaj o dostępność — Nicosia Student Stays", en: "Inquire about availability — Nicosia Student Stays" },
  "inquiry.metaDesc": { pl: "Wyślij zapytanie o dostępność wybranej oferty zakwaterowania w Nikozji.", en: "Send an inquiry about the availability of the selected accommodation in Nicosia." },
  "inquiry.title": { pl: "Zapytaj o dostępność", en: "Inquire about availability" },
  "inquiry.subtitle": { pl: "Wypełnij formularz — właściciel ręcznie potwierdzi dostępność i skontaktuje się z Tobą. Brak automatycznej rezerwacji.", en: "Fill out the form — the owner will manually confirm availability and contact you. No automatic booking." },
  "inquiry.fullName": { pl: "Imię i nazwisko", en: "Full name" },
  "inquiry.email": { pl: "E-mail", en: "Email" },
  "inquiry.whatsapp": { pl: "Numer WhatsApp", en: "WhatsApp number" },
  "inquiry.institution": { pl: "Uczelnia / firma stażowa", en: "University / internship company" },
  "inquiry.optional": { pl: "Opcjonalne", en: "Optional" },
  "inquiry.moveIn": { pl: "Data wprowadzenia", en: "Move-in date" },
  "inquiry.moveOut": { pl: "Data wyprowadzki", en: "Move-out date" },
  "inquiry.listing": { pl: "Oferta", en: "Listing" },
  "inquiry.selectListing": { pl: "Wybierz ofertę", en: "Select a listing" },
  "inquiry.tenants": { pl: "Liczba najemców", en: "Number of tenants" },
  "inquiry.message": { pl: "Wiadomość", en: "Message" },
  "inquiry.messagePlaceholder": { pl: "Opowiedz krótko o sobie i pobycie...", en: "Tell us a bit about yourself and your stay..." },
  "inquiry.send": { pl: "Wyślij zapytanie", en: "Send inquiry" },
  "inquiry.cancel": { pl: "Anuluj", en: "Cancel" },
  "inquiry.success": { pl: "Zapytanie wysłane", en: "Inquiry sent" },
  "inquiry.successDesc": { pl: "Twoje zapytanie zostało wysłane. Właściciel skontaktuje się z Tobą po sprawdzeniu dostępności.", en: "Your inquiry has been sent. The owner will contact you after verifying availability." },
  "inquiry.close": { pl: "Zamknij", en: "Close" },
  "inquiry.error": { pl: "Coś poszło nie tak. Spróbuj ponownie.", en: "Something went wrong. Please try again." },

  // Validation messages
  "validation.fullName": { pl: "Podaj imię i nazwisko", en: "Please enter your full name" },
  "validation.email": { pl: "Nieprawidłowy e-mail", en: "Invalid email address" },
  "validation.whatsapp": { pl: "Podaj numer WhatsApp", en: "Please enter your WhatsApp number" },
  "validation.moveIn": { pl: "Wybierz datę wprowadzenia", en: "Select move-in date" },
  "validation.moveOut": { pl: "Wybierz datę wyprowadzki", en: "Select move-out date" },
  "validation.listing": { pl: "Wybierz ofertę", en: "Please select a listing" },
  "validation.message": { pl: "Wiadomość musi mieć co najmniej 10 znaków", en: "Message must be at least 10 characters" },
  "validation.moveOutAfter": { pl: "Data wyprowadzki musi być po dacie wprowadzenia", en: "Move-out date must be after move-in date" },

  // About Page
  "about.metaTitle": { pl: "O nas — Nicosia Student Stays", en: "About us — Nicosia Student Stays" },
  "about.metaDesc": { pl: "Poznaj naszą platformę zakwaterowania studenckiego w Nikozji.", en: "Learn more about our student accommodation platform in Nicosia." },
  "about.title": { pl: "O nas", en: "About us" },
  "about.subtitle": { pl: "Nicosia Student Stays to mała, lokalna platforma pomagająca studentom Erasmusa, stażystom i studentom zagranicznym znaleźć przyjazne, krótkoterminowe zakwaterowanie w Nikozji.", en: "Nicosia Student Stays is a small, local platform helping Erasmus students, interns, and international students find friendly, short-term accommodation in Nicosia." },
  "about.p1": { pl: "Nie jesteśmy automatyczną platformą rezerwacyjną. Każda oferta jest weryfikowana, a każde zapytanie sprawdzane ręcznie przez właściciela. Dzięki temu zarówno studenci, jak i wynajmujący czują się bezpiecznie.", en: "We are not an automated booking platform. Each listing is verified, and every inquiry is checked manually by the owner. This makes both students and landlords feel safe." },
  "about.p2": { pl: "Skupiamy się wyłącznie na Nikozji — znamy każdą dzielnicę, połączenia autobusowe i okolice uczelni. Pomagamy znaleźć miejsce, które naprawdę pasuje do Twojego pobytu.", en: "We focus exclusively on Nicosia — we know every district, bus connection, and university vicinity. We help you find a place that truly fits your stay." },
  "about.demo": { pl: "Projekt demonstracyjny — wszystkie oferty, dane kontaktowe i zdjęcia są fikcyjne.", en: "Demonstration project — all listings, contact details, and photos are fictional." },

  // FAQ Page
  "faq.title": { pl: "Najczęstsze pytania", en: "Frequently Asked Questions" },
  "faq.metaTitle": { pl: "FAQ — Nicosia Student Stays", en: "FAQ — Nicosia Student Stays" },
  "faq.metaDesc": { pl: "Odpowiedzi na najczęstsze pytania o zakwaterowanie studenckie w Nikozji.", en: "Answers to the most common questions about student accommodation in Nicosia." },

  // Owner Login
  "owner.login.metaTitle": { pl: "Logowanie — Panel właściciela", en: "Login — Owner panel" },
  "owner.login.title": { pl: "Panel właściciela", en: "Owner panel" },
  "owner.login.sub": { pl: "Zaloguj się, aby zarządzać ofertami.", en: "Log in to manage your listings." },
  "owner.login.email": { pl: "E-mail", en: "Email" },
  "owner.login.password": { pl: "Hasło", en: "Password" },
  "owner.login.error": { pl: "Nieprawidłowy e-mail lub hasło.", en: "Invalid email or password." },
  "owner.login.submit": { pl: "Zaloguj", en: "Log in" },
  "owner.login.demo": { pl: "Demo: owner@nicosiastays.demo / demo123", en: "Demo: owner@nicosiastays.demo / demo123" },
  "owner.login.back": { pl: "← Wróć do strony głównej", en: "← Back to home page" },

  // Owner Dashboard
  "owner.dash.title": { pl: "Dashboard", en: "Dashboard" },
  "owner.dash.sub": { pl: "Krótki przegląd Twoich ofert i zapytań.", en: "Quick overview of your listings and inquiries." },
  "owner.dash.allListings": { pl: "Wszystkie oferty", en: "All listings" },
  "owner.dash.available": { pl: "Dostępne", en: "Available" },
  "owner.dash.newInquiries": { pl: "Nowe zapytania", en: "New inquiries" },
  "owner.dash.allInquiries": { pl: "Wszystkie zapytania", en: "All inquiries" },
  "owner.dash.recentInquiries": { pl: "Ostatnie zapytania", en: "Recent inquiries" },
  "owner.dash.recentInquiriesLink": { pl: "Wszystkie →", en: "All →" },
  "owner.dash.noInquiries": { pl: "Brak zapytań. Zostaną tu wyświetlone, gdy ktoś wyśle formularz.", en: "No inquiries. They will appear here when someone submits the form." },
  "owner.dash.myListings": { pl: "Twoje oferty", en: "Your listings" },
  "owner.dash.myListingsLink": { pl: "Zarządzaj →", en: "Manage →" },
  "owner.dash.new": { pl: "Nowe", en: "New" },

  // Owner Inquiries List
  "owner.inq.title": { pl: "Zapytania", en: "Inquiries" },
  "owner.inq.all": { pl: "Wszystkie", en: "All" },
  "owner.inq.empty": { pl: "Brak zapytań w tej kategorii.", en: "No inquiries in this category." },
  "owner.inq.tenant": { pl: "najemca", en: "tenant" },
  "owner.inq.tenants": { pl: "najemców", en: "tenants" },

  // Owner Inquiry Detail
  "owner.inqDetail.back": { pl: "← Wszystkie zapytania", en: "← All inquiries" },
  "owner.inqDetail.notFound": { pl: "Zapytanie nie znaleziono.", en: "Inquiry not found." },
  "owner.inqDetail.viewListing": { pl: "Zobacz ofertę", en: "View listing" },
  "owner.inqDetail.email": { pl: "E-mail", en: "Email" },
  "owner.inqDetail.whatsapp": { pl: "WhatsApp", en: "WhatsApp" },
  "owner.inqDetail.institution": { pl: "Uczelnia / firma", en: "University / company" },
  "owner.inqDetail.tenants": { pl: "Liczba najemców", en: "Number of tenants" },
  "owner.inqDetail.moveIn": { pl: "Wprowadzenie", en: "Move-in" },
  "owner.inqDetail.moveOut": { pl: "Wyprowadzka", en: "Move-out" },
  "owner.inqDetail.message": { pl: "Wiadomość", en: "Message" },
  "owner.inqDetail.replyWa": { pl: "Odpowiedz przez WhatsApp", en: "Reply via WhatsApp" },
  "owner.inqDetail.replyEmail": { pl: "Odpowiedz e-mailem", en: "Reply by email" },
  "owner.inqDetail.openFb": { pl: "Otwórz Facebook", en: "Open Facebook" },
  "owner.inqDetail.markAnswered": { pl: "Oznacz jako odpowiedziane", en: "Mark as answered" },
  "owner.inqDetail.archive": { pl: "Zarchiwizuj", en: "Archive" },
  "owner.inqDetail.noteLabel": { pl: "Notatka właściciela (widoczna tylko dla Ciebie)", en: "Owner's notes (visible only to you)" },
  "owner.inqDetail.notePlaceholder": { pl: "Notatki dla siebie...", en: "Notes for yourself..." },
  "owner.inqDetail.waDraftPrefix": { pl: "Witam", en: "Hello" },
  "owner.inqDetail.waDraftThanks": { pl: "dziękuję za zapytanie o ofertę", en: "thank you for your inquiry about the listing" },

  // Owner Listings Index
  "owner.list.title": { pl: "Moje oferty", en: "My listings" },
  "owner.list.countSuffix": { pl: "ofert", en: "listings" },
  "owner.list.add": { pl: "Dodaj ofertę", en: "Add listing" },
  "owner.list.thOffer": { pl: "Oferta", en: "Listing" },
  "owner.list.thNeigh": { pl: "Dzielnica", en: "Neighborhood" },
  "owner.list.thPrice": { pl: "Cena", en: "Price" },
  "owner.list.thStatus": { pl: "Status", en: "Status" },
  "owner.list.thActions": { pl: "Akcje", en: "Actions" },
  "owner.list.empty": { pl: "Brak ofert. Dodaj pierwszą ofertę.", en: "No listings. Add your first listing." },
  "owner.list.deleteConfirm": { pl: "Usunąć ofertę?", en: "Delete this listing?" },
  "owner.list.deleteSub": { pl: "Tej operacji nie można cofnąć.", en: "This operation cannot be undone." },
  "owner.list.deleteCancel": { pl: "Anuluj", en: "Cancel" },
  "owner.list.deleteConfirmBtn": { pl: "Usuń", en: "Delete" },

  // Listing Form
  "form.title": { pl: "Tytuł", en: "Title" },
  "form.neighborhood": { pl: "Dzielnica", en: "Neighborhood" },
  "form.price": { pl: "Cena (€ / mies.)", en: "Price (€ / mo.)" },
  "form.availableFrom": { pl: "Dostępne od", en: "Available from" },
  "form.status": { pl: "Status", en: "Status" },
  "form.roomType": { pl: "Typ pokoju", en: "Room type" },
  "form.roomTypePlaceholder": { pl: "np. Pokój prywatny w mieszkaniu współdzielonym", en: "e.g. Private room in a shared apartment" },
  "form.shortDesc": { pl: "Krótki opis", en: "Short description" },
  "form.desc": { pl: "Opis", en: "Description" },
  "form.amenities": { pl: "Udogodnienia", en: "Amenities" },
  "form.images": { pl: "Zdjęcia (jeden URL w linii)", en: "Photos (one URL per line)" },
  "form.rules": { pl: "Regulamin (każdy punkt w linii)", en: "House Rules (one point per line)" },
  "form.nearby": { pl: "Pobliskie miejsca (każde w linii)", en: "Nearby places (each on a new line)" },
  "form.whatsapp": { pl: "WhatsApp", en: "WhatsApp" },
  "form.fb": { pl: "Facebook URL", en: "Facebook URL" },
  "form.fbPlaceholder": { pl: "https://facebook.com/...", en: "https://facebook.com/..." },
  "form.valTitle": { pl: "Tytuł wymagany", en: "Title is required" },
  "form.valRequired": { pl: "Wymagane", en: "Required" },
  "form.valUrl": { pl: "Wymagany URL", en: "Required URL" },
  "form.editTitle": { pl: "Edytuj ofertę", en: "Edit listing" },
  "form.saveChanges": { pl: "Zapisz zmiany", en: "Save changes" },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("pl");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nicosia-student-stays-lang");
      if (stored === "pl" || stored === "en") {
        setLanguageState(stored);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("nicosia-student-stays-lang", lang);
    }
  };

  const t = (key: string): string => {
    const val = UI_TRANSLATIONS[key];
    if (!val) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return val[language];
  };

  // Pluralized listing/tenant count formatting
  const tCount = (count: number): string => {
    if (language === "pl") {
      // Polish plurals
      if (count === 1) return "1 oferta";
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        return `${count} oferty`;
      }
      return `${count} ofert`;
    } else {
      // English plurals
      if (count === 1) return "1 listing";
      return `${count} listings`;
    }
  };

  const translateAmenity = (a: Amenity): string => {
    const val = AMENITY_TRANSLATIONS[a];
    return val ? val[language] : a;
  };

  const translateStatus = (s: ListingStatus): string => {
    const val = STATUS_TRANSLATIONS[s];
    return val ? val[language] : s;
  };

  const translateInquiryStatus = (s: InquiryStatus): string => {
    const val = INQUIRY_STATUS_TRANSLATIONS[s];
    return val ? val[language] : s;
  };

  const getListing = (listing: Listing): Listing => {
    const overrides = LISTING_TRANSLATIONS[listing.id];
    if (overrides && overrides[language]) {
      return {
        ...listing,
        ...overrides[language],
      };
    }
    return listing;
  };

  const getNeighborhoodDesc = (n: Neighborhood): string => {
    const trans = NEIGHBORHOOD_TRANSLATIONS[n];
    return trans ? trans[language].description : "";
  };

  const getNeighborhoodNearby = (n: Neighborhood): string[] => {
    const trans = NEIGHBORHOOD_TRANSLATIONS[n];
    return trans ? trans[language].nearby : [];
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tCount,
        getListing,
        getNeighborhoodDesc,
        getNeighborhoodNearby,
        translateAmenity,
        translateStatus,
        translateInquiryStatus,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
