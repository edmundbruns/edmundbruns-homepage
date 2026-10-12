# -*- coding: utf-8 -*-
from common import *

m = Modul("001", "Was ist Geschichte und woher wissen wir etwas über die Vergangenheit?", "Geschichte",
          "Geschichte entdecken · Zeitreise 001",
          "Alles, was gestern oder vor tausend Jahren passiert ist, gehört zur Vergangenheit. Aber woher wissen wir davon? In diesem Modul lernst du, wie man die Zeit ordnet und welche Spuren die Menschen von früher hinterlassen haben.",
          "Weiter geht es mit Modul 002: Wie arbeiten Historikerinnen und Historiker mit Quellen?",
          badges=[dict(id="abz1", name="Zeitreisende", tasks=["strahl", "reihe"]),
                  dict(id="abz2", name="Spurensucher", tasks=["arten", "qd"]),
                  dict(id="abz3", name="Quellenprüfer", tasks=["wfragen", "s2", "s3"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])],
          bereich="Geschichte entdecken")

# ---------- Einstiegsbild: Fundkiste vom Dachboden ----------
KISTE = '''<div class="svgwrap"><svg class="pic" style="max-width:560px;margin:auto" viewBox="0 0 400 250" role="img" aria-label="Zeichnung einer Holzkiste vom Dachboden. Darin liegen eine alte Münze, ein Schwarz-Weiß-Foto, ein Brief, ein Steinwerkzeug und ein altes Tonbandgerät.">
<rect width="400" height="250" fill="#fbf6ee"/>
<path d="M0 205 H400 V250 H0Z" fill="#e8dccb"/>
<g>
 <rect x="70" y="120" width="260" height="95" rx="6" fill="#b5773f" stroke="#6e4220" stroke-width="3"/>
 <path d="M70 152 H330 M70 184 H330" stroke="#8a5528" stroke-width="2"/>
 <path d="M70 120 L95 92 H355 L330 120" fill="#c98b4e" stroke="#6e4220" stroke-width="3"/>
 <rect x="182" y="132" width="36" height="20" rx="3" fill="#e9c98f" stroke="#6e4220" stroke-width="2"/>
</g>
<g transform="translate(98 58) rotate(-8)"><rect width="58" height="46" fill="#fff" stroke="#6a5a4c" stroke-width="2"/><rect x="5" y="5" width="48" height="30" fill="#8c8178"/><circle cx="22" cy="18" r="6" fill="#d8d0c6"/><circle cx="36" cy="20" r="6" fill="#d8d0c6"/></g>
<g transform="translate(166 46) rotate(6)"><rect width="56" height="40" fill="#fdf3dc" stroke="#6a5a4c" stroke-width="2"/><path d="M8 10 H48 M8 18 H44 M8 26 H48 M8 33 H34" stroke="#8a4317" stroke-width="1.6"/></g>
<g><circle cx="256" cy="80" r="17" fill="#d29a3a" stroke="#8f5a12" stroke-width="3"/><circle cx="256" cy="80" r="10" fill="none" stroke="#8f5a12" stroke-width="1.5"/></g>
<g><path d="M290 96 q10 -42 30 -46 q18 10 14 44 q-20 10 -44 2Z" fill="#9b9488" stroke="#5b544a" stroke-width="2.5"/><path d="M302 70 l8 6 M314 62 l4 10 M300 86 l12 -2" stroke="#5b544a" stroke-width="1.5"/></g>
<g transform="translate(8 163)"><rect width="52" height="40" rx="5" fill="#5f6b73" stroke="#2f363b" stroke-width="2"/><circle cx="15" cy="17" r="8" fill="#cfd5d9"/><circle cx="37" cy="17" r="8" fill="#cfd5d9"/><rect x="10" y="30" width="32" height="5" fill="#2f363b"/></g>
<text x="200" y="236" text-anchor="middle" font-size="15" fill="#6a5a4c">Chronos' Fundkiste vom Dachboden (Zeichnung)</text>
</svg></div>'''

