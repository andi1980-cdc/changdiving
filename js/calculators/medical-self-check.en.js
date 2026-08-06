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

function medicalAssess() {
  var mains = medicalGetMains();
  var answered = 0;
  var incompleteBox = false;
  var needsPhysician = false;
  var complete = false;

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

  complete = mains.length > 0 && answered === mains.length && !incompleteBox;

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
  lines.push("Diver Medical Self-Check results");
  lines.push(
    "Page: https://changdiving.com/en/faqs/faq-diving-health-safety-thailand/#medical-self-check"
  );
  lines.push("");
  lines.push(
    "Screening outcome: " +
      (assess.needsPhysician
        ? "Physician evaluation recommended"
        : "No physician required by this screening")
  );
  lines.push("");
  lines.push("First and last name: " + id.name);
  lines.push("Date of birth: " + id.dob);
  lines.push(
    "Declaration: I hereby confirm that the information I have provided is true and complete to the best of my knowledge. Confirmed: Yes"
  );
  if (assess.needsPhysician) {
    lines.push(
      "Additional acknowledgment: I understand that a physician's evaluation is required. I will print the Medical Questionnaire PDF and bring the signed dive medical clearance to Chang Diving."
    );
  }
  lines.push("Preferred course or dive dates:");
  lines.push("Phone:");
  lines.push("");
  lines.push("--- Answers ---");

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
  if (assess.needsPhysician) {
    lines.push(
      "Next step: Physician evaluation required. Print https://changdiving.com/docs/Medical_Questionnaire.pdf and obtain dive medical clearance before diving."
    );
  } else {
    lines.push(
      "Next step: Screening clear — this emailed confirmation is my self-check declaration. No additional Medical Questionnaire paper is required unless Chang Diving asks for it."
    );
  }
  return lines.join("\n");
}

function medicalSetEmailEnabled(enabled) {
  var btn = document.getElementById("cdc-medical-email");
  if (!btn) return;
  btn.disabled = !enabled;
  btn.title = enabled
    ? "Open your email app with your results"
    : "Complete name, date of birth, all questions, and the confirmation first";
}

function medicalUpdateDeclareText(needsPhysician) {
  var el = document.getElementById("cdc-medical-declare-text");
  if (!el) return;
  if (needsPhysician) {
    el.textContent =
      "I hereby confirm that the information I have provided is true and complete to the best of my knowledge. I understand that a physician’s evaluation is required — I will print the Medical Questionnaire PDF and bring it to my doctor for dive medical clearance.";
  } else {
    el.textContent =
      "I hereby confirm that the information I have provided is true and complete to the best of my knowledge.";
  }
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
      "<strong>Keep going…</strong><br />Answered " +
      assess.answered +
      " of " +
      mains.length +
      " main questions.";
    result.classList.add("show", "incorrect-answer");
    result.style.display = "block";
    return;
  }
  if (assess.incompleteBox) {
    result.innerHTML =
      "<strong>Almost there…</strong><br />Please also answer the follow-up questions that opened after a Yes.";
    result.classList.add("show", "incorrect-answer");
    result.style.display = "block";
    return;
  }

  medicalRefreshEmailGate();

  if (assess.needsPhysician) {
    result.innerHTML =
      '<strong>Physician’s evaluation is required</strong><br />Print the <a href="/docs/Medical_Questionnaire.pdf" target="_blank" rel="noopener">Medical Questionnaire PDF</a>, take it to a doctor for dive medical clearance, and bring the signed documents to Chang Diving before diving. Confirm below and <strong>Email my results</strong> so we have your answers on file. · <a href="/en/contact/">Contact us</a>';
    result.classList.add("show", "incorrect-answer");
  } else {
    result.innerHTML =
      "<strong>No physician required by this screening</strong><br />Confirm below and <strong>Email my results</strong> to Chang Diving — that emailed declaration is enough for this screening. No extra Medical Questionnaire paper is needed unless we ask for it.";
    result.classList.add("show", "correct-answer");
  }
  result.style.display = "block";
}

function medicalEmailResults() {
  var assess = medicalAssess();
  var id = medicalGetIdentity();
  if (!assess.complete || !id.ready) {
    alert(
      "Please enter your name and date of birth, complete all questions, and tick the confirmation box first."
    );
    return;
  }
  var subject =
    "Medical Self-Check results – " +
    id.name +
    " – " +
    (assess.needsPhysician ? "physician recommended" : "screening clear");
  var body = medicalBuildSummary();
  // Keep mailto bodies practical for common email clients
  if (body.length > 1800) {
    body =
      body.slice(0, 1750) +
      "\n\n[Truncated – full list was long. Please also attach/sign the PDF.]";
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
