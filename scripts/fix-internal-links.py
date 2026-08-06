#!/usr/bin/env python3
"""Fix stale internal URLs and localize DE/TH content links that point to /en/."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

STALE_REPLACEMENTS = [
    (
        "/posts/marine-life-koh-chang/nudibranchs/",
        "/posts/marine-life-koh-chang/marine-life-nudibranch/",
    ),
    (
        "/posts/scuba-knowledge/surface-marker-buoy/",
        "/posts/scuba-knowledge/smb-guide/",
    ),
    ("/courses/advanced-nitrox-diver/", "/courses/advanced-nitrox/"),
    ("/de/product/advanced/", "/de/courses/advanced/"),
    ("/en/product/advanced/", "/en/courses/advanced/"),
    ("/th/product/advanced/", "/th/courses/advanced/"),
]


def fix_stale(text: str) -> str:
    for old, new in STALE_REPLACEMENTS:
        text = text.replace(old, new)
    return text


def fix_trailing_space_hrefs(text: str) -> str:
    def repl(m: re.Match) -> str:
        q, url = m.group(1), m.group(2)
        fixed = url.rstrip(" ")
        if fixed != url:
            return f"href={q}{fixed}{q}"
        return m.group(0)

    return re.sub(r'''href=(["'])([^"']+)\1''', repl, text)


def localize_en_links(text: str, lang: str, page_under: str) -> str:
    en_self = "/" + "/".join(p for p in ("en", page_under.strip("/")) if p)
    if not en_self.endswith("/"):
        en_self += "/"
    en_self = re.sub(r"/+", "/", en_self)

    m = re.search(r"</head>", text, re.I)
    if not m:
        head, body = "", text
    else:
        head, body = text[: m.end()], text[m.end() :]

    protected: list[str] = []

    def protect(match: re.Match) -> str:
        protected.append(match.group(0))
        return f"__PROTECT_{len(protected) - 1}__"

    # Flag language switcher anchors
    body = re.sub(
        r"""<a\s+[^>]*href=["']/en/[^"']*["'][^>]*>\s*[🇬🇧🇩🇪🇹🇭]\s*</a>""",
        protect,
        body,
        flags=re.I,
    )

    # Exact EN self-link (lang switch without emoji match)
    self_prot: list[str] = []
    esc = re.escape(en_self.rstrip("/"))

    def protect_self(match: re.Match) -> str:
        self_prot.append(match.group(0))
        return f"__PROTECTSELF_{len(self_prot) - 1}__"

    body = re.sub(rf'''href=(["']){esc}/?\1''', protect_self, body)

    # External non-changdiving URLs
    body = re.sub(
        r'''href=(["'])https?://(?!changdiving\.com)[^"']*\1''',
        protect,
        body,
        flags=re.I,
    )

    def repl_href(match: re.Match) -> str:
        q, url = match.group(1), match.group(2)
        if url.startswith("https://changdiving.com/en/"):
            return (
                f"href={q}"
                + url.replace(
                    "https://changdiving.com/en/",
                    f"https://changdiving.com/{lang}/",
                    1,
                )
                + q
            )
        if url.startswith("/en/"):
            return f"href={q}" + url.replace("/en/", f"/{lang}/", 1) + q
        return match.group(0)

    body = re.sub(
        r'''href=(["'])((?:https://changdiving\.com)?/en/[^"']*)\1''',
        repl_href,
        body,
    )

    for i, val in enumerate(protected):
        body = body.replace(f"__PROTECT_{i}__", val)
    for i, val in enumerate(self_prot):
        body = body.replace(f"__PROTECTSELF_{i}__", val)

    return head + body


def main() -> None:
    changed: list[tuple[str, str]] = []

    for p in ROOT.rglob("index.html"):
        if any(x in p.parts for x in (".git", "node_modules")):
            continue
        orig = p.read_text(encoding="utf-8")
        text = fix_trailing_space_hrefs(fix_stale(orig))
        # Broken tip hub lang link
        text = text.replace("href=' //// '", 'href="/th/posts/tips-and-tricks/"')
        text = text.replace('href=" //// "', 'href="/th/posts/tips-and-tricks/"')
        if text != orig:
            p.write_text(text, encoding="utf-8")
            changed.append(("stale/space", str(p.relative_to(ROOT))))

    for lang in ("de", "th"):
        base = ROOT / lang
        for p in base.rglob("index.html"):
            orig = p.read_text(encoding="utf-8")
            rel = p.relative_to(base).as_posix()
            under = "" if rel == "index.html" else rel[: -len("index.html")]
            new = localize_en_links(orig, lang, under)
            if new != orig:
                p.write_text(new, encoding="utf-8")
                changed.append(("localize", str(p.relative_to(ROOT))))

    print(f"Files changed: {len(changed)}")
    for kind, path in changed:
        print(f"  [{kind}] {path}")


if __name__ == "__main__":
    main()
