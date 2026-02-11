// Breadcrumbs
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    const path = window.location.pathname.split("/").filter(Boolean);
    const lang = path[0]; // z. B. "en", "de", "th"
    const baseHref = "/" + lang + "/";

    // Sprachabhängiger Text für "Home"
    const homeLabels = {
      en: "Home",
      de: "Startseite",
      th: "หน้าแรก",
    };
    const homeLabel = homeLabels[lang] || "Home";

    // Mapping für Breadcrumb-Labels und URLs
    const segmentMapping = {
      // Store/Category Mappings - diese werden übersprungen
      store: { label: "", skip: true },
      category: { label: "", skip: true },
      product: { label: "", skip: true },

      // Course Mappings
      courses: { label: "Courses", url: "/" + lang + "/courses/" },
      "open-water-diver": {
        label: "Open Water Diver",
        url: "/" + lang + "/courses/open-water-diver/",
      },
      advanced: { label: "Advanced", url: "/" + lang + "/courses/advanced/" },
      "rescue-diver": {
        label: "Rescue Diver",
        url: "/" + lang + "/courses/rescue-diver/",
      },
      divemaster: {
        label: "Divemaster",
        url: "/" + lang + "/courses/divemaster/",
      },
      "sdi-idc": { label: "IDC", url: "/" + lang + "/courses/sdi-idc/" },
      "sdi-ie": { label: "IE", url: "/" + lang + "/courses/sdi-ie/" },
      "open-advanced-package": {
        label: "OW & Advanced Package",
        url: "/" + lang + "/courses/open-advanced-package/",
      },
      "open-to-divemaster": {
        label: "Open to Divemaster",
        url: "/" + lang + "/courses/open-to-divemaster/",
      },
      "tech-package": {
        label: "Tech Package",
        url: "/" + lang + "/courses/tech-package/",
      },
      "deep-wreck-nitrox": {
        label: "Deep Wreck Nitrox",
        url: "/" + lang + "/courses/deep-wreck-nitrox/",
      },
      "nitrox-diver": {
        label: "Nitrox Diver",
        url: "/" + lang + "/courses/nitrox-diver/",
      },
      "advanced-nitrox": {
        label: "Advanced Nitrox",
        url: "/" + lang + "/courses/advanced-nitrox/",
      },
      "deco-procedures": {
        label: "Deco Procedures",
        url: "/" + lang + "/courses/deco-procedures/",
      },
      "first-aid": {
        label: "First Aid",
        url: "/" + lang + "/courses/first-aid/",
      },
      "efr-instructor": {
        label: "EFR Instructor",
        url: "/" + lang + "/courses/efr-instructor/",
      },
      "instructor-crossover": {
        label: "Instructor Crossover",
        url: "/" + lang + "/courses/instructor-crossover/",
      },
      "solo-diver": {
        label: "Solo Diver",
        url: "/" + lang + "/courses/solo-diver/",
      },
      "search-recovery": {
        label: "Search & Recovery",
        url: "/" + lang + "/courses/search-recovery/",
      },
      "intro-to-tech": {
        label: "Intro to Tech",
        url: "/" + lang + "/courses/intro-to-tech/",
      },
      night: { label: "Night Diver", url: "/" + lang + "/courses/night/" },
      sidemount: {
        label: "Sidemount",
        url: "/" + lang + "/courses/sidemount/",
      },
      "master-scuba-diver": {
        label: "Master Scuba Diver",
        url: "/" + lang + "/courses/master-scuba-diver/",
      },
      "wreck-diver": {
        label: "Wreck Diver",
        url: "/" + lang + "/courses/wreck-diver/",
      },
      "advanced-wreck": {
        label: "Advanced Wreck",
        url: "/" + lang + "/courses/advanced-wreck/",
      },
      "deep-diver": {
        label: "Deep Diver",
        url: "/" + lang + "/courses/deep-diver/",
      },
      navigation: {
        label: "Navigation",
        url: "/" + lang + "/courses/navigation/",
      },
      "advanced-courses": {
        label: "Advanced Courses",
        url: "/" + lang + "/courses/advanced-courses/",
      },
      "beginner-courses": {
        label: "Beginner Courses",
        url: "/" + lang + "/courses/beginner-courses/",
      },
      "professional-courses": {
        label: "Professional Courses",
        url: "/" + lang + "/courses/professional-courses/",
      },
      speciality: {
        label: "Speciality",
        url: "/" + lang + "/courses/speciality/",
      },
      "technical-diving-courses": {
        label: "Technical Diving Courses",
        url: "/" + lang + "/courses/tech-package/",
      },
      technical: {
        label: "Technical Diving",
        url: "/" + lang + "/courses/tech-package/",
      },
      "diving-courses": {
        label: "Diving Courses",
        url: "/" + lang + "/courses/",
      },
      "scuba-courses": {
        label: "Scuba Courses",
        url: "/" + lang + "/courses/",
      },

      // Day-Trips Mappings
      "day-trips": { label: "Day Trips", url: "/" + lang + "/day-trips/" },
      "fun-dives": {
        label: "Fun Dives",
        url: "/" + lang + "/day-trips/fun-dives/",
      },
      "try-dive": {
        label: "Try Dive",
        url: "/" + lang + "/day-trips/try-dive/",
      },
      "scuba-review": {
        label: "Scuba Review",
        url: "/" + lang + "/day-trips/scuba-review/",
      },
      snorkeling: {
        label: "Snorkeling",
        url: "/" + lang + "/day-trips/snorkeling/",
      },
      insurance: {
        label: "Insurance",
        url: "/" + lang + "/day-trips/insurance/",
      },
      "rent-gopro": {
        label: "GoPro Rental",
        url: "/" + lang + "/day-trips/rent-gopro/",
      },

      // Equipment Mappings
      equipment: { label: "Equipment", url: "/" + lang + "/equipment/" },
      "used-scuba-gear": {
        label: "Used Scuba Gear",
        url: "/" + lang + "/equipment/used-scuba-gear/",
      },

      // Other Mappings
      posts: { label: "Posts", url: "/" + lang + "/posts/" },
      "diving-how-to-guides-koh-chang": {
        label: "How to Guides",
        url: "/" + lang + "/posts/diving-how-to-guides-koh-chang/",
      },
      "koh-chang-diving-travel-guides": {
        label: "Travel Guides",
        url: "/" + lang + "/posts/koh-chang-diving-travel-guides/",
      },
      "marine-life-koh-chang": {
        label: "Marine Life",
        url: "/" + lang + "/posts/marine-life-koh-chang/",
      },
      "scuba-knowledge": {
        label: "Scuba Knowledge",
        url: "/" + lang + "/posts/scuba-knowledge/",
      },
      "straight-talk": {
        label: "Straight Talk",
        url: "/" + lang + "/posts/straight-talk/",
      },
      "tips-and-tricks": {
        label: "Tips & Tricks",
        url: "/" + lang + "/posts/tips-and-tricks/",
      },
      "dive-sites": { label: "Dive Sites", url: "/" + lang + "/dive-sites/" },
      "blueberry-hill": {
        label: "Blueberry Hill",
        url: "/" + lang + "/dive-sites/blueberry-hill/",
      },
      "hin-luk-bat": {
        label: "Hin Luk Bat",
        url: "/" + lang + "/dive-sites/hin-luk-bat/",
      },
      "hin-pray-nam": {
        label: "Hin Pray Nam",
        url: "/" + lang + "/dive-sites/hin-pray-nam/",
      },
      "hin-raab-north": {
        label: "Hin Raab North",
        url: "/" + lang + "/dive-sites/hin-raab-north/",
      },
      "hin-raab-south": {
        label: "Hin Raab South",
        url: "/" + lang + "/dive-sites/hin-raab-south/",
      },
      "hin-rua-tek": {
        label: "Hin Rua Tek",
        url: "/" + lang + "/dive-sites/hin-rua-tek/",
      },
      "hin-sam-sao": {
        label: "Hin Sam Sao",
        url: "/" + lang + "/dive-sites/hin-sam-sao/",
      },
      "htms-chang-wreck": {
        label: "HTMS Chang Wreck",
        url: "/" + lang + "/dive-sites/htms-chang-wreck/",
      },
      "koh-rang-pinnacle": {
        label: "Koh Rang Pinnacle",
        url: "/" + lang + "/dive-sites/koh-rang-pinnacle/",
      },
      "koho-maru-5": {
        label: "Koho Maru 5",
        url: "/" + lang + "/dive-sites/koho-maru-5/",
      },
      "phutthayotfa-chulalok-wreck-koh-chang": {
        label: "Phutthayotfa Chulalok Wreck",
        url: "/" + lang + "/dive-sites/phutthayotfa-chulalok-wreck-koh-chang/",
      },
      "secret-reef": {
        label: "Secret Reef",
        url: "/" + lang + "/dive-sites/secret-reef/",
      },
      "t11-wreck": {
        label: "T11 Wreck",
        url: "/" + lang + "/dive-sites/t11-wreck/",
      },
      "dive-site-map-koh-chang": {
        label: "Dive Site Map",
        url: "/" + lang + "/dive-sites/dive-site-map-koh-chang/",
      },
      faqs: { label: "FAQs", url: "/" + lang + "/faqs/" },
      "faq-diving-health-safety-thailand": {
        label: "Health & Safety",
        url: "/" + lang + "/faqs/faq-diving-health-safety-thailand/",
      },
      "faq-equipment-logistics-koh-chang": {
        label: "Equipment & Logistics",
        url: "/" + lang + "/faqs/faq-equipment-logistics-koh-chang/",
      },
      "faq-booking-payment-scuba-koh-chang": {
        label: "Booking & Payment",
        url: "/" + lang + "/faqs/faq-booking-payment-scuba-koh-chang/",
      },
      "faq-diving-koh-chang": {
        label: "Diving",
        url: "/" + lang + "/faqs/faq-diving-koh-chang/",
      },
      "faq-general-questions-koh-chang": {
        label: "General Questions",
        url: "/" + lang + "/faqs/faq-general-questions-koh-chang/",
      },
      "faq-try-dive-fun-dives-koh-chang": {
        label: "Try Dive & Fun Dives",
        url: "/" + lang + "/faqs/faq-try-dive-fun-dives-koh-chang/",
      },
      "faq-getting-here-accommodation": {
        label: "Getting Here & Accommodation",
        url: "/" + lang + "/faqs/faq-getting-here-accommodation/",
      },
      "faq-dive-courses-koh-chang": {
        label: "Dive Courses",
        url: "/" + lang + "/faqs/faq-dive-courses-koh-chang/",
      },
      about: { label: "About", url: "/" + lang + "/about/" },
      contact: { label: "Contact", url: "/" + lang + "/contact/" },
      prices: { label: "Prices", url: "/" + lang + "/prices/" },
      "privacy-policy": {
        label: "Privacy Policy",
        url: "/" + lang + "/privacy-policy/",
      },
      "refund-policy": {
        label: "Refund Policy",
        url: "/" + lang + "/refund-policy/",
      },
      "terms-and-conditions": {
        label: "Terms & Conditions",
        url: "/" + lang + "/terms-and-conditions/",
      },
      videos: { label: "Videos", url: "/" + lang + "/videos/" },
      weather: { label: "Weather", url: "/" + lang + "/weather/" },
    };

    let html = `<a href="${baseHref}">🏠 ${homeLabel}</a>`;
    let cumulative = "";

    // Prüfe ob alte URL-Struktur verwendet wird und leite um
    const hasOldStructure =
      path.includes("store") ||
      path.includes("category") ||
      path.includes("product");
    if (hasOldStructure) {
      // Erstelle neue URL basierend auf dem letzten Segment
      const lastSegment = path[path.length - 1];
      const mapping = segmentMapping[lastSegment];
      if (mapping && !mapping.skip) {
        // Umleitung zur neuen URL
        window.location.href = mapping.url;
        return;
      }
    }

    path.forEach((segment, index) => {
      if (index === 0) return; // Sprache überspringen (z. B. "en")

      cumulative += "/" + segment;
      const isLastSegment = index === path.length - 1;

      // Prüfe Mapping
      const mapping = segmentMapping[segment];
      if (mapping) {
        if (mapping.skip) {
          // Segment überspringen (z.B. store, category, product)
          return;
        } else {
          // Verwende Mapping für Label und URL
          if (isLastSegment) {
            // Letztes Segment: nicht klickbar (aktuelle Seite)
            html += ` › ${mapping.label}`;
          } else {
            html += ` › <a href="${mapping.url}">${mapping.label}</a>`;
          }
        }
      } else {
        // Fallback: Verwende Segment als Label
        const label = decodeURIComponent(segment).replace(/-/g, " ");
        if (isLastSegment) {
          // Letztes Segment: nicht klickbar (aktuelle Seite)
          html += ` › ${label}`;
        } else {
          html += ` › <a href="${cumulative}/">${label}</a>`;
        }
      }
    });

    breadcrumb.innerHTML = html;
  }
});

