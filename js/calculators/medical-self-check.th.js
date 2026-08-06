var MEDICAL_I18N = {
  emailTitleOn: "เปิดแอปอีเมลพร้อมผลลัพธ์ของคุณ",
  emailTitleOff: "กรุณากรอกชื่อ วันเกิด ตอบคำถามให้ครบ และติ๊กยืนยันก่อน",
  keepGoing: "ไปต่อเลย…",
  answeredOf: "ตอบแล้ว {a} จาก {t} คำถามหลัก",
  almost: "เกือบครบแล้ว…",
  almostBody: "กรุณาตอบคำถามติดตามที่เปิดขึ้นหลังจากตอบ ใช่ ด้วย",
  docTitle: "ต้องให้แพทย์ประเมิน",
  docBody:
    'พิมพ์ <a href="/docs/Medical_Questionnaire.pdf" target="_blank" rel="noopener">Medical Questionnaire PDF<\/a> นำไปพบแพทย์เพื่อรับใบรับรองความพร้อมในการดำน้ำ และนำเอกสารที่ลงนามแล้วมาที่ Chang Diving ก่อนดำน้ำ ยืนยันด้านล่างแล้ว <strong>ส่งผลลัพธ์ทางอีเมล<\/strong> เพื่อเก็บคำตอบไว้ · <a href="/th/contact/">ติดต่อเรา<\/a>',
  okTitle: "ตามแบบคัดกรองนี้ยังไม่จำเป็นต้องพบแพทย์",
  okBody:
    "ยืนยันด้านล่างแล้ว <strong>ส่งผลลัพธ์ทางอีเมล</strong> ถึง Chang Diving — อีเมลยืนยันนี้เพียงพอสำหรับแบบคัดกรองนี้ ไม่ต้องกรอกกระดาษ Medical Questionnaire เพิ่ม เว้นแต่เราขอ",
  mailAlert: "กรุณากรอกชื่อและวันเกิด ตอบคำถามให้ครบ และติ๊กช่องยืนยันก่อน",
  mailSubjDoc: "Medical Self-Check results – physician required",
  mailSubjOk: "Medical Self-Check results – screening clear",
  summaryTitle: "Diver Medical Self-Check results",
  pageUrl:
    "https://changdiving.com/th/faqs/faq-diving-health-safety-thailand/#medical-self-check",
  outcomeDoc: "Screening outcome: Physician evaluation is required",
  outcomeOk: "Screening outcome: No physician required by this screening",
  nameLabel: "First and last name / ชื่อและนามสกุล: ",
  dobLabel: "Date of birth / วันเดือนปีเกิด: ",
  declareLineOk:
    "Declaration: I hereby confirm that the information I have provided is true and complete to the best of my knowledge. Confirmed: Yes",
  declareLineDoc:
    "Additional acknowledgment: I understand that a physician's evaluation is required. I will print the Medical Questionnaire PDF and bring the signed dive medical clearance to Chang Diving.",
  declareTextOk:
    "ข้าพเจ้าขอรับรองว่าข้อมูลที่ให้ไว้นี้ถูกต้องและครบถ้วนตามความรู้และความเชื่อที่ดีที่สุดของข้าพเจ้า",
  declareTextDoc:
    "ข้าพเจ้าขอรับรองว่าข้อมูลที่ให้ไว้นี้ถูกต้องและครบถ้วนตามความรู้และความเชื่อที่ดีที่สุดของข้าพเจ้า ข้าพเจ้าเข้าใจว่าต้องให้แพทย์ประเมิน — ข้าพเจ้าจะพิมพ์ Medical Questionnaire PDF และนำไปพบแพทย์เพื่อรับใบรับรองความพร้อมในการดำน้ำ",
  datesLine: "Preferred course or dive dates:",
  phoneLine: "Phone:",
  answersHdr: "--- Answers ---",
  noteOk:
    "Next step: Screening clear — this emailed confirmation is my self-check declaration. No additional Medical Questionnaire paper is required unless Chang Diving asks for it.",
  noteDoc:
    "Next step: Physician evaluation required. Print https://changdiving.com/docs/Medical_Questionnaire.pdf and obtain dive medical clearance before diving.",
  trunc:
    "[Truncated – full list was long. If physician required, also bring PDF and medical clearance.]",
};

