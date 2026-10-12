# -*- coding: utf-8 -*-
from common import *

m = Modul("002", "Wie arbeiten Historikerinnen und Historiker mit Quellen?", "Quellen",
          "Geschichte entdecken · Zeitreise 002",
          "Ein Stück Holz im Moor, eine Scherbe im Acker, ein alter Brief im Archiv. Wie wird aus solchen Spuren Wissen über die Vergangenheit? In diesem Modul arbeitest du wie eine Forscherin oder ein Forscher, mit echten Funden aus Niedersachsen.",
          "Weiter geht es mit Modul 003: Was verraten Familie, Schule und Wohnort über Wandel?",
          badges=[dict(id="abz1", name="Ausgräberin", tasks=["orte", "schichten"]),
                  dict(id="abz2", name="Holzdetektiv", tasks=["ringe"]),
                  dict(id="abz3", name="Quellenprüfer", tasks=["spuren", "nicht"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])],
          bereich="Geschichte entdecken")

# ---------- Werkzeuge der Forschung (Mission) ----------
WERKZEUG = '''<div class="svgwrap"><svg class="pic" style="max-width:560px;margin:auto" viewBox="0 0 400 210" role="img" aria-label="Zeichnung von Werkzeugen der Archäologie: Kelle, Pinsel, Lupe, Zollstock und Fundtüte.">
<rect width="400" height="210" fill="#fbf6ee"/>
<g transform="translate(30 60)"><path d="M0 60 L34 20 L48 34 Z" fill="#b9bfc4" stroke="#4f565c" stroke-width="2.5"/><rect x="40" y="2" width="12" height="34" rx="5" transform="rotate(45 46 19)" fill="#a7682f" stroke="#5b3413" stroke-width="2"/></g>
<text x="58" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#2a1c12">Kelle</text>
<g transform="translate(112 30)"><rect x="8" y="0" width="10" height="56" rx="4" fill="#c98b4e" stroke="#5b3413" stroke-width="2"/><rect x="5" y="54" width="16" height="10" fill="#9aa1a6" stroke="#4f565c" stroke-width="1.5"/><path d="M4 64 h18 l-3 30 h-12 Z" fill="#e2c48d" stroke="#8f5a12" stroke-width="1.5"/></g>
<text x="125" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#2a1c12">Pinsel</text>
<g transform="translate(176 44)"><circle cx="24" cy="24" r="22" fill="#dcebf3" stroke="#4f565c" stroke-width="5"/><rect x="40" y="40" width="12" height="36" rx="5" transform="rotate(-45 46 58)" fill="#2a1c12"/></g>
<text x="208" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#2a1c12">Lupe</text>
<g transform="translate(244 70)"><rect width="72" height="16" fill="#f0d36b" stroke="#8f5a12" stroke-width="2"/><path d="M10 0v7M20 0v5M30 0v7M40 0v5M50 0v7M60 0v5" stroke="#8f5a12" stroke-width="1.5"/></g>
<text x="280" y="150" text-anchor="middle" font-size="15" font-weight="700" fill="#2a1c12">Zollstock</text>
<g transform="translate(340 40)"><path d="M0 8 h46 v62 h-46 Z" fill="#fff" stroke="#6a5a4c" stroke-width="2"/><path d="M0 8 h46 v10 h-46 Z" fill="#d8d0c6"/><text x="23" y="48" text-anchor="middle" font-size="12" fill="#6a5a4c">Fund 7</text></g>
<text x="363" y="150" text-anchor="middle" font-size="15" font-weight="700" fill="#2a1c12">Fundtüte</text>
<text x="200" y="192" text-anchor="middle" font-size="15" fill="#6a5a4c">Werkzeuge der Archäologie (Zeichnung)</text>
</svg></div>'''

# ---------- Bodenprofil ----------
def find_g(fid, name, inner, cx, cy):
    return (f'<g id="{fid}" class="hot" data-task="schichten" tabindex="0" role="button" aria-label="{name}">'
            f'<circle cx="{cx}" cy="{cy}" r="26" fill="#fff" fill-opacity=".01"/>{inner}</g>')
