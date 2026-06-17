import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  AMENITY_LABELS,
  NEIGHBORHOODS,
  type Amenity,
  type Listing,
  type Neighborhood,
  type ListingStatus,
} from "@/lib/types";

const AMENITIES: Amenity[] = ["ac", "bills", "balcony", "private_bath", "washer", "bus", "wifi"];

const schema = z.object({
  title: z.string().trim().min(3, "Tytuł wymagany").max(120),
  neighborhood: z.enum(NEIGHBORHOODS as unknown as [Neighborhood, ...Neighborhood[]]),
  pricePerMonth: z.number().min(50).max(5000),
  availableFrom: z.string().min(1, "Wymagane"),
  roomType: z.string().trim().min(2).max(120),
  shortDescription: z.string().trim().min(5).max(200),
  description: z.string().trim().min(10).max(2000),
  status: z.enum(["available", "reserved", "unavailable"]),
  amenities: z.array(z.enum(AMENITIES as [Amenity, ...Amenity[]])),
  images: z.string().trim().min(5),
  houseRules: z.string().trim().optional().default(""),
  nearby: z.string().trim().optional().default(""),
  whatsapp: z.string().trim().min(3).max(40),
  facebookUrl: z.string().trim().url("Wymagany URL").or(z.literal("")),
});

export type ListingFormData = z.input<typeof schema>;

export function ListingForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<Listing>;
  onSubmit: (data: Omit<Listing, "id">) => void;
  submitLabel: string;
}) {
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

  const amenities = watch("amenities");

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
      images: data.images.split("\n").map((s) => s.trim()).filter(Boolean),
      houseRules: (data.houseRules ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
      nearby: (data.nearby ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
      whatsapp: data.whatsapp,
      facebookUrl: data.facebookUrl,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <Row>
        <Field label="Tytuł" error={errors.title?.message} span={2}>
          <Input {...register("title")} />
        </Field>
      </Row>

      <Row>
        <Field label="Dzielnica" error={errors.neighborhood?.message}>
          <Select value={watch("neighborhood")} onValueChange={(v) => setValue("neighborhood", v as Neighborhood)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NEIGHBORHOODS.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Cena (€ / mies.)" error={errors.pricePerMonth?.message}>
          <Input type="number" {...register("pricePerMonth", { valueAsNumber: true })} />
        </Field>
      </Row>

      <Row>
        <Field label="Dostępne od" error={errors.availableFrom?.message}>
          <Input type="date" {...register("availableFrom")} />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <Select value={watch("status")} onValueChange={(v) => setValue("status", v as ListingStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Dostępny</SelectItem>
              <SelectItem value="reserved">Zarezerwowany</SelectItem>
              <SelectItem value="unavailable">Niedostępny</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Row>

      <Field label="Typ pokoju" error={errors.roomType?.message}>
        <Input {...register("roomType")} placeholder="np. Pokój prywatny w mieszkaniu współdzielonym" />
      </Field>

      <Field label="Krótki opis" error={errors.shortDescription?.message}>
        <Input {...register("shortDescription")} />
      </Field>

      <Field label="Opis" error={errors.description?.message}>
        <Textarea rows={5} {...register("description")} />
      </Field>

      <div>
        <Label className="text-xs text-muted-foreground">Udogodnienia</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AMENITIES.map((a) => {
            const checked = amenities.includes(a);
            return (
              <label key={a} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    if (v) setValue("amenities", [...amenities, a]);
                    else setValue("amenities", amenities.filter((x) => x !== a));
                  }}
                />
                {AMENITY_LABELS[a]}
              </label>
            );
          })}
        </div>
      </div>

      <Field label="Zdjęcia (jeden URL w linii)" error={errors.images?.message}>
        <Textarea rows={3} {...register("images")} placeholder="https://..." />
      </Field>

      <Row>
        <Field label="Regulamin (każdy punkt w linii)">
          <Textarea rows={3} {...register("houseRules")} />
        </Field>
        <Field label="Pobliskie miejsca (każde w linii)">
          <Textarea rows={3} {...register("nearby")} />
        </Field>
      </Row>

      <Row>
        <Field label="WhatsApp" error={errors.whatsapp?.message}>
          <Input {...register("whatsapp")} />
        </Field>
        <Field label="Facebook URL" error={errors.facebookUrl?.message}>
          <Input {...register("facebookUrl")} placeholder="https://facebook.com/..." />
        </Field>
      </Row>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
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
    <div className={`space-y-1.5 ${span === 2 ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
