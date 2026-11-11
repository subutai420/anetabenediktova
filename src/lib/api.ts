/**
 * Datová vrstva webu.
 * - Když je napojená Supabase, čte a zapisuje do tabulek `posts` a `stays`.
 * - Bez Supabase čte statická data z /public/data/*.json (náhled, vývoj, Lovable bez backendu).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import type { Post, Stay } from "@/lib/types";

const cache: Record<string, Promise<unknown>> = {};
function loadStatic<T>(name: "posts" | "stays"): Promise<T[]> {
  cache[name] ??= fetch(`/data/${name}.json`).then((r) => r.json());
  return cache[name] as Promise<T[]>;
}

// ---------------------------------------------------------------- Blog
export interface PostQuery {
  category?: string | null;
  search?: string;
  page?: number;
  pageSize?: number;
  includeDrafts?: boolean;
}

export async function fetchPosts({ category, search, page = 1, pageSize = 12, includeDrafts }: PostQuery = {}) {
  const from = (page - 1) * pageSize;
  if (isSupabaseConfigured) {
    let q = supabase
      .from("posts")
      .select("id,slug,title,excerpt,cover_image,category,tags,status,published_at,updated_at", { count: "exact" })
      .order("published_at", { ascending: false })
      .range(from, from + pageSize - 1);
    if (!includeDrafts) q = q.eq("status", "published");
    if (category) q = q.eq("category", category);
    if (search) q = q.ilike("title", `%${search}%`);
    const { data, count, error } = await q;
    if (error) throw error;
    return { items: (data ?? []) as Post[], total: count ?? 0 };
  }
  let all = await loadStatic<Post>("posts");
  if (!includeDrafts) all = all.filter((p) => p.status === "published");
  if (category) all = all.filter((p) => p.category === category);
  if (search) {
    const s = search.toLowerCase();
    all = all.filter((p) => p.title.toLowerCase().includes(s) || (p.excerpt ?? "").toLowerCase().includes(s));
  }
  return { items: all.slice(from, from + pageSize), total: all.length };
}

export async function fetchPost(slug: string): Promise<Post | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data as Post | null;
  }
  return (await loadStatic<Post>("posts")).find((p) => p.slug === slug) ?? null;
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Post | null;
}

export const usePosts = (q: PostQuery = {}) =>
  useQuery({ queryKey: ["posts", q], queryFn: () => fetchPosts(q) });

export const usePost = (slug?: string) =>
  useQuery({ queryKey: ["post", slug], queryFn: () => fetchPost(slug!), enabled: !!slug });

// ---------------------------------------------------------------- Pobyty
export async function fetchStays({ includeDrafts = false, featuredOnly = false } = {}): Promise<Stay[]> {
  if (isSupabaseConfigured) {
    let q = supabase.from("stays").select("*").order("sort_order").order("start_date", { nullsFirst: false });
    if (!includeDrafts) q = q.eq("status", "published");
    if (featuredOnly) q = q.eq("featured", true);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as Stay[];
  }
  let all = await loadStatic<Stay>("stays");
  if (!includeDrafts) all = all.filter((s) => s.status === "published");
  if (featuredOnly) all = all.filter((s) => s.featured);
  return all;
}

export async function fetchStay(slug: string): Promise<Stay | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("stays").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data as Stay | null;
  }
  return (await loadStatic<Stay>("stays")).find((s) => s.slug === slug) ?? null;
}

export async function fetchStayById(id: string): Promise<Stay | null> {
  const { data, error } = await supabase.from("stays").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Stay | null;
}

export const useStays = (opts: { includeDrafts?: boolean; featuredOnly?: boolean } = {}) =>
  useQuery({ queryKey: ["stays", opts], queryFn: () => fetchStays(opts) });

export const useStay = (slug?: string) =>
  useQuery({ queryKey: ["stay", slug], queryFn: () => fetchStay(slug!), enabled: !!slug });

// ---------------------------------------------------------------- Zápis (administrace)
type Table = "posts" | "stays";

export function useSave<T extends { id?: string }>(table: Table) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: T) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { id, updated_at: _ignored, ...rest } = row as any;
      const query = id
        ? supabase.from(table).update(rest).eq("id", id).select().single()
        : supabase.from(table).insert(rest).select().single();
      const { data, error } = await query;
      if (error) throw error;
      return data as T;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      qc.invalidateQueries({ queryKey: [table === "posts" ? "post" : "stay"] });
    },
  });
}

export function useDelete(table: Table) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
}

/** Nahraje obrázek do Supabase Storage (bucket „media“) a vrátí veřejnou URL. */
export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
