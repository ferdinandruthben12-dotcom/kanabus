import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/livraison")({
  component: Delivery,
  head: () => ({ meta: [{ title: "Livraison — KanaBus" }] }),
});

const ZONES = [
  { z: "Cap-Haïtien centre", d: "24h", p: "200 HTG" },
  { z: "Banlieue Cap-Haïtien", d: "24–48h", p: "350 HTG" },
  { z: "Plaine du Nord", d: "48h", p: "500 HTG" },
  { z: "Port-au-Prince (express)", d: "3–5 jours", p: "Sur devis" },
];

function Delivery() {
  const { t } = useI18n();
  return (
    <div className="pt-28 md:pt-32 px-5 md:px-10 max-w-3xl mx-auto">
      <h1 className="font-display italic text-5xl md:text-7xl leading-[0.95] tracking-tighter">{t("delivery.title")}</h1>
      <p className="mt-6 text-base text-foreground/70">{t("delivery.sub")}</p>
      <table className="mt-12 w-full text-left text-sm border-t border-foreground/15">
        <thead className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
          <tr><th className="py-4">Zone</th><th>Délai</th><th className="text-right">Tarif</th></tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {ZONES.map((z) => (
            <tr key={z.z}>
              <td className="py-5 font-display italic text-xl">{z.z}</td>
              <td className="font-mono text-xs uppercase tracking-widest">{z.d}</td>
              <td className="text-right font-mono">{z.p}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-10 text-sm text-foreground/60 leading-relaxed">
        Paiements acceptés : MonCash · Carte bancaire · Cash à la livraison. Notifications WhatsApp à chaque étape de votre commande.
      </p>
    </div>
  );
}
