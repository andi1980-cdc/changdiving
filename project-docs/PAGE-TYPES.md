# Page types – HTML structure catalog

**Role:** `living`  
**Stand:** August 2026

Canonical map of **page types** on changdiving.com. Use this when creating or heavily editing a page.

**Do not** invent a parallel layout. **Do not** build a full page only from this file (head/menu/hreflang/critical CSS are too easy to get wrong).

### Workflow for a new page

1. Pick the type below.
2. **Clone** the reference URL (same language first, then mirror DE/TH).
3. Apply block order + box class + jump rules from this doc.
4. Details (Jump markup, exceptions, checklists) → [`PAGE-HEADER-JUMP-MENU-PATTERN.md`](PAGE-HEADER-JUMP-MENU-PATTERN.md).
5. Hero LCP/CLS → [`MOBILE-PERF-GOLD-PATTERN.md`](MOBILE-PERF-GOLD-PATTERN.md).
6. Schema → [`SEO-REFERENCE.md`](SEO-REFERENCE.md).
7. Footer → run [`FOOTER-SYNC.md`](FOOTER-SYNC.md) if needed (or leave existing footer and re-sync).

---

## Type overview

| Type                                   | Box / wrapper                                      | H1 + teaser under hero | Jump menu             | Schema (see SEO-REFERENCE)                                  |
| -------------------------------------- | -------------------------------------------------- | ---------------------- | --------------------- | ----------------------------------------------------------- |
| **Hub**                                | usually none (`grid-container`)                    | yes                    | **never**             | LocalBusiness + Breadcrumb (typical)                        |
| **Money / product**                    | `changdiving-box` or `speciality-box` or `tek-box` | yes                    | **yes (4)**           | LocalBusiness, Course/Service as applicable, FAQ if present |
| **Prices**                             | special hub-like page                              | yes                    | **yes (7)** exception | LocalBusiness + FAQPage + rating                            |
| **Dive site**                          | `dive-site-box`                                    | yes                    | **yes (max 4)**       | LocalBusiness + Breadcrumb                                  |
| **Post**                               | `posts-box` (rare: `tek-box`)                      | yes                    | **yes, thematic**     | BlogPosting + Breadcrumb (no aggregateRating)               |
| **FAQ detail**                         | `faq-box`                                          | yes                    | **never**             | FAQPage + LocalBusiness typical                             |
| **Language home** `/en/` `/de/` `/th/` | —                                                  | homepage pattern       | no                    | LocalBusiness + Course list                                 |

Hard rule (SEO text fixes): change **meta + copy inside existing blocks only**, unless the user explicitly allows structural change.

---

## Shared chrome (all content pages)

```
<header>
  hero (picture only — no .hero-text overlay)
  logo + main menu
</header>
<main id="main-content">
  optional submenu (posts-submenu / course-submenu)
  …
</main>
<footer id="footer"> … synced via scripts/sync-footer.py … </footer>
```

- Hero classes on transactional/sales pages: `hero hero--transactional` or `hero hero--fun-dives` (same mobile CSS). Homepage also uses `hero--transactional`.
- Money titles: **What · Where · Duration/outcome · Price** (see Money section below). Align `<title>` / H1 / hero `alt` / OG titles / JSON-LD `name` (H1 **without** `| Chang Diving` brand pipe).
- Empty breadcrumb: `<nav id="breadcrumb" class="breadcrumb"></nav>` (filled by `global.js`).
- Trustindex reviews on hubs/sales: **before** “Dive Deeper” / guides blocks.

---

## 1. Hub

**Examples:** `/courses/`, `/day-trips/`, `/dive-sites/`, `/posts/`, `/faqs/`, subcategory hubs (`/posts/scuba-knowledge/`, `/courses/specialty/`, …).

