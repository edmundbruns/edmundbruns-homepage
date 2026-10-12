import sys; sys.path.insert(0, '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/gesch/w_8842/j8')
from eng8 import build, chronos, task

BEREICH = "Nation und politische Teilhabe"

STRASSE_SVG = '''<div class="svgwrap"><svg class="bild" viewBox="0 0 640 380" role="img" aria-label="Schematische Straßenszene in einer deutschen Großstadt um 1900 mit Häusern, einer Straßenbahn, einem Auto, einem Pferdefuhrwerk, einer Litfaßsäule, Passanten und einem Offizier in Uniform. Die Bereiche sind antippbar.">
 <rect width="640" height="380" fill="#eef1f4"/>
 <g fill="#d8cdb8" stroke="#8a7d63" stroke-width="2"><rect x="0" y="30" width="150" height="200"/><rect x="150" y="60" width="170" height="170"/><rect x="320" y="20" width="160" height="210"/><rect x="480" y="50" width="160" height="180"/></g>
 <g fill="#6f8296"><rect x="20" y="60" width="26" height="36"/><rect x="62" y="60" width="26" height="36"/><rect x="104" y="60" width="26" height="36"/><rect x="20" y="130" width="26" height="36"/><rect x="62" y="130" width="26" height="36"/><rect x="104" y="130" width="26" height="36"/><rect x="172" y="90" width="26" height="36"/><rect x="222" y="90" width="26" height="36"/><rect x="272" y="90" width="26" height="36"/><rect x="342" y="50" width="26" height="36"/><rect x="390" y="50" width="26" height="36"/><rect x="438" y="50" width="26" height="36"/><rect x="342" y="120" width="26" height="36"/><rect x="390" y="120" width="26" height="36"/><rect x="438" y="120" width="26" height="36"/><rect x="502" y="80" width="26" height="36"/><rect x="550" y="80" width="26" height="36"/><rect x="598" y="80" width="26" height="36"/></g>
 <rect x="0" y="230" width="640" height="30" fill="#c9c2b4"/>
 <rect x="0" y="260" width="640" height="120" fill="#a9a196"/>
 <path d="M0 330 H640 M0 342 H640" stroke="#6e675d" stroke-width="3"/>
 <path d="M0 196 H640" stroke="#2b3a44" stroke-width="2"/>
 <g class="hot" data-task="hot" id="h012Bahn" tabindex="0" role="button" aria-label="Großes Fahrzeug auf Schienen mit Stange zur Leitung">
  <path d="M120 196 L150 250" stroke="#2b3a44" stroke-width="3"/>
  <rect x="60" y="250" width="200" height="78" rx="10" fill="#e2b33b" stroke="#7a5a12" stroke-width="3"/>
  <g fill="#f4f7fa" stroke="#7a5a12" stroke-width="2"><rect x="74" y="262" width="36" height="30"/><rect x="118" y="262" width="36" height="30"/><rect x="162" y="262" width="36" height="30"/><rect x="206" y="262" width="36" height="30"/></g>
  <circle cx="96" cy="332" r="9" fill="#2b2b2b"/><circle cx="224" cy="332" r="9" fill="#2b2b2b"/>
 </g>
 <g class="hot" data-task="hot" id="h012Auto" tabindex="0" role="button" aria-label="Kleines Fahrzeug ohne Pferd mit großen Speichenrädern">
  <rect x="300" y="300" width="70" height="26" rx="5" fill="#9b352d" stroke="#5c241d" stroke-width="2"/>
  <path d="M312 300 v-22 h40 v22" fill="none" stroke="#5c241d" stroke-width="3"/>
  <circle cx="314" cy="336" r="14" fill="none" stroke="#2b2b2b" stroke-width="4"/><circle cx="360" cy="336" r="14" fill="none" stroke="#2b2b2b" stroke-width="4"/>
  <circle cx="332" cy="270" r="8" fill="#e8d3bd"/>
  <rect x="292" y="258" width="88" height="96" fill="#000" opacity="0"/>
 </g>
 <g class="hot" data-task="hot" id="h012Pferd" tabindex="0" role="button" aria-label="Wagen mit Pferd">
  <rect x="420" y="290" width="70" height="36" fill="#a77b4f" stroke="#6b4a2b" stroke-width="2"/>
  <circle cx="436" cy="334" r="12" fill="#5c4632"/><circle cx="476" cy="334" r="12" fill="#5c4632"/>
  <g fill="#7a5a3a"><ellipse cx="530" cy="300" rx="28" ry="12"/><path d="M550 294 L566 272 L574 276 L560 302 Z"/><ellipse cx="574" cy="272" rx="10" ry="6"/></g>
  <path d="M512 308 v26 M522 308 v26 M540 308 v26 M550 308 v26" stroke="#5a3f27" stroke-width="4"/>
  <rect x="412" y="262" width="168" height="90" fill="#000" opacity="0"/>
 </g>
 <g class="hot" data-task="hot" id="h012Saeule" tabindex="0" role="button" aria-label="Runde Säule mit Plakaten">
  <rect x="20" y="166" width="36" height="88" fill="#d6c7a6" stroke="#6f675c" stroke-width="2"/>
  <path d="M16 166 h44 l-6 -12 h-32 z" fill="#37546b"/>
  <rect x="24" y="180" width="28" height="18" fill="#fff"/><rect x="24" y="206" width="28" height="22" fill="#e2b33b"/>
 </g>
 <g class="hot" data-task="hot" id="h012Offizier" tabindex="0" role="button" aria-label="Mann in Uniform mit Helm und Säbel">
  <circle cx="600" cy="186" r="10" fill="#e8d3bd" stroke="#6b4a2b" stroke-width="1.5"/>
  <path d="M590 180 h20 l-10 -14 z" fill="#2b3a44"/><path d="M600 166 v-6" stroke="#c9a227" stroke-width="3"/>
  <path d="M586 246 q14 -50 28 0 z" fill="#2b3a44"/>
  <path d="M590 246 v12 M610 246 v12" stroke="#1f1f1f" stroke-width="5"/>
  <path d="M612 220 l10 30" stroke="#9aa5ae" stroke-width="3"/>
  <rect x="580" y="156" width="50" height="106" fill="#000" opacity="0"/>
 </g>
 <g class="hot" data-task="hot" id="h012Leute" tabindex="0" role="button" aria-label="Spaziergänger auf dem Gehweg">
  <circle cx="470" cy="192" r="9" fill="#e8d3bd"/><path d="M458 246 q12 -48 24 0 z" fill="#6f4e8a"/><path d="M462 186 h16" stroke="#3a2a4a" stroke-width="6"/>
  <circle cx="510" cy="192" r="9" fill="#e8d3bd"/><path d="M498 246 q12 -48 24 0 z" fill="#3a4855"/><rect x="503" y="176" width="14" height="10" fill="#1f1f1f"/>
  <rect x="452" y="170" width="76" height="86" fill="#000" opacity="0"/>
 </g>
 <text x="630" y="372" font-size="17" text-anchor="end" fill="#172430">Eigene schematische Zeichnung</text>
</svg></div>'''

