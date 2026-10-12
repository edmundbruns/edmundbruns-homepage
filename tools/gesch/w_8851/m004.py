# -*- coding: utf-8 -*-
from common import *

m = Modul("004", "Wie lebten Menschen in der Altsteinzeit?", "Altsteinzeit",
          "Frühe Menschen und Hochkulturen · Zeitreise 004",
          "Keine Häuser, keine Felder, keine Metalle. Trotzdem überlebten Menschen hunderttausende Jahre lang, sogar in der Eiszeit. Wie haben sie das geschafft? In diesem Modul begleitest du eine Gruppe von Jägern und Sammlerinnen und untersuchst einen weltberühmten Fund aus Niedersachsen.",
          "Weiter geht es mit Modul 005: Warum wurden Menschen sesshaft?",
          badges=[dict(id="abz1", name="Zeitreisende", tasks=["zeit"]),
                  dict(id="abz2", name="Lagerkundige", tasks=["lager", "wandern"]),
                  dict(id="abz3", name="Speerexpertin", tasks=["speer", "beweis"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])],
          bereich="Frühe Menschen und Hochkulturen")

# ---------- Ein Tag Menschheitsgeschichte ----------
TAG = '''<div class="svgwrap"><svg class="pic" style="max-width:640px;margin:auto" viewBox="0 0 400 210" role="img" aria-label="Balken für einen Tag von 0 bis 24 Uhr. Fast der ganze Balken ist Altsteinzeit. Erst etwa sechs Minuten vor Mitternacht endet die Altsteinzeit, und das Jahr 1 liegt etwa eine Minute vor Mitternacht.">
<rect width="400" height="210" fill="#fbf6ee"/>
<text x="200" y="22" text-anchor="middle" font-size="16" font-weight="800" fill="#2a1c12">Wenn die Geschichte der Menschen ein Tag wäre</text>
<rect x="20" y="44" width="350" height="34" rx="6" fill="#c98b4e"/>
<rect x="364" y="44" width="6" height="34" fill="#2f6b3a"/>
<text x="190" y="67" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">Altsteinzeit</text>
<text x="20" y="98" font-size="15" fill="#2a1c12">0 Uhr</text><text x="370" y="98" text-anchor="end" font-size="15" fill="#2a1c12">24 Uhr</text>
<path d="M364 80 L170 128 M370 80 L380 128" stroke="#6a5a4c" stroke-width="1.5" stroke-dasharray="4 3"/>
<rect x="170" y="128" width="210" height="40" rx="6" fill="#e9f1e6" stroke="#6a5a4c"/>
<rect x="170" y="128" width="46" height="40" rx="6" fill="#c98b4e"/><rect x="200" y="128" width="16" height="40" fill="#c98b4e"/>
<rect x="351" y="128" width="3" height="40" fill="#2a1c12"/>
<text x="352" y="122" text-anchor="middle" font-size="14" font-weight="700" fill="#2a1c12">Jahr 1</text>
<text x="284" y="153" text-anchor="middle" font-size="14" fill="#2f6b3a">danach</text>
<path d="M216 172 V180" stroke="#2a1c12" stroke-width="2"/>
<text x="150" y="198" font-size="14" fill="#2a1c12">23:53 Uhr: Ende der Altsteinzeit</text>
<text x="20" y="140" font-size="14" fill="#6a5a4c">Lupe auf die</text><text x="20" y="158" font-size="14" fill="#6a5a4c">letzten Minuten:</text>
</svg></div>'''

# ---------- Lager der Altsteinzeit ----------
def person(x, y, farbe="#8a4317", s=1):
    return (f'<circle cx="{x}" cy="{y-30*s}" r="{7*s}" fill="#e3b98f" stroke="#5b2c0f" stroke-width="1.2"/>'
            f'<path d="M{x-8*s} {y} L{x-6*s} {y-22*s} Q{x} {y-26*s} {x+6*s} {y-22*s} L{x+8*s} {y} Z" fill="{farbe}" stroke="#4a2410" stroke-width="1.2"/>')
