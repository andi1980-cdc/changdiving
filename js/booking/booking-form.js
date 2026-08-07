/**
 * Chang Diving – booking form (LOCAL DRAFT)
 * Prefill: /en|de|th/book/?product=open-water-diver&option=sdi-elearning
 * Draft: email preview + mailto / WhatsApp only (no API).
 */
(function () {
  "use strict";

  var DRAFT_MODE = true;
  var TO_EMAIL = "info@changdiving.com";
  var WA_NUMBER = "66894013927";
  var MAX_PEOPLE = 4;

  function detectLang() {
    try {
      var m = (location.pathname || "").match(/^\/(en|de|th)(\/|$)/);
      if (m) return m[1];
    } catch (e) {}
    var htmlLang = (document.documentElement.lang || "").toLowerCase();
    if (htmlLang.indexOf("de") === 0) return "de";
    if (htmlLang.indexOf("th") === 0) return "th";
    return "en";
  }

  var LANG = detectLang();

  var I18N = {
    en: {
      titleSuffix: " – Chang Diving (DRAFT)",
      pageTitle: "Book your Dive Adventure",
      viewProduct: "View product page",
      diver: "Diver",
      name: "Full name (in English)",
      dob: "Date of birth",
      email: "Email (this diver)",
      emailHint:
        "Each diver needs their <strong>own</strong> email (courses &amp; dive accident insurance).",
      cert: "Certification level",
      select: "— select —",
      certNone: "Non-certified",
      certScuba: "Scuba Diver (max. 12m)",
      certOw: "Open Water",
      certAdv: "Advanced",
      certRescue: "Rescue",
      certDm: "Divemaster",
      certInstr: "Instructor",
      certPhoto: "Photo of Dive Certification Card (if available)",
      certPhotoHint:
        "Draft: file is not uploaded — attach it in the email app.",
      dives: "Total dives",
      lastDive: "Last dive date",
      veg: "Vegetarian",
      allergies: "Food allergies",
      yes: "Yes",
      no: "No",
      equipHead: "Equipment requirements",
      equipHint:
        "Pick rental sizes from the lists (avoids “need” with no size). Tick only the items you want to rent.",
      bcd: "BCD – size",
      wetsuit: "Wetsuit – size",
      selectSize: "— select size —",
      bcdTip:
        "Tip: BCDs run large (dry-suit room). Usually choose <strong>one size smaller</strong> than your EU T-shirt size.",
      mask: "Mask – need rental",
      fins: "Fins – need rental",
      regulator: "Regulator – need rental",
      shirt: "T-shirt size (EU)",
      shoes: "Shoe size (EU)",
      ownEquip:
        "<strong>Own equipment – 5% discount</strong> (only weights and tanks!)",
      insurance: "<strong>DAN dive accident insurance</strong> for this diver",
      insuranceHint:
        'Optional short-term cover. Details: <a href="/en/day-trips/insurance/" target="_blank" rel="noopener">/day-trips/insurance/</a>',
      insurancePkg: "Insurance package",
      selectPkg: "— select package —",
      gopro: "<strong>GoPro HERO 7 Black rental</strong> for this diver",
      goproHint:
        'Optional. Details: <a href="/en/day-trips/rent-gopro/" target="_blank" rel="noopener">/day-trips/rent-gopro/</a> · 700 THB / day',
      goproPkg: "GoPro rental duration",
      selectDays: "— select days —",
      needRental: "Need rental",
      ownEquipYes: "Yes – 5% discount (weights & tanks only)",
      fileNone: "(none – attach in email if available)",
      fileAttach: " (attach this file in your email)",
      subjectPrefix: "Booking Request – ",
      hello: "Hello Chang Diving Team,",
      wantBook: "I would like to book:",
      package: "Package",
      price: "Price",
      startDate: "Preferred start / trip date",
      numDivers: "Number of divers",
      equipment: "Equipment",
      bcdSize: "BCD size",
      wetsuitSize: "Wetsuit size",
      maskLbl: "Mask",
      finsLbl: "Fins",
      regLbl: "Regulator",
      ownDisc: "Own equipment 5% discount",
      danIns: "DAN dive accident insurance",
      goproRent: "GoPro HERO 7 Black rental",
      pkgNotSel: "package not selected",
      durNotSel: "duration not selected",
      sharedContact: "Shared booking contact",
      phone: "Phone number",
      hotel: "Hotel name",
      emailsNote:
        "(Each diver’s own email is listed under their diver block above.)",
      message: "Message",
      page: "Page",
      productUrl: "Product URL",
      thanks: "Thank you!",
      subjectLbl: "Subject",
      errSpam: "Spam check failed.",
      errDate: "Please choose a preferred date.",
      errPhone: "Please enter a phone number.",
      errName: "Please enter the name for diver ",
      errDob: "Please enter the date of birth for diver ",
      errEmail: "Please enter a valid email for diver ",
      errCert: "Please select the certification level for diver ",
      errIns: "Please select a DAN insurance package for diver ",
      errInsOr: " (or uncheck insurance).",
      errGopro: "Please select GoPro rental duration for diver ",
      errGoproOr: " (or uncheck GoPro).",
      errDupEmailA: "Each diver needs their own email. Diver ",
      errDupEmailB: " and diver ",
      errDupEmailC: " use the same address.",
      draftOk: "<strong>Draft ready</strong> — nothing was sent to a server.",
      draftWarn:
        " Long group messages can hit length limits on some phones — use the preview to copy/paste if needed.",
      draftUseA: ' Use <a href="',
      draftUseB: '">email</a> or <a href="',
      draftUseC: '">WhatsApp</a> (both include your form data).',
      seePage: "see page",
      otherLabel: "Other / not sure",
      otherOpt: "General booking enquiry",
      otherH1: "Booking enquiry – Chang Diving",
      funAddons: "Fun dive add-ons",
      extraDive: "Extra dive (+800 THB / dive)",
      nitrox: "Nitrox upgrade (+100 THB / tank)",
      sidemount: "Sidemount extra tanks",
      sidemountAir: "extra tanks air (+250 THB each)",
      sidemountEan: "extra tanks EAN / Nitrox (+300 THB each)",
      sidemountNo: "No (1 tank per dive included)",
    },
    de: {
      titleSuffix: " – Chang Diving (ENTWURF)",
      pageTitle: "Buche dein Tauchabenteuer",
      viewProduct: "Zur Produktseite",
      diver: "Taucher",
      name: "Vollständiger Name (auf Englisch)",
      dob: "Geburtsdatum",
      email: "E-Mail (dieser Taucher)",
      emailHint:
        "Jeder Taucher braucht eine <strong>eigene</strong> E-Mail (Kurse &amp; Tauchunfallversicherung).",
      cert: "Zertifizierungsstufe",
      select: "— wählen —",
      certNone: "Nicht zertifiziert",
      certScuba: "Scuba Diver (max. 12m)",
      certOw: "Open Water",
      certAdv: "Advanced",
      certRescue: "Rescue",
      certDm: "Divemaster",
      certInstr: "Instructor",
      certPhoto: "Foto der Tauchzertifikatskarte (falls vorhanden)",
      certPhotoHint:
        "Entwurf: Datei wird nicht hochgeladen — in der E-Mail-App anhängen.",
      dives: "Tauchgänge gesamt",
      lastDive: "Datum des letzten Tauchgangs",
      veg: "Vegetarisch",
      allergies: "Lebensmittelallergien",
      yes: "Ja",
      no: "Nein",
      equipHead: "Ausrüstung",
      equipHint:
        "Mietgrößen aus den Listen wählen (vermeidet „benötigt“ ohne Größe). Nur ankreuzen, was gemietet werden soll.",
      bcd: "BCD – Größe",
      wetsuit: "Neoprenanzug – Größe",
      selectSize: "— Größe wählen —",
      bcdTip:
        "Tipp: BCDs fallen groß aus (Trockentauchanzug-Raum). Meist <strong>eine Größe kleiner</strong> als EU-T-Shirt wählen.",
      mask: "Maske – Ausleihe benötigt",
      fins: "Flossen – Ausleihe benötigt",
      regulator: "Atemregler – Ausleihe benötigt",
      shirt: "T-Shirt-Größe (EU)",
      shoes: "Schuhgröße (EU)",
      ownEquip:
        "<strong>Eigene Ausrüstung – 5&nbsp;% Rabatt</strong> (nur Bleigewichte und Flaschen!)",
      insurance:
        "<strong>DAN Tauchunfallversicherung</strong> für diesen Taucher",
      insuranceHint:
        'Optionaler Kurzzeitschutz. Details: <a href="/de/day-trips/insurance/" target="_blank" rel="noopener">/day-trips/insurance/</a>',
      insurancePkg: "Versicherungspaket",
      selectPkg: "— Paket wählen —",
      gopro: "<strong>GoPro HERO 7 Black Miete</strong> für diesen Taucher",
      goproHint:
        'Optional. Details: <a href="/de/day-trips/rent-gopro/" target="_blank" rel="noopener">/day-trips/rent-gopro/</a> · 700 THB / Tag',
      goproPkg: "GoPro Mietdauer",
      selectDays: "— Tage wählen —",
      needRental: "Ausleihe benötigt",
      ownEquipYes: "Ja – 5 % Rabatt (nur Bleigewichte & Flaschen)",
      fileNone: "(keine – ggf. in der E-Mail anhängen)",
      fileAttach: " (diese Datei in der E-Mail anhängen)",
      subjectPrefix: "Buchungsanfrage – ",
      hello: "Hallo Chang Diving Team,",
      wantBook: "Ich möchte buchen:",
      package: "Paket",
      price: "Preis",
      startDate: "Gewünschtes Start- / Tourdatum",
      numDivers: "Anzahl Taucher",
      equipment: "Ausrüstung",
      bcdSize: "BCD-Größe",
      wetsuitSize: "Neoprenanzug-Größe",
      maskLbl: "Maske",
      finsLbl: "Flossen",
      regLbl: "Atemregler",
      ownDisc: "Eigene Ausrüstung 5 % Rabatt",
      danIns: "DAN Tauchunfallversicherung",
      goproRent: "GoPro HERO 7 Black Miete",
      pkgNotSel: "Paket nicht gewählt",
      durNotSel: "Dauer nicht gewählt",
      sharedContact: "Gemeinsamer Buchungskontakt",
      phone: "Telefonnummer",
      hotel: "Hotelname",
      emailsNote:
        "(Die eigene E-Mail jedes Tauchers steht im jeweiligen Block oben.)",
      message: "Nachricht",
      page: "Seite",
      productUrl: "Produkt-URL",
      thanks: "Vielen Dank!",
      subjectLbl: "Betreff",
      errSpam: "Spam-Prüfung fehlgeschlagen.",
      errDate: "Bitte gewünschtes Datum wählen.",
      errPhone: "Bitte Telefonnummer eingeben.",
      errName: "Bitte Name für Taucher ",
      errDob: "Bitte Geburtsdatum für Taucher ",
      errEmail: "Bitte gültige E-Mail für Taucher ",
      errCert: "Bitte Zertifizierungsstufe für Taucher ",
      errIns: "Bitte DAN-Versicherungspaket für Taucher ",
      errInsOr: " wählen (oder Versicherung abwählen).",
      errGopro: "Bitte GoPro-Mietdauer für Taucher ",
      errGoproOr: " wählen (oder GoPro abwählen).",
      errDupEmailA: "Jeder Taucher braucht eine eigene E-Mail. Taucher ",
      errDupEmailB: " und Taucher ",
      errDupEmailC: " nutzen dieselbe Adresse.",
      draftOk:
        "<strong>Entwurf fertig</strong> — nichts wurde an einen Server gesendet.",
      draftWarn:
        " Lange Gruppennachrichten können auf manchen Handys Längenlimits treffen — ggf. Vorschau kopieren.",
      draftUseA: ' Nutze <a href="',
      draftUseB: '">E-Mail</a> oder <a href="',
      draftUseC: '">WhatsApp</a> (beide enthalten deine Formulardaten).',
      seePage: "siehe Seite",
      otherLabel: "Sonstiges / unsicher",
      otherOpt: "Allgemeine Buchungsanfrage",
      otherH1: "Buchungsanfrage – Chang Diving",
      funAddons: "Fun-Dive-Extras",
      extraDive: "Extra-Tauchgang (+800 THB / Tauchgang)",
      nitrox: "Nitrox-Upgrade (+100 THB / Flasche)",
      sidemount: "Sidemount Extra-Flaschen",
      sidemountAir: "Extra-Flaschen Luft (+250 THB je)",
      sidemountEan: "Extra-Flaschen EAN / Nitrox (+300 THB je)",
      sidemountNo: "Nein (1 Flasche pro Tauchgang inklusive)",
    },
    th: {
      titleSuffix: " – Chang Diving (ฉบับร่าง)",
      pageTitle: "จองการผจญภัยดำน้ำของคุณ",
      viewProduct: "ดูหน้ารายละเอียด",
      diver: "นักดำน้ำ",
      name: "ชื่อ-นามสกุล (ภาษาอังกฤษ)",
      dob: "วันเกิด",
      email: "อีเมล (นักดำน้ำคนนี้)",
      emailHint:
        "แต่ละคนต้องใช้อีเมล<strong>ของตัวเอง</strong> (คอร์สและประกันอุบัติเหตุดำน้ำ)",
      cert: "ระดับใบรับรอง",
      select: "— เลือก —",
      certNone: "ยังไม่มีใบรับรอง",
      certScuba: "Scuba Diver (สูงสุด 12ม.)",
      certOw: "Open Water",
      certAdv: "Advanced",
      certRescue: "Rescue",
      certDm: "Divemaster",
      certInstr: "Instructor",
      certPhoto: "รูปบัตรใบรับรองดำน้ำ (ถ้ามี)",
      certPhotoHint: "ฉบับร่าง: ไฟล์ไม่ถูกอัปโหลด — ให้แนบในแอปอีเมล",
      dives: "จำนวนไดฟ์ทั้งหมด",
      lastDive: "วันที่ไดฟ์ล่าสุด",
      veg: "กินเจ",
      allergies: "แพ้อาหาร",
      yes: "ใช่",
      no: "ไม่",
      equipHead: "ความต้องการอุปกรณ์",
      equipHint:
        "เลือกไซส์เช่าจากรายการ (เลี่ยงการติ๊กว่าต้องการโดยไม่ระบุไซส์) ติ๊กเฉพาะรายการที่ต้องการเช่า",
      bcd: "BCD – ไซส์",
      wetsuit: "เวทสูท – ไซส์",
      selectSize: "— เลือกไซส์ —",
      bcdTip:
        "เคล็ดลับ: BCD มักใหญ่ (มีที่สำหรับดรายสูท) โดยทั่วไปเลือก<strong>เล็กกว่าหนึ่งไซส์</strong>จากไซส์เสื้อ EU",
      mask: "หน้ากาก – ต้องการเช่า",
      fins: "ตีนกบ – ต้องการเช่า",
      regulator: "เรกกูเลเตอร์ – ต้องการเช่า",
      shirt: "ไซส์เสื้อยืด (EU)",
      shoes: "ไซส์รองเท้า (EU)",
      ownEquip:
        "<strong>อุปกรณ์ส่วนตัว – ส่วนลด 5%</strong> (เฉพาะน้ำหนักและถัง!)",
      insurance:
        "<strong>ประกันอุบัติเหตุดำน้ำ DAN</strong> สำหรับนักดำน้ำคนนี้",
      insuranceHint:
        'คุ้มครองระยะสั้น (ไม่บังคับ) รายละเอียด: <a href="/th/day-trips/insurance/" target="_blank" rel="noopener">/day-trips/insurance/</a>',
      insurancePkg: "แพ็กเกจประกัน",
      selectPkg: "— เลือกแพ็กเกจ —",
      gopro: "<strong>เช่า GoPro HERO 7 Black</strong> สำหรับนักดำน้ำคนนี้",
      goproHint:
        'ไม่บังคับ รายละเอียด: <a href="/th/day-trips/rent-gopro/" target="_blank" rel="noopener">/day-trips/rent-gopro/</a> · 700 บาท / วัน',
      goproPkg: "ระยะเวลาเช่า GoPro",
      selectDays: "— เลือกจำนวนวัน —",
      needRental: "ต้องการเช่า",
      ownEquipYes: "ใช่ – ส่วนลด 5% (เฉพาะน้ำหนักและถัง)",
      fileNone: "(ไม่มี – แนบในอีเมลได้ถ้ามี)",
      fileAttach: " (แนบไฟล์นี้ในอีเมล)",
      subjectPrefix: "คำขอจอง – ",
      hello: "สวัสดีทีม Chang Diving,",
      wantBook: "ต้องการจอง:",
      package: "แพ็กเกจ",
      price: "ราคา",
      startDate: "วันที่เริ่ม / ทริปที่ต้องการ",
      numDivers: "จำนวนนักดำน้ำ",
      equipment: "อุปกรณ์",
      bcdSize: "ไซส์ BCD",
      wetsuitSize: "ไซส์เวทสูท",
      maskLbl: "หน้ากาก",
      finsLbl: "ตีนกบ",
      regLbl: "เรกกูเลเตอร์",
      ownDisc: "อุปกรณ์ส่วนตัว ส่วนลด 5%",
      danIns: "ประกันอุบัติเหตุดำน้ำ DAN",
      goproRent: "เช่า GoPro HERO 7 Black",
      pkgNotSel: "ยังไม่ได้เลือกแพ็กเกจ",
      durNotSel: "ยังไม่ได้เลือกระยะเวลา",
      sharedContact: "ข้อมูลติดต่อร่วมของการจอง",
      phone: "เบอร์โทร",
      hotel: "ชื่อที่พัก",
      emailsNote: "(อีเมลของแต่ละคนอยู่ใต้บล็อกนักดำน้ำด้านบน)",
      message: "ข้อความ",
      page: "หน้า",
      productUrl: "URL ผลิตภัณฑ์",
      thanks: "ขอบคุณ!",
      subjectLbl: "หัวข้อ",
      errSpam: "การตรวจสอบสแปมล้มเหลว",
      errDate: "กรุณาเลือกวันที่ต้องการ",
      errPhone: "กรุณากรอกเบอร์โทร",
      errName: "กรุณากรอกชื่อของนักดำน้ำคนที่ ",
      errDob: "กรุณากรอกวันเกิดของนักดำน้ำคนที่ ",
      errEmail: "กรุณากรอกอีเมลที่ถูกต้องของนักดำน้ำคนที่ ",
      errCert: "กรุณาเลือกระดับใบรับรองของนักดำน้ำคนที่ ",
      errIns: "กรุณาเลือกแพ็กเกจประกัน DAN ของนักดำน้ำคนที่ ",
      errInsOr: " (หรือยกเลิกการเลือกประกัน)",
      errGopro: "กรุณาเลือกระยะเวลาเช่า GoPro ของนักดำน้ำคนที่ ",
      errGoproOr: " (หรือยกเลิกการเลือก GoPro)",
      errDupEmailA: "แต่ละคนต้องใช้อีเมลของตัวเอง นักดำน้ำคนที่ ",
      errDupEmailB: " และคนที่ ",
      errDupEmailC: " ใช้อีเมลเดียวกัน",
      draftOk:
        "<strong>ฉบับร่างพร้อมแล้ว</strong> — ยังไม่ได้ส่งไปยังเซิร์ฟเวอร์",
      draftWarn:
        " ข้อความกลุ่มยาวอาจเกินขีดจำกัดบนบางมือถือ — ใช้ตัวอย่างเพื่อคัดลอกได้",
      draftUseA: ' ใช้ <a href="',
      draftUseB: '">อีเมล</a> หรือ <a href="',
      draftUseC: '">WhatsApp</a> (ทั้งสองมีข้อมูลฟอร์มของคุณ)',
      seePage: "ดูหน้า",
      otherLabel: "อื่นๆ / ยังไม่แน่ใจ",
      otherOpt: "สอบถามการจองทั่วไป",
      otherH1: "สอบถามการจอง – Chang Diving",
      funAddons: "ตัวเลือกเพิ่ม Fun Dive",
      extraDive: "ไดฟ์เพิ่ม (+800 บาท / ไดฟ์)",
      nitrox: "อัปเกรด Nitrox (+100 บาท / ถัง)",
      sidemount: "Sidemount ถังเพิ่ม",
      sidemountAir: "ถังเพิ่มอากาศ (+250 บาท / ถัง)",
      sidemountEan: "ถังเพิ่ม EAN / Nitrox (+300 บาท / ถัง)",
      sidemountNo: "ไม่ (รวม 1 ถังต่อไดฟ์)",
    },
  };

  var t = I18N[LANG] || I18N.en;

  function price(en, de, th) {
    if (LANG === "de") return de;
    if (LANG === "th") return th;
    return en;
  }

  function productsForLang() {
    var see = t.seePage;
    var p = {
      "open-water-diver": {
        h1:
          LANG === "de"
            ? "Open Water Diver Koh Chang – Zertifizierung in 3 Tagen - ab 14.490 THB"
            : LANG === "th"
              ? "Open Water Diver Koh Chang – รับใบรับรองใน 3 วัน - เริ่ม 14,490 บาท"
              : "Open Water Diver Koh Chang – Get certified in 3 days - from 14,490 THB",
        shortLabel: "Open Water Diver",
        type: "course-beginner",
        url: "/" + LANG + "/courses/open-water-diver/",
        options: [
          {
            id: "sdi-elearning",
            label: "SDI eLearning Students",
            price: price("14,490 THB", "14.490 THB", "14,490 บาท"),
          },
          {
            id: "padi-basic",
            label: "PADI Basic Students",
            price: price("14,990 THB", "14.990 THB", "14,990 บาท"),
          },
          {
            id: "padi-elearning",
            label: "PADI eLearning Students",
            price: price("16,490 THB", "16.490 THB", "16,490 บาท"),
          },
          {
            id: "scuba-diver",
            label:
              LANG === "de"
                ? "Option 2: Scuba Diver"
                : LANG === "th"
                  ? "ตัวเลือก 2: Scuba Diver"
                  : "Option 2: Scuba Diver",
            price: price("10,490 THB", "10.490 THB", "10,490 บาท"),
          },
          {
            id: "try-dive",
            label:
              LANG === "de"
                ? "Option 3: Try Dive"
                : LANG === "th"
                  ? "ตัวเลือก 3: Try Dive"
                  : "Option 3: Try Dive",
            price: price("4,890 THB", "4.890 THB", "4,890 บาท"),
          },
          {
            id: "owd-nitrox-sdi",
            label:
              LANG === "de"
                ? "OWD + Nitrox Kombi (SDI)"
                : LANG === "th"
                  ? "OWD + Nitrox คอมโบ (SDI)"
                  : "OWD + Nitrox Combo (SDI)",
            price: price("19,480 THB", "19.480 THB", "19,480 บาท"),
          },
          {
            id: "owd-nitrox-padi",
            label:
              LANG === "de"
                ? "OWD + Nitrox Kombi (PADI)"
                : LANG === "th"
                  ? "OWD + Nitrox คอมโบ (PADI)"
                  : "OWD + Nitrox Combo (PADI)",
            price: price("20,980 THB", "20.980 THB", "20,980 บาท"),
          },
        ],
      },
      "open-advanced-package": {
        h1:
          LANG === "de"
            ? "Open Water + Advanced Paket Koh Chang – Zertifizierung in 4 Tagen - ab 22.490 THB"
            : LANG === "th"
              ? "Open Water + Advanced แพ็กเกจ Koh Chang – รับใบรับรองใน 4 วัน - เริ่ม 22,490 บาท"
              : "OWD + Advanced Package Koh Chang",
        shortLabel:
          LANG === "de"
            ? "OWD + Advanced Paket"
            : LANG === "th"
              ? "OWD + Advanced แพ็กเกจ"
              : "OWD + Advanced Package",
        type: "course",
        url: "/" + LANG + "/courses/open-advanced-package/",
        options: [
          {
            id: "sdi",
            label: "SDI OWD + AOWD",
            price: price("22,490 THB", "22.490 THB", "22,490 บาท"),
          },
          {
            id: "padi",
            label: "PADI OWD + AOWD",
            price: price("23,490 THB", "23.490 THB", "23,490 บาท"),
          },
        ],
      },
      advanced: {
        h1:
          LANG === "de"
            ? "Advanced Open Water Koh Chang – Zertifizierung in 2 Tagen - ab 13.490 THB"
            : LANG === "th"
              ? "Advanced Open Water Koh Chang – รับใบรับรองใน 2 วัน - เริ่ม 13,490 บาท"
              : "Advanced Diver Koh Chang",
        shortLabel: "Advanced Diver",
        type: "course",
        url: "/" + LANG + "/courses/advanced/",
        options: [{ id: "aowd", label: "Advanced Diver", price: see }],
      },
      "deep-wreck-nitrox": {
        h1:
          LANG === "de"
            ? "Tief-, Wrack- & Nitrox-Spezialkurse Koh Chang – 2-Tage-Paket ab 19.490 THB"
            : LANG === "th"
              ? "แพ็กเกจสเปเชียลตี้ Deep, Wreck & Nitrox เกาะช้าง – 2 วัน เริ่ม 19,490 บาท"
              : "Deep, Wreck & Nitrox Specialties Koh Chang – 2-day package from 19,490 THB",
        shortLabel:
          LANG === "de" ? "Tief, Wrack & Nitrox" : "Deep, Wreck & Nitrox",
        type: "course",
        url: "/" + LANG + "/courses/deep-wreck-nitrox/",
        options: [
          {
            id: "sdi",
            label:
              LANG === "de"
                ? "SDI-Paket (2 Tage, 5 Tauchgänge)"
                : LANG === "th"
                  ? "แพ็กเกจ SDI (2 วัน, 5 ไดฟ์)"
                  : "SDI Package (2 days, 5 dives)",
            price: price("19,490 THB", "19.490 THB", "19,490 บาท"),
          },
          {
            id: "padi",
            label:
              LANG === "de"
                ? "PADI-Paket (4 Tage, 8 Tauchgänge)"
                : LANG === "th"
                  ? "แพ็กเกจ PADI (4 วัน, 8 ไดฟ์)"
                  : "PADI Package (4 days, 8 dives)",
            price: price("27,490 THB", "27.490 THB", "27,490 บาท"),
          },
        ],
      },
      "advanced-nitrox": {
        h1:
          LANG === "de"
            ? "TDI Advanced Nitrox Kurs – Maximieren Sie Ihre Tauchzeit"
            : LANG === "th"
              ? "TDI Advanced Nitrox Course – เพิ่มเวลาดำน้ำ"
              : "TDI Advanced Nitrox Koh Chang",
        shortLabel: "TDI Advanced Nitrox",
        type: "tech",
        url: "/" + LANG + "/courses/advanced-nitrox/",
        options: [
          {
            id: "single",
            label: "TDI Advanced Nitrox (EAN 21–100% O₂)",
            price: price("14,990 THB", "14.990 THB", "14,990 บาท"),
          },
          {
            id: "package",
            label: "Deco Procedures + Advanced Nitrox",
            price: price("33,990 THB", "33.990 THB", "33,990 บาท"),
          },
        ],
      },
      "deco-procedures": {
        h1:
          LANG === "de"
            ? "TDI Decompression Procedures Diver – Grenzen erweitern"
            : LANG === "th"
              ? "TDI Decompression Procedures Diver – ขยายขีดจำกัด"
              : "TDI Decompression Procedures Koh Chang",
        shortLabel: "TDI Decompression Procedures",
        type: "tech",
        url: "/" + LANG + "/courses/deco-procedures/",
        options: [
          { id: "single", label: "Decompression Procedures", price: see },
          {
            id: "package",
            label: "Deco Procedures + Advanced Nitrox",
            price: price("33,990 THB", "33.990 THB", "33,990 บาท"),
          },
        ],
      },
      "fun-dives": {
        h1:
          LANG === "de"
            ? "Fun Dives Koh Chang – Geführte Bootstauchgänge ab 3.290 THB"
            : LANG === "th"
              ? "ฟันไดฟ์เกาะช้าง – ดำน้ำจากเรือ เริ่มต้น 3,290 บาท"
              : "Fun Dives Koh Chang – Guided Boat Dives from 3,290 THB",
        shortLabel: LANG === "th" ? "ฟันไดฟ์" : "Fun Dives",
        type: "daytrip",
        url: "/" + LANG + "/day-trips/fun-dives/",
        options: [
          {
            id: "2-dives",
            label:
              LANG === "de"
                ? "2 Tauchgänge"
                : LANG === "th"
                  ? "2 ไดฟ์"
                  : "2 Dives",
            price: price("3,290 THB", "3.290 THB", "3,290 บาท"),
          },
          {
            id: "4-dives",
            label:
              LANG === "de"
                ? "4 Tauchgänge"
                : LANG === "th"
                  ? "4 ไดฟ์"
                  : "4 Dives",
            price: price("5,990 THB", "5.990 THB", "5,990 บาท"),
          },
          {
            id: "6-dives",
            label:
              LANG === "de"
                ? "6 Tauchgänge"
                : LANG === "th"
                  ? "6 ไดฟ์"
                  : "6 Dives",
            price: price("8,090 THB", "8.090 THB", "8,090 บาท"),
          },
          {
            id: "8-dives",
            label:
              LANG === "de"
                ? "8 Tauchgänge"
                : LANG === "th"
                  ? "8 ไดฟ์"
                  : "8 Dives",
            price: price("9,590 THB", "9.590 THB", "9,590 บาท"),
          },
          {
            id: "10-dives",
            label:
              LANG === "de"
                ? "10 Tauchgänge"
                : LANG === "th"
                  ? "10 ไดฟ์"
                  : "10 Dives",
            price: price("10,490 THB", "10.490 THB", "10,490 บาท"),
          },
        ],
      },
      "try-dive": {
        h1:
          LANG === "de"
            ? "Try Dive Koh Chang – 2 Riff-Tauchgänge, keine Zertifizierung - ab 4.890 THB"
            : LANG === "th"
              ? "Try Dive Koh Chang – 2 ไดฟ์แนวปะการัง ไม่ต้องมีใบรับรอง - เริ่ม 4,890 บาท"
              : "Try Dive Koh Chang",
        shortLabel: "Try Dive",
        type: "daytrip",
        url: "/" + LANG + "/day-trips/try-dive/",
        options: [
          {
            id: "try",
            label: "Try Dive",
            price: price("4,890 THB", "4.890 THB", "4,890 บาท"),
          },
        ],
      },
      snorkeling: {
        h1:
          LANG === "de"
            ? "Schnorcheln auf Koh Chang – Entdecke die Unterwasserwelt mit unserem Tauchboot"
            : LANG === "th"
              ? "ดำน้ำตื้นที่เกาะช้าง – สำรวจโลกใต้น้ำกับเรือดำน้ำของเรา"
              : "Snorkeling Koh Chang",
        shortLabel:
          LANG === "de"
            ? "Schnorcheln"
            : LANG === "th"
              ? "ดำน้ำตื้น"
              : "Snorkeling",
        type: "daytrip",
        url: "/" + LANG + "/day-trips/snorkeling/",
        options: [
          {
            id: "snorkel",
            label:
              LANG === "de"
                ? "Schnorchel-Tour"
                : LANG === "th"
                  ? "ทริปดำน้ำตื้น"
                  : "Snorkeling trip",
            price: see,
          },
        ],
      },
      other: {
        h1: t.otherH1,
        shortLabel: t.otherLabel,
        type: "other",
        url: "/" + LANG + "/contact/",
        options: [{ id: "other", label: t.otherOpt, price: "" }],
      },
    };
    return p;
  }

  var PRODUCTS = productsForLang();

  function $(id) {
    return document.getElementById(id);
  }

  function qs(name) {
    try {
      return new URLSearchParams(window.location.search).get(name) || "";
    } catch (e) {
      return "";
    }
  }

  var SIZES_BCD = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  var SIZES_WETSUIT = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  var SIZES_SHIRT = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  var SIZES_SHOE = [];
  for (var shoe = 34; shoe <= 46; shoe++) SIZES_SHOE.push(String(shoe));

  function selectOptions(sizes, placeholder) {
    var html = '<option value="">' + placeholder + "</option>";
    for (var i = 0; i < sizes.length; i++) {
      html += '<option value="' + sizes[i] + '">' + sizes[i] + "</option>";
    }
    return html;
  }

  function fieldVal(root, name) {
    var el = root.querySelector('[name="' + name + '"]');
    if (!el) return "";
    if (el.type === "checkbox") return el.checked ? "Yes" : "No";
    if (el.type === "file") {
      if (!el.files || !el.files.length) return t.fileNone;
      var names = [];
      for (var i = 0; i < el.files.length; i++) names.push(el.files[i].name);
      return names.join(", ") + t.fileAttach;
    }
    return String(el.value || "").trim();
  }

  function setField(root, name, value) {
    var el = root.querySelector('[name="' + name + '"]');
    if (!el || value == null || value === "") return;
    if (el.type === "checkbox") {
      el.checked = value === "Yes" || value === true;
      return;
    }
    if (el.type === "file") return;
    el.value = value;
  }

  function fillProductSelect() {
    var sel = $("book-product");
    if (!sel) return;
    sel.innerHTML = "";
    Object.keys(PRODUCTS).forEach(function (key) {
      var opt = document.createElement("option");
      opt.value = key;
      opt.textContent = PRODUCTS[key].shortLabel;
      sel.appendChild(opt);
    });
  }

  function fillOptions(productKey, preferred) {
    var sel = $("book-option");
    var product = PRODUCTS[productKey] || PRODUCTS.other;
    if (!sel) return;
    sel.innerHTML = "";
    product.options.forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.id;
      opt.textContent = o.price ? o.label + " – " + o.price : o.label;
      sel.appendChild(opt);
    });
    if (preferred) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === preferred) {
          sel.selectedIndex = i;
          break;
        }
      }
    }
    updateHeadingAndSummary();
  }

  function currentProduct() {
    var key = ($("book-product") && $("book-product").value) || "other";
    return { key: key, product: PRODUCTS[key] || PRODUCTS.other };
  }

  function currentOption() {
    var info = currentProduct();
    var oid = ($("book-option") && $("book-option").value) || "";
    var list = info.product.options || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === oid) return list[i];
    }
    return list[0] || { id: "", label: "", price: "" };
  }

  function syncFunAddons() {
    var wrap = $("book-fun-addons");
    if (!wrap) return;
    var isFun = currentProduct().key === "fun-dives";
    wrap.hidden = !isFun;
    if (!isFun) {
      if ($("book-extra-dive")) $("book-extra-dive").value = "No";
      if ($("book-nitrox")) $("book-nitrox").value = "No";
      if ($("book-sidemount")) $("book-sidemount").value = "No";
    }
  }

  function funAddonSummaryParts() {
    if (currentProduct().key !== "fun-dives") return [];
    var parts = [];
    var extra = ($("book-extra-dive") && $("book-extra-dive").value) || "No";
    var nitrox = ($("book-nitrox") && $("book-nitrox").value) || "No";
    var side = ($("book-sidemount") && $("book-sidemount").value) || "No";
    if (extra === "Yes") parts.push("+ Extra dive");
    if (nitrox === "Yes") parts.push("+ Nitrox");
    if (side === "Air") parts.push("+ Sidemount air");
    if (side === "EAN") parts.push("+ Sidemount EAN");
    return parts;
  }

  function updateHeadingAndSummary() {
    var info = currentProduct();
    var opt = currentOption();
    var productTitle = $("book-product-title");
    if (productTitle) productTitle.textContent = info.product.h1;
    document.title = t.pageTitle + t.titleSuffix;

    syncFunAddons();

    var summary = $("book-summary");
    if (summary) {
      var parts = [info.product.shortLabel];
      if (opt.label) parts.push(opt.label);
      if (opt.price) parts.push(opt.price);
      parts = parts.concat(funAddonSummaryParts());
      summary.textContent = parts.join(" · ");
    }
    var link = $("book-product-link");
    if (link) {
      link.href = info.product.url;
      link.textContent = t.viewProduct;
      link.hidden = !info.product.url;
    }
  }

  function personTemplate(index) {
    var n = index + 1;
    var id = "p" + n;
    return (
      '<fieldset class="cdc-book__person" data-person="' +
      n +
      '">' +
      "<legend>" +
      t.diver +
      " " +
      n +
      "</legend>" +
      '<div class="cdc-book__grid cdc-book__grid--2">' +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-name">' +
      t.name +
      "</label>" +
      '<input id="' +
      id +
      '-name" name="name" type="text" autocomplete="name" required /></div>' +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-dob">' +
      t.dob +
      "</label>" +
      '<input id="' +
      id +
      '-dob" name="dob" type="date" required /></div>' +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-email">' +
      t.email +
      "</label>" +
      '<input id="' +
      id +
      '-email" name="email" type="email" autocomplete="email" required />' +
      '<p class="cdc-book__hint">' +
      t.emailHint +
      "</p></div>" +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-cert">' +
      t.cert +
      "</label>" +
      '<select id="' +
      id +
      '-cert" name="cert" required>' +
      '<option value="">' +
      t.select +
      "</option>" +
      '<option value="Non-certified">' +
      t.certNone +
      "</option>" +
      '<option value="Scuba Diver (max. 12m)">' +
      t.certScuba +
      "</option>" +
      '<option value="Open Water">' +
      t.certOw +
      "</option>" +
      '<option value="Advanced">' +
      t.certAdv +
      "</option>" +
      '<option value="Rescue">' +
      t.certRescue +
      "</option>" +
      '<option value="Divemaster">' +
      t.certDm +
      "</option>" +
      '<option value="Instructor">' +
      t.certInstr +
      "</option>" +
      "</select></div>" +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-cert-photo">' +
      t.certPhoto +
      "</label>" +
      '<input id="' +
      id +
      '-cert-photo" name="certPhoto" type="file" accept="image/*,.pdf" />' +
      '<p class="cdc-book__hint">' +
      t.certPhotoHint +
      "</p></div>" +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-dives">' +
      t.dives +
      "</label>" +
      '<select id="' +
      id +
      '-dives" name="dives">' +
      '<option value="">' +
      t.select +
      "</option>" +
      '<option value="0">0</option>' +
      '<option value="2">2</option>' +
      '<option value="4">4</option>' +
      '<option value="5+">5+</option>' +
      '<option value="10+">10+</option>' +
      '<option value="20+">20+</option>' +
      '<option value="50+">50+</option>' +
      '<option value="100+">100+</option>' +
      "</select></div>" +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-last">' +
      t.lastDive +
      "</label>" +
      '<input id="' +
      id +
      '-last" name="lastDive" type="date" /></div>' +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-veg">' +
      t.veg +
      "</label>" +
      '<select id="' +
      id +
      '-veg" name="vegetarian"><option value="">—</option><option value="No">' +
      t.no +
      '</option><option value="Yes">' +
      t.yes +
      "</option></select></div>" +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-allergies">' +
      t.allergies +
      "</label>" +
      '<input id="' +
      id +
      '-allergies" name="allergies" type="text" /></div>' +
      "</div>" +
      '<h3 class="cdc-book__subhead">' +
      t.equipHead +
      "</h3>" +
      '<p class="cdc-book__hint">' +
      t.equipHint +
      "</p>" +
      '<div class="cdc-book__grid cdc-book__grid--2">' +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-bcd">' +
      t.bcd +
      "</label>" +
      '<select id="' +
      id +
      '-bcd" name="bcd">' +
      selectOptions(SIZES_BCD, t.selectSize) +
      "</select>" +
      '<p class="cdc-book__hint">' +
      t.bcdTip +
      "</p></div>" +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-wetsuit">' +
      t.wetsuit +
      "</label>" +
      '<select id="' +
      id +
      '-wetsuit" name="wetsuit">' +
      selectOptions(SIZES_WETSUIT, t.selectSize) +
      "</select></div>" +
      '<div class="cdc-book__field cdc-book__checkfield"><label class="cdc-book__check">' +
      '<input id="' +
      id +
      '-mask" name="mask" type="checkbox" value="Need" />' +
      "<span>" +
      t.mask +
      "</span></label></div>" +
      '<div class="cdc-book__field cdc-book__checkfield"><label class="cdc-book__check">' +
      '<input id="' +
      id +
      '-fins" name="fins" type="checkbox" value="Need" />' +
      "<span>" +
      t.fins +
      "</span></label></div>" +
      '<div class="cdc-book__field cdc-book__checkfield"><label class="cdc-book__check">' +
      '<input id="' +
      id +
      '-reg" name="regulator" type="checkbox" value="Need" />' +
      "<span>" +
      t.regulator +
      "</span></label></div>" +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-shirt">' +
      t.shirt +
      "</label>" +
      '<select id="' +
      id +
      '-shirt" name="shirt">' +
      selectOptions(SIZES_SHIRT, t.selectSize) +
      "</select></div>" +
      '<div class="cdc-book__field"><label for="' +
      id +
      '-shoes">' +
      t.shoes +
      "</label>" +
      '<select id="' +
      id +
      '-shoes" name="shoes">' +
      selectOptions(SIZES_SHOE, t.selectSize) +
      "</select></div>" +
      '<div class="cdc-book__field cdc-book__checkfield" style="grid-column:1/-1"><label class="cdc-book__check">' +
      '<input id="' +
      id +
      '-own" name="ownEquipment" type="checkbox" value="Yes" />' +
      "<span>" +
      t.ownEquip +
      "</span></label></div>" +
      '<div class="cdc-book__field cdc-book__checkfield" style="grid-column:1/-1"><label class="cdc-book__check">' +
      '<input id="' +
      id +
      '-ins" name="insurance" type="checkbox" value="Yes" data-insurance-toggle />' +
      "<span>" +
      t.insurance +
      "</span></label>" +
      '<p class="cdc-book__hint" style="margin:0.35rem 0 0 1.5rem">' +
      t.insuranceHint +
      "</p></div>" +
      '<div class="cdc-book__field" style="grid-column:1/-1" data-insurance-package hidden>' +
      '<label for="' +
      id +
      '-ins-pkg">' +
      t.insurancePkg +
      "</label>" +
      '<select id="' +
      id +
      '-ins-pkg" name="insurancePackage">' +
      '<option value="">' +
      t.selectPkg +
      "</option>" +
      '<option value="1 Day Coverage – 20 USD">1 Day Coverage – 20 USD</option>' +
      '<option value="2 Days Coverage – 30 USD">2 Days Coverage – 30 USD</option>' +
      '<option value="5 Days Coverage – 40 USD">5 Days Coverage – 40 USD</option>' +
      '<option value="10 Days Coverage – 50 USD">10 Days Coverage – 50 USD</option>' +
      '<option value="30 Days Coverage – 60 USD">30 Days Coverage – 60 USD</option>' +
      "</select></div>" +
      '<div class="cdc-book__field cdc-book__checkfield" style="grid-column:1/-1"><label class="cdc-book__check">' +
      '<input id="' +
      id +
      '-gopro" name="gopro" type="checkbox" value="Yes" data-gopro-toggle />' +
      "<span>" +
      t.gopro +
      "</span></label>" +
      '<p class="cdc-book__hint" style="margin:0.35rem 0 0 1.5rem">' +
      t.goproHint +
      "</p></div>" +
      '<div class="cdc-book__field" style="grid-column:1/-1" data-gopro-package hidden>' +
      '<label for="' +
      id +
      '-gopro-pkg">' +
      t.goproPkg +
      "</label>" +
      '<select id="' +
      id +
      '-gopro-pkg" name="goproPackage">' +
      '<option value="">' +
      t.selectDays +
      "</option>" +
      '<option value="1 Day – 700 THB">1 Day – 700 THB</option>' +
      '<option value="2 Days – 1,400 THB">2 Days – 1,400 THB</option>' +
      '<option value="3 Days – 2,100 THB">3 Days – 2,100 THB</option>' +
      '<option value="4 Days – 2,800 THB">4 Days – 2,800 THB</option>' +
      '<option value="5 Days – 3,500 THB">5 Days – 3,500 THB</option>' +
      "</select></div>" +
      "</div>" +
      "</fieldset>"
    );
  }

  function renderPeople() {
    var countSel = $("book-people-count");
    var host = $("book-people");
    if (!countSel || !host) return;
    var count = parseInt(countSel.value, 10) || 1;
    if (count < 1) count = 1;
    if (count > MAX_PEOPLE) count = MAX_PEOPLE;

    var prev = {};
    host.querySelectorAll(".cdc-book__person").forEach(function (fs, i) {
      prev[i] = {
        name: fieldVal(fs, "name"),
        dob: fieldVal(fs, "dob"),
        email: fieldVal(fs, "email"),
        cert: fieldVal(fs, "cert"),
        dives: fieldVal(fs, "dives"),
        lastDive: fieldVal(fs, "lastDive"),
        vegetarian: fieldVal(fs, "vegetarian"),
        allergies: fieldVal(fs, "allergies"),
        insurance: fieldVal(fs, "insurance"),
        insurancePackage: fieldVal(fs, "insurancePackage"),
        gopro: fieldVal(fs, "gopro"),
        goproPackage: fieldVal(fs, "goproPackage"),
        bcd: fieldVal(fs, "bcd"),
        wetsuit: fieldVal(fs, "wetsuit"),
        mask: fieldVal(fs, "mask"),
        fins: fieldVal(fs, "fins"),
        regulator: fieldVal(fs, "regulator"),
        shirt: fieldVal(fs, "shirt"),
        shoes: fieldVal(fs, "shoes"),
        ownEquipment: fieldVal(fs, "ownEquipment"),
      };
    });

    var html = "";
    for (var i = 0; i < count; i++) html += personTemplate(i);
    host.innerHTML = html;

    host.querySelectorAll(".cdc-book__person").forEach(function (fs, i) {
      var data = prev[i];
      if (data) {
        Object.keys(data).forEach(function (key) {
          setField(fs, key, data[key]);
        });
      }
      bindInsuranceToggle(fs);
      syncInsurancePackage(fs);
      bindGoproToggle(fs);
      syncGoproPackage(fs);
    });

    var groupNote = $("book-group-note");
    if (groupNote) {
      groupNote.hidden = count < 2;
    }
  }

  function syncAddonPackage(fs, toggleSel, wrapSel, selectName) {
    var toggle = fs.querySelector(toggleSel);
    var wrap = fs.querySelector(wrapSel);
    var sel = fs.querySelector('[name="' + selectName + '"]');
    if (!toggle || !wrap) return;
    var on = !!toggle.checked;
    wrap.hidden = !on;
    if (sel) sel.required = on;
    if (!on && sel) sel.value = "";
  }

  function syncInsurancePackage(fs) {
    syncAddonPackage(
      fs,
      "[data-insurance-toggle]",
      "[data-insurance-package]",
      "insurancePackage"
    );
  }

  function syncGoproPackage(fs) {
    syncAddonPackage(
      fs,
      "[data-gopro-toggle]",
      "[data-gopro-package]",
      "goproPackage"
    );
  }

  function bindInsuranceToggle(fs) {
    var toggle = fs.querySelector("[data-insurance-toggle]");
    if (!toggle || toggle._cdcBound) return;
    toggle._cdcBound = true;
    toggle.addEventListener("change", function () {
      syncInsurancePackage(fs);
    });
  }

  function bindGoproToggle(fs) {
    var toggle = fs.querySelector("[data-gopro-toggle]");
    if (!toggle || toggle._cdcBound) return;
    toggle._cdcBound = true;
    toggle.addEventListener("change", function () {
      syncGoproPackage(fs);
    });
  }

  function collectPeople() {
    var people = [];
    document
      .querySelectorAll("#book-people .cdc-book__person")
      .forEach(function (fs) {
        people.push({
          name: fieldVal(fs, "name"),
          dob: fieldVal(fs, "dob"),
          email: fieldVal(fs, "email"),
          cert: fieldVal(fs, "cert"),
          certPhoto: fieldVal(fs, "certPhoto"),
          dives: fieldVal(fs, "dives"),
          lastDive: fieldVal(fs, "lastDive"),
          vegetarian: (function () {
            var v = fieldVal(fs, "vegetarian");
            if (v === "Yes") return t.yes;
            if (v === "No") return t.no;
            return v;
          })(),
          allergies: fieldVal(fs, "allergies"),
          insurance: fieldVal(fs, "insurance") === "Yes" ? "Yes" : "No",
          insurancePackage: fieldVal(fs, "insurancePackage"),
          gopro: fieldVal(fs, "gopro") === "Yes" ? "Yes" : "No",
          goproPackage: fieldVal(fs, "goproPackage"),
          bcd: fieldVal(fs, "bcd"),
          wetsuit: fieldVal(fs, "wetsuit"),
          mask: fieldVal(fs, "mask") === "Yes" ? t.needRental : t.no,
          fins: fieldVal(fs, "fins") === "Yes" ? t.needRental : t.no,
          regulator: fieldVal(fs, "regulator") === "Yes" ? t.needRental : t.no,
          shirt: fieldVal(fs, "shirt"),
          shoes: fieldVal(fs, "shoes"),
          ownEquipment:
            fieldVal(fs, "ownEquipment") === "Yes" ? t.ownEquipYes : t.no,
        });
      });
    return people;
  }

  function collectFunAddons() {
    if (currentProduct().key !== "fun-dives") {
      return { extraDive: "No", nitrox: "No", sidemount: "No" };
    }
    return {
      extraDive: ($("book-extra-dive") && $("book-extra-dive").value) || "No",
      nitrox: ($("book-nitrox") && $("book-nitrox").value) || "No",
      sidemount: ($("book-sidemount") && $("book-sidemount").value) || "No",
    };
  }

  function formatSidemount(val) {
    if (val === "Air") return t.yes + " – " + t.sidemountAir;
    if (val === "EAN") return t.yes + " – " + t.sidemountEan;
    return t.sidemountNo;
  }

  function collectPayload() {
    var info = currentProduct();
    var opt = currentOption();
    var people = collectPeople();
    var addons = collectFunAddons();
    return {
      draft: DRAFT_MODE,
      lang: LANG,
      productKey: info.key,
      h1: info.product.h1,
      productLabel: info.product.shortLabel,
      productUrl: info.product.url,
      optionId: opt.id,
      optionLabel: opt.label,
      optionPrice: opt.price || "",
      startDate: ($("book-date") && $("book-date").value) || "",
      peopleCount: people.length,
      people: people,
      funAddons: addons,
      phone: ($("book-phone") && $("book-phone").value.trim()) || "",
      hotel: ($("book-hotel") && $("book-hotel").value.trim()) || "",
      message: ($("book-message") && $("book-message").value.trim()) || "",
      website: ($("book-website") && $("book-website").value.trim()) || "",
    };
  }

  function buildEmail(payload) {
    var subject =
      t.subjectPrefix +
      payload.productLabel +
      (payload.optionLabel ? " (" + payload.optionLabel + ")" : "") +
      (payload.peopleCount > 1 ? " × " + payload.peopleCount : "");

    var lines = [
      t.hello,
      "",
      t.wantBook,
      "• " + payload.h1,
      "• " + t.package + ": " + payload.optionLabel,
      payload.optionPrice ? "• " + t.price + ": " + payload.optionPrice : "",
      payload.startDate ? "• " + t.startDate + ": " + payload.startDate : "",
      "• " + t.numDivers + ": " + payload.peopleCount,
      "",
    ];

    if (payload.productKey === "fun-dives" && payload.funAddons) {
      var a = payload.funAddons;
      lines.push(t.funAddons + ":");
      lines.push(
        "• " + t.extraDive + ": " + (a.extraDive === "Yes" ? t.yes : t.no)
      );
      lines.push("• " + t.nitrox + ": " + (a.nitrox === "Yes" ? t.yes : t.no));
      lines.push("• " + t.sidemount + ": " + formatSidemount(a.sidemount));
      lines.push("");
    }

    payload.people.forEach(function (p, i) {
      lines.push("—— " + t.diver + " " + (i + 1) + " ——");
      lines.push("• " + t.name + ": " + p.name);
      lines.push("• " + t.dob + ": " + p.dob);
      lines.push("• " + t.email.replace(/ \(.*\)$/, "") + ": " + p.email);
      lines.push("• " + t.cert + ": " + p.cert);
      lines.push("• " + t.certPhoto + ": " + p.certPhoto);
      lines.push("• " + t.dives + ": " + p.dives);
      lines.push("• " + t.lastDive + ": " + p.lastDive);
      lines.push("• " + t.veg + ": " + p.vegetarian);
      lines.push("• " + t.allergies + ": " + p.allergies);
      lines.push(t.equipment + ":");
      lines.push("• " + t.bcdSize + ": " + (p.bcd || "—"));
      lines.push("• " + t.wetsuitSize + ": " + (p.wetsuit || "—"));
      lines.push("• " + t.maskLbl + ": " + p.mask);
      lines.push("• " + t.finsLbl + ": " + p.fins);
      lines.push("• " + t.regLbl + ": " + p.regulator);
      lines.push("• " + t.shirt + ": " + (p.shirt || "—"));
      lines.push("• " + t.shoes + ": " + (p.shoes || "—"));
      lines.push("• " + t.ownDisc + ": " + p.ownEquipment);
      lines.push(
        "• " +
          t.danIns +
          ": " +
          (p.insurance === "Yes"
            ? t.yes + " – " + (p.insurancePackage || t.pkgNotSel)
            : t.no)
      );
      lines.push(
        "• " +
          t.goproRent +
          ": " +
          (p.gopro === "Yes"
            ? t.yes + " – " + (p.goproPackage || t.durNotSel)
            : t.no)
      );
      lines.push("");
    });

    lines.push(t.sharedContact + ":");
    lines.push("• " + t.phone + ": " + payload.phone);
    lines.push("• " + t.hotel + ": " + payload.hotel);
    lines.push(t.emailsNote);
    lines.push("");
    if (payload.message) {
      lines.push(t.message + ":");
      lines.push(payload.message);
      lines.push("");
    }
    lines.push(
      t.page +
        ": " +
        (typeof location !== "undefined"
          ? location.href
          : "/" + LANG + "/book/")
    );
    lines.push(t.productUrl + ": https://changdiving.com" + payload.productUrl);
    lines.push("");
    lines.push(t.thanks);

    return {
      subject: subject,
      body: lines
        .filter(function (l) {
          return l !== undefined && l !== null;
        })
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
    };
  }

  function mailtoHref(subject, body) {
    return (
      "mailto:" +
      TO_EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  function whatsappHref(subject, body) {
    var text = "*" + subject + "*\n\n" + body;
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }

  function applyOutboundLinks(mail) {
    var mailto = mailtoHref(mail.subject, mail.body);
    var wa = whatsappHref(mail.subject, mail.body);
    var mailLink = $("book-mailto");
    var waLink = $("book-whatsapp");
    if (mailLink) mailLink.href = mailto;
    if (waLink) waLink.href = wa;
    return { mailto: mailto, wa: wa };
  }

  function prepareOutbound() {
    var payload = collectPayload();
    var err = validate(payload);
    if (err) return { ok: false, err: err };
    var mail = buildEmail(payload);
    var links = applyOutboundLinks(mail);
    var preview = $("book-preview");
    if (preview) {
      preview.hidden = false;
      preview.textContent =
        t.subjectLbl + ": " + mail.subject + "\n\n" + mail.body;
    }
    return { ok: true, mail: mail, links: links, payload: payload };
  }

  function showStatus(kind, html) {
    var box = $("book-status");
    if (!box) return;
    box.hidden = false;
    box.className = "cdc-book__status cdc-book__status--" + kind;
    box.innerHTML = html;
  }

  function validate(payload) {
    if (payload.website) return t.errSpam;
    if (!payload.startDate) return t.errDate;
    if (!payload.phone) return t.errPhone;
    var emails = {};
    for (var i = 0; i < payload.people.length; i++) {
      var p = payload.people[i];
      var n = i + 1;
      if (!p.name || p.name.length < 2) return t.errName + n + ".";
      if (!p.dob) return t.errDob + n + ".";
      if (!p.email || p.email.indexOf("@") < 1) return t.errEmail + n + ".";
      if (!p.cert) return t.errCert + n + ".";
      if (p.insurance === "Yes" && !p.insurancePackage) {
        return t.errIns + n + t.errInsOr;
      }
      if (p.gopro === "Yes" && !p.goproPackage) {
        return t.errGopro + n + t.errGoproOr;
      }
      var key = p.email.toLowerCase();
      if (emails[key]) {
        return (
          t.errDupEmailA + emails[key] + t.errDupEmailB + n + t.errDupEmailC
        );
      }
      emails[key] = n;
    }
    return "";
  }

  function onSubmit(e) {
    e.preventDefault();
    var result = prepareOutbound();
    if (!result.ok) {
      showStatus("error", result.err);
      return;
    }

    var warn = result.payload.peopleCount > 1 ? t.draftWarn : "";

    showStatus(
      "ok",
      t.draftOk +
        warn +
        t.draftUseA +
        result.links.mailto +
        t.draftUseB +
        result.links.wa +
        t.draftUseC
    );
  }

  function onWhatsAppClick(e) {
    var result = prepareOutbound();
    if (!result.ok) {
      e.preventDefault();
      showStatus("error", result.err);
      return;
    }
    e.currentTarget.href = result.links.wa;
  }

  function onMailtoClick(e) {
    var result = prepareOutbound();
    if (!result.ok) {
      e.preventDefault();
      showStatus("error", result.err);
      return;
    }
    e.currentTarget.href = result.links.mailto;
  }

  function init() {
    var form = $("cdc-book-form");
    if (!form) return;

    fillProductSelect();
    var product = qs("product") || "open-water-diver";
    if (!PRODUCTS[product]) product = "other";
    if ($("book-product")) $("book-product").value = product;
    fillOptions(product, qs("option") || "");

    var peopleQ = parseInt(qs("people"), 10);
    if ($("book-people-count")) {
      if (peopleQ >= 1 && peopleQ <= MAX_PEOPLE) {
        $("book-people-count").value = String(peopleQ);
      }
      $("book-people-count").addEventListener("change", renderPeople);
    }

    $("book-product").addEventListener("change", function () {
      fillOptions($("book-product").value, "");
    });
    $("book-option").addEventListener("change", updateHeadingAndSummary);
    ["book-extra-dive", "book-nitrox", "book-sidemount"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("change", updateHeadingAndSummary);
    });
    form.addEventListener("submit", onSubmit);

    var mailLink = $("book-mailto");
    var waLink = $("book-whatsapp");
    if (mailLink) mailLink.addEventListener("click", onMailtoClick);
    if (waLink) waLink.addEventListener("click", onWhatsAppClick);

    renderPeople();
    updateHeadingAndSummary();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
