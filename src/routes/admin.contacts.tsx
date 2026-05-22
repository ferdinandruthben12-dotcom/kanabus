import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listContacts, updateContactStatus } from "@/lib/admin.functions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contacts")({ component: ContactsPage });

const STATUSES = ["new", "read", "replied", "archived"] as const;

function ContactsPage() {
  const list = useServerFn(listContacts);
  const upd = useServerFn(updateContactStatus);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-contacts"], queryFn: () => list() });

  const mut = useMutation({
    mutationFn: (v: { id: string; status: (typeof STATUSES)[number] }) => upd({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Mis à jour");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10">
        <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/60">Messagerie</p>
        <h1 className="font-display italic text-5xl mt-2">Contacts</h1>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/60">Chargement…</p>
      ) : (
        <div className="space-y-3">
          {(data ?? []).length === 0 && (
            <p className="text-sm text-foreground/60 p-8 border border-foreground/10 bg-card text-center">
              Aucun message.
            </p>
          )}
          {(data ?? []).map((c) => (
            <div key={c.id} className={`border border-foreground/10 bg-card p-6 ${c.status === "new" ? "border-l-4 border-l-accent" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-display italic text-2xl">{c.name}</p>
                  <p className="text-sm text-foreground/70">
                    <a href={`mailto:${c.email}`} className="underline">{c.email}</a>
                    {c.phone && ` · ${c.phone}`}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 mt-1">
                    {new Date(c.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <Select value={c.status} onValueChange={(v) => mut.mutate({ id: c.id, status: v as (typeof STATUSES)[number] })}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {c.subject && <p className="font-medium text-sm mb-2">{c.subject}</p>}
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
