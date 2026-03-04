#!/usr/bin/env python3
"""Round 3: Adds FAQPage schema to 12 remaining course pages."""

import re
import os

FAQ_DATA = {
    "open-to-divemaster": {
        "en": [
            {"q": "What is the Open Water to Divemaster internship?",
             "a": "A two-month paid internship package taking you from zero experience to Divemaster. Includes OWD, AOWD, Rescue, First Aid, and Divemaster training with 60 logged dives, daily mentorship, and real dive center exposure in Koh Chang."},
            {"q": "Who can join the Open Water to Divemaster internship?",
             "a": "No prior certification required. Minimum age 18, good physical fitness, basic swimming ability, and commitment to teamwork. Available start dates October to March."},
            {"q": "How much does the Open Water to Divemaster internship cost?",
             "a": "64,900 THB (PADI or SDI). Individual courses booked separately would cost 111,050 THB (PADI) or 109,550 THB (SDI). Crewpack and application fee not included."},
            {"q": "What is included in the Open Water to Divemaster internship?",
             "a": "OWD, AOWD, Rescue Diver, First Aid, Divemaster course, 60 logged dives, study materials, daily briefings, logbook reviews, dive site planning, supervised support in dive shop and on board, and full mentorship by multilingual instructors."},
            {"q": "Where does the Open Water to Divemaster internship take place?",
             "a": "At Chang Diving on Koh Chang. Training dives at Koh Chang dive sites including the HTMS Chang wreck in Mu Koh Chang National Marine Park."}
        ],
        "de": [
            {"q": "Was ist das Open Water to Divemaster Praktikum?",
             "a": "Ein zweimonatiges bezahltes Praktikum von null Erfahrung bis Divemaster. Enthält OWD, AOWD, Rescue, First Aid und Divemaster mit 60 protokollierten Tauchgängen, täglichem Mentoring und echter Tauchcenter-Erfahrung auf Koh Chang."},
            {"q": "Wer kann am Open Water to Divemaster Praktikum teilnehmen?",
             "a": "Keine Vorerfahrung erforderlich. Mindestalter 18, gute körperliche Fitness, Grundschwimmfähigkeit und Engagement für Teamarbeit. Starttermine Oktober bis März."},
            {"q": "Was kostet das Open Water to Divemaster Praktikum?",
             "a": "64.900 THB (PADI oder SDI). Einzelkurse würden 111.050 THB (PADI) bzw. 109.550 THB (SDI) kosten. Crewpack und Anmeldegebühr nicht enthalten."},
            {"q": "Was ist im Open Water to Divemaster Praktikum inklusive?",
             "a": "OWD, AOWD, Rescue Diver, First Aid, Divemaster Kurs, 60 protokollierte Tauchgänge, Lernmaterialien, tägliche Briefings, Logbuchprüfung, Tauchplatzplanung, betreute Mitarbeit im Tauchcenter und an Bord sowie volles Mentoring durch mehrsprachige Instructoren."},
            {"q": "Wo findet das Open Water to Divemaster Praktikum statt?",
             "a": "Bei Chang Diving auf Koh Chang. Ausbildungstauchgänge an Tauchplätzen von Koh Chang inklusive des HTMS Chang Wracks im Mu Koh Chang Meeresschutzgebiet."}
        ],
        "th": [
            {"q": "โปรแกรมฝึกงาน Open Water to Divemaster คืออะไร?",
             "a": "แพ็คเกจฝึกงาน 2 เดือนจากไม่มีประสบการณ์ถึง Divemaster รวม OWD AOWD Rescue First Aid และ Divemaster พร้อม 60 ไดฟ์ บันทึก การให้คำปรึกษารายวัน และประสบการณ์จริงที่ศูนย์ดำน้ำบนเกาะช้าง"},
            {"q": "ใครสามารถเข้าร่วมโปรแกรมฝึกงาน Open Water to Divemaster ได้บ้าง?",
             "a": "ไม่ต้องมีใบรับรองมาก่อน อายุขั้นต่ำ 18 ปี สุขภาพแข็งแรง ว่ายน้ำได้ และพร้อมทำงานเป็นทีม เปิดรับเดือนตุลาคมถึงมีนาคม"},
            {"q": "โปรแกรมฝึกงาน Open Water to Divemaster ราคาเท่าไหร่?",
             "a": "64,900 บาท (PADI หรือ SDI) ถ้าจองแยกจะรวม 111,050 บาท (PADI) หรือ 109,550 บาท (SDI) ไม่รวม Crewpack และค่าสมัคร"},
            {"q": "โปรแกรมฝึกงาน Open Water to Divemaster รวมอะไรบ้าง?",
             "a": "OWD AOWD Rescue Diver First Aid คอร์ส Divemaster 60 ไดฟ์บันทึก เอกสารเรียน daily briefings การตรวจ logbook การวางแผนแหล่งดำน้ำ การช่วยงานในศูนย์ดำน้ำและบนเรือ และการให้คำปรึกษาจากครูหลายภาษา"},
            {"q": "โปรแกรมฝึกงาน Open Water to Divemaster จัดที่ไหน?",
             "a": "ที่ Chang Diving บนเกาะช้าง ไดฟ์ฝึกที่แหล่งดำน้ำเกาะช้าง รวมถึงเรือหลวงช้างในอุทยานแห่งชาติหมู่เกาะช้าง"}
        ]
    },
    "master-scuba-diver": {
        "en": [
            {"q": "What is the Master Scuba Diver rating?",
             "a": "The most prestigious non-professional level in recreational diving. Recognition of training, logged dives, and commitment to excellence. Available via PADI (Rescue + 5 specialties + 50 dives) or SDI (Rescue + 4 specialties + 50 dives)."},
            {"q": "Who can become a Master Scuba Diver?",
             "a": "PADI: Rescue Diver + 5 PADI specialties + 50 logged dives, age 18+. SDI: Rescue Diver + 4 SDI specialties + 50 logged dives, age 18+. You cannot mix certifications between agencies."},
            {"q": "How much does the Master Scuba Diver bundle cost?",
             "a": "PADI MSD Bundle: 62,424 THB (15% discount, 18–20 dives). SDI MSD Bundle: 50,524 THB (15% discount, 20–21 dives). Application fees not included."},
            {"q": "What is included in the Master Scuba Diver program?",
             "a": "Personal MSD consultation, dive log review, specialty course booking support, MSD application support, recognition materials, all scuba equipment, hotel pickup, snacks, fruit, soft drinks and lunch onboard."},
            {"q": "Where is the Master Scuba Diver training conducted?",
             "a": "At Koh Chang dive sites including the HTMS Chang wreck. Sample specialties used for pricing include Deep, Wreck, Nitrox, Search & Recovery, and Sidemount."}
        ],
        "de": [
            {"q": "Was ist die Master Scuba Diver Bewertung?",
             "a": "Die prestigeträchtigste nicht-professionelle Stufe im Freizeittauchen. Anerkennung von Ausbildung, protokollierten Tauchgängen und Engagement. Verfügbar über PADI (Rescue + 5 Specialties + 50 Tauchgänge) oder SDI (Rescue + 4 Specialties + 50 Tauchgänge)."},
            {"q": "Wer kann Master Scuba Diver werden?",
             "a": "PADI: Rescue Diver + 5 PADI Specialties + 50 protokollierte Tauchgänge, 18+. SDI: Rescue Diver + 4 SDI Specialties + 50 protokollierte Tauchgänge, 18+. Agenturen dürfen nicht gemischt werden."},
            {"q": "Was kostet das Master Scuba Diver Bundle?",
             "a": "PADI MSD Bundle: 62.424 THB (15% Rabatt, 18–20 Tauchgänge). SDI MSD Bundle: 50.524 THB (15% Rabatt, 20–21 Tauchgänge). Anmeldegebühren nicht enthalten."},
            {"q": "Was ist im Master Scuba Diver Programm inklusive?",
             "a": "Persönliche MSD-Beratung, Logbuchprüfung, Specialty-Buchungsunterstützung, MSD-Antragsunterstützung, Anerkennungsmaterialien, gesamte Tauchausrüstung, Hotelabholung, Snacks, Obst, Softdrinks und Mittagessen an Bord."},
            {"q": "Wo findet das Master Scuba Diver Training statt?",
             "a": "An Tauchplätzen von Koh Chang inklusive des HTMS Chang Wracks. Beispiel-Specialties für die Preisberechnung: Deep, Wreck, Nitrox, Search & Recovery, Sidemount."}
        ],
        "th": [
            {"q": "Master Scuba Diver คืออะไร?",
             "a": "ระดับที่ไม่ใช่มืออาชีพที่สูงที่สุดในการดำน้ำสันทนาการ การยอมรับการฝึกอบรม ไดฟ์ที่บันทึก และความมุ่งมั่น PADI (Rescue + 5 specialties + 50 ไดฟ์) หรือ SDI (Rescue + 4 specialties + 50 ไดฟ์)"},
            {"q": "ใครสามารถเป็น Master Scuba Diver ได้บ้าง?",
             "a": "PADI: Rescue Diver + 5 PADI specialties + 50 ไดฟ์ อายุ 18+ SDI: Rescue Diver + 4 SDI specialties + 50 ไดฟ์ อายุ 18+ ห้ามผสมหน่วยงาน"},
            {"q": "Master Scuba Diver bundle ราคาเท่าไหร่?",
             "a": "PADI MSD Bundle: 62,424 บาท (ส่วนลด 15% 18–20 ไดฟ์) SDI MSD Bundle: 50,524 บาท (ส่วนลด 15% 20–21 ไดฟ์) ไม่รวมค่าสมัคร"},
            {"q": "โปรแกรม Master Scuba Diver รวมอะไรบ้าง?",
             "a": "การปรึกษา MSD ส่วนตัว การตรวจ logbook การช่วยจอง specialty การช่วยสมัคร MSD เอกสารรับรอง อุปกรณ์ดำน้ำครบชุด รับจากโรงแรม ขนม ผลไม้ เครื่องดื่ม และอาหารกลางวันบนเรือ"},
            {"q": "การฝึก Master Scuba Diver จัดที่ไหน?",
             "a": "ที่แหล่งดำน้ำเกาะช้าง รวมถึงเรือหลวงช้าง ตัวอย่าง specialties: Deep Wreck Nitrox Search & Recovery Sidemount"}
        ]
    },
    "search-recovery": {
        "en": [
            {"q": "What is the Search & Recovery Diver course?",
             "a": "Teaches you to locate and retrieve lost objects underwater – from dive gear to treasures. Covers search patterns, knot tying, lift bags, navigation, and planning in low visibility or currents."},
            {"q": "Who can join the Search & Recovery course?",
             "a": "PADI AOWD or SDI OWD certification. Minimum age 12. SDI: 1 day, 2 dives. PADI: 2 days, 4 dives. Adventure Dive option available."},
            {"q": "How much does the Search & Recovery course cost?",
             "a": "SDI: 7,990 THB. PADI: 11,990 THB. Includes 2–4 dives from the boat, instructor (max 4 students), all equipment, materials, lunch, drinks, and hotel pickup."},
            {"q": "What is included in the Search & Recovery course?",
             "a": "1–2 day specialty, 2–4 boat dives, professional instructor (1-on-1 to max 1-on-4), all scuba equipment, digital or printed materials, lunch, fruits, soft drinks, tea/coffee, and hotel pickup in selected areas of Koh Chang."},
            {"q": "Where does Search & Recovery training take place?",
             "a": "At Koh Chang dive sites from the boat. The HTMS Chang wreck is among the locations used for training."}
        ],
        "de": [
            {"q": "Was ist der Search & Recovery Diver Kurs?",
             "a": "Lehrt das Auffinden und Bergen verlorener Gegenstände unter Wasser – von Tauchausrüstung bis Schätzen. Behandelt Suchmuster, Knoten, Hebesäcke, Navigation und Planung bei schlechter Sicht oder Strömung."},
            {"q": "Wer kann am Search & Recovery Kurs teilnehmen?",
             "a": "PADI AOWD oder SDI OWD Zertifizierung. Mindestalter 12. SDI: 1 Tag, 2 Tauchgänge. PADI: 2 Tage, 4 Tauchgänge. Adventure Dive Option verfügbar."},
            {"q": "Was kostet der Search & Recovery Kurs?",
             "a": "SDI: 7.990 THB. PADI: 11.990 THB. Enthält 2–4 Bootstauchgänge, Instructor (max. 4 Schüler), gesamte Ausrüstung, Materialien, Mittagessen, Getränke und Hotelabholung."},
            {"q": "Was ist im Search & Recovery Kurs inklusive?",
             "a": "1–2-Tages-Specialty, 2–4 Bootstauchgänge, professioneller Instructor (1-zu-1 bis max. 1-zu-4), gesamte Tauchausrüstung, digitale oder gedruckte Materialien, Mittagessen, Obst, Softdrinks, Tee/Kaffee und Hotelabholung."},
            {"q": "Wo findet das Search & Recovery Training statt?",
             "a": "An Tauchplätzen von Koh Chang vom Boot aus. Das HTMS Chang Wrack gehört zu den Ausbildungsstandorten."}
        ],
        "th": [
            {"q": "คอร์ส Search & Recovery Diver คืออะไร?",
             "a": "สอนการค้นหาและกู้วัตถุที่หายใต้น้ำ – จากอุปกรณ์ดำน้ำถึงสมบัติ ครอบคลุมรูปแบบการค้นหา การผูกเงื่อน ถุงยก การนำทาง และการวางแผนในน้ำขุ่นหรือกระแสน้ำ"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Search & Recovery ได้บ้าง?",
             "a": "ใบรับรอง PADI AOWD หรือ SDI OWD อายุขั้นต่ำ 12 ปี SDI: 1 วัน 2 ไดฟ์ PADI: 2 วัน 4 ไดฟ์ มีตัวเลือก Adventure Dive"},
            {"q": "คอร์ส Search & Recovery ราคาเท่าไหร่?",
             "a": "SDI: 7,990 บาท PADI: 11,990 บาท รวม 2–4 ไดฟ์จากเรือ ครูสอน (สูงสุด 4 คน) อุปกรณ์ครบชุด เอกสาร อาหารกลางวัน เครื่องดื่ม และรับจากโรงแรม"},
            {"q": "คอร์ส Search & Recovery รวมอะไรบ้าง?",
             "a": "Specialty 1–2 วัน ดำน้ำ 2–4 ไดฟ์จากเรือ ครูสอนมืออาชีพ (1 ต่อ 1 ถึงสูงสุด 1 ต่อ 4) อุปกรณ์ดำน้ำครบชุด เอกสารดิจิทัลหรือพิมพ์ อาหารกลางวัน ผลไม้ เครื่องดื่ม ชา/กาแฟ และรับจากโรงแรม"},
            {"q": "การฝึก Search & Recovery จัดที่ไหน?",
             "a": "ที่แหล่งดำน้ำเกาะช้างจากเรือ เรือหลวงช้างเป็นหนึ่งในสถานที่ฝึก"}
        ]
    },
    "tech-package": {
        "en": [
            {"q": "What is the TDI Technical Diver Training Package?",
             "a": "An intensive 7.5-day program with three TDI certifications: Advanced Nitrox, Decompression Procedures, and Advanced Wreck Diver. Your gateway to extended range, wreck penetration, or highest-standard recreational skills."},
            {"q": "Who can join the Tech Package?",
             "a": "AOWD + Nitrox + Deep + Wreck certification required. 50+ logged dives. Minimum age 18. TDI agency."},
            {"q": "How much does the Tech Package cost?",
             "a": "74,990 THB. Includes 7.5 days, 12 technical dives, pool session, backmount or sidemount rig, deco stage tanks, dive computer, compass, slates, DSMBs, reels, torches, instructor, materials, lunch, drinks, and hotel pickup."},
            {"q": "What is included in the Tech Package?",
             "a": "7.5-day package, 12 tech dives from the boat, wing & harness (backmount or sidemount), deco stage tanks + regs, dive computer + backup gauge, compass, slates, DSMBs, reel & spool, primary and backup torches, professional instructor (max 4 students), materials, lunch, fruits, drinks, hotel pickup."},
            {"q": "Where does the Tech Package training take place?",
             "a": "At Koh Chang dive sites from the boat. The HTMS Chang wreck is used for training."}
        ],
        "de": [
            {"q": "Was ist das TDI Technical Diver Training Package?",
             "a": "Ein intensives 7,5-Tage-Programm mit drei TDI-Zertifizierungen: Advanced Nitrox, Decompression Procedures und Advanced Wreck Diver. Dein Einstieg in Extended Range, Wrackpenetration oder höchste Freizeittaucher-Standards."},
            {"q": "Wer kann am Tech Package teilnehmen?",
             "a": "AOWD + Nitrox + Deep + Wreck erforderlich. 50+ protokollierte Tauchgänge. Mindestalter 18. TDI-Agentur."},
            {"q": "Was kostet das Tech Package?",
             "a": "74.990 THB. Enthält 7,5 Tage, 12 Technik-Tauchgänge, Pool-Session, Backmount oder Sidemount, Deco-Stage-Flaschen, Tauchcomputer, Kompass, Slates, DSMBs, Reels, Lampen, Instructor, Materialien, Mittagessen, Getränke und Hotelabholung."},
            {"q": "Was ist im Tech Package inklusive?",
             "a": "7,5-Tage-Paket, 12 Tech-Tauchgänge vom Boot, Wing & Harness (Backmount oder Sidemount), Deco-Stage-Flaschen + Regler, Tauchcomputer + Backup-Gauge, Kompass, Slates, DSMBs, Reel & Spool, Haupt- und Backup-Lampen, Instructor (max. 4 Schüler), Materialien, Mittagessen, Obst, Getränke, Hotelabholung."},
            {"q": "Wo findet das Tech Package Training statt?",
             "a": "An Tauchplätzen von Koh Chang vom Boot. Das HTMS Chang Wrack wird für die Ausbildung genutzt."}
        ],
        "th": [
            {"q": "TDI Technical Diver Training Package คืออะไร?",
             "a": "โปรแกรมเข้มข้น 7.5 วัน พร้อมใบรับรอง TDI สามรายการ: Advanced Nitrox Decompression Procedures และ Advanced Wreck Diver ประตูสู่ extended range การเข้า wreck หรือทักษะสันทนาการมาตรฐานสูงสุด"},
            {"q": "ใครสามารถเข้าร่วม Tech Package ได้บ้าง?",
             "a": "ต้องมีใบรับรอง AOWD + Nitrox + Deep + Wreck บันทึกดำน้ำ 50+ ครั้ง อายุขั้นต่ำ 18 ปี หน่วยงาน TDI"},
            {"q": "Tech Package ราคาเท่าไหร่?",
             "a": "74,990 บาท รวม 7.5 วัน 12 tech dives เซสชันสระ backmount หรือ sidemount ถัง deco stage dive computer เข็มทิศ slates DSMBs reels ไฟฉาย ครูสอน เอกสาร อาหารกลางวัน เครื่องดื่ม และรับจากโรงแรม"},
            {"q": "Tech Package รวมอะไรบ้าง?",
             "a": "แพ็คเกจ 7.5 วัน 12 tech dives จากเรือ wing & harness (backmount หรือ sidemount) ถัง deco stage + regs dive computer + backup gauge เข็มทิศ slates DSMBs reel & spool ไฟฉายหลักและสำรอง ครูสอน (สูงสุด 4 คน) เอกสาร อาหารกลางวัน ผลไม้ เครื่องดื่ม รับจากโรงแรม"},
            {"q": "การฝึก Tech Package จัดที่ไหน?",
             "a": "ที่แหล่งดำน้ำเกาะช้างจากเรือ ใช้เรือหลวงช้างในการฝึก"}
        ]
    },
    "intro-to-tech": {
        "en": [
            {"q": "What is TDI Intro to Tech?",
             "a": "Introduces recreational divers to technical diving. You dive with sidemount or twinset configurations, improving buoyancy, trim, propulsion, and dive planning within no-decompression limits. Max depth 23m."},
            {"q": "Who can join Intro to Tech?",
             "a": "SDI Open Water Diver or equivalent. 25 logged dives minimum. Age 15+. TDI agency."},
            {"q": "How much does Intro to Tech cost?",
             "a": "11,990 THB. Includes 2 days, 3 open water dives, pool session on Day 1, theory online, instructor (max 4 students), all equipment, materials, lunch, drinks, and hotel pickup."},
            {"q": "What is included in Intro to Tech?",
             "a": "2-day course, 3 Intro to Tech dives from the boat, pool/confined water on Day 1, theory online, professional instructor (1-on-1 to max 1-on-4), all scuba equipment, digital or printed materials, lunch, fruits, soft drinks, tea/coffee, hotel pickup."},
            {"q": "Where does Intro to Tech training take place?",
             "a": "At Koh Chang dive sites from the boat. The HTMS Chang wreck is mentioned in the discovery section."}
        ],
        "de": [
            {"q": "Was ist TDI Intro to Tech?",
             "a": "Führt Freizeittaucher in das Techniktauchen ein. Du tauchst mit Sidemount oder Twinset, verbesserst Auftrieb, Trim, Vortrieb und Tauchplanung innerhalb der Nullzeitgrenzen. Max. Tiefe 23m."},
            {"q": "Wer kann an Intro to Tech teilnehmen?",
             "a": "SDI Open Water Diver oder gleichwertig. 25 protokollierte Tauchgänge. Alter 15+. TDI-Agentur."},
            {"q": "Was kostet Intro to Tech?",
             "a": "11.990 THB. Enthält 2 Tage, 3 Freiwassertauchgänge, Pool-Session am Tag 1, Theorie online, Instructor (max. 4 Schüler), gesamte Ausrüstung, Materialien, Mittagessen, Getränke und Hotelabholung."},
            {"q": "Was ist in Intro to Tech inklusive?",
             "a": "2-Tage-Kurs, 3 Intro-to-Tech-Tauchgänge vom Boot, Pool/Begrenztes Wasser am Tag 1, Theorie online, Instructor (1-zu-1 bis max. 1-zu-4), gesamte Tauchausrüstung, digitale oder gedruckte Materialien, Mittagessen, Obst, Softdrinks, Tee/Kaffee, Hotelabholung."},
            {"q": "Wo findet Intro to Tech statt?",
             "a": "An Tauchplätzen von Koh Chang vom Boot. Das HTMS Chang Wrack wird erwähnt."}
        ],
        "th": [
            {"q": "TDI Intro to Tech คืออะไร?",
             "a": "แนะนำนักดำน้ำสันทนาการสู่การดำน้ำเทคนิค คุณดำน้ำด้วย sidemount หรือ twinset ปรับปรุงการลอยตัว trim การเคลื่อนที่ และการวางแผนดำน้ำภายในขีดจำกัด no-decompression ความลึกสูงสุด 23 เมตร"},
            {"q": "ใครสามารถเข้าร่วม Intro to Tech ได้บ้าง?",
             "a": "SDI Open Water Diver หรือเทียบเท่า บันทึกดำน้ำขั้นต่ำ 25 ครั้ง อายุ 15+ หน่วยงาน TDI"},
            {"q": "Intro to Tech ราคาเท่าไหร่?",
             "a": "11,990 บาท รวม 2 วัน 3 ไดฟ์น้ำเปิด เซสชันสระวันแรก ทฤษฎีออนไลน์ ครูสอน (สูงสุด 4 คน) อุปกรณ์ครบชุด เอกสาร อาหารกลางวัน เครื่องดื่ม และรับจากโรงแรม"},
            {"q": "Intro to Tech รวมอะไรบ้าง?",
             "a": "คอร์ส 2 วัน 3 Intro to Tech dives จากเรือ สระ/น้ำจำกัดวันแรก ทฤษฎีออนไลน์ ครูสอน (1 ต่อ 1 ถึงสูงสุด 1 ต่อ 4) อุปกรณ์ดำน้ำครบชุด เอกสารดิจิทัลหรือพิมพ์ อาหารกลางวัน ผลไม้ เครื่องดื่ม ชา/กาแฟ รับจากโรงแรม"},
            {"q": "การฝึก Intro to Tech จัดที่ไหน?",
             "a": "ที่แหล่งดำน้ำเกาะช้างจากเรือ กล่าวถึงเรือหลวงช้างในส่วน discovery"}
        ]
    },
    "advanced-nitrox": {
        "en": [
            {"q": "What is TDI Advanced Nitrox?",
             "a": "Trains you in EAN 21 through 100% oxygen for dives up to 40m. Ideal for extending bottom time and as a foundation for decompression procedures or CCR. Non-decompression only; Deco Procedures can be added optionally."},
            {"q": "Who can join TDI Advanced Nitrox?",
             "a": "TDI Nitrox Diver certification. 25 logged dives. Age 15+. Meet & greet 4–5 PM the day before."},
            {"q": "How much does TDI Advanced Nitrox cost?",
             "a": "14,990 THB. Includes 2 days + eLearning, 4 open water dives (max 60 min/dive), instructor (max 4 students), all equipment including deco regs and wing/sidemount, materials, lunch, drinks, hotel pickup."},
            {"q": "What is included in TDI Advanced Nitrox?",
             "a": "2-day course + eLearning, 4 Advanced Nitrox dives from the boat, professional instructor (1-on-1 to max 1-on-4), all equipment (primary/secondary regs, deco regs, wing or sidemount, computer, SMBs), materials, lunch, fruits, drinks, hotel pickup."},
            {"q": "Where does TDI Advanced Nitrox training take place?",
             "a": "At Koh Chang dive sites from the boat. The HTMS Chang wreck is among the training locations."}
        ],
        "de": [
            {"q": "Was ist TDI Advanced Nitrox?",
             "a": "Schult dich in EAN 21 bis 100% Sauerstoff für Tauchgänge bis 40m. Ideal zur Verlängerung der Bodenzeit und als Grundlage für Dekompressionsverfahren oder CCR. Nur Nullzeit; Deco Procedures optional ergänzbar."},
            {"q": "Wer kann an TDI Advanced Nitrox teilnehmen?",
             "a": "TDI Nitrox Diver Zertifizierung. 25 protokollierte Tauchgänge. Alter 15+. Meet & Greet 16–17 Uhr am Vortag."},
            {"q": "Was kostet TDI Advanced Nitrox?",
             "a": "14.990 THB. Enthält 2 Tage + eLearning, 4 Freiwassertauchgänge (max. 60 Min/Tauchgang), Instructor (max. 4 Schüler), gesamte Ausrüstung inkl. Deco-Regler und Wing/Sidemount, Materialien, Mittagessen, Getränke, Hotelabholung."},
            {"q": "Was ist in TDI Advanced Nitrox inklusive?",
             "a": "2-Tage-Kurs + eLearning, 4 Advanced Nitrox Tauchgänge vom Boot, Instructor (1-zu-1 bis max. 1-zu-4), gesamte Ausrüstung (Haupt-/Backup-Regler, Deco-Regler, Wing oder Sidemount, Computer, SMBs), Materialien, Mittagessen, Obst, Getränke, Hotelabholung."},
            {"q": "Wo findet TDI Advanced Nitrox statt?",
             "a": "An Tauchplätzen von Koh Chang vom Boot. Das HTMS Chang Wrack gehört zu den Ausbildungsstandorten."}
        ],
        "th": [
            {"q": "TDI Advanced Nitrox คืออะไร?",
             "a": "ฝึกใช้ EAN 21 ถึงออกซิเจน 100% สำหรับดำน้ำถึง 40 เมตร เหมาะสำหรับยืดเวลาดำน้ำและเป็นพื้นฐานสำหรับ decompression procedures หรือ CCR เฉพาะ no-decompression สามารถเพิ่ม Deco Procedures ได้"},
            {"q": "ใครสามารถเข้าร่วม TDI Advanced Nitrox ได้บ้าง?",
             "a": "ใบรับรอง TDI Nitrox Diver บันทึกดำน้ำ 25 ครั้ง อายุ 15+ พบปะ 16–17 น. วันก่อน"},
            {"q": "TDI Advanced Nitrox ราคาเท่าไหร่?",
             "a": "14,990 บาท รวม 2 วัน + eLearning 4 ไดฟ์น้ำเปิด (สูงสุด 60 นาที/ไดฟ์) ครูสอน (สูงสุด 4 คน) อุปกรณ์ครบชุดรวม deco regs และ wing/sidemount เอกสาร อาหารกลางวัน เครื่องดื่ม รับจากโรงแรม"},
            {"q": "TDI Advanced Nitrox รวมอะไรบ้าง?",
             "a": "คอร์ส 2 วัน + eLearning 4 Advanced Nitrox dives จากเรือ ครูสอน (1 ต่อ 1 ถึงสูงสุด 1 ต่อ 4) อุปกรณ์ครบชุด (regs หลัก/สำรอง deco regs wing หรือ sidemount computer SMBs) เอกสาร อาหารกลางวัน ผลไม้ เครื่องดื่ม รับจากโรงแรม"},
            {"q": "การฝึก TDI Advanced Nitrox จัดที่ไหน?",
             "a": "ที่แหล่งดำน้ำเกาะช้างจากเรือ เรือหลวงช้างเป็นหนึ่งในสถานที่ฝึก"}
        ]
    },
    "deco-procedures": {
        "en": [
            {"q": "What is TDI Decompression Procedures?",
             "a": "The next step after Advanced Nitrox or for certified Advanced divers. Learn to plan and conduct staged decompression dives using Nitrox and Oxygen, gas switches, kit configuration, and emergency protocols."},
            {"q": "Who can join TDI Decompression Procedures?",
             "a": "SDI Advanced Diver or equivalent. 25 logged dives. Age 18+. No pool session required. Theory online or in-house."},
            {"q": "How much does TDI Decompression Procedures cost?",
             "a": "24,990 THB. Includes 3.5 days, 4 deco dives (2 must exceed 30m, max 45m), instructor (max 4 students), all equipment, materials, lunch, drinks, hotel pickup."},
            {"q": "What is included in TDI Decompression Procedures?",
             "a": "3.5-day course, 4 deco dives from the boat, professional instructor (1-on-1 to max 1-on-4), all scuba equipment, digital or printed materials, lunch, fruits, soft drinks, tea/coffee, hotel pickup."},
            {"q": "Where does TDI Decompression Procedures training take place?",
             "a": "At Koh Chang dive sites from the boat. The HTMS Chang wreck is among the training locations."}
        ],
        "de": [
            {"q": "Was ist TDI Decompression Procedures?",
             "a": "Der nächste Schritt nach Advanced Nitrox oder für zertifizierte Advanced Taucher. Lerne gestaffelte Dekompressions-Tauchgänge mit Nitrox und Sauerstoff zu planen und durchzuführen, Gaswechsel, Kit-Konfiguration und Notfallprotokolle."},
            {"q": "Wer kann an TDI Decompression Procedures teilnehmen?",
             "a": "SDI Advanced Diver oder gleichwertig. 25 protokollierte Tauchgänge. Alter 18+. Keine Pool-Session. Theorie online oder vor Ort."},
            {"q": "Was kostet TDI Decompression Procedures?",
             "a": "24.990 THB. Enthält 3,5 Tage, 4 Deco-Tauchgänge (2 müssen 30m überschreiten, max. 45m), Instructor (max. 4 Schüler), gesamte Ausrüstung, Materialien, Mittagessen, Getränke, Hotelabholung."},
            {"q": "Was ist in TDI Decompression Procedures inklusive?",
             "a": "3,5-Tage-Kurs, 4 Deco-Tauchgänge vom Boot, Instructor (1-zu-1 bis max. 1-zu-4), gesamte Tauchausrüstung, digitale oder gedruckte Materialien, Mittagessen, Obst, Softdrinks, Tee/Kaffee, Hotelabholung."},
            {"q": "Wo findet TDI Decompression Procedures statt?",
             "a": "An Tauchplätzen von Koh Chang vom Boot. Das HTMS Chang Wrack gehört zu den Ausbildungsstandorten."}
        ],
        "th": [
            {"q": "TDI Decompression Procedures คืออะไร?",
             "a": "ขั้นตอนถัดจาก Advanced Nitrox หรือสำหรับนักดำน้ำ Advanced ที่มีใบรับรอง เรียนรู้การวางแผนและดำเนินการ staged decompression dives ด้วย Nitrox และออกซิเจน การเปลี่ยนแก๊ส การตั้งค่าชุดอุปกรณ์ และโปรโตคอลฉุกเฉิน"},
            {"q": "ใครสามารถเข้าร่วม TDI Decompression Procedures ได้บ้าง?",
             "a": "SDI Advanced Diver หรือเทียบเท่า บันทึกดำน้ำ 25 ครั้ง อายุ 18+ ไม่ต้องมีเซสชันสระ ทฤษฎีออนไลน์หรือที่ศูนย์"},
            {"q": "TDI Decompression Procedures ราคาเท่าไหร่?",
             "a": "24,990 บาท รวม 3.5 วัน 4 deco dives (2 ไดฟ์ต้องเกิน 30 เมตร สูงสุด 45 เมตร) ครูสอน (สูงสุด 4 คน) อุปกรณ์ครบชุด เอกสาร อาหารกลางวัน เครื่องดื่ม รับจากโรงแรม"},
            {"q": "TDI Decompression Procedures รวมอะไรบ้าง?",
             "a": "คอร์ส 3.5 วัน 4 deco dives จากเรือ ครูสอน (1 ต่อ 1 ถึงสูงสุด 1 ต่อ 4) อุปกรณ์ดำน้ำครบชุด เอกสารดิจิทัลหรือพิมพ์ อาหารกลางวัน ผลไม้ เครื่องดื่ม ชา/กาแฟ รับจากโรงแรม"},
            {"q": "การฝึก TDI Decompression Procedures จัดที่ไหน?",
             "a": "ที่แหล่งดำน้ำเกาะช้างจากเรือ เรือหลวงช้างเป็นหนึ่งในสถานที่ฝึก"}
        ]
    },
    "advanced-wreck": {
        "en": [
            {"q": "What is TDI Advanced Wreck Diver?",
             "a": "For divers who want to safely penetrate wrecks in overhead environments. Covers guideline use, propulsion techniques, gas management, and redundancy setups to explore beyond the light zone. Two options: full penetration with deco (tech gear) or without deco (rec setup)."},
            {"q": "Who can join TDI Advanced Wreck?",
             "a": "AOWD or equivalent + 50+ logged dives + wreck certification (recreational Deep + Wreck, or TDI Advanced Nitrox/Deco Procedures). Age 18+ implied."},
            {"q": "How much does TDI Advanced Wreck cost?",
             "a": "Option 1 (full penetration + deco, tech setup): 35,000 THB. Option 2 (full penetration, no deco, rec gear + stage): 18,870 THB. Both include 4.5 days and 6 overhead training dives."},
            {"q": "What is included in TDI Advanced Wreck?",
             "a": "4.5-day course, 6 overhead training dives from the boat, professional instructor (max 4 students), all scuba equipment, materials, lunch, fruits, drinks, hotel pickup."},
            {"q": "Where does TDI Advanced Wreck training take place?",
             "a": "On the HTMS Chang (Thailand's largest wreck), T11, and PAK1 – three named wrecks at Koh Chang."}
        ],
        "de": [
            {"q": "Was ist TDI Advanced Wreck Diver?",
             "a": "Für Taucher, die Wracks in Overhead-Umgebungen sicher penetrieren möchten. Behandelt Leinenführung, Vortriebstechniken, Gasmanagement und Redundanz-Setups für Erkundung jenseits der Lichtzone. Zwei Optionen: Vollpenetration mit Deco (Tech) oder ohne Deco (Rec)."},
            {"q": "Wer kann an TDI Advanced Wreck teilnehmen?",
             "a": "AOWD oder gleichwertig + 50+ Tauchgänge + Wrack-Zertifizierung (Deep + Wreck rec, oder TDI Advanced Nitrox/Deco Procedures). Alter 18+."},
            {"q": "Was kostet TDI Advanced Wreck?",
             "a": "Option 1 (Vollpenetration + Deco, Tech-Setup): 35.000 THB. Option 2 (Vollpenetration, kein Deco, Rec + Stage): 18.870 THB. Beide: 4,5 Tage, 6 Overhead-Tauchgänge."},
            {"q": "Was ist in TDI Advanced Wreck inklusive?",
             "a": "4,5-Tage-Kurs, 6 Overhead-Tauchgänge vom Boot, Instructor (max. 4 Schüler), gesamte Tauchausrüstung, Materialien, Mittagessen, Obst, Getränke, Hotelabholung."},
            {"q": "Wo findet TDI Advanced Wreck statt?",
             "a": "Am HTMS Chang (Thailands größtes Wrack), T11 und PAK1 – drei benannte Wracks bei Koh Chang."}
        ],
        "th": [
            {"q": "TDI Advanced Wreck Diver คืออะไร?",
             "a": "สำหรับนักดำน้ำที่ต้องการเข้า wreck อย่างปลอดภัยในสภาพแวดล้อม overhead ครอบคลุมการใช้ guideline เทคนิคการเคลื่อนที่ การจัดการแก๊ส และการตั้งค่าอุปกรณ์สำรองเพื่อสำรวจเกินเขตแสง สองตัวเลือก: full penetration พร้อม deco (tech) หรือไม่มี deco (rec)"},
            {"q": "ใครสามารถเข้าร่วม TDI Advanced Wreck ได้บ้าง?",
             "a": "AOWD หรือเทียบเท่า + บันทึกดำน้ำ 50+ + ใบรับรอง wreck (Deep + Wreck rec หรือ TDI Advanced Nitrox/Deco Procedures) อายุ 18+"},
            {"q": "TDI Advanced Wreck ราคาเท่าไหร่?",
             "a": "ตัวเลือก 1 (full penetration + deco ชุด tech): 35,000 บาท ตัวเลือก 2 (full penetration ไม่มี deco ชุด rec + stage): 18,870 บาท ทั้งสองรวม 4.5 วัน และ 6 overhead training dives"},
            {"q": "TDI Advanced Wreck รวมอะไรบ้าง?",
             "a": "คอร์ส 4.5 วัน 6 overhead training dives จากเรือ ครูสอนมืออาชีพ (สูงสุด 4 คน) อุปกรณ์ดำน้ำครบชุด เอกสาร อาหารกลางวัน ผลไม้ เครื่องดื่ม รับจากโรงแรม"},
            {"q": "การฝึก TDI Advanced Wreck จัดที่ไหน?",
             "a": "ที่เรือหลวงช้าง (ซากเรือที่ใหญ่ที่สุดในไทย) T11 และ PAK1 – สาม wreck ที่เกาะช้าง"}
        ]
    },
    "sdi-idc": {
        "en": [
            {"q": "What is the SDI Instructor Development Course (IDC)?",
             "a": "A 21-day program combining academic sessions, real teaching practice, and daily mentorship to prepare you for a global diving career. Take the leap into professional scuba education on Koh Chang."},
            {"q": "Who can join the SDI IDC?",
             "a": "Certified SDI Divemaster or equivalent. Minimum 100 logged dives. Age 18+. Good physical health and comfort in the water. Available for 21 full training days."},
            {"q": "How much does the SDI IDC cost?",
             "a": "34,990 THB. SDI application and exam fees are not included. Includes 21-day program, daily mentorship, access to SDI teaching materials, pool sessions, boat dives, workshops, classroom use, skill demos, and presentation practice."},
            {"q": "What is included in the SDI IDC?",
             "a": "21-day Instructor Development Program, daily mentorship and personal feedback, access to SDI teaching materials and training aids, pool sessions, boat dives, workshops, classroom use, skill demonstrations, student evaluations, and presentation practice."},
            {"q": "Where does the SDI IDC take place?",
             "a": "At Chang Diving on Koh Chang – on-site and on dive boats. The HTMS Chang wreck is among the training locations."}
        ],
        "de": [
            {"q": "Was ist der SDI Instructor Development Course (IDC)?",
             "a": "Ein 21-Tage-Programm mit akademischen Sitzungen, echter Unterrichtspraxis und täglichem Mentoring zur Vorbereitung auf eine globale Tauchkarriere. Der Einstieg in die professionelle Tauchausbildung auf Koh Chang."},
            {"q": "Wer kann am SDI IDC teilnehmen?",
             "a": "Zertifizierter SDI Divemaster oder gleichwertig. Mindestens 100 protokollierte Tauchgänge. Alter 18+. Gute körperliche Verfassung. Verfügbar für 21 volle Ausbildungstage."},
            {"q": "Was kostet der SDI IDC?",
             "a": "34.990 THB. SDI-Anmelde- und Prüfungsgebühren nicht enthalten. Enthält 21-Tage-Programm, tägliches Mentoring, Zugang zu SDI-Lehrmaterialien, Pool-Sessions, Bootstauchgänge, Workshops, Klassenraum, Skill-Demos und Präsentationsübungen."},
            {"q": "Was ist im SDI IDC inklusive?",
             "a": "21-Tage-Instructor-Development-Programm, tägliches Mentoring und persönliches Feedback, Zugang zu SDI-Lehrmaterialien und -Hilfsmitteln, Pool-Sessions, Bootstauchgänge, Workshops, Klassenraum, Skill-Demonstrationen, Studentenbewertungen und Präsentationsübungen."},
            {"q": "Wo findet der SDI IDC statt?",
             "a": "Bei Chang Diving auf Koh Chang – vor Ort und auf Tauchbooten. Das HTMS Chang Wrack gehört zu den Ausbildungsstandorten."}
        ],
        "th": [
            {"q": "SDI Instructor Development Course (IDC) คืออะไร?",
             "a": "โปรแกรม 21 วัน รวมเซสชันวิชาการ การสอนจริง และการให้คำปรึกษารายวัน เพื่อเตรียมพร้อมอาชีพดำน้ำระดับโลก ก้าวสู่การเป็นครูสอนดำน้ำมืออาชีพบนเกาะช้าง"},
            {"q": "ใครสามารถเข้าร่วม SDI IDC ได้บ้าง?",
             "a": "SDI Divemaster ที่มีใบรับรองหรือเทียบเท่า บันทึกดำน้ำขั้นต่ำ 100 ครั้ง อายุ 18+ สุขภาพแข็งแรง พร้อมฝึกเต็ม 21 วัน"},
            {"q": "SDI IDC ราคาเท่าไหร่?",
             "a": "34,990 บาท ไม่รวมค่าสมัครและสอบ SDI รวมโปรแกรม 21 วัน การให้คำปรึกษารายวัน การเข้าถึงเอกสารการสอน SDI เซสชันสระ ไดฟ์จากเรือ เวิร์กช็อป ห้องเรียน การสาธิตทักษะ และการฝึกนำเสนอ"},
            {"q": "SDI IDC รวมอะไรบ้าง?",
             "a": "โปรแกรม Instructor Development 21 วัน การให้คำปรึกษารายวันและ feedback ส่วนตัว การเข้าถึงเอกสารการสอนและสื่อฝึก SDI เซสชันสระ ไดฟ์จากเรือ เวิร์กช็อป ห้องเรียน การสาธิตทักษะ การประเมินนักเรียน และการฝึกนำเสนอ"},
            {"q": "SDI IDC จัดที่ไหน?",
             "a": "ที่ Chang Diving บนเกาะช้าง – ที่ศูนย์และบนเรือดำน้ำ เรือหลวงช้างเป็นหนึ่งในสถานที่ฝึก"}
        ]
    },
    "sdi-ie": {
        "en": [
            {"q": "What is the SDI Instructor Examination (IE)?",
             "a": "The final step after your IDC. A 2-day assessment testing teaching abilities, diving knowledge, and leadership under pressure. Upon passing you can teach the full range of SDI entry-level courses."},
            {"q": "Who can take the SDI IE?",
             "a": "Completed SDI IDC training. Minimum 100 logged dives. Age 18+. Good health and strong water skills. Meet examiner day before at 4–5 PM for paperwork."},
            {"q": "How much does the SDI IE cost?",
             "a": "9,990 THB. Includes 2 full days of evaluation, theory & standards exams, pool + open water presentations, led by an independent SDI examiner. Teaching status after HQ approval."},
            {"q": "What is included in the SDI IE?",
             "a": "2 full days of evaluation, theory and standards exams, pool and open water teaching presentations, led by an independent SDI examiner. Teaching privileges after passing: Discover SCUBA, OWD, Advanced Adventure, Rescue, First Aid/CPR (if EFR Instructor), Divemaster. Specialties require separate Specialty Instructor ratings."},
            {"q": "Where does the SDI IE take place?",
             "a": "At Chang Diving on Koh Chang – pool, open water, and classroom. The HTMS Chang wreck is among the locations."}
        ],
        "de": [
            {"q": "Was ist die SDI Instructor Examination (IE)?",
             "a": "Der letzte Schritt nach dem IDC. Eine 2-tägige Prüfung von Unterrichtsfähigkeiten, Tauchwissen und Führung unter Druck. Nach Bestehen kannst du alle SDI Einstiegskurse unterrichten."},
            {"q": "Wer kann die SDI IE ablegen?",
             "a": "Abgeschlossenes SDI IDC Training. Mindestens 100 protokollierte Tauchgänge. Alter 18+. Gute Gesundheit und starke Wassersicherheit. Treffen mit Prüfer am Vortag 16–17 Uhr für Unterlagen."},
            {"q": "Was kostet die SDI IE?",
             "a": "9.990 THB. Enthält 2 volle Prüfungstage, Theorie- und Standards-Prüfungen, Pool- und Freiwasser-Präsentationen, geleitet von einem unabhängigen SDI-Examiner. Unterrichtsstatus nach HQ-Genehmigung."},
            {"q": "Was ist in der SDI IE inklusive?",
             "a": "2 volle Prüfungstage, Theorie- und Standards-Prüfungen, Pool- und Freiwasser-Präsentationen, geleitet von einem unabhängigen SDI-Examiner. Unterrichtsberechtigungen: Discover SCUBA, OWD, Advanced Adventure, Rescue, First Aid/CPR (wenn EFR Instructor), Divemaster. Specialties erfordern separate Specialty Instructor Ratings."},
            {"q": "Wo findet die SDI IE statt?",
             "a": "Bei Chang Diving auf Koh Chang – Pool, Freiwasser und Klassenraum. Das HTMS Chang Wrack gehört zu den Standorten."}
        ],
        "th": [
            {"q": "SDI Instructor Examination (IE) คืออะไร?",
             "a": "ขั้นตอนสุดท้ายหลัง IDC การประเมิน 2 วัน ทดสอบความสามารถในการสอน ความรู้ด้านดำน้ำ และความเป็นผู้นำภายใต้ความกดดัน ผ่านแล้วสามารถสอน SDI entry-level courses ได้ครบ"},
            {"q": "ใครสามารถสอบ SDI IE ได้บ้าง?",
             "a": "ผ่านการฝึก SDI IDC แล้ว บันทึกดำน้ำขั้นต่ำ 100 ครั้ง อายุ 18+ สุขภาพแข็งแรง พบ examiner วันก่อน 16–17 น. สำหรับเอกสาร"},
            {"q": "SDI IE ราคาเท่าไหร่?",
             "a": "9,990 บาท รวมการประเมิน 2 วันเต็ม การสอบทฤษฎีและมาตรฐาน การนำเสนอในสระและน้ำเปิด นำโดย SDI examiner อิสระ สถานะการสอนหลังการอนุมัติจาก HQ"},
            {"q": "SDI IE รวมอะไรบ้าง?",
             "a": "การประเมิน 2 วันเต็ม การสอบทฤษฎีและมาตรฐาน การนำเสนอการสอนในสระและน้ำเปิด นำโดย SDI examiner อิสระ สิทธิ์การสอนหลังผ่าน: Discover SCUBA OWD Advanced Adventure Rescue First Aid/CPR (ถ้า EFR Instructor) Divemaster Specialties ต้องมี Specialty Instructor แยก"},
            {"q": "SDI IE จัดที่ไหน?",
             "a": "ที่ Chang Diving บนเกาะช้าง – สระ น้ำเปิด และห้องเรียน เรือหลวงช้างเป็นหนึ่งในสถานที่"}
        ]
    },
    "efr-instructor": {
        "en": [
            {"q": "What is the EFR Instructor course?",
             "a": "Learn to teach CPR and first aid based on internationally recognized emergency care guidelines. As an Emergency First Response Instructor (EFRI), you'll lead CPR/first aid courses for divers and non-divers using positive coaching techniques."},
            {"q": "Who can become an EFR Instructor?",
             "a": "CPR & First Aid training completed within the last 24 months. Age 18+. No diving certification or logged dives required. No pool or open water dives. Classroom-based only."},
            {"q": "How much does the EFR Instructor course cost?",
             "a": "9,990 THB. EFRI registration fee is not included. Includes 2-day classroom-based training, coaching in effective teaching, all theory and materials, 1-on-1 support, and scenario-based practice."},
            {"q": "What is included in the EFR Instructor course?",
             "a": "2-day classroom-based EFRI training, coaching in effective teaching and course structure, all required theory and materials, 1-on-1 support from your EFR Instructor Trainer, practice with scenario-based learning and evaluations."},
            {"q": "Why become an EFR Instructor?",
             "a": "Prerequisite for becoming a PADI Instructor. Valuable for Divemasters seeking employment worldwide. Teaches critical life-saving skills to both divers and non-divers."}
        ],
        "de": [
            {"q": "Was ist der EFR Instructor Kurs?",
             "a": "Lerne CPR und Erste Hilfe nach international anerkannten Notfallrichtlinien zu unterrichten. Als Emergency First Response Instructor (EFRI) leitest du CPR-/Erste-Hilfe-Kurse für Taucher und Nicht-Taucher mit positivem Coaching."},
            {"q": "Wer kann EFR Instructor werden?",
             "a": "CPR- und Erste-Hilfe-Ausbildung innerhalb der letzten 24 Monate. Alter 18+. Keine Tauchzertifizierung oder Tauchgänge erforderlich. Kein Pool oder Freiwasser. Nur im Klassenraum."},
            {"q": "Was kostet der EFR Instructor Kurs?",
             "a": "9.990 THB. EFRI-Registrierungsgebühr nicht enthalten. Enthält 2-tägiges Klassenzimmer-Training, Coaching in effektivem Unterrichten, alle Theorie und Materialien, 1-zu-1-Unterstützung und Szenario-basierte Übungen."},
            {"q": "Was ist im EFR Instructor Kurs inklusive?",
             "a": "2-tägiges EFRI-Training im Klassenraum, Coaching in effektivem Unterrichten und Kursstruktur, alle erforderlichen Theorie und Materialien, 1-zu-1-Unterstützung durch EFR Instructor Trainer, Übungen mit Szenario-basiertem Lernen und Bewertungen."},
            {"q": "Warum EFR Instructor werden?",
             "a": "Voraussetzung für PADI Instructor. Wertvoll für Divemaster auf Jobsuche weltweit. Vermittelt lebensrettende Kenntnisse für Taucher und Nicht-Taucher."}
        ],
        "th": [
            {"q": "คอร์ส EFR Instructor คืออะไร?",
             "a": "เรียนรู้การสอน CPR และการปฐมพยาบาลตามแนวทางดูแลฉุกเฉินที่ได้รับการยอมรับในระดับสากล ในฐานะ Emergency First Response Instructor (EFRI) คุณจะนำคอร์ส CPR/ปฐมพยาบาลสำหรับนักดำน้ำและผู้ที่ไม่ได้ดำน้ำด้วยเทคนิคการโค้ชเชิงบวก"},
            {"q": "ใครสามารถเป็น EFR Instructor ได้บ้าง?",
             "a": "ผ่านการฝึก CPR และ First Aid ภายใน 24 เดือนที่ผ่านมา อายุ 18+ ไม่ต้องมีใบรับรองดำน้ำหรือบันทึกดำน้ำ ไม่มีสระหรือน้ำเปิด เฉพาะในห้องเรียน"},
            {"q": "คอร์ส EFR Instructor ราคาเท่าไหร่?",
             "a": "9,990 บาท ไม่รวมค่าลงทะเบียน EFRI รวมการฝึกในห้องเรียน 2 วัน การโค้ชการสอนที่มีประสิทธิภาพ ทฤษฎีและเอกสารทั้งหมด การสนับสนุน 1 ต่อ 1 และการฝึกแบบ scenario-based"},
            {"q": "คอร์ส EFR Instructor รวมอะไรบ้าง?",
             "a": "การฝึก EFRI ในห้องเรียน 2 วัน การโค้ชการสอนและโครงสร้างคอร์สที่มีประสิทธิภาพ ทฤษฎีและเอกสารที่จำเป็นทั้งหมด การสนับสนุน 1 ต่อ 1 จาก EFR Instructor Trainer การฝึกด้วยการเรียนรู้และประเมินแบบ scenario-based"},
            {"q": "ทำไมต้องเป็น EFR Instructor?",
             "a": "เป็นเงื่อนไขบังคับสำหรับการเป็น PADI Instructor มีประโยชน์สำหรับ Divemaster ที่หางานทั่วโลก สอนทักษะการช่วยชีวิตที่สำคัญทั้งนักดำน้ำและผู้ที่ไม่ได้ดำน้ำ"}
        ]
    },
    "instructor-crossover": {
        "en": [
            {"q": "What is the SDI/TDI Instructor Crossover?",
             "a": "Allows certified instructors from PADI, SSI, CMAS, NAUI, or RAID to transfer credentials and start teaching under SDI/TDI – recognized by WRSTC, EUF, and ISO. Join one of the most progressive training organizations in diving."},
            {"q": "Who can do the Instructor Crossover?",
             "a": "Active teaching status instructor with a WRSTC-recognized agency. Minimum 100 logged dives. Age 18+. Completion of SDI/TDI online crossover program. Ability to submit all required documents and certifications."},
            {"q": "How much does the Instructor Crossover cost?",
             "a": "15,990 THB. Required SDI Instructor Kit and crossover application fees are not included. Process involves online self-study, document collection, and final approval meeting with Instructor Trainer. Only needs to be done once – even if crossing over to both SDI and TDI."},
            {"q": "What is included in the Instructor Crossover?",
             "a": "Instructor crossover orientation at the dive center, access to SDI online training system, assistance with document submission and registration, support in transferring valid specialty ratings (Nitrox, Deep, Wreck, etc.)."},
            {"q": "Where does the Instructor Crossover take place?",
             "a": "At Chang Diving Center on Koh Chang. The HTMS Chang wreck is mentioned in the discovery section."}
        ],
        "de": [
            {"q": "Was ist der SDI/TDI Instructor Crossover?",
             "a": "Ermöglicht zertifizierten Instructoren von PADI, SSI, CMAS, NAUI oder RAID, ihre Qualifikationen zu übertragen und unter SDI/TDI zu unterrichten – anerkannt von WRSTC, EUF und ISO. Eintritt in eine der progressivsten Tauchausbildungsorganisationen."},
            {"q": "Wer kann den Instructor Crossover machen?",
             "a": "Aktiver Instructor mit WRSTC-anerkannter Agentur. Mindestens 100 protokollierte Tauchgänge. Alter 18+. Abschluss des SDI/TDI Online-Crossover-Programms. Fähigkeit, alle erforderlichen Dokumente einzureichen."},
            {"q": "Was kostet der Instructor Crossover?",
             "a": "15.990 THB. SDI Instructor Kit und Crossover-Anmeldegebühren nicht enthalten. Prozess: Online-Selbststudium, Dokumentensammlung, Abschlussmeeting mit Instructor Trainer. Nur einmal nötig – auch bei Crossover zu SDI und TDI."},
            {"q": "Was ist im Instructor Crossover inklusive?",
             "a": "Instructor-Crossover-Orientierung im Tauchcenter, Zugang zum SDI-Online-Trainingssystem, Unterstützung bei Dokumenteneinreichung und Registrierung, Unterstützung bei der Übertragung gültiger Specialty-Ratings (Nitrox, Deep, Wreck, etc.)."},
            {"q": "Wo findet der Instructor Crossover statt?",
             "a": "Im Chang Diving Center auf Koh Chang. Das HTMS Chang Wrack wird erwähnt."}
        ],
        "th": [
            {"q": "SDI/TDI Instructor Crossover คืออะไร?",
             "a": "อนุญาตให้ครูสอนที่มีใบรับรองจาก PADI SSI CMAS NAUI หรือ RAID โอนใบรับรองและเริ่มสอนภายใต้ SDI/TDI – ได้รับการยอมรับจาก WRSTC EUF และ ISO เข้าร่วมหนึ่งในองค์กรฝึกอบรมดำน้ำที่ก้าวหน้าที่สุด"},
            {"q": "ใครสามารถทำ Instructor Crossover ได้บ้าง?",
             "a": "ครูสอนที่มีสถานะการสอนที่หน่วยงานที่ WRSTC ยอมรับ บันทึกดำน้ำขั้นต่ำ 100 ครั้ง อายุ 18+ ผ่านโปรแกรม SDI/TDI online crossover แล้ว สามารถส่งเอกสารและใบรับรองที่จำเป็นทั้งหมดได้"},
            {"q": "Instructor Crossover ราคาเท่าไหร่?",
             "a": "15,990 บาท ไม่รวม SDI Instructor Kit และค่าสมัคร crossover กระบวนการ: การเรียนออนไลน์ การรวบรวมเอกสาร และการประชุมอนุมัติขั้นสุดท้ายกับ Instructor Trainer ทำครั้งเดียว – แม้ crossover ทั้ง SDI และ TDI"},
            {"q": "Instructor Crossover รวมอะไรบ้าง?",
             "a": "การปฐมนิเทศ instructor crossover ที่ศูนย์ดำน้ำ การเข้าถึงระบบฝึกอบรมออนไลน์ SDI ความช่วยเหลือในการส่งเอกสารและลงทะเบียน การสนับสนุนในการโอน specialty ratings ที่ยังมีผล (Nitrox Deep Wreck ฯลฯ)"},
            {"q": "Instructor Crossover จัดที่ไหน?",
             "a": "ที่ Chang Diving Center บนเกาะช้าง กล่าวถึงเรือหลวงช้างในส่วน discovery"}
        ]
    }
}


