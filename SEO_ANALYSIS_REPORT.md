# Chang Diving – SEO Analyse & Bericht

**Stand:** März 2026  
**Scope:** changdiving.com (EN primär, DE/TH geprüft)

---

## 1. Schema.org Nutzung nach Seitentyp

### 1.1 Übersicht Schema-Typen pro Kategorie

| Kategorie | Schema-Typen | Seiten (EN) | Anmerkung |
|-----------|-------------|-------------|-----------|
| **Courses** | LocalBusiness, OfferCatalog, Course, Place, FAQPage, BreadcrumbList | ~35 | Kurs-Kategorien + Einzelkurse mit FAQ |
| **Posts** | BlogPosting, Organization, WebPage, Question, Answer, BreadcrumbList | ~55 | FAQ in `mainEntity` bei vielen Posts |
| **Day-trips** | Course, TouristAttraction, Place, OfferCatalog, BreadcrumbList | ~8 | Try-dive/Scuba-review als Course |
| **Dive-sites** | Place, LocalBusiness, BreadcrumbList | ~15 | Place für jeden Spot |
| **FAQs** | FAQPage, Question, Answer, BreadcrumbList | 9 | Dediziertes FAQPage-Schema |
| **Equipment** | WebPage, BreadcrumbList | 2 | Kein Product/Offer |
| **Contact** | ContactPage, PostalAddress, ContactPoint | 1 | Vollständig |
| **Index/Home** | LocalBusiness, OfferCatalog, Course, WebSite | 1 | Reichhaltig |
| **Legal** | WebPage, Organization, BreadcrumbList | 3 | Basis-WebPage |
| **Posts-Index** | CollectionPage, ItemList, SiteNavigationElement | 5 | Pro Kategorie |
| **Search** | WebPage, WebSite | 1 | noindex, kein BreadcrumbList |
| **Videos** | WebPage, Place, VideoObject | 1 | VideoObject vorhanden |

### 1.2 Schema-Typen im Detail

| Schema-Typ | Verwendung |
|------------|------------|
| **LocalBusiness** | Index, 404/410, Courses, Day-trips, Dive-sites, FAQs (mit aggregateRating) |
| **Course** | Alle Kurs-Detailseiten, Try-dive, Scuba-review, OfferCatalog |
| **Place** | Dive-sites, Kurs-Locations, Day-trip-Locations |
| **FAQPage** | Alle FAQ-Seiten + Kurs-Kategorien (beginner, advanced, professional, speciality, technical) |
| **Question/Answer** | FAQ-Seiten, viele Posts (in BlogPosting `mainEntity`) |
| **BlogPosting** | Alle Posts (~55 EN) |
| **BreadcrumbList** | ~134/137 EN-Seiten (Search ausgenommen) |
| **OfferCatalog** | Index, Courses-Index, Day-trips-Index |
| **TouristAttraction** | Day-trips (Snorkeling, Rent-gopro) |
| **ContactPage** | Contact |
| **CollectionPage** | Posts-Indizes |
| **WebPage** | Legal, Equipment, Kategorie-Seiten |

---

## 2. SEO-Optimierung nach Kategorie

### 2.1 Abdeckungs-Matrix (EN)

| Feature | Courses | Posts | Day-trips | Dive-sites | FAQs | Equipment | Legal |
|---------|:-------:|:------:|:---------:|:----------:|:----:|:---------:|:-----:|
| Canonical | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Meta description | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Meta keywords | ⚠️ meist | ⚠️ meist | ✅ | ❌ dive-sites index | ✅ | ⚠️ | ❌ |
| Hreflang | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Open Graph | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Twitter Card | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Structured Data | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |

### 2.2 Lücken

| Lücke | Betroffene Seiten | Priorität |
|-------|-------------------|-----------|
| Meta keywords fehlen | dive-sites index, legal | Niedrig |
| Equipment ohne Product/Offer | /equipment/, /equipment/used-scuba-gear/ | Mittel |
| Search ohne BreadcrumbList | /search/ (noindex) | Niedrig – akzeptabel |

---

## 3. Optimierungspotenzial

### 3.1 FAQ-Schema

- **FAQs:** Alle 9 FAQ-Seiten nutzen FAQPage ✅
- **Posts:** Viele How-to- und Knowledge-Posts nutzen Question/Answer in BlogPosting ✅
- **Courses:** Kurs-Kategorien (beginner, advanced, professional, speciality, technical) haben FAQPage ✅  
  Einzelkurse (open-water-diver, rescue-diver, etc.) haben ebenfalls FAQPage ✅

### 3.2 Dünner Content

- **Equipment:** Relativ kurz
- **Insurance / Rent-gopro:** Kurze Utility-Seiten
- **Legal:** Für Rechtstexte ausreichend

### 3.3 Alt-Texte

- Keine leeren `alt=""` gefunden
- Bilder mit beschreibenden Alt-Texten

### 3.4 Duplikate

- Meta-Beschreibungen pro Seite individuell
- Keine auffälligen Duplikate

### 3.5 BreadcrumbList

