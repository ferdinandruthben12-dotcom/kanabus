import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/a-propos")({
  component: About,
  head: () => ({ meta: [{ title: "À propos — KanaBus" }] }),
});

function About() {
  const { t } = useI18n();
  return (
    <div className="pt-28 md:pt-32 px-5 md:px-10 max-w-3xl mx-auto">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent mb-5">KanaBus · Cap-Haïtien</p>
      <h1 className="font-display italic text-5xl md:text-7xl leading-[0.95] tracking-tighter">{t("about.title")}</h1>
      <p className="mt-6 text-base md:text-lg text-foreground/70">{t("about.sub")}</p>
      <div className="prose mt-12 space-y-6 text-foreground/80 leading-relaxed">
        <p>KanaBus est né d'une conviction : Haïti mérite une marque CBD à la hauteur de sa culture, de sa terre et de sa jeunesse. Nous cultivons, sélectionnons et assemblons des produits CBD premium pensés pour le quotidien caribéen.</p>
        <p>Du Massif du Nord aux apiculteurs de la Plaine, chaque ingrédient raconte une histoire locale. Chaque lot est testé en laboratoire. Chaque format est pensé mobile, rapide, lifestyle.</p>
        <p>Notre vision : devenir la référence CBD du marché haïtien, puis de la diaspora — sans jamais perdre l'âme du Cap.</p>
      </div>
    </div>
  );
}
