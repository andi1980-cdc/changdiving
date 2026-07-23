# Page Header + Jump Menu Pattern

Stand: Juli 2026  
Referenzseite (Test): `en/day-trips/fun-dives/index.html`

Dieses Muster beschreibt die Layout-Änderung: **H1 und Teaser unter dem Hero** (nicht als Overlay), plus **einheitliches Jump-Menü**. Später auf andere Day-Trip- und Kurs-Seiten anwenden.

Verwandt, aber älter (H1 *im* Hero / Mobile-Overlay): `HERO-TRANSACTIONAL-PATTERN.md`  
Für kaufnahe Seiten gilt **dieses** Dokument als aktueller Standard.

---

## Ziel

| Vorher | Nachher |
|--------|---------|
| H1 + Teaser als Overlay auf dem Hero-Bild | Hero = nur Bild |
| Extra `<h2>` unter Banner (oft redundant) | H1 ist die einzige Hauptüberschrift |
| Jump-Menü unterschiedlich (Discover, 5 Links …) | Immer dieselben 4 Punkte |

**Vorteile:** besseres Hero-Bild, lesbarer Titel, konsistente Navigation, weniger doppelte Headlines.

---

## Zielstruktur (Reihenfolge)

```
<header> … hero picture (kein .hero-text) … </header>
<main>
  posts-submenu (optional)
  <div class="changdiving-box">
    breadcrumb
    h1          (zentriert)
    p (Teaser)  (zentriert)
    page-jump-nav
    banner-img  (optional, wie bisher)
    <hr />
    intro-Absatz(e)  id="intro"
    …
    h2 id="who-can-join"
    h2 id="whats-included"
    …
    h2 / Abschnitt Prices & book  (z. B. id="dive-packages")
```

---

## 1. Hero: Text-Overlay entfernen

**Entfernen** aus dem Hero:

```html
<div class="hero-text">
  <h1>…</h1>
  <p>…</p>
</div>
```

Hero enthält nur noch `<picture>` / Hero-Bild.  
CSS für `.hero-text` darf im Page-`<style>` bleiben (schadet nicht) – optional später aufräumen.

---

## 2. H1 + Teaser zwischen Breadcrumb und Jump-Menü

Direkt nach `<nav id="breadcrumb" …>` einfügen:

```html
<h1 style="margin: 20px 0 8px; text-align: center">
  Fun Dives Koh Chang – Guided Boat Dives from 3,290 THB
</h1>
<p style="margin: 0 0 24px; color: #555; text-align: center">
  Already certified? Join our guided fun dives and explore vibrant
  coral reefs, fascinating marine life and thrilling wrecks around Koh
  Chang.
</p>
```

**Regeln:**

- H1 = gleiche Keywords wie `<title>`, **ohne** `| Chang Diving`
- Teaser = kurzer Absatz (1–2 Sätze), der zuvor im Hero stand
- Beide **zentriert** (`text-align: center`)
- Hero-Bild-`alt` weiterhin wie H1 halten

---

## 3. Redundantes H2 entfernen

Falls unter dem Banner-Bild ein zweites Headline-H2 steht, das den Seitentitel wiederholt (z. B. „Fun Diving in Koh Chang, Thailand – Your Gateway…“), **entfernen**.

Der SEO-Einleitungstext (`Looking for fun dives…`) bleibt; nur die doppelte Headline fällt weg.

---

## 4. Einheitliches Jump-Menü (4 Punkte)

**Immer diese Reihenfolge und Labels** (lokalisiert in DE/TH):

| # | EN Label | Anker | Ziel |
|---|----------|--------|------|
| 1 | Intro | `#intro` | Erster Intro-Absatz nach Banner/`<hr>` |
| 2 | Who can join? | `#who-can-join` | Voraussetzungen |
| 3 | What's included | `#whats-included` | Inklusivleistungen |
| 4 | Prices & book | `#…-packages` / `#book-…` | Preis-/Buchungsbereich |

**Nicht** in das Standard-Menü: Discover / What can you discover (Abschnitt darf auf der Seite bleiben, nur kein Jump-Link).

### Markup (EN Beispiel)

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

### Anker setzen

```html
<p id="intro">…</p>
<!-- oder wrap um Intro-Block, wenn mehrere Absätze -->

<h2 id="who-can-join" …>Who can join?</h2>
<h2 id="whats-included" …>What's included</h2>
<h2 id="dive-packages" …>…</h2>  <!-- Seiten-spezifische Packages-ID beibehalten -->
```

**Packages-ID:** pro Seite den bestehenden Anker nutzen (`#dive-packages`, `#try-dive-options`, `#owd-packages`, `#book-advanced`, …) – nur das **Label** „Prices & book“ vereinheitlichen.

### DE / TH Labels (Vorschlag)

| EN | DE | TH |
|----|----|-----|
| On this page | Auf dieser Seite | ในหน้านี้ |
| Intro | Intro | Intro |
| Who can join? | Wer kann mit? | ใครเข้าร่วมได้? |
| What's included | Was ist inklusive | สิ่งที่รวมอยู่ |
| Prices & book | Preise & buchen | ราคาและจอง |

---

## 5. Linienfarbe angleichen

- Jump-Nav-Unterkante: `style="border-bottom: 1px solid #ccc"` (wie globales `hr`)
- **Kein** zusätzliches `<hr>` *zwischen* Jump-Nav und Banner-Bild (sonst Doppel-Linie)
- Ein `<hr />` *unter* dem Banner-Bild vor dem Intro ist ok

---

## Checkliste pro Seite

1. [ ] `.hero-text` aus Hero entfernt  
2. [ ] H1 + Teaser nach Breadcrumb, zentriert  
3. [ ] Redundantes Intro-H2 entfernt (falls vorhanden)  
4. [ ] Jump-Menü: Intro · Who can join? · What's included · Prices & book  
5. [ ] `id="intro"` am Intro-Absatz  
6. [ ] Jump-Nav-Border `#ccc`, kein doppeltes `<hr>` über dem Banner  
7. [ ] Packages-Anker stimmt mit „Book now“-Links (Preisliste etc.) überein  
8. [ ] DE + TH spiegeln (Inhalt lokalisiert, Struktur gleich)  

---

## Rollout-Kandidaten (später)

**Day Trips:**  
`try-dive`, `scuba-review`, `snorkeling`, ggf. weitere unter `/day-trips/`

**Courses (ähnliche Struktur):**  
`open-water-diver`, `advanced`, `scuba-diver`, Specialty-/Tech-Seiten mit Jump-Menü

Nicht blind auf alle Hub-Seiten (`/courses/`, `/posts/`) anwenden – vor allem **buchbare Einzel-/Produktseiten**.

---

## Referenz-Diff

Arbeitsstand (noch nicht gepusht zum Zeitpunkt der Doku): nur EN Fun Dives als Vorlage.

```bash
git diff -- en/day-trips/fun-dives/index.html
```
