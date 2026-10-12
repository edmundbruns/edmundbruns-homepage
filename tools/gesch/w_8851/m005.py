# -*- coding: utf-8 -*-
from common import *

m = Modul("005", "Warum wurden Menschen sesshaft?", "Sesshaftigkeit",
          "Frühe Menschen und Hochkulturen · Zeitreise 005",
          "Hunderttausende Jahre lang zogen Menschen umher. Dann begannen sie, Felder anzulegen, Tiere zu halten und feste Häuser zu bauen. Warum taten sie das? In diesem Modul verfolgst du den Weg des Ackerbaus vom Vorderen Orient bis ins Emsland.",
          "Weiter geht es mit Modul 006: Wie veränderten Ackerbau und Viehzucht das Zusammenleben?",
          badges=[dict(id="abz1", name="Ursachenforscherin", tasks=["kette"]),
                  dict(id="abz2", name="Kartenleser", tasks=["ausbreitung"]),
                  dict(id="abz3", name="Steinkundige", tasks=["s1", "s2"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])],
          bereich="Frühe Menschen und Hochkulturen")

# ---------- Karte: Ausbreitung des Ackerbaus ----------
K = 8.19; KX = K * 0.74
def P(lon, lat):
    return (round((lon + 10) * KX, 1), round((56 - lat) * K, 1))
def poly(pts):
    return 'M' + ' L'.join(f'{x} {y}' for x, y in (P(*p) for p in pts)) + ' Z'
SEAS = [
 # Atlantik und Biskaya
 [(-10,26),(-13,26),(-13,57),(-10,57),(-10,51.4),(-6,52.2),(-6.2,54),(-8,55.2),(-10,54.4),(-10,51.4),(-10,43.5),(-8,43.7),(-4,43.4),(-1.8,43.4),(-1.2,46),(-2.5,47.3),(-4.6,48),(-4.8,48.6),(-1.5,48.7),(-1.6,49.7),(0.2,49.6),(1.6,50.9),(2.5,51.1),(3.6,51.4),(4.3,52.2),(4.8,53),(6.5,53.5),(8.5,53.7),(8.7,54.5),(8.1,55.5),(8.3,56.5),(-10,56.5),(-10,51.4)],
 [(-10,43.5),(-8,43.7),(-8.9,42.9),(-8.8,41),(-9.5,38.7),(-8.9,37),(-7.4,37.2),(-6.4,36.8),(-5.6,36),(-5.9,35.8),(-6.8,34),(-8.5,33.3),(-9.6,30.4),(-9.8,29.5),(-11,28),(-13,27),(-13,44),(-10,44)],
 # Mittelmeer
 [(-5.6,36),(-4.4,36.7),(-2,36.8),(-0.5,38.3),(0.2,39.5),(-0.3,39.9),(0.9,41),(3.2,41.9),(3.1,43),(4.5,43.4),(6.5,43.1),(8,43.9),(9,44.4),(10.2,43.9),(11,42.6),(12.3,41.7),(14,41),(15.6,40),(16,38.8),(15.6,38),(16.1,38),(17.1,39),(18.5,40.1),(16.5,41.3),(14.2,42.4),(12.4,44.2),(12.3,45.4),(13.7,45.7),(15,44.6),(17.5,43),(19.4,41.9),(19.4,40.4),(21,38.5),(21.7,36.8),(23.1,36.4),(22.9,37.6),(24,38.2),(22.6,40.3),(23.7,40.2),(24.4,40.9),(26,40.8),(26.3,40.1),(27,38.5),(27.3,37.4),(28.3,36.8),(30.6,36.8),(32.5,36.1),(34.6,36.8),(36,36.6),(35.8,34.6),(35,33),(34.3,31.3),(32.3,31.2),(30,31.3),(28,30.9),(25,31.7),(23,32.6),(20.1,32.2),(19.2,30.3),(17,31.1),(15.3,32.3),(11.2,33.2),(10.1,34.3),(11.1,35.2),(10.4,36.7),(9.8,37.3),(8,36.9),(3,36.8),(-1,35.6),(-2.9,35.2),(-5.4,35.9)],
 # Schwarzes Meer
 [(28,41.3),(28.6,43.4),(29.6,45.2),(30.8,46.5),(33,46),(33.5,45),(35.4,45.1),(36.5,45.3),(38.2,46.9),(39.3,47),(37.3,45),(39.6,43.6),(41.6,41.6),(40,41),(36.7,41.3),(35,42),(33.3,42),(31,41.1),(29.1,41.2)],
 # Kaspisches Meer
 [(47,44.4),(49.2,46.4),(51.5,46.9),(53,45.6),(51.3,44.4),(52.7,42.5),(52.6,41.1),(53.9,40.7),(53.9,37.3),(51.3,36.7),(49.3,37.6),(49,38.8),(49.6,40.5),(48.6,41.8),(47.5,43)],
 # Persischer Golf
 [(47.9,30),(48.7,29.9),(50.2,30.1),(50.8,29),(51.4,27.9),(53.5,26.6),(56,26.5),(56,26),(54.3,24.4),(52,24),(51.2,26.1),(50.2,25.9),(49.5,27.2),(48.4,28.5)],
 # Rotes Meer
 [(32.5,29.9),(33.5,28),(34.4,28),(34.9,29.5),(34.7,28),(35.8,26),(36.5,26),(34,26),(33.6,27.3)],
 # Ostsee
 [(10.5,56.6),(10.6,55.5),(10.9,54.4),(12.4,54.4),(14.2,53.9),(16.5,54.5),(18.6,54.4),(19.6,54.4),(21.1,55),(21.1,56.6)],
]
ISLANDS = [
 [(-5.7,50.1),(-3.5,50.4),(1.4,51.2),(1.7,52.7),(0.3,53.4),(-0.2,54.4),(-1.6,55.6),(-2.2,56.6),(-6,56.6),(-4.9,55),(-3,54.9),(-3.2,53.4),(-4.6,53.3),(-4.2,52.3),(-5.2,51.7),(-3.2,51.4),(-5.4,50.9)],
 [(-10,51.6),(-6,52.2),(-6.2,54),(-8,55.2),(-10,54.3)],
 [(8.1,56.6),(8.1,55.5),(8.6,54.9),(10,54.7),(10.9,55.9),(10.5,56.6)],
 [(23.5,35.3),(26.3,35.3),(26,35),(24,35)],
 [(32.3,35.1),(34.6,35.7),(33.9,34.6),(32.4,34.7)],
 [(12.4,38.1),(15.6,38.3),(15.1,36.7),(12.4,37.8)],
 [(8.4,40.9),(9.8,41),(9.6,39),(8.4,39)],
 [(8.6,42.9),(9.5,42.9),(9.4,41.4),(8.7,41.7)],
]
seas = ''.join(f'<path d="{poly(s)}" fill="#cfe3ee"/>' for s in SEAS)
isl = ''.join(f'<path d="{poly(s)}" fill="#efe6d2" stroke="#b7a98a" stroke-width="1"/>' for s in ISLANDS)
hx, hy = P(39, 35)
halb = ('M' + ' L'.join(f'{x} {y}' for x, y in (P(*p) for p in [(34.8,31.5),(35.8,34.5),(37,36.6),(39.5,37.3),(42.5,37.2),(44.5,35.6),(46.5,33.2),(48,31.2)])))
def ort(oid, name, lon, lat, label, dx, dy, anc, datum):
    x, y = P(lon, lat)
    return (f'<g id="{oid}" class="hot" data-task="ausbreitung" tabindex="0" role="button" aria-label="{name}">'
            f'<circle cx="{x}" cy="{y}" r="17" fill="#fff" fill-opacity=".01"/>'
            f'<circle cx="{x}" cy="{y}" r="7" fill="#fff" stroke="#8a4317" stroke-width="3"/><circle cx="{x}" cy="{y}" r="3" fill="#8a4317"/>'
            f'<text x="{x+dx}" y="{y+dy}" text-anchor="{anc}" font-size="14" font-weight="800" fill="#2a1c12" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">{label}</text>'
            + (f'<text x="{x+dx}" y="{y+dy+16}" text-anchor="{anc}" font-size="13" fill="#8a4317" font-weight="700" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">{datum}</text>' if datum else '')
            + '</g>')
