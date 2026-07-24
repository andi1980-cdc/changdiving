# Page Header + Jump Menu Pattern

Stand: Juli 2026  
Referenz: `docs/PAGE-HEADER-JUMP-MENU-PATTERN.md`  
Verwandt (älter, H1 _im_ Hero): `HERO-TRANSACTIONAL-PATTERN.md`

**Dieses** Dokument ist der aktuelle Standard:

| Seitentyp                          | H1 + Teaser unter Hero | Jump-Menü                            |
| ---------------------------------- | ---------------------- | ------------------------------------ |
| **Produkt-/Buchungsseiten**        | ja                     | ja (4 Punkte)                        |
| **Kategorie-/Hub-Seiten**          | ja                     | **nie**                              |
| **Preisliste `/prices/`**          | ja                     | **ja (7 Punkte, Ausnahme)**          |
| **Tech-Produktseiten (`tek-box`)** | ja                     | ja (4 Punkte, **Jump-Bar-Ausnahme**) |

---

## Status: Day Trips (abgeschlossen)

### Produktseiten (mit Jump-Menü)

| Seite                   | Status | Book-/Packages-Anker        | Jump-Labels                                                                                        |
| ----------------------- | ------ | --------------------------- | -------------------------------------------------------------------------------------------------- |
| `fun-dives`             | ✅     | `#dive-packages`            | Standard                                                                                           |
| `try-dive`              | ✅     | `#try-dive-options`         | Standard                                                                                           |
| `scuba-review`          | ✅     | `#review-packages`          | Standard                                                                                           |
| `snorkeling`            | ✅     | `#book-snorkeling` (neu)    | Standard                                                                                           |
| `insurance`             | ✅     | `#book-insurance`           | **Versicherung** (s.u.)                                                                            |
| `rent-gopro`            | ✅     | `#book-gopro`               | **GoPro** (s.u.)                                                                                   |
| `scuba-diver`           | ✅     | `#owd-packages`             | Standard                                                                                           |
| `open-water-diver`      | ✅     | `#owd-packages`             | Standard                                                                                           |
| `open-advanced-package` | ✅     | `#combo-packages`           | Standard                                                                                           |
| `open-to-divemaster`    | ✅     | `#ow-dm-packages`           | Standard                                                                                           |
| `advanced` (AOWD)       | ✅     | `#aowd-packages`            | Standard                                                                                           |
| `first-aid`             | ✅     | `#first-aid-packages`       | Standard                                                                                           |
| `rescue-diver`          | ✅     | `#rescue-packages`          | Standard                                                                                           |
| `master-scuba-diver`    | ✅     | `#msd-packages`             | Standard                                                                                           |
| `divemaster`            | ✅     | `#dm-packages`              | Standard                                                                                           |
| `efr-instructor`        | ✅     | `#efri-packages`            | Standard                                                                                           |
| `sdi-idc`               | ✅     | `#idc-packages`             | Standard                                                                                           |
| `sdi-ie`                | ✅     | `#ie-packages`              | Standard (`#whats-included` → Exam-Ablauf)                                                         |
| `instructor-crossover`  | ✅     | `#crossover-packages`       | Standard                                                                                           |
| `deep-wreck-nitrox`     | ✅     | `#dwn-packages`             | Standard                                                                                           |
| `nitrox-diver`          | ✅     | `#nitrox-packages`          | Standard                                                                                           |
| `nitrox-blender`        | ✅     | `#nb-packages`              | Standard (`#whats-included` → Kursformat)                                                          |
| `deep-diver`            | ✅     | `#deep-packages`            | Standard                                                                                           |
| `wreck-diver`           | ✅     | `#wreck-packages`           | Standard                                                                                           |
| `navigation`            | ✅     | `#navigation-packages`      | Standard                                                                                           |
| `search-recovery`       | ✅     | `#search-packages`          | Standard                                                                                           |
| `night`                 | ✅     | `#night-packages`           | Standard                                                                                           |
| `sidemount`             | ✅     | `#sidemount-packages`       | Standard                                                                                           |
| `solo-diver`            | ✅     | `#solo-packages`            | Standard                                                                                           |
| `intro-to-tech`         | ✅     | `#intro-to-tech-packages`   | Standard + **`tek-box`-Ausnahme**                                                                  |
| `advanced-nitrox`       | ✅     | `#advanced-nitrox-packages` | Standard + **`tek-box`-Ausnahme**                                                                  |
| `deco-procedures`       | ✅     | `#deco-packages`            | Standard + **`tek-box`-Ausnahme**                                                                  |
| `advanced-wreck`        | ✅     | `#advanced-wreck-packages`  | Standard + **`tek-box`-Ausnahme** (vorher fälschlich `speciality-box`)                             |
| `tdi-sidemount`         | ✅     | `#tdi-sidemount-packages`   | Standard + **`tek-box`-Ausnahme** (vorher `speciality-box`; DE/TH-Anker auf EN-ID vereinheitlicht) |
| `tech-package`          | ✅     | `#tech-packages`            | Standard + **`tek-box`-Ausnahme** (vorher `speciality-box`)                                        |

