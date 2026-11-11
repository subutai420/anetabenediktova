import type { ReactNode } from "react";
import { Seo } from "@/components/site/Seo";
import { ContactCta, Loading, PageHero, RichContent } from "@/components/site/blocks";
import { useLegacyHtml } from "@/content/legacy";

interface Props {
  /** název souboru v src/content/legacy (bez .html) */
  source: string;
  title: ReactNode;
  seoTitle: string;
  eyebrow?: string;
  text?: string;
  image?: string;
  /** odstraní první nadpis + podtitul z převzatého HTML (už jsou v hero) */
  stripIntro?: boolean;
  after?: ReactNode;
  contact?: boolean;
  narrow?: boolean;
}

/** Obecná stránka nad obsahem převzatým z původního webu. */
export default function LegacyPage({ source, title, seoTitle, eyebrow, text, image, stripIntro = true, after, contact = true, narrow = true }: Props) {
  let html = useLegacyHtml(source);
  if (html && stripIntro) {
    html = html.replace(/^\s*<h2>[\s\S]*?<\/h2>\s*(<p>[\s\S]*?<\/p>)?/, "");
  }
  return (
    <>
      <Seo title={seoTitle} description={text} image={image} />
      <PageHero eyebrow={eyebrow} title={title} text={text} image={image} />
      <section className="section pt-14">
        <div className={narrow ? "container max-w-3xl" : "container"}>{html === null ? <Loading /> : <RichContent html={html} />}</div>
      </section>
      {after}
      {contact && <ContactCta />}
    </>
  );
}
