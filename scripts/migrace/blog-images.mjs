/**
 * Přenese obrázky blogu ze starého webu (anetabenediktova.cz/wp-content/…) do Supabase Storage
 * a přepíše odkazy v tabulce `posts` (content i cover_image).
 *
 * Spustit JEDNOU po importu seedů a PŘED vypnutím starého webu:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrace/blog-images.mjs
 *
 * Service role klíč nikdy nedávejte do frontendu ani do gitu.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Chybí SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, key);
const OLD = /https?:\/\/anetabenediktova\.cz\/wp-content\/uploads\/[^"'\s)]+\.(?:jpe?g|png|webp|gif)/gi;
const done = new Map();

async function migrate(oldUrl) {
  if (done.has(oldUrl)) return done.get(oldUrl);
  const path = "wp/" + oldUrl.split("/wp-content/uploads/")[1];
  const res = await fetch(oldUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.warn("  ! nelze stáhnout", oldUrl, res.status);
    done.set(oldUrl, oldUrl);
    return oldUrl;
  }
  const body = new Uint8Array(await res.arrayBuffer());
  const { error } = await supabase.storage
    .from("media")
    .upload(path, body, { contentType: res.headers.get("content-type") ?? "image/jpeg", upsert: true });
  if (error) throw error;
  const newUrl = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  done.set(oldUrl, newUrl);
  return newUrl;
}

const { data: posts, error } = await supabase.from("posts").select("id,slug,content,cover_image");
if (error) throw error;
for (const p of posts) {
  const urls = new Set([...(p.content ?? "").matchAll(OLD)].map((m) => m[0]));
  if (p.cover_image?.match(OLD)) urls.add(p.cover_image);
  if (!urls.size) continue;
  let content = p.content ?? "";
  let cover = p.cover_image;
  for (const u of urls) {
    const n = await migrate(u);
    content = content.split(u).join(n);
    if (cover === u) cover = n;
  }
  const { error: e } = await supabase.from("posts").update({ content, cover_image: cover }).eq("id", p.id);
  if (e) throw e;
  console.log(`✓ ${p.slug} (${urls.size} obr.)`);
}
console.log(`Hotovo – přeneseno ${done.size} obrázků.`);