# ---------- Zeitstrahl mit Hotspots ----------
TICKS = [("hV3000", "3000 v. Chr.", 40), ("hV2000", "2000 v. Chr.", 104), ("hV1000", "1000 v. Chr.", 168),
         ("hJ1", "Jahr 1", 232), ("hN1000", "1000 n. Chr.", 296), ("hN2000", "2000 n. Chr.", 360)]
ticks_svg = ''
for tid, nm, x in TICKS:
    ticks_svg += (f'<g id="{tid}" class="hot" data-task="strahl" tabindex="0" role="button" aria-label="Markierung {nm}">'
                  f'<circle cx="{x}" cy="120" r="21" fill="#fff" fill-opacity=".01"/>'
                  f'<line x1="{x}" y1="106" x2="{x}" y2="134" stroke="#2a1c12" stroke-width="3"/>'
                  f'<circle cx="{x}" cy="120" r="8" fill="#fff" stroke="#8a4317" stroke-width="3"/></g>')
STRAHL = f'''<div class="svgwrap"><svg class="pic" style="max-width:640px;margin:auto" viewBox="0 0 400 210" role="img" aria-label="Zeitstrahl von 3000 vor Christus bis heute. Ein Strich bedeutet 1000 Jahre. In der Mitte liegt das Jahr 1. Links davon liegt die Zeit vor Christus, rechts die Zeit nach Christus.">
<rect width="400" height="210" fill="#fbf8f3"/>
<rect x="14" y="40" width="218" height="122" rx="10" fill="#f6e7da"/>
<rect x="232" y="40" width="160" height="122" rx="10" fill="#e9f1e6"/>
<text x="123" y="66" text-anchor="middle" font-size="18" font-weight="800" fill="#8a4317">vor Christus</text>
<text x="123" y="86" text-anchor="middle" font-size="16" fill="#8a4317">(v. Chr.)</text>
<text x="312" y="66" text-anchor="middle" font-size="18" font-weight="800" fill="#2f6b3a">nach Christus</text>
<text x="312" y="86" text-anchor="middle" font-size="16" fill="#2f6b3a">(n. Chr.)</text>
<line x1="18" y1="120" x2="384" y2="120" stroke="#2a1c12" stroke-width="4"/>
<path d="M384 112 L396 120 L384 128Z" fill="#2a1c12"/>
{ticks_svg}
<text x="232" y="158" text-anchor="middle" font-size="18" font-weight="800" fill="#2a1c12">Jahr 1</text>
<text x="372" y="158" text-anchor="middle" font-size="16" font-weight="700" fill="#2f6b3a">heute</text>
<text x="20" y="192" font-size="16" fill="#8a4317">&#8592; die Zahlen werden größer</text>
<text x="390" y="192" text-anchor="end" font-size="16" fill="#2f6b3a">größer &#8594;</text>
<text x="200" y="24" text-anchor="middle" font-size="16" font-weight="700" fill="#6a5a4c">Abstand von Strich zu Strich: 1000 Jahre</text>
</svg></div>'''

