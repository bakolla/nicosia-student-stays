import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "O nas — Nicosia Student Stays" },
      { name: "description", content: "Poznaj naszą platformę zakwaterowania studenckiego w Nikozji." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl">O nas</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Nicosia Student Stays to mała, lokalna platforma pomagająca studentom Erasmusa, stażystom
          i studentom zagranicznym znaleźć przyjazne, krótkoterminowe zakwaterowanie w Nikozji.
        </p>

        <div className="mt-10 space-y-6 text-foreground/90">
          <p>
            Nie jesteśmy automatyczną platformą rezerwacyjną. Każda oferta jest weryfikowana, a
            każde zapytanie sprawdzane ręcznie przez właściciela. Dzięki temu zarówno studenci,
            jak i wynajmujący czują się bezpiecznie.
          </p>
          <p>
            Skupiamy się wyłącznie na Nikozji — znamy każdą dzielnicę, połączenia autobusowe i
            okolice uczelni. Pomagamy znaleźć miejsce, które naprawdę pasuje do Twojego pobytu.
          </p>
          <p className="text-sm text-muted-foreground">
            Projekt demonstracyjny — wszystkie oferty, dane kontaktowe i zdjęcia są fikcyjne.
          </p>
        </div>
      </div>
    </div>
  );
}
