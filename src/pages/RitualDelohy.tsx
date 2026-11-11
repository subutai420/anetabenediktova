import { ArrowUpRight } from "lucide-react";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { ContactCta, PageHero, RitualUteroBand, SectionHeading, StayCard } from "@/components/site/blocks";
import { ritualUtero } from "@/content/site";
import { useStays } from "@/lib/api";

const steps = [
  { t: "Úvodní rozhovor a výběr bylin", d: "Projdeme průběh rituálu, vaše očekávání a vybereme vhodné byliny, vůně a hudbu." },
  { t: "Příprava saumadoru a tepla", d: "Připravím hliněnou nádobu, uhlíky a potřebné pomůcky." },
  { t: "Rituál a odpočinek", d: "V klidu a bezpečí vnímáte své tělo, teplo, byliny a hudbu. Následně odpočinek zabalená v dece." },
  { t: "Sdílení a doporučení", d: "Sdílení pocitů, práce s afirmacemi, doporučení odpočinku a případné domácí bylinné péče." },
];

export default function RitualDelohy() {
  const { data: stays } = useStays();
  const related = (stays ?? []).filter((s) => /ritual|utero|delohy|zeny|somaticky/i.test(s.slug));
  return (
    <>
      <Seo title="Rituál dělohy" description="Rituál del Útero (rituál dělohy) – tradiční mexická a andská péče o ženské tělo a duši. Mariánské Lázně a Morava." image="/images/legacy/utero-saumador.jpeg" />
      <PageHero
        eyebrow="Rituál del Útero · Andino"
        title={<>Rituál <em className="text-accent">dělohy</em></>}
        text="Mexická šamanka mě naučila rituál del útero, který léčí ženské tělo, duši a celou ženskou linii. Mám výjimečné povolení jej dělat v ČR – jsem teprve druhá Evropanka, která jej obdržela."
        image="/images/legacy/utero-saumador.jpeg"
      >
        {ritualUtero.booking.map((b) => (
          <Button key={b.url} asChild variant="clay">
            <a href={b.url} target="_blank" rel="noopener">
              Objednat – {b.label}
            </a>
          </Button>
        ))}
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Jak rituál probíhá" title="Bez tlaku, bez spěchu" text="Jen péče, byliny a sálavé teplo, které doprovází přirozenou moudrost ženského těla. Každé setkání je individuální." />
          <ol className="grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-[1.5rem] border bg-card p-6">
                <span className="font-serif text-5xl text-accent/70">{i + 1}</span>
                <h3 className="mt-3 text-2xl leading-tight">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <a href={ritualUtero.pages.ritual} target="_blank" rel="noopener">
                Celý průběh a reference na ritualutero.cz <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </section>
      <RitualUteroBand />
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Pobyty s rituálem" title="Zažijte rituál na pobytu" />
            <div className="grid gap-6 md:grid-cols-3">
              {related.slice(0, 3).map((s) => (
                <StayCard key={s.slug} stay={s} />
              ))}
            </div>
          </div>
        </section>
      )}
      <ContactCta />
    </>
  );
}
