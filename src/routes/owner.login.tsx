import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

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

  useEffect(() => {
    if (isAuthed) navigate({ to: "/owner/dashboard", replace: true });
  }, [isAuthed, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const ok = login(email, password);
          if (ok) navigate({ to: "/owner/dashboard", replace: true });
          else setError("Nieprawidłowy e-mail lub hasło.");
        }}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
      >
        <div>
          <h1 className="font-display text-2xl">Panel właściciela</h1>
          <p className="mt-1 text-sm text-muted-foreground">Zaloguj się, aby zarządzać ofertami.</p>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Hasło</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

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
