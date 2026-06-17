import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Mail, Facebook, CheckCircle2, Archive } from "lucide-react";

export const Route = createFileRoute("/owner/inquiries/$id")({
  component: InquiryDetail,
});

function InquiryDetail() {
  const { id } = Route.useParams();
  const inquiry = useAppStore((s) => s.inquiries.find((i) => i.id === id));
  const listing = useAppStore((s) =>
    inquiry ? s.listings.find((l) => l.id === inquiry.listingId) : undefined,
  );
  const setStatus = useAppStore((s) => s.setInquiryStatus);
  const setNote = useAppStore((s) => s.setInquiryNote);
  const [note, setLocalNote] = useState(inquiry?.ownerNote ?? "");

  // Auto-mark as read when first opened
  useEffect(() => {
    if (inquiry?.status === "new") setStatus(inquiry.id, "read");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquiry?.id]);

  if (!inquiry) {
    return (
      <div>
        <Link to="/owner/inquiries" className="text-accent hover:underline">← Wróć do zapytań</Link>
        <p className="mt-4">Zapytanie nie znaleziono.</p>
      </div>
    );
  }

  const waNumber = inquiry.whatsapp.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Witam ${inquiry.fullName}, dziękuję za zapytanie o ofertę "${inquiry.listingTitle}".`,
  )}`;
  const mailLink = `mailto:${inquiry.email}?subject=${encodeURIComponent(
    `Re: ${inquiry.listingTitle}`,
  )}`;

  return (
    <div className="max-w-3xl">
      <Link to="/owner/inquiries" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Wszystkie zapytania
      </Link>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl">{inquiry.fullName}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(inquiry.createdAt).toLocaleString("pl-PL")}
            </p>
          </div>
          {listing && (
            <Link
              to="/listings/$id"
              params={{ id: listing.id }}
              className="text-sm text-accent hover:underline"
            >
              Zobacz ofertę: {listing.title} ↗
            </Link>
          )}
        </div>

        <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Row k="E-mail" v={inquiry.email} />
          <Row k="WhatsApp" v={inquiry.whatsapp} />
          <Row k="Uczelnia / firma" v={inquiry.institution || "—"} />
          <Row k="Liczba najemców" v={String(inquiry.tenants)} />
          <Row k="Wprowadzenie" v={inquiry.moveIn} />
          <Row k="Wyprowadzka" v={inquiry.moveOut} />
        </dl>

        <div className="mt-6">
          <Label className="text-xs text-muted-foreground">Wiadomość</Label>
          <p className="mt-2 whitespace-pre-line rounded-lg bg-secondary/50 p-4 text-sm">
            {inquiry.message}
          </p>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href={waLink} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> Odpowiedz przez WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={mailLink}>
              <Mail className="h-4 w-4" /> Odpowiedz e-mailem
            </a>
          </Button>
          {listing && (
            <Button asChild variant="outline">
              <a href={listing.facebookUrl} target="_blank" rel="noreferrer">
                <Facebook className="h-4 w-4" /> Otwórz Facebook
              </a>
            </Button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setStatus(inquiry.id, "answered")}
            disabled={inquiry.status === "answered"}
          >
            <CheckCircle2 className="h-4 w-4" /> Oznacz jako odpowiedziane
          </Button>
          <Button
            variant="outline"
            onClick={() => setStatus(inquiry.id, "archived")}
            disabled={inquiry.status === "archived"}
          >
            <Archive className="h-4 w-4" /> Zarchiwizuj
          </Button>
        </div>

        <div className="mt-8">
          <Label className="text-xs text-muted-foreground">Notatka właściciela (widoczna tylko dla Ciebie)</Label>
          <Textarea
            value={note}
            onChange={(e) => setLocalNote(e.target.value)}
            onBlur={() => setNote(inquiry.id, note)}
            rows={3}
            className="mt-1.5"
            placeholder="Notatki dla siebie..."
          />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
