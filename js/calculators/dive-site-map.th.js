document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("kc-load-map");
  const mapEl = document.getElementById("kc-map");
  if (!btn || !mapEl) {
    console.error(
      "[KC-MAP] ไม่พบปุ่มหรือคอนเทนเนอร์แผนที่ – ตรวจสอบ IDs kc-load-map / kc-map."
    );
    return;
  }

  // Spots
  const SITES = [
    {
      n: "ช้างไดร์วิ่ง เซ็นเตอร์",
      c: [12.062940593816096, 102.28985548228239],
      e: "🏢",
      cls: "center",
      u: "https://share.google/8B4o0sWdeTFjYnMU6",
    },
    {
      n: "จุดออกเรือ",
      c: [12.06391827176898, 102.2854556208762],
      e: "🚤",
      cls: "boat",
      u: "https://maps.app.goo.gl/rm4HGMsGvREGKbuXA?g_st=ic",
    },
    {
      n: "เรือหลวงช้าง",
      c: [11.894307, 102.257597],
      e: "🛳️",
      cls: "wreck",
      u: "/th/dive-sites/htms-chang-wreck/",
    },
    {
      n: "หินลูกบาศก์",
      c: [11.945638, 102.283831],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/hin-luk-bat/",
    },
    {
      n: "ซีเคร็ตรีฟ",
      c: [11.905192553479965, 102.31728325042923],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/secret-reef/",
    },
    {
      n: "หินราบใต้",
      c: [11.906629460855415, 102.31752797388722],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/hin-raab-south/",
    },
    {
      n: "บลูเบอร์รี่ฮิลล์",
      c: [11.905294, 102.317584],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/blueberry-hill/",
    },
    {
      n: "เรือจม ต11",
      c: [11.906928322337778, 102.31746857203512],
      e: "🛳️",
      cls: "wreck",
      u: "/th/dive-sites/t11-wreck/",
    },
    {
      n: "หินเรือแตก",
      c: [11.914958962232593, 102.33759604841904],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/hin-rua-tek/",
    },
    {
      n: "หินราบเหนือ",
      c: [12.052088, 102.239444],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/hin-raab-north/",
    },
    {
      n: "หินสามเส้า",
      c: [12.044852024176542, 102.24547490125873],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/hin-sam-sao/",
    },
    {
      n: "หินพรายน้ำ",
      c: [11.850661906393347, 102.41060395775406],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/hin-pray-nam/",
    },
    {
      n: "หินกระเดื่อง",
      c: [11.809782456488609, 102.37047235318667],
      e: "🪸",
      cls: "reef",
      u: "/th/dive-sites/koh-rang-pinnacle/",
    },
    {
      n: "โคโฮะ มารุ 5 (PAK-1)",
      c: [12.0924, 101.6824],
      e: "🛳️",
      cls: "wreck",
      u: "/th/dive-sites/koho-maru-5/",
    },
  ];

  function buildBounds(L) {
    if (!SITES.length)
      return L.latLngBounds(L.latLng(11.75, 101.45), L.latLng(12.2, 102.5));
    return L.latLngBounds(SITES.map((s) => L.latLng(s.c[0], s.c[1])));
  }

  btn.addEventListener("click", async () => {
    try {
      btn.disabled = true;

      // Leaflet laden
      await Promise.all([
        new Promise((res, rej) => {
          const l = document.createElement("link");
          l.rel = "stylesheet";
          l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          l.onload = res;
          l.onerror = rej;
          document.head.appendChild(l);
        }),
        new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        }),
      ]);

      if (!window.L) {
        console.error(
          "[KC-MAP] Leaflet L nicht verfügbar. CSP oder Netzwerkproblem?"
        );
        return;
      }

      // sichtbar machen
      mapEl.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = "Karte geladen";

      const map = L.map("kc-map", {
        zoomControl: true,
        scrollWheelZoom: true,
        worldCopyJump: false,
        preferCanvas: true,
        zoomAnimation: false,
        markerZoomAnimation: false,
        updateWhenIdle: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        subdomains: "abc",
        maxZoom: 19,
        noWrap: true,
        detectRetina: false,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Bounds & MaxBounds
      const bounds = buildBounds(L);
      const padding = window.innerWidth < 768 ? [30, 30] : [60, 80];
      map.fitBounds(bounds, { padding });

      const padLat = 0.08,
        padLng = 0.08;
      const mb = L.latLngBounds(
        L.latLng(bounds.getSouth() - padLat, bounds.getWest() - padLng),
        L.latLng(bounds.getNorth() + padLat, bounds.getEast() + padLng)
      );
      map.setMaxBounds(mb);
      map.options.minZoom = map.getZoom() - 1;
      map.options.maxZoom = 16;

      // Marker
      SITES.forEach((s) => {
        const icon = L.divIcon({
          html: `<div class="kc-pin ${s.cls || ""}" aria-hidden="true">${s.e || "●"}</div>`,
          className: "kc-pin-wrap",
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
        const m = L.marker(s.c, {
          icon,
          keyboard: true,
          title: s.n,
        }).addTo(map);
        m.bindPopup(
          `<strong>${s.n}</strong>${s.u ? `<br><a href="${s.u}" target="_blank" rel="noopener">ข้อมูลเพิ่มเติม</a>` : ""}`,
          { closeButton: true }
        );

        m.on("add", function () {
          const el = this.getElement();
          if (!el) return;
          el.setAttribute("role", "button");
          el.setAttribute("tabindex", "0");
          el.setAttribute("aria-label", s.n);
          el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              m.openPopup();
            }
            if (e.key === "Escape") {
              m.closePopup();
            }
          });
        });
      });

      if (window.innerWidth < 768) map.zoomControl.setPosition("bottomright");
    } catch (e) {
      console.error("[KC-MAP] Fehler beim Laden/Initialisieren:", e);
      btn.disabled = false;
      btn.textContent = "Karte laden (erneut versuchen)";
    }
  });
});
