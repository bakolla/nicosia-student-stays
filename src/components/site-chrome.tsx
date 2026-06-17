import { Link, useRouterState } from "@tanstack/react-router";
import { UserCircle2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

const nav = [
  { to: "/", label: "Start", exact: true },
  { to: "/listings", label: "Oferty", exact: false },
  { to: "/inquiry", label: "Zapytaj", exact: false },
  { to: "/about", label: "O nas", exact: false },
  { to: "/faq", label: "FAQ", exact: false },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthed = useAppStore((s) => s.isOwnerAuthed);
  const ownerPath = isAuthed ? "/owner/dashboard" : "/owner/login";

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">N</span>
          <span className="font-medium">Nicosia Student Stays</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Główna nawigacja">
          {nav.map((n) => {
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <Link
            to={ownerPath}
            aria-label="Panel właściciela"
            className="ml-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <UserCircle2 className="h-4 w-4" />
            Panel właściciela
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-page flex flex-col py-3" aria-label="Menu mobilne">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to={ownerPath}
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground"
            >
              <UserCircle2 className="h-4 w-4" /> Panel właściciela
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-page flex flex-col gap-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-base text-foreground">Nicosia Student Stays</div>
          <div>Krótkoterminowe zakwaterowanie studenckie w Nikozji.</div>
        </div>
        <div className="text-xs">
          Wszystkie oferty, kontakty i zdjęcia są fikcyjne — projekt demonstracyjny.
        </div>
      </div>
    </footer>
  );
}
