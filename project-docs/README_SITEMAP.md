# Sitemap Generator with Git Dates

**Role:** `ops`  
**Stand:** August 2026  

`generate_sitemap.py` (repo root) builds `sitemap.xml` using **Git last-commit dates** per HTML file — not “today” for every URL.

## Usage

```bash
cd /Users/andismac/Desktop/cdc_git
python3 generate_sitemap.py
```

Check today’s entries:

```bash
grep "$(date +%Y-%m-%d)" sitemap.xml | wc -l
grep -B2 "$(date +%Y-%m-%d)" sitemap.xml | grep "<loc>"
```

Commit `sitemap.xml` when the URL set or dates should ship (only if the user asks to commit). After large URL changes, resubmit the sitemap in Google Search Console if needed.

## Priorities (script)

| Path pattern | Priority | changefreq |
| ------------ | -------- | ---------- |
| Homepage `/` | 1.0 | weekly |
| `/courses/`, `/day-trips/` | 0.9 | monthly |
| `/dive-sites/` | 0.8 | monthly |
| `/posts/` | 0.7 | monthly |
| Rest | 0.6 | monthly |

Scans `en/`, `de/`, `th/`. Ignores `.git`, `node_modules`, asset folders (`img`, `js`, `fonts`, `docs`, …).

Do **not** hand-edit lastmod for routine content edits — regenerate from Git.
