"""
Migrace pobytů a statických stránek z MioWeb exportu.

Použití:
  python scripts/migrace/pages.py <export_dir> <repo_root>

Výstup:
  public/data/stays.json            – pobyty (fallback data, když není Supabase)
  supabase/seed/01_stays.sql           – seed pro databázi
  src/content/legacy/<slug>.html    – ostatní stránky převedené do HTML
  public/images/legacy/*            – lokální kopie použitých obrázků
"""
import sys, os, re, json, shutil, urllib.request
sys.path.insert(0, os.path.dirname(__file__))
from common import clean_html, text_only, sql_str, write_json
import mioweb

export_dir, repo = sys.argv[1], sys.argv[2]
img_dir = os.path.join(repo, "public", "images", "legacy")
os.makedirs(img_dir, exist_ok=True)
img = mioweb.ImageResolver(export_dir)

# Aktuálně nabízené pobyty (podle výpisu na anetabenediktova.cz/sluzby/cestovani-s-anetou/, 11/2026)
ACTIVE = {
    "somaticky-retreat-s-ritualem-delohy-na-vysocine": dict(
        title="Transformační pobyt s rituálem dělohy v ČR", date_text="únor a březen 2027",
        cover="https://anetabenediktova.cz/wp-content/uploads/2026/06/3-ohrivace.jpg", cta="To potřebuji",
        excerpt="Cítíte se v poslední době přetížená, unavená? Zvu vás na pobyt, kde najdete sama sebe, klid a zbavíte se toho, co už vám neslouží."),
    "peru-a-machu-picchu-pobyt-se-samany-a-ritualy": dict(
        title="Peru s Machu Picchu – cesta k sobě", date_text="září 2026 a duben 2027", duration_text="11 nocí", price_text="2 550 USD",
        cover="https://anetabenediktova.cz/wp-content/uploads/2024/03/IMG_7510.jpg", cta="To mě zajímá",
        excerpt="Představ si, že stojíš na vrcholku hory nad Machu Picchu, cítíš ticho, dech přírody a spojení se silou, která tu byla dávno před námi."),
    "mexiko-transformacni-pobyt-special": dict(
        title="Mexiko – otevření vnitřní síly (SPECIÁL)", date_text="listopad 2026", duration_text="10 dní", price_text="1 550 EUR",
        cover="https://anetabenediktova.cz/wp-content/uploads/2026/01/oma-2.jpg", cta="Jedu!",
        excerpt="Cítíš, že potřebuješ změnu? Načerpat síly a začít léčení a životní transformaci? Speciální pobyt s rituály mayských šamanek."),
    "spanelstina-na-plazi": dict(
        title="Španělština na pláži", date_text="kdykoliv", duration_text="2 týdny", price_text="15 000 Kč",
        cover="https://anetabenediktova.cz/wp-content/uploads/2026/01/ChatGPT-Image-21.-1.-2026-21_15_24.png", cta="Více informací",
        excerpt="Kurz, který není o biflování, ale o reálném životě, komunikaci a radosti z učení – v prostředí, kde to dává smysl."),
    "mexiko-oslava-dia-de-los-muertos-velky-okruh": dict(
        title="Mexiko: oslava „Día de los muertos“ – velký okruh", date_text="říjen–listopad", duration_text="17 nocí", price_text="2 690 EUR",
        cover="https://anetabenediktova.cz/wp-content/uploads/2023/02/IMG_4624.jpg", cta="Více informací",
        excerpt="Velký okruh Mexikem do míst, kam běžné cestovky nejezdí. Polopoušť, džungle, pyramidy, vodopády i koloniální města – v magickém čase svátku mrtvých."),
    "mexiko-s-ritualy-a-oslavami-svatku-mrtvych": dict(
        title="Mexiko: oslava „Día de los muertos“ – menší okruh", date_text="říjen–listopad", duration_text="12 nocí", price_text="1 990 EUR",
        cover="https://anetabenediktova.cz/wp-content/uploads/2024/11/muertas.jpg", cta="To chci zažít!",
        excerpt="Zažijte Mexiko v čase oslav svátku mrtvých. Barvy, oltáře, tanec… ale i úcta a pokora. Pyramidy Mayů, Karibské moře a očistný temazcal."),
}

