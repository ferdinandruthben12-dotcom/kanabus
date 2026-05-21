import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-foreground text-background pt-20 pb-10 px-5 md:px-10 mt-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-5 space-y-6">
          <div className="font-display italic text-5xl md:text-6xl">KanaBus</div>
          <p className="max-w-sm text-sm leading-relaxed text-background/60">{t("footer.tag")}</p>
          <div className="flex gap-6 text-[11px] font-mono uppercase tracking-widest">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">WhatsApp</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">TikTok</a>
          </div>
        </div>
        <div className="md:col-span-3 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-background/40">{t("footer.shop")}</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/boutique" className="hover:text-accent">Fleurs</Link></li>
            <li><Link to="/boutique" className="hover:text-accent">Gummies</Link></li>
            <li><Link to="/boutique" className="hover:text-accent">Thé</Link></li>
            <li><Link to="/boutique" className="hover:text-accent">Miel</Link></li>
            <li><Link to="/boutique" className="hover:text-accent">Chocolat</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-background/40">{t("footer.info")}</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/livraison" className="hover:text-accent">{t("nav.delivery")}</Link></li>
            <li><Link to="/faq" className="hover:text-accent">{t("nav.faq")}</Link></li>
            <li><Link to="/contact" className="hover:text-accent">{t("nav.contact")}</Link></li>
            <li><Link to="/a-propos" className="hover:text-accent">{t("nav.about")}</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-background/40">{t("footer.legal")}</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/legal" className="hover:text-accent">Politique CBD</Link></li>
            <li><Link to="/legal" className="hover:text-accent">Confidentialité</Link></li>
            <li><Link to="/legal" className="hover:text-accent">CGV</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-background/10 grid gap-6 md:flex md:justify-between md:items-end">
        <p className="max-w-md text-[11px] leading-relaxed text-background/40">{t("footer.legalNote")}</p>
        <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-background/40">
          <span>+18 ANS</span>
          <span>© 2026 KANABUS — CAP-HAÏTIEN</span>
        </div>
      </div>
    </footer>
  );
}
