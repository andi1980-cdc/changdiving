// /functions/[[path]].js
// Reihenfolge:
// 1) Eigene 301 (EXACT, dann PREFIX) -> sofort redirect
// 2) Pages laufen lassen (statische Dateien + _redirects)
// 3) Wenn 404: 410 (EXACT, dann PREFIX, dann global außerhalb Sprachpfade)
// Robust gg. Slashes & Tippfehler, mit X-Debug-Header zur Diagnose.

const LANG_ROOTS = ["/en", "/de/", "/th/"];

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
  // EN Courses
  ["/en/product/advanced", "/en/courses/advanced/"],
  ["/en/product/advanced-nitrox", "/en/courses/advanced-nitrox/"],
  ["/en/product/advanced-wreck", "/en/courses/advanced-wreck/"],
  ["/en/product/deco-procedures", "/en/courses/deco-procedures/"],
  ["/en/product/deep-diver", "/en/courses/deep-diver/"],
  ["/en/product/deep-wreck-nitrox", "/en/courses/deep-wreck-nitrox/"],
  ["/en/product/divemaster", "/en/courses/divemaster/"],
  ["/en/product/efr-instructor", "/en/courses/efr-instructor/"],
  ["/en/product/first-aid", "/en/courses/first-aid/"],
  ["/en/product/instructor-crossover", "/en/courses/instructor-crossover/"],
  ["/en/product/intro-to-tech", "/en/courses/intro-to-tech/"],
  ["/en/product/master-scuba-diver", "/en/courses/master-scuba-diver/"],
  ["/en/product/navigation", "/en/courses/navigation/"],
  ["/en/product/night", "/en/courses/night/"],
  ["/en/product/nitrox-diver", "/en/courses/nitrox-diver/"],
  ["/en/product/open-advanced-package", "/en/courses/open-advanced-package/"],
  ["/en/product/open-to-divemaster", "/en/courses/open-to-divemaster/"],
  ["/en/product/open-water-diver", "/en/courses/open-water-diver/"],

  ["/en/product/rescue-diver", "/en/courses/rescue-diver/"],

  ["/en/product/sdi-idc", "/en/courses/sdi-idc/"],
  ["/en/product/sdi-ie", "/en/courses/sdi-ie/"],
  ["/en/product/search-recovery", "/en/courses/search-recovery/"],
  ["/en/product/sidemount", "/en/courses/sidemount/"],
  ["/en/product/solo-diver", "/en/courses/solo-diver/"],
  ["/en/product/tech-package", "/en/courses/tech-package/"],

  ["/en/product/wreck-diver", "/en/courses/wreck-diver/"],
  
  // EN Day-Trips
  ["/en/product/fun-dives", "/en/day-trips/fun-dives/"],
  ["/en/product/snorkeling", "/en/day-trips/snorkeling/"],
  ["/en/product/insurance", "/en/day-trips/insurance/"],
  ["/en/product/rent-gopro", "/en/day-trips/rent-gopro/"],
  ["/en/product/try-dive", "/en/day-trips/try-dive/"],
  ["/en/product/scuba-review", "/en/day-trips/scuba-review/"],
  
  // EN Store/Category Redirects
  ["/en/store/category/equipment", "/en/equipment/"],
  ["/en/store/category/day-trips", "/en/day-trips/"],
  ["/en/store/category/courses", "/en/courses/"],
  
  // DE Courses
  ["/de/product/advanced", "/de/courses/advanced/"],
  ["/de/product/advanced-nitrox", "/de/courses/advanced-nitrox/"],
  ["/de/product/advanced-wreck", "/de/courses/advanced-wreck/"],
  ["/de/product/deco-procedures", "/de/courses/deco-procedures/"],
  ["/de/product/deep-diver", "/de/courses/deep-diver/"],
  ["/de/product/deep-wreck-nitrox", "/de/courses/deep-wreck-nitrox/"],
  ["/de/product/divemaster", "/de/courses/divemaster/"],
  ["/de/product/efr-instructor", "/de/courses/efr-instructor/"],
  ["/de/product/first-aid", "/de/courses/first-aid/"],
  ["/de/product/instructor-crossover", "/de/courses/instructor-crossover/"],
  ["/de/product/intro-to-tech", "/de/courses/intro-to-tech/"],
  ["/de/product/master-scuba-diver", "/de/courses/master-scuba-diver/"],
  ["/de/product/navigation", "/de/courses/navigation/"],
  ["/de/product/night", "/de/courses/night/"],
  ["/de/product/nitrox-diver", "/de/courses/nitrox-diver/"],
  ["/de/product/open-advanced-package", "/de/courses/open-advanced-package/"],
  ["/de/product/open-to-divemaster", "/de/courses/open-to-divemaster/"],
  ["/de/product/open-water-diver", "/de/courses/open-water-diver/"],

  ["/de/product/rescue-diver", "/de/courses/rescue-diver/"],

  ["/de/product/sdi-idc", "/de/courses/sdi-idc/"],
  ["/de/product/sdi-ie", "/de/courses/sdi-ie/"],
  ["/de/product/search-recovery", "/de/courses/search-recovery/"],
  ["/de/product/sidemount", "/de/courses/sidemount/"],
  ["/de/product/solo-diver", "/de/courses/solo-diver/"],
  ["/de/product/tech-package", "/de/courses/tech-package/"],

  ["/de/product/wreck-diver", "/de/courses/wreck-diver/"],
  
  // DE Day-Trips
  ["/de/product/fun-dives", "/de/day-trips/fun-dives/"],
  ["/de/product/snorkeling", "/de/day-trips/snorkeling/"],
  ["/de/product/insurance", "/de/day-trips/insurance/"],
  ["/de/product/rent-gopro", "/de/day-trips/rent-gopro/"],
  ["/de/product/try-dive", "/de/day-trips/try-dive/"],
  ["/de/product/scuba-review", "/de/day-trips/scuba-review/"],
  
  // DE Store/Category Redirects
  ["/de/store/category/equipment", "/de/equipment/"],
  ["/de/store/category/day-trips", "/de/day-trips/"],
  ["/de/store/category/courses", "/de/courses/"],
  
  // TH Courses
  ["/th/product/advanced", "/th/courses/advanced/"],
  ["/th/product/advanced-nitrox", "/th/courses/advanced-nitrox/"],
  ["/th/product/advanced-wreck", "/th/courses/advanced-wreck/"],
  ["/th/product/deco-procedures", "/th/courses/deco-procedures/"],
  ["/th/product/deep-diver", "/th/courses/deep-diver/"],
  ["/th/product/deep-wreck-nitrox", "/th/courses/deep-wreck-nitrox/"],
  ["/th/product/divemaster", "/th/courses/divemaster/"],
  ["/th/product/efr-instructor", "/th/courses/efr-instructor/"],
  ["/th/product/first-aid", "/th/courses/first-aid/"],
  ["/th/product/instructor-crossover", "/th/courses/instructor-crossover/"],
  ["/th/product/intro-to-tech", "/th/courses/intro-to-tech/"],
  ["/th/product/master-scuba-diver", "/th/courses/master-scuba-diver/"],
  ["/th/product/navigation", "/th/courses/navigation/"],
  ["/th/product/night", "/th/courses/night/"],
  ["/th/product/nitrox-diver", "/th/courses/nitrox-diver/"],
  ["/th/product/open-advanced-package", "/th/courses/open-advanced-package/"],
  ["/th/product/open-to-divemaster", "/th/courses/open-to-divemaster/"],
  ["/th/product/open-water-diver", "/th/courses/open-water-diver/"],

  ["/th/product/rescue-diver", "/th/courses/rescue-diver/"],

  ["/th/product/sdi-idc", "/th/courses/sdi-idc/"],
  ["/th/product/sdi-ie", "/th/courses/sdi-ie/"],
  ["/th/product/search-recovery", "/th/courses/search-recovery/"],
  ["/th/product/sidemount", "/th/courses/sidemount/"],
  ["/th/product/solo-diver", "/th/courses/solo-diver/"],
  ["/th/product/tech-package", "/th/courses/tech-package/"],

  ["/th/product/wreck-diver", "/th/courses/wreck-diver/"],
  
  // TH Day-Trips
  ["/th/product/fun-dives", "/th/day-trips/fun-dives/"],
  ["/th/product/snorkeling", "/th/day-trips/snorkeling/"],
  ["/th/product/insurance", "/th/day-trips/insurance/"],
  ["/th/product/rent-gopro", "/th/day-trips/rent-gopro/"],
  ["/th/product/try-dive", "/th/day-trips/try-dive/"],
  ["/th/product/scuba-review", "/th/day-trips/scuba-review/"],
  
  // TH Store/Category Redirects
  ["/th/store/category/equipment", "/th/equipment/"],
  ["/th/store/category/day-trips", "/th/day-trips/"],
  ["/th/store/category/courses", "/th/courses/"],
  
  // BEISPIEL (aus deinem Test):
  ["/da/about", "/de/about/"],
  ["/de", "/de/"],
  ["/de/2025/04", "/de/posts/"],
  ["/de/2025/05", "/de/posts/"],
  ["/de/about", "/de/about/"],
  ["/de/about-search-recovery", "/de/posts/scuba-knowledge/about-search-recovery/"],
  ["/de/about-underwater-photography", "/de/posts/tips-and-tricks/about-underwater-photography/"],
  ["/de/about-us", "/de/about/"],
  ["/de/about/stornierung-und-rueckersattung", "/de/refund-policy/"],
  ["/de/agbs", "/de/terms-and-conditions/"],
  ["/de/anreise", "/de/faqs/faq-getting-here-accommodation/"],
  ["/de/apeks-dst4", "/de/store/category/equipment/"],
  ["/de/apeks-xtx-atemregulator-ueberblick", "/de/store/category/equipment/"],
  ["/de/apeks-xtx", "/de/store/category/equipment/"],
  ["/de/barrakudas-koh-chang", "/de/posts/marine-life-koh-chang/marine-life-barracuda/"],
  ["/de/best-dive-computers", "/de/posts/scuba-knowledge/best-dive-computers/"],
  ["/de/beginner-guide", "/de/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/de/book-in-advance", "/en/posts/straight-talk/book-in-advance/"],
  ["/de/blogs", "/de/posts/"],
  ["/de/contact", "/de/contact/"],
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
  ["/de/dive-sites", "/de/dive-sites/"],
  ["/de/dive-sites/blueberry-hill", "/de/dive-sites/blueberry-hill/"],
  ["/de/dive-sites/dive-site-map-koh-chang", "/de/dive-sites/dive-site-map-koh-chang/"],
  ["/de/dive-sites/hin-luk-bat", "/de/dive-sites/hin-luk-bat/"],
  ["/de/dive-sites/hin-pray-nam", "/de/dive-sites/hin-pray-nam/"],
  ["/de/dive-sites/hin-raab-north", "/de/dive-sites/hin-raab-north/"],
  ["/de/dive-sites/hin-raab-south", "/de/dive-sites/hin-raab-south/"],
  ["/de/dive-sites/hin-rua-tek", "/de/dive-sites/hin-rua-tek/"],
  ["/de/dive-sites/hin-sam-sao", "/de/dive-sites/hin-sam-sao/"],
  ["/de/dive-sites/htms-chang-wreck", "/de/dive-sites/htms-chang-wreck/"],
  ["/de/dive-sites/koh-rang-pinnacle", "/de/dive-sites/koh-rang-pinnacle/"],
  ["/de/dive-sites/koho-maru-5", "/de/dive-sites/koho-maru-5/"],
  ["/de/dive-sites/phutthayotfa-chulalok-wrack-koh-chang", "/de/dive-sites/phutthayotfa-chulalok-wreck-koh-chang/"],
  ["/de/dive-sites/phutthayotfa-chulalok-wreck-koh-chang", "/de/dive-sites/phutthayotfa-chulalok-wreck-koh-chang/"],
  ["/de/dive-sites/secret-reef", "/de/dive-sites/secret-reef/"],
  ["/de/dive-sites/t11-wreck", "/de/dive-sites/t11-wreck/"],
  ["/de/diving-myths", "/de/posts/straight-talk/diving-myths/"],
  ["/de/dauer-owd-kurs-koh-chang", "/de/posts/tips-and-tricks/open-water-duration/"],
  ["/de/emergency-plan", "/en/posts/straight-talk/emergency-plan/"],
  ["/de/faqs", "/de/faqs/"],
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
  ["/de/Kategorie/chang-diving-blog", "/de/posts/"],
  ["/de/Kategorie/tauchblog", "/de/posts/"],
  ["/de/Kategorie/tauchtips", "/de/posts/tips-and-tricks/"],
  ["/de/Kategorie/tipps-und-tricks", "/de/posts/tips-and-tricks/"],
  ["/de/Kategorie/tauchen", "/de/posts/"],
  ["/de/Kategorie/taucher-wissen", "/de/posts/scuba-knowledge/"],
  ["/de/Kategorie/tech-tattoos", "/de/posts/tips-and-tricks/"],
  ["/de/Kategorie/travel-stories", "/de/posts/koh-chang-diving-travel-guides/"],
  ["/de/Kategorie/videos", "/de/posts/"],
  ["/de/kurse/advanced-open-water", "/de/product/advanced/"],
  ["/de/kurse/divemaster", "/de/product/divemaster/"],
  ["/de/luftverbrauch-beim-sport-tauchen", "/de/posts/scuba-knowledge/gas-consumption/"],
  ["/de/marine-life-barracuda", "/de/posts/marine-life-koh-chang/marine-life-barracuda/"],
  ["/de/marine-life-batfish", "/de/posts/marine-life-koh-chang/marine-life-batfish/"],
  ["/de/marine-life-blacktip-reef-shark", "/de/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/de/marine-life-green-sea-turtle", "/de/posts/marine-life-koh-chang/marine-life-green-sea-turtle/"],
  ["/de/marine-life-nudibranch", "/de/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/de/marine-life-titan-triggerfish", "/de/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/de/marine-life-whale-shark", "/de/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/de/marine-life", "/de/posts/marine-life-koh-chang/"],
  ["/de/nitrox-info", "/de/posts/scuba-knowledge/nitrox-info/"],
  ["/de/nudibranchs-koh-chang", "/en/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/de/ocean-climate", "/de/posts/straight-talk/ocean-climate/"],
  ["/de/open-water-duration", "/de/posts/tips-and-tricks/open-water-duration/"],
  ["/de/notfallplan-bei-tauchunfaellen-auf-koh-chang", "/de/posts/straight-talk/emergency-plan/"],
  ["/de/padi-vs-sdi-tdi-welches-tauchausbildungssystem-passt-zu-dir", "/de/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/de/pirm-udom-sub-nachhaltiges-tauchen-auf-koh-chang", "/de/posts/straight-talk/sustainable-diving/"],
  ["/de/posts/diving-how-to-guides-koh-chang", "/de/posts/diving-how-to-guides-koh-chang/"],
  ["/de/posts/diving-how-to-guides-koh-chang/how-to-advanced-course", "/de/posts/diving-how-to-guides-koh-chang/how-to-advanced-course/"],
  ["/de/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver", "/de/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver/"],
  ["/de/posts/diving-how-to-guides-koh-chang/how-to-scuba-review", "/de/posts/diving-how-to-guides-koh-chang/how-to-scuba-review/"],
  ["/de/posts/koh-chang-diving-travel-guides", "/de/posts/koh-chang-diving-travel-guides/"],
  ["/de/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark", "/de/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/de/posts/marine-life-koh-chang/marine-life-titan-triggerfish", "/de/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/de/posts/scuba-knowledge/about-search-recovery", "/de/posts/scuba-knowledge/about-search-recovery/"],
  ["/de/posts/scuba-knowledge/best-dive-computers", "/de/posts/scuba-knowledge/best-dive-computers/"],
  ["/de/posts/scuba-knowledge/dive-logbook", "/de/posts/scuba-knowledge/dive-logbook/"],
  ["/de/posts/scuba-knowledge/gas-consumption", "/de/posts/scuba-knowledge/gas-consumption/"],
  ["/de/posts/scuba-knowledge/safety-check", "/de/posts/scuba-knowledge/safety-check/"],
  ["/de/posts/scuba-knowledge/wreck-diving-koh-chang", "/de/posts/scuba-knowledge/wreck-diving-koh-chang/"],
  ["/de/posts/straight-talk", "/de/posts/straight-talk/"],
  ["/de/posts/straight-talk/diving-myths", "/de/posts/straight-talk/diving-myths/"],
  ["/de/posts/straight-talk/diving-social-media", "/de/posts/straight-talk/diving-social-media/"],
  ["/de/posts/straight-talk/ozean-und-klima", "/de/posts/straight-talk/ocean-climate/"],
  ["/de/posts/straight-talk/padi-vs-sdi-tdi", "/de/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/de/posts/tipps-und-tricks/tauchaktivitaeten", "/de/posts/tips-and-tricks/diving-activities/"],
  ["/de/posts/tips-and-tricks/about-underwater-photography", "/de/posts/tips-and-tricks/about-underwater-photography/"],
  ["/de/posts/tips-and-tricks/deep-diving", "/de/posts/tips-and-tricks/deep-diving/"],
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
  ["/de/walhaie-auf-koh-chang-eine-begegnung-der-besonderen-art", "/de/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/de/warum-der-advanced-open-water-diver", "/de/product/advanced/"],
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
  ["/en/about/dive-schedule", "/en/about/"],
  ["/en/about/refund-policy", "/en/about/"],
  ["/en/about/the-dive-process", "/en/about/"],
  ["/en/about-search-recovery", "/en/posts/scuba-knowledge/about-search-recovery/"],
  ["/en/about-underwater-photography", "/en/posts/tips-and-tricks/about-underwater-photography/"],
  ["/en/about-us", "/en/about/"],
  ["/en/best-dive-computers", "/en/posts/scuba-knowledge/best-dive-computers/"],
  ["/en/certification-agencies", "/en/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/en/beginner-guide", "/en/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/en/dive-professional-training", "/en/posts/straight-talk/dive-professional-training/"],
  ["/en/dive-sites/dive-site-map-koh-chang", "/en/dive-sites/dive-site-map-koh-chang/"],
  ["/en/dive-sites/hin-luk-bat", "/en/dive-sites/hin-luk-bat/"],
  ["/en/dive-sites/hin-pray-nam", "/en/dive-sites/hin-pray-nam/"],
  ["/en/dive-sites/hin-raab-north", "/en/dive-sites/hin-raab-north/"],
  ["/en/dive-sites/hin-raab-south", "/en/dive-sites/hin-raab-south/"],
  ["/en/dive-sites/hin-rua-tek", "/en/dive-sites/hin-rua-tek/"],
  ["/en/dive-sites/hin-sam-sao", "/en/dive-sites/hin-sam-sao/"],
  ["/en/dive-sites/htms-chang-wreck", "/en/dive-sites/htms-chang-wreck/"],
  ["/en/dive-sites/koh-rang-pinnacle", "/en/dive-sites/koh-rang-pinnacle/"],
  ["/en/dive-sites/koho-maru-5", "/en/dive-sites/koho-maru-5/"],
  ["/en/dive-sites/phutthayotfa-chulalok-wreck-koh-chang", "/en/dive-sites/phutthayotfa-chulalok-wreck-koh-chang/"],
  ["/en/dive-sites/secret-reef", "/en/dive-sites/secret-reef/"],
  ["/en/dive-sites/t11-wreck", "/en/dive-sites/t11-wreck/"],
  ["/en/dive-logbook", "/en/posts/scuba-knowledge/dive-logbook/"],
  ["/en/deep-diving", "/en/posts/tips-and-tricks/deep-diving/"],
  ["/en/diving-myths", "/en/posts/straight-talk/diving-myths/"],
  ["/en/diving-activities", "/en/posts/tips-and-tricks/diving-activities/"],
  ["/en/diving-social-media", "/en/posts/straight-talk/diving-social-media/"],
  ["/en/emergency-plan", "/en/posts/straight-talk/emergency-plan/"],
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
  ["/en/how-to-advanced-course", "/en/posts/diving-how-to-guides-koh-chang/how-to-open-advanced/"],
  ["/en/how-to-fun-dives", "/en/posts/diving-how-to-guides-koh-chang/how-to-fun-dives/"],
  ["/en/how-to-open-advanced", "/en/posts/diving-how-to-guides-koh-chang/how-to-open-advanced/"],
  ["/en/how-to-open-water-course", "/en/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/en/how-to-scuba-review", "/en/posts/diving-how-to-guides-koh-chang/how-to-scuba-review/"],
  ["/en/how-to-specialty-courses", "/en/posts/diving-how-to-guides-koh-chang/how-to-specialty-courses/"],
  ["/en/how-to-try-dive", "/en/posts/diving-how-to-guides-koh-chang/how-to-try-dive/"],
  ["/en/how-to-rescue-diver", "/en/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver/"],
  ["/en/life-as-a-diver", "/en/posts/straight-talk/dive-professional-training/"],
  ["/en/marine-life", "/en/posts/marine-life-koh-chang/"],
  ["/en/marine-life-barracuda", "/en/posts/marine-life-koh-chang/marine-life-barracuda/"],
  ["/en/marine-life-batfish", "/en/posts/marine-life-koh-chang/marine-life-batfish/"],
  ["/en/marine-life-blacktip-reef-shark", "/en/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/en/marine-life-green-sea-turtle", "/en/posts/marine-life-koh-chang/marine-life-green-sea-turtle/"],
  ["/en/marine-life-nudibranch", "/en/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/en/marine-life-titan-triggerfish", "/en/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/en/marine-life-whale-shark", "/en/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/en/nitrox-info", "/en/posts/scuba-knowledge/nitrox-info/"],
  ["/en/ocean-climate", "/en/posts/straight-talk/ocean-climate/"],
  ["/en/open-water-duration", "/en/posts/tips-and-tricks/open-water-duration/"],
  ["/en/padi-vs-sdi-tdi", "/en/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/en/posts/diving-how-to-guides-koh-chang", "/en/posts/diving-how-to-guides-koh-chang/"],
  ["/en/posts/diving-how-to-guides-koh-chang/how-to-advanced-course", "/en/posts/diving-how-to-guides-koh-chang/how-to-advanced-course/"],
  ["/en/posts/diving-how-to-guides-koh-chang/how-to-master-scuba-diver", "/en/posts/diving-how-to-guides-koh-chang/how-to-master-scuba-diver/"],
  ["/en/posts/diving-how-to-guides-koh-chang/how-to-open-water-course", "/en/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/en/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver", "/en/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver/"],
  ["/en/posts/koh-chang-diving-travel-guides", "/en/posts/koh-chang-diving-travel-guides/"],
  ["/en/posts/koh-chang-diving-travel-guides/beginner-guide", "/en/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/en/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark", "/en/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/en/posts/marine-life-koh-chang/marine-life-nudibranch", "/en/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/en/posts/marine-life-koh-chang/marine-life-titan-triggerfish", "/en/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/en/posts/marine-life-koh-chang/marine-life-whale-shark", "/en/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/en/posts/scuba-knowledge", "/en/posts/scuba-knowledge/"],
  ["/en/posts/scuba-knowledge/about-search-recovery", "/en/posts/scuba-knowledge/about-search-recovery/"],
  ["/en/posts/scuba-knowledge/best-dive-computers", "/en/posts/scuba-knowledge/best-dive-computers/"],
  ["/en/posts/scuba-knowledge/smb-guide", "/en/posts/scuba-knowledge/smb-guide/"],
  ["/en/posts/straight-talk", "/en/posts/straight-talk/"],
  ["/en/posts/straight-talk/padi-vs-sdi-tdi", "/en/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/en/posts/tips-and-tricks", "/en/posts/tips-and-tricks/"],
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
  ["/th/การทำงานของ-apeks-dst4", "/th/store/category/equipment/"],
  ["/th/การเดินทางไปเกาะช้าง", "/th/faqs/faq-getting-here-accommodation/"],
  ["/th/ฉลามวาฬที่เกาะช้าง-ประส", "/th/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/th/ฉลามวาฬที่เกาะช้าง-ประส", "/th/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/th/ติดต่อ", "/th/contact/"],
  ["/th/ติดต่อเรา", "/th/contact/"],
  ["/th/ปลาและปะการัง-เกาะช้าง-จ", "/th/posts/marine-life-koh-chang/"],
  ["/th/ปลาและปะการัง-เกาะช้าง-จ", "/th/posts/marine-life-koh-chang/"],
  ["/th/ปลาและปะการัง-เกาะช้าง-ต", "/th/posts/marine-life-koh-chang/"],
  ["/th/ปลาและปะการัง-เกาะช้าง-ต", "/th/posts/marine-life-koh-chang/"],
  ["/th/เรียนดำน้ำ-open-water-กับ-chang-diving-คอร์ส", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-water-course/"],
  ["/th/เส้นทางของนักดำน้ำ", "/th/posts/straight-talk/dive-professional-training/"],
  ["/th/about/dive-schedule", "/th/about/"],
  ["/th/about/refund-policy", "/th/refund-policy/"],
  ["/th/about-search-recovery", "/th/posts/scuba-knowledge/about-search-recovery/"],
  ["/th/about-us", "/th/about/"],
  ["/th/apeks-dst4", "/th/store/category/equipment/"],
  ["/th/apeks-first-stage-operation-dst4", "/th/store/category/equipment/"],
  ["/th/apeks-xtx", "/th/store/category/equipment/"],
  ["/th/book-in-advance", "/en/posts/straight-talk/book-in-advance/"],
  ["/th/beginner-guide", "/th/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/th/blacktip-reef-sharks-koh-chang", "/th/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/th/deep-diving", "/th/posts/tips-and-tricks/deep-diving/"],
  ["/th/dive-courses/advanced-open-water", "/th/product/advanced/"],
  ["/th/dive-logbook", "/th/posts/scuba-knowledge/dive-logbook/"],
  ["/th/dive-professional-training", "/th/posts/straight-talk/dive-professional-training/"],
  ["/th/dive-sites/blueberry-hill", "/th/dive-sites/blueberry-hill/"],
  ["/th/dive-sites/dive-site-map-koh-chang", "/th/dive-sites/dive-site-map-koh-chang/"],
  ["/th/dive-sites/hin-kra-duang", "/th/dive-sites/"],
  ["/th/dive-sites/hin-luk-bat", "/th/dive-sites/hin-luk-bat/"],
  ["/th/dive-sites/hin-pray-nam", "/th/dive-sites/hin-pray-nam/"],
  ["/th/dive-sites/hin-raab-north", "/th/dive-sites/hin-raab-north/"],
  ["/th/dive-sites/hin-raab-south", "/th/dive-sites/hin-raab-south/"],
  ["/th/dive-sites/hin-rua-tek", "/th/dive-sites/hin-rua-tek/"],
  ["/th/dive-sites/hin-ruea-taek", "/th/dive-sites/hin-rua-tek/"],
  ["/th/dive-sites/hin-sam-sao", "/th/dive-sites/hin-sam-sao/"],
  ["/th/dive-sites/htms-chang-wreck", "/th/dive-sites/htms-chang-wreck/"],
  ["/th/dive-sites/koh-rang-pinnacle", "/th/dive-sites/koh-rang-pinnacle/"],
  ["/th/dive-sites/koho-maru-5", "/th/dive-sites/koho-maru-5/"],
  ["/th/dive-sites/phutthayotfa-chulalok-wreck-koh-chang", "/th/dive-sites/phutthayotfa-chulalok-wreck-koh-chang/"],
  ["/th/dive-sites/secret-reef", "/th/dive-sites/secret-reef/"],
  ["/th/dive-sites/t11-wreck", "/th/dive-sites/t11-wreck/"],
  ["/th/diving-activities", "/th/posts/tips-and-tricks/diving-activities/"],
  ["/th/diving-myths", "/th/posts/straight-talk/diving-myths/"],
  ["/th/diving-thailand-gulf-vs-andaman", "/th/posts/koh-chang-diving-travel-guides/thailand-diving-comparison/"],
  ["/th/diving-social-media", "/th/posts/straight-talk/diving-social-media/"],
  ["/th/emergency-plan", "/th/posts/straight-talk/emergency-plan/"],
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
  ["/th/marine-life-barracuda", "/th/posts/marine-life-koh-chang/marine-life-barracuda/"],
  ["/th/marine-life-batfish", "/th/posts/marine-life-koh-chang/marine-life-batfish/"],
  ["/th/marine-life-blacktip-reef-shark", "/th/posts/marine-life-koh-chang/marine-life-blacktip-reef-shark/"],
  ["/th/marine-life-titan-triggerfish", "/th/posts/marine-life-koh-chang/marine-life-titan-triggerfish/"],
  ["/th/marine-life-whale-shark", "/th/posts/marine-life-koh-chang/marine-life-whale-shark/"],
  ["/th/marine-life-nudibranch/", "/th/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/th/marine-life-green-sea-turtle", "/th/posts/marine-life-koh-chang/marine-life-green-sea-turtle/"],
  ["/th/marine-life", "/th/posts/marine-life-koh-chang/"],
  ["/th/nitrox-info", "/th/posts/scuba-knowledge/nitrox-info/"],
  ["/th/nudibranchs-koh-chang", "/th/posts/marine-life-koh-chang/marine-life-nudibranch/"],
  ["/th/padi-vs-sdi-tdi", "/th/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/th/open-water-duration", "/th/posts/tips-and-tricks/open-water-duration/"],
  ["/th/posts/diving-how-to-guides-koh-chang", "/th/posts/diving-how-to-guides-koh-chang/"],
  ["/th/posts/diving-how-to-guides-koh-chang/how-to-advanced-course", "/th/posts/diving-how-to-guides-koh-chang/how-to-advanced-course/"],
  ["/th/posts/diving-how-to-guides-koh-chang/how-to-open-advanced", "/th/posts/diving-how-to-guides-koh-chang/how-to-open-advanced/"],
  ["/th/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver", "/th/posts/diving-how-to-guides-koh-chang/how-to-rescue-diver/"],
  ["/th/posts/diving-how-to-guides-koh-chang/how-to-specialty-courses", "/th/posts/diving-how-to-guides-koh-chang/how-to-specialty-courses/"],
  ["/th/posts/koh-chang-diving-travel-guides", "/th/posts/koh-chang-diving-travel-guides/"],
  ["/th/posts/marine-life-koh-chang", "/th/posts/marine-life-koh-chang/"],
  ["/th/posts/marine-life-koh-chang/marine-life-batfish", "/th/posts/marine-life-koh-chang/marine-life-batfish/"],
  ["/th/posts/scuba-knowledge", "/th/posts/scuba-knowledge/"],
  ["/th/posts/scuba-knowledge/about-search-recovery", "/th/posts/scuba-knowledge/about-search-recovery/"],
  ["/th/posts/straight-talk/book-in-advance", "/th/posts/straight-talk/book-in-advance/"],
  ["/th/posts/straight-talk/diving-social-media", "/th/posts/straight-talk/diving-social-media/"],
  ["/th/posts/straight-talk/emergency-plan", "/th/posts/straight-talk/emergency-plan/"],
  ["/th/posts/straight-talk/padi-vs-sdi-tdi", "/th/posts/straight-talk/padi-vs-sdi-tdi/"],
  ["/th/posts/tips-and-tricks", "/th/posts/tips-and-tricks/"],
  ["/th/posts/tips-and-tricks/reel-guideline", "/th/posts/tips-and-tricks/reel-guideline/"],
  ["/th/reel-guideline", "/th/posts/tips-and-tricks/reel-guideline/"],
  ["/th/refund-policy", "/th/refund-policy/"],
  ["/th/scuba-diving-beginner-guide", "/th/posts/koh-chang-diving-travel-guides/beginner-guide/"],
  ["/th/smb-guide", "/th/posts/scuba-knowledge/smb-guide/"],
  ["/th/service-technician", "/th/store/category/equipment/"],
  ["/th/search-and-recovery-diving/", "/th/product/search-recovery/"],
  ["/th/sustainable-diving", "/th/posts/straight-talk/sustainable-diving/"],
  ["/th/safety-check", "/th/posts/scuba-knowledge/safety-check/"],
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
  // BEISPIELE (kannst du erweitern):
  // { from: "/th/store/category/equipment/bcds",   to: "/th/store/category/equipment/" },
   { from: "/de/Kategorie", to: "/de/posts/" },
   { from: "/de/ueber-uns", to: "/de/about/" },
   { from: "/de/ueber-uns-chang-diving-center-koh-chang-thailand", to: "/de/about/" },
   { from: "/en/team", to: "/en/about/" },
   { from: "/en/videos", to: "/en/videos/" },
   { from: "/de/videos", to: "/de/videos/" },
   { from: "/th/2018/07", to: "/th/posts/" },
   { from: "/th/2019/11", to: "/th/posts/" },
   { from: "/th/ds", to: "/th/dive-sites/" },
   { from: "/th/เกี่ยวกับ", to: "/th/about/" },
   { from: "/th/เกี่ยวกับ-ส่วนย่อยดำน้ำ", to: "/th/about/" },
   { from: "/th/คำถามที่พบบ่อย", to: "/th/faqs/" },
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
  "/th/ปริมาณอากาศที่ใช้หายใจ", 
  "/th/อุทยานแห่งชาติ",
  "/th/about/ตารางการดำน้ำ",
  "/th/about/นโยบายการคืนเงิน",
  "/th/cdc/กระบวนการดำน้ำ",
  "/th/cdc/ตารางการดำน้ำ",
  "/th/ds/ดำน้ำที่โคโฮมารุ-5-แพค1-ซ",
  "/th/ds/ดำน้ำที่หินกระเดื่อง-จ",
  "/th/ds/สำรวจซิเคร็ท-รีฟ-ขุมทร",
  "/th/ds/สำรวจบลูเบอร์รี่ฮิลล์",
  "/th/ds/สำรวจเรือจม-ต-11-จุดดำน้ำ",
  "/th/ds/สำรวจหินพรายน้ำ-การผจญ",
  "/th/ds/สำรวจหินราบใต้-จุดดำน้",
  "/th/ds/สำรวจหินราบเหนือ-จุดดำ",
  "/th/ds/สำรวจหินเรือแตก-จุดดำน",
  "/th/ds/สำรวจหินลูกบาศก์-จุดดำ",
  "/th/ds/สำรวจหินสามเส้า-จุดดำน",
  "/th/การใช้รอกเชือก-และเชือก",
  "/th/การใช้รอกเชือก-และเชือก",
  "/th/การดำน้ำ-try-dive-กับ-chang-diving-ขั้นตอนง",
  "/th/การเดินทางไปเกาะช้าง",
  "/th/เกี่ยวกับเรา-ศูนย์ดำน้",
  "/th/เกี่ยวกับเรา-ศูนย์ดำน้/กระบวนการดำน้ำ",
  "/th/เกี่ยวกับเรา-ศูนย์ดำน้/ตารางการดำน้ำ",
  "/th/เกี่ยวกับเรา",
  "/th/เกี่ยวกับเรา/กระบวนการดำน้ำ",
  "/th/เกี่ยวกับเรา/ตารางการดำน้ำ",
  "/th/คำถามที่พบบ่อย",
  "/th/คำถามที่พบบ่อย/faq-diving-health-safety-thailand",
  "/th/คำถามที่พบบ่อย/faq-diving-koh-chang",
  "/th/คำถามที่พบบ่อย/faq-diving-location-accommodation-koh-chang",
  "/th/คำถามที่พบบ่อย/faq-equipment-logistics-koh-chang",
  "/th/คำถามที่พบบ่อย/faq-try-dive-fun-dives-koh-chang",
  "/th/คำถามที่พบบ่อย/faq-ดำน้ำ-เกาะช้าง",
  "/th/คำถามที่พบบ่อย/ฉันจะไปที่ร้านดำน้ำของ",
  "/th/คำถามที่พบบ่อย/ฉันจำเป็นต้องจองล่วงหน",
  "/th/คำถามที่พบบ่อย/ฉันสามารถเรียนหลักสูตร",
  "/th/คำถามที่พบบ่อย/เราสามารถชำระด้วยบัตรเ",
  "/th/คำถามที่พบบ่อย/โรงแรมใกล้เคียงร้านดำน",
  "/th/คำถามที่พบบ่อย/เวลาที่ดีที่สุดสำหรับก",
  "/th/จุดดำน้ำ",
  "/th/จุดดำน้ำ/htms-chang",
  "/th/จุดดำน้ำ/ดำน้ำที่หินกระเดื่อง-จ",
  "/th/จุดดำน้ำ/ต-11",
  "/th/จุดดำน้ำ/บลูเบอร์รี่-ฮิลล์",
  "/th/จุดดำน้ำ/สำรวจซิเคร็ท-รีฟ-ขุมทร",
  "/th/จุดดำน้ำ/สำรวจเรือจม-ต-11-จุดดำน้ำ",
  "/th/จุดดำน้ำ/สำรวจหินพรายน้ำ-การผจญ",
  "/th/จุดดำน้ำ/สำรวจหินราบเหนือ-จุดดำ",
  "/th/จุดดำน้ำ/สำรวจหินลูกบาศก์-จุดดำ",
  "/th/จุดดำน้ำ/สำรวจหินสามเส้า-จุดดำน",
  "/th/จุดดำน้ำ/หินกระเดื่อง",
  "/th/จุดดำน้ำ/หินพรายน้ำ",
  "/th/จุดดำน้ำ/หินเรือแตก",
  "/th/จุดดำน้ำ/หินลูกบาศก์",
  "/th/จุดดำน้ำ/หินสามเส้า",
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
  "/th/ร้านค้า/apeks",
  "/th/ร้านค้า/page/2",
  "/th/ร้านค้า/tdi-sdi",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/คอร์สครูสอนการดำน้ำลึกsd",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/แพ็กเกจเรียนดำน้ำลึกเบ",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/เรียนการช่วยชีวิตและปฐ",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/เรียนช่วยเหลือนักดำน้ำ",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/เรียนดำน้ำลึกคอร์สเริ่-2",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/เรียนดำน้ำลึกระดับสูง",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/หลักสูตรดำน้ำพิเศษ/เรียนนักดำน้ำลึก40เมตร",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/หลักสูตรเริ่มต้น/ดำน้ำสคูบ้า-สำหรับผู้ไม",
  "/th/ร้านค้า/คอร์สดำน้ำลึก/หลักสูตรเริ่มต้น/เรียนดำน้ำลึกคอร์สเริ่-2",
  "/th/ร้านค้า/ไปเช้าเย็นกลับ/เช่า-gopro-hero-7-black",
  "/th/ร้านค้า/ไปเช้าเย็นกลับ/ดำน้ำตื้น",
  "/th/ร้านค้า/ไปเช้าเย็นกลับ/ทริปดำน้ำลึกสคูบ้า-ฟันไ",
  "/th/ร้านค้า/แพ็กเกจ/แพ็กเกจเรียน-นักดำน้ำลึ",
  "/th/ร้านค้า/แพ็กเกจ/แพ็กเกจเรียนนักดำน้ำด้",
  "/th/ร้านค้า/หมวดหมู่/dcth",
  "/th/ร้านค้า/หมวดหมู่/dcth/dcadth",
  "/th/ร้านค้า/หมวดหมู่/dcth/dcath",
  "/th/ร้านค้า/หมวดหมู่/dcth/dcbth",
  "/th/ร้านค้า/หมวดหมู่/dcth/dctecth",
  "/th/ร้านค้า/หมวดหมู่/dcth/หลักสูตรระดับสูง",
  "/th/ร้านค้า/หมวดหมู่/dtb",
  "/th/ร้านค้า/หมวดหมู่/dtth",
  "/th/ร้านค้า/หมวดหมู่/eqth/กระเป๋าอุปกรณ์",
  "/th/ร้านค้า/หมวดหมู่/eqth/ตีนกบ",
  "/th/ร้านค้า/หมวดหมู่/eqth/ตีนกบ/deep-blue-scuba-fins",
  "/th/ร้านค้า/หมวดหมู่/eqth/ตีนกบ/scubapro-ตีนกบ",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/alternative-air-source",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/apeks-regulator-set",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/first-second-stage",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/instruments",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/regulator-service",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/ชุดอุปกรณ์เทคนิคัล-apeks",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/เรกกูเลเตอร์-apeks-nitrox",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์/alternativ-air-sources",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์/first-second-stage-scubapro-scuba-regulator",
  "/th/ร้านค้า/หมวดหมู่/eqth/เรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์/regulator-set-41",
  "/th/ร้านค้า/หมวดหมู่/eqth/เวทสูท",
  "/th/ร้านค้า/หมวดหมู่/eqth/หน้ากากดำน้ำ",
  "/th/ร้านค้า/หมวดหมู่/eqth/หน้ากากดำน้ำ/deep-blue",
  "/th/ร้านค้า/หมวดหมู่/eqth/หน้ากากดำน้ำ/scubapro-หน้ากากดำน้ำ",
  "/th/ร้านค้า/หมวดหมู่/eqth/อุปกรณ์ควบคุมลอยตัว",
  "/th/ร้านค้า/หมวดหมู่/eqth/อุปกรณ์ควบคุมลอยตัว/scubapro",
  "/th/ร้านค้า/หมวดหมู่/eqth/อุปกรณ์เสริม",
  "/th/ร้านค้า/หมวดหมู่/eqth/อุปกรณ์เสริม/dive-computer",
  "/th/ร้านค้า/หมวดหมู่/equipment",
  "/th/ร้านค้า/หมวดหมู่/equipment/กระเป๋าอุปกรณ์",
  "/th/ร้านค้า/หมวดหมู่/equipment/เรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์/first-second-stage-scubapro-scuba-regulator",
  "/th/ร้านค้า/หมวดหมู่/equipment/เวทสูท",
  "/th/ร้านค้า/หมวดหมู่/equipment/หน้ากากดำน้ำ",
  "/th/ร้านค้า/หมวดหมู่/equipment/อุปกรณ์ควบคุมลอยตัว",
  "/th/ร้านค้า/หมวดหมู่/equipment/อุปกรณ์เสริม",
  "/th/ร้านค้า/หมวดหมู่/คอร์สดำน้ำลึก",
  "/th/ร้านค้า/หมวดหมู่/คอร์สดำน้ำลึก/speciality",
  "/th/ร้านค้า/หมวดหมู่/คอร์สดำน้ำลึก/หลักสูตรการดำน้ำด้านเท",
  "/th/ร้านค้า/หมวดหมู่/คอร์สดำน้ำลึก/หลักสูตรเริ่มต้น",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/กระเป๋าอุปกรณ์",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/ตีนกบ/deep-blue-scuba-fins",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/ตีนกบ/scubapro-ตีนกบ",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/alternative-air-source",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/regulator-service",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/ชุดอุปกรณ์เทคนิคัล-apeks",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/เรกกูเลเตอร์-apeks-nitrox",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์/instruments-scubapro-scuba-regulator",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์/regulator-set-41",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เวทสูท",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/เวทสูท/scubapro-เวทสูท",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/สคูบ้าเรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์/alternativ-air-sources",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/สคูบ้าเรกกูเลเตอร์/scubapro-สคูบ้าเรกกูเลเตอร์/first-second-stage-scubapro-scuba-regulator",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/หน้ากากดำน้ำ",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/หน้ากากดำน้ำ/deep-blue",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/อุปกรณ์ควบคุมลอยตัว/scubapro",
  "/th/ร้านค้า/หมวดหมู่/อุปกรณ์ดำน้ำ/อุปกรณ์เสริม/dive-computer/suunto-d5",
  "/th/ร้านค้า/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/first-second-stage/เรกกูเลเตอร์-apeks-mtx-r",
  "/th/ร้านค้า/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/first-second-stage/เรกกูเลเตอร์-apeks-xtx50",
  "/th/ร้านค้า/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/apeks-สคูบ้าเรกกูเลเตอร์/instruments/มาตรวัดความดัน-apeks",
  "/th/ร้านค้า/อุปกรณ์ดำน้ำ/เรกกูเลเตอร์/เรกกูเลเตอร์สำรอง-scubapro_r195_octopus",
  "/th/ร้านค้า/อุปกรณ์ดำน้ำ/อุปกรณ์เสริม/dive-computer/suunto-d5",
  "/th/เราสอนการดำน้ำ-อย่างไร",
  "/th/เราสอนการดำน้ำ-อย่างไร",
  "/th/เรียนดำน้ำ-open-water-กับ-chang-diving-คอร์ส",
  "/th/เรือช้างไดฟ์วิ่ง-กับ-ขั้",
  "/th/หมวดหมู่/chang-diving-blog",
  "/th/หมวดหมู่/chang-diving-blog",
  "/th/หมวดหมู่/diving-courses",
  "/th/หมวดหมู่/diving-how-to-guides-koh-chang",
  "/th/หมวดหมู่/เกร็ดความรู้ดำน้ำ",
  "/th/หมวดหมู่/ข้อมูลเกี่ยวกับประเทศไ__",
  "/th/หมวดหมู่/ข้อมูลเกี่ยวกับประเทศไ__",
  "/th/หมวดหมู่/เอกสารที่จำเป็นสำหรับห__",
  "/th/หมวดหมู่/เอกสารที่จำเป็นสำหรับห__",
  "/th/หลักสูตรณาณำน้ำแบบไหนที่",
  "/th/หลักสูตรดำน้ำแบบไหนที่",
  "/th/อากาศผสมพิเศษไนตรอก-คือ",
  "/th/อุทยานแห่งชาติ",
  "/th/เอกสารที่จำเป็นสำหรับน",
  "/th/ร้านค้า/หมวดหมู่/คอร์สดำน้ำลึก/speciality",
  "/th/about-us/refund-policy",
  "/th/about/the-dive-process",
  "/th/cdc-b",
  "/th/cdc-smb",
  "/th/cdc-w",
  "/th/cdc-np",
  "/th/cdc",
  "/th/cdc/ตารางการณาณำน้ำ",
  "/th/cdc/บริษัทรักษาการณ์",
  "/th/the-dive-process",
  "/th/fun-diving-koh-chang-วิธีการ-2025",
  "/th/forms",
  "/th/why-advanced",
    // weitere exakte 410er hier …
  ].map(p => normPath(ensureLeadingSlash(p)))
);

