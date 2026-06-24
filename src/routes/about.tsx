import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "O nas — Nicosia Student Stays" },
      {
        name: "description",
        content: "Poznaj naszą platformę zakwaterowania studenckiego w Nikozji.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { language, t } = useLanguage();

  useEffect(() => {
    document.title = language === "pl"
      ? "O nas — Nicosia Student Stays"
      : "About us — Nicosia Student Stays";
  }, [language]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl">{t("about.title")}</h1>
        <p className="mt-5 text-lg text-muted-foreground font-sans">
          {t("about.subtitle")}
        </p>

        <div className="mt-10 space-y-6 text-foreground/90 font-sans">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <p className="text-sm text-muted-foreground">{t("about.demo")}</p>
        </div>
      </div>
    </div>
  );
}
