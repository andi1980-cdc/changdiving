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
    el.textContent = "กรอกความดันสุดท้ายและเป้าหมาย O₂% ให้ถูกต้อง";
    return;
  }
  const fendD = fend / 100;
  if (fendD < 0.21) {
    el.innerHTML =
      "<span style='color:#c0392b'>เป้าหมายต่ำกว่า 21% O₂ ทำด้วย O₂ + อากาศอย่างเดียวไม่ได้ (อากาศมี 21% O₂)</span>";
    return;
  }

  if (mode === "empty") {
    const pO2 = (pend * (fendD - 0.21)) / 0.79;
    if (pO2 < 0 || pO2 > pend) {
      el.innerHTML =
        "<span style='color:#c0392b'>ตรวจสอบค่าที่กรอก — ความดันขั้น O₂ อยู่นอกช่วงที่ใช้ได้</span>";
      return;
    }
    el.innerHTML =
      "เติม<strong>O₂ บริสุทธิ์</strong>ถึง <strong>" +
      pO2.toFixed(1) +
      " bar abs</strong> แล้วเติม<strong>อากาศ</strong>ถึง <strong>" +
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
    el.textContent = "กรอกความดันถังปัจจุบัน (bar แอบโซลูต) และ O₂% ปัจจุบัน";
    return;
  }
  const f0D = f0 / 100;
  const p1 = (pend * (fendD - 0.21) - p0 * (f0D - 1)) / 0.79;
  if (p1 < p0 - 1e-6) {
    el.innerHTML =
      "<span style='color:#c0392b'>O₂ แล้วอากาศ: อาจต้องลดความดอก่อน (เช่น ระบาย) หรือใช้ขั้นตอนอื่น — ขั้น O₂ จะต่ำกว่าความดันปัจจุบัน</span>";
    return;
  }
  if (p1 > pend + 1e-6) {
    el.innerHTML =
      "<span style='color:#c0392b'>ไม่สอดคล้อง: ขั้น O₂ เกินความดันสุดท้าย ตรวจสอบความดันและมิกซ์</span>";
    return;
  }
  const delta = p1 - p0;
  el.innerHTML =
    "เติม<strong>O₂ บริสุทธิ์</strong>จาก <strong>" +
    p0.toFixed(1) +
    " → " +
    p1.toFixed(1) +
    " bar abs</strong> (+" +
    delta.toFixed(1) +
    " bar O₂) แล้วเติม<strong>อากาศ</strong>ถึง <strong>" +
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
    el.textContent = "กรอกความดันสุดท้ายและเป้าหมาย O₂% ให้ถูกต้อง";
    return;
  }
  const fendD = fend / 100;

  if (mode === "empty") {
    el.innerHTML =
      "ตั้งแก๊สเข้าต่อเนื่องที่ <strong>" +
      fend.toFixed(1) +
      "% O₂</strong> (เท่าเป้าหมาย) สำหรับแบบจำลองถังเปล่า";
    return;
  }

  const p0 = parseFloat(document.getElementById("nb-cf-p0").value);
  const f0 = parseFloat(document.getElementById("nb-cf-f0").value);
  if (!Number.isFinite(p0) || p0 <= 0 || p0 >= pend) {
    el.textContent = "ความดันปัจจุบันต้องมากกว่า 0 และน้อยกว่าความดันสุดท้าย";
    return;
  }
  if (!Number.isFinite(f0) || f0 < 0 || f0 > 100) {
    el.textContent = "กรอก O₂% ในถังปัจจุบัน";
    return;
  }
  const f0D = f0 / 100;
  const denom = pend - p0;
  const fin = (pend * fendD - p0 * f0D) / denom;
  if (fin < 0 || fin > 1) {
    el.innerHTML =
      "<span style='color:#c0392b'>ไม่มี O₂% ที่จุดเข้า (0–100%) ที่ทำชุดค่านี้ได้ — ตรวจสอบความดันและมิกซ์</span>";
    return;
  }
  el.innerHTML =
    "ตั้งมิกซ์เข้าประมาณ <strong>" +
    (fin * 100).toFixed(2) +
    "% O₂</strong> ขณะเติมจาก <strong>" +
    p0.toFixed(1) +
    " → " +
    pend.toFixed(1) +
    " bar abs</strong> → ~<strong>" +
    fend.toFixed(1) +
    "% O₂</strong> ในถัง";
}

function nbCalcMOD() {
  const o2 = parseFloat(document.getElementById("nb-mod-o2").value);
  const ppo2 = parseFloat(document.getElementById("nb-mod-ppo2").value);
  const el = document.getElementById("nb-mod-result");
  if (!Number.isFinite(o2) || o2 <= 0 || !Number.isFinite(ppo2) || ppo2 <= 0) {
    el.textContent = "กรอก O₂% และ PPO₂ สูงสุด";
    return;
  }
  const mod = (ppo2 / (o2 / 100) - 1) * 10;
  el.innerHTML =
    "MOD ≈ <strong>" +
    mod.toFixed(1) +
    " m</strong> (ความลึกสูงสุดที่ <strong>" +
    ppo2.toFixed(2) +
    " bar</strong> PPO₂ กับ <strong>" +
    o2.toFixed(1) +
    "% O₂</strong>).";
}
