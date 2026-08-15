# Thai Translation Rules — changdiving.com

**Role:** `living`

Standardisierter Prompt für die Übersetzung von HTML-Seiten ins Thai.  
Einbinden per `@TRANSLATION-RULES-TH.md` in jeden Übersetzungs-Chat.  
Terminologie-Referenz: `@GLOSSARY-EN-TH.md` (inkl. **§18** Site-Terms: Marke, เกาะช้าง, เรือจม, **ฟันไดฟ์**, … — Glossar schlägt bei Widerspruch zu allgemeinen „Englisch belassen“-Listen).

---

## Aufgabe

Übersetze ein vollständiges HTML-Dokument vom Englischen (oder Deutschen) ins Thai.

---

## PFLICHTREGELN

### 1. HTML-Struktur NICHT verändern
- Alle Tags exakt beibehalten
- Keine Elemente entfernen, umsortieren oder hinzufügen
- Klassen, IDs, Scripts und JSON-LD NICHT anfassen

### 2. Nur sichtbaren Textinhalt übersetzen
- Text zwischen HTML-Tags übersetzen
- Attribute wie `href`, `src` unverändert lassen
- `alt`-Texte übersetzen, wenn sie inhaltlich sinnvoll sind

### 3. Keine Inhaltsänderungen
- Nicht kürzen
- Nicht umschreiben
- Nicht interpretieren
- Keine zusätzliche Werbesprache einfügen

### 4. Taucherterminologie
- Internationale Begriffe beibehalten, wenn geläufig:
  - Nitrox, Deco, Trimix, Sidemount, Twinset, Stage
  - Deep Dive, Wreck Dive, Divemaster
  - Advanced Open Water, Open Water
- Site-Terms (Fun Dive → **ฟันไดฟ์**, Wreck → **เรือจม**, Marke, …): **Glossar §18**, nicht frei erfinden
- Technische Fachbegriffe NICHT falsch lokalisieren
- Referenz: `@GLOSSARY-EN-TH.md`

### 5. SEO-Elemente natürlich übersetzen
- `<title>` — max. 65 Zeichen, Markenname am Ende: `| ช้างไดฟ์วิ่ง`
- `<meta name="description">` — 120–160 Zeichen, natürliches Thai
- Überschriften H1–H3 — kein wörtliches Übertragen, sinngemäß
- `alt`-Texte — beschreibend, kein Keyword-Stuffing

### 6. Zahlen & Daten
- Alle Zahlen identisch lassen
- Währung THB unverändert
- Maßangaben unverändert

### 7. URLs & Links
- URLs NICHT verändern
- Slugs NICHT übersetzen
- Sprachpräfixe `/en/`, `/de/`, `/th/` unberührt lassen

### 8. JSON-LD / Strukturierte Daten
- Struktur NICHT verändern
- Nur menschlich lesbare Textfelder übersetzen: `name`, `description`, `headline`, `keywords`, `text`

---

## Qualitätskontrolle vor dem Output

- [ ] HTML-Struktur 100 % unverändert?
- [ ] Alle sichtbaren Texte übersetzt?
- [ ] Thai klingt natürlich (kein Maschinenton)?
- [ ] Bedeutung identisch mit Original?
- [ ] Kursnamen auf Englisch belassen?
- [ ] Meta-Längen eingehalten?

---

## Output-Format

- Vollständiges HTML-Dokument zurückgeben
- Sauber, copy-paste-ready
- Keine Erklärungen
- Keine Markdown-Kommentare
- Kein Code-Block-Wrapping (nur reines HTML)

---

## Bekannte Fallstricke (changdiving.com-spezifisch)

| Falsch | Richtig | Grund |
|---|---|---|
| `Chang Diving` im Thai-Title | `ช้างไดฟ์วิ่ง` | Markenname Thai-konsistent |
| `ดำซาก` | `ดำน้ำเรือจม` | natürlicheres Thai |
| `การอนุรักษ์แบบสันจมูก` | `ข้อจำกัดของการดำน้ำแบบ recreational` | falsche Maschinentranslation |
| `จากสันจมูกสู่เทคนิค` | `เส้นทางสู่ดำน้ำเทคนิค` | sinnloser Term |
| `Tarierung` | `การควบคุมการลอยตัวและทริม (trim)` | deutsches Wort im Thai-Text |
| `สัญญาณสั่นของสายตา` | `ชั้นน้ำ thermocline` | falsche Übersetzung |
| `ดำน้ำทั่ว` | `การดำน้ำทั่วไป` | unvollständiger Ausdruck |
| `มีประสบการณ์สายตาบ้าง` | `มีประสบการณ์ดำน้ำในสภาพทัศนวิสัยต่ำบ้าง` | "สายตา" = Sehvermögen, nicht Sicht |
| `เรือจมที่ทำตัวเหมือนเรือจมจริง` | `เรือจมที่มีโครงสร้างจริงและมีภาระงานจริง` | redundante Formulierung |
| `Koh Chang` + `ช้างไดฟ์วิ่ง` im Title nebeneinander | nur `| ช้างไดฟ์วิ่ง` | redundant (ช้าง in beiden) |
