import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { useAppStore } from "@/lib/store";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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

export function InquiryDialog({
  open,
  onOpenChange,
  listingId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  listingId?: string;
}) {
  const listings = useAppStore((s) => s.listings);
  const addInquiry = useAppStore((s) => s.addInquiry);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { language, t, getListing } = useLanguage();

  const schema = useMemo(() => createSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
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
      listingId: listingId ?? "",
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

  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStatus("idle");
      reset({ ...watch(), listingId: listingId ?? "" });
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : close())}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg font-sans">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t("inquiry.title")}</DialogTitle>
          <DialogDescription className="font-sans">
            {t("inquiry.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            <p className="font-display text-lg">{t("inquiry.success")}</p>
            <p className="max-w-sm text-sm text-muted-foreground font-sans">
              {t("inquiry.successDesc")}
            </p>
            <Button onClick={close} className="mt-4">
              {t("inquiry.close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 font-sans">
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
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
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
                <Input type="number" min={1} max={10} {...register("tenants", { valueAsNumber: true })} />
              </Field>
            </div>
            <Field label={t("inquiry.message")} error={errors.message?.message}>
              <Textarea
                rows={4}
                {...register("message")}
                placeholder={t("inquiry.messagePlaceholder")}
              />
            </Field>

            {status === "error" && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> {t("inquiry.error")}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={close}>
                {t("inquiry.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("inquiry.send")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
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

