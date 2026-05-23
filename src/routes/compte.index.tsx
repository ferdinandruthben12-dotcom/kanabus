import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/compte/")({
  component: ProfilePage,
});

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    avatar_url: "",
  });

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setProfile({
            display_name: data.display_name || "",
            avatar_url: data.avatar_url || "",
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
          display_name: profile.display_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;
      toast.success("Profil mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="font-mono text-[11px] uppercase tracking-widest opacity-50">Chargement...</p>;

  return (
    <div className="max-w-xl">
      <h2 className="font-display italic text-3xl mb-8">Informations personnelles</h2>
      
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="display_name" className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/50">
            Nom d'affichage
          </Label>
          <Input
            id="display_name"
            value={profile.display_name}
            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
            placeholder="Votre nom complet"
            className="bg-transparent border-foreground/10 rounded-none focus-visible:ring-accent"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={updating}
            className="bg-foreground text-background rounded-none px-8 py-6 h-auto font-mono text-[11px] uppercase tracking-widest hover:bg-accent transition-colors"
          >
            {updating ? "Mise à jour..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>

      <div className="mt-16 p-6 border border-foreground/10 bg-sand/20">
        <h3 className="font-display italic text-xl mb-3">Sécurité</h3>
        <p className="text-sm text-foreground/60 mb-6 leading-relaxed">
          Pour changer votre mot de passe ou votre adresse email, veuillez utiliser le lien de récupération envoyé lors de votre inscription ou contactez notre support.
        </p>
        <button className="text-[11px] font-mono uppercase tracking-widest border-b border-foreground/20 pb-1 hover:text-accent hover:border-accent transition-colors">
          Changer de mot de passe →
        </button>
      </div>
    </div>
  );
}
