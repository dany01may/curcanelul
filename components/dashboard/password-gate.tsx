"use client";

/**
 * Ecranul de deblocare a panoului de administrare.
 * Parola este verificată pe server (POST /api/auth) — în browser
 * nu există nicio urmă de parolă sau token.
 */

import * as React from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginDashboard } from "@/lib/dashboard-api";

export function PasswordGate({
  onUnlocked,
  onClose,
}: {
  onUnlocked: () => void;
  onClose: () => void;
}) {
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focalizează câmpul imediat după deschidere (experiență rapidă pe orice device).
  React.useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 150);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || password.length === 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const ok = await loginDashboard(password);
      if (ok) {
        onUnlocked();
        return;
      }
      setError("Parolă incorectă. Încearcă din nou.");
      setPassword("");
      inputRef.current?.focus();
    } catch {
      setError("Nu am putut verifica parola. Verifică conexiunea la internet.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto bg-gradient-to-b from-secondary/40 via-background to-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
          {/* Antet */}
          <div className="flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <LockKeyhole className="size-7 text-primary" aria-hidden />
            </span>
            <h2 className="mt-4 text-xl font-bold">Zonă protejată</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Panoul de administrare este rezervat proprietarului.
              Introdu parola ca să continui.
            </p>
          </div>

          {/* Formular */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dashboard-password">Parolă</Label>
              <div className="relative">
                <Input
                  id="dashboard-password"
                  ref={inputRef}
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  disabled={submitting}
                  className="h-12 rounded-xl pr-11 text-base"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "dashboard-password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={visible ? "Ascunde parola" : "Arată parola"}
                  tabIndex={-1}
                >
                  {visible ? (
                    <EyeOff className="size-4.5" aria-hidden />
                  ) : (
                    <Eye className="size-4.5" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p
                id="dashboard-password-error"
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={submitting || password.length === 0}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02] active:scale-95"
            >
              {submitting ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <LockKeyhole className="size-5" aria-hidden />
              )}
              {submitting ? "Se verifică..." : "Deblochează panoul"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              disabled={submitting}
              onClick={onClose}
              className="h-11 w-full rounded-xl text-muted-foreground"
            >
              Închide
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
          Sesiunea rămâne deblocată 14 zile pe acest device.
        </p>
      </div>
    </div>
  );
}