LAGER = f'''<div class="svgwrap"><svg class="pic" style="max-width:640px;margin:auto" viewBox="0 0 400 260" role="img" aria-label="Schematische Zeichnung eines Lagers in der Eiszeit: ein Zelt aus Fellen, eine Feuerstelle, ein Mensch stellt Werkzeug her, eine Person sammelt Beeren, Jäger mit Speeren und Wildpferde in der Ferne.">
<rect width="400" height="260" fill="#eef3f6"/>
<path d="M0 120 Q80 96 160 112 T320 104 T400 112 V260 H0Z" fill="#cfd8c4"/>
<path d="M0 150 H400 V260 H0Z" fill="#d9d3b8"/>
<path d="M30 160 q20 -6 40 0 M300 236 q24 -6 48 0" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
<g id="hZelt" class="hot" data-task="lager" tabindex="0" role="button" aria-label="Zelt aus Fellen">
 <rect x="18" y="80" width="110" height="120" fill="#fff" fill-opacity=".01"/>
 <path d="M30 196 L72 92 L118 196 Z" fill="#a4733f" stroke="#5b3413" stroke-width="2.5"/>
 <path d="M66 82 L72 92 L80 80 M72 92 L60 196 M72 92 L86 196" stroke="#5b3413" stroke-width="2.5" fill="none"/>
 <path d="M62 196 L72 150 L84 196Z" fill="#4a2a12"/>
</g>
<g id="hFeuer" class="hot" data-task="lager" tabindex="0" role="button" aria-label="Feuerstelle">
 <rect x="160" y="168" width="70" height="56" fill="#fff" fill-opacity=".01"/>
 <ellipse cx="195" cy="214" rx="30" ry="8" fill="#8c8178"/>
 <path d="M180 212 q4 -26 15 -38 q2 14 10 20 q4 -10 2 -18 q14 16 4 36 Z" fill="#f0a020" stroke="#c0501a" stroke-width="2"/>
 <path d="M190 212 q2 -12 6 -18 q4 10 6 18Z" fill="#fde07a"/>
</g>
<g id="hWerkzeug" class="hot" data-task="lager" tabindex="0" role="button" aria-label="Mensch, der ein Steinwerkzeug herstellt">
 <rect x="236" y="168" width="58" height="62" fill="#fff" fill-opacity=".01"/>
 {person(258, 226, "#7a5a3a", 1.3)}
 <path d="M272 206 l12 -6 l4 8 l-12 5Z" fill="#6b6f73" stroke="#2a1c12" stroke-width="1.5"/>
 <path d="M280 196 l6 -4 M286 200 l7 -2" stroke="#2a1c12" stroke-width="1.5"/>
</g>
<g id="hSammeln" class="hot" data-task="lager" tabindex="0" role="button" aria-label="Person sammelt Beeren">
 <rect x="94" y="196" width="80" height="62" fill="#fff" fill-opacity=".01"/>
 <ellipse cx="150" cy="236" rx="22" ry="14" fill="#5f8a3a"/>
 <circle cx="142" cy="232" r="3" fill="#b0243a"/><circle cx="152" cy="228" r="3" fill="#b0243a"/><circle cx="158" cy="238" r="3" fill="#b0243a"/><circle cx="146" cy="242" r="3" fill="#b0243a"/>
 {person(112, 254, "#9a6a3a", 1.3)}
 <path d="M122 236 h12 l-2 10 h-8z" fill="#c8a060" stroke="#5b3413" stroke-width="1.5"/>
</g>
<g id="hJagd" class="hot" data-task="lager" tabindex="0" role="button" aria-label="Jäger mit Speeren und Wildpferde">
 <rect x="236" y="96" width="160" height="68" fill="#fff" fill-opacity=".01"/>
 {person(252, 158, "#6e4a2a", .9)}{person(272, 160, "#7a5030", .9)}
 <path d="M244 160 L262 112 M266 162 L284 114" stroke="#5b3413" stroke-width="2.5"/>
 <g fill="#7a5a3a"><ellipse cx="330" cy="124" rx="16" ry="7"/><path d="M344 122 l8 -10 l4 3 l-6 10Z"/><path d="M318 128 v12 M324 129 v12 M336 129 v12 M342 128 v12" stroke="#7a5a3a" stroke-width="3"/>
 <ellipse cx="372" cy="132" rx="14" ry="6"/><path d="M384 130 l7 -9 l4 3 l-6 9Z"/><path d="M362 135 v10 M368 136 v10 M378 136 v10 M383 135 v10" stroke="#7a5a3a" stroke-width="3"/></g>
</g>
<text x="396" y="20" text-anchor="end" font-size="14" fill="#6a5a4c">Schematische Zeichnung</text>
</svg></div>'''

FAUSTKEIL = '''<svg viewBox="0 0 120 150" width="110" height="138" role="img" aria-label="Zeichnung eines Faustkeils, tropfenförmig mit Schlagspuren" style="flex:0 0 auto">
<path d="M60 8 C 92 40, 104 92, 92 120 C 82 142, 38 142, 28 120 C 16 92, 28 40, 60 8Z" fill="#9c9488" stroke="#3a3530" stroke-width="3"/>
<path d="M60 8 L58 50 M40 60 L58 50 L80 62 M34 96 L56 88 L86 100 M56 88 L58 50 M48 128 L56 88 L72 130" stroke="#5f5850" stroke-width="2" fill="none"/>
</svg>'''

