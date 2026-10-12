# -*- coding: utf-8 -*-
from common import *

m = Modul("003", "Was verraten Familie, Schule und Wohnort über Wandel?", "Wandel",
          "Geschichte entdecken · Zeitreise 003",
          "Geschichte beginnt nicht erst bei den Pyramiden. Sie steckt auch in deiner Familie, in deiner Schule und in deinem Wohnort. In diesem Modul findest du heraus, was sich in den letzten hundert Jahren verändert hat und was gleich geblieben ist.",
          "Weiter geht es mit Modul 004: Wie lebten Menschen in der Altsteinzeit?",
          badges=[dict(id="abz1", name="Familienforscherin", tasks=["generationen"]),
                  dict(id="abz2", name="Schulreporter", tasks=["schule", "kont"]),
                  dict(id="abz3", name="Ortskenner", tasks=["emsland"]),
                  dict(id="abz4", name="Interviewprofi", tasks=["zeitzeuge", "fragen"])],
          bereich="Geschichte entdecken")

# ---------- Generationen ----------
def kopf(x, haar, label1, label2, jahr):
    return (f'<circle cx="{x}" cy="78" r="9" fill="#fff" stroke="#8a4317" stroke-width="3"/>'
            f'<text x="{x}" y="50" text-anchor="middle" font-size="17" font-weight="800" fill="#8a4317">{jahr}</text>'
            f'<circle cx="{x}" cy="112" r="15" fill="#f1d3b5" stroke="#5b2c0f" stroke-width="1.5"/>'
            f'<path d="M{x-15} 108 q15 -20 30 0" fill="{haar}" stroke="#5b2c0f" stroke-width="1.2"/>'
            f'<path d="M{x-6} 117 q6 5 12 0" stroke="#2a1c12" stroke-width="1.6" fill="none"/>'
            f'<circle cx="{x-5}" cy="111" r="1.8" fill="#2a1c12"/><circle cx="{x+5}" cy="111" r="1.8" fill="#2a1c12"/>'
            f'<text x="{x}" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#2a1c12">{label1}</text>'
            f'<text x="{x}" y="169" text-anchor="middle" font-size="16" font-weight="700" fill="#2a1c12">{label2}</text>')
GEN = f'''<div class="svgwrap"><svg class="pic" style="max-width:600px;margin:auto" viewBox="0 0 400 190" role="img" aria-label="Zeitleiste der Generationen: Kindheit der Urgroßeltern um 1930, der Großeltern um 1960, der Eltern um 1990 und deine Kindheit heute.">
<rect width="400" height="190" fill="#fbf6ee"/>
<text x="200" y="22" text-anchor="middle" font-size="15" fill="#6a5a4c">Wann waren sie ungefähr Kinder?</text>
<line x1="14" y1="78" x2="384" y2="78" stroke="#2a1c12" stroke-width="4"/><path d="M384 70 L396 78 L384 86Z" fill="#2a1c12"/>
{kopf(55, "#e9e6e1", "Urgroß-", "eltern", "um 1930")}
{kopf(150, "#c9c4bd", "Groß-", "eltern", "um 1960")}
{kopf(245, "#6b4a2e", "Eltern", "", "um 1990")}
{kopf(340, "#a0522d", "Du", "", "heute")}
</svg></div>'''

