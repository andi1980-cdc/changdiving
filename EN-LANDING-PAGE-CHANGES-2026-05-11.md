# /en/ Landing Page – Änderungen vom 11. Mai 2026

Basis: GSC-Analyse (letzte 28 Tage, 1.908 Impressions, Ø Pos 10.35, 75 % Mobile-Traffic).
Ziel: Mobile H1-Sichtbarkeit, Meta-Konsistenz, Schema-Korrektheit – ohne bestehende Rankings zu riskieren.

---

## A · Meta / Social Tags

| Tag | Vorher | Nachher |
|-----|--------|---------|
| `meta description` | `"…reef and wreck adventures… Book online today!"` | `"…reef and HTMS Chang wreck adventures…"` (kein CTA, 151 Zeichen) |
| `og:description` | wie oben | wie oben |
| `twitter:description` | wie oben | wie oben |
| `og:image:alt` | `"Scuba Diving Koh Chang Thailand - Chang Diving Center"` | `"Scuba Diving Koh Chang Thailand - Diving Courses & Fun Dives"` |
| `twitter:image:alt` | fehlte komplett | neu hinzugefügt, identisch mit `og:image:alt` |

**Warum:** "HTMS Chang" hat 482 Impressions auf pos 4.0 mit nur 1 % CTR – Keyword in der Description erhöht Klickrate. `twitter:image:alt` ist Pflicht für korrekte Twitter-Card-Validierung.

---

## B · Critical CSS / Mobile Hero

| Was | Vorher | Nachher |
|-----|--------|---------|
| Hero `class` | `class="hero"` | `class="hero hero--transactional"` |
| Mobile CSS `≤767px` | `.hero-text h1, p { visibility: hidden; height: 0; margin: 0; padding: 0; }` | Block entfernt |

**Warum:** Ohne `hero--transactional` Modifier-Klasse greift das globale `style.min.css` nicht – die H1 war auf Mobile (75 % des Traffics) faktisch unsichtbar. Google indexiert Mobile-first. Nach dem Fix: H1 erscheint weiß, zentriert über dem Hero-Bild (via `style.min.css` Regeln für `.hero--transactional`).

---

## C · Content

| Was | Vorher | Nachher |
|-----|--------|---------|
| Erstes `<h2>` | `"Scuba Diving in Koh Chang – Fun Dives, Courses & Wreck Adventures"` | `"Koh Chang Diving with Chang Diving Center – Trusted Since 2005"` |
| Absatz 2, Wreck-Satz | `"…HTMS Chang – we've got you covered"` | `"…HTMS Chang with our **specialised recreational and technical dive team** – we've got you covered"` |

**Warum H2:** Das alte H2 war ein fast wörtliches Duplikat der H1 – das schwächt interne Keyword-Relevanz. Das neue H2 differenziert (Vertrauen/Erfahrung seit 2005).

**Warum Wreck-Satz:** Signalisiert Spezialisierung in recreational UND technical wreck diving, ohne factual falsche Aussagen über Zulassungsvoraussetzungen zu machen. Kein Widerspruch zu `/en/dive-sites/htms-chang-wreck/` oder `/en/posts/straight-talk/htms-chang-wreck-penetration/`.

---

## D · JSON-LD Schema

| Was | Vorher | Nachher |
|-----|--------|---------|
| `LocalBusiness.geo` latitude | `12.06321` (falsch) | `12.0464` (korrekt) |
| `LocalBusiness.geo` longitude | `102.28982` (falsch) | `102.3480` (korrekt) |
| `CourseInstance.startDate` × 13 | `"2025-06-10"` (veraltet) | `"2026-06-01"` |

**Warum GPS:** Die alten Koordinaten wichen von allen anderen Seiten ab und stimmten nicht mit der Adresse (21/52 M 4, Klong Prao Beach) überein. Referenz: `en/day-trips/fun-dives/index.html`.

**Warum startDate:** Google bevorzugt aktuelle/zukünftige Daten in CourseInstance. Alle 13 Einträge zeigten auf Juni 2025 – über ein Jahr in der Vergangenheit.

---

## Rollout auf /de/ und /th/

Die Änderungen sind direkt übertragbar. Checkliste pro Sprache:

### Identisch übernehmen (kein Übersetzen nötig)
- [ ] `hero--transactional` Klasse setzen
- [ ] Lokalen `visibility: hidden` Block im critical-CSS entfernen (nur `.hero-text h1, p`-Block, `.hero` und `.hero picture` mobile Regeln behalten)
- [ ] `twitter:image:alt` ergänzen (= Wert von `og:image:alt`)
- [ ] `GeoCoordinates` auf `12.0464 / 102.3480` prüfen/korrigieren
- [ ] Alle `CourseInstance.startDate` von veralteten Werten auf `2026-06-01` aktualisieren

### Übersetzen / anpassen
- [ ] Meta description: jeweiliges Äquivalent für "HTMS Chang wreck adventures" einbauen, CTA prüfen, Zeichenanzahl ≤ 160 sicherstellen
- [ ] `og:image:alt` + `twitter:image:alt`: auf die jeweilige H1 der Seite alignieren
- [ ] Erstes H2: Duplikat zur H1 prüfen, ggf. differenzieren
- [ ] Wreck-Satz: `"specialised recreational and technical dive team"` übersetzen und einfügen

### Hinweis Title
Der Title `"Scuba Diving Koh Chang | English • Deutsch • ไทย | Chang Diving"` wurde **bewusst beibehalten** – der Sprachselektor ist ein Klick-Differenziator für die internationale Zielgruppe und der bisherige Ranking-Erfolg (1.000+ Keywords) bestätigt, dass er funktioniert.

---

## Referenz

- Muster-Implementierung Mobile Hero: `en/day-trips/fun-dives/index.html` (Commit `da0c50cd`)
- CSS-Regeln: `style.css` Zeilen 1683–1723 (`.hero--fun-dives`, `.hero--transactional`)
- Vollständige Strategie-Analyse: Canvas `en-landing-page-strategy.canvas.tsx`
- GSC-Rohdaten: `changdiving.com-Performance-on-Search-2026-05-11.xlsx`
