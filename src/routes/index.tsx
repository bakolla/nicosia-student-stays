import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { ListingCard } from "@/components/listing-card";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { Button } from "@/components/ui/button";
import { BedDouble, CalendarCheck, MapPin, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { NEIGHBORHOODS } from "@/lib/types";
import { Map } from "@/components/Map";
import { useLanguage } from "@/hooks/useLanguage";
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
  const { language, t, getNeighborhoodDesc } = useLanguage();

  useEffect(() => {
    document.title = language === "pl" 
      ? "Nicosia Student Stays — Zakwaterowanie dla studentów w Nikozji"
      : "Nicosia Student Stays — Student accommodation in Nicosia";
  }, [language]);

  const featured = useMemo(
    () => listings.filter((l) => l.status === "available").slice(0, 3),
    [listings],
  );
  const [askOpen, setAskOpen] = useState(false);

  const shortFaq = [
    {
      q: t("faq.q1"),
      a: t("faq.a1"),
    },
    {
      q: t("faq.q2"),
      a: t("faq.a2"),
    },
    {
      q: t("faq.q3"),
      a: t("faq.a3"),
    },
    {
      q: t("faq.q4"),
      a: t("faq.a4"),
    },
  ];

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
              {t("home.heroEyebrow")}
            </p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              {t("home.heroSubtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/listings">{t("home.browseBtn")}</Link>
              </Button>
              <Button
                size="lg"
                onClick={() => setAskOpen(true)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {t("home.inquireBtn")}
              </Button>
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground sm:grid-cols-2">
              <Feature
                icon={<ShieldCheck className="h-4 w-4" />}
                text={t("home.feature1")}
              />
              <Feature
                icon={<CalendarCheck className="h-4 w-4" />}
                text={t("home.feature2")}
              />
              <Feature
                icon={<BedDouble className="h-4 w-4" />}
                text={t("home.feature3")}
              />
              <Feature icon={<MapPin className="h-4 w-4" />} text={t("home.feature4")} />
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
              <div className="text-xs text-muted-foreground">{t("home.avgPriceLabel")}</div>
              <div className="font-display text-2xl">{t("home.avgPriceVal")}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow={t("home.featuredEyebrow")}
          title={t("home.featuredTitle")}
          action={
            <Link to="/listings" className="text-sm text-accent hover:underline">
              {t("home.featuredAction")}
            </Link>
          }
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
          <SectionHeader eyebrow={t("home.neighborhoodsEyebrow")} title={t("home.neighborhoodsTitle")} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_450px]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {NEIGHBORHOODS.map((n) => (
                <Link
                  key={n}
                  to="/listings"
                  search={{ neighborhood: n } as never}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-sm text-accent font-semibold">
                      <MapPin className="h-4 w-4" /> {n}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {getNeighborhoodDesc(n)}
                    </p>
                  </div>
                  <span className="mt-3 text-xs text-accent font-medium inline-flex items-center gap-1 group-hover:underline">
                    {t("home.seeOffersLink")}
                  </span>
                </Link>
              ))}
            </div>
            <div className="h-[350px] lg:h-auto min-h-[350px]">
              <Map className="h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ short */}
      <section className="container-page py-16">
        <SectionHeader eyebrow={t("home.faqEyebrow")} title={t("home.faqTitle")} />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {shortFaq.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
              <div className="font-display text-lg">{f.q}</div>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/faq" className="text-sm text-accent hover:underline">
            {t("home.faqAction")}
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
