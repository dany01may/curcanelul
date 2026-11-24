/**
 * Normalizare defensivă a conținutului site-ului.
 *
 * Scop: Orice date salvate din panoul de administrare (sau găsite în baza de
 * date) sunt aduse GARANTAT la forma așteptată de componente, înainte de a fi
 * randate sau rescrise. Astfel, o salvare incompletă / coruptă / cu câmpuri
 * goale nu poate niciodată să facă pagina publică să crape (pagină albă).
 *
 * Reguli:
 *  - Câmpurile text lipsă / cu tip greșit → preiau valoarea implicită.
 *  - Câmpurile text golite intenționat ("" rămân "") — doar imaginile sunt
 *    protejate, pentru că `next/image` aruncă eroare pe un src gol.
 *  - Imaginile goale / lipsă → imagine implicită sau placeholder sigur.
 *  - Listele (arrays) invalide → lista implicită; elementele malformate
 *    sunt omise; câmpurile lipsă din elemente primesc valori sigure.
 */

import {
  DEFAULT_CONTENT,
  type AboutContent,
  type ContactContent,
  type ContentKey,
  type FooterContent,
  type GalleryContent,
  type GalleryPhoto,
  type GeneralContent,
  type HeroContent,
  type MarqueeContent,
  type MenuCategory,
  type MenuContent,
  type MenuItem,
  type ServiceItem,
  type ServicesContent,
  type SiteContent,
} from "@/lib/site-content";

/** Imagine sigură, existentă în public/, folosită când un src lipsește. */
export const PLACEHOLDER_IMAGE = "/images/logo-curcanelul.png";