def build_faq_schema(questions):
    entities = []
    for item in questions:
        q = item["q"].replace('"', '\\"')
        a = item["a"].replace('"', '\\"')
        entities.append(f'''    {{
      "@type": "Question",
      "name": "{q}",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "{a}"
      }}
    }}''')
    return '''<script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
{entities}
    ]
  }}
</script>'''.format(entities=",\n".join(entities))


def insert_faq_into_file(filepath, questions):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '"@type": "FAQPage"' in content:
        print(f"  SKIP (already has FAQPage): {filepath}")
        return False

    faq_block = build_faq_schema(questions)
    if '</head>' not in content:
        print(f"  ERROR: no </head> found in {filepath}")
        return False

    new_content = content.replace('</head>', f'    {faq_block}\n  </head>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  OK: {filepath}")
    return True


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    langs = ["en", "de", "th"]
    total = 0

    for course_slug, lang_data in FAQ_DATA.items():
        print(f"\n[{course_slug}]")
        for lang in langs:
            if lang not in lang_data:
                print(f"  SKIP: no {lang} data")
                continue
            filepath = os.path.join(base, lang, "courses", course_slug, "index.html")
            if not os.path.exists(filepath):
                print(f"  NOT FOUND: {filepath}")
                continue
            if insert_faq_into_file(filepath, lang_data[lang]):
                total += 1

    print(f"\nDone. {total} files updated.")


if __name__ == "__main__":
    main()
