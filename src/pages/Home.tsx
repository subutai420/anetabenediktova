import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Eye, Leaf, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/site/Seo";
import { Sprig, Divider } from "@/components/site/Botanical";
import {
  ContactCta,
  EbookBand,
  PostCard,
  RitualUteroBand,
  SectionHeading,
  StayCard,
  TestimonialCard,
  YouTubeLite,
} from "@/components/site/blocks";
import { usePosts, useStays } from "@/lib/api";
import { academyVideos, ritualUtero, services, testimonials } from "@/content/site";

const paths = [
  {
    icon: Eye,
    title: "Bylinná poradna",
    text: "Irisdiagnostika osobně v Sokolově nebo on-line. Najdeme příčinu obtíží a nastavíme bylinnou léčbu.",
    to: "/sluzby",
    cta: "Objednat poradnu",
  },
  {
    icon: Sun,
    title: "Transformační pobyty",
    text: "Mexiko, Peru i Vysočina. Není to dovolená – je to návrat k sobě s rituály místních šamanů.",
    to: "/pobyty",
    cta: "Vybrat pobyt",
  },
  {
    icon: Leaf,
    title: "Rituál dělohy",
    text: "Tradiční péče o ženské tělo a duši. Rituál del Útero v Mariánských Lázních a na Moravě.",
    href: ritualUtero.url,
    cta: "ritualutero.cz",
  },
];

export default function Home() {
  const { data: stays } = useStays({ featuredOnly: true });
  const { data: posts } = usePosts({ pageSize: 3 });

  return (
    <>
      <Seo description="Irisdiagnostika, bylinná léčba, transformační pobyty v Mexiku a Peru a rituál dělohy. Váš průvodce na cestě k přirozenému zdraví." />

      {/* HERO ------------------------------------------------------------ */}
      <section className="paper relative overflow-hidden">
        <Sprig className="pointer-events-none absolute -left-8 bottom-0 hidden h-80 w-44 -rotate-6 opacity-30 lg:block" />
        <div className="container grid items-center gap-12 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
          <div className="animate-fade-up">
            <p className="eyebrow mb-6">Byliny · Irisdiagnostika · Rituály · Pobyty</p>
            <h1 className="text-[2.9rem] leading-[0.98] sm:text-6xl lg:text-[5.2rem]">
              Váš průvodce na cestě k <em className="font-normal text-primary">přirozenému zdraví</em> a&nbsp;návratu k&nbsp;sobě
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Jmenuji se Aneta. Vaše oči mi prozradí, jaké byliny, rostliny či houby vám pomohou – a na cestách po Mexiku a Peru
              vám ukážu, jak pohladit vlastní duši.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/pobyty">
                  Transformační pobyty <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/sluzby">Bylinková poradna</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-t-[999px] rounded-b-[2.5rem] border border-primary/20" aria-hidden />
            <img
              src="/images/hero-aneta-byliny.jpg"
              alt="Aneta Benediktová přivoní k sušeným bylinám"
              className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-[2.5rem] object-cover object-[35%_center] shadow-2xl shadow-bark/15"
            />
            <div className="absolute -bottom-6 -left-4 rounded-2xl border bg-card/95 px-5 py-4 shadow-xl backdrop-blur sm:-left-10">
              <p className="font-serif text-3xl leading-none text-primary">20+ let</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">praxe v přírodní léčbě</p>
            </div>
          </div>
        </div>
      </section>

      {/* TŘI CESTY ---------------------------------------------------------- */}
      <section className="relative -mt-2 pb-8">
        <div className="container grid gap-5 md:grid-cols-3">
          {paths.map((p) => {
            const inner = (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-6 text-3xl">{p.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                <span className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                  {p.cta} {p.href ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </span>
              </>
            );
            const cls = "group flex flex-col rounded-[1.75rem] border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-bark/5";
            return p.href ? (
              <a key={p.title} href={p.href} target="_blank" rel="noopener" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={p.title} to={p.to!} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* POBYTY ------------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              className="mb-0"
              eyebrow="Transformační pobyty"
              title={<>Není to dovolená. <em className="text-primary">Je to návrat k sobě.</em></>}
            />
            <Button asChild variant="outline">
              <Link to="/pobyty">
                Všechny pobyty <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(stays ?? []).slice(0, 6).map((s) => (
              <StayCard key={s.slug} stay={s} />
            ))}
          </div>
        </div>
      </section>

      {/* O ANETĚ ------------------------------------------------------------ */}
      <section className="section bg-secondary/50">
        <div className="container grid items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto max-w-md">
            <img src="/images/legacy/IMG_6350.jpg" alt="Aneta Benediktová mezi kosatci" loading="lazy" className="aspect-square w-full rounded-full object-cover object-[center_30%] shadow-xl" />
            <Sprig className="absolute -right-10 -top-6 h-56 w-32 rotate-12 opacity-60" />
          </div>
          <div>
            <p className="eyebrow mb-4">Jmenuji se Aneta</p>
            <h2 className="text-4xl leading-[1.05] md:text-5xl">Vítám vás v ráji zdraví, bylin a transformačních pobytů</h2>
            <blockquote className="mt-8 border-l-2 border-primary pl-6 font-serif text-2xl italic leading-snug text-foreground/85">
              „Vše, co se ti v životě děje, je jen a jen pro tvé dobro, i když v tuto chvíli to tak nevypadá.“
            </blockquote>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Byla jsem zdravotní sestrou, učila se od lékařů, tradičních bylinářů i buddhistických mnichů. Založila jsem rodinnou
              firmu Serafin byliny a dnes se věnuji už jen poradenství, irisdiagnostice a cestám za šamany do Mexika a Peru.
            </p>
            <Button asChild variant="link" className="mt-6 text-base">
              <Link to="/kdo-jsem">
                Přečtěte si můj příběh <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SLUŽBY ------------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Má práce, můj život" title="Jak vám mohu pomoci" text="Díky dlouholetým zkušenostem s bylinami, irisdiagnostikou a tradičními rituály." />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link key={s.slug} to={`/sluzby/${s.slug}`} className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem]">
                  <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{s.short}</p>
                <h3 className="mt-1 text-2xl leading-tight group-hover:text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RitualUteroBand />

      {/* REFERENCE ---------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Zkušenosti" title="Co říkají ti, kteří se mnou cestovali" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* BYLINKOVÁ AKADEMIE ------------------------------------------------- */}
      <section className="section bg-bark text-cream">
        <div className="container">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-honey">Bylinková akademie</p>
              <h2 className="text-4xl leading-[1.05] md:text-5xl">Vše o bylinné léčbě – zdarma na videu</h2>
            </div>
            <Button asChild variant="light">
              <Link to="/bylinkova-akademie">
                Další videa <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {academyVideos.map((id) => (
              <YouTubeLite key={id} id={id} title="Bylinková akademie" />
            ))}
          </div>
        </div>
      </section>

      {/* BLOG --------------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" className="mb-0" eyebrow="Z mého blogu" title="Co je u mě nového" />
            <Button asChild variant="outline">
              <Link to="/blog">
                Všechny články <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {(posts?.items ?? []).map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      <EbookBand />
      <Divider />
      <ContactCta />
    </>
  );
}
