#!/usr/bin/env python3
"""Sync static footers into all pages and keep partials/footer-*.html in sync.

Source of truth is FOOTERS below (not whatever may be open in the editor).

Usage (from repo root):
  python3 scripts/sync-footer.py
"""

from __future__ import annotations

from pathlib import Path
import os
import re
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def atomic_write(path: Path, content: str) -> None:
    path = path.resolve()
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=".footer-tmp-")
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

FOOTER_RE = re.compile(
    r'<footer\s+id="footer"\s*>[\s\S]*?</footer>',
    re.IGNORECASE,
)

# Shared nav structure; labels are language-specific via _NAV_LABELS
_NAV = """  <nav class="footer-navigation">
    <div class="container">
      <div class="row">
        <div class="three columns">
          <a href="/{lang}/about/">{about}</a>
          <a href="/{lang}/posts/diving-how-to-guides-koh-chang/">{how_to}</a>
          <a href="/{lang}/faqs/faq-getting-here-accommodation/">{getting_here}</a>
          <a href="/{lang}/dive-sites/">{dive_sites}</a>
          <a href="/{lang}/faqs/">{faqs}</a>
          <a href="/{lang}/videos/">{videos}</a>
          <a href="/{lang}/contact/">{contact}</a>
        </div>
        <div class="three columns">
          <a href="/{lang}/courses/">{courses}</a>
          <a href="/{lang}/courses/open-water-diver/">{open_water}</a>
          <a href="/{lang}/courses/advanced/">{advanced}</a>
          <a href="/{lang}/courses/rescue-diver/">{rescue}</a>
          <a href="/{lang}/courses/divemaster/">{divemaster}</a>
          <a href="/{lang}/courses/sdi-idc/">{idc}</a>
        </div>
        <div class="three columns">
          <a href="/{lang}/day-trips/">{day_trips}</a>
          <a href="/{lang}/day-trips/fun-dives/">{fun_dives}</a>
          <a href="/{lang}/day-trips/try-dive/">{try_dive}</a>
          <a href="/{lang}/day-trips/scuba-review/">{scuba_review}</a>
          <a href="/{lang}/day-trips/snorkeling/">{snorkeling}</a>
        </div>
        <div class="three columns">
          <a href="/{lang}/courses/open-advanced-package/">{ow_advanced}</a>
          <a href="/{lang}/courses/deep-wreck-nitrox/">{deep_wreck}</a>
          <a href="/{lang}/courses/open-to-divemaster/">{open_to_dm}</a>
          <a href="/{lang}/courses/tech-package/">{tech}</a>
        </div>
      </div>
    </div>
  </nav>"""

_NAV_LABELS_EN = {
    "about": "About us",
    "how_to": "How to guides",
    "getting_here": "Getting to Koh Chang",
    "dive_sites": "Dive sites",
    "faqs": "FAQs",
    "videos": "Videos",
    "contact": "Contact us",
    "courses": "Courses",
    "open_water": "Open Water Diver",
    "advanced": "Advanced Diver",
    "rescue": "Rescue Diver",
    "divemaster": "Divemaster",
    "idc": "IDC",
    "day_trips": "Day Trips",
    "fun_dives": "Fun Dives",
    "try_dive": "Try Diving",
    "scuba_review": "Scuba Review",
    "snorkeling": "Snorkeling",
    "ow_advanced": "OW & Advanced",
    "deep_wreck": "Deep, Wreck, Nitrox",
    "open_to_dm": "Open to Divemaster",
    "tech": "Technical Diving",
}

# TH: match main-nav / page labels; course product names stay English.
_NAV_LABELS_TH = {
    **_NAV_LABELS_EN,
    "about": "เกี่ยวกับเรา",
    "how_to": "คู่มือการดำน้ำ",
    "getting_here": "การเดินทาง & ที่พัก",
    "dive_sites": "จุดดำน้ำ",
    "faqs": "คำถามที่พบบ่อย",
    "videos": "วิดีโอ",
    "contact": "ติดต่อเรา",
    "courses": "คอร์ส",
    "day_trips": "ไปเช้าเย็นกลับ",
    "fun_dives": "ฟันไดฟ์",
    "try_dive": "ลองดำน้ำ",
}

