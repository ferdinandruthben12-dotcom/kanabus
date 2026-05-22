import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPosts, upsertPost, deletePost } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog")({ component: BlogPage });

type PostRow = Awaited<ReturnType<typeof listPosts>>[number];

function BlogPage() {
  const list = useServerFn(listPosts);
  const upsert = useServerFn(upsertPost);
  const del = useServerFn(deletePost);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-posts"], queryFn: () => list() });
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [open, setOpen] = useState(false);

  const saveMut = useMutation({
    mutationFn: (d: Parameters<typeof upsert>[0]["data"]) => upsert({ data: d }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      setOpen(false); setEditing(null);
      toast.success("Article enregistré");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); toast.success("Supprimé"); },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/60">Contenu</p>
          <h1 className="font-display italic text-5xl mt-2">Blog</h1>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="w-4 h-4 mr-2" /> Nouvel article
            </Button>
          </DialogTrigger>
          <PostDialog editing={editing} onSave={(d) => saveMut.mutate(d)} saving={saveMut.isPending} />
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/60">Chargement…</p>
      ) : (
        <div className="space-y-3">
          {(data ?? []).length === 0 && (
            <p className="text-sm text-foreground/60 p-8 border border-foreground/10 bg-card text-center">
              Aucun article.
            </p>
          )}
          {(data ?? []).map((p) => (
            <div key={p.id} className="border border-foreground/10 bg-card p-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-foreground/20">
                  {p.status}
                </span>
                <h3 className="font-display italic text-2xl mt-2">{p.title_fr}</h3>
                {p.excerpt_fr && <p className="text-sm text-foreground/70 mt-1">{p.excerpt_fr}</p>}
                <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 mt-2">
                  {p.slug} · {new Date(p.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(p); setOpen(true); }} className="p-2 hover:bg-foreground/5">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm("Supprimer ?")) delMut.mutate(p.id); }}
                  className="p-2 hover:bg-foreground/5 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostDialog({
  editing,
  onSave,
  saving,
}: {
  editing: PostRow | null;
  onSave: (d: Parameters<typeof upsertPost>[0]["data"]) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(() => ({
    id: editing?.id,
    slug: editing?.slug ?? "",
    title_fr: editing?.title_fr ?? "",
    title_kr: editing?.title_kr ?? "",
    excerpt_fr: editing?.excerpt_fr ?? "",
    excerpt_kr: editing?.excerpt_kr ?? "",
    content_fr: editing?.content_fr ?? "",
    content_kr: editing?.content_kr ?? "",
    cover_image_url: editing?.cover_image_url ?? "",
    status: (editing?.status ?? "draft") as "draft" | "published",
  }));

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editing ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Slug</Label>
            <Input required pattern="[a-z0-9-]+" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <Label>Statut</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "draft" | "published" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Titre FR</Label>
            <Input required value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Titre Kreyòl</Label>
            <Input value={form.title_kr} onChange={(e) => setForm({ ...form, title_kr: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Image de couverture (URL)</Label>
            <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Extrait FR</Label>
            <Textarea value={form.excerpt_fr} onChange={(e) => setForm({ ...form, excerpt_fr: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Contenu FR</Label>
            <Textarea rows={8} value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label>Contenu Kreyòl</Label>
            <Textarea rows={6} value={form.content_kr} onChange={(e) => setForm({ ...form, content_kr: e.target.value })} />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="w-full">{saving ? "..." : "Enregistrer"}</Button>
      </form>
    </DialogContent>
  );
}
