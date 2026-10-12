# -*- coding: utf-8 -*-
from common import *

m = Modul("007", "Lerncheck: Industrialisierung und soziale Frage", "Lerncheck",
          "Industrialisierung und soziale Frage · Lerncheck 007",
          "Dieses Modul ist eine Wiederholung. Du prüfst, was du in den Modulen 001 bis 006 gelernt hast: über den Beginn in England, die Arbeit in der Fabrik, das Wachstum der Städte, das Leben der Arbeiterfamilien, die Kinderarbeit und die Antworten auf die soziale Frage.",
          "Weiter geht es mit Modul 008: Was bedeutete Nation im 19. Jahrhundert?",
          badges=[dict(id="abz1", name="Zeitreisender", tasks=["zeit"]),
                  dict(id="abz2", name="Ordnungssinn", tasks=["themen", "kette"]),
                  dict(id="abz3", name="Quellenprüfer", tasks=["s1", "s2"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])])

ROWS = [("j1769", "1769", "Patent für Watts Dampfmaschine"), ("j1835", "1835", "Erste deutsche Eisenbahn"),
        ("j1839", "1839", "Preußisches Regulativ"), ("j1848", "1848", "Kommunistisches Manifest"),
        ("j1856", "1856", "Fabrikordnung in Bielefeld"), ("j1883", "1883", "Krankenversicherung"),
        ("j1892", "1892", "Cholera in Hamburg"), ("j1899", "1899", "Dortmund-Ems-Kanal")]
svg = '<svg class="pic" viewBox="0 0 380 560" role="img" aria-label="Zeitstrahl mit acht Ereignissen von 1769 bis 1899" style="max-width:520px;margin:auto"><rect width="380" height="560" fill="#fbfaf6"/>'
svg += '<line x1="40" y1="20" x2="40" y2="540" stroke="#37546b" stroke-width="4"/>'
for i, (rid, j, t) in enumerate(ROWS):
    y = 22 + i * 65
    svg += (f'<g id="{rid}" class="hot" data-task="zeit" tabindex="0" role="button" aria-label="{j}: {t}">'
            f'<rect x="58" y="{y}" width="310" height="54" rx="10" fill="#e7ecf0" stroke="#b9c3cb"/>'
            f'<circle cx="40" cy="{y+27}" r="9" fill="#fff" stroke="#aa6d18" stroke-width="3"/>'
            f'<text x="72" y="{y+23}" font-size="18" font-weight="800" fill="#37546b">{j}</text>'
            f'<text x="72" y="{y+45}" font-size="16" fill="#14232d">{t}</text></g>')
svg += '</svg>'

m.section("zeit", "Zeitstrahl", "Der Zeitstrahl",
    '<p>Auf dem Zeitstrahl siehst du Ereignisse aus allen sechs Modulen. Lies die Beschreibung und tippe auf das passende Ereignis. Die Knöpfe unter der Aufgabe sind gleichwertig.</p>'
    '<div class="svgwrap">' + svg + '</div><div class="legendlist" aria-hidden="true"><span>Zeitstrahl: eigene Darstellung, Abstände nicht maßstabsgetreu</span></div>'
    + m.hot("zeit",
        [("j1769", "Gesucht ist das Ereignis, mit dem eine Erfindung aus England geschützt wurde, die Fabriken unabhängig vom Wasserrad machte.", "Richtig, 1769. Watt verbesserte die Dampfmaschine entscheidend. Erfunden hatte sie schon Newcomen."),
         ("j1839", "Gesucht ist das erste Gesetz in Deutschland, das Kinderarbeit in Fabriken begrenzte.", "Richtig, das preußische Regulativ von 1839. Fabrikarbeit erst ab neun Jahren, unter sechzehn höchstens zehn Stunden."),
         ("j1848", "Gesucht ist der Aufruf: „Proletarier aller Länder, vereinigt euch!“", "Richtig, das Kommunistische Manifest von Marx und Engels, 1848."),
         ("j1892", "Gesucht ist ein Ereignis, das zeigt, wie gefährlich verschmutztes Trinkwasser in schnell gewachsenen Städten war.", "Richtig, die Cholera in Hamburg 1892 mit etwa 8.600 Toten."),
         ("j1883", "Gesucht ist der erste Teil der staatlichen Sozialversicherung.", "Richtig, die Krankenversicherung von 1883. 1884 und 1889 folgten Unfall- und Rentenversicherung.")],
        [(r[0], r[1]) for r in ROWS],
        "Alle fünf gefunden. Du kannst die wichtigsten Daten der Industrialisierung einordnen.",
        "Zeitstrahl", ["zeit_raum", "fachwissen"], tag="Zeitleiste", titel="Suchauftrag"))

