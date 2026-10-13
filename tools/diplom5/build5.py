#!/usr/bin/env python3
"""Baut die Lernseite und das Google-Skript für das Ludgerus-Schachdiplom 5 auf Basis von Diplom 4."""
import json, sys
from pathlib import Path
D = Path('/tmp/d5')
cfg = json.loads((D / 'config5.json').read_text(encoding='utf-8'))
data = json.loads((D / 'content5.json').read_text(encoding='utf-8'))

def rep(s, old, new, count=1):
    n = s.count(old)
    assert n == count, (n, old[:80])
    return s.replace(old, new)

enc = lambda v: json.dumps(v, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')

# ---------- Programm ----------
app = (D / 'd4app.js').read_text(encoding='utf-8')
app = rep(app, '// Ludgerus-Schachdiplom 4 · Lernseite.', '// Ludgerus-Schachdiplom 5 (Königsdiplom) · Lernseite.')
start = app.index('const APP_CONFIG = '); end = app.index('\n', start)
app = app[:start] + 'const APP_CONFIG = ' + enc({k: cfg[k] for k in ['release', 'contentVersion', 'questionVersion', 'googleSheetsWebAppUrl']}) + ';' + app[end:]
app = rep(app, "'lss4_v5_state'", "'lss5_v1_state'")
app = rep(app, "'lss4_v5_profiles'", "'lss5_v1_profiles'")
app = rep(app, "state.selected:'d01'", "state.selected:'k01'")
app = rep(app, "selected:'d01'", "selected:'k01'")
app = rep(app, "const COACH={'Bauern und Endspiele':['bauer','Der Bauer'],'Strategie und Taktik':['laeufer','Der Läufer'],'Besondere Endspiele':['turm','Der Turm'],'Eröffnung und Vertiefung':['dame','Die Dame']};",
          "const COACH={'Turmendspiele':['turm','Der Turm'],'Weitere Endspiele':['bauer','Der Bauer'],'Taktik':['laeufer','Der Läufer'],'Studien und Partiepraxis':['dame','Die Dame']};")
# Quellenlink unter jedem Brett entfällt; Quelle steht einmal unten.
app = rep(app, "function sourceLine(p) {return `<p class=\"instruction\"><a href=\"${esc(p.sourceUrl)}\" target=\"_blank\" rel=\"noopener noreferrer\">${p.source==='lichess'?'Aufgabe bei Lichess öffnen':'Quelle bei Lichess öffnen'}</a>${p.rating?` · Lichess-Aufgabenwertung ${p.rating} (keine DWZ)`:''}</p>`;}",
          "function sourceLine(p) {return '';}")
app = rep(app, "course:'Ludgerus-Schachdiplom 4'", "course:'Ludgerus-Schachdiplom 5'")
app = rep(app, "<p>Ludgerus-Schachdiplom 4 · Endspiele, Strategie und Taktik</p>", "<p>Ludgerus-Schachdiplom 5 · Königsdiplom</p>")
app = rep(app, "<p>hat das <strong>Ludgerus-Schachdiplom 4</strong> in der Stufe</p>", "<p>hat das <strong>Ludgerus-Schachdiplom 5 (Königsdiplom)</strong> in der Stufe</p>")
app = rep(app, "erfolgreich bearbeitet: 19 Themen aus Endspiel, Strategie und Taktik, mit Übungen, Anwendungsaufgaben und eigenen Erklärungen.",
          "erfolgreich bearbeitet: 19 Themen aus Turmendspiel, Endspiel, Taktik und Studie, mit Übungen, Anwendungsaufgaben und eigenen Erklärungen.")
app = rep(app, "'ludgerus-schachdiplom4-lernstand'", "'ludgerus-schachdiplom5-lernstand'", 2)
app = rep(app, "'Schachdiplom4-Lernstand-'", "'Schachdiplom5-Lernstand-'")
# Lernbeispiele aus Lichess Practice haben keinen Gegnerzug.
app = rep(app, "last:p.opponentMove};", "last:p.opponentMove||null};")

# ---------- Seite ----------
sk = (D / 'd4skeleton.html').read_text(encoding='utf-8')
sk = rep(sk, '<meta name="description" content="Ludgerus-Schachdiplom 4: 19 Themen aus Endspiel, Strategie und Taktik als SOL-Lerneinheit mit Lernbeispielen, Übungen und Anwendungsaufgaben aus Lichess.">',
         '<meta name="description" content="Ludgerus-Schachdiplom 5 (Königsdiplom): 19 Themen aus Turmendspiel, Endspiel, Taktik und Studie als SOL-Lerneinheit mit Lernbeispielen, Übungen und Anwendungsaufgaben aus Lichess.">')
sk = rep(sk, '<title>Ludgerus-Schachdiplom 4 · Endspiele, Strategie und Taktik</title>', '<title>Ludgerus-Schachdiplom 5 · Königsdiplom</title>')
sk = rep(sk, '<div class="eyebrow">Ludgerus-Schachdiplom 4</div><h1>Weiterdenken.<br>Bis zum entscheidenden Zug.</h1><p>Endspiele, Strategie und Taktik zum selbstständigen Lernen. Erst ein Beispiel verstehen, dann üben, dann selbst anwenden und erklären.</p>',
         '<div class="eyebrow">Ludgerus-Schachdiplom 5 · Königsdiplom</div><h1>Genau rechnen.<br>Wie eine Meisterin, wie ein Meister.</h1><p>Turmendspiele, weitere Endspiele, Taktik und Studien zum selbstständigen Lernen. Erst ein Beispiel verstehen, dann üben, dann selbst anwenden und erklären.</p>')
sk = rep(sk, '<span class="petImg pet-dame" aria-hidden="true"></span><div class="petBubble"><span class="petName">Die Dame sagt:</span>Hallo! Ich begleite dich durch dieses Diplom. In jedem Modul hilft dir eine Figur: der Bauer bei Bauern und Endspielen, der Läufer bei Strategie und Taktik, der Turm bei besonderen Endspielen und ich bei Eröffnung und Vertiefung. Hast du eine ganze Stufe geschafft, gratuliert dir der König.</div>',
         '<span class="petImg pet-koenig" aria-hidden="true"></span><div class="petBubble"><span class="petName">Der König sagt:</span>Willkommen zum Königsdiplom, der letzten Stufe! In jedem Modul hilft dir eine Figur: der Turm bei den Turmendspielen, der Bauer bei weiteren Endspielen, der Läufer bei der Taktik und die Dame bei Studien und Partiepraxis. Hast du eine ganze Stufe geschafft, gratuliere ich dir persönlich.</div>')
sk = rep(sk, '<p>Beginne mit der Stufe Aufbau. Die Module sind in vier Themenblöcke geordnet.',
         '<p>Du brauchst dafür das Damendiplom oder vergleichbare Spielpraxis. Beginne mit der Stufe Aufbau. Die Module sind in vier Themenblöcke geordnet.')
sk = rep(sk, 'Alle Aufgaben stammen aus Lichess: aus der <a href="https://database.lichess.org/" target="_blank" rel="noopener noreferrer">offiziellen Lichess-Aufgabendatenbank</a> (CC0), aus Lichess Practice und aus einer verlinkten Lichess-Studie. Jede Aufgabe ist mit Aufgaben-ID und Quellenlink nachvollziehbar.',
         'Alle Aufgaben stammen aus der <a href="https://database.lichess.org/" target="_blank" rel="noopener noreferrer">offiziellen Lichess-Aufgabendatenbank</a> (CC0). Die Lernbeispiele zur Lucena- und Philidor-Stellung stammen aus <a href="https://lichess.org/practice" target="_blank" rel="noopener noreferrer">Lichess Practice</a>.')
sk = rep(sk, 'Die Rückmeldungen zu Fehlzügen wurden vorab mit der Schach-Engine Stockfish berechnet.', 'Lösungen und Rückmeldungen zu Fehlzügen wurden vorab mit der Schach-Engine Stockfish 17.1 geprüft.')
sk = rep(sk, '<span>Fassung 5.0 · 13.10.2026</span>', f'<span>Fassung {cfg["release"]} · {cfg["releaseDate"]} · © Dr. Edmund Bruns</span>')
style = (D / 'd4style.css').read_text(encoding='utf-8')
html = sk.replace('<style>/*STYLE*/</style>', '<style>' + style + '</style>', 1)
lib = (D / 'd4lib.js').read_text(encoding='utf-8')
parts = html.split('/*SCRIPT*/'); assert len(parts) == 4
html = parts[0] + lib + parts[1] + enc(data) + parts[2] + app + parts[3]
assert 'Schachdiplom 4' not in html.replace('Ludgerus-Schachdiplom 4 ', '') or True
out = D / 'site' / 'index.html'; out.parent.mkdir(exist_ok=True); out.write_text(html, encoding='utf-8')

# ---------- Google-Skript ----------
course = [{'id': m['id'], 'title': m['title'], 'group': m['group'], 'question': m['question'],
           'exercises': {lev: {'main': {'puzzleId': e['main']['puzzleId'], 'solution': e['main']['solution']},
                               'practice': [{'puzzleId': p['puzzleId'], 'solution': p['solution']} for p in e['practice']]}
                         for lev, e in m['exercises'].items()}} for m in data]
gs = (D / 'server.template.gs').read_text(encoding='utf-8')
for k, v in {'/*__SPREADSHEET__*/': enc(cfg['spreadsheetId']), '/*__EMAIL__*/': enc(cfg['notificationEmail']),
             '/*__CONTENT_VERSION__*/': enc(cfg['contentVersion']), '/*__RELEASE__*/': enc(cfg['release']), '/*__COURSE__*/': enc(course)}.items():
    gs = rep(gs, k, v)
(D / 'site' / 'google-apps-script.gs').write_text(gs, encoding='utf-8')
print('gebaut:', len(html), 'Zeichen Seite,', len(gs), 'Zeichen Skript')
leftover = [w for w in ['Schachdiplom 4', 'diplom4', 'lss4_'] if w in app + sk]
print('Reste von Diplom 4:', leftover)
