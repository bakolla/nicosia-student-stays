# Nicosia Student Stays

Platforma demonstracyjna do krótkoterminowego zakwaterowania studenckiego w Nikozji (Cypr) — dla studentów Erasmusa, stażystów i studentów zagranicznych.

Aplikacja ma dwie warstwy:

1. **Publiczna** — przeglądanie ofert, filtrowanie, szczegóły oferty, formularz „Zapytaj o dostępność".
2. **Panel właściciela** — zarządzanie ofertami (CRUD), zmiana statusu, inbox zapytań i odpowiedzi przez WhatsApp / e-mail / Facebook.

Nie ma płatności online ani automatycznej rezerwacji — właściciel ręcznie weryfikuje studentów.

## Stack

- React 19 + TypeScript
- TanStack Start (routing, SSR-ready)
- Tailwind CSS v4 + shadcn/ui
- Zustand + `persist` (localStorage) — mock API
- React Hook Form + Zod — walidacja
- Framer Motion — mikrointerakcje

## Uruchomienie

```bash
bun install
bun run dev
```

## Demo logowania właściciela

- e-mail: `owner@nicosiastays.demo`
- hasło: `demo123`

Ikona „Panel właściciela" znajduje się w nawigacji.

## Struktura

```
src/
  assets/             — zdjęcia (hero)
  components/
    site-chrome.tsx   — nagłówek + stopka
    listing-card.tsx  — karta oferty
    listing-form.tsx  — formularz dodawania/edycji
    inquiry-dialog.tsx — formularz zapytania
    ui/               — shadcn/ui
  lib/
    types.ts          — typy + dane seed
    store.ts          — Zustand store + localStorage
  routes/
    __root.tsx        — layout główny
    index.tsx         — strona główna
    listings.tsx      — lista ofert + filtry
    listings.$id.tsx  — szczegóły oferty
    about.tsx, faq.tsx
    owner.tsx         — layout panelu + login gate
    owner.index.tsx   — dashboard
    owner.listings.*  — CRUD ofert
    owner.inquiries.* — inbox zapytań
```

## Dane

Wszystkie dane (oferty, zapytania, sesja właściciela) są przechowywane w `localStorage`
pod kluczem `nicosia-stays-v1`. Wyczyść storage przeglądarki, aby zresetować do danych seed.

## Disclaimer

Wszystkie oferty, zdjęcia, numery WhatsApp, linki Facebook i dane właściciela są **fikcyjne** —
projekt służy wyłącznie demonstracji.
