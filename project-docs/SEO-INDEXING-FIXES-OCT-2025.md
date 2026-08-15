# SEO indexing fixes – October 2025

**Role:** `archive`

> Historical incident notes (moved out of root `claude.md` in Aug 2026).  
> Implementation is still live in `functions/[[path]].js` / homepage; this file is the archive of *why* and *what* was changed then.  
> Day-to-day edge rules → root [`claude.md`](../claude.md).

## Problem statement

Google Search Console showed 300+ pages indexed, but `site:changdiving.com` only returned the homepage. Bing showed 50+ pages indexed normally.

## Root causes

1. JavaScript-based language redirects on the homepage (possible cloaking confusion)
2. Extensive **410 Gone** for `/product/`, `/category/`, `/store/`, `/tag/`
3. Aggressive no-cache headers on 410 responses
4. `Crawl-delay` in `robots.txt` (ignored by Google, noisy in tools)

## Fixes implemented

### 1. Server-side language detection

**File:** `functions/[[path]].js`

- Cookie → Accept-Language → Geo → default English
- Bots: language selector, no redirect
- Humans: 302 to language + 30-day cookie

### 2. Homepage without JS redirect

**File:** `index.html` — static language selector for crawlers

### 3. 410 → 301 for legacy store paths

**File:** `functions/[[path]].js` — `REDIRECTS_PREFIX` (examples):

```javascript
{ from: "/en/product", to: "/en/courses/" },
{ from: "/de/product", to: "/de/courses/" },
{ from: "/th/product", to: "/th/courses/" },
{ from: "/en/category", to: "/en/courses/" },
{ from: "/de/category", to: "/de/courses/" },
{ from: "/th/category", to: "/th/courses/" },
{ from: "/en/store", to: "/en/prices/" },
{ from: "/de/store", to: "/de/prices/" },
{ from: "/th/store", to: "/th/prices/" },
{ from: "/en/tag", to: "/en/posts/" },
{ from: "/de/tag", to: "/de/posts/" },
{ from: "/th/tag", to: "/th/posts/" },
```

(Also bare `/product` → `/en/courses/` in current code.)

Removed those prefixes from `FORCE_GONE_PREFIX`.

### 4. Removed Crawl-delay

**File:** `robots.txt` — no `Crawl-delay` today; sitemap points to `https://changdiving.com/sitemap.xml`.

## Tests (still valid)

```bash
curl -I -H "User-Agent: Googlebot" https://changdiving.com/
curl -I -H "Accept-Language: de" https://changdiving.com/
curl -I "https://changdiving.com/?noredirect"
curl -I https://changdiving.com/en/product/
curl -I https://changdiving.com/en/store/
```

## Then vs now (Aug 2026)

| Then | Now |
|------|-----|
| ~373 sitemap URLs / possible `sitemap-index.xml` | Single `sitemap.xml` (~433 `<loc>`) |
| `test-language-redirect.sh` mentioned | Not in repo |
| Focus: get pages indexed | Focus: right **keywords** per page (see `KEYWORD-GSC-PAGE-ANALYSIS.md`) |

Living agent rules: root [`claude.md`](../claude.md).