ORTE = [("hHalbmond", "Fruchtbarer Halbmond", 39, 35.6, "Fruchtbarer Halbmond", 0, 40, "middle", "ab etwa 9500 v. Chr."),
        ("hAnatolien", "Anatolien, heute Türkei", 33, 39, "Anatolien", 0, -12, "middle", ""),
        ("hBalkan", "Griechenland und Balkan", 22, 41.5, "Balkan", -10, 4, "end", "um 6500 v. Chr."),
        ("hMittel", "Mitteleuropa", 13, 49.5, "Mitteleuropa", 10, 18, "start", "um 5500 v. Chr."),
        ("hEms", "Emsland", 7.3, 52.8, "Emsland", 11, -9, "start", "um 4000 v. Chr.")]
orte_svg = ''.join(ort(*o) for o in ORTE)
pfeil = ' '.join(f'{x},{y}' for x, y in (P(*p) for p in [(38,36.5),(33,38.6),(26,40.6),(21,43),(17,47.2),(13,49.5),(9,51.5),(7.6,52.6)]))
KARTE = f'''<div class="svgwrap"><svg class="pic" style="max-width:660px;margin:auto" viewBox="0 0 400 246" role="img" aria-label="Schematische Karte von Europa und dem Vorderen Orient. Der Ackerbau beginnt ab etwa 9500 vor Christus im Fruchtbaren Halbmond und breitet sich über Anatolien und den Balkan nach Mitteleuropa aus. Ins Emsland kommt er um 4000 vor Christus.">
<defs><marker id="pf5" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#aa6d18"/></marker></defs>
<rect width="400" height="246" fill="#efe6d2"/>
{seas}{isl}
<path d="{halb}" fill="none" stroke="#5f9a3a" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>
<polyline points="{pfeil}" fill="none" stroke="#aa6d18" stroke-width="3.5" stroke-dasharray="7 5" marker-end="url(#pf5)"/>
{orte_svg}
<text x="60" y="160" font-size="14" font-style="italic" fill="#4f7d99">Mittelmeer</text>
<text x="6" y="104" font-size="13" fill="#4f7d99" font-style="italic">Atlantik</text>
<text x="392" y="240" text-anchor="end" font-size="12" fill="#6a5a4c">Schematische Karte, Daten gerundet</text>
</svg></div>'''

