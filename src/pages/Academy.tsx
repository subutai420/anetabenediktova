import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { Loading, PageHero, RichContent, SectionHeading, YouTubeLite } from "@/components/site/blocks";
import { academyTopics, academyVideos, site } from "@/content/site";
import { useLegacyHtml } from "@/content/legacy";
import NotFound from "./NotFound";

const ebooks = [
  {
    title: "Covid a vše s ním spojené",
    text: "Celé spektrum názorů a zkušeností s onemocněním, s problémy po něm i po očkování – a jak pomáhají byliny.",
    image: "/images/legacy/ebook-covid-cover.webp",
  },
  {
    title: "Cholesterol, nadýmání a jiné „břichaboly“",
    text: "Všechny léky jsou kolem nás v přírodě, jen jí musíme důvěřovat a přijímat ji s pokorou a láskou.",
    image: "/images/legacy/ebook-cholesterol-cover.webp",
  },
];

export default function Academy() {
  return (
    <>
      <Seo title="Bylinková akademie" description="Videa a materiály o bylinné léčbě zdarma – medicinální houby, alergie, krevní tlak, dětské nemoci, plíce, trávení." />
      <PageHero
        eyebrow="Bylinková akademie Anety Benediktové"
        title={<>Vaše cesta <em className="text-primary">ke zdraví</em></>}
        text="Akademie byla původně natáčená pro provozovatele prodejen bylin a zdravé výživy. Rozhodla jsem se však podělit se o své znalosti s vámi všemi. Věřím, že vám pomohou na vaší cestě ke zdraví."
        image="/images/legacy/img-byliny-9.jpg"
      />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Témata" title="Vyberte si téma" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {academyTopics.map((t) => (
              <Link key={t.slug} to={`/bylinkova-akademie/${t.slug}`} className="group overflow-hidden rounded-[1.5rem] border bg-card">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={t.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="text-2xl group-hover:text-primary">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-bark text-cream">
        <div className="container">
          <h2 className="mb-10 text-4xl md:text-5xl">Ukázky z akademie</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {academyVideos.map((id) => (
              <YouTubeLite key={id} id={id} />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <img src="/images/legacy/am23MbXVAxglXec8AVTHw1VoC2oT6sMtlK4Cw9AB___webp_1080_1080.webp" alt="Andělské kúry Serafin" loading="lazy" className="mx-auto w-full max-w-md rounded-[2rem]" />
          <div>
            <p className="eyebrow mb-4">Andělské kúry Serafin</p>
            <h2 className="text-4xl md:text-5xl">Rostliny a byliny jsou víc, než se zdá</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Jsou zde s námi od pradávna. Promlouvají k nám, pomáhají nám a umí nás léčit. Andělské kúry Serafin jsou sestavené
              tak, aby efektivně pomáhaly u konkrétních bolístek.
            </p>
            <Button asChild className="mt-7">
              <a href="https://serafinbyliny.cz/e-shop/andelske-kury_9" target="_blank" rel="noopener">
                Chci vědět víc <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </section>
      <section className="section bg-secondary/50">
        <div className="container">
          <SectionHeading eyebrow="E-booky" title="Načerpejte zdarma nové informace" />
          <div className="grid gap-6 md:grid-cols-2">
            {ebooks.map((e) => (
              <div key={e.title} className="flex gap-6 rounded-[1.75rem] border bg-card p-6">
                <img src={e.image} alt="" loading="lazy" className="w-28 shrink-0 self-start rounded-lg shadow-md" />
                <div>
                  <h3 className="text-2xl">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.text}</p>
                  <Button asChild variant="link" className="mt-3">
                    <a href={`mailto:${site.email}?subject=${encodeURIComponent(`E-book: ${e.title}`)}`}>
                      <Mail /> Napište mi o e-book
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function AcademyTopic() {
  const { slug } = useParams();
  const topic = academyTopics.find((t) => t.slug === slug);
  const html = useLegacyHtml(`akademie-${slug}`);
  if (!topic) return <NotFound />;
  const body = html?.replace(/^\s*<h2>[\s\S]*?<\/h2>\s*(<p>[\s\S]*?<\/p>)?/, "");
  return (
    <>
      <Seo title={`${topic.title} – Bylinková akademie`} description={topic.text} image={topic.image} />
      <PageHero eyebrow="Bylinková akademie" title={topic.title} text={topic.text} image={topic.image}>
        <Button asChild variant="outline">
          <Link to="/bylinkova-akademie">
            <ArrowLeft /> Všechna témata
          </Link>
        </Button>
      </PageHero>
      <section className="section pt-14">
        <div className="container max-w-3xl">{html === null ? <Loading /> : <RichContent html={body} />}</div>
      </section>
      <section className="pb-20">
        <div className="container flex flex-wrap justify-center gap-3">
          {academyTopics
            .filter((t) => t.slug !== slug)
            .map((t) => (
              <Button key={t.slug} asChild variant="outline" size="sm">
                <Link to={`/bylinkova-akademie/${t.slug}`}>
                  {t.title} <ArrowRight />
                </Link>
              </Button>
            ))}
        </div>
      </section>
    </>
  );
}
