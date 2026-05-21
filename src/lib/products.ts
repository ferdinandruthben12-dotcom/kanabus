import heroFlower from "@/assets/hero-flower.jpg";
import catFleurs from "@/assets/cat-fleurs.jpg";
import catGummies from "@/assets/cat-gummies.jpg";
import catThe from "@/assets/cat-the.jpg";
import catMiel from "@/assets/cat-miel.jpg";
import catChocolat from "@/assets/cat-chocolat.jpg";
import featured from "@/assets/featured-product.jpg";

export type Lang = "fr" | "kr";

export type Product = {
  slug: string;
  name: string;
  category: "fleurs" | "gummies" | "the" | "miel" | "chocolat";
  categoryLabel: Record<Lang, string>;
  cbd: number;
  cbdUnit?: "%" | "mg";
  priceUSD: number;
  priceHTG: number;
  weights: string[];
  terpenes: string[];
  effects: Record<Lang, string[]>;
  origin: string;
  description: Record<Lang, string>;
  image: string;
  badge?: Record<Lang, string>;
};

export const PRODUCTS: Product[] = [
  {
    slug: "citadelle-gold",
    name: "Citadelle Gold",
    category: "fleurs",
    categoryLabel: { fr: "Fleur Indoor", kr: "Flè Indoor" },
    cbd: 22,
    priceUSD: 55,
    priceHTG: 7250,
    weights: ["1g", "3g", "5g", "10g"],
    terpenes: ["Limonène", "Myrcène", "Caryophyllène"],
    effects: {
      fr: ["Euphorique", "Créatif", "Détente profonde"],
      kr: ["Euforik", "Kreyatif", "Detant pwofon"],
    },
    origin: "Massif du Nord, Haïti",
    description: {
      fr: "Une variété rare cultivée en haute altitude près de la Citadelle Laferrière. Notes d'agrumes tropicaux, finale terreuse, expérience d'exception pour les connaisseurs.",
      kr: "Yon varyete ki ra, kiltive nan wo altitid pre Sitadèl Laferyè. Nòt sitwon twopikal, finisyon latè, eksperyans eksepsyonèl pou koneseur yo.",
    },
    image: heroFlower,
    badge: { fr: "Signature", kr: "Siyati" },
  },
  {
    slug: "hibiscus-gold",
    name: "Hibiscus Gold",
    category: "fleurs",
    categoryLabel: { fr: "Fleur Greenhouse", kr: "Flè Greenhouse" },
    cbd: 18,
    priceUSD: 38,
    priceHTG: 5000,
    weights: ["1g", "3g", "5g"],
    terpenes: ["Limonène", "Pinène"],
    effects: {
      fr: ["Énergisant", "Focus", "Vibrant"],
      kr: ["Enèjizan", "Konsantrasyon", "Vivan"],
    },
    origin: "Cap-Haïtien, Nord",
    description: {
      fr: "Une infusion unique mêlant la force du CBD organique du Cap-Haïtien et la douceur florale de l'hibiscus sauvage.",
      kr: "Yon enfizyon inik ki melanje fòs CBD òganik Cap-Ayisyen ak dousè flè ibiskis sovaj.",
    },
    image: featured,
    badge: { fr: "Nouveauté", kr: "Nouvo" },
  },
  {
    slug: "small-buds-nord",
    name: "Small Buds Nord",
    category: "fleurs",
    categoryLabel: { fr: "Small Buds", kr: "Small Buds" },
    cbd: 14,
    priceUSD: 22,
    priceHTG: 2900,
    weights: ["3g", "5g", "10g"],
    terpenes: ["Myrcène", "Linalool"],
    effects: {
      fr: ["Doux", "Quotidien", "Apaisant"],
      kr: ["Dous", "Chak jou", "Pasifyan"],
    },
    origin: "Plaine du Nord",
    description: {
      fr: "Petites têtes denses et résineuses, parfaites pour un usage quotidien sans compromis sur la qualité.",
      kr: "Ti tèt dans ak rezinè, pafè pou itilizasyon chak jou san konpwomi sou kalite.",
    },
    image: catFleurs,
  },
  {
    slug: "gummies-mango-kush",
    name: "Gummies Mango Kush",
    category: "gummies",
    categoryLabel: { fr: "Gummies fruits", kr: "Gummies fwi" },
    cbd: 25,
    cbdUnit: "mg",
    priceUSD: 32,
    priceHTG: 4200,
    weights: ["20 pcs"],
    terpenes: ["Limonène"],
    effects: {
      fr: ["Tropical", "Énergie douce", "Bonne humeur"],
      kr: ["Twopikal", "Enèji dous", "Bon imè"],
    },
    origin: "Atelier KanaBus",
    description: {
      fr: "Gummies bio infusées au CBD full-spectrum, saveur mangue Kush. 25mg par gomme. Dosage précis, plaisir garanti.",
      kr: "Gummies bio enfize ak CBD full-spectrum, gou mango Kush. 25mg pa gòm. Dozaj presi, plezi garanti.",
    },
    image: catGummies,
    badge: { fr: "Full Spectrum", kr: "Full Spectrum" },
  },
  {
    slug: "the-bleu-citronelle",
    name: "Thé Bleu Citronelle",
    category: "the",
    categoryLabel: { fr: "Infusion Zen", kr: "Enfizyon Zen" },
    cbd: 15,
    cbdUnit: "mg",
    priceUSD: 28,
    priceHTG: 3700,
    weights: ["40g"],
    terpenes: ["Linalool", "Limonène"],
    effects: {
      fr: ["Zen", "Sommeil", "Digestion"],
      kr: ["Zen", "Dòmi", "Dijestyon"],
    },
    origin: "Récolte locale, Nord",
    description: {
      fr: "Infusion artisanale à base de citronnelle, hibiscus et CBD. Cérémonie du soir, retour au calme.",
      kr: "Enfizyon atizanal ak sitwonèl, ibiskis epi CBD. Seremoni nan aswè, retounen nan kalm.",
    },
    image: catThe,
  },
  {
    slug: "miel-hibiscus",
    name: "Miel Hibiscus",
    category: "miel",
    categoryLabel: { fr: "Miel infusé", kr: "Siwo myèl enfize" },
    cbd: 200,
    cbdUnit: "mg",
    priceUSD: 32,
    priceHTG: 4200,
    weights: ["180ml"],
    terpenes: ["Myrcène"],
    effects: {
      fr: ["Apaisant", "Sucré", "Réconfort"],
      kr: ["Pasifyan", "Sikre", "Konfò"],
    },
    origin: "Apiculteurs du Nord",
    description: {
      fr: "Miel sauvage récolté localement, infusé au CBD. Idéal en cuillère du soir ou dans une infusion chaude.",
      kr: "Siwo myèl sovaj rekòlte lokalman, enfize ak CBD. Ideyal nan kiyè nan aswè oswa nan yon enfizyon cho.",
    },
    image: catMiel,
  },
  {
    slug: "cacao-de-labadee",
    name: "Cacao de Labadee",
    category: "chocolat",
    categoryLabel: { fr: "Chocolat noir 75%", kr: "Chokola nwa 75%" },
    cbd: 25,
    cbdUnit: "mg",
    priceUSD: 18,
    priceHTG: 2400,
    weights: ["50g"],
    terpenes: ["Caryophyllène"],
    effects: {
      fr: ["Gourmand", "Anti-stress", "Indulgent"],
      kr: ["Gou", "Anti-estrès", "Endiljan"],
    },
    origin: "Cacao haïtien",
    description: {
      fr: "Tablette de chocolat noir 75% au cacao haïtien, infusée au CBD. Plaisir intense et apaisement.",
      kr: "Tablèt chokola nwa 75% ak kakawo ayisyen, enfize ak CBD. Plezi entans epi pasifikasyon.",
    },
    image: catChocolat,
  },
];

export const CATEGORIES: Array<{
  id: Product["category"];
  label: Record<Lang, string>;
  image: string;
}> = [
  { id: "fleurs", label: { fr: "Fleurs Indoor", kr: "Flè Indoor" }, image: catFleurs },
  { id: "gummies", label: { fr: "Gummies", kr: "Gummies" }, image: catGummies },
  { id: "the", label: { fr: "Thé Botanique", kr: "Te Botanik" }, image: catThe },
  { id: "miel", label: { fr: "Miel CBD", kr: "Siwo myèl CBD" }, image: catMiel },
  { id: "chocolat", label: { fr: "Chocolat Noir", kr: "Chokola Nwa" }, image: catChocolat },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