SPEER = '''<div class="svgwrap"><svg class="pic" style="max-width:520px;margin:auto" viewBox="0 0 400 320" role="img" aria-label="Größenvergleich: ein Kind mit 1,45 Meter, ein Erwachsener mit 1,75 Meter und ein Schöninger Speer mit etwa 2,30 Meter Länge. Der Speer ist deutlich länger als beide.">
<rect width="400" height="320" fill="#fbf6ee"/>
<line x1="10" y1="300" x2="390" y2="300" stroke="#6a5a4c" stroke-width="2"/>
<g stroke="#6a5a4c" stroke-width="1.5"><line x1="330" y1="300" x2="330" y2="30"/><line x1="324" y1="300" x2="336" y2="300"/><line x1="324" y1="180" x2="336" y2="180"/><line x1="324" y1="60" x2="336" y2="60"/></g>
<g font-size="15" fill="#2a1c12"><text x="342" y="305">0 m</text><text x="342" y="185">1 m</text><text x="342" y="65">2 m</text></g>
<circle cx="70" cy="140" r="14" fill="#e3b98f" stroke="#5b2c0f" stroke-width="2"/>
<path d="M54 210 L56 158 Q70 150 84 158 L86 210 Z" fill="#8a4317"/><path d="M58 210 L58 300 M82 210 L82 300" stroke="#2a1c12" stroke-width="7"/>
<circle cx="165" cy="106" r="15" fill="#e3b98f" stroke="#5b2c0f" stroke-width="2"/>
<path d="M146 190 L149 126 Q165 116 181 126 L184 190 Z" fill="#6a5a4c"/><path d="M151 190 L151 300 M179 190 L179 300" stroke="#2a1c12" stroke-width="8"/>
<path d="M259 300 L264 26 L269 300 Z" fill="#c98b4e" stroke="#7a4a24" stroke-width="2.5"/>
<text x="70" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#2a1c12">Kind</text>
<text x="70" y="318" text-anchor="middle" font-size="14" fill="#2a1c12">1,45 m</text>
<text x="165" y="86" text-anchor="middle" font-size="15" font-weight="700" fill="#2a1c12">Erwachsener</text>
<text x="165" y="318" text-anchor="middle" font-size="14" fill="#2a1c12">1,75 m</text>
<text x="272" y="22" text-anchor="end" font-size="15" font-weight="700" fill="#8a4317">Speer</text>
<text x="264" y="318" text-anchor="middle" font-size="14" fill="#8a4317">etwa 2,30 m</text>
</svg></div>'''

HOEHLE = '''<div class="svgwrap"><svg class="pic" style="max-width:560px;margin:auto" viewBox="0 0 400 220" role="img" aria-label="Nachzeichnung eines Wildpferdes in Rot und Schwarz auf einer Felswand, im Stil der Höhlenmalerei.">
<rect width="400" height="220" fill="#e6d3b3"/>
<path d="M0 0 H400 V30 Q300 50 200 30 T0 40Z" fill="#cdb48e"/><path d="M0 220 V190 Q120 170 220 196 T400 186 V220Z" fill="#cdb48e"/>
<g transform="translate(70 40)">
 <path d="M40 70 Q60 40 120 44 Q170 40 196 60 Q214 74 210 96 Q190 116 140 112 Q90 118 60 104 Q36 94 40 70Z" fill="#b5532b" opacity=".9"/>
 <path d="M196 60 Q214 30 238 26 Q252 30 250 44 Q240 52 230 52 Q222 66 212 80" fill="#b5532b" opacity=".9"/>
 <path d="M200 52 Q214 26 236 22" stroke="#2a1c12" stroke-width="7" fill="none" stroke-linecap="round"/>
 <path d="M70 108 L62 150 M92 112 L90 152 M160 112 L166 150 M186 104 L196 146" stroke="#2a1c12" stroke-width="6" stroke-linecap="round"/>
 <path d="M42 72 Q22 80 18 104" stroke="#2a1c12" stroke-width="6" fill="none" stroke-linecap="round"/>
 <circle cx="238" cy="36" r="2.5" fill="#2a1c12"/>
</g>
<text x="390" y="212" text-anchor="end" font-size="13" fill="#4a3a2a">Nachzeichnung im Stil der Höhlenbilder, keine Kopie</text>
</svg></div>'''

