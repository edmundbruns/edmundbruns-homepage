# -*- coding: utf-8 -*-
from common import *
from tl import timeline_svg

m = Modul("001", "Warum begann die Industrialisierung in England?", "England",
          "Industrialisierung und soziale Frage · Akte 001",
          "Um 1750 arbeiteten fast alle Menschen auf dem Land oder in kleinen Werkstätten. Hundert Jahre später standen in England Tausende Fabriken mit rauchenden Schornsteinen. In diesem Modul findest du heraus, warum diese Veränderung ausgerechnet auf einer Insel im Nordwesten Europas begann.",
          "Weiter geht es mit Modul 002: Wie veränderten Maschinen die Arbeit?",
          badges=[dict(id="abz1", name="Kartenleser", tasks=["karte"]),
                  dict(id="abz2", name="Ursachenforscher", tasks=["zuord", "kette"]),
                  dict(id="abz3", name="Quellenprüfer", tasks=["s1", "s2"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])])

# ---------- Karte Grossbritannien ----------
LON0, LAT0, K = -6.6, 58.9, 56
KX = K * 0.58
X0, Y0 = 20, 20
def P(lon, lat):
    return proj(lon, lat, LON0, LAT0, K, KX, X0, Y0)

COAST = [(-5.0,58.62),(-4.75,58.57),(-4.4,58.55),(-3.52,58.6),(-3.37,58.67),(-3.05,58.64),(-3.1,58.44),(-3.65,58.12),(-3.77,57.86),(-4.0,57.75),(-4.22,57.5),(-3.6,57.65),(-3.28,57.72),(-2.5,57.68),(-2.0,57.69),(-1.78,57.5),(-2.08,57.15),(-2.2,56.9),(-2.47,56.7),(-2.6,56.5),(-2.8,56.45),(-2.58,56.28),(-2.9,56.2),(-3.4,56.05),(-3.0,56.0),(-2.55,56.0),(-2.13,55.9),(-2.0,55.77),(-1.65,55.6),(-1.55,55.25),(-1.42,55.02),(-1.35,54.85),(-1.2,54.69),(-0.95,54.58),(-0.61,54.49),(-0.4,54.3),(-0.08,54.12),(-0.2,53.9),(0.12,53.58),(-0.3,53.7),(-0.6,53.72),(-0.25,53.55),(0.15,53.45),(0.34,53.14),(0.2,52.9),(0.05,52.85),(0.35,52.95),(0.5,52.97),(1.0,52.95),(1.3,52.93),(1.68,52.75),(1.75,52.48),(1.6,52.1),(1.35,51.95),(1.15,51.79),(0.9,51.75),(0.7,51.53),(0.4,51.5),(0.6,51.42),(1.0,51.35),(1.44,51.38),(1.32,51.13),(0.97,50.91),(0.6,50.85),(0.25,50.73),(-0.14,50.82),(-0.79,50.73),(-1.1,50.78),(-1.4,50.85),(-1.6,50.75),(-1.98,50.7),(-2.45,50.52),(-2.95,50.72),(-3.4,50.6),(-3.5,50.4),(-3.64,50.22),(-4.14,50.36),(-4.6,50.32),(-5.05,50.0),(-5.2,49.96),(-5.7,50.07),(-5.48,50.21),(-5.08,50.42),(-4.75,50.55),(-4.53,51.02),(-4.12,51.21),(-3.48,51.2),(-2.98,51.35),(-2.6,51.55),(-2.4,51.75),(-2.75,51.62),(-3.17,51.46),(-3.6,51.4),(-3.94,51.62),(-4.3,51.56),(-4.7,51.67),(-5.1,51.72),(-5.3,51.88),(-4.98,52.0),(-4.6,52.12),(-4.09,52.41),(-4.06,52.72),(-4.4,52.8),(-4.75,52.8),(-4.5,52.95),(-4.3,53.1),(-4.6,53.3),(-4.3,53.42),(-4.0,53.3),(-3.83,53.33),(-3.3,53.35),(-3.1,53.3),(-3.0,53.42),(-3.0,53.65),(-3.05,53.82),(-2.87,54.07),(-3.22,54.1),(-3.4,54.3),(-3.64,54.49),(-3.5,54.71),(-3.2,54.95),(-3.6,54.88),(-4.05,54.82),(-4.4,54.7),(-4.86,54.64),(-5.0,54.85),(-5.05,54.98),(-4.85,55.2),(-4.63,55.46),(-4.9,55.7),(-4.85,55.93),(-4.6,55.95),(-4.9,56.0),(-5.3,55.85),(-5.6,55.3),(-5.8,55.35),(-5.55,55.9),(-5.47,56.41),(-5.8,56.5),(-6.2,56.73),(-5.83,57.0),(-5.71,57.28),(-5.8,57.6),(-5.16,57.9),(-5.35,58.2)]
coast_d = 'M' + ' L'.join(f'{x} {y}' for x, y in (P(*c) for c in COAST)) + ' Z'

