import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Nicosia Student Stays" },
      {
        name: "description",
        content: "Odpowiedzi na najczęstsze pytania o zakwaterowanie studenckie w Nikozji.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { language, t } = useLanguage();

  useEffect(() => {
    document.title = language === "pl"
      ? "FAQ — Nicosia Student Stays"
      : "FAQ — Nicosia Student Stays";
  }, [language]);

  const faqList = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl">{t("faq.title")}</h1>
        <Accordion type="single" collapsible className="mt-8">
          {faqList.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-sans">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
