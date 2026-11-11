import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { nav, ritualUtero, site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={site.name}>
      {/* ikona hmoždíře s bylinkami z původního loga */}
      <img
        src={light ? "/images/logo-icon-light.png" : "/images/logo-icon.png"}
        alt=""
        width={125}
        height={99}
        className="h-10 w-auto transition-transform group-hover:-rotate-3"
      />
      <span className="whitespace-nowrap leading-none">
        <span className={cn("block font-serif text-[1.45rem] font-semibold tracking-tight", light ? "text-cream" : "text-foreground")}>
          {site.name}
        </span>
        <span className={cn("mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.24em]", light ? "text-cream/70" : "text-muted-foreground")}>
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/90 shadow-[0_1px_0_hsl(var(--border))] backdrop-blur-md" : "bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="container flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Hlavní menu">
          {nav.map((item) =>
            item.children ? (
              <div key={item.to} className="group relative">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium xl:px-3.5 text-foreground/75 transition-colors hover:text-primary",
                      isActive && "text-primary",
                    )
                  }
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </NavLink>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <div className="w-64 rounded-2xl border bg-card p-2 shadow-xl shadow-bark/5">
                    {item.children.map((c) => (
                      <NavLink
                        key={c.to}
                        to={c.to}
                        className="block rounded-xl px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
                      >
                        {c.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium xl:px-3.5 text-foreground/75 transition-colors hover:text-primary",
                    isActive && "text-primary",
                  )
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden xl:block">
          <Button asChild variant="clay" size="sm">
            <a href={ritualUtero.url} target="_blank" rel="noopener">
              Rituál dělohy <ArrowUpRight />
            </a>
          </Button>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-full border lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background lg:hidden">
          <nav className="container flex max-h-[calc(100vh-5rem)] flex-col gap-1 overflow-y-auto py-6" aria-label="Mobilní menu">
            {nav.map((item) => (
              <div key={item.to}>
                <NavLink to={item.to} className="block py-2 font-serif text-2xl">
                  {item.label}
                </NavLink>
                {item.children && (
                  <div className="mb-2 ml-1 border-l pl-4">
                    {item.children.map((c) => (
                      <NavLink key={c.to} to={c.to} className="block py-1.5 text-sm text-muted-foreground">
                        {c.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button asChild variant="clay" className="mt-4 self-start">
              <a href={ritualUtero.url} target="_blank" rel="noopener">
                Rituál dělohy – ritualutero.cz <ArrowUpRight />
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