COAL = [(-1.6,54.85,.32,.33),(-2.45,53.6,.45,.22),(-1.35,53.35,.33,.5),(-2.0,52.55,.28,.18),(-2.5,52.66,.12,.1),(-3.55,51.72,.6,.16),(-3.8,55.9,.7,.2),(-3.45,54.62,.12,.15)]
coal_svg = ''.join(f'<ellipse cx="{P(lo,la)[0]}" cy="{P(lo,la)[1]}" rx="{round(rx*KX,1)}" ry="{round(ry*K,1)}" fill="url(#kohle)" stroke="#6b5a45" stroke-width="1.2" stroke-dasharray="3 2"/>' for lo, la, rx, ry in COAL)

CITIES = [  # id, name, lon, lat, dx, dy, anchor
    ("hGlasgow", "Glasgow", -4.25, 55.86, -14, 5, "end"),
    ("hNewcastle", "Newcastle", -1.61, 54.97, 14, 5, "start"),
    ("hLiverpool", "Liverpool", -2.98, 53.41, -14, 14, "end"),
    ("hManchester", "Manchester", -2.24, 53.48, 13, -6, "start"),
    ("hCoalbrookdale", "Coalbrookdale", -2.49, 52.64, -13, 5, "end"),
    ("hBirmingham", "Birmingham", -1.89, 52.49, 13, 12, "start"),
    ("hLondon", "London", -0.13, 51.51, 12, 18, "start"),
]
city_svg = ''
for cid, nm, lo, la, dx, dy, anc in CITIES:
    x, y = P(lo, la)
    city_svg += (f'<g id="{cid}" class="hot" data-task="karte" tabindex="0" role="button" aria-label="{nm}">'
                 f'<circle cx="{x}" cy="{y}" r="17" fill="#fff" fill-opacity=".01"/>'
                 f'<circle cx="{x}" cy="{y}" r="8" fill="#fff" stroke="#37546b" stroke-width="2.5"/><circle cx="{x}" cy="{y}" r="3.5" fill="#9b352d"/>'
                 f'<text x="{x+dx}" y="{y+dy}" text-anchor="{anc}" font-size="16" font-weight="700" fill="#14232d" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">{nm}</text></g>')
lx, ly = P(-2.98, 53.41)
arrow_in = f'<path d="M2 {ly-12} C 50 {ly-14}, 90 {ly-6}, {lx-12} {ly}" fill="none" stroke="#aa6d18" stroke-width="4" marker-end="url(#pfeil)"/>'
mx, my = P(-2.24, 53.48)

KARTE = f'''<div class="svgwrap"><svg class="pic" style="max-width:520px;margin:auto" viewBox="0 0 400 560" role="img" aria-label="Schematische Karte von Großbritannien um 1800 mit Kohlegebieten, den Städten Glasgow, Newcastle, Liverpool, Manchester, Coalbrookdale, Birmingham und London sowie einem Handelspfeil aus Amerika nach Liverpool">
<defs>
 <pattern id="kohle" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#d9cbb3"/><line x1="0" y1="0" x2="0" y2="7" stroke="#6b5a45" stroke-width="2.4"/></pattern>
 <marker id="pfeil" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#aa6d18"/></marker>
</defs>
<rect width="400" height="560" fill="#dcebf3"/>
<path d="{coast_d}" fill="#eee6cf" stroke="#9c8a63" stroke-width="2" stroke-linejoin="round"/>
{coal_svg}
<text x="112" y="140" font-size="15" fill="#7b6b4f" font-style="italic">Schottland</text>
<text x="210" y="400" font-size="15" fill="#7b6b4f" font-style="italic">England</text>
<text x="96" y="440" font-size="14" fill="#7b6b4f" font-style="italic">Wales</text>
<text x="300" y="330" font-size="17" fill="#5f88a3" font-style="italic">Nordsee</text>
<text x="120" y="548" font-size="14" fill="#5f88a3" font-style="italic">Ärmelkanal</text>
{arrow_in}
<text x="6" y="{ly-50}" font-size="14" font-weight="700" fill="#8f5a12" paint-order="stroke" stroke="#dcebf3" stroke-width="4">aus Amerika:</text>
<text x="6" y="{ly-32}" font-size="14" font-weight="700" fill="#8f5a12" paint-order="stroke" stroke="#dcebf3" stroke-width="4">Baumwolle, Zucker</text>
{city_svg}
<g transform="translate(222 30)">
 <rect width="172" height="118" rx="10" fill="#fff" stroke="#c9d3da"/>
 <text x="12" y="24" font-size="15" font-weight="800" fill="#37546b">Legende</text>
 <rect x="12" y="38" width="26" height="16" fill="url(#kohle)" stroke="#6b5a45"/><text x="46" y="51" font-size="14" fill="#14232d">Kohlegebiet</text>
 <circle cx="25" cy="72" r="7" fill="#fff" stroke="#37546b" stroke-width="2.5"/><circle cx="25" cy="72" r="3" fill="#9b352d"/><text x="46" y="77" font-size="14" fill="#14232d">Stadt, Ort</text>
 <path d="M12 98 H36" stroke="#aa6d18" stroke-width="4" marker-end="url(#pfeil)"/><text x="46" y="103" font-size="14" fill="#14232d">Handelsweg</text>
</g>
<text x="394" y="530" text-anchor="end" font-size="13" fill="#56616a">Schematisch,</text><text x="394" y="548" text-anchor="end" font-size="13" fill="#56616a">nicht maßstabsgetreu</text>
</svg></div>'''