### Kategorie-Hub (ohne Jump-Menü)

| Seite                                           | Status                                        |
| ----------------------------------------------- | --------------------------------------------- |
| `/day-trips/` (EN/DE/TH)                        | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/beginner-courses/` (EN/DE/TH)         | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/advanced-courses/` (EN/DE/TH)         | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/professional-courses/` (EN/DE/TH)     | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/specialty/` (EN/DE/TH)                | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/technical-diving-courses/` (EN/DE/TH) | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/` (EN/DE/TH)                          | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |

### Preisliste (mit Jump-Menü – Ausnahme)

| Seite                 | Status                                                |
| --------------------- | ----------------------------------------------------- |
| `/prices/` (EN/DE/TH) | ✅ H1 + Teaser + **7-Punkt-Jump** (s. Ausnahme unten) |

---

## Ziel

| Vorher                                          | Nachher                                               |
| ----------------------------------------------- | ----------------------------------------------------- |
| H1 + Teaser als Overlay auf dem Hero-Bild       | Hero = nur Bild                                       |
| Extra `<h2>` unter Banner (oft redundant)       | H1 ist die einzige Hauptüberschrift                   |
| Jump-Menü unterschiedlich (Discover, 5 Links …) | Produktseiten: immer 4 Punkte; **Kategorien: keines** |

**Vorteile:** besseres Hero-Bild, lesbarer Titel, konsistente Navigation, weniger doppelte Headlines.

---

## Kategorie-/Hub-Seiten (ohne Jump-Menü)

Gleiche Header-Logik wie Produktseiten, **aber nie `page-jump-nav`**.

Beispiele: `/day-trips/`, `/courses/beginner-courses/`, später `/courses/`, `/dive-sites/`, `/posts/`, weitere Sub-Hubs …

```
<header> … hero picture (kein .hero-text) … </header>
<main>
  submenu (optional)
  breadcrumb
  h1          (zentriert)
  p (Teaser)  (zentriert)
  <hr />      ← Trennlinie nach Header-Block (nur ohne Jump-Menü)
  Intro / Hub-Copy + Produktkarten
  <hr />
  Trustindex-Reviews   ← vor „Dive Deeper“ / Guides-Block
  <hr />
  Dive Deeper / Beyond the Course (Guides, Tips, FAQs + Karten)
```

**Regel:** Kategorie = Übersicht/Navigation → kein On-page-Jump. Nach H1 + Teaser ein `<hr />`. Jump-Menü nur auf buchbaren Einzel-/Produktseiten (dort ersetzt die Jump-Nav-Unterkante die Linie).

## **Reviews-Reihenfolge:** Trustindex-Widget **immer vor** dem Guides-/FAQ-Abschnitt („Dive Deeper“, „Beyond the Course“, …) – nicht danach. Typische Hub-Reihenfolge: Produktkarten → Reviews → Guides/FAQs.

## Zielstruktur Produktseite (mit Jump-Menü)

