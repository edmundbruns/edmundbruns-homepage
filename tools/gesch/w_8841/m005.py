# -*- coding: utf-8 -*-
from common import *
from tl import timeline_svg

m = Modul("005", "Kinderarbeit: Notwendigkeit oder Unrecht?", "Kinderarbeit",
          "Industrialisierung und soziale Frage · Akte 005",
          "Sarah Gooder war acht Jahre alt, als sie 1842 einem Beamten erzählte, wie sie im Dunkeln unter Tage arbeitete. Warum mussten Kinder arbeiten, wer sah das wie, und wer wollte es ändern?",
          "Weiter geht es mit Modul 006: Welche Antworten gab es auf die soziale Frage?",
          badges=[], sensibel=True)

m.section("arbeit", "Wo Kinder arbeiteten", "Wo Kinder arbeiteten",
    '<p>Kinderarbeit gab es schon lange vor den Fabriken. Auf Bauernhöfen und in Werkstätten halfen Kinder mit. Neu war in der Industrialisierung, dass Kinder viele Stunden außer Haus, an Maschinen oder unter Tage arbeiteten, nach festen Zeiten und unter fremder Aufsicht. Ordne die Tätigkeiten den Arbeitsorten zu.</p>'
    + m.zuord("orte",
        [("spinnerei", "Spinnerei"), ("bergwerk", "Bergwerk"), ("zuhause", "Heimarbeit zu Hause")],
        [("Gerissene Fäden an der laufenden Maschine schnell wieder anknüpfen", "spinnerei"),
         ("Volle Spulen gegen leere austauschen", "spinnerei"),
         ("Im Dunkeln Lufttüren öffnen und schließen", "bergwerk"),
         ("Kohlewagen durch niedrige Stollen ziehen oder schieben", "bergwerk"),
         ("Garn für den Webstuhl der Eltern aufspulen", "zuhause"),
         ("Bis spät abends mit der Mutter Ware für einen Händler fertigmachen", "zuhause")],
        "Alle richtig. In der Spinnerei brauchte man flinke Finger, im Bergwerk kleine Körper für enge Gänge. Zu Hause halfen Kinder oft bis spät in die Nacht, damit die Familie genug verdiente.",
        "Frage dich: Gibt es dort Maschinen und Fäden, Kohle und Dunkelheit, oder arbeitet die Familie zu Hause?",
        "Arbeitsorte von Kindern", ["fachwissen", "ursachen_folgen"], tag="Zuordnen"))

GOODER = '''<div class="akte">
 <span class="stamp">Quelle 1</span>
 <p><strong>Aussage von Sarah Gooder, 8 Jahre, vor der englischen Untersuchungskommission über Kinderarbeit im Bergbau, veröffentlicht 1842.</strong> Beamte der Kommission befragten Kinder in den Kohlegruben und schrieben ihre Antworten auf. Der Bericht wurde dem Parlament vorgelegt.</p>
 <blockquote class="q">
 <p>„Ich bin Türöffnerin in der Gawber-Grube. Es macht mich nicht müde, aber ich muss ohne Licht die Tür bedienen, und ich habe Angst. Ich gehe um vier und manchmal um halb vier morgens hinein und komme um fünf oder halb sechs heraus. Ich schlafe nie ein. Manchmal singe ich, wenn ich Licht habe, aber nicht im Dunkeln. Dann traue ich mich nicht zu singen. Ich bin nicht gern in der Grube. […] Ich gehe in die Sonntagsschule und lese ‚Reading made Easy‘.“</p>
 <p class="orig">Englischer Wortlaut des Anfangs: „I'm a trapper in the Gawber pit. It does not tire me, but I have to trap without a light and I'm scared.“</p>
 </blockquote>
 <p class="hint">Deutsche Übersetzung für dieses Modul. „Reading made Easy“ war ein Lesebuch für Anfänger. Eine Türöffnerin, englisch „trapper“, öffnete Lufttüren in den Stollen, wenn Kohlewagen kamen.</p>
</div>'''

