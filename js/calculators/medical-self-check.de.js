var MEDICAL_I18N = {
  emailTitleOn: "E-Mail-App mit Ihren Ergebnissen öffnen",
  emailTitleOff:
    "Bitte Name, Geburtsdatum, alle Fragen und die Bestätigung ausfüllen",
  keepGoing: "Weiter so…",
  answeredOf: "Beantwortet {a} von {t} Hauptfragen.",
  almost: "Fast geschafft…",
  almostBody:
    "Bitte beantworten Sie auch die Folgefragen, die nach einem Ja geöffnet wurden.",
  docTitle: "Ärztliche Beurteilung ist erforderlich",
  docBody:
    'Drucken Sie den <a href="/docs/Medical_Questionnaire.pdf" target="_blank" rel="noopener">Medical Questionnaire PDF<\/a>, lassen Sie sich tauchtauglich untersuchen und bringen Sie die unterschriebenen Unterlagen vor dem Tauchen zu Chang Diving. Bestätigen Sie unten und senden Sie die Ergebnisse per <strong>E-Mail an Chang Diving<\/strong>. · <a href="/de/contact/">Kontakt<\/a>',
  okTitle: "Laut diesem Screening kein Arzt nötig",
  okBody:
    "Bestätigen Sie unten und senden Sie die Ergebnisse per <strong>E-Mail an Chang Diving</strong> — diese E-Mail-Erklärung reicht für dieses Screening. Zusätzliches Medical-Questionnaire-Papier ist nur nötig, wenn wir danach fragen.",
  mailAlert:
    "Bitte Name und Geburtsdatum eintragen, alle Fragen beantworten und die Bestätigung anhaken.",
  mailSubjDoc: "Medical Self-Check Ergebnisse – Arzt erforderlich",
  mailSubjOk: "Medical Self-Check Ergebnisse – Screening klar",
  summaryTitle: "Diver Medical Self-Check Ergebnisse",
  pageUrl:
    "https://changdiving.com/de/faqs/faq-diving-health-safety-thailand/#medical-self-check",
  outcomeDoc: "Ergebnis: Ärztliche Beurteilung ist erforderlich",
  outcomeOk: "Ergebnis: Laut Screening kein Arzt nötig",
  nameLabel: "Vor- und Nachname: ",
  dobLabel: "Geburtsdatum: ",
  declareLineOk:
    "Erklärung: Ich bestätige hiermit die Richtigkeit und Vollständigkeit meiner Angaben nach bestem Wissen und Gewissen. Bestätigt: Ja",
  declareLineDoc:
    "Zusätzliche Bestätigung: Ich verstehe, dass eine ärztliche Beurteilung erforderlich ist. Ich drucke den Medical Questionnaire PDF aus und bringe die unterschriebene Tauchtauglichkeitsbescheinigung zu Chang Diving.",
  declareTextOk:
    "Ich bestätige hiermit die Richtigkeit und Vollständigkeit meiner Angaben nach bestem Wissen und Gewissen.",
  declareTextDoc:
    "Ich bestätige hiermit die Richtigkeit und Vollständigkeit meiner Angaben nach bestem Wissen und Gewissen. Ich verstehe, dass eine ärztliche Beurteilung erforderlich ist — ich drucke den Medical Questionnaire PDF aus und bringe ihn zu meinem Arzt für die Tauchtauglichkeitsbescheinigung.",
  datesLine: "Gewünschter Kurs oder Tauchtermine:",
  phoneLine: "Telefon:",
  answersHdr: "--- Antworten ---",
  noteOk:
    "Nächster Schritt: Screening klar — diese E-Mail-Bestätigung ist meine Selbst-Check-Erklärung. Zusätzliches Medical-Questionnaire-Papier ist nur nötig, wenn Chang Diving danach fragt.",
  noteDoc:
    "Nächster Schritt: Ärztliche Beurteilung erforderlich. PDF drucken: https://changdiving.com/docs/Medical_Questionnaire.pdf und Tauchtauglichkeit vor dem Tauchen einholen.",
  trunc:
    "[Gekürzt – Liste war zu lang. Bei Arztpflicht bitte zusätzlich PDF und Attest mitbringen.]",
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
