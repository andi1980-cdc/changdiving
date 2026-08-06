/**
 * Dive logbook SAC calculator. Shared math: dive-calc-core.js (CDC).
 */
(function () {
  "use strict";
  var C = window.CDC;
  if (!C) {
    console.error("[dive-logbook] dive-calc-core.js missing");
    return;
  }

  var LANG = C.pageLang();

  var I18N = {
    en: {
      phBarI: "e.g. 1450",
      phBarM: "e.g. 100",
      phMaxI: "e.g. 60",
      phMaxM: "e.g. 18",
      phTankI: "e.g. 80",
      phTankM: "e.g. 12",
      avgNote: function (v, u) {
        return (
          "Average depth <strong>" +
          v +
          " " +
          u +
          "</strong> (from your entry)."
        );
      },
      estNote: function (est, u, max) {
        return (
          "Average depth estimated as <strong>60% of max</strong> → " +
          est +
          " " +
          u +
          " (max " +
          max +
          " " +
          u +
          ")."
        );
      },
      needDepth:
        "<span>Enter <strong>max depth</strong> (and optionally <strong>average depth</strong> from your computer).</span>",
      needGas: function (pu, tu) {
        return (
          "<span>Enter <strong>gas used (" +
          pu +
          ")</strong>, <strong>time</strong>, and <strong>tank size (" +
          tu +
          ")</strong>.</span>"
        );
      },
      sacLine: function (sac, note, liters, time, ata) {
        return (
          '✅ SAC: <span style="color: #e74c3c">' +
          sac +
          ' L/min</span><br><small style="color: #666; font-weight: normal">' +
          note +
          "<br>Gas: " +
          liters +
          " L over " +
          time +
          " min at " +
          ata +
          " ATA</small>"
        );
      },
      imperialNote: function (tu) {
        return (
          '<br><small style="color: #666; font-weight: normal">(psi/ft and ' +
          tu +
          " converted internally to bar/m and L tank size)</small>"
        );
      },
      high: '<br><small style="color: #f39c12; font-weight: normal">⚠️ High SAC — work on relaxed breathing</small>',
      excellent:
        '<br><small style="color: #27ae60; font-weight: normal">🌟 Very efficient SAC</small>',
    },
    de: {
      phBarI: "z. B. 1450",
      phBarM: "z. B. 100",
      phMaxI: "z. B. 60",
      phMaxM: "z. B. 18",
      phTankI: "z. B. 80",
      phTankM: "z. B. 12",
      avgNote: function (v, u) {
        return "Mittlere Tiefe <strong>" + v + " " + u + "</strong> (Eingabe).";
      },
      estNote: function (est, u, max) {
        return (
          "Mittlere Tiefe geschätzt: <strong>60&nbsp;% der max. Tiefe</strong> → " +
          est +
          " " +
          u +
          " (max " +
          max +
          " " +
          u +
          ")."
        );
      },
      needDepth:
        "<span><strong>Max. Tiefe</strong> eintragen (optional: <strong>mittlere Tiefe</strong> vom Computer).</span>",
      needGas: function (pu, tu) {
        return (
          "<span><strong>Verbrauch (" +
          pu +
          ")</strong>, <strong>Zeit</strong> und <strong>Tankgröße (" +
          tu +
          ")</strong> eintragen.</span>"
        );
      },
      sacLine: function (sac, note, liters, time, ata) {
        return (
          '✅ SAC: <span style="color: #e74c3c">' +
          sac +
          ' L/min</span><br><small style="color: #666; font-weight: normal">' +
          note +
          "<br>Gas: " +
          liters +
          " L in " +
          time +
          " min bei " +
          ata +
          " ATA</small>"
        );
      },
      imperialNote: function (tu) {
        return (
          '<br><small style="color: #666; font-weight: normal">(psi/ft und ' +
          tu +
          " intern in bar/m/L umgerechnet)</small>"
        );
      },
      high: '<br><small style="color: #f39c12; font-weight: normal">⚠️ Hohe SAC — entspannt atmen üben</small>',
      excellent:
        '<br><small style="color: #27ae60; font-weight: normal">🌟 Sehr effiziente SAC</small>',
    },
    th: {
      phBarI: "เช่น 1450",
      phBarM: "เช่น 100",
      phMaxI: "เช่น 60",
      phMaxM: "เช่น 18",
      phTankI: "เช่น 80",
      phTankM: "เช่น 12",
      avgNote: function (v, u) {
        return (
          "ความลึกเฉลี่ย <strong>" + v + " " + u + "</strong> (จากที่กรอก)"
        );
      },
      estNote: function (est, u, max) {
        return (
          "ประมาณความลึกเฉลี่ย: <strong>60% ของความลึกสูงสุด</strong> → " +
          est +
          " " +
          u +
          " (max " +
          max +
          " " +
          u +
          ")"
        );
      },
      needDepth:
        "<span>กรอก <strong>ความลึกสูงสุด</strong> (หรือ <strong>ความลึกเฉลี่ย</strong> จากคอมพิวเตอร์)</span>",
      needGas: function (pu, tu) {
        return (
          "<span>กรอก <strong>แก๊ส (" +
          pu +
          ")</strong> <strong>เวลา</strong> และ <strong>ขนาดถัง (" +
          tu +
          ")</strong></span>"
        );
      },
      sacLine: function (sac, note, liters, time, ata) {
        return (
          '✅ SAC: <span style="color: #e74c3c">' +
          sac +
          ' L/min</span><br><small style="color: #666; font-weight: normal">' +
          note +
          "<br>แก๊ส: " +
          liters +
          " L ใน " +
          time +
          " นาที ที่ " +
          ata +
          " ATA</small>"
        );
      },
      imperialNote: function (tu) {
        return '<br><small style="color: #666; font-weight: normal">(ระบบแปลง psi/ft และ cu ft เป็น bar/m/L ภายใน)</small>';
      },
      high: '<br><small style="color: #f39c12; font-weight: normal">⚠️ SAC สูง — ฝึกหายใจให้นุ่มนวล</small>',
      excellent:
        '<br><small style="color: #27ae60; font-weight: normal">🌟 SAC ดีมาก</small>',
    },
  };

  var T = I18N[LANG] || I18N.en;

  function setDiveLogUnitLabels(convertTankValue) {
    var unitsEl = document.getElementById("dlSacUnits");
    if (!unitsEl) return;
    var units = unitsEl.value;
    var isImperial = units === "imperial";
    var lastUnits =
      unitsEl.dataset.lastUnits || unitsEl.dataset.lastUnit || units;
    var tankInput = document.getElementById("dlSacTank");
    var tankValue = parseFloat(tankInput.value);

    // Support both EN (explicit convert flag) and DE/TH (auto on change)
    var shouldConvert =
      convertTankValue === true ||
      (convertTankValue !== false && lastUnits !== units);

    if (shouldConvert && lastUnits !== units) {
      if (!isNaN(tankValue) && tankValue > 0) {
        var converted = C.convertTankSize(
          tankValue,
          lastUnits === "imperial",
          isImperial
        );
        tankInput.value = converted.toFixed(1).replace(/\.0$/, "");
      } else {
        tankInput.value = isImperial ? "80" : "12";
      }
    }

    document.getElementById("dlSacPressureUnit").textContent = isImperial
      ? "psi"
      : "bar";
    document.getElementById("dlSacTankUnit").textContent = isImperial
      ? "cu ft"
      : "L";
    document.getElementById("dlSacDepthUnit").textContent = isImperial
      ? "ft"
      : "m";
    document.getElementById("dlSacAvgDepthUnit").textContent = isImperial
      ? "ft"
      : "m";
    document.getElementById("dlSacBar").placeholder = isImperial
      ? T.phBarI
      : T.phBarM;
    document.getElementById("dlSacMaxDepth").placeholder = isImperial
      ? T.phMaxI
      : T.phMaxM;
    tankInput.placeholder = isImperial ? T.phTankI : T.phTankM;

    unitsEl.dataset.lastUnits = units;
    unitsEl.dataset.lastUnit = units;
  }

  function calculateDiveLogSAC() {
    var units = document.getElementById("dlSacUnits").value;
    var isImperial = units === "imperial";
    var pressureInput = parseFloat(document.getElementById("dlSacBar").value);
    var time = parseFloat(document.getElementById("dlSacTime").value);
    var tank = parseFloat(document.getElementById("dlSacTank").value);
    var maxD = parseFloat(document.getElementById("dlSacMaxDepth").value);
    var avgIn = parseFloat(document.getElementById("dlSacAvgDepth").value);
    var result = document.getElementById("dlSacResult");
    var pressureUnit = isImperial ? "psi" : "bar";
    var tankUnit = isImperial ? "cu ft" : "L";
    var depthUnit = isImperial ? "ft" : "m";

    var depthForCalc;
    var depthNote;
    if (!isNaN(avgIn) && avgIn > 0) {
      depthForCalc = avgIn;
      depthNote = T.avgNote(avgIn.toFixed(1), depthUnit);
    } else if (!isNaN(maxD) && maxD > 0) {
      var estimatedAvg = maxD * 0.6;
      depthForCalc = estimatedAvg;
      depthNote = T.estNote(
        estimatedAvg.toFixed(1),
        depthUnit,
        maxD.toFixed(1)
      );
    } else {
      result.innerHTML = T.needDepth;
      return;
    }

    if (
      !pressureInput ||
      pressureInput <= 0 ||
      !time ||
      time <= 0 ||
      !tank ||
      tank <= 0
    ) {
      result.innerHTML = T.needGas(pressureUnit, tankUnit);
      return;
    }

    var r = C.sacRate(pressureInput, depthForCalc, time, tank, isImperial);
    var html = T.sacLine(
      r.sac.toFixed(1),
      depthNote,
      r.liters.toFixed(0),
      time,
      r.ata.toFixed(2)
    );
    if (isImperial) html += T.imperialNote(tankUnit);
    var band = C.sacBand(r.sac);
    if (band === "high") html += T.high;
    else if (band === "excellent") html += T.excellent;
    result.innerHTML = html;
  }

  window.setDiveLogUnitLabels = setDiveLogUnitLabels;
  window.calculateDiveLogSAC = calculateDiveLogSAC;
  setDiveLogUnitLabels(false);
})();
