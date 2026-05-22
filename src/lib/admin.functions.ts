import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertStaff(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "staff"])
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(60),
  description_fr: z.string().max(4000).optional().nullable(),
  description_kr: z.string().max(4000).optional().nullable(),
  cbd_value: z.number().nullable().optional(),
  cbd_unit: z.string().max(8).optional().nullable(),
  price_usd: z.number().min(0),
  price_htg: z.number().min(0),
  stock: z.number().int().min(0),
  origin: z.string().max(200).optional().nullable(),
  image_url: z.string().max(2000).optional().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  badge_fr: z.string().max(60).optional().nullable(),
  badge_kr: z.string().max(60).optional().nullable(),
});
export type ProductInput = z.infer<typeof productSchema>;
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const [orders, products, contacts, posts] = await Promise.all([
      supabaseAdmin.from("orders").select("id,status,total_usd,created_at"),
      supabaseAdmin.from("products").select("id,stock,status"),
      supabaseAdmin.from("contacts").select("id,status"),
      supabaseAdmin.from("blog_posts").select("id,status"),
    ]);
    const o = orders.data ?? [];
    const p = products.data ?? [];
    const c = contacts.data ?? [];
    const b = posts.data ?? [];
    return {
      totalOrders: o.length,
      pendingOrders: o.filter((x) => x.status === "pending" || x.status === "preparing").length,
      revenueUSD: o.filter((x) => x.status !== "cancelled").reduce((s, x) => s + Number(x.total_usd ?? 0), 0),
      totalProducts: p.length,
      lowStock: p.filter((x) => (x.stock ?? 0) < 5).length,
      newContacts: c.filter((x) => x.status === "new").length,
      publishedPosts: b.filter((x) => x.status === "published").length,
      draftPosts: b.filter((x) => x.status === "draft").length,
      recentOrders: o
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 5),
    };
  });

// ---------- Products ----------

export const listProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { id, ...rest } = data;
    if (id) {
      const { error } = await supabaseAdmin.from("products").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: ins, error } = await supabaseAdmin.from("products").insert(rest).select("id").single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Orders ----------
export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "paid", "preparing", "shipped", "delivered", "cancelled"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Contacts ----------
export const listContacts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateContactStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["new", "read", "replied", "archived"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin.from("contacts").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Blog ----------
const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/),
  title_fr: z.string().min(1).max(200),
  title_kr: z.string().max(200).optional().nullable(),
  excerpt_fr: z.string().max(500).optional().nullable(),
  excerpt_kr: z.string().max(500).optional().nullable(),
  content_fr: z.string().max(40000).optional().nullable(),
  content_kr: z.string().max(40000).optional().nullable(),
  cover_image_url: z.string().max(2000).optional().nullable(),
  status: z.enum(["draft", "published"]),
});

export const listPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => postSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { id, ...rest } = data;
    const payload = {
      ...rest,
      author_id: context.userId,
      published_at: rest.status === "published" ? new Date().toISOString() : null,
    };
    if (id) {
      const { error } = await supabaseAdmin.from("blog_posts").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: ins, error } = await supabaseAdmin.from("blog_posts").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Role check (for client gate) ----------
export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((r) => r.role);
    return {
      userId: context.userId,
      isAdmin: roles.includes("admin"),
      isStaff: roles.includes("admin") || roles.includes("staff"),
      roles,
    };
  });

// ---------- Bootstrap: make first user admin ----------
export const claimAdminIfFirst = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error: ce } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (ce) throw new Error(ce.message);
    if ((count ?? 0) > 0) return { claimed: false, reason: "admin_exists" };
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { claimed: true };
  });
