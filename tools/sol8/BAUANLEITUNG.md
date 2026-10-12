# Bauanleitung SOL-Mathe-Module Klasse 8

Arbeitsordner: `/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/sol8/`
Website-Ordner: `../../upload/` (Module landen in `upload/mathe/klasse-8/NNN/index.html`)

## Vorbilder (unbedingt zuerst lesen)
- `modules/001.js` (Brüche multiplizieren: Bruch-Eingaben, typische Fehler erkennen, Rechteckmodell)
- `modules/003.js` (Klammerterme: Term-Eingaben mit `form`, `factor`, `src`)
- `modules/011.js` (Steigung: SVG-Koordinatensystem, Schieberegler, Sachaufgabe)
- `modules/016.js` (Winkelsumme: maßstabsgetreue SVG-Figuren mit Winkelbeschriftung)
- `mathlib.js` (Hilfsfunktionen `M.*` und die Antwortprüfung `M.check`)
- `engine.js` (wie die Abschnitte gerendert werden; NICHT ändern)

## Was du NICHT ändern darfst
`engine.js`, `mathlib.js`, `style.css`, `build.py`, `test_module.js`, `e2e.py`, `config.json`, `overview.py`, andere Module.
Brauchst du eine Engine-Änderung, beschreibe sie in deinem Abschlussbericht, statt sie selbst zu machen.

## Aufbau eines Moduls (Datei `modules/NNN.js`)
```js
var MODULE = (function () {
  /* Hilfsfunktionen, Generatoren */
  var gen = { schluessel: function (level) { return { ...Aufgabe... }; }, ... };
  return {
    id: 'NNN', title: '…', bereich: '…', minutes: '45 bis 60',
    vorkenntnisse: '…', lead: '… (1 bis 2 Sätze, neugierig machend)',
    einstieg: { html: '<p>Alltagssituation …</p><p class="note">Leitfrage …</p><p>…</p>' },
    ziele: [5 Ich-kann-Sätze],
    fachwoerter: [['Begriff', 'Erklärung'], … 3 bis 5],
    diagnose: [4 Fragen { q, options: [3 Antworten + 'Weiß ich noch nicht'], answer: Index, why, review }],
    erklaerung: 'HTML mit <h3>, mindestens einer <div class="merk"><b>Merke:</b> …</div>, Beispielen, ggf. SVG',
    entdecken: { html: '…Bedienelemente (range/select/button)…', init: function (root, done) { … done('Rückmeldung') nach 2 bis 3 Interaktionen } },
    beispiel: { title, q, steps: [4 bis 5 Schritte, letzter mit Kontrolle] },
    tasks: { gen: gen,
      plan: { G: [4 Schlüssel], S: [5 Schlüssel], E: [6 Schlüssel] },   // Format 'schluessel:level' (1 Grundlage, 2 Standard, 3 Knobeln)
      extra: 'schluessel',            // Weiterdenken-Aufgabe (anspruchsvoll, Transfer)
      test: [6 Schlüssel] },
    lerncheck: [4 Aussagen „Ich …“]
  };
})();
```

## Aufgabenobjekt (Rückgabe eines Generators)
```js
{ skill: 'Kurzname des Aufgabentyps (erscheint in der Lehrer-Auswertung)', level: 1|2|3 (optional),
  q: 'HTML der Aufgabe', inputs: [Eingabe, …],
  hints: [3 Tipps, gestuft: Idee → Teilschritt → fast Lösung],
  solution: 'HTML-Lösungsweg',
  mistakes: function (werte) { return 'gezielte Rückmeldung' oder null },   // optional, für typische Fehler
  src: 'Term der Aufgabe' (nur bei Term-Eingaben: unabhängige Kontrolle, dass die Lösung gleichwertig ist),
  verify: function () { return true oder 'Fehlertext' }   // EMPFOHLEN: unabhängige Nachrechnung
}
```
Eingabearten (`kind`):
- `num`: Zahl. `answer` Zahl, `tol` Toleranz (Standard exakt; Geld 0.005, gerundete Werte z. B. 0.05), `unit` z. B. '€', 'cm²', '°'
- `frac`: Bruch. `answer: {n,d}` (gekürzt!), `reduce: true` wenn vollständig gekürzt verlangt
- `term`: Term mit x (oder a, b …). `answer` als parsebarer String ('3x+12', '2x^2-5x', '(1/2)*x+3'). Optional `form: 'expanded'|'factored'|'simplified'`, `factor: '3'` (größter Faktor beim Ausklammern), `maxTerms`
- `mc`: Auswahl. `options: [HTML…]`, `answer: Index`. Optionen müssen sich im Text unterscheiden (Test prüft das)
- `text`: kurzes Wort, `answer` String oder Array erlaubter Schreibweisen (sparsam einsetzen)

Jedes Feld hat `label` (z. B. 'x =', 'Zinsen'), bei Bedarf `placeholder`.

