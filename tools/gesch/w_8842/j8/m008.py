import sys; sys.path.insert(0, '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/gesch/w_8842/j8')
from eng8 import build, chronos, task

BEREICH = "Nation und politische Teilhabe"

MISSION_SVG = '''<div class="svgwrap"><svg class="bild" viewBox="0 0 640 230" role="img" aria-label="Schematische Szene: Ein Fuhrwerk fährt auf einer Straße aus dem Königreich Hannover, zu dem das Emsland gehört, zur Grenze des Königreichs Preußen. An der Grenze stehen ein Schlagbaum und ein Zollhaus.">
 <rect width="640" height="230" fill="#f7f8fa"/>
 <rect x="0" y="0" width="300" height="230" fill="#eef2e6"/>
 <rect x="340" y="0" width="300" height="230" fill="#eae8f1"/>
 <path d="M320 0 V230" stroke="#9b352d" stroke-width="3" stroke-dasharray="9 7"/>
 <rect x="0" y="150" width="640" height="34" fill="#d8cdb8"/>
 <text x="16" y="34" font-size="24" font-weight="700" fill="#24384a">Kgr. Hannover</text>
 <text x="16" y="62" font-size="20" fill="#3a4855">mit Rhede im Emsland</text>
 <text x="356" y="34" font-size="24" font-weight="700" fill="#24384a">Kgr. Preußen</text>
 <text x="356" y="62" font-size="20" fill="#3a4855">mit Münster</text>
 <g transform="translate(70,112)"><rect x="0" y="0" width="92" height="40" rx="5" fill="#a77b4f" stroke="#6b4a2b" stroke-width="2"/><path d="M6 0 q40 -30 80 0" fill="#efe6d4" stroke="#8a7d63" stroke-width="2"/><circle cx="20" cy="44" r="11" fill="#5c4632"/><circle cx="74" cy="44" r="11" fill="#5c4632"/><path d="M92 22 h34" stroke="#6b4a2b" stroke-width="4"/><g fill="#7a5a3a" stroke="#5a3f27" stroke-width="1.5"><ellipse cx="152" cy="20" rx="26" ry="11"/><path d="M170 14 L184 -6 L192 -2 L180 20 Z"/><ellipse cx="192" cy="-4" rx="10" ry="6" transform="rotate(25 192 -4)"/></g><path d="M134 28 v20 M142 28 v20 M162 28 v20 M170 28 v20" stroke="#5a3f27" stroke-width="4"/><path d="M127 18 q-8 6 -6 16" stroke="#5a3f27" stroke-width="3" fill="none"/></g>
 <rect x="268" y="96" width="38" height="54" fill="#cfc4ad" stroke="#6f675c" stroke-width="2"/><path d="M262 96 l25 -20 l25 20 z" fill="#9c3b33"/>
 <text x="287" y="130" font-size="15" text-anchor="middle" fill="#24384a" font-weight="700">Zoll</text>
 <rect x="312" y="128" width="8" height="34" fill="#55606a"/>
 <path d="M316 132 L420 132" stroke="#9b352d" stroke-width="7"/><path d="M336 132 h14 M364 132 h14 M392 132 h14" stroke="#ffffff" stroke-width="7"/>
 <text x="490" y="215" font-size="16" fill="#55606a" text-anchor="middle">schematisch, nicht maßstabsgetreu</text>
</svg></div>'''

