import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlower from "@/assets/hero-flower.jpg";
import { CATEGORIES, fetchProducts } from "@/lib/products";
import { useI18n } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  
  const { data: PRODUCTS = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const featured = PRODUCTS.find((p) => p.slug === "hibiscus-gold") || PRODUCTS[0];
  const essentials = PRODUCTS.slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-forest grain">
        <img
          src={heroFlower}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-65"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-forest/30" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-20 px-5 md:px-10">
          <div className="max-w-[1400px] mx-auto w-full">
            <h1 className="font-display italic text-white tracking-tighter leading-[0.85] text-[18vw] md:text-[14vw] lg:text-[11vw] animate-fade-up">
              {t("hero.title.l1")} <br />
              {t("hero.title.l2")}
            </h1>
            <div className="mt-10 md:mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up" style={{ animationDelay: "180ms" }}>
              <p className="max-w-md text-white/85 text-base md:text-lg leading-relaxed text-pretty">
                {t("hero.sub")}
              </p>
              <Link
                to="/boutique"
                className="inline-block self-start md:self-auto px-8 md:px-10 py-4 md:py-5 bg-accent text-background uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-background hover:text-accent transition-colors"
              >
                {t("hero.cta")} →
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-px h-12 bg-white/30" />
        </div>
      </section>

      {/* TICKER / MARQUEE */}
      <section className="bg-foreground text-background py-4 overflow-hidden border-b border-background/10">
        <div className="flex gap-12 whitespace-nowrap animate-[fade-in_0.8s_ease]">
          {["Cap-Haïtien", "Indoor Premium", "Lab tested", "Livraison locale", "MonCash accepté", "Cap-Haïtien", "Indoor Premium", "Lab tested"].map((s, i) => (
            <span key={i} className="font-mono text-[11px] uppercase tracking-[0.3em] text-background/60">
              ✦&nbsp;&nbsp;{s}
            </span>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 md:py-28 grain">
        <div className="px-5 md:px-10 max-w-[1400px] mx-auto flex items-baseline justify-between mb-10">
          <h2 className="font-display italic text-4xl md:text-6xl">{t("section.collections")}</h2>
          <Link to="/boutique" className="font-mono text-[11px] uppercase tracking-widest border-b border-foreground pb-1 hover:text-accent hover:border-accent">
            {t("section.all")}
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto no-scrollbar px-5 md:px-10 pb-2 snap-x snap-mandatory">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/boutique"
              className="group min-w-[260px] md:min-w-[320px] flex-shrink-0 snap-start"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-sand mb-4">
                <img
                  src={c.image}
                  alt={c.label[lang]}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-background bg-foreground/70 px-2 py-1">
                  0{CATEGORIES.indexOf(c) + 1}
                </span>
              </div>
              <h3 className="font-display italic text-2xl md:text-3xl">{c.label[lang]}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ESSENTIALS GRID */}
      <section className="py-20 md:py-28 px-5 md:px-10 bg-sand grain">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display italic text-4xl md:text-6xl">{t("section.essentials")}</h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">SEL_001 / {PRODUCTS.length.toString().padStart(3, "0")}</span>
          </div>
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <p className="font-mono text-[11px] uppercase tracking-widest animate-pulse">Chargement...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {essentials.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCT */}
      {featured && (
        <section className="bg-forest text-background py-20 md:py-28 grain">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden bg-bark">
                <img src={featured.image} alt={featured.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-4 md:-right-6 bg-accent w-36 h-36 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center text-center leading-tight text-background">
                <span className="font-mono text-[10px] opacity-90 uppercase tracking-widest">{t("product.cbd")}</span>
                <span className="text-4xl md:text-5xl font-display italic">{featured.cbd}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-7">
              <span className="font-mono text-accent text-[11px] tracking-[0.3em] uppercase">
                {featured.badge?.[lang] ?? t("section.featured")}
              </span>
              <h2 className="text-5xl md:text-7xl font-display italic leading-[0.95]">{featured.name}</h2>
              <div className="flex flex-wrap gap-2 font-mono text-[11px] text-background/60">
                {featured.effects[lang].map((e) => (
                  <span key={e} className="border border-background/20 px-3 py-1 uppercase tracking-widest">{e}</span>
                ))}
              </div>
              <p className="text-base md:text-lg text-background/70 leading-relaxed max-w-prose">
                {featured.description[lang]}
              </p>
              <div className="grid grid-cols-2 border-t border-background/10 pt-7 gap-10">
                <div>
                  <span className="block font-mono text-[10px] text-background/40 uppercase mb-2">{t("product.terpenes")}</span>
                  <ul className="font-sans text-sm space-y-1">
                    {featured.terpenes.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-background/40 uppercase mb-2">Prix</span>
                  <span className="text-3xl font-display italic">${featured.priceUSD}</span>
                  <span className="block text-[10px] font-mono text-background/40">≈ {featured.priceHTG.toLocaleString()} HTG</span>
                </div>
              </div>
              <Link
                to="/produit/$slug"
                params={{ slug: featured.slug }}
                className="text-center py-5 bg-background text-forest font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-accent hover:text-background transition-colors"
              >
                {t("product.add")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PHILOSOPHY */}
      <section className="py-24 md:py-32 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center grain">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent mb-8">
            {t("section.values")}
          </p>
          <p className="font-display italic text-3xl md:text-5xl leading-[1.15] text-balance">
            « {t("values.quote")} »
          </p>
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { v: "100%", l: "Naturel" },
              { v: "Lab", l: "Testé" },
              { v: "Nord", l: "Haïti" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display italic text-4xl md:text-5xl">{s.v}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-foreground text-background py-20 md:py-28 px-5 md:px-10 grain">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-display italic text-4xl md:text-6xl mb-12">Avis clients.</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { q: "La qualité est incomparable. Cap-Haïtien a enfin son adresse premium.", a: "Naïka, 28" },
              { q: "Sa kalite a sans parèy. Mwen toujou retounen pou Citadelle Gold.", a: "Wesley, 31" },
              { q: "Packaging soigné, livraison rapide, produits qui tiennent leurs promesses.", a: "Marc, 24" },
            ].map((t, i) => (
              <figure key={i} className="border-t border-background/15 pt-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">0{i + 1}</span>
                <blockquote className="font-display italic text-2xl mt-4 leading-snug text-balance">
                  « {t.q} »
                </blockquote>
                <figcaption className="font-mono text-[10px] uppercase tracking-widest text-background/50 mt-6">
                  — {t.a}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