/* ——————————————————————— Helper-e de tip ——————————————————————— */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Text: orice altceva decât string → fallback (dar "" e permis). */
function text(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

/** Imagine: string gol sau tip greșit → fallback sigur (next/image crapa pe src gol). */
function image(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/** Listă de string-uri: păstrează doar elementele valide. */
function stringList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((item): item is string => typeof item === "string");
}

/* ——————————————————————— Normalizatoare per secțiune ——————————————————————— */

function normalizeGeneral(raw: Record<string, unknown>): GeneralContent {
  const def = DEFAULT_CONTENT.general;
  const rawHours = Array.isArray(raw.hours) ? raw.hours : null;

  const hours = (rawHours ?? def.hours)
    .filter(isRecord)
    .map((h, index) => ({
      days: text(h.days, def.hours[index]?.days ?? ""),
      time: text(h.time, def.hours[index]?.time ?? ""),
    }));

  return {
    name: text(raw.name, def.name),
    tagline: text(raw.tagline, def.tagline),
    phone: text(raw.phone, def.phone),
    email: text(raw.email, def.email),
    address: text(raw.address, def.address),
    logo: image(raw.logo, def.logo),
    bottomBarLogo: image(raw.bottomBarLogo, def.bottomBarLogo),
    hours: hours.length > 0 ? hours : def.hours,
  };
}

function normalizeHero(raw: Record<string, unknown>): HeroContent {
  const def = DEFAULT_CONTENT.hero;
  return {
    badge: text(raw.badge, def.badge),
    titleTop: text(raw.titleTop, def.titleTop),
    titleAccent: text(raw.titleAccent, def.titleAccent),
    description: text(raw.description, def.description),
    image: image(raw.image, def.image),
    imageAlt: text(raw.imageAlt, def.imageAlt),
    primaryCtaLabel: text(raw.primaryCtaLabel, def.primaryCtaLabel),
    secondaryCtaLabel: text(raw.secondaryCtaLabel, def.secondaryCtaLabel),
  };
}

function normalizeGallery(raw: Record<string, unknown>): GalleryContent {
  const def = DEFAULT_CONTENT.gallery;
  // Lista lipsă (coruptă) → valorile implicite; lista goală intenționat → respectată.
  const rawPhotos = Array.isArray(raw.photos) ? raw.photos : null;

  const photos: GalleryPhoto[] =
    rawPhotos === null
      ? structuredClone(def.photos)
      : rawPhotos.filter(isRecord).map((p, index) => ({
          id: text(p.id, `photo-${index + 1}`),
          src: image(p.src, PLACEHOLDER_IMAGE),
          alt: text(p.alt, ""),
        }));

  return {
    eyebrow: text(raw.eyebrow, def.eyebrow),
    title: text(raw.title, def.title),
    accent: text(raw.accent, def.accent),
    subtitle: text(raw.subtitle, def.subtitle),
    photos,
  };
}

function normalizeMarquee(raw: Record<string, unknown>): MarqueeContent {
  const def = DEFAULT_CONTENT.marquee;
  const items = stringList(raw.items);
  return { items: items ?? def.items };
}

function normalizeServiceItem(raw: Record<string, unknown>, index: number): ServiceItem {
  return {
    id: text(raw.id, `service-${index + 1}`),
    icon: text(raw.icon, "UtensilsCrossed"),
    image: image(raw.image, PLACEHOLDER_IMAGE),
    imageAlt: text(raw.imageAlt, ""),
    title: text(raw.title, ""),
    description: text(raw.description, ""),
    features: stringList(raw.features) ?? [],
    infoText: text(raw.infoText, ""),
    accent: text(raw.accent, ""),
    ctaLabel: text(raw.ctaLabel, ""),
    ctaType: raw.ctaType === "tel" ? "tel" : "anchor",
    ctaHref: text(raw.ctaHref, ""),
  };
}

function normalizeServices(raw: Record<string, unknown>): ServicesContent {
  const def = DEFAULT_CONTENT.services;
  // Lista lipsă (coruptă) → valorile implicite; lista goală intenționat → respectată.
  const rawServices = Array.isArray(raw.services) ? raw.services : null;

  const services =
    rawServices === null
      ? structuredClone(def.services)
      : rawServices.filter(isRecord).map((s, index) => normalizeServiceItem(s, index));

  return {
    eyebrow: text(raw.eyebrow, def.eyebrow),
    title: text(raw.title, def.title),
    accent: text(raw.accent, def.accent),
    subtitle: text(raw.subtitle, def.subtitle),
    services,
  };
}

function normalizeMenuItem(raw: Record<string, unknown>, index: number): MenuItem {
  return {
    id: text(raw.id, `item-${index + 1}`),
    name: text(raw.name, ""),
    description: text(raw.description, ""),
    price: text(raw.price, ""),
    image: image(raw.image, PLACEHOLDER_IMAGE),
    popular: bool(raw.popular, false),
  };
}

function normalizeMenu(raw: Record<string, unknown>): MenuContent {
  const def = DEFAULT_CONTENT.menu;
  // Lista lipsă (coruptă) → valorile implicite; lista goală intenționat → respectată.
  const rawCategories = Array.isArray(raw.categories) ? raw.categories : null;

  const categories: MenuCategory[] =
    rawCategories === null
      ? structuredClone(def.categories)
      : rawCategories.filter(isRecord).map((c, index) => {
          const rawItems = Array.isArray(c.items) ? c.items : null;
          return {
            id: text(c.id, `categorie-${index + 1}`),
            name: text(c.name, ""),
            icon: text(c.icon, "UtensilsCrossed"),
            items:
              rawItems === null
                ? []
                : rawItems.filter(isRecord).map((it, itemIndex) => normalizeMenuItem(it, itemIndex)),
          };
        });

  return {
    eyebrow: text(raw.eyebrow, def.eyebrow),
    title: text(raw.title, def.title),
    accent: text(raw.accent, def.accent),
    subtitle: text(raw.subtitle, def.subtitle),
    categories,
  };
}

function normalizeAbout(raw: Record<string, unknown>): AboutContent {
  const def = DEFAULT_CONTENT.about;
  return {
    eyebrow: text(raw.eyebrow, def.eyebrow),
    title: text(raw.title, def.title),
    accent: text(raw.accent, def.accent),
    paragraphs: stringList(raw.paragraphs) ?? def.paragraphs,
    checks: stringList(raw.checks) ?? def.checks,
    image: image(raw.image, def.image),
    imageAlt: text(raw.imageAlt, def.imageAlt),
    overlayImage: image(raw.overlayImage, def.overlayImage),
    overlayImageAlt: text(raw.overlayImageAlt, def.overlayImageAlt),
    badgeTitle: text(raw.badgeTitle, def.badgeTitle),
    badgeSubtitle: text(raw.badgeSubtitle, def.badgeSubtitle),
    ctaLabel: text(raw.ctaLabel, def.ctaLabel),
  };
}

function normalizeContact(raw: Record<string, unknown>): ContactContent {
  const def = DEFAULT_CONTENT.contact;
  return {
    eyebrow: text(raw.eyebrow, def.eyebrow),
    title: text(raw.title, def.title),
    accent: text(raw.accent, def.accent),
    subtitle: text(raw.subtitle, def.subtitle),
    mapEmbed: text(raw.mapEmbed, def.mapEmbed),
    mapExternal: text(raw.mapExternal, def.mapExternal),
    ctaLabel: text(raw.ctaLabel, def.ctaLabel),
    deliveryNote: text(raw.deliveryNote, def.deliveryNote),
  };
}

function normalizeFooter(raw: Record<string, unknown>): FooterContent {
  const def = DEFAULT_CONTENT.footer;
  return {
    description: text(raw.description, def.description),
    copyright: text(raw.copyright, def.copyright),
    tagline: text(raw.tagline, def.tagline),
  };
}

/* ——————————————————————— Punct de intrare ——————————————————————— */

/**
 * Normalizează O secțiune de conținut: suprapune datele salvate peste
 * valorile implicite și garantează forma completă, sigură de randat.
 */
export function normalizeSection<K extends ContentKey>(
  key: K,
  raw: unknown,
): SiteContent[K] {
  if (!isRecord(raw)) {
    return structuredClone(DEFAULT_CONTENT[key]) as SiteContent[K];
  }

  switch (key) {
    case "general":
      return normalizeGeneral(raw) as SiteContent[K];
    case "hero":
      return normalizeHero(raw) as SiteContent[K];
    case "gallery":
      return normalizeGallery(raw) as SiteContent[K];
    case "marquee":
      return normalizeMarquee(raw) as SiteContent[K];
    case "services":
      return normalizeServices(raw) as SiteContent[K];
    case "menu":
      return normalizeMenu(raw) as SiteContent[K];
    case "about":
      return normalizeAbout(raw) as SiteContent[K];
    case "contact":
      return normalizeContact(raw) as SiteContent[K];
    case "footer":
      return normalizeFooter(raw) as SiteContent[K];
    default:
      return structuredClone(DEFAULT_CONTENT[key]) as SiteContent[K];
  }
}

/** Normalizează un obiect de conținut complet (toate cele 9 secțiuni). */
export function normalizeSiteContent(raw: unknown): SiteContent {
  if (!isRecord(raw)) {
    return structuredClone(DEFAULT_CONTENT);
  }
  const result = {} as SiteContent;
  for (const key of Object.keys(DEFAULT_CONTENT) as ContentKey[]) {
    result[key] = normalizeSection(key, raw[key]);
  }
  return result;
}