function medicalGetMains() {
  var root = document.getElementById("cdc-medical-list");
  if (!root) return [];
  var mains = [];
  for (var m = 0; m < root.children.length; m++) {
    if (root.children[m].hasAttribute("data-q")) {
      mains.push(root.children[m]);
    }
  }
  return mains;
}

function medicalParseDob() {
  var dayEl = document.getElementById("cdc-medical-dob-day");
  var monthEl = document.getElementById("cdc-medical-dob-month");
  var yearEl = document.getElementById("cdc-medical-dob-year");
  var day = dayEl ? parseInt(String(dayEl.value).trim(), 10) : NaN;
  var month = monthEl ? parseInt(String(monthEl.value).trim(), 10) : NaN;
  var year = yearEl ? parseInt(String(yearEl.value).trim(), 10) : NaN;
  var now = new Date();
  var maxYear = now.getFullYear();
  if (
    !(
      day >= 1 &&
      day <= 31 &&
      month >= 1 &&
      month <= 12 &&
      year >= 1900 &&
      year <= maxYear
    )
  ) {
    return "";
  }
  var dt = new Date(year, month - 1, day);
  if (
    dt.getFullYear() !== year ||
    dt.getMonth() !== month - 1 ||
    dt.getDate() !== day ||
    dt > now
  ) {
    return "";
  }
  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }
  return year + "-" + pad(month) + "-" + pad(day);
}

function medicalGetIdentity() {
  var nameEl = document.getElementById("cdc-medical-name");
  var declareEl = document.getElementById("cdc-medical-declare");
  var name = nameEl ? nameEl.value.replace(/\s+/g, " ").trim() : "";
  var dob = medicalParseDob();
  var declared = declareEl ? !!declareEl.checked : false;
  return {
    name: name,
    dob: dob,
    declared: declared,
    ready: name.length >= 2 && !!dob && declared,
  };
}

function medicalUpdateDeclareText(needsPhysician) {
  var el = document.getElementById("cdc-medical-declare-text");
  if (!el) return;
  el.textContent = needsPhysician
    ? MEDICAL_I18N.declareTextDoc
    : MEDICAL_I18N.declareTextOk;
}

function medicalRefreshEmailGate() {
  var assess = medicalAssess();
  if (!assess.complete) {
    medicalSetEmailEnabled(false);
    return;
  }
  medicalUpdateDeclareText(assess.needsPhysician);
  medicalSetEmailEnabled(medicalGetIdentity().ready);
}

function medicalAssess() {
  var mains = medicalGetMains();
  var answered = 0;
  var incompleteBox = false;
  var needsPhysician = false;

  mains.forEach(function (li) {
    var ans = li.getAttribute("data-answered");
    if (ans === "yes" || ans === "no") answered++;
    var q = li.getAttribute("data-q");
    if ((q === "3" || q === "5" || q === "10") && ans === "yes") {
      needsPhysician = true;
    }
    var box = li.querySelector(".cdc-medical-followup");
    if (ans === "yes" && box) {
      var subs = box.querySelectorAll("li[data-sub]");
      var subAnswered = 0;
      subs.forEach(function (s) {
        var sa = s.getAttribute("data-answered");
        if (sa === "yes" || sa === "no") subAnswered++;
        if (sa === "yes") needsPhysician = true;
      });
      if (subAnswered < subs.length) incompleteBox = true;
    }
  });

  var complete =
    mains.length > 0 && answered === mains.length && !incompleteBox;

  return {
    mains: mains,
    answered: answered,
    incompleteBox: incompleteBox,
    needsPhysician: needsPhysician,
    complete: complete,
  };
}

