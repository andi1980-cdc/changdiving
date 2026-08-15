# Page Header + Jump Menu Pattern

**Role:** `living`  
**Stand:** August 2026  

Page-type catalog + clone workflow: [`PAGE-TYPES.md`](PAGE-TYPES.md)  
Mobile LCP/CLS: [`MOBILE-PERF-GOLD-PATTERN.md`](MOBILE-PERF-GOLD-PATTERN.md)  
Archived H1-in-hero notes: [`archive/HERO-TRANSACTIONAL-PATTERN.md`](archive/HERO-TRANSACTIONAL-PATTERN.md)

This doc is the **detail** layer (jump labels, markup, exceptions, checklists). Rollout is **done** site-wide (hubs, money pages, dive sites, posts); do not treat old status tables as open work.

| Seitentyp | H1 + Teaser unter Hero | Jump-Menü |
| --------- | ---------------------- | --------- |
| **Produkt-/Buchungsseiten** | ja | ja (4 Punkte) |
| **Kategorie-/Hub-Seiten** | ja | **nie** |
| **Blog-Posts (`posts-box`)** | ja (wie Kurse) | **ja, individuell** |
| **Preisliste `/prices/`** | ja | **ja (7 Punkte, Ausnahme)** |
| **Tech-Produktseiten (`tek-box`)** | ja | ja (4 Punkte, **Jump-Bar-Ausnahme**) |
| **Dive sites (`dive-site-box`)** | ja | ja (max. **4**) |
| **FAQ-Detail (`faq-box`)** | ja | **nie** |

---

## Ziel

| Vorher | Nachher |
| ------ | ------- |
| H1 + Teaser als Overlay auf dem Hero-Bild | Hero = nur Bild |
| Extra `<h2>` unter Banner (oft redundant) | H1 ist die einzige Hauptüberschrift |
| Jump-Menü unterschiedlich | Produktseiten: 4 Punkte; **Kategorien: keines** |

---

## Kategorie-/Hub-Seiten (ohne Jump-Menü)

```
<header> … hero picture (kein .hero-text) … </header>
<main>
  submenu (optional)
  breadcrumb
  h1          (zentriert)
  p (Teaser)  (zentriert)
  <hr />
  Intro / Hub-Copy + Produktkarten
  <hr />
  Trustindex-Reviews   ← vor „Dive Deeper“ / Guides-Block
  <hr />
  Dive Deeper / Beyond the Course (Guides, Tips, FAQs + Karten)
```

**Hub H1 vs. Intro-H2:** Starker SEO-H1 (nah am `<title>`) + Teaser. Kein zweiter Gradient-Titel-H2 mit fast gleichem Wording.

**Reviews:** Trustindex **immer vor** dem Guides-/FAQ-Abschnitt.

---

## Zielstruktur Produktseite (mit Jump-Menü)

```
<header> … hero picture (kein .hero-text) … </header>
<main>
  posts-submenu (optional)
  <div class="changdiving-box">   ← oder speciality-box / tek-box
    breadcrumb
    h1 + teaser (zentriert)
    page-jump-nav
    banner-img (optional)
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

---

## 2. H1 + Teaser nach Breadcrumb

```html
<h1 style="margin: 20px 0 8px; text-align: center">…</h1>
<p style="margin: 0 0 24px; color: #555; text-align: center">…</p>
```

- H1 ≈ Keywords wie `<title>`, **ohne** `| Chang Diving`
- Teaser = 1–2 Sätze; beide **zentriert**
- Hero-`alt` keyword-stark halten

---

## 3. Redundantes H2 entfernen

Zweites Headline-H2, das den Seitentitel wiederholt (z. B. `headline-blue`), **entfernen**. SEO-Fließtext darunter bleibt.

---

## 4. Jump-Menü – Standard (Touren / Kurse)

| # | EN | DE | TH | Typischer Anker |
| - | -- | -- | -- | --------------- |
| 1 | Intro | Intro | **บทนำ** | `#intro` |
| 2 | Who can join? | Wer kann mit? | ใครเข้าร่วมได้? | `#who-can-join` |
| 3 | What's included | Was ist inklusive | สิ่งที่รวมอยู่ | `#whats-included` |
| 4 | Prices & book | Preise & buchen | ราคาและจอง | seiten-spezifisch |

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

Typische Book-Anker (Beispiele): `#dive-packages`, `#try-dive-options`, `#owd-packages`, `#aowd-packages`, `#combo-packages`, `#book-insurance`, `#book-gopro`, …

---

## 5. Linienfarbe / Jump-Bar-Look

| Box | Jump-Nav |
| --- | -------- |
| `changdiving-box` | Inline `border-bottom: 1px solid #ccc` |
| `posts-box` / `dive-site-box` | Inline `#ccc` **+** gleiche Regel in Page-`critical-css` |
| `speciality-box` | CSS Grün/Gelb – **kein** Inline-`#ccc` |
| `tek-box` | CSS grau→orange – **kein** Inline-`#ccc` |

- **Kein** `<hr>` zwischen Jump-Nav und Banner
- `<hr />` unter dem Banner vor Intro ist ok

---

## Checkliste

### Produkt-/Buchungsseite

