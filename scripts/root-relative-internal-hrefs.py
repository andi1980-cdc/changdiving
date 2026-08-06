#!/usr/bin/env python3
"""Convert body internal hrefs from absolute domain to root-relative.

Keeps absolute URLs in <head> (canonical, hreflang, etc.) and does not
touch non-href attributes (og:url, JSON-LD).
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

# https://changdiving.com/en|de|th/...  →  /en|de|th/...
ABS_HREF = re.compile(
    r'''href=(["'])https://changdiving\.com(/(?:en|de|th)/[^"']*)\1''',
    re.I,
)


def convert_body(text: str) -> tuple[str, int]:
    m = re.search(r"</head>", text, re.I)
    if not m:
        return text, 0
    head, body = text[: m.end()], text[m.end() :]
    new_body, n = ABS_HREF.subn(r"href=\1\2\1", body)
    return head + new_body, n


def main() -> None:
    changed = []
    total = 0
    for p in ROOT.rglob("index.html"):
        if any(x in p.parts for x in (".git", "node_modules")):
            continue
        orig = p.read_text(encoding="utf-8")
        new, n = convert_body(orig)
        if n and new != orig:
            p.write_text(new, encoding="utf-8")
            changed.append((str(p.relative_to(ROOT)), n))
            total += n

    print(f"Files changed: {len(changed)}")
    print(f"Hrefs converted: {total}")
    for path, n in sorted(changed, key=lambda x: -x[1])[:40]:
        print(f"  {n:3d}  {path}")
    if len(changed) > 40:
        print(f"  … +{len(changed) - 40} more files")


if __name__ == "__main__":
    main()
