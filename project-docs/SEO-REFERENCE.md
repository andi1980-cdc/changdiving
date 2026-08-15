# SEO Reference – Chang Diving Center

**Role:** `living`  
**Stand:** August 2026  

Schema matrix + internal-link HTML snippets.  
Page structure → [`PAGE-TYPES.md`](PAGE-TYPES.md) · GSC workflow → [`KEYWORD-GSC-PAGE-ANALYSIS.md`](KEYWORD-GSC-PAGE-ANALYSIS.md) · Search index / sitemap commands → root [`claude.md`](../claude.md) · [`README_SITEMAP.md`](README_SITEMAP.md)

---

## 1. Schema.org Matrix

| Seitentyp | LocalBusiness | Breadcrumb | Course | FAQPage | Article/BlogPosting | aggregateRating |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Courses** | ✅ | ✅ | ✅ | wenn FAQ vorhanden | – | ✅ |
| **Day-trips** | ✅ | ✅ | – | – | – | ✅ |
| **Dive-sites** | ✅ | ✅ | – | – | – | ✅ |
| **FAQs** | ✅ | ✅ | – | ✅ | – | ✅ |
| **Posts / Articles** | ❌ | ✅ | – | wenn FAQ vorhanden | ✅ BlogPosting | ❌ |
| **about, contact** | ❌ | ✅ | – | – | – | ❌ |
| **prices** | ✅ | ✅ | – | ✅ FAQPage | – | ✅ (Google reviews 4.8/171) |
| **Index (en/de/th)** | ✅ | – | ✅ | – | – | ✅ |
| **404 / 410** | ✅ | – | – | – | – | ✅ |

**Regel:** `aggregateRating` nur auf Seiten **mit Trustindex-Widget**.

User-facing copy: **activity** / Aktivität / กิจกรรม — not shop “product” (URL `?product=` may stay).

---

## 2. HTML-Cluster-Box Templates

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

Internal linking across EN/DE/TH knowledge posts and dive-site ↔ course links is largely in place (Aug 2026). Prefer cloning an existing cluster box from a sibling page over inventing new markup.
