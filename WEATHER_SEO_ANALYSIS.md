# Weather Page SEO – Vorher/Nachher Analyse

**Seite:** `/en/weather/` (analog DE, TH)  
**Datum:** Januar 2026  
**Ausgangslage (GSC):** Hohe Impressionen, niedrige Klicks, wenig tauchbezogener Traffic

---

## Executive Summary

| Kriterium                 | Vorher     | Nachher    | Verbesserung |
| ------------------------- | ---------- | ---------- | ------------ |
| **Title SEO**             | 4/10       | 9/10       | +125%        |
| **Meta/OG**               | 5/10       | 9/10       | +80%         |
| **Content-Fokus**         | 3/10       | 9/10       | +200%        |
| **Interne Links**         | 4/10       | 9/10       | +125%        |
| **Schema.org**            | 5/10       | 9/10       | +80%         |
| **Zielgruppen-Ansprache** | 4/10       | 9/10       | +125%        |
| **Gesamt-Score**          | **4.2/10** | **9.0/10** | **+114%**    |

---

## 1. Title & Meta Description

### Vorher

```
Title: Koh Chang Weather Forecast – Dive Conditions & Updates | Chang Diving
Meta:  Check the current weather and dive conditions in Koh Chang. Stay informed
       for your next snorkeling or diving trip with Chang Diving Center.
```

**Probleme:**

- Generisch („Forecast“, „Updates“)
- Kein Fokus auf Suchintention („weather koh chang“, „diving conditions“)
- Kein Windguru-Mention (hohe Suchanfragen)
- Kein klarer Nutzen für Nichttaucher

### Nachher

```
Title: Koh Chang Weather for Divers – Wind, Waves & Dive Conditions | Chang Diving
Meta:  Koh Chang weather for divers – wind, waves, visibility. Plan your dives
       with Windguru. Fun dives, courses, dive sites. Book today!
```

**Verbesserungen:**

- „for Divers“ → klare Zielgruppe
- „Wind, Waves“ → deckt Top-Queries ab (windguru koh chang, wave forecast)
- „Windguru“ → Brand-Match für Sucher
- „visibility“ → tauchrelevanter Begriff
- CTA: „Plan your dives“, „Book today!“

---

## 2. Hero & H1

### Vorher

```
H1: Weather Forecast in Koh Chang
Sub: Wondering about the weather in Koh Chang?
Alt: Day Trips Koh Chang – Snorkeling & Diving (falsch!)
```

**Probleme:**

- H1 zu generisch
- Kein Tauch-Bezug
- Falsches Hero-Alt (Day Trips statt Weather)

### Nachher

```
H1: Koh Chang Weather – Plan Your Dives
Sub: Wind, waves & visibility for scuba diving & snorkeling
Alt: Koh Chang weather – dive conditions and sea forecast
```

**Verbesserungen:**

- H1 mit Handlungsaufforderung
- Subtitle mit tauchrelevanten Begriffen
- Korrektes, beschreibendes Alt für Hero-Bild

---

## 3. Intro-Paragraph

### Vorher

```
Wondering about the weather in Koh Chang? As a tropical island, forecasts often
show rain. However, these are typically brief showers followed by sunshine. For
divers, marine conditions matter most. Below, you'll find reliable tide tables
and weather tools from Windguru to help plan your dives.
```

**Probleme:**

- Keine internen Links
- Kein klarer Fokus auf Tauchen
- Keine Verknüpfung zu Angeboten (Fun Dive, Try Dive, Dive Sites)

### Nachher

```
Koh Chang weather for divers – planning your next fun dive or Try Dive? Wind,
waves and visibility matter more than rain. As a tropical island, forecasts
often show showers – but these are usually brief, followed by sunshine. Below
you'll find Windguru wind and wave forecasts to plan your dives at the HTMS
Chang wreck and Koh Chang dive sites.
```

**Verbesserungen:**

- Interne Links: fun-dives, try-dive, htms-chang-wreck, dive-sites
- Klarer Tauch-Fokus
- Stärkere Verknüpfung mit Angeboten

---

## 4. Content-Struktur

### Vorher

- Wind Forecast
- Wave Forecast
- Water Temperature (redundant zu FAQ)
- Seasons (redundant zu FAQ)
- Kurzer „Book Your Diving Adventure“-Block
- Keine „Dive Deeper“-Sektion

### Nachher

- Wind Forecast
- Wave Forecast
- Water Temperature & Seasons entfernt (in FAQs abgedeckt)
- „Beyond the Forecast“ – emotionaler, ~180 Wörter langer Text
- 8 thematische Kacheln (FAQs, Marine Life, Dive Sites, Travel Guide, etc.)
- Erweiterter „Book Your Diving Adventure“-Block mit mehr Links

