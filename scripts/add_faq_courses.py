#!/usr/bin/env python3
"""
Adds FAQPage schema to course pages that don't have one yet.
Inserts a new <script type="application/ld+json"> block before </head>.
"""

import re
import os

FAQ_DATA = {
    "open-water-diver": {
        "en": [
            {
                "q": "What is the Open Water Diver course and what will I learn?",
                "a": "The Open Water Diver course is your first full scuba certification, completed in 3 days in Koh Chang. You'll learn buoyancy control, equipment use, underwater navigation, and emergency procedures – finishing with 4 open water dives at calm reef sites in Mu Koh Chang National Marine Park, certified to dive to 18 metres worldwide."
            },
            {
                "q": "Who can join the Open Water Diver course in Koh Chang?",
                "a": "No prior diving experience required. Minimum age is 10 years – divers aged 10–14 receive a Junior Open Water Diver certification. You need reasonable swimming comfort and good general health."
            },
            {
                "q": "How much does the Open Water Diver course cost and how long does it take?",
                "a": "The course takes 3 days. Prices start from 14,490 THB (SDI eLearning). PADI Basic is 14,990 THB, PADI eLearning 16,490 THB. A partial Scuba Diver certification is available from 10,490 THB."
            },
            {
                "q": "What is included in the Open Water Diver course?",
                "a": "Included: full 3-day certification course (SDI or PADI), pool training and 4 open water dives, professional instructor (max. 4 students per instructor), all scuba equipment, digital course materials, lunch, drinks, fruit, and hotel pickup in selected areas of Koh Chang."
            },
            {
                "q": "What dive sites will I visit during the Open Water course?",
                "a": "Training dives take place at beginner-friendly sites like Hin Raab South and Blueberry Hill in Mu Koh Chang National Marine Park – with excellent visibility, calm conditions, and vibrant marine life. After certification, you can explore all 13 dive sites including the HTMS Chang wreck."
            }
        ],
        "de": [
            {
                "q": "Was ist der Open Water Diver Kurs und was werde ich lernen?",
                "a": "Der Open Water Diver Kurs ist deine erste vollständige Taucher-Zertifizierung, die in 3 Tagen auf Koh Chang absolviert wird. Du lernst Auftriebskontrolle, Ausrüstungshandhabung, Unterwassernavigation und Notfallverfahren – und schließt mit 4 Freiwassertauchgängen ab. Zertifiziert bis 18 Meter weltweit."
            },
            {
                "q": "Wer kann am Open Water Diver Kurs auf Koh Chang teilnehmen?",
                "a": "Keine Taucherfahrung erforderlich. Mindestalter 10 Jahre – Taucher zwischen 10 und 14 Jahren erhalten das Junior Open Water Diver Zertifikat. Grundlegende Schwimmkenntnisse und gute Gesundheit sind Voraussetzung."
            },
            {
                "q": "Was kostet der Open Water Diver Kurs und wie lange dauert er?",
                "a": "Der Kurs dauert 3 Tage. Preise ab 14.490 THB (SDI eLearning). PADI Basic ab 14.990 THB, PADI eLearning ab 16.490 THB. Eine Teil-Zertifizierung als Scuba Diver ist ab 10.490 THB möglich."
            },
            {
                "q": "Was ist im Open Water Diver Kurs inklusive?",
                "a": "Inklusive: kompletter 3-Tages-Kurs (SDI oder PADI), Pool-Training und 4 Freiwassertauchgänge, professioneller Instructor (max. 4 Schüler), gesamte Tauchausrüstung, digitale Kursmaterialien, Mittagessen, Getränke, Obst und Hotelabholung in ausgewählten Bereichen von Koh Chang."
            },
            {
                "q": "Welche Tauchplätze besuche ich während des Open Water Kurses?",
                "a": "Die Ausbildungstauchgänge finden an anfängerfreundlichen Plätzen wie Hin Raab South und Blueberry Hill im Mu Koh Chang Meeresschutzgebiet statt – mit ausgezeichneter Sicht und ruhigen Bedingungen. Nach der Zertifizierung stehen alle 13 Tauchplätze inkl. HTMS Chang Wrack offen."
            }
        ],
        "th": [
            {
                "q": "คอร์ส Open Water Diver คืออะไร และจะได้เรียนรู้อะไรบ้าง?",
                "a": "คอร์ส Open Water Diver คือการรับรองการดำน้ำขั้นพื้นฐานครบวงจร ใช้เวลา 3 วันที่เกาะช้าง เรียนรู้การควบคุมการลอยตัว การใช้อุปกรณ์ การนำทางใต้น้ำ และขั้นตอนฉุกเฉิน จบด้วยการดำน้ำ 4 ไดฟ์ ได้รับใบรับรองดำน้ำได้ถึง 18 เมตรทั่วโลก"
            },
            {
                "q": "ใครสามารถเข้าร่วมคอร์ส Open Water Diver ที่เกาะช้างได้บ้าง?",
                "a": "ไม่ต้องมีประสบการณ์ดำน้ำมาก่อน อายุขั้นต่ำ 10 ปี (อายุ 10-14 ปีจะได้รับใบรับรอง Junior Open Water Diver) ต้องว่ายน้ำเป็นและมีสุขภาพแข็งแรง"
            },
            {
                "q": "คอร์ส Open Water Diver ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
                "a": "คอร์สใช้เวลา 3 วัน ราคาเริ่มต้นที่ 14,490 บาท (SDI eLearning) PADI Basic 14,990 บาท PADI eLearning 16,490 บาท มีตัวเลือก Scuba Diver (ใบรับรองบางส่วน) เริ่มต้น 10,490 บาท"
            },
            {
                "q": "คอร์ส Open Water Diver รวมอะไรบ้าง?",
                "a": "รวม: คอร์สรับรอง 3 วัน (SDI หรือ PADI) การฝึกในสระและดำน้ำ 4 ไดฟ์ ครูผู้สอนมืออาชีพ (สูงสุด 4 คนต่อครู) อุปกรณ์ดำน้ำครบชุด เอกสารคอร์สดิจิทัล อาหารกลางวัน เครื่องดื่ม ผลไม้ และบริการรับจากโรงแรมในเกาะช้าง"
            },
            {
                "q": "จะได้ดำน้ำที่ไหนระหว่างคอร์ส Open Water?",
                "a": "ฝึกดำน้ำที่แหล่งดำน้ำสำหรับผู้เริ่มต้น เช่น Hin Raab South และ Blueberry Hill ในอุทยานแห่งชาติหมู่เกาะช้าง ทัศนวิสัยดีเยี่ยม คลื่นสงบ หลังจากได้รับใบรับรองสามารถดำน้ำได้ทั้ง 13 จุด รวมถึงเรือหลวงช้าง"
            }
        ]
    },

    "deep-wreck-nitrox": {
        "en": [
            {
                "q": "What is the Deep, Wreck & Nitrox package and what certifications will I earn?",
                "a": "The Deep, Wreck & Nitrox package is Chang Diving's best-selling specialty combination. You earn three certifications in one program: Deep Diver (to 40 m), Wreck Diver (limited penetration), and Nitrox Diver (EANx32/36) – giving you the skills to dive deeper, explore wrecks safely, and extend your bottom time."
            },
            {
                "q": "Who can join the Deep, Wreck & Nitrox package?",
                "a": "Prerequisite: PADI Advanced Open Water Diver, SDI Open Water Diver, or equivalent certification. Minimum age 18 years."
            },
            {
                "q": "How much does the Deep, Wreck & Nitrox package cost and how long does it take?",
                "a": "SDI option: 2 days, 5 dives, 19,490 THB. PADI option: 4 days, 8 dives, 27,490 THB. All certification fees and equipment are included – no hidden costs."
            },
            {
                "q": "What is included in the Deep, Wreck & Nitrox package?",
                "a": "Included: Deep Diver, Wreck Diver, and Nitrox Diver certification courses, eLearning for all three courses, all training dives, full scuba equipment, certification fees, and experienced tech-diving instructors. Optional: DAN dive accident insurance."
            },
            {
                "q": "Which wrecks will I dive during the Deep, Wreck & Nitrox package?",
                "a": "Training dives include the famous HTMS Chang wreck at 31 metres – Thailand's largest diveable warship – and the Koho Maru 5 at 42 metres, both in Mu Koh Chang National Marine Park. Best diving conditions are November to April."
            }
        ],
        "de": [
            {
                "q": "Was ist das Deep, Wreck & Nitrox Paket und welche Zertifizierungen bekomme ich?",
                "a": "Das Deep, Wreck & Nitrox Paket ist das meistgekaufte Spezialkurs-Kombi bei Chang Diving. Du erhältst drei Zertifizierungen: Deep Diver (bis 40 m), Wrack Diver (begrenzte Penetration) und Nitrox Diver (EANx32/36) – für tiefere Tauchgänge, sichere Wrackerkundung und längere Bodenzeiten."
            },
            {
                "q": "Wer kann am Deep, Wreck & Nitrox Paket teilnehmen?",
                "a": "Voraussetzung: PADI Advanced Open Water Diver, SDI Open Water Diver oder gleichwertige Zertifizierung. Mindestalter 18 Jahre."
            },
            {
                "q": "Was kostet das Deep, Wreck & Nitrox Paket und wie lange dauert es?",
                "a": "SDI-Option: 2 Tage, 5 Tauchgänge, 19.490 THB. PADI-Option: 4 Tage, 8 Tauchgänge, 27.490 THB. Alle Zertifizierungsgebühren und Ausrüstung sind inklusive – keine versteckten Kosten."
            },
            {
                "q": "Was ist im Deep, Wreck & Nitrox Paket inklusive?",
                "a": "Inklusive: Deep Diver, Wrack Diver und Nitrox Diver Kurse, eLearning für alle drei Kurse, alle Ausbildungstauchgänge, vollständige Tauchausrüstung, Zertifizierungsgebühren und erfahrene Tech-Tauchlehrer. Optional: DAN Tauchunfallversicherung."
            },
            {
                "q": "Welche Wracks tauche ich beim Deep, Wreck & Nitrox Paket?",
                "a": "Die Ausbildungstauchgänge umfassen das HTMS Chang Wrack auf 31 Metern – Thailands größtes betauchbares Kriegsschiff – sowie die Koho Maru 5 auf 42 Metern. Beste Tauchedingungen von November bis April."
            }
        ],
        "th": [
            {
                "q": "แพ็กเกจ Deep, Wreck & Nitrox คืออะไร และจะได้ใบรับรองอะไรบ้าง?",
                "a": "แพ็กเกจ Deep, Wreck & Nitrox คือคอมโบ Specialty ที่ขายดีที่สุดของช้างไดร์วิ่ง คุณจะได้รับใบรับรอง 3 ใบในโปรแกรมเดียว: Deep Diver (ถึง 40 ม.), Wreck Diver (การสำรวจจำกัด) และ Nitrox Diver (EANx32/36)"
            },
            {
                "q": "ใครสามารถเข้าร่วมแพ็กเกจ Deep, Wreck & Nitrox ได้บ้าง?",
                "a": "เงื่อนไขเบื้องต้น: PADI Advanced Open Water Diver, SDI Open Water Diver หรือเทียบเท่า อายุขั้นต่ำ 18 ปี"
            },
            {
                "q": "แพ็กเกจ Deep, Wreck & Nitrox ราคาเท่าไหร่และใช้เวลานานแค่ไหน?",
                "a": "SDI: 2 วัน 5 ไดฟ์ ราคา 19,490 บาท PADI: 4 วัน 8 ไดฟ์ ราคา 27,490 บาท รวมค่าใบรับรองและอุปกรณ์ทั้งหมด ไม่มีค่าใช้จ่ายซ่อนเร้น"
            },
            {
                "q": "แพ็กเกจ Deep, Wreck & Nitrox รวมอะไรบ้าง?",
                "a": "รวม: คอร์ส Deep Diver, Wreck Diver และ Nitrox Diver, eLearning ทั้ง 3 คอร์ส, ไดฟ์ฝึกทั้งหมด, อุปกรณ์ดำน้ำครบชุด, ค่าใบรับรอง และครูสอนดำน้ำเทคนิคที่มีประสบการณ์ ตัวเลือก: ประกันอุบัติเหตุดำน้ำ DAN"
            },
            {
                "q": "จะได้ดำน้ำที่ซากเรืออะไรบ้างในแพ็กเกจ Deep, Wreck & Nitrox?",
                "a": "รวมการดำน้ำที่เรือหลวงช้างที่ความลึก 31 เมตร – เรือรบที่ดำน้ำได้ที่ใหญ่ที่สุดในไทย – และ Koho Maru 5 ที่ 42 เมตร ฤดูกาลดำน้ำที่ดีที่สุดคือพฤศจิกายนถึงเมษายน"
            }
        ]
    },

    "technical-diving-courses": {
        "en": [
            {
                "q": "What are technical diving courses and who are they for?",
                "a": "Technical diving courses are advanced programs for experienced divers who want to go beyond recreational limits – using twin sets, stage tanks, or sidemount, and executing dives with decompression stops. At Chang Diving Center, TDI courses include Intro to Tech, Advanced Nitrox, Decompression Procedures, and Advanced Wreck."
            },
            {
                "q": "What are the prerequisites for technical diving courses?",
                "a": "Technical diving requires strong recreational foundations. For Deco Procedures you need a Deep Diver specialty; for Advanced Nitrox a Nitrox certification; for Advanced Wreck a Wreck Diver specialty. The Deep, Wreck & Nitrox package is the recommended fast-track foundation."
            },
            {
                "q": "How much do technical diving courses cost in Koh Chang?",
                "a": "TDI Intro to Tech: from 15,990 THB (3 days). TDI Advanced Nitrox: from 15,990 THB (3 days). Decompression Procedures: from 19,990 THB (5 days). Advanced Wreck: from 19,990 THB (5 days). Full Technical Diver Package: from 66,990 THB (14 days)."
            },
            {
                "q": "What is included in technical diving courses at Chang Diving?",
                "a": "All TDI technical courses include eLearning theory, all training dives, full technical equipment (twin sets, stage tanks as needed), experienced TDI-certified instructors, and certification fees. Courses are conducted in small groups."
            },
            {
                "q": "Where do technical diving training dives take place in Koh Chang?",
                "a": "Technical training dives are conducted at the HTMS Chang wreck and Koh Chang's sloping reefs – providing real-world conditions for gas management, decompression planning, and overhead environment training. Note: extended deco dives depend on weather and boat availability."
            }
        ],
        "de": [
            {
                "q": "Was sind technische Tauchkurse und für wen sind sie geeignet?",
                "a": "Technische Tauchkurse sind fortgeschrittene Programme für erfahrene Taucher, die über die Freizeittauchgrenzen hinausgehen möchten – mit Doppelgeräten, Stage-Tanks oder Sidemount, und Tauchgängen mit Dekompressionsstopps. Chang Diving bietet TDI-Kurse wie Intro to Tech, Advanced Nitrox, Dekompressionsprozeduren und Advanced Wreck an."
            },
            {
                "q": "Was sind die Voraussetzungen für technische Tauchkurse?",
                "a": "Technisches Tauchen erfordert solide Freizeitgrundlagen. Für Deko-Prozeduren wird der Deep Diver Spezialkurs benötigt, für Advanced Nitrox eine Nitrox-Zertifizierung, für Advanced Wreck der Wrack Diver Kurs. Das Deep, Wreck & Nitrox Paket ist der empfohlene Einstieg."
            },
            {
                "q": "Was kosten technische Tauchkurse auf Koh Chang?",
                "a": "TDI Intro to Tech: ab 15.990 THB (3 Tage). TDI Advanced Nitrox: ab 15.990 THB (3 Tage). Dekompressionsprozeduren: ab 19.990 THB (5 Tage). Advanced Wrack: ab 19.990 THB (5 Tage). Vollständiges Technisches Taucher Paket: ab 66.990 THB (14 Tage)."
            },
            {
                "q": "Was ist in technischen Tauchkursen bei Chang Diving inklusive?",
                "a": "Alle TDI-Kurse beinhalten eLearning-Theorie, alle Ausbildungstauchgänge, vollständige technische Ausrüstung, erfahrene TDI-zertifizierte Tauchlehrer und Zertifizierungsgebühren. Kurse finden in kleinen Gruppen statt."
            },
            {
                "q": "Wo finden technische Ausbildungstauchgänge auf Koh Chang statt?",
                "a": "Technische Ausbildungstauchgänge werden am HTMS Chang Wrack und an Koh Changs abfallenden Riffen durchgeführt – ideale reale Bedingungen für Gasmanagement, Dekompressionsplanung und Training im Overhead-Environment."
            }
        ],
        "th": [
            {
                "q": "คอร์สดำน้ำเทคนิคคืออะไร และเหมาะสำหรับใคร?",
                "a": "คอร์สดำน้ำเทคนิคเป็นโปรแกรมขั้นสูงสำหรับนักดำน้ำที่มีประสบการณ์ที่ต้องการก้าวข้ามขีดจำกัดการดำน้ำเพื่อการพักผ่อน โดยใช้ถังคู่ stage tanks หรือ sidemount ที่ Chang Diving มีคอร์ส TDI ได้แก่ Intro to Tech, Advanced Nitrox, Decompression Procedures และ Advanced Wreck"
            },
            {
                "q": "เงื่อนไขเบื้องต้นสำหรับคอร์สดำน้ำเทคนิคมีอะไรบ้าง?",
                "a": "ต้องมีพื้นฐานการดำน้ำเพื่อการพักผ่อนที่แข็งแกร่ง สำหรับ Deco Procedures ต้องมี Deep Diver specialty สำหรับ Advanced Nitrox ต้องมีใบรับรอง Nitrox สำหรับ Advanced Wreck ต้องมี Wreck Diver specialty แพ็กเกจ Deep, Wreck & Nitrox แนะนำเป็นพื้นฐาน"
            },
            {
                "q": "คอร์สดำน้ำเทคนิคที่เกาะช้างราคาเท่าไหร่?",
                "a": "TDI Intro to Tech: เริ่มต้น 15,990 บาท (3 วัน) TDI Advanced Nitrox: เริ่มต้น 15,990 บาท (3 วัน) Decompression Procedures: เริ่มต้น 19,990 บาท (5 วัน) Advanced Wreck: เริ่มต้น 19,990 บาท (5 วัน) Technical Diver Package: เริ่มต้น 66,990 บาท (14 วัน)"
            },
            {
                "q": "คอร์สดำน้ำเทคนิคที่ช้างไดร์วิ่งรวมอะไรบ้าง?",
                "a": "คอร์ส TDI ทุกคอร์สรวม eLearning ทฤษฎี ไดฟ์ฝึกทั้งหมด อุปกรณ์เทคนิคครบชุด ครูสอนที่ได้รับการรับรอง TDI และค่าใบรับรอง จัดในกลุ่มเล็ก"
            },
            {
                "q": "ไดฟ์ฝึกเทคนิคที่เกาะช้างจัดที่ไหน?",
                "a": "ไดฟ์ฝึกเทคนิคจัดที่เรือหลวงช้างและแนวปะการังลาดชันรอบเกาะช้าง – สภาพแวดล้อมจริงสำหรับการจัดการแก๊ส การวางแผน decompression และการฝึกใน overhead environment"
            }
        ]
    },

    "professional-courses": {
        "en": [
            {
                "q": "What professional diving courses are available in Koh Chang?",
                "a": "Chang Diving Center offers SDI/TDI and PADI professional courses including: Divemaster (30 days), EFR Instructor (3 days), SDI Instructor Development Course – IDC (14 days), SDI Instructor Examination – IE (2 days), and SDI Instructor Crossover (3 days)."
            },
            {
                "q": "What are the prerequisites for professional diving courses?",
                "a": "For the Divemaster course you need Advanced Open Water certification and 20+ logged dives. For the IDC you must hold a Divemaster certification. The IE follows the IDC. For Instructor Crossover, you need an active instructor certification from another agency."
            },
            {
                "q": "How much do professional diving courses cost in Koh Chang?",
                "a": "Divemaster: from 29,990 THB (30 days). EFR Instructor: from 9,990 THB (3 days). SDI IDC: from 34,990 THB (14 days). SDI IE: from 9,990 THB (2 days). SDI Instructor Crossover: from 15,990 THB (3 days)."
            },
            {
                "q": "What is included in professional diving courses at Chang Diving?",
                "a": "Professional courses include comprehensive theory and workshops, hands-on training dives at Koh Chang's reefs and wrecks, leadership skills development, job preparation, small group training with SDI/TDI/PADI instructors, and all required materials for certification."
            },
            {
                "q": "Can I work as a dive professional after completing a course at Chang Diving?",
                "a": "Yes. After completing your Divemaster or Instructor certification, you are qualified to work at dive centers worldwide. SDI and PADI certifications are globally recognized. Chang Diving prepares you with real-world experience at Koh Chang's reefs and the HTMS Chang wreck."
            }
        ],
        "de": [
            {
                "q": "Welche professionellen Tauchkurse gibt es auf Koh Chang?",
                "a": "Chang Diving Center bietet SDI/TDI und PADI Profi-Kurse: Divemaster (30 Tage), EFR Instructor (3 Tage), SDI Instructor Development Course – IDC (14 Tage), SDI Instructor Examination – IE (2 Tage) und SDI Instructor Crossover (3 Tage)."
            },
            {
                "q": "Was sind die Voraussetzungen für professionelle Tauchkurse?",
                "a": "Für den Divemaster-Kurs werden eine Advanced Open Water Zertifizierung und 20+ protokollierte Tauchgänge benötigt. Für den IDC ist eine Divemaster-Zertifizierung erforderlich. Für den Instructor Crossover wird eine aktive Instructor-Zertifizierung einer anderen Organisation benötigt."
            },
            {
                "q": "Was kosten professionelle Tauchkurse auf Koh Chang?",
                "a": "Divemaster: ab 29.990 THB (30 Tage). EFR Instructor: ab 9.990 THB (3 Tage). SDI IDC: ab 34.990 THB (14 Tage). SDI IE: ab 9.990 THB (2 Tage). SDI Instructor Crossover: ab 15.990 THB (3 Tage)."
            },
            {
                "q": "Was ist in den professionellen Tauchkursen bei Chang Diving inklusive?",
                "a": "Profi-Kurse beinhalten umfassende Theorie und Workshops, praktische Ausbildungstauchgänge an Koh Changs Riffen und Wracks, Entwicklung von Führungsqualitäten, Jobvorbereitung, Kleingruppentraining mit SDI/TDI/PADI-Instructoren und alle erforderlichen Zertifizierungsmaterialien."
            },
            {
                "q": "Kann ich nach einem Profi-Kurs bei Chang Diving als Tauchinstruktor arbeiten?",
                "a": "Ja. Nach dem Divemaster oder Instructor-Kurs bist du weltweit qualifiziert, in Tauchzentren zu arbeiten. SDI- und PADI-Zertifizierungen sind global anerkannt. Chang Diving bereitet dich mit echter Praxiserfahrung an den Riffen und dem HTMS Chang Wrack vor."
            }
        ],
        "th": [
            {
                "q": "มีคอร์สดำน้ำระดับมืออาชีพอะไรบ้างที่เกาะช้าง?",
                "a": "ช้างไดร์วิ่ง เซ็นเตอร์ เปิดสอนคอร์สมืออาชีพ SDI/TDI และ PADI ได้แก่: Divemaster (30 วัน) EFR Instructor (3 วัน) SDI Instructor Development Course – IDC (14 วัน) SDI Instructor Examination – IE (2 วัน) และ SDI Instructor Crossover (3 วัน)"
            },
            {
                "q": "เงื่อนไขเบื้องต้นสำหรับคอร์สดำน้ำระดับมืออาชีพมีอะไรบ้าง?",
                "a": "คอร์ส Divemaster ต้องมีใบรับรอง Advanced Open Water และบันทึกการดำน้ำ 20+ ครั้ง สำหรับ IDC ต้องมีใบรับรอง Divemaster สำหรับ Instructor Crossover ต้องมีใบรับรองครูสอนดำน้ำที่ยังมีผลจากองค์กรอื่น"
            },
            {
                "q": "คอร์สดำน้ำระดับมืออาชีพที่เกาะช้างราคาเท่าไหร่?",
                "a": "Divemaster: เริ่มต้น 29,990 บาท (30 วัน) EFR Instructor: เริ่มต้น 9,990 บาท (3 วัน) SDI IDC: เริ่มต้น 34,990 บาท (14 วัน) SDI IE: เริ่มต้น 9,990 บาท (2 วัน) SDI Instructor Crossover: เริ่มต้น 15,990 บาท (3 วัน)"
            },
            {
                "q": "คอร์สมืออาชีพที่ช้างไดร์วิ่งรวมอะไรบ้าง?",
                "a": "คอร์สมืออาชีพรวม ทฤษฎีและเวิร์กช็อปที่ครอบคลุม ไดฟ์ฝึกจริงที่แนวปะการังและซากเรือของเกาะช้าง การพัฒนาทักษะผู้นำ การเตรียมพร้อมสู่อาชีพ การฝึกกลุ่มเล็กกับครูสอน SDI/TDI/PADI และเอกสารรับรองทั้งหมด"
            },
            {
                "q": "หลังจบคอร์สมืออาชีพที่ช้างไดร์วิ่ง สามารถทำงานเป็นครูสอนดำน้ำได้ไหม?",
                "a": "ได้ หลังจบ Divemaster หรือ Instructor คุณมีคุณสมบัติทำงานในศูนย์ดำน้ำทั่วโลก ใบรับรอง SDI และ PADI ได้รับการยอมรับทั่วโลก ช้างไดร์วิ่งเตรียมคุณด้วยประสบการณ์จริงที่แนวปะการังและเรือหลวงช้าง"
            }
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
    # Insert before </head>
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
