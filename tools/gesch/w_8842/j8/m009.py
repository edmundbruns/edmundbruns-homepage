import sys; sys.path.insert(0, '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/gesch/w_8842/j8')
from eng8 import build, chronos, task

BEREICH = "Nation und politische Teilhabe"

def box(id_, x, y, w, h, t1, t2, fill):
    return ('<g class="hot" data-task="hot" id="%s" tabindex="0" role="button" aria-label="%s">'
            '<rect x="%d" y="%d" width="%d" height="%d" rx="12" fill="%s" stroke="#37546b" stroke-width="3"/>'
            '<text x="%d" y="%d" font-size="22" font-weight="700" text-anchor="middle" fill="#172430">%s</text>'
            '<text x="%d" y="%d" font-size="17" text-anchor="middle" fill="#3a4855">%s</text></g>') % (
            id_, t1, x, y, w, h, fill, x + w // 2, y + h // 2 - 4, t1, x + w // 2, y + h // 2 + 20, t2)

VERF_SVG = ('<div class="svgwrap"><svg class="bild" viewBox="0 0 640 440" role="img" aria-label="Schaubild der Reichsverfassung von 1849 mit Kaiser, Reichsregierung, Reichsgericht, Volkshaus, Staatenhaus, Wählern und Einzelstaaten">'
 '<rect width="640" height="440" fill="#f7f8fa"/>'
 '<defs><marker id="pf9" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#55606a"/></marker></defs>'
 '<g stroke="#55606a" stroke-width="2.5" fill="none" marker-end="url(#pf9)">'
 '<path d="M250 62 H190"/><path d="M180 384 V318"/><path d="M460 384 V318"/>'
 '</g>'
 + box('h009Kaiser', 250, 20, 140, 84, 'Kaiser', 'erblich', '#f5e9cf')
 + box('h009Regierung', 20, 20, 170, 84, 'Regierung', 'Reichsminister', '#e7edf2')
 + box('h009Gericht', 450, 20, 170, 84, 'Reichsgericht', 'prüft Streit', '#e7edf2')
 + '<rect x="40" y="150" width="560" height="170" rx="16" fill="none" stroke="#aa6d18" stroke-width="2" stroke-dasharray="8 6"/>'
 + '<text x="320" y="176" font-size="20" font-weight="700" text-anchor="middle" fill="#8f5a12">Reichstag</text>'
 + box('h009Volkshaus', 70, 196, 220, 110, 'Volkshaus', 'gewählte Abgeordnete', '#e9f2ec')
 + box('h009Staatenhaus', 350, 196, 220, 110, 'Staatenhaus', 'Vertreter der Länder', '#efeaf7')
 + box('h009Waehler', 70, 360, 220, 70, 'Wähler', 'Männer ab 25', '#fff')
 + box('h009Staaten', 350, 360, 220, 70, 'Einzelstaaten', 'Regierungen, Landtage', '#fff')
 + '<text x="320" y="128" font-size="15" text-anchor="middle" fill="#55606a">Vereinfachtes Schaubild, eigene Darstellung</text>'
 + '</svg></div>')

inhalt = '''
<section class="card" id="maerz">
<h2>Der März 1848: Was wollten die Menschen?</h2>
<p>Im Februar 1848 stürzten Aufständische in Paris den französischen König. Die Nachricht verbreitete sich schnell. Im März gingen in vielen deutschen Staaten Menschen auf die Straße. In Berlin und Wien kam es zu Kämpfen an Barrikaden. In Berlin starben am 18. und 19. März nach Schätzungen etwa 250 bis 300 Menschen. Viele Fürsten gaben nach und ernannten neue, liberale Minister. Auch König Ernst August von Hannover holte im März 1848 liberale Männer in die Regierung, zum Beispiel Johann Carl Bertram Stüve aus Osnabrück.</p>
<p>Die Forderungen dieser Wochen nennt man <strong>Märzforderungen</strong>. Nicht alle wollten dasselbe. Bürger, Bauern und Handwerker hatten unterschiedliche Sorgen.</p>
''' + task('zuord') + '''
</section>

<section class="card" id="verlauf">
<h2>Der Verlauf der Revolution</h2>
<p>Bringe die Ereignisse in die richtige zeitliche Reihenfolge, vom Frühesten zum Spätesten.</p>
''' + task('verlauf') + '''
</section>

<section class="card" id="paulskirche">
<h2>Die Paulskirche und die Verfassung</h2>
<p>Am 18. Mai 1848 trat in der Frankfurter Paulskirche die <strong>Nationalversammlung</strong> zusammen. Ihre Abgeordneten waren von Männern in allen Staaten des Deutschen Bundes gewählt worden. Viele von ihnen waren Juristen, Professoren und Beamte. Deshalb sprach man spöttisch vom „Professorenparlament“. Ihr Auftrag: eine Verfassung für ein einiges Deutschland. Am 28. März 1849 wurde die <strong>Reichsverfassung</strong> verkündet.</p>
''' + VERF_SVG + '''
''' + task('hot') + '''
''' + task('kaiserfrage') + '''
</section>

<section class="card" id="grundrechte">
<h2>Die Grundrechte des deutschen Volkes</h2>
<p>Schon Ende Dezember 1848 beschloss die Nationalversammlung die <strong>Grundrechte</strong>. Sie wurden Teil der Verfassung. Lies die Auszüge und ordne zu, welches Recht gemeint ist.</p>
<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Verfassung des Deutschen Reiches vom 28. März 1849</strong>, Abschnitt VI: Die Grundrechte des deutschen Volkes. Auszüge, Rechtschreibung leicht angepasst.</p>
</div>
''' + task('rechte') + '''
<div class="notice"><strong>Gegenwartsbezug:</strong> Viele dieser Rechte findest du heute fast wortgleich im Grundgesetz von 1949, zum Beispiel in Artikel 3 (Gleichheit), Artikel 4 (Glaubensfreiheit), Artikel 5 (Meinungsfreiheit) und Artikel 8 (Versammlungsfreiheit).</div>
</section>

<section class="card" id="quelle">
<h2>Die Quelle: Ein König sagt Nein</h2>
<p>Am 28. März 1849 wählte die Nationalversammlung den preußischen König Friedrich Wilhelm IV. zum „Kaiser der Deutschen“. 290 Abgeordnete stimmten für ihn, 248 enthielten sich. Am 3. April 1849 empfing der König die Abordnung aus Frankfurt und gab eine ausweichende Antwort. Ende April lehnte er die Krone endgültig ab. Was er wirklich dachte, hatte er schon Monate vorher in einem privaten Brief geschrieben.</p>
<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Friedrich Wilhelm IV., König von Preußen, Brief an seinen Freund und Gesandten Christian Carl Josias von Bunsen</strong>, 13. Dezember 1848. Auszüge, Rechtschreibung leicht angepasst.</p>
 <div class="zitat"><p>„Die Krone ist erstlich keine Krone.“</p>
 <p>Eine echte Krone sei eine, „die den Stempel Gottes trägt, die den, dem sie aufgesetzt wird nach der heiligen Ölung, ‚von Gottes Gnaden‘ macht“.</p>
 <p>Die angebotene Krone dagegen rieche nach dem „Ludergeruch der Revolution von 1848“.</p>
 <p>„Einen solchen imaginären Reif, aus Dreck und Letten gebacken, soll ein legitimer König von Gottes Gnaden und nun gar der König von Preußen sich geben lassen?“</p></div>
 <p class="hint">Worterklärungen: Ludergeruch = Gestank von Aas. Letten = Lehm, Schlamm. Imaginär = nur ausgedacht. Legitim = rechtmäßig.</p>
</div>
''' + chronos("Ein privater Brief! Den hat der König nicht für die Öffentlichkeit geschrieben. Überlege, was das für den Wert der Quelle bedeutet. Und frage dich: Wer hatte in seinen Augen das Recht, eine Krone zu vergeben?") + '''
''' + task('wfragen') + '''
''' + task('grund') + '''
''' + task('darst') + '''
</section>

<section class="card" id="scheitern">
<h2>Gegenrevolution: Wer hatte die Macht?</h2>
<p>Nach der Ablehnung der Krone erkannten Preußen, Österreich und andere große Staaten die Verfassung nicht an. Im Mai 1849 kam es in Sachsen, in der Pfalz und in Baden zu Aufständen für die Verfassung. Preußische Truppen schlugen sie nieder. Im Juni 1849 wurde das Restparlament in Stuttgart von Soldaten aufgelöst. Am 23. Juli 1849 ergab sich die Festung Rastatt, die letzte Hochburg der Revolution. Viele Revolutionäre wurden verurteilt, viele flohen nach Amerika. Diese Rückkehr der alten Mächte nennt man <strong>Gegenrevolution</strong>.</p>
''' + task('gruende') + '''
''' + task('bismarck', 'weiter') + '''
</section>
'''

tasks = [
 {"id":"zuord","type":"zuord","key":"maerzforderungen","name":"Märzforderungen","tag":"Zuordnen",
  "titel":"Wer forderte was?",
  "frage":"Ordne jede Forderung dem passenden Bereich zu.",
  "zones":[{"id":"freiheit","t":"Freiheit und Mitbestimmung"},{"id":"einheit","t":"Nationale Einheit"},{"id":"sozial","t":"Soziale Not"}],
  "cards":[{"id":"c1","t":"Pressefreiheit ohne Zensur","z":"freiheit"},
           {"id":"c2","t":"Gerichte mit Bürgern als Geschworenen","z":"freiheit"},
           {"id":"c3","t":"Freiheit, sich zu versammeln","z":"freiheit"},
           {"id":"c4","t":"Ein Parlament für ganz Deutschland","z":"einheit"},
           {"id":"c5","t":"Ein gemeinsamer deutscher Staat","z":"einheit"},
           {"id":"c6","t":"Bauern wollen keine Abgaben mehr an die Grundherren zahlen","z":"sozial"},
           {"id":"c7","t":"Handwerker wollen Schutz vor billiger Fabrikware und Hunger","z":"sozial"}],
  "hilfe":"Fragen zur Hilfe: Geht es um Rechte gegenüber dem Staat? Dann Freiheit. Geht es um ein gemeinsames Deutschland? Dann Einheit. Geht es um Geld, Arbeit und Essen? Dann soziale Not.",
  "ok":"Alle richtig. Die Revolution hatte viele Ziele. Das war ihre Stärke, weil viele Menschen mitmachten. Es war aber auch eine Schwäche: Als die Bauern ihre Abgaben los waren, verloren viele das Interesse an der Revolution.",
  "hint":"Lies die rot markierten Karten noch einmal: Wer würde diese Forderung stellen, ein Zeitungsschreiber, ein Abgeordneter oder ein hungriger Handwerker?"},
 {"id":"verlauf","type":"order","key":"verlauf","name":"Verlauf der Revolution","tag":"Zeitleiste",
  "titel":"Von Paris bis Rastatt",
  "frage":"Bringe die sechs Ereignisse in die richtige Reihenfolge.",
  "oben":"das früheste Ereignis.","unten":"das späteste Ereignis.",
  "items":["Februar 1848: Revolution in Paris",
           "März 1848: Kämpfe in Berlin und Wien, Fürsten geben nach",
           "Mai 1848: Die Nationalversammlung tritt in der Paulskirche zusammen",
           "Dezember 1848: Die Grundrechte werden beschlossen",
           "März und April 1849: Kaiserwahl und Ablehnung durch Friedrich Wilhelm IV.",
           "Juli 1849: Rastatt ergibt sich, die Revolution ist niedergeschlagen"],
  "hilfe":"Achte auf die Monate und Jahre am Anfang jeder Karte.",
  "ok":"Richtig. Die Revolution dauerte etwa anderthalb Jahre. Zuerst schien alles möglich, ab Ende 1848 gewannen die alten Mächte die Oberhand zurück.",
  "hint":"Sortiere zuerst nach Jahr, dann nach Monat."},
 {"id":"hot","type":"hot","key":"verfassung","name":"Verfassung 1849","tag":"Schaubild",
  "targets":[{"id":"h009Volkshaus","tipp":"Finde den Teil, in dem die vom Volk gewählten Abgeordneten saßen.","ok":"Richtig. Das Volkshaus sollte von Männern ab 25 Jahren in allgemeiner, gleicher und geheimer Wahl gewählt werden. Frauen durften nicht wählen."},
             {"id":"h009Staatenhaus","tipp":"Finde den Teil, in dem die einzelnen Länder wie Hannover oder Bayern vertreten waren.","ok":"Richtig. Im Staatenhaus saßen Vertreter der Einzelstaaten. Ein geeintes Deutschland sollte also ein Bundesstaat bleiben, ähnlich wie heute mit dem Bundesrat."},
             {"id":"h009Kaiser","tipp":"Finde das Amt, das die Nationalversammlung Friedrich Wilhelm IV. anbot.","ok":"Richtig. Der Kaiser sollte Staatsoberhaupt sein und sein Amt vererben. Er sollte aber an die Verfassung gebunden sein."}],
  "all":[{"id":"h009Kaiser","name":"Kaiser"},{"id":"h009Regierung","name":"Regierung"},{"id":"h009Gericht","name":"Reichsgericht"},{"id":"h009Volkshaus","name":"Volkshaus"},{"id":"h009Staatenhaus","name":"Staatenhaus"},{"id":"h009Waehler","name":"Wähler"},{"id":"h009Staaten","name":"Einzelstaaten"}],
  "fertig":"Alle drei Teile gefunden.",
  "ok":"Die Verfassung von 1849 verband Einheit und Freiheit: ein Reich mit Kaiser, aber mit gewähltem Parlament und Grundrechten. Man nennt das eine konstitutionelle Monarchie."},
 {"id":"kaiserfrage","type":"mc","key":"kaiserfrage","name":"Groß- oder kleindeutsch","tag":"Auswahl mit Erklärung",
  "frage":"Die Abgeordneten stritten lange: Sollte Österreich zum neuen Reich gehören (großdeutsche Lösung) oder nicht (kleindeutsche Lösung)? Warum setzte sich 1849 die kleindeutsche Lösung mit dem preußischen König durch?",
  "opts":[{"v":"a","t":"Österreich wollte seine vielen nichtdeutschen Gebiete, zum Beispiel in Ungarn und Oberitalien, nicht abtrennen.","ok":True,"fb":"Richtig. Österreich war ein Vielvölkerstaat. Es wollte nur als Ganzes beitreten, und das passte nicht zu einem deutschen Nationalstaat. Deshalb blieb nur die kleindeutsche Lösung mit Preußen an der Spitze."},
          {"v":"b","t":"Weil die Menschen in Österreich kein Deutsch sprachen.","fb":"Das stimmt nicht. In großen Teilen Österreichs sprach man Deutsch. Das Problem waren die vielen anderen Völker im Kaiserreich Österreich."},
          {"v":"c","t":"Weil Preußen bereits eine Republik war.","fb":"Preußen war eine Monarchie mit einem König. Gerade deshalb bot man ihm die Kaiserkrone an."}]},
 {"id":"rechte","type":"sel","key":"grundrechte","name":"Grundrechte","tag":"Quellenarbeit",
  "titel":"Welches Recht ist gemeint?",
  "frage":"Wähle zu jedem Auszug das passende Grundrecht.","wide":True,
  "choices":["Gleichheit vor dem Gesetz","Freiheit der Person","Meinungs- und Pressefreiheit","Glaubensfreiheit","Versammlungsfreiheit"],
  "rows":[{"t":"§ 137: „Der Adel als Stand ist aufgehoben. […] Die Deutschen sind vor dem Gesetze gleich.“","ok":"Gleichheit vor dem Gesetz","fb":"Wenn es keine Vorrechte des Adels mehr gibt, sind alle gleich."},
          {"t":"§ 138: „Die Freiheit der Person ist unverletzlich.“","ok":"Freiheit der Person","fb":"Niemand darf ohne Grund festgenommen werden."},
          {"t":"§ 143: „Jeder Deutsche hat das Recht, durch Wort, Schrift, Druck und bildliche Darstellung seine Meinung frei zu äußern.“","ok":"Meinungs- und Pressefreiheit","fb":"Achte auf die Wörter Schrift, Druck und Meinung."},
          {"t":"§ 144: „Jeder Deutsche hat volle Glaubens- und Gewissensfreiheit.“","ok":"Glaubensfreiheit","fb":"Es geht um Religion und Gewissen."},
          {"t":"§ 161: „Die Deutschen haben das Recht, sich friedlich und ohne Waffen zu versammeln.“","ok":"Versammlungsfreiheit","fb":"Sich versammeln heißt: sich treffen, zum Beispiel zu einer Kundgebung."}],
  "hilfe":"Suche in jedem Auszug das wichtigste Wort, zum Beispiel „gleich“, „Meinung“ oder „versammeln“.",
  "ok":"Alles richtig. Die Grundrechte von 1848 waren für die damalige Zeit sehr fortschrittlich. Sie schützten die Bürger vor der Willkür des Staates.",
  "hint":"Die richtigen Auswahlen sind grün umrandet. Lies die anderen Auszüge noch einmal genau."},
 {"id":"wfragen","type":"sel","key":"quelle_wfragen","name":"Quellenarbeit Brief","tag":"Quellenarbeit",
  "titel":"Die W-Fragen an den Brief","wide":True,
  "frage":"Beantworte die Fragen an die Quelle.",
  "choices":["Friedrich Wilhelm IV., König von Preußen","Im Dezember 1848, während die Verfassung beraten wurde","Ein enger Vertrauter, nicht die Öffentlichkeit","Er wollte erklären, warum er eine Krone vom Parlament ablehnt","Die Abgeordneten in Frankfurt"],
  "rows":[{"t":"Wer hat den Brief geschrieben?","ok":"Friedrich Wilhelm IV., König von Preußen","fb":"Sieh in die Quellenangabe."},
          {"t":"Wann?","ok":"Im Dezember 1848, während die Verfassung beraten wurde","fb":"Das Datum steht in der Quellenangabe. Die Verfassung war damals noch nicht fertig."},
          {"t":"Für wen?","ok":"Ein enger Vertrauter, nicht die Öffentlichkeit","fb":"Bunsen war Freund und Gesandter des Königs. Der Brief war privat."},
          {"t":"Warum?","ok":"Er wollte erklären, warum er eine Krone vom Parlament ablehnt","fb":"Lies den letzten Satz der Quelle."}],
  "hilfe":"„Die Abgeordneten in Frankfurt“ passt zu keiner Frage. Der Brief ging nicht an sie.",
  "ok":"Gut gearbeitet. Weil der Brief privat war, zeigt er die ehrliche Meinung des Königs deutlicher als seine höfliche öffentliche Antwort an die Abgeordneten.",
  "hint":"Die richtigen Auswahlen sind grün umrandet."},
 {"id":"grund","type":"mc","key":"quelle_deutung","name":"Deutung des Briefs","tag":"Quellenkritik",
  "frage":"Warum lehnte Friedrich Wilhelm IV. die Krone ab? Was sagt die Quelle?",
  "opts":[{"v":"a","t":"Er glaubte, ein König erhält seine Macht nur von Gott. Eine Krone, die ein vom Volk gewähltes Parlament anbietet, war für ihn ein Zeichen der Revolution.","ok":True,"fb":"Genau. Das nennt man Gottesgnadentum. Hätte er die Krone angenommen, hätte er anerkannt, dass das Volk über die Macht entscheidet. Das wollte er auf keinen Fall."},
          {"v":"b","t":"Er fand die Krone zu klein und zu wenig wertvoll.","fb":"Es geht im Brief nicht um Gold oder Edelsteine. „Aus Dreck und Letten gebacken“ ist ein Bild: Für ihn war die Krone wertlos, weil sie vom Volk kam und nicht von Gott."},
          {"v":"c","t":"Er wollte lieber, dass Deutschland eine Republik wird.","fb":"Im Gegenteil. Der König war ein Gegner der Republik und der Revolution."}]},
 {"id":"darst","type":"mc","key":"quelle_darstellung","name":"Quelle und Darstellung","tag":"Quelle oder Darstellung?",
  "frage":"Welche Aussage über Quelle und Darstellung trifft hier zu?",
  "opts":[{"v":"a","t":"Der Brief von 1848 ist eine Quelle. Der Text „Gegenrevolution“ unten auf dieser Seite ist eine Darstellung, die heute Ereignisse erklärt und ordnet.","ok":True,"fb":"Richtig. Eine Darstellung entsteht später und fasst viele Quellen zusammen. Eine Quelle zeigt die Sicht eines Menschen aus der Zeit selbst, hier die eines Königs."},
          {"v":"b","t":"Der Brief ist eine Darstellung, weil der König seine Meinung darstellt.","fb":"Im Alltag sagt man so. In Geschichte meint „Darstellung“ aber einen später entstandenen Text über die Vergangenheit. Der Brief stammt aus der Zeit selbst."},
          {"v":"c","t":"Eine Quelle ist immer neutral, deshalb zeigt der Brief die ganze Wahrheit über 1848.","fb":"Quellen sind nie neutral. Der Brief zeigt die Sicht des Königs, nicht die Sicht der Revolutionäre."}]},
 {"id":"gruende","type":"multi","key":"ursachen_scheitern","name":"Gründe des Scheiterns","tag":"Ursachen",
  "frage":"Welche Gründe trugen zum Scheitern der Revolution bei? Wähle alle zutreffenden aus.",
  "opts":[{"v":"heer","t":"Die Nationalversammlung hatte kein eigenes Heer. Die Soldaten gehorchten weiter den Fürsten.","ok":True},
          {"v":"uneinig","t":"Die Revolutionäre waren uneinig: Monarchie oder Republik, mit oder ohne Österreich.","ok":True},
          {"v":"krone","t":"Der preußische König lehnte die Kaiserkrone ab, Preußen und Österreich erkannten die Verfassung nicht an.","ok":True},
          {"v":"zeit","t":"Die Beratungen dauerten lange. Die Fürsten gewannen Zeit, ihre Macht zurückzuholen.","ok":True},
          {"v":"frankreich","t":"Frankreich griff Deutschland 1849 an und beendete die Revolution.","fb":"Einen solchen Krieg gab es nicht. Die Revolution wurde von deutschen Truppen niedergeschlagen, vor allem von preußischen."},
          {"v":"keine","t":"Die Abgeordneten wollten gar keine Verfassung.","fb":"Doch. Die Nationalversammlung hat eine vollständige Verfassung mit Grundrechten beschlossen."}],
  "hilfe":"Frage dich bei jeder Aussage: Wer hatte am Ende die Macht, die Abgeordneten oder die Fürsten mit ihren Soldaten?",
  "ok":"Richtig. Mehrere Ursachen wirkten zusammen. Die wichtigste: Die alten Mächte behielten das Militär. Deshalb konnten sie die Revolution beenden, sobald die erste Überraschung vorbei war.",
  "hint":"Es gibt vier richtige Antworten."},
 {"id":"bismarck","type":"frei","key":"weiterdenken_bismarck","name":"Weiterdenken Bismarck","tag":"Weiterdenken · Zweite Quelle",
  "vorspann":'<div class="akte"><span class="stamp">Zweite Quelle</span><p><strong>Otto von Bismarck, Rede vor der Budgetkommission des preußischen Abgeordnetenhauses</strong>, 30. September 1862:</p><div class="zitat"><p>„Nicht durch Reden oder Majoritätsbeschlüsse werden die großen Fragen der Zeit entschieden […], sondern durch Eisen und Blut.“</p></div><p class="hint">Majoritätsbeschlüsse = Mehrheitsentscheidungen. In der ausgelassenen Stelle nennt Bismarck diesen Weg „den großen Fehler von 1848 und 1849“.</p></div>',
  "frage":"Was hielt Bismarck für den Fehler von 1848? Stimmst du ihm zu? Begründe deine Meinung mit einem Argument aus diesem Modul.",
  "platz":"Bismarck meinte, dass ... Ich finde ..., weil ...",
  "min":60,"kurz":"Deine Antwort ist noch sehr kurz. Erkläre zuerst Bismarcks Meinung und dann deine eigene mit einem Grund.",
  "gruppen":[{"w":["parlament","rede","mehrheit","abstimm","beschluss","verhandl","diskut"],"tipp":"Erkläre, was Bismarck mit Reden und Mehrheitsbeschlüssen meinte."},
             {"w":["militar","heer","soldat","gewalt","krieg","eisen","macht","armee"],"tipp":"Nenne, was nach Bismarck stattdessen entscheidet."},
             {"w":["grundrecht","verfassung","heute","grundgesetz","demokrat","friedlich","freiheit"],"tipp":"Bringe ein Gegenargument aus dem Modul, zum Beispiel was von 1848 bis heute weiterwirkt."}],
  "gut":"Sehr gut abgewogen. Bismarck hatte recht damit, dass 1849 die Gewalt siegte. Aber die Ideen von 1848, besonders die Grundrechte, wirkten weiter und stehen heute im Grundgesetz."},
]

M = {
 "nr":"009","titel":"Warum scheiterte die Revolution von 1848/49?","bereich":BEREICH,
 "hero":"Im März 1848 schien alles möglich: Pressefreiheit, ein Parlament für ganz Deutschland, Grundrechte für alle. Ein Jahr später war die Revolution vorbei. Du untersuchst, was die Menschen erreichten und warum sie am Ende scheiterten.",
 "ziele":["Du nennst die Märzforderungen und ordnest sie verschiedenen Gruppen zu.",
          "Du beschreibst den Verlauf der Revolution von 1848 bis 1849.",
          "Du erklärst die Verfassung der Paulskirche und die Grundrechte.",
          "Du wertest einen Brief des preußischen Königs als Quelle aus.",
          "Du begründest, warum die Revolution scheiterte."],
 "mission":'''<div class="akte">
 <span class="stamp">Akte 009</span>
 <p><strong>Fall:</strong> In Chronos' Archiv liegt eine Akte mit der Aufschrift „Revolution 1848/49: gescheitert“. Darunter hat jemand mit Bleistift geschrieben: „Wirklich? Und warum?“</p>
 <p><strong>Dein Auftrag:</strong> Finde heraus, was die Revolution wollte, was sie erreichte und woran sie scheiterte. Am Ende prüfst du Chronos' Karteikarte.</p>
</div>''' + chronos("Ich habe es mir leicht gemacht und auf meine Karte geschrieben: „Die Revolution scheiterte nur, weil ein König keine Lust auf die Krone hatte.“ Klingt griffig, oder? Aber Geschichte ist selten so einfach. Sieh genau hin, wer am Ende die Soldaten hatte."),
 "dtext":"Was ist für dich eine Revolution? Schreibe ein oder zwei Gedanken auf.",
 "inhalt":inhalt,
 "nav":[("maerz","Märzforderungen"),("verlauf","Verlauf"),("paulskirche","Paulskirche"),("grundrechte","Grundrechte"),("quelle","Die Quelle"),("scheitern","Gegenrevolution")],
 "glossar":[("Revolution","Ein schneller, grundlegender Umsturz der politischen Ordnung, oft gegen den Willen der bisherigen Herrscher."),
            ("Märzforderungen","Forderungen vom März 1848, zum Beispiel Pressefreiheit, Schwurgerichte und ein deutsches Parlament."),
            ("Nationalversammlung","Das 1848 gewählte Parlament in der Frankfurter Paulskirche. Es sollte eine Verfassung für ganz Deutschland ausarbeiten."),
            ("Grundrechte","Rechte, die jeder Mensch gegenüber dem Staat hat, zum Beispiel Meinungs- oder Glaubensfreiheit."),
            ("Konstitutionelle Monarchie","Ein Staat mit einem König oder Kaiser, der an eine Verfassung gebunden ist."),
            ("Gottesgnadentum","Die Vorstellung, dass ein König seine Macht direkt von Gott erhält und nicht vom Volk."),
            ("Großdeutsche und kleindeutsche Lösung","Großdeutsch: ein deutscher Staat mit Österreich. Kleindeutsch: ohne Österreich, mit Preußen an der Spitze."),
            ("Gegenrevolution","Die alten Mächte holen sich ihre Macht zurück und beenden eine Revolution, oft mit Gewalt.")],
 "karte":"Die Revolution scheiterte nur, weil ein König keine Lust auf die Krone hatte.",
 "a1frage":"Wie entscheidest du über die Karteikarte?",
 "a2frage":"Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, warum die Revolution von 1848/49 scheiterte. Nenne mindestens zwei Gründe und auch etwas, das trotzdem erreicht wurde.",
 "a2platz":"Lieber Chronos, deine Karte ist zu einfach, weil ...",
 "a2satz":"„Ein wichtiger Grund war ...“ · „Außerdem ...“ · „Deshalb konnten die Fürsten ...“ · „Trotzdem hat die Revolution erreicht, dass ...“",
 "data":{
  "tasks":tasks,
  "badges":[{"n":"Zeitkenner","ids":["verlauf"]},{"n":"Verfassungskenner","ids":["hot","rechte"]},{"n":"Quellenprüfer","ids":["wfragen","grund"]},{"n":"Begründer","ids":["a2"]}],
  "diag":[{"tag":"Schätzfrage","frage":"Wo tagte 1848 das erste gesamtdeutsche Parlament?","opts":[{"v":"a","t":"In der Paulskirche in Frankfurt am Main"},{"v":"b","t":"Im Reichstag in Berlin"},{"v":"c","t":"Im Rathaus von Hannover"}],"ok":"a","tipp":"Vorab: Das Parlament tagte in einer Kirche in Frankfurt."},
          {"tag":"Richtig oder falsch","frage":"1848 durften in Deutschland auch Frauen wählen.","opts":[{"v":"r","t":"Das stimmt"},{"v":"f","t":"Das stimmt nicht"}],"ok":"f","tipp":"Frauen durften 1848 nicht wählen. Das Frauenwahlrecht kam in Deutschland erst 1918."},
          {"tag":"Vermutung","frage":"Was vermutest du: Warum könnte eine Revolution scheitern?","opts":[{"v":"a","t":"Weil die alten Herrscher noch Soldaten und Macht haben"},{"v":"b","t":"Weil das Wetter schlecht ist"},{"v":"c","t":"Weil niemand etwas ändern will"}],"ok":"a"}],
  "a1":[{"v":"ok","t":"Die Karte stimmt. Ohne die Ablehnung der Krone hätte die Revolution gesiegt.","ok":False,"fb":"Die Ablehnung war wichtig, aber nicht der einzige Grund. Denk an das fehlende Heer, die Uneinigkeit und die Gegenrevolution mit preußischen Truppen."},
         {"v":"teil","t":"Die Karte ist zu einfach. Die Ablehnung der Krone war ein wichtiger Grund, aber dazu kamen fehlende Macht, Uneinigkeit und die Gegenrevolution.","ok":True,"fb":"Mehrere Ursachen wirkten zusammen. Der König konnte nur Nein sagen, weil die Fürsten das Militär behalten hatten."},
         {"v":"falsch","t":"Die Karte ist falsch. Die Revolution ist gar nicht gescheitert.","ok":False,"fb":"Ihr wichtigstes Ziel, ein geeintes Deutschland mit Verfassung, wurde 1849 nicht erreicht. Richtig ist aber: Ideen wie die Grundrechte wirkten weiter."}],
  "a2":{"start":"Beginne mit: „Ein wichtiger Grund war ...“",
        "fach":[["nationalversammlung","Nationalversammlung"],["paulskirche","Paulskirche"],["grundrecht","Grundrechte"],["verfassung","Verfassung"],["gegenrevolution","Gegenrevolution"],["gottesgnaden","Gottesgnadentum"],["von gottes gnaden","Gottesgnadentum"],["kleindeutsch","kleindeutsche Lösung"],["grossdeutsch","großdeutsche Lösung"],["kaiserkrone","Kaiserkrone"],["revolution","Revolution"],["militar","Militär"],["furst","Fürsten"]],
        "fachTipp":"Nationalversammlung, Grundrechte, Gegenrevolution oder Gottesgnadentum",
        "themen":[{"w":["heer","militar","soldat","truppe","armee","gewalt","niedergeschlagen","gegenrevolution","macht"],"gut":"Du erklärst die Rolle von Macht und Militär.","tipp":"Erkläre, wer die Soldaten hatte und was das bedeutete."},
                  {"w":["krone","kaiser","friedrich wilhelm","konig","abgelehnt","ablehn"],"gut":"Du nennst die Ablehnung der Kaiserkrone.","tipp":"Nenne auch die Ablehnung der Kaiserkrone durch Friedrich Wilhelm IV."},
                  {"w":["grundrecht","verfassung","erreicht","trotzdem","weiter","grundgesetz","heute"],"gut":"Du nennst auch, was erreicht wurde oder weiterwirkte.","tipp":"Nenne etwas, das trotzdem erreicht wurde, zum Beispiel die Grundrechte."}],
        "voll":"Sehr gut. Du erklärst das Scheitern mit mehreren Ursachen und zeigst, dass 1848 trotzdem Spuren hinterlassen hat."},
  "lc":["Ich kann die Ziele und den Verlauf der Revolution von 1848/49 beschreiben.",
        "Ich kann erklären, warum Friedrich Wilhelm IV. die Kaiserkrone ablehnte.",
        "Ich kann mehrere Gründe für das Scheitern der Revolution nennen und gewichten."],
  "komp":{"fachwissen":["hot","rechte"],"zeit_raum":["verlauf"],"quellenarbeit":["wfragen","grund"],"ursachen_folgen":["gruende"],"perspektivitaet":["zuord","kaiserfrage"]},
  "next":"Weiter geht es mit Modul 010: Wie entstand 1871 das Deutsche Kaiserreich?"
 }
}

if __name__ == "__main__":
    build(M)
