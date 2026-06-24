import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, MessageCircle, Facebook, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Map } from "@/components/Map";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/listings/$id")({
  component: ListingDetail,
  notFoundComponent: () => {
    const { t } = useLanguage();
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">{t("details.notFound")}</h1>
        <Link to="/listings" className="mt-4 inline-block text-accent hover:underline">
          {t("details.backTo")}
        </Link>
      </div>
    );
  },
  loader: ({ params }) => {
    if (!params.id) throw notFound();
    return null;
  },
});

function ListingDetail() {
  const { id } = Route.useParams();
  const rawListing = useAppStore((s) => s.listings.find((l) => l.id === id));
  const { language, t, getListing, translateAmenity, translateStatus, getNeighborhoodDesc } = useLanguage();
  const listing = rawListing ? getListing(rawListing) : undefined;
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (listing) {
      document.title = `${listing.title} — Nicosia Student Stays`;
    }
  }, [listing]);

  if (!listing) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">{t("details.notFound")}</h1>
        <Link to="/listings" className="mt-4 inline-block text-accent hover:underline">
          {t("details.backTo")}
        </Link>
      </div>
    );
  }

  const statusBadge =
    listing.status === "available"
      ? "bg-emerald-100 text-emerald-900"
      : listing.status === "reserved"
        ? "bg-amber-100 text-amber-900"
        : "bg-stone-200 text-stone-700";

  const waLink = `https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `${t("details.waMessageDraft")}: ${listing.title}`,
  )}`;

  return (
    <div className="container-page py-8">
      <Link
        to="/listings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("details.back")}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-3xl border border-border bg-muted"
          >
            <img
              src={listing.images[activeImg]}
              alt={listing.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </motion.div>
          {listing.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === activeImg
                      ? "border-accent"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge}`}>
                {translateStatus(listing.status)}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {listing.neighborhood}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> {t("details.from")} {listing.availableFrom}
              </span>
            </div>
            <h1 className="mt-3 font-display text-4xl">{listing.title}</h1>
            <p className="mt-2 text-muted-foreground">{listing.roomType}</p>

            <p className="mt-6 leading-relaxed text-foreground/90">{listing.description}</p>

            <Section title={t("details.amenities")}>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-sm"
                  >
                    {translateAmenity(a)}
                  </span>
                ))}
              </div>
            </Section>

            <Section title={t("details.rules")}>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {listing.houseRules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Section>

            <Section title={t("details.nearby")}>
              <div className="flex flex-wrap gap-2">
                {listing.nearby.map((n) => (
                  <span
                    key={n}
                    className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </Section>

            <Section title={t("details.neighborhood")}>
              <div className="grid gap-6 md:grid-cols-[1fr_300px] rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-card p-6">
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-accent font-semibold">
                      <MapPin className="h-4 w-4" /> {listing.neighborhood}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getNeighborhoodDesc(listing.neighborhood)}
                    </p>
                  </div>
                  <Link
                    to="/listings"
                    search={{ neighborhood: listing.neighborhood } as never}
                    className="mt-4 inline-block text-sm text-accent font-medium hover:underline"
                  >
                    {language === "pl"
                      ? `Zobacz wszystkie oferty w ${listing.neighborhood} →`
                      : `See all offers in ${listing.neighborhood} →`}
                  </Link>
                </div>
                <div className="h-[220px] md:h-auto min-h-[200px]">
                  <Map
                    highlightedNeighborhood={listing.neighborhood}
                    className="h-full w-full shadow-sm"
                  />
                </div>
              </div>
            </Section>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-display text-3xl">€{listing.pricePerMonth}</div>
                <div className="text-xs text-muted-foreground">{t("details.priceSuffix")}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge}`}>
                {translateStatus(listing.status)}
              </span>
            </div>

            {listing.status === "unavailable" ? (
              <Button
                className="mt-5 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
                disabled
              >
                {t("home.inquireBtn")}
              </Button>
            ) : (
              <Button
                asChild
                className="mt-5 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                <Link to="/inquiry" search={{ listing: listing.id }}>
                  {t("home.inquireBtn")}
                </Link>
              </Button>
            )}

            <div className="mt-3 grid gap-2">
              <Button asChild variant="outline">
                <a href={waLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={listing.facebookUrl} target="_blank" rel="noreferrer">
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {t("details.manualNotice")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
