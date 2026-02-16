# Interne Link-Analyse – Chang Diving (Januar 2026)

**Stand:** Nach Implementierung der "Dive Deeper"-Sektion auf Courses und Day-trips (EN/DE/TH)

---

## 1. Übersicht: Was wurde umgesetzt

| Maßnahme | Status |
|----------|--------|
| Dive Deeper auf `/en/courses/` | ✅ 8 Kacheln |
| Dive Deeper auf `/en/day-trips/` | ✅ 8 Kacheln |
| Dive Deeper auf `/de/courses/` | ✅ 8 Kacheln |
| Dive Deeper auf `/de/day-trips/` | ✅ 8 Kacheln |
| Dive Deeper auf `/th/courses/` | ✅ 8 Kacheln |
| Dive Deeper auf `/th/day-trips/` | ✅ 8 Kacheln |
| Dive Deeper auf `/en/dive-sites/` | ✅ 9 Kacheln |
| Dive Deeper auf `/de/dive-sites/` | ✅ 9 Kacheln |
| Dive Deeper auf `/th/dive-sites/` | ✅ 9 Kacheln |

---

## 2. Link-Matrix: Wer verlinkt wen?

### 2.1 Eingehende Links auf wichtige Seiten

| Zielseite | Quellen (Beispiele) | Geschätzte Link-Anzahl |
|-----------|----------------------|-------------------------|
| **/courses/** | Courses-Index, Day-trips-Index, ~55 Posts, FAQs, About, Equipment, alle Kurs-Unterseiten, global.js | **~250+** (alle Sprachen) |
| **/day-trips/** | Courses-Index, Day-trips-Index, ~55 Posts, FAQs, About, alle Day-trip-Unterseiten | **~200+** |
| **/dive-sites/** | Courses-Index ✅, Day-trips-Index ✅, Dive-Sites-Index, 13 Dive-Site-Unterseiten, Posts, FAQs | **~80+** |
| **/weather/** | Courses-Index ✅, Day-trips-Index ✅, Equipment, Dive-Sites, FAQs | **~25+** |
| **/posts/marine-life-koh-chang/** | Courses ✅, Day-trips ✅, Posts-Submenu, ~9 Marine-Life-Posts, FAQs, Index | **~50+** |
| **/posts/scuba-knowledge/** | Courses ✅, Day-trips ✅, Posts-Submenu, ~14 Scuba-Knowledge-Posts, FAQs | **~55+** |
| **/posts/straight-talk/** | Courses ✅, Day-trips ✅, Posts-Submenu, ~10 Straight-Talk-Posts, FAQs | **~45+** |
| **/posts/tips-and-tricks/** | Courses ✅, Day-trips ✅, Posts-Submenu, ~7 Tips-Posts, FAQs | **~40+** |
| **/posts/diving-how-to-guides-koh-chang/** | Courses ✅, Day-trips ✅, Posts-Submenu, ~10 How-to-Posts, FAQs, viele Kurs-/Day-trip-Seiten | **~80+** |
| **/posts/koh-chang-diving-travel-guides/** | Courses ✅, Day-trips ✅, Posts-Submenu, ~4 Travel-Posts, FAQs | **~35+** |

### 2.2 Neue Backlinks durch Dive Deeper (pro Sprache)

Jede der 6 Seiten (courses + day-trips × 3 Sprachen) verlinkt jetzt auf:

- 6 Post-Kategorien (marine-life, scuba-knowledge, straight-talk, tips-and-tricks, diving-how-to-guides, koh-chang-diving-travel-guides)
- Dive Sites
- Weather

**Ergebnis:** Jede Post-Kategorie erhält **+6 Links** (2 pro Sprache: courses + day-trips). Dive Sites und Weather erhalten jeweils **+6 Links**.

---

## 3. Bidirektionale Verknüpfung

| Von → Nach | Vorher | Nachher |
|------------|--------|---------|
| **Posts → Courses** | ~55 Posts verlinken courses | Unverändert (bereits gut) |
| **Posts → Day-trips** | ~55 Posts verlinken day-trips | Unverändert |
| **Courses → Posts** | Kaum | ✅ 6 Kategorien × 3 Sprachen = 18 Links |
| **Day-trips → Posts** | Kaum | ✅ 6 Kategorien × 3 Sprachen = 18 Links |
| **Courses → Dive Sites** | Kaum | ✅ 3 Sprachen = 3 Links |
| **Day-trips → Dive Sites** | Kaum | ✅ 3 Sprachen = 3 Links |
| **Courses → Weather** | Kaum | ✅ 3 Sprachen = 3 Links |
| **Day-trips → Weather** | Kaum | ✅ 3 Sprachen = 3 Links |

---

## 4. Abdeckung nach Bereich

### 4.1 Kommerzielle Hubs (Courses, Day-trips)

| Bereich | Interne Links | Status |
|---------|---------------|--------|
| Courses | Stark verlinkt von Posts, FAQs, About, Equipment | ✅ Sehr gut |
| Day-trips | Stark verlinkt von Posts, FAQs, Courses | ✅ Sehr gut |

### 4.2 Content-Hubs (Post-Kategorien)

| Kategorie | Backlinks von Courses/Day-trips | Weitere Quellen | Status |
|-----------|----------------------------------|-----------------|--------|
| Marine Life | ✅ 6 | Posts, Submenu, FAQs | ✅ Gut |
| Scuba Knowledge | ✅ 6 | Posts, Submenu, FAQs | ✅ Gut |
| Straight Talk | ✅ 6 | Posts, Submenu, FAQs | ✅ Gut |
| Tips & Tricks | ✅ 6 | Posts, Submenu, FAQs | ✅ Gut |
| How-to Guides | ✅ 6 | Posts, Submenu, viele Kurs-/Trip-Seiten | ✅ Sehr gut |
| Travel Guides | ✅ 6 | Posts, Submenu, FAQs | ✅ Gut |

### 4.3 Info-Seiten (Dive Sites, Weather)

| Seite | Backlinks von Courses/Day-trips | Weitere Quellen | Status |
|-------|----------------------------------|-----------------|--------|
| Dive Sites | ✅ 6 | Dive-Site-Unterseiten, Posts, FAQs | ✅ Gut |
| Weather | ✅ 6 | Equipment, Dive-Sites, FAQs | ✅ Deutlich verbessert |

---

## 5. Noch offen / Empfehlungen

### 5.1 Dive-Sites-Index ohne Dive Deeper

Die Dive-Sites-Hauptseite (`/en/dive-sites/`, `/de/dive-sites/`, `/th/dive-sites/`) hat **keine** Dive-Deeper-Sektion. Sie verlinkt aktuell nur über das globale Menü und interne Verweise.

**Empfehlung:** Dive Deeper auch auf der Dive-Sites-Index-Seite ergänzen – mit Kacheln zu:
- 6 Post-Kategorien
- Courses
- Day-trips
- Weather

Damit entsteht ein vollständiges Dreieck: Courses ↔ Day-trips ↔ Dive-Sites ↔ Posts.

### 5.2 Einzelne Posts mit wenig Backlinks

Einige Posts (z.B. tech-package, intro-to-tech, sdi-ie) haben weniger interne Links als andere. Das ist akzeptabel, da sie thematisch nischig sind.

### 5.3 Broken Links – behoben (Jan 2026)

- `/courses/advanced-open-water/` → `/courses/advanced/` ✅
- `/courses/advanced-open-water-diver/` → `/courses/advanced/` ✅
- `/courses/technical-diving/` → `/courses/technical-diving-courses/` ✅

---

## 6. Fazit

| Aspekt | Bewertung |
|--------|-----------|
| **Bidirektionale Verknüpfung** | ✅ Deutlich verbessert |
| **Post-Kategorien** | ✅ Alle 6 von Courses + Day-trips verlinkt |
| **Dive Sites** | ✅ Von Courses + Day-trips verlinkt |
| **Weather** | ✅ Von Courses + Day-trips verlinkt |
| **Sprachabdeckung** | ✅ EN, DE, TH konsistent |
| **Dive-Sites-Index** | ⏳ Noch ohne Dive Deeper |

**Gesamt:** Das interne Link-Netz ist deutlich dichter und bidirektional. Courses und Day-trips fungieren jetzt als starke Hubs, die Content, Dive Sites und Weather verknüpfen. Ein nächster sinnvoller Schritt wäre die Dive-Deeper-Sektion auf der Dive-Sites-Index-Seite.
