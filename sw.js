/* wrapped45 offline shell. Never cache cross-origin API traffic or user data. */
const CACHE_NAME = "wrapped45-shell-v3";
const SHELL = [
  "./", "./index.html", "./manifest.json", "./icons/wrapped45.svg", "./icons/wrapped45-192.png", "./icons/wrapped45-512.png",
  "./assets/wrapped45-logo.svg?v=2",
  "./styles/main.css", "./styles/responsive.css",
  "./scripts/md5.js", "./scripts/utils.js", "./scripts/navidrome-client.js",
  "./scripts/wrapped-display.js", "./scripts/share-card.js",
  "./scripts/app.js", "./scripts/i18n.js", "./scripts/pwa.js",
  "./assets/fonts/JetBrainsMono-Variable.ttf",
  "./assets/fonts/AtkinsonHyperlegible-Regular.ttf",
  "./assets/fonts/AtkinsonHyperlegible-Bold.ttf"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter(k => k.startsWith("wrapped45-shell-") && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Only explicitly enumerated shell resources may be served from this cache.
  const shellURLs = new Set(SHELL.map(path => new URL(path, self.registration.scope).href));
  const isShell = shellURLs.has(url.href);
  const isNavigation = request.mode === "navigate" && url.pathname.startsWith(new URL(self.registration.scope).pathname);
  if (!isShell && !isNavigation) return;
  if (isNavigation) {
    event.respondWith(fetch(request).catch(() => caches.match(new URL("./index.html", self.registration.scope).href)));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
