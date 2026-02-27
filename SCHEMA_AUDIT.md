# Schema.org Audit – Chang Diving (Stand: 24.01.2025)

## Übersicht: LocalBusiness & aggregateRating

| Bereich | Seiten | Course | LocalBusiness | aggregateRating | Status |
|---------|--------|--------|---------------|-----------------|--------|
| **Course Übersichten** | 18 | ✅ | ✅ | ✅ | OK |
| **Einzelkurse** | 81 | ✅ | ✅ | ✅ | OK (ergänzt 24.01.) |
| **Day-trips Index** | 3 | - | ✅ | ✅ | OK |
| **Day-trips Fun-dives** | 3 | - | ✅ | ✅ | OK |
| **Day-trips Try-dive** | 3 | ✅ | ✅ | ✅ | OK (ergänzt 24.01.) |
| **Day-trips Scuba-review** | 3 | ✅ | ✅ | ✅ | OK (ergänzt 24.01.) |
| **Day-trips Snorkeling** | 3 | - | ✅ | ✅ | OK (ergänzt 24.01.) |
| **Day-trips Insurance** | 3 | - | ✅ | ✅ | OK (ergänzt 24.01.) |
| **Day-trips Rent-gopro** | 3 | - | ✅ | ✅ | OK (ergänzt 24.01.) |
| **Dive-sites** | 42 | - | ✅ | ✅ | OK (ergänzt 24.01.) |
| **FAQ-Seiten** | 24 | - | ✅ | ✅ | OK |
| **Equipment used-scuba-gear** | 3 | - | ✅ | ✅ | OK |

## Details

### Course-Seiten mit LocalBusiness
- Übersichten: `*/courses/index.html`, `beginner-courses/`, `advanced-courses/`, `speciality/`, `professional-courses/`, `technical-diving-courses/`
- Einzelkurse: alle 81 Kursseiten (advanced, open-water-diver, deep-diver, etc.) – ergänzt 24.01.2025

### Day-trips mit LocalBusiness
- Index, fun-dives (bereits vorhanden)
- try-dive, scuba-review, snorkeling, insurance, rent-gopro – ergänzt 24.01.2025

### Dive-sites
- 42 Einzeltauchplätze: FAQPage + LocalBusiness + aggregateRating – ergänzt 24.01.2025

## LocalBusiness-Schema (Standard-Vorlage)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://changdiving.com/#localbusiness",
  "name": "Chang Diving Center",
  "url": "https://changdiving.com/",
  "telephone": "+66-89-401-3927",
  "address": { ... },
  "geo": { ... },
  "openingHours": "Mo-Su 07:00-18:00",
  "logo": { ... },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": 170,
    "bestRating": "5",
    "worstRating": "1"
  }
}
```
