import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { BookOpen, ExternalLink, LayoutDashboard, LogOut, MapPinned } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/config";
import { LeafMark } from "@/components/site/Botanical";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/site/blocks";
import { SetupNotice } from "./SetupNotice";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Přehled", icon: LayoutDashboard, end: true },
  { to: "/admin/clanky", label: "Články", icon: BookOpen },
  { to: "/admin/pobyty", label: "Pobyty", icon: MapPinned },
];

export function AdminLayout() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (!isSupabaseConfigured) return <SetupNotice />;
  if (loading) return <Loading />;
  if (!session) return <Navigate to="/admin/prihlaseni" state={{ from: location.pathname }} replace />;
  if (!isAdmin)
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-4xl">Nemáte oprávnění</h1>
          <p className="mt-3 text-muted-foreground">
            Účet <strong>{session.user.email}</strong> není mezi administrátory. Přidejte jeho ID do tabulky <code>admin_users</code> (viz README).
          </p>
          <Button className="mt-6" variant="outline" onClick={signOut}>
            Odhlásit
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-muted/40 md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b bg-card md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 p-5">
          <LeafMark className="h-7 w-7" />
          <div className="leading-tight">
            <p className="font-serif text-lg font-semibold">Administrace</p>
            <p className="text-xs text-muted-foreground">anetabenediktova.cz</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              className={({ isActive }) =>
                cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted", isActive && "bg-secondary text-foreground")
              }
            >
              <i.icon className="h-4 w-4" /> {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden space-y-1 border-t p-3 md:absolute md:bottom-0 md:left-0 md:right-0 md:block">
          <Link to="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <ExternalLink className="h-4 w-4" /> Zobrazit web
          </Link>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> Odhlásit
          </button>
          <p className="truncate px-3 pt-2 text-xs text-muted-foreground">{session.user.email}</p>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
