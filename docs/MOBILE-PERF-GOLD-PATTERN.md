# Mobile Performance Gold Pattern

Stand: Juli 2026  
**Referenzseite:** `/en/` (beste Mobile- + Desktop-Messwerte im Projekt)  
Verwandt: `docs/PAGE-HEADER-JUMP-MENU-PATTERN.md`, `HERO-TRANSACTIONAL-PATTERN.md`

**Jede neue oder geänderte Seite mit Hero muss diesem Muster folgen.** Desktop ist meist schon gut — Mobile (Slow-4G) ist der Maßstab.

Hubs (`/courses/`, `/day-trips/`, `/dive-sites/`, …) sollen dem **gleichen Head-/Hero-Stack** wie `/en/` folgen und zusätzlich **Kartenbilder lazy** laden — sonst verlieren sie Bandbreite an Dutzende Eager-Tiles und kommen nicht an die Homepage-Werte ran.

---

## Zielwerte (PageSpeed Insights, Mobile)

| Metrik | Ziel | Hinweis |
| ------ | ---- | ------- |
| Performance | ≥ 95 | 90+ reicht, 99 ist erreichbar |
| LCP | ≤ 2.5s | Ideal ≈ 2.0s |
| CLS | ≤ 0.05 | Ideal ≈ 0.025 |
| TBT | ≈ 0 ms | `global.js` immer mit `defer` |

Lab-Scores schwanken (±5–10). Maßgeblich: Trend + CrUX-Felddaten, nicht ein einzelner PSI-Lauf.

---

## 1. Head-Reihenfolge (kritisch für LCP)

Genau in dieser Logik (Details dürfen dazwischen stehen, Priorität nicht umkehren):

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- 1) LCP-Bild SOFORT — vor Fonts, CSS, JS -->
<link
  rel="preload"
  as="image"
  fetchpriority="high"
  href="/img/.../..._small.webp"
/>

<title>...</title>
<!-- meta, canonical, hreflang, OG, favicon … -->

<!-- 2) Fonts async (Critical CSS nutzt schon System-Stack) -->
<link rel="preload" href="/fonts/fonts.css" as="style" />
<link
  rel="stylesheet"
  href="/fonts/fonts.css"
  media="print"
  onload="this.media='all'"
/>
<noscript><link rel="stylesheet" href="/fonts/fonts.css" /></noscript>

<!-- 3) Critical CSS inline -->
<style id="critical-css">…</style>

<!-- 4) Full CSS async -->
<link
  rel="preload"
  href="/style.min.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="/style.min.css" /></noscript>
```

Am Seitenende:

```html
<script src="/js/global.js" defer></script>
```

### Verboten / vermeiden

| Nicht tun | Warum |
| --------- | ----- |
| `<link rel="preload" href="/js/global.js" as="script">` früh im Head | Stehlt auf Slow-4G Bandbreite vom LCP-Bild |
| `global.js` **ohne** `defer` | Blockiert Parser, schadet LCP/TBT |
| Sync `fonts.css` als render-blocking Stylesheet | Verzögert First Paint (Fonts haben `font-display: optional`) |
| Hero-Preload **nach** großem Critical-CSS / JSON-LD | Browser entdeckt LCP zu spät |
| `imagesrcset` mit `_small` **und** `_big` im Preload | Retina-Mobile lädt oft `_big` vor |
| Karten-/Tile-Bilder **ohne** `loading="lazy"` | Konkurrenz zum LCP (Hauptgrund warum Hubs hinter `/en/` liegen) |

---

## 2. Hero-Bilder: Mobile klein, Desktop groß

### Dateien

- Mobile: `…_small.webp` (typisch ~10–25 KB, ~600×400)
- Desktop: `…_big.webp` oder `…_header.webp` (große Variante)
- Umbenennen einer bestehenden URL → **301** in `functions/[[path]].js` (`REDIRECTS_EXACT_RAW`)

### Markup

```html
<picture style="aspect-ratio: 3 / 2">
  <source
    media="(min-width: 768px)"
    srcset="/img/.../..._big.webp"
    width="2580"
    height="1460"
    type="image/webp"
  />
  <source
    media="(max-width: 767px)"
    srcset="/img/.../..._small.webp"
    width="600"
    height="400"
    type="image/webp"
  />
  <img
    class="hero-header-img"
    src="/img/.../..._small.webp"
    alt="…"
    width="600"
    height="400"
    loading="eager"
    fetchpriority="high"
  />
