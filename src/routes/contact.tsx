import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — KanaBus" }] }),
});

function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  return (
    <div className="pt-28 md:pt-32 px-5 md:px-10 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent mb-5">KanaBus</p>
        <h1 className="font-display italic text-5xl md:text-7xl leading-[0.95] tracking-tighter">{t("contact.title")}</h1>
        <p className="mt-6 text-base text-foreground/70 max-w-md">{t("contact.sub")}</p>
        <div className="mt-12 space-y-5 font-mono text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">WhatsApp</p>
            <a href="https://wa.me/" className="hover:text-accent">+509 0000 0000</a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Email</p>
            <a href="mailto:contact@kanabus.ht" className="hover:text-accent">contact@kanabus.ht</a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Instagram</p>
            <a href="https://instagram.com" className="hover:text-accent">@kanabus.ht</a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Adresse</p>
            <p>Cap-Haïtien, Nord, Haïti</p>
          </div>
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6 bg-sand p-8 md:p-10 grain">
        {(["Nom", "Email", "Sujet"] as const).map((l) => (
          <label key={l} className="block">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">{l}</span>
            <input required maxLength={120} className="w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent" />
          </label>
        ))}
        <label className="block">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">Message</span>
          <textarea required maxLength={1000} rows={5} className="w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent resize-none" />
        </label>
        <button type="submit" className="w-full py-4 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors">
          {sent ? "✓ Message envoyé" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
