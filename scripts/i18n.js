/* Offline-first, self-contained language resources. No remote translation service. */
(() => {
  "use strict";
  const dict = {
    "🌈 Artist Diversity":"🌈 Künstlervielfalt",
    "How diverse your listening habits are":"So vielfältig ist dein Musikgeschmack",
    "Artists Listened To":"Gehörte Künstler",
    "Artists in Library":"Künstler in der Bibliothek",
    "“How evenly your listening time is spread across the artists you actually play.”":"„So gleichmäßig verteilt sich deine Hörzeit auf die tatsächlich gehörten Künstler.“",
    "⭐ Rating Habits":"⭐ Deine Bewertungen",
    "How you rate your music":"So bewertest du deine Musik",
    "Rated Songs":"Bewertete Titel",
    "Unrated Songs":"Unbewertete Titel",
    "Unrated":"Unbewertet",
    "Quadrat · 1:1":"Quadrat · 1:1",
    "Portrait · 4:5":"Hochformat · 4:5",
    "Unknown Artist":"Unbekannter Künstler",
    "Unknown Album":"Unbekanntes Album",
    "Unknown Song":"Unbekannter Titel",
    "Language":"Sprache",
    "Install app":"App installieren",
    "Cancel generation":"Berechnung abbrechen",
    "Image format":"Bildformat",
    "Connect to your server to generate your all-time music statistics":"Verbinde dich mit deinem Server und erstelle deine persönliche Musikstatistik.",
    "Your All-Time wrapped45 is ready!":"Deine wrapped45-Statistik ist fertig!",
    "Click below to view your personalized wrapped experience.":"Unten kannst du dein persönliches Wrapped ansehen.",
    "🎵 View Your Wrapped":"🎵 Wrapped ansehen",
    "Connection Failed":"Verbindung fehlgeschlagen",
    "Try Again":"Erneut versuchen",
    "Server Connection":"Serververbindung",
    "Server URL":"Server-Adresse",
    "HTTPS is required. Do not include credentials or query parameters.":"HTTPS ist erforderlich. Keine Zugangsdaten oder URL-Parameter eingeben.",
    "Username":"Benutzername",
    "Password":"Passwort",
    "Generate All-Time Wrapped":"Wrapped erstellen",
    "Starting…":"Starte …",
    "Berechnung abbrechen":"Berechnung abbrechen",
    "About":"Über wrapped45",
    "This tool connects to your Navidrome server and generates Spotify-Wrapped-like statistics about your all-time music listening habits.":"Dieses Tool verbindet sich mit Navidrome und erstellt Statistiken über deine gesamte Musiksammlung und deine Hörgewohnheiten.",
    "Note:":"Hinweis:",
    "Your credentials are processed locally and never sent to any external server except your Navidrome instance.":"Deine Zugangsdaten werden ausschließlich im Browser verarbeitet und nur an deinen Navidrome-Server gesendet.",
    "Your wrapped45":"Dein wrapped45",
    "All-Time Listening Statistics":"Deine Musikstatistik",
    "Your Musical Journey":"Deine musikalische Reise",
    "Total Songs":"Titel insgesamt",
    "Total Albums":"Alben insgesamt",
    "Total Artists":"Künstler insgesamt",
    "Total Duration":"Gesamtdauer",
    "No library data available":"Keine Bibliotheksdaten vorhanden",
    "What You Hear":"Was du hörst",
    "How your minutes are split across genres and decades":"So verteilt sich deine Hörzeit auf Genres und Jahrzehnte",
    "No listening time data available":"Keine Hörzeitdaten vorhanden",
    "Detailed Breakdown":"Detaillierte Aufteilung",
    "Top Artists":"Top-Künstler",
    "Your most played artists of all time":"Deine meistgehörten Künstler",
    "No artist data available":"Keine Künstlerdaten vorhanden",
    "Top Albums":"Top-Alben",
    "Your most played albums":"Deine meistgehörten Alben",
    "No album data available":"Keine Albumdaten vorhanden",
    "Top Songs":"Top-Titel",
    "Your most played tracks":"Deine meistgehörten Titel",
    "No song data available":"Keine Titeldaten vorhanden",
    "Diversity Score":"Vielfaltswert",
    "Diversity":"Vielfalt",
    "True Artist Diversity":"Tatsächliche Künstlervielfalt",
    "Rating Distribution":"Bewertungsverteilung",
    "Your Music Summary":"Deine Musik im Überblick",
    "A complete overview of your listening journey":"Ein Überblick über deine musikalische Reise",
    "Total Plays":"Wiedergaben insgesamt",
    "Listening Time":"Hörzeit",
    "Most Neglected Song":"Am längsten nicht gehört",
    "Bildformat":"Bildformat",
    "📤 Share Your wrapped45":"📤 Wrapped teilen",
    "Generate Again":"Erneut erstellen",
    "Top Genre":"Top-Genre",
    "Top Album":"Top-Album",
    "Top Artist":"Top-Künstler",
    "Top Song":"Top-Titel",
    "Your music, in numbers":"Deine Musik in Zahlen",
    "Share Your Wrapped":"Wrapped teilen",
    "Preparing share card…":"Share-Card wird erstellt …",
    "Creating card…":"Bild wird erstellt …",
    "🎵 Your wrapped45":"🎵 Dein wrapped45",
    "🕒 What You Hear":"🕒 Was du hörst",
    "🎤 Top Artists":"🎤 Top-Künstler",
    "📀 Top Albums":"📀 Top-Alben",
    "🎵 Top Songs":"🎵 Top-Titel",
    "🎊 Your Music Summary":"🎊 Deine Musik im Überblick",
    "Days":"Tage",
    "Day":"Tag",
    "Hours":"Stunden",
    "Hour":"Stunde",
    "Minutes":"Minuten",
    "Minute":"Minute",
    "Total Ratings":"Bewertungen insgesamt",
    "Average Rating":"Durchschnittsbewertung",
    "Total Listened Artists":"Gehörte Künstler",
    "Total Library Artists":"Künstler in der Bibliothek",
    "Discovery Rate":"Entdeckungsrate",
    "Offline: Die Startseite ist verfügbar. Für neue Statistiken wird Navidrome benötigt.":"Offline: Die Startseite ist verfügbar. Für neue Statistiken wird Navidrome benötigt.",
    "App installieren":"App installieren",
    "Missing Information":"Fehlende Angaben",
    "Please fill in all server details.":"Bitte alle Serverdaten eingeben.",
    "Invalid URL":"Ungültige URL",
    "Enter a valid HTTPS Navidrome server URL.":"Bitte eine gültige HTTPS-Adresse für Navidrome eingeben.",
    "HTTPS required":"HTTPS erforderlich",
    "For your security, wrapped45 only connects to HTTPS Navidrome servers.":"Zur Sicherheit verbindet sich wrapped45 nur mit HTTPS-Navidrome-Servern.",
    "Enter the server address without credentials, query parameters or a fragment.":"Bitte die Serveradresse ohne Zugangsdaten, URL-Parameter oder Anker eingeben.",
    "Testing connection...":"Verbindung wird geprüft …",
    "Pinging server":"Server wird kontaktiert",
    "Cannot reach server. Check your URL and credentials.":"Server nicht erreichbar. Bitte Adresse und Zugangsdaten prüfen.",
    "No music data found on your server":"Keine Musikdaten auf dem Server gefunden",
    "Generation Failed":"Erstellung fehlgeschlagen",
    "Generated for user: ":"Erstellt für: ",
    "Unknown User":"Unbekannter Benutzer",
    "Starting album scan":"Albumsuche wird gestartet",
    "Processing":"Verarbeite",
    "Done":"Fertig",
    "Building final objects":"Statistiken werden erstellt",
    "Berechnung abgebrochen.":"Berechnung abgebrochen.",
    "Anmeldung fehlgeschlagen: Benutzername oder Passwort prüfen.":"Anmeldung fehlgeschlagen: Benutzername oder Passwort prüfen.",
    "Share-Card konnte nicht erstellt werden.":"Share-Card konnte nicht erstellt werden."
  };
  const originals = new WeakMap();
  let locale = "de";
  try { locale = localStorage.getItem("wrapped45_language") === "en" ? "en" : "de"; } catch {}
  const t = (message) => locale === "de" ? (dict[String(message)] ?? String(message)) : String(message);
  function translateString(original) {
    if (locale === "en") return original;
    // Replace complete text nodes, preserving leading/trailing whitespace.
    const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!match) return original;
    const key = match[2].replace(/\s+/g, " ").trim();
    if (!key) return original;
    if (dict[key]) return match[1] + dict[key] + match[3];
    if (/^Generated on /.test(key)) return match[1] + key.replace(/^Generated on /, "Erstellt am ") + match[3];
    if (/^(\d+) plays$/.test(key)) return match[1] + key.replace(/ plays$/, " Wiedergaben") + match[3];
    if (/^by /.test(key)) return match[1] + key.replace(/^by /, "von ") + match[3];
    if (/^Album \d+\/\d+$/.test(key)) return match[1] + key.replace(/^Album /, "Album ") + match[3];
    return original;
  }
  function translateDOM(root = document) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const original = originals.get(node) ?? node.nodeValue;
      if (!originals.has(node)) originals.set(node, original);
      const translated = translateString(original);
      if (node.nodeValue !== translated) node.nodeValue = translated;
    }
  }
  function refresh() {
    document.documentElement.lang = locale;
    for (const input of document.querySelectorAll(".language-select")) input.value = locale;
    translateDOM(document.body);
    if (window.wrappedDisplay) {
      const position = window.wrappedDisplay.currentSection;
      window.wrappedDisplay.render();
      window.wrappedDisplay.showSection(position);
    }
  }
  function changeLanguage(language) {
    locale = language === "en" ? "en" : "de";
    try { localStorage.setItem("wrapped45_language", locale); } catch {}
    refresh();
  }
  document.addEventListener("DOMContentLoaded", () => {
    for (const input of document.querySelectorAll(".language-select")) {
      input.addEventListener("change", () => changeLanguage(input.value));
    }
    refresh();
  });
  window.WrappedI18n = { t, refresh, translateDOM, changeLanguage, get language() { return locale; } };
})();
