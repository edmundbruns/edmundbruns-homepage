# -*- coding: utf-8 -*-
from common import *
from tl import timeline_svg

m = Modul("006", "Welche Antworten gab es auf die soziale Frage?", "Soziale Frage",
          "Industrialisierung und soziale Frage · Akte 006",
          "Lange Arbeitstage, enge Wohnungen, Kinderarbeit und keine Absicherung bei Krankheit: Diese Not vieler Arbeiterfamilien nannte man die soziale Frage. Arbeiter, Unternehmer, Kirchen und der Staat gaben ganz unterschiedliche Antworten.",
          "Weiter geht es mit Modul 007: Lerncheck: Industrialisierung und soziale Frage.",
          badges=[dict(id="abz1", name="Akteurskenner", tasks=["akteure"]),
                  dict(id="abz2", name="Zusammenhänge", tasks=["kette", "versicherung"]),
                  dict(id="abz3", name="Quellenprüfer", tasks=["s1", "s2", "q1"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])])

m.section("akteure", "Vier Antworten", "Vier Gruppen, vier Antworten",
    '<p>Auf die soziale Frage antworteten ganz verschiedene Gruppen. Die Arbeiter selbst schlossen sich zusammen. Manche Unternehmer sorgten für ihre Belegschaft. Kirchen halfen aus christlicher Überzeugung. Und schließlich handelte der Staat. Ordne jede Karte zu.</p>'
    + m.zuord("akteure",
        [("arbeiter", "Arbeiterbewegung"), ("unternehmer", "Unternehmer"), ("kirchen", "Kirchen"), ("staat", "Staat")],
        [("Gewerkschaften fordern höhere Löhne und kürzere Arbeitszeiten, notfalls mit Streik", "arbeiter"),
         ("1875 schließen sich zwei Arbeiterparteien zusammen, daraus wird später die SPD", "arbeiter"),
         ("Alfred Krupp baut Werkswohnungen, Schulen und billige Läden für seine Arbeiter", "unternehmer"),
         ("Firmen gründen eigene Krankenkassen für ihre Beschäftigten", "unternehmer"),
         ("Adolph Kolping gründet Gesellenvereine mit Wohnheimen für junge Handwerker", "kirchen"),
         ("Bischof Ketteler fordert 1864, Christen müssten sich für die Arbeiter einsetzen", "kirchen"),
         ("Ein Gesetz von 1883 führt eine Krankenversicherung für Arbeiter ein", "staat"),
         ("1889 entsteht eine Versicherung für Invalidität und Alter", "staat")],
        "Alle acht richtig. Die Antworten unterschieden sich stark: Selbsthilfe und Kampf bei den Arbeitern, Fürsorge von oben bei Unternehmern wie Krupp, Hilfe aus dem Glauben bei den Kirchen und Gesetze beim Staat.",
        "Frage dich bei jeder Karte: Wer handelt hier? Arbeiter für sich selbst, ein Fabrikbesitzer, ein Mann der Kirche oder Regierung und Parlament?",
        "Akteure zuordnen", ["fachwissen", "perspektivitaet"], tag="Zuordnen",
        hilfe="Kolping war katholischer Priester, Ketteler katholischer Bischof von Mainz. Auf evangelischer Seite gründete Johann Hinrich Wichern 1848 die Innere Mission.")
    + '<div class="akte"><span class="stamp">Quelle</span><p><strong>Karl Marx und Friedrich Engels, „Manifest der Kommunistischen Partei“, London 1848, Schluss.</strong></p>'
      '<blockquote class="q"><p>„Die Proletarier haben nichts in ihr zu verlieren als ihre Ketten. Sie haben eine Welt zu gewinnen. Proletarier aller Länder, vereinigt euch!“</p></blockquote>'
      '<p class="wort"><strong>Worterklärungen:</strong> Proletarier = Arbeiter, die nichts besitzen außer ihrer Arbeitskraft · „in ihr“ = in der Revolution</p></div>'
    + m.mc("marx", "M1. Was wollten Marx und Engels?",
        [("a", "Mit den Unternehmern freundlich über bessere Fabrikordnungen verhandeln"),
         ("b", "Die Arbeiter aller Länder sollten sich zusammenschließen und die bestehende Ordnung durch eine Revolution umstürzen. Fabriken sollten nicht mehr Einzelnen gehören."),
         ("c", "Zurück zum Handwerk und die Maschinen abschaffen")],
        "b",
        {"a": "Das wäre eine Reform in kleinen Schritten. Marx und Engels hielten das für unzureichend. Lies den Schluss noch einmal: Wovon ist die Rede?",
         "b": "Richtig. Marx und Engels wollten eine Revolution und eine Gesellschaft ohne Privateigentum an Fabriken. Viele Arbeiter in Deutschland setzten später eher auf Reformen: Gewerkschaften, Wahlen und Gesetze. Über den richtigen Weg wurde in der Arbeiterbewegung lange gestritten.",
         "c": "Nein. Marx und Engels wollten die Maschinen nicht abschaffen. Sie wollten, dass sie allen gehören."},
        "Revolution oder Reform", ["fachwissen", "perspektivitaet"], tag="Auswahl mit Erklärung"))

