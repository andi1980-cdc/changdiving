// /functions/[[path]].js
// Ablauf:
// 1) Erst Pages arbeiten lassen (_redirects + statische Dateien).
// 2) Wenn 404: dann 410 anwenden (zuerst Exact, dann Prefix, dann global Non-Lang).

function norm(raw) {
  let p = raw.split("?")[0].split("#")[0].replace(/\/{2,}/g, "/");
  // Trailing Slash entfernen (außer Sprachroots)
  if (!["/", "/en/", "/de/", "/th/"].includes(p)) p = p.replace(/\/+$/, "");
  return p;
}

// Deine exakten 410-Ziele HIER OHNE trailing slash eintragen:
const FORCE_GONE_EXACT = new Set([
  "/de/about/boots-plan",
  "/de/about/die-anmeldung",
  "/de/about/the-dive-process",
  "/de/nationalparks-in-thailand-und-koh-chang",
  "/de/natuerlich-haben-wir-schon-wracks-betaucht",
  "/de/product/privat-dive-boat",
  "/de/product/privates-tauchboot-tech",
  "/de/product/scuba-promotions",
  "/de/store/category/packages",
  "/de/store/category/privat-boat",
  "/de/store/category/privates-boot",
  "/en/apeks-dst4",
  "/en/apeks-xtx",
  "/en/forms",
  "/en/nationalparks-in-thailand-and-koh-chang",
  "/en/product/privat-dive-boat-tech",
  "/en/product/privat-dive-boat",
  "/en/product/scuba-promotions",
  "/en/service-technician",
  "/en/store/category/packages/covid-19-koh-chang",
  "/en/why-advanced",
  "/th/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%A3%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%8A%E0%B8%B7%E0%B8%AD%E0%B8%81-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B8%B7%E0%B8%AD%E0%B8%81",
  "/th/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%A3%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%8A%E0%B8%B7%E0%B8%AD%E0%B8%81-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B8%B7%E0%B8%AD%E0%B8%81", 
  "/th/%E0%B8%8B%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%99%E0%B9%88%E0%B8%B2%E0%B8%97%E0%B8%B6%E0%B9%88%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%81",
  "/th/%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%88%E0%B8%B3",
  "/th/%E0%B8%9B%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%93%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%AB%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%88",
  "/th/%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%81%E0%B8%B2",
  "/th/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%93%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88",
  "/th/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%93%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88",
  "/th/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%93%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88",
  "/th/%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%9C%E0%B8%AA%E0%B8%A1%E0%B8%9E%E0%B8%B4%E0%B9%80%E0%B8%A8%E0%B8%A9%E0%B9%84%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%AD%E0%B8%81-%E0%B8%84%E0%B8%B7%E0%B8%AD",
  "/th/%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4",
  "/th/%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A1%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%9E%E0%B8%A2%E0%B9%8C-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89",
  "/th/%E0%B9%80%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3-%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%A3",
  "/th/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%88%E0%B8%B3%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%99",
  "/th/%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B8%89%E0%B8%B8%E0%B8%81%E0%B9%80%E0%B8%89%E0%B8%B4%E0%B8%99%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%B4",
  "/th/%E0%B9%83%E0%B8%8A%E0%B9%88-%E0%B9%80%E0%B8%A3%E0%B8%B2%E0%B9%80%E0%B8%84%E0%B8%A2%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%8B%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%88",
  "/th/%E0%B9%83%E0%B8%8A%E0%B9%88-%E0%B9%80%E0%B8%A3%E0%B8%B2%E0%B9%80%E0%B8%84%E0%B8%A2%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%8B%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%88",
  "/th/cdc-b",
  "/th/cdc-smb",
  "/th/cdc-w",
  "/th/cdc",
  "/th/cdc/%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%93%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3",
  "/th/cdc/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%93%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3",
  "/th/fun-diving-koh-chang-%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3-2025",
  "/th/product-category/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%93%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3",
  "/th/product/%E0%B8%AA%E0%B8%84%E0%B8%B9%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%A3%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%A7-%E0%B8%97%E0%B8%9A%E0%B8%97%E0%B8%A7%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%94%E0%B8%B3%E0%B8%99",
  "/th/product/%E0%B8%AA%E0%B8%84%E0%B8%B9%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%A3%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%A7-%E0%B8%97%E0%B8%9A%E0%B8%97%E0%B8%A7%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%94%E0%B8%B3%E0%B8%99",
  "/th/product/%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99%E0%B",
  "/th/product/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%9C%E0%B8%AA%E0%B8%A1",
  "/th/product/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%9C%E0%B8%AA%E0%B8%A1",
  "/th/product/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%93%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B8%B7%E0%B8%99",
  "/th/product/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%93%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B8%B7%E0%B8%99",
  "/th/product/%E0%B9%80%E0%B8%8A%E0%B9%88%E0%B8%B2-%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD-%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A5%E0%B8%B6%E0%B8%81-%E0%B8%95",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%90",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%90",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%B9%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%AA%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%B9%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%AA%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B9%80%E0%B8%AB%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9E%E0%B8%B4%E0%B9%80%E0%B8%A8%E0%B8%A9-%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%96",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9E%E0%B8%B4%E0%B9%80%E0%B8%A8%E0%B8%A9-%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%96",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B8%84%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA%E0%B9%80%E0%B8%A3%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B8%84%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA%E0%B9%80%E0%B8%A3%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B8%84%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA%E0%B9%80%E0%B8%A3%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B8%84%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA%E0%B9%80%E0%B8%A3%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%B9%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%84%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%84%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%84%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%84%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%84%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%84%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A5%E0%B8%B6%E0%B8%8140%E0%B9%80%E0%B8%A1%E0%B8%95%E0%B8%A3/",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AA%E0%B8%B3%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B9%80%E0%B8%A3%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AA%E0%B8%B3%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B9%80%E0%B8%A3%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0",
  "/th/product/%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0 ",
  "/th/product/dtin",
  "/th/product/fd1",
  "/th/product/fd12",
  "/th/product/fd14",
  "/th/product/fd9",
  "/th/product/scuba-review-%E0%B8%84%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%9F%E0%B8%A3%E0%B8%8A%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%99%E0%B8%B1",
  "/th/store/category/courses/dcadth",
  "/th/store/category/courses/dcspth",
  "/th/store/category/dtb",
  "/th/store/category/dtp/%E0%B9%82%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%94-19-%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0%E0%B8%8A%E0%B9%89%E0%B8%B2%E0%B8%87",
  "/th/store/category/dtth",
  "/th/store/category/packages",
  "/th/store/category/privat-boat",
  "/th/why-advanced",
  // ❗️TH-Einträge erst ergänzen, wenn vollständig & korrekt encodiert
]);

