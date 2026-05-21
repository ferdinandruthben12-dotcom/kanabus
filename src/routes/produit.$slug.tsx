import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProductBySlug, PRODUCTS, type Product } from "@/lib/products";
import { useI18n } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.product.name} — KanaBus` }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { t, lang } = useI18n();
  const [weight, setWeight] = useState(product.weights[0]);
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const fallback = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="pt-24 md:pt-28">
      <nav className="px-5 md:px-10 max-w-[1400px] mx-auto mb-8">
        <Link to="/boutique" className="font-mono text-[11px] uppercase tracking-widest text-foreground/50 hover:text-accent">
          ← {t("nav.shop")}
        </Link>
      </nav>

      <section className="px-5 md:px-10 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="bg-sand aspect-[4/5] overflow-hidden grain">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="lg:py-8">
          {product.badge && (
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{product.badge[lang]}</span>
          )}
          <h1 className="font-display italic text-5xl md:text-7xl leading-[0.95] mt-3 tracking-tighter">
            {product.name}
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-foreground/50 mt-3">
            {product.categoryLabel[lang]} · {product.origin}
          </p>

          <div className="mt-7 flex items-baseline gap-3">
            <span className="font-display italic text-4xl">${product.priceUSD.toFixed(2)}</span>
            <span className="font-mono text-xs text-foreground/50">≈ {product.priceHTG.toLocaleString()} HTG</span>
          </div>

          <p className="mt-7 text-base text-foreground/75 leading-relaxed max-w-prose">
            {product.description[lang]}
          </p>

          <div className="mt-9">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-3">
              {t("product.weight")}
            </span>
            <div className="flex flex-wrap gap-2">
              {product.weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(w)}
                  className={`px-4 py-2 border text-[11px] font-mono uppercase tracking-widest transition-colors ${
                    weight === w
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/20 hover:border-foreground"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <button className="mt-8 w-full py-5 bg-foreground text-background font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-accent transition-colors">
            {t("product.add")} — ${product.priceUSD.toFixed(2)}
          </button>

          <dl className="mt-10 border-t border-foreground/10 pt-8 grid grid-cols-2 gap-y-6 gap-x-10 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-2">{t("product.cbd")}</dt>
              <dd className="font-display italic text-2xl">{product.cbd}{product.cbdUnit ?? "%"}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-2">{t("product.origin")}</dt>
              <dd>{product.origin}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-2">{t("product.terpenes")}</dt>
              <dd>
                <ul className="space-y-1">{product.terpenes.map((tp) => <li key={tp}>{tp}</li>)}</ul>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-2">{t("product.effects")}</dt>
              <dd>
                <ul className="space-y-1">{product.effects[lang].map((e) => <li key={e}>{e}</li>)}</ul>
              </dd>
            </div>
          </dl>

          <p className="mt-8 text-[11px] font-mono uppercase tracking-widest text-foreground/40">
            ✓ {t("product.lab")}
          </p>
        </div>
      </section>

      <section className="mt-28 px-5 md:px-10 max-w-[1400px] mx-auto">
        <h2 className="font-display italic text-3xl md:text-5xl mb-10">{t("product.related")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {(related.length ? related : fallback).map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </div>
  );
}
