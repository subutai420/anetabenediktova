import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form-controls";
import { LeafMark } from "@/components/site/Botanical";
import { SetupNotice } from "@/components/admin/SetupNotice";

export default function AdminLogin() {
  const { session } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  if (!isSupabaseConfigured) return <SetupNotice />;
  if (session) return <Navigate to={(location.state as { from?: string })?.from ?? "/admin"} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (resetMode) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin` });
      if (error) toast.error(error.message);
      else toast.success("Poslali jsme vám e-mail s odkazem pro nastavení hesla.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error("Přihlášení se nepovedlo – zkontrolujte e-mail a heslo.");
    }
    setBusy(false);
  };

  return (
    <div className="paper grid min-h-screen place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[2rem] border bg-card p-8 shadow-xl shadow-bark/5">
        <LeafMark className="h-10 w-10" />
        <h1 className="mt-4 text-3xl">{resetMode ? "Obnova hesla" : "Přihlášení do administrace"}</h1>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {!resetMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {resetMode ? "Poslat odkaz" : "Přihlásit"}
          </Button>
          <button type="button" onClick={() => setResetMode((r) => !r)} className="w-full text-center text-xs text-muted-foreground hover:text-primary">
            {resetMode ? "Zpět na přihlášení" : "Zapomenuté heslo?"}
          </button>
        </div>
      </form>
    </div>
  );
}
