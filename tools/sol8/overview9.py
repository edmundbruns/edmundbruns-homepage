"""Erzeugt mathe/klasse-9/index.html aus dem Modulplan (Vorlage: Seite Klasse 7)."""
import os, re, html as H
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', 'upload'))

PLAN = [
  ('Lineare Gleichungssysteme', [
    ('001', 'Gleichungssysteme', 'Lineare Gleichungssysteme verstehen', 'Du erkennst, was zwei Gleichungen mit zwei Variablen bedeuten, und löst sie durch Probieren und mit einer Tabelle.'),
    ('002', 'Grafisch', 'Gleichungssysteme grafisch lösen', 'Du zeichnest zwei Geraden und liest den Schnittpunkt ab. Du erkennst, wann es keine oder unendlich viele Lösungen gibt.'),
    ('003', 'Rechnerisch', 'Gleichsetzungsverfahren', 'Du löst Gleichungssysteme, indem du zwei Terme gleichsetzt.'),
    ('004', 'Rechnerisch', 'Einsetzungsverfahren', 'Du setzt eine Gleichung in die andere ein und löst Schritt für Schritt.'),
    ('005', 'Rechnerisch', 'Additionsverfahren', 'Du addierst oder subtrahierst Gleichungen, sodass eine Variable wegfällt.'),
    ('006', 'Modellieren', 'Sachaufgaben mit Gleichungssystemen', 'Du übersetzt Alltagsfragen in zwei Gleichungen und findest die Lösung.'),
  ]),
  ('Zahlen und Größen', [
    ('007', 'Wurzeln', 'Quadratwurzeln und reelle Zahlen', 'Du ziehst Quadratwurzeln, schätzt sie ab und lernst irrationale Zahlen kennen.'),
    ('008', 'Potenzen', 'Zehnerpotenzen', 'Du schreibst sehr große und sehr kleine Zahlen mit Zehnerpotenzen und rechnest damit.'),
    ('009', 'Größen', 'Vorsilben und Größen', 'Du nutzt Vorsilben wie Kilo, Mega, Milli und Mikro und rechnest Größen um.'),
  ]),
  ('Quadratische Funktionen und Gleichungen', [
    ('010', 'Parabeln', 'Die Normalparabel', 'Du lernst die Funktion y = x² kennen, ihre Form, ihren Scheitelpunkt und ihre Symmetrie.'),
    ('011', 'Parabeln', 'Parabeln verschieben', 'Du verschiebst die Normalparabel und beschreibst sie mit der Scheitelpunktform.'),
    ('012', 'Parabeln', 'Parabeln strecken und spiegeln', 'Du untersuchst, wie der Faktor a die Parabel streckt, staucht oder öffnet.'),
    ('013', 'Formen', 'Scheitelpunktform und allgemeine Form', 'Du wechselst mit der quadratischen Ergänzung zwischen beiden Formen.'),
    ('014', 'Gleichungen', 'Einfache quadratische Gleichungen', 'Du löst Gleichungen wie x² = 49 oder x(x − 3) = 0.'),
    ('015', 'Gleichungen', 'Die p-q-Formel', 'Du löst quadratische Gleichungen mit der p-q-Formel.'),
    ('016', 'Gleichungen', 'Anzahl der Lösungen', 'Du erkennst grafisch und rechnerisch, ob eine quadratische Gleichung zwei, eine oder keine Lösung hat.'),
    ('017', 'Modellieren', 'Quadratische Funktionen im Alltag', 'Du beschreibst Brückenbögen, Würfe und Flächen mit quadratischen Funktionen.'),
  ]),
  ('Ähnlichkeit und Pythagoras', [
    ('018', 'Ähnlichkeit', 'Zentrische Streckung', 'Du vergrößerst und verkleinerst Figuren mit einem Streckzentrum und einem Faktor.'),
    ('019', 'Ähnlichkeit', 'Ähnliche Figuren', 'Du erkennst ähnliche Figuren und berechnest fehlende Längen mit dem Streckfaktor.'),
    ('020', 'Strahlensätze', 'Strahlensätze', 'Du berechnest Längen in Strahlensatzfiguren und im Gelände.'),
    ('021', 'Pythagoras', 'Der Satz des Pythagoras', 'Du entdeckst und begründest den Satz des Pythagoras und berechnest Seiten im rechtwinkligen Dreieck.'),
    ('022', 'Pythagoras', 'Pythagoras in Figuren und Körpern', 'Du findest rechtwinklige Dreiecke in Rechtecken, Dreiecken und Quadern und berechnest Längen.'),
    ('023', 'Pythagoras', 'Pythagoras im Alltag', 'Du löst Sachaufgaben zu Leitern, Bildschirmen, Rampen und Entfernungen.'),
  ]),
  ('Kreis und Zylinder', [
    ('024', 'Kreis', 'Kreisumfang und die Zahl π', 'Du entdeckst π und berechnest Umfang, Durchmesser und Radius.'),
    ('025', 'Kreis', 'Kreisfläche', 'Du leitest die Formel für die Kreisfläche her und berechnest Flächen.'),
    ('026', 'Kreis', 'Kreisring und Kreisausschnitt', 'Du berechnest Flächen und Bögen von Kreisringen und Kreisausschnitten.'),
    ('027', 'Zylinder', 'Zylinder: Oberfläche und Volumen', 'Du berechnest Mantel, Oberfläche und Volumen von Zylindern.'),
  ]),
  ('Daten und Zufall', [
    ('028', 'Daten', 'Daten und Grafiken in Medien beurteilen', 'Du erkennst irreführende Grafiken und nicht repräsentative Umfragen.'),
    ('029', 'Kombinatorik', 'Zählen mit dem Baumdiagramm', 'Du bestimmst mit Baumdiagramm und Zählprinzip, wie viele Möglichkeiten es gibt.'),
    ('030', 'Zufall', 'Mehrstufige Zufallsexperimente', 'Du berechnest Wahrscheinlichkeiten bei drei- und mehrstufigen Experimenten.'),
  ]),
]

