import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Mail, Facebook, CheckCircle2, Archive } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { language, t, getListing } = useLanguage();

  const translatedListing = listing ? getListing(listing) : undefined;

  // Auto-mark as read when first opened
  useEffect(() => {
    if (inquiry?.status === "new") setStatus(inquiry.id, "read");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquiry?.id]);

  useEffect(() => {
    if (inquiry) {
      document.title = `${inquiry.fullName} — Panel właściciela`;
    }
  }, [inquiry]);

  if (!inquiry) {
    return (
      <div className="font-sans py-4">
        <Link to="/owner/inquiries" className="text-accent hover:underline">
          {t("owner.inqDetail.back")}
        </Link>
        <p className="mt-4">{t("owner.inqDetail.notFound")}</p>
      </div>
    );
  }

  const waNumber = inquiry.whatsapp.replace(/[^0-9]/g, "");
  const prefix = t("owner.inqDetail.waDraftPrefix");
  const thanks = t("owner.inqDetail.waDraftThanks");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `${prefix} ${inquiry.fullName}, ${thanks} "${translatedListing?.title ?? inquiry.listingTitle}".`,
  )}`;
  const mailLink = `mailto:${inquiry.email}?subject=${encodeURIComponent(
    `Re: ${translatedListing?.title ?? inquiry.listingTitle}`,
  )}`;

  const dateLocale = language === "pl" ? "pl-PL" : "en-US";

  return (
    <div className="max-w-3xl font-sans">
      <Link
        to="/owner/inquiries"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-sans"
      >
        <ArrowLeft className="h-4 w-4" /> {t("owner.inqDetail.back")}
      </Link>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl">{inquiry.fullName}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(inquiry.createdAt).toLocaleString(dateLocale)}
            </p>
          </div>
          {translatedListing && (
            <Link
              to="/listings/$id"
              params={{ id: translatedListing.id }}
              className="text-sm text-accent hover:underline font-sans"
            >
              {t("owner.inqDetail.viewListing")}: {translatedListing.title} ↗
            </Link>
          )}
        </div>

        <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Row k={t("owner.inqDetail.email")} v={inquiry.email} />
          <Row k={t("owner.inqDetail.whatsapp")} v={inquiry.whatsapp} />
          <Row k={t("owner.inqDetail.institution")} v={inquiry.institution || "—"} />
          <Row k={t("owner.inqDetail.tenants")} v={String(inquiry.tenants)} />
          <Row k={t("owner.inqDetail.moveIn")} v={inquiry.moveIn} />
          <Row k={t("owner.inqDetail.moveOut")} v={inquiry.moveOut} />
        </dl>

        <div className="mt-6">
          <Label className="text-xs text-muted-foreground">{t("owner.inqDetail.message")}</Label>
          <p className="mt-2 whitespace-pre-line rounded-lg bg-secondary/50 p-4 text-sm font-sans">
            {inquiry.message}
          </p>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-3 font-sans">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href={waLink} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> {t("owner.inqDetail.replyWa")}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={mailLink}>
              <Mail className="h-4 w-4" /> {t("owner.inqDetail.replyEmail")}
            </a>
          </Button>
          {translatedListing && (
            <Button asChild variant="outline">
              <a href={translatedListing.facebookUrl} target="_blank" rel="noreferrer">
                <Facebook className="h-4 w-4" /> {t("owner.inqDetail.openFb")}
              </a>
            </Button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 font-sans">
          <Button
            variant="outline"
            onClick={() => setStatus(inquiry.id, "answered")}
            disabled={inquiry.status === "answered"}
          >
            <CheckCircle2 className="h-4 w-4" /> {t("owner.inqDetail.markAnswered")}
          </Button>
          <Button
            variant="outline"
            onClick={() => setStatus(inquiry.id, "archived")}
            disabled={inquiry.status === "archived"}
          >
            <Archive className="h-4 w-4" /> {t("owner.inqDetail.archive")}
          </Button>
        </div>

        <div className="mt-8 font-sans">
          <Label className="text-xs text-muted-foreground">
            {t("owner.inqDetail.noteLabel")}
          </Label>
          <Textarea
            value={note}
            onChange={(e) => setLocalNote(e.target.value)}
            onBlur={() => setNote(inquiry.id, note)}
            rows={3}
            className="mt-1.5 font-sans"
            placeholder={t("owner.inqDetail.notePlaceholder")}
          />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="font-sans">
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