m.section("zeit", "Die längste Zeit", "Die längste Zeit der Menschheit",
    '<p>Die <strong>Altsteinzeit</strong> begann vor über 2,5 Millionen Jahren, als Menschen die ersten Steinwerkzeuge herstellten. Sie endete in Mitteleuropa erst vor etwa 11.700 Jahren, also um 9700 v. Chr. Das Wort „Steinzeit“ kommt daher, dass die Menschen ihre wichtigsten Werkzeuge aus Stein machten. Metall kannten sie noch nicht.</p>'
    + TAG +
    '<div class="legendlist" aria-hidden="true"><span>Eigene Darstellung, Werte gerundet</span></div>'
    + m.mc("zeit", "Z1. Was zeigt der Tages-Balken?",
        [("a", "Die Altsteinzeit war nur ein kurzer Moment in der Geschichte der Menschen."),
         ("b", "Die Altsteinzeit war mit Abstand der längste Abschnitt der Menschheitsgeschichte."),
         ("c", "Die Altsteinzeit begann erst nach dem Jahr 1.")],
        "b",
        {"a": "Sieh noch einmal hin: Fast der ganze Balken gehört zur Altsteinzeit. Nur die letzten Minuten nicht.",
         "b": "Genau. Wenn die ganze Geschichte der Menschen ein Tag wäre, dann wäre fast der ganze Tag Altsteinzeit. Alles, was danach kam, passt in die letzten sechs Minuten vor Mitternacht.",
         "c": "Nein, die Altsteinzeit liegt lange vor dem Jahr 1. Das Jahr 1 ist erst ganz am Ende des Balkens."},
        "Zeitraum der Altsteinzeit", ["zeit_raum"], tag="Diagramm lesen")
    + '<h3>Leben in der Eiszeit</h3>'
    '<p>In der Altsteinzeit wechselten sich sehr kalte Zeiten und wärmere Zeiten ab. Die kalten Zeiten nennt man <strong>Eiszeiten</strong> oder Kaltzeiten. Dann war es bei uns viel kälter als heute. Statt Wäldern gab es eine weite, baumarme Landschaft aus Gras, Moos und Sträuchern. Dort lebten Mammuts, Wollnashörner, Rentiere und Wildpferde. Zeitweise schob sich riesiges Eis aus Skandinavien bis nach Niedersachsen vor.</p>'
    + '<details class="gloss"><summary>Überraschender Fund aus dem Archiv</summary><div class="body">Die riesigen Felsbrocken, die im Emsland auf Feldern liegen, heißen Findlinge. Das Eis hat sie in einer Eiszeit aus Skandinavien mitgebracht. Viel später haben Menschen daraus Großsteingräber gebaut. Davon erfährst du mehr in Modul 005.</div></details>')

m.section("lager", "Im Lager", "Ein Tag im Lager der Jäger und Sammlerinnen",
    '<p>Die Menschen der Altsteinzeit lebten in kleinen Gruppen zusammen. Fachleute schätzen, dass eine Gruppe oft aus etwa 20 bis 30 Menschen bestand, meist mehreren verwandten Familien. Allein hätte niemand in der Eiszeit überlebt. Sie waren <strong>Jäger und Sammlerinnen</strong>: Sie jagten Tiere und sammelten Pflanzen, Beeren, Nüsse und Wurzeln.</p>'
    + LAGER +
    m.hot("lager",
        [("hFeuer", "Wo wärmen sich die Menschen, braten Fleisch und halten wilde Tiere fern?",
          "Richtig, die Feuerstelle. Feuer gab Wärme und Licht, machte Fleisch weich und schützte nachts vor Raubtieren."),
         ("hZelt", "Wo schlafen die Menschen und schützen sich vor Wind und Schnee?",
          "Genau, das Zelt. Die meisten Menschen der Altsteinzeit wohnten nicht in Höhlen, sondern in Zelten oder Hütten aus Holzstangen und Tierfellen. Die konnte man abbauen und mitnehmen."),
         ("hWerkzeug", "Wo entstehen neue Werkzeuge aus Stein?",
          "Richtig. Mit einem harten Schlagstein schlug man Stücke von einem Feuerstein ab. So entstanden scharfe Klingen, Schaber und Faustkeile."),
         ("hSammeln", "Wo besorgt jemand Nahrung, ohne zu jagen?",
          "Genau. Beeren, Nüsse, Pilze und Wurzeln waren sehr wichtig. Ohne Sammeln hätten die Menschen nicht genug zu essen gehabt.")],
        [("hFeuer", "Feuerstelle"), ("hZelt", "Zelt"), ("hWerkzeug", "Werkzeug herstellen"), ("hSammeln", "Sammeln"), ("hJagd", "Jagd")],
        "Alle vier gefunden. Jeder in der Gruppe hatte Aufgaben, und nur zusammen kamen sie durch den Winter.",
        "Lager erkunden", ["fachwissen"], tag="Bildarbeit", titel="Suchauftrag im Lager")
    + '<div class="notice"><strong>Gut zu wissen:</strong> Früher dachte man oft: Die Männer jagen, die Frauen sammeln. Heute sind sich Fachleute da nicht mehr so sicher. Wahrscheinlich haben alle mitgeholfen, wo es gerade nötig war.</div>'
    + m.order("wandern",
        ["Die Menschen leben nur von dem, was sie jagen und sammeln.",
         "Die Tierherden ziehen im Lauf des Jahres weiter, zum Beispiel die Rentiere.",
         "Die Gruppe folgt den Herden und zieht an einen neuen Ort.",
         "Deshalb bauen sie keine festen Häuser und besitzen nur, was sie tragen können."],
        "Genau. Weil die Nahrung umherzog, zogen auch die Menschen umher. Menschen, die so leben, nennt man Nomaden.",
        "Frage dich: Was ist der Grund, und was folgt daraus?",
        "Ursache und Folge: Umherziehen", ["ursachen_folgen"], tag="Ursache-Folge-Kette",
        intro='<p><strong>Warum zogen die Menschen umher?</strong> Bringe die Kette in die richtige Reihenfolge. Sie beginnt mit der Ursache und endet mit der Folge.</p>'))

