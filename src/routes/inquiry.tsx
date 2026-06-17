import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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

export const Route = createFileRoute("/inquiry")({
  validateSearch: (s: Record<string, unknown>) => ({
    listing: typeof s.listing === "string" ? s.listing : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Zapytaj o dostępność — Nicosia Student Stays" },
      { name: "description", content: "Wyślij zapytanie o dostępność wybranej oferty zakwaterowania w Nikozji." },
    ],
  }),
  component: InquiryPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Podaj imię i nazwisko").max(100),
    email: z.string().trim().email("Nieprawidłowy e-mail").max(255),
    whatsapp: z.string().trim().min(5, "Podaj numer WhatsApp").max(40),
    institution: z.string().trim().max(120).optional().default(""),
    moveIn: z.string().min(1, "Wybierz datę wprowadzenia"),
    moveOut: z.string().min(1, "Wybierz datę wyprowadzki"),
    listingId: z.string().min(1, "Wybierz ofertę"),
    tenants: z.number().int().min(1).max(10),
    message: z.string().trim().min(10, "Wiadomość musi mieć co najmniej 10 znaków").max(1000),
  })
  .refine((d) => new Date(d.moveOut) > new Date(d.moveIn), {
    message: "Data wyprowadzki musi być po dacie wprowadzenia",
    path: ["moveOut"],
  });

type FormData = z.input<typeof schema>;

function InquiryPage() {
  const { listing: preselected } = Route.useSearch();
  const listings = useAppStore((s) => s.listings);
  const addInquiry = useAppStore((s) => s.addInquiry);
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl">Zapytaj o dostępność</h1>
        <p className="mt-3 text-muted-foreground">
          Wypełnij formularz — właściciel ręcznie potwierdzi dostępność i skontaktuje się z Tobą.
          Brak automatycznej rezerwacji.
        </p>

        {status === "success" ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            <h2 className="font-display text-2xl">Zapytanie wysłane</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Twoje zapytanie zostało wysłane. Właściciel skontaktuje się z Tobą po sprawdzeniu
              dostępności.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => navigate({ to: "/listings" })}>
                Zobacz oferty
              </Button>
              <Button onClick={() => navigate({ to: "/" })} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Strona główna
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <Field label="Imię i nazwisko" error={errors.fullName?.message}>
              <Input {...register("fullName")} autoComplete="name" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="E-mail" error={errors.email?.message}>
                <Input type="email" {...register("email")} autoComplete="email" />
              </Field>
              <Field label="Numer WhatsApp" error={errors.whatsapp?.message}>
                <Input {...register("whatsapp")} placeholder="+357 ..." />
              </Field>
            </div>
            <Field label="Uczelnia / firma stażowa" error={errors.institution?.message}>
              <Input {...register("institution")} placeholder="Opcjonalne" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Data wprowadzenia" error={errors.moveIn?.message}>
                <Input type="date" {...register("moveIn")} />
              </Field>
              <Field label="Data wyprowadzki" error={errors.moveOut?.message}>
                <Input type="date" {...register("moveOut")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
              <Field label="Oferta" error={errors.listingId?.message}>
                <Select
                  value={watch("listingId")}
                  onValueChange={(v) => setValue("listingId", v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz ofertę" />
                  </SelectTrigger>
                  <SelectContent>
                    {listings.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Liczba najemców" error={errors.tenants?.message}>
                <Input type="number" min={1} max={10} {...register("tenants", { valueAsNumber: true })} />
              </Field>
            </div>
            <Field label="Wiadomość" error={errors.message?.message}>
              <Textarea rows={5} {...register("message")} placeholder="Opowiedz krótko o sobie i pobycie..." />
            </Field>

            {status === "error" && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> Coś poszło nie tak. Spróbuj ponownie.
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" size="lg" disabled={status === "loading"} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                Wyślij zapytanie
              </Button>
            </div>
          </form>
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
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
