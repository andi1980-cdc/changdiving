/**
 * Gas consumption page calculators (SAC, PO₂, MOD, best mix, deco slate, unit converters).
 * Shared math: dive-calc-core.js (CDC).
 */
(function () {
  "use strict";
  var C = window.CDC;
  if (!C) {
    console.error("[gas-consumption] dive-calc-core.js missing");
    return;
  }

  var LANG = C.pageLang();
  var DEC = LANG === "de"; // German decimal comma in displays

  function id(base) {
    return C.langId(base, LANG);
  }

  function fmt(n, d) {
    var s = Number(n).toFixed(d);
    return DEC ? s.replace(".", ",") : s;
  }

  var I18N = {
    en: {
      tankUnitM: "liters",
      depthUnitM: "meters",
      depthUnitI: "feet",
      depthLabelM: "meters",
      depthLabelI: "feet",
      modUnitM: "meters",
      modUnitI: "feet",
      depthShortM: "m",
      ph: {
        bar: "e.g., 100",
        psi: "e.g., 1450",
        depthM: "e.g., 30",
        depthI: "e.g., 100",
        tankM: "e.g., 12",
        tankI: "e.g., 80",
        po2M: "e.g., 40",
        po2I: "e.g., 130",
        bestM: "e.g., 30",
        bestI: "e.g., 100",
        slateM: "30",
        slateI: "100",
      },
      sacTitle: "SAC Rate",
      sacGas: function (L, ata) {
        return "Gas consumed: " + L + " L at " + ata + " ATA";
      },
      sacImperialNote: "(psi, ft, cu ft converted to bar, m, L)",
      sacHigh: "⚠️ High SAC - consider improving breathing efficiency",
      sacExcellent: "🌟 Excellent SAC rate!",
      sacPrompt: function (pu, du, tu) {
        return (
          "Enter gas used (" +
          pu +
          "), depth (" +
          du +
          "), time, and tank (" +
          tu +
          ")"
        );
      },
      po2At: function (d, ata) {
        return "at " + d + " (" + ata + " ATA)";
      },
      po2Unit: "bar",
      po2DangerHigh: "⚠️ DANGER: PO₂ too high! Risk of oxygen toxicity",
      po2Caution: "⚠️ Caution: Above recreational limit (1.4 bar)",
      po2DangerLow: "⚠️ DANGER: PO₂ too low! Hypoxia risk",
      po2Safe: "✓ Safe PO₂ level",
      po2Prompt: "Enter values to calculate PO₂",
      modDetail: function (o2, ppo2) {
        return "Max safe depth for " + o2 + "% O₂ at " + ppo2 + " bar PPO₂";
      },
      modShallow: "💡 Shallow dive - great for beginners",
      modDeep: "💡 Deep dive - advanced certification required",
      modStd: "💡 Standard recreational depth range",
      modPrompt: "Enter values to calculate MOD",
      bestTitle: "Best Mix",
      airMix: "Air (21%)",
      bestDetail: function (o2, d, ppo2) {
        return "Optimal O₂: " + o2 + "% for " + d + " at " + ppo2 + " bar PPO₂";
      },
      bestAdv: "💡 Requires advanced Nitrox certification (>40% O₂)",
      bestAir: "💡 Regular air is sufficient for this depth",
      bestStd: "✓ Standard recreational Nitrox mix",
      bestPrompt: "Enter depth to find best Nitrox mix",
      slateBar: "bar",
      slateVol: "L",
    },
    de: {
      tankUnitM: "Liter",
      depthUnitM: "Meter",
      depthUnitI: "Fuß",
      depthLabelM: "Meter",
      depthLabelI: "Fuß",
      modUnitM: "Meter",
      modUnitI: "Fuß",
      depthShortM: "m",
      ph: {
        bar: "z.B. 100",
        psi: "z. B. 1450",
        depthM: "z.B. 30",
        depthI: "z. B. 100",
        tankM: "z.B. 12",
        tankI: "z. B. 80",
        po2M: "z.B. 40",
        po2I: "z. B. 130",
        bestM: "z.B. 30",
        bestI: "z. B. 100",
        slateM: "30",
        slateI: "100",
      },
      sacTitle: "SAC-Rate",
      sacGas: function (L, ata) {
        return "Gasverbrauch: " + L + " L bei " + ata + " ATA";
      },
      sacImperialNote: "(psi, ft, cu ft intern in bar, m, L umgerechnet)",
      sacHigh: "⚠️ Hoher SAC - Atemtechnik verbessern",
      sacExcellent: "🌟 Exzellente SAC-Rate!",
      sacPrompt: function (pu, du, tu) {
        return (
          "Verbrauch (" +
          pu +
          "), Tiefe (" +
          du +
          "), Zeit und Tank (" +
          tu +
          ") eingeben"
        );
      },
      po2At: function (d, ata) {
        return "bei " + d + " (" + ata + " ATA)";
      },
      po2Unit: "bar",
      po2DangerHigh: "⚠️ GEFAHR: PO₂ zu hoch! Sauerstofftoxizität-Risiko",
      po2Caution: "⚠️ Vorsicht: Über Freizeittauch-Limit (1,4 bar)",
      po2DangerLow: "⚠️ GEFAHR: PO₂ zu niedrig! Hypoxie-Risiko",
      po2Safe: "✓ Sicherer PO₂-Wert",
      po2Prompt: "Werte eingeben für PO₂-Berechnung",
      modDetail: function (o2, ppo2) {
        return (
          "Max. sichere Tiefe für " + o2 + "% O₂ bei " + ppo2 + " bar PPO₂"
        );
      },
      modShallow: "💡 Flachwasser - ideal für Anfänger",
      modDeep: "💡 Tieftauchgang - erweiterte Zertifizierung erforderlich",
      modStd: "💡 Standard Freizeittauch-Bereich",
      modPrompt: "Werte eingeben für MOD-Berechnung",
      bestTitle: "Beste Mischung",
      airMix: "Luft (21%)",
      bestDetail: function (o2, d, ppo2) {
        return (
          "Optimal O₂: " + o2 + "% für " + d + " bei " + ppo2 + " bar PPO₂"
        );
      },
      bestAdv: "💡 Erfordert erweiterte Nitrox-Zertifizierung (>40% O₂)",
      bestAir: "💡 Normale Luft ist für diese Tiefe ausreichend",
      bestStd: "✓ Standard Freizeit-Nitrox-Mischung",
      bestPrompt: "Tiefe eingeben für beste Nitrox-Mischung",
      slateBar: "bar",
      slateVol: "L",
    },
    th: {
      tankUnitM: "ลิตร",
      depthUnitM: "เมตร",
      depthUnitI: "ฟุต",
      depthLabelM: "เมตร",
      depthLabelI: "ฟุต",
      modUnitM: "เมตร",
      modUnitI: "ฟุต",
      depthShortM: "ม.",
      ph: {
        bar: "เช่น 100",
        psi: "เช่น 1450",
        depthM: "เช่น 30",
        depthI: "เช่น 100",
        tankM: "เช่น 12",
        tankI: "เช่น 80",
        po2M: "เช่น 40",
        po2I: "เช่น 130",
        bestM: "เช่น 30",
        bestI: "เช่น 100",
        slateM: "30",
        slateI: "100",
      },
      sacTitle: "SAC Rate",
      sacGas: function (L, ata) {
        return "การใช้แก๊ส: " + L + " L ที่ " + ata + " ATA";
      },
      sacImperialNote: "(แปลง psi, ft, cu ft เป็น bar, m, L ภายใน)",
      sacHigh: "⚠️ SAC สูง - ปรับปรุงการหายใจ",
      sacExcellent: "🌟 SAC rate ยอดเยี่ยม!",
      sacPrompt: function (pu, du, tu) {
        return (
          "กรอกแก๊ส (" + pu + ") ความลึก (" + du + ") เวลา ถัง (" + tu + ")"
        );
      },
      po2At: function (d, ata) {
        return "ที่ความลึก " + d + " (" + ata + " ATA)";
      },
      po2Unit: "บาร์",
      po2DangerHigh: "⚠️ อันตราย: PO₂ สูงเกินไป! ความเสี่ยงจากพิษออกซิเจน",
      po2Caution: "⚠️ ระวัง: เกินขีดจำกัดนันทนาการ (1.4 บาร์)",
      po2DangerLow: "⚠️ อันตราย: PO₂ ต่ำเกินไป! ความเสี่ยงจากภาวะขาดออกซิเจน",
      po2Safe: "✓ ระดับ PO₂ ปลอดภัย",
      po2Prompt: "ใส่ค่าเพื่อคำนวณ PO₂",
      modDetail: function (o2, ppo2) {
        return (
          "ความลึกสูงสุดที่ปลอดภัยสำหรับ " +
          o2 +
          "% O₂ ที่ " +
          ppo2 +
          " บาร์ PPO₂"
        );
      },
      modShallow: "💡 การดำน้ำตื้น - เหมาะสำหรับผู้เริ่มต้น",
      modDeep: "💡 การดำน้ำลึก - ต้องมีใบรับรองขั้นสูง",
      modStd: "💡 ช่วงความลึกมาตรฐานสำหรับนันทนาการ",
      modPrompt: "ใส่ค่าเพื่อคำนวณ MOD",
      bestTitle: "ผสมที่ดีที่สุด",
      airMix: "อากาศ (21%)",
      bestDetail: function (o2, d, ppo2) {
        return (
          "O₂ ที่เหมาะสม: " +
          o2 +
          "% สำหรับ " +
          d +
          " ที่ " +
          ppo2 +
          " บาร์ PPO₂"
        );
      },
      bestAdv: "💡 ต้องมีใบรับรอง Nitrox ขั้นสูง (>40% O₂)",
      bestAir: "💡 อากาศปกติเพียงพอสำหรับความลึกนี้",
      bestStd: "✓ ผสม Nitrox มาตรฐานสำหรับนันทนาการ",
      bestPrompt: "ใส่ความลึกเพื่อหาผสม Nitrox ที่ดีที่สุด",
      slateBar: "บาร์",
      slateVol: "ลิตร",
    },
  };

  var T = I18N[LANG] || I18N.en;

  var qcLockDepth = false;
  var qcLockPressure = false;
  var qcLockVolume = false;
  var qcLockMass = false;

  function qcFormatNum(n, maxDec) {
    return C.formatNum(n, maxDec);
  }

  function qcSyncDepth(from) {
    if (qcLockDepth) return;
    var ftEl = document.getElementById("qcDepthFt");
    var mEl = document.getElementById("qcDepthM");
    if (!ftEl || !mEl) return;
    qcLockDepth = true;
    try {
      if (from === "ft") {
        var raw = ftEl.value.trim();
        if (raw === "") {
          mEl.value = "";
          return;
        }
        var ft = parseFloat(raw);
        mEl.value = Number.isFinite(ft) ? qcFormatNum(ft * C.M_PER_FT, 4) : "";
      } else {
        raw = mEl.value.trim();
        if (raw === "") {
          ftEl.value = "";
          return;
        }
        var m = parseFloat(raw);
        ftEl.value = Number.isFinite(m) ? qcFormatNum(m / C.M_PER_FT, 4) : "";
      }
    } finally {
      qcLockDepth = false;
    }
  }

  function qcSyncPressure(from) {
    if (qcLockPressure) return;
    var psiEl = document.getElementById("qcPsi");
    var barEl = document.getElementById("qcBar");
    if (!psiEl || !barEl) return;
    qcLockPressure = true;
    try {
      if (from === "psi") {
        var raw = psiEl.value.trim();
        if (raw === "") {
          barEl.value = "";
          return;
        }
        var psi = parseFloat(raw);
        barEl.value = Number.isFinite(psi)
          ? qcFormatNum(psi / C.PSI_PER_BAR, 4)
          : "";
      } else {
        raw = barEl.value.trim();
        if (raw === "") {
          psiEl.value = "";
          return;
        }
        var bar = parseFloat(raw);
        psiEl.value = Number.isFinite(bar)
          ? qcFormatNum(bar * C.PSI_PER_BAR, 2)
          : "";
      }
    } finally {
      qcLockPressure = false;
    }
  }

  function qcSyncVolume(from) {
    if (qcLockVolume) return;
    var cfEl = document.getElementById("qcCuFt");
    var lEl = document.getElementById("qcLiters");
    if (!cfEl || !lEl) return;
    qcLockVolume = true;
    try {
      if (from === "cuft") {
        var raw = cfEl.value.trim();
        if (raw === "") {
          lEl.value = "";
          return;
        }
        var cf = parseFloat(raw);
        lEl.value = Number.isFinite(cf)
          ? qcFormatNum(cf * C.L_PER_CUFT, 3)
          : "";
      } else {
        raw = lEl.value.trim();
        if (raw === "") {
          cfEl.value = "";
          return;
        }
        var L = parseFloat(raw);
        cfEl.value = Number.isFinite(L) ? qcFormatNum(L / C.L_PER_CUFT, 4) : "";
      }
    } finally {
      qcLockVolume = false;
    }
  }

  function qcSyncMass(from) {
    if (qcLockMass) return;
    var stEl = document.getElementById("qcStone");
    var lbEl = document.getElementById("qcLb");
    var kgEl = document.getElementById("qcMassKg");
    if (!stEl || !lbEl || !kgEl) return;
    qcLockMass = true;
    try {
      if (from === "stone") {
        var raw = stEl.value.trim();
        if (raw === "") {
          lbEl.value = "";
          kgEl.value = "";
          return;
        }
        var st = parseFloat(raw);
        if (!Number.isFinite(st)) {
          lbEl.value = "";
          kgEl.value = "";
          return;
        }
        var lb = st * C.LB_PER_STONE;
        var kg = lb * C.KG_PER_LB;
        lbEl.value = qcFormatNum(lb, 4);
        kgEl.value = qcFormatNum(kg, 3);
      } else if (from === "lb") {
        raw = lbEl.value.trim();
        if (raw === "") {
          stEl.value = "";
          kgEl.value = "";
          return;
        }
        lb = parseFloat(raw);
        if (!Number.isFinite(lb)) {
          stEl.value = "";
          kgEl.value = "";
          return;
        }
        kg = lb * C.KG_PER_LB;
        st = lb / C.LB_PER_STONE;
        kgEl.value = qcFormatNum(kg, 3);
        stEl.value = qcFormatNum(st, 4);
      } else {
        raw = kgEl.value.trim();
        if (raw === "") {
          stEl.value = "";
          lbEl.value = "";
          return;
        }
        kg = parseFloat(raw);
        if (!Number.isFinite(kg)) {
          stEl.value = "";
          lbEl.value = "";
          return;
        }
        lb = kg / C.KG_PER_LB;
        st = lb / C.LB_PER_STONE;
        lbEl.value = qcFormatNum(lb, 3);
        stEl.value = qcFormatNum(st, 4);
      }
    } finally {
      qcLockMass = false;
    }
  }

  function gcGetImperial() {
    var el = document.getElementById("gcCalcUnits");
    return el && el.value === "imperial";
  }

  function setGcCalcUnitLabels(convertTank) {
    var unitSelect = document.getElementById("gcCalcUnits");
    if (!unitSelect) return;
    var units = unitSelect.value;
    var prev = unitSelect.dataset.lastUnit || units;
    var imp = units === "imperial";
    var tankEl = document.getElementById(id("sacTank"));

    if (convertTank && prev !== units && tankEl) {
      var tv = parseFloat(tankEl.value);
      if (!isNaN(tv) && tv > 0) {
        var converted = C.convertTankSize(tv, prev === "imperial", imp);
        tankEl.value = converted.toFixed(1).replace(/\.0$/, "");
      } else {
        tankEl.value = imp ? "80" : "12";
      }
    }

    var el;
    if ((el = document.getElementById("gcSacPressureUnit")))
      el.textContent = imp ? "psi" : "bar";
    if ((el = document.getElementById("gcSacDepthUnit")))
      el.textContent = imp ? T.depthLabelI : T.depthLabelM;
    if ((el = document.getElementById("gcSacTankUnit")))
      el.textContent = imp ? "cu ft" : T.tankUnitM;
    if ((el = document.getElementById("gcPo2DepthUnit")))
      el.textContent = imp ? T.depthLabelI : T.depthLabelM;
    if ((el = document.getElementById("gcBestDepthUnit")))
      el.textContent = imp ? T.depthLabelI : T.depthLabelM;
    var slateLbl = document.getElementById("gcSlateDepthUnitLabel");
    if (slateLbl) slateLbl.textContent = imp ? "ft" : "m";

    var sb = document.getElementById(id("sacBar"));
    var sd = document.getElementById(id("sacDepth"));
    var pd = document.getElementById(id("po2Depth"));
    var bd = document.getElementById(id("bestmixDepth"));
    var sl = document.getElementById("slateDepth");
    if (sb) sb.placeholder = imp ? T.ph.psi : T.ph.bar;
    if (sd) sd.placeholder = imp ? T.ph.depthI : T.ph.depthM;
    if (tankEl) tankEl.placeholder = imp ? T.ph.tankI : T.ph.tankM;
    if (pd) pd.placeholder = imp ? T.ph.po2I : T.ph.po2M;
    if (bd) bd.placeholder = imp ? T.ph.bestI : T.ph.bestM;
    if (sl) sl.placeholder = imp ? T.ph.slateI : T.ph.slateM;

    unitSelect.dataset.lastUnit = units;
  }

  function calculateSAC() {
    var isImperial = gcGetImperial();
    var pressureInput = parseFloat(document.getElementById(id("sacBar")).value);
    var depthIn = parseFloat(document.getElementById(id("sacDepth")).value);
    var time = parseFloat(document.getElementById(id("sacTime")).value);
    var tankIn = parseFloat(document.getElementById(id("sacTank")).value);
    var result = document.getElementById(id("sacResult"));
    var pu = isImperial ? "psi" : "bar";
    var du = isImperial ? "ft" : LANG === "th" ? "ม." : "m";
    var tu = isImperial ? "cu ft" : T.tankUnitM;

    if (
      Number.isFinite(pressureInput) &&
      pressureInput > 0 &&
      Number.isFinite(depthIn) &&
      depthIn >= 0 &&
      Number.isFinite(time) &&
      time > 0 &&
      Number.isFinite(tankIn) &&
      tankIn > 0
    ) {
      var r = C.sacRate(pressureInput, depthIn, time, tankIn, isImperial);
      var html =
        "✅ " +
        T.sacTitle +
        ': <span style="color: #e74c3c">' +
        r.sac.toFixed(1) +
        ' L/min</span><br><small style="color: #666">' +
        T.sacGas(r.liters.toFixed(0), r.ata.toFixed(1)) +
        "</small>";
      if (isImperial) {
        html +=
          '<br><small style="color: #666">' + T.sacImperialNote + "</small>";
      }
      result.innerHTML = html;
      var band = C.sacBand(r.sac);
      if (band === "high") {
        result.innerHTML +=
          '<br><small style="color: #f39c12">' + T.sacHigh + "</small>";
      } else if (band === "excellent") {
        result.innerHTML +=
          '<br><small style="color: #27ae60">' + T.sacExcellent + "</small>";
      }
    } else {
      result.textContent = T.sacPrompt(pu, du, tu);
    }
  }

  function calculatePO2() {
    var isImperial = gcGetImperial();
    var oxygen = parseFloat(document.getElementById(id("po2Oxygen")).value);
    var depthIn = parseFloat(document.getElementById(id("po2Depth")).value);
    var depthM = C.depthToMeters(depthIn, isImperial);
    var result = document.getElementById(id("po2Result"));

    if (oxygen && Number.isFinite(depthIn) && depthIn >= 0) {
      var r = C.po2(oxygen, depthM);
      var depthDisp =
        depthIn.toFixed(1) + (isImperial ? " ft" : " " + T.depthShortM);
      result.innerHTML =
        '✅ PO₂: <span style="color: #e74c3c">' +
        fmt(r.po2, 2) +
        " " +
        T.po2Unit +
        '</span><br><small style="color: #666">' +
        T.po2At(depthDisp, r.ata.toFixed(1)) +
        "</small>";
      var level = C.po2Level(r.po2);
      var msg =
        level === "danger_high"
          ? T.po2DangerHigh
          : level === "caution"
            ? T.po2Caution
            : level === "danger_low"
              ? T.po2DangerLow
              : T.po2Safe;
      var color =
        level === "danger_high" || level === "danger_low"
          ? "#e74c3c"
          : level === "caution"
            ? "#f39c12"
            : "#27ae60";
      result.innerHTML +=
        '<br><small style="color: ' + color + '">' + msg + "</small>";
    } else {
      result.textContent = T.po2Prompt;
    }
  }

  function calculateMOD() {
    var isImperial = gcGetImperial();
    var oxygen = parseFloat(document.getElementById(id("modOxygen")).value);
    var maxPPO2 = parseFloat(document.getElementById(id("modMaxPPO2")).value);
    var result = document.getElementById(id("modResult"));

    if (oxygen && maxPPO2) {
      var modM = C.modMeters(oxygen, maxPPO2);
      var modDisp = fmt(isImperial ? modM / C.M_PER_FT : modM, 1);
      var modUnit = isImperial ? T.modUnitI : T.modUnitM;
      result.innerHTML =
        '✅ MOD: <span style="color: #e74c3c">' +
        modDisp +
        " " +
        modUnit +
        '</span><br><small style="color: #666">' +
        T.modDetail(oxygen, maxPPO2) +
        "</small>";
      var band = C.modDepthBand(modM);
      if (band === "shallow") {
        result.innerHTML +=
          '<br><small style="color: #3498db">' + T.modShallow + "</small>";
      } else if (band === "deep") {
        result.innerHTML +=
          '<br><small style="color: #f39c12">' + T.modDeep + "</small>";
      } else {
        result.innerHTML +=
          '<br><small style="color: #27ae60">' + T.modStd + "</small>";
      }
    } else {
      result.textContent = T.modPrompt;
    }
  }

  function calculateBestMix() {
    var isImperial = gcGetImperial();
    var depthIn = parseFloat(document.getElementById(id("bestmixDepth")).value);
    var depthM = C.depthToMeters(depthIn, isImperial);
    var maxPPO2 = parseFloat(
      document.getElementById(id("bestmixMaxPPO2")).value
    );
    var result = document.getElementById(id("bestmixResult"));

    if (Number.isFinite(depthIn) && depthIn >= 0 && maxPPO2) {
      var bm = C.bestMixPercent(depthM, maxPPO2);
      var rec = C.recommendMix(bm.bestO2);
      if (rec.recommendedMix === 21) rec.mixName = T.airMix;
      var depthDisp =
        depthIn.toFixed(1) + (isImperial ? " ft" : " " + T.depthShortM);
      result.innerHTML =
        "✅ " +
        T.bestTitle +
        ': <span style="color: #e74c3c">' +
        rec.mixName +
        '</span><br><small style="color: #666">' +
        T.bestDetail(fmt(bm.bestO2, 1), depthDisp, maxPPO2) +
        "</small>";
      if (rec.recommendedMix > 40) {
        result.innerHTML +=
          '<br><small style="color: #f39c12">' + T.bestAdv + "</small>";
      } else if (rec.recommendedMix <= 21) {
        result.innerHTML +=
          '<br><small style="color: #3498db">' + T.bestAir + "</small>";
      } else {
        result.innerHTML +=
          '<br><small style="color: #27ae60">' + T.bestStd + "</small>";
      }
    } else {
      result.textContent = T.bestPrompt;
    }
  }

  function calculateDecoSlateRow() {
    var isImperial = gcGetImperial();
    var depthIn = parseFloat(document.getElementById("slateDepth").value);
    var depthM = C.depthToMeters(depthIn, isImperial);
    var timeIn = parseFloat(document.getElementById("slateTime").value);
    var sacIn = parseFloat(document.getElementById("slateSac").value);
    var gasStr = document.getElementById("slateGas").value;
    var elC = document.getElementById("slateOutConv");
    var elV = document.getElementById("slateOutVol");
    var elP = document.getElementById("slateOutPo2");
    var elCm = document.getElementById("slateOutCnsMin");
    var elCt = document.getElementById("slateOutCns");
    var dash = "—";

    var fo2 = C.parseO2Fraction(gasStr);
    var depthOk =
      Number.isFinite(depthIn) &&
      depthIn >= 0 &&
      Number.isFinite(depthM) &&
      depthM <= 120;
    var timeOk = Number.isFinite(timeIn) && timeIn >= 0 && timeIn <= 999;
    var sacOk = Number.isFinite(sacIn) && sacIn > 0 && sacIn < 200;
    var gasOk = fo2 !== null && fo2 >= 0.1 && fo2 <= 1;

    if (!depthOk || !timeOk || !sacOk || !gasOk) {
      elC.textContent = elV.textContent = elP.textContent = dash;
      elCm.textContent = elCt.textContent = dash;
      return;
    }

    var ata = C.ataFromDepthM(depthM);
    var ppo2 = fo2 * ata;
    var volume = sacIn * timeIn * ata;
    var maxMin = C.noaaCnsMaxMinutes(ppo2);
    var cnsPerMin =
      ppo2 < 0.5 || !Number.isFinite(maxMin) || maxMin <= 0 ? 0 : 100 / maxMin;
    var cnsSeg = cnsPerMin * timeIn;

    elC.textContent = fmt(ata, 1) + " " + T.slateBar;
    elV.textContent = Math.round(volume) + " " + T.slateVol;
    elP.textContent = fmt(ppo2, 2) + " " + T.slateBar;
    elCm.textContent = cnsPerMin > 0 ? fmt(cnsPerMin, 3) + " %" : "0 %";
    elCt.textContent = fmt(cnsSeg, 2) + " %";
  }

  function recalcAllGc() {
    calculateSAC();
    calculatePO2();
    calculateMOD();
    calculateBestMix();
    calculateDecoSlateRow();
  }

  // Expose names expected by inline oninput/onclick handlers per language
  window.qcSyncDepth = qcSyncDepth;
  window.qcSyncPressure = qcSyncPressure;
  window.qcSyncVolume = qcSyncVolume;
  window.qcSyncMass = qcSyncMass;
  window.calculateDecoSlateRow = calculateDecoSlateRow;

  if (LANG === "en") {
    window.setGcCalcUnitLabels = setGcCalcUnitLabels;
    window.recalcAllGc = recalcAllGc;
    window.calculateSAC = calculateSAC;
    window.calculatePO2 = calculatePO2;
    window.calculateMOD = calculateMOD;
    window.calculateBestMix = calculateBestMix;
  } else {
    window["setGcCalcUnitLabels_" + LANG] = setGcCalcUnitLabels;
    window["recalcAllGc_" + LANG] = recalcAllGc;
    window["calculateSAC_" + LANG] = calculateSAC;
    window["calculatePO2_" + LANG] = calculatePO2;
    window["calculateMOD_" + LANG] = calculateMOD;
    window["calculateBestMix_" + LANG] = calculateBestMix;
  }

  setGcCalcUnitLabels();
})();