REGULATIV = '''<div class="akte">
 <span class="stamp">Quelle 2</span>
 <p><strong>Regulativ über die Beschäftigung jugendlicher Arbeiter in Fabriken, Preußen, 9. März 1839 (Auszug).</strong> Erlassen vom preußischen Staatsministerium. Es war das erste Gesetz in Deutschland, das Kinderarbeit in Fabriken begrenzte.</p>
 <blockquote class="q">
 <p>„§ 1. Vor zurückgelegtem neuntem Lebensjahre darf niemand in einer Fabrik oder bei Berg-, Hütten- und Pochwerken zu einer regelmäßigen Beschäftigung angenommen werden. […]</p>
 <p>§ 3. Junge Leute, welche das sechzehnte Lebensjahr noch nicht zurückgelegt haben, dürfen in diesen Anstalten nicht über zehn Stunden täglich beschäftigt werden. […]</p>
 <p>§ 5. Die Beschäftigung solcher jungen Leute vor 5 Uhr Morgens und nach 9 Uhr Abends, so wie an den Sonn- und Feiertagen ist gänzlich untersagt.“</p>
 </blockquote>
 <p class="wort"><strong>Worterklärungen:</strong> vor zurückgelegtem neuntem Lebensjahre = bevor man neun Jahre alt geworden ist · Pochwerk = Anlage zum Zerkleinern von Erz · gänzlich untersagt = ganz verboten</p>
</div>'''