function medicalShortText(el) {
  var p = el.querySelector("p");
  if (!p) return "";
  return (p.textContent || "").replace(/\s+/g, " ").trim();
}

function medicalBuildSummary() {
  var assess = medicalAssess();
  var id = medicalGetIdentity();
  var lines = [];
  lines.push(MEDICAL_I18N.summaryTitle);
  lines.push("Page: " + MEDICAL_I18N.pageUrl);
  lines.push("");
  lines.push(
    assess.needsPhysician ? MEDICAL_I18N.outcomeDoc : MEDICAL_I18N.outcomeOk
  );
  lines.push("");
  lines.push(MEDICAL_I18N.nameLabel + id.name);
  lines.push(MEDICAL_I18N.dobLabel + id.dob);
  lines.push(MEDICAL_I18N.declareLineOk);
  if (assess.needsPhysician) {
    lines.push(MEDICAL_I18N.declareLineDoc);
  }
  lines.push(MEDICAL_I18N.datesLine);
  lines.push(MEDICAL_I18N.phoneLine);
  lines.push("");
  lines.push(MEDICAL_I18N.answersHdr);

  assess.mains.forEach(function (li) {
    var q = li.getAttribute("data-q");
    var ans = (li.getAttribute("data-answered") || "—").toUpperCase();
    var text = medicalShortText(li);
    if (text.length > 110) text = text.slice(0, 107) + "...";
    lines.push("Q" + q + " [" + ans + "] " + text);
    if (ans === "YES") {
      var box = li.querySelector(".cdc-medical-followup");
      if (box) {
        box.querySelectorAll("li[data-sub]").forEach(function (s) {
          var sa = (s.getAttribute("data-answered") || "—").toUpperCase();
          var st = medicalShortText(s);
          if (st.length > 90) st = st.slice(0, 87) + "...";
          lines.push(
            "  - " + s.getAttribute("data-sub") + " [" + sa + "] " + st
          );
        });
      }
    }
  });

  lines.push("");
  lines.push(
    assess.needsPhysician ? MEDICAL_I18N.noteDoc : MEDICAL_I18N.noteOk
  );
  return lines.join("\n");
}

function medicalSetEmailEnabled(enabled) {
  var btn = document.getElementById("cdc-medical-email");
  if (!btn) return;
  btn.disabled = !enabled;
  btn.title = enabled ? MEDICAL_I18N.emailTitleOn : MEDICAL_I18N.emailTitleOff;
}

function medicalPick(button, value) {
  var li = button.closest("li");
  if (!li) return;
  var row = button.parentElement;
  if (!row) return;
  var buttons = row.querySelectorAll(".cdc-quiz__button");
  buttons.forEach(function (btn) {
    btn.classList.add("disabled");
    btn.onclick = null;
    btn.classList.remove("correct", "incorrect");
  });
  if (value === "yes") button.classList.add("incorrect");
  else button.classList.add("correct");

  li.setAttribute("data-answered", value);

  var followup = null;
  for (var i = 0; i < li.children.length; i++) {
    if (li.children[i].classList.contains("cdc-medical-followup")) {
      followup = li.children[i];
      break;
    }
  }
  if (followup) {
    if (value === "yes") {
      followup.classList.add("show");
    } else {
      followup.classList.remove("show");
      followup.querySelectorAll("li[data-sub]").forEach(function (sub) {
        sub.removeAttribute("data-answered");
        sub.querySelectorAll(".cdc-quiz__button").forEach(function (btn) {
          btn.classList.remove("disabled", "correct", "incorrect");
          var ans = btn.getAttribute("data-answer");
          btn.onclick = function () {
            medicalPick(btn, ans);
          };
        });
      });
    }
  }
  medicalUpdateResult();
}