**Verbesserungen:**

- Weniger Duplikate
- Mehr thematische Tiefe
- Stärkere interne Verlinkung
- Klarere User Journey

---

## 5. Kacheln (Dive Deeper)

### Vorher

- Keine vergleichbare Sektion

### Nachher

| #   | Kachel                             | Link                            | SEO-Fokus                  |
| --- | ---------------------------------- | ------------------------------- | -------------------------- |
| 1   | Infos About Koh Chang              | faq-general-questions-koh-chang | Koh Chang, weather, island |
| 2   | Infos About Scuba Diving Koh Chang | faq-diving-koh-chang            | scuba diving Koh Chang     |
| 3   | Koh Chang's Marine Life            | marine-life-koh-chang           | marine life Koh Chang      |
| 4   | Dive Sites Around Koh Chang        | dive-sites                      | dive sites Koh Chang       |
| 5   | Koh Chang Guide                    | travel-guide (nicht Übersicht)  | Koh Chang guide, travel    |
| 6   | Scuba Knowledge                    | scuba-knowledge                 | scuba knowledge            |
| 7   | Scuba Day Trips                    | day-trips                       | scuba day trips            |
| 8   | Scuba Diving Courses               | courses                         | scuba diving courses       |

**Strategie:**

- Zielgruppe: überwiegend Nichttaucher (Wetter-Sucher)
- Texte: neugierig, informativ, einladend
- Kein Gulf vs Andaman (Koh Chang-Fokus)
- Travel Guide verlinkt auf spezifische Unterseite

---

## 6. Schema.org (JSON-LD)

### Vorher

```json
{
  "@type": "WebPage",
  "name": "Koh Chang Weather Forecast – Chang Diving Center",
  "description": "Check daily weather forecasts and dive conditions...",
  "url": "...",
  "inLanguage": "en",
  "publisher": { ... }
}
```

**Probleme:**

- Kein @id
- Kein isPartOf (WebSite)
- Kein about (LocalBusiness)
- Kein primaryImageOfPage
- Kein LocalBusiness-Schema
- Kein og:locale

### Nachher

```json
[
  {
    "@type": "WebPage",
    "@id": "https://changdiving.com/en/weather/",
    "name": "Koh Chang Weather for Divers – Wind, Waves & Dive Conditions | Chang Diving",
    "description": "Koh Chang weather for divers – wind, waves, visibility...",
    "isPartOf": { "@type": "WebSite", "@id": "..." },
    "about": { "@type": "LocalBusiness", "@id": "..." },
    "primaryImageOfPage": { "@type": "ImageObject", "url": "..." },
    "publisher": { ... }
  },
  {
    "@type": "LocalBusiness",
    "@id": "https://changdiving.com/",
    "name": "Chang Diving Center",
    "description": "Dive school on Koh Chang. Weather, wind & wave forecasts...",
    "address": { ... },
    "geo": { ... }
  }
]
```

**Verbesserungen:**

- Eindeutige @id
- Verknüpfung mit WebSite und LocalBusiness
- primaryImageOfPage für Rich Results
- LocalBusiness mit Geo für Local SEO
- og:locale + og:locale:alternate für mehrsprachige Seiten

---

## 7. Open Graph & Social

### Vorher

- og:title, og:description, og:image
- Kein og:locale
- Keine og:locale:alternate

### Nachher

- og:locale (en_US / de_DE / th_TH)
- og:locale:alternate für alle Sprachen
- Titel und Beschreibung an neue Meta angepasst

---

## 8. Erwartete GSC-Wirkung

| Metrik            | Erwartung (3–6 Monate)            |
| ----------------- | --------------------------------- |
| **Impressions**   | Stabil oder leicht steigend       |
| **Clicks**        | +20–40 % (bessere CTR)            |
| **CTR**           | +0,5–1,5 % (klarere Snippets)     |
| **Position**      | Verbesserung für „diving“-Queries |
| **Tauch-Traffic** | Deutlich höher (bessere Signale)  |

---

## 9. Formatierung

- **Prettier:** Alle drei Weather-Dateien (EN, DE, TH) mit Prettier formatiert
- **Validierung:** HTML-Struktur und JSON-LD prüfbar über:
  - [Google Rich Results Test](https://search.google.com/test/rich-results)
  - [Schema.org Validator](https://validator.schema.org/)

---

## 10. Nächste Schritte (optional)

1. **GSC:** URL Inspection für `/en/weather/`, Indexierung anstoßen
2. **Monitoring:** Performance-Tab in GSC beobachten (Impressions, Clicks, CTR)
3. **A/B:** Meta-Description ggf. testen (z. B. „Discover“ statt „Book today“ für Nichttaucher)
4. **Core Web Vitals:** LCP, CLS prüfen (Windguru-Widgets)