```
<header> … hero picture (kein .hero-text) … </header>
<main>
  posts-submenu (optional)
  <div class="changdiving-box">   ← oder speciality-box / tek-box (s. Ausnahmen)
    breadcrumb
    h1          (zentriert)
    p (Teaser)  (zentriert)
    page-jump-nav   (Border/Look je nach Box-Typ)
    banner-img  (optional)
    <hr />      (unter Banner ok; nicht zwischen Jump-Nav und Banner)
    intro … id="intro"
    …
    Preise/Buchung (seiten-spezifischer Anker)
```

---

## 1. Hero: Text-Overlay entfernen

```html
<!-- ENTFERNEN -->
<div class="hero-text">
  <h1>…</h1>
  <p>…</p>
</div>
```

Hero enthält nur noch `<picture>` / Hero-Bild.  
CSS für `.hero-text` im Page-`<style>` darf bleiben (optional später aufräumen).

---

## 2. H1 + Teaser nach Breadcrumb

```html
<h1 style="margin: 20px 0 8px; text-align: center">…</h1>
<p style="margin: 0 0 24px; color: #555; text-align: center">…</p>
```

**Regeln:**

- H1 ≈ Keywords wie `<title>`, **ohne** `| Chang Diving`
- Teaser = 1–2 Sätze (früher oft im Hero)
- Beide **zentriert**
- Hero-`alt` keyword-stark halten

---

## 3. Redundantes H2 entfernen

Zweites Headline-H2, das den Seitentitel wiederholt (z. B. blaues `headline-blue`), **entfernen**. SEO-Fließtext darunter bleibt.

---

## 4. Jump-Menü – Standard (Touren / Kurse)

| #   | EN              | DE                | TH              | Typischer Anker    |
| --- | --------------- | ----------------- | --------------- | ------------------ |
| 1   | Intro           | Intro             | **บทนำ**        | `#intro`           |
| 2   | Who can join?   | Wer kann mit?     | ใครเข้าร่วมได้? | `#who-can-join`    |
| 3   | What's included | Was ist inklusive | สิ่งที่รวมอยู่  | `#whats-included`  |
| 4   | Prices & book   | Preise & buchen   | ราคาและจอง      | siehe Tabelle oben |

Label „On this page“: EN `On this page` · DE `Auf dieser Seite` · TH `ในหน้านี้`

**Nicht** im Standard-Menü: Discover / Entdecken (Abschnitt darf bleiben).

### Markup (EN)

```html
<nav
  class="page-jump-nav"
  aria-label="On this page"
  style="border-bottom: 1px solid #ccc"
>
  <span class="page-jump-nav__label">On this page</span>
  <div class="page-jump-nav__links">
    <a href="#intro">Intro</a>
    <a href="#who-can-join">Who can join?</a>
    <a href="#whats-included">What's included</a>
    <a href="#dive-packages">Prices &amp; book</a>
  </div>
</nav>
```

---

## 5. Linienfarbe / Jump-Bar-Look

| Box               | Jump-Nav                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `changdiving-box` | Inline `border-bottom: 1px solid #ccc` (wie globales `hr`)                                       |
| `speciality-box`  | CSS: leichte Grün/Gelb-Fläche (`.speciality-box .page-jump-nav`) – **kein** Inline-Border `#ccc` |
| `tek-box`         | CSS: grauer→oranger Verlauf (s. Ausnahme unten) – **kein** Inline-Border `#ccc`                  |

- **Kein** `<hr>` zwischen Jump-Nav und Banner
- `<hr />` unter dem Banner vor Intro ist ok

---

## Checkliste

### Produkt-/Buchungsseite

1. [ ] `.hero-text` aus Hero entfernt
2. [ ] H1 + Teaser nach Breadcrumb, zentriert
3. [ ] Redundantes Intro-/Titel-H2 entfernt (falls vorhanden)
4. [ ] Jump-Menü 4 Punkte (Standard **oder** Produkt-Ausnahme)
5. [ ] `id="intro"` gesetzt
6. [ ] Jump-Bar: `#ccc` **oder** Box-Ausnahme (`speciality-box` / `tek-box`); kein doppeltes `<hr>` über dem Banner
7. [ ] Packages-/Book-Anker stimmt (Preisliste „Book now“ ggf. nachziehen)
8. [ ] DE + TH spiegeln; TH Intro-Label = **บทนำ** (nicht „Intro“)
9. [ ] Bildpfade prüfen (`/img/products/…`, keine falschen Ordnernamen)
10. [ ] Tech-Seiten: Content in `<div class="tek-box">`; Jump + Book-CTA = `tek-box`-Verlauf (s. Ausnahme)

