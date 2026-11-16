# wrapped45

**wrapped45** ist eine eigenständige, browserbasierte Musikstatistik-App für [Navidrome](https://www.navidrome.org/). Sie basiert auf [Navidrome-Wrapped](https://github.com/mdeik/Navidrome-Wrapped) von Matthew Deik und zeigt unter anderem beliebte Titel, Künstler, Alben, Genres und geschätzte Hörzeit.

## Starten

Die Anwendung besteht aus HTML, CSS und JavaScript und benötigt kein eigenes Backend. Öffne `index.html` oder hoste die Dateien über einen statischen HTTPS-Webserver. Trage deine HTTPS-Navidrome-Server-URL sowie deine Zugangsdaten ein.

**Online-Version bei aktivierter GitHub Pages-Bereitstellung:** https://x45eu.github.io/wrapped45/

## Datenschutz und Sicherheit

Die Statistikberechnung läuft im Browser. Der Browser baut eine Verbindung direkt zu deinem Navidrome-Server auf; die Verbindung muss daher vom Server und Browser (CORS) erlaubt werden. Es sind ausschließlich HTTPS-Navidrome-Adressen erlaubt. wrapped45 verwendet POST-Formulardaten statt URL-Abfrageparameter für Subsonic-Token, Username und Salt, damit diese nicht in der Anfrage-URL erscheinen. Der Subsonic-MD5-Tokenmechanismus ist jedoch veraltet und kein Ersatz für HTTPS. Die Authentifizierungsdaten erreichen weiterhin deinen Navidrome-Server und können auf diesem beziehungsweise auf Reverse-Proxies verarbeitet oder protokolliert werden. Fertige Statistiken werden nur während des aktuellen Seitenaufrufs im Arbeitsspeicher gehalten. Nach einem Neuladen beginnt wrapped45 wieder bei der Eingabemaske; ein früherer `localStorage`-Cache wird beim Start entfernt. Das Passwortfeld wird nach Beginn der Anmeldung geleert und die Zugangsdaten nach Abschluss oder Fehler aus dem API-Client entfernt. Passwörter werden nicht dauerhaft gespeichert. Der Browser hält die Werte während der Berechnung vorübergehend im Arbeitsspeicher. Ein exaktes Überschreiben von JavaScript-Strings ist technisch nicht garantiert. Share-Cards laden keine externen Schriftarten. Teilen der Ergebnisse ist weiterhin möglich.

Die geschätzte Hörzeit ergibt sich aus Songdauer × Wiedergabezähler; sie ist keine exakte Wiedergabehistorie.

## Projektstatus

Die Ursprungsversion der Web-App wurde übernommen. Titel, Manifest und vorläufiges SVG-Symbol wurden für wrapped45 angepasst. Weitere funktionale Erweiterungen und Designarbeiten folgen schrittweise.

## Schriftarten

wrapped45 liefert beide Schriftarten **lokal** aus `assets/fonts/`, ohne externe Schriftserver:

- **JetBrains Mono** (variable Fontdatei) für Überschriften, Buttons, Statistiken, Zahlen und hervorgehobene Informationen – auch auf den Share-Cards.
- **Atkinson Hyperlegible** (Regular/Bold) für Fließtexte und Beschreibungen.

Beide Schriftarten stehen unter der **SIL Open Font License 1.1**. Lizenz und Copyright JetBrains Mono: [assets/fonts/JetBrainsMono-OFL.txt](assets/fonts/JetBrainsMono-OFL.txt). Lizenz und Copyright Atkinson Hyperlegible: [assets/fonts/OFL.txt](assets/fonts/OFL.txt). Es wird **keine Nerd-Font-Version** verwendet.

## Herkunft und Lizenz

Dieses Projekt ist eine unabhängige Weiterentwicklung von [mdeik/Navidrome-Wrapped](https://github.com/mdeik/Navidrome-Wrapped), lizenziert unter **MIT**.

**Ursprünglicher Copyright-Vermerk: Copyright (c) 2025 Matthew Deik.** Die ursprüngliche MIT-Lizenz wurde unverändert in [LICENSE](LICENSE) übernommen. wrapped45 ist nicht offiziell mit Navidrome oder dem ursprünglichen Projekt verbunden.

## Mehrsprachigkeit und Offline-Betrieb

Die Oberfläche bietet Deutsch und Englisch. Die Sprachauswahl wird lokal als einfache Präferenz gespeichert; Zugangsdaten und Musikstatistiken bleiben flüchtig. Die PWA speichert nur die statischen App-Dateien inklusive Schriftarten in einem getrennten Cache. Eine bereits geladene Startseite kann offline geöffnet werden, die Navidrome-Verbindung und neue Statistiken benötigen weiterhin Internet. Keine Navidrome-API-Antworten oder persönlichen Wrapped-Daten werden im Service-Worker-Cache gespeichert.
