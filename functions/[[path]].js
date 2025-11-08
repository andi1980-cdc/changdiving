// /functions/[[path]].js
// Reihenfolge:
// 1) Eigene 301 (EXACT, dann PREFIX) -> sofort redirect
// 2) Pages laufen lassen (statische Dateien + _redirects)
// 3) Wenn 404: 410 (EXACT, dann PREFIX, dann global außerhalb Sprachpfade)
// Robust gg. Slashes & Tippfehler, mit X-Debug-Header zur Diagnose.
// Cache-Control: no-store für 410-Responses verhindert Caching von gelöschten Inhalten.

const LANG_ROOTS = ["/en/", "/de/", "/th/"];

function normPath(raw) {
  // strip query/hash, compress //, trim, remove trailing slash (außer '/', '/en/', '/de/', '/th/')
  let p = raw.split("?")[0].split("#")[0].replace(/\/{2,}/g, "/").trim();

  if (p === "/") return "/";
  if (LANG_ROOTS.includes(p)) return p;
  return p.replace(/\/+$/, "");
}

function ensureLeadingSlash(p) {
  return p.startsWith("/") ? p : `/${p}`;
}

function joinUrl(base, suffix) {
  if (!suffix || suffix === "/") return base;
  const b = base.replace(/\/+$/, "");
  const s = suffix.replace(/^\/+/, "");
  return `${b}/${s}`;
}

// Cache-Control-Header für 410-Responses (verhindert Caching von gelöschten Inhalten)
function getNoCacheHeaders(contentType, debugInfo) {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "X-Debug": debugInfo
  };
}

// --- Root-Dateien, die auch außerhalb Sprachpfaden 200 sein dürfen ---
const ROOT_FILES = new Set([
  "/", "/style.css", "/robots.txt", "/sitemap.xml", "/sitemap-images.xml",
  "/site.webmanifest", "/favicon.ico", "/favicon.svg", "/404.html", "/410.html"
]);

function isAsset(path) {
  return (
    path.startsWith("/img/") || path.startsWith("/images/") ||
    path.startsWith("/css/") || path.startsWith("/js/") ||
    path.startsWith("/fonts/") || path.startsWith("/docs/") ||
    path.startsWith("/.well-known/") || ROOT_FILES.has(path) ||
    path.startsWith("/favicon") // z. B. /favicon-32x32.png
  );
}

function isInLang(path) {
  return path === "/" || LANG_ROOTS.some(pre => path.startsWith(pre));
}

// --------------------- 301 REDIRECT LISTEN ---------------------
// 👉 Pflege HIER: from ohne/mit Slash egal – wird normalisiert.
//    to am besten mit Slash (außer zielt auf Datei .pdf/.jpg/.html etc.).