m.section("quelle", "Die Quellen", "Die Quellen: Ein Kind und ein Gesetz",
    '<p>Chronos hat zwei Quellen nebeneinandergelegt: die Stimme eines Kindes aus England und ein Gesetz aus Preußen.</p>' + GOODER
    + chronos("Bitte lies Sarahs Worte langsam. Sie war acht Jahre alt. Hinter jeder Zahl in den Berichten jener Zeit steht ein Kind wie sie.")
    + m.multi("s1", "S1. Was erzählt Sarah? Wähle alle zutreffenden Aussagen aus.",
        [("dunkel", "Sie arbeitet ohne Licht und hat Angst."),
         ("zeit", "Sie geht vor dem Morgengrauen in die Grube und kommt erst am späten Nachmittag heraus."),
         ("schule", "Sie geht sonntags zur Schule und lernt lesen."),
         ("gern", "Sie arbeitet gern unter Tage."),
         ("geld", "Sie verdient so viel, dass sie davon allein leben kann.")],
        ["dunkel", "zeit", "schule"],
        "Genau. Sarah arbeitet rund zwölf Stunden im Dunkeln und hat Angst. Lesen lernt sie nur am Sonntag. Über ihren Lohn sagt sie nichts.",
        {"gern": "Nein. Sie sagt ausdrücklich: Ich bin nicht gern in der Grube.",
         "geld": "Davon steht nichts in ihrer Aussage. Kinder verdienten nur einen kleinen Teil des Lohns von Erwachsenen."},
        "Kinderstimme auswerten", ["quellenarbeit"], tag="Quellenarbeit")
    + m.mc("s2", "S2. Sarahs Worte wurden von einem Beamten der Kommission aufgeschrieben. Was musst du dabei bedenken?",
        [("a", "Sarah hat die Aussage selbst als Buch veröffentlicht."),
         ("b", "Weil sie ein Kind war, ist die Aussage bestimmt erfunden."),
         ("c", "Ein Erwachsener hat Fragen gestellt und die Antworten aufgeschrieben, vielleicht gekürzt. Die Kommission wollte Missstände zeigen, damit ein Gesetz kommt.")],
        "c",
        {"a": "Nein. Sarah konnte gerade erst ihre Buchstaben. Die Aussage steht im Bericht der Kommission.",
         "b": "Das ist zu einfach. Kinder können sehr genau berichten. Man muss nur beachten, wer die Fragen stellte und warum.",
         "c": "Richtig. Die Aussage ist eine wertvolle Kinderstimme, aber sie kam über einen Erwachsenen zu uns. Die Kommission hatte ein Ziel. Tatsächlich verbot noch 1842 ein Gesetz in England die Arbeit von Frauen, Mädchen und Jungen unter zehn Jahren unter Tage."},
        "Quellenkritik", ["quellenarbeit", "perspektivitaet"], tag="Quellenkritik")
    + REGULATIV
    + m.mc("q1", "S3. Was erlaubte das preußische Regulativ von 1839 noch?",
        [("a", "Es verbot jede Kinderarbeit."),
         ("b", "Kinder ab neun Jahren durften bis zu zehn Stunden am Tag in Fabriken arbeiten."),
         ("c", "Kinder durften nachts arbeiten, wenn die Eltern zustimmten.")],
        "b",
        {"a": "Nein. Es setzte nur Grenzen: kein regelmäßiger Fabrikdienst unter neun Jahren, höchstens zehn Stunden unter sechzehn.",
         "b": "Richtig. Das Regulativ war ein erster Schritt, kein Verbot. Ein Kind von neun Jahren durfte zehn Stunden am Tag arbeiten. Kontrolliert wurde lange kaum. Erst 1853 verbot Preußen die Fabrikarbeit unter zwölf Jahren.",
         "c": "Nein. § 5 verbietet Arbeit vor 5 Uhr und nach 21 Uhr ganz."},
        "Gesetz auswerten", ["quellenarbeit", "zeit_raum"], tag="Quellenarbeit")
    + m.text("q2", "Weiterdenken. Ein Beamter des Landrats in Bielefeld schrieb 1874 über Mädchen, die in der Ravensberger Spinnerei arbeiteten und nebenher eine Fabrikschule besuchten: „Die Kinder, schon kränklich in ihrem Aussehen, sind geistig stumpf und abgespannt. Kein Wunder bei der vielen Arbeit, schlechten Luft und wenig Nahrung. […] Die Schuld an diesem Zustande der armen Kinder trifft allerdings in erster Linie die Eltern, welche die Leistungsfähigkeit ihrer Kinder nur ausbeuten wollen; nicht minder aber auch die Fabrikanten […].“ Die evangelische Kirche in der Gegend hatte 1860 dagegen berichtet, dass die Weberfamilien verarmten und sich die Eltern „gezwungen sehen“, ihre Kinder in die Spinnerei zu schicken. Wer trug deiner Meinung nach die Verantwortung? Begründe.",
        "Ich finde, die Verantwortung lag bei ..., weil ... Man muss aber auch bedenken, dass ...",
        dict(min=80, worte=20, need=2, gruppen=[
            dict(w=["eltern", "familie", "vater", "mutter"], miss="Gehe auf die Eltern ein."),
            dict(w=["fabrikant", "unternehm", "fabrik", "staat", "gesetz", "regierung", "kontroll", "arm", "not"], miss="Gehe auf Fabrikanten, Staat oder die Armut ein.")],
            ok="Gut abgewogen. Der Beamte gibt vor allem den Eltern die Schuld. Die Kirche sah dagegen die Armut als Ursache. Wer beide Quellen vergleicht, erkennt: Die Not der Familien, das Interesse der Fabrikanten an billigen Arbeitskräften und fehlende Kontrollen wirkten zusammen."),
        "Weiterdenken Verantwortung", ["perspektivitaet", "historisches_urteil"], tag="Weiterdenken · zwei weitere Quellen"))

