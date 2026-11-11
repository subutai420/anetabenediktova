import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fetchStayById, useDelete, useSave, useStays } from "@/lib/api";
import { STAY_COUNTRIES, type Stay } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge, Input, Label, Select, Switch, Textarea } from "@/components/ui/form-controls";
import { RichEditor } from "@/components/admin/RichEditor";
import { ImageField } from "@/components/admin/ImageField";
import { Loading } from "@/components/site/blocks";

// ------------------------------------------------------------------ Seznam
export function AdminStayList() {
  const { data, isLoading } = useStays({ includeDrafts: true });
  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl">Pobyty</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pořadí na webu určuje pole „Pořadí“ (menší číslo = výš). Hvězdička = zobrazit na úvodní stránce.</p>
        </div>
        <Button asChild>
          <Link to="/admin/pobyty/novy">
            <Plus /> Nový pobyt
          </Link>
        </Button>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
        {isLoading ? (
          <Loading />
        ) : (
          <ul className="divide-y">
            {data?.map((s) => (
              <li key={s.id}>
                <Link to={`/admin/pobyty/${s.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {s.cover_image && <img src={s.cover_image} alt="" className="h-full w-full object-cover" loading="lazy" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate font-medium">
                      {s.featured && <Star className="h-4 w-4 shrink-0 fill-honey text-honey" />} {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[s.country, s.date_text, s.price_text].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:inline">#{s.sort_order}</span>
                  <Badge className={s.status === "draft" ? "bg-muted text-muted-foreground" : ""}>{s.status === "draft" ? "Skryto" : "Na webu"}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Editor
const empty: Stay = {
  slug: "",
  title: "",
  subtitle: "",
  excerpt: "",
  country: "Mexiko",
  location: "",
  date_text: "",
  start_date: null,
  end_date: null,
  duration_text: "",
  price_text: "",
  capacity: "",
  cover_image: null,
  gallery: [],
  content: "",
  cta_text: "Mám zájem",
  booking_url: "",
  status: "draft",
  featured: true,
  sort_order: 50,
  seo_title: "",
  seo_description: "",
};

export function AdminStayEdit() {
  const { id } = useParams();
  const isNew = !id || id === "novy";
  const navigate = useNavigate();
  const [stay, setStay] = useState<Stay>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const save = useSave<Stay>("stays");
  const del = useDelete("stays");

  useEffect(() => {
    if (isNew) return;
    fetchStayById(id!).then((s) => {
      if (s) setStay(s);
      setLoading(false);
    });
  }, [id, isNew]);

  const set = <K extends keyof Stay>(k: K, v: Stay[K]) => setStay((s) => ({ ...s, [k]: v }));

  const onSave = async (status?: Stay["status"]) => {
    const row = { ...stay, status: status ?? stay.status, slug: stay.slug || slugify(stay.title) };
    if (!row.title) return toast.error("Vyplňte název pobytu.");
    // prázdné řetězce u datumů -> null
    row.start_date = row.start_date || null;
    row.end_date = row.end_date || null;
    try {
      const saved = await save.mutateAsync(row);
      setStay(saved);
      toast.success(row.status === "published" ? "Pobyt je na webu" : "Uloženo (skryto)");
      if (isNew) navigate(`/admin/pobyty/${saved.id}`, { replace: true });
    } catch (e) {
      toast.error(`Uložení se nepovedlo: ${(e as Error).message}`);
    }
  };

  const onDelete = async () => {
    if (!stay.id || !confirm(`Opravdu smazat pobyt „${stay.title}“? Nejde to vrátit. (Pro skrytí stačí vypnout „Zobrazit na webu“.)`)) return;
    await del.mutateAsync(stay.id);
    toast.success("Pobyt smazán");
    navigate("/admin/pobyty");
  };

  if (loading) return <Loading />;

  const field = (k: keyof Stay, label: string, placeholder?: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} placeholder={placeholder} value={(stay[k] as string) ?? ""} onChange={(e) => set(k, e.target.value as never)} />
    </div>
  );

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/pobyty" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Pobyty
        </Link>
        <div className="flex flex-wrap gap-2">
          {stay.id && stay.status === "published" && (
            <Button asChild variant="ghost" size="sm">
              <a href={`/pobyty/${stay.slug}`} target="_blank" rel="noopener">
                <ExternalLink /> Zobrazit
              </a>
            </Button>
          )}
          <Button variant="outline" onClick={() => onSave("draft")} disabled={save.isPending}>
            Uložit skryté
          </Button>
          <Button onClick={() => onSave("published")} disabled={save.isPending}>
            {stay.status === "published" ? "Uložit" : "Zveřejnit"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-5">
          <Input
            value={stay.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            placeholder="Název pobytu"
            className="h-auto border-0 bg-transparent px-0 font-serif text-4xl shadow-none focus-visible:ring-0"
          />
          <div className="space-y-2">
            <Label htmlFor="subtitle">Podtitul (pod nadpisem)</Label>
            <Input id="subtitle" value={stay.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
          </div>
          <div className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2 lg:grid-cols-3">
            {field("date_text", "Termín (text)", "např. listopad 2026")}
            {field("duration_text", "Délka", "např. 10 dní")}
            {field("price_text", "Cena", "např. 1 550 EUR")}
            {field("start_date", "Začátek (pro řazení)", "", "date")}
            {field("end_date", "Konec", "", "date")}
            {field("capacity", "Kapacita", "např. max. 8 osob")}
          </div>
          <div className="space-y-2">
            <Label>Popis pobytu – program, co je v ceně, ubytování…</Label>
            <RichEditor value={stay.content ?? ""} onChange={(html) => set("content", html)} placeholder="Program pobytu…" />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="space-y-4 rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="pub">Zobrazit na webu</Label>
              <Switch id="pub" checked={stay.status === "published"} onCheckedChange={(v) => set("status", v ? "published" : "draft")} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="feat">Na úvodní stránce</Label>
              <Switch id="feat" checked={stay.featured} onCheckedChange={(v) => set("featured", v)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Pořadí</Label>
              <Input id="order" type="number" value={stay.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Země</Label>
              <Select id="country" value={stay.country ?? ""} onChange={(e) => set("country", e.target.value)}>
                {STAY_COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </div>
            {field("location", "Místo", "např. Playa del Carmen")}
          </div>

          <div className="space-y-2 rounded-2xl border bg-card p-5">
            <Label>Hlavní fotka</Label>
            <ImageField value={stay.cover_image} onChange={(v) => set("cover_image", v)} folder="stays" />
          </div>

          <div className="space-y-4 rounded-2xl border bg-card p-5">
            <div className="space-y-2">
              <Label htmlFor="excerpt">Krátký text na kartu</Label>
              <Textarea id="excerpt" rows={4} value={stay.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} />
            </div>
            {field("cta_text", "Text tlačítka", "Mám zájem")}
            {field("booking_url", "Odkaz na rezervaci (nepovinné)", "https://…")}
            <p className="-mt-2 text-xs text-muted-foreground">Bez odkazu tlačítko otevře e-mail s poptávkou.</p>
            <div className="space-y-2">
              <Label htmlFor="slug">Adresa (URL)</Label>
              <Input id="slug" value={stay.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
              <p className="text-xs text-muted-foreground">/pobyty/{stay.slug || "…"}</p>
            </div>
          </div>

          {stay.id && (
            <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 /> Smazat pobyt
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}
