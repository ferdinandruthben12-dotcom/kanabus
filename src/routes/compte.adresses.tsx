import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Phone, Home } from "lucide-react";

export const Route = createFileRoute("/compte/adresses")({
  component: AddressesPage,
});

function AddressesPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    shipping_address: "",
    shipping_phone: "",
    shipping_city: "Cap-Haïtien",
  });

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("shipping_address, shipping_phone, shipping_city")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setProfile({
            shipping_address: data.shipping_address || "",
            shipping_phone: data.shipping_phone || "",
            shipping_city: data.shipping_city || "Cap-Haïtien",
          });
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          shipping_address: profile.shipping_address,
          shipping_phone: profile.shipping_phone,
          shipping_city: profile.shipping_city,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;
      toast.success("Adresse enregistrée");
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="font-mono text-[11px] uppercase tracking-widest opacity-50">Chargement...</p>;

  return (
    <div className="max-w-xl">
      <h2 className="font-display italic text-3xl mb-8">Adresse de livraison</h2>
      <p className="text-sm text-foreground/60 mb-10 leading-relaxed">
        Enregistrez vos coordonnées par défaut pour accélérer vos prochaines commandes. Nous livrons principalement au Cap-Haïtien et ses environs.
      </p>
      
      <form onSubmit={handleUpdate} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/50 flex items-center gap-2">
              <Home size={12} /> Adresse complète
            </Label>
            <Input
              id="address"
              value={profile.shipping_address}
              onChange={(e) => setProfile({ ...profile, shipping_address: e.target.value })}
              placeholder="Rue, quartier, numéro de maison..."
              className="bg-transparent border-foreground/10 rounded-none focus-visible:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/50 flex items-center gap-2">
                <MapPin size={12} /> Ville
              </Label>
              <Input
                id="city"
                value={profile.shipping_city}
                onChange={(e) => setProfile({ ...profile, shipping_city: e.target.value })}
                className="bg-transparent border-foreground/10 rounded-none focus-visible:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/50 flex items-center gap-2">
                <Phone size={12} /> Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profile.shipping_phone}
                onChange={(e) => setProfile({ ...profile, shipping_phone: e.target.value })}
                placeholder="+509 ..."
                className="bg-transparent border-foreground/10 rounded-none focus-visible:ring-accent"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-foreground/5 mt-10">
          <Button 
            type="submit" 
            disabled={updating}
            className="bg-foreground text-background rounded-none px-8 py-6 h-auto font-mono text-[11px] uppercase tracking-widest hover:bg-accent transition-colors w-full md:w-auto"
          >
            {updating ? "Enregistrement..." : "Enregistrer l'adresse"}
          </Button>
        </div>
      </form>

      <div className="mt-16 p-6 border border-dashed border-accent/20 bg-accent/5">
        <p className="text-[11px] font-mono uppercase tracking-widest text-accent mb-2">Note sur la livraison</p>
        <p className="text-sm text-foreground/70 italic">
          « Nos coursiers livrent discrètement et rapidement. Assurez-vous que le numéro de téléphone est correct pour la coordination lors de l'arrivée. »
        </p>
      </div>
    </div>
  );
}