m.section("perspektiven", "Wer sah das wie?", "Wer sah das wie?",
    '<p>Über Kinderarbeit wurde im 19. Jahrhundert heftig gestritten. Ordne jede Aussage der Gruppe zu, die so denken konnte.</p>'
    '<div class="notice warn"><strong>Wichtig:</strong> Die erste Aussage stammt sinngemäß von Sarah Gooder. Die übrigen Aussagen sind keine Zitate, sondern für dieses Modul formulierte typische Sichtweisen.</div>'
    + m.zuord("persp",
        [("kinder", "Kinder"), ("eltern", "Eltern"), ("fabrikanten", "Fabrikanten"), ("reformer", "Reformer und Staat")],
        [("Ich muss ohne Licht arbeiten und habe Angst.", "kinder"),
         ("Nach Schule und Fabrik bleibt keine Zeit zum Spielen oder für Hausaufgaben.", "kinder"),
         ("Ohne den Lohn der Kinder reicht das Geld nicht für Brot und Miete.", "eltern"),
         ("Wir haben als Kinder auch auf dem Hof mitgearbeitet. Arbeit schadet nicht.", "eltern"),
         ("Kinderhände sind geschickt und billig. Ohne sie kann ich nicht mithalten.", "fabrikanten"),
         ("Ich biete eine Fabrikschule an, so lernen die Kinder trotzdem lesen.", "fabrikanten"),
         ("Die Kinder werden krank und lernen nichts. Der Staat muss Grenzen setzen.", "reformer"),
         ("Kinder gehören in die Schule. Die Gesetze müssen auch kontrolliert werden.", "reformer")],
        "Alle richtig. Jede Gruppe hatte ihre Gründe. Die Eltern handelten oft aus Not, die Fabrikanten aus Kostengründen. Die Kinder selbst wurden am wenigsten gefragt. Reformer, Ärzte, Lehrer und Kirchenleute drängten auf Schutzgesetze.",
        "Frage dich: Wer erlebt die Arbeit selbst, wer braucht das Geld, wer spart Kosten, und wer will etwas ändern?",
        "Perspektiven zuordnen", ["perspektivitaet"], tag="Perspektivwechsel",
        hilfe="Reformer waren zum Beispiel Ärzte, Lehrer, Pfarrer und Politiker, die Kinderarbeit begrenzen wollten."))

TL = [(1833, "England: keine Kinder unter 9 Jahren in Textilfabriken"), (1839, "Preußen: Regulativ, Fabrikarbeit erst ab 9 Jahren"),
      (1842, "England: keine Frauen und Mädchen, keine Jungen unter 10 Jahren unter Tage"), (1853, "Preußen: Fabrikarbeit erst ab 12 Jahren"),
      (1891, "Deutsches Reich: Fabrikarbeit erst ab 13 Jahren"), (1903, "Kinderschutzgesetz: Grenzen auch für Arbeit außerhalb der Fabriken")]

m.section("gesetze", "Schritte zum Schutz", "Schritt für Schritt zum Schutz",
    '<p>Kinderarbeit wurde nicht auf einmal verboten. Gesetze kamen Schritt für Schritt, und oft wurden sie anfangs kaum kontrolliert.</p>'
    '<div class="svgwrap">' + timeline_svg(TL, "Zeitleiste der Schutzgesetze von 1833 bis 1903", wrap=26) + '</div><div class="legendlist" aria-hidden="true"><span>Zeitleiste: eigene Darstellung, vereinfacht</span></div>'
    + m.luecke("gesetze",
        ["Zuerst handelte ", ("England", ["Frankreich", "Bayern"]), ": 1833 durften dort keine Kinder unter neun Jahren mehr in Textilfabriken arbeiten. In Preußen folgte ",
         ("1839", ["1739", "1939"]), " das Regulativ. Nach dem Bericht von 1842 durften in England Jungen unter ", ("zehn", ["vier", "zwanzig"]),
         " Jahren nicht mehr unter Tage arbeiten. 1853 verbot Preußen die Fabrikarbeit von Kindern unter ", ("zwölf", ["sechs", "achtzehn"]),
         " Jahren. Ein großes Problem blieb lange: Die Gesetze wurden kaum ", ("kontrolliert", ["gedruckt", "gelesen"]), "."],
        "Alles richtig. Die Schutzgesetze kamen langsam. Erst mit Fabrikinspektoren, die Betriebe besuchten, und mit der Schulpflicht ging die Kinderarbeit in Fabriken wirklich zurück.",
        "Tipp: Die Zeitleiste hilft dir.",
        "Schutzgesetze", ["zeit_raum", "fachwissen"], tag="Lückentext",
        intro='<p><strong>Auftrag:</strong> Wähle in jeder Lücke das passende Wort.</p>'))