m.section("themen", "Themen ordnen", "Themen ordnen",
    '<p>Ordne jede Karte dem Thema zu, zu dem sie gehört.</p>'
    + m.zuord("themen",
        [("england", "Beginn in England"), ("arbeit", "Arbeit und Fabrik"), ("leben", "Stadt und Familie"), ("antwort", "Antworten auf die soziale Frage")],
        [("Kohle, Kapital und Kolonialhandel", "england"),
         ("Baumwolle kam über Liverpool nach Manchester", "england"),
         ("Glocke, Uhr und Strafe fürs Zuspätkommen", "arbeit"),
         ("Arbeitsteilung bei der Herstellung von Stecknadeln", "arbeit"),
         ("Mietskaserne mit Hinterhaus und Schlafgängern", "leben"),
         ("Über die Hälfte des Lohns für Essen", "leben"),
         ("Gewerkschaften und Arbeiterparteien", "antwort"),
         ("Kolpings Gesellenvereine", "antwort")],
        "Alle acht richtig. Du hast den Überblick über den ganzen Themenbereich.",
        "Frage dich: Geht es um die Voraussetzungen, um die Arbeit selbst, um Wohnen und Familie oder um Lösungen?",
        "Themen ordnen", ["fachwissen"], tag="Wiederholung",
        hilfe="Die vier Felder entsprechen ungefähr den Modulen 001, 002, 003 und 004 sowie 006.")
    + m.order("kette",
        ["Mehr Menschen, Kohle, Kapital und neue Maschinen kommen in England zusammen.",
         "Fabriken entstehen, Maschinen und Uhr bestimmen die Arbeit.",
         "Menschen ziehen vom Land in die schnell wachsenden Industriestädte.",
         "Viele Arbeiterfamilien leben in Enge und Not, auch Kinder müssen arbeiten.",
         "Arbeiterbewegung, Kirchen, Unternehmer und Staat suchen Antworten auf die soziale Frage."],
        "Genau. Das ist der große Zusammenhang der Industrialisierung: Voraussetzungen, Fabrik, Stadt, Not und schließlich Antworten.",
        "Gehe die Module 001 bis 006 in Gedanken der Reihe nach durch.",
        "Große Ursache-Folge-Kette", ["ursachen_folgen"], tag="Ursache-Folge-Kette",
        intro='<p><strong>Auftrag:</strong> Bringe die Kette in die richtige Reihenfolge.</p>'))

m.section("begriffe", "Fachbegriffe", "Fachbegriffe sichern",
    m.luecke("begriffe",
        ["Wenn Menschen vom Land in die Städte ziehen, spricht man von ", ("Landflucht", ["Urlaub", "Kolonie"]),
         ". Das Wachstum der Städte heißt ", ("Urbanisierung", ["Arbeitsteilung", "Manufaktur"]),
         ". Wenn eine Arbeit in viele kleine Schritte zerlegt wird, nennt man das ", ("Arbeitsteilung", ["Zeitdisziplin", "Gewerkschaft"]),
         ". Einen Untermieter, der nur ein Bett mietet, nannte man ", ("Schlafgänger", ["Geselle", "Proletarier"]),
         ". Die Not der Arbeiter und die Suche nach Lösungen nennt man die ", ("soziale Frage", ["Landflucht", "Industrielle Revolution"]),
         ". Arbeitnehmer, die sich zusammenschließen, um bessere Löhne zu erreichen, bilden eine ", ("Gewerkschaft", ["Manufaktur", "Zeche"]), "."],
        "Alles richtig. Die wichtigsten Fachbegriffe sitzen.",
        "Tipp: Das Glossar hilft dir.",
        "Fachbegriffe", ["fachwissen"], tag="Lückentext"))

