#!/usr/bin/env python3
"""Update meta descriptions, og:description, twitter:description, schema for courses and day-trips."""

import os
import re

# Course data: slug -> (price_thb, days, name_en, name_de, name_th, type)
# type: cert | trydive | refresher
COURSE_DATA = {
    "open-water-diver": (14490, "3 days", "Open Water Diver", "Open Water Diver", "Open Water Diver", "cert"),
    "open-advanced-package": (22490, "4 days", "Open Water + Advanced Package", "Open Water + Advanced Paket", "Open Water + Advanced แพ็กเกจ", "cert"),
    "open-to-divemaster": (64900, "~60 days", "Open Water to Divemaster", "Open Water bis Divemaster", "Open Water ถึง Divemaster", "cert"),
    "advanced": (10490, "2 days", "Advanced Open Water", "Advanced Open Water", "Advanced Open Water", "cert"),
    "rescue-diver": (14990, "3 days", "Rescue Diver", "Rescue Diver", "Rescue Diver", "cert"),
    "divemaster": (29990, "2 weeks", "Divemaster", "Divemaster", "Divemaster", "cert"),
    "nitrox-diver": (4990, "1 day", "Nitrox Diver", "Nitrox Diver", "Nitrox Diver", "cert"),
    "nitrox-blender": (9990, "1 day", "Nitrox Blender", "Nitrox Blender", "Nitrox Blender", "cert"),
    "deep-diver": (7990, "1 day", "Deep Diver", "Deep Diver", "Deep Diver", "cert"),
    "wreck-diver": (9990, "1 day", "Wreck Diver", "Wrack Diver", "Wreck Diver", "cert"),
    "sidemount": (9990, "1 day", "Sidemount", "Sidemount", "Sidemount", "cert"),
    "solo-diver": (8990, "1.5 days", "Solo Diver", "Solo Diver", "Solo Diver", "cert"),
    "night": (7990, "1.5 days", "Night Diver", "Night Diver", "Night Diver", "cert"),
    "navigation": (7990, "1 day", "Navigation", "Navigation", "Navigation", "cert"),
    "search-recovery": (7990, "1 day", "Search & Recovery", "Search & Recovery", "Search & Recovery", "cert"),
    "first-aid": (4990, "1 day", "First Aid", "Erste Hilfe", "ปฐมพยาบาล", "cert"),
    "advanced-nitrox": (14990, "2 days", "TDI Advanced Nitrox", "TDI Advanced Nitrox", "TDI Advanced Nitrox", "cert"),
    "deco-procedures": (24990, "3.5 days", "TDI Deco Procedures", "TDI Deco Procedures", "TDI Deco Procedures", "cert"),
    "intro-to-tech": (11990, "2 days", "TDI Intro to Tech", "TDI Intro to Tech", "TDI Intro to Tech", "cert"),
    "tech-package": (66990, "7.5 days", "TDI Tech Package", "TDI Tech Paket", "TDI Tech แพ็กเกจ", "cert"),
    "deep-wreck-nitrox": (19490, "2 days", "Deep Wreck Nitrox", "Deep Wreck Nitrox", "Deep Wreck Nitrox", "cert"),
    "advanced-wreck": (18870, "4.5 days", "TDI Advanced Wreck", "TDI Advanced Wreck", "TDI Advanced Wreck", "cert"),
    "master-scuba-diver": (50524, "7–12 days", "Master Scuba Diver", "Master Scuba Diver", "Master Scuba Diver", "cert"),
    "sdi-idc": (34990, "21 days", "SDI Instructor Development", "SDI Instructor Development", "SDI Instructor Development", "cert"),
    "sdi-ie": (9990, "2 days", "SDI Instructor Exam", "SDI Instructor Exam", "SDI Instructor Exam", "cert"),
    "efr-instructor": (9990, "2 days", "EFR Instructor", "EFR Instructor", "EFR Instructor", "cert"),
    "instructor-crossover": (15990, "2 days", "Instructor Crossover", "Instructor Crossover", "Instructor Crossover", "cert"),
}

DAYTRIP_DATA = {
    "try-dive": (4890, "1 day", "Try Dive", "Try Dive", "Try Dive", "trydive"),
    "scuba-review": (3950, "1 day", "Scuba Review", "Scuba Review", "Scuba Review", "refresher"),
}


def fmt_price(n):
    return f"{n:,}".replace(",", ",")