m.section("karte", "Die Insel der Industrie", "Die Insel der Industrie: Kartenarbeit",
    '<p>Die Karte zeigt Großbritannien um 1800. Lies zuerst die Legende. Dann löse fünf Suchaufträge. Du kannst im Bild auf den Ort tippen oder die Knöpfe unter der Aufgabe benutzen. Beides zählt gleich.</p>'
    + KARTE +
    '<div class="legendlist" aria-hidden="true"><span>Karte: eigene schematische Darstellung, Lage der Kohlegebiete vereinfacht</span></div>'
    + m.hot("karte",
        [("hLiverpool", "Gesucht ist der Hafen an der Westküste, über den die Rohbaumwolle aus Amerika ins Land kam.",
          "Richtig, Liverpool. Hier kamen die Baumwollballen an. Liverpool war im 18. Jahrhundert aber auch einer der wichtigsten Häfen im Sklavenhandel."),
         ("hManchester", "Gesucht ist die Stadt nur rund 50 Kilometer vom Baumwollhafen entfernt, mitten in einem Kohlegebiet. Um 1830 standen hier so viele Baumwollspinnereien, dass man sie „Cottonopolis“ nannte.",
          "Richtig, Manchester. Baumwolle kam aus Liverpool, Kohle lag direkt vor der Tür. Beides zusammen machte die Stadt zum Zentrum der Textilindustrie."),
         ("hCoalbrookdale", "Gesucht ist der kleine Ort im Westen Englands, in dem Abraham Darby 1709 Eisen erstmals mit Koks statt mit Holzkohle schmolz.",
          "Richtig, Coalbrookdale. Koks wird aus Steinkohle gewonnen. Weil Holz knapp und teuer war, konnte nun viel mehr und billigeres Eisen hergestellt werden."),
         ("hNewcastle", "Gesucht ist die Hafenstadt an der Ostküste mitten in einem Kohlegebiet. Von hier brachten Schiffe die Kohle bis nach London.",
          "Richtig, Newcastle. Kohle nahe am Meer war ein großer Vorteil, denn Transport auf dem Wasser war viel billiger als über Land."),
         ("hLondon", "Gesucht ist die Hauptstadt mit Banken, Börse und Versicherungen. Hier gab es Geld für neue Unternehmen.",
          "Richtig, London. Reiche Kaufleute und Banken konnten Geld verleihen. Dieses Geld für Investitionen nennt man Kapital.")],
        [(c[0], c[1]) for c in CITIES],
        "Alle fünf Orte gefunden. Die Karte zeigt: Kohle, Häfen und Geld lagen in England nah beieinander.",
        "Kartenarbeit", ["fachwissen", "zeit_raum"]) +
    '<details class="gloss"><summary>Überraschender Fund aus dem Archiv</summary><div class="body">1761 wurde ein Kanal eröffnet, der Kohle aus den Bergwerken des Herzogs von Bridgewater nach Manchester brachte. Ein Pferd konnte auf dem Wasser ein Vielfaches der Last ziehen, die es über schlammige Straßen schaffte. Die Kohle wurde in Manchester dadurch deutlich billiger. Danach entstanden in England viele weitere Kanäle.</div></details>')