_META_EN = """  <div class="footer-meta">
    <div class="container">
      <p><strong>Phone, WhatsApp & Line:</strong> <a href="tel:+66894013927">+66 (0) 894-013-927</a></p>
      <p>
        Chang Diving Center Co.,Ltd<br />
        21/52 Moo 4, Klong Prao Beach<br />
        Koh Chang, Trat, Thailand 23170
      </p>
      <p>
        <a href="/en/terms-and-conditions/">Terms</a> |
        <a href="/en/privacy-policy/">Privacy</a> |
        <a href="/en/refund-policy/">Refunds</a>
      </p>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>"""

_META_DE = """  <div class="footer-meta">
    <div class="container">
      <p><strong>Phone, WhatsApp & Line:</strong> <a href="tel:+66894013927">+66 (0) 894-013-927</a></p>
      <p>
        Chang Diving Center Co.,Ltd<br />
        21/52 Moo 4, Klong Prao Beach<br />
        Koh Chang, Trat, Thailand 23170
      </p>
      <div class="footer-links">
        <a href="/de/privacy-policy/">Datenschutz</a>
        <a href="/de/terms-and-conditions/">AGB</a>
        <a href="/de/refund-policy/">Rückerstattung</a>
      </div>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>"""

_META_TH = """  <div class="footer-meta">
    <div class="container">
      <p><strong>โทรศัพท์, WhatsApp และ Line:</strong> <a href="tel:+66894013927">+66 (0) 894-013-927</a></p>
      <p>
        บจก ช้างไดร์วิ่ง เซ็นเตอร์<br />
        21/52 หมู่ที่ 4,<br />
        อ.เกาะช้าง ต.เกาะช้าง จ.ตราด 23170 ประเทศไทย
      </p>
      <p>
        <a href="/th/terms-and-conditions/">ข้อกำหนดและเงื่อนไข</a> |
        <a href="/th/privacy-policy/">นโยบายความเป็นส่วนตัว</a> |
        <a href="/th/refund-policy/">นโยบายการคืนเงิน</a>
      </p>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>"""


def build_footer(lang: str) -> str:
    meta = {"en": _META_EN, "de": _META_DE, "th": _META_TH}[lang]
    labels = _NAV_LABELS_TH if lang == "th" else _NAV_LABELS_EN
    return (
        "<footer id=\"footer\">\n"
        + _NAV.format(lang=lang, **labels)
        + "\n"
        + meta
        + "\n</footer>"
    )


def main() -> int:
    footers = {lang: build_footer(lang) for lang in ("en", "de", "th")}

    # Sanity checks
    for lang, html in footers.items():
        if f'href="/{lang}/about/"' not in html:
            print(f"Built footer missing /{lang}/about/", file=sys.stderr)
            return 1
        if lang != "en" and 'href="/en/about/"' in html:
            print(f"Built {lang} footer wrongly contains /en/", file=sys.stderr)
            return 1

    # Write partials (source mirror)
    for lang, html in footers.items():
        path = ROOT / "partials" / f"footer-{lang}.html"
        path.parent.mkdir(parents=True, exist_ok=True)
        atomic_write(path, html + "\n")

    updated = 0
    missing = 0
    for path in sorted(ROOT.rglob("*.html")):
        if "node_modules" in path.parts or path.parts[0] == "partials":
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if 'id="footer"' not in text and "id='footer'" not in text:
            continue

        lang = path.parts[0] if path.parts[0] in ("en", "de", "th") else "en"
        new, n = FOOTER_RE.subn(footers[lang], text, count=1)
        if n != 1:
            print(f"skip/fail: {path}")
            missing += 1
            continue
        if new != text:
            atomic_write(path, new)
            updated += 1

    print(f"Wrote partials + updated {updated} pages (failures/skips: {missing})")
    return 0 if missing == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
