import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Seo } from "@/components/site/Seo";
import { ContactCta, Loading, PostCard, RichContent } from "@/components/site/blocks";
import { Divider } from "@/components/site/Botanical";
import { usePost, usePosts } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import NotFound from "./NotFound";

export default function BlogPost({ slugOverride }: { slugOverride?: string }) {
  const params = useParams();
  const slug = slugOverride ?? params.slug;
  const { data: post, isLoading } = usePost(slug);
  const { data: related } = usePosts({ category: post?.category, pageSize: 4 });

  if (isLoading) return <Loading />;
  if (!post) return <NotFound />;

  return (
    <>
      <Seo title={post.seo_title || post.title} description={post.seo_description || post.excerpt} image={post.cover_image} type="article" />
      <article>
        <header className="paper border-b">
          <div className="container max-w-3xl py-14 text-center md:py-20">
            <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Zpět na blog
            </Link>
            <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {post.category && (
                <Link to={`/blog?rubrika=${encodeURIComponent(post.category)}`} className="font-semibold text-primary">
                  {post.category}
                </Link>
              )}
              <span>{formatDate(post.published_at)}</span>
            </div>
            <h1 className="mt-5 text-4xl leading-[1.05] md:text-6xl">{post.title}</h1>
          </div>
        </header>
        {post.cover_image && (
          <div className="container -mt-px max-w-5xl pt-10">
            <img src={post.cover_image} alt="" className="max-h-[560px] w-full rounded-[2rem] object-cover" />
          </div>
        )}
        <div className="container max-w-3xl py-14">
          <RichContent html={post.content} />
          <Divider className="mt-16" />
          <p className="mt-6 text-center font-serif text-xl italic text-muted-foreground">Aneta</p>
        </div>
      </article>

      {related && related.items.filter((r) => r.slug !== post.slug).length > 0 && (
        <section className="section bg-secondary/50">
          <div className="container">
            <h2 className="mb-10 text-4xl">Mohlo by vás zajímat</h2>
            <div className="grid gap-10 md:grid-cols-3">
              {related.items
                .filter((r) => r.slug !== post.slug)
                .slice(0, 3)
                .map((r) => (
                  <PostCard key={r.slug} post={r} />
                ))}
            </div>
          </div>
        </section>
      )}
      <ContactCta title="Potřebujete poradit s bylinkami?" text="Objednejte se na irisdiagnostiku osobně v Sokolově nebo on-line. Najdeme příčinu obtíží a nastavíme léčbu." />
    </>
  );
}
