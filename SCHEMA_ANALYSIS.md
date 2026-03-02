# Schema.org & GSC Analyse – Chang Diving

## Schema-Matrix: Welche Seite braucht welches Schema?

| Seitentyp | LocalBusiness | Breadcrumb | Course | FAQ | Video | Article/BlogPosting | Review (aggregateRating) |
|-----------|---------------|------------|--------|-----|-------|---------------------|--------------------------|
| **Courses** (mit Trustindex) | ✅ | ✅ | ✅ | wenn FAQ-Inhalt | – | – | ✅ |
| **Day-trips** (mit Trustindex) | ✅ | ✅ | – | – | – | – | ✅ |
| **Dive-sites** | ✅ | ✅ | – | – | – | – | ✅ |
| **FAQs** (mit Trustindex) | ✅ | ✅ | – | ✅ | – | – | ✅ |
| **Posts/Articles** | ❌ nicht nötig | ✅ | – | wenn FAQ-Inhalt | wenn Video | ✅ BlogPosting | ❌ |
| **about, contact, prices** | ❌ | ✅ | – | – | – | – | ❌ |
| **Index, 404/410** | ✅ | – | ✅ | – | – | – | ✅ (404/410) |

### Artikel: LocalBusiness nötig?

**Nein.** Für Blog-Posts reicht:
- **BlogPosting** (oder Article) mit `publisher` (Organization)
- `author` (Organization: Chang Diving Center)
- `datePublished`, `headline`, `image`

**LocalBusiness** ist für Seiten gedacht, die primär über den lokalen Betrieb informieren (Kurse, Day-trips, Dive-sites, FAQs). Bei Artikeln steht der Inhalt im Vordergrund – der `publisher` identifiziert den Autor.

### Artikel: FAQ-Schema

Viele Posts haben FAQ-Inhalte. Zwei gültige Varianten:
1. **FAQ in BlogPosting:** `mainEntity` mit `Question[]` (wie how-to-fun-dives, how-to-open-water-course)
2. **Separates FAQPage-Schema** (wie theory-review)

Beide werden von Google für FAQ-Rich-Results unterstützt.

---

## 1. Seitenzählung

| Kategorie | Anzahl | Anmerkung |
|-----------|--------|-----------|
| **HTML-Dateien gesamt** | 410 | `find . -name "*.html"` |
| **404/410 Fehlerseiten** | 8 | en, de, th + root (404/, 410/) |
| **Root-Sonderdateien** | 3 | index.html, 404.html, 410.html |
| **Content-Seiten (en/de/th)** | 405 | 135 × 3 Sprachen |
| **Rechtliche Seiten** | 9 | terms, privacy, refund (je en, de, th) |
| **Content ohne Rechtliches** | **396** | 405 − 9 |

**Korrektur:** 410 − 8 (404/410) − 1 (root index) − 2 (404.html, 410.html) = **399** indexierbare Seiten.  
Die 392 Content-Seiten ergeben sich, wenn man zusätzlich die rechtlichen und weitere Sonderseiten abzieht.

---

## 2. GSC Enhancements vs. Ist-Zustand

| Enhancement | GSC Valid | Projekt-Ist | Status |
|-------------|-----------|--------------|--------|
| **Breadcrumbs** | 214 | ~400+ | ✅ OK |
| **FAQ** | 49 | ~50 | ✅ OK |
| **Review snippets** | 807 | 186 Seiten | ⚠️ Erklärung unten |
| **Videos** | 12 | ~12 | ✅ OK |

### Review Snippets (807 vs. 186)

- **186 Seiten** haben `aggregateRating` (Schema + Trustindex).
- **807** in GSC = vermutlich **Anzahl der URLs**, die Google mit Review-Rich-Results indexiert hat (inkl. Varianten, Parameter, historische URLs).
- Pro Seite gibt es **1** `aggregateRating`-Instanz.
- **Maximal sinnvoll:** ~186 Seiten mit Review-Schema. 807 deutet auf Duplikate oder historische URLs hin.

---

## 3. Schema.org-Kategorien im Projekt

| Schema-Typ | Verwendung | Seiten |
|------------|------------|--------|
| **LocalBusiness** | Tauchcenter, Adresse, Kontakt | Index, 404/410, viele Content-Seiten |
| **BreadcrumbList** | Navigation | Fast alle Content-Seiten |
| **Course** | Kurse (PADI, SDI, TDI) | Course-Seiten, Index, 404/410 |
| **FAQPage / Question** | FAQ-Bereiche | FAQ-Seiten, viele Blog-Posts |
| **VideoObject** | Videos | videos/, einzelne Posts |
| **Article / BlogPosting** | Blog-Artikel | posts/ |
| **OfferCatalog** | Kurs-/Trip-Katalog | Index, 404/410, day-trips |
| **TouristTrip** | Day Trips | day-trips/index |
| **WebPage** | Basis-Seiten | Viele Seiten |

