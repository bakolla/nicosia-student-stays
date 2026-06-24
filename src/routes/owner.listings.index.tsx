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
import { useState, useEffect } from "react";
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
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/owner/listings/")({
  component: OwnerListings,
});

function OwnerListings() {
  const listings = useAppStore((s) => s.listings);
  const setStatus = useAppStore((s) => s.setListingStatus);
  const del = useAppStore((s) => s.deleteListing);
  const [confirm, setConfirm] = useState<string | null>(null);
  const { language, t, translateStatus, getListing } = useLanguage();

  useEffect(() => {
    document.title = language === "pl"
      ? "Moje oferty — Panel właściciela"
      : "My listings — Owner panel";
  }, [language]);

  return (
    <div className="font-sans">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">{t("owner.list.title")}</h1>
          <p className="mt-1 text-muted-foreground font-sans">
            {listings.length} {t("owner.list.countSuffix")}
          </p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/owner/listings/new">
            <Plus className="h-4 w-4" /> {t("owner.list.add")}
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground font-sans">
            <tr>
              <th className="px-4 py-3">{t("owner.list.thOffer")}</th>
              <th className="px-4 py-3">{t("owner.list.thNeigh")}</th>
              <th className="px-4 py-3">{t("owner.list.thPrice")}</th>
              <th className="px-4 py-3">{t("owner.list.thStatus")}</th>
              <th className="px-4 py-3 text-right">{t("owner.list.thActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-sans">
            {listings.map((l) => {
              const translated = getListing(l);
              return (
                <tr key={l.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={l.images[0]} alt="" className="h-10 w-14 rounded object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{translated.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{translated.neighborhood}</td>
                  <td className="px-4 py-3">€{translated.pricePerMonth}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={l.status}
                      onValueChange={(v) => setStatus(l.id, v as ListingStatus)}
                    >
                      <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">{translateStatus("available")}</SelectItem>
                        <SelectItem value="reserved">{translateStatus("reserved")}</SelectItem>
                        <SelectItem value="unavailable">{translateStatus("unavailable")}</SelectItem>
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
              );
            })}
            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-foreground">
                  {t("owner.list.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("owner.list.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("owner.list.deleteSub")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("owner.list.deleteCancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirm) del(confirm);
                setConfirm(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("owner.list.deleteConfirmBtn")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