# ---------- Emsland im Wandel ----------
EMS = '''<div class="svgwrap"><svg class="pic" style="max-width:640px;margin:auto" viewBox="0 0 400 230" role="img" aria-label="Zwei schematische Zeichnungen: links eine Moorlandschaft um 1950 mit Wasserlöchern, Birken und gestapeltem Torf, rechts dieselbe Gegend heute mit Feldern, Bauernhof, Straße und Windrad.">
<rect width="400" height="230" fill="#fbf6ee"/>
<rect x="6" y="34" width="190" height="160" rx="10" fill="#d9c7a3"/>
<rect x="204" y="34" width="190" height="160" rx="10" fill="#dcebd2"/>
<text x="101" y="24" text-anchor="middle" font-size="17" font-weight="800" fill="#8a4317">Moor um 1950</text>
<text x="299" y="24" text-anchor="middle" font-size="16" font-weight="800" fill="#2f6b3a">Dieselbe Gegend heute</text>
<rect x="6" y="34" width="190" height="62" rx="10" fill="#e9eef2"/>
<rect x="204" y="34" width="190" height="62" rx="10" fill="#e3eef6"/>
<path d="M6 96 H196 V194 H6Z" fill="#7a5a3a"/>
<ellipse cx="50" cy="140" rx="26" ry="8" fill="#9fb7c9"/><ellipse cx="146" cy="146" rx="28" ry="8" fill="#9fb7c9"/>
<g stroke="#5b544a" stroke-width="3"><line x1="40" y1="96" x2="40" y2="58"/><line x1="160" y1="96" x2="160" y2="64"/></g>
<circle cx="40" cy="56" r="12" fill="#9bb26a"/><circle cx="160" cy="62" r="11" fill="#9bb26a"/>
<g fill="#4a3220" stroke="#2a1c12" stroke-width="1"><rect x="96" y="112" width="12" height="8"/><rect x="110" y="112" width="12" height="8"/><rect x="103" y="104" width="12" height="8"/><rect x="124" y="112" width="12" height="8"/></g>
<text x="101" y="184" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" paint-order="stroke" stroke="#4a3220" stroke-width="4">nass, wenig Wege</text>
<path d="M204 96 H394 V194 H204Z" fill="#9bc27a"/>
<g stroke="#7aa35a" stroke-width="3"><path d="M210 120 H388 M210 140 H388 M210 160 H388 M210 180 H388"/></g>
<path d="M270 96 L250 194 H272 L286 96Z" fill="#8c8c8c"/>
<g transform="translate(320 54)"><rect x="0" y="16" width="44" height="26" fill="#c26b3a" stroke="#6e3412" stroke-width="2"/><path d="M-4 18 L22 0 L48 18Z" fill="#7a3a1a"/><rect x="18" y="26" width="9" height="16" fill="#4a3220"/></g>
<g transform="translate(232 38)"><line x1="0" y1="58" x2="0" y2="12" stroke="#fff" stroke-width="4"/><path d="M0 12 L-2 -12 L2 -12Z M0 12 L20 22 L18 26Z M0 12 L-20 22 L-18 26Z" fill="#fff" stroke="#9aa1a6"/></g>
<text x="299" y="184" text-anchor="middle" font-size="15" font-weight="700" fill="#2a1c12" paint-order="stroke" stroke="#dcebd2" stroke-width="5">Felder, Höfe, Straßen</text>
<text x="200" y="216" text-anchor="middle" font-size="14" fill="#6a5a4c">Schematische Zeichnung, kein bestimmter Ort</text>
</svg></div>'''

m.section("familie", "Meine Familie", "Spuren in der Familie",
    '<p>Jede Familie hat ihre eigene Geschichte. Deine Großeltern waren auch einmal so alt wie du. Ihre Kindheit sah aber in vielem anders aus als deine. Wenn sich etwas im Lauf der Zeit verändert, nennt man das <strong>Wandel</strong>.</p>'
    + GEN +
    '<div class="legendlist" aria-hidden="true"><span>Zeitleiste: eigene Zeichnung, Jahreszahlen ungefähr</span></div>'
    + m.zuord("generationen",
        [("u", "Urgroßeltern, um 1930"), ("g", "Großeltern, um 1960"), ("e", "Eltern, um 1990"), ("d", "Du, heute")],
        [("Mit Pferd und Wagen zum Markt fahren", "u"),
         ("Radio hören ist etwas ganz Neues und Aufregendes", "u"),
         ("Fernsehen gibt es nur in Schwarz-Weiß", "g"),
         ("Die Mondlandung 1969 im Fernsehen sehen", "g"),
         ("Musik von der Kassette hören", "e"),
         ("Der erste Computer kommt ins Kinderzimmer", "e"),
         ("Mit dem Tablet in der Schule lernen", "d"),
         ("Mit Oma einen Videoanruf machen", "d")],
        "Alles richtig. Du siehst: In knapp hundert Jahren hat sich der Alltag stark gewandelt, besonders bei der Technik.",
        "Überlege bei jeder Karte: Welche Technik gab es damals schon?",
        "Kindheit in vier Generationen", ["zeit_raum", "fachwissen"],
        hilfe="Pferd und Radio: ältere Zeit. Schwarz-Weiß-Fernsehen und Mondlandung: Großeltern. Kassette und erster Computer: Eltern. Tablet und Videoanruf: heute.",
        intro='<p><strong>Auftrag:</strong> Ordne jede Karte der Generation zu, in deren Kindheit sie am besten passt.</p>'))

