import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { ListingCard } from "@/components/listing-card";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { Button } from "@/components/ui/button";
import { Badge, BedDouble, CalendarCheck, MapPin, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { NEIGHBORHOODS, NEIGHBORHOOD_INFO } from "@/lib/types";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nicosia Student Stays — Zakwaterowanie dla studentów w Nikozji" },
      {
        name: "description",
        content:
          "Krótkoterminowe pokoje i mieszkania dla studentów Erasmusa, stażystów i studentów zagranicznych w Nikozji.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const listings = useAppStore((s) => s.listings);
  const featured = useMemo(() => listings.filter((l) => l.status === "available").slice(0, 3), [listings]);
  const [askOpen, setAskOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Nikozja, Cypr · Krótkoterminowo
            </p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Znajdź zakwaterowanie dla studentów w Nikozji
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Krótkoterminowe pokoje i mieszkania dla studentów Erasmusa, stażystów i studentów
              zagranicznych.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/listings">Przeglądaj zakwaterowanie</Link>
              </Button>
              <Button
                size="lg"
                onClick={() => setAskOpen(true)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Zapytaj o dostępność
              </Button>
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground sm:grid-cols-2">
              <Feature icon={<ShieldCheck className="h-4 w-4" />} text="Zweryfikowane pokoje przyjazne studentom" />
              <Feature icon={<CalendarCheck className="h-4 w-4" />} text="Ręczne potwierdzenie dostępności" />
              <Feature icon={<BedDouble className="h-4 w-4" />} text="Brak automatycznej rezerwacji" />
              <Feature icon={<MapPin className="h-4 w-4" />} text="Lokalne dzielnice Nikozji" />
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
              <img
                src={heroImg}
                alt="Śródziemnomorski dziedziniec w Nikozji"
                width={1600}
                height={1024}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:block">
              <div className="text-xs text-muted-foreground">Średnia cena pokoju</div>
              <div className="font-display text-2xl">€420 / mies.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Polecane"
          title="Wybrane oferty"
          action={<Link to="/listings" className="text-sm text-accent hover:underline">Zobacz wszystkie →</Link>}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="bg-secondary/40 py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Dzielnice" title="Gdzie zamieszkać w Nikozji" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NEIGHBORHOODS.map((n) => (
              <Link
                key={n}
                to="/listings"
                search={{ neighborhood: n } as never}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-2 text-sm text-accent">
                  <MapPin className="h-4 w-4" /> {n}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{NEIGHBORHOOD_INFO[n].description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ short */}
      <section className="container-page py-16">
        <SectionHeader eyebrow="FAQ" title="Najczęstsze pytania" />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {SHORT_FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
              <div className="font-display text-lg">{f.q}</div>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/faq" className="text-sm text-accent hover:underline">
            Wszystkie pytania →
          </Link>
        </div>
      </section>

      <InquiryDialog open={askOpen} onOpenChange={setAskOpen} />
    </>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 text-accent">{icon}</span>
      <span>{text}</span>
    </li>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="mb-2 text-xs uppercase tracking-widest text-accent">{eyebrow}</div>
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

const SHORT_FAQ = [
  {
    q: "Czy mogę zarezerwować online?",
    a: "Nie. Składasz zapytanie, a właściciel ręcznie potwierdza dostępność i kontaktuje się z Tobą bezpośrednio.",
  },
  {
    q: "Jak długo mogę zostać?",
    a: "Oferty są przeznaczone na pobyty krótkoterminowe — od 1 miesiąca do całego semestru lub stażu.",
  },
  {
    q: "Czy rachunki są wliczone?",
    a: "Zależy od oferty — sprawdź sekcję udogodnień. Filtrujemy także oferty z rachunkami w cenie.",
  },
  {
    q: "Jak właściciel mnie zweryfikuje?",
    a: "Właściciel poprosi o krótkie informacje o Tobie i Twojej uczelni / stażu przez WhatsApp lub e-mail.",
  },
];
