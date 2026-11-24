import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: "Curcanelul Sănătos, Bacău — Bucătărie Românească Autentică | Catering, Autoservire, Delivery",
  description:
    "Curcanelul Sănătos — restaurant în Bacău: catering pentru evenimente, autoservire zilnică, delivery rapid. Adresa: Calea Doctor Alexandru Șafran nr. 55, Bacău.",
  keywords: [
    "restaurant românesc",
    "restaurant Bacău",
    "bucătărie tradițională",
    "catering Bacău",
    "autoservire",
    "delivery mâncare românească Bacău",
    "sarmale",
    "ciorbă",
    "Curcanelul Sănătos",
  ],
  authors: [{ name: "Curcanelul Sănătos" }],
  icons: {
    icon: "/images/logo-curcanelul.png",
    apple: "/images/logo-curcanelul.png",
  },
  openGraph: {
    title: "Curcanelul Sănătos, Bacău — Bucătărie Românească Autentică",
    description:
      "Restaurant în Bacău: catering pentru evenimente, autoservire zilnică și delivery rapid. Adresa: Calea Doctor Alexandru Șafran nr. 55, Bacău.",
    siteName: "Curcanelul Sănătos",
    type: "website",
    locale: "ro_RO",
    url: SITE_URL,
    images: [
      {
        url: "/images/autoservire.jpg",
        width: 1600,
        height: 1200,
        alt: "Barul autoservirii cu preparate tradiționale la Curcanelul Sănătos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curcanelul Sănătos, Bacău — Bucătărie Românească Autentică",
    description:
      "Restaurant în Bacău: catering pentru evenimente, autoservire zilnică și delivery rapid. Adresa: Calea Doctor Alexandru Șafran nr. 55, Bacău.",
    images: ["/images/autoservire.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "restaurant",
  creator: "Curcanelul Sănătos",
  publisher: "Curcanelul Sănătos",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
