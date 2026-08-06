#!/usr/bin/env python3
"""Inject skip-link rules into page critical-css to prevent CLS.

The skip-link markup is in <body>; without critical CSS it paints as a normal
link until style.min.css loads, shifting the whole page.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKER = "/* Skip link – critical (CLS) */"

CRITICAL_SKIP_CSS = """
      /* Skip link – critical (CLS) */
      .skip-link {
        position: absolute;
        left: -9999px;
        top: 0;
        z-index: 100000;
        padding: 0.75rem 1rem;
        background: #000;
        color: #fff;
        font-weight: bold;
        text-decoration: none;
      }
      .skip-link:focus {
        left: 0.5rem;
        top: 0.5rem;
        outline: 3px solid #ffd700;
        outline-offset: 2px;
      }
"""


def inject(text: str) -> str | None:
    if "skip-link" not in text:
        return None
    if MARKER in text:
        return None
    m = re.search(
        r'(<style\b[^>]*\bid=["\']critical-css["\'][^>]*>)([\s\S]*?)(</style>)',
        text,
        re.I,
    )
    if not m:
        return None
    new_block = (
        m.group(1)
        + m.group(2).rstrip()
        + "\n"
        + CRITICAL_SKIP_CSS
        + "\n    "
        + m.group(3)
    )
    return text[: m.start()] + new_block + text[m.end() :]


def main() -> None:
    updated = 0
    skip_exists = 0
    skip_no = 0
    skip_no_critical = 0
    for path in sorted(ROOT.rglob("index.html")):
        if any(x in path.parts for x in (".git", "node_modules", "partials")):
            continue
        text = path.read_text(encoding="utf-8")
        new = inject(text)
        if new is None:
            if "skip-link" not in text:
                skip_no += 1
            elif MARKER in text:
                skip_exists += 1
            else:
                skip_no_critical += 1
                print("no critical-css:", path.relative_to(ROOT))
            continue
        path.write_text(new, encoding="utf-8")
        updated += 1
    print(
        f"updated={updated} already={skip_exists} no-skip={skip_no} "
        f"no-critical={skip_no_critical}"
    )


if __name__ == "__main__":
    main()
