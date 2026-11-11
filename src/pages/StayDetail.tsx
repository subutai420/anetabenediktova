import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/form-controls";
import { Loading, RichContent, StayCard } from "@/components/site/blocks";
import { useStay, useStays } from "@/lib/api";
import { site } from "@/content/site";
import NotFound from "./NotFound";

export default function StayDetail() {
  const { slug } = useParams();
  const { data: stay, isLoading } = useStay(slug);
  const { data: others } = useStays();

  if (isLoading) return <Loading />;
  if (!stay) return <NotFound />;

  const mail = `mailto:${site.email}?subject=${encodeURIComponent(`Poptávka – ${stay.title}`)}`;

  return (
    <>
      <Seo title={stay.seo_title || stay.title} description={stay.seo_description || stay.excerpt} image={stay.cover_image} />
      <section className="relative">
        <div className="relative h-[52vh] min-h-[360px] overflow-hidden">
          {stay.cover_image && <img src={stay.cover_image} alt="" className="h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/30 to-transparent" />
          <div className="container absolute inset-x-0 bottom-0 pb-12 text-cream">
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <Link to="/pobyty" className="inline-flex items-center gap-2 text-sm text-cream/80 hover:text-cream">
                <ArrowLeft className="h-4 w-4" /> Všechny pobyty
              </Link>
              {stay.country && (
                <Badge className="bg-cream/90 text-bark">
                  <MapPin className="mr-1 h-3 w-3" /> {stay.country}
                </Badge>
              )}
            </div>
            <h1 className="max-w-4xl text-4xl leading-[1.02] md:text-6xl">{stay.title}</h1>
            {stay.subtitle && <p className="mt-4 max-w-2xl text-lg text-cream/85">{stay.subtitle}</p>}
          </div>
        </div>
      </section>

      <section className="section pt-12">
        <div className="container grid gap-12 lg:grid-cols-[1fr_340px]">
          <article className="min-w-0">
            <RichContent html={stay.content} className="stay-content" />
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] border bg-card p-7 shadow-sm">
              <p className="eyebrow mb-4">Informace o pobytu</p>
              <dl className="space-y-4 text-sm">
                {stay.date_text && (
                  <div>
                    <dt className="text-muted-foreground">Termín</dt>
                    <dd className="font-serif text-xl">{stay.date_text}</dd>
                  </div>
                )}
                {stay.duration_text && (
                  <div>
                    <dt className="text-muted-foreground">Délka</dt>
                    <dd className="font-serif text-xl">{stay.duration_text}</dd>
                  </div>
                )}
                {stay.price_text && (
                  <div>
                    <dt className="text-muted-foreground">Cena</dt>
                    <dd className="font-serif text-xl">{stay.price_text}</dd>
                  </div>
                )}
                {stay.capacity && (
                  <div>
                    <dt className="text-muted-foreground">Kapacita</dt>
                    <dd className="font-serif text-xl">{stay.capacity}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-7 flex flex-col gap-2">
                {stay.booking_url ? (
                  <Button asChild size="lg">
                    <a href={stay.booking_url} target="_blank" rel="noopener">
                      {stay.cta_text || "Rezervovat"} <ArrowUpRight />
                    </a>
                  </Button>
                ) : (
                  <Button asChild size="lg">
                    <a href={mail}>
                      <Mail /> {stay.cta_text || "Mám zájem"}
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline">
                  <a href={site.phoneHref}>
                    <Phone /> {site.phone}
                  </a>
                </Button>
                <Button asChild variant="ghost">
                  <a href={site.whatsappHref} target="_blank" rel="noopener">
                    <MessageCircle /> Napsat na WhatsApp
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Poptávka je nezávazná. Ozvu se vám obratem.</p>
            </div>
          </aside>
        </div>
      </section>

      {others && others.filter((o) => o.slug !== stay.slug).length > 0 && (
        <section className="section bg-secondary/50">
          <div className="container">
            <h2 className="mb-10 text-4xl">Další pobyty</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {others
                .filter((o) => o.slug !== stay.slug)
                .slice(0, 3)
                .map((o) => (
                  <StayCard key={o.slug} stay={o} />
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
