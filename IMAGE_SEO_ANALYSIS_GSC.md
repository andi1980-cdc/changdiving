# Bild-SEO Analyse – Google Search Console (Image Search)

**Datenbasis:** GSC Performance Export 16.03.2026, Filter: **Search type = Image**  
**Zeitraum:** Last 28 days

---

## 1. GSC-Kennzahlen: Das Problem

### Top Image-Queries (Impressions vs. Clicks)

| Query | Impressions | Clicks | CTR |
|-------|-------------|--------|-----|
| walhai | 633 | 0 | 0% |
| titan triggerfish | 394 | 0 | 0% |
| whale shark underwater | 380 | 0 | 0% |
| whale shark swimming underwater | 138 | 0 | 0% |
| koh chang snorkeling | 124 | 0 | 0% |
| whale sharks | 118 | 0 | 0% |
| whale shark thailand | 45 | 0 | 0% |
| blacktip reef shark thailand snorkeling | 50 | 0 | 0% |
| titan triggerfish coral reef | 68 | 0 | 0% |

### Top Image-Pages (hohe Impressions, kaum Klicks)

| Page | Impressions | Clicks | CTR |
|------|-------------|--------|-----|
| marine-life-koh-chang (EN) | 4.780 | 1 | ~0,02% |
| marine-life-titan-triggerfish (EN) | 4.734 | 1 | ~0,02% |
| snorkeling (EN) | 4.702 | 1 | ~0,02% |
| marine-life-whale-shark (EN) | 3.052 | 0 | 0% |
| marine-life-blacktip-reef-shark (EN) | 2.807 | 0 | 0% |
| koh-rang-pinnacle | 2.984 | 1 | ~0,03% |

**Fazit:** Bilder werden angezeigt (hohe Impressions), aber fast niemand klickt. Google interpretiert das als schlechte Relevanz und kann das Ranking senken.

---

## 2. Ursachenanalyse: Warum ranken die Bilder schlecht?

### 2.1 Generische Alt-Texte (Hauptproblem)

**Aktuell (Beispiel Whale Shark):**
```
alt="marine life whale shark blog header – scuba tips, marine life, how-to guides and diving knowledge for Koh Chang"
```

**Suchanfragen der User:** „whale shark thailand“, „whale shark underwater“, „whale shark swimming“

**Problem:** Der Alt-Text beschreibt die Seite, nicht das Bild. Für die Bildsuche braucht Google eine klare, thematische Beschreibung des Bildinhalts.

**Empfohlen (Beispiel):**
```
alt="Whale shark swimming underwater at HTMS Chang wreck, Koh Chang, Thailand"
```

### 2.2 Blog-Header-Template (über 60 Seiten betroffen)

Viele Seiten nutzen denselben generischen Alt-Text:
```
alt="[thema] blog header – scuba tips, marine life, how-to guides and diving knowledge for Koh Chang"
```

**Betroffene Seiten u.a.:**
- marine-life-whale-shark, marine-life-titan-triggerfish, marine-life-blacktip-reef-shark
- marine-life-barracuda, marine-life-green-sea-turtle, marine-life-nudibranch, marine-life-batfish
- snorkeling, wreck-diving-koh-chang, dive-sites

**Lösung:** Jeder Blog-Header braucht einen themenspezifischen Alt-Text, der das konkrete Motiv beschreibt.

### 2.3 Doppelte Alt-Texte

Auf der HTMS-Chang-Seite z.B.:
- „HTMS Chang wreck dive site – overview from the surface“ (2×)
- „Divers descending onto the HTMS Chang wreck in Koh Chang“ (2×)
- „Structure of HTMS Chang underwater with coral growth“ (2×)
- „Marine life around the HTMS Chang wreck“ (2×)

**Problem:** Gleicher Alt für unterschiedliche Bilder wirkt wie Duplicate Content und hilft Google nicht bei der Einordnung.

### 2.4 Fehlende Suchbegriffe im Alt-Text

| Suchanfrage | Typischer Alt-Text | Passt? |
|-------------|--------------------|--------|
| whale shark thailand | „marine life whale shark blog header…“ | ❌ |
| titan triggerfish coral reef | „marine life titan triggerfish blog header…“ | ❌ |
| blacktip reef shark snorkeling thailand | „marine life blacktip reef shark blog header…“ | ❌ |
| koh chang snorkeling | Snorkeling-Seite: Header-Alt? | Prüfen |
| htms chang wreck | „HTMS Chang Wreck – Thailand's Largest Shipwreck“ | ✅ |

