import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ListingForm } from "@/components/listing-form";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

export const Route = createFileRoute("/owner/listings/new")({
  component: NewListing,
});

function NewListing() {
  const add = useAppStore((s) => s.addListing);
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  useEffect(() => {
    document.title = language === "pl"
      ? "Dodaj ofertę — Panel właściciela"
      : "Add listing — Owner panel";
  }, [language]);

  return (
    <div className="font-sans">
      <h1 className="mb-6 font-display text-3xl">{t("owner.list.add")}</h1>
      <ListingForm
        submitLabel={t("owner.list.add")}
        onSubmit={(data) => {
          add(data);
          navigate({ to: "/owner/listings" });
        }}
      />
    </div>
  );
}
