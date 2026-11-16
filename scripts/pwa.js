/* Offline app shell only. API requests and personal Wrapped results are never cached. */
(() => {
  const indicator = document.createElement("p");
  indicator.id = "offlineNotice";
  indicator.hidden = navigator.onLine !== false;
  indicator.textContent = "Offline: Die Startseite ist verfügbar. Für neue Statistiken wird Navidrome benötigt.";
  indicator.setAttribute("role", "status");
  indicator.className = "offline-notice";
  function updateOnlineStatus() {
    indicator.hidden = navigator.onLine !== false;
    if (indicator.hidden) return;
    window.WrappedI18n?.translateDOM(indicator);
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".container")?.prepend(indicator);
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {
        // Running without offline support must never block the app.
      });
    }
  });
  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    const button = document.getElementById("installPwa");
    if (button) button.hidden = false;
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    const button = document.getElementById("installPwa");
    if (button) button.hidden = true;
  });
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("installPwa");
    button?.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      const prompt = deferredPrompt;
      deferredPrompt = null;
      button.hidden = true;
      await prompt.prompt();
    });
  });
})();
