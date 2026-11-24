"use client";

/**
 * Wrapper client pentru pagina dedicată de administrare (/dashboard).
 * Panoul este exact același cu varianta overlay, dar rulează ca pagină
 * autonomă, deschisă într-un tab/fereastră nouă de browser.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardOverlay } from "@/components/dashboard/dashboard-overlay";

export function DashboardPageClient() {
  const router = useRouter();

  const handleClose = React.useCallback(() => {
    // Tab deschis prin script (window.open) → se poate închide direct.
    window.close();
    // Fallback: tab deschis prin link „target=_blank" — revenim la site.
    window.setTimeout(() => router.replace("/"), 250);
  }, [router]);

  return <DashboardOverlay open mode="page" onOpenChange={handleClose} />;
}