AUSW_SVG = '''<div class="svgwrap"><svg class="bild" viewBox="0 0 640 330" role="img" aria-label="Balkendiagramm zur Auswanderung aus Deutschland: 1815 bis 1848 etwa 0,6 Millionen, 1850 bis 1870 etwa 2 Millionen, 1880 bis 1893 über 1,7 Millionen, 1894 bis 1914 etwa 0,56 Millionen Menschen.">
 <rect width="640" height="330" fill="#f7f8fa"/>
 <text x="20" y="32" font-size="21" font-weight="700" fill="#172430">Auswanderung aus Deutschland (gerundet)</text>
 <path d="M60 270 H620" stroke="#55606a" stroke-width="2"/>
 <g fill="#37546b"><rect x="80" y="234" width="100" height="36"/><rect x="215" y="150" width="100" height="120"/><rect x="350" y="168" width="100" height="102"/><rect x="485" y="236" width="100" height="34"/></g>
 <g font-size="19" font-weight="700" text-anchor="middle" fill="#172430"><text x="130" y="224">0,6 Mio.</text><text x="265" y="140">2 Mio.</text><text x="400" y="158">über 1,7 Mio.</text><text x="535" y="226">0,56 Mio.</text></g>
 <g font-size="18" text-anchor="middle" fill="#3a4855"><text x="130" y="296">1815–1848</text><text x="265" y="296">1850–1870</text><text x="400" y="296">1880–1893</text><text x="535" y="296">1894–1914</text></g>
 <text x="20" y="322" font-size="16" fill="#55606a">Nach Deutschem Historischem Museum. Zeiträume verschieden lang.</text>
</svg></div>'''