FUNDE = [
    ("hKorken", "Kronkorken", '<circle cx="250" cy="74" r="11" fill="#c9ccd0" stroke="#4f565c" stroke-width="2.5"/><circle cx="250" cy="74" r="5" fill="#e45b4b"/>', 250, 74),
    ("hScherbe", "Tonscherbe", '<path d="M88 132 l26 -8 l10 18 l-22 12 Z" fill="#c26b3a" stroke="#6e3412" stroke-width="2.5"/><path d="M96 136 l18 -5" stroke="#6e3412" stroke-width="1.5"/>', 105, 140),
    ("hBeil", "Steinbeil", '<path d="M262 190 q20 -14 40 -4 q-4 18 -22 22 q-14 -2 -18 -18Z" fill="#7d8790" stroke="#3a4146" stroke-width="2.5"/>', 282, 196),
    ("hKlinge", "Feuersteinklinge", '<path d="M112 256 l48 -16 l8 8 l-52 14 Z" fill="#f3ead8" stroke="#2a1c12" stroke-width="2.5"/>', 142, 250),
]
PROFIL = f'''<div class="svgwrap"><svg class="pic" style="max-width:600px;margin:auto" viewBox="0 0 400 312" role="img" aria-label="Schnitt durch den Boden mit vier Schichten. In der obersten Schicht liegt ein Kronkorken, darunter eine Tonscherbe, darunter ein Steinbeil und ganz unten eine Feuersteinklinge.">
<rect width="400" height="312" fill="#fbf6ee"/>
<rect x="0" y="22" width="400" height="18" fill="#7fa65a"/>
<path d="M10 22 l4 -10 l4 10 M40 22 l3 -8 l3 8 M190 22 l4 -10 l4 10 M330 22 l3 -9 l3 9" stroke="#4f7a32" stroke-width="2" fill="none"/>
<rect x="0" y="40" width="400" height="66" fill="#8b5a33"/>
<rect x="0" y="106" width="400" height="68" fill="#6b4a2e"/>
<rect x="0" y="174" width="400" height="56" fill="#d8b878"/>
<rect x="0" y="230" width="400" height="56" fill="#a59b8c"/>
<g font-size="15" font-weight="700" fill="#fff" paint-order="stroke" stroke="#2a1c12" stroke-width="3">
<text x="392" y="66" text-anchor="end">Schicht 1</text><text x="392" y="132" text-anchor="end">Schicht 2</text>
<text x="392" y="226" text-anchor="end">Schicht 3</text><text x="392" y="280" text-anchor="end">Schicht 4</text></g>
<g font-size="15" font-weight="800" fill="#2a1c12" paint-order="stroke" stroke="#fbf6ee" stroke-width="4">
<text x="8" y="70">oben: jünger</text><text x="8" y="276">unten: älter</text></g>
<path d="M30 84 V246" stroke="#fff" stroke-width="4" stroke-dasharray="6 5"/><path d="M22 244 L30 258 L38 244Z" fill="#fff"/>
{''.join(find_g(*f) for f in FUNDE)}
<text x="200" y="305" text-anchor="middle" font-size="14" fill="#6a5a4c">Schnitt durch den Boden, schematische Zeichnung</text>
</svg></div>'''

# ---------- Baumscheibe ----------
rings = ''
r = 8
widths = [7, 7, 6, 7, 2.5, 2.5, 7, 6, 7, 3, 7, 6]
for i, w in enumerate(widths):
    r += w
    rings += f'<circle cx="100" cy="105" r="{r}" fill="none" stroke="#8a5528" stroke-width="{2.6 if w < 4 else 1.6}"/>'
