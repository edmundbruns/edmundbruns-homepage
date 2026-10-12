"""Erzeugt mathe/klasse-8/index.html aus dem Modulplan (Vorlage: Seite Klasse 7)."""
import os, re, html as H
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', 'upload'))

PLAN = [
  ('Brüche und Terme', [
    ('001', 'Bruchrechnung', 'Brüche multiplizieren', 'Du verstehst „Anteil vom Anteil“ am Rechteck und multiplizierst Brüche, auch mit gemischten Zahlen.'),
    ('002', 'Bruchrechnung', 'Brüche dividieren', 'Du teilst Brüche durch natürliche Zahlen und durch Brüche und nutzt den Kehrwert.'),
    ('003', 'Klammern', 'Klammerterme: ausmultiplizieren und ausklammern', 'Du nutzt das Distributivgesetz in beide Richtungen, auch mit Minuszeichen.'),
    ('004', 'Klammern', 'Summen multiplizieren', 'Du multiplizierst zwei Klammern miteinander und fasst das Ergebnis zusammen.'),
    ('005', 'Binomische Formeln', 'Binomische Formeln', 'Du erkennst und nutzt die drei binomischen Formeln, auch zum Kopfrechnen.'),
  ]),
  ('Gleichungen', [
    ('006', 'Gleichungen', 'Gleichungen mit Klammern lösen', 'Du löst lineare Gleichungen, in denen Klammern vorkommen, und machst die Probe.'),
    ('007', 'Modellieren', 'Sachaufgaben mit Gleichungen', 'Du übersetzt Textaufgaben in Gleichungen und löst sie Schritt für Schritt.'),
  ]),
  ('Prozent und Zinsen', [
    ('008', 'Zinsen', 'Zinsrechnung: Jahreszinsen', 'Du berechnest Zinsen, Kapital und Zinssatz mit dem Dreisatz und mit Formeln.'),
    ('009', 'Zinsen', 'Zinsen für Monate und Tage', 'Du berechnest Zinsen für kürzere Zeiträume und vergleichst Angebote.'),
  ]),
  ('Lineare Funktionen', [
    ('010', 'Funktionen', 'Lineare Funktionen erkennen', 'Du unterscheidest proportionale, lineare und nicht lineare Zusammenhänge.'),
    ('011', 'Steigung', 'Steigung und y-Achsenabschnitt', 'Du liest m und b am Graphen ab und stellst Funktionsgleichungen auf.'),
    ('012', 'Nullstelle', 'Nullstellen und Schnittpunkte', 'Du berechnest, wo eine Gerade die Achsen schneidet und wo sich zwei Geraden treffen.'),
    ('013', 'Zeichnen', 'Geraden zeichnen', 'Du zeichnest Geraden mit Steigungsdreieck und Wertetabelle sicher ins Koordinatensystem.'),
    ('014', 'Modellieren', 'Lineare Modelle im Alltag', 'Du beschreibst Tarife, Füllvorgänge und Bewegungen mit linearen Funktionen.'),
  ]),
  ('Dreiecke und Konstruktionen', [
    ('015', 'Dreiecke', 'Dreiecksarten', 'Du ordnest Dreiecke nach Seiten und Winkeln und kennst ihre Eigenschaften.'),
    ('016', 'Winkel', 'Winkelsumme im Dreieck und Viereck', 'Du begründest den Winkelsummensatz und berechnest fehlende Winkel.'),
    ('017', 'Konstruieren', 'Dreiecke konstruieren', 'Du konstruierst Dreiecke mit den Kongruenzsätzen und einer Planfigur.'),
    ('018', 'Konstruieren', 'Mittelsenkrechte und Umkreis', 'Du konstruierst Mittelsenkrechten und findest den Umkreismittelpunkt.'),
    ('019', 'Konstruieren', 'Winkelhalbierende und Inkreis', 'Du konstruierst Winkelhalbierende und den Inkreis eines Dreiecks.'),
    ('020', 'Thales', 'Satz des Thales', 'Du entdeckst den Satz des Thales und nutzt ihn zum Konstruieren rechter Winkel.'),
    ('021', 'Abbildungen', 'Punktspiegelung und Drehung', 'Du erzeugst Figuren und Muster durch Punktspiegelung und Drehung.'),
  ]),
  ('Flächen und Prismen', [
    ('022', 'Vierecke', 'Haus der Vierecke', 'Du ordnest Vierecke nach ihren Eigenschaften und Symmetrien.'),
    ('023', 'Flächen', 'Parallelogramm, Dreieck und Trapez', 'Du leitest Flächenformeln durch Zerlegen her und berechnest Flächeninhalte.'),
    ('024', 'Flächen', 'Zusammengesetzte Figuren', 'Du zerlegst und ergänzt Figuren und berechnest Umfang und Flächeninhalt.'),
    ('025', 'Prismen', 'Prismen: Netz und Oberfläche', 'Du zeichnest Netze und Schrägbilder und berechnest die Oberfläche von Prismen.'),
    ('026', 'Prismen', 'Prismen: Volumen', 'Du berechnest das Volumen von Prismen mit V = G · h.'),
  ]),
  ('Daten und Zufall', [
    ('027', 'Daten', 'Relative Häufigkeit und Kreisdiagramme', 'Du wertest Erhebungen mit relativen Häufigkeiten aus und zeichnest Kreisdiagramme.'),
    ('028', 'Zufall', 'Baumdiagramme', 'Du stellst zweistufige Zufallsexperimente im Baumdiagramm dar.'),
    ('029', 'Zufall', 'Produktregel', 'Du berechnest Wahrscheinlichkeiten mehrstufiger Experimente mit der Produktregel.'),
  ]),
]