def build_desc_en(name, price, days, ctype):
    price_s = fmt_price(price)
    if ctype == "trydive":
        return f"{name} Koh Chang – from {price_s} THB. 2 reef dives in 1 day. No certification needed – just experience. Chang Diving since 2005."
    if ctype == "refresher":
        return f"{name} Koh Chang – from {price_s} THB. 2 refresher dives in 1 day. Refresh your skills – no new certification. Chang Diving since 2005."
    return f"{name} Koh Chang – from {price_s} THB. Get certified in {days}. Chang Diving – professional scuba training since 2005."


def build_desc_de(name, price, days, ctype):
    price_s = fmt_price(price)
    if ctype == "trydive":
        return f"{name} Koh Chang – ab {price_s} THB. 2 Riff-Tauchgänge an 1 Tag. Keine Zertifizierung nötig. Chang Diving seit 2005."
    if ctype == "refresher":
        return f"{name} Koh Chang – ab {price_s} THB. 2 Auffrischungs-Tauchgänge an 1 Tag. Skills auffrischen – keine neue Zertifizierung. Chang Diving seit 2005."
    return f"{name} Koh Chang – ab {price_s} THB. Zertifizierung in {days}. Chang Diving – professionelles Tauchtraining seit 2005."


def build_desc_th(name, price, days, ctype):
    price_s = fmt_price(price)
    if ctype == "trydive":
        return f"{name} Koh Chang – เริ่ม {price_s} บาท 2 ไดฟ์แนวปะการังใน 1 วัน ไม่ต้องมีใบรับรอง Chang Diving ตั้งแต่ปี 2005"
    if ctype == "refresher":
        return f"{name} Koh Chang – เริ่ม {price_s} บาท 2 ไดฟ์รีเฟรชใน 1 วัน ทบทวนทักษะ ไม่ใช่ใบรับรองใหม่ Chang Diving ตั้งแต่ปี 2005"
    return f"{name} Koh Chang – เริ่ม {price_s} บาท รับใบรับรองใน {days} Chang Diving – ฝึกดำน้ำมืออาชีพตั้งแต่ปี 2005"


def replace_meta_content(content, attr, old_val, new_val):
    """Replace content in meta tag. Handles name= and property=."""
    # Match: name="description" or property="og:description" etc.
    if attr == "description":
        pattern = r'(<meta\s+name="description"\s+content=")[^"]*(")'
    elif attr == "og:description":
        pattern = r'(<meta\s+property="og:description"\s+content=")[^"]*(")'
    elif attr == "twitter:description":
        pattern = r'(<meta\s+name="twitter:description"\s+content=")[^"]*(")'
    else:
        return content
    return re.sub(pattern, r'\1' + new_val + r'\2', content, count=1)


def replace_schema_description(content, new_desc):
    """Replace first Course schema description in ld+json."""
    pattern = r'("description":\s*")([^"]*)(")'
    blocks = re.split(r'(<script type="application/ld\+json">)', content)
    for i in range(1, len(blocks), 2):
        if i + 1 < len(blocks):
            block = blocks[i + 1]
            if '"@type": "Course"' in block or '"@type":"Course"' in block:
                new_block = re.sub(
                    pattern,
                    lambda m: m.group(1) + new_desc + m.group(3),
                    block,
                    count=1,
                )
                blocks[i + 1] = new_block
                break
    return "".join(blocks)


def process_file(filepath, new_desc):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = replace_meta_content(content, "description", None, new_desc)
    content = replace_meta_content(content, "og:description", None, new_desc)
    content = replace_meta_content(content, "twitter:description", None, new_desc)
    content = replace_schema_description(content, new_desc)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  OK: {filepath}")


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    all_data = {**COURSE_DATA, **DAYTRIP_DATA}

    for slug, (price, days, name_en, name_de, name_th, ctype) in all_data.items():
        desc_en = build_desc_en(name_en, price, days, ctype)
        desc_de = build_desc_de(name_de, price, days, ctype)
        desc_th = build_desc_th(name_th, price, days, ctype)

        if slug in DAYTRIP_DATA:
            paths = [
                (f"{base}/en/day-trips/{slug}/index.html", desc_en),
                (f"{base}/de/day-trips/{slug}/index.html", desc_de),
                (f"{base}/th/day-trips/{slug}/index.html", desc_th),
            ]
        else:
            paths = [
                (f"{base}/en/courses/{slug}/index.html", desc_en),
                (f"{base}/de/courses/{slug}/index.html", desc_de),
                (f"{base}/th/courses/{slug}/index.html", desc_th),
            ]

        print(f"\n[{slug}]")
        for path, desc in paths:
            if os.path.exists(path):
                process_file(path, desc)
            else:
                print(f"  SKIP (not found): {path}")


if __name__ == "__main__":
    main()