m.section("werkzeug", "Feuer und Faustkeil", "Feuer und Faustkeil",
    '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">' + FAUSTKEIL +
    '<p style="flex:1 1 220px;margin:0">Das bekannteste Werkzeug der Altsteinzeit ist der <strong>Faustkeil</strong>. Er liegt gut in der Hand und hat scharfe Kanten. Damit konnte man schneiden, schaben, hacken und graben. Die ältesten Faustkeile sind etwa 1,7 Millionen Jahre alt. Später stellten die Menschen auch feine Klingen, Nadeln aus Knochen und Speere her.</p></div>'
    '<p class="hint">Zeichnung eines Faustkeils, etwa so groß wie eine Hand.</p>'
    + m.luecke("feuer",
        ["Einen Faustkeil stellte man her, indem man mit einem harten Stein Stücke von einem ", ("Feuerstein", ["Holzstück", "Eisstück"]),
         " abschlug. Noch wichtiger war das Feuer. Es spendete ", ("Wärme", ["Strom", "Regen"]),
         " und Licht. Gebratenes Fleisch war leichter zu ", ("kauen", ["kaufen", "zählen"]),
         ". Und das Feuer hielt nachts ", ("wilde Tiere", ["die Sterne", "den Wind"]),
         " vom Lager fern."],
        "Alles richtig. Werkzeuge und Feuer machten es möglich, dass Menschen sogar in der Eiszeit überleben konnten.",
        "Lies die Sätze genau und überlege, was wirklich passt.",
        "Faustkeil und Feuer", ["fachwissen"], tag="Lückentext",
        intro='<p><strong>Auftrag:</strong> Wähle in jeder Lücke das passende Wort.</p>'))

m.section("kunst", "Kunst in der Höhle", "Kunst in der Höhle",
    '<p>1940 entdeckten vier Jugendliche in Frankreich die Höhle von <strong>Lascaux</strong>. An den Wänden fanden sie hunderte Bilder von Pferden, Wildrindern, Hirschen und anderen Tieren. Die Bilder sind etwa 17.000 bis 20.000 Jahre alt, die genaue Datierung ist unter Fachleuten umstritten. Die Farben machten die Menschen aus farbiger Erde und Holzkohle.</p>'
    + HOEHLE +
    m.multi("kunst", "K1. Die Höhlenbilder sind Bildquellen. Was können wir aus ihnen sicher schließen? Wähle alle richtigen Aussagen aus.",
        [("tiere", "Die Menschen kannten die Tiere sehr genau."),
         ("farbe", "Sie konnten Farben herstellen und damit malen."),
         ("wohnen", "Die Menschen haben in dieser Höhle gewohnt."),
         ("grund", "Wir wissen genau, warum die Bilder gemalt wurden.")],
        ["tiere", "farbe"],
        "Richtig. Die Bilder zeigen, wie gut die Menschen die Tiere beobachtet haben und dass sie Farben herstellen konnten. Warum sie gemalt haben, ist bis heute ein Rätsel.",
        {"wohnen": "Das zeigen die Bilder nicht. Viele Bilderhöhlen waren dunkel und schwer zu erreichen. Gewohnt haben die Menschen meist an anderen Orten.",
         "grund": "Leider nein. Vielleicht ging es um Jagdzauber, um Geschichten oder um Feste. Das sind aber nur Vermutungen. Die Bilder sagen es uns nicht."},
        "Höhlenbilder deuten", ["quellenarbeit", "perspektivitaet"], tipp="Unterscheide: Was sieht man wirklich, und was ist nur eine Vermutung?", tag="Bildquelle"))

