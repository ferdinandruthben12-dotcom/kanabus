import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/legal")({
  component: Legal,
  head: () => ({ meta: [{ title: "Politique CBD — KanaBus" }] }),
});

function Legal() {
  const { t } = useI18n();
  return (
    <div className="pt-28 md:pt-32 px-5 md:px-10 max-w-3xl mx-auto">
      <h1 className="font-display italic text-5xl md:text-7xl leading-[0.95] tracking-tighter">{t("legal.title")}</h1>
      <div className="mt-12 space-y-10 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Disclaimer CBD</h2>
          <p>Les produits KanaBus sont des produits lifestyle destinés exclusivement aux adultes de plus de 18 ans. Ils ne sont pas des médicaments et ne sauraient remplacer un avis médical.</p>
        </section>
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Conformité</h2>
          <p>Tous nos produits respectent les taux de THC autorisés par les standards internationaux. Chaque lot est analysé par un laboratoire indépendant.</p>
        </section>
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Confidentialité</h2>
          <p>Vos données personnelles sont utilisées uniquement pour le traitement de vos commandes et ne sont jamais revendues. Vous pouvez demander leur suppression à tout moment.</p>
        </section>
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">CGV</h2>
          <p>Les commandes sont fermes dès paiement validé. Droit de rétractation conformément à la réglementation locale. Retours acceptés sous 7 jours pour produits non ouverts.</p>
        </section>
      </div>
    </div>
  );
}
