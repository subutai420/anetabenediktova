import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { ContactCta, PageHero, SectionHeading, YouTubeLite } from "@/components/site/blocks";
import { Divider } from "@/components/site/Botanical";

const chapters = [
  {
    title: "Jako zdravotní sestra",
    image: "/images/legacy/anetabenediktova.cz-3.webp",
    text: [
      "Jako zdravotní sestra jsem nastoupila do nemocnice na chirurgické oddělení v bývalých Sudetech, kde vše fungovalo úplně jinak, než nás ve škole učili. Náročné prostředí a praxe mě hodně naučily. Nestěžovala jsem si, mělo to tak být. Tuto zkušenost velmi využívám ve své práci.",
      "Život mi ukazoval dál moji cestu, i když v určitých úsecích jsem nechápala, proč se to tak děje. Ale věřila jsem, věřila jsem životu. Měla jsem možnost se učit nejenom od lékařů, ale i od tradičních bylinářů a osobností alternativní medicíny.",
    ],
  },
  {
    title: "Na diplomy si nepotrpím",
    image: "/images/legacy/anetabenediktova.cz-4.webp",
    text: [
      "MUDr. Zelenka – sportovní lékař, Ing. J. Janča – badatel v oblasti alternativní medicíny, bylináři A. Zentrich, P. Váňa, MUDr. R. Růžička CSc. – akupunktura a čínská medicína, MUDr. Z. Šos – Penzelova akupunkturní masáž, Bhante Sujiva a Dassana – buddhističtí mniši a učitelé. Ti všichni mi dali úžasné znalosti, poznatky a zkušenosti, ze kterých čerpám.",
      "Nepotrpím si na různé diplomy a certifikáty, byť jich mám v deskách hromadu. Myslím si, že nejdůležitější je, co člověk opravdu umí. Mě učily nejenom kurzy, ale i knihy a hlavně praxe.",
      "V životě jsem se dostala do několika krizových situací. Neměla jsem auto, a tak jsem za klienty na reflexní terapii a akupunkturní masáže jezdila vlakem s dvacetikilovým masážním lehátkem a batohem plným pomůcek. Věřila jsem a zvládla jsem to! Byla to úžasná škola života.",
    ],
  },
  {
    title: "Serafíni – poslové světla",
    image: "/images/legacy/anetabenediktova.cz-5.webp",
    text: [
      "Krizová situace v osobním životě mě připravila o střechu nad hlavou, ale v tom okamžiku přišla další příležitost. S mým synem a bývalým manželem jsme vybudovali rodinnou firmu Serafin byliny s.r.o. – firmu bylinných čajů, tinktur a doplňků stravy.",
      "Proč zrovna Serafin? Jednou jsem seděla v meditaci v době, kdy jsem prožívala jednu ze svých životních lekcí… a najednou jsem to věděla. Serafíni jsou poslové světla a naděje! Stejně jako byliny. Postupně jsem vytvořila receptury čajů, tinktur a kapslí, které sama ve své praxi s velkým úspěchem používám.",
      "Nyní jsem celou firmu předala synovi a věnuji se již pouze alternativní medicíně – poradenství a cestám. Vždyť to je moje poslání…",
    ],
  },
];

export default function About() {
  return (
    <>
      <Seo title="Kdo jsem" description="Aneta Benediktová – zdravotní sestra, bylinářka, iridioložka a průvodkyně transformačními pobyty v Mexiku a Peru." image="/images/aneta-portret.webp" />
      <PageHero
        eyebrow="Aneta Benediktová"
        title={<>Jsem váš průvodce v <em className="text-primary">přírodní léčbě</em></>}
        text="To, že jsem nemohla z politických důvodů studovat medicínu, bych mohla brát jako velkou křivdu. Ale jako vystudovaná lékařka bych pravděpodobně nikdy neměla odvahu jít alternativním směrem a léčit přírodně bylinami."
        image="/images/legacy/IMG_6350.jpg"
      />

      <section className="section text-center">
        <div className="container max-w-3xl">
          <p className="eyebrow mb-6">Mé životní krédo</p>
          <blockquote className="font-serif text-3xl italic leading-snug md:text-5xl">
            „Vše, co se ti v životě děje, je jen a jen pro tvé dobro, i když v tuto chvíli to tak nevypadá.“
          </blockquote>
          <Divider className="mt-10" />
        </div>
      </section>

      {chapters.map((c, i) => (
        <section key={c.title} className={i % 2 ? "section bg-secondary/50" : "section"}>
          <div className="container grid items-center gap-12 lg:grid-cols-2">
            <img
              src={c.image}
              alt=""
              loading="lazy"
              className={`mx-auto w-full max-w-md drop-shadow-xl ${i % 2 ? "lg:order-2" : ""}`}
            />
            <div>
              <h2 className="text-4xl md:text-5xl">{c.title}</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-foreground/80">
                {c.text.map((t) => (
                  <p key={t.slice(0, 20)}>{t}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Poslechněte si mě" title="Kde jste mě mohli vidět" />
          <div className="grid gap-6 md:grid-cols-2">
            <YouTubeLite id="8GngM4f73ZI" title="Aneta Benediktová" />
            <YouTubeLite id="9uq1fVlnPRQ" title="Aneta Benediktová" />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/sluzby">
                Moje služby pro vás <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/media">Aneta v médiích</Link>
            </Button>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
