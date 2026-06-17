import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { Home, Inbox, MessageSquareReply, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/owner/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const listings = useAppStore((s) => s.listings);
  const inquiries = useAppStore((s) => s.inquiries);

  const stats = [
    { label: "Wszystkie oferty", value: listings.length, icon: Home, to: "/owner/listings" },
    { label: "Dostępne", value: listings.filter((l) => l.status === "available").length, icon: CheckCircle2, to: "/owner/listings" },
    { label: "Nowe zapytania", value: inquiries.filter((i) => i.status === "new").length, icon: Inbox, to: "/owner/inquiries" },
    { label: "Wszystkie zapytania", value: inquiries.length, icon: MessageSquareReply, to: "/owner/inquiries" },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Krótki przegląd Twoich ofert i zapytań.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-accent" />
              <span className="font-display text-3xl">{s.value}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel title="Ostatnie zapytania" link={{ to: "/owner/inquiries", label: "Wszystkie →" }}>
          {inquiries.length === 0 ? (
            <Empty>Brak zapytań. Zostaną tu wyświetlone, gdy ktoś wyśle formularz.</Empty>
          ) : (
            <ul className="divide-y divide-border">
              {inquiries.slice(0, 5).map((i) => (
                <li key={i.id}>
                  <Link
                    to="/owner/inquiries/$id"
                    params={{ id: i.id }}
                    className="flex items-center justify-between gap-3 py-3 hover:text-accent"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{i.fullName}</div>
                      <div className="truncate text-xs text-muted-foreground">{i.listingTitle}</div>
                    </div>
                    {i.status === "new" && (
                      <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">Nowe</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Twoje oferty" link={{ to: "/owner/listings", label: "Zarządzaj →" }}>
          <ul className="divide-y divide-border">
            {listings.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 text-sm">
                  <div className="truncate font-medium">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.neighborhood} · €{l.pricePerMonth}</div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {l.status === "available" ? "Dostępny" : l.status === "reserved" ? "Zarezerwowany" : "Niedostępny"}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  link,
  children,
}: {
  title: string;
  link?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg">{title}</h2>
        {link && (
          <Link to={link.to} className="text-xs text-accent hover:underline">
            {link.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="py-6 text-center text-sm text-muted-foreground">{children}</div>;
}
