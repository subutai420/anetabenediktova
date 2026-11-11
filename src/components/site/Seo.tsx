import { Helmet } from "react-helmet-async";
import { site } from "@/content/site";

interface SeoProps {
  title?: string;
  description?: string | null;
  image?: string | null;
  type?: "website" | "article";
}

export function Seo({ title, description, image, type = "website" }: SeoProps) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} – ${site.tagline}`;
  const desc = description?.slice(0, 160);
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {desc && <meta name="description" content={desc} />}
      <meta property="og:title" content={fullTitle} />
      {desc && <meta property="og:description" content={desc} />}
      {image && <meta property="og:image" content={image.startsWith("http") ? image : site.url + image} />}
      <meta property="og:type" content={type} />
    </Helmet>
  );
}
