import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Loading } from "@/components/site/blocks";
import Home from "@/pages/Home";
import Stays from "@/pages/Stays";
import StayDetail from "@/pages/StayDetail";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import RitualDelohy from "@/pages/RitualDelohy";
import Academy, { AcademyTopic } from "@/pages/Academy";
import LegacyPage from "@/pages/LegacyPage";
import LegacySlug from "@/pages/LegacySlug";
import NotFound from "@/pages/NotFound";

// Administrace se načítá zvlášť, aby nezatěžovala veřejný web
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminPostList = lazy(() => import("@/pages/admin/AdminPosts").then((m) => ({ default: m.AdminPostList })));
const AdminPostEdit = lazy(() => import("@/pages/admin/AdminPosts").then((m) => ({ default: m.AdminPostEdit })));
const AdminStayList = lazy(() => import("@/pages/admin/AdminStays").then((m) => ({ default: m.AdminStayList })));
const AdminStayEdit = lazy(() => import("@/pages/admin/AdminStays").then((m) => ({ default: m.AdminStayEdit })));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

/** Přesměrování starých adres z původního webu */
function RedirectStay() {
  const { slug } = useParams();
  return <Navigate to={`/pobyty/${slug}`} replace />;
}
function RedirectAcademy() {
  const { slug = "" } = useParams();
  const topic = slug.replace(/-bylinkova-akademie-serafin$/, "").replace(/^deti-a-jejich-nemoci$/, "deti");
  return <Navigate to={`/bylinkova-akademie/${topic}`} replace />;
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<Home />} />

                <Route path="pobyty" element={<Stays />} />
                <Route path="pobyty/:slug" element={<StayDetail />} />

                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPost />} />

                <Route path="sluzby" element={<Services />} />
                <Route
                  path="sluzby/irisdiagnostika"
                  element={
                    <LegacyPage
                      source="irisdiagnostika"
                      seoTitle="Irisdiagnostika a byliny"
                      eyebrow="Brána do duše i těla"
                      title={<>Irisdiagnostika <em className="text-primary">a byliny</em></>}
                      text="Podle znamének ve vaší oční duhovce společně najdeme příčinu zdravotních obtíží a nastavím vám přesnou bylinnou léčbu. Osobně v Sokolově – cena poradenství 500 Kč."
                      image="/images/legacy/151A7420.jpg"
                    />
                  }
                />
                <Route
                  path="sluzby/poradenstvi-na-dalku"
                  element={
                    <LegacyPage
                      source="poradenstvi-na-dalku"
                      seoTitle="Poradenství na dálku"
                      eyebrow="On-line konzultace"
                      title={<>Poradenství <em className="text-primary">na dálku</em></>}
                      text="Pohodlná forma konzultace, při které společně odhalíme příčiny vašich obtíží a nastavíme bylinnou léčbu. Stačí dobré spojení a kvalitní fotografie očí."
                      image="/images/legacy/151A7392.jpg"
                    />
                  }
                />
                <Route
                  path="sluzby/tradicni-postupy"
                  element={
                    <LegacyPage
                      source="tradicni-postupy"
                      seoTitle="Tradiční postupy šamanů"
                      eyebrow="Zdravá mysl = zdravé tělo"
                      title={<>Zkuste to <em className="text-primary">jinak!</em></>}
                      text="Tradiční jemné rituály Střední a Jižní Ameriky pomáhají vidět a změnit vzorce chování, které nám přinášejí starosti i nemoci."
                      image="/images/legacy/IMG_2448.jpg"
                    />
                  }
                />
                <Route path="sluzby/ritual-delohy" element={<RitualDelohy />} />

                <Route path="bylinkova-akademie" element={<Academy />} />
                <Route path="bylinkova-akademie/:slug" element={<AcademyTopic />} />

                <Route path="kdo-jsem" element={<About />} />
                <Route path="kontakt" element={<Contact />} />
                <Route
                  path="media"
                  element={<LegacyPage source="media" seoTitle="Média" eyebrow="Aneta v médiích" title="Kde jste mě mohli vidět a slyšet" narrow={false} />}
                />
                <Route
                  path="ebook-zdarma"
                  element={
                    <LegacyPage
                      source="ebook-zdarma"
                      seoTitle="E-book zdarma"
                      eyebrow="E-book zdarma"
                      title="Jak zvládnout stres a napětí"
                      text="Praktické rady, jak to dělám já. Napište mi a e-book vám pošlu."
                      image="/images/legacy/ebook-cover.png"
                      stripIntro
                    />
                  }
                />
                <Route
                  path="zasady-zpracovani-osobnich-udaju"
                  element={<LegacyPage source="zasady-zpracovani-osobnich-udaju" seoTitle="Zásady zpracování osobních údajů" title="Zásady zpracování osobních údajů" stripIntro={false} contact={false} />}
                />
                <Route path="cookies" element={<LegacyPage source="cookies" seoTitle="Cookies" title="Cookies" stripIntro={false} contact={false} />} />

                {/* --- staré adresy z MioWebu --- */}
                <Route path="sluzby/cestovani-s-anetou" element={<Navigate to="/pobyty" replace />} />
                <Route path="sluzby/cestovani-s-anetou/:slug" element={<RedirectStay />} />
                <Route path="sluzby/pokec" element={<Navigate to="/sluzby/tradicni-postupy" replace />} />
                <Route path="davny-ritual-nejen-pro-zeny" element={<Navigate to="/blog/davny-ritual-nejen-pro-zeny" replace />} />
                <Route path="bylinna-akademie" element={<Navigate to="/bylinkova-akademie" replace />} />
                <Route path="bylinna-akademie/draci-krev-bylinkova-akademie-serafin" element={<Navigate to="/bylinkova-akademie/draci-krev" replace />} />
                <Route path="rubrika/*" element={<Navigate to="/blog" replace />} />
                <Route path="uvod" element={<Navigate to="/" replace />} />
                <Route path=":slug" element={<LegacySlugOrAcademy />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="admin/prihlaseni" element={<AdminLogin />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="clanky" element={<AdminPostList />} />
                <Route path="clanky/:id" element={<AdminPostEdit />} />
                <Route path="pobyty" element={<AdminStayList />} />
                <Route path="pobyty/:id" element={<AdminStayEdit />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

/** /<něco>-bylinkova-akademie-serafin → akademie, jinak starý článek blogu */
function LegacySlugOrAcademy() {
  const { slug = "" } = useParams();
  if (slug.endsWith("-bylinkova-akademie-serafin")) return <RedirectAcademy />;
  return <LegacySlug />;
}

export default App;
