# Page Header + Jump Menu Pattern

Stand: Juli 2026  
Referenz: `docs/PAGE-HEADER-JUMP-MENU-PATTERN.md`  
Verwandt (älter, H1 _im_ Hero): `HERO-TRANSACTIONAL-PATTERN.md`

**Dieses** Dokument ist der aktuelle Standard:

| Seitentyp                          | H1 + Teaser unter Hero | Jump-Menü                                 |
| ---------------------------------- | ---------------------- | ----------------------------------------- |
| **Produkt-/Buchungsseiten**        | ja                     | ja (4 Punkte)                             |
| **Kategorie-/Hub-Seiten**          | ja                     | **nie**                                   |
| **Blog-Posts (`posts-box`)**       | ja (wie Kurse)         | **ja, individuell** je nach Post-Thematik |
| **Preisliste `/prices/`**          | ja                     | **ja (7 Punkte, Ausnahme)**               |
| **Tech-Produktseiten (`tek-box`)** | ja                     | ja (4 Punkte, **Jump-Bar-Ausnahme**)      |

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

| Seite                                               | Status                                        |
| --------------------------------------------------- | --------------------------------------------- |
| `/day-trips/` (EN/DE/TH)                            | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/beginner-courses/` (EN/DE/TH)             | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/advanced-courses/` (EN/DE/TH)             | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/professional-courses/` (EN/DE/TH)         | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/specialty/` (EN/DE/TH)                    | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/technical-diving-courses/` (EN/DE/TH)     | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/courses/` (EN/DE/TH)                              | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/faqs/` (EN/DE/TH)                                 | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/posts/` (EN/DE/TH)                                | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/posts/marine-life-koh-chang/` (EN/DE/TH)          | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/posts/scuba-knowledge/` (EN/DE/TH)                | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/posts/diving-how-to-guides-koh-chang/` (EN/DE/TH) | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/posts/straight-talk/` (EN/DE/TH)                  | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/posts/tips-and-tricks/` (EN/DE/TH)                | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |
| `/posts/koh-chang-diving-travel-guides/` (EN/DE/TH) | ✅ H1 + Teaser unter Hero, **kein** Jump-Menü |

### Blog-Posts (`posts-box`, mit Jump-Menü)

| Seite                                                                               | Status | Jump-Punkte | Hinweis                                                                            |
| ----------------------------------------------------------------------------------- | ------ | ----------- | ---------------------------------------------------------------------------------- |
| `posts/marine-life-koh-chang/marine-life` (EN/DE/TH)                                | ✅     | **7**       | Gruppen-Anker; nach jeder Gruppe „Back to menu“ → `#on-this-page`                  |
| `posts/marine-life-koh-chang/marine-life-whale-shark` (EN/DE/TH)                    | ✅     | **7**       | Themenspezifisch; Inline `#ccc` + `critical-css`                                   |
| `posts/marine-life-koh-chang/marine-life-green-sea-turtle` (EN/DE/TH)               | ✅     | **5**       | Biology → Dive sites; Inline `#ccc` + `critical-css`                               |
| `posts/marine-life-koh-chang/marine-life-titan-triggerfish` (EN/DE/TH)              | ✅     | **6**       | Biology → Gallery; Inline `#ccc` + `critical-css`                                  |
| `posts/marine-life-koh-chang/marine-life-nudibranch` (EN/DE/TH)                     | ✅     | **9**       | What → Why look; Inline `#ccc` + `critical-css`                                    |
| `posts/marine-life-koh-chang/marine-life-blacktip-reef-shark` (EN/DE/TH)            | ✅     | **6**       | Traits → Conclusion; Inline `#ccc` + `critical-css`                                |
| `posts/marine-life-koh-chang/marine-life-batfish` (EN/DE/TH)                        | ✅     | **4**       | Appearance → Conclusion; Inline `#ccc` + `critical-css`                            |
| `posts/marine-life-koh-chang/marine-life-barracuda` (EN/DE/TH)                      | ✅     | **4**       | Species → Conclusion; Inline `#ccc` + `critical-css`                               |
| `posts/scuba-knowledge/boyles-law-scuba-diving` (EN/DE/TH)                          | ✅     | **8**       | Bestehendes Jump behalten; H1+Teaser + `#ccc` Linie                                |
| `posts/scuba-knowledge/dalton-henry-scuba-diving` (EN/DE/TH)                        | ✅     | **8**       | Bestehendes Jump behalten; H1+Teaser + `#ccc` Linie                                |
| `posts/scuba-knowledge/archimedes-principle-scuba-diving` (EN/DE/TH)                | ✅     | **7**       | Bestehendes Jump behalten; H1+Teaser + `#ccc` Linie                                |
| `posts/scuba-knowledge/gas-consumption` (EN/DE/TH)                                  | ✅     | **5**       | Bestehendes Jump behalten; H1+Teaser + `#ccc` Linie                                |
| `posts/scuba-knowledge/nitrox-info` (EN/DE/TH)                                      | ✅     | **7**       | Bestehendes Jump behalten; H1+Teaser + `#ccc`; Gradient-Titel-H2 entfernt          |
| `posts/scuba-knowledge/about-search-recovery` (EN/DE/TH)                            | ✅     | **5**       | Neues Jump (Why→Course); H1+Teaser + `#ccc`; Gradient-Titel-H2 entfernt            |
| `posts/scuba-knowledge/dive-logbook` (EN/DE/TH)                                     | ✅     | **5**       | Neues Jump; H1+Teaser + `#ccc`; EN-Teaser-Placeholder ersetzt; Gradient-H2 weg     |
| `posts/scuba-knowledge/smb-guide` (EN/DE/TH)                                        | ✅     | **6**       | Neues Jump; H1+Teaser + `#ccc`; EN-H1 Tippfehler „urface“ behoben; Gradient-H2 weg |
| `posts/scuba-knowledge/safety-check` (EN/DE/TH)                                     | ✅     | **8**       | Neues Jump (ohne Google Reviews); H1+Teaser + `#ccc`; Gradient-H2 weg              |
| `posts/scuba-knowledge/buddy-system` (EN/DE/TH)                                     | ✅     | **8**       | Jump auf bestehende `info-card` IDs; H1+Teaser + `#ccc`; Inner-H1 entfernt         |
| `posts/scuba-knowledge/safety-stop` (EN/DE/TH)                                      | ✅     | **8**       | Neues Jump (Kernabschnitte); H1+Teaser + `#ccc`; Gradient-H2 weg                   |
| `posts/scuba-knowledge/ndl-no-decompression-limits` (EN/DE/TH)                      | ✅     | **9**       | Bestehendes Jump behalten; H1+Teaser + `#ccc`; Intro-H2 neu (kein Titel-Duplikat)  |
| `posts/scuba-knowledge/using-a-divecomputer` (EN/DE/TH)                             | ✅     | **6**       | Neues Jump; H1+Teaser + `#ccc`; Inner-H1 weg; DE/TH Anker angeglichen              |
| `posts/scuba-knowledge/best-dive-computers` (EN/DE/TH)                              | ✅     | **5**       | Neues Jump; H1+Teaser + `#ccc`; Titel- + Vergleichs-Gradient-H2 normalisiert       |
| `posts/scuba-knowledge/wreck-diving-koh-chang` (EN/DE/TH)                           | ✅     | **7**       | Neues Jump (Wracks → Book); H1+Teaser + `#ccc`; Gradient-H2 weg                    |
| `posts/scuba-knowledge/theory-review` (EN/DE/TH)                                    | ✅     | **6**       | Bestehendes Jump behalten; H1+Teaser + `#ccc`; Gradient-H2 + Inner-H1 weg          |
| `posts/diving-how-to-guides-koh-chang/how-to-try-dive` (EN/DE/TH)                   | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/diving-how-to-guides-koh-chang/how-to-scuba-review` (EN/DE/TH)               | ✅     | **8**       | Bestehende Section-IDs; H1+Teaser + `#ccc`; Intro-H2 ohne Gradient                 |
| `posts/diving-how-to-guides-koh-chang/how-to-fun-dives` (EN/DE/TH)                  | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/diving-how-to-guides-koh-chang/how-to-open-water-course` (EN/DE/TH)          | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 ergänzt                                   |
| `posts/diving-how-to-guides-koh-chang/how-to-open-advanced` (EN/DE/TH)              | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/diving-how-to-guides-koh-chang/how-to-advanced-course` (EN/DE/TH)            | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/diving-how-to-guides-koh-chang/how-to-rescue-diver` (EN/DE/TH)               | ✅     | **8**       | Bestehende IDs; H1+Teaser + `#ccc`; EN-Teaser-Copyfix; Intro ohne Gradient         |
| `posts/diving-how-to-guides-koh-chang/how-to-master-scuba-diver` (EN/DE/TH)         | ✅     | **8**       | Bestehende IDs; H1+Teaser + `#ccc`; Gradient-Titel-H2 entfernt                     |
| `posts/diving-how-to-guides-koh-chang/how-to-specialty-courses` (EN/DE/TH)          | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/diving-how-to-guides-koh-chang/how-to-solo-diver` (EN/DE/TH)                 | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/straight-talk/sustainable-diving` (EN/DE/TH)                                 | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/straight-talk/book-in-advance` (EN/DE/TH)                                    | ✅     | **6**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/straight-talk/dive-boat-safety` (EN/DE/TH)                                   | ✅     | **4**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/straight-talk/dive-professional-training` (EN/DE/TH)                         | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/straight-talk/dive-smart-bonus` (EN/DE/TH)                                   | ✅     | **8**       | Jump zu Quiz-Kategorien A–F + Submit; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt    |
| `posts/straight-talk/diving-myths` (EN/DE/TH)                                       | ✅     | **8**       | Jump zu Kern-Mythen + Fazit; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1      |
| `posts/straight-talk/diving-social-media` (EN/DE/TH)                                | ✅     | **6**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/straight-talk/emergency-plan` (EN/DE/TH)                                     | ✅     | **7**       | Neues Jump (ohne Google Reviews); H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt        |
| `posts/straight-talk/finding-the-right-insurance-as-a-dive-professional` (EN/DE/TH) | ✅     | **7**       | Bestehendes Jump behalten; H1+Teaser normalisiert + `#ccc`; Gradient-H1 weg        |
| `posts/straight-talk/htms-chang-wreck-penetration` (EN/DE/TH)                       | ✅     | **5**       | Bestehendes Jump; H1+Teaser; **`tek-box`** (schwarz/orange wie Deco Procedures)    |
| `posts/straight-talk/ocean-climate` (EN/DE/TH)                                      | ✅     | **6**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/straight-talk/padi-vs-sdi-tdi` (EN/DE/TH)                                    | ✅     | **4**       | Neues Jump; H1+Teaser + `#ccc`; bestehendes Intro-H2 als Anker                     |
| `posts/straight-talk/solo-diver` (EN/DE/TH)                                         | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/straight-talk/tech-diving-koh-chang` (EN/DE/TH)                              | ✅     | **12**      | Bestehendes Jump; H1+Teaser; **`tek-box`** (schwarz/orange wie Deco Procedures)    |
| `posts/straight-talk/technical-diver-stories` (EN/DE/TH)                            | ✅     | **8**       | Jump + H1+Teaser; **`tek-box`** (schwarz/orange wie Deco Procedures); Titel-H2 weg |
| `posts/tips-and-tricks/about-underwater-photography` (EN/DE/TH)                     | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/tips-and-tricks/deep-diving` (EN/DE/TH)                                      | ✅     | **7**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/tips-and-tricks/diving-activities` (EN/DE/TH)                                | ✅     | **8**       | Jump zu Kern-Aktivitäten (H3); H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt           |
| `posts/tips-and-tricks/open-water-duration` (EN/DE/TH)                              | ✅     | **5**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/tips-and-tricks/reel-guideline` (EN/DE/TH)                                   | ✅     | **8**       | Neues Jump inkl. bestehendes `#line-markers`; H1+Teaser + `#ccc`                   |
| `posts/tips-and-tricks/self-inflating-bcd` (EN/DE/TH)                               | ✅     | **7**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/tips-and-tricks/water-in-regulator` (EN/DE/TH)                               | ✅     | **7**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/tips-and-tricks/which-course` (EN/DE/TH)                                     | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/koh-chang-diving-travel-guides/beginner-guide` (EN/DE/TH)                    | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/koh-chang-diving-travel-guides/thailand-diving-comparison` (EN/DE/TH)        | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |
| `posts/koh-chang-diving-travel-guides/travel-guide` (EN/DE/TH)                      | ✅     | **8**       | Neues Jump; H1+Teaser + `#ccc`; Intro-H2 SEO-getrennt vom H1                       |

