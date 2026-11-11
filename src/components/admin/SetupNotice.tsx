import { Link } from "react-router-dom";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Zobrazí se v /admin, dokud web není napojený na Supabase. */
export function SetupNotice() {
  return (
    <div className="paper grid min-h-screen place-items-center p-6">
      <div className="max-w-xl rounded-[2rem] border bg-card p-10">
        <Database className="h-10 w-10 text-primary" />
        <h1 className="mt-5 text-4xl">Administrace čeká na databázi</h1>
        <p className="mt-4 text-muted-foreground">
          Web teď běží nad statickými daty (<code>public/data/*.json</code>), takže jde prohlížet, ale ne upravovat. Pro
          administraci článků a pobytů napojte Supabase:
        </p>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-foreground/80">
          <li>
            V Lovable zapněte <strong>Cloud / Supabase</strong>, nebo vytvořte projekt na supabase.com a vyplňte <code>.env</code> podle <code>.env.example</code>.
          </li>
          <li>
            Spusťte migraci <code>supabase/migrations/…_init.sql</code> a seedy <code>supabase/seed/*.sql</code> (v pořadí podle čísla).
          </li>
          <li>Vytvořte uživatele (Authentication → Users) a jeho ID vložte do tabulky <code>admin_users</code>.</li>
        </ol>
        <p className="mt-5 text-sm text-muted-foreground">Podrobný postup je v README.md.</p>
        <Button asChild className="mt-8" variant="outline">
          <Link to="/">Zpět na web</Link>
        </Button>
      </div>
    </div>
  );
}
