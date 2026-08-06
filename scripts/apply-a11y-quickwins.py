#!/usr/bin/env python3
"""Phase 1+2 HTML a11y: flag labels, remove role=menu, skip-link, main id, menu attrs."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

SKIP = {
    "en": "Skip to content",
    "de": "Zum Inhalt springen",
    "th": "ข้ามไปยังเนื้อหา",
}
MENU_LABEL = {
    "en": "Toggle navigation menu",
    "de": "Navigationsmenü öffnen",
    "th": "เปิดเมนูนำทาง",
}
FLAG_LABELS = {
    "🇬🇧": "Switch to English",
    "🇩🇪": "Switch to German",
    "🇹🇭": "Switch to Thai",
}
AUTO_LABEL = {
    "en": "Automatic language landing page",
    "de": "Automatische Sprachauswahl",
    "th": "หน้าเลือกภาษาอัตโนมัติ",
}


def detect_lang(path: Path) -> str:
    for lang in ("en", "de", "th"):
        if lang in path.parts:
            return lang
    return "en"


def patch_flags(html: str) -> str:
    def repl(m: re.Match) -> str:
        attrs, flag = m.group(1), m.group(4)
        if re.search(r"\baria-label\s*=", attrs, re.I):
            return m.group(0)
        label = FLAG_LABELS[flag]
        return f'<a {attrs.rstrip()} aria-label="{label}">{flag}</a>'

    return re.sub(
        r"<a\s+([^>]*href=([\"'])(/(?:en|de|th)/[^\"']*)\2[^>]*)>\s*(🇬🇧|🇩🇪|🇹🇭)\s*</a>",
        repl,
        html,
        flags=re.I | re.S,
    )


def patch_auto_globe(html: str, lang: str) -> str:
    label = AUTO_LABEL[lang]

    def repl(m: re.Match) -> str:
        full = m.group(0)
        if re.search(r"\baria-label\s*=", full, re.I):
            return full
        return re.sub(r"<a\s+", f'<a aria-label="{label}" ', full, count=1)

    return re.sub(
        r"""<a\s+[^>]*href=["']/["'][^>]*>\s*🌐\s*</a>""",
        repl,
        html,
        flags=re.I,
    )


def remove_role_menu(html: str) -> str:
    html = re.sub(r"""\s+role=["']menu["']""", "", html)
    return html


def ensure_menu_toggle_attrs(html: str, lang: str) -> str:
    label = MENU_LABEL[lang]

    def btn_repl(m: re.Match) -> str:
        attrs = m.group(1)
        if "menu-toggle" not in attrs:
            return m.group(0)
        if "aria-expanded=" not in attrs:
            attrs += ' aria-expanded="false"'
        if "aria-controls=" not in attrs:
            attrs += ' aria-controls="main-menu"'
        if "aria-label=" not in attrs:
            attrs += f' aria-label="{label}"'
        return f"<button{attrs}>"

    return re.sub(r"<button([^>]*)>", btn_repl, html)


def ensure_dropdown_id(html: str) -> str:
    def repl(m: re.Match) -> str:
        attrs = m.group(1)
        if re.search(r"\bid\s*=", attrs, re.I):
            return m.group(0)
        return f'<div id="main-menu"{attrs}>'

    return re.sub(
        r'<div(\s+[^>]*class="[^"]*dropdown-menu[^"]*"[^>]*)>',
        repl,
        html,
        count=1,
        flags=re.I,
    )


SKIP_CRITICAL_CSS = """
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


def ensure_skip_critical_css(html: str) -> str:
    """Keep skip-link off-screen from first paint (avoid CLS)."""
    if "skip-link" not in html or "Skip link – critical (CLS)" in html:
        return html
    m = re.search(
        r'(<style\b[^>]*\bid=["\']critical-css["\'][^>]*>)([\s\S]*?)(</style>)',
        html,
        re.I,
    )
    if not m:
        return html
    new_block = (
        m.group(1)
        + m.group(2).rstrip()
        + "\n"
        + SKIP_CRITICAL_CSS
        + "\n    "
        + m.group(3)
    )
    return html[: m.start()] + new_block + html[m.end() :]


def ensure_skip_and_main(html: str, lang: str) -> str:
    if re.search(r"<main\b", html, re.I):
        if 'id="main-content"' not in html and "id='main-content'" not in html:
            if re.search(r"<main\b[^>]*\bid\s*=", html, re.I):
                html = re.sub(
                    r'(<main\b[^>]*\bid=")[^"]*"',
                    r'\1main-content"',
                    html,
                    count=1,
                    flags=re.I,
                )
            else:
                html = re.sub(
                    r"<main\b",
                    '<main id="main-content"',
                    html,
                    count=1,
                    flags=re.I,
                )

    if not re.search(r'class="skip-link"', html):
        skip = f'<a class="skip-link" href="#main-content">{SKIP[lang]}</a>'
        html = re.sub(
            r"(<body[^>]*>)",
            rf"\1\n    {skip}",
            html,
            count=1,
            flags=re.I,
        )
    html = ensure_skip_critical_css(html)
    return html


def bump_global_js(html: str) -> str:
    return re.sub(
        r"global\.min\.js\?v=[^\"'\s]+",
        "global.min.js?v=a11y-menu-1",
        html,
    )


def process(path: Path) -> bool:
    orig = path.read_text(encoding="utf-8")
    lang = detect_lang(path)
    html = orig
    html = patch_flags(html)
    html = patch_auto_globe(html, lang)
    html = remove_role_menu(html)
    html = ensure_menu_toggle_attrs(html, lang)
    html = ensure_dropdown_id(html)
    html = ensure_skip_and_main(html, lang)
    html = bump_global_js(html)
    if html != orig:
        path.write_text(html, encoding="utf-8")
        return True
    return False


def main() -> None:
    n = 0
    for p in sorted(ROOT.rglob("index.html")):
        if any(x in p.parts for x in (".git", "node_modules")):
            continue
        if process(p):
            n += 1
    print(f"Updated {n} files")


if __name__ == "__main__":
    main()