HAMBACH_SVG = '''<div class="svgwrap"><svg class="bild" viewBox="0 0 640 360" role="img" aria-label="Schematische Zeichnung des Hambacher Festes 1832: eine Burgruine auf einem Hügel, eine große Menschenmenge, ein Redner auf einem Podest und mehrere Fahnen. Die Bereiche sind antippbar.">
 <rect width="640" height="360" fill="#f3f6f9"/>
 <path d="M0 250 Q160 150 330 160 Q500 170 640 240 V360 H0 Z" fill="#dde6d4"/>
 <g class="hot" data-task="hot" id="h008Schloss" tabindex="0" role="button" aria-label="Burgruine auf dem Hügel">
  <rect x="270" y="88" width="120" height="72" fill="#c9bea9" stroke="#6f675c" stroke-width="3"/>
  <rect x="250" y="62" width="34" height="98" fill="#bfb39c" stroke="#6f675c" stroke-width="3"/>
  <path d="M250 62 h8 v-8 h9 v8 h8 v-8 h9 v8" fill="none" stroke="#6f675c" stroke-width="3"/>
  <rect x="300" y="110" width="14" height="22" fill="#55606a"/><rect x="340" y="110" width="14" height="22" fill="#55606a"/>
 </g>
 <g class="hot" data-task="hot" id="h008Fahne" tabindex="0" role="button" aria-label="Große dreifarbige Fahne mit Aufschrift">
  <rect x="404" y="40" width="5" height="122" fill="#5c4632"/>
  <rect x="409" y="42" width="150" height="20" fill="#1c1c1c"/>
  <rect x="409" y="62" width="150" height="20" fill="#b3261e"/>
  <rect x="409" y="82" width="150" height="20" fill="#e2b33b"/>
  <text x="484" y="76" font-size="10.5" text-anchor="middle" fill="#fff" font-weight="700">Deutschlands Wiedergeburt</text>
  <rect x="400" y="36" width="164" height="128" fill="#000" opacity="0"/>
 </g>
 <g class="hot" data-task="hot" id="h008Polen" tabindex="0" role="button" aria-label="Kleinere zweifarbige Fahne in Weiß und Rot">
  <rect x="164" y="128" width="4" height="86" fill="#5c4632"/>
  <rect x="168" y="130" width="58" height="16" fill="#ffffff" stroke="#999" stroke-width="1"/>
  <rect x="168" y="146" width="58" height="16" fill="#c8102e"/>
  <rect x="156" y="122" width="78" height="96" fill="#000" opacity="0"/>
 </g>
 <g class="hot" data-task="hot" id="h008Redner" tabindex="0" role="button" aria-label="Redner auf einem Podest">
  <rect x="440" y="196" width="76" height="38" fill="#a77b4f" stroke="#6b4a2b" stroke-width="2"/>
  <circle cx="478" cy="160" r="11" fill="#37546b"/>
  <path d="M462 196 q16 -34 32 0 z" fill="#37546b"/>
  <path d="M490 178 l22 -18" stroke="#37546b" stroke-width="6" stroke-linecap="round"/>
  <rect x="436" y="144" width="86" height="94" fill="#000" opacity="0"/>
 </g>
 <g class="hot" data-task="hot" id="h008Menge" tabindex="0" role="button" aria-label="Große Menschenmenge">
  <rect x="30" y="236" width="400" height="104" fill="#000" opacity="0"/>
  <g fill="#55606a">
   <circle cx="50" cy="262" r="9"/><circle cx="80" cy="256" r="9"/><circle cx="110" cy="264" r="9"/><circle cx="140" cy="254" r="9"/><circle cx="170" cy="262" r="9"/><circle cx="200" cy="256" r="9"/><circle cx="230" cy="264" r="9"/><circle cx="260" cy="254" r="9"/><circle cx="290" cy="262" r="9"/><circle cx="320" cy="256" r="9"/><circle cx="350" cy="264" r="9"/><circle cx="380" cy="256" r="9"/><circle cx="410" cy="262" r="9"/>
   <circle cx="64" cy="296" r="10"/><circle cx="96" cy="290" r="10"/><circle cx="128" cy="298" r="10"/><circle cx="160" cy="290" r="10"/><circle cx="192" cy="298" r="10"/><circle cx="224" cy="290" r="10"/><circle cx="256" cy="298" r="10"/><circle cx="288" cy="290" r="10"/><circle cx="320" cy="298" r="10"/><circle cx="352" cy="290" r="10"/><circle cx="384" cy="298" r="10"/>
  </g>
  <g fill="#7f8b96"><rect x="40" y="270" width="380" height="14" rx="7"/><rect x="50" y="306" width="350" height="16" rx="8"/></g>
 </g>
 <text x="630" y="350" font-size="17" text-anchor="end" fill="#55606a">Eigene Zeichnung, keine historische Abbildung</text>
</svg></div>'''

ZEIT_SVG = '''<div class="svgwrap"><svg class="bild" viewBox="0 0 640 140" role="img" aria-label="Zeitstrahl von 1810 bis 1850 mit Markierungen in den Jahren 1815, 1817, 1819, 1832, 1837 und 1841">
 <rect width="640" height="140" fill="#f7f8fa"/>
 <path d="M30 80 H612" stroke="#37546b" stroke-width="4"/><path d="M612 72 l14 8 l-14 8 z" fill="#37546b"/>
 <g font-size="20" fill="#24384a" text-anchor="middle">
  <path d="M40 72 v16 M180 72 v16 M320 72 v16 M460 72 v16 M600 72 v16" stroke="#37546b" stroke-width="2"/>
  <text x="40" y="118">1810</text><text x="180" y="118">1820</text><text x="320" y="118">1830</text><text x="460" y="118">1840</text><text x="600" y="118">1850</text>
 </g>
 <g fill="#aa6d18"><circle cx="110" cy="80" r="7"/><circle cx="138" cy="80" r="7"/><circle cx="166" cy="80" r="7"/><circle cx="348" cy="80" r="7"/><circle cx="418" cy="80" r="7"/><circle cx="474" cy="80" r="7"/></g>
 <g font-size="17" fill="#3a4855" text-anchor="middle"><path d="M110 73 V56 M138 73 V30 M166 73 V56" stroke="#aa6d18" stroke-width="1.5"/><text x="96" y="50">1815</text><text x="138" y="22">1817</text><text x="184" y="50">1819</text><text x="348" y="56">1832</text><text x="418" y="56">1837</text><text x="478" y="56">1841</text></g>
</svg></div>'''

