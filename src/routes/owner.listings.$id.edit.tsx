import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ListingForm } from "@/components/listing-form";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

export const Route = createFileRoute("/owner/listings/$id/edit")({
  component: EditListing,
});

function EditListing() {
  const { id } = Route.useParams();
  const rawListing = useAppStore((s) => s.listings.find((l) => l.id === id));
  const update = useAppStore((s) => s.updateListing);
  const navigate = useNavigate();
  const { language, t, getListing } = useLanguage();
  const listing = rawListing ? getListing(rawListing) : undefined;

  useEffect(() => {
    document.title = language === "pl"
      ? "Edytuj ofertę — Panel właściciela"
      : "Edit listing — Owner panel";
  }, [language]);

  if (!listing) {
    return (
      <div className="font-sans py-4">
        <p>{t("details.notFound")}</p>
        <Link to="/owner/listings" className="text-accent hover:underline">
          {t("owner.inqDetail.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <h1 className="mb-6 font-display text-3xl">{t("form.editTitle")}</h1>
      <ListingForm
        initial={listing}
        submitLabel={t("form.saveChanges")}
        onSubmit={(data) => {
          update(id, data);
          navigate({ to: "/owner/listings" });
        }}
      />
    </div>
  );
}
