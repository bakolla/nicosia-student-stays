import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NEIGHBORHOODS,
  type Amenity,
  type Listing,
  type Neighborhood,
  type ListingStatus,
} from "@/lib/types";
import { useLanguage } from "@/hooks/useLanguage";

const AMENITIES: Amenity[] = ["ac", "bills", "balcony", "private_bath", "washer", "bus", "wifi"];

const createSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().trim().min(3, t("form.valTitle")).max(120),
    neighborhood: z.enum(NEIGHBORHOODS as unknown as [Neighborhood, ...Neighborhood[]]),
    pricePerMonth: z.number().min(50).max(5000),
    availableFrom: z.string().min(1, t("form.valRequired")),
    roomType: z.string().trim().min(2).max(120),
    shortDescription: z.string().trim().min(5).max(200),
    description: z.string().trim().min(10).max(2000),
    status: z.enum(["available", "reserved", "unavailable"]),
    amenities: z.array(z.enum(AMENITIES as [Amenity, ...Amenity[]])),
    images: z.string().trim().min(5),
    houseRules: z.string().trim().optional().default(""),
    nearby: z.string().trim().optional().default(""),
    whatsapp: z.string().trim().min(3).max(40),
    facebookUrl: z.string().trim().url(t("form.valUrl")).or(z.literal("")),
  });

export type ListingFormData = {
  title: string;
  neighborhood: Neighborhood;
  pricePerMonth: number;
  availableFrom: string;
  roomType: string;
  shortDescription: string;
  description: string;
  status: ListingStatus;
  amenities: Amenity[];
  images: string;
  houseRules?: string;
  nearby?: string;
  whatsapp: string;
  facebookUrl: string;
};

export function ListingForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<Listing>;
  onSubmit: (data: Omit<Listing, "id">) => void;
  submitLabel: string;
}) {
  const { t, translateAmenity, translateStatus } = useLanguage();
  const schema = useMemo(() => createSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      neighborhood: (initial?.neighborhood ?? "Engomi") as Neighborhood,
      pricePerMonth: initial?.pricePerMonth ?? 400,
      availableFrom: initial?.availableFrom ?? "",
      roomType: initial?.roomType ?? "",
      shortDescription: initial?.shortDescription ?? "",
      description: initial?.description ?? "",
      status: (initial?.status ?? "available") as ListingStatus,
      amenities: initial?.amenities ?? ["wifi"],
      images: initial?.images?.join("\n") ?? "",
      houseRules: initial?.houseRules?.join("\n") ?? "",
      nearby: initial?.nearby?.join("\n") ?? "",
      whatsapp: initial?.whatsapp ?? "+357 ",
      facebookUrl: initial?.facebookUrl ?? "",
    },
  });

  const amenities = watch("amenities") || [];

  const submit = handleSubmit((data) => {
    onSubmit({
      title: data.title,
      neighborhood: data.neighborhood,
      pricePerMonth: data.pricePerMonth,
      availableFrom: data.availableFrom,
      roomType: data.roomType,
      shortDescription: data.shortDescription,
      description: data.description,
      status: data.status,
      amenities: data.amenities,
      images: data.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      houseRules: (data.houseRules ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      nearby: (data.nearby ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      whatsapp: data.whatsapp,
      facebookUrl: data.facebookUrl,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-6 font-sans">
      <Row>
        <Field label={t("form.title")} error={errors.title?.message} span={2}>
          <Input {...register("title")} />
        </Field>
      </Row>

      <Row>
        <Field label={t("form.neighborhood")} error={errors.neighborhood?.message}>
          <Select
            value={watch("neighborhood")}
            onValueChange={(v) => setValue("neighborhood", v as Neighborhood)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NEIGHBORHOODS.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("form.price")} error={errors.pricePerMonth?.message}>
          <Input type="number" {...register("pricePerMonth", { valueAsNumber: true })} />
        </Field>
      </Row>

      <Row>
        <Field label={t("form.availableFrom")} error={errors.availableFrom?.message}>
          <Input type="date" {...register("availableFrom")} />
        </Field>
        <Field label={t("form.status")} error={errors.status?.message}>
          <Select
            value={watch("status")}
            onValueChange={(v) => setValue("status", v as ListingStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">{translateStatus("available")}</SelectItem>
              <SelectItem value="reserved">{translateStatus("reserved")}</SelectItem>
              <SelectItem value="unavailable">{translateStatus("unavailable")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Row>

      <Field label={t("form.roomType")} error={errors.roomType?.message}>
        <Input
          {...register("roomType")}
          placeholder={t("form.roomTypePlaceholder")}
        />
      </Field>

      <Field label={t("form.shortDesc")} error={errors.shortDescription?.message}>
        <Input {...register("shortDescription")} />
      </Field>

      <Field label={t("form.desc")} error={errors.description?.message}>
        <Textarea rows={5} {...register("description")} />
      </Field>

      <div>
        <Label className="text-xs text-muted-foreground">{t("form.amenities")}</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 font-sans">
          {AMENITIES.map((a) => {
            const checked = amenities.includes(a);
            return (
              <label
                key={a}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    if (v) setValue("amenities", [...amenities, a]);
                    else
                      setValue(
                        "amenities",
                        amenities.filter((x) => x !== a),
                      );
                  }}
                />
                {translateAmenity(a)}
              </label>
            );
          })}
        </div>
      </div>

      <Field label={t("form.images")} error={errors.images?.message}>
        <Textarea rows={3} {...register("images")} placeholder="https://..." />
      </Field>

      <Row>
        <Field label={t("form.rules")}>
          <Textarea rows={3} {...register("houseRules")} />
        </Field>
        <Field label={t("form.nearby")}>
          <Textarea rows={3} {...register("nearby")} />
        </Field>
      </Row>

      <Row>
        <Field label={t("form.whatsapp")} error={errors.whatsapp?.message}>
          <Input {...register("whatsapp")} />
        </Field>
        <Field label={t("form.fb")} error={errors.facebookUrl?.message}>
          <Input {...register("facebookUrl")} placeholder={t("form.fbPlaceholder")} />
        </Field>
      </Row>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  error,
  children,
  span,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  span?: 2;
}) {
  return (
    <div className={`space-y-1.5 font-sans ${span === 2 ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
