import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListingStatus } from "@/lib/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/owner/listings/")({
  component: OwnerListings,
});

function OwnerListings() {
  const listings = useAppStore((s) => s.listings);
  const setStatus = useAppStore((s) => s.setListingStatus);
  const del = useAppStore((s) => s.deleteListing);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Moje oferty</h1>
          <p className="mt-1 text-muted-foreground">{listings.length} ofert</p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/owner/listings/new">
            <Plus className="h-4 w-4" /> Dodaj ofertę
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Oferta</th>
              <th className="px-4 py-3">Dzielnica</th>
              <th className="px-4 py-3">Cena</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {listings.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={l.images[0]} alt="" className="h-10 w-14 rounded object-cover" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{l.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.neighborhood}</td>
                <td className="px-4 py-3">€{l.pricePerMonth}</td>
                <td className="px-4 py-3">
                  <Select value={l.status} onValueChange={(v) => setStatus(l.id, v as ListingStatus)}>
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Dostępny</SelectItem>
                      <SelectItem value="reserved">Zarezerwowany</SelectItem>
                      <SelectItem value="unavailable">Niedostępny</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/owner/listings/$id/edit" params={{ id: l.id }}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirm(l.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-foreground">
                  Brak ofert. Dodaj pierwszą ofertę.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć ofertę?</AlertDialogTitle>
            <AlertDialogDescription>
              Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirm) del(confirm);
                setConfirm(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