def card(mid, tag, title, desc):
    ready = os.path.exists(os.path.join(HERE, 'modules', mid + '.js'))
    link = (f'<div class="links"><a class="btn" href="{mid}/index.html">Modul öffnen</a></div>' if ready
            else '<div class="links"><span class="tag plain">in Arbeit</span></div>')
    cls = 'card accent-top' + ('' if ready else ' is-planned')
    return (f'<article class="{cls}"><div class="tags"><span class="badge">Modul {mid}</span><span class="tag plain">{H.escape(tag)}</span>'
            + ('<span class="tag" style="background:#ede7fb;color:#3d2a73">neu</span>' if ready else '') +
            f'</div><h3>{H.escape(title)}</h3><p>{H.escape(desc)}</p>{link}</article>')

def build():
    k7 = open(os.path.join(ROOT, 'mathe', 'klasse-7', 'index.html'), encoding='utf-8').read()
    head, rest = k7.split('<section class="section">', 1)
    foot = '</main>' + rest.split('</main>', 1)[1]
    ready = sum(1 for _, ms in PLAN for m in ms if os.path.exists(os.path.join(HERE, 'modules', m[0] + '.js')))
    total = sum(len(ms) for _, ms in PLAN)
    head = re.sub(r'<!-- Mirrored from.*?-->\n?', '', head)
    head = head.replace('Mathematik Klasse 7 · SOL-Module', 'Mathematik Klasse 8 · SOL-Module')
    head = re.sub(r'(<meta (?:name|property)="(?:og:)?description" content=")[^"]*"',
                  r'\1SOL-Lernmodule Mathematik für Klasse 8 der Oberschule Niedersachsen: Bruchrechnung, Klammerterme, Zinsen, lineare Funktionen, Dreiecke, Prismen und Baumdiagramme."', head)
    head = head.replace('/mathe/klasse-7/', '/mathe/klasse-8/')
    head = head.replace('<a href="index.html" class="active" aria-current="page">Klasse 7</a>', '<a href="../klasse-7/index.html">Klasse 7</a>')
    head = head.replace('<a href="../klasse-8/index.html">Klasse 8</a>', '<a href="index.html" class="active" aria-current="page">Klasse 8</a>')
    head = head.replace('Klasse 7 &middot; Oberschule Niedersachsen', 'Klasse 8 &middot; Oberschule Niedersachsen')
    head = head.replace('<em>Klasse 7</em>', '<em>Klasse 8</em>')
    head = re.sub(r'<p class="lead">.*?</p>', (f'<p class="lead">Klasse 8 baut auf Klasse 7 auf und vervollständigt den Doppeljahrgang 7/8 nach dem Kerncurriculum. Alle {total} Module sind fertig. Jedes Modul hat neue Aufgaben bei jedem Versuch, Tipps in Stufen und eine Rückmeldung an deine Lehrkraft.</p>' if ready == total else f'<p class="lead">Klasse 8 baut auf Klasse 7 auf und vervollständigt den Doppeljahrgang 7/8 nach dem Kerncurriculum. {ready} von {total} Modulen sind fertig, weitere folgen. Jedes Modul hat neue Aufgaben bei jedem Versuch, Tipps in Stufen und eine Rückmeldung an deine Lehrkraft.</p>'), head, count=1, flags=re.S)
    head = re.sub(r'<div[^>]*>\s*<a href="index.html" class="on".*?Lernpfad &rarr;</a>\s*</div>', '', head, flags=re.S)
    body = '<section class="section">\n      <div class="shell">\n'
    body += '<div class="callout" style="background:#efeafb;border:1px solid #d6cdf0;border-radius:14px;padding:14px 18px;margin:0 0 22px"><strong>So arbeitest du:</strong> Öffne ein Modul, gib deinen Lerncode (Anfangsbuchstaben von Vor- und Nachname, zum Beispiel MS), deine Klasse und deine IServ-Adresse ein und tippe auf „Start“. Am Ende sendest du dein Ergebnis an deine Lehrkraft.</div>\n'
    for group, mods in PLAN:
        body += f'        <h3 class="subhead">{H.escape(group)}</h3>\n        <div class="cards">\n' + '\n'.join('          ' + card(*m) for m in mods) + '\n        </div>\n'
    body += '''
        <p class="mini" style="margin-top:22px">Die Themenfolge orientiert sich am Kerncurriculum Mathematik für die Realschule in Niedersachsen (Doppeljahrgang 7/8), das an Oberschulen ab Klasse 7 gilt. Sie kann an den schulinternen Arbeitsplan angepasst werden.</p>
        <div class="nextprev">
          <a href="../klasse-7/index.html">&larr; Klasse 7</a>
          <a href="../klasse-9/index.html">Klasse 9 &rarr;</a>
        </div>
      </div>
    </section>
  '''
    out = head + body + foot
    out = out.replace('<style>', '<style>.is-planned{opacity:.72}.is-planned h3{color:#5a5670}', 1) if '<style>' in out else out
    path = os.path.join(ROOT, 'mathe', 'klasse-8', 'index.html')
    open(path, 'w', encoding='utf-8').write(out)
    print('Übersicht Klasse 8:', ready, 'von', total, 'Modulen fertig')

if __name__ == '__main__':
    build()