m.section("quellen", "Quellen wiederholen", "Quellen wiederholen",
    '<div class="akte"><span class="stamp">Rückblick</span><p>In den Modulen hast du mit echten Quellen gearbeitet: Boswells Bericht über Boulton (1791), der Fabrikordnung der Ravensberger Spinnerei (1856), einer Einwohnerstatistik des Deutschen Reiches, Göhres Bericht über Arbeiterwohnungen (1891), der Aussage von Sarah Gooder (1842) und der Kaiserlichen Botschaft (1881).</p></div>'
    + m.multi("s1", "S1. Welche Aussagen über diese Quellen stimmen? Wähle alle zutreffenden aus.",
        [("fabrik", "Die Fabrikordnung zeigt die Sicht der Fabrikleitung, nicht die der Arbeiterinnen."),
         ("sarah", "Sarahs Aussage wurde von einem Beamten der Kommission aufgeschrieben."),
         ("statistik", "Die Statistik zeigt Einwohnerzahlen, aber nicht, wie die Menschen wohnten."),
         ("goehre", "Göhre war selbst sein Leben lang Fabrikarbeiter."),
         ("botschaft", "Die Kaiserliche Botschaft lobt die Sozialdemokraten.")],
        ["fabrik", "sarah", "statistik"],
        "Genau. Du weißt bei jeder Quelle, wer spricht und was sie nicht verrät.",
        {"goehre": "Nein. Göhre war Theologe und arbeitete nur drei Monate als Fabrikarbeiter.",
         "botschaft": "Nein. Die Botschaft spricht von der „Repression“, also Unterdrückung, der Sozialdemokratie."},
        "Quellen wiederholen", ["quellenarbeit"], tag="Quellenarbeit")
    + m.mc("s2", "S2. Fast alle diese Quellen stammen von Beamten, Unternehmern, Gelehrten oder dem Kaiser. Was folgt daraus?",
        [("a", "Die Quellen sind alle falsch."),
         ("b", "Die Arbeiter selbst kommen selten direkt zu Wort. Man muss gezielt nach ihren Stimmen suchen, zum Beispiel nach Lebenserinnerungen, Briefen oder Aussagen wie der von Sarah."),
         ("c", "Arbeiter hatten keine Meinung.")],
        "b",
        {"a": "Nein. Die Quellen sind wertvoll, sie zeigen aber vor allem den Blick von oben.",
         "b": "Richtig. Wer schreibt, bestimmt das Bild. Deshalb fragen Historikerinnen und Historiker immer: Wessen Stimme fehlt?",
         "c": "Nein. Arbeiter hatten sehr wohl Meinungen, sie wurden nur seltener aufgeschrieben und aufbewahrt."},
        "Quellenkritik", ["quellenarbeit", "perspektivitaet"], tag="Quellenkritik"))

