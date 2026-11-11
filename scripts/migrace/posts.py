"""
Migrace blogu: RSS feed (feed_*.xml) + og:image (og.tsv) -> posts.json + SQL seed.
Použití: python scripts/migrace/posts.py <slozka_s_feedy> <og.tsv> public/data/posts.json "supabase/seed/02_posts_{n}.sql"
"""
import sys, os, re, html
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
sys.path.insert(0, os.path.dirname(__file__))
from common import clean_html, text_only, sql_str, write_json

feed_dir, og_path, out_json, out_sql = sys.argv[1:5]
NS = {"content": "http://purl.org/rss/1.0/modules/content/", "dc": "http://purl.org/dc/elements/1.1/"}
og = {}
for line in open(og_path, encoding="utf-8"):
    u, _, img = line.rstrip("\n").partition("\t")
    og[u.rstrip("/")] = img

# Mapování kategorií WordPressu na nové, přehlednější rubriky
CAT_MAP = {
    "Cestování v Mexiku": "Cesty a rituály",
    "Mexiko": "Cesty a rituály",
    "Peru": "Cesty a rituály",
    "Nemoci přírodní léčba": "Přírodní léčba",
    "Zajímavosti z cest": "Cesty a rituály",
    "Bylinky": "Byliny a houby",
}

posts = {}
for f in sorted(os.listdir(feed_dir)):
    if not f.endswith(".xml"):
        continue
    root = ET.parse(os.path.join(feed_dir, f)).getroot()
    for it in root.iter("item"):
        link = it.findtext("link").strip()
        slug = link.rstrip("/").rsplit("/", 1)[-1]
        cats = [c.text for c in it.findall("category") if c.text]
        content = it.findtext("content:encoded", default="", namespaces=NS)
        content = clean_html(content)
        excerpt = text_only(it.findtext("description") or "")
        excerpt = re.sub(r"\s*(Celý článek|Číst dál|\[…\]|\[&#8230;\]|…\s*$).*$", "…", excerpt)[:300]
        dt = parsedate_to_datetime(it.findtext("pubDate"))
        cover = og.get(link.rstrip("/"), "")
        if not cover:
            m = re.search(r'<img[^>]+src="([^"]+)"', content)
            cover = m.group(1) if m else ""
        cat = next((CAT_MAP[c] for c in cats if c in CAT_MAP), cats[0] if cats else "Blog")
        posts[slug] = {
            "slug": slug,
            "title": html.unescape(it.findtext("title")).replace("\u00a0", " "),
            "excerpt": excerpt,
            "content": content,
            "cover_image": cover,
            "category": cat,
            "tags": cats,
            "status": "draft" if slug.startswith("vzorovy-clanek") or slug == "702-2" else "published",
            "published_at": dt.isoformat(),
            "legacy_url": link,
        }

data = sorted(posts.values(), key=lambda p: p["published_at"], reverse=True)
write_json(out_json, data)
cols = ["slug", "title", "excerpt", "content", "cover_image", "category", "tags", "status", "published_at", "legacy_url"]
# Seed rozdělený do 4 souborů (SQL editor v prohlížeči nemá rád megabajtové dávky).
# out_sql = cesta s „{n}“, např. supabase/seed/02_posts_{n}.sql
PARTS = 4
size = -(-len(data) // PARTS)
for i in range(PARTS):
    with open(out_sql.format(n=i + 1), "w", encoding="utf-8") as f:
        f.write(f"-- Seed: články z původního webu anetabenediktova.cz – část {i + 1}/{PARTS} (scripts/migrace/posts.py)\n")
        for p in data[i * size:(i + 1) * size]:
            vals = ",".join(sql_str(p[c]) for c in cols)
            f.write(f"insert into public.posts ({','.join(cols)}) values ({vals}) on conflict (slug) do nothing;\n")
print(len(data), "článků; kategorie:", sorted({p["category"] for p in data}))
