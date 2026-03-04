#!/usr/bin/env python3
"""Update course titles: [Course Name] Koh Chang – [Key Benefit] - from [Price] THB | Chang Diving"""

import os
import re

# slug -> (price, name_en, name_de, name_th, benefit_en, benefit_de, benefit_th)
COURSE_DATA = {
    "open-water-diver": (14490, "Open Water Diver", "Open Water Diver", "Open Water Diver", "Get certified in 3 days", "Zertifizierung in 3 Tagen", "รับใบรับรองใน 3 วัน"),
    "open-advanced-package": (22490, "Open Water + Advanced Package", "Open Water + Advanced Paket", "Open Water + Advanced แพ็กเกจ", "Get certified in 4 days", "Zertifizierung in 4 Tagen", "รับใบรับรองใน 4 วัน"),
    "open-to-divemaster": (64900, "Open Water to Divemaster", "Open Water bis Divemaster", "Open Water ถึง Divemaster", "Complete in ~60 days", "Abschluss in ~60 Tagen", "สำเร็จใน ~60 วัน"),
    "advanced": (10490, "Advanced Open Water", "Advanced Open Water", "Advanced Open Water", "Get certified in 2 days", "Zertifizierung in 2 Tagen", "รับใบรับรองใน 2 วัน"),
    "rescue-diver": (14990, "Rescue Diver", "Rescue Diver", "Rescue Diver", "Get certified in 3 days", "Zertifizierung in 3 Tagen", "รับใบรับรองใน 3 วัน"),
    "divemaster": (29990, "Divemaster", "Divemaster", "Divemaster", "2-week training", "2-wöchige Ausbildung", "ฝึก 2 สัปดาห์"),
    "nitrox-diver": (4990, "Nitrox Diver", "Nitrox Diver", "Nitrox Diver", "Get certified in 1 day", "Zertifizierung in 1 Tag", "รับใบรับรองใน 1 วัน"),
    "nitrox-blender": (9990, "Nitrox Blender", "Nitrox Blender", "Nitrox Blender", "1-day certification", "1-Tages-Zertifizierung", "รับใบรับรอง 1 วัน"),
    "deep-diver": (7990, "Deep Diver", "Deep Diver", "Deep Diver", "1-day specialty", "1-Tages-Specialty", "Specialty 1 วัน"),
    "wreck-diver": (9990, "Wreck Diver", "Wrack Diver", "Wreck Diver", "1-day specialty", "1-Tages-Specialty", "Specialty 1 วัน"),
    "sidemount": (9990, "Sidemount", "Sidemount", "Sidemount", "1-day specialty", "1-Tages-Specialty", "Specialty 1 วัน"),
    "solo-diver": (8990, "Solo Diver", "Solo Diver", "Solo Diver", "1.5-day specialty", "1,5-Tage-Specialty", "Specialty 1.5 วัน"),
    "night": (7990, "Night Diver", "Night Diver", "Night Diver", "1.5-day specialty", "1,5-Tage-Specialty", "Specialty 1.5 วัน"),
    "navigation": (7990, "Navigation", "Navigation", "Navigation", "1-day specialty", "1-Tages-Specialty", "Specialty 1 วัน"),
    "search-recovery": (7990, "Search & Recovery", "Search & Recovery", "Search & Recovery", "1-day specialty", "1-Tages-Specialty", "Specialty 1 วัน"),
    "first-aid": (4990, "First Aid", "Erste Hilfe", "ปฐมพยาบาล", "1-day certification", "1-Tages-Zertifizierung", "รับใบรับรอง 1 วัน"),
    "advanced-nitrox": (14990, "TDI Advanced Nitrox", "TDI Advanced Nitrox", "TDI Advanced Nitrox", "2-day tech certification", "2-Tage-Tech-Zertifizierung", "รับใบรับรองเทค 2 วัน"),
    "deco-procedures": (24990, "TDI Deco Procedures", "TDI Deco Procedures", "TDI Deco Procedures", "3.5-day tech certification", "3,5-Tage-Tech-Zertifizierung", "รับใบรับรองเทค 3.5 วัน"),
    "intro-to-tech": (11990, "TDI Intro to Tech", "TDI Intro to Tech", "TDI Intro to Tech", "2-day introduction", "2-Tage-Einführung", "แนะนำ 2 วัน"),
    "tech-package": (74990, "TDI Tech Package", "TDI Tech Paket", "TDI Tech แพ็กเกจ", "7.5-day training", "7,5-Tage-Ausbildung", "ฝึก 7.5 วัน"),
    "deep-wreck-nitrox": (19490, "Deep Wreck Nitrox", "Deep Wreck Nitrox", "Deep Wreck Nitrox", "2-day tech certification", "2-Tage-Tech-Zertifizierung", "รับใบรับรองเทค 2 วัน"),
    "advanced-wreck": (18870, "TDI Advanced Wreck", "TDI Advanced Wreck", "TDI Advanced Wreck", "4.5-day tech certification", "4,5-Tage-Tech-Zertifizierung", "รับใบรับรองเทค 4.5 วัน"),
    "master-scuba-diver": (50524, "Master Scuba Diver", "Master Scuba Diver", "Master Scuba Diver", "7–12 day package", "7–12-Tage-Paket", "แพ็กเกจ 7–12 วัน"),
    "sdi-idc": (34990, "SDI Instructor Development", "SDI Instructor Development", "SDI Instructor Development", "21-day program", "21-Tage-Programm", "โปรแกรม 21 วัน"),
    "sdi-ie": (9990, "SDI Instructor Exam", "SDI Instructor Exam", "SDI Instructor Exam", "2-day exam", "2-Tage-Prüfung", "สอบ 2 วัน"),
    "efr-instructor": (9990, "EFR Instructor", "EFR Instructor", "EFR Instructor", "2-day certification", "2-Tage-Zertifizierung", "รับใบรับรอง 2 วัน"),
    "instructor-crossover": (15990, "Instructor Crossover", "Instructor Crossover", "Instructor Crossover", "2-day process", "2-Tage-Prozess", "กระบวนการ 2 วัน"),
}

