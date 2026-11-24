export type DishCategory =
  | "Aperitive"
  | "Ciorbe"
  | "Fel Principal"
  | "Deserturi";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: DishCategory;
  popular?: boolean;
}

export const RESTAURANT = {
  name: "Curcanelul Sănătos",
  tagline: "Bucătărie românească autentică",
  address: "Calea Doctor Alexandru Șafran nr. 55, Bacău",
  email: "contact@curcanelulsanatos.ro",
  emailCatering: "catering@curcanelulsanatos.ro",
  phone: "0779 265 188",
  hours: [
    { days: "Restaurant (Luni – Vineri)", time: "08:00 – 16:00" },
    { days: "Delivery", time: "11:30 – 15:30" },
  ],
  mapEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=26.8844%2C46.5449%2C26.9044%2C46.5549&layer=mapnik&marker=46.5499%2C26.8944",
  mapExternal:
    "https://www.google.com/maps?q=Calea+Doctor+Alexandru+%C8%99afran+55%2C+Bac%C4%83u&z=17",
} as const;

export const DISHES: Dish[] = [
  {
    id: "vinete",
    name: "Salată de Vinete",
    description:
      "Vinete coapte pe flacără, rușcate cu ceapă roșie și ulei de măsline, servite cu pâine de casă prăjită.",
    price: 24,
    image: "/images/vinete.png",
    category: "Aperitive",
    popular: true,
  },
  {
    id: "ciorba",
    name: "Ciorbă Rădăuțeană",
    description:
      "Supă acră de pui cu legume, orez și leuștean, îmbogățită cu smântână. Rețeta clasică din Bucovina.",
    price: 28,
    image: "/images/ciorba.png",
    category: "Ciorbe",
    popular: true,
  },
  {
    id: "sarmale",
    name: "Sarmale cu Smântână",
    description:
      "Foi de varză murată umplute cu carne de porc și orez, gătite lent în cuptor, cu mămăligă și smântână.",
    price: 42,
    image: "/images/sarmale.png",
    category: "Fel Principal",
    popular: true,
  },
  {
    id: "tochitura",
    name: "Tochitură Moldovenească",
    description:
      "Tocană consistentă de porc cu cârnați afumați și kaizer, peste mămăligă fiartă, cu ou ochi și brânză.",
    price: 46,
    image: "/images/tochitura.png",
    category: "Fel Principal",
  },
  {
    id: "musaca",
    name: "Mușaca de Cartofi",
    description:
      "Straturi de cartofi și carne tocată de vită, coapte cu roșii și ierburi aromatice, cu crustă aurie de brânză.",
    price: 34,
    image: "/images/musaca.png",
    category: "Fel Principal",
  },
  {
    id: "mici",
    name: "Mici cu Muștar",
    description:
      "Mici fragezi, de rețetă de casă, la grătar cu cărbuni, cu muștar iute și castraveți murați.",
    price: 32,
    image: "/images/mici.png",
    category: "Fel Principal",
    popular: true,
  },
  {
    id: "friptura",
    name: "Friptură de Porc la Cuptor",
    description:
      "Cotlet de porc frăgezit, cartofi copți cu boia dulce și salată de murături. Ca la prânzul de duminică.",
    price: 44,
    image: "/images/friptura.png",
    category: "Fel Principal",
  },
  {
    id: "papanasi",
    name: "Papanași cu Afine",
    description:
      "Papanași copți din brânză de vaci, cu smântână dulce, dulceață de afine și coajă de lămâie.",
    price: 26,
    image: "/images/papanasi.png",
    category: "Deserturi",
    popular: true,
  },
  {
    id: "cozonac",
    name: "Cozonac al Bunicii",
    description:
      "Cozonac pufos, frământat manual, cu umplutură de nuci și cacao. Felia de casă care nu lipsește de la masă.",
    price: 18,
    image: "/images/cozonac.png",
    category: "Deserturi",
  },
];

export const CATEGORY_ICON: Record<DishCategory, string> = {
  Aperitive: "salad",
  Ciorbe: "soup",
  "Fel Principal": "drumstick",
  Deserturi: "cake",
};

export const MARQUEE_ITEMS = [
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
];
