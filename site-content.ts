/**
 * Modelul de conținut al site-ului — sursa unică de adevăr pentru
 * dashboard-ul de administrare și pentru toate componentele.
 *
 * Valorile implicite (DEFAULT_CONTENT) reproduc conținutul actual al site-ului.
 * La runtime, secțiunile modificate din dashboard sunt citite din baza de date
 * (tabelul `Setting`, un JSON per cheie) și suprapuse peste implicite.
 */

export const CONTENT_KEYS = [
  "general",
  "hero",
  "gallery",
  "marquee",
  "services",
  "menu",
  "about",
  "contact",
  "footer",
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

/* —————————————————————————————— Tipuri —————————————————————————————— */

export interface GeneralContent {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  /** Logo-ul principal (navbar, drawer, footer, carduri) */
  logo: string;
  /** Mascota lipită pe bara de navigare de jos (mobil) */
  bottomBarLogo: string;
  /** Program de funcționare: perechi zi/oră */
  hours: { days: string; time: string }[];
}

export interface HeroContent {
  badge: string;
  titleTop: string;
  titleAccent: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
}

export interface GalleryContent {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  photos: GalleryPhoto[];
}

export interface MarqueeContent {
  items: string[];
}

export interface ServiceItem {
  id: string;
  /** Nume de iconiță lucide (vezi SERVICE_ICON_OPTIONS) */
  icon: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  features: string[];
  infoText: string;
  accent: string;
  ctaLabel: string;
  /** "tel" = link telefonic (folosește general.phone) · "anchor" = link intern */
  ctaType: "tel" | "anchor";
  ctaHref: string;
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  services: ServiceItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  popular: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  /** Nume de iconiță lucide (vezi MENU_ICON_OPTIONS) */
  icon: string;
  items: MenuItem[];
}

export interface MenuContent {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  categories: MenuCategory[];
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  accent: string;
  paragraphs: string[];
  checks: string[];
  image: string;
  imageAlt: string;
  overlayImage: string;
  overlayImageAlt: string;
  badgeTitle: string;
  badgeSubtitle: string;
  ctaLabel: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  mapEmbed: string;
  mapExternal: string;
  ctaLabel: string;
  deliveryNote: string;
}

export interface FooterContent {
  description: string;
  copyright: string;
  tagline: string;
}

export interface SiteContent {
  general: GeneralContent;
  hero: HeroContent;
  gallery: GalleryContent;
  marquee: MarqueeContent;
  services: ServicesContent;
  menu: MenuContent;
  about: AboutContent;
  contact: ContactContent;
  footer: FooterContent;
}

/* ——————————————————— Opțiuni de iconițe (dashboard) ——————————————————— */

export const MENU_ICON_OPTIONS = [
  "Salad",
  "Soup",
  "Drumstick",
  "CakeSlice",
  "Beef",
  "Sandwich",
  "CookingPot",
  "Croissant",
  "Coffee",
  "IceCreamBowl",
  "Pizza",
  "Wheat",
] as const;

export const SERVICE_ICON_OPTIONS = [
  "ConciergeBell",
  "UtensilsCrossed",
  "Bike",
  "ChefHat",
  "Clock",
  "Truck",
  "PartyPopper",
  "Sparkles",
  "HeartHandshake",
] as const;

/* ————————————————————————— Conținut implicit ————————————————————————— */

export const DEFAULT_CONTENT: SiteContent = {
  general: {
    name: "Curcanelul Sănătos",
    tagline: "Bucătărie românească autentică",
    phone: "0779 265 188",
    email: "contact@curcanelulsanatos.ro",
    address: "Calea Doctor Alexandru Șafran nr. 55, Bacău",
    logo: "/images/logo-curcanelul.png",
    bottomBarLogo: "/images/curcanelul-mascot.png",
    hours: [
      { days: "Restaurant (Luni – Vineri)", time: "08:00 – 16:00" },
      { days: "Delivery", time: "11:30 – 15:30" },
    ],
  },

  hero: {
    badge: "Restaurant · Catering · Autoservire · Delivery · Cafenea",
    titleTop: "Mâncare gustoasă,",
    titleAccent: "ca la bunica acasă",
    description:
      "Rețete românești gătite cu drag, exact ca acasă. Le găsești în restaurant, la evenimentele tale și direct la ușa ta, cât e încă fierbinte.",
    image: "/images/autoservire.jpg",
    imageAlt: "Barul autoservirii cu preparate proaspăt gătite la Curcanelul Sănătos",
    primaryCtaLabel: "Explorează meniul",
    secondaryCtaLabel: "Catering pentru evenimente",
  },

  gallery: {
    eyebrow: "Galerie",
    title: "Bucătăria noastră,",
    accent: "în imagini",
    subtitle:
      "Preparate proaspăt gătite zilnic și atmosfera caldă de la Curcanelul Sănătos.",
    photos: [
      {
        id: "g1",
        src: "/images/gallery/gallery-01.jpg",
        alt: "Tocăniță de cartofi cu legume, gătită proaspăt la autoservire",
      },
      {
        id: "g2",
        src: "/images/gallery/gallery-02.jpg",
        alt: "Șnițel de pui umplut cu șuncă și brânză, cu piure de cartofi și sfeclă roșie",
      },
      {
        id: "g3",
        src: "/images/gallery/gallery-03.jpg",
        alt: "Rulouri de pui cu ciuperci, alături de legume călite",
      },
      {
        id: "g4",
        src: "/images/gallery/gallery-04.jpg",
        alt: "Tochitură cu mămăligă, brânză și cârnați, ca la bunica acasă",
      },
      {
        id: "g5",
        src: "/images/gallery/gallery-05.jpg",
        alt: "Barul autoservirii cu tăvi pline de preparate proaspăt gătite",
      },
      {
        id: "g6",
        src: "/images/gallery/gallery-06.jpg",
        alt: "Tocană de ciuperci cu mămăligă și murături",
      },
      {
        id: "g7",
        src: "/images/gallery/gallery-07.jpg",
        alt: "Tocană de pui în sos de roșii, gătită zilnic",
      },
      {
        id: "g8",
        src: "/images/gallery/gallery-08.jpg",
        alt: "Ciorbă tradițională cu carne, servită cu pâine caldă și ardei murați",
      },
      {
        id: "g9",
        src: "/images/gallery/gallery-09.jpg",
        alt: "Interiorul restaurantului, cu mese aranjate pentru oaspeți",
      },
      {
        id: "g10",
        src: "/images/gallery/gallery-10.jpg",
        alt: "Tocană de pui cu legume și mămăligă, cu murături",
      },
    ],
  },

  marquee: {
    items: [
      "Sarmale cu smântână",
      "Ciorbă rădăuțeană",
      "Mici la grătar",
      "Papanași cu afine",
      "Tochitură moldovenească",
      "Mușaca de casă",
      "Salată de vinete",
      "Cozonac frământat manual",
      "Mămăligă fiartă",
      "Friptură la cuptor",
    ],
  },

  services: {
    eyebrow: "Serviciile noastre",
    title: "Bucătăria noastră,",
    accent: "oriunde ai fi",
    subtitle:
      "Trei moduri de a ne savura preparatele: la evenimentul tău, la restaurant sau direct la tine acasă.",
    services: [
      {
        id: "svc-catering",
        icon: "ConciergeBell",
        image: "/images/catering.png",
        imageAlt: "Bufet elegant pentru evenimente catering",
        title: "Catering pentru Evenimente",
        description:
          "Nunți, botezuri, evenimente corporate sau aniversări de familie — aducem gustul Casei Bunicii la sărbătoarea ta.",
        features: [
          "Meniuri personalizate pentru eveniment",
          "Personal de servire și montaj bufet",
          "Vase și decor rustic, incluse",
        ],
        infoText: "Comenzi și oferte: 0779 265 188",
        accent: "De la 65 lei / persoană",
        ctaLabel: "Cere ofertă",
        ctaType: "anchor",
        ctaHref: "#contact",
      },
      {
        id: "svc-autoservire",
        icon: "UtensilsCrossed",
        image: "/images/interior.png",
        imageAlt: "Interior cald al restaurantului Curcanelul Sănătos",
        title: "Autoservire Zilnică",
        description:
          "Prânz de casă, copios și accesibil, gata te-așteaptă la barul autoservirii. Alegi, te așezi și savurezi — ca acasă.",
        features: [
          "Meniul zilei, schimbat în fiecare zi",
          "Ciorbă, fel principal și desert",
          "Fără așteptare — servire imediată",
        ],
        infoText: "Luni – Vineri · 08:00 – 16:00",
        accent: "Meniul zilei de la 38 lei",
        ctaLabel: "Vezi meniul zilei",
        ctaType: "anchor",
        ctaHref: "#meniu",
      },
      {
        id: "svc-delivery",
        icon: "Bike",
        image: "/images/delivery.png",
        imageAlt: "Curier de delivery pe scuter cu rucsac termic",
        title: "Delivery Rapid",
        description:
          "Comenzile ajung la tine calde, în ambalaje termo-securizate. Sună-ne — aducem bucătăria la ușa ta.",
        features: [
          "Zone acoperite: orașul Bacău și împrejurimi",
          "Ambalaje termice, fără mizerie",
        ],
        infoText: "Program delivery: 11:30 – 15:30",
        accent: "Livrare gratuită peste 120 lei",
        ctaLabel: "Comandă acum",
        ctaType: "tel",
        ctaHref: "",
      },
    ],
  },

  menu: {
    eyebrow: "Meniul nostru",
    title: "Preparate",
    accent: "tradiționale",
    subtitle:
      "Răsfoiește preparatele în grilă sau glisează prin carusel — alege modul tău preferat.",
    categories: [
      {
        id: "cat-aperitive",
        name: "Aperitive",
        icon: "Salad",
        items: [
          {
            id: "vinete",
            name: "Salată de Vinete",
            description:
              "Vinete coapte pe flacără, rușcate cu ceapă roșie și ulei de măsline, servite cu pâine de casă prăjită.",
            price: "24",
            image: "/images/vinete.png",
            popular: true,
          },
        ],
      },
      {
        id: "cat-ciorbe",
        name: "Ciorbe",
        icon: "Soup",
        items: [
          {
            id: "ciorba",
            name: "Ciorbă Rădăuțeană",
            description:
              "Supă acră de pui cu legume, orez și leuștean, îmbogățită cu smântână. Rețeta clasică din Bucovina.",
            price: "28",
            image: "/images/ciorba.png",
            popular: true,
          },
        ],
      },
      {
        id: "cat-fel-principal",
        name: "Fel Principal",
        icon: "Drumstick",
        items: [
          {
            id: "sarmale",
            name: "Sarmale cu Smântână",
            description:
              "Foi de varză murată umplute cu carne de porc și orez, gătite lent în cuptor, cu mămăligă și smântână.",
            price: "42",
            image: "/images/sarmale.png",
            popular: true,
          },
          {
            id: "tochitura",
            name: "Tochitură Moldovenească",
            description:
              "Tocană consistentă de porc cu cârnați afumați și kaizer, peste mămăligă fiartă, cu ou ochi și brânză.",
            price: "46",
            image: "/images/tochitura.png",
            popular: false,
          },
          {
            id: "musaca",
            name: "Mușaca de Cartofi",
            description:
              "Straturi de cartofi și carne tocată de vită, coapte cu roșii și ierburi aromatice, cu crustă aurie de brânză.",
            price: "34",
            image: "/images/musaca.png",
            popular: false,
          },
          {
            id: "mici",
            name: "Mici cu Muștar",
            description:
              "Mici fragezi, de rețetă de casă, la grătar cu cărbuni, cu muștar iute și castraveți murați.",
            price: "32",
            image: "/images/mici.png",
            popular: true,
          },
          {
            id: "friptura",
            name: "Friptură de Porc la Cuptor",
            description:
              "Cotlet de porc frăgezit, cartofi copți cu boia dulce și salată de murături. Ca la prânzul de duminică.",
            price: "44",
            image: "/images/friptura.png",
            popular: false,
          },
        ],
      },
      {
        id: "cat-deserturi",
        name: "Deserturi",
        icon: "CakeSlice",
        items: [
          {
            id: "papanasi",
            name: "Papanași cu Afine",
            description:
              "Papanași copți din brânză de vaci, cu smântână dulce, dulceață de afine și coajă de lămâie.",
            price: "26",
            image: "/images/papanasi.png",
            popular: true,
          },
          {
            id: "cozonac",
            name: "Cozonac al Bunicii",
            description:
              "Cozonac pufos, frământat manual, cu umplutură de nuci și cacao. Felia de casă care nu lipsește de la masă.",
            price: "18",
            image: "/images/cozonac.png",
            popular: false,
          },
        ],
      },
    ],
  },

  about: {
    eyebrow: "Povestea noastră",
    title: "Rețete de familie,",
    accent: "gust de acasă",
    paragraphs: [
      "Fiecare ciorbă, fiecare porție de sarmale și fiecare papanaș ies din bucătăria noastră exact ca acasă: cu răbdare, cu ingrediente bune și cu drag.",
      "Astăzi gătim zilnic pentru clienții noștri din restaurant și pentru cei care ne preferă preparatele acasă, la delivery.",
    ],
    checks: [
      "Rețete transmise din generație în generație",
      "Bucătari cu peste 20 de ani de experiență",
      "Porții generoase, la prețuri corecte",
    ],
    image: "/images/interior.png",
    imageAlt: "Interiorul cald al restaurantului Curcanelul Sănătos",
    overlayImage: "/images/autoservire.jpg",
    overlayImageAlt: "Barul autoservirii cu preparate gătite zilnic, la Curcanelul Sănătos",
    badgeTitle: "Curcanelul Sănătos",
    badgeSubtitle: "Mâncare sănătoasă, ca la mama acasă",
    ctaLabel: "Vino să ne cunoști",
  },

  contact: {
    eyebrow: "Contact",
    title: "Te așteptăm",
    accent: "la masă",
    subtitle:
      "Ne găsești pe Calea Șafran din Bacău, ușor de ajuns din orice colț al orașului. Sună sau treci pe la noi.",
    mapEmbed:
      "https://www.openstreetmap.org/export/embed.html?bbox=26.8844%2C46.5449%2C26.9044%2C46.5549&layer=mapnik&marker=46.5499%2C26.8944",
    mapExternal:
      "https://www.google.com/maps?q=Calea+Doctor+Alexandru+%C8%99afran+55%2C+Bac%C4%83u&z=17",
    ctaLabel: "Cere ofertă de catering",
    deliveryNote:
      "Zona de delivery: orașul Bacău și împrejurimi. Pentru alte zone, sună-ne și aflăm ce putem face.",
  },

  footer: {
    description:
      "Bucătărie românească autentică, în inima Bacăului. Restaurant, catering, autoservire și delivery — ca la bunica acasă.",
    copyright: "Toate drepturile rezervate.",
    tagline: "Gătit cu drag în Bacău, România",
  },
};
