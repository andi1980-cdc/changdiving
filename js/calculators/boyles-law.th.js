(function () {
  var sel = document.getElementById("pressure-calc-water");
  var inp = document.getElementById("pressure-calc-depth");
  var out = document.getElementById("pressure-calc-result");
  if (!sel || !inp || !out) return;

  function update() {
    var mPerBar = parseFloat(sel.value);
    var depthStr = inp.value.trim().replace(",", ".");
    var depth = depthStr === "" ? NaN : parseFloat(depthStr);
    if (!mPerBar || mPerBar <= 0) return;
    if (depthStr === "" || !isFinite(depth) || depth < 0) {
      out.textContent =
        "ใส่ความลึกเพื่อดูความดันสัมบูรณ์ ปริมาตรก๊าซ และความหนาแน่น (เทียบผิวน้ำ)";
      return;
    }
    var ata = 1 + depth / mPerBar;
    var relVol = 1 / ata;
    out.textContent =
      "≈ " +
      ata.toFixed(2) +
      " บาร์รวม (ATA)\n" +
      "ปริมาตรก๊าซ (เทียบผิวน้ำ = 1): ≈ " +
      relVol.toFixed(3) +
      "\n" +
      "ความหนาแน่นก๊าซ (เทียบผิวน้ำ): ≈ " +
      ata.toFixed(2) +
      "×";
  }

  sel.addEventListener("change", update);
  inp.addEventListener("input", update);
  inp.addEventListener("change", update);
})();

(function () {
  var sel = document.getElementById("bcd-water");
  var dKnown = document.getElementById("bcd-depth-known");
  var vIn = document.getElementById("bcd-volume");
  var dNew = document.getElementById("bcd-depth-new");
  var outCmp = document.getElementById("bcd-result-compare");
  var outSurf = document.getElementById("bcd-result-surface");
  if (!sel || !dKnown || !vIn || !dNew || !outCmp || !outSurf) return;

  function parsePositiveNum(el, allowZeroDepth) {
    var s = el.value.trim().replace(",", ".");
    if (s === "") return NaN;
    var n = parseFloat(s);
    if (!isFinite(n)) return NaN;
    if (n < 0) return NaN;
    if (!allowZeroDepth && n === 0 && el.id === "bcd-volume") return NaN;
    return n;
  }

  function pAbs(depthM, mPerBar) {
    return 1 + Math.max(0, depthM) / mPerBar;
  }

  function update() {
    var mPerBar = parseFloat(sel.value);
    if (!mPerBar || mPerBar <= 0) return;

    var depth1 = parsePositiveNum(dKnown, true);
    var vol1 = parsePositiveNum(vIn, false);
    var depth2 = parsePositiveNum(dNew, true);

    if (!isFinite(depth1) || !isFinite(vol1) || vol1 <= 0) {
      outCmp.textContent =
        "ใส่ความลึกและปริมาตรที่มากกว่าศูนย์เพื่อเปรียบเทียบ";
      outSurf.textContent = "";
      return;
    }

    var p1 = pAbs(depth1, mPerBar);
    var vAtSurf = (vol1 * p1) / pAbs(0, mPerBar);

    if (!isFinite(depth2)) {
      outCmp.textContent = "ใส่ความลึกใหม่เพื่อดูปริมาตรที่ความลึกนั้น";
      outSurf.textContent =
        "ที่ผิวน้ำ (0 m, ความดันสัมบูรณ์ 1 บาร์): ≈ " +
        vAtSurf.toFixed(2) +
        " L";
      return;
    }

    var p2 = pAbs(depth2, mPerBar);
    if (p2 <= 0) {
      outCmp.textContent = "";
      outSurf.textContent = "";
      return;
    }
    var vol2 = (vol1 * p1) / p2;
    outCmp.textContent =
      "ความลึก " +
      depth2 +
      " m (~" +
      p2.toFixed(2) +
      " บาร์รวม): ≈ " +
      vol2.toFixed(2) +
      " L";
    outSurf.textContent =
      "ที่ผิวน้ำ (0 m, ความดันสัมบูรณ์ 1 บาร์): ≈ " + vAtSurf.toFixed(2) + " L";
  }

  sel.addEventListener("change", update);
  dKnown.addEventListener("input", update);
  dKnown.addEventListener("change", update);
  vIn.addEventListener("input", update);
  vIn.addEventListener("change", update);
  dNew.addEventListener("input", update);
  dNew.addEventListener("change", update);
  update();
})();