# ---------- Langhaus ----------
LANGHAUS = '''<div class="svgwrap"><svg class="pic" style="max-width:620px;margin:auto" viewBox="0 0 400 220" role="img" aria-label="Zeichnung eines jungsteinzeitlichen Langhauses mit Strohdach und Lehmwänden, davor ein Getreidefeld, ein Rind und ein Mensch zum Größenvergleich.">
<rect width="400" height="220" fill="#eef3f6"/>
<path d="M0 150 H400 V220 H0Z" fill="#b9cf8f"/>
<path d="M40 150 L64 86 H336 L360 150 Z" fill="#d6b45e" stroke="#7a5a24" stroke-width="2.5"/>
<path d="M70 92 H330 M62 108 H340 M54 124 H348 M48 140 H354" stroke="#b8963e" stroke-width="1.5"/>
<rect x="60" y="150" width="280" height="36" fill="#c9a27a" stroke="#6e4a2a" stroke-width="2.5"/>
<path d="M100 150 V186 M140 150 V186 M180 150 V186 M220 150 V186 M260 150 V186 M300 150 V186" stroke="#6e4a2a" stroke-width="3"/>
<rect x="190" y="160" width="20" height="26" fill="#4a2a12"/>
<g stroke="#c9a96a" stroke-width="2"><path d="M10 212 v-18 M16 212 v-20 M22 212 v-17 M28 212 v-19 M34 212 v-18"/></g>
<g fill="#e0c070"><ellipse cx="10" cy="192" rx="2" ry="4"/><ellipse cx="16" cy="190" rx="2" ry="4"/><ellipse cx="22" cy="193" rx="2" ry="4"/><ellipse cx="28" cy="191" rx="2" ry="4"/><ellipse cx="34" cy="192" rx="2" ry="4"/></g>
<g fill="#7a4a2a"><ellipse cx="372" cy="196" rx="16" ry="9"/><path d="M386 192 l8 -4 l2 6 l-8 4Z"/><path d="M360 202 v10 M366 203 v10 M378 203 v10 M384 202 v10" stroke="#7a4a2a" stroke-width="3"/></g>
<circle cx="334" cy="196" r="4" fill="#e3b98f"/><path d="M330 212 L331 200 h6 L338 212Z" fill="#8a4317"/>
<g font-size="14" fill="#2a1c12" font-weight="700" paint-order="stroke" stroke="#eef3f6" stroke-width="4" stroke-linejoin="round">
<text x="200" y="74" text-anchor="middle">Dach aus Stroh oder Schilf</text>
<text x="200" y="22" text-anchor="middle" font-size="15">Langhaus, oft 20 bis 40 Meter lang</text></g>
<text x="190" y="206" text-anchor="middle" font-size="14" font-weight="700" fill="#2a1c12" paint-order="stroke" stroke="#b9cf8f" stroke-width="4">Wände aus Holz, Flechtwerk und Lehm</text>
</svg></div>'''

# ---------- Grosssteingrab ----------
GRAB = '''<div class="svgwrap"><svg class="pic" style="max-width:600px;margin:auto" viewBox="0 0 400 210" role="img" aria-label="Zeichnung eines Großsteingrabs: große Tragsteine stehen in einer Reihe, darauf liegen schwere Decksteine. Darunter ist die Grabkammer. Daneben steht ein Kind zum Größenvergleich.">
<rect width="400" height="210" fill="#eef3f6"/>
<path d="M0 160 H400 V210 H0Z" fill="#b9cf8f"/>
<g fill="#a59b8c" stroke="#4f4a44" stroke-width="2.5">
<path d="M70 160 q-4 -40 10 -50 q18 -4 22 10 q4 20 2 40Z"/><path d="M120 160 q-2 -44 12 -52 q18 0 20 14 q2 20 0 38Z"/>
<path d="M172 160 q-2 -46 14 -50 q16 2 18 16 q2 18 -2 34Z"/><path d="M222 160 q-4 -42 12 -50 q18 2 20 16 q0 18 -2 34Z"/>
<path d="M272 160 q-2 -40 12 -48 q16 2 18 14 q2 18 -2 34Z"/>
<path d="M64 112 q20 -34 96 -30 q30 6 28 26 q-50 10 -124 4Z" fill="#8f877b"/>
<path d="M176 108 q30 -36 110 -24 q24 10 18 26 q-60 8 -128 -2Z" fill="#8f877b"/>
</g>
<rect x="104" y="128" width="170" height="32" fill="#4a3a2a" opacity=".55"/>
<circle cx="340" cy="124" r="7" fill="#e3b98f" stroke="#5b2c0f" stroke-width="1.5"/><path d="M333 160 L334 134 h12 L347 160Z" fill="#8a4317"/>
<g font-size="17" font-weight="700" fill="#2a1c12" paint-order="stroke" stroke="#eef3f6" stroke-width="4" stroke-linejoin="round">
<text x="120" y="66" text-anchor="middle">Decksteine</text><text x="340" y="110" text-anchor="middle">Kind</text>
<text x="200" y="190" text-anchor="middle">Grabkammer zwischen den Tragsteinen</text></g>
<path d="M200 172 V150" stroke="#2a1c12" stroke-width="2"/>
</svg></div>'''

