/**
 * Centrální obsah a nastavení webu.
 * Texty tady jde jednoduše upravovat (i v Lovable) – komponenty si je jen načítají.
 */

export const site = {
  name: "Aneta Benediktová",
  tagline: "Průvodkyně přírodní léčbou",
  url: "https://anetabenediktova.cz",
  phone: "+420 720 680 451",
  phoneHref: "tel:+420720680451",
  whatsappHref: "https://wa.me/420720680451",
  email: "poradna@anetabenediktova.cz",
  facebook: "https://www.facebook.com/AnetaBenediktovaPoradna/",
  instagram: "https://www.instagram.com/explore/locations/107433083985552/aneta-benediktova/",
  youtube: "https://www.youtube.com/watch?v=GmeExGkUc0U",
  serafin: "https://serafinbyliny.cz",
  office: {
    title: "Sokolov – osobní poradenství",
    company: "Serafin byliny s.r.o.",
    address: "Stará Březovská, Dolní Rychnov – Sokolov",
    bookingUrl:
      "https://serafinbyliny.cz/prodejny/serafin-byliny-sro-sidlo-firmy-jen-poradenske-misto-anety-benediktove_409",
  },
};

/** Sesterský projekt – Rituál del Útero / Akademie Saumerio */
export const ritualUtero = {
  name: "Rituál del Útero",
  url: "https://ritualutero.cz",
  pages: {
    ritual: "https://ritualutero.cz/ritual-del-utero",
    academy: "https://ritualutero.cz/vzdelavani",
    guides: "https://ritualutero.cz/prakticky",
    articles: "https://ritualutero.cz/clanky",
    reservation: "https://ritualutero.cz/prakticky#pruvodkyne",
  },
  booking: [
    { label: "Mariánské Lázně", url: "https://aneta.reenio.cz/cs/place/zlaty-lev-marianske-lazne-55110;viewMode=day" },
    { label: "Morava – Halenkovice", url: "https://aneta.reenio.cz/cs/place/halenkovice-55109;viewMode=day" },
  ],
};

export const nav = [
  {
    label: "Co dělám",
    to: "/sluzby",
    children: [
      { label: "Irisdiagnostika a byliny", to: "/sluzby/irisdiagnostika" },
      { label: "Poradenství na dálku", to: "/sluzby/poradenstvi-na-dalku" },
      { label: "Tradiční postupy šamanů", to: "/sluzby/tradicni-postupy" },
      { label: "Rituál dělohy", to: "/sluzby/ritual-delohy" },
    ],
  },
  { label: "Pobyty", to: "/pobyty" },
  { label: "Blog", to: "/blog" },
  { label: "Bylinková akademie", to: "/bylinkova-akademie" },
  { label: "O mně", to: "/kdo-jsem" },
  { label: "Kontakt", to: "/kontakt" },
];

export const services = [
  {
    slug: "irisdiagnostika",
    title: "Irisdiagnostika a byliny",
    short: "Osobní setkání v poradně",
    text: "Podle znamének ve vaší oční duhovce společně najdeme příčinu zdravotních obtíží a nastavím vám přesnou bylinnou léčbu.",
    image: "/images/legacy/151A7420.jpg",
    price: "500 Kč",
  },
  {
    slug: "poradenstvi-na-dalku",
    title: "Holistické poradenství na dálku",
    short: "On-line z pohodlí domova",
    text: "Spojíme se on-line. Podle kvalitní fotografie vašich očí najdeme příčinu obtíží a nastavím vám bylinnou léčbu.",
    image: "/images/legacy/151A7392.jpg",
    price: "500 Kč",
  },
  {
    slug: "tradicni-postupy",
    title: "Tradiční postupy šamanů",
    short: "Zdravá mysl = zdravé tělo",
    text: "Jemné tradiční rituály Střední a Jižní Ameriky pomáhají vidět a změnit vzorce chování, které nám přinášejí nemoci.",
    image: "/images/legacy/IMG_2448.jpg",
  },
  {
    slug: "ritual-delohy",
    title: "Rituál dělohy – Andino",
    short: "Péče o ženské tělo a duši",
    text: "Rituál del útero, který mě naučila mexická šamanka. Léčí ženské tělo, duši i celou ženskou linii.",
    image: "/images/legacy/utero-saumador.jpeg",
    external: ritualUtero.url,
  },
];

/** Bylinková akademie – videa a témata (obsah stránek je v src/content/legacy/akademie-*.html) */
export const academyTopics = [
  { slug: "medicinalni-houby", title: "Medicinální houby", text: "Jak využívat medicinální houby", image: "/images/legacy/medidinalni-houby.jpg" },
  { slug: "alergie", title: "Alergie", text: "Jak na alergie přírodní cestou", image: "/images/legacy/alergie2.jpg" },
  { slug: "vysoky-krevni-tlak", title: "Vysoký krevní tlak", text: "Jak na vysoký krevní tlak přírodní cestou", image: "/images/legacy/krevni-tlak.jpg" },
  { slug: "deti", title: "Děti a jejich nemoci", text: "Dětské zdravotní problémy přírodní cestou", image: "/images/legacy/deti-12.jpg" },
  { slug: "plice", title: "Plíce", text: "Jak posílit plíce přírodní cestou", image: "/images/legacy/plice.jpg" },
  { slug: "poruchy-traveni", title: "Poruchy trávení", text: "Jak na poruchy trávení přírodní cestou", image: "/images/legacy/traveni.jpg" },
  { slug: "draci-krev", title: "Dračí krev", text: "Jak se sbírá v džungli v Ekvádoru", image: "/images/legacy/Draci-krev-Antonio.jpg" },
];

export const academyVideos = ["GmeExGkUc0U", "B02aXmmW1iQ", "i6BcRPwxKgQ"];

export const testimonials = [
  {
    text: "Zájezd do Mexika s paní Anetou byl úžasný a zcela předčil mé očekávání. Velmi oceňuji individuální a trpělivý přístup. Rituál del útero a temazcal se šamankou Cristinou byl pro mě nezapomenutelný zážitek.",
    name: "Hanna",
  },
  {
    text: "Anetina znalost španělštiny, kultury, historie a skvělých průvodců je k nezaplacení. Nic nebyl problém, vše bylo zařízené na jedničku od osobního řidiče po stravování a ubytování.",
    name: "Renata",
  },
  {
    text: "Energie, kterou jsem zažila v Peru, byla neskutečná. Návštěva Machu Picchu, energie hor nebo jen procházka po náměstí v Cuzcu. Vše mě naplnilo energií.",
    name: "Jana",
  },
];

export const ebook = {
  title: "Jak zvládnout stres a napětí",
  text: "Stáhněte si zdarma můj e-book s praktickými radami, bylinkami a cvičeními pro klidnější dny.",
  image: "/images/legacy/ebook-cover.png",
  to: "/ebook-zdarma",
};
