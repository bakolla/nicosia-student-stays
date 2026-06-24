import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/owner/login")({
  head: () => ({
    meta: [{ title: "Logowanie — Panel właściciela" }],
  }),
  component: OwnerLoginPage,
});

function OwnerLoginPage() {
  const login = useAppStore((s) => s.loginOwner);
  const isAuthed = useAppStore((s) => s.isOwnerAuthed);
  const navigate = useNavigate();
  const [email, setEmail] = useState("owner@nicosiastays.demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    document.title = language === "pl"
      ? "Logowanie — Panel właściciela"
      : "Login — Owner panel";
  }, [language]);

  useEffect(() => {
    if (isAuthed) navigate({ to: "/owner/dashboard", replace: true });
  }, [isAuthed, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary/30 px-4 font-sans">
      {/* Back to home — hard navigation via window.location bypasses any router guard */}
      <button
        id="back-to-home-btn"
        type="button"
        onClick={() => { window.location.assign("/"); }}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start max-w-sm w-full"
      >
        {/* Translation already includes the ← arrow, so no icon needed */}
        {t("owner.login.back")}
      </button>

      {/* Login form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const ok = login(email, password);
          if (ok) navigate({ to: "/owner/dashboard", replace: true });
          else setError(t("owner.login.error"));
        }}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
      >
        <div>
          <h1 className="font-display text-2xl">{t("owner.login.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{t("owner.login.sub")}</p>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("owner.login.email")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("owner.login.password")}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {t("owner.login.submit")}
        </Button>

        <div className="rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
          {t("owner.login.demo")}
        </div>
      </form>
    </div>
  );
}
