# Převedený obsah – k vytřídění

Zdroj: MioWeb export (`mioweb_export.zip`, 29. 10. 2026) + RSS feed živého webu (blog, 11. 11. 2026).
Cíl byl přenést **vše** a vytřídit až v novém webu.

## Pobyty (17)

Zveřejněné jsou ty, které byly 11/2026 ve výpisu na starém webu. Ostatní jsou v administraci jako **skryté** –
stačí zapnout „Zobrazit na webu“, upravit termín a uložit, nebo je smazat.

| Stav | Pobyt | Termín | Cena |
| --- | --- | --- | --- |
| ✅ na webu | Transformační pobyt s rituálem dělohy v ČR | únor a březen 2027 | 7 200 Kč |
| ✅ na webu | Peru s Machu Picchu – cesta k sobě | září 2026 a duben 2027 | 2 550 USD |
| ✅ na webu | Mexiko – otevření vnitřní síly (SPECIÁL) | listopad 2026 | 1 550 EUR |
| ✅ na webu | Španělština na pláži | kdykoliv | 15 000 Kč |
| ✅ na webu | Mexiko: Día de los muertos – velký okruh | říjen–listopad | 2 690 EUR |
| ✅ na webu | Mexiko: Día de los muertos – menší okruh | říjen–listopad | 1 990 EUR |
| ⏸ skryto | Mexiko „na pohodu“ s mexickou kuchyní | – | – |
| ⏸ skryto | Mexiko „nejen“ pro ženy | 9.–19. 10. 2025 (proběhlo) | 25 000 Kč |
| ⏸ skryto | Mexiko na talíři i na vlastní kůži | dle objednávky | od 1 600 EUR |
| ⏸ skryto | Mexiko neobjevené – kuchyně, příroda i města | 15.–26. 2. 2025 (proběhlo) | 2 000 EUR |
| ⏸ skryto | Mexiko pro ženy – ceremonie pro ženské zdraví | – | – |
| ⏸ skryto | Mexiko, Guatemala a Belize | – | – |
| ⏸ skryto | Mexiko – transformační pobyt nejen pro ženy | 6.–15. 8. 2026 (proběhlo) | 900 EUR |
| ⏸ skryto | Mexiko – pobyt v čase jarní rovnodennosti | 18.–27. 3. 2026 (proběhlo) | 1 250 EUR |
| ⏸ skryto | Návrat k sobě – víkend Vysočina | 25.–28. 9. 2026 (proběhlo) | 8 900 Kč |
| ⏸ skryto | Osobní setkání s mexickými šamany v Čechách | – | – |
| ⏸ skryto | Rituál dělohy – léčba v ČR | dle objednávek | 2 000 / 1 500 Kč |

> Tip: bez napojené databáze jdou skryté pobyty zobrazit přímým odkazem `/pobyty/<adresa>` – hodí se pro kontrolu.

## Blog (209 článků)

| Rubrika | Počet |
| --- | --- |
| Přírodní léčba | 124 |
| Byliny a houby | 52 |
| Cesty a rituály | 33 |

Nová rubrika **Ženská péče** je připravená (pro články k rituálu dělohy) – zatím prázdná, články jde přeřadit v administraci.
Jako koncept (skryté) jsou 2 testovací články z MioWebu: `vzorovy-clanek-3`, `702-2`.

Staré adresy článků (`anetabenediktova.cz/nazev-clanku/`) se automaticky přesměrují na `/blog/nazev-clanku`.

## Stránky

| Stará stránka | Nová adresa | Jak převedeno |
| --- | --- | --- |
| Úvod | `/` | nově navržená, texty převzaté |
| Kdo jsem | `/kdo-jsem` | nově navržená, texty převzaté |
| Co dělám (Služby) | `/sluzby` | nově navržená |
| Irisdiagnostika | `/sluzby/irisdiagnostika` | převzaté HTML |
| Poradenství na dálku | `/sluzby/poradenstvi-na-dalku` | převzaté HTML |
| Tradiční postupy šamanů (pokec) | `/sluzby/tradicni-postupy` | převzaté HTML |
| Rituál dělohy – Andino | `/sluzby/ritual-delohy` | nová stránka (původní byla jen šablona s „lorem ipsum“) |
| Bylinková akademie + 7 témat | `/bylinkova-akademie`, `/bylinkova-akademie/<tema>` | přehled nový, témata převzatá |
| Média | `/media` | převzaté HTML |
| Kontakt | `/kontakt` | nově navržená |
| E-book zdarma | `/ebook-zdarma` | převzaté HTML (formulář SmartEmailingu nepřenesen) |
| Zásady zpracování osobních údajů, Cookies | stejné adresy | převzaté HTML |

### Převedeno, ale zatím bez odkazu na webu (`src/content/legacy/`)
- `byliny-houby-a-priroda-leci.html` – starší podstránka služeb
- `ebook-covid.html`, `ebook-cholesterol.html` – stránky e-booků
- `archiv-lehkost-v-tezkem-byti.html`, `archiv-relaxace-a-uvolneni-strachu.html` – staré akce
- `uvod.html`, `kdo-jsem.html`, `sluzby.html`, `kontakt.html` – původní texty pro porovnání

### Nepřeneseno (technické / prázdné stránky MioWebu)
- `potvrzeni-e-mailu`, `hotovo`, `stazeni-hsjak` – potvrzovací stránky formulářů SmartEmailingu
- `vzorova-akce`, `uvod-stary`, `blog` (jen výpis), `archiv` – šablony / staré verze
- Formuláře SmartEmailing (e-book, poptávky pobytů) – je potřeba rozhodnout, zda zachovat SmartEmailing
  (vložit jejich formulář), nebo ukládat poptávky do Supabase.

## K rozhodnutí
1. **E-book a newsletter** – SmartEmailing, nebo vlastní řešení?
2. **Poptávkový formulář u pobytů** – teď otevře e-mail / telefon / WhatsApp. Lze přidat formulář ukládající do databáze + e-mail Anetě.
3. **Kontakty** – na webu jsou dva e-maily (`poradna@…` a `benediktova@serafinbyliny.cz` pro fotky očí). Sjednotit?
4. **Recenze** – zveřejnit víc referencí (ze stránky „Co říkají ostatní o Mexiku a Peru“)?
