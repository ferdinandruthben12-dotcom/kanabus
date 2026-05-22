import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion admin — KanaBus" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Compte créé. Vérifie ton email si confirmation requise.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté.");
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 grain">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-display italic text-4xl mb-2">
          KanaBus
        </Link>
        <p className="text-center text-[11px] font-mono uppercase tracking-widest text-foreground/60 mb-8">
          Espace administration
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 border border-foreground/10 bg-card p-8">
          <div>
            <Label htmlFor="email" className="text-[11px] font-mono uppercase tracking-widest">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-[11px] font-mono uppercase tracking-widest">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "..." : mode === "signin" ? "Se connecter" : "Créer un compte"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-xs text-foreground/60 hover:text-foreground"
          >
            {mode === "signin"
              ? "Pas encore de compte ? Créer un compte"
              : "Déjà inscrit ? Se connecter"}
          </button>
        </form>
        <p className="mt-6 text-[10px] font-mono uppercase tracking-widest text-foreground/40 text-center">
          Le premier compte créé devient automatiquement admin.
        </p>
      </div>
    </div>
  );
}
