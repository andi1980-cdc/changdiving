# SEO Reference – Chang Diving Center

**Stand:** Juli 2026 | Konsolidiert aus früheren Analyse-Dokumenten

---

## 1. Schema.org Matrix

| Seitentyp | LocalBusiness | Breadcrumb | Course | FAQPage | Article/BlogPosting | aggregateRating |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Courses** | ✅ | ✅ | ✅ | wenn FAQ vorhanden | – | ✅ |
| **Day-trips** | ✅ | ✅ | – | – | – | ✅ |
| **Dive-sites** | ✅ | ✅ | – | – | – | ✅ |
| **FAQs** | ✅ | ✅ | – | ✅ | – | ✅ |
| **Posts / Articles** | ❌ | ✅ | – | wenn FAQ vorhanden | ✅ BlogPosting | ❌ |
| **about, contact, prices** | ❌ | ✅ | – | – | – | ❌ |
| **Index (en/de/th)** | ✅ | – | ✅ | – | – | ✅ |
| **404 / 410** | ✅ | – | – | – | – | ✅ |

**Regel:** `aggregateRating` nur auf Seiten **mit Trustindex-Widget** (~186 Seiten).

---

## 2. Seitenstruktur (Stand Juli 2026)

| Kategorie | Anzahl |
|-----------|--------|
| HTML-Dateien gesamt | ~430 |
| Content-Seiten (en/de/th) | ~135 × 3 = 405 |
| Seiten im Search-Index | 123 pro Sprache |
| Seiten in Sitemap | ~376 URLs |

---

## 3. Interne Verlinkung – Status

### ✅ Abgeschlossen
- **Phase 1** – Quick Wins (EN): Safety Check, Safety Stop, Gas Consumption, Dive Logbook, Dive Computer
- **Phase 2** – Course → Article Links (EN): OWD, Advanced, Nitrox, Deep Diver, Wreck, Rescue, Divemaster
- **Phase 3** – Knowledge Base Cross-Linking (EN/DE/TH): Cluster-Boxen auf ~15 Artikeln
- **Scuba Diver Kurs** in interne Links auf which-course, how-to-try-dive, theory-review, diving-activities eingebaut

### ⏳ Noch offen – Phase 1 DE/TH Einzellinks

| Datei | Link |
|-------|------|
| `/de/posts/tips-and-tricks/deep-diving/` | → Gas Consumption (DE) |
| `/de/posts/scuba-knowledge/dive-logbook/` | → Best Dive Computers (DE) |
| `/de/posts/scuba-knowledge/safety-check/` | → Safety Stop (DE) |
| `/de/posts/scuba-knowledge/safety-stop/` | → Using a Dive Computer (DE) |
| `/th/posts/scuba-knowledge/gas-consumption/` | → Deep Diving (TH) |
| `/th/posts/tips-and-tricks/deep-diving/` | → Gas Consumption (TH) |
| `/th/posts/scuba-knowledge/dive-logbook/` | → Best Dive Computers (TH) |
| `/th/posts/scuba-knowledge/safety-check/` | → Safety Stop (TH) |
| `/th/posts/scuba-knowledge/safety-stop/` | → Using a Dive Computer (TH) |

### ⏳ Noch offen – Phase 4: Dive Sites

| Dive Site | Empfohlene Kurs-Links | Artikel-Links |
|-----------|----------------------|---------------|
| HTMS Chang | Wreck Diver, Advanced Wreck, Deep Diver | Wreck Diving Koh Chang, Deep Diving |
| Koho Maru 5 | Deep Diver, Tech Diving, Wreck Diver | Deep Diving, Gas Consumption |
| Blueberry Hill | Open Water, Try Dive | Safety Check, Using a Dive Computer |
| Hin Pray Nam | Open Water, Try Dive, Scuba Review | Safety Check, Safety Stop |
| Hin Raab North | Advanced, Deep Diver | Deep Diving, Gas Consumption |

---

## 4. HTML-Cluster-Box Templates

### "Further Reading" Box (Kurs-Seiten)

