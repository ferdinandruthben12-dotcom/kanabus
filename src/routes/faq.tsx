import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({ meta: [{ title: "FAQ — KanaBus" }] }),
});

const ITEMS = [
  { q: "Le CBD est-il légal en Haïti ?", a: "Nos produits contiennent un taux de THC conforme aux standards internationaux et sont destinés à un usage lifestyle adulte." },
  { q: "Comment se passe la livraison à Cap-Haïtien ?", a: "Livraison sous 24–48h à Cap-Haïtien. Notifications WhatsApp à chaque étape." },
  { q: "Quels modes de paiement sont acceptés ?", a: "MonCash, carte bancaire et cash à la livraison." },
  { q: "Le CBD est-il un médicament ?", a: "Non. Le CBD n'est pas un médicament. Consultez un professionnel de santé pour tout usage thérapeutique." },
  { q: "Comment conserver mes produits ?", a: "À l'abri de la lumière, dans un endroit frais et sec, hors de portée des enfants." },
  { q: "Proposez-vous des certificats laboratoire ?", a: "Oui, sur simple demande à contact@kanabus.ht." },
];

function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="pt-28 md:pt-32 px-5 md:px-10 max-w-3xl mx-auto">
      <h1 className="font-display italic text-5xl md:text-7xl leading-[0.95] tracking-tighter mb-12">{t("faq.title")}</h1>
      <ul className="divide-y divide-foreground/15 border-y border-foreground/15">
        {ITEMS.map((it, i) => (
          <li key={i}>
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full py-6 flex justify-between items-start gap-6 text-left group">
              <span className="font-display italic text-2xl md:text-3xl group-hover:text-accent transition-colors">{it.q}</span>
              <span className="font-mono text-xl mt-1">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="pb-6 text-foreground/70 leading-relaxed max-w-prose">{it.a}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