### Kategorie-/Hub-Seite

1. [ ] `.hero-text` aus Hero entfernt
2. [ ] H1 + Teaser nach Breadcrumb, zentriert (SEO-Teaser, 1–2 Sätze)
3. [ ] `<hr />` direkt nach dem Teaser
4. [ ] **Kein** `page-jump-nav` / Jump-Menü
5. [ ] Section-H2s linksbündig (ggf. `style="text-align: left"` gegen `.grid-container h2`)
6. [ ] Trustindex-Reviews **vor** Dive Deeper / Beyond the Course (nicht danach)
7. [ ] DE + TH spiegeln

> **Hart:** Auf Kategorie-Seiten **nie** ein Jump-Menü einbauen. Nach Teaser immer `<hr />` (bei Jump-Seiten nicht – Border der Nav reicht). Reviews immer vor dem Guides-/FAQ-Block.

---

## Produkt-Ausnahmen (Labels)

### Insurance (`/day-trips/insurance/`)

| EN            | DE              | TH           |
| ------------- | --------------- | ------------ |
| Intro         | Intro           | บทนำ         |
| Benefits      | Vorteile        | ประโยชน์     |
| Coverage      | Deckung         | ความคุ้มครอง |
| Prices & book | Preise & buchen | ราคาและจอง   |

Anker: `#intro`, `#who-can-join`, `#whats-included`, `#book-insurance`  
(IDs technisch an Kurs-Schema angelehnt; sichtbare Labels versicherungsspezifisch.)

### GoPro Rental (`/day-trips/rent-gopro/`)

| EN              | DE              | TH               |
| --------------- | --------------- | ---------------- |
| Intro           | Intro           | บทนำ             |
| What's included | Inklusive       | สิ่งที่รวมอยู่   |
| What you'll see | Was du siehst   | สิ่งที่คุณจะเห็น |
| Prices & book   | Preise & buchen | ราคาและจอง       |

Anker: `#intro`, `#whats-included`, `#what-youll-see`, `#book-gopro`

### Prices (`/prices/`) – Ausnahme mit 7 Jump-Punkten

Lange Preistabelle (kein reiner Kategorie-Hub): Jump-Menü springt zu Inklusiv-Kasten und Tabellen-Abschnitten.

| #   | EN               | DE                 | TH             | Anker               |
| --- | ---------------- | ------------------ | -------------- | ------------------- |
| 1   | What's Included? | Was ist enthalten? | สิ่งที่รวมอยู่ | `#whats-included`   |
| 2   | Day Trips        | Tagestouren        | ทริปวันเดียว   | `#prices-day-trips` |
| 3   | Beginner         | Anfänger           | มือใหม่        | `#prices-beginner`  |
| 4   | Advanced         | Fortgeschritten    | ขั้นสูง        | `#prices-advanced`  |
| 5   | Pros             | Pros               | มืออาชีพ       | `#prices-pros`      |
| 6   | Specialty        | Specialty          | พิเศษ          | `#prices-specialty` |
| 7   | Tec              | Tec                | เทค            | `#prices-tec`       |

Anker sitzen am Info-Kasten bzw. an den Abschnitts-`<tr>` der Preistabelle.

### Technical Diving (`tek-box`) – Jump-Bar- & CTA-Ausnahme

Tech-Produktseiten nutzen **`<div class="tek-box">`** (nicht `changdiving-box` / `speciality-box`).

