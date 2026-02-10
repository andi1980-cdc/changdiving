# Sitemap Generator with Git Dates

## Problem

Die automatisch generierte `sitemap.xml` zeigte bei allen Dateien das aktuelle Datum, auch wenn diese nicht geändert wurden. Das ist schlecht für SEO, da Google denkt alle Seiten wurden aktualisiert.

## Lösung

Das Python-Script `generate_sitemap.py` generiert eine korrekte Sitemap basierend auf **echten Git-Commit-Daten**.

## Features

✅ Liest das letzte Commit-Datum für **jede HTML-Datei** aus Git  
✅ Generiert automatisch eine korrekte `sitemap.xml`  
✅ Nur Dateien mit echten Änderungen bekommen neues Datum  
✅ Automatische Priorisierung (Homepage = 1.0, Courses = 0.9, etc.)  
✅ Automatische `changefreq` Einstellungen

## Verwendung

### 1. Sitemap generieren

```bash
python3 generate_sitemap.py
```

### 2. Ergebnis prüfen

```bash
# Wie viele Dateien wurden heute geändert?
grep "$(date +%Y-%m-%d)" sitemap.xml | wc -l

# Welche Dateien wurden heute geändert?
grep -B2 "$(date +%Y-%m-%d)" sitemap.xml | grep "<loc>"
```

### 3. Committen und pushen

```bash
git add sitemap.xml
git commit -m "Update sitemap with correct Git dates"
git push origin main
```

## Workflow

**Ab jetzt IMMER nach SEO-Änderungen:**

1. ✅ Seiten optimieren und committen
2. ✅ `python3 generate_sitemap.py` ausführen
3. ✅ Neue `sitemap.xml` committen
4. ✅ Fertig!

## Technische Details

### Prioritäten

- **Homepage (/)**: 1.0, weekly
- **Courses (/courses/)**: 0.9, monthly
- **Day Trips (/day-trips/)**: 0.9, monthly
- **Dive Sites (/dive-sites/)**: 0.8, monthly
- **Posts (/posts/)**: 0.7, monthly
- **Rest**: 0.6, monthly

### Ausgeschlossene Ordner

Das Script ignoriert automatisch:

- `.git`
- `node_modules`
- `.cursor`
- `terminals`
- `docs`, `fonts`, `img`, `js`, `css`

### Sprachen

Scannt automatisch: `en/`, `de/`, `th/`

## Beispiel-Output

```
🗺️  SITEMAP GENERATOR WITH GIT DATES
======================================================================
🔍 Finding HTML files...
   Found 394 HTML files

📅 Getting Git modification dates...
   ✓ /en/courses/deep-diver/                            2026-01-27
   ✓ /en/courses/wreck-diver/                           2026-01-27
   ✓ /en/courses/advanced/                              2026-01-26
   ✓ /en/courses/open-water-diver/                      2026-01-01

✅ Generated sitemap.xml with 394 URLs
```

## Vorteile

### ✅ SEO-Freundlich

- Google sieht nur echte Änderungen
- Keine falschen "Updated" Signale
- Bessere Crawl-Effizienz

### ✅ Automatisch

- Kein manuelles Datum-Setzen nötig
- Git ist die Single Source of Truth
- Immer korrekt und aktuell

### ✅ Transparent

- Klare Ausgabe aller generierten URLs
- Einfach zu prüfen
- Nachvollziehbare Daten

## Support

Bei Problemen das Script mit `-h` aufrufen oder den Code in `generate_sitemap.py` prüfen.