1. [ ] `.hero-text` aus Hero entfernt
2. [ ] H1 + Teaser nach Breadcrumb, zentriert
3. [ ] Redundantes Intro-/Titel-H2 entfernt
4. [ ] Jump-Menü 4 Punkte (Standard **oder** Produkt-Ausnahme)
5. [ ] `id="intro"` gesetzt
6. [ ] Jump-Bar: `#ccc` **oder** Box-Ausnahme; kein doppeltes `<hr>` über dem Banner
7. [ ] Packages-/Book-Anker stimmt
8. [ ] DE + TH spiegeln; TH Intro-Label = **บทนำ**
9. [ ] Bildpfade prüfen
10. [ ] Tech-Seiten: `tek-box` + CTA-/Jump-Verlauf (s. Ausnahme)

### Kategorie-/Hub-Seite

1. [ ] `.hero-text` entfernt; H1 + Teaser; `<hr />` nach Teaser
2. [ ] **Kein** `page-jump-nav`
3. [ ] Trustindex **vor** Dive Deeper / Guides
4. [ ] DE + TH spiegeln

### Blog-Post (`posts-box`)

1. [ ] H1 + Teaser wie Kurse; Content in `posts-box`
2. [ ] Jump **individuell** (nicht Kurs-4er); Inline `#ccc` + `critical-css`
3. [ ] Anker an Ziel-H2/H3; lange Guides → Gruppen + optional „Back to menu“
4. [ ] DE + TH spiegeln; TH Label = **ในหน้านี้**

---

## Posts (`posts-box`)

```
<header> … hero picture … </header>
<main>
  posts-submenu
  breadcrumb
  <div class="posts-box">
    h1 + teaser
    page-jump-nav   ← Linie = sichtbares „hr“ (#ccc)
    Intro / Abschnitte …
```

**Intro-H2 nach dem Jump:** nicht den H1 wiederholen. Abschnitts-H2 mit Anker-`id`.

### Jump individuell

- Kein Standard „Intro · Who can join? · What's included · Prices & book“
- Ca. 4–8 Punkte; bei langen Listen **Gruppen**
- Anker auf `h2[id]` / `h3[id]`

### Critical CSS für Jump-Linie

```css
.posts-box .page-jump-nav {
  margin: 0 0 2px;
  padding: 2px 8px 4px;
  border-bottom: 1px solid #ccc;
}
```

### Lange Guides: „Back to menu“

```html
<nav id="on-this-page" class="page-jump-nav" …>…</nav>
…
<p class="back-to-menu" style="text-align: center; margin: 1.25rem 0 0.35rem; font-size: 0.95rem">
  <a href="#on-this-page">↑ Back to menu</a>
  <!-- DE: Zum Menü · TH: กลับเมนู -->
</p>
```

| Typ | Beispiel | Jump |
| --- | -------- | ---- |
| Kategorie-Hub | `/posts/`, `/posts/marine-life-koh-chang/` | **nie** |
| Einzelner Post | `/posts/.../marine-life/` | **ja**, themenspezifisch |

---

## Produkt-Ausnahmen (Labels)

### Insurance (`/day-trips/insurance/`)

| EN | DE | TH |
| -- | -- | -- |
| Intro | Intro | บทนำ |
| Benefits | Vorteile | ประโยชน์ |
| Coverage | Deckung | ความคุ้มครอง |
| Prices & book | Preise & buchen | ราคาและจอง |

Anker: `#intro`, `#who-can-join`, `#whats-included`, `#book-insurance`

### GoPro Rental (`/day-trips/rent-gopro/`)

| EN | DE | TH |
| -- | -- | -- |
| Intro | Intro | บทนำ |
| What's included | Inklusive | สิ่งที่รวมอยู่ |
| What you'll see | Was du siehst | สิ่งที่คุณจะเห็น |
| Prices & book | Preise & buchen | ราคาและจอง |

Anker: `#intro`, `#whats-included`, `#what-youll-see`, `#book-gopro`

### Prices (`/prices/`) – 7 Jump-Punkte

| # | EN | DE | TH | Anker |
| - | -- | -- | -- | ----- |
| 1 | What's Included? | Was ist enthalten? | สิ่งที่รวมอยู่ | `#whats-included` |
| 2 | Day Trips | Tagestouren | ทริปวันเดียว | `#prices-day-trips` |
| 3 | Beginner | Anfänger | มือใหม่ | `#prices-beginner` |
| 4 | Advanced | Fortgeschritten | ขั้นสูง | `#prices-advanced` |
| 5 | Pros | Pros | มืออาชีพ | `#prices-pros` |
| 6 | Specialty | Specialty | พิเศษ | `#prices-specialty` |
| 7 | Tec | Tec | เทค | `#prices-tec` |

### Technical Diving (`tek-box`)

Tech-Produktseiten: **`<div class="tek-box">`**. Jump-Labels = Standard (4).

Jump-Bar / Book-CTA: Verlauf in `style.css` (`.tek-box .page-jump-nav`) — grau→orange, helles Label; **kein** Inline-`#ccc`. Denselben Block im Page-`critical-css` halten.

```css
main:has(> .tek-box) > .posts-submenu a {
  background: linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 45%, #ff8a5c 100%);
}
```

**Referenz:** `/courses/intro-to-tech/` (EN/DE/TH).

---

## Day-Trip-Hinweise (Referenz)

| Seite | Besonderheit |
| ----- | ------------ |
| **fun-dives** | Referenz Money-Page; `#dive-packages` |
| **try-dive** | `#intro` oft am Video-Block; DE: `#who-can-join` |
| **scuba-review** | Banner + Playlist; TH-Bilder unter `/img/products/scuba_review/` |
| **snorkeling** | `#book-snorkeling` |
| **insurance** / **rent-gopro** | Label-Ausnahmen oben |

TH Jump-Intro-Label immer **บทนำ**, nie englisches „Intro“.
