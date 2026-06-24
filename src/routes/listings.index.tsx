import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { ListingCard } from "@/components/listing-card";
import { NEIGHBORHOODS, type Neighborhood } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

type Search = { neighborhood?: Neighborhood };

export const Route = createFileRoute("/listings/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    neighborhood: NEIGHBORHOODS.includes(s.neighborhood as Neighborhood)
      ? (s.neighborhood as Neighborhood)
      : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Oferty zakwaterowania — Nicosia Student Stays" },
      { name: "description", content: "Przeglądaj zweryfikowane pokoje i mieszkania w Nikozji." },
    ],
  }),
  component: ListingsPage,
});

function ListingsPage() {
  const search = Route.useSearch();
  const listings = useAppStore((s) => s.listings);
  const { language, t, tCount, translateAmenity } = useLanguage();

  useEffect(() => {
    document.title = language === "pl"
      ? "Oferty zakwaterowania — Nicosia Student Stays"
      : "Accommodation listings — Nicosia Student Stays";
  }, [language]);

  const [neighborhood, setNeighborhood] = useState<Neighborhood | "all">(
    search.neighborhood ?? "all",
  );
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [availableNow, setAvailableNow] = useState(false);
  const [privateBath, setPrivateBath] = useState(false);
  const [ac, setAc] = useState(false);
  const [bills, setBills] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 3;

  const filtered = useMemo(() => {
    const now = new Date();
    return listings.filter((l) => {
      if (neighborhood !== "all" && l.neighborhood !== neighborhood) return false;
      if (maxPrice !== "" && l.pricePerMonth > Number(maxPrice)) return false;
      if (availableNow && new Date(l.availableFrom) > now) return false;
      if (privateBath && !l.amenities.includes("private_bath")) return false;
      if (ac && !l.amenities.includes("ac")) return false;
      if (bills && !l.amenities.includes("bills")) return false;
      return true;
    });
  }, [listings, neighborhood, maxPrice, availableNow, privateBath, ac, bills]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [neighborhood, maxPrice, availableNow, privateBath, ac, bills]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const goTo = useCallback((p: number) => setPage(Math.min(Math.max(1, p), totalPages)), [totalPages]);

  const reset = () => {
    setNeighborhood("all");
    setMaxPrice("");
    setAvailableNow(false);
    setPrivateBath(false);
    setAc(false);
    setBills(false);
    setPage(1);
  };

  const countText = language === "pl"
    ? `${tCount(filtered.length)} w Nikozji`
    : `${tCount(filtered.length)} in Nicosia`;

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl">{t("listings.title")}</h1>
        <p className="mt-2 text-muted-foreground">{countText}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">{t("listings.filters")}</h2>
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
              {t("listings.clear")}
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("listings.neighborhood")}</Label>
            <Select
              value={neighborhood}
              onValueChange={(v) => setNeighborhood(v as Neighborhood | "all")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("listings.all")}</SelectItem>
                {NEIGHBORHOODS.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("listings.maxPrice")}</Label>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder={t("listings.maxPricePlaceholder")}
            />
          </div>

          <div className="space-y-3 pt-2">
            <FilterCheck
              checked={availableNow}
              onChange={setAvailableNow}
              label={t("listings.availableNow")}
            />
            <FilterCheck
              checked={privateBath}
              onChange={setPrivateBath}
              label={translateAmenity("private_bath")}
            />
            <FilterCheck checked={ac} onChange={setAc} label={translateAmenity("ac")} />
            <FilterCheck checked={bills} onChange={setBills} label={translateAmenity("bills")} />
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="font-display text-xl">{t("listings.noOffers")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("listings.noOffersSub")}</p>
              <Button onClick={reset} variant="outline" className="mt-4">
                {t("listings.clearFilters")}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                {paginated.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goTo(page - 1)}
                    disabled={page === 1}
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    {language === "pl" ? "← Poprzednia" : "← Previous"}
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => goTo(p)}
                        className={`h-9 w-9 rounded-lg border text-sm transition-colors cursor-pointer ${
                          p === page
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border bg-card hover:bg-secondary"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goTo(page + 1)}
                    disabled={page === totalPages}
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    {language === "pl" ? "Następna →" : "Next →"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterCheck({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} />
      <span>{label}</span>
    </label>
  );
}
