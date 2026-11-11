/**
 * Obsah stránek převedený z původního webu (MioWeb export) – soubory src/content/legacy/*.html.
 * Načítají se líně, aby nezatěžovaly první načtení webu.
 * Texty v HTML souborech jde upravovat přímo (nebo je postupně přepsat do komponent).
 */
import { useEffect, useState } from "react";

const files = import.meta.glob("./legacy/*.html", { query: "?raw", import: "default" }) as Record<
  string,
  () => Promise<string>
>;

export function hasLegacy(slug: string) {
  return `./legacy/${slug}.html` in files;
}

export function useLegacyHtml(slug: string) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    setHtml(null);
    const load = files[`./legacy/${slug}.html`];
    if (load) load().then(setHtml);
    else setHtml("");
  }, [slug]);
  return html;
}