**Regel:** siehe [Posts (`posts-box`)](#posts-posts-box) weiter unten.

### FAQ-Detailseiten (ohne Jump-Menü)

| Seite                               | Status | Packages-Anker | Hinweis                                                                                              |
| ----------------------------------- | ------ | -------------- | ---------------------------------------------------------------------------------------------------- |
| `faq-diving-koh-chang`              | ✅     | —              | H1+Teaser in `faq-box`; 10 Q&As; Fragen normal, Antworten blau/silber (`faq-list--boxed`); kein Jump |
| `faq-diving-health-safety-thailand` | ✅     | —              | H1+Teaser in `faq-box health`; `faq-list--boxed`; kein Jump                                          |

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

Beispiele: `/day-trips/`, `/courses/`, `/faqs/`, `/posts/`, später `/dive-sites/`, weitere Sub-Hubs …

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

**Hub H1 vs. Intro-H2:** Ein starker SEO-H1 (nah am `<title>`) + Teaser reicht. Kein zweiter Gradient-Titel-H2 mit fast gleichem Wording — Intro-Absatz folgt direkt nach `<hr />`.

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

| Box               | Jump-Nav                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `changdiving-box` | Inline `border-bottom: 1px solid #ccc` (wie globales `hr`)                                                           |
| `posts-box`       | **Inline** `border-bottom: 1px solid #ccc` + gleiche Regel in Page-`critical-css` (async `style.min.css` sonst FOUC) |
| `speciality-box`  | CSS: leichte Grün/Gelb-Fläche (`.speciality-box .page-jump-nav`) – **kein** Inline-Border `#ccc`                     |
| `tek-box`         | CSS: grauer→oranger Verlauf (s. Ausnahme unten) – **kein** Inline-Border `#ccc`                                      |

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

### Blog-Post (`posts-box`)

1. [ ] `.hero-text` aus Hero entfernt
2. [ ] H1 + Teaser nach Breadcrumb, zentriert – **gleicher Markup-Stil wie Kurse**
3. [ ] Redundantes Titel-H2 entfernt (falls vorhanden)
4. [ ] Content in `<div class="posts-box">` (ggf. + `grid-container`)
5. [ ] `page-jump-nav` **individuell** nach Post-Thematik (keine festen 4 Kurs-Labels)
6. [ ] Jump-Bar-Linie sichtbar: Inline `style="border-bottom: 1px solid #ccc"` **und** Regel im Page-`critical-css`
7. [ ] Anker-`id`s an den Ziel-H2s; bei sehr vielen H2s lieber **Gruppen** springen
8. [ ] DE + TH spiegeln; TH Label = **ในหน้านี้**

---

## Posts (`posts-box`)

Blog-Artikel / Guides unter `/posts/…` (nicht die Kategorie-Hubs).

### Header (wie Kurse)

```
<header> … hero picture (kein .hero-text) … </header>
<main>
  posts-submenu
  breadcrumb
  <div class="posts-box">
    h1          (zentriert, wie Kurse)
    p (Teaser)  (zentriert, wie Kurse)
    page-jump-nav   ← Linie = sichtbares „hr“ (#ccc)
    Intro / Abschnitte …
```

Markup für H1 + Teaser (identisch zu Kurs-/Produktseiten):

```html
<h1 style="margin: 20px 0 8px; text-align: center">…</h1>
<p style="margin: 0 0 24px; color: #555; text-align: center">…</p>
```

**Intro-H2 nach dem Jump:** nicht den H1 wiederholen (kein zweiter Seitentitel, kein Gradient-„Hero“-H2). Stattdessen ein echter Abschnitts-H2 wie die übrigen (`Why … matters` / `Warum … zählt`), Anker-`id` für „Intro“ behalten.

### Jump-Menü: individuell je Post

- **Kein** Standard „Intro · Who can join? · What's included · Prices & book“
- Labels und Anker richten sich nach der **Thematik / den Abschnitten** des Posts
- Kurz halten (ca. 4–8 Punkte); bei langen Listen (z. B. Marine-Life-Guide) zu **Gruppen** zusammenfassen
- Anker auf `h2[id]` / `h3[id]` (`scroll-margin` greift über `.posts-box h2[id]` in `style.css`)

### HR unter dem Jump-Menü sichtbar machen

`style.min.css` lädt oft **async** (preload + `onload`) → ohne Absicherung wirkt die Jump-Linie kurz und verschwindet/FOUC.

**Pflicht bei Posts mit Jump-Nav:**

1. Inline am `<nav>` (wie `changdiving-box` / Kurse):

```html
<nav
  class="page-jump-nav"
  aria-label="On this page"
  style="border-bottom: 1px solid #ccc"
></nav>
```

2. Dieselbe Regel zusätzlich im Page-`<style id="critical-css">`:

```css
.posts-box .page-jump-nav {
  margin: 0 0 2px;
  padding: 2px 8px 4px;
  border-bottom: 1px solid #ccc; /* wie globales hr */
}
```

Farbe `#ccc` = normales `<hr>` (`style.css`). Kein extra `<hr />` direkt unter der Jump-Nav nötig – die Border ersetzt die Linie.

### Lange Guides: „Back to menu“

Bei sehr langen Posts (z. B. `marine-life` Artengalerie): nach **jeder Jump-Gruppe** einen Link zurück zum Menü.

```html
<nav id="on-this-page" class="page-jump-nav" …>…</nav>
…
<p
  class="back-to-menu"
  style="text-align: center; margin: 1.25rem 0 0.35rem; font-size: 0.95rem"
>
  <a href="#on-this-page">↑ Back to menu</a>
  <!-- DE: Zum Menü · TH: กลับเมนู -->
</p>
```

- Jump-Nav braucht `id="on-this-page"` (+ `scroll-margin-top` in `critical-css`)
- Nicht nach jedem Unter-H2, nur nach den Jump-Gruppen

### Abgrenzung: Post-Hubs vs. Posts

| Typ                         | Beispiel                                   | Jump-Menü                            |
| --------------------------- | ------------------------------------------ | ------------------------------------ |
| Kategorie-Hub               | `/posts/`, `/posts/marine-life-koh-chang/` | **nie** – nur H1 + Teaser + `<hr />` |
| Einzelner Blog-Post / Guide | `/posts/.../marine-life/`                  | **ja**, themenspezifisch             |

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

### Beispiel: Marine Life Guide (`posts/.../marine-life/`) – 7 Gruppen-Jumps

Referenz für themenspezifisches Jump-Menü (Posts-Regeln oben). Lange Artengalerie (~43 H2s) → nur **Gruppen**, Anker am ersten H2. Jump-Linie: Inline `#ccc` + `critical-css`.

| #   | EN               | DE                   | TH                      | Anker             |
| --- | ---------------- | -------------------- | ----------------------- | ----------------- |
| 1   | Marine Mammals   | Meeressäuger         | สัตว์เลี้ยงลูกด้วยนม    | `#marine-mammals` |
| 2   | Sharks & Rays    | Haie & Rochen        | ฉลามและกระเบน           | `#sharks-rays`    |
| 3   | Coastal & Jacks  | Küstenfische & Jacks | ปลาชายฝั่ง & Jacks      | `#coastal-jacks`  |
| 4   | Reef Fishes      | Riffische            | ปลาแนวปะการัง           | `#reef-fishes`    |
| 5   | Reptiles         | Reptilien            | สัตว์เลื้อยคลาน         | `#reptiles`       |
| 6   | Invertebrates    | Wirbellose           | สัตว์ไม่มีกระดูกสันหลัง | `#invertebrates`  |
| 7   | Corals & Sponges | Korallen & Schwämme  | ปะการัง & ฟองน้ำ        | `#corals-sponges` |

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

**Kategorie-Hubs** (H1 + Teaser, **ohne** Jump-Menü):  
`/dive-sites/` – gleiches Header-Muster wie die Post-Hubs (H1 + Teaser, ohne Jump-Menü).

**Blog-Posts** (`posts-box`, H1 + Teaser wie Kurse, Jump individuell, Jump-Linie `#ccc`):  
weitere Artikel unter `/posts/…` nach dem Muster von `marine-life` / bestehenden Knowledge-Posts.

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