BAUM = f'''<div class="svgwrap"><svg class="pic" style="max-width:520px;margin:auto" viewBox="0 0 400 230" role="img" aria-label="Zeichnung einer Baumscheibe mit Jahresringen. Einige Ringe sind breit, einige schmal.">
<rect width="400" height="230" fill="#fbf6ee"/>
<circle cx="100" cy="105" r="{r+8}" fill="#7a4a24"/><circle cx="100" cy="105" r="{r+1}" fill="#f1d9b0"/>
{rings}<circle cx="100" cy="105" r="6" fill="#8a5528"/>
<path d="M150 62 L204 44" stroke="#2a1c12" stroke-width="2"/>
<text x="210" y="40" font-size="17" font-weight="800" fill="#2a1c12">breiter Ring:</text><text x="210" y="61" font-size="16" fill="#2a1c12">gutes Jahr,</text><text x="210" y="81" font-size="16" fill="#2a1c12">viel Regen</text>
<path d="M136 128 L204 134" stroke="#2a1c12" stroke-width="2"/>
<text x="210" y="130" font-size="17" font-weight="800" fill="#2a1c12">schmaler Ring:</text><text x="210" y="151" font-size="16" fill="#2a1c12">trockenes,</text><text x="210" y="171" font-size="16" fill="#2a1c12">schlechtes Jahr</text>
<text x="200" y="218" text-anchor="middle" font-size="14" fill="#6a5a4c">Baumscheibe mit Jahresringen (Zeichnung)</text>
</svg></div>'''

m.section("orte", "Wer forscht wo?", "Wer forscht wo? Archäologie, Archiv und Museum",
    '<p>Historikerinnen und Historiker sind wie Detektive. Sie suchen Spuren und stellen Fragen. Dabei helfen ihnen drei wichtige Orte und Berufe:</p>'
    '<ul class="facts"><li><b>Archäologie:</b> Archäologinnen und Archäologen suchen Spuren im Boden. Sie graben vorsichtig und schreiben alles genau auf.</li>'
    '<li><b>Archiv:</b> Hier werden alte Schriftstücke aufbewahrt, zum Beispiel Urkunden, Briefe oder Karten. Jede Stadt und jeder Landkreis hat ein Archiv.</li>'
    '<li><b>Museum:</b> Hier werden Funde geschützt, erforscht und ausgestellt. In Rhede gibt es zum Beispiel ein Landwirtschaftsmuseum mit alten Landmaschinen.</li></ul>'
    + m.zuord("orte",
        [("arch", "Archäologie"), ("archiv", "Archiv"), ("museum", "Museum")],
        [("Mit Kelle und Pinsel vorsichtig Erde abtragen", "arch"),
         ("Jeden Fund vermessen, zeichnen und fotografieren", "arch"),
         ("Alte Urkunden in Kartons vor Licht schützen", "archiv"),
         ("Einen Brief von 1880 im Lesesaal lesen", "archiv"),
         ("Funde in Vitrinen zeigen und erklären", "museum"),
         ("Eine Ausstellung über alte Landmaschinen machen", "museum")],
        "Alles richtig. Archäologie findet die Spuren, das Archiv bewahrt Schriftliches auf, das Museum zeigt und erklärt die Funde. Oft arbeiten alle drei zusammen.",
        "Frage dich: Geht es um Graben, um alte Schriftstücke oder ums Ausstellen?",
        "Archäologie, Archiv, Museum", ["fachwissen"],
        hilfe="Graben und Funde aus dem Boden: Archäologie. Papier und Urkunden: Archiv. Ausstellen für Besucher: Museum.",
        intro='<p><strong>Auftrag:</strong> Ordne jede Tätigkeit dem passenden Ort zu.</p>')
    + '<div class="notice"><strong>Gut zu wissen:</strong> Archäologen suchen nicht nach Dinosauriern. Dinosaurier lebten lange vor den Menschen. Ihre Knochen erforscht die Paläontologie.</div>')