m.section("merksatz", "Schlagworte prüfen", "Schlagworte prüfen",
    '<p>Über die Industrialisierung kursieren bekannte Schlagworte: „Industrielle Revolution“ oder „Zuckerbrot und Peitsche“. Sie fassen etwas zusammen, aber sie sind keine Quellen.</p>'
    '<div class="notice warn"><strong>Zur Erinnerung:</strong> „Zuckerbrot und Peitsche“ ist ein späteres Schlagwort für Bismarcks Politik, kein Gesetzestext. Auch „Industrielle Revolution“ ist eine Deutung. Die Veränderung dauerte Jahrzehnte und verlief in jeder Gegend anders, im Emsland ganz anders als im Ruhrgebiet.</div>'
    + m.mc("q1", "Q1. Warum sind solche Schlagworte mit Vorsicht zu genießen?",
        [("a", "Sie sind immer frei erfunden und völlig falsch."),
         ("b", "Sie stammen wörtlich aus Gesetzen des 19. Jahrhunderts."),
         ("c", "Sie fassen etwas Richtiges zusammen, sind aber spätere Deutungen. Sie vereinfachen und lassen Unterschiede weg.")],
        "c",
        {"a": "Nein. Schlagworte treffen oft einen wahren Kern.",
         "b": "Nein. Es sind Zusammenfassungen, die später entstanden.",
         "c": "Richtig. Ein Schlagwort ist eine Darstellung. Man prüft es an den Quellen und fragt, was es weglässt."},
        "Schlagworte prüfen", ["historisches_urteil", "quellenarbeit"], tag="Darstellung prüfen")
    + m.text("q2", "Weiterdenken. Welche Antwort auf die soziale Frage wirkt bis heute in deinem Alltag nach? Nenne ein Beispiel und erkläre, woher es stammt.",
        "Bis heute gibt es ..., das stammt aus ..., weil ...",
        dict(min=60, worte=14, need=2, gruppen=[
            dict(w=["versicher", "rente", "krankenkasse", "gewerkschaft", "kolping", "kinderarbeit", "jugendarbeitsschutz", "spd", "diakonie", "caritas", "streik"], miss="Nenne ein Beispiel, etwa die Krankenversicherung oder das Verbot der Kinderarbeit."),
            dict(w=["1883", "bismarck", "19. jahrhundert", "industrialis", "damals", "kaiser", "1889", "1839", "arbeiter"], miss="Erkläre, woher es stammt.")],
            ok="Gut erkannt. Viele Dinge, die heute selbstverständlich sind, wurden im 19. Jahrhundert erkämpft oder eingeführt."),
        "Weiterdenken Gegenwart", ["historisches_urteil"], tag="Weiterdenken · Gegenwart"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Akte 007</span>
 <p><strong>Fall:</strong> Chronos will die Akte „Industrialisierung“ schließen. Auf der letzten Karteikarte steht: <em>„Die Industrialisierung hat das Leben der Menschen nur verbessert.“</em></p>
 <p><strong>Dein Auftrag:</strong> Zeige mit deinem Wissen aus den Modulen 001 bis 006, ob dieses Urteil stimmt. Am Ende entscheidest du über die Karte.</p>
</div>
{chronos("Ich sitze hier im warmen Archiv, mit elektrischem Licht und Krankenversicherung. Für mich hat sich alles verbessert. Aber galt das auch für Sarah, für die Spinnerinnen in Bielefeld und für die Familien in der Mietskaserne?")}
<p><strong>Leitfrage:</strong> Was hat die Industrialisierung verändert, und für wen?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Zeitreisender</span>
 <span class="abz" id="abz2">Ordnungssinn</span>
 <span class="abz" id="abz3">Quellenprüfer</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Wiederholung", "D1. Warum begann die Industrialisierung in England?",
     [("a", "Weil mehrere Voraussetzungen zusammenkamen: Kohle, Kapital, Handel, Arbeitskräfte und Erfindungen"), ("b", "Nur wegen James Watt"), ("c", "Weil es dort keine Bauern gab")], "a"),
    ("d2", "Richtig oder falsch", "D2. Das Emsland wurde im 19. Jahrhundert zu einem großen Industriegebiet wie das Ruhrgebiet.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "f"),
    ("d3", "Wiederholung", "D3. Wer führte ab 1883 die Sozialversicherung ein?",
     [("a", "Die Gewerkschaften"), ("b", "Der Staat unter Reichskanzler Bismarck"), ("c", "Alfred Krupp")], "b")],
    dict(alle="Drei von drei. Ein starker Start.",
         fast="Zwei von drei. Gute Grundlage, im Lerncheck frischst du den Rest auf.",
         wenig="Du hast # von drei getroffen. Kein Problem, genau dafür ist dieser Lerncheck da.",
         extra=[dict(n="d2", v="r", m="Ein Hinweis vorab: Das Emsland blieb lange ländlich, viele Menschen zogen ins Ruhrgebiet.")]),
    h2="Warmlaufen", intro="Drei kurze Fragen zum Aufwärmen. Sie werden nicht benotet.")

gloss = glossar_section([
    ("Industrialisierung", "Übergang von Handarbeit zu Maschinenarbeit in Fabriken, in England ab etwa 1760, in Deutschland ab etwa 1835."),
    ("Kapital", "Geld oder Besitz, das man einsetzt, um ein Unternehmen zu gründen oder Maschinen zu kaufen."),
    ("Manufaktur und Fabrik", "In der Manufaktur arbeiteten viele Menschen arbeitsteilig von Hand, in der Fabrik bedienten sie Maschinen mit eigenem Antrieb."),
    ("Zeitdisziplin", "Die Pflicht, sich bei der Arbeit genau nach der Uhr zu richten."),
    ("Landflucht und Urbanisierung", "Abwanderung vom Land und das Wachstum der Städte."),
    ("Mietskaserne", "Großes Mietshaus mit Hinterhöfen, vor allem in Berlin."),
    ("Regulativ von 1839", "Erstes deutsches Gesetz, das Kinderarbeit in Fabriken begrenzte."),
    ("Soziale Frage", "Die Not der Arbeiterfamilien und die Suche nach Lösungen."),
    ("Gewerkschaft", "Zusammenschluss von Arbeitnehmern für bessere Löhne und Arbeitsbedingungen."),
    ("Sozialversicherung", "Kranken-, Unfall- sowie Invaliditäts- und Altersversicherung ab 1883, 1884 und 1889.")],
    ["Alle Quellen dieses Lerncheck-Moduls werden in den Modulen 001 bis 006 vollständig nachgewiesen.",
     "Der Zeitstrahl ist eine eigene Darstellung."])