m.section("zeit", "Zeit ordnen", "Die Zeit ordnen: der Zeitstrahl",
    '<p>Um die Zeit zu ordnen, zählen wir Jahre. In Europa zählt man die Jahre seit der Geburt von Jesus Christus. Das ist das <strong>Jahr 1</strong>. Ein Jahr 0 gibt es nicht.</p>'
    '<ul><li>Alles <strong>vor</strong> dem Jahr 1 heißt <strong>vor Christus</strong>, kurz <strong>v. Chr.</strong> Hier zählt man rückwärts: 3000 v. Chr. ist viel älter als 1000 v. Chr.</li>'
    '<li>Alles <strong>nach</strong> dem Jahr 1 heißt <strong>nach Christus</strong>, kurz <strong>n. Chr.</strong> Hier zählt man vorwärts, bis heute.</li></ul>'
    + STRAHL +
    '<div class="legendlist" aria-hidden="true"><span>Zeitstrahl: eigene Zeichnung</span></div>'
    + chronos("Mein Lieblingstrick: Stell dir vor, das Jahr 1 ist dein Zuhause. Bei v. Chr. läufst du rückwärts in die Vergangenheit. Je größer die Zahl, desto weiter bist du weg.")
    + m.hot("strahl",
        [("hV2000", "Wo liegt das Jahr 2000 v. Chr.? Zähle vom Jahr 1 aus die Striche nach links.",
          "Richtig. 2000 v. Chr. liegt zwei Striche links vom Jahr 1. Das ist rund 4000 Jahre her."),
         ("hN1000", "Wo liegt das Jahr 1000 n. Chr.? Diesmal geht es vom Jahr 1 aus nach rechts.",
          "Genau. Um das Jahr 1000 n. Chr. gab es schon viele Dörfer im Emsland, auch Rhede."),
         ("hV3000", "Wo liegt das Jahr 3000 v. Chr.? Das ist der älteste Punkt auf dem Zeitstrahl.",
          "Super. 3000 v. Chr. liegt ganz links. Ungefähr in dieser Zeit bauten Menschen im Emsland riesige Steingräber.")],
        [(t[0], t[1]) for t in TICKS],
        "Alle drei Jahre gefunden. Du kannst jetzt auf einem Zeitstrahl vor und zurück reisen.",
        "Zeitstrahl lesen", ["zeit_raum"], tag="Zeitstrahl", titel="Suchauftrag am Zeitstrahl")
    + '<h3>Jahrhunderte</h3><p>Hundert Jahre nennt man ein <strong>Jahrhundert</strong>. Die Jahre 1901 bis 2000 sind das 20. Jahrhundert. Die Jahre 2001 bis 2100 sind das 21. Jahrhundert.</p>'
    '<div class="merk"><b class="k">Trick</b>Streiche bei der Jahreszahl die letzten zwei Ziffern und zähle 1 dazu. Beispiel: 1850, ohne „50“ bleibt 18, plus 1 ergibt das 19. Jahrhundert. Achtung bei glatten Hundertern: Das Jahr 2000 gehört noch zum 20. Jahrhundert.</div>'
    + m.luecke("jh",
        ["Ein Jahrhundert dauert ", ("100 Jahre", ["10 Jahre", "1000 Jahre"]),
         ". Das Jahr 1850 liegt im ", ("19. Jahrhundert", ["18. Jahrhundert", "20. Jahrhundert"]),
         ". Wir leben heute im ", ("21. Jahrhundert", ["20. Jahrhundert", "22. Jahrhundert"]),
         ". Rhede wird im Jahr 829 zum ersten Mal in einer Urkunde erwähnt. Das war im ", ("9. Jahrhundert", ["8. Jahrhundert", "82. Jahrhundert"]), "."],
        "Alles richtig. Du kannst jetzt Jahreszahlen den Jahrhunderten zuordnen.",
        "Nutze den Trick: letzte zwei Ziffern weg, dann 1 dazuzählen.",
        "Jahrhunderte", ["zeit_raum"], tag="Lückentext",
        intro='<p><strong>Auftrag:</strong> Wähle in jeder Lücke das passende Wort.</p>')
    + '<details class="gloss"><summary>Überraschender Fund aus dem Archiv</summary><div class="body">Unsere Zeitrechnung hat sich vor rund 1500 Jahren ein Mönch namens Dionysius ausgedacht. Er hat das Geburtsjahr von Jesus aber nicht ganz genau getroffen. Heute nehmen Fachleute an, dass Jesus einige Jahre früher geboren wurde. Die Zählung hat man trotzdem behalten.</div></details>')

