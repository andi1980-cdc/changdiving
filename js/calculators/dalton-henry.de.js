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
        "Umgebungsdruck und O₂-Anteil eingeben, um Partialdrücke zu sehen.";
      n2Out.textContent = "";
      return;
    }
    if (P <= 0) {
      o2Out.textContent = "Umgebungsdruck muss größer als 0 bar absolut sein.";
      n2Out.textContent = "";
      return;
    }
    if (P > 100) {
      o2Out.textContent =
        "Bitte einen plausiblen Umgebungsdruck eingeben (z. B. unter 100 bar für dieses Tool).";
      n2Out.textContent = "";
      return;
    }
    if (FO2 <= 0 || FO2 >= 1) {
      o2Out.textContent =
        "O₂-Anteil muss zwischen 0 und 1 liegen (z. B. 0,21 Luft, 0,32 EAN32).";
      n2Out.textContent = "";
      return;
    }
    var FN2 = 1 - FO2;
    var pO2 = P * FO2;
    var pN2 = P * FN2;
    o2Out.textContent =
      "O₂-Partialdruck ≈ " +
      pO2.toFixed(2) +
      " bar  (" +
      FO2.toFixed(2) +
      " × " +
      P.toFixed(2) +
      " bar)";
    n2Out.textContent =
      "N₂-Partialdruck ≈ " +
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
