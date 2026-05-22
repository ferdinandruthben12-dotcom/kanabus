import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyRole, claimAdminIfFirst } from "@/lib/admin.functions";
import { LayoutDashboard, Package, ShoppingBag, Mail, FileText, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — KanaBus" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const getRole = useServerFn(getMyRole);
  const claim = useServerFn(claimAdminIfFirst);
  const [state, setState] = useState<"loading" | "ready" | "denied">("loading");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/login" });
    });

    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) {
        navigate({ to: "/login" });
        return;
      }
      setEmail(s.session.user.email ?? "");
      try {
        let role = await getRole();
        if (!role.isStaff) {
          // Try to claim admin if no admin exists yet
          const c = await claim();
          if (c.claimed) {
            role = await getRole();
          }
        }
        if (!mounted) return;
        if (role.isStaff) setState("ready");
        else setState("denied");
      } catch {
        if (mounted) setState("denied");
      }
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [getRole, claim, navigate]);

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    navigate({ to: "/login" });
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/60">
          Chargement…
        </p>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-display italic text-4xl">Accès refusé</h1>
          <p className="text-sm text-foreground/60">
            Ton compte n'a pas les permissions admin. Demande à un admin existant de t'ajouter.
          </p>
          <button onClick={logout} className="text-[11px] font-mono uppercase tracking-widest underline">
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Produits", icon: Package },
    { to: "/admin/orders", label: "Commandes", icon: ShoppingBag },
    { to: "/admin/contacts", label: "Contacts", icon: Mail },
    { to: "/admin/blog", label: "Blog", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-foreground/10 bg-card flex flex-col">
        <div className="p-6 border-b border-foreground/10">
          <Link to="/" className="font-display italic text-2xl block">KanaBus</Link>
          <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 mt-1">
            Admin
          </p>
        </div>
        <nav className="flex-1 py-4">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-6 py-3 text-[11px] font-mono uppercase tracking-widest transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-foreground/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-foreground/10">
          <p className="text-[10px] text-foreground/60 truncate mb-2">{email}</p>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-foreground/70 hover:text-foreground"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
