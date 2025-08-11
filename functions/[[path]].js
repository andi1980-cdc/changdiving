export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // --- Asset-Passthrough ---
  const assetPrefixes = ["/img/", "/css/", "/js/", "/fonts/", "/docs/", "/style.css", "/favicon", "/robots.txt", "/sitemap.xml", "/sitemap-images.xml", "/404.html"];
  if (assetPrefixes.some(prefix => path.startsWith(prefix))) {
    return context.next();
  }

  // --- Exakte 410er-Liste (aus deiner CSV, dedupliziert) ---
  const FORCE_GONE = new Set([
    "/de/about/boots-plan/",
    "/de/about/die-anmeldung/",
    "/de/about/the-dive-process/",
    "/de/nationalparks-in-thailand-und-koh-chang/",
    // ... hier alle weiteren 410-Pfade aus deiner Liste einfügen
  ]);

  if (FORCE_GONE.has(path)) {
    return new Response("410 Gone", { status: 410 });
  }

  // --- Globale Regel: Alles außerhalb /en/, /de/, /th/ → 410 ---
  const langPrefixes = ["/en/", "/de/", "/th/"];
  if (!langPrefixes.some(prefix => path.startsWith(prefix)) && path !== "/" ) {
    return new Response("410 Gone", { status: 410 });
  }

  // Sonst normal weiter
  return context.next();
}