m.section("schichten", "Wie alt ist das?", "Detektivarbeit: Wie alt ist das?",
    '<p>Archäologen graben nicht wild drauflos. Sie tragen den Boden Schicht für Schicht ab. Dabei hilft ihnen eine einfache Regel:</p>'
    '<div class="merk"><b class="k">Schichten-Regel</b>Was tiefer im Boden liegt, ist meistens älter. Was weiter oben liegt, ist meistens jünger. Denn jede neue Schicht hat sich später über die alte gelegt.</div>'
    + PROFIL +
    m.hot("schichten",
        [("hKlinge", "Welcher Fund ist wahrscheinlich am ältesten?",
          "Richtig. Die Feuersteinklinge liegt ganz unten. Sie ist wahrscheinlich der älteste Fund."),
         ("hKorken", "Welcher Fund ist am jüngsten?",
          "Genau. Der Kronkorken liegt ganz oben. Er ist erst vor kurzer Zeit in den Boden gekommen."),
         ("hBeil", "Knobelfrage: Welcher Fund ist älter als die Tonscherbe, aber jünger als die Feuersteinklinge?",
          "Stark kombiniert. Das Steinbeil liegt zwischen Tonscherbe und Feuersteinklinge. Also ist es jünger als die Klinge und älter als die Scherbe.")],
        [(f[0], f[1]) for f in FUNDE],
        "Alle drei Fragen gelöst. Du kannst die Schichten-Regel anwenden.",
        "Schichten lesen", ["zeit_raum", "fachwissen"], tag="Bildarbeit", titel="Suchauftrag im Boden")
    + '<h3>Jahresringe verraten das Alter</h3>'
    '<p>Bäume wachsen jedes Jahr um einen Ring. In guten Jahren wird der Ring breit, in trockenen oder kalten Jahren schmal. So entsteht ein Muster wie ein Strichcode. Forscher haben dieses Muster für viele tausend Jahre aufgeschrieben. Vergleichen sie ein altes Holz damit, finden sie oft heraus, in welchem Jahr der Baum gefällt wurde.</p>'
    + BAUM +
    m.luecke("ringe",
        ["Im Moor zwischen Diepholz und Lohne haben Archäologen einen alten Weg aus Holzbohlen ausgegraben. Man nennt ihn ", ("Bohlenweg", ["Radweg", "Wanderweg"]),
         ". Die Bäume dafür wurden um 46 v. Chr. gefällt. Das weiß man durch die ", ("Jahresringe", ["Blätter", "Farbe"]),
         " im Holz. In einem trockenen Jahr wächst ein ", ("schmaler", ["breiter", "bunter"]),
         " Ring. Das Holz ist über 2000 Jahre gut erhalten geblieben, weil im nassen Moor kaum ", ("Luft", ["Licht", "Salz"]),
         " an das Holz kommt. Ohne Luft können Pilze und Bakterien das Holz nicht zersetzen."],
        "Alles richtig. Moore sind ein Glücksfall für die Forschung: Dort bleiben Holz, Leder und sogar Menschen erhalten. Beim Bohlenweg fand man sogar einen über 2000 Jahre alten Lederschuh.",
        "Lies die Sätze vor und nach jeder Lücke. Sieh dir auch die Zeichnung der Baumscheibe an.",
        "Jahresringe und Moor", ["fachwissen", "ursachen_folgen"], tag="Lückentext",
        intro='<p><strong>Ein Weg durchs Moor:</strong> Wähle in jeder Lücke das passende Wort.</p>'))

STECKBRIEF = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Sachquelle: der „Rote Franz“, eine Moorleiche aus dem Emsland.</strong> Heute im Landesmuseum Hannover.</p>
 <ul class="facts">
  <li><b>Gefunden:</b> am 8. Juni 1900 im Bourtanger Moor, nördlich von Neu Versen bei Meppen.</li>
  <li><b>Was ist es?</b> Der gut erhaltene Körper eines Mannes, der vor langer Zeit im Moor begraben wurde.</li>
  <li><b>Alter:</b> Ein Labor hat gemessen: Der Mann starb ungefähr zwischen 135 und 385 n. Chr.</li>
  <li><b>Spuren am Körper:</b> Die Haare sind rot. Die Knochen der Beine zeigen Spuren von häufigem Reiten. Ein Schlüsselbein war gebrochen und wieder zusammengewachsen.</li>
  <li><b>Alter des Mannes:</b> etwa 25 bis 32 Jahre. Er war ungefähr 1,80 Meter groß.</li>
 </ul>
 <p class="hint">Angaben nach dem Landesmuseum Hannover und dem Forschungsstand. Den Namen „Roter Franz“ haben ihm erst die Menschen nach dem Fund gegeben.</p>
