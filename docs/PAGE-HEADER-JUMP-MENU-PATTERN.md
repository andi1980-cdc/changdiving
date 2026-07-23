# Page Header + Jump Menu Pattern

Stand: Juli 2026  
Referenz: `docs/PAGE-HEADER-JUMP-MENU-PATTERN.md`  
Verwandt (älter, H1 *im* Hero): `HERO-TRANSACTIONAL-PATTERN.md`

Für kaufnahe Seiten gilt **dieses** Dokument als aktueller Standard: **H1 + Teaser unter dem Hero** + **einheitliches Jump-Menü (4 Punkte)**.

---

## Status: Day Trips (abgeschlossen)

Alle **internen Produktseiten** unter `/day-trips/` sind in **EN / DE / TH** umgestellt:

| Seite | Status | Book-/Packages-Anker | Jump-Labels |
|-------|--------|----------------------|-------------|
| `fun-dives` | ✅ | `#dive-packages` | Standard |
| `try-dive` | ✅ | `#try-dive-options` | Standard |
| `scuba-review` | ✅ | `#review-packages` | Standard |
| `snorkeling` | ✅ | `#book-snorkeling` (neu) | Standard |
| `insurance` | ✅ | `#book-insurance` | **Versicherung** (s.u.) |
| `rent-gopro` | ✅ | `#book-gopro` | **GoPro** (s.u.) |

Hub `/day-trips/` (Übersicht) ist **nicht** Teil dieses Musters.

---

## Ziel

| Vorher | Nachher |
|--------|---------|
| H1 + Teaser als Overlay auf dem Hero-Bild | Hero = nur Bild |
| Extra `<h2>` unter Banner (oft redundant) | H1 ist die einzige Hauptüberschrift |
| Jump-Menü unterschiedlich (Discover, 5 Links …) | Immer 4 Punkte, gleiche Reihenfolge |

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
    page-jump-nav   (border-bottom: 1px solid #ccc)
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

| # | EN | DE | TH | Typischer Anker |
|---|----|----|-----|-----------------|
| 1 | Intro | Intro | **บทนำ** | `#intro` |
| 2 | Who can join? | Wer kann mit? | ใครเข้าร่วมได้? | `#who-can-join` |
| 3 | What's included | Was ist inklusive | สิ่งที่รวมอยู่ | `#whats-included` |
| 4 | Prices & book | Preise & buchen | ราคาและจอง | siehe Tabelle oben |

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

## 5. Linienfarbe

- Jump-Nav: `border-bottom: 1px solid #ccc` (wie globales `hr`)
- **Kein** `<hr>` zwischen Jump-Nav und Banner
- `<hr />` unter dem Banner vor Intro ist ok

---

## Checkliste pro Seite

1. [ ] `.hero-text` aus Hero entfernt  
2. [ ] H1 + Teaser nach Breadcrumb, zentriert  
3. [ ] Redundantes Intro-/Titel-H2 entfernt (falls vorhanden)  
4. [ ] Jump-Menü 4 Punkte (Standard **oder** Produkt-Ausnahme)  
5. [ ] `id="intro"` gesetzt  
6. [ ] Jump-Nav-Border `#ccc`, kein doppeltes `<hr>` über dem Banner  
7. [ ] Packages-/Book-Anker stimmt (Preisliste „Book now“ ggf. nachziehen)  
8. [ ] DE + TH spiegeln; TH Intro-Label = **บทนำ** (nicht „Intro“)  
9. [ ] Bildpfade prüfen (`/img/products/…`, keine falschen Ordnernamen)

---

## Produkt-Ausnahmen (Labels)

### Insurance (`/day-trips/insurance/`)

| EN | DE | TH |
|----|----|-----|
| Intro | Intro | บทนำ |
| Benefits | Vorteile | ประโยชน์ |
| Coverage | Deckung | ความคุ้มครอง |
| Prices & book | Preise & buchen | ราคาและจอง |

Anker: `#intro`, `#who-can-join`, `#whats-included`, `#book-insurance`  
(IDs technisch an Kurs-Schema angelehnt; sichtbare Labels versicherungsspezifisch.)

### GoPro Rental (`/day-trips/rent-gopro/`)

| EN | DE | TH |
|----|----|-----|
| Intro | Intro | บทนำ |
| What's included | Inklusive | สิ่งที่รวมอยู่ |
| What you'll see | Was du siehst | สิ่งที่คุณจะเห็น |
| Prices & book | Preise & buchen | ราคาและจอง |

Anker: `#intro`, `#whats-included`, `#what-youll-see`, `#book-gopro`

---

## Seiten-Notizen (Day Trips)

| Seite | Besonderheiten |
|-------|----------------|
| **fun-dives** | Erste Referenz; Intro = erster SEO-Absatz nach Banner; `#dive-packages` |
| **try-dive** | Kein Banner wie Fun Dives; `#intro` am Video-Block (EN/TH) bzw. am „Was ist Schnuppertauchen?“-H2 (DE); DE: `#requirements` → `#who-can-join` |
| **scuba-review** | Banner + Video-Playlist behalten; `#course-overview` → `#intro`; TH: Bildpfade waren falsch (`สกูบา_review` → `scuba_review`) – **gefixt** |
| **snorkeling** | Jump-Menü war neu; `#book-snorkeling` neu; TH-Banner auf `/img/products/snorkeling/snorkeling_2_small.webp` vereinheitlicht |
| **insurance** | Hero war schon ohne Overlay; Labels siehe Ausnahme |
| **rent-gopro** | Kurze Seite; Includes als eigenes H2; Labels siehe Ausnahme |

---

## Bekannte Fixes während des Rollouts

1. **TH scuba-review:** alle Bild-URLs `/img/products/สกูบา_review/` → `/img/products/scuba_review/` (13 Stellen inkl. Meta/OG).  
2. **TH snorkeling Banner:** `/img/daytrips/snorkeling/snorkeling2.webp` → `/img/products/snorkeling/snorkeling_2_small.webp`.  
3. **TH Jump-Label:** immer **บทนำ**, nie englisches „Intro“.

---

## Nächster Rollout (offen)

**Courses** (ähnliche Struktur):  
`open-water-diver`, `advanced`, `scuba-diver`, Specialty-/Tech-Seiten mit Jump-Menü.

Nicht blind auf Hubs (`/courses/`, `/posts/`, `/day-trips/` Übersicht) anwenden – vor allem **buchbare Einzel-/Produktseiten**.

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
