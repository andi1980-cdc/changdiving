#!/usr/bin/env python3
"""Add Instructor Crossover row + JSON-LD to EN/DE/TH prices pages."""
from pathlib import Path
import re
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]

CONFIG = {
    "en": {
        "name": "Instructor Crossover",
        "desc": "SDI/TDI crossover for certified instructors from other agencies",
        "json_desc": "SDI/TDI instructor crossover – transfer certification from another agency in about 2 days",
        "details": "Details",
        "price_display": "15,990 THB",
    },
    "de": {
        "name": "Instructor Crossover",
        "desc": "SDI/TDI-Crossover für zertifizierte Instruktoren anderer Verbände",
        "json_desc": "SDI/TDI Instructor Crossover – Zertifizierung von einem anderen Verband in ca. 2 Tagen übertragen",
        "details": "Details",
        "price_display": "15.990 THB",
    },
    "th": {
        "name": "Instructor Crossover",
        "desc": "SDI/TDI crossover สำหรับผู้สอนที่ได้รับการรับรองจากองค์กรอื่น",
        "json_desc": "SDI/TDI instructor crossover – โอนใบรับรองจากองค์กรอื่นในเวลาประมาณ 2 วัน",
        "details": "รายละเอียด",
        "price_display": "15,990 THB",
    },
}


def make_row(lang: str, cfg: dict) -> str:
    return f"""              <tr>
                <td>{cfg["name"]}</td>
                <td>{cfg["desc"]}</td>
                <td><strong>{cfg["price_display"]}</strong></td>
                <td>
                  <a
                    href="/{lang}/courses/instructor-crossover/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{cfg["details"]}</a
                  >
                </td>
                <td style="text-align: center; color: #999">–</td>
              </tr>
"""


def make_json_item(lang: str, cfg: dict) -> str:
    return f"""            {{
              "@type": "ListItem",
              "position": 18,
              "item": {{
                "@type": "Course",
                "name": "{cfg["name"]}",
                "url": "https://changdiving.com/{lang}/courses/instructor-crossover/",
                "offers": {{
                  "@type": "Offer",
                  "price": "15990",
                  "priceCurrency": "THB",
                  "availability": "https://schema.org/InStock"
                }},
                "description": "{cfg["json_desc"]}",
                "provider": {{
                  "@type": "Organization",
                  "name": "Chang Diving Center",
                  "url": "https://changdiving.com/"
                }}
              }}
            }},
"""


def process(lang: str) -> None:
    cfg = CONFIG[lang]
    path = ROOT / lang / "prices" / "index.html"
    text = path.read_text(encoding="utf-8")
    if f"/{lang}/courses/instructor-crossover/" in text:
        print(f"{lang}: already linked")
        return

    # Table: insert before specialty section
    marker = '<tr id="prices-specialty">'
    idx = text.find(marker)
    if idx < 0:
        raise SystemExit(f"{lang}: prices-specialty not found")
    # sanity: sdi-ie should appear shortly before
    window = text[max(0, idx - 800) : idx]
    if f"/{lang}/courses/sdi-ie/" not in window:
        raise SystemExit(f"{lang}: sdi-ie not near specialty header")
    text = text[:idx] + make_row(lang, cfg) + text[idx:]

    # JSON-LD: after position 17 (sdi-ie), before position 18
    ie_url = f"https://changdiving.com/{lang}/courses/sdi-ie/"
    # Find position 17 block containing ie_url, then the following position 18
    pat = re.compile(
        r'("position":\s*17,\s*"item":\s*\{[^}]*?"url":\s*"'
        + re.escape(ie_url)
        + r'"[\s\S]*?\}\s*\}\s*\})\s*,\s*(\{\s*"@type":\s*"ListItem",\s*"position":\s*18,)',
    )
    m = pat.search(text)
    if not m:
        # looser: find ie_url then next "position": 18 ListItem
        ie_pos = text.find(ie_url)
        if ie_pos < 0:
            raise SystemExit(f"{lang}: sdi-ie json url missing")
        # walk back to ListItem start for position 17
        start17 = text.rfind('"@type": "ListItem"', 0, ie_pos)
        end17 = text.find('"@type": "ListItem"', ie_pos)
        if start17 < 0 or end17 < 0:
            raise SystemExit(f"{lang}: could not bound ListItem 17")
        # end17 points at next ListItem (position 18) — insert before it
        # include leading whitespace of next item
        insert_at = text.rfind("\n", 0, end17) + 1
        # mark new as 999 first
        item = make_json_item(lang, cfg).replace('"position": 18,', '"position": 999,')
        text = text[:insert_at] + item + text[insert_at:]
    else:
        item = make_json_item(lang, cfg).replace('"position": 18,', '"position": 999,')
        text = text[: m.end(1)] + ",\n" + item + text[m.start(2) :]

    # Bump old positions 18-40 (breadcrumb stays 1-2)
    def bump(mo: re.Match) -> str:
        n = int(mo.group(1))
        return f'"position": {n + 1}'

    text = re.sub(r'"position":\s*([2-3][0-9]|1[8-9]|40)\b', bump, text)
    text = text.replace('"position": 999,', '"position": 18,', 1)

    path.write_text(text, encoding="utf-8")

    # verify
    t = path.read_text(encoding="utf-8")
    assert f"/{lang}/courses/instructor-crossover/" in t
    assert f"changdiving.com/{lang}/courses/instructor-crossover/" in t
    positions = [int(x) for x in re.findall(r'"position":\s*(\d+)', t)]
    # course list should include unique 18
    dups = {k: v for k, v in Counter(positions).items() if v > 1 and k >= 3}
    print(f"{lang}: OK  hrefs={t.count(f'/{lang}/courses/instructor-crossover/')}  dups={dups or 'none'}")


def main() -> None:
    for lang in ("en", "de", "th"):
        process(lang)


if __name__ == "__main__":
    main()
