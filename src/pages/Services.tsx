import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { ContactCta, PageHero, RitualUteroBand, SectionHeading, StayCard } from "@/components/site/blocks";
import { services } from "@/content/site";
import { useStays } from "@/lib/api";

export default function Services() {
  const { data: stays } = useStays({ featuredOnly: true });
  return (
    <>
      <Seo title="Co dělám" description="Irisdiagnostika a bylinná léčba osobně i na dálku, tradiční postupy šamanů a rituál dělohy." />
      <PageHero
        eyebrow="Co dělám"
        title={<>Jak vám mohu <em className="text-primary">pomoci</em></>}
        text="Díky dlouholetým zkušenostem s bylinami, irisdiagnostikou a tradičními rituály Střední a Jižní Ameriky."
      />
      <section className="section">
        <div className="container space-y-20">
          {services.map((s, i) => (
            <div key={s.slug} className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
              <img
                src={s.image}
                alt=""
                loading="lazy"
                className={`aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lg ${i % 2 ? "md:order-2" : ""}`}
              />
              <div>
                <p className="eyebrow mb-3">{s.short}</p>
                <h2 className="text-4xl md:text-5xl">{s.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{s.text}</p>
                {s.price && <p className="mt-4 font-serif text-2xl text-primary">{s.price}</p>}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to={`/sluzby/${s.slug}`}>
                      Více informací <ArrowRight />
                    </Link>
                  </Button>
                  {s.external && (
                    <Button asChild variant="outline">
                      <a href={s.external} target="_blank" rel="noopener">
                        ritualutero.cz <ArrowUpRight />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <RitualUteroBand />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Pobyty, kurzy a semináře" title="Jaké akce pro vás chystám" />
          <div className="grid gap-6 md:grid-cols-3">
            {(stays ?? []).slice(0, 3).map((s) => (
              <StayCard key={s.slug} stay={s} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link to="/pobyty">Všechny akce</Link>
            </Button>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