m.section("voraussetzungen", "Voraussetzungen ordnen", "Was England mitbrachte",
    '<p>Historikerinnen und Historiker sind sich einig: Eine einzige Ursache reicht nicht. Erst mehrere Voraussetzungen zusammen machten den Anfang in England möglich. Ordne jede Karte dem passenden Bereich zu.</p>'
    + m.zuord("zuord",
        [("boden", "Bodenschätze"), ("geld", "Geld und Handel"), ("menschen", "Menschen und Arbeitskräfte"), ("technik", "Erfindungen und Verkehr")],
        [("Große Kohlevorkommen, oft nahe an der Oberfläche", "boden"),
         ("Eisenerz für Maschinen, Brücken und Schienen", "boden"),
         ("Reiche Kaufleute und Banken, die Geld verleihen", "geld"),
         ("Gewinne aus dem Handel mit den Kolonien in Amerika und Asien", "geld"),
         ("Die Bevölkerung wuchs von etwa 6 Millionen (um 1750) auf fast 9 Millionen (1801)", "menschen"),
         ("Viele Landarbeiter verloren ihr Land und suchten Arbeit", "menschen"),
         ("Spinnmaschinen und eine verbesserte Dampfmaschine", "technik"),
         ("Kanäle, Flüsse und Häfen für billigen Transport", "technik")],
        "Alle acht richtig. Wichtig ist der Zusammenhang: Kohle trieb die Maschinen an, Geld bezahlte sie, Menschen bedienten sie, und auf Kanälen und Schiffen kamen Rohstoffe und Waren schnell ans Ziel. Erst alles zusammen ergab den Anfang der Industrialisierung.",
        "Frage dich bei jeder Karte: Liegt es im Boden, geht es um Geld, um Menschen oder um Technik und Transport?",
        "Voraussetzungen ordnen", ["fachwissen", "ursachen_folgen"],
        hilfe="„Bodenschätze“ sind Rohstoffe aus der Erde. „Einhegungen“ bedeutet: Großgrundbesitzer zäunten frühere Gemeinschaftsflächen ein. Viele Familien auf dem Land verloren dadurch ihr Einkommen.")
    + '<div class="notice"><strong>Gut zu wissen:</strong> England war damals politisch ruhig. Seit 1689 kontrollierte das Parlament den König, und wer etwas Neues erfand, konnte es mit einem Patent schützen lassen. Erfinden lohnte sich also.</div>')

TL = [(1709, "Darby schmilzt Eisen mit Koks"), (1712, "Newcomen: erste Dampfmaschine pumpt Wasser"),
      (1764, "um 1764: Hargreaves erfindet die Spinnmaschine „Spinning Jenny“"), (1769, "Watt erhält ein Patent für seine verbesserte Dampfmaschine"),
      (1771, "Arkwright eröffnet in Cromford eine Spinnerei mit Wasserkraft"), (1785, "Cartwright baut einen mechanischen Webstuhl"),
      (1830, "Eisenbahn zwischen Liverpool und Manchester")]
m.section("kette", "Eine Erfindung zieht die nächste", "Eine Erfindung zieht die nächste nach sich",
    '<p>Die wichtigsten Erfindungen kamen nicht zufällig. Oft löste eine Erfindung ein Problem und schuf dabei ein neues. Sieh dir zuerst die Zeitleiste an.</p>'
    '<div class="svgwrap">' + timeline_svg(TL, "Zeitleiste der Erfindungen von 1709 bis 1830") + '</div>'
    '<div class="legendlist" aria-hidden="true"><span>Zeitleiste: eigene Darstellung</span></div>'
    + m.order("kette",
        ["Die Bevölkerung wächst, und viele Menschen brauchen billige Kleidung.",
         "Spinnerinnen am Spinnrad schaffen nicht genug Garn für die Weber.",
         "Erfinder bauen Spinnmaschinen, die viele Fäden gleichzeitig spinnen.",
         "Die großen Maschinen brauchen einen Antrieb, zuerst Wasserkraft, dann Dampf.",
         "Dampfmaschinen verbrauchen viel Kohle, deshalb wächst der Bergbau.",
         "Fabriken entstehen dort, wo Kohle, Häfen und Arbeitskräfte nahe beieinander liegen."],
        "Genau. Das ist eine typische Ursache-Folge-Kette: Mehr Menschen brauchten mehr Stoff, die Handarbeit kam nicht nach, Maschinen lösten das Problem, brauchten aber Kraft und Kohle. Am Ende stand die Fabrik.",
        "Frage dich bei jedem Schritt: Welches Problem musste zuerst da sein, damit jemand eine Lösung erfand?",
        "Ursache und Folge", ["ursachen_folgen"], tag="Ursache-Folge-Kette",
        intro='<p><strong>Auftrag:</strong> Bringe die Kette in die richtige Reihenfolge. Sie beginnt mit der Ursache und endet mit der Folge. Nutze die Pfeilknöpfe.</p>')
    + m.luecke("luecke",
        ["Schon 1712 baute Thomas Newcomen eine Dampfmaschine. Sie pumpte Wasser aus ", ("Bergwerken", ["Kirchen", "Schiffen"]),
         ". Sie verbrauchte aber sehr viel ", ("Kohle", ["Wasser", "Holz"]),
         ". James Watt erhielt 1769 ein Patent für eine Verbesserung. Seine Maschine brauchte deutlich ", ("weniger", ["mehr", "gar keinen"]),
         " Brennstoff. Ab den 1780er-Jahren konnte sie auch ", ("Räder drehen", ["fliegen", "Strom erzeugen"]),
         " und damit Maschinen in Fabriken antreiben. Deshalb musste eine Fabrik nicht mehr an einem ", ("Fluss", ["Berg", "Markt"]),
         " mit Wasserrad liegen."],
        "Alles richtig. Watt hat die Dampfmaschine also nicht erfunden, sondern entscheidend verbessert. Weil sie Räder drehen konnte, wurde sie zum Motor der Fabriken.",
        "Tipp: Lies den Satz davor und danach. Was brauchte eine Dampfmaschine, um zu laufen?",
        "Dampfmaschine", ["fachwissen", "zeit_raum"], tag="Lückentext",
        intro='<p><strong>Die Dampfmaschine:</strong> Wähle in jeder Lücke das passende Wort.</p>'))

