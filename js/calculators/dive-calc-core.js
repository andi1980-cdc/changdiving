/**
 * Shared scuba calculator math (no DOM).
 * Used by gas-consumption, dive-logbook, and nitrox-info UIs.
 */
(function (global) {
  "use strict";

  var PSI_PER_BAR = 14.5037738;
  var FT_PER_M = 1 / 0.3048;
  var M_PER_FT = 0.3048;
  /** AL80 ≈ 11.1 L water volume at 3000 psi rated pressure */
  var LITERS_PER_CUFT_AL80 = 11.1 / 80;
  var CUFT_PER_LITER_AL80 = 80 / 11.1;
  var L_PER_CUFT = 28.316846592;
  var KG_PER_LB = 0.45359237;
  var LB_PER_STONE = 14;

  function ataFromDepthM(depthM) {
    return depthM / 10 + 1;
  }

  function depthToMeters(depth, imperial) {
    if (!Number.isFinite(depth)) return NaN;
    return imperial ? depth * M_PER_FT : depth;
  }

  function metersToDisplay(depthM, imperial) {
    return imperial ? depthM / M_PER_FT : depthM;
  }

  function pressureToBar(pressure, imperial) {
    if (!Number.isFinite(pressure)) return NaN;
    return imperial ? pressure / PSI_PER_BAR : pressure;
  }

  function tankToLiters(tank, imperial) {
    if (!Number.isFinite(tank)) return NaN;
    return imperial ? tank * LITERS_PER_CUFT_AL80 : tank;
  }

  function convertTankSize(value, fromImperial, toImperial) {
    if (!Number.isFinite(value) || value <= 0) return NaN;
    if (fromImperial === toImperial) return value;
    return toImperial
      ? value * CUFT_PER_LITER_AL80
      : value * LITERS_PER_CUFT_AL80;
  }

  /**
   * Surface Air Consumption (L/min).
   * @param {number} pressureUsed - bar or psi (per imperial flag)
   * @param {number} depth - m or ft average depth
   * @param {number} timeMin
   * @param {number} tankSize - L or cu ft (AL80-rated)
   * @param {boolean} imperial
   */
  function sacRate(pressureUsed, depth, timeMin, tankSize, imperial) {
    var bar = pressureToBar(pressureUsed, imperial);
    var depthM = depthToMeters(depth, imperial);
    var tankL = tankToLiters(tankSize, imperial);
    var ata = ataFromDepthM(depthM);
    var liters = bar * tankL;
    var sac = liters / (timeMin * ata);
    return {
      sac: sac,
      ata: ata,
      liters: liters,
      bar: bar,
      depthM: depthM,
      tankL: tankL,
    };
  }

  function po2(oxygenPercent, depthM) {
    var ata = ataFromDepthM(depthM);
    return { po2: (oxygenPercent / 100) * ata, ata: ata };
  }

  function modMeters(oxygenPercent, maxPpo2) {
    return (maxPpo2 / (oxygenPercent / 100) - 1) * 10;
  }

  function bestMixPercent(depthM, maxPpo2) {
    var ata = ataFromDepthM(depthM);
    return { bestO2: (maxPpo2 / ata) * 100, ata: ata };
  }

  /** Snap best O₂% to common recreational mixes where close. */
  function recommendMix(bestO2) {
    var recommended = Math.round(bestO2);
    var mixName = "EAN" + recommended;
    if (bestO2 >= 31 && bestO2 <= 33) {
      recommended = 32;
      mixName = "EAN32 (N32)";
    } else if (bestO2 >= 35 && bestO2 <= 37) {
      recommended = 36;
      mixName = "EAN36 (N36)";
    } else if (bestO2 >= 39 && bestO2 <= 41) {
      recommended = 40;
      mixName = "EAN40";
    } else if (bestO2 <= 21) {
      recommended = 21;
      mixName = "Air (21%)";
    }
    return { recommendedMix: recommended, mixName: mixName, bestO2: bestO2 };
  }

  function po2Level(po2Val) {
    if (po2Val > 1.6) return "danger_high";
    if (po2Val > 1.4) return "caution";
    if (po2Val < 0.16) return "danger_low";
    return "safe";
  }

  function modDepthBand(modM) {
    if (modM < 18) return "shallow";
    if (modM > 40) return "deep";
    return "standard";
  }

  function sacBand(sac) {
    if (sac > 25) return "high";
    if (sac < 15) return "excellent";
    return "ok";
  }

  /** NOAA-style single-exposure limit (minutes) vs PO₂ (bar); linear interpolate. */
  function noaaCnsMaxMinutes(ppo2) {
    if (ppo2 < 0.5) return Infinity;
    var pts = [
      [0.5, 720],
      [0.6, 720],
      [0.7, 570],
      [0.8, 450],
      [0.9, 360],
      [1.0, 300],
      [1.1, 240],
      [1.2, 210],
      [1.3, 180],
      [1.4, 150],
      [1.5, 120],
      [1.6, 45],
      [1.65, 35],
      [1.7, 28],
      [1.75, 22],
      [1.8, 18],
    ];
    if (ppo2 >= pts[pts.length - 1][0]) {
      var p0 = pts[pts.length - 2][0];
      var t0 = pts[pts.length - 2][1];
      var p1 = pts[pts.length - 1][0];
      var t1 = pts[pts.length - 1][1];
      var slope = (t1 - t0) / (p1 - p0);
      return Math.max(5, t1 + slope * (ppo2 - p1));
    }
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i];
      var b = pts[i + 1];
      if (ppo2 <= b[0]) {
        var f = (ppo2 - a[0]) / (b[0] - a[0]);
        return a[1] + f * (b[1] - a[1]);
      }
    }
    return pts[pts.length - 1][1];
  }

  function parseO2Fraction(gasRaw) {
    var raw = (gasRaw || "").trim();
    if (!raw) return null;
    var s = raw.toUpperCase().replace(/\s+/g, "");
    if (s === "AIR" || s === "LUFT") return 0.21;
    var m = s.match(/^N(\d{1,3})$/);
    if (m) {
      var n = parseInt(m[1], 10);
      if (n >= 0 && n <= 100) return n / 100;
    }
    m = s.match(/^EAN(\d{1,3})$/);
    if (m) {
      n = parseInt(m[1], 10);
      if (n >= 0 && n <= 100) return n / 100;
    }
    m = s.match(/^(\d{1,3})$/);
    if (m) {
      n = parseInt(m[1], 10);
      if (n >= 0 && n <= 100) return n / 100;
    }
    return null;
  }

  function formatNum(n, maxDec) {
    if (!Number.isFinite(n)) return "";
    var s = n.toFixed(maxDec);
    if (s.indexOf(".") !== -1) {
      s = s.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    }
    return s;
  }

  function pageLang() {
    var htmlLang = (document.documentElement.lang || "en").toLowerCase();
    if (htmlLang.indexOf("de") === 0) return "de";
    if (htmlLang.indexOf("th") === 0) return "th";
    return "en";
  }

  /** Element id with optional _de / _th suffix (gas-consumption / nitrox-info). */
  function langId(base, lang) {
    lang = lang || pageLang();
    return lang === "en" ? base : base + "_" + lang;
  }

  global.CDC = {
    PSI_PER_BAR: PSI_PER_BAR,
    FT_PER_M: FT_PER_M,
    M_PER_FT: M_PER_FT,
    LITERS_PER_CUFT_AL80: LITERS_PER_CUFT_AL80,
    CUFT_PER_LITER_AL80: CUFT_PER_LITER_AL80,
    L_PER_CUFT: L_PER_CUFT,
    KG_PER_LB: KG_PER_LB,
    LB_PER_STONE: LB_PER_STONE,
    ataFromDepthM: ataFromDepthM,
    depthToMeters: depthToMeters,
    metersToDisplay: metersToDisplay,
    pressureToBar: pressureToBar,
    tankToLiters: tankToLiters,
    convertTankSize: convertTankSize,
    sacRate: sacRate,
    po2: po2,
    modMeters: modMeters,
    bestMixPercent: bestMixPercent,
    recommendMix: recommendMix,
    po2Level: po2Level,
    modDepthBand: modDepthBand,
    sacBand: sacBand,
    noaaCnsMaxMinutes: noaaCnsMaxMinutes,
    parseO2Fraction: parseO2Fraction,
    formatNum: formatNum,
    pageLang: pageLang,
    langId: langId,
  };
})(typeof window !== "undefined" ? window : globalThis);
