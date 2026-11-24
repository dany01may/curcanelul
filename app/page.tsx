import { Navbar } from "@/components/restaurant/navbar";
import { ScrollProgress } from "@/components/restaurant/scroll-progress";
import { Hero } from "@/components/restaurant/hero";
import { Gallery } from "@/components/restaurant/gallery";
import { MarqueeStrip } from "@/components/restaurant/marquee";
import { Services } from "@/components/restaurant/services";
import { MenuSection } from "@/components/restaurant/menu-section";
import { About } from "@/components/restaurant/about";
import { Contact } from "@/components/restaurant/contact";
import { Footer } from "@/components/restaurant/footer";
import { MobileNav } from "@/components/restaurant/mobile-nav";
import { ContentRefreshListener } from "@/components/restaurant/content-refresh-listener";
import { getSiteContent } from "@/lib/content-server";
import { SITE_URL } from "@/lib/site";
import type { SiteContent } from "@/lib/site-content";

/** Date structurate schema.org pentru rezultate bogate în Google. */
function buildRestaurantJsonLd(content: SiteContent) {
  const { general, hero, gallery } = content;

  const digits = general.phone.replace(/\D/g, "");
  const phoneIntl = digits.startsWith("0")
    ? `+40${digits.slice(1)}`
    : `+40${digits}`;

  const parseTime = (time: string, fallback: [string, string]) => {
    const match = time.match(/(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/);
    return match ? [match[1], match[2]] : fallback;
  };

  const parseDays = (days: string): string[] => {
    const d = days.toLowerCase();
    if (d.includes("luni") && d.includes("vineri")) {
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    }
    if (d.includes("sâmb") || d.includes("samb")) {
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    }
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  };

  const [restaurantOpens, restaurantCloses] = parseTime(
    general.hours[0]?.time ?? "",
    ["08:00", "16:00"]
  );
  const [deliveryOpens, deliveryCloses] = parseTime(
    general.hours[1]?.time ?? "",
    ["11:30", "15:30"]
  );

  const absolute = (src: string) =>
    src.startsWith("http") ? src : `${SITE_URL}${src}`;

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: general.name,
    description: `${general.name}, restaurant în Bacău — ${general.tagline}. Catering pentru evenimente, autoservire zilnică și delivery rapid. Adresa: ${general.address}.`,
    url: SITE_URL,
    telephone: phoneIntl,
    image: [absolute(hero.image), ...gallery.photos.slice(0, 3).map((p) => absolute(p.src))],
    logo: absolute(general.logo),
    servesCuisine: ["Bucătărie românească", "Tradițională"],
    priceRange: "$$",
    currenciesAccepted: "RON",
    paymentAccepted: "Cash, Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: general.address,
      addressLocality: "Bacău",
      addressRegion: "BC",
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.5499,
      longitude: 26.8944,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: parseDays(general.hours[0]?.days ?? ""),
        opens: restaurantOpens,
        closes: restaurantCloses,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: parseDays(general.hours[1]?.days ?? "Luni – Vineri"),
        opens: deliveryOpens,
        closes: deliveryCloses,
      },
    ],
    acceptsReservations: "False",
    hasMap: content.contact.mapExternal,
  };
}

/**
 * Pagina publică se randează întotdeauna dinamic, citind conținutul din baza
 * de date la fiecare cerere — astfel editările salvate din panoul de
 * administrare apar instant, atât în dezvoltare, cât și după un build de
 * producție (fără cache static care ar arăta conținut vechi).
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  const jsonLd = buildRestaurantJsonLd(content);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      {/* Date structurate pentru Google (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <Navbar content={content.general} />
      <main className="flex-1">
        <Hero content={content.hero} />
        {/* Pe mobil continutul sta intr-un „sheet" rotunjit peste hero — ca o aplicatie */}
        <div className="relative z-10 -mt-6 overflow-hidden rounded-t-[2rem] bg-background pb-2 shadow-[0_-20px_44px_oklch(0.3_0.03_55/0.14)] sm:rounded-t-none sm:pb-0 sm:shadow-none">
          <Gallery content={content.gallery} />
          <MarqueeStrip content={content.marquee} />
          <Services content={content.services} general={content.general} />
          <MenuSection content={content.menu} general={content.general} />
          <About content={content.about} general={content.general} />
          <Contact content={content.contact} general={content.general} />
        </div>
      </main>
      <Footer content={content.footer} general={content.general} />
      <MobileNav general={content.general} />
      {/* Reîmprospătează pagina publică automat când se salvează din
          panoul de administrare deschis într-un alt tab */}
      <ContentRefreshListener />
    </div>
  );
}
