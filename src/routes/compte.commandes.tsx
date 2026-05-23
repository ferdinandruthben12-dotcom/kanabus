import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Package, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/compte/commandes")({
  component: OrdersPage,
});

function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function getOrders() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (data) setOrders(data);
      }
      setLoading(false);
    }
    getOrders();
  }, []);

  if (loading) return <p className="font-mono text-[11px] uppercase tracking-widest opacity-50">Chargement...</p>;

  return (
    <div>
      <h2 className="font-display italic text-3xl mb-8">Mes Commandes</h2>

      {orders.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-foreground/10 bg-sand/10">
          <Package className="mx-auto mb-4 text-foreground/20" size={40} />
          <p className="font-mono text-[11px] uppercase tracking-widest text-foreground/60 mb-6">
            Vous n'avez pas encore passé de commande.
          </p>
          <Link 
            to="/boutique" 
            className="inline-block bg-foreground text-background px-8 py-4 font-mono text-[11px] uppercase tracking-widest hover:bg-accent transition-colors"
          >
            Aller à la boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-foreground/10 p-6 flex flex-col md:flex-row justify-between gap-6 group hover:border-accent/30 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest bg-foreground text-background px-2 py-1">
                    #{order.order_number}
                  </span>
                  <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1 border ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/40">
                  Commandé le {format(new Date(order.created_at), "dd MMMM yyyy", { locale: fr })}
                </p>
                <div className="flex gap-4 items-baseline">
                  <p className="font-display italic text-2xl">${order.total_usd.toFixed(2)}</p>
                  <p className="text-xs text-foreground/40 font-mono">≈ {order.total_htg.toLocaleString()} HTG</p>
                </div>
              </div>
              
              <div className="flex items-end">
                <button className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest border-b border-foreground/10 pb-1 group-hover:border-accent group-hover:text-accent transition-colors">
                  Détails de la commande <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'delivered':
      return 'border-green-500/20 text-green-600 bg-green-500/5';
    case 'pending':
      return 'border-orange-500/20 text-orange-600 bg-orange-500/5';
    case 'cancelled':
      return 'border-red-500/20 text-red-600 bg-red-500/5';
    default:
      return 'border-foreground/10 text-foreground/60';
  }
}