m.section("klima", "Die Welt wird wärmer", "Die Welt wird wärmer",
    '<p>Um 9700 v. Chr. ging die letzte Eiszeit zu Ende. Es wurde wärmer. In Europa wuchsen Wälder, Mammuts und Rentiere verschwanden aus unserer Gegend. Im <strong>Vorderen Orient</strong>, in den heutigen Ländern Türkei, Syrien, Irak, Israel und Jordanien, wuchsen nun viele wilde Getreidepflanzen. Diese Gegend nennt man wegen ihrer Form den <strong>Fruchtbaren Halbmond</strong>.</p>'
    + chronos("Stell dir vor, vor deiner Haustür wächst plötzlich jeden Sommer ein riesiges Feld mit wildem Getreide. Würdest du dann noch umherziehen? Ich jedenfalls würde mir einen gemütlichen Platz suchen und bleiben.")
    + m.order("kette",
        ["Die Eiszeit geht zu Ende, und es wird wärmer.",
         "Im Fruchtbaren Halbmond wächst viel wildes Getreide.",
         "Die Menschen sammeln die Körner und legen Vorräte an.",
         "Sie bleiben länger an einem Ort und säen selbst Körner aus.",
         "Aus Sammlern werden Bauern, die in festen Dörfern leben."],
        "Genau. Das ist die Ursache-Folge-Kette der Sesshaftigkeit: Das wärmere Klima brachte viel wildes Getreide. Wer Vorräte hatte, blieb, und wer blieb, konnte Felder anlegen. Daraus entstanden die ersten Dörfer.",
        "Frage dich bei jedem Schritt: Was musste vorher passiert sein?",
        "Ursache-Folge-Kette Sesshaftigkeit", ["ursachen_folgen"], tag="Ursache-Folge-Kette",
        intro='<p><strong>Auftrag:</strong> Bringe die Kette in die richtige Reihenfolge. Sie beginnt mit der Ursache und endet mit der Folge.</p>')
    + '<div class="notice"><strong>Gut zu wissen:</strong> Fachleute streiten bis heute, welche Ursache am wichtigsten war. Manche betonen das Klima, andere das Wachstum der Gruppen oder religiöse Treffpunkte, an denen sich viele Menschen versammelten. Sicher ist: Es gab nicht nur einen einzigen Grund.</div>'
    + '<div class="notice" data-lw="sicher"><strong>Hilfe:</strong> Die Kette beginnt mit dem Wetter, also dem Klima. Am Ende stehen die Dörfer.</div>')

m.section("ausbreitung", "Der Weg nach Europa", "Der Weg des Ackerbaus nach Europa",
    '<p>Ackerbau und Viehzucht breiteten sich langsam aus. Bauern zogen mit ihren Tieren und ihrem Saatgut weiter und gründeten neue Dörfer. Bis die neue Lebensweise im Emsland ankam, vergingen über 5000 Jahre.</p>'
    + KARTE +
    '<div class="legendlist" aria-hidden="true"><span>Karte: eigene schematische Darstellung</span><span>Grün: Fruchtbarer Halbmond</span><span>Gestrichelter Pfeil: Weg des Ackerbaus</span></div>'
    + m.hot("ausbreitung",
        [("hHalbmond", "Wo begannen Menschen zuerst mit Ackerbau und Viehzucht?",
          "Richtig, im Fruchtbaren Halbmond. Hier begann der Ackerbau ab etwa 9500 v. Chr."),
         ("hMittel", "Wo legten um 5500 v. Chr. die ersten Bauern in Mitteleuropa ihre Felder an?",
          "Genau. Um 5500 v. Chr. erreichten die ersten Bauern Mitteleuropa, zum Beispiel das heutige Süddeutschland und Österreich."),
         ("hEms", "Wo kam die neue Lebensweise erst um 4000 v. Chr. an, ganz in unserer Nähe?",
          "Richtig, im Emsland und in Norddeutschland. Hier lebten die Menschen noch lange als Jäger, Sammler und Fischer. Erst um 4000 v. Chr. setzte sich der Ackerbau durch.")],
        [(o[0], o[2] if o[0] != "hAnatolien" else "Anatolien") for o in ORTE],
        "Alle drei gefunden. Der Ackerbau brauchte über 5000 Jahre vom Fruchtbaren Halbmond bis ins Emsland.",
        "Karte lesen", ["zeit_raum"], tag="Kartenarbeit", titel="Suchauftrag auf der Karte"))

