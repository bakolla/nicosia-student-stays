import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ListingForm } from "@/components/listing-form";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/owner/listings/new")({
  component: NewListing,
});

function NewListing() {
  const add = useAppStore((s) => s.addListing);
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl">Dodaj ofertę</h1>
      <ListingForm
        submitLabel="Dodaj ofertę"
        onSubmit={(data) => {
          add(data);
          navigate({ to: "/owner/listings" });
        }}
      />
    </div>
  );
}