m.section("schule", "Schule früher und heute", "Schule früher und heute",
    '<div class="akte"><span class="stamp">Darstellung</span>'
    '<p><strong>Schule auf dem Land um 1950.</strong> Verfassertext für dieses Modul nach dem Forschungsstand.</p>'
    '<p>In vielen Dörfern im Emsland gab es nur eine kleine Volksschule. Oft saßen Kinder aus mehreren Jahrgängen zusammen in einem Raum. Eine Lehrkraft unterrichtete alle gleichzeitig. Die jüngeren Kinder schrieben mit einem Griffel auf eine Schiefertafel. Auch am Samstag war Unterricht. Die Regeln waren streng. Lehrer durften Kinder damals noch schlagen. Heute ist das streng verboten.</p></div>'
    + chronos("Achtung: Das ist eine Darstellung, kein Bericht aus der Zeit selbst. Echte Spuren von damals findest du zum Beispiel in alten Fotos, Schulheften oder in den Erzählungen deiner Großeltern.")
    + '<p>Wandel heißt: Etwas hat sich verändert. Bleibt etwas über lange Zeit gleich, nennt man das <strong>Kontinuität</strong>.</p>'
    + m.zuord("schule",
        [("frueher", "Nur früher, um 1950"), ("heute", "Nur heute"), ("beides", "Früher und heute")],
        [("Schreiben auf einer Schiefertafel", "frueher"),
         ("Lehrer dürfen Kinder schlagen", "frueher"),
         ("Lernen mit Tablets und digitaler Tafel", "heute"),
         ("Schulsozialarbeit als Ansprechpartner bei Sorgen", "heute"),
         ("Lesen, Schreiben und Rechnen lernen", "beides"),
         ("Pausen auf dem Schulhof", "beides")],
        "Klasse sortiert. Manches hat sich gewandelt, zum Beispiel die Strafen und die Technik. Anderes ist gleich geblieben: Lesen, Schreiben und Rechnen lernt man bis heute. Das ist Kontinuität.",
        "Prüfe bei jeder Karte: Gab es das 1950? Gibt es das heute? Oder beides?",
        "Schule früher und heute", ["fachwissen", "zeit_raum"], tag="Wandel oder Kontinuität?",
        hilfe="Das Feld „Früher und heute“ ist für Dinge, die es damals schon gab und heute immer noch gibt.",
        intro='<p><strong>Auftrag:</strong> Ordne die Karten zu. Was gab es nur früher, was nur heute, was gibt es immer noch?</p>'))

QUELLE = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Verfassung des Deutschen Reiches vom 11. August 1919 („Weimarer Verfassung“), Artikel 145.</strong> Beschlossen von der Nationalversammlung, dem gewählten Parlament der Deutschen.</p>
 <blockquote class="q">
  <p>„Es besteht allgemeine Schulpflicht. Ihrer Erfüllung dient grundsätzlich die Volksschule mit mindestens acht Schuljahren und die anschließende Fortbildungsschule bis zum vollendeten achtzehnten Lebensjahre. Der Unterricht und die Lernmittel in den Volksschulen und Fortbildungsschulen sind unentgeltlich.“</p>
 </blockquote>
 <p class="hint">Wörtlich zitiert. Worterklärungen: „grundsätzlich“ heißt hier „in der Regel“. „Lernmittel“ sind Bücher und Hefte. „Unentgeltlich“ heißt „kostenlos“.</p>
