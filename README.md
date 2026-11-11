# anetabenediktova.cz – redesign

Nový web Anety Benediktové: irisdiagnostika, bylinná léčba, transformační pobyty a rituál dělohy.
Design „bylinná zahrada“ – krémový papír, šalvějová zeleň, terakota jako most na sesterský web
[ritualutero.cz](https://ritualutero.cz), písma Cormorant Garamond + Manrope (stejná jako na ritualutero.cz).

## Technologie (= výchozí stack Lovable)

| Vrstva | Použito |
| --- | --- |
| Frontend | Vite + React 18 + TypeScript |
| Styly | Tailwind CSS + komponenty ve stylu shadcn/ui (`src/components/ui`) |
| Routing / data | react-router-dom, @tanstack/react-query |
| Backend | Supabase (Postgres + Auth + Storage) – v Lovable jako **Lovable Cloud** |
| Editor článků | TipTap (ukládá HTML) |

Stejný stack používá ritualutero.cz, takže oba weby jdou spravovat stejně.

## Spuštění

```bash
npm install
npm run dev        # http://localhost:8080
npm run build
```

Bez nastavené Supabase web běží nad statickými daty z `public/data/posts.json` a `public/data/stays.json`
(vše jde prohlížet, administrace ukáže návod k napojení).

## Struktura

```
src/
  App.tsx                    – routy + přesměrování starých adres
  content/site.ts            – kontakty, menu, služby, témata akademie, reference (texty k úpravě)
  content/legacy/*.html      – stránky převedené ze starého webu (irisdiagnostika, média, GDPR…)
  lib/api.ts                 – datová vrstva (Supabase, nebo fallback na JSON)
  pages/                     – veřejné stránky
  pages/admin/               – administrace (články, pobyty)
  components/site/blocks.tsx – sdílené bloky (karty pobytů/článků, pás Rituál del Útero, videa…)
  index.css                  – barvy designu (HSL proměnné) + styl obsahu článků
supabase/
  migrations/…_init.sql      – tabulky posts, stays, admin_users, bucket media, RLS
  seed/02_posts_*.sql        – 209 článků ze starého blogu (4 části)
  seed/01_stays.sql          – 17 pobytů (6 zveřejněných, 11 skrytých k vytřídění)
scripts/migrace/             – skripty, kterými byl obsah převeden (MioWeb export + RSS)
docs/obsah-k-vytrideni.md    – co se převedlo a co je potřeba projít
```

## Napojení databáze a administrace

### Varianta A – Lovable Cloud (doporučeno)
1. V Lovable: **Import from GitHub** (nebo nový projekt → Connect GitHub → tento repozitář).
2. Zapnout **Cloud** (Supabase). Lovable přegeneruje `src/integrations/supabase/client.ts` – to je v pořádku.
3. V SQL editoru (Cloud → Database) spustit postupně:
   `supabase/migrations/20261111000000_init.sql`, `supabase/seed/01_stays.sql` a postupně `supabase/seed/02_posts_1–4.sql`.
4. Cloud → Users → vytvořit uživatele pro Anetu (e-mail + heslo).
5. Přidat ho mezi administrátory:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'EMAIL_ANETY';
   ```
6. Přihlášení: `/admin/prihlaseni`.

### Varianta B – vlastní Supabase projekt
Stejné kroky v supabase.com, do `.env` (podle `.env.example`) doplnit `VITE_SUPABASE_URL` a `VITE_SUPABASE_PUBLISHABLE_KEY`.

### Obrázky blogu
Obrázky v článcích zatím vedou na starý web (`anetabenediktova.cz/wp-content/…`). **Před vypnutím starého webu**
je přeneste do Supabase Storage:

```bash
SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/migrace/blog-images.mjs
```

Obrázky pobytů a stránek už jsou v repozitáři (`public/images/legacy`).

## Co umí administrace
- **Články**: psaní v editoru (nadpisy, tučné, odkazy, citace, seznamy, vkládání obrázků), titulní obrázek, rubrika,
  perex, datum publikace, koncept/publikováno, SEO titulek a popis, URL.
- **Pobyty**: název, podtitul, termín (text + volitelně datum od–do), délka, cena, kapacita, země, místo, hlavní fotka,
  popis/program v editoru, text tlačítka, odkaz na rezervaci, zobrazit na webu / na úvodní stránce, pořadí.
- Nahrávání obrázků do Supabase Storage (bucket `media`), změna a obnova hesla.

## Napojení na ritualutero.cz
- tlačítko „Rituál dělohy“ v hlavičce, výrazný terakotový pás na úvodu, ve Službách a v Kontaktu,
- rezervace rituálu (Reenio – Mariánské Lázně, Morava) přímo z webu,
- stránka `/sluzby/ritual-delohy` + odkazy na Akademii Saumerio,
- blok „Sesterský projekt“ v patičce, sdílená písma a příbuzná barevná paleta.

Odkazy jsou na jednom místě v `src/content/site.ts` (`ritualUtero`).

## Úpravy v Lovable – tipy
- Barvy: `src/index.css` (`--moss`, `--clay`, `--cream`…), písma v `tailwind.config.ts`.
- Texty úvodu a služeb: `src/pages/Home.tsx`, `src/content/site.ts`.
- Převzaté stránky (`src/content/legacy/*.html`) jde postupně přepsat do komponent – stačí v Lovable napsat např.
  „Přepiš stránku Irisdiagnostika do vlastní komponenty ve stylu stránky O mně“.