## Qualitätsregeln
1. **Fachlich korrekt.** Kerncurriculum Mathematik Realschule Niedersachsen, Doppeljahrgang 7/8 (`../../kc/raw.txt`, Abschnitt 3.3.2 ab Zeile 1854). Niveau Oberschule Klasse 8, eher G/E-Mischung.
2. **Zufallszahlen mit schönen Ergebnissen** (ganzzahlig oder einfache Brüche/Dezimalzahlen). Keine Grenzfälle wie Division durch 0, negative Längen, entartete Figuren.
3. **Unabhängige Kontrolle:** Wo möglich `verify()` schreiben, das das Ergebnis auf einem anderen Weg nachrechnet (z. B. Probe einsetzen, Fläche über Koordinaten statt Formel). Bei Termen `src` setzen.
4. **Zeichnungen** als inline-SVG, `class="viz"`, sinnvolles `viewBox`, maßstabsgetreu wenn Maße im Bild stehen, sonst Hinweis „Skizze nicht maßstabsgetreu“. Farben: Linie `#3d2a73`, Fläche `#efeafb`, Akzent `#d97706`, Hervorhebung `#5b3fa0`. Beschriftungen dürfen sich nicht überlappen.
5. **Sprache:** Deutsch, Schülerinnen und Schüler mit „du“ ansprechen, einfache klare Sätze. KEINE Gedankenstriche als Stilmittel (kein „ – “), stattdessen Punkt oder Komma. Zahlen mit Komma (M.fmtNum), Minuszeichen „−“ in Anzeigen, Einheiten mit Leerzeichen („12 cm²“).
6. **Tipps** helfen wirklich (konkret mit den Zahlen der Aufgabe), der Lösungsweg zeigt alle Rechenschritte.
7. **Typische Fehler** mit `mistakes` gezielt ansprechen, wo sinnvoll (mindestens in 2 Generatoren pro Modul).
8. **Mindestens 7 verschiedene Generatoren** pro Modul, Plan G/S/E und Test nutzen sie sinnvoll, `extra` ist eine echte Transferaufgabe.
9. Diagnose prüft Vorwissen (nicht das neue Thema), jede Frage mit Option 'Weiß ich noch nicht'.
10. Entdecken ist interaktiv und anschaulich (Schieberegler/Auswahl + SVG + Live-Rechnung) und ruft `done('…')` nach 2 bis 3 Interaktionen auf.

## Prüfen (Pflicht, bis alles fehlerfrei ist)
```
cd /tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/sol8
node test_module.js modules/NNN.js 400          # muss "0 Fehler" melden
python3 build.py NNN                            # baut upload/mathe/klasse-8/NNN/index.html
# eigener Webserver (Port je Helfer verschieden, siehe Auftrag), einmal starten:
(cd ../../upload && nohup python3 -m http.server PORT >/dev/null 2>&1 &)
python3 e2e.py NNN PORT S                       # Browser-Durchlauf, keine Fehler, "7 von 7"
python3 e2e.py NNN PORT E                       # Lernweg E: "8 von 8"
```
Danach Bildschirmfotos in `../../shots8/NNN_1280_*.png` und `NNN_390_*.png` ansehen (Read-Werkzeug) und Darstellungsfehler beheben (Überlappungen, abgeschnittene SVGs, zu große Grafiken).
Zusätzlich einige Aufgaben stichprobenartig selbst lesen, z. B.:
```
node -e "const M=require('./mathlib.js');const vm=require('vm'),fs=require('fs');const c={M,Math};vm.createContext(c);vm.runInContext(fs.readFileSync('modules/NNN.js','utf8')+';this.MODULE=MODULE',c);for(const k in c.MODULE.tasks.gen){const t=c.MODULE.tasks.gen[k](2);console.log(k,'|',t.q.replace(/<[^>]+>/g,' ').slice(0,200),'|',JSON.stringify(t.inputs.map(i=>i.answer)))}"
```
`pkill` NICHT verwenden.

## Abschlussbericht (kurz)
Je Modul: Titel, Generatoren, Ergebnis test_module (Anzahl Aufgaben, 0 Fehler), e2e S und E (Fortschritt, Fehler), gefundene und behobene Probleme, offene Punkte.

## Hinweis zum Browser-Durchlauf (e2e.py)
Der Durchlauf bedient „Ausprobieren“ automatisch so: Jedes `<select>` wird zweimal weitergeschaltet, jeder `<input type=range>` dreimal um `step` erhöht (Ereignis `input`), jeder `<button>` im Bereich zweimal geklickt. Dein `entdecken.init` muss dabei `done()` auslösen, sonst fehlt ein Pflichtschritt. Achte darauf, dass `value + 3*step` innerhalb von min/max liegt.
Der Durchlauf füllt alle Aufgaben mit der hinterlegten Lösung (`answer`) und erwartet „Richtig“. Bei `frac` wird `M.fstr(answer)` eingegeben, bei `num` die Zahl mit Komma, bei `term` der `answer`-String, bei `mc` der Index.