**Reference:** [`/en/courses/`](https://changdiving.com/en/courses/) · repo `en/courses/index.html`

```
<header> hero picture </header>
<main>
  submenu (optional)
  breadcrumb
  h1 (centered)
  p teaser (centered)
  <hr />
  intro / cards / section banners
  <hr />
  Trustindex reviews
  <hr />
  Dive Deeper / guides / FAQ cards
</main>
<footer>
```

- **No** `page-jump-nav`.
- No second gradient H2 that repeats the H1.

---

## 2. Money / product (day trip or course)

**Examples:** Fun Dives, Try Dive, Open Water, specialties, tech courses.

**Reference (day trip):** [`/en/day-trips/fun-dives/`](https://changdiving.com/en/day-trips/fun-dives/) · `en/day-trips/fun-dives/index.html`  
**Reference (course title formula):** [`/en/courses/open-water-diver/`](https://changdiving.com/en/courses/open-water-diver/)  
**Reference (tech):** [`/en/courses/intro-to-tech/`](https://changdiving.com/en/courses/intro-to-tech/) · `tek-box`

### Title / H1 formula (required for money pages)

For **`/day-trips/…`** and **`/courses/…`** product pages, `<title>` and `<h1>` (and matching OG/Twitter/`alt`/JSON-LD `name`) follow:

**What · Where · Duration (or outcome) · Price**

| Slot                   | Meaning                | Examples                                                                        |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| **What**               | Activity / course name | Open Water Diver, Try Dive, Fun Dives, Schnuppertauchen, ลองดำน้ำ               |
| **Where**              | Always local           | `Koh Chang` / `เกาะช้าง` (in TH often fused: `ลองดำน้ำเกาะช้าง`)                |
| **Duration / outcome** | Time or clear result   | `Get certified in 3 days`, `1 day`, `First Scuba Dive, 1 day, no certification` |
| **Price**              | From-price, factual    | `from 14,490 THB` / `ab 4.890 THB` / `เริ่ม 4,890 บาท`                          |

**Pattern (EN):**

```text
{What} Koh Chang – {duration or outcome} - from {price} THB | Chang Diving
```

**Examples:**

| Page     | Title (without brand pipe on H1)                                                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Course   | `Open Water Diver Koh Chang – Get certified in 3 days - from 14,490 THB`                                                                                              |
| Day trip | `Try Dive Koh Chang – First Scuba Dive, 1 day, no certification - from 4,890 THB`                                                                                     |
| Day trip | `Fun Dives Koh Chang – Guided boat dives from 3,290 THB` (duration optional if “from” price + activity is clear; prefer adding duration when it’s a fixed 1-day trip) |

**Rules:**

- H1 = same as title **without** `| Chang Diving` / `| ช้างไดฟ์วิ่ง`
- OG/Twitter title = full title **with** brand pipe
- JSON-LD `name` / `description` stay aligned with the same facts
- DE: What in natural German where that’s the search term (`Schnuppertauchen Koh Chang – …`); product nickname “Try Dive” may appear in body
- TH: What+Where per [`GLOSSARY-EN-TH.md`](GLOSSARY-EN-TH.md) §18 (`ลองดำน้ำเกาะช้าง`, `ฟันไดฟ์`, …)
- Don’t invent fake durations or prices; keep “from/ab/เริ่ม” when options vary
- Hubs (`/courses/`, `/day-trips/`) are **not** money titles — normal hub H1/teaser

```
<header> hero (hero--fun-dives | hero--transactional) </header>
<main>
  posts-submenu (optional)
  <div class="changdiving-box">   ← or speciality-box / tek-box
    breadcrumb
    h1 + teaser (centered)
    page-jump-nav (4 links)
    optional banner image
    <hr />   (under banner OK; not between jump and banner)
    #intro …
    #who-can-join …
    #whats-included …
    #…-packages / book CTA
    reviews / related (as on reference)
  </div>
</main>
<footer>
```

**Standard jump (EN / DE / TH):** Intro · Who can join? · What's included · Prices & book  
TH Intro label = **บทนำ**. Book anchor is page-specific (`#dive-packages`, `#owd-packages`, …).

**Box choice:** recreational day-trip/course → `changdiving-box`; many specialties → `speciality-box`; TDI/tech products → `tek-box` (jump bar + CTA orange/grey — see PAGE-HEADER exceptions).

**Label exceptions:** insurance, GoPro, `/prices/` — see PAGE-HEADER.

---

## 3. Prices (`/prices/`)

**Reference:** `en/prices/index.html`

- H1 + teaser + **7-point** jump (What's included + table sections).
- Not a pure hub; treat as special money page.
- Schema: LocalBusiness + FAQPage + aggregateRating (Google 4.8 / 171).

---

## 4. Dive site

**Reference:** [`/en/dive-sites/htms-chang-wreck/`](https://changdiving.com/en/dive-sites/htms-chang-wreck/) · `dive-site-box`

```
<header> hero </header>
<main>
  submenu (optional)
  breadcrumb
  <div class="dive-site-box">
    h1 + teaser
    page-jump-nav (max 4; thematic: Intro · Overview · Level · Briefing, etc.)
    content + gallery …
  </div>
</main>
<footer>
```

Jump bar: inline `#ccc` + critical CSS (same idea as posts).

---

## 5. Post (article / guide)

**Reference:** [`/en/posts/scuba-knowledge/safety-stop/`](https://changdiving.com/en/posts/scuba-knowledge/safety-stop/) · `posts-box`  
Long thematic jump: `posts/marine-life-koh-chang/marine-life/`  
Tech tone posts may use `tek-box` (e.g. some straight-talk tech pieces).

```
<header> hero </header>
<main>
  posts-submenu
  breadcrumb
  <div class="posts-box">
    h1 + teaser (same markup as courses)
    page-jump-nav (thematic, ~4–8; groups on long guides)
    sections with h2/h3 ids
    optional cdc-post-footer
  </div>
</main>
<footer>
```

- Post **hubs** (`/posts/`, `/posts/scuba-knowledge/`) = Hub type (no jump).
- Jump line: inline `border-bottom: 1px solid #ccc` **and** rule in page `critical-css`.
- Long guides: “Back to menu” → `#on-this-page` after jump groups.

---

## 6. FAQ detail

**Reference:** `en/faqs/faq-diving-koh-chang/index.html` · `faq-box` + `faq-list--boxed`  
(Also: `faq-try-dive-fun-dives-koh-chang/` — same header pattern.)

```
<header> hero picture only (no .hero-text) </header>
<main>
  submenu / breadcrumb
  <div class="faq-box">
    h1 + teaser (centered, like courses)
    <hr />
    Q&A list (faq-list faq-list--boxed)
  </div>
</main>
<footer>
```

- **No** jump menu.
- Do **not** put H1 in a hero overlay; do **not** use a gradient title-H2 that repeats the H1.
- FAQ **hub** `/faqs/` = Hub type.

---

## Hero modifiers (from former transactional-hero notes)

| Class                      | Use                                         |
| -------------------------- | ------------------------------------------- |
| `hero hero--fun-dives`     | Fun Dives (and shared mobile rules)         |
| `hero hero--transactional` | Other bookable/sales pages + many hubs/home |

Mobile (≤767): shared rules in `style.css` / `style.min.css` — do not hide H1 with one-off page CSS that fights the pattern.

---

## After structural or title/description changes

- Regenerate `search-index.json` → `python3 scripts/generate-search-index.py` (see `claude.md`)
- Regenerate sitemap if URL set changed → [`README_SITEMAP.md`](README_SITEMAP.md)
- Prettier on touched HTML; commit only when asked
