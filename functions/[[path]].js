// /functions/[[path]].js
// Cloudflare Pages Function: gibt für alle Nicht-Sprachpfade 410 zurück,
// lässt Root, Sprachpfade und Assets/Root-Dateien passieren.

export async function onRequest(context) {
    const url = new URL(context.request.url);
    const p = url.pathname;
  
    // 1) Immer durchlassen: OPTIONS (CORS/Preflight)
    if (context.request.method === "OPTIONS") {
      return context.next();
    }
  
    // 2) Whitelists
    const allowPrefixes = ["/en/", "/de/", "/th/"]; // Sprachpfade
    const assetPrefixes = [
      "/img/", "/images/", "/css/", "/js/", "/fonts/", "/.well-known/"
    ];
    const allowRootFiles = [
      "/",                    // Root
      "/robots.txt",
      "/sitemap.xml",
      "/sitemap-images.xml",
      "/site.webmanifest",
      "/favicon.ico",         // favicons
      "/favicon.svg",
      "/404.html"
    ];
  
    // Rootdateien erlauben
    if (allowRootFiles.includes(p)) {
      return context.next();
    }
  
    // Sprachpfade erlauben
    if (allowPrefixes.some(pre => p.startsWith(pre))) {
      return context.next();
    }
  
    // Assets erlauben (außerhalb der Sprachpfade)
    if (assetPrefixes.some(pre => p.startsWith(pre))) {
      return context.next();
    }
  
    // 3) Alles andere -> 410 Gone
    return new Response("Gone", { status: 410 });
  }