```html
<div style="margin:3em 0 2em;padding:24px;background:linear-gradient(to right,rgba(0,119,182,.05),rgba(207,216,220,.05));border-left:5px solid #0077b6;border-radius:8px;">
  <h3 style="color:#0077b6;font-size:22px;margin-bottom:1em;">📚 Recommended Reading</h3>
  <ul style="list-style:none;padding:0;line-height:2;">
    <li>📖 <a href="/en/posts/..." style="font-weight:600;color:#0077b6;text-decoration:none;"><strong>Article Title</strong></a> – Why it matters</li>
  </ul>
</div>
```

### Safety Essentials Cluster (Artikel-Seiten)

```html
<div style="margin:2.5em 0;padding:24px;background:linear-gradient(135deg,rgba(0,119,182,.05),rgba(207,216,220,.05));border-left:5px solid #e74c3c;border-radius:8px;">
  <h3 style="color:#e74c3c;font-size:22px;margin-bottom:1em;">🛡️ Safety Essentials Series</h3>
  <ul style="list-style:none;padding:0;line-height:2;">
    <li>✅ <a href="/en/posts/scuba-knowledge/safety-check/" style="color:#0077b6;">Pre-Dive Safety Check (BWRAF)</a></li>
    <li>⏱️ <a href="/en/posts/scuba-knowledge/safety-stop/" style="color:#0077b6;">Safety Stop Procedures</a></li>
    <li>💻 <a href="/en/posts/scuba-knowledge/using-a-divecomputer/" style="color:#0077b6;">Using Your Dive Computer</a></li>
    <li>⛽ <a href="/en/posts/scuba-knowledge/gas-consumption/" style="color:#0077b6;">Gas Consumption & Management</a></li>
  </ul>
</div>
```

---

## 5. Search-Index regenerieren

Ausführen nach jeder neuen Seite oder geändertem Titel/Description:

```bash
cd /Users/andismac/Desktop/cdc_git
python3 - <<'PYEOF'
# → Vollständiges Script steht in CLAUDE.md unter "Search Index"
PYEOF
git add search-index.json && git commit -m "chore: regenerate search-index.json"
```

---

## 6. Sitemap-Regeln

- Neue Seiten: in `sitemap.xml` eintragen mit `<lastmod>YYYY-MM-DD</lastmod>`
- Bei Inhaltsänderungen: `<lastmod>` der betroffenen Seite aktualisieren
- Prioritäten: Kurse/Day-trips `0.85` · Posts `0.65` · Hubs `0.9`
- Nach Änderungen: In Google Search Console Sitemap neu einreichen

---

## 7. Wichtige Dateipfade

Projekt-Notizen liegen unter `project-docs/` (nicht verwechseln mit `docs/` = PDFs).

| Datei | Zweck |
|-------|-------|
| `claude.md` / `CLAUDE.md` | AI-Workspace-Regeln (Root, wird automatisch geladen) |
| `project-docs/HERO-TRANSACTIONAL-PATTERN.md` | Muster für Hero-Sections auf Money-Pages |
| `project-docs/PAGE-HEADER-JUMP-MENU-PATTERN.md` | H1 unter Hero + Jump-Menü (aktueller Standard) |
| `project-docs/MOBILE-PERF-GOLD-PATTERN.md` | LCP/CLS Mobile-Checkliste |
| `project-docs/KEYWORD-GSC-PAGE-ANALYSIS.md` | Keyword ↔ GSC Seitenanalyse |
| `project-docs/SEO-REFERENCE.md` | Schema-/SEO-Referenz |
| `project-docs/TRANSLATION-RULES-TH.md` | Regeln für Thai-Übersetzungen |
| `project-docs/GLOSSARY-TECHNICAL-CAVE-TH.md` | Thai-Glossar Tauchen & Tech-Diving |
| `project-docs/README_SITEMAP.md` | Sitemap-Generator Dokumentation |
| `README.md` | Projekt-Übersicht & Setup |
| `search-index.json` | Statischer Such-Index (generiert, nicht manuell bearbeiten) |
| `functions/[[path]].js` | Cloudflare Edge-Function (Sprach-Redirect, 301s) |
| `docs/` | Öffentliche PDF-Dokumente (Liability, Medical, …) |
