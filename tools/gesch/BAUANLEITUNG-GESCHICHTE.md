# Bauanleitung SOL-Geschichte-Module (Jahrgänge 5, 8, 9, 10)

Du baust Lernmodule für das Selbstorganisierte Lernen (SOL) im Fach Geschichte an einer niedersächsischen Oberschule (Ludgerusschule Rhede, Ems). Die Module gehen direkt an Schülerinnen und Schüler. Fachliche Richtigkeit, Quellenehrlichkeit und klare, einfache Sprache haben Vorrang vor Effekten.

Alle Pfade sind relativ zu `/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/`.

## 1. Was du ablieferst

- Pro Modul genau eine eigenständige Datei: `upload/geschichte/klasse-J/NNN/index.html` (J = Jahrgang, NNN = dreistellige Modulnummer).
- Alles inline (CSS, JS, SVG). Keine externen Skripte, Schriften, Bilder oder CDNs. Illustrationen, Karten und Zeitleisten zeichnest du als Inline-SVG (schematisch, sauber beschriftet, keine Überlappungen).
- Größe meist 50 bis 90 KB.
- Ändere KEINE anderen Dateien der Website (insbesondere nicht `assets/geschichte-*.js`, Übersichtsseiten, andere Module). Die Verlinkung macht die Projektleitung.

## 2. Vorlage

Lies zuerst VOLLSTÄNDIG `upload/geschichte/klasse-6/004/index.html`. Das ist die Referenz für Aufbau, Gestaltung und Technik. Sieh dir zusätzlich an:
- `upload/geschichte/klasse-6/009/index.html` und `012/index.html` (weitere Aufgabenformen),
- `upload/geschichte/klasse-6/008/index.html` und `015/index.html` (Lerncheck-Module).

Übernimm aus der Vorlage: CSS, den `ebSend`-Helfer im `<head>`, Kopfbereich mit „Leichter lesen“, „Vorlesen“, „Stopp“, Fortschrittsleiste, Seitennavigation, die drei Lernwege (sicher / standard / weiter), die Begleitfigur Chronos, Speichern im `localStorage` (Stand bleibt nach Neuladen erhalten), Lerncheck, Ergebnis mit Ampel, Zusammenfassung kopieren und Senden mit Rückmeldung und „Erneut senden“.

Baue die Inhalte und Aufgaben für dein Thema neu. Kopiere keine Burg-Inhalte.

## 3. Pflichtänderungen gegenüber der Vorlage

1. **Jahrgang J überall:** Kopfzeile „SOL Geschichte J · Oberschule Niedersachsen“, `<title>SOL Geschichte J | Modul NNN | Leitfrage</title>`, `payload().jahrgang: "J"`, Zusammenfassung „SOL Geschichte J, Modul …“.
2. **Klassenprüfung `klasseOk`:** akzeptiert nur Jahrgang J und normalisiert auf z. B. `8b`. Beispiele, die gehen müssen: `8b`, `Klasse 8b`, `8 b`, `R8b`, `8`. Abgelehnt mit Meldung „Diese Klasse gehört nicht zu Jahrgang J. …“: andere Jahrgänge. Achtung: Bei J = 5 darf `15` nicht durchgehen, bei J = 10 muss `10a` gehen und `0a` nicht. Verwende z. B. `t.match(/(?:^|[^0-9])8([a-z]?)$/)` bzw. für 10 `/(?:^|[^0-9])10([a-z]?)$/` auf dem bereinigten Text.
3. **CFG:** `modul:"NNN"`, `titel:` exakt die Leitfrage aus der Liste, `bereich:` Themenbereich, `key:"sol-geschichte-J-NNN"` (mit Jahrgang, damit sich Module verschiedener Jahrgänge nicht überschreiben), `endpoint` unverändert aus der Vorlage.
4. **Payload:** gleiches Schema wie in der Vorlage (fach, jahrgang, modul_id, modul_titel, themenbereich, name, klasse, email, lernweg, fortschritt, ergebnisse, freitexte, lerncheck, punkte, max_punkte, prozent, auffaelligkeiten, bearbeitungsstand, pflichtaufgaben {x:{correct}}, kompetenzen (0/1: fachwissen, zeit_raum, quellenarbeit, ursachen_folgen, perspektivitaet, historisches_urteil), abschlusstest_punkte, abschlusstest_max, selbsteinschaetzung, fehlende_bereiche, hosting_modus, schema_version, modul_nummer, abgabe_id). `payload` muss als globale Funktion aufrufbar sein.
5. **Pflicht-IDs:** `#name`, `#klasse`, `#email`, `#startBtn`, `#startFb`, `#sendBtn`, `#sendFb`.
6. **Nicht übernehmen:** den Lehrkraftbereich (`.teacher`, `#lehrkraft`), den Dokumentationsblock (`.doc`, `#doku`) und die Datenansicht (`#payloadView`, „Vollständigen Datenüberblick anzeigen“). Schülerinnen und Schüler sehen keine technischen Details.
7. **Empfehlung im Ergebnis** verweist auf das nächste Modul des Jahrgangs (Nummer und Thema).
8. **Leitfarbe je Jahrgang:** Ersetze im CSS die grüne Leitfarbe und den Kopfverlauf:
   - J = 5: `--green:#8a4317`, Kopf `linear-gradient(130deg,#2e1a0e,#8a4317)`, Gold bleibt.
   - J = 8: `--green:#37546b`, Kopf `linear-gradient(130deg,#18242e,#37546b)`.
   - J = 9: `--green:#4a4458`, Kopf `linear-gradient(130deg,#1f1c26,#4a4458)`.
   - J = 10: `--green:#1f5c8c`, Kopf `linear-gradient(130deg,#10263a,#1f5c8c)`.
   Passe davon abgeleitete helle Töne (z. B. `#e9f2ec`) dezent an. `.ok`-Farben (grün für richtig) bleiben grün.