// Menü-Toggle für Mobile Dropdown (mit Debug-Ausgaben)
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll(".menu-toggle");
  console.log("[DEBUG] Gefundene .menu-toggle Buttons:", toggles.length);
  toggles.forEach(function (toggle, i) {
    // Suche im Eltern-Container nach .dropdown-menu
    const parent = toggle.closest(".lang-switch") || toggle.parentElement;
    const dropdown = parent.querySelector(".dropdown-menu");
    console.log(`[DEBUG] Button #${i + 1}:`, toggle);
    if (dropdown) {
      console.log(
        `[DEBUG] Zugehöriges Dropdown für Button #${i + 1} gefunden:`,
        dropdown,
      );
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdown.classList.toggle("show");
        
        // Lock/unlock body scroll on mobile when menu opens/closes
        if (dropdown.classList.contains("show")) {
          document.body.classList.add("menu-open");
        } else {
          document.body.classList.remove("menu-open");
        }
        
        console.log(
          `[DEBUG] Button #${i + 1} geklickt. Dropdown sichtbar:`,
          dropdown.classList.contains("show"),
        );
      });
      // Klick außerhalb schließt das Menü
      document.addEventListener("click", function (event) {
        if (
          !toggle.contains(event.target) &&
          !dropdown.contains(event.target)
        ) {
          if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
            document.body.classList.remove("menu-open");
            console.log(
              `[DEBUG] Dropdown für Button #${i + 1} durch Außenklick geschlossen.`,
            );
          }
        }
      });
    } else {
      console.warn(`[DEBUG] Kein Dropdown für Button #${i + 1} gefunden!`);
    }
  });
});

