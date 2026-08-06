#!/usr/bin/env python3
"""Inject the elegant header search into lang-switch bars.

Skips language homes (already have search), 404, and 410.
Idempotent: pages that already contain search-wrapper are left unchanged.

Usage (from repo root):
  python3 scripts/sync-search.py --lang en
  python3 scripts/sync-search.py --lang de
  python3 scripts/sync-search.py --lang th
  python3 scripts/sync-search.py --lang all
"""

from __future__ import annotations

import argparse
import os
import re
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

COPY = {
    "en": {
        "action": "/en/search/",
        "placeholder": "Search...",
        "aria": "Search",
    },
    "de": {
        "action": "/de/search/",
        "placeholder": "Suchen...",
        "aria": "Suche",
    },
    "th": {
        "action": "/th/search/",
        "placeholder": "ค้นหา...",
        "aria": "ค้นหา",
    },
}

# Match menu-toggle button (any attributes / multiline label), then next <a
MENU_THEN_LINK = re.compile(
    r'(<button\b[^>]*\bclass="[^"]*\bmenu-toggle\b[^"]*"[^>]*>[\s\S]*?</button>)'
    r'(\s*)(<a\s)',
    re.IGNORECASE,
)


def search_block(lang: str) -> str:
    c = COPY[lang]
    return f"""

          <!-- Elegant Search Field -->
          <div class="search-wrapper">
            <form action="{c['action']}" method="get" class="search-form-elegant">
              <input
                type="text"
                name="q"
                placeholder="{c['placeholder']}"
                aria-label="{c['aria']}"
                class="search-input-elegant"
              />
              <button
                type="submit"
                class="search-btn-elegant"
                aria-label="{c['aria']}"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>
          </div>
"""


def atomic_write(path: Path, content: str) -> None:
    path = path.resolve()
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=".search-tmp-")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def should_skip(path: Path, lang: str) -> bool:
    parts = path.parts
    if "404" in parts or "410" in parts:
        return True
    # Language home already has the search field
    if path == ROOT / lang / "index.html":
        return True
    return False


def iter_pages(lang: str):
    root = ROOT / lang
    for path in sorted(root.rglob("index.html")):
        if should_skip(path, lang):
            continue
        yield path


def sync_page(path: Path, lang: str) -> str:
    text = path.read_text(encoding="utf-8")
    if "search-wrapper" in text:
        return "skip-exists"
    if 'class="lang-switch"' not in text and "class='lang-switch'" not in text:
        return "skip-no-lang-switch"
    m = MENU_THEN_LINK.search(text)
    if not m:
        return "fail-no-anchor"
    # Insert only inside the first lang-switch occurrence
    replacement = m.group(1) + search_block(lang) + m.group(2) + m.group(3)
    new_text = text[: m.start()] + replacement + text[m.end() :]
    atomic_write(path, new_text)
    return "updated"


def sync_lang(lang: str) -> dict[str, int]:
    stats: dict[str, int] = {
        "updated": 0,
        "skip-exists": 0,
        "skip-no-lang-switch": 0,
        "fail-no-anchor": 0,
    }
    fails: list[str] = []
    for path in iter_pages(lang):
        status = sync_page(path, lang)
        stats[status] = stats.get(status, 0) + 1
        if status.startswith("fail"):
            fails.append(str(path.relative_to(ROOT)))
    print(f"[{lang}] {stats}")
    if fails:
        print(f"[{lang}] failures:")
        for f in fails:
            print(" ", f)
    return stats


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--lang",
        choices=("en", "de", "th", "all"),
        required=True,
        help="Language to sync (or all)",
    )
    args = parser.parse_args()
    langs = ("en", "de", "th") if args.lang == "all" else (args.lang,)
    total_updated = 0
    for lang in langs:
        stats = sync_lang(lang)
        total_updated += stats.get("updated", 0)
    print(f"Done. Updated {total_updated} page(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