lc = lerncheck_section(["Ich kann die wichtigsten Ursachen, Ereignisse und Folgen der Industrialisierung ordnen.",
                        "Ich kann Quellen aus dieser Zeit auswerten und ihre Sichtweise erkennen.",
                        "Ich kann ein begründetes Urteil über die Folgen der Industrialisierung bilden."])

absch = abschluss_section(m, "Abschlussmission: die letzte Karteikarte",
    '<p>Auf der letzten Karteikarte steht: <em>„Die Industrialisierung hat das Leben der Menschen nur verbessert.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt so."),
     ("b", "Langfristig brachte die Industrialisierung mehr Wohlstand, billigere Waren und neue Erfindungen. Zunächst bedeutete sie aber für viele Arbeiter große Not. Erst Kämpfe und Reformen machten die Arbeit menschlicher."),
     ("c", "Sie hat alles nur verschlechtert."),
     ("d", "Es kommt auf die Perspektive an: Unternehmer und Bürger profitierten früh, Arbeiterfamilien und Kinder litten zuerst. Später profitierten mehr Menschen.")],
    ["b", "d"],
    {"a": "Prüfe das noch einmal. Denke an Sarah Gooder, an die Cholera in Hamburg und an die Fabrikordnung.",
     "b": "Gut entschieden. Du unterscheidest kurzfristige und langfristige Folgen. Begründe das jetzt in A2.",
     "c": "Das geht zu weit. Denke an billigere Kleidung, an die Eisenbahn und an die Sozialversicherung.",
     "d": "Gut entschieden. Du betrachtest die Frage aus mehreren Perspektiven. Begründe das jetzt in A2."},
    "Schreibe Chronos eine Nachricht. Begründe in drei bis fünf Sätzen dein Urteil. Nenne mindestens eine Verbesserung, mindestens eine Belastung und eine Antwort auf die soziale Frage.",
    "Lieber Chronos, die Karte stimmt nicht ganz, weil ...",
    "„Verbessert hat sich zum Beispiel ..., weil ...“ · „Viele Menschen litten aber unter ...“ · „Erst durch ... wurde es besser.“",
    dict(min=90, worte=22, need=3, saetze=3, gruppen=[
        dict(w=["wohlstand", "waren", "billig", "erfind", "eisenbahn", "fortschritt", "kleidung", "mehr", "maschin"], miss="Nenne eine Verbesserung, etwa billigere Waren oder die Eisenbahn."),
        dict(w=["not", "arm", "kinderarbeit", "eng", "krank", "cholera", "lang", "strafe", "lohn", "stunden", "sarah"], miss="Nenne eine Belastung, etwa Kinderarbeit oder enge Wohnungen."),
        dict(w=["gewerkschaft", "staat", "gesetz", "versicher", "kirche", "kolping", "reform", "regulativ", "spd", "bismarck"], miss="Nenne eine Antwort auf die soziale Frage, etwa Gewerkschaften oder Sozialversicherung.")],
        ok="Sehr gut. Du wägst Verbesserungen und Belastungen ab und nennst Antworten auf die soziale Frage. Damit kann Chronos die Akte guten Gewissens schließen. Abzeichen Begründer freigeschaltet."))

build(m, "Lerncheck starten",
      ["Du ordnest wichtige Ereignisse von 1769 bis 1899 auf einem Zeitstrahl.",
       "Du sortierst die großen Themen des Themenbereichs.",
       "Du wiederholst Ursachen, Folgen und Fachbegriffe.",
       "Du prüfst, was du über die Quellen gelernt hast, und fragst nach fehlenden Stimmen.",
       "Du bildest dir ein begründetes Urteil über die Folgen der Industrialisierung."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos wartet schon. Es geht weiter mit der Mission.")
