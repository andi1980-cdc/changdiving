# Footer sync

**Role:** `ops`  
**Stand:** August 2026  

Static footers are inlined in HTML. **Source of truth** is `scripts/sync-footer.py` (builds EN/DE/TH footers and writes `partials/footer-*.html` + every page with `<footer id="footer">`).

## When to run

- Changing footer links, labels, phone, address, legal links
- After discovering wrong-language footers on DE/TH pages
- Prefer this script over hand-editing hundreds of footers

```bash
cd /Users/andismac/Desktop/cdc_git
python3 scripts/sync-footer.py
```

Then prettier on touched HTML if you will commit, commit only when asked.

## Language detection (important)

The script must resolve language from the path **relative to the repo root**:

- `th/.../index.html` → Thai footer (`/th/…` + Thai labels/meta)
- `de/...` → German paths (nav labels currently EN-style; meta/legal DE)
- `en/...` and root pages like `404/` → English

**Bug fixed Aug 2026:** using absolute `Path.parts[0]` is `"/"` on Unix → everything fell back to **EN** and overwrote DE/TH (commit `978dbc3b` introduced the bad sync; fixed in `034d99d3`). Do not reintroduce absolute-path language detection.

Sanity: after sync, a TH page footer must contain `href="/th/about/"` and **not** `href="/en/about/"`.

## Partials

| File | Role |
|------|------|
| `partials/footer-en.html` | Mirror of built EN footer |
| `partials/footer-de.html` | Mirror of built DE footer |
| `partials/footer-th.html` | Mirror of built TH footer |

Edit labels/meta in **`scripts/sync-footer.py`**, then run the script — do not treat an open editor buffer as source of truth.
