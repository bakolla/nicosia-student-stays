import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { Home, Inbox, MessageSquareReply, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

export const Route = createFileRoute("/owner/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const listings = useAppStore((s) => s.listings);
  const inquiries = useAppStore((s) => s.inquiries);
  const { language, t, translateStatus, getListing } = useLanguage();

  useEffect(() => {
    document.title = language === "pl"
      ? "Dashboard — Panel właściciela"
      : "Dashboard — Owner panel";
  }, [language]);

  const stats = [
    { labelKey: "owner.dash.allListings", value: listings.length, icon: Home, to: "/owner/listings" },
    {
      labelKey: "owner.dash.available",
      value: listings.filter((l) => l.status === "available").length,
      icon: CheckCircle2,
      to: "/owner/listings",
    },
    {
      labelKey: "owner.dash.newInquiries",
      value: inquiries.filter((i) => i.status === "new").length,
      icon: Inbox,
      to: "/owner/inquiries",
    },
    {
      labelKey: "owner.dash.allInquiries",
      value: inquiries.length,
      icon: MessageSquareReply,
      to: "/owner/inquiries",
    },
  ] as const;

  return (
    <div className="font-sans">
      <h1 className="font-display text-3xl">{t("owner.dash.title")}</h1>
      <p className="mt-1 text-muted-foreground font-sans">{t("owner.dash.sub")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.labelKey}
            to={s.to}
            className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-accent" />
              <span className="font-display text-3xl">{s.value}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground font-sans">{t(s.labelKey)}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel title={t("owner.dash.recentInquiries")} link={{ to: "/owner/inquiries", label: t("owner.dash.recentInquiriesLink") }}>
          {inquiries.length === 0 ? (
            <Empty>{t("owner.dash.noInquiries")}</Empty>
          ) : (
            <ul className="divide-y divide-border">
              {inquiries.slice(0, 5).map((i) => (
                <li key={i.id}>
                  <Link
                    to="/owner/inquiries/$id"
                    params={{ id: i.id }}
                    className="flex items-center justify-between gap-3 py-3 hover:text-accent font-sans"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{i.fullName}</div>
                      <div className="truncate text-xs text-muted-foreground">{i.listingTitle}</div>
                    </div>
                    {i.status === "new" && (
                      <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">
                        {t("owner.dash.new")}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={t("owner.dash.myListings")} link={{ to: "/owner/listings", label: t("owner.dash.myListingsLink") }}>
          <ul className="divide-y divide-border font-sans">
            {listings.slice(0, 5).map((l) => {
              const translated = getListing(l);
              return (
                <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0 text-sm">
                    <div className="truncate font-medium">{translated.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {translated.neighborhood} · €{translated.pricePerMonth}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {translateStatus(l.status)}
                  </span>
                </li>
              );
            })}
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
    <div className="rounded-2xl border border-border bg-card p-5 font-sans">
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
  return <div className="py-6 text-center text-sm text-muted-foreground font-sans">{children}</div>;
}
