import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, ArrowUpRight } from "lucide-react";
import { Logo } from "./SiteHeader";
import { ritualUtero, site } from "@/content/site";

const cols = [
  {
    title: "Co dělám",
    links: [
      { label: "Irisdiagnostika a byliny", to: "/sluzby/irisdiagnostika" },
      { label: "Poradenství na dálku", to: "/sluzby/poradenstvi-na-dalku" },
      { label: "Tradiční postupy šamanů", to: "/sluzby/tradicni-postupy" },
      { label: "Transformační pobyty", to: "/pobyty" },
    ],
  },
  {
    title: "Inspirace",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Bylinková akademie", to: "/bylinkova-akademie" },
      { label: "E-book zdarma", to: "/ebook-zdarma" },
      { label: "Média", to: "/media" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-bark text-cream">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-cream/70">
            Irisdiagnostika, bylinná léčba, transformační pobyty v Mexiku a Peru a tradiční rituály pro ženy.
          </p>
          <div className="flex gap-3">
            <a href={site.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 hover:bg-cream/10">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={site.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 hover:bg-cream/10">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-honey">{c.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-cream/80 hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-honey">Kontakt</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 text-cream/80 hover:text-cream">
                <Phone className="h-4 w-4" /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-cream/80 hover:text-cream">
                <Mail className="h-4 w-4" /> {site.email}
              </a>
            </li>
          </ul>
          <a
            href={ritualUtero.url}
            target="_blank"
            rel="noopener"
            className="mt-6 block rounded-2xl border border-cream/15 bg-clay/20 p-4 transition-colors hover:bg-clay/30"
          >
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cream/60">Sesterský projekt</span>
            <span className="mt-1 flex items-center justify-between font-serif text-xl">
              Rituál del Útero <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="text-xs text-cream/70">Tradiční ženská péče · Akademie Saumerio</span>
          </a>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container flex flex-col gap-2 py-6 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Aneta Benediktová</span>
          <span className="flex gap-5">
            <Link to="/zasady-zpracovani-osobnich-udaju" className="hover:text-cream">Zásady zpracování osobních údajů</Link>
            <Link to="/cookies" className="hover:text-cream">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