inhalt = '''
<section class="card" id="gesellschaft">
<h2>Oben und unten: die Gesellschaft im Kaiserreich</h2>
<p>Die Gesellschaft im Kaiserreich war in Schichten geteilt. Wer wohin gehörte, entschieden vor allem Geburt, Besitz und Bildung. Der <strong>Adel</strong> besetzte viele Stellen im Heer und in der Regierung. Das <strong>Bürgertum</strong> wurde reicher und selbstbewusster. Durch die Industrialisierung wuchs die <strong>Arbeiterschaft</strong> stark. Auf dem Land, auch im Emsland, lebten viele Menschen als Kleinbauern oder als <strong>Heuerleute</strong>: Sie pachteten ein kleines Haus mit etwas Land von einem Bauern und mussten dafür auf seinem Hof mitarbeiten.</p>
''' + task('zuord') + '''
</section>

<section class="card" id="strasse">
<h2>Eine Straße um 1900</h2>
<p>In den Großstädten veränderte sich der Alltag schnell. Strom, neue Verkehrsmittel und große Kaufhäuser kamen auf. Auf dem Land ging vieles langsamer. Ins Emsland kam die Eisenbahn Mitte der 1850er Jahre mit der Strecke von Rheine nach Emden. Sieh dir die Straßenszene an.</p>
''' + STRASSE_SVG + '''
''' + task('hot') + '''
''' + task('technik') + '''
</section>

<section class="card" id="koepenick">
<h2>Der Hauptmann von Köpenick</h2>
<p>Am 16. Oktober 1906 kaufte sich der arbeitslose Schuhmacher <strong>Wilhelm Voigt</strong> bei einem Trödler eine gebrauchte Hauptmannsuniform. In Berlin hielt er einen Trupp von etwa zehn Soldaten an und befahl ihnen, mit ihm zu kommen. Die Soldaten gehorchten. Voigt fuhr mit ihnen nach Köpenick bei Berlin, besetzte das Rathaus, ließ den Bürgermeister festnehmen und nahm die Stadtkasse mit rund 4.000 Mark mit. Eigentlich hatte er einen Pass gesucht, denn ohne Papiere bekam er keine Arbeit und ohne Arbeit keine Papiere. Voigt wurde zu vier Jahren Gefängnis verurteilt, aber 1908 vom Kaiser vorzeitig begnadigt.</p>
<p>Ganz Europa lachte über den Streich. Er zeigte aber etwas Ernstes: Im Kaiserreich genoss das Militär ein enormes Ansehen. Eine Uniform öffnete fast jede Tür. Diese Haltung nennt man <strong>Militarismus</strong>.</p>
''' + task('gehorsam') + '''
''' + task('kdarst') + '''
</section>

<section class="card" id="schule">
<h2>Schule und Freizeit</h2>
<p>Die meisten Kinder besuchten acht Jahre die Volksschule. Die Klassen waren groß, oft mit 60 und mehr Kindern. Es gab Prügelstrafen mit dem Rohrstock. Am Sedantag, dem 2. September, feierten die Schulen den Sieg über Frankreich von 1870. Kaiser Wilhelm II. sagte bei der Eröffnung einer Schulkonferenz in Berlin am 4. Dezember 1890:</p>
<div class="zitat"><p>„Wir sollen nationale junge Deutsche erziehen und nicht junge Griechen und Römer.“</p></div>
<p>In der Freizeit wurden <strong>Vereine</strong> sehr beliebt: Turnvereine, Schützenvereine, Gesangvereine, Kriegervereine für ehemalige Soldaten. Neue Freizeitbeschäftigungen kamen auf, zum Beispiel Radfahren und Fußball. Ab 1895 gab es die ersten Filmvorführungen. Für Arbeiterfamilien blieb aber wenig freie Zeit, denn sie arbeiteten oft sechs Tage in der Woche.</p>
''' + task('schulfrei') + '''
</section>

<section class="card" id="quelle">
<h2>Die Quelle: „Die Menschenrechte haben kein Geschlecht“</h2>
<p>Frauen hatten im Kaiserreich weniger Rechte als Männer. Sie durften nicht wählen, an den meisten Universitäten nicht studieren, und verheiratete Frauen brauchten für vieles die Zustimmung ihres Mannes. Die <strong>Frauenbewegung</strong> kämpfte dagegen. 1865 gründete Louise Otto-Peters in Leipzig den Allgemeinen Deutschen Frauenverein. Ab 1900 durften Frauen in Baden regulär studieren, in Preußen ab 1908. Das Wahlrecht bekamen Frauen erst im November 1918.</p>
<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Hedwig Dohm, Schriftstellerin, „Der Frauen Natur und Recht. Zur Frauenfrage. Zwei Abhandlungen über Eigenschaften und Stimmrecht der Frauen“</strong>, Berlin 1876. Drei Sätze aus dem Teil über das Stimmrecht:</p>
 <div class="zitat"><p>„Es gibt keine Freiheit der Männer, wenn es nicht eine Freiheit der Frauen gibt.“</p>
 <p>„Erhebt Euch und fordert das Stimmrecht!“</p>
 <p>„Die Menschenrechte haben kein Geschlecht.“</p></div>
</div>
''' + chronos("Hedwig Dohm forderte das Frauenwahlrecht schon 1876. Das war damals so radikal, dass auch viele Frauen das zu weit fanden. Lies die drei Sätze genau. An wen wendet sie sich?") + '''
''' + task('wfragen') + '''
''' + task('dohm') + '''
</section>

<section class="card" id="auswanderung">
<h2>Auswanderung nach Amerika</h2>
<p>Im 19. Jahrhundert verließen Millionen Menschen Deutschland, die allermeisten gingen in die USA. Auch aus dem Emsland und dem Osnabrücker Land wanderten viele aus, besonders arme Heuerleute und Kleinbauern ohne eigenes Land. Viele kannten das Arbeiten in der Fremde schon: Aus dem Emsland zogen seit Generationen „Hollandgänger“ jeden Sommer zur Saisonarbeit in die Niederlande. Die Auswanderer reisten zu den Häfen Bremerhaven oder Hamburg und von dort mit dem Schiff über den Atlantik.</p>
''' + AUSW_SVG + '''
''' + task('pushpull') + '''
''' + task('migration', 'weiter') + '''
</section>
'''

