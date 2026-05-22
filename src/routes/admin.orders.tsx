import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listOrders, updateOrderStatus } from "@/lib/admin.functions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({ component: OrdersPage });

const STATUSES = ["pending", "paid", "preparing", "shipped", "delivered", "cancelled"] as const;

function OrdersPage() {
  const list = useServerFn(listOrders);
  const upd = useServerFn(updateOrderStatus);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: () => list() });
  const [filter, setFilter] = useState<string>("all");

  const mut = useMutation({
    mutationFn: (v: { id: string; status: (typeof STATUSES)[number] }) => upd({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Statut mis à jour");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const filtered = (data ?? []).filter((o) => filter === "all" || o.status === filter);

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/60">Logistique</p>
          <h1 className="font-display italic text-5xl mt-2">Commandes</h1>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/60">Chargement…</p>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-foreground/60 p-8 border border-foreground/10 bg-card text-center">
              Aucune commande.
            </p>
          )}
          {filtered.map((o) => (
            <div key={o.id} className="border border-foreground/10 bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                    {o.order_number} · {new Date(o.created_at).toLocaleString("fr-FR")}
                  </p>
                  <p className="font-display italic text-2xl mt-1">{o.customer_name}</p>
                  <p className="text-sm text-foreground/70">{o.customer_email} {o.customer_phone && `· ${o.customer_phone}`}</p>
                  <p className="text-sm text-foreground/70 mt-1">{o.shipping_address} {o.shipping_zone && `(${o.shipping_zone})`}</p>
                </div>
                <div className="text-right">
                  <p className="font-display italic text-3xl">${Number(o.total_usd).toFixed(2)}</p>
                  <p className="text-xs text-foreground/60">{Number(o.total_htg).toFixed(0)} HTG</p>
                  <Select value={o.status} onValueChange={(v) => mut.mutate({ id: o.id, status: v as (typeof STATUSES)[number] })}>
                    <SelectTrigger className="w-40 mt-3"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {o.order_items?.length ? (
                <div className="border-t border-foreground/10 pt-4 mt-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 mb-2">Articles</p>
                  <ul className="text-sm space-y-1">
                    {o.order_items.map((i) => (
                      <li key={i.id} className="flex justify-between">
                        <span>{i.quantity}× {i.product_name} {i.weight && `(${i.weight})`}</span>
                        <span>${(Number(i.unit_price_usd) * i.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {o.notes && <p className="text-xs italic text-foreground/60 mt-3">Note : {o.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