DAYTRIP_DATA = {
    "try-dive": (4890, "Try Dive", "Try Dive", "Try Dive", "2 reef dives, no cert needed", "2 Riff-Tauchgänge, keine Zertifizierung", "2 ไดฟ์แนวปะการัง ไม่ต้องมีใบรับรอง"),
    "scuba-review": (3950, "Scuba Review", "Scuba Review", "Scuba Review", "2 refresher dives", "2 Auffrischungs-Tauchgänge", "2 ไดฟ์รีเฟรช"),
}


def fmt_price(n):
    return f"{n:,}"


def build_title_en(name, benefit, price):
    return f"{name} Koh Chang – {benefit} - from {fmt_price(price)} THB | Chang Diving"


def build_title_de(name, benefit, price):
    return f"{name} Koh Chang – {benefit} - ab {fmt_price(price).replace(',', '.')} THB | Chang Diving"


def build_title_th(name, benefit, price):
    return f"{name} Koh Chang – {benefit} - เริ่ม {fmt_price(price)} บาท | ช้างไดฟ์วิ่ง"


def replace_title(content, new_title):
    content = re.sub(r'<title>\s*[^<]*\s*</title>', f'<title>\n      {new_title}\n    </title>', content, count=1, flags=re.DOTALL)
    return content


def replace_og_title(content, new_title):
    return re.sub(r'(<meta\s+property="og:title"\s+content=")[^"]*(")', r'\1' + new_title + r'\2', content, count=1)


def replace_twitter_title(content, new_title):
    return re.sub(r'(<meta\s+name="twitter:title"\s+content=")[^"]*(")', r'\1' + new_title + r'\2', content, count=1)


def replace_og_image_alt(content, new_title):
    return re.sub(
        r'(<meta\s+property="og:image:alt"\s+content=")[^"]*(")',
        r'\1' + new_title + r'\2',
        content,
        count=1,
        flags=re.DOTALL,
    )


def replace_schema_name(content, new_title):
    """Replace Course schema name - first occurrence in first ld+json with Course type."""
    pattern = r'("name":\s*")([^"]*)(")'
    blocks = re.split(r'(<script type="application/ld\+json">)', content)
    for i in range(1, len(blocks), 2):
        if i + 1 < len(blocks):
            block = blocks[i + 1]
            if '"@type": "Course"' in block or '"@type":"Course"' in block:
                # Replace first "name" in this block (the Course name)
                def repl(m):
                    return m.group(1) + new_title + m.group(3)
                new_block = re.sub(pattern, repl, block, count=1)
                blocks[i + 1] = new_block
                break
    return "".join(blocks)


def process_file(filepath, new_title):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    content = replace_title(content, new_title)
    content = replace_og_title(content, new_title)
    content = replace_twitter_title(content, new_title)
    content = replace_og_image_alt(content, new_title)
    content = replace_schema_name(content, new_title)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  OK: {filepath}")


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    all_data = {**COURSE_DATA, **DAYTRIP_DATA}

    for slug, row in all_data.items():
        price, name_en, name_de, name_th, ben_en, ben_de, ben_th = row
        title_en = build_title_en(name_en, ben_en, price)
        title_de = build_title_de(name_de, ben_de, price)
        title_th = build_title_th(name_th, ben_th, price)

        if slug in DAYTRIP_DATA:
            paths = [
                (f"{base}/en/day-trips/{slug}/index.html", title_en),
                (f"{base}/de/day-trips/{slug}/index.html", title_de),
                (f"{base}/th/day-trips/{slug}/index.html", title_th),
            ]
        else:
            paths = [
                (f"{base}/en/courses/{slug}/index.html", title_en),
                (f"{base}/de/courses/{slug}/index.html", title_de),
                (f"{base}/th/courses/{slug}/index.html", title_th),
            ]

        print(f"\n[{slug}]")
        for path, title in paths:
            if os.path.exists(path):
                process_file(path, title)
            else:
                print(f"  SKIP (not found): {path}")


if __name__ == "__main__":
    main()