STECKBRIEF = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Sachquelle: die Schöninger Speere.</strong> Heute im Forschungsmuseum Schöningen, Landkreis Helmstedt, Niedersachsen.</p>
 <ul class="facts">
  <li><b>Gefunden:</b> 1994 bis 1998 im Braunkohletagebau Schöningen, etwa zehn Meter tief in alten Schichten am Ufer eines früheren Sees. Die Ausgrabung leitete der Archäologe Hartmut Thieme.</li>
  <li><b>Was ist es?</b> Neun Wurfspeere und eine Stoßlanze aus Holz, meist aus Fichte, einer aus Kiefer. Die Speere sind etwa 1,80 bis 2,30 Meter lang.</li>
  <li><b>Was lag daneben?</b> Viele Steinwerkzeuge und tausende Tierknochen, vor allem von Wildpferden. An manchen Knochen sieht man Schnittspuren.</li>
  <li><b>Wie alt?</b> Lange schätzte man 300.000 Jahre oder mehr. Eine neue Untersuchung von 2025 kommt auf etwa 200.000 Jahre. Fachleute diskutieren noch darüber.</li>
 </ul>
 <p class="hint">Es sind die ältesten vollständig erhaltenen Jagdwaffen der Welt. Angaben nach dem Forschungsstand.</p>