inhalt = '''
<section class="card" id="ordnung">
<h2>Europa nach Napoleon: Wer will was?</h2>
<p>1814 und 1815 trafen sich Kaiser, Könige und ihre Minister in Wien zum <strong>Wiener Kongress</strong>. Nach den Kriegen gegen Napoleon ordneten sie Europa neu. Statt eines deutschen Staates entstand der <strong>Deutsche Bund</strong>: ein lockerer Zusammenschluss von fast 40 Staaten, jeder mit eigenem Fürsten, eigenen Gesetzen und eigenen Münzen. Die Fürsten wollten die alte Ordnung wiederherstellen. Man nennt das <strong>Restauration</strong>.</p>
<p>Viele Menschen waren enttäuscht. Sie hatten in den Befreiungskriegen gegen Napoleon gekämpft und gehofft, dass danach ein gemeinsames Deutschland mit mehr Rechten für die Bürger entsteht. Diese Menschen bildeten die <strong>Nationalbewegung</strong>. Ihr Motto lässt sich in zwei Wörtern sagen: <strong>Einheit und Freiheit</strong>.</p>
''' + task('zuord') + '''
</section>

<section class="card" id="kette">
<h2>Vom Kriegsende bis zur Zensur</h2>
<p>Ereignisse hängen zusammen. Das eine löst das andere aus. Bringe die Kette in die richtige Reihenfolge.</p>
''' + task('kette') + '''
<div class="notice"><strong>Wartburgfest 1817:</strong> Am 18. Oktober 1817 trafen sich mehr als 500 Studenten auf der Wartburg bei Eisenach. Sie erinnerten an 300 Jahre Reformation und an den Sieg über Napoleon bei Leipzig 1813. Am Abend verbrannten einige von ihnen Bücher und Gegenstände, die für die alte Ordnung standen, zum Beispiel einen Zopf und einen Korporalstock. Die Studenten waren in <strong>Burschenschaften</strong> organisiert.</div>
</section>

<section class="card" id="hambach">
<h2>Das Hambacher Fest 1832</h2>
<p>Am 27. Mai 1832 zogen 20.000 bis 30.000 Menschen zur Schlossruine bei Hambach in der Pfalz. Es war die bis dahin größte politische Versammlung in Deutschland. Die Veranstalter hatten mit etwa 1.000 Gästen gerechnet. Es kamen Handwerker, Bauern, Studenten, Frauen und Männer, dazu Gäste aus Frankreich und Polen.</p>
''' + HAMBACH_SVG + '''
''' + task('hot') + '''
<details class="gloss"><summary>Woher kommen die Farben Schwarz, Rot und Gold?</summary><div class="body">Im Krieg gegen Napoleon trugen Freiwillige des Lützowschen Freikorps schwarze Uniformen mit roten Aufschlägen und goldfarbenen Knöpfen. Die Burschenschaften übernahmen diese Farben. Spätestens seit dem Hambacher Fest 1832 standen Schwarz, Rot und Gold für Einheit und Freiheit. Heute sind es die Farben der Bundesrepublik Deutschland.</div></details>
</section>

<section class="card" id="zeitleiste">
<h2>Die Zeitleiste der Nationalbewegung</h2>
<p>Ordne jedem Ereignis das passende Jahr zu. Der Zeitstrahl hilft dir beim Überblick.</p>
''' + ZEIT_SVG + '''
''' + task('jahre') + '''
<div class="notice warn"><strong>Ganz in der Nähe:</strong> Das Emsland gehörte seit 1815 zum Königreich Hannover. 1837 hob König Ernst August von Hannover die Verfassung des Landes auf. Sieben Professoren der Universität Göttingen protestierten dagegen, darunter die Brüder Jacob und Wilhelm Grimm. Der König entließ alle sieben, drei mussten das Land verlassen. Die <strong>Göttinger Sieben</strong> wurden in ganz Deutschland bewundert.</div>
</section>

<section class="card" id="begriff">
<h2>Was ist eigentlich eine Nation?</h2>
<p>Das Wort „Nation“ klingt einfach. Im 19. Jahrhundert steckte darin politischer Sprengstoff. Vervollständige den Merktext.</p>
''' + task('luecke') + '''
</section>

<section class="card" id="quelle">
<h2>Die Quelle: ein Lied von 1841</h2>
<p>Lieder waren im 19. Jahrhundert ein wichtiges Mittel, um Gedanken zu verbreiten. Man konnte sie auswendig lernen, auf Festen singen und weitergeben, auch wenn Zeitungen zensiert wurden.</p>
<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>August Heinrich Hoffmann von Fallersleben, „Das Lied der Deutschen“</strong>, geschrieben am 26. August 1841 auf Helgoland, erster Druck am 1. September 1841 in Hamburg. Melodie: Joseph Haydn. Rechtschreibung leicht angepasst.</p>
 <div class="zitat"><p><em>Aus der 1. Strophe:</em><br>„Deutschland, Deutschland über alles,<br>Über alles in der Welt,<br>Wenn es stets zu Schutz und Trutze<br>Brüderlich zusammenhält,<br>Von der Maas bis an die Memel,<br>Von der Etsch bis an den Belt.“</p>
 <p><em>3. Strophe:</em><br>„Einigkeit und Recht und Freiheit<br>Für das deutsche Vaterland!<br>Danach lasst uns alle streben<br>Brüderlich mit Herz und Hand!<br>Einigkeit und Recht und Freiheit<br>Sind des Glückes Unterpfand.<br>Blüh im Glanze dieses Glückes,<br>Blühe, deutsches Vaterland!“</p></div>
</div>
''' + chronos("Ein Lied ist eine Quelle wie ein Brief. Frage also: Wer hat es geschrieben, wann, für wen und warum? Und achte darauf: Wörter können ihre Bedeutung verändern, wenn Menschen sie später anders benutzen.") + '''
''' + task('wfragen') + '''
''' + task('ueberalles') + '''
<div class="notice warn"><strong>Gut zu wissen:</strong> Viele Regierungen unterdrückten das Lied, in Preußen, Hannover und Österreich fiel es der Zensur zum Opfer. 1922 wurde es Nationalhymne der Weimarer Republik. In der NS-Zeit wurde nur die erste Strophe gesungen und als Anspruch auf Macht über andere verstanden. Seit 1952 ist die dritte Strophe die Nationalhymne der Bundesrepublik.</div>
<div class="akte">
 <span class="stamp">Zweite Quelle</span>
 <p><strong>Johann Georg August Wirth, Rede auf dem Hambacher Fest</strong>, 27. Mai 1832. In seiner Rede rief er:</p>
 <div class="zitat"><p>„Hoch! Dreimal hoch leben die vereinigten Freistaaten Deutschlands!“</p></div>
 <p class="hint">Ein Freistaat ist ein Staat ohne König oder Fürsten, also eine Republik.</p>
</div>
''' + task('wirth') + '''
''' + task('darst') + '''
''' + task('hymne', 'weiter') + '''
</section>
'''