tasks = [
 {"id":"zuord","type":"zuord","key":"schichten","name":"Gesellschaftsschichten","tag":"Zuordnen",
  "titel":"Wer gehört wohin?",
  "frage":"Ordne jede Karte der passenden Gruppe zu.",
  "zones":[{"id":"adel","t":"Adel"},{"id":"buerger","t":"Bürgertum"},{"id":"arbeiter","t":"Arbeiterschaft"},{"id":"land","t":"Landbevölkerung"}],
  "cards":[{"id":"c1","t":"Großgrundbesitz und Offiziersstellen","z":"adel"},
           {"id":"c2","t":"Titel wie „von“ im Namen","z":"adel"},
           {"id":"c3","t":"Fabrikbesitzer, Ärzte, Richter","z":"buerger"},
           {"id":"c4","t":"Klavier im Salon, Gymnasium für die Söhne","z":"buerger"},
           {"id":"c5","t":"Zwölf Stunden in der Fabrik","z":"arbeiter"},
           {"id":"c6","t":"Enge Wohnung in einer Mietskaserne","z":"arbeiter"},
           {"id":"c7","t":"Heuermann, der auf dem Hof des Bauern mitarbeitet","z":"land"},
           {"id":"c8","t":"Hollandgänger zur Saisonarbeit","z":"land"}],
  "hilfe":"Denke an Geburt (Adel), Besitz und Bildung (Bürgertum), Lohnarbeit in der Stadt (Arbeiter) und Arbeit in der Landwirtschaft (Landbevölkerung).",
  "ok":"Alle richtig. Die Schichten lebten sehr unterschiedlich. Aufstieg war schwer, aber über Bildung möglich. Die meisten Kinder aus Arbeiter- und Heuerlingsfamilien blieben jedoch in ihrer Schicht.",
  "hint":"Prüfe die rot markierten Karten mit dem Text über der Aufgabe."},
 {"id":"hot","type":"hot","key":"bildarbeit","name":"Straße um 1900","tag":"Bildarbeit",
  "targets":[{"id":"h012Bahn","tipp":"Finde das Verkehrsmittel, das mit Strom aus einer Leitung über der Straße fährt.","ok":"Richtig. Die erste elektrische Straßenbahn fuhr 1881 bei Berlin. Um 1900 hatten viele Städte elektrische Bahnen."},
             {"id":"h012Auto","tipp":"Finde das Fahrzeug, das ohne Pferd und ohne Schienen fährt.","ok":"Richtig. 1886 baute Carl Benz einen Wagen mit Benzinmotor. Um 1900 waren Autos aber noch selten und teuer."},
             {"id":"h012Offizier","tipp":"Finde die Person, deren Kleidung im Kaiserreich besonders großes Ansehen hatte.","ok":"Richtig. Offiziere in Uniform genossen hohes Ansehen. Viele Zivilisten begegneten ihnen mit großem Respekt."}],
  "all":[{"id":"h012Saeule","name":"Litfaßsäule"},{"id":"h012Bahn","name":"Straßenbahn"},{"id":"h012Auto","name":"Auto"},{"id":"h012Pferd","name":"Pferdewagen"},{"id":"h012Leute","name":"Spaziergänger"},{"id":"h012Offizier","name":"Offizier"}],
  "fertig":"Alle drei gefunden.",
  "ok":"Altes und Neues standen nebeneinander: Pferdewagen und Straßenbahn, Spaziergänger und Offizier. Das Kaiserreich war modern in der Technik, aber in vielem noch obrigkeitsstaatlich."},
 {"id":"technik","type":"order","key":"technik_zeitleiste","name":"Technik-Zeitleiste","tag":"Zeitleiste",
  "titel":"Erfindungen ordnen",
  "frage":"Bringe die Erfindungen und Neuerungen in die richtige zeitliche Reihenfolge.",
  "oben":"das früheste Ereignis.","unten":"das späteste Ereignis.",
  "items":["1835: Die erste deutsche Eisenbahn fährt von Nürnberg nach Fürth",
           "1881: Erste elektrische Straßenbahn bei Berlin",
           "1886: Carl Benz baut ein Auto mit Benzinmotor",
           "1895: Wilhelm Conrad Röntgen entdeckt die Röntgenstrahlen",
           "1900: Der Deutsche Fußball-Bund wird gegründet"],
  "hilfe":"Die Jahreszahlen stehen am Anfang jeder Karte.",
  "ok":"Richtig. In wenigen Jahrzehnten veränderten Technik und Wissenschaft den Alltag stärker als in Jahrhunderten davor.",
  "hint":"Sortiere nach den Jahreszahlen."},
 {"id":"gehorsam","type":"mc","key":"militarismus","name":"Militarismus","tag":"Ursache und Folge",
  "frage":"Warum gehorchten die Soldaten und die Beamten im Rathaus dem falschen Hauptmann?",
  "opts":[{"v":"a","t":"Weil man gelernt hatte, einer Uniform und einem Befehl ohne Fragen zu gehorchen.","ok":True,"fb":"Genau. Die Uniform reichte als Beweis. Niemand prüfte, wer Voigt war. Das zeigt, wie stark Gehorsam gegenüber dem Militär im Kaiserreich verankert war."},
          {"v":"b","t":"Weil Voigt allen Geld versprochen hatte.","fb":"Davon ist nichts bekannt. Voigt brauchte gar kein Geld als Lockmittel. Die Uniform genügte."},
          {"v":"c","t":"Weil Voigt bekannt und berühmt war.","fb":"Im Gegenteil. Voigt war ein unbekannter, mehrfach vorbestrafter Schuhmacher. Berühmt wurde er erst durch den Streich."}]},
 {"id":"kdarst","type":"multi","key":"quelle_darstellung","name":"Quelle oder Darstellung","tag":"Quelle oder Darstellung?",
  "frage":"Über den Hauptmann von Köpenick gibt es viele Materialien. Welche davon sind Quellen aus der Zeit selbst? Wähle alle zutreffenden aus.",
  "opts":[{"v":"zeitung","t":"Ein Zeitungsbericht vom 17. Oktober 1906","ok":True},
          {"v":"akte","t":"Die Gerichtsakte aus dem Prozess gegen Voigt 1906","ok":True},
          {"v":"buch","t":"Voigts eigenes Buch „Wie ich Hauptmann von Köpenick wurde“ von 1909","ok":True},
          {"v":"theater","t":"Das Theaterstück „Der Hauptmann von Köpenick“ von Carl Zuckmayer aus dem Jahr 1931","fb":"Zuckmayer schrieb sein Theaterstück 25 Jahre später und erfand Szenen dazu. Es ist eine Darstellung."},
          {"v":"film","t":"Der Spielfilm mit Heinz Rühmann aus dem Jahr 1956","fb":"Ein Spielfilm von 1956 ist eine spätere Darstellung."}],
  "hilfe":"Frage bei jedem Material: Ist es 1906 oder kurz danach entstanden, oder viele Jahre später?",
  "ok":"Richtig. Auch Voigts eigenes Buch ist eine Quelle, aber Vorsicht: Er wollte sich selbst darin gut darstellen. Theaterstück und Film sind Darstellungen. Sie sagen viel darüber, wie man sich später an den Streich erinnerte.",
  "hint":"Drei Materialien sind Quellen."},
 {"id":"schulfrei","type":"multi","key":"schule_freizeit","name":"Schule und Freizeit","tag":"Richtig oder falsch",
  "frage":"Welche Aussagen über Schule und Freizeit im Kaiserreich stimmen? Wähle alle zutreffenden aus.",
  "opts":[{"v":"national","t":"Die Schule sollte Kinder zu treuen, nationalen Untertanen erziehen.","ok":True},
          {"v":"verein","t":"Vereine wie Turn-, Schützen- und Gesangvereine waren sehr beliebt.","ok":True},
          {"v":"klassen","t":"Volksschulklassen waren oft sehr groß.","ok":True},
          {"v":"frei","t":"Arbeiter hatten viel Freizeit, weil sie nur vier Tage arbeiteten.","fb":"Arbeiter arbeiteten meist sechs Tage pro Woche und oft mehr als zehn Stunden am Tag."},
          {"v":"gymnasium","t":"Alle Kinder gingen auf das Gymnasium.","fb":"Die meisten Kinder besuchten nur die Volksschule. Das Gymnasium kostete Schulgeld und war vor allem für Bürgersöhne."}],
  "hilfe":"Lies den Text über der Aufgabe noch einmal. Drei Aussagen stimmen.",
  "ok":"Richtig. Schule und Vereine verbreiteten Ordnung, Disziplin und Begeisterung für Kaiser und Nation. Wilhelms Satz zeigt, dass die Schule ein politisches Ziel hatte.",
  "hint":"Drei Aussagen stimmen."},
 {"id":"wfragen","type":"sel","key":"quelle_wfragen","name":"Quellenarbeit Dohm","tag":"Quellenarbeit","wide":True,
  "titel":"Die W-Fragen an die Quelle",
  "frage":"Beantworte die Fragen an den Text von Hedwig Dohm.",
  "choices":["Eine Schriftstellerin, die für Frauenrechte kämpfte","1876, gut 40 Jahre vor dem Frauenwahlrecht","Vor allem Frauen, die sie zum Handeln aufruft","Sie wollte das Stimmrecht für Frauen erreichen","Der Kaiser"],
  "rows":[{"t":"Wer hat den Text geschrieben?","ok":"Eine Schriftstellerin, die für Frauenrechte kämpfte","fb":"Sieh in die Quellenangabe."},
          {"t":"Wann?","ok":"1876, gut 40 Jahre vor dem Frauenwahlrecht","fb":"Vergleiche das Jahr der Quelle mit dem Jahr, in dem Frauen wählen durften."},
          {"t":"Für wen?","ok":"Vor allem Frauen, die sie zum Handeln aufruft","fb":"Lies den zweiten Satz: „Erhebt Euch …“. Wen spricht sie an?"},
          {"t":"Warum?","ok":"Sie wollte das Stimmrecht für Frauen erreichen","fb":"Das Wort steht zweimal in der Quellenangabe und im Text."}],
  "hilfe":"„Der Kaiser“ passt zu keiner Frage.",
  "ok":"Gut gearbeitet. Hedwig Dohm war ihrer Zeit weit voraus. Ihre Forderung wurde erst 1918 erfüllt.",
  "hint":"Die richtigen Auswahlen sind grün umrandet."},
 {"id":"dohm","type":"mc","key":"quelle_deutung","name":"Deutung Dohm","tag":"Quellenkritik",
  "frage":"Was meint Dohm mit dem Satz „Die Menschenrechte haben kein Geschlecht“?",
  "opts":[{"v":"a","t":"Rechte wie das Wahlrecht stehen allen Menschen zu, Frauen genauso wie Männern.","ok":True,"fb":"Genau. Wenn Rechte allen Menschen zustehen, darf das Geschlecht keine Rolle spielen. Heute steht das so im Grundgesetz: „Männer und Frauen sind gleichberechtigt.“"},
          {"v":"b","t":"Frauen sollen mehr Rechte haben als Männer.","fb":"Davon spricht sie nicht. Lies den ersten Satz: Sie will die gleiche Freiheit für beide."},
          {"v":"c","t":"Menschenrechte sind nur etwas für Männer.","fb":"Das ist genau die Meinung, gegen die Dohm schreibt."}]},
 {"id":"pushpull","type":"sel","key":"auswanderung","name":"Gründe der Auswanderung","tag":"Ursachen",
  "titel":"Was trieb weg, was zog an?",
  "frage":"Manche Gründe trieben Menschen aus der Heimat weg, andere zogen sie nach Amerika. Ordne zu.","wide":True,
  "choices":["treibt weg aus der Heimat","zieht nach Amerika"],
  "rows":[{"t":"Ein Heuermann hat kein eigenes Land und kaum Aussicht auf einen eigenen Hof.","ok":"treibt weg aus der Heimat","fb":"Fehlendes Land ist ein Problem in der Heimat."},
          {"t":"In Amerika gibt es billiges Land zu kaufen.","ok":"zieht nach Amerika","fb":"Das lockt in die neue Welt."},
          {"t":"Verwandte, die schon ausgewandert sind, schreiben Briefe und laden ein.","ok":"zieht nach Amerika","fb":"Briefe von Verwandten machten Mut und halfen beim Ankommen."},
          {"t":"Missernten und Hunger machen das Leben schwer.","ok":"treibt weg aus der Heimat","fb":"Not in der Heimat treibt weg."},
          {"t":"Nach 1849 werden Revolutionäre verfolgt.","ok":"treibt weg aus der Heimat","fb":"Verfolgung in der Heimat treibt weg."}],
  "hilfe":"Frage: Geht es um ein Problem hier oder um eine Hoffnung dort?",
  "ok":"Richtig. Meist wirkten beide Seiten zusammen: Not in der Heimat und Hoffnung in der Fremde. Als die Industrie in Deutschland ab den 1890er Jahren viele Arbeitsplätze bot, wanderten deutlich weniger Menschen aus.",
  "hint":"Die richtigen Auswahlen sind grün umrandet."},
 {"id":"migration","type":"frei","key":"weiterdenken_migration","name":"Weiterdenken Migration","tag":"Weiterdenken · Gegenwartsbezug",
  "frage":"Auch heute verlassen Menschen ihre Heimat. Vergleiche: Was ist bei Auswanderern aus dem Emsland um 1880 und bei Menschen, die heute nach Deutschland kommen, ähnlich? Was ist anders? Nenne je ein Beispiel.",
  "platz":"Ähnlich ist, dass ... Anders ist, dass ...",
  "min":70,"kurz":"Deine Antwort ist noch sehr kurz. Nenne eine Gemeinsamkeit und einen Unterschied.",
  "gruppen":[{"w":["ahnlich","gemeinsam","beide","genauso","auch"],"tipp":"Nenne eine Gemeinsamkeit."},
             {"w":["anders","unterschied","heute","dagegen","aber"],"tipp":"Nenne einen Unterschied."},
             {"w":["arbeit","armut","not","krieg","verfolg","hoffnung","sprache","familie","land"],"tipp":"Nenne einen konkreten Grund oder eine Erfahrung, zum Beispiel Arbeit, Not oder Sprache."}],
  "gut":"Ein sehr guter Vergleich. Du zeigst, dass Migration ein Thema ist, das Menschen zu allen Zeiten betrifft, und du beachtest die Unterschiede."},
]

