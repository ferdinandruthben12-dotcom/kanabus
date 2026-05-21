import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "kr";

type Dict = Record<string, { fr: string; kr: string }>;

const dict: Dict = {
  "nav.shop": { fr: "Boutique", kr: "Boutik" },
  "nav.about": { fr: "À propos", kr: "Sou nou" },
  "nav.faq": { fr: "FAQ", kr: "FAQ" },
  "nav.contact": { fr: "Contact", kr: "Kontak" },
  "nav.delivery": { fr: "Livraison", kr: "Livrezon" },
  "nav.cart": { fr: "Panier", kr: "Pànye" },

  "hero.title.l1": { fr: "L'Or Vert", kr: "Lò Vèt" },
  "hero.title.l2": { fr: "du Cap.", kr: "nan Kap la." },
  "hero.sub": {
    fr: "Cultivé sous le soleil d'Haïti. Une expérience sensorielle brute et raffinée. CBD premium pour un lifestyle conscient.",
    kr: "Kiltive anba solèy Ayiti. Yon eksperyans sansoryèl brit epi rafine. CBD premye kalite pou yon mòd vi konsyan.",
  },
  "hero.cta": { fr: "Découvrir la Boutique", kr: "Dekouvri Boutik la" },

  "section.collections": { fr: "Nos Collections", kr: "Koleksyon nou yo" },
  "section.essentials": { fr: "Les Essentiels", kr: "Esansyèl yo" },
  "section.featured": { fr: "Sélection du moment", kr: "Seleksyon moman an" },
  "section.values": { fr: "Notre Philosophie", kr: "Filozofi nou" },
  "section.all": { fr: "Tout voir", kr: "Wè tout" },

  "values.quote": {
    fr: "Du soleil d'Haïti à votre bien-être quotidien. Nous croyons en une approche naturelle et sophistiquée du CBD, respectant la terre de nos ancêtres.",
    kr: "Soti nan solèy Ayiti rive nan byen-èt nou chak jou. Nou kwè nan yon apwòch natirèl ak sofistike pou CBD, ki respekte tè zansèt nou yo.",
  },

  "product.add": { fr: "Ajouter au panier", kr: "Mete nan pànye" },
  "product.cbd": { fr: "Taux CBD", kr: "Pousantaj CBD" },
  "product.terpenes": { fr: "Terpènes dominants", kr: "Tèrpèn dominan" },
  "product.effects": { fr: "Effets ressentis", kr: "Efè yo santi" },
  "product.origin": { fr: "Origine", kr: "Orijin" },
  "product.weight": { fr: "Poids", kr: "Pwa" },
  "product.related": { fr: "Vous aimerez aussi", kr: "W ap renmen tou" },
  "product.lab": { fr: "Certificat laboratoire disponible sur demande", kr: "Sètifika laboratwa disponib sou demand" },

  "shop.title": { fr: "Boutique", kr: "Boutik" },
  "shop.sub": { fr: "Sélection complète KanaBus", kr: "Seleksyon konplè KanaBus" },
  "shop.filter.all": { fr: "Tout", kr: "Tout" },
  "shop.sort": { fr: "Trier", kr: "Klase" },
  "shop.count": { fr: "produits", kr: "pwodwi" },

  "age.title": { fr: "Avez-vous plus de 18 ans ?", kr: "Èske w gen plis pase 18 an ?" },
  "age.tag": { fr: "Vérification d'âge", kr: "Verifikasyon laj" },
  "age.yes": { fr: "Oui, entrer", kr: "Wi, antre" },
  "age.no": { fr: "Non", kr: "Non" },
  "age.legal": {
    fr: "L'accès au site est réservé aux adultes. Le CBD n'est pas un médicament.",
    kr: "Aksè sou sit la sèlman pou granmoun. CBD se pa yon medikaman.",
  },

  "footer.tag": {
    fr: "Lifestyle CBD premium ancré à Cap-Haïtien. Cultivé avec soin, conçu pour le quotidien.",
    kr: "Mòd vi CBD premye kalite ki baze nan Kap Ayisyen. Kiltive ak swen, fèt pou chak jou.",
  },
  "footer.shop": { fr: "Boutique", kr: "Boutik" },
  "footer.info": { fr: "Infos", kr: "Enfòmasyon" },
  "footer.legal": { fr: "Légal", kr: "Legal" },
  "footer.legalNote": {
    fr: "Vente interdite aux mineurs. Nos produits ne sont pas des médicaments. À consommer avec modération.",
    kr: "Vant entèdi pou minè. Pwodwi nou yo se pa medikaman. Konsome ak modérasyon.",
  },

  "contact.title": { fr: "Contact", kr: "Kontak" },
  "contact.sub": { fr: "Une question, une commande sur-mesure, un partenariat — écrivez-nous.", kr: "Yon kesyon, yon kòmand sou mezi, yon patenarya — ekri nou." },

  "delivery.title": { fr: "Livraison", kr: "Livrezon" },
  "delivery.sub": { fr: "Cap-Haïtien et alentours, livraison rapide.", kr: "Kap Ayisyen ak zòn ki bò kote l, livrezon rapid." },

  "faq.title": { fr: "Questions fréquentes", kr: "Kesyon yo poze souvan" },

  "about.title": { fr: "L'âme du Cap-Haïtien dans chaque fleur.", kr: "Nanm Kap Ayisyen nan chak flè." },
  "about.sub": { fr: "Notre histoire, notre culture, notre vision lifestyle.", kr: "Istwa nou, kilti nou, vizyon mòd vi nou." },

  "legal.title": { fr: "Politique CBD & mentions légales", kr: "Politik CBD & mansyon legal" },
};

type I18nCtx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kanabus.lang") as Lang | null;
      if (saved === "fr" || saved === "kr") setLangState(saved);
    } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("kanabus.lang", l); } catch {}
  };
  const t = (key: string) => dict[key]?.[lang] ?? key;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
