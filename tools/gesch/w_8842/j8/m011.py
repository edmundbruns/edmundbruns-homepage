import sys; sys.path.insert(0, '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/gesch/w_8842/j8')
from eng8 import build, chronos, task

BEREICH = "Nation und politische Teilhabe"

def box(id_, x, y, w, h, t1, t2, fill):
    return ('<g class="hot" data-task="hot" id="%s" tabindex="0" role="button" aria-label="%s">'
            '<rect x="%d" y="%d" width="%d" height="%d" rx="12" fill="%s" stroke="#37546b" stroke-width="3"/>'
            '<text x="%d" y="%d" font-size="22" font-weight="700" text-anchor="middle" fill="#172430">%s</text>'
            '<text x="%d" y="%d" font-size="17" text-anchor="middle" fill="#3a4855">%s</text></g>') % (
            id_, t1, x, y, w, h, fill, x + w // 2, y + h // 2 - 4, t1, x + w // 2, y + h // 2 + 20, t2)

VERF_SVG = ('<div class="svgwrap"><svg class="bild" viewBox="0 0 640 440" role="img" aria-label="Schaubild der Reichsverfassung von 1871 mit Kaiser, Reichskanzler, Bundesrat, Reichstag, Fürsten und Wählern">'
 '<rect width="640" height="440" fill="#f7f8fa"/>'
 '<defs><marker id="pf11" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#55606a"/></marker></defs>'
 '<g stroke="#55606a" stroke-width="2.5" fill="none" marker-end="url(#pf11)">'
 '<path d="M260 66 H196"/><path d="M110 112 V186"/><path d="M500 384 V312"/><path d="M140 384 V312"/>'
 '</g>'
 '<text x="228" y="56" font-size="15" text-anchor="middle" fill="#55606a">ernennt</text>'
 + box('h011Kaiser', 260, 20, 160, 90, 'Kaiser', 'König von Preußen', '#f5e9cf')
 + box('h011Kanzler', 20, 20, 176, 90, 'Reichskanzler', 'leitet Regierung', '#e7edf2')
 + box('h011Militaer', 460, 20, 160, 90, 'Heer', 'Oberbefehl: Kaiser', '#e7edf2')
 + '<rect x="20" y="164" width="600" height="156" rx="16" fill="none" stroke="#aa6d18" stroke-width="2" stroke-dasharray="8 6"/>'
 + '<text x="320" y="152" font-size="18" font-weight="700" text-anchor="middle" fill="#8f5a12">Gesetze nur, wenn beide zustimmen</text>'
 + box('h011Bundesrat', 40, 186, 250, 116, 'Bundesrat', 'Vertreter der Fürsten', '#efeaf7')
 + box('h011Reichstag', 350, 186, 250, 116, 'Reichstag', 'gewählte Abgeordnete', '#e9f2ec')
 + box('h011Fuersten', 40, 360, 250, 70, 'Einzelstaaten', 'Fürsten, Freie Städte', '#fff')
 + box('h011Waehler', 350, 360, 250, 70, 'Wähler', 'Männer ab 25', '#fff')
 + '</svg></div>'
 + '<div class="legendlist" aria-hidden="true"><span>Vereinfachtes Schaubild, eigene Darstellung</span></div>')

DREI_SVG = '''<div class="svgwrap"><svg class="bild" viewBox="0 0 640 330" role="img" aria-label="Diagramm zum preußischen Dreiklassenwahlrecht 1908: Die erste Klasse umfasste etwa 4 Prozent der Wähler, die zweite etwa 14 Prozent, die dritte etwa 82 Prozent. Jede Klasse wählte ein Drittel der Wahlmänner.">
 <rect width="640" height="330" fill="#f7f8fa"/>
 <text x="20" y="34" font-size="21" font-weight="700" fill="#172430">Anteil an allen Wählern (Preußen, 1908)</text>
 <rect x="20" y="52" width="600" height="56" fill="#fff" stroke="#b9c3cc"/>
 <rect x="20" y="52" width="24" height="56" fill="#aa6d18"/>
 <rect x="44" y="52" width="84" height="56" fill="#7f9bb3"/>
 <rect x="128" y="52" width="492" height="56" fill="#37546b"/>
 <text x="32" y="134" font-size="19" text-anchor="middle" fill="#8f5a12" font-weight="700">4 %</text>
 <text x="86" y="134" font-size="19" text-anchor="middle" fill="#24384a" font-weight="700">14 %</text>
 <text x="374" y="88" font-size="21" text-anchor="middle" fill="#fff" font-weight="700">3. Klasse: 82 %</text>
 <text x="20" y="190" font-size="21" font-weight="700" fill="#172430">Anteil an den Wahlmännern</text>
 <rect x="20" y="208" width="200" height="56" fill="#aa6d18"/>
 <rect x="220" y="208" width="200" height="56" fill="#7f9bb3"/>
 <rect x="420" y="208" width="200" height="56" fill="#37546b"/>
 <g font-size="20" font-weight="700" text-anchor="middle"><text x="120" y="243" fill="#fff">1. Klasse: 1/3</text><text x="320" y="243" fill="#172430">2. Klasse: 1/3</text><text x="520" y="243" fill="#fff">3. Klasse: 1/3</text></g>
 <text x="20" y="300" font-size="17" fill="#3a4855">Werte gerundet, nach Deutschem Historischem Museum</text>
</svg></div>'''

inhalt = '''
<section class="card" id="verfassung">
<h2>Wer hatte welche Macht?</h2>
<p>Am 16. April 1871 trat die <strong>Reichsverfassung</strong> in Kraft. Das Kaiserreich war ein Bundesstaat aus 25 Ländern, zum Beispiel Preußen, Bayern, Sachsen, Oldenburg und Hamburg. Das Emsland gehörte zur preußischen Provinz Hannover. An der Spitze stand der Kaiser. Gleichzeitig gab es ein gewähltes Parlament, den <strong>Reichstag</strong>. Wie passt das zusammen?</p>
''' + VERF_SVG + '''
''' + task('hot') + '''
<div class="notice"><strong>Wichtig:</strong> Der Reichskanzler brauchte das Vertrauen des Kaisers, nicht das des Reichstags. Der Reichstag konnte ihn nicht absetzen. Als Kaiser Wilhelm II. und Bismarck sich 1890 stritten, entließ der Kaiser den Kanzler einfach. Der Reichstag hatte darauf keinen Einfluss.</div>
</section>

<section class="card" id="quelle">
<h2>Die Quelle: Die Reichsverfassung von 1871</h2>
<p>Eine Verfassung ist eine besondere Quelle. Sie zeigt, wie ein Staat funktionieren soll. Lies die Auszüge genau.</p>
<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Verfassung des Deutschen Reichs vom 16. April 1871</strong>, beschlossen vom Reichstag und vom Bundesrat. Auszüge im Wortlaut.</p>
 <div class="zitat">
  <p><strong>Art. 5:</strong> „Die Reichsgesetzgebung wird ausgeübt durch den Bundesrath und den Reichstag.“</p>
  <p><strong>Art. 11:</strong> „Das Präsidium des Bundes steht dem Könige von Preußen zu, welcher den Namen Deutscher Kaiser führt.“</p>
  <p><strong>Art. 12:</strong> „Dem Kaiser steht es zu, den Bundesrath und den Reichstag zu berufen, zu eröffnen, zu vertagen und zu schließen.“</p>
  <p><strong>Art. 15:</strong> „Der Vorsitz im Bundesrathe und die Leitung der Geschäfte steht dem Reichskanzler zu, welcher vom Kaiser zu ernennen ist.“</p>
  <p><strong>Art. 20:</strong> „Der Reichstag geht aus allgemeinen und direkten Wahlen mit geheimer Abstimmung hervor.“</p>
 </div>
 <p class="hint">Worterklärungen: Präsidium = Vorsitz, Spitze. Vertagen = auf später verschieben. Bundesrath ist die alte Schreibweise von Bundesrat.</p>
</div>
''' + chronos("Eine Verfassung sagt, wie es sein soll. Ob es im Alltag genauso war, steht auf einem anderen Blatt. Prüfe jeden Artikel: Stärkt er das Volk oder die Herrscher?") + '''
''' + task('artikel') + '''
''' + task('darst') + '''
</section>

<section class="card" id="wahlrecht">
<h2>Zwei Wahlrechte in einem Land</h2>
<p>Für den Reichstag durften alle Männer ab 25 Jahren wählen. Ausgenommen waren Soldaten im Dienst und Männer, die Armenhilfe bekamen. Jede Stimme zählte gleich. Das war für die damalige Zeit sehr fortschrittlich.</p>
<p>Im größten Land, in <strong>Preußen</strong>, galt aber für das Landesparlament ein anderes Wahlrecht: das <strong>Dreiklassenwahlrecht</strong>. Die Wähler wurden nach der Höhe ihrer Steuern in drei Klassen eingeteilt. Jede Klasse wählte gleich viele Wahlmänner, und diese wählten dann die Abgeordneten. Die Stimme wurde öffentlich abgegeben. Dieses Wahlrecht galt in Preußen von 1849 bis 1918.</p>
''' + DREI_SVG + '''
''' + task('rechnen') + '''
''' + task('zuord') + '''
</section>

<section class="card" id="ausgegrenzt">
<h2>Wer wurde ausgegrenzt?</h2>
<p>Bismarck sah in manchen Gruppen „Reichsfeinde“. Er glaubte, sie seien dem neuen Reich nicht treu.</p>
<ul>
 <li><strong>Kulturkampf (etwa 1871 bis 1878, danach schrittweise beendet):</strong> Bismarck kämpfte gegen den Einfluss der katholischen Kirche. Priester durften politische Themen nicht mehr in der Predigt ansprechen, der Jesuitenorden wurde verboten, der Staat kontrollierte die Ausbildung der Priester. Seit 1875 galt die Zivilehe: Nur die Trauung beim Standesamt war rechtlich gültig. Viele Bischöfe wurden abgesetzt oder verhaftet. Im Bistum Osnabrück, zu dem das Emsland gehört, blieb der Bischofssitz von 1878 bis 1882 unbesetzt.</li>
 <li><strong>Sozialistengesetz (1878 bis 1890):</strong> Sozialdemokratische Vereine, Versammlungen und Zeitungen wurden verboten. Kandidaten durften aber weiter in den Reichstag gewählt werden.</li>
 <li><strong>Frauen</strong> durften im ganzen Kaiserreich nicht wählen. In Preußen durften sie bis 1908 nicht einmal Mitglied einer politischen Partei werden.</li>
</ul>
<div class="notice warn"><strong>Aus der Region:</strong> Im Reichstag vertrat <strong>Ludwig Windthorst</strong> von 1871 bis 1891 den Wahlkreis Meppen, Lingen und Bentheim, also das heutige Emsland und die Grafschaft Bentheim. Er stammte aus Ostercappeln bei Osnabrück und war der wichtigste Politiker der katholischen <strong>Zentrumspartei</strong>. Im Kulturkampf war er Bismarcks bekanntester Gegenspieler im Parlament.</div>
''' + task('stimmen') + '''
''' + task('kette') + '''
''' + task('heute', 'weiter') + '''
</section>
'''

tasks = [
 {"id":"hot","type":"hot","key":"verfassung","name":"Verfassung 1871","tag":"Schaubild",
  "targets":[{"id":"h011Kaiser","tipp":"Finde das Amt, das den Reichskanzler ernannte und entlassen konnte.","ok":"Richtig. Der Kaiser ernannte den Reichskanzler. Kaiser wurde man nicht durch Wahl, sondern weil man König von Preußen war."},
             {"id":"h011Reichstag","tipp":"Finde die Versammlung, die das Volk, genauer gesagt die Männer, wählen durfte.","ok":"Richtig. Der Reichstag wurde gewählt. Er beschloss Gesetze und den Haushalt mit."},
             {"id":"h011Bundesrat","tipp":"Finde die Versammlung, in der die Fürsten und Freien Städte vertreten waren und ohne deren Zustimmung kein Gesetz zustande kam.","ok":"Richtig. Im Bundesrat saßen Vertreter der Landesregierungen. Preußen hatte dort 17 von 58 Stimmen und konnte damit wichtige Änderungen verhindern."}],
  "all":[{"id":"h011Kaiser","name":"Kaiser"},{"id":"h011Kanzler","name":"Reichskanzler"},{"id":"h011Militaer","name":"Heer"},{"id":"h011Bundesrat","name":"Bundesrat"},{"id":"h011Reichstag","name":"Reichstag"},{"id":"h011Fuersten","name":"Einzelstaaten"},{"id":"h011Waehler","name":"Wähler"}],
  "fertig":"Alle drei Teile gefunden.",
  "ok":"Du siehst: Das Volk wählte nur den Reichstag. Kaiser, Kanzler und Heer standen außerhalb seiner Kontrolle."},
 {"id":"artikel","type":"sel","key":"quelle_verfassung","name":"Artikel prüfen","tag":"Quellenarbeit","wide":True,
  "titel":"Stärkt der Artikel das Volk oder die Herrscher?",
  "frage":"Entscheide für jeden Artikel.",
  "choices":["stärkt die Mitbestimmung des Volkes","stärkt Kaiser und Fürsten","teils, teils"],
  "rows":[{"t":"Art. 20: Wahl des Reichstags in allgemeiner, direkter und geheimer Wahl","ok":"stärkt die Mitbestimmung des Volkes","fb":"Wählen dürfen und geheim wählen, das stärkt die Bürger."},
          {"t":"Art. 11: Der König von Preußen ist automatisch Deutscher Kaiser","ok":"stärkt Kaiser und Fürsten","fb":"Niemand wählt den Kaiser. Das Amt wird vererbt."},
          {"t":"Art. 15: Der Kaiser ernennt den Reichskanzler","ok":"stärkt Kaiser und Fürsten","fb":"Der Reichstag hat bei der Wahl des Kanzlers nichts zu sagen."},
          {"t":"Art. 12: Der Kaiser beruft, vertagt und schließt den Reichstag","ok":"stärkt Kaiser und Fürsten","fb":"Der Kaiser bestimmt, wann das Parlament tagt."},
          {"t":"Art. 5: Gesetze brauchen Bundesrat und Reichstag","ok":"teils, teils","fb":"Der Reichstag darf mitentscheiden. Aber ohne den Bundesrat der Fürsten geht nichts."}],
  "hilfe":"Frage bei jedem Artikel: Wer entscheidet hier, gewählte Abgeordnete oder Menschen, die niemand gewählt hat?",
  "ok":"Gut geprüft. Die Verfassung mischte beides: ein modernes Wahlrecht für den Reichstag, aber die eigentliche Macht blieb bei Kaiser, Kanzler und Fürsten. Man nennt das eine konstitutionelle Monarchie.",
  "hint":"Die richtigen Auswahlen sind grün umrandet. Lies die Hinweise unter den anderen Zeilen."},
 {"id":"darst","type":"mc","key":"quelle_grenzen","name":"Reichweite der Quelle","tag":"Quellenkritik",
  "frage":"Was kann dir der Verfassungstext NICHT zeigen?",
  "opts":[{"v":"a","t":"Wie die Regeln im Alltag umgesetzt wurden, zum Beispiel wie Katholiken, Sozialdemokraten oder Frauen tatsächlich behandelt wurden.","ok":True,"fb":"Richtig. Eine Verfassung ist eine normative Quelle: Sie sagt, wie es sein soll. Wie es wirklich war, zeigen erst andere Quellen, zum Beispiel Zeitungsberichte, Gesetze wie das Sozialistengesetz oder Briefe."},
          {"v":"b","t":"Wer den Reichskanzler ernennt.","fb":"Das steht ausdrücklich in Artikel 15."},
          {"v":"c","t":"Wie der Reichstag gewählt wird.","fb":"Das steht in Artikel 20."}]},
 {"id":"rechnen","type":"mc","key":"dreiklassen","name":"Dreiklassenwahlrecht","tag":"Diagramm lesen",
  "frage":"Lies das Diagramm. Etwa wie viele Wähler der dritten Klasse hatten zusammen so viel Einfluss wie ein einziger Wähler der ersten Klasse?",
  "opts":[{"v":"a","t":"Etwa 2","fb":"Rechne nach: 82 Prozent der Wähler haben gleich viel Gewicht wie 4 Prozent. 82 geteilt durch 4 ergibt etwa 20."},
          {"v":"b","t":"Etwa 20","ok":True,"fb":"Richtig. 82 Prozent der Wähler bestimmten ein Drittel der Wahlmänner, 4 Prozent ebenfalls ein Drittel. Die Stimme eines reichen Fabrikanten wog also etwa 20-mal so viel wie die eines Arbeiters. Gleich war diese Wahl nicht."},
          {"v":"c","t":"Etwa 200","fb":"So groß war der Unterschied im Durchschnitt nicht. Rechne: 82 geteilt durch 4."}]},
 {"id":"zuord","type":"zuord","key":"wahlrecht_vergleich","name":"Wahlrechte vergleichen","tag":"Vergleichen",
  "titel":"Reichstag oder Preußen?",
  "frage":"Ordne zu: Gilt das für die Wahl zum Reichstag, für die Wahl zum preußischen Landesparlament oder für beide?",
  "zones":[{"id":"reich","t":"Reichstagswahl"},{"id":"preussen","t":"Preußisches Dreiklassenwahlrecht"},{"id":"beide","t":"Gilt für beide"}],
  "cards":[{"id":"c1","t":"Geheime Stimmabgabe","z":"reich"},
           {"id":"c2","t":"Jede Stimme zählt gleich","z":"reich"},
           {"id":"c3","t":"Abgeordnete werden direkt gewählt","z":"reich"},
           {"id":"c4","t":"Stimmabgabe öffentlich","z":"preussen"},
           {"id":"c5","t":"Einteilung nach Steuern","z":"preussen"},
           {"id":"c6","t":"Wahl über Wahlmänner","z":"preussen"},
           {"id":"c7","t":"Frauen dürfen nicht wählen","z":"beide"}],
  "hilfe":"Lies Artikel 20 noch einmal: allgemein, direkt, geheim. Was davon fehlt beim Dreiklassenwahlrecht?",
  "ok":"Alle richtig. Ein Mann aus Rhede durfte den Reichstag gleich und geheim wählen. Bei der Wahl zum preußischen Landtag wog seine Stimme aber je nach Steuern ganz unterschiedlich, und jeder konnte sehen, wen er wählte. Frauen blieben bei beiden Wahlen ausgeschlossen.",
  "hint":"Prüfe die rot markierten Karten mit Hilfe des Textes über dem Diagramm."},
 {"id":"stimmen","type":"sel","key":"perspektiven","name":"Perspektiven der Ausgegrenzten","tag":"Perspektivwechsel","wide":True,
  "titel":"Wer erlebt was?",
  "frage":"Die folgenden Stimmen sind ausgedacht. Sie zeigen aber typische Erfahrungen, die es wirklich gab. Ordne jeder Stimme die passende Maßnahme oder Lage zu.",
  "choices":["Kulturkampf","Sozialistengesetz","fehlendes Frauenwahlrecht"],
  "rows":[{"t":"Ein Kaplan im Emsland, 1876: „Ich darf in der Predigt nichts über Politik sagen, sonst droht mir Gefängnis.“","ok":"Kulturkampf","fb":"Es geht um Priester und Predigt, also um die katholische Kirche."},
          {"t":"Ein Tischler in Berlin, 1880: „Unsere Arbeiterzeitung ist verboten. Wir treffen uns heimlich.“","ok":"Sozialistengesetz","fb":"Arbeiterzeitungen und Treffen von Sozialdemokraten wurden ab 1878 verboten."},
          {"t":"Eine Lehrerin in Osnabrück, 1890: „Ich zahle Steuern, aber über die Gesetze darf ich nicht mitbestimmen.“","ok":"fehlendes Frauenwahlrecht","fb":"Frauen durften bis 1918 nicht wählen."},
          {"t":"Ein Brautpaar in Meppen, 1876: „Wir müssen erst zum Standesamt, die kirchliche Trauung allein gilt nicht mehr.“","ok":"Kulturkampf","fb":"Die Zivilehe wurde im Kulturkampf eingeführt."}],
  "hilfe":"Achte auf die Schlüsselwörter: Predigt und Trauung gehören zur Kirche, Arbeiterzeitung zu den Sozialdemokraten, Lehrerin und mitbestimmen zum Wahlrecht.",
  "ok":"Richtig. Das Kaiserreich gab Männern ein modernes Wahlrecht, grenzte aber große Gruppen aus oder bekämpfte sie. Für Katholiken im Emsland war der Kulturkampf eine prägende Erfahrung. Sie wählten fast geschlossen das Zentrum.",
  "hint":"Die richtigen Auswahlen sind grün umrandet."},
 {"id":"kette","type":"order","key":"sozialistengesetz","name":"Zuckerbrot und Peitsche","tag":"Ursache und Folge",
  "titel":"Zuckerbrot und Peitsche",
  "frage":"Bismarck bekämpfte die Sozialdemokraten mit Verboten und versuchte zugleich, die Arbeiter mit Hilfen zu gewinnen. Bringe die Kette in die richtige Reihenfolge.",
  "oben":"die Ursache.","unten":"die Folge.",
  "items":["Die Sozialdemokraten gewinnen bei den Arbeitern immer mehr Anhänger.",
           "1878 verbietet das Sozialistengesetz ihre Vereine, Versammlungen und Zeitungen.",
           "Ab 1883 führt Bismarck Kranken-, Unfall- und Rentenversicherung für Arbeiter ein.",
           "1890 wird das Sozialistengesetz nicht verlängert. Die Sozialdemokraten erhalten bei der Reichstagswahl die meisten Stimmen."],
  "hilfe":"Peitsche bedeutet Strafe, Zuckerbrot bedeutet Belohnung. Was kam zuerst?",
  "ok":"Genau. Die Verbote erreichten ihr Ziel nicht. Die Sozialversicherungen aber waren ein wichtiger Schritt, sie sind die Grundlage unseres heutigen Sozialstaats.",
  "hint":"Achte auf die Jahreszahlen in den Karten."},
 {"id":"heute","type":"frei","key":"weiterdenken_heute","name":"Weiterdenken Wahlrecht heute","tag":"Weiterdenken · Gegenwartsbezug",
  "frage":"Heute heißt es im Grundgesetz, dass Abgeordnete in „allgemeiner, unmittelbarer, freier, gleicher und geheimer Wahl“ gewählt werden. Vergleiche mit dem Kaiserreich: Was ist gleich geblieben, was hat sich verändert? Nenne mindestens zwei Unterschiede.",
  "platz":"Gleich geblieben ist ... Anders ist heute ..., weil ...",
  "min":70,"kurz":"Deine Antwort ist noch sehr kurz. Nenne mindestens zwei Unterschiede zwischen damals und heute.",
  "gruppen":[{"w":["frau"],"tipp":"Denke an die Frauen."},
             {"w":["18","25","alter","jahre"],"tipp":"Vergleiche das Wahlalter."},
             {"w":["kanzler","regierung","kaiser","parlament","bundestag","reichstag"],"tipp":"Vergleiche, wer heute den Regierungschef wählt."}],
  "gut":"Sehr gut verglichen. Heute wählen Frauen und Männer ab 18, und das Parlament wählt den Bundeskanzler. Im Kaiserreich ernannte der Kaiser den Kanzler."},
]

M = {
 "nr":"011","titel":"Wie demokratisch war das Kaiserreich?","bereich":BEREICH,
 "hero":"Das Kaiserreich hatte einen Kaiser und ein gewähltes Parlament, ein modernes Wahlrecht und zugleich ein sehr ungleiches. Du untersuchst die Verfassung, vergleichst zwei Wahlrechte und fragst, wer ausgeschlossen wurde. Am Ende fällst du ein eigenes Urteil.",
 "ziele":["Du beschreibst mit einem Schaubild, wie die Macht im Kaiserreich verteilt war.",
          "Du prüfst Artikel der Reichsverfassung als Quelle.",
          "Du vergleichst das Reichstagswahlrecht mit dem preußischen Dreiklassenwahlrecht.",
          "Du erklärst Kulturkampf und Sozialistengesetz und nennst die Folgen.",
          "Du beurteilst, wie demokratisch das Kaiserreich war."],
 "mission":'''<div class="akte">
 <span class="stamp">Akte 011</span>
 <p><strong>Fall:</strong> Zwei Karteikarten liegen nebeneinander. Auf der einen steht: „Das Kaiserreich war eine Demokratie, denn es gab Wahlen.“ Auf der anderen: „Das Kaiserreich war eine Diktatur des Kaisers.“ Chronos kann sich nicht entscheiden.</p>
 <p><strong>Dein Auftrag:</strong> Prüfe Verfassung, Wahlrecht und den Umgang mit Minderheiten. Am Ende entscheidest du, welche Karte stimmt, oder ob die Wahrheit dazwischen liegt.</p>
</div>''' + chronos("Ich habe beide Karten geschrieben, an verschiedenen Tagen. Schwierig, oder? Für die Abschlussmission nehme ich die erste. Hilf mir, sie zu prüfen. Kleiner Tipp: Achte darauf, wer wählen durfte und wer am Ende entschied."),
 "dtext":"Woran erkennt man für dich eine Demokratie? Nenne zwei Merkmale.",
 "inhalt":inhalt,
 "nav":[("verfassung","Wer hatte Macht?"),("quelle","Die Quelle"),("wahlrecht","Zwei Wahlrechte"),("ausgegrenzt","Ausgegrenzt")],
 "glossar":[("Reichstag","Das gewählte Parlament des Kaiserreichs. Es beschloss Gesetze und den Haushalt mit, konnte aber den Kanzler nicht absetzen."),
            ("Bundesrat","Vertretung der Regierungen der Einzelstaaten. Ohne seine Zustimmung kam kein Gesetz zustande."),
            ("Reichskanzler","Leiter der Reichsregierung. Er wurde vom Kaiser ernannt und war nur ihm verantwortlich."),
            ("Allgemeines Männerwahlrecht","Alle Männer ab 25 Jahren durften den Reichstag wählen, mit wenigen Ausnahmen. Frauen waren ausgeschlossen."),
            ("Dreiklassenwahlrecht","Wahlrecht in Preußen von 1849 bis 1918. Die Stimmen der Reichen zählten viel mehr als die der Armen."),
            ("Kulturkampf","Auseinandersetzung zwischen Bismarck und der katholischen Kirche, etwa 1871 bis 1878."),
            ("Sozialistengesetz","Gesetz von 1878 bis 1890, das sozialdemokratische Vereine, Versammlungen und Zeitungen verbot."),
            ("Konstitutionelle Monarchie","Ein Staat mit Monarch und Verfassung, in dem das Parlament mitbestimmt, aber nicht die Regierung bestimmt.")],
 "karte":"Das Kaiserreich war eine Demokratie, denn es gab Wahlen.",
 "a1frage":"Wie entscheidest du über die Karteikarte?",
 "a2frage":"Schreibe Chronos eine Nachricht. Beurteile in drei bis fünf Sätzen, wie demokratisch das Kaiserreich war. Nenne mindestens ein Merkmal, das für Demokratie spricht, und mindestens zwei, die dagegen sprechen.",
 "a2platz":"Lieber Chronos, das Kaiserreich war nur teilweise demokratisch, weil ...",
 "a2satz":"„Für Demokratie spricht, dass ...“ · „Dagegen spricht, dass ...“ · „Außerdem ...“ · „Deshalb war das Kaiserreich ...“",
 "data":{
  "tasks":tasks,
  "badges":[{"n":"Verfassungskenner","ids":["hot","artikel"]},{"n":"Rechenprofi","ids":["rechnen","zuord"]},{"n":"Perspektivwechsler","ids":["stimmen"]},{"n":"Begründer","ids":["a2"]}],
  "diag":[{"tag":"Schätzfrage","frage":"Wer durfte im Kaiserreich den Reichstag wählen?","opts":[{"v":"a","t":"Alle Erwachsenen"},{"v":"b","t":"Männer ab 25 Jahren"},{"v":"c","t":"Nur Adlige"}],"ok":"b","tipp":"Vorab: Wählen durften Männer ab 25 Jahren."},
          {"tag":"Richtig oder falsch","frage":"Im Kaiserreich wählte das Parlament den Regierungschef, so wie heute der Bundestag den Bundeskanzler.","opts":[{"v":"r","t":"Das stimmt"},{"v":"f","t":"Das stimmt nicht"}],"ok":"f","tipp":"Den Reichskanzler ernannte der Kaiser."},
          {"tag":"Vermutung","frage":"Kann ein Staat Wahlen haben und trotzdem nicht ganz demokratisch sein?","opts":[{"v":"a","t":"Ja, wenn das Parlament wenig zu sagen hat oder viele nicht wählen dürfen"},{"v":"b","t":"Nein, Wahlen bedeuten immer Demokratie"},{"v":"c","t":"Nein, Wahlen gibt es nur in Demokratien"}],"ok":"a"}],
  "a1":[{"v":"ok","t":"Die Karte stimmt. Wo gewählt wird, ist Demokratie.","ok":False,"fb":"Wahlen allein reichen nicht. Entscheidend ist auch, wer wählen darf und ob das gewählte Parlament die Regierung bestimmt."},
         {"v":"teil","t":"Die Karte stimmt nur zum Teil. Es gab ein fortschrittliches Wahlrecht für Männer, aber Kaiser und Kanzler waren nicht vom Parlament abhängig, Frauen waren ausgeschlossen und Minderheiten wurden bekämpft.","ok":True,"fb":"Das Kaiserreich hatte demokratische Elemente, war aber keine Demokratie. Viele Historiker sprechen von einer konstitutionellen Monarchie mit einem starken Obrigkeitsstaat."},
         {"v":"falsch","t":"Die Karte ist völlig falsch. Es gab überhaupt keine Mitbestimmung.","ok":False,"fb":"Das ist zu hart. Der Reichstag wurde gewählt und musste Gesetzen und dem Haushalt zustimmen. Es gab also Mitbestimmung, aber nur begrenzt."}],
  "a2":{"start":"Beginne mit: „Für Demokratie spricht, dass ...“",
        "fach":[["reichstag","Reichstag"],["reichskanzler","Reichskanzler"],["kanzler","Kanzler"],["bundesrat","Bundesrat"],["wahlrecht","Wahlrecht"],["dreiklassen","Dreiklassenwahlrecht"],["kulturkampf","Kulturkampf"],["sozialistengesetz","Sozialistengesetz"],["verfassung","Verfassung"],["konstitutionell","konstitutionelle Monarchie"],["kaiser","Kaiser"]],
        "fachTipp":"Reichstag, Reichskanzler, Dreiklassenwahlrecht oder Kulturkampf",
        "themen":[{"w":["wahl","wahlen","reichstag","geheim","mannerwahlrecht","parlament"],"gut":"Du nennst ein Merkmal, das für Demokratie spricht.","tipp":"Nenne ein Merkmal, das für Demokratie spricht, zum Beispiel die Reichstagswahl."},
                  {"w":["kaiser ernannt","ernannte","ernennt","nicht absetzen","dreiklassen","frauen","kulturkampf","sozialistengesetz","verbot"],"gut":"Du nennst Merkmale, die gegen Demokratie sprechen.","tipp":"Nenne Merkmale, die gegen Demokratie sprechen, zum Beispiel wer den Kanzler ernannte oder wer nicht wählen durfte."},
                  {"w":["teilweise","zum teil","nur begrenzt","eingeschrankt","keine echte","nicht ganz","nur teil","halb"],"gut":"Du fällst ein abgewogenes Gesamturteil.","tipp":"Fasse am Ende dein Urteil zusammen, zum Beispiel: „Deshalb war das Kaiserreich nur teilweise demokratisch.“"}],
        "voll":"Ein ausgewogenes Urteil mit Belegen von beiden Seiten. Genau so arbeiten Historikerinnen und Historiker."},
  "lc":["Ich kann mit einem Schaubild erklären, wer im Kaiserreich welche Macht hatte.",
        "Ich kann das Reichstagswahlrecht und das Dreiklassenwahlrecht vergleichen.",
        "Ich kann begründet beurteilen, wie demokratisch das Kaiserreich war."],
  "komp":{"fachwissen":["hot","zuord"],"zeit_raum":["kette"],"quellenarbeit":["artikel","darst"],"ursachen_folgen":["kette"],"perspektivitaet":["stimmen"]},
  "next":"Weiter geht es mit Modul 012: Wie veränderten sich Gesellschaft und Alltag?"
 }
}

if __name__ == "__main__":
    build(M)