m.section("reihe", "Die Zeitleiste", "Ereignisse auf der Zeitleiste ordnen",
    '<p>Auf einer <strong>Zeitleiste</strong> stehen Ereignisse in der richtigen Reihenfolge. Das älteste Ereignis steht oben oder links, das jüngste unten oder rechts.</p>'
    + m.order("reihe",
        ["Ab etwa 3500 v. Chr.: Menschen im Emsland bauen Großsteingräber aus riesigen Findlingen.",
         "Um 2500 v. Chr.: In Ägypten entstehen die großen Pyramiden von Gizeh.",
         "Um 430 v. Chr.: Der Grieche Herodot schreibt seine Geschichten auf.",
         "Im Jahr 829: Rhede wird zum ersten Mal in einer Urkunde erwähnt.",
         "1969: Zum ersten Mal landen Menschen auf dem Mond."],
        "Perfekt. Bei v. Chr. ist die größere Zahl älter: 3500 v. Chr. kommt vor 2500 v. Chr. Erst danach folgen die Jahre nach Christus.",
        "Achte auf v. Chr. und n. Chr.: Bei v. Chr. ist die größere Zahl das ältere Jahr. Alle Jahre ohne v. Chr. kommen danach.",
        "Zeitleiste ordnen", ["zeit_raum", "fachwissen"], tag="Zeitleiste",
        intro='<p><strong>Auftrag:</strong> Bringe die Ereignisse in die richtige Reihenfolge. Das älteste kommt nach oben. Nutze die Pfeilknöpfe.</p>')
    + '<div class="notice" data-lw="sicher"><strong>Hilfe:</strong> Suche zuerst die Ereignisse mit „v. Chr.“. Das mit der größten Zahl kommt ganz nach oben.</div>')

m.section("arten", "Arten von Quellen", "Spuren aus der Vergangenheit: Quellen",
    '<p>Niemand von uns war bei den Pyramiden oder in der Steinzeit dabei. Trotzdem wissen wir viel darüber. Das liegt an den <strong>Quellen</strong>. Quellen sind alle Spuren, die Menschen aus früheren Zeiten hinterlassen haben. Es gibt vier Arten:</p>'
    '<ul class="facts"><li><b>Sachquellen:</b> Gegenstände und Bauwerke, zum Beispiel Werkzeuge, Münzen oder Gräber.</li>'
    '<li><b>Bildquellen:</b> Bilder aus der damaligen Zeit, zum Beispiel Malereien oder Fotos.</li>'
    '<li><b>Textquellen:</b> alles Geschriebene, zum Beispiel Briefe, Urkunden oder Tagebücher.</li>'
    '<li><b>Mündliche Quellen:</b> Erzählungen von Menschen, die etwas selbst erlebt haben. Man nennt sie Zeitzeugen.</li></ul>'
    + KISTE +
    m.zuord("arten",
        [("sach", "Sachquelle"), ("bild", "Bildquelle"), ("text", "Textquelle"), ("muend", "Mündliche Quelle")],
        [("Ein Steinwerkzeug aus Feuerstein", "sach"),
         ("Eine alte Münze", "sach"),
         ("Ein Foto von Opas Einschulung", "bild"),
         ("Eine Höhlenmalerei mit Pferden", "bild"),
         ("Ein Brief der Uroma von 1950", "text"),
         ("Die Urkunde, in der Rhede 829 erwähnt wird", "text"),
         ("Oma erzählt von ihrer Schulzeit", "muend"),
         ("Eine Tonaufnahme, in der ein Zeitzeuge erzählt", "muend")],
        "Alle acht richtig. Jede Art von Quelle verrät etwas anderes. Ein Werkzeug zeigt, wie Menschen arbeiteten. Ein Brief verrät, was jemand dachte. Und Oma kann erzählen, wie sich etwas anfühlte.",
        "Frage dich: Kann man es anfassen, ansehen, lesen oder hören?",
        "Arten von Quellen", ["fachwissen", "quellenarbeit"],
        hilfe="Zum Anfassen: Sachquelle. Zum Ansehen: Bildquelle. Zum Lesen: Textquelle. Zum Zuhören: mündliche Quelle.",
        intro='<p><strong>Auftrag:</strong> In Chronos\' Fundkiste und im Archiv liegen viele Spuren. Ordne jede Karte der passenden Quellenart zu.</p>')
    + m.mc("erhalt", "E1. Aus der Steinzeit finden Forscherinnen und Forscher vor allem Werkzeuge aus Stein und Knochen. Kleidung, Körbe oder Holzhütten findet man fast nie. Was ist die Ursache?",
        [("a", "Die Menschen der Steinzeit hatten keine Kleidung und keine Körbe."),
         ("b", "Holz, Leder und Stoff verrotten meistens im Boden. Stein bleibt erhalten."),
         ("c", "Die Forscher interessieren sich nur für Steine.")],
        "b",
        {"a": "Doch, die Menschen brauchten warme Kleidung, besonders in der Eiszeit. Überlege, was mit Leder oder Holz in der Erde passiert.",
         "b": "Richtig. Das ist eine wichtige Folge für unser Wissen: Wir finden nicht alles, sondern nur, was die Zeit überstanden hat. Deshalb gibt es Lücken in der Geschichte. Im Moor bleibt manchmal auch Holz erhalten. Das lernst du in Modul 002.",
         "c": "Nein, Forscher würden sich sehr über Kleidung freuen. Sie finden sie nur kaum. Überlege, was mit Leder oder Holz in der Erde passiert."},
        "Warum Quellen fehlen", ["ursachen_folgen"], tag="Ursache und Folge"))