tasks = [
 {"id":"zuord","type":"zuord","key":"perspektiven","name":"Fürsten und Nationalbewegung","tag":"Perspektivwechsel",
  "titel":"Wer wollte was?",
  "frage":"Ordne jede Karte zu: Passt sie zu den Fürsten nach 1815 oder zur Nationalbewegung?",
  "zones":[{"id":"fuersten","t":"Fürsten und Regierungen"},{"id":"nation","t":"Nationalbewegung"}],
  "cards":[{"id":"c1","t":"Die alte Ordnung soll wiederhergestellt werden","z":"fuersten"},
           {"id":"c2","t":"Jeder Staat behält seinen eigenen Herrscher","z":"fuersten"},
           {"id":"c3","t":"Zeitungen werden vor dem Druck kontrolliert","z":"fuersten"},
           {"id":"c4","t":"Studenten werden überwacht","z":"fuersten"},
           {"id":"c5","t":"Ein gemeinsamer Staat für alle Deutschen","z":"nation"},
           {"id":"c6","t":"Eine Verfassung, die Rechte der Bürger festschreibt","z":"nation"},
           {"id":"c7","t":"Freie Meinung und freie Presse","z":"nation"},
           {"id":"c8","t":"Fahnen in Schwarz, Rot und Gold","z":"nation"}],
  "hilfe":"Frage bei jeder Karte: Wer hat davon einen Vorteil? Wer seine Macht behalten will, ist gegen Veränderungen. Wer mehr Rechte will, fordert sie.",
  "ok":"Alle richtig. Du siehst den Gegensatz: Die Fürsten wollten ihre Macht sichern. Die Nationalbewegung wollte Einheit und Freiheit. Für die Fürsten war das gefährlich, denn ein deutscher Nationalstaat hätte viele Throne überflüssig gemacht.",
  "hint":"Prüfe die rot markierten Karten: Geht es um Macht behalten und kontrollieren oder um Einheit und mehr Rechte?"},
 {"id":"kette","type":"order","key":"wirkungskette","name":"Wirkungskette 1813 bis 1819","tag":"Ursache und Folge",
  "titel":"Eine Kette von Ursachen und Folgen",
  "frage":"Bringe die fünf Schritte in die richtige Reihenfolge. Nutze die Pfeile.",
  "oben":"die erste Ursache.","unten":"die letzte Folge.",
  "items":["Napoleon beherrscht große Teile Deutschlands.",
           "In den Befreiungskriegen 1813 bis 1815 kämpfen Freiwillige aus vielen Staaten gemeinsam.",
           "Der Wiener Kongress schafft keinen deutschen Staat, sondern den Deutschen Bund.",
           "Enttäuschte Studenten fordern auf dem Wartburgfest 1817 Einheit und Freiheit.",
           "Die Fürsten beschließen 1819 die Karlsbader Beschlüsse mit Zensur und Überwachung."],
  "hilfe":"Die Kette beginnt mit der fremden Herrschaft und endet mit der Antwort der Fürsten.",
  "ok":"Genau. Der gemeinsame Kampf gegen Napoleon weckte ein Gemeinschaftsgefühl. Der Wiener Kongress enttäuschte diese Hoffnung. Die Studenten protestierten, und die Fürsten antworteten mit Zensur. Das ist eine typische Ursache-Folge-Kette.",
  "hint":"Was kam zuerst: die Hoffnung, die Enttäuschung, der Protest oder die Strafe?"},
 {"id":"hot","type":"hot","key":"bildarbeit","name":"Hambacher Fest","tag":"Bildarbeit",
  "targets":[{"id":"h008Fahne","tipp":"Finde das Zeichen, das die Teilnehmer für Einheit und Freiheit mitbrachten. Es trägt eine Aufschrift.","ok":"Richtig. Die Fahne in Schwarz, Rot und Gold trug die Aufschrift „Deutschlands Wiedergeburt“. Eine solche Fahne aus Hambach ist bis heute erhalten."},
             {"id":"h008Redner","tipp":"Finde die Stelle, an der politische Forderungen laut ausgesprochen wurden.","ok":"Richtig. Rund 20 Reden wurden gehalten, unter anderem von Johann Georg August Wirth und Philipp Jakob Siebenpfeiffer."},
             {"id":"h008Polen","tipp":"Finde den Hinweis darauf, dass es nicht nur um Deutschland ging. Gesucht ist ein Zeichen einer anderen Nation.","ok":"Richtig. Die weiß-rote Fahne steht für Polen. Polen hatte 1830 und 1831 vergeblich gegen die russische Herrschaft gekämpft. Die Festgäste zeigten Solidarität: Freie Nationen sollten in Europa friedlich nebeneinander leben."}],
  "all":[{"id":"h008Schloss","name":"Burgruine"},{"id":"h008Fahne","name":"Große Fahne"},{"id":"h008Polen","name":"Kleine Fahne"},{"id":"h008Redner","name":"Redner"},{"id":"h008Menge","name":"Menschenmenge"}],
  "fertig":"Alle drei Stellen gefunden.",
  "ok":"Das Hambacher Fest zeigt: Nation bedeutete damals Einheit, Freiheit und ein friedliches Europa freier Völker. Die Fürsten sahen darin eine Gefahr und verboten danach politische Vereine und Versammlungen."},
 {"id":"jahre","type":"sel","key":"zeitleiste","name":"Zeitleiste","tag":"Zeitleiste",
  "titel":"Wann war das?",
  "frage":"Wähle zu jedem Ereignis das passende Jahr.",
  "choices":["1815","1817","1819","1832","1837","1841"],
  "rows":[{"t":"Wiener Kongress endet, der Deutsche Bund wird gegründet","ok":"1815","fb":"Der Wiener Kongress tagte 1814 und 1815."},
          {"t":"Wartburgfest der Burschenschaften","ok":"1817","fb":"300 Jahre nach Luthers Thesen von 1517."},
          {"t":"Karlsbader Beschlüsse: Zensur und Überwachung","ok":"1819","fb":"Zwei Jahre nach dem Wartburgfest."},
          {"t":"Hambacher Fest mit 20.000 bis 30.000 Menschen","ok":"1832","fb":"Das Fest fand im Mai statt, zwei Jahre nach der Revolution in Frankreich von 1830."},
          {"t":"Protest der Göttinger Sieben in Hannover","ok":"1837","fb":"Sieh im Kasten unter der Aufgabe nach."},
          {"t":"Hoffmann von Fallersleben schreibt „Das Lied der Deutschen“","ok":"1841","fb":"Das Lied ist die Quelle weiter unten."}],
  "hilfe":"Zwei Daten kannst du dir merken: Das Wartburgfest war 300 Jahre nach der Reformation 1517. Das Lied der Deutschen steht in der Quelle weiter unten.",
  "ok":"Alle Jahre stimmen. Du siehst: Die Nationalbewegung war über Jahrzehnte aktiv, obwohl die Fürsten sie immer wieder unterdrückten.",
  "hint":"Nutze die Hinweise unter den rot markierten Zeilen."},
 {"id":"luecke","type":"sel","key":"begriff_nation","name":"Begriff Nation","tag":"Lückentext",
  "titel":"Merktext Nation",
  "frage":"Wähle in jeder Lücke das passende Wort.",
  "text":"Eine Nation ist eine große Gruppe von Menschen, die sich durch eine gemeinsame {}, Geschichte und Kultur verbunden fühlt. Die Nationalbewegung wollte für diese Menschen einen gemeinsamen {}. Er sollte eine {} haben, die die Rechte der Bürger schützt. Weil die Bewegung Einheit und {} zugleich forderte, sahen die Fürsten in ihr eine {} für ihre Macht.",
  "gaps":[{"opts":["Sprache","Religion","Armee"],"ok":"Sprache"},
          {"opts":["König","Staat","Verein"],"ok":"Staat"},
          {"opts":["Verfassung","Burg","Kirche"],"ok":"Verfassung"},
          {"opts":["Ordnung","Freiheit","Zensur"],"ok":"Freiheit"},
          {"opts":["Hilfe","Gefahr","Freude"],"ok":"Gefahr"}],
  "hilfe":"Denke an das Motto der Nationalbewegung: Einheit und Freiheit.",
  "ok":"Richtig. Wichtig: Eine Nation ist eine Gemeinschaft, an die Menschen glauben. Ein Staat ist etwas anderes, nämlich ein Gebiet mit Regierung und Gesetzen. Die Nationalbewegung wollte beides zusammenbringen.",
  "hint":"Lies den ganzen Satz noch einmal laut. Passt das Wort zum Motto Einheit und Freiheit?"},
 {"id":"wfragen","type":"sel","key":"quelle_wfragen","name":"Quellenarbeit Lied","tag":"Quellenarbeit",
  "titel":"Die W-Fragen an die Quelle","wide":True,
  "frage":"Beantworte die Fragen an das Lied. Wähle jeweils die passende Antwort.",
  "choices":["Hoffmann von Fallersleben","1841, vor der Reichsgründung","Menschen in allen deutschen Staaten","Er wünschte sich Einheit und Freiheit","Ein Kaiser"],
  "rows":[{"t":"Wer hat das Lied geschrieben?","ok":"Hoffmann von Fallersleben","fb":"Der Name steht in der Quellenangabe."},
          {"t":"Wann ist es entstanden?","ok":"1841, vor der Reichsgründung","fb":"Achte auf das Datum in der Quellenangabe."},
          {"t":"Für wen war es gedacht?","ok":"Menschen in allen deutschen Staaten","fb":"Das Lied spricht von „uns allen“ und vom „deutschen Vaterland“, nicht von einem bestimmten Fürstenstaat."},
          {"t":"Warum hat er es geschrieben?","ok":"Er wünschte sich Einheit und Freiheit","fb":"Lies die dritte Strophe: Welche drei Wörter stehen am Anfang?"}],
  "hilfe":"Die Antworten auf „Wer“ und „Wann“ stehen in der Quellenangabe über dem Liedtext. „Warum“ findest du in der dritten Strophe.",
  "ok":"Gut gearbeitet. Das Lied stammt aus einer Zeit, in der es keinen deutschen Staat gab. Es drückt eine Sehnsucht aus, keine Wirklichkeit.",
  "hint":"Ein Hinweis: „Ein Kaiser“ passt zu keiner Frage. Im Lied kommt kein Kaiser vor."},
 {"id":"ueberalles","type":"mc","key":"quelle_deutung","name":"Deutung „über alles“","tag":"Quellenkritik",
  "frage":"Was meinte Hoffmann von Fallersleben 1841 mit „Deutschland über alles“ am wahrscheinlichsten?",
  "opts":[{"v":"a","t":"Ein geeintes Deutschland ist wichtiger als die vielen einzelnen Fürstenstaaten.","ok":True,"fb":"Richtig. 1841 richtete sich der Satz gegen die Zersplitterung in fast 40 Staaten. Wichtiger als Hannover, Bayern oder Preußen sollte das gemeinsame Vaterland sein. Später, besonders in der NS-Zeit, wurde der Satz als Herrschaftsanspruch über andere Völker missbraucht. Das zeigt: Man muss eine Quelle aus ihrer Zeit heraus verstehen."},
          {"v":"b","t":"Deutschland soll alle anderen Länder der Welt beherrschen.","fb":"So wurde die Zeile später verstanden, vor allem in der NS-Zeit. Für 1841 passt das nicht: Lies die dritte Strophe. Dort geht es um Einigkeit, Recht und Freiheit, nicht um Eroberung."},
          {"v":"c","t":"Der König von Preußen steht über allen Menschen.","fb":"Im Lied kommt kein König vor. Der Dichter wurde sogar 1842 als Professor in Breslau entlassen, weil seine Lieder den Regierungen zu politisch waren."}]},
 {"id":"wirth","type":"multi","key":"quelle_wirth","name":"Rede von Wirth","tag":"Zweite Quelle",
  "frage":"Welche Forderungen stecken in Wirths Ruf? Wähle alle zutreffenden aus.",
  "opts":[{"v":"einheit","t":"Die deutschen Staaten sollen sich vereinigen.","ok":True},
          {"v":"republik","t":"Deutschland soll ohne Fürsten regiert werden.","ok":True},
          {"v":"kaiser","t":"Ein Kaiser soll an die Spitze treten.","fb":"Ein Freistaat ist ausdrücklich ein Staat ohne Monarchen, also auch ohne Kaiser."},
          {"v":"krieg","t":"Deutschland soll gegen Frankreich Krieg führen.","fb":"Davon steht im Ruf nichts. Auf dem Fest waren sogar Gäste aus Frankreich."}],
  "hilfe":"Achte auf zwei Wörter: „vereinigten“ und „Freistaaten“.",
  "ok":"Richtig. Wirth wollte Einheit und eine Republik. Das war radikal: Er stellte die Herrschaft aller Fürsten in Frage. Nach dem Fest wurde er angeklagt und später zu einer Haftstrafe verurteilt.",
  "hint":"Lies den Hinweis unter dem Zitat noch einmal."},
 {"id":"darst","type":"mc","key":"quelle_darstellung","name":"Quelle und Darstellung","tag":"Quelle oder Darstellung?",
  "frage":"Der Text „Das Hambacher Fest 1832“ oben auf dieser Seite und das Lied von 1841: Was ist eine Quelle, was eine Darstellung?",
  "opts":[{"v":"a","t":"Das Lied ist eine Quelle, denn es stammt aus der Zeit selbst. Der Text über das Fest ist eine Darstellung, denn er wurde heute über die Vergangenheit geschrieben.","ok":True,"fb":"Genau. Quellen stammen aus der untersuchten Zeit. Darstellungen schreiben Menschen später, zum Beispiel Historikerinnen oder Schulbuchautoren. Auch die Zeichnung vom Fest ist eine Darstellung."},
          {"v":"b","t":"Beides sind Quellen, weil beide vom 19. Jahrhundert handeln.","fb":"Nicht ganz. Entscheidend ist nicht, wovon ein Text handelt, sondern wann und von wem er gemacht wurde."},
          {"v":"c","t":"Beides sind Darstellungen, weil man beides heute lesen kann.","fb":"Auch eine Quelle kann man heute lesen. Entscheidend ist, wann sie entstanden ist."}]},
 {"id":"hymne","type":"frei","key":"gegenwart_hymne","name":"Weiterdenken Hymne","tag":"Weiterdenken · Gegenwartsbezug",
  "frage":"Heute singt man bei Länderspielen nur die dritte Strophe. Erkläre, warum man sich 1952 so entschieden hat. Nutze dein Wissen über den Bedeutungswandel der ersten Strophe.",
  "platz":"Man singt nur die dritte Strophe, weil ...",
  "min":60,"kurz":"Deine Antwort ist noch sehr kurz. Erkläre zuerst, wie die erste Strophe in der NS-Zeit verstanden wurde, und dann, was die dritte Strophe ausdrückt.",
  "gruppen":[{"w":["ns","nationalsozial","hitler","missbrauch","erober","herrsch","macht"],"tipp":"Erkläre, wie die erste Strophe in der NS-Zeit benutzt wurde."},
             {"w":["einigkeit","recht","freiheit","demokrat"],"tipp":"Nenne, welche Werte die dritte Strophe ausdrückt."}],
  "gut":"Stark begründet. Du hast verstanden, dass ein Text seine Wirkung verändern kann, wenn er in eine neue Zeit gerät. Die dritte Strophe passt zu den Werten einer Demokratie."},
]

