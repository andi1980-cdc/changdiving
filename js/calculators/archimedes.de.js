(function () {
  var water = document.getElementById("arch-water");
  var volEl = document.getElementById("arch-vol");
  var massEl = document.getElementById("arch-mass");
  var marginEl = document.getElementById("arch-margin");
  var out = document.getElementById("arch-lift-out");
  if (!water || !volEl || !massEl || !marginEl || !out) return;

  function parseNum(el, allowEmpty) {
    var s = el.value.trim().replace(",", ".");
    if (s === "" && allowEmpty) return 0;
    if (s === "") return NaN;
    var n = parseFloat(s, 10);
    return isFinite(n) ? n : NaN;
  }

  function update() {
    var rho = parseFloat(water.value, 10);
    var volRaw = volEl.value.trim();
    var m = parseNum(massEl, false);
    var margin = parseNum(marginEl, true);
    if (massEl.value.trim() === "") {
      out.textContent =
        "Gewicht an der Luft eingeben (kg), z. B. 155 beim Außenborder.";
      return;
    }
    if (!isFinite(rho) || rho <= 0) return;
    if (!isFinite(m) || m < 0) {
      out.textContent = "Gewicht muss 0 kg oder mehr sein.";
      return;
    }
    if (marginEl.value.trim() !== "" && (!isFinite(margin) || margin < 0)) {
      out.textContent = "Zusatz-Auftrieb: leer oder Zahl ≥ 0 (kg).";
      return;
    }
    if (!isFinite(margin) || margin < 0) margin = 0;

    var Vunknown = volRaw === "";
    var V = Vunknown ? 0 : parseNum(volEl, false);
    if (!Vunknown && (!isFinite(V) || V < 0)) {
      out.textContent = "Unterwasservolumen: leer, 0 oder positive Zahl (L).";
      return;
    }

    var totalNeutralL = m / rho;
    var deltaNeutral = m / rho - V;
    var deltaMargin = (m + margin) / rho - V;
    var perKgL = 1 / rho;

    var lines = [];

    if (Vunknown) {
      lines.push("Nur Gewicht (Unterwasservolumen unbekannt):");
      lines.push(
        "• Gesamt-Verdrängung für neutral (Motor + Sack zusammen) ≈ " +
          totalNeutralL.toFixed(1) +
          " L (~" +
          m.toFixed(1) +
          " kg ÷ " +
          rho +
          " kg/L)."
      );
      lines.push(
        "• Hebesack allein: oft < " +
          totalNeutralL.toFixed(1) +
          " L extra, weil der Motor schon Wasser verdrängt — ohne diese Zahl planst du bis zu ≈ " +
          totalNeutralL.toFixed(1) +
          " L in dieser Tiefe (konservative Obergrenze)."
      );
      if (margin > 0.05) {
        lines.push(
          "• Leicht steigen: ≈ " +
            (margin * perKgL).toFixed(1) +
            " L mehr Verdrängung (+" +
            margin.toFixed(1) +
            " kg netto), Sack gesamt bis zu ≈ " +
            ((m + margin) / rho).toFixed(1) +
            " L bei pessimistischer Annahme V≈0."
        );
      } else {
        lines.push(
          "• Zum Steigen: unter „Netto-Auftrieb“ 5–10 kg eintragen — grob +" +
            (5 * perKgL).toFixed(1) +
            "–" +
            (10 * perKgL).toFixed(1) +
            " L (gleiche Annahme)."
        );
      }
      lines.push(
        "Feintuning: oben Unterwasservolumen (L) schätzen — dann wird die Sackgröße ungefähr um so viele Liter kleiner."
      );
    } else {
      var support = rho * V;
      var net = m - support;
      lines.push(
        "Stützkraft aus eigener Verdrängung ≈ " +
          support.toFixed(1) +
          " kg (ρ × " +
          V.toFixed(2) +
          " L)."
      );
      if (net > 0.05) {
        lines.push(
          "Netto „schwer“ ≈ " + net.toFixed(1) + " kg (Gewicht − Stützkraft)."
        );
      } else if (net < -0.05) {
        lines.push(
          "Netto „leicht“ ≈ " +
            (-net).toFixed(1) +
            " kg — steigt in diesem Modell evtl. ohne Sack."
        );
      } else {
        lines.push("Im Groben neutral in diesem groben Modell.");
      }
      if (deltaNeutral <= 0) {
        lines.push("Zusatz-Sackverdrängung für neutral: ~0 L bei diesem ρ.");
      } else {
        lines.push(
          "Neutral: ≈ " +
            deltaNeutral.toFixed(1) +
            " L Sack-Verdrängung (~" +
            (deltaNeutral * rho).toFixed(1) +
            " kg Auftrieb)."
        );
      }
      if (margin > 0) {
        if (deltaMargin <= 0) {
          lines.push(
            "Mit +" +
              margin.toFixed(1) +
              " kg Zusatz-Auftrieb: ~0 L mehr (hier schon ausreichend)."
          );
        } else {
          lines.push(
            "Aufstiegs-Ziel (+" +
              margin.toFixed(1) +
              " kg netto): ≈ " +
              deltaMargin.toFixed(1) +
              " L Sack-Verdrängung gesamt."
          );
        }
      }
    }

    out.textContent = lines.join("\n");
  }

  water.addEventListener("change", update);
  volEl.addEventListener("input", update);
  volEl.addEventListener("change", update);
  massEl.addEventListener("input", update);
  massEl.addEventListener("change", update);
  marginEl.addEventListener("input", update);
  marginEl.addEventListener("change", update);
  update();
})();
