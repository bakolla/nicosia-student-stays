import { Link, useRouterState } from "@tanstack/react-router";
import { UserCircle2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthed = useAppStore((s) => s.isOwnerAuthed);
  const ownerPath = isAuthed ? "/owner/dashboard" : "/owner/login";
  const { language, setLanguage, t } = useLanguage();

  const nav = [
    { to: "/", label: t("nav.home"), exact: true },
    { to: "/listings", label: t("nav.listings"), exact: false },
    { to: "/inquiry", label: t("nav.inquire"), exact: false },
    { to: "/about", label: t("nav.about"), exact: false },
    { to: "/faq", label: t("nav.faq"), exact: false },
  ] as const;

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
            N
          </span>
          <span className="font-medium">Nicosia Student Stays</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label={t("nav.openMenu")}>
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
            aria-label={t("nav.ownerPanel")}
            className="ml-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <UserCircle2 className="h-4 w-4" />
            {t("nav.ownerPanel")}
          </Link>

          {/* Desktop Language Switcher */}
          <div className="ml-3 flex items-center gap-1 border border-border bg-card rounded-full p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setLanguage("pl")}
              className={`rounded-full px-2 py-1 font-medium transition-colors cursor-pointer ${
                language === "pl"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              PL
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2 py-1 font-medium transition-colors cursor-pointer ${
                language === "en"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>
        </nav>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
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
              <UserCircle2 className="h-4 w-4" /> {t("nav.ownerPanel")}
            </Link>

            {/* Mobile Language Switcher */}
            <div className="mt-3 flex items-center gap-1 border border-border bg-card rounded-full p-0.5 text-xs self-start ml-3">
              <button
                type="button"
                onClick={() => {
                  setLanguage("pl");
                  setOpen(false);
                }}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                  language === "pl"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                PL
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage("en");
                  setOpen(false);
                }}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                  language === "en"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-page flex flex-col gap-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-base text-foreground">Nicosia Student Stays</div>
          <div>{t("footer.sub")}</div>
        </div>
        <div className="text-xs">
          {t("footer.notice")}
        </div>
      </div>
    </footer>
  );
}
