import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock, MapPin, Play, Quote, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/form-controls";
import { Sprig, Divider } from "@/components/site/Botanical";
import { ebook, ritualUtero, site } from "@/content/site";
import type { Post, Stay } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

// ------------------------------------------------------------------ Nadpisy
export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("mb-12 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-4xl leading-[1.05] md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{text}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  image?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className="paper relative overflow-hidden border-b">
      <Sprig className="pointer-events-none absolute -right-6 top-6 hidden h-72 w-40 rotate-12 opacity-40 md:block" />
      <div className={cn("container grid items-center gap-10 py-16 md:py-24", image && "lg:grid-cols-[1.1fr_0.9fr]")}>
        <div className="animate-fade-up">
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h1 className="text-5xl leading-[1.02] md:text-6xl lg:text-7xl">{title}</h1>
          {text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{text}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {image && (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-3 rounded-t-[999px] rounded-b-[2rem] border border-primary/20" aria-hidden />
            <img src={image} alt="" className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-[2rem] object-cover shadow-xl shadow-bark/10" />
          </div>
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ HTML obsah
export function RichContent({ html, className }: { html?: string | null; className?: string }) {
  const clean = DOMPurify.sanitize(html ?? "", {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "target", "loading"],
  });
  return <div className={cn("rich", className)} dangerouslySetInnerHTML={{ __html: clean }} />;
}

// ------------------------------------------------------------------ Pobyty
export function StayMeta({ stay, className }: { stay: Stay; className?: string }) {
  const items = [
    { icon: CalendarDays, v: stay.date_text },
    { icon: Clock, v: stay.duration_text },
    { icon: Wallet, v: stay.price_text },
  ].filter((i) => i.v);
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground", className)}>
      {items.map(({ icon: Icon, v }) => (
        <li key={v} className="flex items-center gap-1.5">
          <Icon className="h-4 w-4 text-primary" /> {v}
        </li>
      ))}
    </ul>
  );
}

export function StayCard({ stay, className }: { stay: Stay; className?: string }) {
  return (
    <Link
      to={`/pobyty/${stay.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[1.75rem] border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-bark/10",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {stay.cover_image && (
          <img
            src={stay.cover_image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {stay.country && (
          <Badge className="absolute left-4 top-4 bg-card/90 backdrop-blur">
            <MapPin className="mr-1 h-3 w-3" /> {stay.country}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl leading-tight">{stay.title}</h3>
        <StayMeta stay={stay} className="mt-3" />
        {stay.excerpt && <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/75">{stay.excerpt}</p>}
        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
          {stay.cta_text || "Více o pobytu"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

// ------------------------------------------------------------------ Blog
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link to={`/blog/${post.slug}`} className={cn("group flex flex-col", featured && "md:col-span-2 md:flex-row md:gap-8")}>
      <div className={cn("overflow-hidden rounded-[1.5rem] bg-muted", featured ? "aspect-[16/10] md:w-3/5" : "aspect-[4/3]")}>
        {post.cover_image && (
          <img src={post.cover_image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
      </div>
      <div className={cn("pt-5", featured && "md:flex md:w-2/5 md:flex-col md:justify-center md:pt-0")}>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {post.category && <span className="font-semibold uppercase tracking-wider text-primary">{post.category}</span>}
          <span>{formatDate(post.published_at)}</span>
        </div>
        <h3 className={cn("mt-2 leading-tight transition-colors group-hover:text-primary", featured ? "text-3xl md:text-4xl" : "text-2xl")}>
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>}
      </div>
    </Link>
  );
}

// ------------------------------------------------------------------ Video (načte se až po kliknutí)
export function YouTubeLite({ id, title = "Video" }: { id: string; title?: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-bark shadow-lg shadow-bark/10">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Přehrát: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-cream/90 text-primary shadow-lg transition-transform group-hover:scale-110">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ Rituál del Útero (sesterský web)
export function RitualUteroBand() {
  return (
    <section className="relative overflow-hidden bg-clay text-cream">
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px]" aria-hidden />
      <div className="container relative grid items-center gap-12 py-20 md:py-24 lg:grid-cols-2">
        <div className="relative">
          <img
            src="/images/legacy/utero-saumador.jpeg"
            alt="Rituál del Útero – hliněná nádoba saumador s bylinami"
            loading="lazy"
            className="aspect-[5/4] w-full rounded-[2rem] object-cover shadow-2xl shadow-bark/30"
          />
          <div className="absolute -bottom-6 right-6 max-w-[16rem] rounded-2xl bg-cream p-5 text-foreground shadow-xl">
            <p className="font-serif text-lg leading-snug">„Jako druhá Evropanka jsem získala iniciaci od mexických šamanek.“</p>
          </div>
        </div>
        <div>
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cream/75">Tradiční ženská péče · Byliny · Sálavé teplo</p>
          <h2 className="text-4xl leading-[1.05] md:text-5xl">Rituál del Útero</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/85">
            Tradiční péče našich prababiček spojená s moudrostí andských a mexických tradic. Teplo, byliny a klid pro hlubší
            kontakt se svým tělem, myslí i ženskou linií – pro ženy každého věku.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="light" size="lg">
              <a href={ritualUtero.url} target="_blank" rel="noopener">
                Více na ritualutero.cz <ArrowUpRight />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-cream/40 text-cream hover:border-cream hover:text-cream">
              <a href={ritualUtero.pages.academy} target="_blank" rel="noopener">
                Akademie Saumerio
              </a>
            </Button>
          </div>
          <div className="mt-8 border-t border-cream/20 pt-6">
            <p className="text-sm text-cream/75">Objednat rituál přímo:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ritualUtero.booking.map((b) => (
                <a
                  key={b.url}
                  href={b.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 rounded-full border border-cream/30 px-4 py-2 text-sm hover:bg-cream/10"
                >
                  <CalendarDays className="h-4 w-4" /> {b.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ Reference
export function TestimonialCard({ text, name }: { text: string; name: string }) {
  return (
    <figure className="flex h-full flex-col rounded-[1.75rem] border bg-card p-8">
      <Quote className="h-8 w-8 text-honey" />
      <blockquote className="mt-4 flex-1 font-serif text-xl leading-snug text-foreground/90">{text}</blockquote>
      <figcaption className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">— {name}</figcaption>
    </figure>
  );
}

// ------------------------------------------------------------------ E-book a kontakt
export function EbookBand() {
  return (
    <section className="section">
      <div className="container">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-secondary/70 px-8 py-12 md:grid-cols-[auto_1fr_auto] md:px-14">
          <Sprig className="pointer-events-none absolute -left-4 -top-10 h-64 w-36 -rotate-12 opacity-30" />
          <img src={ebook.image} alt="" loading="lazy" className="relative mx-auto w-40 rotate-[-4deg] drop-shadow-xl md:w-48" />
          <div className="relative">
            <p className="eyebrow mb-3">E-book zdarma</p>
            <h2 className="text-3xl md:text-4xl">{ebook.title}</h2>
            <p className="mt-3 max-w-lg text-muted-foreground">{ebook.text}</p>
          </div>
          <Button asChild size="lg" className="relative">
            <Link to={ebook.to}>Stáhnout zdarma</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ContactCta({ title = "Pojďme se potkat", text }: { title?: string; text?: string }) {
  return (
    <section className="section text-center">
      <div className="container max-w-3xl">
        <Divider className="mb-8" />
        <h2 className="text-4xl md:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          {text ?? "Napište mi nebo zavolejte. Mimo ČR jsem k zastižení přes WhatsApp – odpovím vám, jakmile to půjde."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/kontakt">Kontaktovat Anetu</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={site.whatsappHref} target="_blank" rel="noopener">
              Napsat na WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Loading() {
  return (
    <div className="grid min-h-[40vh] place-items-center text-muted-foreground">
      <span className="animate-pulse font-serif text-xl">Načítám…</span>
    </div>
  );
}
