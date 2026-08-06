/**
 * Nitrox info page calculators (PO₂, MOD, best mix). Shared math: dive-calc-core.js (CDC).
 */
(function () {
  "use strict";
  var C = window.CDC;
  if (!C) {
    console.error("[nitrox-info] dive-calc-core.js missing");
    return;
  }

  var LANG = C.pageLang();

  function nid(base) {
    // nitrox-po2-o2-en style
    return base + "-" + LANG;
  }

  var I18N = {
    en: {
      po2At: function (d, ata) {
        return "at " + d + "m depth (" + ata + " ATA)";
      },
      po2DangerHigh: "⚠️ DANGER: PO₂ too high! Risk of oxygen toxicity",
      po2Caution: "⚠️ Caution: Above recreational limit (1.4 bar)",
      po2DangerLow: "⚠️ DANGER: PO₂ too low! Hypoxia risk",
      po2Safe: "✓ Safe PO₂ level",
      po2Prompt: "Enter values to calculate PO₂",
      modDetail: function (o2, ppo2) {
        return "Max safe depth for " + o2 + "% O₂ at " + ppo2 + " bar PPO₂";
      },
      modUnit: "meters",
      modShallow: "💡 Shallow dive — great for beginners",
      modDeep: "💡 Deep dive — advanced certification required",
      modStd: "💡 Standard recreational depth range",
      modPrompt: "Enter values to calculate MOD",
      bestTitle: "Best mix",
      airMix: "Air (21%)",
      bestDetail: function (o2, d, ppo2) {
        return (
          "Optimal O₂: " + o2 + "% for " + d + "m at " + ppo2 + " bar PPO₂"
        );
      },
      bestAdv: "💡 Requires advanced Nitrox certification (&gt;40% O₂)",
      bestAir: "💡 Regular air is sufficient for this depth",
      bestStd: "✓ Standard recreational Nitrox mix",
      bestPrompt: "Enter depth to find best Nitrox mix",
    },
    de: {
      po2At: function (d, ata) {
        return "bei " + d + " m Tiefe (" + ata + " ATA)";
      },
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
      modUnit: "Meter",
      modShallow: "💡 Flachwasser – ideal für Anfänger",
      modDeep: "💡 Tieftauchgang – erweiterte Zertifizierung erforderlich",
      modStd: "💡 Standard Freizeittauch-Bereich",
      modPrompt: "Werte eingeben für MOD-Berechnung",
      bestTitle: "Beste Mischung",
      airMix: "Luft (21%)",
      bestDetail: function (o2, d, ppo2) {
        return (
          "Optimaler O₂-Anteil: " +
          o2 +
          "% für " +
          d +
          " m bei " +
          ppo2 +
          " bar PPO₂"
        );
      },
      bestAdv: "💡 Erfordert erweiterte Nitrox-Zertifizierung (&gt;40% O₂)",
      bestAir: "💡 Normale Luft ist für diese Tiefe ausreichend",
      bestStd: "✓ Standard Freizeit-Nitrox-Mischung",
      bestPrompt: "Tiefe eingeben für beste Nitrox-Mischung",
    },
    th: {
      po2At: function (d, ata) {
        return "ที่ความลึก " + d + " ม. (" + ata + " ATA)";
      },
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
      modUnit: "เมตร",
      modShallow: "💡 การดำน้ำตื้น – เหมาะสำหรับผู้เริ่มต้น",
      modDeep: "💡 การดำน้ำลึก – ต้องมีใบรับรองขั้นสูง",
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
          " ม. ที่ " +
          ppo2 +
          " บาร์ PPO₂"
        );
      },
      bestAdv: "💡 ต้องมีใบรับรอง Nitrox ขั้นสูง (&gt;40% O₂)",
      bestAir: "💡 อากาศปกติเพียงพอสำหรับความลึกนี้",
      bestStd: "✓ ผสม Nitrox มาตรฐานสำหรับนันทนาการ",
      bestPrompt: "ใส่ความลึกเพื่อหาผสม Nitrox ที่ดีที่สุด",
    },
  };

  var T = I18N[LANG] || I18N.en;
  var DEC = LANG === "de";

  function fmt(n, d) {
    var s = Number(n).toFixed(d);
    return DEC ? s.replace(".", ",") : s;
  }

  function nitroxCalcPO2() {
    var oxygen = parseFloat(
      document.getElementById(nid("nitrox-po2-o2")).value
    );
    var depth = parseFloat(
      document.getElementById(nid("nitrox-po2-depth")).value
    );
    var result = document.getElementById(nid("nitrox-po2-result"));

    if (oxygen && depth >= 0) {
      var r = C.po2(oxygen, depth);
      result.innerHTML =
        '✅ PO₂: <span style="color: #e74c3c">' +
        fmt(r.po2, 2) +
        ' bar</span><br><small style="color: #666">' +
        T.po2At(depth, r.ata.toFixed(1)) +
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

  function nitroxCalcMOD() {
    var oxygen = parseFloat(
      document.getElementById(nid("nitrox-mod-o2")).value
    );
    var maxPPO2 = parseFloat(
      document.getElementById(nid("nitrox-mod-ppo2")).value
    );
    var result = document.getElementById(nid("nitrox-mod-result"));

    if (oxygen && maxPPO2) {
      var mod = C.modMeters(oxygen, maxPPO2);
      result.innerHTML =
        '✅ MOD: <span style="color: #e74c3c">' +
        fmt(mod, 1) +
        " " +
        T.modUnit +
        '</span><br><small style="color: #666">' +
        T.modDetail(oxygen, maxPPO2) +
        "</small>";
      var band = C.modDepthBand(mod);
      if (band === "shallow")
        result.innerHTML +=
          '<br><small style="color: #3498db">' + T.modShallow + "</small>";
      else if (band === "deep")
        result.innerHTML +=
          '<br><small style="color: #f39c12">' + T.modDeep + "</small>";
      else
        result.innerHTML +=
          '<br><small style="color: #27ae60">' + T.modStd + "</small>";
    } else {
      result.textContent = T.modPrompt;
    }
  }

  function nitroxCalcBestMix() {
    var depth = parseFloat(
      document.getElementById(nid("nitrox-best-depth")).value
    );
    var maxPPO2 = parseFloat(
      document.getElementById(nid("nitrox-best-ppo2")).value
    );
    var result = document.getElementById(nid("nitrox-best-result"));

    if (depth >= 0 && maxPPO2) {
      var bm = C.bestMixPercent(depth, maxPPO2);
      var rec = C.recommendMix(bm.bestO2);
      if (rec.recommendedMix === 21) rec.mixName = T.airMix;
      result.innerHTML =
        "✅ " +
        T.bestTitle +
        ': <span style="color: #e74c3c">' +
        rec.mixName +
        '</span><br><small style="color: #666">' +
        T.bestDetail(fmt(bm.bestO2, 1), depth, maxPPO2) +
        "</small>";
      if (rec.recommendedMix > 40)
        result.innerHTML +=
          '<br><small style="color: #f39c12">' + T.bestAdv + "</small>";
      else if (rec.recommendedMix <= 21)
        result.innerHTML +=
          '<br><small style="color: #3498db">' + T.bestAir + "</small>";
      else
        result.innerHTML +=
          '<br><small style="color: #27ae60">' + T.bestStd + "</small>";
    } else {
      result.textContent = T.bestPrompt;
    }
  }

  window["nitroxCalcPO2_" + LANG] = nitroxCalcPO2;
  window["nitroxCalcMOD_" + LANG] = nitroxCalcMOD;
  window["nitroxCalcBestMix_" + LANG] = nitroxCalcBestMix;
})();
