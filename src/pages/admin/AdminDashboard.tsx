import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { BookOpen, MapPinned, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePosts, useStays } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form-controls";

export default function AdminDashboard() {
  const { data: posts } = usePosts({ includeDrafts: true, pageSize: 5 });
  const { data: stays } = useStays({ includeDrafts: true });
  const [pwd, setPwd] = useState("");

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) toast.error(error.message);
    else {
      toast.success("Heslo změněno");
      setPwd("");
    }
  };

  const cards = [
    { title: "Články", count: posts?.total ?? "–", icon: BookOpen, to: "/admin/clanky", add: "/admin/clanky/novy" },
    { title: "Pobyty", count: stays?.length ?? "–", sub: `${stays?.filter((s) => s.status === "published").length ?? 0} zveřejněných`, icon: MapPinned, to: "/admin/pobyty", add: "/admin/pobyty/novy" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl">Dobrý den, Aneto 🌿</h1>
      <p className="mt-2 text-muted-foreground">Tady spravujete články na blogu a nabídku pobytů.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <c.icon className="h-6 w-6 text-primary" />
              <Button asChild size="sm">
                <Link to={c.add}>
                  <Plus /> Přidat
                </Link>
              </Button>
            </div>
            <p className="mt-4 font-serif text-5xl">{c.count}</p>
            <Link to={c.to} className="text-sm font-semibold text-primary hover:underline">
              {c.title} {c.sub && <span className="font-normal text-muted-foreground">· {c.sub}</span>}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border bg-card p-6">
        <h2 className="text-2xl">Poslední články</h2>
        <ul className="mt-4 divide-y">
          {posts?.items.map((p) => (
            <li key={p.id ?? p.slug} className="flex items-center justify-between gap-4 py-3 text-sm">
              <Link to={`/admin/clanky/${p.id}`} className="truncate hover:text-primary">
                {p.title}
              </Link>
              <span className="shrink-0 text-xs text-muted-foreground">{p.status === "draft" ? "Koncept" : "Publikováno"}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={changePassword} className="mt-8 flex max-w-md flex-col gap-3 rounded-2xl border bg-card p-6">
        <Label htmlFor="pwd">Změnit heslo</Label>
        <div className="flex gap-2">
          <Input id="pwd" type="password" minLength={8} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Nové heslo (min. 8 znaků)" autoComplete="new-password" />
          <Button type="submit" variant="outline" disabled={pwd.length < 8}>
            Uložit
          </Button>
        </div>
      </form>
    </div>
  );
}
