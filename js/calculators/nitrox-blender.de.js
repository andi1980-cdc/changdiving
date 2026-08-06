function nbShowPPResidual(show) {
  const d = show ? "block" : "none";
  document.getElementById("nb-pp-wrap-p0").style.display = d;
  document.getElementById("nb-pp-wrap-f0").style.display = d;
}

function nbShowCFResidual(show) {
  const d = show ? "block" : "none";
  document.getElementById("nb-cf-wrap-p0").style.display = d;
  document.getElementById("nb-cf-wrap-f0").style.display = d;
}

function nbCalcPartialPressure() {
  const mode = document.getElementById("nb-pp-mode").value;
  const pend = parseFloat(document.getElementById("nb-pp-pend").value);
  const fend = parseFloat(document.getElementById("nb-pp-fend").value);
  const el = document.getElementById("nb-pp-result");
  nbShowPPResidual(mode === "residual");

  if (
    !Number.isFinite(pend) ||
    pend <= 0 ||
    !Number.isFinite(fend) ||
    fend < 0 ||
    fend > 100
  ) {
    el.textContent = "Gültigen Enddruck und Ziel-O₂-% eingeben.";
    return;
  }
  const fendD = fend / 100;
  if (fendD < 0.21) {
    el.innerHTML =
      "<span style='color:#c0392b'>Ziel unter 21 % O₂ ist mit O₂ + Luft (21 %) nicht erreichbar.</span>";
    return;
  }

  if (mode === "empty") {
    const pO2 = (pend * (fendD - 0.21)) / 0.79;
    if (pO2 < 0 || pO2 > pend) {
      el.innerHTML =
        "<span style='color:#c0392b'>Eingaben prüfen — O₂-Schritt außerhalb des gültigen Bereichs.</span>";
      return;
    }
    el.innerHTML =
      "Mit <strong>reinem O₂</strong> auf <strong>" +
      pO2.toFixed(1) +
      " bar abs</strong> füllen, dann mit <strong>Luft</strong> auf <strong>" +
      pend.toFixed(1) +
      " bar abs</strong> auffüllen → ~<strong>" +
      fend.toFixed(1) +
      "% O₂</strong>.";
    return;
  }

  const p0 = parseFloat(document.getElementById("nb-pp-p0").value);
  const f0 = parseFloat(document.getElementById("nb-pp-f0").value);
  if (
    !Number.isFinite(p0) ||
    p0 <= 0 ||
    !Number.isFinite(f0) ||
    f0 < 0 ||
    f0 > 100
  ) {
    el.textContent =
      "Aktuellen Flaschendruck (bar abs.) und aktuelles O₂-% eingeben.";
    return;
  }
  const f0D = f0 / 100;
  const p1 = (pend * (fendD - 0.21) - p0 * (f0D - 1)) / 0.79;
  if (p1 < p0 - 1e-6) {
    el.innerHTML =
      "<span style='color:#c0392b'>O₂-dann-Luft: Ziel ggf. erst Druck reduzieren (z. B. entlüften) oder anderes Verfahren — O₂-Schritt läge unter aktuellem Druck.</span>";
    return;
  }
  if (p1 > pend + 1e-6) {
    el.innerHTML =
      "<span style='color:#c0392b'>Widerspruch: O₂-Schritt übersteigt Enddruck. Drücke und Mischungen prüfen.</span>";
    return;
  }
  const delta = p1 - p0;
  el.innerHTML =
    "<strong>Reines O₂</strong> von <strong>" +
    p0.toFixed(1) +
    " → " +
    p1.toFixed(1) +
    " bar abs</strong> (+" +
    delta.toFixed(1) +
    " bar O₂), dann mit <strong>Luft</strong> auf <strong>" +
    pend.toFixed(1) +
    " bar abs</strong> auffüllen → ~<strong>" +
    fend.toFixed(1) +
    "% O₂</strong>.";
}

function nbCalcContinuousFlow() {
  const mode = document.getElementById("nb-cf-mode").value;
  const pend = parseFloat(document.getElementById("nb-cf-pend").value);
  const fend = parseFloat(document.getElementById("nb-cf-fend").value);
  const el = document.getElementById("nb-cf-result");
  nbShowCFResidual(mode === "residual");

  if (
    !Number.isFinite(pend) ||
    pend <= 0 ||
    !Number.isFinite(fend) ||
    fend < 0 ||
    fend > 100
  ) {
    el.textContent = "Gültigen Enddruck und Ziel-O₂-% eingeben.";
    return;
  }
  const fendD = fend / 100;

  if (mode === "empty") {
    el.innerHTML =
      "Kontinuierlichen Zulauf auf <strong>" +
      fend.toFixed(1) +
      "% O₂</strong> einstellen (wie Ziel) für dieses idealisierte Leerflaschen-Modell.";
    return;
  }

  const p0 = parseFloat(document.getElementById("nb-cf-p0").value);
  const f0 = parseFloat(document.getElementById("nb-cf-f0").value);
  if (!Number.isFinite(p0) || p0 <= 0 || p0 >= pend) {
    el.textContent =
      "Aktueller Druck muss größer 0 und kleiner als der Enddruck sein.";
    return;
  }
  if (!Number.isFinite(f0) || f0 < 0 || f0 > 100) {
    el.textContent = "Aktuelles O₂-% im Zylinder eingeben.";
    return;
  }
  const f0D = f0 / 100;
  const denom = pend - p0;
  const fin = (pend * fendD - p0 * f0D) / denom;
  if (fin < 0 || fin > 1) {
    el.innerHTML =
      "<span style='color:#c0392b'>Kein physisches Zulauf-O₂-% (0–100 %) für diese Kombination — Drücke und Mischungen prüfen.</span>";
    return;
  }
  el.innerHTML =
    "Zulaufmischung auf ca. <strong>" +
    (fin * 100).toFixed(2) +
    "% O₂</strong> beim Füllen von <strong>" +
    p0.toFixed(1) +
    " → " +
    pend.toFixed(1) +
    " bar abs</strong> einstellen → ~<strong>" +
    fend.toFixed(1) +
    "% O₂</strong> in der Flasche.";
}

function nbCalcMOD() {
  const o2 = parseFloat(document.getElementById("nb-mod-o2").value);
  const ppo2 = parseFloat(document.getElementById("nb-mod-ppo2").value);
  const el = document.getElementById("nb-mod-result");
  if (!Number.isFinite(o2) || o2 <= 0 || !Number.isFinite(ppo2) || ppo2 <= 0) {
    el.textContent = "O₂-% und max. PPO₂ eingeben.";
    return;
  }
  const mod = (ppo2 / (o2 / 100) - 1) * 10;
  el.innerHTML =
    "MOD ≈ <strong>" +
    mod.toFixed(1) +
    " m</strong> (max. Tiefe bei <strong>" +
    ppo2.toFixed(2) +
    " bar</strong> PPO₂ mit <strong>" +
    o2.toFixed(1) +
    "% O₂</strong>).";
}