m.section("wandel", "Vom Jäger zum Bauern", "Vom Jäger zum Bauern: Was ändert sich?",
    '<p>Mit dem Ackerbau begann die <strong>Jungsteinzeit</strong>. Die Menschen bauten Getreide wie Emmer, Einkorn und Gerste an. Sie hielten Rinder, Schafe, Ziegen und Schweine. Sie stellten Gefäße aus gebranntem Ton her und bauten feste Häuser.</p>'
    + m.zuord("vergleich",
        [("jaeger", "Jäger und Sammler (Altsteinzeit)"), ("bauer", "Bauern (Jungsteinzeit)"), ("beide", "Bei beiden")],
        [("Zelte aus Fellen, die man mitnehmen kann", "jaeger"),
         ("Den Tierherden hinterherziehen", "jaeger"),
         ("Langhäuser aus Holz und Lehm", "bauer"),
         ("Felder mit Emmer und Gerste", "bauer"),
         ("Rinder, Schafe und Ziegen halten", "bauer"),
         ("Vorräte in Tongefäßen lagern", "bauer"),
         ("Feuer nutzen", "beide"),
         ("Werkzeuge aus Stein herstellen", "beide")],
        "Alles richtig. Vieles änderte sich: feste Häuser, Felder, Haustiere, Tongefäße. Aber manches blieb: Feuer und Steinwerkzeuge gab es weiterhin. Deshalb heißt die neue Zeit auch Jungsteinzeit.",
        "Frage dich: Braucht man dafür einen festen Wohnort? Dann gehört es zu den Bauern.",
        "Jäger und Bauern vergleichen", ["fachwissen"], tag="Vergleich",
        hilfe="Alles, was man nicht mitnehmen kann, wie Häuser und Felder, gehört zu den Bauern. Was beide brauchten, kommt in die Mitte.",
        intro='<p><strong>Auftrag:</strong> Ordne jede Karte zu. Was gehört zu den Jägern und Sammlern, was zu den Bauern, was gab es bei beiden?</p>')
    + LANGHAUS +
    '<div class="legendlist" aria-hidden="true"><span>Rekonstruktionszeichnung: eigene Darstellung nach Grundrissen aus Ausgrabungen</span></div>'
    + m.mc("haus", "W1. Von den Langhäusern findet man heute meist nur dunkle Verfärbungen im Boden, dort wo die Holzpfosten standen. Wie wissen Forscher dann, wie groß die Häuser waren?",
        [("a", "Sie messen die Abstände der Pfostenlöcher. So erkennen sie den Grundriss des Hauses."),
         ("b", "Es gibt Fotos aus der Jungsteinzeit."),
         ("c", "Die Bauern haben die Maße aufgeschrieben.")],
        "a",
        {"a": "Richtig. Die Pfostenlöcher zeigen den Grundriss. Wie das Dach genau aussah, wissen wir aber nicht sicher. Deshalb ist jede Zeichnung eines Langhauses eine Darstellung, eine Rekonstruktion.",
         "b": "Nein, Fotos gibt es erst seit knapp 200 Jahren.",
         "c": "Nein, in der Jungsteinzeit gab es bei uns noch keine Schrift."},
        "Langhaus rekonstruieren", ["quellenarbeit", "fachwissen"], tag="Forschen wie Archäologen")
    + m.luecke("begriff",
        ["Den Übergang zum Ackerbau nennt man die Neolithische ", ("Revolution", ["Reise", "Erfindung"]),
         ". Das Wort „neolithisch“ bedeutet ", ("jungsteinzeitlich", ["eiszeitlich", "steinhart"]),
         ". Eine echte Revolution über Nacht war es aber nicht. Die Veränderung dauerte ", ("viele tausend Jahre", ["nur ein Jahr", "zehn Jahre"]),
         ". Der wichtigste Grund für die Sesshaftigkeit: Felder und ", ("Vorräte", ["Zelte", "Speere"]),
         " kann man nicht einfach mitnehmen."],
        "Alles richtig. Man nennt es Revolution, weil sich das Leben der Menschen völlig verändert hat. Aber es geschah ganz langsam.",
        "Lies den Satz vor und nach jeder Lücke genau.",
        "Neolithische Revolution", ["fachwissen", "zeit_raum"], tag="Lückentext",
        intro='<p><strong>Ein schwieriges Wort:</strong> Wähle in jeder Lücke das passende Wort.</p>'))

