# Keyword- & GSC-Analyse einzelner Seiten

**Role:** `living`  
**Stand:** August 2026  
**Zweck:** Wiederholbare Prüfung: Seite ↔ Ziel-Keywords ↔ Google Search Console  
**Sprachen:** EN / DE / TH (gleiche Struktur, sprachspezifische Keywords)

---

## Harte Regel: Struktur nicht ändern

Verkaufs-/Content-Seiten teilen **projektweit denselben Aufbau** (Hero, Jump-Nav, Intro, Who can join / Included, Preise/CTA, Reviews, Footer-Schema).

Bei SEO-Fixes **nur**:

- Title, Description, Keywords-Meta, OG/Twitter
- Wortlaut in **bestehenden** Blöcken (Intro, Why-Absatz falls vorhanden, FAQ-Schema-Texte)
- Interne Ankertexte / Search-Index

**Nicht:**

- Neue Sektionen, andere Jump-Nav-Architektur, abweichendes Layout
- Shop-Sprache („Product“) wo „Activity / Aktivität / กิจกรรม“ gemeint ist

Ausnahme nur nach explizitem OK (z. B. `/prices/` FAQ-Block war eine bewusste Ergänzung der Hub-Seite).

---

## Workflow (pro Seite)

### 0. Inputs

| Input | Quelle |
|-------|--------|
| Live-/Repo-URL | z. B. `/en/day-trips/fun-dives/` |
| GSC-Export | Performance → Filter **Page** = URL (oder Pfad) → Excel, letzte 28 Tage |
| Sprachen | EN + DE + TH derselben URL-Struktur |

### 1. On-Page-Analyse (Repo + Live)

Pro Sprache prüfen:

1. **Title / H1 / Description** – Kernphrase + Ort (`Koh Chang` / `เกาะช้าง`) vorne?
2. **Intro + bestehende H2** – kommt die Zielphrase im sichtbaren Text vor (nicht nur Meta)?
3. **Schema** – WebPage / Product|Service / FAQPage / LocalBusiness konsistent mit Seitentyp?
4. **Falsche Signale** – generische Phrasen ohne Ort (`scuba fun`, „Thailand price“ ohne Koh Chang), Shop-„product“-Wording
5. **Kurz zählen** (sichtbarer Text): Zielphrase vs. generische Phrase

### 2. Online-Keywords (passend zur Seite, EN/DE/TH)

Ziel: realistische Suchintention, nicht Keyword-Stuffing.

| Sprache | Typische Muster |
|---------|-----------------|
| **EN** | `{activity} Koh Chang`, `scuba diving cost Koh Chang`, `fun dives Koh Chang`, `boat dives Koh Chang` |
| **DE** | `Tauchpreise Koh Chang`, `Fun Dives Koh Chang`, `Bootstauchgänge Koh Chang`, `Tauchen Koh Chang Kosten` |
| **TH** | `ราคาดำน้ำเกาะช้าง`, `ฟันไดฟ์เกาะช้าง`, `ดำน้ำจากเรือเกาะช้าง` |

Hilfsmittel:

- GSC-Ideen (Query-Report der Domain, verwandte Seiten)
- SERP-Check: Top-3 Konkurrenten auf Koh Chang (Pricing / Fun Dives)
- Eigene Kurs-/Trip-Seiten + FAQ als Phrase-Quelle
- Keine Meta-Keyword-Listen als Ranking-Hebel – nur als Redaktions-Checkliste

**Ziel-Keyword-Set** (3–7 Phrasen) festhalten: Primär / Sekundär / Vermeiden.

### 3. GSC-Keywords auswerten

Excel-Sheets: **Filters** (Page-Filter prüfen), **Queries**, **Pages**.

Queries in Buckets:

| Bucket | Bedeutung |
|--------|-----------|
| **Ziel lokal** | Activity + Koh Chang (bzw. DE/TH-Äquivalent) |
| **Lokal ohne Activity** | z. B. `koh chang diving` → oft Homepage/Hub |
| **Activity ohne Ort** | z. B. `fun dive`, `scuba fun` → zu generisch |
| **Falsche Geo / Intent** | andere Insel, reines Brand, Noise |
| **Brand** | `chang diving center` |

Fragen:

