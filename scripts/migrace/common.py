"""Sdílené pomocné funkce pro migraci obsahu z původního webu (MioWeb/WordPress)."""
import sys as _s
import re, html, json, unicodedata

_s.stdout.reconfigure(encoding="utf-8")


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s


def clean_html(h: str) -> str:
    """Odstraní inline styly, skripty a prázdné odstavce z HTML původního webu."""
    if not h:
        return ""
    h = re.sub(r'<img[^>]+s\.w\.org/images/core/emoji[^>]+alt="([^"]*)"[^>]*>', r"\1", h)
    h = re.sub(r"<script.*?</script>", "", h, flags=re.S | re.I)
    h = re.sub(r"<style.*?</style>", "", h, flags=re.S | re.I)
    h = re.sub(r'\s(style|class|id|data-[\w-]+|width|height|sizes|srcset|loading|decoding)="[^"]*"', "", h)
    h = re.sub(r"<span>(.*?)</span>", r"\1", h, flags=re.S)
    h = re.sub(r"<(p|h\d)>\s*(&nbsp;| |<br\s*/?>)?\s*</\1>", "", h)
    h = re.sub(r"<div>\s*</div>", "", h)
    h = re.sub(r"<p>(\s|<br\s*/?>)*</p>", "", h)
    h = re.sub(r"(<br\s*/?>\s*)+</(p|h\d)>", r"</\2>", h)
    h = h.replace(" ", " ").replace("&nbsp;", " ")
    h = re.sub(r"\n{3,}", "\n\n", h)
    return h.strip()


def text_only(h: str) -> str:
    t = re.sub(r"<[^>]+>", " ", h or "")
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


def sql_str(v) -> str:
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        return "array[" + ",".join(sql_str(x) for x in v) + "]::text[]" if v else "'{}'::text[]"
    return "$q$" + str(v).replace("$q$", "") + "$q$"


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
