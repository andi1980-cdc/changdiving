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
        "กรอกน้ำหนักในอากาศ (kg) เช่น 155 สำหรับเครื่องยนต์ติดท้ายเรือ";
      return;
    }
    if (!isFinite(rho) || rho <= 0) return;
    if (!isFinite(m) || m < 0) {
      out.textContent = "น้ำหนักต้องไม่ต่ำกว่า 0 kg";
      return;
    }
    if (marginEl.value.trim() !== "" && (!isFinite(margin) || margin < 0)) {
      out.textContent = "แรงลอยเพิ่ม: เว้นว่างหรือตัวเลข ≥ 0 (kg)";
      return;
    }
    if (!isFinite(margin) || margin < 0) margin = 0;

    var Vunknown = volRaw === "";
    var V = Vunknown ? 0 : parseNum(volEl, false);
    if (!Vunknown && (!isFinite(V) || V < 0)) {
      out.textContent = "ปริมาตรจม: เว้นว่าง หรือใส่ 0 หรือตัวเลขบวก (L)";
      return;
    }

    var totalNeutralL = m / rho;
    var deltaNeutral = m / rho - V;
    var deltaMargin = (m + margin) / rho - V;
    var perKgL = 1 / rho;

    var lines = [];

    if (Vunknown) {
      lines.push("มีแค่น้ำหนักบนบก (ยังไม่รู้ว่าจมกี่ลิตร):");
      lines.push(
        "• ถ้าจะลอยตัวเป็นกลาง: การแทนที่น้ำรวม (วัตถุ + ถุงยก) ประมาณ " +
          totalNeutralL.toFixed(1) +
          " L (" +
          m.toFixed(1) +
          " kg ÷ " +
          rho +
          " kg/L)"
      );
      lines.push(
        "• ถุงยกอย่างเดียวมักต้องน้อยกว่า " +
          totalNeutralL.toFixed(1) +
          " L เพราะตัววัตถุแทนที่น้ำไปแล้ว — ถ้ายังไม่รู้ปริมาตรจม ให้วางแผนระมัดระวังสูงสุดราว " +
          totalNeutralL.toFixed(1) +
          " L ณ ความลึกนี้"
      );
      if (margin > 0.05) {
        lines.push(
          "• อยากลอยขึ้นเบาๆ: เพิ่มการแทนที่ราว " +
            (margin * perKgL).toFixed(1) +
            " L (แรงลอย + " +
            margin.toFixed(1) +
            " kg) ถุงรวมสูงสุดราว " +
            ((m + margin) / rho).toFixed(1) +
            " L ถ้าสมมติว่าวัตถุแทนที่น้ำแทบไม่มี (กรณีระวังสุด)"
        );
      } else {
        lines.push(
          "• อยากลอยขึ้น: ลองใส่ 5–10 kg ในช่องแรงลอยเพิ่ม — ได้ประมาณ +" +
            (5 * perKgL).toFixed(1) +
            "–" +
            (10 * perKgL).toFixed(1) +
            " L (สมมติแบบเดียวกัน)"
        );
      }
      lines.push(
        "ถ้าเดาปริมาตรจมได้ ให้พิมพ์ในช่องด้านบน — ขนาดถุงที่คำนวณจะเล็กลงประมาณเท่านั้น"
      );
    } else {
      var support = rho * V;
      var net = m - support;
      lines.push(
        "แรงลอยจากวัตถุเอง ≈ " +
          support.toFixed(1) +
          " kg (" +
          rho +
          " kg/L × " +
          V.toFixed(2) +
          " L)"
      );
      if (net > 0.05) {
        lines.push(
          "เหลือหนักลงสุทธิราว " + net.toFixed(1) + " kg (น้ำหนัก − แรงลอย)"
        );
      } else if (net < -0.05) {
        lines.push(
          "ในแบบจำลองนี้ ลอยง่ายราว " +
            (-net).toFixed(1) +
            " kg — อาจไม่ต้องใช้ถุงยก"
        );
      } else {
        lines.push("โดยประมาณ ลอยตัวเป็นกลางในแบบจำลองหยาบ");
      }
      if (deltaNeutral <= 0) {
        lines.push("ไม่ต้องเพิ่มถุงเพื่อลอยตัวเป็นกลาง (ตามค่าที่ใส่)");
      } else {
        lines.push(
          "ลอยตัวเป็นกลาง: ต้องเพิ่มจากถุงยกราว " +
            deltaNeutral.toFixed(1) +
            " L (แรงลอยราว " +
            (deltaNeutral * rho).toFixed(1) +
            " kg)"
        );
      }
      if (margin > 0) {
        if (deltaMargin <= 0) {
          lines.push(
            "แรงลอย +" +
              margin.toFixed(1) +
              " kg: ไม่ต้องเพิ่มถุงในกรณีนี้ (พอแล้ว)"
          );
        } else {
          lines.push(
            "อยากลอยขึ้นอีก " +
              margin.toFixed(1) +
              " kg: ต้องการการแทนที่จากถุงรวมราว " +
              deltaMargin.toFixed(1) +
              " L"
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