def card(mid, tag, title, desc):
    ready = os.path.exists(os.path.join(HERE, 'modules9', mid + '.js'))
    link = (f'<div class="links"><a class="btn" href="{mid}/index.html">Modul öffnen</a></div>' if ready
            else '<div class="links"><span class="tag plain">in Arbeit</span></div>')
    cls = 'card accent-top' + ('' if ready else ' is-planned')
    return (f'<article class="{cls}"><div class="tags"><span class="badge">Modul {mid}</span><span class="tag plain">{H.escape(tag)}</span>'
            + ('<span class="tag" style="background:#e8eefc;color:#1e3a8a">neu</span>' if ready else '') +
            f'</div><h3>{H.escape(title)}</h3><p>{H.escape(desc)}</p>{link}</article>')

def build():
    k7 = open(os.path.join(ROOT, 'mathe', 'klasse-7', 'index.html'), encoding='utf-8').read()
    head, rest = k7.split('<section class="section">', 1)
    foot = '</main>' + rest.split('</main>', 1)[1]
    ready = sum(1 for _, ms in PLAN for m in ms if os.path.exists(os.path.join(HERE, 'modules9', m[0] + '.js')))
    total = sum(len(ms) for _, ms in PLAN)
    head = re.sub(r'<!-- Mirrored from.*?-->\n?', '', head)
    head = head.replace('Mathematik Klasse 7 · SOL-Module', 'Mathematik Klasse 9 · SOL-Module')
    head = re.sub(r'(<meta (?:name|property)="(?:og:)?description" content=")[^"]*"',
                  r'\1SOL-Lernmodule Mathematik für Klasse 9 der Oberschule Niedersachsen: Gleichungssysteme, Wurzeln, Zehnerpotenzen, quadratische Funktionen, Pythagoras, Kreis und Zylinder, mehrstufige Zufallsexperimente."', head)
    head = head.replace('/mathe/klasse-7/', '/mathe/klasse-9/')
    head = head.replace('<a href="index.html" class="active" aria-current="page">Klasse 7</a>', '<a href="../klasse-7/index.html">Klasse 7</a>')
    head = head.replace('<a href="../klasse-9/index.html">Klasse 9</a>', '<a href="index.html" class="active" aria-current="page">Klasse 9</a>').replace('<a href="../klasse-8/index.html">Klasse 8</a>', '<a href="../klasse-8/index.html">Klasse 8</a>')
    head = head.replace('Klasse 7 &middot; Oberschule Niedersachsen', 'Klasse 9 &middot; Oberschule Niedersachsen')
    head = head.replace('<em>Klasse 7</em>', '<em>Klasse 9</em>')
    head = re.sub(r'<p class="lead">.*?</p>', (f'<p class="lead">Klasse 9 startet in den Doppeljahrgang 9/10 nach dem Kerncurriculum. Alle {total} Module sind fertig. Jedes Modul hat neue Aufgaben bei jedem Versuch, Tipps in Stufen und eine Rückmeldung an deine Lehrkraft.</p>' if ready == total else f'<p class="lead">Klasse 9 startet in den Doppeljahrgang 9/10 nach dem Kerncurriculum. {ready} von {total} Modulen sind fertig, weitere folgen. Jedes Modul hat neue Aufgaben bei jedem Versuch, Tipps in Stufen und eine Rückmeldung an deine Lehrkraft.</p>'), head, count=1, flags=re.S)
    head = re.sub(r'<div[^>]*>\s*<a href="index.html" class="on".*?Lernpfad &rarr;</a>\s*</div>', '', head, flags=re.S)
    body = '<section class="section">\n      <div class="shell">\n'
    body += '<div class="callout" style="background:#e8eefc;border:1px solid #cdd9f3;border-radius:14px;padding:14px 18px;margin:0 0 22px"><strong>So arbeitest du:</strong> Öffne ein Modul, gib deinen Lerncode (Anfangsbuchstaben von Vor- und Nachname, zum Beispiel MS), deine Klasse und deine IServ-Adresse ein und tippe auf „Start“. Am Ende sendest du dein Ergebnis an deine Lehrkraft.</div>\n'
    for group, mods in PLAN:
        body += f'        <h3 class="subhead">{H.escape(group)}</h3>\n        <div class="cards">\n' + '\n'.join('          ' + card(*m) for m in mods) + '\n        </div>\n'
    body += '''
        <p class="mini" style="margin-top:22px">Die Themenfolge orientiert sich am Kerncurriculum Mathematik für die Realschule in Niedersachsen (Doppeljahrgang 9/10), das an Oberschulen ab Klasse 7 gilt. Sie kann an den schulinternen Arbeitsplan angepasst werden.</p>
        <div class="nextprev">
          <a href="../klasse-8/index.html">&larr; Klasse 8</a>
          <a href="../klasse-10/index.html">Klasse 10 &rarr;</a>
        </div>
      </div>
    </section>
  '''
    out = head + body + foot
    out = out.replace('<style>', '<style>.is-planned{opacity:.72}.is-planned h3{color:#5a5670}', 1) if '<style>' in out else out
    path = os.path.join(ROOT, 'mathe', 'klasse-9', 'index.html')
    open(path, 'w', encoding='utf-8').write(out)
    print('Übersicht Klasse 9:', ready, 'von', total, 'Modulen fertig')

if __name__ == '__main__':
    build()