function medicalUpdateResult() {
  var result = document.getElementById("cdc-medical-result");
  if (!result) return;
  var assess = medicalAssess();
  var mains = assess.mains;

  result.classList.remove("show", "correct-answer", "incorrect-answer");
  result.style.display = "none";
  medicalSetEmailEnabled(false);

  if (assess.answered === 0) return;

  if (assess.answered < mains.length) {
    result.innerHTML =
      "<strong>" +
      MEDICAL_I18N.keepGoing +
      "</strong><br />" +
      MEDICAL_I18N.answeredOf
        .replace("{a}", String(assess.answered))
        .replace("{t}", String(mains.length));
    result.classList.add("show", "incorrect-answer");
    result.style.display = "block";
    return;
  }
  if (assess.incompleteBox) {
    result.innerHTML =
      "<strong>" +
      MEDICAL_I18N.almost +
      "</strong><br />" +
      MEDICAL_I18N.almostBody;
    result.classList.add("show", "incorrect-answer");
    result.style.display = "block";
    return;
  }

  medicalRefreshEmailGate();

  if (assess.needsPhysician) {
    result.innerHTML =
      "<strong>" +
      MEDICAL_I18N.docTitle +
      "</strong><br />" +
      MEDICAL_I18N.docBody;
    result.classList.add("show", "incorrect-answer");
  } else {
    result.innerHTML =
      "<strong>" +
      MEDICAL_I18N.okTitle +
      "</strong><br />" +
      MEDICAL_I18N.okBody;
    result.classList.add("show", "correct-answer");
  }
  result.style.display = "block";
}

function medicalEmailResults() {
  var assess = medicalAssess();
  var id = medicalGetIdentity();
  if (!assess.complete || !id.ready) {
    alert(MEDICAL_I18N.mailAlert);
    return;
  }
  var subject =
    (assess.needsPhysician
      ? MEDICAL_I18N.mailSubjDoc
      : MEDICAL_I18N.mailSubjOk) +
    " – " +
    id.name;
  var body = medicalBuildSummary();
  if (body.length > 1800) {
    body = body.slice(0, 1750) + "\n\n" + MEDICAL_I18N.trunc;
  }
  var href =
    "mailto:info@changdiving.com?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body);
  window.location.href = href;
}

function medicalReset() {
  var root = document.getElementById("cdc-medical-list");
  if (!root) return;
  root.querySelectorAll("li[data-q], li[data-sub]").forEach(function (li) {
    li.removeAttribute("data-answered");
    li.querySelectorAll(".cdc-quiz__button").forEach(function (btn) {
      btn.classList.remove("disabled", "correct", "incorrect");
      var ans = btn.getAttribute("data-answer");
      btn.onclick = function () {
        medicalPick(btn, ans);
      };
    });
    var box = li.querySelector(".cdc-medical-followup");
    if (box) box.classList.remove("show");
  });
  var nameEl = document.getElementById("cdc-medical-name");
  var declareEl = document.getElementById("cdc-medical-declare");
  if (nameEl) nameEl.value = "";
  [
    "cdc-medical-dob-day",
    "cdc-medical-dob-month",
    "cdc-medical-dob-year",
  ].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
  });
  if (declareEl) declareEl.checked = false;
  medicalUpdateDeclareText(false);
  var result = document.getElementById("cdc-medical-result");
  if (result) {
    result.classList.remove("show", "correct-answer", "incorrect-answer");
    result.style.display = "none";
    result.innerHTML = "";
  }
  medicalSetEmailEnabled(false);
}

(function medicalBindIdentity() {
  [
    "cdc-medical-name",
    "cdc-medical-dob-day",
    "cdc-medical-dob-month",
    "cdc-medical-dob-year",
    "cdc-medical-declare",
  ].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", medicalRefreshEmailGate);
    el.addEventListener("change", medicalRefreshEmailGate);
  });
})();