## 4. Didaktischer Aufbau (45 bis 60 Minuten)

Reihenfolge der Abschnitte (Navigation links, Fortschritt oben):
1. **Start:** Name oder Lerncode, Klasse, E-Mail (Pflicht), Lernweg wählen. „Start“ führt zur Mission (Einstieg), nicht direkt zu einer Aufgabe.
2. **Mission / Einstieg:** Chronos stellt die Leitfrage als Auftrag. Kurzer, anschaulicher Einstieg (Alltagsbezug, Bild oder Szene).
3. **Was glaubst du? (Diagnose):** Vorwissen und Vermutung, ohne Bewertung.
4. **Erarbeitung:** 3 bis 5 interaktive Abschnitte mit unterschiedlichen Formaten, z. B. Zuordnen (Tippen statt nur Ziehen), Reihenfolge/Zeitleiste, Hotspots in einer SVG-Grafik oder Karte, Ursache-Folge-Kette, Auswahlaufgaben mit erklärender Rückmeldung zu jeder Antwort, Lückentext, Perspektivwechsel (wer sieht das wie?).
5. **Die Quelle:** mindestens eine echte historische Quelle mit Quellenarbeit (Wer? Wann? Für wen? Warum? Was sagt sie, was nicht?). Dazu Unterscheidung Quelle und Darstellung.
6. **Glossar** wichtiger Fachbegriffe (aufklappbar).
7. **Mein Lerncheck:** drei Ich-kann-Aussagen zur Selbsteinschätzung. Steht VOR dem Ergebnis.
8. **Abschlussmission:** begründetes historisches Urteil zur Leitfrage. Auswahlentscheidung plus Freitext. Freitext-Rückmeldung nach Kriterien (Satzanzahl, Verknüpfungswörter wie „weil“, „deshalb“, Fachbegriffe), freundlich und konkret.
9. **Ergebnis:** Punkte, Ampel, Analyse, Zusammenfassung kopieren, Senden.

Lernwege: „sicher“ bekommt Hilfen und Satzanfänge, „weiter“ eine zusätzliche anspruchsvolle Aufgabe (z. B. zweite Quelle, Kontroverse, Gegenwartsbezug).

**Lerncheck-Module** (Titel beginnt mit „Lerncheck:“): wie `klasse-6/008` und `015`. Sie wiederholen die vorangehenden Module der Gruppe mit gemischten Aufgaben (Zeitleiste, Begriffe, Ursachen und Folgen, Quellen erkennen, Merksatz prüfen) und enden mit einer Urteilsaufgabe.

## 5. Fachliche und ethische Regeln

