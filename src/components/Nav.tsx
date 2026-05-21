import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";

export function Nav({ overlay = false }: { overlay?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const useDark = overlay && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled || !overlay
          ? "bg-background/85 backdrop-blur-md border-b border-foreground/10 text-foreground"
          : "text-background"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-8 md:gap-10">
          <Link to="/" className="font-display italic text-2xl md:text-3xl tracking-tighter leading-none">
            KanaBus
          </Link>
          <div className="hidden lg:flex gap-7 text-[11px] font-mono uppercase tracking-[0.22em]">
            <Link to="/boutique" className="hover:text-accent transition-colors">{t("nav.shop")}</Link>
            <Link to="/a-propos" className="hover:text-accent transition-colors">{t("nav.about")}</Link>
            <Link to="/livraison" className="hover:text-accent transition-colors">{t("nav.delivery")}</Link>
            <Link to="/faq" className="hover:text-accent transition-colors">{t("nav.faq")}</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">{t("nav.contact")}</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <LangToggle lang={lang} setLang={setLang} dark={useDark} />
          <div className="text-[11px] font-mono uppercase tracking-widest flex items-center gap-2">
            <span className="hidden sm:inline">{t("nav.cart")}</span>
            <span className="bg-accent px-1.5 py-0.5 text-background">0</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LangToggle({ lang, setLang, dark }: { lang: Lang; setLang: (l: Lang) => void; dark: boolean }) {
  const bg = dark ? "bg-white/10" : "bg-foreground/10";
  const active = dark ? "bg-background text-foreground" : "bg-foreground text-background";
  const inactive = dark ? "text-background/70" : "text-foreground/50";
  return (
    <div className={`flex ${bg} p-1 text-[10px] font-mono`}>
      <button
        onClick={() => setLang("fr")}
        className={`px-2.5 py-1 transition-colors ${lang === "fr" ? active : inactive}`}
      >
        FR
      </button>
      <button
        onClick={() => setLang("kr")}
        className={`px-2.5 py-1 transition-colors ${lang === "kr" ? active : inactive}`}
      >
        KR
      </button>
    </div>
  );
}