// 4) PREFIX 410 — alles darunter Gone - wildcard (Strings)
const FORCE_GONE_PREFIX = [
     "/th/ds/",
     "/th/store",
     "/th/ร้านค้า",
     "/th/product",
     "/th/category",
     "/en/tag",
     "/en/store",
     "/en/product",
     "/en/category",
     "/de/tauchplätze",
     "/de/product",
     "/de/category",
     "/de/store",
     "/de/team",
     "/de/tag",
     "/en/en",
     "/de/de",
     "/th/th",
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
  
  // 1) Pfad sauber normalisieren - verbesserte URL-Dekodierung
  const singleEncoded = url.pathname.replace(/%25([0-9A-Fa-f]{2})/g, "%$1");
  const path = decodeURI(singleEncoded);
  
  // 2) Pfad normalisieren (Slashes, etc.)
  const normalizedPath = normPath(path);

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

  // --- 4) Wenn 404: 410 EXAKT ---
  if (FORCE_GONE_EXACT.has(normalizedPath) || findExactRedirect(normalizedPath, FORCE_GONE_EXACT)) {
    try {
      const html = await context.env.ASSETS.fetch(new URL("/410.html", url)).then(r => r.text());
      return new Response(html, { 
        status: 410, 
        headers: { 
          "Content-Type": "text/html; charset=utf-8",
          "X-Debug": "410-exact" 
        } 
      });
    } catch (error) {
      // Fallback: einfache 410 Response
      return new Response("410 Gone", { 
        status: 410, 
        headers: { 
          "Content-Type": "text/plain; charset=utf-8",
          "X-Debug": "410-exact-fallback" 
        } 
      });
    }
  }

  // --- 5) 410 PREFIX ---
  if (findPrefixRule(normalizedPath, FORCE_GONE_PREFIX)) {
    try {
      const html = await context.env.ASSETS.fetch(new URL("/410.html", url)).then(r => r.text());
      return new Response(html, { 
        status: 410, 
        headers: { 
          "Content-Type": "text/html; charset=utf-8",
          "X-Debug": "410-prefix" 
        } 
      });
    } catch (error) {
      // Fallback: einfache 410 Response
      return new Response("410 Gone", { 
        status: 410, 
        headers: { 
          "Content-Type": "text/plain; charset=utf-8",
          "X-Debug": "410-prefix-fallback" 
        } 
      });
    }
  }

  // --- 6) Global: alles außerhalb Sprachpfade & nicht-Assets -> 410 ---
  if (!isInLang(normalizedPath) && !isAsset(normalizedPath)) {
    try {
      const html = await context.env.ASSETS.fetch(new URL("/410.html", url)).then(r => r.text());
      return new Response(html, { 
        status: 410, 
        headers: { 
          "Content-Type": "text/html; charset=utf-8",
          "X-Debug": "410-global" 
        } 
      });
    } catch (error) {
      // Fallback: einfache 410 Response
      return new Response("410 Gone", { 
        status: 410, 
        headers: { 
          "Content-Type": "text/plain; charset=utf-8",
          "X-Debug": "410-global-fallback" 
        } 
      });
    }
  }

  // Sprachpfad 404 bleibt 404 (echter Tippfehler in gültiger Sprache)
  return withDebug(res, "404-in-lang");
}