// Wildcard/Prefix-410-Ziele (alles darunter)
const FORCE_GONE_PREFIX = [
  "/de/store/page/",
  "/de/store/seite/",
  "/de/store/tag/",
  "/th/store/tag/",
  "/th/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2/",
  "/en/tag/",
  "/en/store/page/",
  "/en/store/tag/",
  "/de/store/kategorie/",
  "/de/tag/",
  "/en/en/",
  "/de/de/",
  "/th/th/",
  // ggf. th-/store/tag/ ergänzen, wenn korrekt encodiert
];

const ROOT_FILES = new Set([
  "/", "/style.css", "/robots.txt", "/sitemap.xml", "/sitemap-images.xml",
  "/site.webmanifest", "/favicon.ico", "/favicon.svg", "/404.html"
]);

const isAsset = (p) =>
  p.startsWith("/img/") || p.startsWith("/images/") ||
  p.startsWith("/css/") || p.startsWith("/js/") ||
  p.startsWith("/fonts/") || p.startsWith("/docs/") ||
  p.startsWith("/.well-known/") || ROOT_FILES.has(p);

const isLang = (p) =>
  p === "/" || p.startsWith("/en/") || p.startsWith("/de/") || p.startsWith("/th/");

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = norm(url.pathname);

  // 1) Erst Pages entscheiden lassen (_redirects + statische Dateien)
  const res = await context.next();

  // 2) Nur wenn 404: 410-Logik anwenden
  if (res.status === 404) {
    // 2a) Exakt gelistete 410
    if (FORCE_GONE_EXACT.has(path)) {
      return new Response("Gone", { status: 410 });
    }
    // 2b) Prefix/Wildcard 410
    if (FORCE_GONE_PREFIX.some(pre => path.startsWith(pre))) {
      return new Response("Gone", { status: 410 });
    }
    // 2c) Global: außerhalb Sprach-/Assetpfade -> 410
    if (!isLang(path) && !isAsset(path)) {
      return new Response("Gone", { status: 410 });
    }
  }

  // 3) Sonst Ergebnis von Pages zurückgeben (200/301/308/404 …)
  return res;
}