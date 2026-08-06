(function () {
  var pIn = document.getElementById("dalton-ambient");
  var fIn = document.getElementById("dalton-o2-frac");
  var o2Out = document.getElementById("dalton-partial-o2");
  var n2Out = document.getElementById("dalton-partial-n2");
  var depthWater = document.getElementById("dalton-depth-water");
  var depthM = document.getElementById("dalton-depth-m");
  var depthApply = document.getElementById("dalton-depth-apply");
  if (!pIn || !fIn || !o2Out || !n2Out) return;

  function update() {
    var pStr = pIn.value.trim().replace(",", ".");
    var fStr = fIn.value.trim().replace(",", ".");
    var P = pStr === "" ? NaN : parseFloat(pStr);
    var FO2 = fStr === "" ? NaN : parseFloat(fStr);
    if (pStr === "" || fStr === "" || !isFinite(P) || !isFinite(FO2)) {
      o2Out.textContent =
        "Enter ambient pressure and O₂ fraction to see partial pressures.";
      n2Out.textContent = "";
      return;
    }
    if (P <= 0) {
      o2Out.textContent =
        "Ambient pressure must be greater than 0 bar absolute.";
      n2Out.textContent = "";
      return;
    }
    if (P > 100) {
      o2Out.textContent =
        "Enter a plausible ambient pressure (e.g. under 100 bar for this tool).";
      n2Out.textContent = "";
      return;
    }
    if (FO2 <= 0 || FO2 >= 1) {
      o2Out.textContent =
        "O₂ fraction must be between 0 and 1 (e.g. 0.21 for air, 0.32 for EAN32).";
      n2Out.textContent = "";
      return;
    }
    var FN2 = 1 - FO2;
    var pO2 = P * FO2;
    var pN2 = P * FN2;
    o2Out.textContent =
      "O₂ partial pressure ≈ " +
      pO2.toFixed(2) +
      " bar  (" +
      FO2.toFixed(2) +
      " × " +
      P.toFixed(2) +
      " bar)";
    n2Out.textContent =
      "N₂ partial pressure ≈ " +
      pN2.toFixed(2) +
      " bar  (" +
      FN2.toFixed(2) +
      " × " +
      P.toFixed(2) +
      " bar)";
  }

  function applyDepthToAmbient() {
    if (!depthWater || !depthM || !depthApply) return;
    var mPerBar = parseFloat(depthWater.value, 10);
    var dStr = depthM.value.trim().replace(",", ".");
    var depth = dStr === "" ? NaN : parseFloat(dStr, 10);
    if (!isFinite(mPerBar) || mPerBar <= 0) return;
    if (!isFinite(depth) || depth < 0) return;
    var ata = 1 + depth / mPerBar;
    pIn.value = parseFloat(ata.toFixed(3), 10).toString();
    update();
  }

  pIn.addEventListener("input", update);
  pIn.addEventListener("change", update);
  fIn.addEventListener("input", update);
  fIn.addEventListener("change", update);
  if (depthApply) {
    depthApply.addEventListener("click", applyDepthToAmbient);
  }
  update();
})();