STECKBRIEF = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Sachquelle: die Großsteingräber von Groß Berßen im Hümmling, Landkreis Emsland.</strong> Sie liegen an der „Straße der Megalithkultur“, einem Weg zu über 70 Großsteingräbern zwischen Osnabrück und Oldenburg.</p>
 <ul class="facts">
  <li><b>Was ist es?</b> Gräber aus riesigen Steinen. Große Tragsteine stehen in einer Reihe, darauf liegen schwere Decksteine. Darunter ist die Grabkammer.</li>
  <li><b>Wann gebaut?</b> In der Jungsteinzeit, etwa zwischen 3500 und 2800 v. Chr.</li>
  <li><b>Wer hat sie gebaut?</b> Bauern der sogenannten Trichterbecherkultur. Den Namen haben Forscher ihnen nach ihren Tonbechern mit trichterförmigem Rand gegeben.</li>
  <li><b>Woraus?</b> Aus Findlingen, also aus Felsbrocken, die das Eis einer Eiszeit aus Skandinavien mitgebracht hat. Ein Deckstein kann mehrere Tonnen wiegen.</li>
  <li><b>Wozu?</b> Es waren Gemeinschaftsgräber. Über viele Jahre wurden dort Tote bestattet, oft mit Tongefäßen und Steinbeilen als Beigaben.</li>
 </ul>
 <p class="hint">Eines der Gräber heißt „Königsgrab“. Diesen Namen haben ihm erst Menschen viel später gegeben. Angaben nach dem Forschungsstand.</p>
