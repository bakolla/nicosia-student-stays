import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { LayoutDashboard, Home, Plus, Inbox, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/owner")({
  component: OwnerLayout,
});

const NAV = [
  { to: "/owner/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/owner/listings", labelKey: "nav.myListings", icon: Home, exact: false },
  { to: "/owner/listings/new", labelKey: "nav.addListing", icon: Plus, exact: true },
  { to: "/owner/inquiries", labelKey: "nav.inquiries", icon: Inbox, exact: false },
] as const;

function OwnerLayout() {
  const isAuthed = useAppStore((s) => s.isOwnerAuthed);
  const logout = useAppStore((s) => s.logoutOwner);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();

  // Login page renders without the shell.
  const isLoginRoute = pathname === "/owner/login";

  useEffect(() => {
    // Only guard routes that are within /owner/* and not the login page itself.
    // Do NOT redirect when user is navigating away to a non-owner route (e.g. "/").
    if (!isAuthed && pathname.startsWith("/owner") && !isLoginRoute) {
      navigate({ to: "/owner/login", replace: true });
    }
  }, [isAuthed, isLoginRoute, navigate, pathname]);

  if (isLoginRoute) {
    return <Outlet />;
  }

  if (!isAuthed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary/30 font-sans">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/owner/dashboard" className="flex items-center gap-2 font-display">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
              N
            </span>
            <span>{t("owner.login.title")}</span>
          </Link>
          <div className="flex items-center gap-2 font-sans">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              {t("nav.homepage")}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                // Guard useEffect will redirect to /owner/login;
                // from there user can navigate home via the back button.
                navigate({ to: "/owner/login", replace: true });
              }}
            >
              <LogOut className="h-4 w-4" /> {t("nav.logout")}
            </Button>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex flex-col gap-1 lg:sticky lg:top-6 font-sans">
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
                  <n.icon className="h-4 w-4" /> {t(n.labelKey)}
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
