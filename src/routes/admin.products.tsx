import { createFileRoute } from "@tanstack/react-router";
import type { ProductInput } from "@/lib/admin.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProducts, upsertProduct, deleteProduct } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({ component: ProductsPage });

type ProductRow = Awaited<ReturnType<typeof listProducts>>[number];

function ProductsPage() {
  const list = useServerFn(listProducts);
  const upsert = useServerFn(upsertProduct);
  const del = useServerFn(deleteProduct);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: () => list() });
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [open, setOpen] = useState(false);

  const saveMut = useMutation({
    mutationFn: (d: ProductInput) => upsert({ data: d }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      setOpen(false); setEditing(null);
      toast.success("Produit enregistré");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Supprimé");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/60">Catalogue</p>
          <h1 className="font-display italic text-5xl mt-2">Produits</h1>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="w-4 h-4 mr-2" /> Nouveau
            </Button>
          </DialogTrigger>
          <ProductDialog editing={editing} onSave={(d) => saveMut.mutate(d)} saving={saveMut.isPending} />
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/60">Chargement…</p>
      ) : (
        <div className="border border-foreground/10 bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/10 text-[10px] font-mono uppercase tracking-widest text-foreground/60">
              <tr>
                <th className="text-left p-4">Nom</th>
                <th className="text-left p-4">Catégorie</th>
                <th className="text-right p-4">Prix USD</th>
                <th className="text-right p-4">Prix HTG</th>
                <th className="text-right p-4">Stock</th>
                <th className="text-left p-4">Statut</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {(data ?? []).map((p) => (
                <tr key={p.id}>
                  <td className="p-4">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-foreground/60">{p.slug}</p>
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 text-right">${Number(p.price_usd).toFixed(2)}</td>
                  <td className="p-4 text-right">{Number(p.price_htg).toFixed(0)}</td>
                  <td className={`p-4 text-right ${p.stock < 5 ? "text-accent" : ""}`}>{p.stock}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-foreground/20">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => { setEditing(p); setOpen(true); }}
                      className="p-2 hover:bg-foreground/5"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { if (confirm("Supprimer ce produit ?")) delMut.mutate(p.id); }}
                      className="p-2 hover:bg-foreground/5 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {(data ?? []).length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-foreground/60">Aucun produit. Créez le premier.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductDialog({
  editing,
  onSave,
  saving,
}: {
  editing: ProductRow | null;
  onSave: (d: ProductInput) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(() => ({
    id: editing?.id,
    slug: editing?.slug ?? "",
    name: editing?.name ?? "",
    category: editing?.category ?? "fleurs",
    description_fr: editing?.description_fr ?? "",
    description_kr: editing?.description_kr ?? "",
    cbd_value: editing?.cbd_value != null ? Number(editing.cbd_value) : 0,
    cbd_unit: editing?.cbd_unit ?? "%",
    price_usd: Number(editing?.price_usd ?? 0),
    price_htg: Number(editing?.price_htg ?? 0),
    stock: editing?.stock ?? 0,
    origin: editing?.origin ?? "",
    image_url: editing?.image_url ?? "",
    status: (editing?.status ?? "draft") as "draft" | "published" | "archived",
    badge_fr: editing?.badge_fr ?? "",
    badge_kr: editing?.badge_kr ?? "",
  }));

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editing ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Nom</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input required pattern="[a-z0-9-]+" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <Label>Catégorie</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fleurs">Fleurs</SelectItem>
                <SelectItem value="gummies">Gummies</SelectItem>
                <SelectItem value="the">Thé</SelectItem>
                <SelectItem value="miel">Miel</SelectItem>
                <SelectItem value="chocolat">Chocolat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Statut</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prix USD</Label>
            <Input type="number" step="0.01" required value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Prix HTG</Label>
            <Input type="number" step="1" required value={form.price_htg} onChange={(e) => setForm({ ...form, price_htg: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" min={0} required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          </div>
          <div>
            <Label>CBD ({form.cbd_unit})</Label>
            <Input type="number" step="0.1" value={form.cbd_value} onChange={(e) => setForm({ ...form, cbd_value: Number(e.target.value) })} />
          </div>
          <div className="col-span-2">
            <Label>Origine</Label>
            <Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Image URL</Label>
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Description FR</Label>
            <Textarea value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Description Kreyòl</Label>
            <Textarea value={form.description_kr} onChange={(e) => setForm({ ...form, description_kr: e.target.value })} />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "..." : "Enregistrer"}
        </Button>
      </form>
    </DialogContent>
  );
}