m.section("heute", "Kinderarbeit heute", "Kinderarbeit heute",
    '<p>Kinderarbeit ist kein abgeschlossenes Kapitel. Nach Schätzungen der Internationalen Arbeitsorganisation (ILO) und von UNICEF mussten im Jahr 2024 weltweit rund 138 Millionen Kinder arbeiten. Etwa 54 Millionen von ihnen verrichteten gefährliche Arbeit, die ihre Gesundheit oder ihr Leben bedroht.</p>'
    + m.mc("heute", "G1. In welchem Bereich arbeiten heute die meisten Kinder, die Kinderarbeit leisten?",
        [("a", "In Fabriken in Europa"),
         ("b", "In Büros"),
         ("c", "In der Landwirtschaft, zum Beispiel auf Feldern und Plantagen")],
        "c",
        {"a": "Nein. In Europa ist Kinderarbeit in Fabriken verboten und selten. Die meisten Kinder arbeiten anderswo.",
         "b": "Nein. Denke an Länder mit viel Landwirtschaft und großer Armut.",
         "c": "Richtig. Rund 61 Prozent der arbeitenden Kinder sind in der Landwirtschaft tätig, oft in der eigenen Familie. Die Ursache ist meist dieselbe wie im 19. Jahrhundert: Armut."},
        "Gegenwartsbezug", ["ursachen_folgen", "historisches_urteil"], tag="Gegenwart")
    + '<div class="notice"><strong>Und in Deutschland?</strong> Das Jugendarbeitsschutzgesetz verbietet die Arbeit von Kindern unter 15 Jahren. Ab 13 Jahren sind mit Zustimmung der Eltern leichte Tätigkeiten erlaubt, höchstens zwei Stunden am Tag, zum Beispiel Zeitungen austragen oder Nachhilfe geben. Die Schule geht immer vor.</div>')

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Akte 005</span>
 <p><strong>Fall:</strong> Im Archiv liegen zwei Karteikarten mit gegensätzlichen Aussagen. Auf der einen steht: <em>„Ohne Kinderarbeit hätten viele Familien nicht überlebt. Sie war eine Notwendigkeit.“</em> Auf der anderen: <em>„Kinderarbeit war ein Unrecht.“</em></p>
 <p><strong>Dein Auftrag:</strong> Lies die Quellen, betrachte die Sichtweisen der Beteiligten und komme zu einem eigenen, begründeten Urteil.</p>