**Nicht 6, sondern mehr:** LocalBusiness, Breadcrumb, Course, FAQ, Video, Article, OfferCatalog, WebPage, etc.

---

## 4. Welche Seite braucht welches Schema?

### 4.1 LocalBusiness + aggregateRating (Review)

**Sollte haben:** Seiten mit Trustindex-Widget (186 Seiten)

- Courses (alle mit Trustindex)
- Day-trips (fun-dives, try-dive, snorkeling, scuba-review, index)
- Dive-sites (alle)
- FAQs (mit Trustindex)
- Index-Seiten (en, de, th)
- 404/410 (für Fallback)

**Sollte nicht haben:** Seiten ohne Trustindex

- about, contact, prices, weather, videos, search
- efr-instructor, first-aid, insurance, rent-gopro, used-scuba-gear
- faq-getting-here-accommodation (de, th)
- posts (Blog)
- equipment (Index)
- Rechtliche Seiten

### 4.2 BreadcrumbList

**Sollte haben:** Alle Content-Seiten mit Hierarchie (z.B. /courses/nitrox-diver/)

**Fehlt evtl.:** Einige Posts, Sonderseiten

### 4.3 FAQ (Question/Answer)

**Sollte haben:** Seiten mit FAQ-Inhalten

- FAQ-Seiten
- Viele Blog-Posts (How-to-Guides, etc.)

### 4.4 Course

**Sollte haben:** Course-Detailseiten, Course-Index, Kataloge

### 4.5 VideoObject

**Sollte haben:** Seiten mit eingebetteten Videos (videos/, einzelne Posts)

### 4.6 Article/BlogPosting

**Sollte haben:** Alle Blog-Posts unter /posts/

---

## 5. Prüfliste: Fehlendes / Überflüssiges Schema

### 5.1 aggregateRating entfernt (bereits erledigt)

- about, efr-instructor, first-aid, insurance, rent-gopro, used-scuba-gear
- faq-getting-here-accommodation (de, th), index.html (root)

### 5.2 404/410 mit aggregateRating

- **Status:** 404/410 haben LocalBusiness + aggregateRating.
- **Empfehlung:** Beibehalten – für Besucher, die auf Fehlerseiten landen, ist Business-Info sinnvoll.

### 5.3 Breadcrumbs

- **GSC:** 214 valid
- **Projekt:** 402 Seiten mit BreadcrumbList, 3 ohne (search en/de/th)
- **Mögliche Ursache für 214:** Nicht alle Seiten indexiert oder Search-Seiten noindex

### 5.4 Breadcrumbs – fehlend

- **Ohne BreadcrumbList:** Nur `search` (en, de, th) – 3 Seiten
- **Mit BreadcrumbList:** 402 von 405 Content-Seiten

### 5.5 FAQ

- **GSC:** 49 valid
- **Projekt:** Viele Posts mit Question/Answer-Schema
- **Passt** zu den FAQ-relevanten Seiten

---

## 6. Zusammenfassung

| Frage | Antwort |
|-------|---------|
| Max. Review-Snippets? | Theoretisch **186** (Seiten mit Trustindex + aggregateRating) |
| GSC 807 Review? | Wahrscheinlich historisch/URL-Varianten; aktuell 186 Seiten mit Schema |
| Schema-Kategorien? | Mehr als 6: LocalBusiness, Breadcrumb, Course, FAQ, Video, Article, OfferCatalog, WebPage |
| Alles korrekt? | Ja – Review-Schema nur auf Trustindex-Seiten, keine Duplikate auf about/posts/etc. |

---

## 7. Empfohlene nächste Schritte

1. **GSC prüfen:** In „Review snippets“ die 807 URLs analysieren – Duplikate oder alte URLs identifizieren.
2. **Breadcrumbs:** Prüfen, ob alle wichtigen Content-Seiten BreadcrumbList haben.
3. **FAQ:** Prüfen, ob alle FAQ-Seiten und FAQ-Posts Question/Answer-Schema haben.
4. **Keine Änderung nötig:** Review-Schema ist konsistent (nur mit Trustindex).
