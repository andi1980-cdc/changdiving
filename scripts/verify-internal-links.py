#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
href_re = re.compile(r'''href\s*=\s*["']([^"']+)["']''', re.I)

STALE_FRAGMENTS = [
    "nudibranchs/",
    "surface-marker-buoy/",
    "advanced-nitrox-diver/",
    "/product/advanced",
]


def main() -> None:
    print("=== STALE remnants in hrefs ===")
    for frag in STALE_FRAGMENTS:
        hits = []
        for p in ROOT.rglob("index.html"):
            if ".git" in p.parts:
                continue
            for h in href_re.findall(p.read_text(encoding="utf-8", errors="ignore")):
                if frag in h:
                    hits.append((str(p.relative_to(ROOT)), h))
        print(f"{frag}: {len(hits)}")
        for path, h in hits[:10]:
            print(f"  {path} -> {h}")

    print("\n=== Trailing space hrefs ===")
    n = 0
    for p in ROOT.rglob("index.html"):
        if ".git" in p.parts:
            continue
        for h in href_re.findall(p.read_text(encoding="utf-8", errors="ignore")):
            if h.endswith(" ") or (h.startswith("/") and h != h.rstrip(" ")):
                print(f"{p.relative_to(ROOT)} -> {h!r}")
                n += 1
    print(f"count: {n}")

    print("\n=== how-to-fun-dives DE href lines with /en/ ===")
    p = ROOT / "de/posts/diving-how-to-guides-koh-chang/how-to-fun-dives/index.html"
    for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
        if "/en/" in line and "href" in line:
            print(f"{i}: {line.strip()[:140]}")

    print("\n=== Remaining DE/TH /en/ content hrefs (excl. EN self lang-switch) ===")
    for lang in ("de", "th"):
        for p in (ROOT / lang).rglob("index.html"):
            text = p.read_text(encoding="utf-8")
            m = re.search(r"</head>", text, re.I)
            body = text[m.end() :] if m else text
            hrefs = [
                h
                for h in href_re.findall(body)
                if h.startswith("/en/") or "changdiving.com/en/" in h
            ]
            if not hrefs:
                continue
            rel = p.relative_to(ROOT / lang).as_posix()
            under = "" if rel == "index.html" else rel[: -len("index.html")]
            en_self = ("/en/" + under).rstrip("/")
            content = []
            for h in hrefs:
                norm = h.replace("https://changdiving.com", "").rstrip("/")
                if norm == en_self:
                    continue
                content.append(h)
            if content:
                print(f"{p.relative_to(ROOT)}: {content}")


if __name__ == "__main__":
    main()
