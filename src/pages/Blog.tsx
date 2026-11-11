import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Seo } from "@/components/site/Seo";
import { Loading, PageHero, PostCard } from "@/components/site/blocks";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/lib/api";
import { POST_CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 13;

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const category = params.get("rubrika");
  const page = Number(params.get("strana") ?? 1);
  const [search, setSearch] = useState(params.get("hledat") ?? "");
  const query = params.get("hledat") ?? "";

  useEffect(() => {
    const t = setTimeout(() => {
      if (search === query) return;
      const next = new URLSearchParams(params);
      if (search) next.set("hledat", search);
      else next.delete("hledat");
      next.delete("strana");
      setParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, isLoading } = usePosts({ category, search: query, page, pageSize: PAGE_SIZE });
  const pages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "strana") next.delete("strana");
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Seo title="Blog" description="Články o bylinách, přírodní léčbě, medicinálních houbách, ženském zdraví a cestách za šamany do Mexika a Peru." />
      <PageHero
        eyebrow="Blog"
        title={<>Byliny, zdraví a <em className="text-primary">cesty k sobě</em></>}
        text="Přes 200 článků z mé poradny i z cest – o bylinách a houbách, přírodní léčbě nemocí, ženském zdraví a životě v souladu s přírodou."
      />
      <section className="section pt-12">
        <div className="container">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {[null, ...POST_CATEGORIES].map((c) => (
                <button
                  key={c ?? "vse"}
                  onClick={() => set("rubrika", c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    category === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary hover:text-primary",
                  )}
                >
                  {c ?? "Vše"}
                </button>
              ))}
            </div>
            <div className="relative md:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hledat článek…" className="rounded-full pl-10" aria-label="Hledat článek" />
            </div>
          </div>

          {isLoading ? (
            <Loading />
          ) : data?.items.length ? (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p, i) => (
                <PostCard key={p.slug} post={p} featured={i === 0 && page === 1 && !query} />
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-muted-foreground">Nic jsem nenašla. Zkuste jiné slovo nebo rubriku.</p>
          )}

          {pages > 1 && (
            <nav className="mt-16 flex flex-wrap items-center justify-center gap-2" aria-label="Stránkování">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => set("strana", String(page - 1))}>
                Novější
              </Button>
              <span className="px-4 text-sm text-muted-foreground">
                Strana {page} z {pages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => set("strana", String(page + 1))}>
                Starší
              </Button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