</div>'''

m.section("quelle", "Die Quelle", "Die Quelle: Großsteingräber im Hümmling",
    '<p>Die ersten Bauern im Emsland haben Spuren hinterlassen, die man bis heute sehen kann. Sie sind über 5000 Jahre alt.</p>'
    + STECKBRIEF + GRAB +
    '<div class="legendlist" aria-hidden="true"><span>Zeichnung: eigene schematische Darstellung, kein bestimmtes Grab</span></div>'
    + chronos("Diese Steine sind älter als die Pyramiden in Ägypten! Und sie stehen nur eine knappe Autostunde von Rhede entfernt. Ich finde, das ist einen Ausflug wert.")
    + m.multi("s1", "S1. Was können wir aus den Großsteingräbern schließen? Wähle alle richtigen Aussagen aus.",
        [("bleiben", "Die Menschen lebten lange an einem Ort. Wer umherzieht, baut keine riesigen Steingräber."),
         ("gemeinsam", "Viele Menschen mussten zusammenarbeiten, um die schweren Steine zu bewegen."),
         ("tote", "Den Menschen war es wichtig, wie sie ihre Toten bestatteten."),
         ("namen", "Wie die Menschen hießen, die hier begraben wurden."),
         ("metall", "Die Menschen hatten Kräne aus Metall.")],
        ["bleiben", "gemeinsam", "tote"],
        "Richtig. Die Gräber zeigen: Die Menschen waren sesshaft, arbeiteten in großen Gruppen zusammen und ehrten ihre Toten. Namen verraten Steine nicht, denn eine Schrift gab es bei uns noch nicht.",
        {"namen": "Das verraten die Steine nicht. In der Jungsteinzeit gab es bei uns noch keine Schrift.",
         "metall": "Nein, Metall kannten die Menschen in der Jungsteinzeit noch nicht. Sie mussten die Steine mit Muskelkraft, Holz und Seilen bewegen."},
        "Großsteingrab auswerten", ["quellenarbeit", "ursachen_folgen"], tipp="Frage dich: Was zeigen die Steine wirklich?", tag="Quellenarbeit")
    + m.mc("s2", "S2. Ein Grab trägt den Namen „Königsgrab“. Was bedeutet das für deine Quellenarbeit?",
        [("a", "Hier lag sicher ein König aus der Jungsteinzeit."),
         ("b", "Der Name wurde viel später ausgedacht. Er ist eine Deutung von späteren Menschen und keine Information aus der Jungsteinzeit."),
         ("c", "Der Name zeigt, dass die Menschen damals schon Könige hatten und schreiben konnten.")],
        "b",
        {"a": "Vorsicht. Ob es damals Könige gab, wissen wir nicht. Der Name stammt erst aus viel späterer Zeit.",
         "b": "Genau. Namen wie „Königsgrab“ oder „Hünengrab“ haben sich Menschen viel später ausgedacht. Früher glaubte man sogar, Riesen, also Hünen, hätten die Steine aufgestellt. Solche Namen sind spätere Deutungen, keine Quelle aus der Bauzeit.",
         "c": "Nein. Eine Schrift gab es bei uns in der Jungsteinzeit noch nicht. Der Name ist viel jünger."},
        "Name und Quelle", ["quellenarbeit", "perspektivitaet"], tag="Quellenkritik")
    + m.text("q2", "Q2. Ein Deckstein wiegt mehrere Tonnen. Wie könnten Menschen ohne Metall und Maschinen so schwere Steine bewegt haben? Stelle eine Vermutung auf und begründe sie.",
        "Ich vermute, dass die Menschen ... benutzt haben, weil ...",
        dict(min=50, worte=12, need=2, saetze=1, gruppen=[
            dict(w=["holz", "rolle", "baumstamm", "stamm", "seil", "schlitten", "hebel", "rampe", "erde", "balken", "stange"], miss="Nenne ein Hilfsmittel, zum Beispiel Baumstämme, Seile oder einen Schlitten."),
            dict(w=["viele", "gemeinsam", "zusammen", "gruppe", "menschen", "ochs", "rind", "tiere", "dorf"], miss="Erkläre, wer die Kraft aufbrachte, zum Beispiel viele Menschen gemeinsam oder Rinder.")],
            ok="Sehr gute Vermutung. Versuche von heutigen Forschern zeigen: Mit Holzschlitten, Baumstämmen, Seilen und vielen Helfern lassen sich solche Steine bewegen. Vielleicht halfen auch Rinder. Ganz sicher wissen wir es nicht."),
        "Weiterdenken Steine bewegen", ["ursachen_folgen"], tag="Weiterdenken · Vermutung"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Zeitreise 005</span>
 <p><strong>Fall:</strong> Chronos hat eine Erklärung auf eine Karteikarte geschrieben: <em>„Die Menschen wurden sesshaft, weil sie eines Tages keine Lust mehr hatten, herumzulaufen.“</em></p>
 <p><strong>Dein Auftrag:</strong> Finde die wirklichen Gründe heraus. Am Ende entscheidest du, ob Chronos' Erklärung reicht.</p>
</div>
<p><strong>Zum Einstieg:</strong> Denk an dein Frühstück. Brot, Müsli, Milch, Käse. Fast alles davon gibt es nur, weil Menschen vor über 10.000 Jahren angefangen haben, Getreide anzubauen und Tiere zu halten. Ohne diese Erfindung gäbe es kein Dorf, keine Stadt und auch kein Rhede.</p>
{chronos("Ich finde meine Erklärung eigentlich sehr gut. Ich habe auch keine Lust mehr herumzulaufen, und ich sitze seit Jahrhunderten im Archiv. Aber gut, prüf sie ruhig.")}
<p><strong>Leitfrage:</strong> Warum wurden Menschen sesshaft?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Ursachenforscherin</span>
 <span class="abz" id="abz2">Kartenleser</span>
 <span class="abz" id="abz3">Steinkundige</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Vermutung", "D1. Wo begannen Menschen zuerst damit, Getreide anzubauen?",
     [("a", "Im Vorderen Orient, im sogenannten Fruchtbaren Halbmond"), ("b", "Im Emsland"), ("c", "Am Nordpol")], "a"),
    ("d2", "Richtig oder falsch", "D2. Sesshaft heißt: Man lebt dauerhaft an einem festen Ort.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "r"),
    ("d3", "Schätzfrage", "D3. Welches Tier lebte schon als Begleiter bei den Menschen, bevor es Bauern gab?",
     [("a", "Der Hund"), ("b", "Die Katze"), ("c", "Das Huhn")], "a")],
    dict(alle="Drei von drei. Sehr gut! Der Lernweg Weiterdenken könnte dir Spaß machen.",
         fast="Zwei von drei. Gute Grundlage. Im Modul erfährst du mehr über die ersten Bauern.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da. Der Lernweg Sicher werden gibt dir mehr Hilfen.",
         extra=[dict(n="d3", v="b", m="Ein Hinweis vorab: Der Hund stammt vom Wolf ab und begleitete Menschen schon in der Altsteinzeit. Katzen kamen erst später zu den Bauern.")]))

gloss = glossar_section([
    ("Sesshaft", "Dauerhaft an einem festen Ort leben, zum Beispiel in einem Dorf."),
    ("Jungsteinzeit", "Die Zeit nach der Altsteinzeit, in der die Menschen Ackerbau und Viehzucht betrieben. Werkzeuge waren noch aus Stein. Im Emsland begann sie um 4000 v. Chr."),
    ("Neolithische Revolution", "Der Übergang vom Jagen und Sammeln zu Ackerbau und Viehzucht. „Neolithisch“ heißt jungsteinzeitlich. Die Veränderung dauerte viele tausend Jahre."),
    ("Fruchtbarer Halbmond", "Ein Gebiet im Vorderen Orient in Form eines Halbmonds. Dort begannen Menschen ab etwa 9500 v. Chr. mit Ackerbau."),
    ("Ackerbau und Viehzucht", "Getreide und andere Pflanzen anbauen und Tiere wie Rinder, Schafe, Ziegen und Schweine halten."),
    ("Emmer und Einkorn", "Alte Getreidearten, aus denen später unser Weizen gezüchtet wurde."),
    ("Langhaus", "Ein langes Haus aus Holz, Flechtwerk und Lehm, in dem die ersten Bauern in Mitteleuropa wohnten."),
    ("Großsteingrab", "Ein Grab aus riesigen Steinen aus der Jungsteinzeit. Man nennt es auch Hünengrab oder Megalithgrab."),
    ("Findling", "Ein großer Felsbrocken, den das Eis einer Eiszeit aus Skandinavien mitgebracht hat.")],
    ["Großsteingräber an der Straße der Megalithkultur (Emsland, Osnabrücker Land, Oldenburger Land): über 70 Gräber, Bauzeit etwa 3500 bis 2800 v. Chr.; in Groß Berßen (Gemeinde im Hümmling, Samtgemeinde Sögel) unter anderem das „Königsgrab“ (Groß Berßen VIII) und das „Wappengrab“.",
     "Trichterbecherkultur: etwa 4200 bis 2800 v. Chr., erste bäuerliche Kultur im Norden Mitteleuropas; Bau der Großsteingräber etwa 3500 bis 2800 v. Chr.",
     "Beginn des Ackerbaus im Fruchtbaren Halbmond: ab etwa 9500 v. Chr. Linearbandkeramik, erste Bauern in Mitteleuropa: etwa 5500 bis 4900 v. Chr., Langhäuser etwa 20 bis 40 Meter lang. Jungsteinzeit in Griechenland ab etwa 6500 v. Chr.",
     "Ende der letzten Eiszeit: etwa 9700 v. Chr.",
     "Karte, Langhaus und Großsteingrab sind eigene schematische Zeichnungen. Die Karte ist stark vereinfacht und nicht maßstabsgetreu."])

lc = lerncheck_section(["Ich kann erklären, warum Menschen sesshaft wurden, und mehrere Gründe nennen.",
                        "Ich kann auf einer Karte zeigen, wo der Ackerbau begann und wie er nach Europa kam.",
                        "Ich kann an einem Großsteingrab zeigen, was eine Sachquelle über die ersten Bauern verrät."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf Chronos\' Karteikarte steht: <em>„Die Menschen wurden sesshaft, weil sie eines Tages keine Lust mehr hatten, herumzulaufen.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Erklärung reicht. Die Menschen haben sich das an einem Tag so überlegt."),
     ("b", "Die Erklärung reicht nicht. Nach der Eiszeit wurde es wärmer, es wuchs viel wildes Getreide, die Menschen legten Vorräte und Felder an. Das passierte langsam über viele tausend Jahre."),
     ("c", "Die Menschen wurden sesshaft, weil sie Metall entdeckt hatten.")],
    ["b"],
    {"a": "Denk an die Ursache-Folge-Kette: Es war kein Entschluss an einem Tag, sondern eine lange Entwicklung mit mehreren Ursachen. Wähle noch einmal.",
     "b": "Sehr gut entschieden. Du nennst mehrere Ursachen und erkennst, dass es lange dauerte. Begründe das jetzt in A2.",
     "c": "Nein, Metall kam erst viel später. Die ersten Bauern hatten noch Werkzeuge aus Stein. Wähle noch einmal."},
    "Schreibe Chronos eine kurze Nachricht mit zwei bis vier Sätzen. Erkläre, warum Menschen sesshaft wurden. Nenne mindestens zwei Ursachen und verbinde sie mit „weil“ oder „deshalb“.",
    "Lieber Chronos, deine Erklärung reicht nicht, weil ...",
    "„Nach der Eiszeit wurde es wärmer, deshalb ...“ · „Die Menschen legten Vorräte an, weil ...“ · „Felder kann man nicht mitnehmen, also ...“",
    dict(min=60, worte=14, need=2, saetze=2, gruppen=[
        dict(w=["eiszeit", "warm", "klima", "wetter"], miss="Nenne das Klima als Ursache: Nach der Eiszeit wurde es wärmer."),
        dict(w=["getreide", "korn", "korner", "emmer", "gerste", "feld", "acker", "vorrat", "saen", "pflanz", "anbau"], miss="Erkläre die Rolle von Getreide, Vorräten oder Feldern."),
        dict(w=["tier", "rind", "schaf", "ziege", "viehzucht", "haus", "dorf", "langhaus", "lange", "tausend", "langsam"], miss="Ergänze noch etwas: Tiere, Häuser und Dörfer, oder dass es sehr lange dauerte.")],
        ok="Sehr gut. Du nennst mehrere Ursachen und verbindest sie. Genau so erklärt man Geschichte: nicht mit einem einzigen Grund, sondern mit einer Kette von Ursachen und Folgen. Abzeichen Begründer freigeschaltet."))

build(m, "Zeitreise starten",
      ["Du erklärst mit einer Ursache-Folge-Kette, warum Menschen sesshaft wurden.",
       "Du verfolgst auf einer Karte den Weg des Ackerbaus bis ins Emsland.",
       "Du vergleichst das Leben von Jägern und Sammlern mit dem der ersten Bauern.",
       "Du lernst den Begriff Neolithische Revolution kennen.",
       "Du untersuchst Großsteingräber im Hümmling als echte Sachquelle."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos hat seinen Wanderstock schon weggestellt. Es geht weiter mit der Mission.")