- **Mit BreadcrumbList:** 134 EN-Seiten
- **Ohne:** 3 (Search en/de/th – noindex)

---

## 4. Interne Verlinkung

### 4.1 Hauptnavigation

```
Courses | Day Trips | Prices | About | Equipment | Weather | Dive Sites | Posts | FAQs | Contact
```

- Alle Hauptbereiche über Header-Dropdown verlinkt
- Gleiche Struktur in EN, DE, TH

### 4.2 Breadcrumb-Muster

- **Courses:** Home > Courses > [Kursname]
- **Posts:** Home > Posts > [Kategorie] > [Post-Titel]
- **Day-trips:** Home > Day Trips > [Trip-Name]
- **Dive-sites:** Home > Dive Sites > [Spot-Name]
- **FAQs:** Home > FAQs > [FAQ-Thema]

### 4.3 Cross-Links zwischen Bereichen

| Von | Zu Courses | Zu Day-trips | Zu Dive-sites | Zu Posts |
|-----|:----------:|:-------------:|:--------------:|:--------:|
| **Posts** | ~33 | ~33 | ~33 | intern |
| **Courses** | intern | 4–15/Seite | 0–11/Seite | 2–17/Seite |
| **Day-trips** | 6–15 | intern | 3–8 | 3–15 |
| **Dive-sites** | 3–6 | 3–6 | intern | 3–6 |

### 4.4 Schwach verlinkte Bereiche

- **Equipment:** Nur in Nav, wenige kontextuelle Links von Courses/Day-trips
- **Weather:** Nur in Nav, wenige kontextuelle Links
- **Videos:** Über About verlinkt, nicht in Hauptnav

### 4.5 Kurse ↔ Posts

- **Courses → Posts:** 2–17 Links pro Kurs (z.B. open-water-diver 43 interne Links)
- **Posts → Courses:** Stark (How-to-Guides, Beginner-Guide)
- **Day-trips → Posts:** 3–15 Links
- **Dive-sites → Posts:** 3–6 Links pro Spot

---

## 5. Pro & Contra

### ✅ Pro

| Aspekt | Details |
|--------|---------|
| **Technische Basis** | Canonical, hreflang, OG, Twitter Card auf Content-Seiten |
| **Schema** | Course, Place, FAQPage, BlogPosting, BreadcrumbList, OfferCatalog |
| **FAQ-Schema** | FAQ-Seiten + viele Posts + Kurs-Kategorien |
| **BreadcrumbList** | 134/137 EN-Seiten |
| **Interne Links** | Starke Verknüpfung Posts ↔ Courses/Day-trips |
| **Meta** | Individuelle Descriptions, Alt-Texte vorhanden |
| **Mehrsprachigkeit** | EN/DE/TH konsistent |
| **Sitemap** | Vollständig, ~370 URLs |

### ❌ Contra

| Aspekt | Details |
|--------|---------|
| **Equipment** | Kein Product/Offer-Schema, wenige kontextuelle Links |
| **Weather** | Wenige kontextuelle Links |
| **Videos** | Nicht in Hauptnav |
| **Meta keywords** | Fehlen auf dive-sites index, legal |
| **Search** | Kein BreadcrumbList (bei noindex akzeptabel) |

---

## 6. Priorisierte Empfehlungen

### Hohe Priorität

1. **Equipment kontextuell verlinken**  
   Von Courses (Nitrox, Sidemount, etc.) und Day-trips zu Equipment-Seiten verlinken.

2. **FAQ-Schema an Intro-Text anpassen**  
   Wo FAQ-Schema und sichtbarer Text abweichen, angleichen (v.a. Kurs-Kategorien).

### Mittlere Priorität

3. **Product/Offer-Schema für Equipment**  
   Für used-scuba-gear und Equipment-Index wo sinnvoll.

4. **Weather kontextuell verlinken**  
   Von Day-trips und Dive-sites (z.B. „Check weather before your dive“).

5. **Videos in Hauptnav**  
   Falls Videos strategisch wichtig sind.

### Niedrige Priorität

6. **Meta keywords**  
   Für dive-sites index und legal ergänzen (geringer SEO-Effekt).

7. **Dünnen Content prüfen**  
   Equipment, Insurance, Rent-gopro ggf. erweitern.

8. **Sitemap-Struktur**  
   Bei weiterem Wachstum nach Sprache/Kategorie aufteilen.

---

## 7. DE/TH Konsistenz

- Schema-Typen wie EN
- Canonical, hreflang, OG, Twitter Card vorhanden
- BreadcrumbList auf Content-Seiten
- Navigation identisch
- Keine relevanten EN/DE/TH-Unterschiede

---

## 8. Fazit

Die Seite ist technisch und inhaltlich gut für SEO aufgestellt: Schema, Meta-Tags, hreflang und interne Verlinkung sind solide umgesetzt. Die wichtigsten Hebel sind:

- Stärkere kontextuelle Verlinkung von Equipment und Weather
- Product/Offer-Schema für Equipment
- Feinabstimmung von FAQ-Schema und sichtbarem Inhalt