TL = [(1848, "Marx und Engels: Kommunistisches Manifest"), (1849, "Kolping gründet in Köln einen Gesellenverein"),
      (1863, "Lassalle gründet eine erste Arbeiterpartei"), (1875, "Zusammenschluss zweier Arbeiterparteien in Gotha"),
      (1878, "Sozialistengesetz verbietet sozialdemokratische Vereine"), (1883, "Krankenversicherung"), (1884, "Unfallversicherung"),
      (1889, "Invaliditäts- und Altersversicherung"), (1890, "Ende des Sozialistengesetzes, Name SPD")]

m.section("bismarck", "Zuckerbrot und Peitsche", "Bismarck: Verbot und Versicherung",
    '<p>Reichskanzler Otto von Bismarck fürchtete die wachsende Arbeiterbewegung. Er verfolgte zwei Wege zugleich. Historiker fassen das oft mit dem Schlagwort „Zuckerbrot und Peitsche“ zusammen.</p>'
    '<div class="svgwrap">' + timeline_svg(TL, "Zeitleiste von 1848 bis 1890 zu Arbeiterbewegung und Sozialgesetzen", wrap=26) + '</div><div class="legendlist" aria-hidden="true"><span>Zeitleiste: eigene Darstellung</span></div>'
    + m.order("kette",
        ["Die Arbeiterbewegung wächst, sozialdemokratische Abgeordnete ziehen in den Reichstag ein.",
         "Bismarck fürchtet einen Umsturz und setzt 1878 das Sozialistengesetz durch.",
         "Die Sozialdemokraten werden trotzdem nicht schwächer, sie gewinnen weiter Wähler.",
         "Der Kaiser kündigt 1881 im Reichstag Gesetze zum Schutz der Arbeiter an.",
         "Von 1883 bis 1889 entstehen Kranken-, Unfall- und Rentenversicherung.",
         "1890 endet das Sozialistengesetz. Die SPD erhält bei der Wahl die meisten Stimmen."],
        "Genau. Erst kam das Verbot, die Peitsche. Als es nicht wirkte, kam die Versicherung dazu, das Zuckerbrot. Die Arbeiter sollten an den Staat gebunden werden. Die SPD wurde trotzdem immer stärker.",
        "Frage dich: Was musste zuerst da sein, damit Bismarck reagierte? Und was folgte, als das Verbot nicht half?",
        "Ursache und Folge", ["ursachen_folgen", "zeit_raum"], tag="Ursache-Folge-Kette",
        intro='<p><strong>Auftrag:</strong> Bringe die Kette in die richtige Reihenfolge. Die Zeitleiste hilft dir.</p>')
    + m.luecke("versicherung",
        ["Die Krankenversicherung von 1883 bezahlten zu zwei Dritteln die ", ("Arbeiter", ["Kirchen", "Gemeinden"]),
         " und zu einem Drittel die Arbeitgeber. Die Unfallversicherung von 1884 bezahlten die ", ("Arbeitgeber", ["Arbeiter", "Kirchen"]),
         " allein. Eine Altersrente gab es ab 1889, aber erst ab einem Alter von ", ("70", ["50", "60"]),
         " Jahren. Das erreichten damals nur wenige. Eine Versicherung gegen ", ("Arbeitslosigkeit", ["Krankheit", "Unfälle"]),
         " kam erst 1927."],
        "Alles richtig. Die Sozialversicherung war ein großer Fortschritt und ein Vorbild für viele Länder. Sie war aber anfangs knapp: Die Rente war niedrig und kam spät, und gegen Arbeitslosigkeit gab es noch keinen Schutz.",
        "Tipp: Bei Unfällen in der Fabrik sah man den Betrieb in der Verantwortung.",
        "Sozialversicherung", ["fachwissen"], tag="Lückentext",
        intro='<p><strong>Wer zahlte was?</strong> Wähle in jeder Lücke das passende Wort.</p>'))

