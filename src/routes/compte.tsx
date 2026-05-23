import { createFileRoute, useNavigate, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, ShoppingBag, LogOut, ChevronRight, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/compte")({
  head: () => ({
    meta: [{ title: "Mon Compte — KanaBus" }],
  }),
  component: AccountLayout,
});

function AccountLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: "/login" });
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/login" });
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    navigate({ to: "/" });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/60 animate-pulse">
          Chargement de votre espace...
        </p>
      </div>
    );
  }

  const menu = [
    { to: "/compte", label: "Profil", icon: User, exact: true },
    { to: "/compte/commandes", label: "Mes Commandes", icon: ShoppingBag },
    { to: "/compte/adresses", label: "Adresses", icon: MapPin },
  ];

  return (
    <div className="pt-24 md:pt-32 min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid lg:grid-cols-[280px_1fr] gap-10 md:gap-16">
        {/* SIDEBAR */}
        <aside className="space-y-8">
          <div>
            <h1 className="font-display italic text-4xl mb-2">Mon Compte</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
              {user?.email}
            </p>
          </div>

          <nav className="flex flex-col border-t border-foreground/10 pt-6">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-4 py-4 border-b border-foreground/5 transition-colors group ${
                    active ? "text-accent" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest">
                    <Icon size={16} />
                    {item.label}
                  </div>
                  <ChevronRight size={14} className={`transition-transform ${active ? "translate-x-1" : "group-hover:translate-x-1 opacity-0 group-hover:opacity-100"}`} />
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-6 font-mono text-[11px] uppercase tracking-widest text-foreground/40 hover:text-destructive transition-colors"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="bg-card/30 border border-foreground/5 p-6 md:p-10 grain">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
