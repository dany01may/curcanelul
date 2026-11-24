import type { Metadata } from "next";
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";

/**
 * Pagina dedicată a panoului de administrare — poate fi deschisă într-o
 * fereastră nouă de browser direct din butonul discret din bara de sus.
 *
 * Accesul rămâne protejat cu parolă (sesiune pe cookie httpOnly, 14 zile),
 * iar pagina este exclusă din indexare (robots noindex).
 */
export const metadata: Metadata = {
  title: "Panou de administrare — Curcanelul Sănătos",
  description: "Zonă de administrare rezervată proprietarului restaurantului.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
