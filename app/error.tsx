"use client";

/**
 * Boundary de eroare pentru pagina publică.
 * Dacă randarea eșuează din orice motiv, utilizatorul vede un mesaj prietenos
 * și poate încerca din nou — niciodată o pagină albă fără explicații.
 */

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Eroare la randarea paginii:", error);
  }, [error]);

  return (
    <main
      aria-label="Eroare la încărcarea paginii"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center"
    >
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="size-10 text-destructive" aria-hidden />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Pagina nu a putut fi încărcată</h1>
        <p className="max-w-md text-muted-foreground">
          Ne pare rău, a apărut o problemă momentană. Apasă butonul de mai jos
          ca să reîncerci — dacă persistă, revino în câteva secunde.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <RefreshCw className="size-4" aria-hidden />
        Încearcă din nou
      </button>
    </main>
  );
}
