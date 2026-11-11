import { Navigate, useParams } from "react-router-dom";
import { Loading } from "@/components/site/blocks";
import { usePost } from "@/lib/api";
import NotFound from "./NotFound";

/**
 * Staré adresy článků byly přímo v kořeni webu (anetabenediktova.cz/nazev-clanku/).
 * Pokud takový článek existuje, přesměrujeme na /blog/nazev-clanku – odkazy z Googlu a sociálních sítí tak fungují dál.
 * (Na hostingu je vhodné doplnit i serverová 301 přesměrování – viz public/_redirects.)
 */
export default function LegacySlug() {
  const { slug } = useParams();
  const { data: post, isLoading } = usePost(slug);
  if (isLoading) return <Loading />;
  if (post) return <Navigate to={`/blog/${post.slug}`} replace />;
  return <NotFound />;
}
