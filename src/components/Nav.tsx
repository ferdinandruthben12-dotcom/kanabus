import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";
import { Menu, X, User } from "lucide-react";

export function Nav({ overlay = false }: { overlay?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const useDark = overlay && !scrolled && !mobileMenuOpen;

  const links = [
    { to: "/boutique", label: t("nav.shop") },
    { to: "/a-propos", label: t("nav.about") },
    { to: "/livraison", label: t("nav.delivery") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !overlay || mobileMenuOpen
            ? "bg-background/95 backdrop-blur-lg border-b border-foreground/10 text-foreground shadow-sm"
            : "text-background"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-8 md:gap-10">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-display italic text-2xl md:text-3xl tracking-tighter leading-none hover:text-accent transition-colors"
            >
              KanaBus
            </Link>
            <div className="hidden lg:flex gap-8 text-[12px] font-mono uppercase tracking-[0.2em] font-medium">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-accent transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5 md:gap-8">
            <LangToggle lang={lang} setLang={setLang} dark={useDark} />
            <Link 
              to="/compte" 
              className="text-[12px] font-mono uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors font-medium"
            >
              <User size={18} />
              <span className="hidden sm:inline">{t("nav.account") || "Compte"}</span>
            </Link>
            <div className="text-[12px] font-mono uppercase tracking-widest flex items-center gap-2 font-medium">
              <span className="hidden sm:inline">{t("nav.cart")}</span>
              <span className="bg-accent px-2 py-0.5 text-background font-bold min-w-[20px] text-center">0</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 transition-colors hover:text-accent flex items-center justify-center bg-foreground/5 rounded-full"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-transform duration-500 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="h-full flex flex-col justify-center px-10 gap-10">
          <div className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display italic text-4xl hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/compte"
              onClick={() => setMobileMenuOpen(false)}
              className="font-display italic text-4xl text-accent hover:opacity-80 transition-colors border-t border-foreground/10 pt-6"
            >
              Mon Compte
            </Link>
          </div>
          <div className="h-px bg-foreground/10 w-full" />
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/40">
              Lifestyle CBD Premium
            </p>
            <div className="flex gap-4">
              <a href="#" className="font-mono text-[11px] uppercase tracking-widest hover:text-accent">Instagram</a>
              <a href="#" className="font-mono text-[11px] uppercase tracking-widest hover:text-accent">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </>
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
