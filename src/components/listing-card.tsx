import { Link } from "@tanstack/react-router";
import type { Listing } from "@/lib/types";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const STATUS_TONE: Record<Listing["status"], string> = {
  available: "bg-emerald-100 text-emerald-900 border-emerald-200",
  reserved: "bg-amber-100 text-amber-900 border-amber-200",
  unavailable: "bg-stone-200 text-stone-700 border-stone-300",
};

export function ListingCard({ listing: rawListing }: { listing: Listing }) {
  const { t, getListing, translateStatus, translateAmenity } = useLanguage();
  const listing = getListing(rawListing);
  const statusLabel = translateStatus(listing.status);
  const statusTone = STATUS_TONE[listing.status];

  return (
    <Link
      to="/listings/$id"
      params={{ id: listing.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={listing.images[0]}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone}`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight">{listing.title}</h3>
          <div className="shrink-0 text-right">
            <div className="font-display text-lg">€{listing.pricePerMonth}</div>
            <div className="text-xs text-muted-foreground">{t("details.priceSuffix")}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {listing.neighborhood}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{listing.shortDescription}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {listing.amenities.slice(0, 4).map((a) => (
            <span
              key={a}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {translateAmenity(a)}
            </span>
          ))}
        </div>
        <div className="mt-3 text-sm font-medium text-accent">{t("details.seeDetails")}</div>
      </div>
    </Link>
  );
}
