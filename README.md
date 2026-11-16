# wrapped45

**wrapped45** ist eine eigenständige, browserbasierte Musikstatistik-App für [Navidrome](https://www.navidrome.org/). Sie basiert auf [Navidrome-Wrapped](https://github.com/mdeik/Navidrome-Wrapped) von Matthew Deik und zeigt unter anderem beliebte Titel, Künstler, Alben, Genres und geschätzte Hörzeit.

## Starten

Die Anwendung besteht aus HTML, CSS und JavaScript und benötigt kein eigenes Backend. Öffne `index.html` oder hoste die Dateien über einen statischen HTTPS-Webserver. Trage deine Navidrome-Server-URL sowie deine Zugangsdaten ein oder nutze den Demo-Modus.

**Online-Demo bei aktivierter GitHub Pages-Bereitstellung:** https://x45eu.github.io/wrapped45/

## Datenschutz und Sicherheit

Die Statistikberechnung läuft im Browser. Der Browser baut eine Verbindung direkt zu deinem Navidrome-Server auf; die Verbindung muss daher vom Server und Browser (CORS) erlaubt werden. Verwende HTTPS für öffentlich erreichbare Navidrome-Instanzen. Fertige Statistiken werden nur während des aktuellen Seitenaufrufs im Arbeitsspeicher gehalten. Nach einem Neuladen beginnt wrapped45 wieder bei der Eingabemaske; ein früherer `localStorage`-Cache wird beim Start entfernt. Passwörter werden nicht dauerhaft gespeichert. Teilen der Ergebnisse ist weiterhin möglich.

Die geschätzte Hörzeit ergibt sich aus Songdauer × Wiedergabezähler; sie ist keine exakte Wiedergabehistorie.

## Projektstatus

Die Ursprungsversion der Web-App wurde übernommen. Titel, Manifest und vorläufiges SVG-Symbol wurden für wrapped45 angepasst. Weitere funktionale Erweiterungen und Designarbeiten folgen schrittweise.

## Herkunft und Lizenz

Dieses Projekt ist eine unabhängige Weiterentwicklung von [mdeik/Navidrome-Wrapped](https://github.com/mdeik/Navidrome-Wrapped), lizenziert unter **MIT**.

**Ursprünglicher Copyright-Vermerk: Copyright (c) 2025 Matthew Deik.** Die ursprüngliche MIT-Lizenz wurde unverändert in [LICENSE](LICENSE) übernommen. wrapped45 ist nicht offiziell mit Navidrome oder dem ursprünglichen Projekt verbunden.

## Design und Logo

Die Wortmarke steht unter `assets/wrapped45-logo.svg`: „wrapped“ in hellem Grau (`#d4dbe5`) und die „45“ in media45-Blau (`#60a5fa`). Das quadratische App-Icon unter `icons/wrapped45.svg` nutzt denselben Blauton und ein dunkles Hintergrundfeld. Die 45-Glyphe wurde aus dem Logo von [media45](https://github.com/x45eu/media45) übernommen.
