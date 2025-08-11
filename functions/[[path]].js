// Cloudflare Pages Function – lässt nur nötige Pfade durch, Rest = 410 Gone
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const p = url.pathname;

  // Preflight etc. immer erlauben
  if (context.request.method === "OPTIONS") return context.next();

  // Sprachpfade (Seiten)
  const allowPrefixes = ["/en/", "/de/", "/th/"];

  // Öffentliche Asset-Ordner (falls du docs NICHT brauchst, nimm "/docs/" raus)
  const assetPrefixes = ["/img/", "/css/", "/js/", "/fonts/", "/docs/"];

  // Öffentliche Root-Dateien
  const allowRootFiles = [
    "/",               // Landing/Root
    "/index.html",
    "/style.css",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap-images.xml"
  ];

  // 1) explizite Root-Dateien
  if (allowRootFiles.includes(p)) return context.next();

  // 2) Sprachpfade
  if (allowPrefixes.some(pre => p.startsWith(pre))) return context.next();

  // 3) Asset-Ordner
  if (assetPrefixes.some(pre => p.startsWith(pre))) return context.next();

  // 4) sonst: bewusst entfernt/privat
  return new Response("Gone", { status: 410 });
}