1. Hat Google die **richtigen** Keywords erkannt? (Ziel lokal vorhanden?)
2. Rankt die Seite dafür? (Position, Imp., CTR)
3. Welche **falschen** Cluster ziehen Traffic/Impressions?

### 4. Urteil (1–2 Sätze)

- **On-page OK / schwach**
- **GSC-Zuordnung OK / falsch / zu früh nach Deploy**
- **Nächster Schritt**

### 5. Verbesserungen vorschlagen (strukturtreu)

Priorität typischerweise:

1. Title/Description/H1: Ort + Activity front-loaden  
2. Intro / vorhandenen Why-Absatz: Zielphrasen, generische Phrasen streichen  
3. FAQ-Schema-Fragen an Zielphrasen anpassen (wenn FAQ schon existiert)  
4. Interne Links mit exaktem Anker von `/prices/`, Hubs, verwandten Seiten  
5. GSC → URL Inspection → Indexierung anfordern  
6. 1–3 Wochen später denselben Report wiederholen  

Nach Text-Änderungen: `search-index.json` regenerieren (kompakt halten), prettier, commit.

---

## Checkliste (Copy-Paste)

```
Seite: /xx/.../
GSC-Filter: 
Datum Report:

Ziel-Keywords EN:
Ziel-Keywords DE:
Ziel-Keywords TH:

On-page: Title/H1/Desc OK? Intro lokal? Generics entfernt?
GSC Buckets: Ziel lokal | lokal ohne Activity | ohne Ort | Noise
Urteil:
Vorschläge (nur Text/Meta, Struktur gleich):
```

---

## Fallstudien (Aug 2026)

### A) `/en/prices/` (+ DE/TH)

| | Befund |
|---|--------|
| **Ziel** | `diving prices Koh Chang`, `scuba diving cost Koh Chang`, DE/TH-Äquivalente |
| **GSC** | Viele Thailand-weite Cost-Queries (Pos. ~40–50); **kaum** Price+Koh Chang |
| **Urteil** | On-page vorher zu weich („Plan your adventure“); Google sah „Thailand scuba cost“, nicht lokale Preisliste |
| **Done** | Title/H1/Intro geschärft; FAQ + FAQPage; LocalBusiness 4.8/171; „product“ → „activity“; Struktur Hub-seitig erweitert (bewusste Ausnahme) |
| **Commit** | `599690ce`, `152e49bd` |

### B) `/day-trips/fun-dives/` (EN/DE/TH)

| | Befund |
|---|--------|
| **Ziel** | `fun dives Koh Chang`, `boat dives Koh Chang`, `guided fun dives Koh Chang` |
| **GSC** | Top: `scuba fun dive center`, `scuba fun`, `fun dive` (ohne Ort); Zielphrase **fehlte** |
| **Urteil** | Title/H1 schon gut; Body/Meta pushte „scuba fun“ → falsches Cluster; Ranking für Ziel: nein |
| **Done** | Generics entfernt; Intro/Meta/OG/Why (EN) lokal gebunden; **keine** neuen Sektionen |
| **Commit** | `cd449391` |

---

## Erwarteter Zeitrahmen

| Nach Deploy | Erwartung |
|-------------|-----------|
| 0–7 Tage | Crawl / Snippet kann sich ändern |
| 1–3+ Wochen | Query-Zuordnung in GSC sichtbar |
| „Last 28 days“ | Mischt Alt- und Neu-Daten – nicht überinterpretieren |

---

## Nächste Kandidaten (Vorschlag)

In derselben Methode durchgehen (GSC-Export + Struktur halten):

1. `/en/day-trips/try-dive/` (+ DE/TH)  
2. `/en/courses/open-water-diver/`  
3. `/en/` Homepage vs. Fun Dives / Prices (Kannibalisierung `koh chang diving`)  
4. `/en/dive-sites/htms-chang-wreck/`  

Pro Seite: Report ablegen, Checkliste ausfüllen, nur strukturtreue Textfixes.

---

## Bezug

- Seitentypen / Klon-Workflow: `PAGE-TYPES.md`  
- Jump-Nav-Details: `PAGE-HEADER-JUMP-MENU-PATTERN.md`  
- Schema: `SEO-REFERENCE.md`  
- TH-Übersetzungen: `TRANSLATION-RULES-TH.md` + Glossar