// Cookie Consent Banner Initialisierung (sprachabhängig)
// ---------------------------------------------
window.addEventListener("load", function () {
  if (window.cookieconsent) {
    // Sprache aus URL erkennen
    var lang = (window.location.pathname.split("/")[1] || "en").toLowerCase();
    var content = {
      en: {
        message:
          "We use cookies to improve your experience. You can accept or reject non-essential cookies.",
        dismiss: "Reject",
        allow: "Accept",
        link: "Privacy Policy",
        href: "/en/privacy-policy/",
      },
      de: {
        message:
          "Wir verwenden Cookies, um dein Erlebnis zu verbessern. Du kannst nicht notwendige Cookies akzeptieren oder ablehnen.",
        dismiss: "Ablehnen",
        allow: "Akzeptieren",
        link: "Datenschutz",
        href: "/de/privacy-policy/",
      },
      th: {
        message:
          "เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ คุณสามารถยอมรับหรือปฏิเสธคุกกี้ที่ไม่จำเป็นได้",
        dismiss: "ปฏิเสธ",
        allow: "ยอมรับ",
        link: "นโยบายความเป็นส่วนตัว",
        href: "/th/privacy-policy/",
      },
    };
    var c = content[lang] || content["en"];
    window.cookieconsent.initialise({
      palette: {
        popup: { background: "#000" },
        button: { background: "#0077B6", text: "#fff" },
      },
      theme: "classic",
      position: "bottom",
      type: "opt-in",
      content: c,
      onInitialise: function (status) {
        if (status === window.cookieconsent.status.allow) {
          // Optional: activate analytics or other scripts
        }
      },
    });
  }
});

