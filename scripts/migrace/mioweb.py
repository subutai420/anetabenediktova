"""Převod stránek z MioWeb exportu (base64 + PHP serialize) na čisté HTML."""
import base64, re, os, unicodedata, html as H
from common import clean_html

def php_unserialize(b: bytes, i: int = 0):
    t = b[i:i+1]
    if t == b"N":
        return None, i + 2
    if t in (b"i", b"d", b"b"):
        j = b.index(b";", i); v = b[i+2:j]
        return (int(v) if t == b"i" else float(v) if t == b"d" else v == b"1"), j + 1
    if t == b"s":
        j = b.index(b":", i+2); n = int(b[i+2:j]); s = b[j+2:j+2+n]
        return s.decode("utf-8", "replace"), j + 2 + n + 2
    if t == b"a":
        j = b.index(b":", i+2); n = int(b[i+2:j]); i = j + 2; d = {}
        for _ in range(n):
            k, i = php_unserialize(b, i); v, i = php_unserialize(b, i); d[str(k)] = v
        return d, i + 1
    raise ValueError(f"bad type {t!r} at {i}")

def load_page(path):
    raw = open(path, "rb").read().strip()
    return php_unserialize(base64.b64decode(raw))[0]

def elements(node):
    """Prochází strom stránky v pořadí a vrací prvky (title, text, image…)."""
    if isinstance(node, dict):
        if "type" in node and isinstance(node.get("style"), dict) and "config" in node:
            yield node
            if node["type"] == "box":
                yield from elements(node.get("content", {}))
            return
        for k, v in node.items():
            if k == "style":
                continue
            yield from elements(v)

def safe_name(name: str) -> str:
    """Název souboru bez diakritiky a zvláštních znaků (bezpečný v URL)."""
    n = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^A-Za-z0-9._-]", "-", n)

class ImageResolver:
    """Vrací cestu k obrázku – lokální kopii z exportu, jinak původní URL."""
    def __init__(self, export_dir, public_prefix="/images/legacy/"):
        self.export_dir = export_dir
        self.prefix = public_prefix
        self.used = set()
        self.remote = set()

    def __call__(self, img: dict) -> str:
        if not isinstance(img, dict):
            return ""
        local = re.sub(r"%%replace_image_|%%", "", img.get("image") or "")
        full = img.get("full_image") or ""
        if local and not local.startswith("http") and not re.search(r"-\d+x\d+\.\w+$", local) \
                and os.path.exists(os.path.join(self.export_dir, local)):
            self.used.add(local)
            return self.prefix + safe_name(local)
        if full:
            self.remote.add(full)
            return full
        if local.startswith("http"):
            return local
        if local and os.path.exists(os.path.join(self.export_dir, local)):
            self.used.add(local)
            return self.prefix + safe_name(local)
        return ""

def yt_embed(url: str) -> str:
    m = re.search(r"(?:v=|youtu\.be/|embed/)([\w-]{11})", url or "")
    return f'<iframe src="https://www.youtube-nocookie.com/embed/{m.group(1)}" title="Video" loading="lazy" allowfullscreen></iframe>' if m else ""

def link_of(l):
    if isinstance(l, dict):
        return l.get("link") or ""
    return l or ""

def esc(s):
    return H.escape(H.unescape(s or ""), quote=True)

def el_to_html(e, img) -> str:
    t, s = e["type"], e["style"]
    if t == "title":
        c = s.get("content", "")
        c = re.sub(r"<(/?)h1", r"<\1h2", c)
        if not re.search(r"<h\d", c):
            c = re.sub(r"</?p[^>]*>", "", c).strip()
            c = f"<h2>{c}</h2>" if c else ""
        return c
    if t in ("text", "html"):
        return s.get("content", "")
    if t == "image":
        src = img(s.get("image"))
        return f'<figure><img src="{src}" alt="" /></figure>' if src else ""
    if t == "image_gallery":
        imgs = s.get("images") or s.get("gallery") or {}
        out = []
        for v in (imgs.values() if isinstance(imgs, dict) else []):
            src = img(v.get("image") if isinstance(v, dict) and "image" in v and isinstance(v["image"], dict) else v)
            if src:
                out.append(f'<img src="{src}" alt="" />')
        return '<div class="gallery">' + "".join(out) + "</div>" if out else ""
    if t == "button":
        href = link_of(s.get("link"))
        txt = s.get("content", "")
        if not txt or not href:
            return ""
        return f'<p class="cta"><a href="{esc(href)}">{txt}</a></p>'
    if t == "video":
        return yt_embed(s.get("content", ""))
    if t == "catalog":
        out = []
        for it in (s.get("items") or {}).values():
            src = img(it.get("image"))
            href = link_of(it.get("link"))
            title = it.get("title", "")
            if href:
                title = f'<a href="{esc(href)}">{title}</a>'
            out.append(f'<div class="card">{f"<img src=\"{src}\" alt=\"\" />" if src else ""}<h3>{title}</h3>'
                       f'{f"<p><em>{it.get("subtitle")}</em></p>" if it.get("subtitle") else ""}<p>{it.get("description","")}</p></div>')
        return '<div class="cards">' + "".join(out) + "</div>"
    if t == "features":
        out = []
        for it in (s.get("features") or {}).values():
            out.append(f'<li><strong>{it.get("title","")}</strong> {it.get("text","")}</li>')
        return "<ul class=\"features\">" + "".join(out) + "</ul>"
    if t == "testimonials":
        out = []
        for it in (s.get("testimonials") or {}).values():
            out.append(f'<blockquote><p>{it.get("text","")}</p><footer>{it.get("name","")}</footer></blockquote>')
        return "".join(out)
    if t == "bullets":
        out = [f'<li>{(("<strong>"+b["title"]+"</strong> ") if b.get("title") else "")}{b.get("text","")}</li>'
               for b in (s.get("bullets") or {}).values()]
        return "<ul>" + "".join(out) + "</ul>"
    if t == "icon":
        tt = s.get("title", "")
        body = s.get("text", "")
        href = link_of(s.get("link"))
        if href and "<a " not in body:
            body = f'<a href="{esc(href)}">{body}</a>'
        return (f"<h3>{tt}</h3>" if tt else "") + f"<p>{body}</p>"
    if t == "image_text":
        src = img(s.get("image"))
        return (f'<figure><img src="{src}" alt="" /></figure>' if src else "") + \
               f'<h3>{s.get("title","")}</h3>{s.get("content","")}'
    return ""

FIG_RUN = re.compile(r"(?:<figure><img [^>]+></figure>\s*){2,}")

def group_figures(h: str) -> str:
    """Několik obrázků za sebou (v MioWebu byly ve sloupcích) -> jedna galerie."""
    def repl(m):
        imgs = re.findall(r"<img [^>]+>", m.group(0))
        return '<div class="gallery">' + "".join(imgs) + "</div>\n"
    return FIG_RUN.sub(repl, h)

def page_html(page, img) -> str:
    parts = [el_to_html(e, img) for e in elements(page.get("layer", {}))]
    h = "\n".join(p for p in parts if p and p.strip())
    return group_figures(clean_html(h))