// 1) EXAKTE 301 — als Paare [from, to]
const REDIRECTS_EXACT_RAW = [
  // URL-RESTRUKTURIERUNG 2025: Alte WordPress-URLs zu neuen statischen URLs
  // BEISPIEL (aus deinem Test):
  ["/da/about", "/de/about/"],
  ["/de/2025/04", "/de/posts/"],
  ["/de/2025/05", "/de/posts/"],

  ["/de/about-search-recovery", "/de/posts/scuba-knowledge/about-search-recovery/"],
  ["/de/about-underwater-photography", "/de/posts/tips-and-tricks/about-underwater-photography/"],
  ["/de/about-us", "/de/about/"],
  ["/de/about/stornierung-und-rueckersattung", "/de/refund-policy/"],
  ["/de/agbs", "/de/terms-and-conditions/"],
  ["/de/anreise", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/apeks-dst4", "/de/equipment/"],
  ["/de/apeks-xtx-atemregulator-ueberblick", "/de/equipment/"],
  ["/de/apeks-xtx", "/de/equipment/"],
  ["/de/barrakudas-koh-chang", "/de/posts/marine-life-koh-chang/marine-life-barracuda/"],
  ["/de/best-dive-computers", "/de/posts/scuba-knowledge/best-dive-computers/"],
  ["/de/beginner-guide", "/de/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/de/book-in-advance", "/en/posts/straight-talk/book-in-advance/"],
  ["/de/blogs", "/de/posts/"],

  ["/de/certification-agencies", "/de/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/de/das-taucher-logbuch", "/de/posts/scuba-knowledge/dive-logbook/"],
  ["/de/diving-activities", "/de/posts/tips-and-tricks/diving-activities/"],
  ["de/diving-social-media/", "/de/posts/straight-talk/diving-social-media/"],
  ["/de/deep-diving", "/de/posts/tips-and-tricks/deep-diving/"],
  ["/de/der-weg-eines-sport-tauchers", "/de/posts/straight-talk/dive-professional-training/"],
  ["/de/die-10-beliebtesten-tauchaktivitaeten-auf-koh-chang-chang-diving-center", "/de/posts/tips-and-tricks/diving-activities/"],
  ["/de/die-besten-tauchcomputer-2025", "/de/posts/scuba-knowledge/best-dive-computers/"],
  ["/de/die-meerestiere-von-koh-chang-asianisches-pazifikum", "/de/posts/marine-life-koh-chang/"],
  ["/de/dive-professional-training", "/de/posts/straight-talk/dive-professional-training/"],
  ["/de/dive-sites/phutthayotfa-chulalok-wrack-koh-chang", "/de/dive-sites/phutthayotfa-chulalok-wreck-koh-chang/"],
  ["/de/diving-myths", "/de/posts/straight-talk/diving-myths/"],
  ["/de/dauer-owd-kurs-koh-chang", "/de/posts/tips-and-tricks/open-water-duration/"],
  ["/de/emergency-plan", "/en/posts/straight-talk/emergency-plan/"],

  // DE FAQs
  ["/de/faqs/faq-allgemeine-fragen-koh-chang", "/de/faqs/faq-general-questions-koh-chang/"],
  ["/de/faqs/faq-anreise-unterkunft-koh-chang", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/faqs/faq-diving-health-safety-thailand", "/de/faqs/faq-diving-health-safety-thailand/"],
  ["/de/faqs/faq-general-questions-koh-chang", "/de/faqs/faq-general-questions-koh-chang/"],
  ["/de/faqs/faq-getting-here-accommodation", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/faqs/faq-schnuppertauchen-fun-dives-koh-chang", "/de/faqs/faq-try-dive-fun-dives-koh-chang/"],
  ["/de/faqs/faq-tauchen-koh-chang", "/de/faqs/faq-diving-koh-chang/"],
  ["/de/faqs/faq-tauchkurse-koh-chang", "/de/faqs/faq-dive-courses-koh-chang/"], 
  ["/de/faqs/faq-buchung-bezahlung-tauchen-koh-chang", "/en/faqs/faq-booking-payment-scuba-koh-chang/"],
  ["/de/faqs/faq-ausruestung-logistik-koh-chang", "/en/faqs/faq-equipment-logistics-koh-chang/"],
  ["/de/faqs/getting-here-accommodation-frequently-asked-questions", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/faqs/hotels-in-der-naehe-der-tauchbasis", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/faqs/kreditkarten-zahlung", "/de/faqs/faq-booking-payment-scuba-koh-chang/"],
  ["/de/faqs/medizinischer-fragebogen-fuer-taucher", "/de/faqs/faq-diving-health-safety-thailand/"],
  ["/de/faqs/sollte-ich-vorab-buchen", "/de/faqs/faq-booking-payment-scuba-koh-chang/"],
  ["/de/faqs/tauchen-als-brillentraeger", "/de/faqs/faq-diving-health-safety-thailand/"],
  ["/de/faqs/wann-ist-die-beste-tauchzeit-auf-koh-chang-und-was-erwartet-mich", "/de/faqs/faq-general-questions-koh-chang/"],
  ["/de/faqs/was-ist-die-beste-moeglichkeit-geld-nach-thailand-zu-ueberweisen", "/de/faqs/faq-booking-payment-scuba-koh-chang/"],
  ["/de/faqs/wie-komme-ich-zur-tauchbasis", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/faqs/wo-befindet-sich-die-tauchbasis", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/faqs/in-welchen-sprachen-finden-die-tauchkurse-statt", "/de/faqs/faq-diving-health-safety-thailand/"],
  
  ["/de/forms", "/de/posts/"],
  ["/de/fun-diving-koh-chang-schritt-fuer-schritt-2025", "/de/posts/diving-how-to-guides-koh-chang/how-to-fun-dives/"],
  ["/de/funktion-der-ersten-stufe-apeks-dst", "/de/posts/"],
  ["/de/gasverbrauch-beim-tauchen", "/de/posts/scuba-knowledge/gas-consumption/"],
  ["/de/gas-consumption", "/de/posts/scuba-knowledge/gas-consumption/"],
  ["/de/geschaeftsbedingungen", "/de/terms-and-conditions/"],
  ["/de/getting-to-koh-chang", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/gruene-meeresschildkroete-koh-chang", "/de/posts/marine-life-koh-chang/marine-life-green-sea-turtle/"],
  ["/de/home/", "/de/"],
  
  // DE How-To Guides
  ["/de/how-to-advanced-course", "/de/posts/diving-how-to-guides-koh-chang/how-to-advanced-course/"],
  ["/de/how-to-fun-dives", "/de/posts/diving-how-to-guides-koh-chang/how-to-fun-dives/"],
  ["/de/how-to-master-scuba-diver", "/de/posts/diving-how-to-guides-koh-chang/how-to-master-scuba-diver/"],
  ["/de/how-to-open-advanced", "/de/posts/diving-how-to-guides-koh-chang/how-to-open-advanced/"],
  ["/de/how-to-open-water-course", "/de/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/de/how-to-rescue-diver", "/de/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver/"],
  ["/de/how-to-specialty-courses", "/de/posts/diving-how-to-guides-koh-chang/how-to-specialty-courses/"],
  ["/de/how-to-try-dive", "/de/posts/diving-how-to-guides-koh-chang/"],
  ["/de/how-we-run-your-diving-course-or-day-trip", "/de/posts/diving-how-to-guides-koh-chang/"],
  ["/de/how-to-scuba-review", "/de/posts/diving-how-to-guides-koh-chang/how-to-scuba-review/"],
  
  ["/de/koh-chang-reisefuehrer", "/de/posts/koh-chang-diving-travel-guides/travel-guide/"],
  ["/de/kontakt", "/de/contact/"],
  ["/de/luftverbrauch-beim-sport-tauchen", "/de/posts/scuba-knowledge/gas-consumption/"],
  
  // DE Marine Life
  ["/de/marine-life-barracuda", "/de/posts/marine-life-koh-chang/marine-life-barracuda/"],
  ["/de/marine-life-batfish", "/de/posts/marine-life-koh-chang/marine-life-batfish/"],
  ["/de/marine-life-blacktip-reef-shark", "/de/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/de/marine-life-green-sea-turtle", "/de/posts/marine-life-koh-chang/marine-life-green-sea-turtle/"],
  ["/de/marine-life-nudibranch", "/de/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/de/marine-life-titan-triggerfish", "/de/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/de/marine-life-whale-shark", "/de/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/de/marine-life", "/de/posts/marine-life-koh-chang/"],
  ["/de/posts/marine-life-koh-chang/nudibranchs", "/de/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  
  ["/de/nitrox-info", "/de/posts/scuba-knowledge/nitrox-info/"],
  ["/de/nudibranchs-koh-chang", "/en/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/de/ocean-climate", "/de/posts/straight-talk/ocean-climate/"],
  ["/de/open-water-duration", "/de/posts/tips-and-tricks/open-water-duration/"],
  ["/de/notfallplan-bei-tauchunfaellen-auf-koh-chang", "/de/posts/straight-talk/emergency-plan/"],
  ["/de/padi-vs-sdi-tdi-welches-tauchausbildungssystem-passt-zu-dir", "/de/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/de/pirm-udom-sub-nachhaltiges-tauchen-auf-koh-chang", "/de/posts/straight-talk/sustainable-diving/"],
  ["/de/posts/straight-talk/ozean-und-klima", "/de/posts/straight-talk/ocean-climate/"],
  ["/de/posts/tipps-und-tricks/tauchaktivitaeten", "/de/posts/tips-and-tricks/diving-activities/"],
  ["/de/preise", "/de/prices/"],
  ["/de/privacy-policy", "/de/privacy-policy/"],
  ["/de/reel-and-guideline-use", "/de/posts/tips-and-tricks/reel-guideline/"],
  ["/de/reel-guideline", "/de/posts/tips-and-tricks/reel-guideline/"],
  ["/de/refund-policy", "/de/refund-policy/"],
  ["/de/schwarzspitzen-riffhaie-koh-chang", "/de/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/de/safety-check", "/de/posts/scuba-knowledge/safety-check/"],
  ["/de/smb-guide", "/de/posts/scuba-knowledge/smb-guide/"],
  ["/de/so-laeuft-der-open-water-diver-kurs-bei-chang-diving-ab-schritt-fuer-schritt-2025-koh-chang", "/de/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/de/suchen-und-bergen-beim-tauchen", "/de/posts/scuba-knowledge/about-search-recovery/"],
  ["/de/surface-marker-buoy-smb-warum-ist-sie-wichtig-und-was-bedeuten-die-farben", "/de/posts/scuba-knowledge/smb-guide/"],
  ["/de/sustainable-diving", "/de/posts/straight-talk/sustainable-diving/"],
  ["/de/tauchen-fuer-anfaenger-guide", "/de/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/de/tauchen-golf-von-thailand-vs-andamanensee", "/de/posts/koh-chang-diving-travel-guides/thailand-diving-comparison/"],
  ["/de/tauchen-mythen-und-wahrheit", "/de/posts/straight-talk/diving-myths/"],
  ["/de/tauchen-social-media", "/de/posts/straight-talk/diving-social-media/"],
  ["/de/terms-and-conditions", "/de/terms-and-conditions/"],
  ["/de/thailand-diving-comparison", "/de/posts/koh-chang-diving-travel-guides/thailand-diving-comparison/"],
  ["/de/tieftauchen-was-ist-das", "/de/posts/tips-and-tricks/deep-diving/"],
  ["/de/titan-drueckerfisch-koh-chang", "/de/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/de/travel-guide", "/de/posts/koh-chang-diving-travel-guides/travel-guide/"],
  ["/de/unterwasserfotografie-tipps", "/de/posts/tips-and-tricks/about-underwater-photography/"],
  ["/de/courses/technical-diving", "/de/courses/technical-diving-courses/"],
  ["/de/walhaie-auf-koh-chang-eine-begegnung-der-besonderen-art", "/de/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  
  // DE warum
  ["/de/warum-der-advanced-open-water-diver", "/de/courses/advanced/"],
  ["/de/warum-es-wichtig-ist-dein-tauchabenteuer-in-koh-chang-im-voraus-zu-buchen", "/de/posts/straight-talk/book-in-advance/"],
  ["/de/warum-ist-der-luftverbrauch-beim-tauchen-wichtig-chang-diving-center", "/de/posts/scuba-knowledge/gas-consumption/"],
  ["/de/warum-ist-der-luftverbrauch-beim-tauchen-wichtig", "/de/posts/scuba-knowledge/gas-consumption/"],
  ["/de/warum-ist-ein-sicherheitscheck-vor-dem-tauchen-auf-koh-chang-wichtig", "/de/posts/scuba-knowledge/safety-check/"],
  
  ["/de/was-ist-nitrox", "/de/posts/scuba-knowledge/nitrox-info/"],
  ["/de/wetter-koh-chang", "/de/weather/"],
  ["/de/wie-ein-try-dive-bei-chang-diving-ablaeuft-schritt-fuer-schritt-2025-koh-chang", "/de/posts/diving-how-to-guides-koh-chang/how-to-try-dive/"],
  ["/de/wracktauchen-koh-chang", "/de/posts/scuba-knowledge/wreck-diving-koh-chang/"],
  ["/de/wreck-diving-koh-chang", "/de/posts/scuba-knowledge/wreck-diving-koh-chang/"],
  ["/de/which-course", "/de/posts/tips-and-tricks/which-course/"],
  
  // Additional missing redirects from Google Search Console errors
  ["/en/apeks-xtx", "/en/equipment/"],
  ["/en/book-in-advance", "/en/posts/straight-talk/book-in-advance/"],
  
  // EN about
  ["/en/about/dive-schedule", "/en/about/"],
  ["/en/about/refund-policy", "/en/about/"],
  ["/en/about/the-dive-process", "/en/about/"],
  ["/en/about-search-recovery", "/en/posts/scuba-knowledge/about-search-recovery/"],
  ["/en/about-underwater-photography", "/en/posts/tips-and-tricks/about-underwater-photography/"],
  
  ["/en/best-dive-computers", "/en/posts/scuba-knowledge/best-dive-computers/"],
  ["/en/certification-agencies", "/en/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/en/beginner-guide", "/en/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/en/dive-professional-training", "/en/posts/straight-talk/dive-professional-training/"],
  ["/en/courses/technical-diving", "/en/courses/technical-diving-courses/"],

  ["/en/dive-logbook", "/en/posts/scuba-knowledge/dive-logbook/"],
  ["/en/deep-diving", "/en/posts/tips-and-tricks/deep-diving/"],
  ["/en/diving-myths", "/en/posts/straight-talk/diving-myths/"],
  ["/en/diving-activities", "/en/posts/tips-and-tricks/diving-activities/"],
  ["/en/diving-social-media", "/en/posts/straight-talk/diving-social-media/"],
  ["/en/emergency-plan", "/en/posts/straight-talk/emergency-plan/"],
  
  // EN FAQs
  ["/en/faqs/faq-booking-payment-scuba-koh-chang", "/en/faqs/faq-booking-payment-scuba-koh-chang/"],
  ["/en/faqs/faq-dive-courses-koh-chang", "/en/faqs/faq-dive-courses-koh-chang/"],
  ["/en/faqs/faq-diving-health-safety-thailand", "/en/faqs/faq-diving-health-safety-thailand/"],
  ["/en/faqs/faq-diving-koh-chang", "/en/faqs/faq-diving-koh-chang/"],
  ["/en/faqs/faq-equipment-logistics-koh-chang", "/en/faqs/faq-equipment-logistics-koh-chang/"],
  ["/en/faqs/faq-general-questions-koh-chang", "/en/faqs/faq-general-questions-koh-chang/"],
  ["/en/faqs/faq-try-dive-fun-dives-koh-chang", "/en/faqs/faq-try-dive-fun-dives-koh-chang/"],
  ["/en/faqs/getting-here-accommodation-frequently-asked-questions", "/en/faqs/faq-getting-here-accommodation/"],
  
  ["/en/gas-consumption", "/en/posts/scuba-knowledge/gas-consumption/"],
  ["/en/getting-to-koh-chang", "/en/faqs/faq-getting-here-accommodation/"],
  
  // EN How-To Guides
  ["/en/how-to-advanced-course", "/en/posts/diving-how-to-guides-koh-chang/how-to-open-advanced/"],
  ["/en/how-to-fun-dives", "/en/posts/diving-how-to-guides-koh-chang/how-to-fun-dives/"],
  ["/en/how-to-open-advanced", "/en/posts/diving-how-to-guides-koh-chang/how-to-open-advanced/"],
  ["/en/how-to-open-water-course", "/en/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/en/how-to-scuba-review", "/en/posts/diving-how-to-guides-koh-chang/how-to-scuba-review/"],
  ["/en/how-to-specialty-courses", "/en/posts/diving-how-to-guides-koh-chang/how-to-specialty-courses/"],
  ["/en/how-to-try-dive", "/en/posts/diving-how-to-guides-koh-chang/how-to-try-dive/"],
  ["/en/how-to-rescue-diver", "/en/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver/"],
  
  ["/en/life-as-a-diver", "/en/posts/straight-talk/dive-professional-training/"],
  
  // EN Marine Life
  ["/en/marine-life", "/en/posts/marine-life-koh-chang/"],
  ["/en/marine-life-barracuda", "/en/posts/marine-life-koh-chang/marine-life-barracuda/"],
  ["/en/marine-life-batfish", "/en/posts/marine-life-koh-chang/marine-life-batfish/"],
  ["/en/marine-life-blacktip-reef-shark", "/en/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/en/marine-life-green-sea-turtle", "/en/posts/marine-life-koh-chang/marine-life-green-sea-turtle/"],
  ["/en/marine-life-nudibranch", "/en/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/en/marine-life-titan-triggerfish", "/en/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/en/marine-life-whale-shark", "/en/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/en/posts/marine-life-koh-chang/nudibranchs", "/en/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  
  ["/en/nitrox-info", "/en/posts/scuba-knowledge/nitrox-info/"],
  ["/en/ocean-climate", "/en/posts/straight-talk/ocean-climate/"],
  ["/en/open-water-duration", "/en/posts/tips-and-tricks/open-water-duration/"],
  ["/en/padi-vs-sdi-tdi", "/en/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/en/privacy-policy", "/en/privacy-policy/"],
  ["/en/reel-guideline", "/en/posts/tips-and-tricks/reel-guideline/"],
  ["/en/refund-policy", "/en/refund-policy/"],
  ["/en/smb-guide", "/en/posts/scuba-knowledge/smb-guide/"],
  ["/en/sustainable-diving", "/en/posts/straight-talk/sustainable-diving/"],
  ["/en/safety-check", "/en/posts/scuba-knowledge/safety-check/"],
  ["/en/terms-and-conditions", "/en/terms-and-conditions/"],
  ["/en/thailand-diving-comparison", "/en/posts/koh-chang-diving-travel-guides/thailand-diving-comparison/"],
  ["/en/travel-guide", "/en/posts/koh-chang-diving-travel-guides/travel-guide/"],
  ["/en/which-course", "/en/posts/tips-and-tricks/which-course/"],
  ["/en/wreck-diving-koh-chang", "/en/posts/scuba-knowledge/wreck-diving-koh-chang/"],
  ["/en/why-advanced", "/en/posts/"],
  ["/th/การดำน้ำ-try-dive-กับ-chang-diving-ขั้นตอนง", "/th/posts/diving-how-to-guides-koh-chang/how-to-try-dive/"],
  ["/th/การทำงานของ-apeks-dst4", "/th/equipment/"],
  ["/th/การเดินทางไปเกาะช้าง", "/th/faqs/faq-getting-here-accommodation/"],
  ["/th/ฉลามวาฬที่เกาะช้าง-ประส", "/th/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/th/ฉลามวาฬที่เกาะช้าง-ประส", "/th/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/th/ติดต่อ", "/th/contact/"],
  ["/th/ติดต่อเรา", "/th/contact/"],
  
  // TH FAQs
  ["/th/ปลาและปะการัง-เกาะช้าง-จ", "/th/posts/marine-life-koh-chang/"],
  ["/th/ปลาและปะการัง-เกาะช้าง-จ", "/th/posts/marine-life-koh-chang/"],
  ["/th/ปลาและปะการัง-เกาะช้าง-ต", "/th/posts/marine-life-koh-chang/"],
  ["/th/ปลาและปะการัง-เกาะช้าง-ต", "/th/posts/marine-life-koh-chang/"],

  // TH How-To Guides
  ["/th/เรียนดำน้ำ-open-water-กับ-chang-diving-คอร์ส", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/เส้นทางของนักดำน้ำ", "/th/posts/straight-talk/dive-professional-training/"],
  ["/th/about/dive-schedule", "/th/about/"],
  ["/th/about/refund-policy", "/th/refund-policy/"],
  ["/th/about-search-recovery", "/th/posts/scuba-knowledge/about-search-recovery/"],
  ["/th/about-us", "/th/about/"],
  ["/th/apeks-dst4", "/th/equipment/"],
  ["/th/apeks-first-stage-operation-dst4", "/th/equipment/"],
  ["/th/apeks-xtx", "/th/equipment/"],
  ["/th/book-in-advance", "/en/posts/straight-talk/book-in-advance/"],
  ["/th/beginner-guide", "/th/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/th/blacktip-reef-sharks-koh-chang", "/th/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/th/deep-diving", "/th/posts/tips-and-tricks/deep-diving/"],
  ["/th/dive-courses/advanced-open-water", "/th/courses/open-water-diver/"],
  ["/th/dive-courses/technical-diving", "/th/courses/technical-diving-courses/"],
  ["/th/dive-logbook", "/th/posts/scuba-knowledge/dive-logbook/"],
  ["/th/dive-professional-training", "/th/posts/straight-talk/dive-professional-training/"],
  ["/th/courses/technical-diving", "/th/courses/technical-diving-courses/"],
  ["/th/dive-sites/hin-kra-duang", "/th/dive-sites/"],
  ["/th/dive-sites/hin-ruea-taek", "/th/dive-sites/hin-rua-tek/"],
  ["/th/dive-sites/blueberry-hill", "/th/dive-sites/blueberry-hill/"],
  ["/th/diving-activities", "/th/posts/tips-and-tricks/diving-activities/"],
  ["/th/diving-myths", "/th/posts/straight-talk/diving-myths/"],
  ["/th/diving-thailand-gulf-vs-andaman", "/th/posts/koh-chang-diving-travel-guides/thailand-diving-comparison/"],
  ["/th/diving-social-media", "/th/posts/straight-talk/diving-social-media/"],
  ["/th/emergency-plan", "/th/posts/straight-talk/emergency-plan/"],
  
  // TH FAQs
  ["/th/faqs/faq-booking-payment-scuba-koh-chang", "/th/faqs/faq-booking-payment-scuba-koh-chang/"],
  ["/th/faqs/faq-dive-courses-koh-chang", "/th/faqs/faq-dive-courses-koh-chang/"],
  ["/th/faqs/faq-diving-koh-chang", "/th/faqs/faq-diving-koh-chang/"],
  ["/th/faqs/faq-diving-location-accommodation-koh-chang", "/th/faqs/faq-getting-here-accommodation/"], 
  ["/th/faqs/faq-equipment-logistics-koh-chang", "/th/faqs/faq-equipment-logistics-koh-chang/"],
  ["/th/faqs/faq-general-questions-koh-chang", "/th/faqs/faq-general-questions-koh-chang/"],
  ["/th/faqs/faq-getting-here-accommodation", "/th/faqs/faq-getting-here-accommodation/"],
  ["/th/faqs/getting-here-accommodation-frequently-asked-questions", "/th/faqs/faq-getting-here-accommodation/"],
  
  ["/th/gas-consumption", "/th/posts/scuba-knowledge/gas-consumption/"],
  ["/th/getting-to-koh-chang", "/th/faqs/faq-getting-here-accommodation/"],
  ["/th/green-sea-turtle-koh-chang", "/th/posts/marine-life-koh-chang/marine-life-green-sea-turtle/"],
  
  // TH How-To Guides
  ["/th/how-the-open-water-and-advanced-open-water-course-package-at-chang-diving-is-conducted-step-by-step-2025-koh-chang", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-advanced/"],
  ["/th/how-to-open-water-course", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/how-to-advanced-course", "/th/posts/diving-how-to-guides-koh-chang/how-to-advanced-course/"],
  ["/th/how-to-open-advanced", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-advanced/"],
  ["/th/how-to-specialty-courses", "/th/posts/diving-how-to-guides-koh-chang/how-to-specialty-courses/"],
  ["/th/how-to-scuba-review/", "/th/posts/diving-how-to-guides-koh-chang/how-to-scuba-review/"],
  ["/th/how-to-try-dive", "/th/posts/diving-how-to-guides-koh-chang/how-to-try-dive/"],
  ["/th/how-to-fun-dives/", "/th/posts/diving-how-to-guides-koh-chang/how-to-fun-dives/"],
  ["/th/how-to-rescue-diver", "/th/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver/"],
  ["/en/how-to-master-scuba-diver", "/en/posts/diving-how-to-guides-koh-chang/how-to-master-scuba-diver/"],
  
  ["/th/koh-chang-travel-guide", "/th/posts/koh-chang-diving-travel-guides/travel-guide/"],
  ["/th/life-as-a-diver", "/th/posts/straight-talk/dive-professional-training/"],
  
  // TH Marine Life
  ["/th/marine-life-barracuda", "/th/posts/marine-life-koh-chang/marine-life-barracuda/"],
  ["/th/marine-life-batfish", "/th/posts/marine-life-koh-chang/marine-life-batfish/"],
  ["/th/marine-life-blacktip-reef-shark", "/th/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/th/marine-life-titan-triggerfish", "/th/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/th/marine-life-whale-shark", "/th/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/th/marine-life-nudibranch/", "/th/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/th/marine-life-green-sea-turtle", "/th/posts/marine-life-koh-chang/marine-life-green-sea-turtle/"],
  ["/th/marine-life", "/th/posts/marine-life-koh-chang/"],
  ["/th/posts/marine-life-koh-chang/nudibranchs", "/th/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  
  ["/th/nitrox-info", "/th/posts/scuba-knowledge/nitrox-info/"],
  ["/th/nudibranchs-koh-chang", "/th/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/th/padi-vs-sdi-tdi", "/th/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/th/open-water-duration", "/th/posts/tips-and-tricks/open-water-duration/"],
  ["/th/reel-guideline", "/th/posts/tips-and-tricks/reel-guideline/"],
  ["/th/refund-policy", "/th/refund-policy/"],
  ["/th/scuba-diving-beginner-guide", "/th/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/th/smb-guide", "/th/posts/scuba-knowledge/smb-guide/"],
  ["/th/service-technician", "/th/equipment/"],
  ["/th/search-and-recovery-diving/", "/th/courses/search-recovery/"],
  ["/th/sustainable-diving", "/th/posts/straight-talk/sustainable-diving/"],
  ["/th/safety-check", "/th/posts/scuba-knowledge/safety-check/"],
  ["/th/safety-check/", "/th/posts/scuba-knowledge/safety-check/"],
  ["/th/terms-and-conditions", "/th/terms-and-conditions/"],
  ["/th/thailand-diving-comparison", "/th/posts/koh-chang-diving-travel-guides/thailand-diving-comparison/"],
  ["/th/the-best-dive-computers-2025", "/th/posts/scuba-knowledge/best-dive-computers/"],
  ["/th/the-dive-logbook", "/th/posts/scuba-knowledge/dive-logbook/"],
  ["/th/titan-triggerfish-koh-chang", "/th/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/th/travel-guide", "/th/posts/koh-chang-diving-travel-guides/travel-guide/"],
  ["/th/walhaie-auf-koh-chang-eine-begegnung-der-besonderen-art", "/th/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/th/which-course", "/th/posts/tips-and-tricks/which-course/"],
  ["/th/wreck-diving-koh-chang", "/th/posts/scuba-knowledge/wreck-diving-koh-chang/"],
  // weitere paare hier … ["/de/alt", "/de/neu/"],
];


// 2) PREFIX/WILDCARD 301 — als Objekte { from, to }
//    wirkt wie /from/* -> /to/:splat
const REDIRECTS_PREFIX_RAW = [
  // Redirect old product/store URLs to appropriate new pages
  // These were previously returning 410 (Gone) which hurt SEO
  { from: "/product", to: "/en/courses/" },
  { from: "/en/product", to: "/en/courses/" },
  { from: "/de/product", to: "/de/courses/" },
  { from: "/th/product", to: "/th/courses/" },

  { from: "/category", to: "/en/courses/" },
  { from: "/en/category", to: "/en/courses/" },
  { from: "/de/category", to: "/de/courses/" },
  { from: "/th/category", to: "/th/courses/" },

  { from: "/store", to: "/en/prices/" },
  { from: "/en/store", to: "/en/prices/" },
  { from: "/de/store", to: "/de/prices/" },
  { from: "/th/store", to: "/th/prices/" },

  { from: "/tag", to: "/en/posts/" },
  { from: "/en/tag", to: "/en/posts/" },
  { from: "/de/tag", to: "/de/posts/" },
  { from: "/th/tag", to: "/th/posts/" },

  // Old WordPress account/my-account URLs -> redirect to contact
  { from: "/account", to: "/en/contact/" },
  { from: "/en/account", to: "/en/contact/" },
  { from: "/de/account", to: "/de/contact/" },
  { from: "/th/account", to: "/th/contact/" },
  { from: "/my-account", to: "/en/contact/" },
  { from: "/en/my-account", to: "/en/contact/" },
  { from: "/de/my-account", to: "/de/contact/" },
  { from: "/th/my-account", to: "/th/contact/" },

  // Old dive-sites without language prefix -> redirect to English
  { from: "/dive-sites", to: "/en/dive-sites/" },
  
  // Old German dive-sites with wrong structure
  { from: "/de/tauchplätze", to: "/de/dive-sites/" },
  
  // Existing redirects
  { from: "/de/ueber-uns", to: "/de/about/" },
  { from: "/de/ueber-uns-chang-diving-center-koh-chang-thailand", to: "/de/about/" },
  { from: "/en/team", to: "/en/about/" },
  { from: "/en/about-us", to: "/en/about/" },
  { from: "/en/videos", to: "/en/videos/" },
  { from: "/de/videos", to: "/de/videos/" },
  { from: "/th/2018/07", to: "/th/posts/" },
  { from: "/th/2019/11", to: "/th/posts/" },
  { from: "/th/ds", to: "/th/dive-sites/" },
  { from: "/th/เกี่ยวกับ", to: "/th/about/" },
  { from: "/th/เกี่ยวกับ-ส่วนย่อยดำน้ำ", to: "/th/about/" },
  { from: "/th/จุดดำน้ำ", to: "/th/dive-sites/" },
  { from: "/th/วิดีโอ", to: "/th/videos/" },
  { from: "/th/หมวดหมู่", to: "/th/posts/" },
];

// In Maps/normalisierte Regeln umwandeln
const REDIRECTS_EXACT = new Map(
  REDIRECTS_EXACT_RAW
    .map(([from, to]) => [normPath(ensureLeadingSlash(from)), ensureLeadingSlash(to)])
    // Selbst-Redirects rausfiltern:
    .filter(([from, to]) => from !== normPath(to))
);

const REDIRECTS_PREFIX = REDIRECTS_PREFIX_RAW
  .map(({ from, to }) => ({ from: normPath(ensureLeadingSlash(from)), to: ensureLeadingSlash(to) }))
  // Selbst-Redirects entfernen
  .filter(({ from, to }) => from !== normPath(to));

// --------------------- 410 GONE LISTEN ---------------------
// 3) EXAKTE 410 — als Set (Strings). Vollständig URL-encodiert eintragen.
const FORCE_GONE_EXACT = new Set(
  [
    // Beispiele:
   "/what-is-nitrox//1000",
   "/de/123test/",
   "/de/about/boots-plan",
   "/de/about/die-anmeldung",
   "/de/about/dive-schedule",
   "/de/about/the-dive-process",
   "/de/about/refund-policy/",
   "/de/about-us/refund-policy",
   "/de/download-der-erforderlichen-unterlagen/",
   "/de/nationalparks-in-thailand-und-koh-chang",
   "/de/natuerlich-haben-wir-schon-wracks-betaucht",
   "/de/required-paperwork-for-certified-divers",
   "/de/service-technician",
   "/de/the-dive-process",
   "/de/warum-der-advanced-open-water-diver//1000",
   "/de/why-advanced",
   "/de/zertifizierungs-agenturen",
   "/en/apeks-dst4",
   "/en/apeks-xtx",
   "/en/certification-type/sdi",
   "/en/certification-type/padi",
   "/en/forms",
  "/en/nationalparks-in-thailand-and-koh-chang",
  "/en/service-technician",
  "/en/the-dive-process",
  "/th/ปริมาณอากาศที่ใช้หายใจ", 
  "/th/อุทยานแห่งชาติ",
  "/th/about/ตารางการดำน้ำ",
  "/th/about/นโยบายการคืนเงิน",
  "/th/การใช้รอกเชือก-และเชือก",
  "/th/การใช้รอกเชือก-และเชือก",
  "/th/การดำน้ำ-try-dive-กับ-chang-diving-ขั้นตอนง",
  "/th/การเดินทางไปเกาะช้าง",
  "/th/ทีม/นาย-ฤทธิชัย-ชำห้าน",
  "/th/เกี่ยวกับเรา-ศูนย์ดำน้",
  "/th/เกี่ยวกับเรา-ศูนย์ดำน้/นโยบายการคืนเงิน/",
  "/th/เกี่ยวกับเรา-ศูนย์ดำน้/กระบวนการดำน้ำ",
  "/th/เกี่ยวกับเรา-ศูนย์ดำน้/ตารางการดำน้ำ",
  "/th/เกี่ยวกับเรา",
  "/th/เกี่ยวกับเรา/กระบวนการดำน้ำ",
  "/th/เกี่ยวกับเรา/ตารางการดำน้ำ",
  "/th/ฉลามวาฬที่เกาะช้าง-ประส",
  "/th/ใช่-เราเคยดำน้ำซากเรือจ",
  "/th/ใช่-เราเคยดำน้ำซากเรือจ",
  "/th/ซากเรือที่น่าทึ่งของเก",
  "/th/ดาวน์โหลดแบบฟอร์มที่จำ",
  "/th/ดาวน์โหลดแบบฟอร์มที่จำ",
  "/th/ติดต่อ",
  "/th/ติดต่อเรา",
  "/th/ไนตร็อกซ์คืออะไร-และทำไ",
  "/th/ปริมาณอากาศที่ใช้หายใจ",
  "/th/ปลาและปะการัง-เกาะช้าง-จ",
  "/th/ปลาและปะการัง-เกาะช้าง-ต",
  "/th/แผนฉุกเฉินสำหรับอุบัติ",
  "/th/พยากรณ์สภาพอากาศที่เกาะช้าง",
  "/th/เพิ่มอุดมทรัพย์-การดำน้ำ",
  "/th/เพิ่มอุดมทรัพย์-การดำน้ำ",
  ["/th/เราสอนการดำน้ำ-อย่างไร", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/เราสอนการดำน้ำ-อย่างไร", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/เรียนดำน้ำ-open-water-กับ-chang-diving-คอร์ส", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/เรือช้างไดฟ์วิ่ง-กับ-ขั้", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/หลักสูตรณาณำน้ำแบบไหนที่", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/หลักสูตรดำน้ำแบบไหนที่", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/อากาศผสมพิเศษไนตรอก-คือ", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/อุทยานแห่งชาติ", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/เอกสารที่จำเป็นสำหรับน", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/about-us/refund-policy", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/about/the-dive-process", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/cdc-b", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/cdc-smb", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/cdc-w", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/cdc-np", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/the-dive-process", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/fun-diving-koh-chang-วิธีการ-2025", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/forms", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/why-advanced", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
    // weitere exakte 410er hier …
  ].map(entry => {
    const raw = Array.isArray(entry) ? entry[0] : entry;
    return normPath(ensureLeadingSlash(raw));
  })
);

// 4) PREFIX 410 — alles darunter Gone - wildcard (Strings)
// IMPORTANT: Removed product/category/store/tag - these now redirect via REDIRECTS_PREFIX
const FORCE_GONE_PREFIX = [

     // TH Wildcards (only truly gone pages)
     "/th/th",
     "/th/cdc",
     "/th/ร้านค้า",
     "/th/คำถามที่พบบ่อย",
     "/th/แท็ก",

     // EN Wildcards (only truly gone pages)
     "/en/en",

     // DE Wildcards (only truly gone pages)
     "/de/2020",
     "/de/tauchplätze",
     "/de/Kategorie",
     "de/kurse",
     "/de/team",
     "/de/Verfasser",
     "/de/de",
     // Legacy WordPress / Store assets no longer served
     "/wp-content",
     "/wp-includes",
     "/wp-admin",
     "/store",
     "/product",
     "/en/store",
     "/de/store",
     "/th/store",
     "/en/product",
     "/de/product",
     "/th/product",
     "/en/forms",
     "/de/forms",
     "/th/forms",
  // ggf. weitere Präfixe …
].map(p => normPath(ensureLeadingSlash(p)));

function findPrefixRule(path, rules) {
  for (const from of rules) {
    if (path === from || path.startsWith(from + "/")) return from;
  }
  return null;
}

function findExactRedirect(path, redirectsMap) {
  // Direct match since path is already decoded
  if (redirectsMap.has(path)) {
    return redirectsMap.get(path);
  }
  
  return null;
}

function findPrefixRedirect(path, rules) {
  for (const { from, to } of rules) {
    // Normalize from path (remove trailing slash)
    const fromNorm = from.replace(/\/+$/, "");
    // Normalize to path (ensure trailing slash)
    const toNorm = to.endsWith("/") ? to : to + "/";
    
    // Check exact match or prefix match
    if (path === fromNorm || path.startsWith(fromNorm + "/")) {
      // For category redirects, don't append the rest path
      // This bundles all subcategories to the main category
      return `https://changdiving.com${toNorm}`;
    }
  }
  return null;
}

function withDebug(res, tag) {
  const h = new Headers(res.headers || {});
  if (!h.has("X-Debug")) h.set("X-Debug", tag);
  return new Response(res.body, { status: res.status, headers: h });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const { request } = context;

  // 1) Pfad sauber normalisieren - verbesserte URL-Dekodierung
  const singleEncoded = url.pathname.replace(/%25([0-9A-Fa-f]{2})/g, "%$1");
  const path = decodeURI(singleEncoded);

  // 2) Pfad normalisieren (Slashes, etc.)
  const normalizedPath = normPath(path);

  // --- SPECIAL: Server-side language detection for root domain ---
  if (normalizedPath === '/') {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /bot|crawler|spider|crawling|google|bing|yahoo|duckduckgo|baidu|yandex|slurp|facebookexternalhit|linkedinbot|whatsapp|telegram|slack/i.test(userAgent);

    if (!isBot && !url.searchParams.has('noredirect')) {
      let detectedLang = 'en';
      const cookieString = request.headers.get('Cookie') || '';

      const langCookie = cookieString.split(';').find(c => c.trim().startsWith('user_lang='));
      if (langCookie) {
        const lang = langCookie.split('=')[1];
        if (['en', 'de', 'th'].includes(lang)) {
          detectedLang = lang;
        }
      }

      if (!langCookie) {
        const acceptLanguage = request.headers.get('Accept-Language');
        if (acceptLanguage) {
          const langCode = acceptLanguage.split(',')[0].trim().toLowerCase().substring(0, 2);
          if (langCode === 'de') detectedLang = 'de';
          else if (langCode === 'th') detectedLang = 'th';
        } else if (request.headers.get('CF-IPCountry') === 'TH') {
          detectedLang = 'th';
        }
      }

      let assetResponse = await context.env.ASSETS.fetch(new URL(`/${detectedLang}/index.html`, url));
      if (!assetResponse.ok) {
        assetResponse = await context.env.ASSETS.fetch(new URL('/en/index.html', url));
        detectedLang = 'en';
      }

      const headers = new Headers(assetResponse.headers);
      headers.set('Content-Language', detectedLang);
      headers.set('Set-Cookie', `user_lang=${detectedLang}; Path=/; Max-Age=2592000; SameSite=Lax`);
      headers.set('Cache-Control', 'private, max-age=0, no-cache, no-store');

      const existingVary = headers.get('Vary');
      const varyValues = new Set(
        (existingVary || '')
          .split(',')
          .map(v => v.trim())
          .filter(Boolean)
      );
      varyValues.add('Accept-Language');
      varyValues.add('Cookie');
      headers.set('Vary', Array.from(varyValues).join(', '));

      headers.set('X-Debug', 'language-rewrite');

      return new Response(assetResponse.body, {
        status: assetResponse.status,
        headers
      });
    }
  }

  // --- 0.5) Language root redirects (ensure trailing slash) ---
  if (normalizedPath === '/en' || normalizedPath === '/de' || normalizedPath === '/th') {
    return new Response(null, { 
      status: 301, 
      headers: { 
        Location: `https://changdiving.com${normalizedPath}/`,
        "X-Debug": "301-lang-root" 
      } 
    });
  }

  // --- 0.6) CRITICAL FIX: Force trailing slash for all language paths ---
  // Google sees URLs without trailing slashes and marks them as "Page with redirect"
  // We need to handle these with 301 BEFORE Cloudflare's automatic 308 redirect
  // This applies to language paths that don't end with slash and aren't assets/files
  if (isInLang(path) && !isAsset(path) && !path.endsWith('/') && !LANG_ROOTS.includes(path)) {
    // URL like /en/dive-sites should redirect to /en/dive-sites/
    return new Response(null, {
      status: 301,
      headers: {
        Location: `https://changdiving.com${path}/`,
        "X-Debug": "301-trailing-slash"
      }
    });
  }

  // --- 0.7) FORCE GONE EXAKT/PREFIX ---
  if (FORCE_GONE_EXACT.has(normalizedPath) || findPrefixRule(normalizedPath, FORCE_GONE_PREFIX)) {
    // Assets haben eigene Handhabung unten – nur wenn kein Asset
    if (isAsset(normalizedPath)) {
      return await context.next();
    }
    try {
      const html = await context.env.ASSETS.fetch(new URL("/410.html", url)).then(r => r.text());
      return new Response(html, { 
        status: 410, 
        headers: getNoCacheHeaders("text/html; charset=utf-8", "410-prefix")
      });
    } catch (error) {
      // Fallback: einfache 410 Response
      return new Response("410 Gone", { 
        status: 410, 
        headers: getNoCacheHeaders("text/plain; charset=utf-8", "410-prefix-fallback")
      });
    }
  }

  // --- 1) 301 EXAKT ---
  const exactRedirect = findExactRedirect(normalizedPath, REDIRECTS_EXACT);
  if (exactRedirect) {
    return new Response(null, { status: 301, headers: { Location: exactRedirect, "X-Debug": "301-exact" } });
  }

  // --- 2) 301 PREFIX/WILDCARD ---
  const loc = findPrefixRedirect(normalizedPath, REDIRECTS_PREFIX);
  if (loc) {
    return new Response(null, { status: 301, headers: { Location: loc, "X-Debug": "301-prefix" } });
  }

  // --- 2.5) Video Redirects (spezielle Behandlung) ---
  if (normalizedPath.startsWith("/en/videos/") && normalizedPath !== "/en/videos/") {
    return new Response(null, { 
      status: 301, 
      headers: { 
        Location: "https://changdiving.com/en/videos/",
        "X-Debug": "301-video" 
      } 
    });
  }
  if (normalizedPath.startsWith("/de/videos/") && normalizedPath !== "/de/videos/") {
    return new Response(null, { 
      status: 301, 
      headers: { 
        Location: "https://changdiving.com/de/videos/",
        "X-Debug": "301-video" 
      } 
    });
  }



  // --- 3) statische ausliefern lassen ---
  const res = await context.next();
  if (res.status !== 404) return withDebug(res, "pages-pass");

  // --- 4) Global: alles außerhalb Sprachpfade & nicht-Assets -> 410 ---
  if (!isInLang(normalizedPath) && !isAsset(normalizedPath)) {
    try {
      const html = await context.env.ASSETS.fetch(new URL("/410.html", url)).then(r => r.text());
      return new Response(html, { 
        status: 410, 
        headers: getNoCacheHeaders("text/html; charset=utf-8", "410-global")
      });
    } catch (error) {
      // Fallback: einfache 410 Response
      return new Response("410 Gone", { 
        status: 410, 
        headers: getNoCacheHeaders("text/plain; charset=utf-8", "410-global-fallback")
      });
    }
  }

  // Sprachpfad 404 bleibt 404 (echter Tippfehler in gültiger Sprache)
  return withDebug(res, "404-in-lang");
}