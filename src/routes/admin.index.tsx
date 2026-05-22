import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/admin.functions";
import { Package, ShoppingBag, Mail, FileText, DollarSign, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Package; label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-foreground/10 bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/60">{label}</p>
        <Icon className="w-4 h-4 text-foreground/40" />
      </div>
      <p className="font-display italic text-4xl">{value}</p>
      {sub && <p className="text-xs text-foreground/60 mt-2">{sub}</p>}
    </div>
  );
}

function Dashboard() {
  const fn = useServerFn(getAdminStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fn() });

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10">
        <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/60">Vue d'ensemble</p>
        <h1 className="font-display italic text-5xl mt-2">Dashboard</h1>
      </div>

      {isLoading || !data ? (
        <p className="text-foreground/60 text-sm">Chargement…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Stat icon={DollarSign} label="Revenu total" value={`$${data.revenueUSD.toFixed(0)}`} sub="commandes non annulées" />
            <Stat icon={ShoppingBag} label="Commandes" value={data.totalOrders} sub={`${data.pendingOrders} en attente`} />
            <Stat icon={Package} label="Produits" value={data.totalProducts} sub={data.lowStock > 0 ? `${data.lowStock} en stock bas` : "stock OK"} />
            <Stat icon={Mail} label="Messages" value={data.newContacts} sub="nouveaux non lus" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Stat icon={FileText} label="Articles publiés" value={data.publishedPosts} />
            <Stat icon={FileText} label="Brouillons" value={data.draftPosts} />
            <Stat icon={AlertTriangle} label="Stock bas (<5)" value={data.lowStock} />
          </div>

          <div className="border border-foreground/10 bg-card">
            <div className="p-6 border-b border-foreground/10">
              <h2 className="font-display italic text-2xl">Dernières commandes</h2>
            </div>
            <div className="divide-y divide-foreground/10">
              {data.recentOrders.length === 0 && (
                <p className="p-6 text-sm text-foreground/60">Aucune commande pour l'instant.</p>
              )}
              {data.recentOrders.map((o) => (
                <div key={o.id} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest">{o.status}</p>
                    <p className="text-xs text-foreground/60 mt-1">{new Date(o.created_at).toLocaleString("fr-FR")}</p>
                  </div>
                  <p className="font-display italic text-2xl">${Number(o.total_usd).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