m.section("welthandel", "Reichtum mit Schattenseite", "Reichtum mit Schattenseite",
    '<p>Englands Fabriken verarbeiteten vor allem Baumwolle. Baumwolle wächst aber nicht im kühlen England. Sie musste von weit her kommen.</p>'
    + m.mc("welt", "W1. Woher kam die Rohbaumwolle für die Spinnereien in Manchester um 1800 zu einem großen Teil?",
        [("a", "Von Feldern in England, die extra dafür angelegt wurden"),
         ("b", "Von Plantagen in Amerika und der Karibik, auf denen versklavte Menschen arbeiten mussten"),
         ("c", "Aus Deutschland, weil dort Baumwolle billig war")],
        "b",
        {"a": "Nicht ganz. Baumwolle braucht viel Wärme. Im englischen Klima wächst sie nicht. Sieh dir noch einmal den Pfeil auf der Karte an.",
         "b": "Richtig. Ein großer Teil der Baumwolle kam von Plantagen im Süden der heutigen USA und aus der Karibik. Dort mussten versklavte Menschen aus Afrika unter Zwang arbeiten. Der Wohlstand der englischen Industrie hing also auch mit Sklaverei zusammen.",
         "c": "Nicht ganz. In Deutschland wächst keine Baumwolle, das Klima ist zu kühl. Sieh dir den Pfeil auf der Karte an."},
        "Kolonialhandel", ["fachwissen", "perspektivitaet"], tag="Auswahl mit Erklärung")
    + '<div class="notice warn"><strong>Fachlich wichtig:</strong> Mit dem Handel über den Atlantik verdienten englische Kaufleute viel Geld. Ein Teil dieses Kapitals floss später in Unternehmen. Wie groß dieser Anteil genau war, ist unter Historikerinnen und Historikern umstritten. Unbestritten ist: Millionen Afrikanerinnen und Afrikaner wurden verschleppt und versklavt. 1807 verbot Großbritannien den Sklavenhandel, 1833 die Sklaverei in seinen Kolonien. Baumwolle aus Sklavenarbeit in den USA kaufte England aber noch bis in die 1860er-Jahre.</div>')

QUELLE = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>James Boswell, „The Life of Samuel Johnson“, erschienen 1791.</strong> Boswell beschreibt darin einen Besuch in den Werken von Matthew Boulton in Soho bei Birmingham im März 1776. Boulton stellte dort zusammen mit James Watt Dampfmaschinen her.</p>
 <blockquote class="q">
  <p>„Herr Hector begleitete mich zu den großen Werken von Herrn Boulton an einem Ort, den er Soho nennt, etwa zwei Meilen von Birmingham entfernt. […] Ich werde nie vergessen, was Herr Boulton zu mir sagte: ‚Ich verkaufe hier, Sir, was die ganze Welt haben möchte: KRAFT.‘ Er hatte etwa siebenhundert Menschen bei der Arbeit.“</p>
  <p class="orig">Englischer Wortlaut des Kernsatzes: „I shall never forget Mr. Bolton's expression to me: ‚I sell here, Sir, what all the world desires to have, POWER.‘ He had about seven hundred people at work.“</p>
 </blockquote>
 <p class="hint">Deutsche Übersetzung für dieses Modul, leicht vereinfacht. Boswell schreibt den Namen „Bolton“.</p>