**Jump-Labels:** Standard (Intro · Who can join? · What's included · Prices & book).

**Jump-Bar-Look** (wie Specialty-Box-Struktur, andere Farbe):

- CSS in `style.css` / `style.min.css`: `.tek-box .page-jump-nav`
- Verlauf (aufgehellter Adv-Wreck-CTA):

```css
background: linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 45%, #ff8a5c 100%);
border-radius: 8px;
border: 1px solid rgba(255, 138, 92, 0.5);
```

- Label + Links: hell/weiß (nicht Blau wie bei `changdiving-box`)
- **Kein** Inline-`style="border-bottom: 1px solid #ccc"` an der Jump-Nav (CSS übernimmt)
- Empfehlung: denselben Jump-Bar-Block auch im Page-`critical-css` halten (sonst Cache/`preload`-CSS kann die Box „fehlen“)

**Book-CTA:** gleicher Verlauf wie die Jump-Bar (nicht Blau/Silber `#0077b6 → #c0c0c0`).

```html
style=" display: inline-block; background: linear-gradient(135deg, #3a3a3a 0%,
#5a5a5a 45%, #ff8a5c 100%); color: white; … "
```

**`posts-submenu` (nur Tech):** Auf Seiten mit `<div class="tek-box">` bekommen die Submenu-Buttons denselben Verlauf (CSS, nicht Inline):

```css
main:has(> .tek-box) > .posts-submenu a {
  background: linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 45%, #ff8a5c 100%);
}
```

Gilt automatisch für alle Tech-Produktseiten mit `tek-box`; Day-Trip-/Specialty-Seiten bleiben blau/silber.

**Referenzseite:** `/courses/intro-to-tech/` (EN/DE/TH).  
Weitere Tech-Produkte (`advanced-nitrox`, `deco-procedures`, `advanced-wreck`, `tdi-sidemount`, `tech-package`, …) bei Rollout gleich behandeln.

---

## Seiten-Notizen (Day Trips)

| Seite            | Besonderheiten                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **fun-dives**    | Erste Referenz; Intro = erster SEO-Absatz nach Banner; `#dive-packages`                                                                       |
| **try-dive**     | Kein Banner wie Fun Dives; `#intro` am Video-Block (EN/TH) bzw. am „Was ist Schnuppertauchen?“-H2 (DE); DE: `#requirements` → `#who-can-join` |
| **scuba-review** | Banner + Video-Playlist behalten; `#course-overview` → `#intro`; TH: Bildpfade waren falsch (`สกูบา_review` → `scuba_review`) – **gefixt**    |
| **snorkeling**   | Jump-Menü war neu; `#book-snorkeling` neu; TH-Banner auf `/img/products/snorkeling/snorkeling_2_small.webp` vereinheitlicht                   |
| **insurance**    | Hero war schon ohne Overlay; Labels siehe Ausnahme                                                                                            |
| **rent-gopro**   | Kurze Seite; Includes als eigenes H2; Labels siehe Ausnahme                                                                                   |

---

## Bekannte Fixes während des Rollouts

1. **TH scuba-review:** alle Bild-URLs `/img/products/สกูบา_review/` → `/img/products/scuba_review/` (13 Stellen inkl. Meta/OG).
2. **TH snorkeling Banner:** `/img/daytrips/snorkeling/snorkeling2.webp` → `/img/products/snorkeling/snorkeling_2_small.webp`.
3. **TH Jump-Label:** immer **บทนำ**, nie englisches „Intro“.

---

## Nächster Rollout (offen)

**Courses – Produktseiten** (mit Jump-Menü):  
Tech-Produkte in `tek-box` (s. Ausnahme): `advanced-nitrox`, `deco-procedures`, `advanced-wreck`, `tdi-sidemount`, `tech-package`, …

**Kategorie-Hubs** (H1 + Teaser, **ohne** Jump-Menü):  
`/courses/`, `/dive-sites/`, `/posts/`, Sub-Hubs – gleiches Header-Muster wie `/day-trips/`.

---

## Prüfen lokal

```bash
# Alle Day-Trip-Produktseiten: Jump-Nav + intro-Anker vorhanden?
for lang in en de th; do
  for p in fun-dives try-dive scuba-review snorkeling insurance rent-gopro; do
    f="$lang/day-trips/$p/index.html"
    echo -n "$f: "
    grep -c 'page-jump-nav' "$f"; grep -c 'id="intro"' "$f"
  done
done
```