BOTSCHAFT = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Kaiserliche Botschaft vom 17. November 1881 (Auszug).</strong> Kaiser Wilhelm I. war krank. Deshalb verlas Reichskanzler Bismarck die Botschaft bei der Eröffnung des Reichstags. Gerichtet war sie an die Abgeordneten, und über die Zeitungen an die ganze Öffentlichkeit.</p>
 <blockquote class="q">
 <p>„Schon im Februar dieses Jahres haben Wir Unsere Ueberzeugung aussprechen lassen, daß die Heilung der sozialen Schäden nicht ausschließlich im Wege der Repression sozialdemokratischer Ausschreitungen, sondern gleichmäßig auf dem der positiven Förderung des Wohles der Arbeiter zu suchen sein werde. […]</p>
 <p>Aber auch diejenigen, welche durch Alter oder Invalidität erwerbsunfähig werden, haben der Gesammtheit gegenüber einen begründeten Anspruch auf ein höheres Maß staatlicher Fürsorge, als ihnen bisher hat zu Theil werden können.“</p>
 </blockquote>
 <p class="wort"><strong>Worterklärungen:</strong> Wir, Unsere = der Kaiser spricht von sich in der Mehrzahl · soziale Schäden = Missstände in der Gesellschaft · Repression = Unterdrückung · Ausschreitungen = gemeint sind die Tätigkeiten der Sozialdemokraten · positive Förderung = aktive Unterstützung · Invalidität = Arbeitsunfähigkeit durch Krankheit oder Unfall · erwerbsunfähig = nicht mehr fähig, Geld zu verdienen</p>
</div>'''

KRUPP = '''<div class="akte">
 <span class="stamp">Zweite Quelle</span>
 <p><strong>Alfred Krupp, „Ein Wort an meine Angehörigen“, 11. Februar 1877 (Auszug).</strong> Die Ansprache wurde gedruckt und an alle Beschäftigten der Krupp-Werke in Essen verteilt.</p>
 <blockquote class="q">
 <p>„Ich habe den Mut gehabt, für die Verbesserung der Lage der Arbeiter Wohnungen zu bauen, worin bereits 20 000 Seelen untergebracht sind, ihnen Schulen zu gründen und Einrichtungen zu treffen zur billigen Beschaffung von allem Bedarf. […]</p>
 <p>Genießet, was Euch beschieden ist. Nach getaner Arbeit verbleibt im Kreise der Eurigen, bei den Eltern, bei der Frau und den Kindern und sinnt über Haushalt und Erziehung. Das sei Eure Politik, dabei werdet Ihr frohe Stunden erleben. Aber für die große Landespolitik erspart Euch die Aufregung. Höhere Politik treiben erfordert mehr freie Zeit und Einblick in die Verhältnisse, als dem Arbeiter verliehen ist.“</p>
 </blockquote>
 <p class="wort"><strong>Worterklärungen:</strong> Seelen = Menschen · was Euch beschieden ist = was ihr bekommen habt · im Kreise der Eurigen = bei eurer Familie</p>
