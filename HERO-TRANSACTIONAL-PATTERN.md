# Transactional Hero: Muster für späteren Projekt-Rollout

> **Update Juli 2026:** Für Day-Trip-/Kurs-Seiten gilt jetzt zusätzlich das Muster **H1 unter dem Hero + einheitliches Jump-Menü** – siehe [`docs/PAGE-HEADER-JUMP-MENU-PATTERN.md`](docs/PAGE-HEADER-JUMP-MENU-PATTERN.md).  
> **Performance:** LCP/CLS-Goldmuster (Preload, Critical CSS, defer, Hub-Karten lazy) → [`docs/MOBILE-PERF-GOLD-PATTERN.md`](docs/MOBILE-PERF-GOLD-PATTERN.md).  
> Dieses Dokument bleibt relevant für Money-Keywords, Meta/JSON-LD und Mobile-Hero-Klassen.

Beschreibt das auf **Fun Dives** umgesetzte Muster (Money-Keywords im sichtbaren Hero, konsistente Metadaten, Mobile-Hero ohne doppelte Überschrift). So kannst du es **seitenweise oder später projektweit** übernehmen.

## Referenz im Git

| Was | Wert |
|-----|------|
| Referenz-Commit (reine Code-Änderung) | `da0c50cd` |
| Git-Tag (falls gesetzt) | `transactional-hero-pattern` |

Nützliche Befehle:

```bash
# Nur die Änderungen dieses Commits ansehen
git show da0c50cd --stat
git show da0c50cd -- en/day-trips/fun-dives/index.html

# Unterschied zu einem anderen Branch/Stand
git diff main~1..main -- style.css en/day-trips/fun-dives/index.html
```

## 1. Inhalt: „Money keywords“ ausrichten

Pro Sprache **dieselbe Kernaussage** in:

- `<title>` (bereits vorhanden oder anpassen)
- **`<h1>`** im Hero: gleiche Keywords wie im Titel, **ohne** Pipe-Marke am Ende (z. B. ohne `| Chang Diving`)
- **`alt`** des Hero-Bildes: wie H1 (kurz, keyword-stark)
- **`og:title`**, **`twitter:title`**, **`og:image:alt`**: wie `<title>` (inkl. Marke, falls im Titel)
- **JSON-LD** `WebPage.name`, sowie wo sinnvoll `Service.name` und `TouristTrip.name`: passend zu Titel/H1 (Preis/Angebot wo relevant)

**Referenzdateien:** `en/day-trips/fun-dives/index.html`, `de/...`, `th/...`

## 2. Markup: Hero-Klasse für Mobile

Auf Seiten, die **dieselbe Mobile-Hero-Logik** brauchen:

- **Fun Dives:** `class="hero hero--fun-dives"`
- **Weitere kaufnah/Preis-Seiten:** `class="hero hero--transactional"` (z. B. Try Dive, Open Water, OWD+AOWD-Paket)

**Referenz:** `en/day-trips/fun-dives/index.html`, `en/day-trips/try-dive/index.html`, `en/courses/open-water-diver/index.html`, …

## 3. CSS (global)

Die Regeln hängen an **`.hero--fun-dives`** und **`.hero--transactional`** (gleicher Block) in:

- `style.css`
- `style.min.css` (gleicher Block, minifiziert)

Verhalten **≤767px**: H1 zentriert über dem Bild (weiß + Schatten), Teaser-`<p>` nur noch screenreader-tauglich versteckt (nicht beide Überschriften doppelt zeigen).

## Kategorie-Hubs (z. B. `/courses/`)

- **Nur Mobile-Hero:** `hero hero--transactional` + page-lokales `@media` entfernen, das **H1 und `<p>`** auf kleinen Screens versteckt. **H1/Meta/Preis** können unverändert bleiben, wenn die Headline schon suchintention trifft.
- **Preis im Titel/H1** später optional, wenn ein **„ab …“**-Preis klar der Einstieg auf der Seite ist (z. B. günstigster Kurs sichtbar).

## Rollout auf das ganze Projekt

1. **Pro Seite:** Checkliste oben abarbeiten; Hero-Klasse setzen; Preis/Ort nur wo faktisch korrekt.
2. **CSS:** Fun Dives nutzt `hero--fun-dives`; andere Landingpages **`hero--transactional`** – beide teilen sich dieselben Mobile-Regeln in `style.css` / `style.min.css`.
3. **Nicht** alle Heroes blind mit Preis füllen: nur **kaufnah** / buchbare URLs.

## Abgrenzung

- Kein zweites `<h2>` direkt unter dem Hero mit **demselben** Text wie H1 (war früher redundant).
- Mobile: globale `.hero`-Regeln in `style.min.css` können andere Seiten beeinflussen; deshalb **Modifier-Klasse** am Hero-Container nutzen.
