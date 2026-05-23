import { supabase } from "@/integrations/supabase/client";

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

export const CATEGORY_LABELS: Record<Product["category"], Record<Lang, string>> = {
  fleurs: { fr: "Fleur Indoor", kr: "Flè Indoor" },
  gummies: { fr: "Gummies", kr: "Gummies" },
  the: { fr: "Thé Botanique", kr: "Te Botanik" },
  miel: { fr: "Miel CBD", kr: "Siwo myèl CBD" },
  chocolat: { fr: "Chocolat Noir", kr: "Chokola Nwa" },
};

export const CATEGORIES: Array<{
  id: Product["category"];
  label: Record<Lang, string>;
  image: string;
}> = [
  { id: "fleurs", label: CATEGORY_LABELS.fleurs, image: "/assets/cat-fleurs.jpg" },
  { id: "gummies", label: CATEGORY_LABELS.gummies, image: "/assets/cat-gummies.jpg" },
  { id: "the", label: CATEGORY_LABELS.the, image: "/assets/cat-the.jpg" },
  { id: "miel", label: CATEGORY_LABELS.miel, image: "/assets/cat-miel.jpg" },
  { id: "chocolat", label: CATEGORY_LABELS.chocolat, image: "/assets/cat-chocolat.jpg" },
];

/**
 * Mappe un produit de la base de données vers le type Product utilisé par l'application
 */
export function mapDbProduct(p: any): Product {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category as Product["category"],
    categoryLabel: CATEGORY_LABELS[p.category as Product["category"]] || { fr: p.category, kr: p.category },
    cbd: Number(p.cbd_value),
    cbdUnit: p.cbd_unit as any,
    priceUSD: Number(p.price_usd),
    priceHTG: Number(p.price_htg),
    weights: p.weights || [],
    terpenes: p.terpenes || [],
    effects: {
      fr: p.effects_fr || [],
      kr: p.effects_kr || [],
    },
    origin: p.origin || "",
    description: {
      fr: p.description_fr || "",
      kr: p.description_kr || "",
    },
    image: p.image_url || "",
    badge: p.badge_fr ? { fr: p.badge_fr, kr: p.badge_kr || p.badge_fr } : undefined,
  };
}

/**
 * Récupère tous les produits publiés depuis Supabase
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data.map(mapDbProduct);
}

/**
 * Récupère un produit par son slug
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return undefined;
  }

  return mapDbProduct(data);
}

// Conservé pour compatibilité temporaire le temps de la transition
export const PRODUCTS: Product[] = [];
