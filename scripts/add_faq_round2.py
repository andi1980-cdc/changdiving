#!/usr/bin/env python3
"""Round 2: Adds FAQPage schema to 9 specialty/professional course pages."""

import re
import os

FAQ_DATA = {
    "nitrox-diver": {
        "en": [
            {"q": "What is the Nitrox Diver course and what will I learn?",
             "a": "The Nitrox Diver course teaches you to dive with enriched air (EAN32 or EAN36, up to 40% oxygen), significantly reducing nitrogen buildup and extending your bottom time. You'll learn oxygen toxicity theory, MOD calculations, CNS tracking, and proper gas analysis – completing the course in as little as half a day."},
            {"q": "Who can join the Nitrox Diver course in Koh Chang?",
             "a": "Any certified Open Water Diver or higher can join. SDI accepts divers from age 10, PADI from age 12. No prior Nitrox experience required. The course can also be combined with the Open Water Diver course."},
            {"q": "How much does the Nitrox Diver course cost and how long does it take?",
             "a": "SDI with 2 training dives: 7,990 THB. SDI theory only: 4,990 THB. PADI with dives: 9,990 THB. PADI theory only: 5,990 THB. The course takes 0.5 to 1.5 days depending on the option chosen."},
            {"q": "What is included in the Nitrox Diver course?",
             "a": "Included: eLearning (SDI) or PDF manual (PADI), oxygen analysis and cylinder labeling workshop, theory recap, and optional 2 open water dives with Nitrox tanks. All rental equipment and the certification card are included."},
            {"q": "Where will I dive during the Nitrox course?",
             "a": "Training dives take place at dive sites in Mu Koh Chang National Marine Park, including the famous HTMS Chang wreck at 30 metres – ideal for experiencing the real benefits of extended bottom time with Nitrox."}
        ],
        "de": [
            {"q": "Was ist der Nitrox Diver Kurs und was werde ich lernen?",
             "a": "Der Nitrox Diver Kurs lehrt das Tauchen mit Enriched Air (EAN32 oder EAN36, bis zu 40% Sauerstoff), wodurch der Stickstoffaufbau deutlich reduziert und die Bodenzeit verlängert wird. Du lernst Sauerstofftoxizität, MOD-Berechnungen, CNS-Tracking und Gasanalyse – in nur einem halben Tag."},
            {"q": "Wer kann am Nitrox Diver Kurs auf Koh Chang teilnehmen?",
             "a": "Jeder zertifizierte Open Water Diver oder höher. SDI ab 10 Jahren, PADI ab 12 Jahren. Keine Vorerfahrung mit Nitrox erforderlich. Der Kurs kann auch mit dem Open Water Diver Kurs kombiniert werden."},
            {"q": "Was kostet der Nitrox Diver Kurs und wie lange dauert er?",
             "a": "SDI mit 2 Tauchgängen: 7.990 THB. SDI Theorie only: 4.990 THB. PADI mit Tauchgängen: 9.990 THB. PADI Theorie only: 5.990 THB. Der Kurs dauert 0,5 bis 1,5 Tage je nach gewählter Option."},
            {"q": "Was ist im Nitrox Diver Kurs inklusive?",
             "a": "Inklusive: eLearning (SDI) oder PDF-Handbuch (PADI), Sauerstoffanalyse und Flaschenkennzeichnung, Theoriewiederholung und optional 2 Freiwassertauchgänge mit Nitrox. Alle Ausrüstung und die Zertifizierungskarte sind inklusive."},
            {"q": "Wo tauche ich während des Nitrox Kurses?",
             "a": "Die Ausbildungstauchgänge finden an Tauchplätzen im Mu Koh Chang Meeresschutzgebiet statt, einschließlich des berühmten HTMS Chang Wracks auf 30 Metern – ideal, um die Vorteile von Nitrox in der Praxis zu erleben."}
        ],
        "th": [
            {"q": "คอร์ส Nitrox Diver คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "คอร์ส Nitrox Diver สอนการดำน้ำด้วย Enriched Air (EAN32 หรือ EAN36 ออกซิเจนสูงสุด 40%) ช่วยลดการสะสมไนโตรเจนและยืดเวลาดำน้ำได้อย่างมีนัยสำคัญ เรียนรู้เรื่องความเป็นพิษของออกซิเจน การคำนวณ MOD การติดตาม CNS และการวิเคราะห์แก๊ส"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Nitrox Diver ที่เกาะช้างได้บ้าง?",
             "a": "นักดำน้ำที่มีใบรับรอง Open Water ขึ้นไปทุกคน SDI รับตั้งแต่อายุ 10 ปี PADI ตั้งแต่ 12 ปี ไม่ต้องมีประสบการณ์ Nitrox มาก่อน สามารถรวมกับคอร์ส Open Water Diver ได้"},
            {"q": "คอร์ส Nitrox Diver ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "SDI พร้อมดำน้ำ 2 ไดฟ์: 7,990 บาท SDI ทฤษฎีอย่างเดียว: 4,990 บาท PADI พร้อมดำน้ำ: 9,990 บาท PADI ทฤษฎีอย่างเดียว: 5,990 บาท ใช้เวลา 0.5 ถึง 1.5 วัน"},
            {"q": "คอร์ส Nitrox Diver รวมอะไรบ้าง?",
             "a": "รวม: eLearning (SDI) หรือคู่มือ PDF (PADI) เวิร์กช็อปวิเคราะห์ออกซิเจนและติดฉลากถัง ทบทวนทฤษฎี และดำน้ำ 2 ไดฟ์พร้อมถัง Nitrox (ตัวเลือก) อุปกรณ์และใบรับรองรวมอยู่ด้วย"},
            {"q": "จะได้ดำน้ำที่ไหนระหว่างคอร์ส Nitrox?",
             "a": "ไดฟ์ฝึกจัดที่อุทยานแห่งชาติหมู่เกาะช้าง รวมถึงเรือหลวงช้างที่ความลึก 30 เมตร – เหมาะมากสำหรับสัมผัสประโยชน์ของ Nitrox ในทางปฏิบัติ"}
        ]
    },

    "deep-diver": {
        "en": [
            {"q": "What is the Deep Diver course and what will I learn?",
             "a": "The Deep Diver specialty takes you beyond recreational depths to 40 metres, opening up Thailand's most spectacular deep wrecks and reefs. You'll learn gas management at depth, how to recognise and manage nitrogen narcosis, deep dive profile planning with proper safety stops, and pressure effects on equipment."},
            {"q": "Who can join the Deep Diver course in Koh Chang?",
             "a": "PADI option requires Advanced Open Water Diver certification. SDI option requires Open Water Diver with at least 9 logged dives. Minimum age 18 years for both agencies."},
            {"q": "How much does the Deep Diver course cost and how long does it take?",
             "a": "SDI Deep Diver: 7,990 THB (1 day, 2 dives). PADI Deep Diver: 11,990 THB (2 days, 4 dives). All equipment, materials, and certification fees are included."},
            {"q": "What is included in the Deep Diver course?",
             "a": "Included: 1–2 day course with 2–4 deep dives from the boat, professional instructor (max. 4 students), all scuba equipment, full digital materials or printed manual, lunch, drinks, fruit, and hotel pickup in selected areas of Koh Chang."},
            {"q": "Which dive sites are used for Deep Diver training in Koh Chang?",
             "a": "Deep Diver training dives are conducted at the HTMS Chang wreck at 31 metres and the Koho Maru 5 at 42 metres – both in Mu Koh Chang National Marine Park – giving you real-world deep diving experience on stunning wrecks."}
        ],
        "de": [
            {"q": "Was ist der Deep Diver Kurs und was werde ich lernen?",
             "a": "Die Deep Diver Specialty führt dich auf Tiefen bis 40 Meter und eröffnet dir die spektakulärsten Tiefwracks und Riffe Thailands. Du lernst Gasmanagement in der Tiefe, Tiefenrausch erkennen und bewältigen, Profil-Planung mit Sicherheitsstopps sowie Druckeffekte auf Ausrüstung und Auftrieb."},
            {"q": "Wer kann am Deep Diver Kurs auf Koh Chang teilnehmen?",
             "a": "PADI-Option: Advanced Open Water Diver Zertifizierung erforderlich. SDI-Option: Open Water Diver mit mindestens 9 protokollierten Tauchgängen. Mindestalter 18 Jahre bei beiden Agenturen."},
            {"q": "Was kostet der Deep Diver Kurs und wie lange dauert er?",
             "a": "SDI Deep Diver: 7.990 THB (1 Tag, 2 Tauchgänge). PADI Deep Diver: 11.990 THB (2 Tage, 4 Tauchgänge). Gesamte Ausrüstung, Materialien und Zertifizierungsgebühren inklusive."},
            {"q": "Was ist im Deep Diver Kurs inklusive?",
             "a": "Inklusive: 1–2-Tages-Kurs mit 2–4 Tieftauchgängen vom Boot, professioneller Instructor (max. 4 Schüler), gesamte Tauchausrüstung, digitale Materialien oder gedrucktes Handbuch, Mittagessen, Getränke, Obst und Hotelabholung in ausgewählten Bereichen von Koh Chang."},
            {"q": "An welchen Tauchplätzen findet das Deep Diver Training auf Koh Chang statt?",
             "a": "Die Tieftauchgänge finden am HTMS Chang Wrack auf 31 Metern und der Koho Maru 5 auf 42 Metern statt – beide im Mu Koh Chang Meeresschutzgebiet – für echte Tieftaucherfahrung an beeindruckenden Wracks."}
        ],
        "th": [
            {"q": "คอร์ส Deep Diver คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "Deep Diver specialty พาคุณดำลึกถึง 40 เมตร เปิดประสบการณ์ซากเรือและแนวปะการังน้ำลึกที่สวยที่สุดในไทย เรียนรู้การจัดการแก๊สในระดับลึก การรับมือกับ nitrogen narcosis การวางแผน dive profile และผลของแรงดันต่ออุปกรณ์"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Deep Diver ที่เกาะช้างได้บ้าง?",
             "a": "PADI ต้องมีใบรับรอง Advanced Open Water Diver SDI ต้องมีใบรับรอง Open Water Diver และบันทึกดำน้ำอย่างน้อย 9 ครั้ง อายุขั้นต่ำ 18 ปีสำหรับทั้งสองหน่วยงาน"},
            {"q": "คอร์ส Deep Diver ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "SDI Deep Diver: 7,990 บาท (1 วัน 2 ไดฟ์) PADI Deep Diver: 11,990 บาท (2 วัน 4 ไดฟ์) รวมอุปกรณ์ เอกสาร และค่าใบรับรองทั้งหมด"},
            {"q": "คอร์ส Deep Diver รวมอะไรบ้าง?",
             "a": "รวม: คอร์ส 1-2 วัน พร้อมดำน้ำลึก 2-4 ไดฟ์จากเรือ ครูสอนมืออาชีพ (สูงสุด 4 คน) อุปกรณ์ดำน้ำครบชุด เอกสารดิจิทัลหรือเอกสารพิมพ์ อาหารกลางวัน เครื่องดื่ม ผลไม้ และรับจากโรงแรม"},
            {"q": "จะได้ดำน้ำที่ไหนระหว่างคอร์ส Deep Diver ที่เกาะช้าง?",
             "a": "ไดฟ์ฝึกจัดที่เรือหลวงช้างที่ 31 เมตร และ Koho Maru 5 ที่ 42 เมตร ทั้งสองอยู่ในอุทยานแห่งชาติหมู่เกาะช้าง ให้ประสบการณ์ดำน้ำลึกจริงบนซากเรือที่งดงาม"}
        ]
    },

    "wreck-diver": {
        "en": [
            {"q": "What is the Wreck Diver course and what will I learn?",
             "a": "The Wreck Diver specialty is your gateway to exploring Thailand's most spectacular shipwrecks through limited penetration training. You'll learn wreck navigation and mapping, use of reels and guidelines, penetration planning, hazard identification, and safe exit procedures – completing 3–4 training dives on real wrecks."},
            {"q": "Who can join the Wreck Diver course in Koh Chang?",
             "a": "PADI Advanced Open Water Diver or SDI Open Water Diver certification required. Minimum age 18 years for both agencies."},
            {"q": "How much does the Wreck Diver course cost and how long does it take?",
             "a": "SDI Wreck Diver: 9,990 THB (1 day, 3 dives). PADI Wreck Diver: 11,990 THB (2 days, 4 dives). All equipment and certification fees are included."},
            {"q": "What is included in the Wreck Diver course?",
             "a": "Included: 1–2 day wreck specialty with 3–4 boat dives, professional instructor (max. 4 students), all scuba equipment, digital materials or printed manual, lunch, drinks, fruit, and hotel pickup in selected areas of Koh Chang."},
            {"q": "Which wrecks will I dive during the Wreck Diver course?",
             "a": "Training dives are conducted at the HTMS Chang wreck at 31 metres – Thailand's biggest wreck – and the Koho Maru 5, a World War 2 Japanese supply vessel at 42 metres. Both are located in Mu Koh Chang National Marine Park."}
        ],
        "de": [
            {"q": "Was ist der Wrack Diver Kurs und was werde ich lernen?",
             "a": "Der Wrack Diver Spezialkurs ist dein Einstieg in die Erkundung von Schiffswracks durch begrenztes Penetrationstraining. Du lernst Wrack-Navigation und -Kartierung, Umgang mit Rollen und Leinen, Penetrationsplanung, Gefahrenerkennung und sichere Ausstiegsverfahren."},
            {"q": "Wer kann am Wrack Diver Kurs auf Koh Chang teilnehmen?",
             "a": "PADI Advanced Open Water Diver oder SDI Open Water Diver Zertifizierung erforderlich. Mindestalter 18 Jahre bei beiden Agenturen."},
            {"q": "Was kostet der Wrack Diver Kurs und wie lange dauert er?",
             "a": "SDI Wrack Diver: 9.990 THB (1 Tag, 3 Tauchgänge). PADI Wrack Diver: 11.990 THB (2 Tage, 4 Tauchgänge). Gesamte Ausrüstung und Zertifizierungsgebühren inklusive."},
            {"q": "Was ist im Wrack Diver Kurs inklusive?",
             "a": "Inklusive: 1–2-Tages-Wrack-Specialty mit 3–4 Bootstauchgängen, professioneller Instructor (max. 4 Schüler), gesamte Tauchausrüstung, digitale Materialien oder gedrucktes Handbuch, Mittagessen, Getränke, Obst und Hotelabholung."},
            {"q": "An welchen Wracks tauche ich beim Wrack Diver Kurs?",
             "a": "Die Ausbildungstauchgänge finden am HTMS Chang Wrack auf 31 Metern – Thailands größtem Wrack – und der Koho Maru 5, einem japanischen Versorgungsschiff aus dem 2. Weltkrieg auf 42 Metern statt. Beide liegen im Mu Koh Chang Meeresschutzgebiet."}
        ],
        "th": [
            {"q": "คอร์ส Wreck Diver คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "Wreck Diver specialty คือประตูสู่การสำรวจซากเรือที่งดงามของไทย ด้วยการฝึก limited penetration เรียนรู้การนำทางและทำแผนที่ซากเรือ การใช้ reel และเชือกนำทาง การวางแผน penetration และขั้นตอนออกจากซากเรืออย่างปลอดภัย"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Wreck Diver ที่เกาะช้างได้บ้าง?",
             "a": "ต้องมีใบรับรอง PADI Advanced Open Water Diver หรือ SDI Open Water Diver อายุขั้นต่ำ 18 ปีสำหรับทั้งสองหน่วยงาน"},
            {"q": "คอร์ส Wreck Diver ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "SDI Wreck Diver: 9,990 บาท (1 วัน 3 ไดฟ์) PADI Wreck Diver: 11,990 บาท (2 วัน 4 ไดฟ์) รวมอุปกรณ์และค่าใบรับรองทั้งหมด"},
            {"q": "คอร์ส Wreck Diver รวมอะไรบ้าง?",
             "a": "รวม: Wreck Specialty 1-2 วัน พร้อมดำน้ำ 3-4 ไดฟ์จากเรือ ครูสอนมืออาชีพ (สูงสุด 4 คน) อุปกรณ์ดำน้ำครบชุด เอกสารดิจิทัลหรือพิมพ์ อาหารกลางวัน เครื่องดื่ม ผลไม้ และรับจากโรงแรม"},
            {"q": "จะได้ดำน้ำที่ซากเรืออะไรระหว่างคอร์ส Wreck Diver?",
             "a": "ไดฟ์ฝึกจัดที่เรือหลวงช้างที่ 31 เมตร – ซากเรือรบที่ใหญ่ที่สุดในไทย – และ Koho Maru 5 เรือส่งกำลังบำรุงสงครามโลกครั้งที่ 2 ของญี่ปุ่น ที่ 42 เมตร ทั้งสองอยู่ในอุทยานแห่งชาติหมู่เกาะช้าง"}
        ]
    },

    "sidemount": {
        "en": [
            {"q": "What is the Sidemount course and what will I learn?",
             "a": "The Sidemount course teaches you to dive with tanks mounted at your sides instead of your back – for better trim, comfort, and redundancy. Originally from cave and technical diving, it's now popular with recreational divers and underwater photographers. You'll learn streamlined equipment setup, buoyancy and balance with two cylinders, and regulator switching."},
            {"q": "Who can join the Sidemount course in Koh Chang?",
             "a": "Any Open Water Diver or equivalent certification. Minimum age 15 years. A pool session is required for initial skills development before the open water dives."},
            {"q": "How much does the Sidemount course cost and how long does it take?",
             "a": "SDI Sidemount: 9,990 THB (3 dives). PADI Sidemount: 11,990 THB (4 dives). Solo + Sidemount combo (SDI, 2 days, 5 dives): 16,990 THB."},
            {"q": "What is included in the Sidemount course?",
             "a": "Included: 1–2 day Sidemount specialty (SDI or PADI), 3–4 sidemount dives from the boat, professional instructor (max. 4 students), all scuba equipment including sidemount configuration, digital materials or printed manual, lunch, drinks, fruit, and hotel pickup."},
            {"q": "Where will I dive during the Sidemount course in Koh Chang?",
             "a": "Training dives take place at the HTMS Chang wreck and the coral reefs of Mu Koh Chang National Marine Park – providing varied underwater terrain to practice sidemount trim, buoyancy, and equipment handling."}
        ],
        "de": [
            {"q": "Was ist der Sidemount Kurs und was werde ich lernen?",
             "a": "Der Sidemount Kurs lehrt das Tauchen mit seitlich montierten Flaschen statt auf dem Rücken – für bessere Trimmlage, Komfort und Redundanz. Ursprünglich aus dem Höhlen- und Technik-Tauchen stammend, ist es heute auch bei Freizeittauchern und Unterwasserfotografen beliebt."},
            {"q": "Wer kann am Sidemount Kurs auf Koh Chang teilnehmen?",
             "a": "Jeder Open Water Diver oder gleichwertige Zertifizierung. Mindestalter 15 Jahre. Eine Pool-Session vor den Freiwassertauchgängen ist erforderlich."},
            {"q": "Was kostet der Sidemount Kurs und wie lange dauert er?",
             "a": "SDI Sidemount: 9.990 THB (3 Tauchgänge). PADI Sidemount: 11.990 THB (4 Tauchgänge). Solo + Sidemount Kombi (SDI, 2 Tage, 5 Tauchgänge): 16.990 THB."},
            {"q": "Was ist im Sidemount Kurs inklusive?",
             "a": "Inklusive: 1–2-Tages-Sidemount-Specialty (SDI oder PADI), 3–4 Sidemount-Tauchgänge vom Boot, professioneller Instructor (max. 4 Schüler), gesamte Ausrüstung inkl. Sidemount-Konfiguration, Mittagessen, Getränke, Obst und Hotelabholung."},
            {"q": "Wo tauche ich beim Sidemount Kurs auf Koh Chang?",
             "a": "Ausbildungstauchgänge finden am HTMS Chang Wrack und an den Korallenriffen des Mu Koh Chang Meeresschutzgebiets statt – abwechslungsreiches Terrain zum Üben von Trimmlage, Auftrieb und Ausrüstungshandhabung."}
        ],
        "th": [
            {"q": "คอร์ส Sidemount คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "คอร์ส Sidemount สอนการดำน้ำโดยติดถังที่ข้างลำตัวแทนที่จะอยู่บนหลัง เพื่อการ trim ที่ดีขึ้น ความสะดวกสบาย และความซ้ำซ้อน เดิมมาจากการดำน้ำถ้ำและเทคนิค ปัจจุบันนิยมในหมู่นักดำน้ำทั่วไปและช่างภาพใต้น้ำ"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Sidemount ที่เกาะช้างได้บ้าง?",
             "a": "นักดำน้ำที่มีใบรับรอง Open Water หรือเทียบเท่า อายุขั้นต่ำ 15 ปี ต้องผ่านเซสชันสระก่อนดำน้ำจริง"},
            {"q": "คอร์ส Sidemount ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "SDI Sidemount: 9,990 บาท (3 ไดฟ์) PADI Sidemount: 11,990 บาท (4 ไดฟ์) คอมโบ Solo + Sidemount (SDI 2 วัน 5 ไดฟ์): 16,990 บาท"},
            {"q": "คอร์ส Sidemount รวมอะไรบ้าง?",
             "a": "รวม: Sidemount Specialty 1-2 วัน (SDI หรือ PADI) ดำน้ำ Sidemount 3-4 ไดฟ์จากเรือ ครูสอนมืออาชีพ (สูงสุด 4 คน) อุปกรณ์ครบชุดรวม Sidemount configuration เอกสาร อาหารกลางวัน เครื่องดื่ม ผลไม้ และรับจากโรงแรม"},
            {"q": "จะได้ดำน้ำที่ไหนระหว่างคอร์ส Sidemount ที่เกาะช้าง?",
             "a": "ไดฟ์ฝึกจัดที่เรือหลวงช้างและแนวปะการังในอุทยานแห่งชาติหมู่เกาะช้าง – ภูมิประเทศใต้น้ำที่หลากหลายสำหรับฝึก trim การลอยตัว และการจัดการอุปกรณ์ Sidemount"}
        ]
    },

    "solo-diver": {
        "en": [
            {"q": "What is the Solo Diver course and what will I learn?",
             "a": "The SDI Solo Diver course is for experienced divers who want to dive independently – ideal for underwater photographers, videographers, and content creators. You'll learn redundant gear setup, self-rescue protocols, gas planning for solo dives, and proper risk assessment. The course includes 2 solo dives."},
            {"q": "Who can join the Solo Diver course in Koh Chang?",
             "a": "SDI Advanced Open Water Diver or equivalent certification. Minimum 100 logged dives. Minimum age 21 years. This is an SDI-only course – no PADI equivalent."},
            {"q": "How much does the Solo Diver course cost and how long does it take?",
             "a": "SDI Solo Diver: 8,990 THB (1.5 days, 2 solo dives). Solo + Sidemount combo (2 days, 5 dives): 16,990 THB."},
            {"q": "What is included in the Solo Diver course?",
             "a": "Included: 1-day Solo Diver specialty (SDI), 2 solo dives from the boat, professional instructor (1-on-1), all scuba equipment, digital materials or printed manual, lunch, drinks, fruit, and hotel pickup in selected areas of Koh Chang."},
            {"q": "Where will I dive during the Solo Diver course in Koh Chang?",
             "a": "Solo training dives take place at the HTMS Chang wreck and coral reefs and walls of Koh Chang – giving you real-world experience in independent navigation, buoyancy control, and self-reliance in diverse underwater environments."}
        ],
        "de": [
            {"q": "Was ist der Solo Diver Kurs und was werde ich lernen?",
             "a": "Der SDI Solo Diver Kurs richtet sich an erfahrene Taucher, die unabhängig tauchen möchten – ideal für Unterwasserfotografen und Content Creator. Du lernst redundante Ausrüstungskonfiguration, Selbstrettungsprotokolle, Gasplanung für Solo-Tauchgänge und Risikoeinschätzung."},
            {"q": "Wer kann am Solo Diver Kurs auf Koh Chang teilnehmen?",
             "a": "SDI Advanced Open Water Diver oder gleichwertige Zertifizierung. Mindestens 100 protokollierte Tauchgänge. Mindestalter 21 Jahre. Nur bei SDI verfügbar – kein PADI-Äquivalent."},
            {"q": "Was kostet der Solo Diver Kurs und wie lange dauert er?",
             "a": "SDI Solo Diver: 8.990 THB (1,5 Tage, 2 Solo-Tauchgänge). Solo + Sidemount Kombi (2 Tage, 5 Tauchgänge): 16.990 THB."},
            {"q": "Was ist im Solo Diver Kurs inklusive?",
             "a": "Inklusive: 1-Tages-Solo-Diver-Specialty (SDI), 2 Solo-Tauchgänge vom Boot, professioneller Instructor (1-zu-1), gesamte Tauchausrüstung, digitale Materialien, Mittagessen, Getränke, Obst und Hotelabholung in ausgewählten Bereichen von Koh Chang."},
            {"q": "Wo tauche ich beim Solo Diver Kurs auf Koh Chang?",
             "a": "Solo-Ausbildungstauchgänge finden am HTMS Chang Wrack sowie an Korallenriffen und Steilwänden von Koh Chang statt – für echte Praxiserfahrung in unabhängiger Navigation und Selbstständigkeit."}
        ],
        "th": [
            {"q": "คอร์ส Solo Diver คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "คอร์ส SDI Solo Diver สำหรับนักดำน้ำที่มีประสบการณ์ที่ต้องการดำน้ำอิสระ เหมาะสำหรับช่างภาพใต้น้ำและ content creator เรียนรู้การตั้งค่าอุปกรณ์สำรอง โปรโตคอลการช่วยตัวเอง การวางแผนแก๊สสำหรับการดำน้ำเดี่ยว และการประเมินความเสี่ยง"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Solo Diver ที่เกาะช้างได้บ้าง?",
             "a": "SDI Advanced Open Water Diver หรือเทียบเท่า บันทึกดำน้ำขั้นต่ำ 100 ครั้ง อายุขั้นต่ำ 21 ปี เป็นคอร์ส SDI เท่านั้น ไม่มีเทียบเท่า PADI"},
            {"q": "คอร์ส Solo Diver ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "SDI Solo Diver: 8,990 บาท (1.5 วัน 2 ไดฟ์เดี่ยว) คอมโบ Solo + Sidemount (2 วัน 5 ไดฟ์): 16,990 บาท"},
            {"q": "คอร์ส Solo Diver รวมอะไรบ้าง?",
             "a": "รวม: Solo Diver Specialty 1 วัน (SDI) ดำน้ำเดี่ยว 2 ไดฟ์จากเรือ ครูสอน 1 ต่อ 1 อุปกรณ์ดำน้ำครบชุด เอกสารดิจิทัล อาหารกลางวัน เครื่องดื่ม ผลไม้ และรับจากโรงแรม"},
            {"q": "จะได้ดำน้ำที่ไหนระหว่างคอร์ส Solo Diver ที่เกาะช้าง?",
             "a": "ไดฟ์ฝึกเดี่ยวจัดที่เรือหลวงช้างและแนวปะการังและผนังหินของเกาะช้าง เพื่อประสบการณ์จริงในการนำทางอิสระและการพึ่งพาตนเองในสภาพแวดล้อมใต้น้ำที่หลากหลาย"}
        ]
    },

    "night": {
        "en": [
            {"q": "What is the Night Diver course and what will I learn?",
             "a": "The Night Diver specialty teaches you to conduct night dives with a torch, observe nocturnal marine life, and improve underwater navigation in low-light conditions. You'll discover a completely different side of the ocean – glowing plankton, nocturnal creatures, and hunting predators that are invisible during the day."},
            {"q": "Who can join the Night Diver course in Koh Chang?",
             "a": "SDI Open Water Diver or PADI Junior Open Water Diver. SDI accepts divers from age 10, PADI from age 12. No night diving experience required."},
            {"q": "How much does the Night Diver course cost and how long does it take?",
             "a": "SDI Night Diver: 7,990 THB (2 night dives, 1.5 days). PADI Night Diver: 11,990 THB (4 night dives, 2.5 days). An optional private dinghy night dive is also available."},
            {"q": "What is included in the Night Diver course?",
             "a": "Included: 1–2 day Night Diver specialty (SDI or PADI), 2–4 night dives from the boat, professional instructor (max. 4 students), all scuba equipment and dive torches, digital materials or printed manual, lunch, drinks, fruit, and hotel pickup in selected areas of Koh Chang."},
            {"q": "Where will I dive during the Night Diver course in Koh Chang?",
             "a": "Night dives take place at Koh Chang's reefs in calm, protected conditions – perfect for observing the island's nocturnal marine life. The HTMS Chang wreck and surrounding reef sites are among the locations used for night diving training."}
        ],
        "de": [
            {"q": "Was ist der Night Diver Kurs und was werde ich lernen?",
             "a": "Der Night Diver Spezialkurs lehrt das Tauchen mit Taschenlampe, die Beobachtung nachtaktiver Meereslebewesen und Unterwassernavigation bei Dunkelheit. Du entdeckst eine völlig andere Seite des Ozeans – leuchtendes Plankton, Nachttiere und jagende Raubtiere, die tagsüber unsichtbar sind."},
            {"q": "Wer kann am Night Diver Kurs auf Koh Chang teilnehmen?",
             "a": "SDI Open Water Diver oder PADI Junior Open Water Diver. SDI ab 10 Jahren, PADI ab 12 Jahren. Keine Nachttaucherfahrung erforderlich."},
            {"q": "Was kostet der Night Diver Kurs und wie lange dauert er?",
             "a": "SDI Night Diver: 7.990 THB (2 Nachttauchgänge, 1,5 Tage). PADI Night Diver: 11.990 THB (4 Nachttauchgänge, 2,5 Tage). Optional auch als privater Schlauchboot-Nachttauchgang buchbar."},
            {"q": "Was ist im Night Diver Kurs inklusive?",
             "a": "Inklusive: 1–2-Tages-Night-Diver-Specialty (SDI oder PADI), 2–4 Nachttauchgänge vom Boot, professioneller Instructor (max. 4 Schüler), gesamte Ausrüstung inkl. Tauchlampen, Mittagessen, Getränke, Obst und Hotelabholung."},
            {"q": "Wo tauche ich beim Night Diver Kurs auf Koh Chang?",
             "a": "Nachttauchgänge finden an Koh Changs Riffen in ruhigen, geschützten Gewässern statt – ideal für die Beobachtung nachtaktiver Meereslebewesen. Das HTMS Chang Wrack und umliegende Riffplätze sind beliebte Nachttauchstandorte."}
        ],
        "th": [
            {"q": "คอร์ส Night Diver คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "Night Diver specialty สอนการดำน้ำกลางคืนด้วยไฟฉาย การสังเกตสัตว์ทะเลที่ออกหากินตอนกลางคืน และการนำทางใต้น้ำในที่มืด คุณจะค้นพบโลกใต้ทะเลอีกด้านที่แตกต่างสิ้นเชิง – แพลงก์ตอนเรืองแสง สัตว์กลางคืน และนักล่าที่มองไม่เห็นในตอนกลางวัน"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Night Diver ที่เกาะช้างได้บ้าง?",
             "a": "SDI Open Water Diver หรือ PADI Junior Open Water Diver SDI รับตั้งแต่อายุ 10 ปี PADI ตั้งแต่ 12 ปี ไม่ต้องมีประสบการณ์ดำน้ำกลางคืน"},
            {"q": "คอร์ส Night Diver ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "SDI Night Diver: 7,990 บาท (2 ไดฟ์กลางคืน 1.5 วัน) PADI Night Diver: 11,990 บาท (4 ไดฟ์กลางคืน 2.5 วัน) มีตัวเลือกดำน้ำกลางคืนส่วนตัวด้วยเรือยาง"},
            {"q": "คอร์ส Night Diver รวมอะไรบ้าง?",
             "a": "รวม: Night Diver Specialty 1-2 วัน (SDI หรือ PADI) ดำน้ำกลางคืน 2-4 ไดฟ์จากเรือ ครูสอนมืออาชีพ (สูงสุด 4 คน) อุปกรณ์ครบชุดรวมไฟฉายดำน้ำ เอกสาร อาหารกลางวัน เครื่องดื่ม ผลไม้ และรับจากโรงแรม"},
            {"q": "จะได้ดำน้ำที่ไหนระหว่างคอร์ส Night Diver ที่เกาะช้าง?",
             "a": "ดำน้ำกลางคืนที่แนวปะการังของเกาะช้างในน้ำที่สงบและมีพื้นที่คุ้มครอง เหมาะสำหรับการสังเกตสัตว์ทะเลที่ออกหากินตอนกลางคืน เรือหลวงช้างและแหล่งดำน้ำโดยรอบก็เป็นสถานที่ยอดนิยมสำหรับการดำน้ำกลางคืน"}
        ]
    },

    "navigation": {
        "en": [
            {"q": "What is the Navigation course and what will I learn?",
             "a": "The Navigation specialty teaches you to use a compass, natural navigation cues, and search patterns to always find your way underwater. You'll learn rectangular, triangular, and U-shaped navigation patterns, distance estimation, and safe return to your entry point – so you never have to rely on your dive buddy for direction."},
            {"q": "Who can join the Navigation course in Koh Chang?",
             "a": "Any Open Water Diver or equivalent certification. Minimum age 12 years. No prior navigation experience required."},
            {"q": "How much does the Navigation course cost and how long does it take?",
             "a": "SDI Navigation: 7,990 THB. PADI Navigation: 7,990 THB. Both options take 1 day and include 2 navigation dives from the boat."},
            {"q": "What is included in the Navigation course?",
             "a": "Included: 1-day Navigation specialty (SDI or PADI), 2 navigation dives from the boat, professional instructor (max. 4 students), all scuba equipment, digital materials or printed manual, lunch, drinks, fruit, and hotel pickup in selected areas of Koh Chang."},
            {"q": "Where will I dive during the Navigation course in Koh Chang?",
             "a": "Navigation training dives take place at calm, protected dive sites around Koh Chang – ideal conditions for practicing compass use, natural navigation, and search patterns. The clear waters of Mu Koh Chang National Marine Park provide excellent visibility for developing your navigation skills."}
        ],
        "de": [
            {"q": "Was ist der Navigation Kurs und was werde ich lernen?",
             "a": "Der Navigations-Spezialkurs lehrt den Einsatz eines Kompasses, natürliche Navigationspunkte und Suchmuster, um immer den Weg unter Wasser zu finden. Du lernst rechteckige, dreieckige und U-förmige Navigationsmuster, Entfernungsschätzung und sicheres Zurückkehren zum Einstiegspunkt."},
            {"q": "Wer kann am Navigation Kurs auf Koh Chang teilnehmen?",
             "a": "Jeder Open Water Diver oder gleichwertige Zertifizierung. Mindestalter 12 Jahre. Keine Vorerfahrung in der Unterwassernavigation erforderlich."},
            {"q": "Was kostet der Navigation Kurs und wie lange dauert er?",
             "a": "SDI Navigation: 7.990 THB. PADI Navigation: 7.990 THB. Beide Optionen dauern 1 Tag und beinhalten 2 Navigationstauchgänge vom Boot."},
            {"q": "Was ist im Navigation Kurs inklusive?",
             "a": "Inklusive: 1-Tages-Navigations-Specialty (SDI oder PADI), 2 Navigationstauchgänge vom Boot, professioneller Instructor (max. 4 Schüler), gesamte Tauchausrüstung, digitale Materialien oder gedrucktes Handbuch, Mittagessen, Getränke, Obst und Hotelabholung."},
            {"q": "Wo tauche ich beim Navigation Kurs auf Koh Chang?",
             "a": "Navigationstauchgänge finden an ruhigen, geschützten Tauchplätzen rund um Koh Chang statt – ideale Bedingungen zum Üben von Kompassnavigation, natürlichen Navigationspunkten und Suchmustern im klaren Wasser des Mu Koh Chang Meeresschutzgebiets."}
        ],
        "th": [
            {"q": "คอร์ส Navigation คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "Navigation specialty สอนการใช้เข็มทิศ สัญญาณนำทางตามธรรมชาติ และรูปแบบการค้นหาเพื่อหาทางใต้น้ำได้เสมอ เรียนรู้รูปแบบการนำทางสี่เหลี่ยม สามเหลี่ยม และรูป U การประมาณระยะทาง และการกลับสู่จุดเริ่มต้นอย่างปลอดภัย"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Navigation ที่เกาะช้างได้บ้าง?",
             "a": "นักดำน้ำที่มีใบรับรอง Open Water หรือเทียบเท่า อายุขั้นต่ำ 12 ปี ไม่ต้องมีประสบการณ์การนำทางใต้น้ำมาก่อน"},
            {"q": "คอร์ส Navigation ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "SDI Navigation: 7,990 บาท PADI Navigation: 7,990 บาท ทั้งสองตัวเลือกใช้เวลา 1 วัน รวมดำน้ำ Navigation 2 ไดฟ์จากเรือ"},
            {"q": "คอร์ส Navigation รวมอะไรบ้าง?",
             "a": "รวม: Navigation Specialty 1 วัน (SDI หรือ PADI) ดำน้ำ Navigation 2 ไดฟ์จากเรือ ครูสอนมืออาชีพ (สูงสุด 4 คน) อุปกรณ์ดำน้ำครบชุด เอกสารดิจิทัลหรือพิมพ์ อาหารกลางวัน เครื่องดื่ม ผลไม้ และรับจากโรงแรม"},
            {"q": "จะได้ดำน้ำที่ไหนระหว่างคอร์ส Navigation ที่เกาะช้าง?",
             "a": "ไดฟ์ฝึก Navigation จัดที่แหล่งดำน้ำที่สงบและได้รับการคุ้มครองรอบเกาะช้าง – สภาพอุดมคติสำหรับฝึกการใช้เข็มทิศ การนำทางตามธรรมชาติ และรูปแบบการค้นหา ในน้ำใสของอุทยานแห่งชาติหมู่เกาะช้าง"}
        ]
    },

    "first-aid": {
        "en": [
            {"q": "What is the First Aid course and what will I learn?",
             "a": "The First Aid course (EFR or SDI First Aid) teaches CPR, emergency response, AED usage, and oxygen provision. It is open to both divers and non-divers, and is required before enrolling in the Rescue Diver course. All training takes place at the dive center – no dives involved."},
            {"q": "Who can join the First Aid course in Koh Chang?",
             "a": "Anyone – divers and non-divers alike. No diving certification is required. This course is suitable for anyone wanting essential life-saving skills."},
            {"q": "How much does the First Aid course cost and how long does it take?",
             "a": "The First Aid course costs 4,990 THB and takes 1 day. The price is all-inclusive with no hidden fees."},
            {"q": "What is included in the First Aid course?",
             "a": "Included: full 1-day theoretical and practical training, CPR, AED, and emergency scenario practicals, certification as EFR or SDI First Aid provider, snacks, soft drinks and coffee at the dive center, all materials and equipment. No diving equipment needed."},
            {"q": "Is the First Aid course required for other diving courses?",
             "a": "Yes. A valid First Aid certification (within the last 24 months) is a prerequisite for the Rescue Diver course and the Divemaster program. It is strongly recommended for all active divers as it teaches critical life-saving skills both in and out of the water."}
        ],
        "de": [
            {"q": "Was ist der First Aid Kurs und was werde ich lernen?",
             "a": "Der First Aid Kurs (EFR oder SDI First Aid) lehrt CPR, Notfallreaktion, AED-Nutzung und Sauerstoffversorgung. Er ist für Taucher und Nicht-Taucher offen und ist Voraussetzung für den Rescue Diver Kurs. Das gesamte Training findet im Tauchzentrum statt – keine Tauchgänge."},
            {"q": "Wer kann am First Aid Kurs auf Koh Chang teilnehmen?",
             "a": "Jeder – Taucher wie Nicht-Taucher. Keine Tauchzertifizierung erforderlich. Der Kurs eignet sich für alle, die lebensrettende Grundkenntnisse erwerben möchten."},
            {"q": "Was kostet der First Aid Kurs und wie lange dauert er?",
             "a": "Der First Aid Kurs kostet 4.990 THB und dauert 1 Tag. Der Preis ist all-inclusive – keine versteckten Kosten."},
            {"q": "Was ist im First Aid Kurs inklusive?",
             "a": "Inklusive: vollständiges 1-Tages-Theorie- und Praxistraining, CPR, AED und Notfallszenarien, Zertifizierung als EFR oder SDI First Aid Provider, Snacks, Softdrinks und Kaffee im Tauchzentrum sowie alle Materialien. Keine Tauchausrüstung erforderlich."},
            {"q": "Ist der First Aid Kurs für andere Tauchkurse erforderlich?",
             "a": "Ja. Eine gültige First Aid Zertifizierung (nicht älter als 24 Monate) ist Voraussetzung für den Rescue Diver Kurs und das Divemaster-Programm. Er wird allen aktiven Tauchern empfohlen, da er lebenswichtige Erste-Hilfe-Kenntnisse vermittelt."}
        ],
        "th": [
            {"q": "คอร์ส First Aid คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "คอร์ส First Aid (EFR หรือ SDI First Aid) สอน CPR การตอบสนองฉุกเฉิน การใช้ AED และการให้ออกซิเจน เปิดรับทั้งนักดำน้ำและผู้ที่ไม่ได้ดำน้ำ และเป็นเงื่อนไขบังคับก่อนเรียนคอร์ส Rescue Diver ฝึกทั้งหมดที่ศูนย์ดำน้ำ ไม่มีการดำน้ำ"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส First Aid ที่เกาะช้างได้บ้าง?",
             "a": "ทุกคน – ทั้งนักดำน้ำและผู้ที่ไม่ได้ดำน้ำ ไม่ต้องมีใบรับรองดำน้ำ เหมาะสำหรับทุกคนที่ต้องการทักษะการช่วยชีวิตขั้นพื้นฐาน"},
            {"q": "คอร์ส First Aid ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "คอร์ส First Aid ราคา 4,990 บาท และใช้เวลา 1 วัน ราคารวมทุกอย่าง ไม่มีค่าใช้จ่ายเพิ่มเติม"},
            {"q": "คอร์ส First Aid รวมอะไรบ้าง?",
             "a": "รวม: การฝึกทฤษฎีและปฏิบัติ 1 วันเต็ม CPR AED และการฝึกสถานการณ์ฉุกเฉิน ใบรับรอง EFR หรือ SDI First Aid Provider ขนม เครื่องดื่ม และกาแฟที่ศูนย์ดำน้ำ พร้อมวัสดุและอุปกรณ์ทั้งหมด ไม่ต้องมีอุปกรณ์ดำน้ำ"},
            {"q": "คอร์ส First Aid จำเป็นสำหรับคอร์สดำน้ำอื่นไหม?",
             "a": "ใช่ ใบรับรอง First Aid ที่ยังมีผล (ไม่เกิน 24 เดือน) เป็นเงื่อนไขบังคับสำหรับคอร์ส Rescue Diver และโปรแกรม Divemaster แนะนำสำหรับนักดำน้ำที่ยังคงดำน้ำอยู่ทุกคน"}
        ]
    },

    "divemaster": {
        "en": [
            {"q": "What is the Divemaster course and what will I learn?",
             "a": "The Divemaster course is the first step into professional diving. Over a minimum of 2 weeks, you'll develop leadership skills, learn to guide certified divers, and assist instructors during courses. The program combines 20+ real-world training dives with hands-on mentorship, preparing you for a career in diving worldwide."},
            {"q": "Who can join the Divemaster course in Koh Chang?",
             "a": "Rescue Diver certification with valid First Aid (within last 24 months) is required. Minimum 40 logged dives to start the course, 60 to certify. Minimum age 18 years. Good fitness and comfort in the water are essential."},
            {"q": "How much does the Divemaster course cost and how long does it take?",
             "a": "SDI and PADI Divemaster: 29,990 THB each. The course takes a minimum of 2 weeks with a flexible schedule. Note: Crewpack and registration fee are not included in the course price."},
            {"q": "What is included in the Divemaster course?",
             "a": "Included: full Divemaster curriculum (theory and practical), 20+ training dives in real-world conditions, logbook review, dive site mapping, deep dives, assistance with daily dive shop operations, 1-on-1 multilingual mentorship, and certification upon completion."},
            {"q": "Where will I train during the Divemaster course?",
             "a": "Divemaster training takes place throughout Mu Koh Chang National Marine Park, including the famous HTMS Chang wreck, coral reefs, and diverse dive sites – giving you comprehensive real-world experience across Koh Chang's 13 dive sites."}
        ],
        "de": [
            {"q": "Was ist der Divemaster Kurs und was werde ich lernen?",
             "a": "Der Divemaster Kurs ist der erste Schritt in die professionelle Tauchwelt. In mindestens 2 Wochen entwickelst du Führungsqualitäten, lernst zertifizierte Taucher zu führen und Instructoren bei Kursen zu unterstützen. Das Programm kombiniert 20+ reale Ausbildungstauchgänge mit persönlichem Mentoring."},
            {"q": "Wer kann am Divemaster Kurs auf Koh Chang teilnehmen?",
             "a": "Rescue Diver Zertifizierung mit gültigem First Aid (nicht älter als 24 Monate) erforderlich. Mindestens 40 protokollierte Tauchgänge zum Kursstart, 60 zur Zertifizierung. Mindestalter 18 Jahre."},
            {"q": "Was kostet der Divemaster Kurs und wie lange dauert er?",
             "a": "SDI und PADI Divemaster: je 29.990 THB. Der Kurs dauert mindestens 2 Wochen mit flexiblem Zeitplan. Hinweis: Crewpack und Registrierungsgebühr sind nicht im Kurspreis enthalten."},
            {"q": "Was ist im Divemaster Kurs inklusive?",
             "a": "Inklusive: vollständiger Divemaster-Lehrplan (Theorie und Praxis), 20+ Ausbildungstauchgänge in realen Bedingungen, Logbuchprüfung, Tauchplatzkartierung, Tieftauchgänge, Mitarbeit im täglichen Tauchbetrieb und 1-zu-1-Mentoring durch das mehrsprachige Profi-Team."},
            {"q": "Wo findet das Divemaster Training statt?",
             "a": "Das Divemaster Training findet im gesamten Mu Koh Chang Meeresschutzgebiet statt, einschließlich des HTMS Chang Wracks, Korallenriffen und vielfältigen Tauchplätzen – umfassende Praxiserfahrung an allen 13 Tauchplätzen von Koh Chang."}
        ],
        "th": [
            {"q": "คอร์ส Divemaster คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
             "a": "คอร์ส Divemaster คือก้าวแรกสู่โลกดำน้ำระดับมืออาชีพ ในระยะเวลาอย่างน้อย 2 สัปดาห์ คุณจะพัฒนาทักษะผู้นำ เรียนรู้การนำนักดำน้ำที่มีใบรับรอง และช่วยครูสอนในคอร์สต่างๆ โปรแกรมรวมไดฟ์ฝึก 20+ ครั้งในสภาพแวดล้อมจริง"},
            {"q": "ใครสามารถเข้าร่วมคอร์ส Divemaster ที่เกาะช้างได้บ้าง?",
             "a": "ต้องมีใบรับรอง Rescue Diver พร้อม First Aid ที่ยังมีผล (ไม่เกิน 24 เดือน) บันทึกดำน้ำขั้นต่ำ 40 ครั้งเพื่อเริ่มคอร์ส และ 60 ครั้งเพื่อรับใบรับรอง อายุขั้นต่ำ 18 ปี"},
            {"q": "คอร์ส Divemaster ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
             "a": "SDI และ PADI Divemaster: 29,990 บาทต่อตัวเลือก คอร์สใช้เวลาอย่างน้อย 2 สัปดาห์ด้วยตารางเวลาที่ยืดหยุ่น หมายเหตุ: Crewpack และค่าลงทะเบียนไม่รวมอยู่ในราคาคอร์ส"},
            {"q": "คอร์ส Divemaster รวมอะไรบ้าง?",
             "a": "รวม: หลักสูตร Divemaster ครบถ้วน (ทฤษฎีและปฏิบัติ) ไดฟ์ฝึก 20+ ครั้งในสภาพแวดล้อมจริง การตรวจสอบ logbook การทำแผนที่แหล่งดำน้ำ ดำน้ำลึก การช่วยงานในศูนย์ดำน้ำ และการ mentoring 1 ต่อ 1 โดยทีมมืออาชีพหลายภาษา"},
            {"q": "จะฝึกที่ไหนระหว่างคอร์ส Divemaster?",
             "a": "การฝึก Divemaster จัดทั่วอุทยานแห่งชาติหมู่เกาะช้าง รวมถึงเรือหลวงช้างที่มีชื่อเสียง แนวปะการัง และแหล่งดำน้ำที่หลากหลาย – ประสบการณ์จริงครอบคลุม 13 แหล่งดำน้ำของเกาะช้าง"}
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