// Footer dynamisch je nach Sprache einfügen
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var lang = (window.location.pathname.split("/")[1] || "en").toLowerCase();
  var footers = {
    en: `<nav class="footer-navigation">
    <div class="container">
      <div class="row">
        <div class="three columns">
          <a href="/en/about/">About us</a>
          <a href="/en/posts/diving-how-to-guides-koh-chang/">How to guides</a>
          <a href="/en/faqs/faq-getting-here-accommodation/">Getting to Koh Chang</a>
          <a href="/en/dive-sites/">Dive sites</a>
          <a href="/en/faqs/">FAQs</a>
          <a href="/en/videos/">Videos</a>
          <a href="/en/contact/">Contact us</a>
        </div>
        <div class="three columns">
          <a href="/en/courses/">Courses</a>
          <a href="/en/courses/open-water-diver/">Open Water Diver</a>
          <a href="/en/courses/advanced/">Advanced Diver</a>
          <a href="/en/courses/rescue-diver/">Rescue Diver</a>
          <a href="/en/courses/divemaster/">Divemaster</a>
          <a href="/en/courses/sdi-idc/">IDC</a>
        </div>
        <div class="three columns">
          <a href="/en/day-trips/">Day Trips</a>
          <a href="/en/day-trips/fun-dives/">Fun Dives</a>
          <a href="/en/day-trips/try-dive/">Try Diving</a>
          <a href="/en/day-trips/scuba-review/">Scuba Review</a>
          <a href="/en/day-trips/snorkeling/">Snorkeling</a>
        </div>
        <div class="three columns">
          <a href="/en/courses/open-advanced-package/">OW & Advanced</a>
          <a href="/en/courses/deep-wreck-nitrox/">Deep, Wreck, Nitrox</a>
          <a href="/en/courses/open-to-divemaster/">Open to Divemaster</a>
          <a href="/en/courses/tech-package/">Technical Diving</a>
        </div>
      </div>
    </div>
  </nav>
  <div class="footer-meta">
    <div class="container">
      <p><strong>Phone, WhatsApp & Line:</strong> +66 (0) 894-013-927</p>
      <p>
        Chang Diving Center Co.,Ltd<br>
        21/52 Moo 4, Klong Prao Beach<br>
        Koh Chang, Trat, Thailand 23170
      </p>
      <p>
        <a href="/en/terms-and-conditions/">Terms</a> |
        <a href="/en/privacy-policy/">Privacy</a> |
        <a href="/en/refund-policy/">Refunds</a>
      </p>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>`,
    de: `<nav class="footer-navigation">
    <div class="container">
      <div class="row">
        <div class="three columns">
          <a href="/de/about/">About us</a>
          <a href="/de/posts/diving-how-to-guides-koh-chang/">How to guides</a>
          <a href="/de/faqs/faq-getting-here-accommodation/">Getting to Koh Chang</a>
          <a href="/de/dive-sites/">Dive sites</a>
          <a href="/de/faqs/">FAQs</a>
          <a href="/de/videos/">Videos</a>
          <a href="/de/contact/">Contact us</a>
        </div>
        <div class="three columns">
          <a href="/de/courses/">Courses</a>
          <a href="/de/courses/open-water-diver/">Open Water Diver</a>
          <a href="/de/courses/advanced/">Advanced Diver</a>
          <a href="/de/courses/rescue-diver/">Rescue Diver</a>
          <a href="/de/courses/divemaster/">Divemaster</a>
          <a href="/de/courses/sdi-idc/">IDC</a>
        </div>
        <div class="three columns">
          <a href="/de/day-trips/">Day Trips</a>
          <a href="/de/day-trips/fun-dives/">Fun Dives</a>
          <a href="/de/day-trips/try-dive/">Try Diving</a>
          <a href="/de/day-trips/scuba-review/">Scuba Review</a>
          <a href="/de/day-trips/snorkeling/">Snorkeling</a>
        </div>
        <div class="three columns">
          <a href="/de/courses/open-advanced-package/">OW & Advanced</a>
          <a href="/de/courses/deep-wreck-nitrox/">Deep, Wreck, Nitrox</a>
          <a href="/de/courses/open-to-divemaster/">Open to Divemaster</a>
          <a href="/de/courses/tech-package/">Technical Diving</a>
        </div>
      </div>
    </div>
  </nav>
  <div class="footer-meta">
    <div class="container">
      <p><strong>Phone, WhatsApp & Line:</strong> +66 (0) 894-013-927</p>
      <p>
        Chang Diving Center Co.,Ltd<br>
        21/52 Moo 4, Klong Prao Beach<br>
        Koh Chang, Trat, Thailand 23170
      </p>
      <div class="footer-links">
        <a href="/de/privacy-policy/">Datenschutz</a>
        <a href="/de/terms-and-conditions/">AGB</a>
        <a href="/de/refund-policy/">Rückerstattung</a>
      </div>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>`,
    th: `<nav class="footer-navigation">
    <div class="container">
      <div class="row">
        <div class="three columns">
          <a href="/th/about/">About us</a>
          <a href="/th/posts/diving-how-to-guides-koh-chang/">How to guides</a>
          <a href="/th/faqs/faq-getting-here-accommodation/">Getting to Koh Chang</a>
          <a href="/th/dive-sites/">Dive sites</a>
          <a href="/th/faqs/">FAQs</a>
          <a href="/th/videos/">Videos</a>
          <a href="/th/contact/">Contact us</a>
        </div>
        <div class="three columns">
          <a href="/th/courses/">Courses</a>
          <a href="/th/courses/open-water-diver/">Open Water Diver</a>
          <a href="/th/courses/advanced/">Advanced Diver</a>
          <a href="/th/courses/rescue-diver/">Rescue Diver</a>
          <a href="/th/courses/divemaster/">Divemaster</a>
          <a href="/th/courses/sdi-idc/">IDC</a>
        </div>
        <div class="three columns">
          <a href="/th/day-trips/">Day Trips</a>
          <a href="/th/day-trips/fun-dives/">Fun Dives</a>
          <a href="/th/day-trips/try-dive/">Try Diving</a>
          <a href="/th/day-trips/scuba-review/">Scuba Review</a>
          <a href="/th/day-trips/snorkeling/">Snorkeling</a>
        </div>
        <div class="three columns">
          <a href="/th/courses/open-advanced-package/">OW & Advanced</a>
          <a href="/th/courses/deep-wreck-nitrox/">Deep, Wreck, Nitrox</a>
          <a href="/th/courses/open-to-divemaster/">Open to Divemaster</a>
          <a href="/th/courses/tech-package/">Technical Diving</a>
        </div>
      </div>
    </div>
  </nav>
  <div class="footer-meta">
    <div class="container">
      <p><strong>Phone, WhatsApp & Line:</strong> +66 (0) 894-013-927</p>
      <p>
        บจก ช้างไดร์วิ่ง เซ็นเตอร์<br>
        21/52 หมู่ที่ 4,<br>
        อ.เกาะช้าง ต.เกาะช้าง จ.ตราด
        23170 ประเทศไทย
      </p>
      <p>
        <a href="/th/terms-and-conditions/">Terms</a> |
        <a href="/th/privacy-policy/">Privacy</a> |
        <a href="/th/refund-policy/">Refunds</a>
      </p>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>`,
  };
  var footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = footers[lang] || footers["en"];
  }
});

