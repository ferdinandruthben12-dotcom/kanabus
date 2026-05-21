import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const KEY = "kanabus.age-confirmed";

export function AgeGate() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const confirm = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-forest/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
      <div className="grain max-w-md w-full bg-background p-10 text-center shadow-2xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-5 block">
          {t("age.tag")}
        </span>
        <h2 className="font-display italic text-4xl mb-5 leading-tight">{t("age.title")}</h2>
        <p className="text-xs text-foreground/60 mb-8 leading-relaxed">{t("age.legal")}</p>
        <div className="flex gap-3">
          <button
            onClick={confirm}
            className="flex-1 py-4 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors"
          >
            {t("age.yes")}
          </button>
          <a
            href="https://www.google.com"
            className="flex-1 py-4 border border-foreground/15 text-foreground text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-foreground/5 transition-colors"
          >
            {t("age.no")}
          </a>
        </div>
      </div>
    </div>
  );
}