M = {
 "nr":"008","titel":"Was bedeutete Nation im 19. Jahrhundert?","bereich":BEREICH,
 "hero":"Nach 1815 gab es kein Deutschland als Staat, sondern fast 40 Einzelstaaten. Trotzdem sprachen immer mehr Menschen von einer deutschen Nation. Du findest heraus, was sie damit meinten, warum sie dafür sangen und feierten, und warum die Fürsten davor Angst hatten.",
 "ziele":["Du erklärst, was der Wiener Kongress und der Deutsche Bund für die Deutschen bedeuteten.",
          "Du beschreibst die Ziele der Nationalbewegung: Einheit und Freiheit.",
          "Du ordnest Wartburgfest, Hambacher Fest und weitere Ereignisse zeitlich ein.",
          "Du untersuchst ein Lied als historische Quelle und erkennst, dass sich Bedeutungen wandeln.",
          "Du unterscheidest Quelle und Darstellung."],
 "mission":'''<div class="akte">
 <span class="stamp">Akte 008</span>
 <p><strong>Fall:</strong> Im Jahr 1820 will ein Händler aus Rhede im Emsland Waren nach Münster bringen. Die Strecke ist nicht weit. Trotzdem überquert er eine Staatsgrenze. Rhede gehört zum Königreich Hannover, Münster zum Königreich Preußen. An der Grenze steht ein Zollhaus, auf der anderen Seite gelten andere Gesetze und andere Münzen.</p>
 <p><strong>Dein Auftrag:</strong> Damals träumten viele Menschen von einem gemeinsamen Deutschland. Finde heraus, was sie mit „Nation“ meinten. Am Ende prüfst du eine Karteikarte von Chronos.</p>
</div>''' + MISSION_SVG + chronos("Eine Staatsgrenze zwischen Rhede und Münster, wer hätte das gedacht? Ich habe auf meine Karteikarte geschrieben, dass Nation damals nur ein schönes Gefühl beim Singen war. Ob das stimmt? Prüf das für mich. Und sieh dir genau an, was die Leute auf ihren Festen gefordert haben."),
 "dtext":"Was verbindest du heute mit dem Wort „Nation“? Schreibe ein oder zwei Gedanken auf.",
 "inhalt":inhalt,
 "nav":[("ordnung","Wer will was?"),("kette","Ursache und Folge"),("hambach","Hambacher Fest"),("zeitleiste","Zeitleiste"),("begriff","Was ist Nation?"),("quelle","Die Quelle")],
 "glossar":[("Nation","Eine große Gruppe von Menschen, die sich durch Sprache, Geschichte und Kultur verbunden fühlt und oft einen eigenen Staat möchte."),
            ("Nationalbewegung","Menschen im 19. Jahrhundert, die einen gemeinsamen deutschen Staat mit Verfassung und Freiheitsrechten forderten. Ihr Motto: Einheit und Freiheit."),
            ("Wiener Kongress","Treffen der europäischen Herrscher und Diplomaten 1814 und 1815 in Wien. Dort wurde Europa nach Napoleon neu geordnet."),
            ("Deutscher Bund","Lockerer Bund von fast 40 deutschen Staaten ab 1815. Jeder Staat behielt seinen Fürsten. Es gab keine gemeinsame Regierung, die die Menschen wählen konnten."),
            ("Restauration","Wiederherstellung der alten Ordnung mit der Macht der Fürsten nach 1815."),
            ("Burschenschaft","Studentische Vereinigung, die nach 1815 für Einheit und Freiheit eintrat."),
            ("Zensur","Kontrolle von Zeitungen, Büchern und Liedern durch den Staat. Unerwünschte Texte wurden verboten."),
            ("Verfassung","Grundgesetz eines Staates. Es regelt, wer regiert und welche Rechte die Menschen haben.")],
 "karte":"Nation war im 19. Jahrhundert nur ein schönes Gefühl beim Singen. Mit Politik hatte das nichts zu tun.",
 "a1frage":"Wie entscheidest du über die Karteikarte?",
 "a2frage":"Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, was Nation für die Menschen im 19. Jahrhundert bedeutete. Nenne mindestens ein Ereignis oder eine Quelle als Beleg.",
 "a2platz":"Lieber Chronos, deine Karte muss ergänzt werden, weil ...",
 "a2satz":"„Für die Nationalbewegung bedeutete Nation ...“ · „Sie forderte Einheit, weil ...“ · „Außerdem wollte sie Freiheit, zum Beispiel ...“ · „Ein Beleg dafür ist ...“ · „Deshalb hatten die Fürsten Angst, denn ...“",
 "data":{
  "tasks":tasks,
  "badges":[{"n":"Spurenleser","ids":["hot"]},{"n":"Ordnungssinn","ids":["kette","jahre"]},{"n":"Quellenprüfer","ids":["wfragen","ueberalles"]},{"n":"Begründer","ids":["a2"]}],
  "diag":[{"tag":"Schätzfrage","frage":"Gab es 1820 einen deutschen Staat mit einer gemeinsamen Regierung?","opts":[{"v":"a","t":"Ja, mit einem Kaiser in Berlin"},{"v":"b","t":"Nein, es gab viele einzelne Staaten"},{"v":"c","t":"Ja, mit einem gewählten Parlament"}],"ok":"b","tipp":"Vorab: 1820 gab es fast 40 deutsche Staaten, aber keinen gemeinsamen Staat."},
          {"tag":"Richtig oder falsch","frage":"Die Farben Schwarz, Rot und Gold gibt es erst seit 1949.","opts":[{"v":"r","t":"Das stimmt"},{"v":"f","t":"Das stimmt nicht"}],"ok":"f","tipp":"Die Farben sind viel älter, du lernst ihre Herkunft kennen."},
          {"tag":"Vermutung","frage":"Was wünschten sich viele Menschen nach 1815 vor allem?","opts":[{"v":"a","t":"Einheit und mehr Freiheit"},{"v":"b","t":"Mehr Macht für die Fürsten"},{"v":"c","t":"Die Rückkehr Napoleons"}],"ok":"a"}],
  "a1":[{"v":"ok","t":"Die Karte stimmt. Es ging nur um Gefühle und Lieder.","ok":False,"fb":"Lieder und Feste waren wichtig. Aber denk an Wirths Ruf in Hambach und an die Karlsbader Beschlüsse: Wenn es nur um Gefühle gegangen wäre, hätten die Fürsten keine Zensur gebraucht."},
         {"v":"teil","t":"Die Karte stimmt nur zum Teil. Gefühl und Lieder gehörten dazu, aber Nation war zugleich eine politische Forderung nach Einheit und Freiheit.","ok":True,"fb":"Gefühl und Politik gehörten zusammen. Lieder, Fahnen und Feste machten politische Forderungen sichtbar und verbreiteten sie."},
         {"v":"falsch","t":"Die Karte ist falsch. Eine deutsche Nation gab es gar nicht, also auch kein Gefühl.","ok":False,"fb":"Einen deutschen Staat gab es nicht. Aber viele Menschen fühlten sich als Teil einer Nation. Genau deshalb forderten sie einen gemeinsamen Staat."}],
  "a2":{"start":"Beginne mit: „Für die Nationalbewegung bedeutete Nation ...“",
        "fach":[["nation","Nation"],["einheit","Einheit"],["freiheit","Freiheit"],["verfassung","Verfassung"],["deutscher bund","Deutscher Bund"],["wiener kongress","Wiener Kongress"],["zensur","Zensur"],["burschenschaft","Burschenschaft"],["furst","Fürsten"],["karlsbad","Karlsbader Beschlüsse"],["nationalbewegung","Nationalbewegung"]],
        "fachTipp":"Einheit, Freiheit, Verfassung, Deutscher Bund oder Zensur",
        "themen":[{"w":["einheit","einig","gemeinsam","vereinig","ein staat","einen staat"],"gut":"Du nennst die Forderung nach Einheit.","tipp":"Nenne die Forderung nach Einheit, also einem gemeinsamen Staat."},
                  {"w":["freiheit","verfassung","recht","pressefrei","meinung","mitbestimm","republik"],"gut":"Du nennst die Forderung nach Freiheit und Rechten.","tipp":"Nenne auch die Forderung nach Freiheit, zum Beispiel Verfassung oder freie Presse."},
                  {"w":["wartburg","hambach","lied","fallersleben","wirth","schwarz","1817","1832","1841","gottinger","karlsbad"],"gut":"Du belegst deine Aussage mit einem Ereignis oder einer Quelle.","tipp":"Belege deine Aussage mit einem Ereignis oder einer Quelle, zum Beispiel dem Hambacher Fest oder dem Lied von 1841."}],
        "voll":"Sehr gut begründet. Du zeigst, dass Nation im 19. Jahrhundert Gefühl und politisches Programm zugleich war."},
  "lc":["Ich kann erklären, was die Nationalbewegung mit Einheit und Freiheit meinte.",
        "Ich kann Wartburgfest, Hambacher Fest und das Lied der Deutschen zeitlich einordnen.",
        "Ich kann an einem Lied zeigen, dass man Quellen aus ihrer Zeit heraus verstehen muss."],
  "komp":{"fachwissen":["luecke"],"zeit_raum":["jahre"],"quellenarbeit":["wfragen","wirth"],"ursachen_folgen":["kette"],"perspektivitaet":["zuord","ueberalles"]},
  "next":"Weiter geht es mit Modul 009: Warum scheiterte die Revolution von 1848/49?"
 }
}

if __name__ == "__main__":
    build(M)
