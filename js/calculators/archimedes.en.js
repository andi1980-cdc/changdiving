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
      out.textContent = "Enter weight in air (kg), e.g. 155 for the outboard.";
      return;
    }
    if (!isFinite(rho) || rho <= 0) return;
    if (!isFinite(m) || m < 0) {
      out.textContent = "Weight must be 0 kg or more.";
      return;
    }
    if (marginEl.value.trim() !== "" && (!isFinite(margin) || margin < 0)) {
      out.textContent =
        "Extra buoyancy must be empty or a non‑negative number (kg).";
      return;
    }
    if (!isFinite(margin) || margin < 0) margin = 0;

    var Vunknown = volRaw === "";
    var V = Vunknown ? 0 : parseNum(volEl, false);
    if (!Vunknown && (!isFinite(V) || V < 0)) {
      out.textContent = "Submerged volume must be blank, 0, or positive (L).";
      return;
    }

    var totalNeutralL = m / rho;
    var deltaNeutral = m / rho - V;
    var deltaMargin = (m + margin) / rho - V;
    var perKgL = 1 / rho;

    var lines = [];

    if (Vunknown) {
      lines.push("Weight-only (submerged volume unknown):");
      lines.push(
        "• Total displacement needed for neutral (motor + bag together) ≈ " +
          totalNeutralL.toFixed(1) +
          " L (~" +
          m.toFixed(1) +
          " kg ÷ " +
          rho +
          " kg/L)."
      );
      lines.push(
        "• Lift bag alone: often < " +
          totalNeutralL.toFixed(1) +
          " L extra, because the motor already displaces water — but without that volume, plan up to ≈ " +
          totalNeutralL.toFixed(1) +
          " L at this depth (conservative upper bound)."
      );
      if (margin > 0.05) {
        lines.push(
          "• To float up a bit: add ≈ " +
            (margin * perKgL).toFixed(1) +
            " L more displacement (+" +
            margin.toFixed(1) +
            " kg net → +" +
            margin.toFixed(1) +
            " kg ÷ ρ), so bag total up to ≈ " +
            ((m + margin) / rho).toFixed(1) +
            " L with the same pessimistic V≈0 assumption."
        );
      } else {
        lines.push(
          "• To float up: enter 5–10 kg under “extra net buoyancy” — that adds roughly " +
            (5 * perKgL).toFixed(1) +
            "–" +
            (10 * perKgL).toFixed(1) +
            " L (same assumption)."
        );
      }
      lines.push(
        "Refine: estimate submerged volume (L) above if you can — then the bag size drops by about that many litres."
      );
    } else {
      var support = rho * V;
      var net = m - support;
      lines.push(
        "Object support from its own displacement ≈ " +
          support.toFixed(1) +
          " kg (ρ × " +
          V.toFixed(2) +
          " L)."
      );
      if (net > 0.05) {
        lines.push(
          "Net “heavy” ≈ " + net.toFixed(1) + " kg (weight − support)."
        );
      } else if (net < -0.05) {
        lines.push(
          "Net floaty ≈ " +
            (-net).toFixed(1) +
            " kg — may rise without a bag in this model."
        );
      } else {
        lines.push("Roughly neutral in this coarse model.");
      }
      if (deltaNeutral <= 0) {
        lines.push("Extra bag displacement for neutral: ~0 L at this ρ.");
      } else {
        lines.push(
          "Neutral: add ≈ " +
            deltaNeutral.toFixed(1) +
            " L bag displacement (~" +
            (deltaNeutral * rho).toFixed(1) +
            " kg lift)."
        );
      }
      if (margin > 0) {
        if (deltaMargin <= 0) {
          lines.push(
            "With +" +
              margin.toFixed(1) +
              " kg extra buoyancy: ~0 L more (already enough here)."
          );
        } else {
          lines.push(
            "Float-up target (+" +
              margin.toFixed(1) +
              " kg net): ≈ " +
              deltaMargin.toFixed(1) +
              " L total bag displacement."
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