### 2.5 Dateinamen

Teils wenig aussagekräftig:
- `htms-chang01.webp`, `htmschang05.webp` → besser: `htms-chang-wreck-overview.webp`
- `walhai_23_1_26.webp` → besser: `whale-shark-htms-chang-jan-2026.webp`

*(Dateinamen-Änderungen nur mit 301-Weiterleitung oder wenn Bilder neu ausgeliefert werden.)*

---

## 3. Priorisierte Handlungsempfehlungen

### Priorität 1: Marine-Life-Seiten (höchste Impressions)

| Seite | Aktueller Alt (Header) | Empfohlener Alt |
|-------|------------------------|------------------|
| marine-life-whale-shark | marine life whale shark blog header… | Whale shark swimming underwater at Koh Chang, Thailand – gentle giant encounter |
| marine-life-titan-triggerfish | marine life titan triggerfish blog header… | Titan triggerfish on coral reef, Koh Chang – territorial fish with yellow fins |
| marine-life-blacktip-reef-shark | marine life blacktip reef shark blog header… | Blacktip reef shark in Thailand – snorkeling and diving Koh Chang |
| marine-life-barracuda | marine life barracuda blog header… | Great barracuda schooling, Koh Chang dive site |
| marine-life-green-sea-turtle | marine life green sea turtle blog header… | Green sea turtle resting on reef, Koh Chang, Thailand |
| marine-life-nudibranch | marine life nudibranch blog header… | Colorful nudibranch on coral, Koh Chang – macro diving Thailand |
| marine-life-batfish | marine life batfish blog header… | Longfin batfish hovering near coral, Koh Chang |

### Priorität 2: Dive-Sites mit hohen Impressions

| Seite | Fokus-Keywords | Alt-Anpassung |
|-------|----------------|---------------|
| htms-chang-wreck | htms chang, whale shark, wreck | Doppelte Alt-Texte differenzieren (z.B. „Bow“, „Stern“, „Deck mit Korallen“) |
| koh-rang-pinnacle | koh rang, pinnacle, coral reef | Header-Alt: „Koh Rang pinnacle dive site – coral reef Koh Chang“ |
| snorkeling | koh chang snorkeling | Header-Alt: „Snorkeling Koh Chang – tropical reef and marine life“ |
| hin-pray-nam | (TH-Seite, viele Impressions) | Prüfen: spezifischer Alt für Hauptbilder |
| secret-reef | coral reef, marine life | Header-Alt prüfen und anpassen |

### Priorität 3: Blog-Header-Template

**Generisches Template ersetzen durch:**
```
alt="[Konkretes Motiv] – [Ort/Kontext], Koh Chang, Thailand"
```

**Beispiele:**
- Whale Shark: „Whale shark swimming over wreck, Koh Chang, Thailand“
- Titan Triggerfish: „Titan triggerfish defending nest, coral reef Koh Chang“
- Blacktip: „Blacktip reef shark in shallow water, Thailand“

### Priorität 4: Technische Prüfpunkte

- [ ] `og:image:alt` für Social/Google (teilweise vorhanden, z.B. HTMS Chang)
- [ ] Keine leeren `alt=""` (bereits erfüllt)
- [ ] `fetchpriority="high"` für Above-the-fold-Bilder (optional)
- [ ] Bildgrößen/Seitenverhältnisse für Google Images (aspect ratio)

---

## 4. Alt-Text-Checkliste pro Bild

1. **Beschreibt das Bild** – Was ist konkret zu sehen?
2. **Enthält Haupt-Keywords** – z.B. „whale shark“, „Koh Chang“, „Thailand“
3. **Ist einzigartig** – Kein identischer Alt für mehrere Bilder
4. **Länge** – ca. 80–125 Zeichen (ausreichend, aber nicht überladen)
5. **Natürlich** – Lesbar und nicht keyword-stuffing

---

## 5. Nächste Schritte

1. **Phase 1:** Marine-Life-Header-Alt-Texte anpassen (EN, DE, TH)
2. **Phase 2:** Dive-Site-Header und Doppel-Alt-Texte bereinigen
3. **Phase 3:** Blog-Header-Template systematisch ersetzen
4. **Monitoring:** GSC Image Performance nach 4–8 Wochen prüfen (Impressions, CTR, Position)

---

*Erstellt: 16.03.2026 | Daten: changdiving.com-Performance-on-Search-2026-03-16.xlsx*