</picture>
```

### Preload = immer nur `_small`

```html
<link
  rel="preload"
  as="image"
  fetchpriority="high"
  href="/img/.../..._small.webp"
/>
```

Desktop lädt `_big` zusätzlich über `<picture>` — Absicht. So vermeiden wir, dass Mobile Retina das große Bild vorlädt.

---

## 3. Hub-Karten & Content-Bilder (Lazy)

**Eager nur:** Logo + LCP-Hero (`fetchpriority="high"`).

**Alles andere** (Course-Cards, Dive-Site-Tiles, Day-Trip-Cards, Post-Teaser, WhatsApp-Badge, Banner unter dem Fold):

```html
<img
  src="/img/.../card.webp"
  alt="…"
  width="600"
  height="400"
  loading="lazy"
/>
```

Ohne Lazy laden Hubs wie `/en/courses/` 30+ Bilder sofort (~800 KB+) und verlieren gegen die schlanke `/en/`-Homepage — trotz gleichem Hero-/Head-Stack.

---

## 4. Critical CSS: kein Layout-Sprung

### A) Mobile Hero (CLS ~0.3 wenn fehlend)

Ohne diesen Block: First Paint mit `height: 75vh`, danach Collapse auf 3:2 → großer CLS.

```css
@media (max-width: 767px) {
  .hero {
    height: auto;
    min-height: unset;
  }
  .hero picture,
  .hero-header-img {
    position: relative;
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 2;
    object-fit: cover;
  }
}
```

### B) Content-H1 (CLS ~0.1 wenn fehlend)

Content-H1 unter dem Hero (siehe Jump-Menu-Pattern) braucht **dieselben** Maße wie in `style.css`, sonst springt die H1 wenn `style.min.css` lädt.

```css
.grid-container h1 {
  font-size: 2.6rem;
  font-weight: 800;
  margin-top: 2.2em;
  margin-bottom: 1.1em;
  color: #0077b6;
  letter-spacing: 0.01em;
  line-height: 1.15;
  text-align: center;
}
@media (max-width: 700px) {
  .grid-container h1 {
    font-size: 2rem;
    margin-top: 1.5em;
    margin-bottom: 0.8em;
  }
}
```

Kein konfliktierendes Inline-`style="margin: 20px 0 8px"` an der H1.

### C) Submenu + Breadcrumb (wenn vorhanden)

Reserviert Höhe bevor Full-CSS / JS greifen:

```css
.course-submenu { /* flex, padding, gap — wie style.css */ }
.course-submenu a { /* pill styles */ }
.breadcrumb {
  font-size: 0.9em;
  margin: 20px 0 20px 20px;
  color: #555;
  min-height: 1.35em; /* Platz bevor global.js füllt */
}
```

Critical CSS sollte außerdem `.grid-container`, `.grid-container h2`, `.grid-container p` und die Basis-Hero-Regeln enthalten (wie auf bestehenden Hub-Seiten).

### D) Kurs-/Day-Trip-Boxen (`.changdiving-box` / `.speciality-box` / `.tek-box`)

Gilt für **Kurs- und Day-Trip-Produktseiten** (z. B. `/en/courses/nitrox-diver/`, `/en/day-trips/fun-dives/`).

Critical muss **alle drei** Box-Klassen kennen (nicht nur `.changdiving-box`). Mobile-Padding **zuletzt** im Critical-Block, sonst überschreibt Desktop-`padding: 40px` das Mobile-Layout:

```css
.changdiving-box,
.speciality-box,
.tek-box {
  max-width: 1320px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  /* … weitere Layout-Props wie in style.css … */
}
.changdiving-box > h1,
.speciality-box > h1,
.tek-box > h1 {
  margin-top: 1.2em;
  margin-bottom: 0.5em;
  font-weight: 700;
  line-height: 1.15;
  color: #0077b6;
}
/* MUST be last in critical-css */
@media (max-width: 700px) {
  .changdiving-box,
  .speciality-box,
  .tek-box {
    padding: 6vw 2vw;
    border-radius: 4vw;
    max-width: 99vw;
    margin-bottom: 32px;
    margin-left: 10px;
    margin-right: 10px;
  }
}
```

### E) YouTube-Platzhalter in der Box (verifiziert Juli 2026)

**Symptom:** PSI meldet CLS auf `.speciality-box` / `.changdiving-box` / `.tek-box` (~0.15), obwohl Jump-Nav, Submenu und Breadcrumb auf anderen Seiten unauffällig sind.

**Ursache:** Viele Kursseiten haben früh in der Box `.video-responsive`-Divs (nur Thumbnail-Background + Play-Button). Ohne Critical-CSS ist die Höhe ~0; erst `style.min.css` setzt `aspect-ratio: 16 / 9` → die Box wächst stark. Day-Trip-Seiten ohne diese Videos sind davon nicht betroffen.

**Fix (funktioniert):** dieselben Regeln wie in `style.css` ins Page-`critical-css` — inkl. Mobile-Stack. Referenz: `/en/courses/nitrox-diver/` (CLS ~0.15 → ~0.03, Performance 99).

```css
.video-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}
.video-responsive {
  flex: 1 1 calc(50% - 24px);
  max-width: calc(50% - 24px);
  min-width: 260px;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
/* Single video (Try Dive): do not stay at 50% max-width */
.video-flex .video-responsive:only-child {
  flex: 1 1 100%;
  max-width: 100%;
  min-width: 0;
  width: 100%;
}
@media (max-width: 700px) {
  .video-flex {
    flex-direction: column;
    gap: 16px;
  }
  .video-responsive {
    max-width: 100%;
    flex: 1 1 100%;
    min-width: 0;
    width: 100%;
    aspect-ratio: 16 / 9;
  }
}
```

**Regel:** Jede neue Kurs-/Produktseite mit `.video-responsive` in der Content-Box braucht diesen Block im Critical CSS. Jump-Nav/Breadcrumb zuerst verdächtigen lohnt sich hier meist nicht.

**Zwei Videos (Kurse):** `display: flex` + `aspect-ratio: 16 / 9` reicht (Referenz Nitrox / Open Water).

### E2) Einzelnes ATF-Video — Try Dive (verifiziert Juli 2026)

**Symptom:** `/day-trips/try-dive/` — trotz 4D + 4E + voller Breite (`:only-child` / `video-flex--single`) bleibt CLS ≈ **0.15** auf `.changdiving-box`. Fun Dives (Banner/D2) und Kurse (2 Videos/4E) sind ok. Font-Swap war Nebenbefund; nach Font-Preload blieb die Box bei ~0.15.

**Ursache:** Ein einziges `.video-responsive` mit `display: flex` + in-flow `.lty-playbtn` (Play-Button erst in `style.min.css` absolut). Die `aspect-ratio`-Höhe kollabiert bis Full-CSS → Box wächst stark. Bei **zwei** Videos (Kurse) tritt das nicht auf.

**Fix (funktioniert):** Klasse `video-flex--single`, Video als **`display: block`** (nicht flex), Play-Button absolut schon im Critical, optional Inline-`aspect-ratio: 16 / 9`. Zusätzlich ATF-`hr` + `.page-jump-nav` wie in `style.css`. Referenz: `/en/day-trips/try-dive/` — **CLS 0**, Performance **98**.

```css
.video-flex--single {
  display: block;
  width: 100%;
}
.video-flex--single .video-responsive {
  display: block; /* nicht flex — sonst kollabiert aspect-ratio bei einem Kind */
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}
.video-flex--single .lty-playbtn {
  width: 70px;
  height: 46px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* … rest like style.css … */
}
/* ATF hr + jump-nav margins/padding match style.css */
```

**HTML:**

```html
<div id="intro" class="video-flex video-flex--single">
  <div
    class="video-responsive"
    style="aspect-ratio: 16 / 9; width: 100%; max-width: 100%; …"
  >
    <div class="lty-playbtn"></div>
  </div>
</div>
```

**Nicht tun:** Breadcrumb serverseitig hardcoden — üblich bleibt `<nav id="breadcrumb" class="breadcrumb"></nav>` (füllt `global.js`). SSR-Crumbs weichen vom Site-Muster ab und waren für den Try-Dive-CLS nicht nötig.

**Try Dive vs Fun Dives vs Kurse:**

| Seite | Früh in der Box | Fix |
| ----- | --------------- | --- |
| Fun Dives | Banner `*_header.webp` | **D2** |
| Kurse (Nitrox) | **2** Videos | **4E** (flex ok) |
| Try Dive | **1** Video | **E2** (`display: block` + Play absolut im Critical) |

### D2) Day-Trip Banner-Bild in der Box (`img.lazy` `*_header.webp`)


**Symptom:** `/day-trips/fun-dives/` hat 4D (Box-Padding + `> h1`) wie die Kurse, CLS auf `.changdiving-box` bleibt ~0.15.

**Ursache:** Day-Trip-Seiten haben oft früh in der Box ein breites Banner (`fun_dive_header.webp` o.ä.). Critical reservierte nur `aspect-ratio: 8 / 1`, aber `style.css` setzt zusätzlich `margin: 24px auto` (Mobile `16px auto 24px`) — der Margin-Sprung wächst die Box. Kurse haben an dieser Stelle oft Videos (→ 4E), kein Banner.

**Fix (nur Day-Trip-Produktseiten, Kurse unverändert):**

```css
.changdiving-box img.lazy[src*="_header.webp"],
.changdiving-box img.lazy[src*="-header.webp"] {
  display: block;
  max-width: 100%;
  width: 100%;
  height: auto;
  aspect-ratio: 8 / 1;
  object-fit: cover;
  margin: 24px auto; /* match style.css */
}
@media (max-width: 700px) {
  /* … existing 4D box padding … */
  .changdiving-box img.lazy[src*="_header.webp"],
  .changdiving-box img.lazy[src*="-header.webp"] {
    max-width: 98vw;
    width: 100%;
    margin: 16px auto 24px auto;
  }
}
```

**Sonderfall Scuba Review:** Banner als `scuba_review_header.webp` benennen (D2 greift), Hero wie Fun/Try (`hero--transactional`, Picture nur Desktop-`<source>` + `<img>` Fallback, kein extra Mobile-`<source>`), plus ATF-`hr` + `.page-jump-nav` im Critical **vor** dem Mobile-Block.
---

## 5. Typische PSI-Fallen → Fix

| Symptom | Ursache | Fix |
| ------- | ------- | --- |
| CLS ≈ 0.3, Element `main` / Hero | Critical ohne Mobile-`aspect-ratio` | Abschnitt 4A |
| CLS ≈ 0.1, Element Content-`<h1>` | H1-Styles erst aus `style.min.css` | Abschnitt 4B |
| LCP > 4s, LCP = Hero-`<img>` | Preload spät / JS-Preload konkurriert | Abschnitt 1 |
| Hub deutlich schlechter als `/en/` | Dutzende Eager-Kartenbilder | Abschnitt 3 |
| CLS ≈ 0.14 auf Kurs-Box (Padding/H1) | Critical kennt nur Desktop-`.changdiving-box` | Abschnitt 4D |
| CLS ≈ 0.15 auf Kurs-Box trotz 4D | `.video-responsive` ohne Höhe bis Full-CSS | Abschnitt **4E** (verifiziert) |
| CLS ≈ 0.15 auf Day-Trip-Box trotz 4D | Banner-`img` bekommt Margin erst aus Full-CSS | Abschnitt **D2** |
| CLS ≈ 0.15 auf Try Dive trotz 4E / voller Breite | **Ein** Video mit `display:flex` + Play in-flow | Abschnitt **E2** (verifiziert: CLS 0) |
| „Render-blocking“ `global.js` / `fonts.css` | Sync-Load | `defer` + async fonts |
| „Improve image delivery“ große KiB | Oft Below-the-fold Tiles, nicht Hero | Lazy + `_small` für Tiles; Hero separat prüfen |

---

## 6. Checkliste für neue Seiten

- [ ] Hero-Preload `_small` + `fetchpriority="high"` direkt nach Viewport
- [ ] `<picture>`: Desktop ≥768 `_big`/`_header`, Mobile ≤767 `_small`, `<img>` Fallback `_small`
- [ ] `loading="eager"` + `fetchpriority="high"` am Hero-`<img>` (nicht `lazy`)
- [ ] Alle Nicht-Hero-/Nicht-Logo-Bilder: `loading="lazy"`
- [ ] Critical: Mobile-Hero `aspect-ratio: 3 / 2`
- [ ] Critical: `.grid-container h1` (+ Mobile @700px)
- [ ] Critical: Submenu/Breadcrumb falls im Above-the-fold
- [ ] Kurs-Box: `.changdiving-box` **und** `.speciality-box` / `.tek-box` + Mobile-Padding zuletzt (4D)
- [ ] Day-Trip mit Banner-`*_header.webp` in der Box: Critical-Margin wie `style.css` (D2)
- [ ] Kurs-Box mit YouTube-Platzhaltern: `.video-flex` + `.video-responsive` `aspect-ratio: 16 / 9` im Critical (4E)
- [ ] **Nur ein** ATF-Video: `video-flex--single` + `display: block` + Play-Button absolut im Critical (**E2**); nicht nur `:only-child` / 100%-Breite
- [ ] Breadcrumb: leeres `<nav id="breadcrumb" class="breadcrumb"></nav>` (wie üblich; `global.js` füllt)
- [ ] `fonts.css` async + noscript-Fallback
- [ ] `style.min.css` async
- [ ] `global.js` mit `defer`, **kein** Head-Preload dafür
- [ ] Bild-Rename → 301 in `functions/[[path]].js`
- [ ] Mobile PSI auf der Seite prüfen (nicht nur Desktop)

---

## 7. Referenz-Commits (Juli 2026)

| Commit | Thema |
| ------ | ----- |
| `e06b1198` | Hero CLS + Dual-Sources + Solo-Diver-Rename/301 |
| `7af25cd6` | Content-H1 / Submenu / Breadcrumb in Critical CSS |
| `a6cf8b7d` | LCP: frühes Image-Preload, defer JS, async fonts |
| `bee236a0` | Hub-Karten `loading="lazy"` + Gold-Pattern-Doc |
| `cba43bb2` | Kurs-Boxen + H1 in Critical (4D) |
| `a3a35126` | Video `aspect-ratio` in Critical (4E) — CLS-Fix verifiziert |
| `ec56931a` | Day-Trip Banner-Margins in Critical (D2) |
| `6c247172` | Try Dive Einzelvideo `display:block` + Play absolut (**E2**) — CLS 0 / Perf 98 |
| `349f4ce4` | Try Dive: Breadcrumb wieder leer (JS), kein SSR |

---

## Kurzfassung

1. **LCP:** kleines Hero-Bild zuerst laden, nichts anderes im Weg.  
2. **CLS:** Finales Layout schon im Critical CSS (Hero 3:2 + H1-Maße + Kurs-Boxen + Videos 16:9).  
3. **JS/Fonts:** nie den kritischen Pfad blockieren.  
4. **Hubs:** Karten lazy — Vorbild `/en/` (nur Logo + Hero eager).  
5. **Kurs-Boxen mit Videos:** Critical muss `.video-responsive` kennen — sonst meldet PSI CLS auf der Box.  
6. **Ein ATF-Video (Try Dive):** `display: block` + Play absolut im Critical (**E2**) — reines 4E/Flex reicht nicht.
