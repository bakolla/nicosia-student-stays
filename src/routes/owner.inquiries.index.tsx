import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import type { InquiryStatus } from "@/lib/types";

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "Nowe",
  read: "Przeczytane",
  answered: "Odpowiedziane",
  archived: "Zarchiwizowane",
};

const STATUS_TONE: Record<InquiryStatus, string> = {
  new: "bg-accent/15 text-accent",
  read: "bg-secondary text-secondary-foreground",
  answered: "bg-emerald-100 text-emerald-900",
  archived: "bg-stone-200 text-stone-700",
};

export const Route = createFileRoute("/owner/inquiries/")({
  component: InquiriesList,
});

function InquiriesList() {
  const inquiries = useAppStore((s) => s.inquiries);
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");

  const visible = inquiries.filter((i) => filter === "all" || i.status === filter);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl">Zapytania</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip label="Wszystkie" active={filter === "all"} onClick={() => setFilter("all")} />
        {(Object.keys(STATUS_LABEL) as InquiryStatus[]).map((s) => (
          <FilterChip
            key={s}
            label={STATUS_LABEL[s]}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          Brak zapytań w tej kategorii.
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((i) => (
            <li key={i.id}>
              <Link
                to="/owner/inquiries/$id"
                params={{ id: i.id }}
                className="block rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-display text-lg">{i.fullName}</div>
                    <div className="truncate text-sm text-muted-foreground">{i.listingTitle}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[i.status]}`}>
                    {STATUS_LABEL[i.status]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{new Date(i.createdAt).toLocaleString("pl-PL")}</span>
                  <span>{i.moveIn} → {i.moveOut}</span>
                  <span>{i.tenants} {i.tenants === 1 ? "najemca" : "najemców"}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm">{i.message}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
