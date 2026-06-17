import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Nicosia Student Stays" },
      { name: "description", content: "Odpowiedzi na najczęstsze pytania o zakwaterowanie studenckie w Nikozji." },
    ],
  }),
  component: FaqPage,
});

const FAQ = [
  { q: "Czy mogę zarezerwować online?", a: "Nie. Składasz zapytanie, a właściciel ręcznie potwierdza dostępność i kontaktuje się z Tobą." },
  { q: "Jak długo mogę zostać?", a: "Oferty są krótkoterminowe — od 1 miesiąca do całego semestru lub stażu." },
  { q: "Czy rachunki są wliczone?", a: "Zależy od oferty. Sprawdź sekcję udogodnień lub użyj filtra 'rachunki wliczone'." },
  { q: "Jak właściciel mnie zweryfikuje?", a: "Właściciel zwykle prosi o krótką informację o Tobie, uczelni i datach pobytu przez WhatsApp lub e-mail." },
  { q: "Czy mogę przyjechać z drugą osobą?", a: "Tak — w formularzu zapytania podaj liczbę najemców. Właściciel potwierdzi możliwość." },
  { q: "Czy to blisko plaży?", a: "Nikozja leży w głębi lądu. Z dworca autobusowego międzymiastowego są regularne weekendowe połączenia do miast nadmorskich." },
];

function FaqPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl">Najczęstsze pytania</h1>
        <Accordion type="single" collapsible className="mt-8">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