</div>'''

m.section("quelle", "Die Quelle", "Die Quelle: die Schöninger Speere",
    '<p>Die meisten Funde aus der Altsteinzeit sind aus Stein. Holz verrottet normalerweise. In Schöningen in Niedersachsen hatten Forscher großes Glück.</p>'
    + STECKBRIEF + SPEER +
    '<div class="legendlist" aria-hidden="true"><span>Größenvergleich: eigene Zeichnung</span></div>'
    + chronos("Stell dir vor: Ein Speer, länger als ein Erwachsener groß ist, und er hat mindestens zweihunderttausend Jahre im Boden gelegen! Da staune sogar ich, und ich habe schon viel gesehen.")
    + m.zuord("speer",
        [("was", "Was ist es?"), ("wo", "Wo wurde es gefunden?"), ("alt", "Wie alt ist es?"), ("wozu", "Wozu wurde es benutzt?")],
        [("Ein Speer aus Fichtenholz, über zwei Meter lang", "was"),
         ("Im Braunkohletagebau Schöningen in Niedersachsen", "wo"),
         ("Am Ufer eines früheren Sees", "wo"),
         ("Etwa 200.000 bis 300.000 Jahre", "alt"),
         ("Zur Jagd auf große Tiere wie Wildpferde", "wozu")],
        "Sehr gut. Mit den W-Fragen hast du den Fund genau beschrieben. Das ist der erste Schritt jeder Quellenarbeit.",
        "Lies den Steckbrief noch einmal. Zu jeder Frage findest du dort eine Antwort.",
        "W-Fragen an die Speere", ["quellenarbeit"], tag="Quellenarbeit mit W-Fragen",
        hilfe="Orte gehören zu „Wo?“, Zahlen mit „Jahre“ zu „Wie alt?“ und „zur Jagd“ zu „Wozu?“.",
        intro='<p><strong>Auftrag:</strong> Ordne jede Karte der passenden W-Frage zu.</p>')
    + m.mc("beweis", "S2. Was verraten die Speere über die Menschen, die sie gemacht haben?",
        [("a", "Sie konnten planen und gemeinsam jagen. Sie suchten passendes Holz, formten es geschickt und jagten große, schnelle Tiere."),
         ("b", "Sie haben nur Pflanzen gegessen und nie gejagt."),
         ("c", "Sie kannten schon Metall, denn die Speere haben Eisenspitzen.")],
        "a",
        {"a": "Genau. Wer solche Speere baut, muss vorausdenken. Und Wildpferde jagt man nicht allein, sondern in der Gruppe. Die Menschen damals waren also klug und gut organisiert.",
         "b": "Nein. Neben den Speeren lagen tausende Pferdeknochen mit Schnittspuren. Die Menschen haben gejagt.",
         "c": "Nein. Die Speere sind ganz aus Holz. Metall kannten die Menschen der Altsteinzeit noch nicht."},
        "Was die Speere beweisen", ["quellenarbeit", "fachwissen"], tag="Schlussfolgern")
    + m.text("q2", "Q2. Holz verrottet normalerweise. Warum sind die Speere von Schöningen trotzdem erhalten geblieben? Denk an das, was du in Modul 002 über das Moor gelernt hast.",
        "Die Speere blieben erhalten, weil ...",
        dict(min=40, worte=10, need=2, saetze=1, gruppen=[
            dict(w=["nass", "wasser", "schlamm", "see", "ufer", "feucht", "schicht", "boden", "tief", "moor"], miss="Beschreibe, wo die Speere lagen, zum Beispiel in nassen Schichten am See."),
            dict(w=["luft", "sauerstoff", "verrott", "zersetz", "pilz", "bakter", "luftdicht"], miss="Erkläre, warum Holz dort nicht verrottet: Es kam kaum Luft heran.")],
            ok="Sehr gut. Die Speere lagen tief in nassen Schichten am Ufer eines früheren Sees. Dort kam kaum Luft heran. Ohne Luft können Pilze und Bakterien das Holz nicht zersetzen, ganz ähnlich wie im Moor."),
        "Weiterdenken Erhaltung", ["ursachen_folgen"], tag="Weiterdenken · Warum erhalten?"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Zeitreise 004</span>
 <p><strong>Fall:</strong> In Chronos' Archiv liegt eine alte Karteikarte: <em>„Steinzeitmenschen waren dumme Höhlenmenschen. Sie konnten nur mit Keulen herumfuchteln.“</em></p>
 <p><strong>Dein Auftrag:</strong> Reise in die Altsteinzeit. Finde heraus, wie die Menschen wirklich lebten. Am Ende entscheidest du, ob die Karteikarte in den Müll gehört.</p>
</div>
<p><strong>Zum Einstieg:</strong> Stell dir vor, du müsstest einen Winter lang draußen überleben. Ohne Haus, ohne Supermarkt, ohne Streichhölzer. Was würdest du als Erstes brauchen?</p>
{chronos("Diese Karteikarte hat ein Kollege vor hundert Jahren geschrieben. Damals stellte man sich die Steinzeit in Comics und Filmen oft so vor. Ich habe da so meine Zweifel. Du auch?")}
<p><strong>Leitfrage:</strong> Wie lebten Menschen in der Altsteinzeit?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Zeitreisende</span>
 <span class="abz" id="abz2">Lagerkundige</span>
 <span class="abz" id="abz3">Speerexpertin</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Schätzfrage", "D1. Wie lange dauerte die Altsteinzeit ungefähr?",
     [("a", "Etwa 100 Jahre"), ("b", "Etwa 1000 Jahre"), ("c", "Mehr als zwei Millionen Jahre")], "c"),
    ("d2", "Richtig oder falsch", "D2. Die Menschen der Altsteinzeit wohnten fast immer in Höhlen.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "f"),
    ("d3", "Vermutung", "D3. Welches Tier lebte in der Eiszeit auch in Norddeutschland?",
     [("a", "Das Mammut"), ("b", "Der Dinosaurier"), ("c", "Das Känguru")], "a")],
    dict(alle="Drei von drei. Stark! Der Lernweg Weiterdenken könnte dir Spaß machen.",
         fast="Zwei von drei. Gute Grundlage. Im Modul erfährst du, wo die Menschen wirklich wohnten.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da. Der Lernweg Sicher werden gibt dir mehr Hilfen.",
         extra=[dict(n="d3", v="b", m="Ein Hinweis vorab: Dinosaurier starben schon vor etwa 66 Millionen Jahren aus, lange bevor es Menschen gab.")]))

gloss = glossar_section([
    ("Altsteinzeit", "Der längste Abschnitt der Menschheitsgeschichte. Er begann vor über 2,5 Millionen Jahren und endete in Mitteleuropa um 9700 v. Chr. Die Menschen machten ihre Werkzeuge vor allem aus Stein."),
    ("Jäger und Sammlerinnen", "Menschen, die von der Jagd und vom Sammeln von Pflanzen leben. Sie bauen nichts an und halten keine Tiere."),
    ("Nomaden", "Menschen, die keinen festen Wohnort haben und mit ihren Zelten umherziehen."),
    ("Eiszeit", "Eine sehr kalte Zeit. In der Altsteinzeit gab es mehrere Eiszeiten. Dazwischen lagen wärmere Zeiten."),
    ("Faustkeil", "Ein Werkzeug aus Stein, das gut in der Hand liegt. Man konnte damit schneiden, schaben und hacken."),
    ("Feuerstein", "Ein sehr harter Stein. Wenn man ihn geschickt schlägt, entstehen scharfe Kanten."),
    ("Höhlenmalerei", "Bilder, die Menschen der Altsteinzeit an Höhlenwände malten, meist Tiere."),
    ("Neandertaler", "Eine Menschenart, die vor etwa 40.000 Jahren ausstarb. Benannt nach dem Neandertal bei Düsseldorf, wo 1856 Knochen gefunden wurden."),
    ("Sachquelle", "Ein Gegenstand aus der Vergangenheit, zum Beispiel ein Speer oder ein Faustkeil.")],
    ["Schöninger Speere: Fund 1994 bis 1998 im Braunkohletagebau Schöningen (Landkreis Helmstedt), Grabungsleitung Hartmut Thieme; neun Wurfspeere und eine Stoßlanze, überwiegend Fichtenholz, etwa 1,80 bis 2,30 Meter lang (Lanze 2,53 Meter); zahlreiche Pferdeknochen mit Schnittspuren. Ausgestellt im Forschungsmuseum Schöningen.",
     "Datierung der Speere: ältere Schätzungen etwa 300.000 bis 400.000 Jahre, Lumineszenz- und Uran-Thorium-Daten um 290.000 bis 337.000 Jahre; eine Studie von 2025 (Universitäten York und Mainz u. a., Aminosäure-Datierung) ergibt etwa 200.000 Jahre.",
     "Höhle von Lascaux: entdeckt am 12. September 1940 von vier Jugendlichen; die Malereien werden meist auf etwa 17.000 bis 20.000 Jahre geschätzt, die Datierung ist umstritten.",
     "Älteste Faustkeile: etwa 1,7 bis 1,75 Millionen Jahre (Afrika). Ende der letzten Kaltzeit vor etwa 11.700 Jahren. Gruppengröße von Jägern und Sammlern: Schätzungen der Forschung, kein genauer Wert.",
     "Tages-Balken: 2,6 Millionen Jahre entsprechen 24 Stunden; 11.700 Jahre entsprechen etwa 6,5 Minuten, 2026 Jahre etwa 1,1 Minuten.",
     "Lager, Faustkeil, Speervergleich und Pferdebild sind eigene schematische Zeichnungen, keine Abbildungen echter Funde."])

lc = lerncheck_section(["Ich kann beschreiben, wie Menschen in der Altsteinzeit lebten und wohnten.",
                        "Ich kann erklären, warum Jäger und Sammlerinnen umherzogen.",
                        "Ich kann mit den Schöninger Speeren zeigen, dass die Menschen damals planen konnten."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf der Karteikarte steht: <em>„Steinzeitmenschen waren dumme Höhlenmenschen. Sie konnten nur mit Keulen herumfuchteln.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt. Die Menschen damals waren einfach nicht schlau."),
     ("b", "Die Karte ist falsch. Die Menschen wohnten meist in Zelten, nutzten Feuer, bauten Speere, jagten gemeinsam und malten Bilder. Sie waren erfinderisch und gut organisiert."),
     ("c", "Die Karte stimmt halb. Sie wohnten zwar nicht in Höhlen, konnten aber sonst nichts.")],
    ["b"],
    {"a": "Denk an die Schöninger Speere und an Lascaux. Wer so etwas schafft, ist alles andere als dumm. Wähle noch einmal.",
     "b": "Sehr gut entschieden. Die Karte ist ein altes Vorurteil. Begründe das jetzt in A2.",
     "c": "Denk an Feuer, Speere und Höhlenbilder. Die Menschen konnten sehr viel. Wähle noch einmal."},
    "Schreibe Chronos eine kurze Nachricht mit zwei bis vier Sätzen. Erkläre, warum die Karteikarte nicht stimmt. Nenne mindestens zwei Beispiele dafür, was die Menschen der Altsteinzeit konnten.",
    "Lieber Chronos, die Karte stimmt nicht, weil ...",
    "„Die Menschen wohnten meist ...“ · „Sie konnten ..., zum Beispiel ...“ · „Die Schöninger Speere zeigen, dass ...“",
    dict(min=60, worte=14, need=2, saetze=2, gruppen=[
        dict(w=["speer", "jagd", "jagt", "jagen", "faustkeil", "werkzeug", "feuer", "pferd"], miss="Nenne etwas, das sie herstellen oder tun konnten, zum Beispiel Speere bauen, jagen oder Feuer nutzen."),
        dict(w=["zelt", "gruppe", "gemeinsam", "zusammen", "plan", "malen", "malerei", "bild", "kunst", "sammel", "klug", "schlau", "organis", "erfinder"], miss="Nenne noch ein zweites Beispiel, etwa das Leben in der Gruppe, die Zelte oder die Höhlenbilder.")],
        ok="Sehr gut. Du widerlegst das Vorurteil mit Beispielen aus den Quellen. Genau so arbeiten Historikerinnen und Historiker. Abzeichen Begründer freigeschaltet."))

build(m, "Zeitreise starten",
      ["Du ordnest die Altsteinzeit zeitlich ein.",
       "Du beschreibst das Leben von Jägern und Sammlerinnen in der Eiszeit.",
       "Du erklärst, warum die Menschen umherzogen.",
       "Du lernst Faustkeil, Feuer und Höhlenmalerei kennen.",
       "Du untersuchst die Schöninger Speere, einen echten Fund aus Niedersachsen."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos hat sich warm angezogen. Es geht weiter mit der Mission.")
