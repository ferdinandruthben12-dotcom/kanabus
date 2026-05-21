import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/boutique")({
  component: Boutique,
  head: () => ({ meta: [{ title: "Boutique — KanaBus" }] }),
});

type Sort = "default" | "cbd" | "price-asc" | "price-desc";

function Boutique() {
  const { t, lang } = useI18n();
  const [cat, setCat] = useState<Product["category"] | "all">("all");
  const [sort, setSort] = useState<Sort>("default");

  const products = useMemo(() => {
    const list = cat === "all" ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === cat);
    if (sort === "cbd") list.sort((a, b) => b.cbd - a.cbd);
    if (sort === "price-asc") list.sort((a, b) => a.priceUSD - b.priceUSD);
    if (sort === "price-desc") list.sort((a, b) => b.priceUSD - a.priceUSD);
    return list;
  }, [cat, sort]);

  return (
    <div className="pt-28 md:pt-32">
      <header className="px-5 md:px-10 max-w-[1400px] mx-auto mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
          {products.length} {t("shop.count")}
        </p>
        <h1 className="font-display italic text-6xl md:text-8xl leading-[0.9] tracking-tighter">
          {t("shop.title")}.
        </h1>
        <p className="mt-5 text-base text-foreground/60 max-w-md">{t("shop.sub")}</p>
      </header>

      {/* Filters */}
      <div className="border-y border-foreground/10 sticky top-16 md:top-20 z-30 bg-background/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCat("all")}
            className={`shrink-0 text-[11px] font-mono uppercase tracking-widest pb-1 border-b ${
              cat === "all" ? "border-accent text-accent" : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            {t("shop.filter.all")}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 text-[11px] font-mono uppercase tracking-widest pb-1 border-b ${
                cat === c.id ? "border-accent text-accent" : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              {c.label[lang]}
            </button>
          ))}
          <div className="ml-auto shrink-0 flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">{t("shop.sort")}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-transparent text-[11px] font-mono uppercase tracking-widest border-b border-foreground/40 pb-1 focus:outline-none cursor-pointer"
            >
              <option value="default">Pertinence</option>
              <option value="cbd">CBD ↓</option>
              <option value="price-asc">Prix ↑</option>
              <option value="price-desc">Prix ↓</option>
            </select>
          </div>
        </div>
      </div>

      <section className="px-5 md:px-10 max-w-[1400px] mx-auto py-14 grain">
        {products.length === 0 ? (
          <p className="text-center font-mono uppercase tracking-widest text-foreground/50 py-20">Aucun produit.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
            {products.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