function openLightbox(src) {
  var lightbox = document.getElementById("lightbox");
  var img = document.getElementById("lightbox-img");
  if (img && lightbox) {
    img.src = src;
    lightbox.style.display = "flex";
  }
}
function closeLightbox() {
  var lightbox = document.getElementById("lightbox");
  var img = document.getElementById("lightbox-img");
  if (img && lightbox) {
    img.src = "";
    lightbox.style.display = "none";
  }
}

// YouTube Lite Embed - Performance Optimized (Simplified)
// ---------------------------------------------

// Global function - DIRECT CONTAINER APPROACH (no more nested containers!)
function loadYouTubeVideo(element, videoId, title) {
  console.log("[YouTube Lite] 🎬 Direct container approach for:", videoId);

  if (!element || !videoId) {
    console.error("[YouTube Lite] ❌ Missing element or videoId");
    return;
  }

  // The element IS the video container now (no more nested searching!)
  const videoContainer = element;

  if (videoContainer.classList.contains("lyt-activated")) {
    console.log("[YouTube Lite] ⚠️ Video already loaded");
    return;
  }

  console.log("[YouTube Lite] 🚀 Starting direct replacement...");

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = title || "YouTube Video";
  iframe.frameBorder = "0";
  iframe.allowFullscreen = true;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

  // Direct replacement - no background image interference
  videoContainer.innerHTML = "";
  videoContainer.style.backgroundImage = "none";
  videoContainer.appendChild(iframe);
  videoContainer.classList.add("lyt-activated");

  console.log(
    "[YouTube Lite] ✅ Direct replacement completed - no more nested containers!",
  );
}
function initYouTubeLite() {
  console.log("[YouTube Lite] Initializing...");

  // Find all youtube-lite-embed elements
  const youtubeLiteElements = document.querySelectorAll(".youtube-lite-embed");

  console.log(
    "[YouTube Lite] Found",
    youtubeLiteElements.length,
    "video elements",
  );

  youtubeLiteElements.forEach((element, index) => {
    const videoId = element.getAttribute("data-videoid");
    const title = element.getAttribute("data-title") || "YouTube Video";

    console.log(
      `[YouTube Lite] Processing video ${index + 1}:`,
      videoId,
      title,
    );

    if (!videoId) {
      console.warn("[YouTube Lite] No video ID found for element", element);
      return;
    }

    // Set background image (YouTube thumbnail)
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    element.style.backgroundImage = `url("${thumbnailUrl}")`;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";

    // Add fallback background color and text if thumbnail fails to load
    element.style.backgroundColor = "#000";
    element.style.color = "#fff";
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";

    console.log(
      `[YouTube Lite] Set thumbnail for video ${index + 1}:`,
      thumbnailUrl,
    );

    // Remove any existing click handlers
    element.replaceWith(element.cloneNode(true));
    const newElement = document.querySelectorAll(".youtube-lite-embed")[index];

    // Add click handler to the element AND the play button
    function handleVideoClick(e) {
      e.preventDefault();
      e.stopPropagation();

      console.log(
        `[YouTube Lite] Click detected on video ${index + 1}:`,
        videoId,
      );

      if (newElement.classList.contains("lyt-activated")) {
        console.log(`[YouTube Lite] Video ${index + 1} already activated`);
        return;
      }

      console.log(`[YouTube Lite] Loading video ${index + 1}:`, videoId);

      // Clear existing content
      newElement.innerHTML = "";

      const iframe = document.createElement("iframe");
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.title = title;
      iframe.frameBorder = "0";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      iframe.style.position = "absolute";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.zIndex = "10";

      newElement.appendChild(iframe);
      newElement.classList.add("lyt-activated");

      console.log(`[YouTube Lite] Successfully loaded video ${index + 1}`);
    }

    // Add click handler to container
    newElement.addEventListener("click", handleVideoClick);

    // Add click handler to play button
    const playButton = newElement.querySelector(".lty-playbtn");
    if (playButton) {
      playButton.addEventListener("click", handleVideoClick);
      console.log(
        `[YouTube Lite] Added click handler to play button ${index + 1}`,
      );
    }
  });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  console.log("[YouTube Lite] DOM loaded, initializing...");
  console.log(
    "[YouTube Lite] loadYouTubeVideo function available:",
    typeof loadYouTubeVideo === "function",
  );
  initYouTubeLite();
});