m.section("qd", "Quelle oder Darstellung?", "Quelle oder Darstellung?",
    '<div class="grid2"><div class="merk"><b class="k">Quelle</b>stammt aus der Zeit selbst. Sie ist ein Überrest von damals, zum Beispiel ein Brief von 1950 oder ein Steinwerkzeug aus der Steinzeit.</div>'
    '<div class="merk" style="background:#eef5ec;border-color:#a9c9a4"><b class="k" style="color:#2f6b3a">Darstellung</b>wurde später von Menschen gemacht, die selbst nicht dabei waren. Zum Beispiel ein Schulbuch, ein Film oder eine Zeichnung, die zeigt, wie es vielleicht aussah.</div></div>'
    + m.multi("qd", "Q1. Welche dieser Dinge sind Darstellungen, also später gemacht? Wähle alle richtigen aus.",
        [("buch", "Ein Kinderbuch über die Steinzeit aus dem Jahr 2021"),
         ("film", "Ein Film über die alten Römer"),
         ("kiste", "Die Zeichnung der Fundkiste in diesem Modul"),
         ("brief", "Ein Brief, den die Uroma 1950 geschrieben hat"),
         ("stein", "Ein Steinwerkzeug, das Menschen in der Steinzeit gemacht haben")],
        ["buch", "film", "kiste"],
        "Richtig. Buch, Film und Zeichnung sind Darstellungen. Sie wurden viel später gemacht. Der Brief und das Steinwerkzeug stammen aus ihrer eigenen Zeit, sie sind Quellen.",
        {"brief": "Der Brief ist eine Quelle. Er stammt aus dem Jahr 1950 und wurde damals geschrieben.",
         "stein": "Das Steinwerkzeug ist eine Quelle. Menschen der Steinzeit haben es selbst hergestellt."},
        "Quelle und Darstellung", ["quellenarbeit"], tipp="Frage dich immer: Stammt es aus der Zeit selbst oder wurde es später gemacht?", tag="Quelle oder Darstellung")
    + chronos("Darstellungen sind nicht schlecht. Schulbücher helfen uns sehr. Aber sie sind schon eine Erklärung von jemandem. Quellen sind die Spuren selbst."))

QUELLE = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Herodot, „Historien“, Anfang von Buch 1, geschrieben um 430 v. Chr. auf Griechisch.</strong> Herodot stammte aus der Stadt Halikarnassos. Heute heißt sie Bodrum und liegt in der Türkei. Er reiste viel und sammelte Berichte von vielen Menschen.</p>
 <blockquote class="q">
  <p>„Herodot aus Halikarnassos legt hier vor, was er erforscht hat. Er will, dass die Taten der Menschen mit der Zeit nicht vergessen werden. Die großen und staunenswerten Werke der Griechen und der anderen Völker sollen nicht ohne Ruhm bleiben. Und er will erklären, warum sie gegeneinander Krieg führten.“</p>
 </blockquote>
 <p class="hint">Vereinfacht wiedergegeben für dieses Modul. Das griechische Wort „historia“ bedeutet „Erforschung“. Davon kommt unser Wort „Historiker“.</p>
