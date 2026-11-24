"use client";

/**
 * Boundary de eroare global (ultima plasă de protecție).
 * Randat când chiar și layout-ul eșuează — de aceea își include propriile
 * tag-uri <html> și <body> și folosește stiluri inline.
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Eroare globală:", error);
  }, [error]);

  return (
    <html lang="ro">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          background: "#ffffff",
          color: "#1c1917",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          Pagina nu a putut fi încărcată
        </h1>
        <p style={{ color: "#57534e", maxWidth: "26rem", margin: 0 }}>
          Ne pare rău, a apărut o problemă momentană. Apasă butonul de mai jos
          ca să reîncerci.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            minHeight: "2.75rem",
            padding: "0 1.5rem",
            borderRadius: "0.75rem",
            border: "none",
            background: "#ea580c",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Încearcă din nou
        </button>
      </body>
    </html>
  );
}
