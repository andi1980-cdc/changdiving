#!/usr/bin/env python3
"""Generate search-index.json from page titles and meta descriptions.

Usage (from repo root):
  python3 scripts/generate-search-index.py

Indexing policy:
  - Include course subcategory hubs (beginner/advanced/professional/specialty/tech)
    so intent queries like "beginner course" surface the right overview.
  - Exclude top-level section hubs (/courses/, /posts/, …) and post-category hubs.
  - Exclude utility/legal/search/error pages.
"""

from __future__ import annotations

import html as html_mod
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_EXACT = {
    "/search/",
    "/404/",
    "/410/",
    "/privacy-policy/",
    "/refund-policy/",
    "/terms-and-conditions/",
}

# Top-level section hubs + post-category hubs only.
# Course subcategory hubs (beginner-courses, …) are intentionally indexed.
SKIP_HUB_SEGMENTS = {
    "courses",
    "dive-sites",
    "day-trips",
    "posts",
    "faqs",
    "equipment",
    "diving-how-to-guides-koh-chang",
    "koh-chang-diving-travel-guides",
    "marine-life-koh-chang",
    "scuba-knowledge",
    "straight-talk",
    "tips-and-tricks",
}

COURSE_SUBHUBS = {
    "beginner-courses",
    "advanced-courses",
    "professional-courses",
    "specialty",
    "technical-diving-courses",
}


def should_skip(url_path: str) -> bool:
    parts = [p for p in url_path.strip("/").split("/") if p]
    if len(parts) <= 1:
        return True
    suffix = "/" + "/".join(parts[1:]) + "/"
    if suffix in SKIP_EXACT:
        return True
    if len(parts) == 2 and parts[1] in SKIP_HUB_SEGMENTS:
        return True
    if len(parts) == 3 and parts[2] in SKIP_HUB_SEGMENTS:
        return True
    return False


def extract_meta(content: str, name: str) -> str:
    for pattern in [
        r"<meta\b[^>]*\bname=[\"']"
        + re.escape(name)
        + r"[\"'][^>]*\bcontent=[\"']([^\"']*)[\"']",
        r"<meta\b[^>]*\bcontent=[\"']([^\"']*)[\"'][^>]*\bname=[\"']"
        + re.escape(name)
        + r"[\"']",
    ]:
        m = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
        if m:
            return html_mod.unescape(m.group(1).strip())
    return ""


def extract_title(content: str) -> str:
    m = re.search(r"<title[^>]*>(.*?)</title>", content, re.IGNORECASE | re.DOTALL)
    return (
        html_mod.unescape(re.sub(r"\s+", " ", m.group(1)).strip()) if m else ""
    )


def get_priority(url_path: str) -> float:
    parts = [p for p in url_path.strip("/").split("/") if p]
    # Course subcategory hubs rank above articles for category intent queries
    if len(parts) == 3 and parts[1] == "courses" and parts[2] in COURSE_SUBHUBS:
        return 0.9
    d = url_path.count("/")
    if d <= 3:
        return 0.9
    if any(x in url_path for x in ["/courses/", "/day-trips/", "/dive-sites/"]):
        return 0.85
    if "/faqs/" in url_path:
        return 0.7
    if "/posts/" in url_path:
        return 0.65
    return 0.5


def get_category(url_path: str, lang: str) -> str:
    cats = {
        "en": {
            "courses": "Course",
            "dive-sites": "Dive Site",
            "day-trips": "Day Trip",
            "posts": "Article",
            "faqs": "FAQ",
            "equipment": "Equipment",
        },
        "de": {
            "courses": "Kurs",
            "dive-sites": "Tauchplatz",
            "day-trips": "Tagestour",
            "posts": "Artikel",
            "faqs": "FAQ",
            "equipment": "Ausrüstung",
        },
        "th": {
            "courses": "คอร์ส",
            "dive-sites": "จุดดำน้ำ",
            "day-trips": "ทริปวันเดียว",
            "posts": "บทความ",
            "faqs": "คำถามที่พบบ่อย",
            "equipment": "อุปกรณ์",
        },
    }
    for key, label in cats.get(lang, cats["en"]).items():
        if f"/{key}/" in url_path:
            return label
    return "Page"


def build_index() -> dict[str, list[dict]]:
    index: dict[str, list[dict]] = {"en": [], "de": [], "th": []}
    for lang in ("en", "de", "th"):
        lang_root = ROOT / lang
        for dirpath, dirnames, filenames in os.walk(lang_root):
            dirnames[:] = [d for d in dirnames if d not in (".git", "node_modules")]
            for fname in filenames:
                if fname != "index.html":
                    continue
                fpath = Path(dirpath) / fname
                rel = fpath.relative_to(ROOT).as_posix()
                url_path = re.sub(
                    r"/+",
                    "/",
                    "/"
                    + rel.replace("/index.html", "/").rstrip("/")
                    + "/",
                )
                if should_skip(url_path):
                    continue
                content = fpath.read_text(encoding="utf-8")
                title = extract_title(content)
                description = extract_meta(content, "description")
                if not title or not description:
                    continue
                title = re.sub(
                    r"\s*[|–\-]\s*(Chang Diving.*|ช้างได[ฟร]์วิ่ง.*)$",
                    "",
                    title,
                ).strip()
                index[lang].append(
                    {
                        "url": url_path,
                        "title": title,
                        "description": description,
                        "category": get_category(url_path, lang),
                        "priority": get_priority(url_path),
                    }
                )
        index[lang].sort(key=lambda x: -x["priority"])
        print(f"{lang}: {len(index[lang])} pages")
    return index


def main() -> int:
    index = build_index()
    out = ROOT / "search-index.json"
    out.write_text(
        json.dumps(index, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Done → {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