SKIP_TYPES_AFTER_HEADER = set()

def country_of(slug):
    if "peru" in slug:
        return "Peru"
    if "mexiko" in slug or "spanelstina" in slug:
        return "Mexiko"
    return "Česko"

def features_of(page):
    for e in mioweb.elements(page.get("layer", {})):
        if e["type"] == "features":
            out = {}
            for it in (e["style"].get("features") or {}).values():
                k = text_only(it.get("title", "")).rstrip(":").lower()
                out[k] = text_only(it.get("text", "")).replace("Více informací", "").strip()
            return out
    return {}

stays = []
order = list(ACTIVE)
for f in sorted(os.listdir(export_dir)):
    if not f.endswith("_1871.php"):
        continue
    slug = f[:-len("_1871.php")]
    page = mioweb.load_page(os.path.join(export_dir, f))
    els = list(mioweb.elements(page.get("layer", {})))
    title = text_only(next((e["style"].get("content", "") for e in els if e["type"] == "title"), slug))
    subtitle = text_only(next((e["style"].get("content", "") for e in els if e["type"] == "text"), ""))
    subtitle = re.sub(r"\s*Zobrazit (více|méně)", "", subtitle).strip()
    feats = features_of(page)
    # obsah = vše kromě úvodního nadpisu, podtitulu a „features“ boxu a formulářů
    seen_title = seen_text = False
    parts = []
    for e in els:
        if e["type"] == "title" and not seen_title:
            seen_title = True; continue
        if e["type"] == "text" and not seen_text:
            seen_text = True; continue
        if e["type"] in ("features", "seform", "contactform", "link"):
            continue
        parts.append(mioweb.el_to_html(e, img))
    content = mioweb.group_figures(clean_html("\n".join(p for p in parts if p)))
    content = re.sub(r"<h2>\s*Informace o pobytu\s*</h2>\s*", "", content)
    a = ACTIVE.get(slug, {})
    first_img = re.search(r'<img src="([^"]+)"', content)
    stays.append({
        "slug": slug,
        "title": a.get("title") or title,
        "subtitle": subtitle,
        "excerpt": a.get("excerpt") or subtitle,
        "country": country_of(slug),
        "date_text": a.get("date_text") or feats.get("termín", ""),
        "duration_text": a.get("duration_text") or feats.get("délka", ""),
        "price_text": a.get("price_text") or feats.get("cena", ""),
        "cover_image": a.get("cover") or (first_img.group(1) if first_img else ""),
        "content": content,
        "cta_text": a.get("cta") or "Mám zájem",
        "status": "published" if slug in ACTIVE else "draft",
        "featured": slug in ACTIVE,
        "sort_order": order.index(slug) if slug in ACTIVE else 100,
        "legacy_url": f"https://anetabenediktova.cz/sluzby/cestovani-s-anetou/{slug}/",
    })
stays.sort(key=lambda s: (s["sort_order"], s["title"]))