</div>'''

m.section("quelle", "Die Quelle", "Die Quelle: der Rote Franz aus dem Bourtanger Moor",
    '<p>Im Moor bleiben manchmal sogar Menschen erhalten. Man nennt sie <strong>Moorleichen</strong>. Eine berühmte Moorleiche stammt aus dem Emsland, nicht weit von Rhede.</p>'
    + STECKBRIEF +
    chronos("Der Rote Franz war ein Mensch wie du und ich. Deshalb gehen Forscher und Museen respektvoll mit ihm um. Ein Körper kann nicht sprechen. Aber seine Spuren verraten trotzdem viel, wenn wir die richtigen Fragen stellen.")
    + '<div class="merk"><b class="k">W-Fragen an eine Sachquelle</b><span class="wq">Was?</span> Was ist es? <span class="wq">Wo?</span> Wo wurde es gefunden? <span class="wq">Wann?</span> Wie alt ist es? <span class="wq">Wer?</span> Wer war das, wer hat es benutzt? <span class="wq">Was noch?</span> Welche Spuren sieht man?</div>'
    + m.zuord("spuren",
        [("reiten", "Er ist wahrscheinlich oft geritten."), ("verletzt", "Er hat eine Verletzung überlebt."),
         ("moor", "Das Moorwasser hat ihn verändert."), ("zeit", "Er lebte vor ungefähr 1650 bis 1900 Jahren.")],
        [("Die Beinknochen zeigen besondere Abnutzung.", "reiten"),
         ("Ein gebrochenes Schlüsselbein ist wieder zusammengewachsen.", "verletzt"),
         ("Die Haare sind rot gefärbt.", "moor"),
         ("Das Labor misst: gestorben zwischen 135 und 385 n. Chr.", "zeit")],
        "Klasse kombiniert. Aus jeder Spur hast du eine Erkenntnis gewonnen. Genau so arbeiten Forscherinnen und Forscher: Spur ansehen, Frage stellen, vorsichtig schließen.",
        "Lies den Steckbrief noch einmal. Welche Spur passt zu welcher Erkenntnis?",
        "Spuren deuten", ["quellenarbeit", "ursachen_folgen"], tag="Spur und Erkenntnis",
        hilfe="Abnutzung an den Beinen kommt von einer Tätigkeit. Ein Bruch, der zusammengewachsen ist, braucht Zeit zum Heilen.",
        intro='<p><strong>Auftrag:</strong> Was schließen die Forscher aus den Spuren? Ordne jede Spur der passenden Erkenntnis zu.</p>')
    + m.multi("nicht", "S2. Manche Fragen kann uns der Rote Franz nicht beantworten. Welche? Wähle alle richtigen aus.",
        [("name", "Wie er wirklich hieß"),
         ("sprache", "Welche Sprache er gesprochen hat"),
         ("denken", "Was er gedacht und gefühlt hat"),
         ("gross", "Wie groß er ungefähr war"),
         ("reiten", "Ob er häufig geritten ist")],
        ["name", "sprache", "denken"],
        "Richtig. Name, Sprache und Gedanken hinterlassen keine Spuren am Körper. Dafür bräuchte man Textquellen. Größe und Reiten dagegen kann man an den Knochen ablesen.",
        {"gross": "Die Größe kann man an den Knochen messen. Diese Frage beantwortet die Quelle also.",
         "reiten": "Das zeigen die Spuren an den Beinknochen. Diese Frage beantwortet die Quelle also."},
        "Grenzen der Quelle", ["quellenarbeit", "perspektivitaet"], tipp="Frage dich: Hinterlässt das Spuren am Körper?", tag="Was sagt die Quelle nicht?")
    + m.text("q2", "Q2. Fachleute haben aus Röntgenbildern und Messungen ein Gesicht nachgebildet. Es zeigt, wie der Rote Franz ausgesehen haben könnte. Ist dieses Gesicht eine Quelle oder eine Darstellung? Begründe.",
        "Das nachgebildete Gesicht ist eine ..., weil ...",
        dict(min=40, worte=10, need=2, saetze=1, gruppen=[
            dict(w=["darstellung"], miss="Entscheide dich: Quelle oder Darstellung?"),
            dict(w=["spater", "heute", "nachgebildet", "gemacht", "forscher", "museum", "nicht dabei", "vermut", "rekonstru", "ausgedacht", "gebaut"], miss="Begründe: Wann und von wem wurde das Gesicht gemacht?")],
            ok="Genau. Das Gesicht ist eine Darstellung. Es wurde heute von Fachleuten gemacht. Es beruht auf echten Spuren, aber einiges, zum Beispiel Augenfarbe oder Frisur, müssen sie vermuten."),
        "Weiterdenken Gesicht", ["quellenarbeit"], tag="Weiterdenken · Quelle oder Darstellung"))

m.section("weg", "Vom Fund ins Museum", "Vom Fund ins Museum",
    '<p>Wie kommt ein Fund aus dem Boden ins Museum? Das dauert oft Jahre. Und es geht in einer bestimmten Reihenfolge.</p>'
    + m.order("weg",
        ["Jemand entdeckt beim Arbeiten etwas Ungewöhnliches im Boden und meldet es.",
         "Archäologen graben vorsichtig aus. Sie messen, zeichnen und fotografieren alles.",
         "Im Labor wird der Fund gereinigt und untersucht, zum Beispiel wie alt er ist.",
         "Die Forscher vergleichen den Fund mit anderen Funden und Quellen und schreiben ihre Ergebnisse auf.",
         "Der Fund kommt ins Museum. Dort wird er ausgestellt und erklärt."],
        "Perfekt. Erst finden, dann sorgfältig ausgraben, dann untersuchen, vergleichen und aufschreiben. Erst am Ende kommt der Fund in die Vitrine.",
        "Überlege: Was muss zuerst passieren, damit der nächste Schritt möglich ist?",
        "Vom Fund ins Museum", ["fachwissen"], tag="Reihenfolge",
        intro='<p><strong>Auftrag:</strong> Bringe die Schritte in die richtige Reihenfolge. Nutze die Pfeilknöpfe.</p>')
    + m.mc("melden", "M1. Du spielst auf einem Acker in Rhede und findest eine sehr alte Münze. Was ist richtig?",
        [("a", "Ich behalte sie heimlich. Es hat sie ja niemand gesehen."),
         ("b", "Ich zeige sie meinen Eltern und wir melden den Fund bei der Gemeinde oder beim Landkreis."),
         ("c", "Ich putze sie gründlich mit einer Drahtbürste, damit sie schön glänzt.")],
        "b",
        {"a": "Lieber nicht. In Niedersachsen muss man Funde aus alter Zeit melden. Nur so können Fachleute herausfinden, was der Fund über die Vergangenheit verrät.",
         "b": "Richtig. In Niedersachsen müssen Funde aus alter Zeit gemeldet werden. Wichtig ist auch die Fundstelle: Wo genau lag die Münze? Das ist für die Forschung oft genauso wichtig wie der Fund selbst.",
         "c": "Bitte nicht! Beim Putzen können wichtige Spuren verloren gehen. Fachleute reinigen Funde sehr vorsichtig im Labor."},
        "Funde melden", ["fachwissen"], tag="Was würdest du tun?"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Zeitreise 002</span>
 <p><strong>Fall:</strong> Chronos hat eine Notiz an die Pinnwand geheftet: <em>„Forscher graben einfach etwas aus. Dann wissen sie sofort alles über früher.“</em></p>
 <p><strong>Dein Auftrag:</strong> Finde heraus, wie Forscherinnen und Forscher wirklich arbeiten. Am Ende entscheidest du, ob Chronos' Notiz stimmt.</p>
</div>
{WERKZEUG}
{chronos("Ich gebe zu, ich habe noch nie selbst gegraben. Ich sitze lieber im Archiv bei einer Tasse Tee. Aber heute packe ich Kelle und Pinsel ein. Kommst du mit ins Moor?")}
<p><strong>Leitfrage:</strong> Wie arbeiten Historikerinnen und Historiker mit Quellen?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Ausgräberin</span>
 <span class="abz" id="abz2">Holzdetektiv</span>
 <span class="abz" id="abz3">Quellenprüfer</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Vermutung", "D1. Was machen Archäologinnen und Archäologen?",
     [("a", "Sie suchen im Boden nach Spuren von Menschen aus früheren Zeiten."), ("b", "Sie graben nach Dinosaurierknochen."), ("c", "Sie bauen neue Häuser.")], "a"),
    ("d2", "Richtig oder falsch", "D2. Ein Archiv ist ein Ort, an dem alte Schriftstücke aufbewahrt werden.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "r"),
    ("d3", "Schätzfrage", "D3. Woran kann man erkennen, wie alt ein Stück Holz ist?",
     [("a", "Am Geruch"), ("b", "An den Jahresringen"), ("c", "An der Farbe")], "b")],
    dict(alle="Drei von drei. Du bist schon ein echter Spürhund. Der Lernweg Weiterdenken könnte dir Spaß machen.",
         fast="Zwei von drei. Gute Grundlage. Im Modul lernst du die Tricks der Forscher kennen.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da. Der Lernweg Sicher werden gibt dir mehr Hilfen.",
         extra=[dict(n="d1", v="b", m="Ein Hinweis vorab: Dinosaurier lebten lange vor den Menschen. Ihre Knochen gehören zu einem anderen Fach, der Paläontologie.")]))

gloss = glossar_section([
    ("Archäologie", "Die Wissenschaft, die Spuren von Menschen im Boden sucht und erforscht. Das Wort kommt aus dem Griechischen und bedeutet „Lehre vom Alten“."),
    ("Archiv", "Ein Ort, an dem alte Schriftstücke wie Urkunden, Briefe und Karten sicher aufbewahrt werden. Man kann dort nachlesen und forschen."),
    ("Museum", "Ein Ort, an dem Funde aufbewahrt, erforscht und für Besucherinnen und Besucher ausgestellt werden."),
    ("Fund und Fundstelle", "Ein Fund ist ein Gegenstand aus dem Boden. Die Fundstelle ist der genaue Ort, an dem er lag. Beides ist für die Forschung wichtig."),
    ("Schicht", "Eine Lage im Boden. Was tiefer liegt, ist meistens älter."),
    ("Jahresringe", "Ringe im Holz eines Baumes. Jedes Jahr kommt ein Ring dazu. Mit ihnen kann man das Alter von Holz bestimmen."),
    ("Moor", "Ein sehr nasses Gebiet. Im Moorboden kommt kaum Luft an Holz, Leder oder Körper. Deshalb bleiben sie dort lange erhalten."),
    ("Moorleiche", "Der Körper eines Menschen, der vor langer Zeit im Moor begraben wurde und dort erhalten blieb."),
    ("Bohlenweg", "Ein Weg aus Holzbrettern, den Menschen vor langer Zeit durch das Moor gebaut haben.")],
    ["Roter Franz (Mann von Neu Versen): Fund am 8. Juni 1900 im Bourtanger Moor bei Neu Versen (Stadt Meppen, Landkreis Emsland). Datierung durch 14C-Messung auf etwa 135 bis 385 n. Chr., Lebensalter etwa 25 bis 32 Jahre, Spuren von häufigem Reiten, verheilter Schlüsselbeinbruch. Ausgestellt im Landesmuseum Hannover. Auf Grundlage von Röntgenbefunden wurde eine Gesichtsrekonstruktion angefertigt.",
     "Bohlenweg Pr 6 im Großen Moor zwischen Diepholz und Lohne: Ausgrabungen 2019 bis 2021, Bauholz nach Jahresringen um 46 v. Chr. gefällt; dabei wurde ein über 2000 Jahre alter Lederschuh gefunden.",
     "Meldepflicht für Bodenfunde nach dem Niedersächsischen Denkmalschutzgesetz.",
     "Landwirtschaftsmuseum Rhede: eröffnet 1990 auf einem ehemaligen Bauernhof, zeigt Landtechnik von etwa 1850 bis 1950.",
     "Werkzeuge, Bodenschnitt und Baumscheibe sind eigene schematische Zeichnungen."])

lc = lerncheck_section(["Ich kann erklären, was in der Archäologie, im Archiv und im Museum gemacht wird.",
                        "Ich kann mit der Schichten-Regel und den Jahresringen erklären, wie man das Alter von Funden bestimmt.",
                        "Ich kann eine Sachquelle mit W-Fragen untersuchen und sagen, was sie nicht verrät."])

absch = abschluss_section(m, "Abschlussmission: die Notiz an der Pinnwand",
    '<p>Auf Chronos\' Notiz steht: <em>„Forscher graben einfach etwas aus. Dann wissen sie sofort alles über früher.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Notiz stimmt. Ein Fund erklärt sich von selbst."),
     ("b", "Die Notiz stimmt nicht. Forscher müssen Fragen stellen, das Alter bestimmen und vergleichen. Und manches bleibt trotzdem unbekannt."),
     ("c", "Die Notiz stimmt nicht, weil Funde für die Geschichte gar nicht wichtig sind.")],
    ["b"],
    {"a": "Denk an den Roten Franz: Seinen Namen und seine Gedanken kennen wir bis heute nicht. Ein Fund erklärt sich nicht von selbst. Wähle noch einmal.",
     "b": "Sehr gut entschieden. Forschen ist Detektivarbeit, und nicht jede Frage lässt sich beantworten. Begründe das jetzt in A2.",
     "c": "Doch, Funde sind sehr wichtig. Aber sie müssen untersucht werden. Wähle noch einmal."},
    "Schreibe Chronos eine kurze Nachricht mit zwei bis vier Sätzen: Wie arbeiten Forscherinnen und Forscher mit Quellen? Nenne mindestens ein Beispiel aus diesem Modul.",
    "Lieber Chronos, deine Notiz stimmt nicht, weil ...",
    "„Forscher stellen Fragen, zum Beispiel ...“ · „Das Alter finden sie heraus, indem ...“ · „Manches wissen wir nicht, weil ...“",
    dict(min=50, worte=12, need=2, saetze=2, gruppen=[
        dict(w=["frag", "untersuch", "vergleich", "pruf", "messen", "labor", "schicht", "jahresring", "graben", "ausgrab", "aufschreib", "dokument"], miss="Beschreibe, was Forscher tun, zum Beispiel Fragen stellen, Schichten lesen oder vergleichen."),
        dict(w=["franz", "moor", "bohlenweg", "scherbe", "beil", "klinge", "munze", "holz", "museum", "archiv", "leiche", "schuh"], miss="Nenne ein Beispiel aus dem Modul, etwa den Roten Franz oder den Bohlenweg.")],
        ok="Sehr gut. Du beschreibst die Arbeit der Forscher und belegst sie mit einem Beispiel. Genau das ist der Kern: Funde sprechen erst, wenn man sie klug befragt. Abzeichen Begründer freigeschaltet."))

build(m, "Forschung starten",
      ["Du lernst Archäologie, Archiv und Museum kennen.",
       "Du bestimmst mit der Schichten-Regel, welcher Fund älter ist.",
       "Du erfährst, wie Jahresringe das Alter von Holz verraten.",
       "Du untersuchst einen echten Fund aus dem Emsland mit W-Fragen.",
       "Du erkennst, was eine Quelle verrät und was nicht."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos hat schon die Gummistiefel an. Es geht weiter mit der Mission.")