M = {
 "nr":"012","titel":"Wie veränderten sich Gesellschaft und Alltag?","bereich":BEREICH,
 "hero":"Strom, Straßenbahn und Fußball, aber auch Rohrstock, Uniformen und Frauen ohne Wahlrecht: Das Kaiserreich war modern und altmodisch zugleich. Du erkundest den Alltag verschiedener Menschen, vom Offizier bis zum Heuermann im Emsland.",
 "ziele":["Du beschreibst die Gesellschaftsschichten im Kaiserreich.",
          "Du nennst technische Neuerungen und ordnest sie zeitlich ein.",
          "Du erklärst am Hauptmann von Köpenick, was Militarismus bedeutet.",
          "Du wertest eine Quelle der Frauenbewegung aus.",
          "Du erklärst Gründe für die Auswanderung nach Amerika, auch aus dem Emsland."],
 "mission":'''<div class="akte">
 <span class="stamp">Akte 012</span>
 <p><strong>Fall:</strong> In Chronos' Archiv liegen vier Fundstücke nebeneinander: ein Foto einer Straßenbahn, eine Zeitungsnotiz über einen falschen Hauptmann, ein Flugblatt für das Frauenwahlrecht und eine Schiffskarte von Bremerhaven nach New York.</p>
 <p><strong>Dein Auftrag:</strong> Finde heraus, was diese Dinge über den Alltag im Kaiserreich erzählen. Am Ende prüfst du Chronos' Karteikarte.</p>
</div>''' + chronos("Auf meiner Karteikarte steht: „Im Kaiserreich wurde für alle Menschen alles moderner und besser.“ Die Straßenbahn spricht dafür. Aber die anderen Fundstücke machen mich nachdenklich. Wer profitierte eigentlich vom Fortschritt, und wer nicht?"),
 "dtext":"Stell dir vor, du lebst im Jahr 1900. Was wäre für dich anders als heute? Schreibe ein oder zwei Gedanken auf.",
 "inhalt":inhalt,
 "nav":[("gesellschaft","Oben und unten"),("strasse","Straße um 1900"),("koepenick","Hauptmann von Köpenick"),("schule","Schule und Freizeit"),("quelle","Die Quelle"),("auswanderung","Auswanderung")],
 "glossar":[("Militarismus","Eine Haltung, bei der das Militär, Uniformen und Gehorsam das ganze Leben prägen und besonders hoch angesehen sind."),
            ("Bürgertum","Gesellschaftsschicht aus Kaufleuten, Fabrikanten, Beamten, Ärzten und Lehrern. Wichtig waren Besitz und Bildung."),
            ("Arbeiterschaft","Menschen, die gegen Lohn in Fabriken, Bergwerken oder Werkstätten arbeiteten."),
            ("Heuerleute","Landarbeiter im Nordwesten Deutschlands, auch im Emsland. Sie pachteten Haus und Land von einem Bauern und arbeiteten dafür auf seinem Hof mit."),
            ("Hollandgänger","Menschen aus dem Nordwesten Deutschlands, die jedes Jahr für einige Monate zur Arbeit in die Niederlande zogen."),
            ("Frauenbewegung","Zusammenschluss von Frauen, die für Bildung, Berufstätigkeit und politische Rechte der Frauen kämpften."),
            ("Auswanderung","Das dauerhafte Verlassen der Heimat, um in einem anderen Land zu leben.")],
 "karte":"Im Kaiserreich wurde für alle Menschen alles moderner und besser.",
 "a1frage":"Wie entscheidest du über die Karteikarte?",
 "a2frage":"Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, wie sich Gesellschaft und Alltag im Kaiserreich veränderten. Nenne eine Veränderung, die vielen half, und zwei Beispiele dafür, dass nicht alle gleich profitierten.",
 "a2platz":"Lieber Chronos, deine Karte stimmt nur zum Teil, weil ...",
 "a2satz":"„Vieles wurde moderner, zum Beispiel ...“ · „Aber nicht alle profitierten, denn ...“ · „Frauen ...“ · „Viele Heuerleute aus dem Emsland ...“ · „Deshalb ...“",
 "data":{
  "tasks":tasks,
  "badges":[{"n":"Gesellschaftskenner","ids":["zuord"]},{"n":"Spurenleser","ids":["hot","technik"]},{"n":"Quellenprüfer","ids":["kdarst","wfragen"]},{"n":"Begründer","ids":["a2"]}],
  "diag":[{"tag":"Schätzfrage","frage":"Ab wann durften Frauen in Deutschland wählen?","opts":[{"v":"a","t":"Ab 1871"},{"v":"b","t":"Ab 1918"},{"v":"c","t":"Ab 1949"}],"ok":"b","tipp":"Vorab: Das Frauenwahlrecht kam im November 1918."},
          {"tag":"Richtig oder falsch","frage":"Im 19. Jahrhundert wanderten Millionen Deutsche nach Amerika aus.","opts":[{"v":"r","t":"Das stimmt"},{"v":"f","t":"Das stimmt nicht"}],"ok":"r","tipp":"Es waren tatsächlich Millionen."},
          {"tag":"Vermutung","frage":"Was vermutest du: Wie wurde ein Offizier in Uniform um 1900 angesehen?","opts":[{"v":"a","t":"Mit großem Respekt, Uniformen hatten hohes Ansehen"},{"v":"b","t":"Man lachte über ihn"},{"v":"c","t":"Niemand achtete auf ihn"}],"ok":"a"}],
  "a1":[{"v":"ok","t":"Die Karte stimmt. Der Fortschritt kam bei allen gleich an.","ok":False,"fb":"Denk an die Arbeiter mit langen Arbeitstagen, an die Frauen ohne Wahlrecht und an die Heuerleute, die auswandern mussten."},
         {"v":"teil","t":"Die Karte stimmt nur zum Teil. Technik und Bildung brachten viel Neues, aber Frauen, Arbeiter und arme Landbewohner profitierten viel weniger, und Militarismus prägte den Alltag.","ok":True,"fb":"Fortschritt und Ungleichheit gingen nebeneinander her. Ein gutes historisches Urteil zeigt beide Seiten."},
         {"v":"falsch","t":"Die Karte ist völlig falsch. Es änderte sich gar nichts.","ok":False,"fb":"Es änderte sich sehr viel: Strom, Straßenbahn, Auto, Vereine, Schulpflicht. Die Frage ist, für wen."}],
  "a2":{"start":"Beginne mit: „Vieles wurde moderner, zum Beispiel ...“",
        "fach":[["militarismus","Militarismus"],["burgertum","Bürgertum"],["arbeiter","Arbeiterschaft"],["frauenbewegung","Frauenbewegung"],["wahlrecht","Wahlrecht"],["auswander","Auswanderung"],["heuer","Heuerleute"],["industrial","Industrialisierung"],["adel","Adel"],["kopenick","Hauptmann von Köpenick"],["technik","Technik"],["verein","Vereine"]],
        "fachTipp":"Militarismus, Bürgertum, Frauenbewegung oder Auswanderung",
        "themen":[{"w":["technik","strom","elektr","straßenbahn","strassenbahn","eisenbahn","auto","verein","fussball","modern"],"gut":"Du nennst eine Veränderung, die vielen half.","tipp":"Nenne eine Veränderung, die das Leben modernisierte, zum Beispiel Strom oder Straßenbahn."},
                  {"w":["frau","arbeiter","heuer","arm","auswander"],"gut":"Du zeigst, wer weniger profitierte.","tipp":"Nenne Gruppen, die weniger profitierten, zum Beispiel Frauen, Arbeiter oder Heuerleute."},
                  {"w":["militar","uniform","kopenick","gehorsam","untertan","schule","rohrstock"],"gut":"Du gehst auch auf Militarismus oder Erziehung ein.","tipp":"Gehe auch auf Militarismus oder die Erziehung zum Gehorsam ein, zum Beispiel mit dem Hauptmann von Köpenick."}],
        "voll":"Sehr gut. Du zeigst die Widersprüche des Kaiserreichs: modern und obrigkeitsstaatlich zugleich."},
  "lc":["Ich kann die Gesellschaftsschichten im Kaiserreich beschreiben.",
        "Ich kann am Hauptmann von Köpenick erklären, was Militarismus bedeutet.",
        "Ich kann Gründe für die Frauenbewegung und für die Auswanderung nennen."],
  "komp":{"fachwissen":["zuord","schulfrei"],"zeit_raum":["technik"],"quellenarbeit":["wfragen","dohm"],"ursachen_folgen":["pushpull","gehorsam"],"perspektivitaet":["kdarst"]},
  "next":"Weiter geht es mit Modul 013: Lerncheck: Nation, Reich und politische Teilhabe."
 }
}

if __name__ == "__main__":
    build(M)