// Also initialize after delays to catch any dynamic content
setTimeout(() => {
  console.log("[YouTube Lite] Secondary initialization after 500ms...");
  initYouTubeLite();
}, 500);

setTimeout(() => {
  console.log("[YouTube Lite] Tertiary initialization after 1000ms...");
  initYouTubeLite();
}, 1000);

// Make function globally available
window.loadYouTubeVideo = loadYouTubeVideo;

// Test function for console debugging
window.testYouTubeLoad = function () {
  console.log("[YouTube Test] 🧪 Testing YouTube loading...");
  const testElement = document.querySelector(".youtube-lite-embed");
  if (testElement) {
    console.log("[YouTube Test] 📍 Found test element:", testElement);
    loadYouTubeVideo(testElement, "gnjOODLvkqo", "Test Video");
  } else {
    console.error("[YouTube Test] ❌ No test element found");
  }
};

// Click test function
window.testClick = function () {
  console.log("[YouTube Test] 🖱️ Simulating click...");
  const element = document.querySelector(".youtube-lite-embed");
  if (element) {
    element.click();
  } else {
    console.error("[YouTube Test] ❌ No element to click");
  }
};

// Performance Optimization: Add lazy loading to all tile images
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Add loading="lazy" to all images in .three.columns containers (tiles)
  const tileImages = document.querySelectorAll(".three.columns img");
  tileImages.forEach(function (img) {
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
  });

  // Add loading="lazy" to all images in .row containers that don't have it
  const rowImages = document.querySelectorAll(".row img");
  rowImages.forEach(function (img) {
    if (!img.hasAttribute("loading") && !img.closest(".hero")) {
      img.setAttribute("loading", "lazy");
    }
  });

  console.log(
    "[PERF] Lazy loading added to",
    tileImages.length,
    "tile images and",
    rowImages.length,
    "row images",
  );
});