</div>'''

m.section("quelle", "Die Quelle", "Die Quelle: ein Gesetz über die Schule von 1919",
    '<p>Dass alle Kinder zur Schule gehen müssen, ist gar nicht so selbstverständlich. 1919 wurde es in die erste demokratische Verfassung Deutschlands geschrieben. Eine Verfassung ist das wichtigste Gesetz eines Staates.</p>'
    + QUELLE
    + m.multi("s2", "S1. Was steht in dieser Quelle? Wähle alle richtigen Aussagen aus.",
        [("pflicht", "Alle Kinder müssen zur Schule gehen."),
         ("acht", "Die Volksschule dauert mindestens acht Jahre."),
         ("kosten", "Unterricht, Bücher und Hefte kosten in diesen Schulen nichts."),
         ("gern", "Die Kinder gingen gern zur Schule."),
         ("tablet", "Jedes Kind bekommt ein Tablet.")],
        ["pflicht", "acht", "kosten"],
        "Richtig. Die Quelle nennt die Schulpflicht, die acht Jahre Volksschule und dass der Unterricht kostenlos ist. Ob die Kinder gern zur Schule gingen, verrät ein Gesetz nicht.",
        {"gern": "Darüber sagt ein Gesetz nichts. Dafür bräuchte man zum Beispiel Erzählungen von Zeitzeugen.",
         "tablet": "1919 gab es noch keine Tablets. Diese Antwort passt nur zu heute."},
        "Was sagt die Quelle?", ["quellenarbeit"], tipp="Lies nur, was wirklich dasteht.", tag="Quellenarbeit")
    + m.mc("kont", "S2. Die Schulpflicht gibt es seit 1919 in ganz Deutschland, und es gibt sie bis heute. Heute dauert sie in Niedersachsen aber mindestens neun Jahre. Was zeigt das?",
        [("a", "Nur Wandel: Mit der Schule hat sich alles verändert."),
         ("b", "Nur Kontinuität: Es ist alles genauso geblieben."),
         ("c", "Beides: Die Schulpflicht ist geblieben, das ist Kontinuität. Die Dauer hat sich verändert, das ist Wandel.")],
        "c",
        {"a": "Nicht ganz. Die Schulpflicht selbst gibt es immer noch. Das ist etwas, das gleich geblieben ist.",
         "b": "Nicht ganz. Acht Jahre damals, mindestens neun heute. Da hat sich etwas verändert.",
         "c": "Genau. In der Geschichte gibt es oft beides gleichzeitig: Kontinuität und Wandel."},
        "Kontinuität und Wandel", ["zeit_raum", "historisches_urteil"], tag="Kontinuität und Wandel"))

m.section("emsland", "Rhede und das Emsland", "Rhede und das Emsland im Wandel",
    '<p>Rhede wird schon im Jahr 829 in einer Urkunde erwähnt. Über viele Jahrhunderte lebten die Menschen hier vor allem von der Landwirtschaft. Ein großer Teil des Emslandes bestand aus Moor und Heide. Das Leben war oft hart, die Menschen waren arm.</p>'
    + EMS +
    m.order("emsland",
        ["Nach dem Zweiten Weltkrieg ist das Emsland eine der ärmsten Gegenden Deutschlands. Viel Land ist nasses Moor.",
         "1950 beschließt der Bundestag den Emslandplan. Das Emsland bekommt viel Geld vom Staat.",
         "Riesige Pflüge brechen den Moorboden um. Gräben leiten das Wasser ab.",
         "Es entstehen neue Felder, Bauernhöfe, Straßen und Betriebe.",
         "Heute gilt das Emsland nicht mehr als arme Gegend."],
        "Genau. Das ist eine Ursache-Folge-Kette: Die Armut war der Grund für den Plan. Der Plan brachte Geld, das Geld machte die Arbeit im Moor möglich, und daraus folgten neue Felder und Arbeitsplätze.",
        "Frage dich: Was musste zuerst da sein, damit der nächste Schritt passieren konnte?",
        "Ursache und Folge im Emsland", ["ursachen_folgen", "zeit_raum"], tag="Ursache-Folge-Kette",
        intro='<p><strong>Auftrag:</strong> Bringe die Kette in die richtige Reihenfolge. Sie beginnt mit der Ursache und endet mit der Folge.</p>')
    + '<div class="notice warn"><strong>Zwei Sichtweisen:</strong> 1950 waren die meisten Menschen froh über neues Ackerland. Heute sieht man das auch kritisch. Trockengelegte Moore geben viel Treibhausgas ab, das dem Klima schadet. Und viele Tiere und Pflanzen verlieren ihren Lebensraum. Deshalb werden manche Moore heute wieder nass gemacht.</div>'
    + m.text("q2", "Q2. Warum haben die Menschen 1950 das Trockenlegen der Moore anders bewertet als viele Menschen heute? Erkläre beide Sichtweisen.",
        "1950 fanden die Menschen das gut, weil ... Heute sehen manche das kritisch, denn ...",
        dict(min=60, worte=14, need=2, saetze=2, gruppen=[
            dict(w=["arm", "acker", "feld", "essen", "arbeit", "geld", "hof", "hunger", "nahrung", "landwirtschaft", "platz"], miss="Erkläre, warum die Menschen 1950 froh über neues Land waren."),
            dict(w=["klima", "treibhaus", "gas", "co2", "tier", "pflanze", "natur", "umwelt", "lebensraum"], miss="Erkläre auch, warum man heute kritischer ist, zum Beispiel wegen Klima oder Natur.")],
            ok="Sehr gut. Du zeigst, dass Menschen zu verschiedenen Zeiten Dinge unterschiedlich bewerten. 1950 ging es um Essen und Arbeit, heute denken viele auch an Klima und Natur. Das nennt man Perspektive."),
        "Weiterdenken Moor", ["perspektivitaet"], tag="Weiterdenken · Zwei Sichtweisen"))

m.section("interview", "Zeitzeugen befragen", "Zeitzeugen befragen: dein Interview",
    '<p>Die besten Quellen für die letzten hundert Jahre sitzen vielleicht bei dir zu Hause: deine Großeltern, ältere Nachbarn oder Verwandte. Sie sind <strong>Zeitzeugen</strong>. Was sie erzählen, ist eine <strong>mündliche Quelle</strong>.</p>'
    + m.mc("zeitzeuge", "Z1. Opa erzählt: „Früher war die Schule viel strenger. Aber wir haben mehr gelernt als ihr heute!“ Wie gehst du mit dieser Aussage um?",
        [("a", "Das stimmt sicher, Opa war ja dabei."),
         ("b", "Das ist Opas Erinnerung und seine Meinung. Sie ist wertvoll, aber persönlich. Ich vergleiche sie mit anderen Quellen."),
         ("c", "Das ist bestimmt falsch, alte Leute erinnern sich nie richtig.")],
        "b",
        {"a": "Opa war dabei, das macht seine Erzählung wertvoll. Aber Erinnerungen verändern sich mit der Zeit. Und ob man mehr gelernt hat, ist eine Meinung.",
         "b": "Genau. Zeitzeugen erzählen aus ihrer eigenen Sicht. Ein anderer Mensch hätte die gleiche Schule vielleicht ganz anders erlebt. Deshalb fragt man mehrere Zeitzeugen und vergleicht.",
         "c": "Das ist unfair. Zeitzeugen erinnern sich oft sehr genau. Man sollte ihre Erzählung nur mit anderen Quellen vergleichen."},
        "Zeitzeugen einschätzen", ["perspektivitaet", "quellenarbeit"], tag="Perspektive")
    + '<div class="merk"><b class="k">Tipps für dein Interview</b>1. Frage vorher, ob die Person mitmachen möchte. 2. Stelle offene W-Fragen, zum Beispiel „Wie …?“ oder „Was …?“. 3. Hör gut zu und schreib Stichworte auf. 4. Frage am Ende, ob du die Antworten im Unterricht erzählen darfst.</div>'
    + m.text("fragen", "Z2. Plane dein eigenes Interview: Schreibe drei Fragen auf, die du einer älteren Person über ihre Kindheit, ihre Schulzeit oder ihren Wohnort stellen möchtest.",
        "Wie sah dein Klassenzimmer aus? ...",
        dict(min=45, worte=10, need=1, saetze=3, nover=True,
             knapp="Schreibe drei vollständige Fragen. Beginne zum Beispiel mit „Wie …?“, „Was …?“ oder „Welche …?“ und setze am Ende ein Fragezeichen.",
             zuwenig="Es sollen drei Fragen sein. Setze hinter jede Frage ein Fragezeichen. ",
             gruppen=[dict(w=["wie ", "was ", "wo ", "wann ", "warum ", "welche", "wer ", "womit", "wieso", "weshalb", "wohin"], miss="Nutze W-Fragen, zum Beispiel „Wie …?“ oder „Was …?“.")],
             ok="Super Fragen. Damit bist du bereit für dein Interview. Frag zu Hause nach und bring die Antworten mit in den Unterricht. So entsteht eine echte mündliche Quelle."),
        "Interviewfragen", ["quellenarbeit"], tag="Dein Interview", zusatz=False, lw=None,
        sicher="„Wie sah dein Klassenzimmer aus?“ · „Was habt ihr in der Pause gespielt?“ · „Wie hat sich Rhede seit deiner Kindheit verändert?“")
    + '<p class="hint">Schreibe hier keine Namen oder privaten Dinge über andere Menschen auf.</p>')

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Zeitreise 003</span>
 <p><strong>Fall:</strong> Chronos blättert in einem alten Fotoalbum. Er seufzt und schreibt auf eine Karteikarte: <em>„Früher war alles ganz anders als heute.“</em></p>
 <p><strong>Dein Auftrag:</strong> Untersuche Familie, Schule und Wohnort. Finde heraus, was sich verändert hat und was gleich geblieben ist. Am Ende entscheidest du, ob Chronos recht hat.</p>
</div>
<p><strong>Zum Einstieg:</strong> Frag dich einmal: Wie sind deine Großeltern zur Schule gekommen? Gab es damals schon Handys? Und gab es deine Schule überhaupt schon?</p>
{chronos("In meinem Fotoalbum sind die Bilder schwarz-weiß. Da denkt man schnell, früher war die Welt grau. War sie aber nicht! Nur die Fotos waren es. Komm, wir sehen genauer hin.")}
<p><strong>Leitfrage:</strong> Was verraten Familie, Schule und Wohnort über Wandel?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Familienforscherin</span>
 <span class="abz" id="abz2">Schulreporter</span>
 <span class="abz" id="abz3">Ortskenner</span>
 <span class="abz" id="abz4">Interviewprofi</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Vermutung", "D1. Was ist ein Zeitzeuge?",
     [("a", "Eine Uhr, die besonders genau geht"), ("b", "Ein Mensch, der etwas selbst erlebt hat und davon erzählen kann"), ("c", "Ein Buch über Geschichte")], "b"),
    ("d2", "Richtig oder falsch", "D2. Vor etwa 70 Jahren hatten im Emsland schon fast alle Familien ein Auto.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "f"),
    ("d3", "Vermutung", "D3. Was bedeutet das Wort „Wandel“ im Fach Geschichte?",
     [("a", "Ein Spaziergang"), ("b", "Eine Veränderung im Lauf der Zeit"), ("c", "Ein altes Wort für Wand")], "b")],
    dict(alle="Drei von drei. Super! Der Lernweg Weiterdenken könnte dir Spaß machen.",
         fast="Zwei von drei. Gute Grundlage. Im Modul lernst du, wie man Wandel erkennt.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da. Der Lernweg Sicher werden gibt dir mehr Hilfen.",
         extra=[dict(n="d2", v="r", m="Ein Hinweis vorab: Um 1955 hatten nur wenige Familien ein Auto. Viele fuhren Fahrrad oder gingen zu Fuß.")]))

gloss = glossar_section([
    ("Wandel", "Eine Veränderung im Lauf der Zeit, zum Beispiel neue Technik oder neue Regeln in der Schule."),
    ("Kontinuität", "Etwas bleibt über lange Zeit gleich, zum Beispiel dass Kinder lesen und schreiben lernen."),
    ("Generation", "Alle Menschen, die ungefähr zur gleichen Zeit geboren sind. Kinder, Eltern und Großeltern sind drei Generationen."),
    ("Zeitzeuge, Zeitzeugin", "Ein Mensch, der etwas selbst erlebt hat und davon erzählen kann. Was er erzählt, ist eine mündliche Quelle."),
    ("Interview", "Ein Gespräch, bei dem eine Person Fragen stellt und eine andere antwortet."),
    ("Verfassung", "Das wichtigste Gesetz eines Staates. Darin steht, wie der Staat aufgebaut ist und welche Rechte die Menschen haben."),
    ("Schulpflicht", "Alle Kinder müssen eine bestimmte Zahl von Jahren zur Schule gehen."),
    ("Emslandplan", "Ein Plan des Staates ab 1950. Mit viel Geld wurden Moore und Heide in Ackerland verwandelt und Straßen und Betriebe gebaut."),
    ("Perspektive", "Die Sicht, aus der ein Mensch etwas betrachtet. Verschiedene Menschen können dasselbe unterschiedlich sehen.")],
    ["Verfassung des Deutschen Reiches vom 11. August 1919, Artikel 145, wörtlich zitiert (amtlicher Text, gemeinfrei).",
     "Emslandplan: einstimmiger Beschluss des Deutschen Bundestages am 5. Mai 1950; umgesetzt ab 1951 durch die Emsland GmbH, offiziell beendet 1989.",
     "Rhede (Ems): erste urkundliche Erwähnung 829; etwa drei Viertel der Gemeindefläche werden landwirtschaftlich genutzt.",
     "Schulpflicht in Niedersachsen heute: neun Jahre Vollzeitschulpflicht, danach in der Regel Berufsschulpflicht.",
     "Der Text „Schule auf dem Land um 1950“ ist ein Verfassertext (Darstellung). Generationen-Zeitleiste und Moor-Zeichnung sind eigene schematische Zeichnungen."])

lc = lerncheck_section(["Ich kann an Beispielen aus Familie und Schule erklären, was Wandel und was Kontinuität ist.",
                        "Ich kann erklären, wie sich das Emsland seit 1950 verändert hat.",
                        "Ich kann Fragen für ein Zeitzeugen-Interview formulieren und weiß, dass Erinnerungen persönlich sind."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf Chronos\' Karteikarte steht: <em>„Früher war alles ganz anders als heute.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt. Früher war wirklich alles anders."),
     ("b", "Die Karte stimmt nur zum Teil. Vieles hat sich gewandelt, zum Beispiel die Technik. Aber manches ist gleich geblieben, zum Beispiel die Schulpflicht. Das ist Kontinuität."),
     ("c", "Die Karte ist falsch. Früher war alles genauso wie heute.")],
    ["b"],
    {"a": "Denk an die Schule: Lesen, Schreiben und Rechnen lernt man immer noch. Nicht alles hat sich verändert. Wähle noch einmal.",
     "b": "Sehr gut entschieden. Du erkennst Wandel und Kontinuität. Begründe das jetzt in A2.",
     "c": "Denk an die Schiefertafel und das Tablet. Da hat sich viel verändert. Wähle noch einmal."},
    "Schreibe Chronos eine kurze Nachricht mit zwei bis vier Sätzen. Nenne ein Beispiel für Wandel und ein Beispiel für Kontinuität.",
    "Lieber Chronos, nicht alles war früher anders, denn ...",
    "„Ein Beispiel für Wandel ist ..., weil ...“ · „Gleich geblieben ist ..., denn ...“",
    dict(min=60, worte=14, need=2, saetze=2, gruppen=[
        dict(w=["wandel", "verander", "anders", "neu", "tablet", "fernseh", "computer", "schiefertafel", "griffel", "schlagen", "auto", "pferd", "moor", "handy", "technik"], miss="Nenne ein Beispiel für Wandel, also etwas, das sich verändert hat."),
        dict(w=["kontinuit", "gleich geblieben", "geblieben", "immer noch", "bis heute", "gleich", "schulpflicht", "lesen", "schreiben", "rechnen", "pause", "landwirtschaft"], miss="Nenne auch ein Beispiel für Kontinuität, also etwas, das gleich geblieben ist.")],
        ok="Sehr gut. Du nennst Wandel und Kontinuität mit Beispielen. Genau so denken Historikerinnen und Historiker. Abzeichen Begründer freigeschaltet."))

build(m, "Spurensuche starten",
      ["Du vergleichst die Kindheit verschiedener Generationen.",
       "Du vergleichst die Schule früher und heute.",
       "Du lernst die Begriffe Wandel und Kontinuität kennen.",
       "Du erfährst, wie sich Rhede und das Emsland seit 1950 verändert haben.",
       "Du planst ein eigenes Interview mit einem Zeitzeugen."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos hat sein Fotoalbum aufgeschlagen. Es geht weiter mit der Mission.")
