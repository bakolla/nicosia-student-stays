import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/inquiry")({
  validateSearch: (s: Record<string, unknown>) => ({
    listing: typeof s.listing === "string" ? s.listing : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Zapytaj o dostępność — Nicosia Student Stays" },
      {
        name: "description",
        content: "Wyślij zapytanie o dostępność wybranej oferty zakwaterowania w Nikozji.",
      },
    ],
  }),
  component: InquiryPage,
});

const createSchema = (t: (key: string) => string) =>
  z
    .object({
      fullName: z.string().trim().min(2, t("validation.fullName")).max(100),
      email: z.string().trim().email(t("validation.email")).max(255),
      whatsapp: z.string().trim().min(5, t("validation.whatsapp")).max(40),
      institution: z.string().trim().max(120).optional().default(""),
      moveIn: z.string().min(1, t("validation.moveIn")),
      moveOut: z.string().min(1, t("validation.moveOut")),
      listingId: z.string().min(1, t("validation.listing")),
      tenants: z.number().int().min(1).max(10),
      message: z.string().trim().min(10, t("validation.message")).max(1000),
    })
    .refine((d) => new Date(d.moveOut) > new Date(d.moveIn), {
      message: t("validation.moveOutAfter"),
      path: ["moveOut"],
    });

type FormData = {
  fullName: string;
  email: string;
  whatsapp: string;
  institution: string;
  moveIn: string;
  moveOut: string;
  listingId: string;
  tenants: number;
  message: string;
};

function InquiryPage() {
  const { listing: preselected } = Route.useSearch();
  const listings = useAppStore((s) => s.listings);
  const addInquiry = useAppStore((s) => s.addInquiry);
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { language, t, getListing } = useLanguage();

  useEffect(() => {
    document.title = language === "pl"
      ? "Zapytaj o dostępność — Nicosia Student Stays"
      : "Inquire about availability — Nicosia Student Stays";
  }, [language]);

  const schema = useMemo(() => createSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      institution: "",
      moveIn: "",
      moveOut: "",
      listingId: preselected ?? "",
      tenants: 1,
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 600));
      const listing = listings.find((l) => l.id === data.listingId);
      addInquiry({
        listingId: data.listingId,
        listingTitle: listing?.title ?? "Oferta",
        fullName: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        institution: data.institution ?? "",
        moveIn: data.moveIn,
        moveOut: data.moveOut,
        tenants: data.tenants,
        message: data.message,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  });

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl font-sans">
        <h1 className="font-display text-4xl sm:text-5xl">{t("inquiry.title")}</h1>
        <p className="mt-3 text-muted-foreground font-sans">
          {t("inquiry.subtitle")}
        </p>

        {status === "success" ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            <h2 className="font-display text-2xl">{t("inquiry.success")}</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              {t("inquiry.successDesc")}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => navigate({ to: "/listings" })}>
                {language === "pl" ? "Zobacz oferty" : "See listings"}
              </Button>
              <Button
                onClick={() => navigate({ to: "/" })}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {language === "pl" ? "Strona główna" : "Home"}
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <Field label={t("inquiry.fullName")} error={errors.fullName?.message}>
              <Input {...register("fullName")} autoComplete="name" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("inquiry.email")} error={errors.email?.message}>
                <Input type="email" {...register("email")} autoComplete="email" />
              </Field>
              <Field label={t("inquiry.whatsapp")} error={errors.whatsapp?.message}>
                <Input {...register("whatsapp")} placeholder="+357 ..." />
              </Field>
            </div>
            <Field
              label={`${t("inquiry.institution")} (${t("inquiry.optional")})`}
              error={errors.institution?.message}
            >
              <Input {...register("institution")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("inquiry.moveIn")} error={errors.moveIn?.message}>
                <Input type="date" {...register("moveIn")} />
              </Field>
              <Field label={t("inquiry.moveOut")} error={errors.moveOut?.message}>
                <Input type="date" {...register("moveOut")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
              <Field label={t("inquiry.listing")} error={errors.listingId?.message}>
                <Select
                  value={watch("listingId")}
                  onValueChange={(v) => setValue("listingId", v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("inquiry.selectListing")} />
                  </SelectTrigger>
                  <SelectContent>
                    {listings.map((l) => {
                      const translated = getListing(l);
                      return (
                        <SelectItem key={l.id} value={l.id}>
                          {translated.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </Field>
              <Field label={t("inquiry.tenants")} error={errors.tenants?.message}>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  {...register("tenants", { valueAsNumber: true })}
                />
              </Field>
            </div>
            <Field label={t("inquiry.message")} error={errors.message?.message}>
              <Textarea
                rows={5}
                {...register("message")}
                placeholder={t("inquiry.messagePlaceholder")}
              />
            </Field>

            {status === "error" && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> {t("inquiry.error")}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("inquiry.send")}
              </Button>
            </div>
          </form>
        )}

        {/* Demo: API error simulation button */}
        {status !== "success" && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/20 px-4 py-3 text-xs text-muted-foreground">
            <span className="flex-1">
              {language === "pl"
                ? "⚠ Symuluj błąd API (demo — bez wysyłania formularza):"
                : "⚠ Simulate API error (demo — no form submit needed):"}
            </span>
            <button
              type="button"
              onClick={() =>
                status === "error" ? setStatus("idle") : setStatus("error")
              }
              className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === "error"
                  ? "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              {status === "error"
                ? language === "pl" ? "Resetuj" : "Reset"
                : language === "pl" ? "Wyzwól błąd" : "Trigger error"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 font-sans">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
