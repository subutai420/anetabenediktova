import { Link } from "react-router-dom";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { Sprig } from "@/components/site/Botanical";

export default function NotFound() {
  return (
    <section className="paper relative grid min-h-[65vh] place-items-center overflow-hidden">
      <Seo title="Stránka nenalezena" />
      <Sprig className="absolute right-10 top-10 h-64 w-36 opacity-30" />
      <div className="container max-w-xl text-center">
        <p className="eyebrow mb-4">Chyba 404</p>
        <h1 className="text-5xl md:text-6xl">Tahle cestička nikam nevede</h1>
        <p className="mt-5 text-muted-foreground">Stránka, kterou hledáte, neexistuje nebo se přestěhovala.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">Na úvod</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/blog">Na blog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