</div>
{chronos("Bei diesem Thema mache ich keine Scherze. Es geht um Kinder, die so alt waren wie deine jüngeren Geschwister oder Nachbarskinder. Nimm dir Zeit und urteile erst am Ende.")}
<p><strong>Leitfrage:</strong> Kinderarbeit: Notwendigkeit oder Unrecht?</p>
</section>'''

diag = diag_section(m, [
    ("d1", "Richtig oder falsch", "D1. Kinderarbeit gab es schon vor den Fabriken, zum Beispiel auf Bauernhöfen.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "r"),
    ("d2", "Schätzfrage", "D2. Ab welchem Alter durften Kinder nach dem preußischen Gesetz von 1839 regelmäßig in Fabriken arbeiten?",
     [("a", "Ab 4 Jahren"), ("b", "Ab 9 Jahren"), ("c", "Ab 16 Jahren")], "b"),
    ("d3", "Vermutung", "D3. Gibt es heute noch Kinderarbeit auf der Welt?",
     [("a", "Nein, sie ist überall verschwunden"), ("b", "Ja, Millionen Kinder müssen arbeiten"), ("c", "Nur in Deutschland")], "b")],
    dict(alle="Drei von drei. Du hast schon ein gutes Vorwissen.",
         fast="Zwei von drei. Gute Grundlage.",
         wenig="Du hast # von drei getroffen. Das ist in Ordnung, das Modul klärt die Fragen.",
         extra=[dict(n="d3", v="a", m="Ein Hinweis vorab: Leider gibt es Kinderarbeit bis heute, du erfährst im Modul mehr darüber.")]),
    h2="Was glaubst du?")

gloss = glossar_section([
    ("Kinderarbeit", "Arbeit von Kindern, die ihnen schadet, weil sie zu lang, zu schwer oder zu gefährlich ist oder den Schulbesuch verhindert. Kleine Hilfen im Haushalt zählen nicht dazu."),
    ("Untersuchungskommission", "Eine Gruppe von Fachleuten, die im Auftrag des Parlaments Missstände untersucht und darüber berichtet. In England gab es solche Kommissionen zur Kinderarbeit 1832, 1833 und 1842."),
    ("Regulativ", "Eine staatliche Verordnung mit Regeln. Das preußische Regulativ von 1839 begrenzte zum ersten Mal in Deutschland die Kinderarbeit in Fabriken."),
    ("Fabrikschule", "Eine Schule, die ein Fabrikbesitzer einrichtete, damit arbeitende Kinder nebenher Unterricht bekamen. Oft war der Unterricht schlecht und die Kinder übermüdet."),
    ("Fabrikinspektor", "Ein Beamter, der Fabriken besucht und kontrolliert, ob Schutzgesetze eingehalten werden."),
    ("Schulpflicht", "Die Pflicht, eine Schule zu besuchen. Sie bestand in Preußen schon lange, wurde aber oft nicht durchgesetzt."),
    ("ILO", "Die Internationale Arbeitsorganisation der Vereinten Nationen. Sie setzt sich für Arbeitsschutz und gegen Kinderarbeit ein.")],
    ["Children's Employment Commission, First Report: Mines, London 1842, Aussage Nr. 116 (Sarah Gooder). Englischer Wortlaut nach dem Abdruck bei The Victorian Web; deutsche Übersetzung für dieses Modul.",
     "Regulativ über die Beschäftigung jugendlicher Arbeiter in Fabriken vom 9. März 1839, §§ 1, 3, 5. Nach dem Abdruck in der Unterrichtsreihe „Die Geschichte der Industrialisierung in Bielefeld“ der Universität Bielefeld (Vorlage: Saadi-Varchmin, Kinderarbeit ist verboten!, 1984).",
     "Bericht aus dem Landratsamt Bielefeld vom 4. September 1874 über die Fabrikschule der Ravensberger Spinnerei sowie Bericht der Evangelischen Kreissynode 1860. Nach derselben Unterrichtsreihe (Vorlagen: Volkshochschule Bielefeld 1986; J. Altenberend 1982/83).",
     "ILO und UNICEF, Schätzung zur Kinderarbeit 2024, veröffentlicht im Juni 2025: rund 138 Millionen Kinder, davon etwa 54 Millionen in gefährlicher Arbeit, 61 Prozent in der Landwirtschaft.",
     "Gesetze: Factory Act 1833, Mines Act 1842, preußisches Gesetz 1853, Arbeiterschutzgesetz 1891, Kinderschutzgesetz 1903. Jugendarbeitsschutzgesetz § 5."])

lc = lerncheck_section(["Ich kann erklären, warum Kinder im 19. Jahrhundert arbeiten mussten.",
                        "Ich kann verschiedene Sichtweisen auf Kinderarbeit unterscheiden.",
                        "Ich kann Kinderarbeit früher und heute vergleichen und mir ein Urteil bilden."])

absch = abschluss_section(m, "Abschlussmission: dein Urteil",
    '<p>Auf den beiden Karteikarten steht: <em>„Kinderarbeit war eine Notwendigkeit.“</em> und <em>„Kinderarbeit war ein Unrecht.“</em></p>',
    "Wie urteilst du?",
    [("a", "Notwendigkeit: Ohne Kinderarbeit hätten viele Familien nicht überlebt, deshalb war sie in Ordnung."),
     ("b", "Unrecht: Kinder wurden krank und konnten kaum lernen, auch wenn viele Familien auf ihren Lohn angewiesen waren."),
     ("c", "Beides zugleich: Für arme Familien war sie oft eine Notwendigkeit, für die Kinder trotzdem ein Unrecht. Deshalb waren Schutzgesetze nötig."),
     ("d", "Kinderarbeit war harmlos, weil Kinder auch früher auf dem Hof geholfen haben.")],
    ["b", "c"],
    {"a": "Die Not der Familien war echt, das hast du richtig erkannt. Prüfe aber: Wird etwas in Ordnung, nur weil es notwendig erscheint? Denke an Sarah im Dunkeln und an die kranken Kinder in Bielefeld.",
     "b": "Ein begründbares Urteil. Du stellst die Kinder in den Mittelpunkt und vergisst die Not der Familien nicht. Begründe das jetzt in A2.",
     "c": "Ein begründbares Urteil. Du unterscheidest die Sicht der Familien von dem, was den Kindern angetan wurde. Begründe das jetzt in A2.",
     "d": "Das passt nicht zu den Quellen. Zwölf Stunden im Dunkeln oder in heißen, nassen Spinnsälen sind etwas anderes als Mithilfe auf dem Hof."},
    "Begründe dein Urteil in drei bis fünf Sätzen. Gehe auf die Lage der Familien, auf die Folgen für die Kinder und auf mindestens eine Quelle oder ein Gesetz ein.",
    "Ich halte Kinderarbeit für ..., weil ...",
    "„Viele Familien brauchten den Lohn der Kinder, weil ...“ · „Für die Kinder war das schlimm, denn ...“ · „Sarah Gooder erzählt zum Beispiel, dass ...“",
    dict(min=80, worte=20, need=3, saetze=3, gruppen=[
        dict(w=["familie", "eltern", "lohn", "arm", "geld", "not", "uberleb", "brot", "miete"], miss="Gehe auf die Lage der Familien ein, zum Beispiel die Armut."),
        dict(w=["krank", "schule", "lernen", "angst", "gesund", "kindheit", "dunkel", "mude", "spielen", "stumpf"], miss="Beschreibe die Folgen für die Kinder, zum Beispiel Krankheit oder fehlende Schule."),
        dict(w=["sarah", "gooder", "regulativ", "1839", "1842", "gesetz", "landrat", "quelle", "kommission", "bielefeld", "spinnerei"], miss="Nutze eine Quelle oder ein Gesetz als Beleg.")],
        ok="Sehr gut. Du wägst die Not der Familien gegen das Leid der Kinder ab und belegst dein Urteil mit Quellen. Genau so entsteht ein historisches Urteil."),
    extra='<div class="notice privacy"><strong>Zum Schluss:</strong> Dieses Thema kann nachdenklich machen. Wenn dich etwas beschäftigt oder du Fragen zu Kinderarbeit heute hast, sprich gern mit deiner Lehrkraft oder mit der Schulsozialarbeit.</div>')

build(m, "Modul starten",
      ["Du beschreibst, wo und wie Kinder im 19. Jahrhundert arbeiteten.",
       "Du wertest die Aussage eines achtjährigen Mädchens von 1842 aus.",
       "Du untersuchst das erste deutsche Gesetz gegen Kinderarbeit von 1839.",
       "Du vergleichst die Sichtweisen von Kindern, Eltern, Fabrikanten und Reformern.",
       "Du vergleichst mit heute und bildest dir ein begründetes Urteil."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Es geht weiter mit der Mission.")