- Inhalte orientieren sich am Kerncurriculum Geschichte Niedersachsen für die Oberschule und am Niveau des Jahrgangs.
- **Quellen nur echt und belegt.** Zitate wörtlich aus gemeinfreien Übersetzungen oder ausdrücklich als „vereinfacht wiedergegeben“ gekennzeichnet. Immer mit Angabe: Verfasser, Werk oder Anlass, Jahr. Erfinde niemals ein Zitat und gib nichts Erfundenes als Quelle aus. Bist du unsicher, nimm eine verlässlich belegte Quelle oder arbeite mit einem Verfassertext (klar als „Darstellung“ gekennzeichnet). Nutze WebSearch, um Daten, Zahlen und Zitate zu prüfen.
- Zahlen, Daten und Namen prüfen. Bei umstrittenen Zahlen Spannbreiten nennen („etwa“, „Schätzungen reichen von … bis …“).
- **Sensible Themen** (Sklaverei, Kolonialismus, Rassismus, Nationalsozialismus, Holocaust, Verfolgung, Krieg, Gewalt): würdevoll und sachlich. Keine Verharmlosung, keine spielerischen Elemente, keine Witze von Chronos, keine Punkte- oder Abzeichen-Effekte, die das Leid trivialisieren (Punkte für Wissensaufgaben sind in Ordnung). Keine NS-Symbole oder Propagandabilder zeichnen; beschreiben genügt. Rassistische Begriffe nicht wiederholen, außer in einem notwendigen, eingeordneten Quellenzitat. Opfer als Menschen mit Namen und Geschichte zeigen, nicht nur als Zahlen. Bei Holocaust-Themen am Ende ein ruhiger Hinweis, dass man über Gefühle mit Lehrkraft oder Schulsozialarbeit sprechen kann.
- Regionale Bezüge (Emsland, Ostfriesland, Niedersachsen, Papenburg, Meppen, Lingen, Rhede) sind willkommen, wenn sie fachlich stimmen.
- Multiperspektivität: mehrere Sichtweisen zeigen, Urteile begründen lassen, nicht vorgeben.

## 6. Sprache und Gestaltung

- Du-Form, kurze Sätze, einfache Sprache, Fachbegriffe erklären.
- KEINE Gedankenstriche als Stilmittel (keine „ – “ oder „ — “). Setze Punkt oder Komma. Für Zeiträume „1914 bis 1918“ oder „1914–1918“ ohne Leerzeichen.
- Deutsche Anführungszeichen „…“.
- Mobil nutzbar (390 px Breite ohne waagerechtes Scrollen), Tippziele mindestens 44 px, Tastatur und Screenreader bedienbar (Buttons, aria-Attribute wie in der Vorlage).
- Modern, ruhig, nicht überladen.

## 7. Testen (Pflicht für jedes Modul)

```
# eigener Webserver (Port laut Auftrag), einmal starten:
(cd upload && setsid nohup python3 -m http.server PORT >/dev/null 2>&1 &)
cd gen/gesch
python3 gcheck.py J NNN PORT        # muss "OK" melden
```
`gcheck.py` prüft Laden ohne JS-Fehler (1280 und 390 px), Pflicht-IDs, Klassenprüfung, payload (Jahrgang, Modul, Klasse, Pflichtfelder), Querscrollen, Gedankenstriche, interne Blöcke, und legt ganzseitige Bildschirmfotos unter `shots_g/J_NNN_1280.png` und `_390.png` ab.

Zusätzlich schreibst du dir ein eigenes kleines Playwright-Skript (in einem eigenen Unterordner von `gen/gesch/`, z. B. `gen/gesch/w_PORT/`), das das Modul einmal komplett durcharbeitet: alle Aufgaben richtig lösen, Lerncheck ausfüllen, Abschlussmission, Ergebnis bauen, Senden (auf localhost erscheint „Vorschau-Modus“). Danach müssen alle Schritte erledigt sein (Fortschritt voll), keine JS-Fehler. Prüfe auch: Neuladen behält den Stand. Sieh dir die Bildschirmfotos an (Read-Werkzeug) und behebe Darstellungsfehler (überlappende Beschriftungen, abgeschnittene SVGs, zu kleine Schrift).

## 8. Abschlussbericht

Kurz auf Deutsch: Module mit Titel, verwendete Quellen (mit Angabe), Aufgabenformate, Testergebnis (gcheck OK, Durchlauf vollständig), behobene Probleme, offene Punkte oder fachliche Unsicherheiten.