</div>'''

m.section("quelle", "Die Quelle", "Die Quelle: Ein Grieche schreibt Geschichte auf",
    '<p>Chronos hat im Archiv einen sehr alten Text gefunden. Es ist der Anfang eines der ersten Geschichtsbücher überhaupt. Der römische Gelehrte Cicero nannte Herodot später den „Vater der Geschichtsschreibung“.</p>'
    + QUELLE +
    chronos("Jede Quelle kannst du mit W-Fragen befragen. <span class=\"wq\">Wer?</span> <span class=\"wq\">Wann?</span> <span class=\"wq\">Was?</span> <span class=\"wq\">Warum?</span> Probier es aus!")
    + m.zuord("wfragen",
        [("wer", "Wer hat das geschrieben?"), ("wann", "Wann wurde es geschrieben?"), ("was", "Worüber schreibt er?"), ("warum", "Warum schreibt er?")],
        [("Herodot aus Halikarnassos", "wer"),
         ("Ein Grieche, der viel gereist ist", "wer"),
         ("Um 430 v. Chr.", "wann"),
         ("Vor fast 2500 Jahren", "wann"),
         ("Über Taten der Griechen und anderer Völker", "was"),
         ("Damit die Taten der Menschen nicht vergessen werden", "warum")],
        "Klasse. Mit den W-Fragen hast du die Quelle aufgeschlossen. Du weißt jetzt, wer schrieb, wann, worüber und warum.",
        "Lies die Quelle und die Angabe darüber noch einmal. Dort stehen der Name, das Jahr und der Grund.",
        "W-Fragen an die Quelle", ["quellenarbeit"], tag="Quellenarbeit mit W-Fragen",
        hilfe="Der Name gehört zu „Wer?“, Jahreszahlen zu „Wann?“, das Thema zu „Was?“ und ein Satz mit „damit“ zu „Warum?“.",
        intro='<p><strong>Auftrag:</strong> Ordne jede Karte der passenden W-Frage zu.</p>')
    + m.multi("s2", "S2. Was erfährst du aus diesem kurzen Text? Wähle alle richtigen Aussagen aus.",
        [("name", "Wie der Verfasser heißt und woher er kommt"),
         ("grund", "Warum er sein Buch geschrieben hat"),
         ("aussehen", "Wie Herodot aussah"),
         ("wahr", "Dass alles in seinem Buch ganz sicher stimmt")],
        ["name", "grund"],
        "Genau. Der Text nennt den Verfasser und seinen Grund. Wie Herodot aussah, steht nicht darin. Und ob alles stimmt, müssen wir selbst prüfen.",
        {"aussehen": "Darüber sagt der Text nichts. Achte nur auf das, was wirklich dasteht.",
         "wahr": "Das sagt der Text nicht. Ein Verfasser kann sich irren. Ob etwas stimmt, müssen wir selbst prüfen."},
        "Was sagt die Quelle?", ["quellenarbeit"], tag="Was sagt die Quelle, was nicht?")
    + m.mc("s3", "S3. Herodot hat nicht alles selbst gesehen. Vieles haben ihm andere Menschen erzählt. Was bedeutet das für uns?",
        [("a", "Alles in seinem Buch ist erfunden."),
         ("b", "Wir sollten seine Angaben mit anderen Quellen vergleichen, bevor wir ihnen glauben."),
         ("c", "Alles stimmt, weil der Text so alt ist.")],
        "b",
        {"a": "Das ist zu streng. Herodot hat viel erforscht. Vieles stimmt, manches aber vielleicht nicht. Deshalb vergleicht man.",
         "b": "Richtig. Gute Historikerinnen und Historiker vergleichen mehrere Quellen. So finden sie heraus, was wahrscheinlich stimmt.",
         "c": "Leider nein. Auch alte Texte können Fehler enthalten. Alt heißt nicht automatisch richtig."},
        "Quelle prüfen", ["quellenarbeit", "perspektivitaet"], tag="Quellenkritik")
    + m.text("q2", "Q2. Herodot wollte, dass die Taten der Menschen nicht vergessen werden. Was aus unserer Zeit sollte man für Menschen in 2500 Jahren aufbewahren? Nenne etwas und begründe.",
        "Ich würde ... aufbewahren, weil ...",
        dict(min=40, worte=10, need=1, saetze=1, gruppen=[
            dict(w=["handy", "smartphone", "internet", "computer", "schule", "klima", "auto", "foto", "brief", "zeitung", "buch", "spiel", "fussball", "musik", "familie", "tagebuch", "video", "heute", "unsere zeit", "kleid", "geld", "spielzeug", "rad", "lego"],
                 miss="Nenne einen Gegenstand, ein Bild oder einen Text aus unserer Zeit.")],
            ok="Gute Idee und gut begründet. Genau so denken auch Museen und Archive: Sie überlegen, was späteren Menschen zeigt, wie wir heute leben."),
        "Weiterdenken Zeitkapsel", ["quellenarbeit"], tag="Weiterdenken · Zeitkapsel"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Zeitreise 001</span>
 <p><strong>Fall:</strong> Chronos räumt das Archiv der Zeit auf. Auf einer Karteikarte hat er notiert: <em>„Geschichte ist einfach alles, was früher passiert ist.“</em></p>
 <p><strong>Dein Auftrag:</strong> Finde heraus, was Geschichte wirklich ist und woher wir etwas über früher wissen. Am Ende entscheidest du, ob die Karteikarte stimmt.</p>
</div>
<p><strong>Zum Einstieg:</strong> Auf dem Dachboden hat Chronos eine alte Kiste gefunden. Darin liegen ein Foto, ein Brief, eine Münze, ein Steinwerkzeug und ein altes Tonbandgerät. Jedes Ding erzählt etwas aus der Vergangenheit. Man muss es nur zum Sprechen bringen.</p>
{chronos("Hallo, ich bin Chronos! Ich hüte das Archiv der Zeit. Ich bin schon ziemlich alt, aber nicht ganz so alt wie die Pyramiden. Komm mit auf Zeitreise. Ich brauche deine Hilfe beim Sortieren.")}
<p><strong>Leitfrage:</strong> Was ist Geschichte und woher wissen wir etwas über die Vergangenheit?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Zeitreisende</span>
 <span class="abz" id="abz2">Spurensucher</span>
 <span class="abz" id="abz3">Quellenprüfer</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Schätzfrage", "D1. Welches Jahr liegt weiter in der Vergangenheit?",
     [("a", "500 v. Chr."), ("b", "500 n. Chr."), ("c", "Beide sind gleich lange her.")], "a"),
    ("d2", "Richtig oder falsch", "D2. Ein Foto von deiner Einschulung kann für spätere Menschen eine Quelle sein.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "r"),
    ("d3", "Vermutung", "D3. In welchem Jahrhundert leben wir heute?",
     [("a", "Im 20. Jahrhundert"), ("b", "Im 21. Jahrhundert"), ("c", "Im 2000. Jahrhundert")], "b")],
    dict(alle="Drei von drei. Super Start! Der Lernweg Weiterdenken könnte dir Spaß machen.",
         fast="Zwei von drei. Gute Grundlage. Im Modul lernst du einen Trick für die Jahrhunderte.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da. Der Lernweg Sicher werden gibt dir mehr Hilfen.",
         extra=[dict(n="d1", v="b", m="Ein Hinweis vorab: Bei v. Chr. zählt man rückwärts. 500 v. Chr. ist deshalb älter.")]))

gloss = glossar_section([
    ("Vergangenheit", "Alles, was schon passiert ist. Das kann gestern sein oder vor tausend Jahren."),
    ("Geschichte", "Das, was wir mit Hilfe von Quellen über die Vergangenheit herausfinden und erzählen. Auch das Schulfach heißt so."),
    ("Historikerin, Historiker", "Menschen, die die Vergangenheit erforschen. Sie suchen und prüfen Quellen."),
    ("Zeitstrahl und Zeitleiste", "Eine Linie, auf der Jahre oder Ereignisse in der richtigen Reihenfolge stehen."),
    ("v. Chr. und n. Chr.", "Abkürzungen für „vor Christus“ und „nach Christus“. Gezählt wird ab dem Jahr 1, dem angenommenen Geburtsjahr von Jesus Christus."),
    ("Jahrhundert", "Ein Zeitraum von 100 Jahren. Die Jahre 2001 bis 2100 sind das 21. Jahrhundert."),
    ("Quelle", "Eine Spur aus der Vergangenheit, die aus der Zeit selbst stammt. Es gibt Sachquellen, Bildquellen, Textquellen und mündliche Quellen."),
    ("Zeitzeuge, Zeitzeugin", "Ein Mensch, der etwas selbst erlebt hat und davon erzählen kann."),
    ("Darstellung", "Etwas, das später über die Vergangenheit gemacht wurde, zum Beispiel ein Schulbuch, ein Film oder eine Zeichnung.")],
    ["Herodot, Historien, Buch 1, Einleitungssatz (Proömium), um 430 v. Chr. Für dieses Modul vereinfacht wiedergegeben, kein wörtliches Zitat einer bestimmten Übersetzung.",
     "Cicero nennt Herodot in seiner Schrift „Über die Gesetze“ (Buch 1, Abschnitt 5) „Vater der Geschichtsschreibung“.",
     "Rhede (Ems) wird im Jahr 829 erstmals urkundlich erwähnt.",
     "Großsteingräber im Emsland: Bauzeit etwa 3500 bis 2800 v. Chr. Pyramiden von Gizeh: um 2500 v. Chr. (die Cheops-Pyramide etwas früher). Mondlandung: 20. Juli 1969.",
     "Fundkiste und Zeitstrahl sind eigene Zeichnungen für dieses Modul."])

lc = lerncheck_section(["Ich kann Jahre mit v. Chr. und n. Chr. auf einem Zeitstrahl ordnen.",
                        "Ich kann vier Arten von Quellen nennen und Beispiele zuordnen.",
                        "Ich kann erklären, was der Unterschied zwischen Quelle und Darstellung ist."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf Chronos\' Karteikarte steht: <em>„Geschichte ist einfach alles, was früher passiert ist.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt genau so."),
     ("b", "Die Karte stimmt nur zum Teil. Alles, was früher passiert ist, ist die Vergangenheit. Geschichte ist das, was wir mit Hilfe von Quellen darüber herausfinden und erzählen."),
     ("c", "Die Karte ist ganz falsch. Geschichte hat mit der Vergangenheit nichts zu tun.")],
    ["b"],
    {"a": "Fast. Was früher passiert ist, nennt man genauer die Vergangenheit. Geschichte entsteht erst, wenn wir mit Quellen darüber forschen und erzählen. Wähle noch einmal.",
     "b": "Sehr gut entschieden. Du unterscheidest Vergangenheit und Geschichte. Begründe das jetzt in A2.",
     "c": "Das geht zu weit. Geschichte beschäftigt sich ja gerade mit der Vergangenheit. Wähle noch einmal."},
    "Schreibe Chronos eine kurze Nachricht mit zwei bis vier Sätzen: Was ist Geschichte, und woher wissen wir etwas über früher? Nenne mindestens eine Art von Quelle als Beispiel.",
    "Lieber Chronos, deine Karte stimmt nur zum Teil, weil ...",
    "„Vergangenheit ist alles, was ...“ · „Geschichte ist das, was ...“ · „Wir wissen etwas über früher, weil es Quellen gibt, zum Beispiel ...“",
    dict(min=50, worte=12, need=2, saetze=2, gruppen=[
        dict(w=["vergangen", "fruher", "passiert", "damals", "geschehen"], miss="Erkläre, was mit Vergangenheit gemeint ist."),
        dict(w=["quelle", "fund", "brief", "foto", "munze", "werkzeug", "urkunde", "erzahl", "zeitzeug", "bild", "text", "gegenstand", "spur", "grab", "malerei"], miss="Nenne eine Art von Quelle, zum Beispiel einen Brief, ein Foto oder ein Werkzeug.")],
        ok="Sehr gut. Du erklärst den Unterschied und nennst Quellen als Beweis. Genau so arbeiten Historikerinnen und Historiker. Abzeichen Begründer freigeschaltet."))

build(m, "Zeitreise starten",
      ["Du ordnest Jahre mit v. Chr. und n. Chr. auf einem Zeitstrahl.",
       "Du ordnest Jahreszahlen den Jahrhunderten zu.",
       "Du lernst vier Arten von Quellen kennen.",
       "Du unterscheidest Quelle und Darstellung.",
       "Du befragst eine echte Quelle mit W-Fragen."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos wartet schon. Es geht weiter mit der Mission.")