</div>'''

m.section("quelle", "Die Quelle", "Die Quelle: Ein Besuch bei Boulton und Watt",
    '<p>Chronos hat einen echten Augenzeugenbericht gefunden. Er ist rund 250 Jahre alt.</p>' + QUELLE +
    chronos("Stell dir bei jeder Quelle vier Fragen: Wer hat sie geschrieben? Wann? Für wen? Und warum? Erst dann fragst du: Was sagt sie, und was sagt sie nicht?") +
    m.multi("s1", "S1. Was erfährst du aus diesem Text? Wähle alle zutreffenden Aussagen aus.",
        [("arbeiter", "In Boultons Werken arbeiteten etwa 700 Menschen."),
         ("welt", "Boulton war überzeugt, dass seine Ware überall auf der Welt gefragt war."),
         ("selbst", "Boswell hat die Werke selbst besucht."),
         ("erfunden", "Boulton hat die Dampfmaschine allein erfunden."),
         ("lohn", "Die Arbeiter in Soho waren mit ihrem Lohn zufrieden.")],
        ["arbeiter", "welt", "selbst"],
        "Genau. Der Text nennt die Zahl der Arbeiter, zeigt Boultons Stolz und beruht auf einem eigenen Besuch. Über Löhne oder die Meinung der Arbeiter sagt er nichts.",
        {"erfunden": "Das steht nicht im Text. Boulton war Unternehmer, die Verbesserung der Dampfmaschine stammt von James Watt.",
         "lohn": "Darüber sagt der Text nichts. Die Arbeiter kommen in dieser Quelle gar nicht selbst zu Wort."},
        "Quelle auswerten", ["quellenarbeit"], tipp="Lies nur, was wirklich dasteht.", tag="Quellenarbeit") +
    m.mc("s2", "S2. Boswell schrieb sein Buch über seinen Freund Samuel Johnson. Es erschien 1791, also 15 Jahre nach dem Besuch. Was folgt daraus für die Quelle?",
        [("a", "Der Text ist wertlos, weil er so spät erschien."),
         ("b", "Boulton hat den Text selbst geschrieben, um Werbung zu machen."),
         ("c", "Boswell war Augenzeuge, schrieb aber aus der Erinnerung und wollte vor allem über Johnson erzählen. Den Satz von Boulton gibt er so wieder, wie er ihn behalten hat.")],
        "c",
        {"a": "Nicht ganz. Ein zeitlicher Abstand macht eine Quelle nicht wertlos. Man muss sie nur vorsichtig lesen. Boswell hat sich wahrscheinlich Notizen gemacht.",
         "b": "Nein. Der Text stammt von James Boswell. Boulton kommt darin nur mit einem Satz vor.",
         "c": "Richtig. Boswell war dabei, das macht die Quelle wertvoll. Aber er schrieb für Leserinnen und Leser, die sich für Johnson interessierten, und gab Boultons Worte aus der Erinnerung wieder. Seine Begeisterung ist seine eigene Sicht."},
        "Quellenkritik", ["quellenarbeit", "zeit_raum"], tag="Quellenkritik") +
    m.text("q2", "Q2. Das englische Wort „power“ bedeutet „Kraft“, aber auch „Macht“. Erkläre, warum Boultons Satz in beiden Bedeutungen passt.",
        "Der Satz passt zu „Kraft“, weil ... Er passt aber auch zu „Macht“, denn ...",
        dict(min=60, worte=14, need=2, gruppen=[
            dict(w=["kraft", "antrieb", "dampf", "maschin", "energie", "antreib"], miss="Erkläre, welche Kraft Boulton verkaufte, nämlich den Antrieb durch Dampfmaschinen."),
            dict(w=["macht", "reich", "geld", "herrsch", "einfluss", "uberlegen", "vorsprung", "staerk", "starker"], miss="Erkläre auch die zweite Bedeutung: Wer Maschinen hatte, gewann Geld und Macht.")],
            ok="Sehr gut. Boulton verkaufte Dampfmaschinen, also Antriebskraft. Wer diese Kraft besaß, konnte mehr herstellen, wurde reicher und mächtiger. Länder mit Maschinen bekamen einen Vorsprung."),
        "Weiterdenken power", ["quellenarbeit"], tag="Weiterdenken · Quelle"))

m.section("medien", "Quelle oder Darstellung?", "Quelle oder Darstellung?",
    '<p>Eine <strong>Quelle</strong> stammt aus der Zeit, um die es geht, oder sie ist ein Überrest aus dieser Zeit. Eine <strong>Darstellung</strong> wurde später verfasst, zum Beispiel von Historikerinnen, Schulbuchautoren oder Filmemachern.</p>'
    + m.multi("q1", "Q1. Welche dieser Materialien sind Quellen aus der Zeit der frühen Industrialisierung? Wähle alle zutreffenden aus.",
        [("patent", "Die Patenturkunde von James Watt aus dem Jahr 1769"),
         ("karte", "Die Karte von Großbritannien in diesem Modul"),
         ("boswell", "Boswells Bericht über den Besuch in Soho"),
         ("film", "Ein Film über James Watt aus dem Jahr 2020"),
         ("maschine", "Eine erhaltene Dampfmaschine aus dem 18. Jahrhundert im Museum")],
        ["patent", "boswell", "maschine"],
        "Richtig. Patent, Boswells Bericht und die erhaltene Maschine stammen aus der damaligen Zeit. Die Maschine ist eine Sachquelle. Karte und Film sind Darstellungen, die später entstanden.",
        {"karte": "Die Karte wurde für dieses Modul gezeichnet. Sie ist eine Darstellung, keine Quelle.",
         "film": "Ein Film von 2020 ist eine Darstellung. Er zeigt, wie Menschen heute die Vergangenheit sehen."},
        "Quelle und Darstellung", ["quellenarbeit", "zeit_raum"], tag="Quelle oder Darstellung"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Akte 001</span>
 <p><strong>Fall:</strong> Im Archiv liegt eine Karteikarte. Darauf steht: <em>„Die Industrialisierung begann in England, weil James Watt die Dampfmaschine erfunden hat.“</em></p>
 <p><strong>Dein Auftrag:</strong> Prüfe, ob eine einzige Erfindung als Erklärung reicht. Am Ende entscheidest du, ob die Karteikarte stimmt oder ergänzt werden muss.</p>
</div>
<p><strong>Zum Einstieg:</strong> Sieh auf das Etikett deines T-Shirts. Wahrscheinlich steht dort „Baumwolle“ und ein weit entferntes Herstellungsland. Dass Stoff in großen Fabriken mit Maschinen hergestellt wird, ist heute normal. Angefangen hat das vor rund 250 Jahren in England, und zwar genau mit Baumwolle.</p>
{chronos("Ich habe die Karteikarte selbst geschrieben. Eine Ursache, eine Erfindung, fertig. Meine Kollegin im Archiv meint, das sei zu kurz gedacht. Hilf mir, die Sache zu klären.")}
<p><strong>Leitfrage:</strong> Warum begann die Industrialisierung in England?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Kartenleser</span>
 <span class="abz" id="abz2">Ursachenforscher</span>
 <span class="abz" id="abz3">Quellenprüfer</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Schätzfrage", "D1. Wann begann die Industrialisierung in England ungefähr?",
     [("a", "Um 1500"), ("b", "In der zweiten Hälfte des 18. Jahrhunderts, also ab etwa 1760"), ("c", "Um 1900")], "b"),
    ("d2", "Richtig oder falsch", "D2. Vor der Industrialisierung wurden Garn und Stoffe vor allem von Hand hergestellt, oft zu Hause in den Familien.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "r"),
    ("d3", "Vermutung", "D3. Welcher Brennstoff war für die Dampfmaschinen am wichtigsten?",
     [("a", "Erdöl"), ("b", "Steinkohle"), ("c", "Stroh")], "b")],
    dict(alle="Drei von drei. Deine Vermutungen passen gut. Der Lernweg Weiterdenken könnte für dich spannend sein.",
         fast="Zwei von drei. Gute Grundlage. Im Modul erfährst du, wie alles zusammenhängt.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da. Der Lernweg Sicher werden gibt dir mehr Hilfen.",
         extra=[dict(n="d3", v="a", m="Ein Hinweis vorab: Erdöl wurde erst viel später wichtig. Die Industrialisierung lief mit Kohle.")]))

gloss = glossar_section([
    ("Industrialisierung", "Der Übergang von der Handarbeit zur Herstellung mit Maschinen in Fabriken. Sie begann um 1760 in England und erreichte Deutschland ab etwa 1835."),
    ("Industrielle Revolution", "Ein anderer Name für die frühe Industrialisierung. Das Wort „Revolution“ soll zeigen, wie tief die Veränderung war, auch wenn sie Jahrzehnte dauerte."),
    ("Dampfmaschine", "Eine Maschine, die mit der Kraft von Wasserdampf arbeitet. Der Dampf entsteht, wenn Kohle Wasser erhitzt. James Watt hat sie nicht erfunden, aber stark verbessert."),
    ("Kapital", "Geld oder Besitz, das man einsetzt, um ein Unternehmen zu gründen oder Maschinen zu kaufen, in der Hoffnung auf Gewinn."),
    ("Patent", "Ein Recht, das eine Erfindung für einige Jahre schützt. Nur der Erfinder darf sie dann nutzen oder verkaufen."),
    ("Kolonie", "Ein Gebiet, das von einem fremden Staat beherrscht und ausgebeutet wird. England besaß Kolonien in Amerika, in der Karibik und in Asien."),
    ("Einhegung", "Großgrundbesitzer zäunten früher gemeinsam genutzte Weiden und Felder ein. Viele kleine Bauern und Landarbeiter verloren dadurch ihr Auskommen."),
    ("Koks", "Ein Brennstoff, der aus Steinkohle gewonnen wird. Mit Koks lässt sich Eisen in großen Mengen schmelzen."),
    ("Quelle und Darstellung", "Eine Quelle stammt aus der Zeit selbst, zum Beispiel ein Bericht, ein Patent oder eine Maschine. Eine Darstellung wurde später über die Vergangenheit verfasst.")],
    ["James Boswell, The Life of Samuel Johnson, London 1791, Abschnitt zum Jahr 1776 (Besuch in Soho). Englischer Wortlaut nach der gemeinfreien Ausgabe; deutsche Übersetzung für dieses Modul, leicht vereinfacht.",
     "Bevölkerungszahlen England und Wales: Schätzungen für 1750 liegen bei etwa 6 Millionen, die erste Volkszählung 1801 ergab knapp 9 Millionen.",
     "Erfindungen und Jahreszahlen nach dem Forschungsstand: Darby 1709, Newcomen 1712, Hargreaves um 1764, Watts Patent 1769, Arkwright in Cromford 1771, Cartwright 1785, Eisenbahn Liverpool und Manchester 1830.",
     "Großbritannien verbot 1807 den Sklavenhandel und 1833 die Sklaverei in seinen Kolonien.",
     "Karte und Zeitleiste sind eigene schematische Darstellungen."])

lc = lerncheck_section(["Ich kann mehrere Voraussetzungen der Industrialisierung in England nennen.",
                        "Ich kann erklären, warum Kohle und Dampfmaschine zusammengehören.",
                        "Ich kann Quelle und Darstellung unterscheiden."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf Chronos\' Karteikarte steht: <em>„Die Industrialisierung begann in England, weil James Watt die Dampfmaschine erfunden hat.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt so. Ohne Watt hätte es keine Industrialisierung gegeben."),
     ("b", "Die Karte ist zu einfach. Die Dampfmaschine war wichtig, aber erst mehrere Voraussetzungen zusammen erklären den Beginn in England."),
     ("c", "Die Dampfmaschine spielte überhaupt keine Rolle."),
     ("d", "Die Karte ist ungenau: Watt hat die Dampfmaschine verbessert, nicht erfunden. Außerdem waren Kohle, Kapital, Handel und Arbeitskräfte nötig.")],
    ["b", "d"],
    {"a": "Prüfe das noch einmal. Watt war wichtig, aber denke an die Karte: Ohne Kohle, Geld, Häfen und Arbeitskräfte hätte seine Maschine wenig genützt. Und erfunden hat er sie auch nicht.",
     "b": "Gut entschieden. Du erkennst, dass mehrere Ursachen zusammenwirken mussten. Begründe das jetzt in A2.",
     "c": "Das geht zu weit. Die Dampfmaschine war sehr wichtig, weil sie Fabriken unabhängig von Wasserkraft machte. Sie war aber nicht die einzige Ursache.",
     "d": "Gut entschieden. Du korrigierst sogar einen Fehler auf der Karte: Watt hat die Maschine verbessert. Und du nennst weitere Ursachen. Begründe das jetzt in A2."},
    "Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, warum die Industrialisierung in England begann. Nenne mindestens drei Voraussetzungen und verbinde sie miteinander.",
    "Lieber Chronos, deine Karte muss ergänzt werden, weil ...",
    "„In England gab es viel Kohle, deshalb ...“ · „Außerdem hatten Kaufleute und Banken Kapital, weil ...“ · „Die Dampfmaschine war wichtig, denn ...“",
    dict(min=80, worte=20, need=3, saetze=3, gruppen=[
        dict(w=["kohle", "eisen", "rohstoff", "bodenscha", "erz"], miss="Nenne die Bodenschätze, zum Beispiel Kohle und Eisen."),
        dict(w=["kapital", "geld", "bank", "handel", "kolon", "kaufleute", "kaufmann", "gewinn", "reich"], miss="Erkläre, woher das Geld für Fabriken kam, zum Beispiel Kapital aus dem Handel."),
        dict(w=["bevolker", "arbeitskr", "menschen", "arbeiter", "landarbeit", "einheg"], miss="Denke an die Menschen: Es gab viele Arbeitskräfte."),
        dict(w=["dampf", "maschin", "erfind", "spinn", "watt", "kanal", "hafen", "transport", "patent"], miss="Nenne die Technik, etwa Dampfmaschine, Spinnmaschinen oder Kanäle.")],
        ok="Sehr gut. Du nennst mehrere Voraussetzungen und verbindest sie. Genau das ist der Kern: Kohle, Kapital, Arbeitskräfte und Erfindungen kamen in England zusammen. Abzeichen Begründer freigeschaltet."))

build(m, "Ermittlung starten",
      ["Du nennst Voraussetzungen der Industrialisierung in England.",
       "Du findest wichtige Orte der frühen Industrie auf einer Karte.",
       "Du erklärst, wie Erfindungen, Kohle und Dampfmaschine zusammenhängen.",
       "Du erklärst, wie Kolonialhandel und Sklaverei mit dem Reichtum Englands verbunden waren.",
       "Du wertest eine Quelle aus und unterscheidest Quelle und Darstellung."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos wartet schon. Es geht weiter mit der Mission.")
