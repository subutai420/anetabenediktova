import { useMemo, useState } from "react";
import { Seo } from "@/components/site/Seo";
import { ContactCta, Loading, PageHero, StayCard, TestimonialCard } from "@/components/site/blocks";
import { useStays } from "@/lib/api";
import { STAY_COUNTRIES } from "@/lib/types";
import { testimonials } from "@/content/site";
import { cn } from "@/lib/utils";

export default function Stays() {
  const { data, isLoading } = useStays();
  const [country, setCountry] = useState<string | null>(null);
  const list = useMemo(() => (data ?? []).filter((s) => !country || s.country === country), [data, country]);
  const countries = STAY_COUNTRIES.filter((c) => (data ?? []).some((s) => s.country === c));

  return (
    <>
      <Seo title="Transformační pobyty" description="Transformační pobyty a kurzy s Anetou Benediktovou – Mexiko, Peru i Česko. Rituály, šamanské ceremonie, meditace a poznávání." />
      <PageHero
        eyebrow="Pobyty a kurzy s Anetou"
        title={<>Transformační <em className="text-primary">pobyty</em></>}
        text="Není to dovolená, je to návrat k sobě a vnitřní transformace. Malé skupiny, místní šamanky a šamani, rituály v přírodě – a čas jen pro vás."
        image="/images/legacy/2026-01-oma-2.jpg"
      />
      <section className="section">
        <div className="container">
          {countries.length > 1 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {[null, ...countries].map((c) => (
                <button
                  key={c ?? "vse"}
                  onClick={() => setCountry(c)}
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                    country === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary hover:text-primary",
                  )}
                >
                  {c ?? "Vše"}
                </button>
              ))}
            </div>
          )}
          {isLoading ? (
            <Loading />
          ) : list.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <StayCard key={s.slug} stay={s} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Právě připravuji nové termíny. Napište mi a dám vám vědět jako prvním.</p>
          )}
        </div>
      </section>
      <section className="section bg-secondary/50">
        <div className="container grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>
      <ContactCta title="Máte otázku k pobytu?" text="Zavolejte nebo napište – ráda vám vše vysvětlím a pomůžu vybrat pobyt, který vám bude sedět." />
    </>
  );
}