# --- statické stránky -> HTML ------------------------------------------------
PAGES = {
    "uvod_0": "uvod", "kdo-jsem_0": "kdo-jsem", "sluzby_0": "sluzby", "kontakt_0": "kontakt",
    "irisdiagnostika_281": "irisdiagnostika", "poradenstvi-na-dalku_281": "poradenstvi-na-dalku",
    "pokec_281": "tradicni-postupy", "byliny-houby-a-priroda-leci_281": "byliny-houby-a-priroda-leci",
    "bylinna-akademie_0": "bylinkova-akademie", "media_0": "media", "ebook-zdarma_0": "ebook-zdarma",
    "cookies_0": "cookies", "zasady-zpracovani-osobnich-udaju_0": "zasady-zpracovani-osobnich-udaju",
    "ritual-delohy-andino_2357": "ritual-delohy-andino",
    "ritual-delohy-osobni-lecba-v-cr_1871": None,  # je mezi pobyty
    "alergie-bylinkova-akademie-serafin_0": "akademie-alergie",
    "deti-a-jejich-nemoci-bylinkova-akademie-serafin_0": "akademie-deti",
    "draci-krev-bylinkova-akademie-serafin_322": "akademie-draci-krev",
    "medicinalni-houby-bylinkova-akademie-serafin_0": "akademie-medicinalni-houby",
    "plice-bylinkova-akademie-serafin_0": "akademie-plice",
    "poruchy-traveni-bylinkova-akademie-serafin_0": "akademie-poruchy-traveni",
    "vysoky-krevni-tlak-bylinkova-akademie-serafin_0": "akademie-vysoky-krevni-tlak",
    "cholesterol-e-book_0": "ebook-cholesterol", "covid-ebook_0": "ebook-covid",
    "lehkost-v-tezkem-byti_322": "archiv-lehkost-v-tezkem-byti",
    "relaxace-a-uvolneni-strachu-7-10_322": "archiv-relaxace-a-uvolneni-strachu",
}
legacy_dir = os.path.join(repo, "src", "content", "legacy")
os.makedirs(legacy_dir, exist_ok=True)
for src, slug in PAGES.items():
    path = os.path.join(export_dir, src + ".php")
    if not slug or not os.path.exists(path):
        continue
    html = mioweb.page_html(mioweb.load_page(path), img)
    with open(os.path.join(legacy_dir, slug + ".html"), "w", encoding="utf-8") as f:
        f.write(html)

# --- obrázky: lokální kopie z exportu + stažení vzdálených ----------------------
for name in img.used:
    shutil.copy2(os.path.join(export_dir, name), os.path.join(img_dir, mioweb.safe_name(name)))

def localize(url):
    m = re.match(r"https?://anetabenediktova\.cz/wp-content/uploads/(\d{4})/(\d{2})/(.+)$", url)
    if not m:
        return url
    name = mioweb.safe_name(f"{m.group(1)}-{m.group(2)}-{m.group(3)}")
    dest = os.path.join(img_dir, name)
    if not os.path.exists(dest):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as o:
                o.write(r.read())
        except Exception as ex:
            print("  ! nelze stáhnout", url, ex)
            return url
    return "/images/legacy/" + name

URL_RE = re.compile(r"https?://anetabenediktova\.cz/wp-content/uploads/[^\"'\s)]+\.(?:jpe?g|png|webp|gif)", re.I)
def localize_all(s):
    return URL_RE.sub(lambda m: localize(m.group(0)), s)

for s in stays:
    s["cover_image"] = localize_all(s["cover_image"])
    s["content"] = localize_all(s["content"])
for f in os.listdir(legacy_dir):
    p = os.path.join(legacy_dir, f)
    t = open(p, encoding="utf-8").read()
    open(p, "w", encoding="utf-8").write(localize_all(t))

write_json(os.path.join(repo, "public", "data", "stays.json"), stays)
cols = ["slug", "title", "subtitle", "excerpt", "country", "date_text", "duration_text", "price_text",
        "cover_image", "content", "cta_text", "status", "featured", "sort_order", "legacy_url"]
with open(os.path.join(repo, "supabase", "seed", "01_stays.sql"), "w", encoding="utf-8") as f:
    f.write("-- Seed: pobyty z původního webu (vygenerováno scripts/migrace/pages.py)\n")
    for s in stays:
        f.write(f"insert into public.stays ({','.join(cols)}) values ({','.join(sql_str(s[c]) for c in cols)}) on conflict (slug) do nothing;\n")

print(len(stays), "pobytů,", sum(1 for s in stays if s["status"] == "published"), "aktivních")
print(len(os.listdir(legacy_dir)), "stránek v src/content/legacy")
print(len(os.listdir(img_dir)), "obrázků v public/images/legacy")
