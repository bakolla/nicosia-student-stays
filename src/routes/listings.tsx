import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { ListingCard } from "@/components/listing-card";
import { NEIGHBORHOODS, AMENITY_LABELS, type Neighborhood } from "@/lib/types";
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

type Search = { neighborhood?: Neighborhood };

export const Route = createFileRoute("/listings")({
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

  const [neighborhood, setNeighborhood] = useState<Neighborhood | "all">(
    search.neighborhood ?? "all",
  );
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [availableNow, setAvailableNow] = useState(false);
  const [privateBath, setPrivateBath] = useState(false);
  const [ac, setAc] = useState(false);
  const [bills, setBills] = useState(false);

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

  const reset = () => {
    setNeighborhood("all");
    setMaxPrice("");
    setAvailableNow(false);
    setPrivateBath(false);
    setAc(false);
    setBills(false);
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl">Oferty zakwaterowania</h1>
        <p className="mt-2 text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "oferta" : "ofert"} w Nikozji
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Filtry</h2>
            <button
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Wyczyść
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Dzielnica</Label>
            <Select value={neighborhood} onValueChange={(v) => setNeighborhood(v as Neighborhood | "all")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                {NEIGHBORHOODS.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Cena max (€ / mies.)</Label>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="np. 500"
            />
          </div>

          <div className="space-y-3 pt-2">
            <FilterCheck checked={availableNow} onChange={setAvailableNow} label="Dostępne od zaraz" />
            <FilterCheck checked={privateBath} onChange={setPrivateBath} label={AMENITY_LABELS.private_bath} />
            <FilterCheck checked={ac} onChange={setAc} label={AMENITY_LABELS.ac} />
            <FilterCheck checked={bills} onChange={setBills} label={AMENITY_LABELS.bills} />
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="font-display text-xl">Brak ofert spełniających kryteria</p>
              <p className="mt-2 text-sm text-muted-foreground">Spróbuj rozluźnić filtry.</p>
              <Button onClick={reset} variant="outline" className="mt-4">Wyczyść filtry</Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
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
