#!/usr/bin/env python3
"""Inject header search markup and/or critical CSS for CLS-stable first paint.

Skips 404/410 for markup injection. Language homes already have search markup
but still receive critical CSS via --critical-css.

Usage (from repo root):
  python3 scripts/sync-search.py --lang all
  python3 scripts/sync-search.py --lang all --critical-css
  python3 scripts/sync-search.py --lang en --critical-css
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

CRITICAL_MARKER = "/* Header search – critical (CLS) */"

# Layout-only rules matching style.css breakpoints (no hover/focus width growth).
CRITICAL_SEARCH_CSS = """
      /* Header search – critical (CLS) */
      .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .search-form-elegant {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        box-sizing: border-box;
      }
      .search-input-elegant {
        background: transparent;
        border: none;
        padding: 8px 12px 8px 16px;
        font-size: 0.85rem;
        width: 140px;
        max-width: 140px;
        height: 36px;
        color: #333;
        font-weight: 500;
        outline: none;
        font-family: var(--font-sans);
        box-sizing: border-box;
      }
      .search-btn-elegant {
        background: transparent;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        color: #555;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        height: 36px;
        box-sizing: border-box;
      }
      .search-btn-elegant svg {
        width: 16px;
        height: 16px;
        display: block;
      }
      @media (max-width: 768px) {
        .search-input-elegant {
          width: 100px;
          max-width: 100px;
          height: 32px;
          font-size: 0.8rem;
          padding: 6px 10px 6px 12px;
        }
        .search-btn-elegant {
          padding: 6px 10px;
          height: 32px;
        }
        .search-btn-elegant svg {
          width: 14px;
          height: 14px;
        }
      }
      @media (max-width: 480px) {
        .search-input-elegant {
          width: 80px;
          max-width: 80px;
        }
      }
"""


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


def should_skip_markup(path: Path, lang: str) -> bool:
    parts = path.parts
    if "404" in parts or "410" in parts:
        return True
    if path == ROOT / lang / "index.html":
        return True
    return False


def iter_lang_pages(lang: str, include_home: bool = False):
    root = ROOT / lang
    for path in sorted(root.rglob("index.html")):
        if "404" in path.parts or "410" in path.parts:
            continue
        if not include_home and path == ROOT / lang / "index.html":
            continue
        yield path


def inject_critical_css(text: str) -> str | None:
    """Return updated HTML, or None if no change / not applicable."""
    if "search-wrapper" not in text:
        return None
    if CRITICAL_MARKER in text:
        return None
    # Prefer inserting before </style> of critical-css block
    m = re.search(
        r'(<style\b[^>]*\bid=["\']critical-css["\'][^>]*>)([\s\S]*?)(</style>)',
        text,
        re.I,
    )
    if not m:
        return None
    new_block = m.group(1) + m.group(2).rstrip() + "\n" + CRITICAL_SEARCH_CSS + "\n    " + m.group(3)
    return text[: m.start()] + new_block + text[m.end() :]


def sync_markup_page(path: Path, lang: str) -> str:
    text = path.read_text(encoding="utf-8")
    if "search-wrapper" in text:
        return "skip-exists"
    if 'class="lang-switch"' not in text and "class='lang-switch'" not in text:
        return "skip-no-lang-switch"
    m = MENU_THEN_LINK.search(text)
    if not m:
        return "fail-no-anchor"
    replacement = m.group(1) + search_block(lang) + m.group(2) + m.group(3)
    new_text = text[: m.start()] + replacement + text[m.end() :]
    atomic_write(path, new_text)
    return "updated"


def sync_critical_page(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    new_text = inject_critical_css(text)
    if new_text is None:
        if "search-wrapper" not in text:
            return "skip-no-search"
        if CRITICAL_MARKER in text:
            return "skip-exists"
        return "skip-no-critical"
    atomic_write(path, new_text)
    return "updated"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--lang",
        choices=("en", "de", "th", "all"),
        required=True,
        help="Language to sync (or all)",
    )
    parser.add_argument(
        "--critical-css",
        action="store_true",
        help="Inject critical CSS for header search (CLS) into pages that have search",
    )
    parser.add_argument(
        "--markup",
        action="store_true",
        help="Inject search markup into lang-switch (default if neither flag set)",
    )
    args = parser.parse_args()
    # Default: markup only (backward compatible). --critical-css can run alone.
    do_markup = args.markup or not args.critical_css
    do_critical = args.critical_css
    if args.critical_css and not args.markup:
        do_markup = False

    langs = ("en", "de", "th") if args.lang == "all" else (args.lang,)
    total_markup = 0
    total_critical = 0

    for lang in langs:
        if do_markup:
            stats: dict[str, int] = {}
            fails: list[str] = []
            for path in iter_lang_pages(lang, include_home=False):
                if should_skip_markup(path, lang):
                    continue
                status = sync_markup_page(path, lang)
                stats[status] = stats.get(status, 0) + 1
                if status.startswith("fail"):
                    fails.append(str(path.relative_to(ROOT)))
            print(f"[{lang}] markup {stats}")
            if fails:
                for f in fails:
                    print(" ", f)
            total_markup += stats.get("updated", 0)

        if do_critical:
            stats = {}
            for path in iter_lang_pages(lang, include_home=True):
                status = sync_critical_page(path)
                stats[status] = stats.get(status, 0) + 1
            print(f"[{lang}] critical-css {stats}")
            total_critical += stats.get("updated", 0)

    print(
        f"Done. Markup updated: {total_markup}; critical-css updated: {total_critical}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
