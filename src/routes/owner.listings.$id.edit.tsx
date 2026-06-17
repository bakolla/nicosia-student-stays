import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ListingForm } from "@/components/listing-form";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/owner/listings/$id/edit")({
  component: EditListing,
});

function EditListing() {
  const { id } = Route.useParams();
  const listing = useAppStore((s) => s.listings.find((l) => l.id === id));
  const update = useAppStore((s) => s.updateListing);
  const navigate = useNavigate();

  if (!listing) {
    return (
      <div>
        <p>Oferta nie znaleziona.</p>
        <Link to="/owner/listings" className="text-accent hover:underline">← Wróć</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl">Edytuj ofertę</h1>
      <ListingForm
        initial={listing}
        submitLabel="Zapisz zmiany"
        onSubmit={(data) => {
          update(id, data);
          navigate({ to: "/owner/listings" });
        }}
      />
    </div>
  );
}
