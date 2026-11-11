import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fetchPostById, useDelete, usePosts, useSave } from "@/lib/api";
import { POST_CATEGORIES, type Post } from "@/lib/types";
import { formatDate, slugify, stripHtml } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge, Input, Label, Select, Switch, Textarea } from "@/components/ui/form-controls";
import { RichEditor } from "@/components/admin/RichEditor";
import { ImageField } from "@/components/admin/ImageField";
import { Loading } from "@/components/site/blocks";

// ------------------------------------------------------------------ Seznam
export function AdminPostList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts({ includeDrafts: true, search, page, pageSize: 25 });
  const pages = Math.ceil((data?.total ?? 0) / 25);

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">Články</h1>
        <Button asChild>
          <Link to="/admin/clanky/novy">
            <Plus /> Nový článek
          </Link>
        </Button>
      </div>
      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Hledat podle názvu…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
        {isLoading ? (
          <Loading />
        ) : (
          <ul className="divide-y">
            {data?.items.map((p) => (
              <li key={p.id}>
                <Link to={`/admin/clanky/${p.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.cover_image && <img src={p.cover_image} alt="" className="h-full w-full object-cover" loading="lazy" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.category} · {formatDate(p.published_at)}
                    </p>
                  </div>
                  <Badge className={p.status === "draft" ? "bg-muted text-muted-foreground" : ""}>{p.status === "draft" ? "Koncept" : "Publikováno"}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Předchozí</Button>
          <span>{page} / {pages}</span>
          <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>Další</Button>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ Editor
const empty: Post = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: null,
  category: POST_CATEGORIES[0],
  tags: [],
  status: "draft",
  published_at: new Date().toISOString(),
  seo_title: "",
  seo_description: "",
};

export function AdminPostEdit() {
  const { id } = useParams();
  const isNew = !id || id === "novy";
  const navigate = useNavigate();
  const [post, setPost] = useState<Post>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const save = useSave<Post>("posts");
  const del = useDelete("posts");

  useEffect(() => {
    if (isNew) return;
    fetchPostById(id!).then((p) => {
      if (p) setPost(p);
      setLoading(false);
    });
  }, [id, isNew]);

  const set = <K extends keyof Post>(k: K, v: Post[K]) => setPost((p) => ({ ...p, [k]: v }));

  const onSave = async (status?: Post["status"]) => {
    const row = { ...post, status: status ?? post.status, slug: post.slug || slugify(post.title) };
    if (!row.title) return toast.error("Vyplňte název článku.");
    if (!row.excerpt) row.excerpt = stripHtml(row.content).slice(0, 220);
    try {
      const saved = await save.mutateAsync(row);
      setPost(saved);
      toast.success(row.status === "published" ? "Článek je zveřejněný" : "Uloženo jako koncept");
      if (isNew) navigate(`/admin/clanky/${saved.id}`, { replace: true });
    } catch (e) {
      toast.error(`Uložení se nepovedlo: ${(e as Error).message}`);
    }
  };

  const onDelete = async () => {
    if (!post.id || !confirm(`Opravdu smazat článek „${post.title}“? Nejde to vrátit.`)) return;
    await del.mutateAsync(post.id);
    toast.success("Článek smazán");
    navigate("/admin/clanky");
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/clanky" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Články
        </Link>
        <div className="flex flex-wrap gap-2">
          {post.id && post.status === "published" && (
            <Button asChild variant="ghost" size="sm">
              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener">
                <ExternalLink /> Zobrazit
              </a>
            </Button>
          )}
          <Button variant="outline" onClick={() => onSave("draft")} disabled={save.isPending}>
            Uložit koncept
          </Button>
          <Button onClick={() => onSave("published")} disabled={save.isPending}>
            {post.status === "published" ? "Uložit" : "Publikovat"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <Input
            value={post.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            placeholder="Název článku"
            className="h-auto border-0 bg-transparent px-0 font-serif text-4xl shadow-none focus-visible:ring-0"
          />
          <RichEditor value={post.content ?? ""} onChange={(html) => set("content", html)} placeholder="Text článku…" />
        </div>

        <aside className="space-y-6">
          <div className="space-y-4 rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Publikováno</Label>
              <Switch id="published" checked={post.status === "published"} onCheckedChange={(v) => set("status", v ? "published" : "draft")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Datum publikace</Label>
              <Input
                id="date"
                type="datetime-local"
                value={post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ""}
                onChange={(e) => set("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Rubrika</Label>
              <Select id="category" value={post.category ?? ""} onChange={(e) => set("category", e.target.value)}>
                {POST_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border bg-card p-5">
            <Label>Titulní obrázek</Label>
            <ImageField value={post.cover_image} onChange={(v) => set("cover_image", v)} />
          </div>

          <div className="space-y-4 rounded-2xl border bg-card p-5">
            <div className="space-y-2">
              <Label htmlFor="excerpt">Perex (krátký úvod na kartu)</Label>
              <Textarea id="excerpt" rows={4} value={post.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Adresa (URL)</Label>
              <Input id="slug" value={post.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
              <p className="text-xs text-muted-foreground">/blog/{post.slug || "…"}</p>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-foreground/80">SEO (nepovinné)</summary>
              <div className="mt-3 space-y-3">
                <Input placeholder="Titulek pro Google" value={post.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} />
                <Textarea rows={3} placeholder="Popis pro Google (do 160 znaků)" value={post.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} />
              </div>
            </details>
          </div>

          {post.id && (
            <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 /> Smazat článek
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}