</div>'''

m.section("quelle", "Die Quellen", "Die Quellen: Der Kaiser und ein Unternehmer",
    '<p>Chronos hat zwei Quellen gefunden, in denen Mächtige zu den Arbeitern sprechen oder über sie. Keine von beiden stammt von Arbeitern selbst.</p>' + BOTSCHAFT
    + chronos("Achte auf das Wort „ausschließlich“. Es verrät, dass es neben der Fürsorge noch einen zweiten Weg gab.")
    + m.multi("s1", "S1. Was sagt die Kaiserliche Botschaft? Wähle alle zutreffenden Aussagen aus.",
        [("unterdr", "Unterdrückung der Sozialdemokratie allein reicht nicht, um die Missstände zu heilen."),
         ("wohl", "Der Staat soll das Wohl der Arbeiter aktiv fördern."),
         ("alter", "Alte und Arbeitsunfähige haben Anspruch auf mehr staatliche Fürsorge."),
         ("regieren", "Die Sozialdemokraten sollen mitregieren."),
         ("lohn", "Die Arbeiter sollen höhere Löhne bekommen.")],
        ["unterdr", "wohl", "alter"],
        "Genau. Die Botschaft kündigt Fürsorge an, hält aber an der Unterdrückung der Sozialdemokratie fest. Von Löhnen oder Mitbestimmung ist keine Rede.",
        {"regieren": "Im Gegenteil. Die Botschaft spricht von „Repression“, also Unterdrückung der Sozialdemokraten.",
         "lohn": "Davon steht nichts im Text. Es geht um Hilfe bei Alter, Invalidität, Unfall und Krankheit."},
        "Botschaft auswerten", ["quellenarbeit"], tag="Quellenarbeit")
    + m.mc("s2", "S2. Warum spricht der Kaiser überhaupt von „Repression sozialdemokratischer Ausschreitungen“?",
        [("a", "Er wollte die Sozialdemokraten loben."),
         ("b", "Seit 1878 galt das Sozialistengesetz. Die Regierung wollte die Sozialdemokratie schwächen und die Arbeiter durch Fürsorge an den Staat binden."),
         ("c", "Die Sozialdemokraten hatten den Reichstag gestürmt.")],
        "b",
        {"a": "Nein. „Repression“ heißt Unterdrückung. Lob klingt anders.",
         "b": "Richtig. Die Botschaft zeigt beide Wege der Regierung: Unterdrückung und Fürsorge. Die Fürsorge war ernst gemeint, sie hatte aber auch ein politisches Ziel. Die Arbeiter sollten sich vom Staat und nicht von der SPD Hilfe erwarten.",
         "c": "Nein, das geschah nicht. Die Sozialdemokraten waren eine Partei mit Abgeordneten im Reichstag."},
        "Quellenkritik", ["quellenarbeit", "ursachen_folgen"], tag="Quellenkritik")
    + KRUPP
    + m.mc("q1", "S3. Wie sah Alfred Krupp seine Arbeiter?",
        [("a", "Als gleichberechtigte Partner, mit denen er über alles verhandelte"),
         ("b", "Er sorgte für sie wie ein strenger Vater, erwartete aber Gehorsam und wollte nicht, dass sie sich politisch einmischen."),
         ("c", "Er unterstützte die Sozialdemokratie und die Gewerkschaften.")],
        "b",
        {"a": "Nein. Krupp sagt den Arbeitern, Politik solle nicht ihre Sache sein. Gleichberechtigung sieht anders aus.",
         "b": "Richtig. Man nennt diese Haltung patriarchalisch: Der Unternehmer sorgt für Wohnungen und Schulen und verlangt dafür Treue und Gehorsam. Für viele Familien waren Krupps Wohnungen ein echter Fortschritt, mitbestimmen durften sie aber nicht.",
         "c": "Nein. In derselben Rede warnt Krupp sogar scharf vor der Sozialdemokratie."},
        "Perspektive eines Unternehmers", ["perspektivitaet", "quellenarbeit"], tag="Perspektive")
    + m.text("q2", "Weiterdenken. Vergleiche die Antwort Krupps mit der Antwort einer Gewerkschaft. Was ist der wichtigste Unterschied? Welche Antwort hätte dir als Arbeiterin oder Arbeiter damals mehr geholfen?",
        "Der wichtigste Unterschied ist, dass ... Mir hätte eher ... geholfen, weil ...",
        dict(min=80, worte=18, need=2, gruppen=[
            dict(w=["oben", "vater", "fursorge", "gehorsam", "krupp", "bestimm", "geschenk", "abhang"], miss="Beschreibe Krupps Antwort: Fürsorge von oben gegen Gehorsam."),
            dict(w=["selbst", "gemeinsam", "zusammen", "streik", "fordern", "mitbestimm", "rechte", "gewerkschaft"], miss="Beschreibe die Antwort der Gewerkschaft: Arbeiter handeln gemeinsam selbst.")],
            ok="Gut verglichen. Bei Krupp kam die Hilfe von oben und hing vom Wohlwollen des Unternehmers ab. Gewerkschaften setzten auf Selbsthilfe und Rechte, die man gemeinsam erkämpft. Beide Wege hatten Vorteile und Grenzen."),
        "Weiterdenken Vergleich", ["perspektivitaet", "historisches_urteil"], tag="Weiterdenken · Vergleich"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Akte 006</span>
 <p><strong>Fall:</strong> Auf einer Karteikarte steht: <em>„Erst der Staat hat die soziale Frage gelöst.“</em></p>
 <p><strong>Dein Auftrag:</strong> Untersuche, wer welche Antworten gab und was sie bewirkten. Am Ende entscheidest du, ob die Karte stimmt.</p>
</div>
<p><strong>Zum Einstieg:</strong> Auf deinem späteren Lohnzettel wirst du Abzüge für Kranken-, Renten- und Unfallversicherung finden. Die Grundlage dafür wurde vor rund 140 Jahren gelegt. Aber wer hat sie erkämpft, und warum?</p>
{chronos("In meiner Akte steht nur ein Name: Bismarck. Das kommt mir verdächtig einfach vor. Wer hat noch mitgeredet?")}
<p><strong>Leitfrage:</strong> Welche Antworten gab es auf die soziale Frage?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Akteurskenner</span>
 <span class="abz" id="abz2">Zusammenhänge</span>
 <span class="abz" id="abz3">Quellenprüfer</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Wortbedeutung", "D1. Was meint der Begriff „soziale Frage“?",
     [("a", "Eine Umfrage unter Schülerinnen und Schülern"), ("b", "Die Not vieler Arbeiter in der Industrialisierung und die Frage, wie man sie lindern kann"), ("c", "Die Frage, wer mit wem befreundet ist")], "b"),
    ("d2", "Richtig oder falsch", "D2. Eine gesetzliche Krankenversicherung für Arbeiter gibt es in Deutschland seit dem 19. Jahrhundert.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "r"),
    ("d3", "Vermutung", "D3. Was ist eine Gewerkschaft?",
     [("a", "Ein Zusammenschluss von Arbeitnehmern, die gemeinsam für bessere Löhne und Arbeitsbedingungen eintreten"), ("b", "Ein Verband der Fabrikbesitzer"), ("c", "Eine Behörde des Staates")], "a")],
    dict(alle="Drei von drei. Deine Vermutungen passen gut. Der Lernweg Weiterdenken könnte für dich spannend sein.",
         fast="Zwei von drei. Gute Grundlage.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da."))

gloss = glossar_section([
    ("Soziale Frage", "Die Not vieler Arbeiterfamilien in der Industrialisierung: lange Arbeitszeiten, niedrige Löhne, enge Wohnungen, Kinderarbeit und keine Absicherung. Dazu die Frage, wie man sie lösen kann."),
    ("Proletariat", "Bei Marx die Klasse der Arbeiter, die nichts besitzen außer ihrer Arbeitskraft."),
    ("Gewerkschaft", "Zusammenschluss von Arbeitnehmern, um gemeinsam bessere Löhne und Arbeitsbedingungen durchzusetzen."),
    ("Streik", "Arbeiter legen gemeinsam die Arbeit nieder, um Forderungen durchzusetzen."),
    ("Sozialdemokratie, SPD", "Politische Bewegung der Arbeiter. Aus zwei Parteien entstand 1875 die Sozialistische Arbeiterpartei, die sich 1890 in SPD umbenannte."),
    ("Sozialistengesetz", "Gesetz von 1878 bis 1890, das sozialdemokratische Vereine, Versammlungen und Zeitungen verbot. Wählen konnte man die Sozialdemokraten weiterhin."),
    ("Sozialversicherung", "Gesetzliche Versicherungen gegen Krankheit (1883), Unfall (1884) sowie Invalidität und Alter (1889). Beiträge zahlen Arbeitnehmer und Arbeitgeber."),
    ("Patriarchalisch", "Wie ein strenger Familienvater: Der Unternehmer sorgt für seine Leute und verlangt dafür Gehorsam."),
    ("Kolpingwerk", "Von dem katholischen Priester Adolph Kolping begründete Gesellenvereine mit Wohnheimen, Bildung und Gemeinschaft. Es gibt sie bis heute."),
    ("Innere Mission", "1848 von dem evangelischen Theologen Johann Hinrich Wichern angestoßene Hilfe für Arme und Notleidende, ein Vorläufer der Diakonie.")],
    ["Kaiserliche Botschaft vom 17. November 1881, nach: Verhandlungen des Reichstags, V. Legislaturperiode, I. Session 1881. Abdruck bei German History in Documents and Images (GHDI). Wortlaut mit alter Rechtschreibung.",
     "Alfred Krupp, Ansprache vom 11. Februar 1877, nach: Wilhelm Berdow (Hg.), Alfred Krupps Briefe 1826 bis 1887, Berlin 1928. Abdruck bei GHDI.",
     "Karl Marx und Friedrich Engels, Manifest der Kommunistischen Partei, London 1848, Schlusssätze.",
     "Daten: Sozialistengesetz 1878 bis 1890, Krankenversicherung 1883, Unfallversicherung 1884, Invaliditäts- und Altersversicherung 1889 (Rente ab 70 Jahren), Arbeitslosenversicherung 1927. Bei der Reichstagswahl 1890 erhielt die SPD die meisten Stimmen.",
     "Die Zeitleiste ist eine eigene Darstellung."])

lc = lerncheck_section(["Ich kann vier Gruppen nennen, die Antworten auf die soziale Frage gaben.",
                        "Ich kann Bismarcks Sozialpolitik und ihre Absicht erklären.",
                        "Ich kann Quellen verschiedener Personen vergleichen und ihre Sichtweise erkennen."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf der Karteikarte steht: <em>„Erst der Staat hat die soziale Frage gelöst.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt so. Nur Bismarck hat etwas getan."),
     ("b", "Der Staat leistete mit der Sozialversicherung einen wichtigen Beitrag. Aber Arbeiterbewegung, Kirchen und einige Unternehmer hatten schon vorher Antworten gegeben, und gelöst war die Frage 1889 noch lange nicht."),
     ("c", "Der Staat hat überhaupt nichts getan."),
     ("d", "Am wichtigsten war die Arbeiterbewegung. Ohne ihren Druck hätte Bismarck keine Sozialgesetze gemacht.")],
    ["b", "d"],
    {"a": "Prüfe das noch einmal. Denke an Gewerkschaften, Kolping, Ketteler und Krupp. Und war mit einer Rente ab 70 die Not wirklich gelöst?",
     "b": "Gut entschieden. Du würdigst den Staat und siehst trotzdem die anderen Akteure und die Grenzen. Begründe das jetzt in A2.",
     "c": "Das stimmt nicht. Die Sozialversicherung war ein großer Schritt, auch wenn sie anfangs knapp war.",
     "d": "Ein begründbares Urteil. Du siehst, dass Bismarck auch aus Angst vor der Arbeiterbewegung handelte. Begründe das jetzt in A2."},
    "Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, welche Antworten es auf die soziale Frage gab. Nenne den Staat und mindestens eine weitere Gruppe und beurteile, ob die Frage damit gelöst war.",
    "Lieber Chronos, nicht nur der Staat hat geantwortet, weil ...",
    "„Der Staat führte ab 1883 ... ein, weil ...“ · „Schon vorher hatten ... “ · „Gelöst war die soziale Frage aber noch nicht, denn ...“",
    dict(min=80, worte=20, need=3, saetze=3, gruppen=[
        dict(w=["staat", "bismarck", "versicher", "kaiser", "gesetz", "1883", "rente"], miss="Nenne die Antwort des Staates, die Sozialversicherung."),
        dict(w=["gewerkschaft", "spd", "partei", "arbeiterbeweg", "kirche", "kolping", "ketteler", "wichern", "krupp", "unternehm", "marx"], miss="Nenne mindestens eine weitere Gruppe, etwa Gewerkschaften, Kirchen oder Unternehmer."),
        dict(w=["nicht gelost", "nicht ganz", "noch nicht", "70", "arbeitslos", "knapp", "sozialistengesetz", "unterdr", "absicht", "binden", "zuckerbrot", "peitsche", "druck", "angst"], miss="Beurteile, ob die Frage gelöst war, oder nenne Bismarcks Absicht.")],
        ok="Sehr gut. Du nennst mehrere Akteure und beurteilst die Grenzen. Genau das ist der Kern: Viele gaben Antworten, der Staat setzte einen Meilenstein, gelöst war die soziale Frage damit aber noch nicht. Abzeichen Begründer freigeschaltet."))

build(m, "Ermittlung starten",
      ["Du ordnest Antworten von Arbeitern, Unternehmern, Kirchen und Staat zu.",
       "Du unterscheidest Revolution und Reform.",
       "Du erklärst, warum Bismarck Sozialgesetze einführte.",
       "Du wertest die Kaiserliche Botschaft von 1881 und eine Rede von Alfred Krupp aus.",
       "Du beurteilst, ob die soziale Frage gelöst wurde."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos wartet schon. Es geht weiter mit der Mission.")
