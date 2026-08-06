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
    el.textContent = "Enter valid final pressure and target O₂%.";
    return;
  }
  const fendD = fend / 100;
  if (fendD < 0.21) {
    el.innerHTML =
      "<span style='color:#c0392b'>Target below 21% O₂ cannot be made by adding O₂ and air only (air is 21%).</span>";
    return;
  }

  if (mode === "empty") {
    const pO2 = (pend * (fendD - 0.21)) / 0.79;
    if (pO2 < 0 || pO2 > pend) {
      el.innerHTML =
        "<span style='color:#c0392b'>Check inputs — O₂ step pressure out of range.</span>";
      return;
    }
    el.innerHTML =
      "Fill with <strong>pure O₂</strong> to <strong>" +
      pO2.toFixed(1) +
      " bar abs</strong>, then top with <strong>air</strong> to <strong>" +
      pend.toFixed(1) +
      " bar abs</strong> → ~<strong>" +
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
      "Enter current cylinder pressure (bar abs) and current O₂%.";
    return;
  }
  const f0D = f0 / 100;
  const p1 = (pend * (fendD - 0.21) - p0 * (f0D - 1)) / 0.79;
  if (p1 < p0 - 1e-6) {
    el.innerHTML =
      "<span style='color:#c0392b'>O₂-then-air to this target needs a lower pressure first (e.g. vent) or a different procedure — P(O₂ step) would be below current pressure.</span>";
    return;
  }
  if (p1 > pend + 1e-6) {
    el.innerHTML =
      "<span style='color:#c0392b'>Inconsistent: O₂ step exceeds final pressure. Verify pressures and mixes.</span>";
    return;
  }
  const delta = p1 - p0;
  el.innerHTML =
    "Add <strong>pure O₂</strong> from <strong>" +
    p0.toFixed(1) +
    " → " +
    p1.toFixed(1) +
    " bar abs</strong> (+" +
    delta.toFixed(1) +
    " bar O₂), then top with <strong>air</strong> to <strong>" +
    pend.toFixed(1) +
    " bar abs</strong> → ~<strong>" +
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
    el.textContent = "Enter valid final pressure and target O₂%.";
    return;
  }
  const fendD = fend / 100;

  if (mode === "empty") {
    el.innerHTML =
      "Set continuous inlet to <strong>" +
      fend.toFixed(1) +
      "% O₂</strong> (same as target) for this idealized empty-cylinder model.";
    return;
  }

  const p0 = parseFloat(document.getElementById("nb-cf-p0").value);
  const f0 = parseFloat(document.getElementById("nb-cf-f0").value);
  if (!Number.isFinite(p0) || p0 <= 0 || p0 >= pend) {
    el.textContent =
      "Current pressure must be greater than 0 and less than final pressure.";
    return;
  }
  if (!Number.isFinite(f0) || f0 < 0 || f0 > 100) {
    el.textContent = "Enter current O₂% in the cylinder.";
    return;
  }
  const f0D = f0 / 100;
  const denom = pend - p0;
  const fin = (pend * fendD - p0 * f0D) / denom;
  if (fin < 0 || fin > 1) {
    el.innerHTML =
      "<span style='color:#c0392b'>No physical inlet O₂% (0–100%) achieves this combination — check pressures and mixes.</span>";
    return;
  }
  el.innerHTML =
    "Set inlet mix to about <strong>" +
    (fin * 100).toFixed(2) +
    "% O₂</strong> while filling from <strong>" +
    p0.toFixed(1) +
    " → " +
    pend.toFixed(1) +
    " bar abs</strong> → ~<strong>" +
    fend.toFixed(1) +
    "% O₂</strong> in the cylinder.";
}

function nbCalcMOD() {
  const o2 = parseFloat(document.getElementById("nb-mod-o2").value);
  const ppo2 = parseFloat(document.getElementById("nb-mod-ppo2").value);
  const el = document.getElementById("nb-mod-result");
  if (!Number.isFinite(o2) || o2 <= 0 || !Number.isFinite(ppo2) || ppo2 <= 0) {
    el.textContent = "Enter O₂% and max PPO₂.";
    return;
  }
  const mod = (ppo2 / (o2 / 100) - 1) * 10;
  el.innerHTML =
    "MOD ≈ <strong>" +
    mod.toFixed(1) +
    " m</strong> (max depth at <strong>" +
    ppo2.toFixed(2) +
    " bar</strong> PPO₂ with <strong>" +
    o2.toFixed(1) +
    "% O₂</strong>).";
}
