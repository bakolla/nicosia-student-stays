import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { LayoutDashboard, Home, Plus, Inbox, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/owner")({
  component: OwnerLayout,
});

const NAV = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/owner/listings", label: "Moje oferty", icon: Home, exact: false },
  { to: "/owner/listings/new", label: "Dodaj ofertę", icon: Plus, exact: true },
  { to: "/owner/inquiries", label: "Zapytania", icon: Inbox, exact: false },
] as const;

function OwnerLayout() {
  const isAuthed = useAppStore((s) => s.isOwnerAuthed);
  const logout = useAppStore((s) => s.logoutOwner);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!isAuthed) {
    return <OwnerLogin />;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/owner" className="flex items-center gap-2 font-display">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">N</span>
            <span>Panel właściciela</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Strona główna ↗
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="h-4 w-4" /> Wyloguj
            </Button>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex flex-col gap-1 lg:sticky lg:top-6">
            {NAV.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function OwnerLogin() {
  const login = useAppStore((s) => s.loginOwner);
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const ok = login(String(f.get("email")), String(f.get("password")));
          if (!ok) alert("Nieprawidłowe dane logowania");
        }}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
      >
        <div>
          <h1 className="font-display text-2xl">Panel właściciela</h1>
          <p className="mt-1 text-sm text-muted-foreground">Zaloguj się, aby zarządzać ofertami.</p>
        </div>
        <div className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            defaultValue="owner@nicosiastays.demo"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Hasło"
            defaultValue="demo123"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Zaloguj
        </Button>
        <div className="rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
          Demo: <code>owner@nicosiastays.demo</code> / <code>demo123</code>
        </div>
        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Wróć do strony głównej
        </Link>
      </form>
    </div>
  );
}
