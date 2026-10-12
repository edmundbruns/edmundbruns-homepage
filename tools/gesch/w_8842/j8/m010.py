import sys; sys.path.insert(0, '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/gesch/w_8842/j8')
from eng8 import build, chronos, task

BEREICH = "Nation und politische Teilhabe"

def figur(x, y, s=1.0, col="#37546b", helm=True):
    """einfache Figur: Kopf, Körper"""
    h = '<circle cx="%.0f" cy="%.0f" r="%.0f" fill="#e8d3bd" stroke="#6b4a2b" stroke-width="1.5"/>' % (x, y, 9 * s)
    if helm:
        h += '<path d="M%.0f %.0f h%.0f l-%.0f -%.0f z" fill="#2b3a44"/>' % (x - 9 * s, y - 5 * s, 18 * s, 9 * s, 12 * s)
    h += '<path d="M%.0f %.0f q%.0f -%.0f %.0f 0 v%.0f h-%.0f z" fill="%s"/>' % (x - 14 * s, y + 46 * s, 14 * s, 40 * s, 28 * s, 30 * s, 28 * s, col)
    return h

def offiziere():
    out = ''
    for i, x in enumerate(range(462, 630, 36)):
        y = 196 + (i % 2) * 14
        out += figur(x, y, 1.25)
        out += '<path d="M%d %d l12 -50" stroke="#9aa5ae" stroke-width="4"/>' % (x + 10, y + 26)
    for i, x in enumerate(range(476, 630, 40)):
        out += figur(x, 250 + (i % 2) * 10, 1.3, "#2b3a44")
    return out

BILD_SVG = ('<div class="svgwrap"><svg class="bild" viewBox="0 0 640 420" role="img" aria-label="Schematische Skizze nach dem Aufbau des Gemäldes von Anton von Werner, 1885: links ein Podest mit dem Kaiser, Fürsten und Fahnen, in der Mitte eine Person in heller Uniform, rechts viele Offiziere mit erhobenen Säbeln und Helmen. Die Bereiche sind antippbar.">'
 '<rect width="640" height="420" fill="#efe9dc"/>'
 '<g fill="#d9cfb8" stroke="#b9ab8c" stroke-width="2"><rect x="20" y="20" width="110" height="150"/><rect x="170" y="20" width="110" height="150"/><rect x="320" y="20" width="110" height="150"/><rect x="470" y="20" width="110" height="150"/></g>'
 '<g fill="#eef1f4" opacity=".7"><rect x="34" y="34" width="82" height="122"/><rect x="184" y="34" width="82" height="122"/><rect x="334" y="34" width="82" height="122"/><rect x="484" y="34" width="82" height="122"/></g>'
 '<rect x="0" y="330" width="640" height="90" fill="#c8b48e"/>'
 '<g class="hot" data-task="hot" id="h010Fahnen" tabindex="0" role="button" aria-label="Fahnen über dem Podest">'
 '<path d="M30 70 V236 M80 60 V236 M140 70 V236" stroke="#5c4632" stroke-width="4"/>'
 '<path d="M30 72 h44 l-6 18 l6 18 h-44 z M80 62 h44 l-6 18 l6 18 h-44 z" fill="#f2efe8" stroke="#8a7d63" stroke-width="2"/>'
 '<path d="M140 72 h40 l-6 18 l6 18 h-40 z" fill="#2b2b2b" stroke="#8a7d63" stroke-width="2"/>'
 '<rect x="24" y="54" width="160" height="56" fill="#000" opacity="0"/></g>'
 '<rect x="20" y="236" width="200" height="94" fill="#8f6b45" stroke="#5c4632" stroke-width="3"/>'
 '<path d="M220 300 h40 v30 h-40 z M220 316 h60 v14 h-60 z" fill="#8f6b45" stroke="#5c4632" stroke-width="2"/>'
 '<g class="hot" data-task="hot" id="h010Kaiser" tabindex="0" role="button" aria-label="Person auf dem Podest in der Mitte der Fürstengruppe">'
 + figur(112, 122, 1.5, "#1f2f3b") +
 '<rect x="88" y="96" width="48" height="142" fill="#000" opacity="0"/></g>'
 '<g class="hot" data-task="hot" id="h010Fuersten" tabindex="0" role="button" aria-label="Weitere Männer auf dem Podest, einer hebt den Arm">'
 + figur(56, 137, 1.3, "#3d4f5c") + figur(168, 137, 1.3, "#3d4f5c") +
 '<path d="M180 160 l20 -40" stroke="#3d4f5c" stroke-width="9" stroke-linecap="round"/>'
 '<rect x="34" y="118" width="46" height="120" fill="#000" opacity="0"/><rect x="146" y="112" width="60" height="126" fill="#000" opacity="0"/></g>'
 '<g class="hot" data-task="hot" id="h010Bismarck" tabindex="0" role="button" aria-label="Person in heller Uniform in der Mitte des Bildes">'
 + figur(330, 196, 1.8, "#fbfbf7") +
 '<path d="M305 333 h50" stroke="#b9b2a2" stroke-width="2"/>'
 '<path d="M318 333 v30 M342 333 v30" stroke="#1f1f1f" stroke-width="11"/>'
 '<rect x="300" y="168" width="60" height="198" fill="#000" opacity="0"/></g>'
 '<g class="hot" data-task="hot" id="h010Moltke" tabindex="0" role="button" aria-label="Älterer Offizier neben der hellen Gestalt">'
 + figur(398, 214, 1.5, "#2b3a44") +
 '<rect x="374" y="190" width="48" height="140" fill="#000" opacity="0"/></g>'
 '<g class="hot" data-task="hot" id="h010Offiziere" tabindex="0" role="button" aria-label="Viele Offiziere mit erhobenen Säbeln und Helmen">'
 + offiziere() +
 '<rect x="436" y="140" width="204" height="196" fill="#000" opacity="0"/></g>'
 '<text x="320" y="404" font-size="17" text-anchor="middle" fill="#3a4855">Schematische Skizze des Bildaufbaus, keine Abbildung des Gemäldes</text>'
 '</svg></div>')

inhalt = '''
<section class="card" id="kriege">
<h2>Bismarck und die drei Einigungskriege</h2>
<p>1862 wurde <strong>Otto von Bismarck</strong> preußischer Ministerpräsident. Er wollte Preußen stärken und die deutschen Staaten unter preußischer Führung vereinen, ohne Österreich. Er setzte dabei nicht auf Parlamente, sondern auf Diplomatie und Militär. In nur sieben Jahren führte Preußen drei Kriege, die man später <strong>Einigungskriege</strong> nannte. In jedem Krieg starben Tausende Soldaten, im Krieg gegen Frankreich auf beiden Seiten zusammen weit über 100.000.</p>
''' + task('zuord') + '''
<div class="notice warn"><strong>Ganz in der Nähe:</strong> 1866 kämpfte das Königreich Hannover an der Seite Österreichs. Bei Langensalza siegte die hannoversche Armee am 27. Juni 1866, musste aber zwei Tage später aufgeben. Preußen löste das Königreich auf und machte es zur preußischen Provinz. Seitdem gehörte auch das Emsland zu Preußen. Übrigens: Die „Emser Depesche“ hat nichts mit dem Emsland zu tun. Sie kommt aus dem Kurort Bad Ems an der Lahn.</div>
</section>

<section class="card" id="depesche">
<h2>Die Emser Depesche: Wie ein Krieg begann</h2>
<p>1870 bot Spanien einem Prinzen aus dem Haus Hohenzollern den spanischen Thron an. Aus diesem Haus stammten auch die preußischen Könige. Frankreich fühlte sich bedroht. Bringe die Ereignisse in die richtige Reihenfolge.</p>
''' + task('kette') + '''
</section>

<section class="card" id="versailles">
<h2>18. Januar 1871: Die Kaiserproklamation</h2>
<p>Noch während des Krieges, am 18. Januar 1871, wurde im Spiegelsaal des Schlosses von Versailles bei Paris der preußische König <strong>Wilhelm I.</strong> zum Deutschen Kaiser ausgerufen. Das Datum war bewusst gewählt: Genau 170 Jahre zuvor, am 18. Januar 1701, hatte sich der erste preußische König gekrönt. Anwesend waren Fürsten, Generäle und Offiziere. Abgeordnete eines Parlaments waren nicht eingeladen.</p>
<p>Wilhelm I. war übrigens schlecht gelaunt. Er wollte „Kaiser von Deutschland“ heißen. Die anderen Fürsten wollten das nicht, deshalb wurde es „Deutscher Kaiser“.</p>
''' + task('vonoben') + '''
</section>

<section class="card" id="quelle">
<h2>Die Quelle: Ein Gemälde kritisch lesen</h2>
<p>Das bekannteste Bild der Reichsgründung stammt von dem Maler <strong>Anton von Werner</strong>. Er war am 18. Januar 1871 selbst im Spiegelsaal dabei und machte Skizzen. Später malte er die Szene mehrmals. Die bekannteste Fassung entstand 1885.</p>
<div class="akte">
 <span class="stamp">Bildquelle</span>
 <p><strong>Anton von Werner, „Die Proklamierung des Deutschen Kaiserreiches (18. Januar 1871)“</strong>, Ölgemälde, sogenannte Friedrichsruher Fassung, 1885. Auftrag der preußischen Königsfamilie als Geschenk zum 70. Geburtstag Bismarcks am 1. April 1885. Heute in Friedrichsruh bei Hamburg, dem früheren Gut Bismarcks.</p>
 <p><em>Bildbeschreibung:</em> Links steht auf einem Podest Kaiser Wilhelm I., umgeben von Fürsten. Hinter ihnen ragen Fahnen der Regimenter auf. Der Großherzog von Baden hebt den Arm und ruft das „Hoch“ auf den Kaiser aus. In der Mitte, im Vordergrund und hell leuchtend, steht Bismarck in einer weißen Uniform mit hohen Stiefeln. Neben ihm steht Generalstabschef Helmuth von Moltke. Rechts drängen sich Offiziere, die jubelnd Helme und Säbel in die Höhe strecken.</p>
</div>
''' + BILD_SVG + '''
<p class="hint">Das Gemälde selbst kannst du dir im Internet oder im Schulbuch ansehen. Die Skizze zeigt nur den Aufbau.</p>
''' + task('hot') + '''
''' + chronos("Ein Maler, der selbst dabei war, das klingt nach einem perfekten Augenzeugen. Aber Achtung: Er hat dieses Bild 14 Jahre später gemalt, im Auftrag der Königsfamilie, als Geburtstagsgeschenk für Bismarck. Was meinst du, wird so ein Bild alles ganz genau so zeigen, wie es war?") + '''
''' + task('wfragen') + '''
''' + task('fehler') + '''
''' + task('darst') + '''
''' + task('vergleich', 'weiter') + '''
</section>
'''

tasks = [
 {"id":"zuord","type":"zuord","key":"einigungskriege","name":"Einigungskriege","tag":"Zuordnen",
  "titel":"Drei Kriege, drei Ergebnisse",
  "frage":"Ordne jede Karte dem passenden Krieg zu.",
  "zones":[{"id":"k64","t":"1864"},{"id":"k66","t":"1866"},{"id":"k70","t":"1870/71"}],
  "cards":[{"id":"c1","t":"Gegner: Dänemark","z":"k64"},
           {"id":"c2","t":"Streit um Schleswig und Holstein","z":"k64"},
           {"id":"c3","t":"Gegner: Österreich","z":"k66"},
           {"id":"c4","t":"Schlacht bei Königgrätz","z":"k66"},
           {"id":"c5","t":"Hannover wird preußische Provinz","z":"k66"},
           {"id":"c6","t":"Gegner: Frankreich","z":"k70"},
           {"id":"c7","t":"Die süddeutschen Staaten kämpfen an Preußens Seite","z":"k70"},
           {"id":"c8","t":"Elsass und Lothringen werden deutsch","z":"k70"}],
  "hilfe":"1864 kämpften Preußen und Österreich noch gemeinsam. 1866 kämpften sie gegeneinander. 1870/71 ging es gegen den Nachbarn im Westen.",
  "ok":"Alle richtig. Nach 1866 war Österreich aus Deutschland hinausgedrängt, Preußen führte den Norddeutschen Bund. Der Krieg gegen Frankreich brachte 1870/71 die süddeutschen Staaten dazu. So entstand die kleindeutsche Lösung, diesmal durch Krieg.",
  "hint":"Prüfe die rot markierten Karten. Der Hinweiskasten unter der Aufgabe hilft bei Hannover."},
 {"id":"kette","type":"order","key":"emser_depesche","name":"Emser Depesche","tag":"Ursache und Folge",
  "titel":"Eine Kette von Ursachen und Folgen",
  "frage":"Bringe die sechs Schritte in die richtige Reihenfolge.",
  "oben":"der Anfang.","unten":"die Folge.",
  "items":["Spanien bietet einem Prinzen aus dem Haus Hohenzollern den Thron an.",
           "Frankreich protestiert heftig, der Prinz verzichtet.",
           "Frankreich verlangt, dass so etwas nie wieder vorkommt. Wilhelm I. lehnt in Bad Ems höflich ab.",
           "Bismarck kürzt den Bericht darüber so, dass er schroff und beleidigend klingt, und lässt ihn veröffentlichen.",
           "Frankreich erklärt Preußen am 19. Juli 1870 den Krieg.",
           "Die süddeutschen Staaten kämpfen an Preußens Seite, das Gemeinschaftsgefühl wächst."],
  "hilfe":"Die Kette beginnt mit dem Thron in Spanien und endet mit den süddeutschen Staaten.",
  "ok":"Genau. Bismarck nutzte die Lage geschickt: Frankreich erschien als Angreifer, und die süddeutschen Staaten mussten nach ihren Verträgen Preußen helfen. Ob Bismarck den Krieg von Anfang an wollte, darüber streiten Historiker bis heute.",
  "hint":"Was war zuerst da: das Angebot, der Protest, die gekürzte Nachricht oder die Kriegserklärung?"},
 {"id":"vonoben","type":"mc","key":"von_oben","name":"Reichsgründung von oben","tag":"Auswahl mit Erklärung",
  "frage":"Historiker sagen: 1848 sollte das Reich „von unten“ entstehen, 1871 entstand es „von oben“. Was ist damit gemeint?",
  "opts":[{"v":"a","t":"1871 einigten sich Fürsten und Militär, das Volk und gewählte Abgeordnete entschieden nicht mit.","ok":True,"fb":"Richtig. 1848 wollten gewählte Abgeordnete die Einheit schaffen. 1871 schufen Bismarck, die Fürsten und die Armee das Reich. Einheit wurde erreicht, aber die Freiheit kam zu kurz."},
          {"v":"b","t":"1871 wurde das Reich in Norddeutschland gegründet, 1848 in Süddeutschland.","fb":"„Oben“ und „unten“ meinen hier nicht die Himmelsrichtung, sondern wer die Macht hatte: Herrscher oben, Volk unten."},
          {"v":"c","t":"1871 stimmte das ganze Volk in einer Abstimmung für das Kaiserreich.","fb":"Eine solche Volksabstimmung gab es nicht. Die Fürsten schlossen Verträge, der Kaiser wurde ausgerufen."}]},
 {"id":"hot","type":"hot","key":"bildarbeit","name":"Bildaufbau","tag":"Bildarbeit",
  "targets":[{"id":"h010Bismarck","tipp":"Finde die Person, die der Maler in den Mittelpunkt gestellt und besonders hell gemalt hat.","ok":"Richtig. Bismarck steht in der Mitte und leuchtet in Weiß. Der Blick fällt sofort auf ihn, obwohl der Kaiser ausgerufen wird."},
             {"id":"h010Kaiser","tipp":"Finde den Mann, um den es bei der Feier eigentlich ging.","ok":"Richtig. Wilhelm I. steht erhöht auf dem Podest. Er ist aber kleiner und weiter weg als Bismarck."},
             {"id":"h010Offiziere","tipp":"Finde die Gruppe, die zeigt, wer im Saal jubelte.","ok":"Richtig. Es jubeln Offiziere in Uniform. Zivilisten, Abgeordnete oder gar Frauen sind nicht zu sehen."}],
  "all":[{"id":"h010Fahnen","name":"Fahnen"},{"id":"h010Kaiser","name":"Mann auf dem Podest"},{"id":"h010Fuersten","name":"Fürsten"},{"id":"h010Bismarck","name":"Helle Gestalt"},{"id":"h010Moltke","name":"Offizier daneben"},{"id":"h010Offiziere","name":"Gruppe rechts"}],
  "fertig":"Alle drei Bildbereiche gefunden.",
  "ok":"Der Bildaufbau sagt viel: Das neue Reich erscheint als Werk von Bismarck und der Armee."},
 {"id":"wfragen","type":"sel","key":"quelle_wfragen","name":"W-Fragen Gemälde","tag":"Quellenarbeit","wide":True,
  "titel":"Die W-Fragen an das Gemälde",
  "frage":"Beantworte die Fragen an die Bildquelle.",
  "choices":["Anton von Werner, ein Maler, der 1871 dabei war","1885, also 14 Jahre nach dem Ereignis","Bismarck, als Geschenk der Königsfamilie","Bismarck sollte als Gründer des Reiches geehrt werden","Die Abgeordneten des Reichstags"],
  "rows":[{"t":"Wer hat das Bild gemalt?","ok":"Anton von Werner, ein Maler, der 1871 dabei war","fb":"Der Name steht in der Quellenangabe."},
          {"t":"Wann ist diese Fassung entstanden?","ok":"1885, also 14 Jahre nach dem Ereignis","fb":"Rechne: 1885 minus 1871."},
          {"t":"Für wen war es bestimmt?","ok":"Bismarck, als Geschenk der Königsfamilie","fb":"Lies den Anlass in der Quellenangabe: ein Geburtstag."},
          {"t":"Warum wurde es gemalt?","ok":"Bismarck sollte als Gründer des Reiches geehrt werden","fb":"Wer steht im Mittelpunkt des Bildes?"}],
  "hilfe":"„Die Abgeordneten des Reichstags“ passt zu keiner Frage.",
  "ok":"Gut gearbeitet. Ein Bild, das als Geschenk für Bismarck gemalt wurde, zeigt ihn natürlich besonders vorteilhaft. Das nennt man die Absicht oder Perspektive einer Quelle.",
  "hint":"Die richtigen Auswahlen sind grün umrandet."},
 {"id":"fehler","type":"multi","key":"bildkritik","name":"Bild und Wirklichkeit","tag":"Quellenkritik",
  "frage":"Historiker haben das Bild mit anderen Quellen verglichen. Welche Abweichungen von der Wirklichkeit gibt es in der Fassung von 1885? Wähle alle zutreffenden aus.",
  "opts":[{"v":"uniform","t":"Bismarck trug am 18. Januar 1871 keine weiße Uniform. Der Maler hat ihn hervorgehoben.","ok":True},
          {"v":"roon","t":"Kriegsminister Albrecht von Roon war an dem Tag krank und nicht im Saal. Er wurde trotzdem ins Bild gemalt.","ok":True},
          {"v":"orden","t":"Bismarck trägt einen Orden, den er erst 1884 bekam.","ok":True},
          {"v":"alter","t":"Die wichtigsten Personen sehen so aus wie in den 1880er Jahren, nicht wie 1871.","ok":True},
          {"v":"ort","t":"Die Feier fand gar nicht in Versailles statt.","fb":"Doch, die Proklamation fand wirklich im Spiegelsaal von Versailles statt."},
          {"v":"maler","t":"Anton von Werner war gar nicht dabei.","fb":"Er war dabei und machte Skizzen. Trotzdem veränderte er später vieles, je nach Auftraggeber."}],
  "hilfe":"Vier Aussagen sind richtig. Zwei sind falsch: Prüfe, was du über den Ort und den Maler gelesen hast.",
  "ok":"Richtig. Das Bild ist also kein Foto, sondern eine Deutung. Es zeigt, wie man sich 1885 an die Reichsgründung erinnern wollte: als Werk Bismarcks und des Militärs.",
  "hint":"Lies noch einmal, was du über den Ort und den Maler weißt."},
 {"id":"darst","type":"mc","key":"quelle_darstellung","name":"Quelle und Darstellung","tag":"Quelle oder Darstellung?",
  "frage":"Ist das Gemälde von 1885 eine Quelle oder eine Darstellung?",
  "opts":[{"v":"a","t":"Beides zugleich: Für das Jahr 1871 ist es eine spätere Darstellung. Für die Zeit um 1885 ist es eine Quelle, die zeigt, wie man damals die Reichsgründung sehen wollte.","ok":True,"fb":"Sehr gut. Das ist ein wichtiger Gedanke: Ob etwas Quelle oder Darstellung ist, hängt von der Frage ab, die man stellt."},
          {"v":"b","t":"Nur eine Quelle, denn der Maler war dabei. Deshalb zeigt es genau, was geschah.","fb":"Der Maler war dabei, aber er hat 14 Jahre später und im Auftrag gemalt und vieles verändert. Für die Ereignisse von 1871 ist es deshalb nicht verlässlich."},
          {"v":"c","t":"Nur eine Darstellung, denn Bilder sind nie Quellen.","fb":"Bilder können sehr wohl Quellen sein. Dieses Bild verrät viel über die Zeit, in der es gemalt wurde."}]},
 {"id":"vergleich","type":"frei","key":"weiterdenken_vergleich","name":"Weiterdenken 1848 und 1871","tag":"Weiterdenken · Vergleich",
  "frage":"Vergleiche 1848 und 1871: Wer wollte die Einheit schaffen, und auf welchem Weg? Was wurde jeweils aus der Freiheit? Schreibe drei bis fünf Sätze.",
  "platz":"1848 wollten ... Dagegen 1871 ... Deshalb ...",
  "min":80,"kurz":"Deine Antwort ist noch sehr kurz. Nenne für beide Jahre, wer handelte und was aus der Freiheit wurde.",
  "gruppen":[{"w":["1848","paulskirche","nationalversammlung","abgeordnet","parlament","von unten","volk"],"tipp":"Beschreibe, wer 1848 die Einheit schaffen wollte."},
             {"w":["1871","bismarck","furst","krieg","militar","von oben"],"tipp":"Beschreibe, wer 1871 die Einheit schuf und wie."},
             {"w":["freiheit","grundrecht","demokrat","mitbestimm","verfassung"],"tipp":"Sage etwas dazu, was jeweils aus der Freiheit wurde."}],
  "gut":"Ein starker Vergleich. Du zeigst: 1848 wollte man Einheit durch Freiheit, 1871 kam die Einheit durch Krieg, und die Freiheit trat zurück."},
]

M = {
 "nr":"010","titel":"Wie entstand 1871 das Deutsche Kaiserreich?","bereich":BEREICH,
 "hero":"Was die Paulskirche 1849 nicht geschafft hatte, gelang 22 Jahre später: ein deutscher Nationalstaat. Aber auf einem ganz anderen Weg. Du verfolgst drei Kriege, eine gekürzte Nachricht und eine Feier in einem französischen Schloss. Und du prüfst, ob ein berühmtes Gemälde die Wahrheit zeigt.",
 "ziele":["Du beschreibst Bismarcks Politik und die drei Einigungskriege.",
          "Du erklärst an der Emser Depesche eine Kette von Ursachen und Folgen.",
          "Du erläuterst, warum man von einer Reichsgründung „von oben“ spricht.",
          "Du beschreibst ein Gemälde als Bildquelle und liest es kritisch.",
          "Du unterscheidest Quelle und Darstellung je nach Fragestellung."],
 "mission":'''<div class="akte">
 <span class="stamp">Akte 010</span>
 <p><strong>Fall:</strong> In Chronos' Archiv hängt ein Kunstdruck: ein Saal voller Spiegel, Offiziere mit erhobenen Säbeln, ein Mann in leuchtend weißer Uniform. Darunter steht: „So wurde das Deutsche Reich gegründet“.</p>
 <p><strong>Dein Auftrag:</strong> Finde heraus, wie das Kaiserreich wirklich entstand. Prüfe, ob das Bild die Ereignisse genau zeigt. Am Ende entscheidest du über Chronos' Karteikarte.</p>
</div>''' + chronos("Ich gebe zu, ich mag dieses Bild. So feierlich! Auf meine Karteikarte habe ich geschrieben: „1871 schlossen sich die Deutschen freiwillig und gemeinsam zu einem Reich zusammen.“ Aber wer war eigentlich gemeint mit „die Deutschen“? Finde es heraus."),
 "dtext":"Woran denkst du bei dem Wort „Kaiserreich“? Schreibe ein oder zwei Gedanken auf.",
 "inhalt":inhalt,
 "nav":[("kriege","Einigungskriege"),("depesche","Emser Depesche"),("versailles","Kaiserproklamation"),("quelle","Die Quelle")],
 "glossar":[("Otto von Bismarck","Ab 1862 preußischer Ministerpräsident, ab 1871 erster Reichskanzler. Er einte Deutschland unter preußischer Führung."),
            ("Einigungskriege","Die drei Kriege Preußens 1864 gegen Dänemark, 1866 gegen Österreich und 1870/71 gegen Frankreich."),
            ("Norddeutscher Bund","Bundesstaat der nord- und mitteldeutschen Staaten unter Führung Preußens von 1867 bis 1871."),
            ("Emser Depesche","Bericht über ein Gespräch in Bad Ems 1870. Bismarck veröffentlichte ihn gekürzt und verschärft. Frankreich erklärte daraufhin den Krieg."),
            ("Kaiserproklamation","Die feierliche Ausrufung Wilhelms I. zum Deutschen Kaiser am 18. Januar 1871 in Versailles."),
            ("Reichsgründung von oben","Die Einheit wurde von Fürsten, Regierungen und Militär geschaffen, nicht von einer Volksbewegung oder einem gewählten Parlament."),
            ("Bildquelle","Ein Bild aus der Vergangenheit, das man wie einen Text befragt: Wer hat es gemacht, wann, für wen und warum?")],
 "karte":"1871 schlossen sich die Deutschen freiwillig und gemeinsam zu einem Reich zusammen.",
 "a1frage":"Wie entscheidest du über die Karteikarte?",
 "a2frage":"Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, wie das Kaiserreich 1871 entstand und warum man von einer Gründung „von oben“ spricht. Gehe auch kurz auf das Gemälde ein.",
 "a2platz":"Lieber Chronos, deine Karte stimmt so nicht, weil ...",
 "a2satz":"„Das Kaiserreich entstand durch ...“ · „Bismarck führte ...“ · „Bei der Kaiserproklamation waren ...“ · „Deshalb spricht man von oben, weil ...“ · „Das Gemälde zeigt ..., aber ...“",
 "data":{
  "tasks":tasks,
  "badges":[{"n":"Ordnungssinn","ids":["zuord","kette"]},{"n":"Bilddetektiv","ids":["hot"]},{"n":"Quellenprüfer","ids":["wfragen","fehler"]},{"n":"Begründer","ids":["a2"]}],
  "diag":[{"tag":"Schätzfrage","frage":"Wo wurde 1871 der deutsche Kaiser ausgerufen?","opts":[{"v":"a","t":"In Berlin"},{"v":"b","t":"In Versailles bei Paris"},{"v":"c","t":"In Frankfurt am Main"}],"ok":"b","tipp":"Vorab: Es war in Frankreich, mitten im Krieg."},
          {"tag":"Richtig oder falsch","frage":"Das Deutsche Kaiserreich entstand nach mehreren Kriegen.","opts":[{"v":"r","t":"Das stimmt"},{"v":"f","t":"Das stimmt nicht"}],"ok":"r","tipp":"Es waren drei Kriege."},
          {"tag":"Vermutung","frage":"Ist ein Gemälde, das ein Maler nach eigenen Skizzen von einem Ereignis malt, immer genau wie ein Foto?","opts":[{"v":"a","t":"Nein, ein Maler kann Dinge weglassen, hinzufügen oder hervorheben"},{"v":"b","t":"Ja, Maler bilden immer alles genau ab"},{"v":"c","t":"Ja, wenn das Bild teuer war"}],"ok":"a"}],
  "a1":[{"v":"ok","t":"Die Karte stimmt. Die Deutschen haben sich gemeinsam für das Reich entschieden.","ok":False,"fb":"Wer hat entschieden? Es waren Fürsten, Regierungen und Militär. Eine Abstimmung des Volkes gab es nicht, und vorher gab es drei Kriege."},
         {"v":"teil","t":"Die Karte stimmt nur zum Teil. Es entstand ein gemeinsames Reich, aber Fürsten und Militär schufen es nach drei Kriegen, nicht das Volk.","ok":True,"fb":"Das Ergebnis war ein Nationalstaat, den viele begrüßten. Der Weg dahin war aber eine Gründung von oben."},
         {"v":"falsch","t":"Die Karte ist falsch. 1871 entstand gar kein deutscher Staat.","ok":False,"fb":"Doch, 1871 entstand das Deutsche Kaiserreich. Der Streitpunkt ist, wie und durch wen es entstand."}],
  "a2":{"start":"Beginne mit: „Das Kaiserreich entstand durch ...“",
        "fach":[["bismarck","Bismarck"],["einigungskrieg","Einigungskriege"],["kaiserproklamation","Kaiserproklamation"],["versailles","Versailles"],["spiegelsaal","Spiegelsaal"],["von oben","von oben"],["norddeutsch","Norddeutscher Bund"],["emser depesche","Emser Depesche"],["furst","Fürsten"],["militar","Militär"],["wilhelm","Wilhelm I."],["kaiserreich","Kaiserreich"]],
        "fachTipp":"Einigungskriege, Kaiserproklamation, Versailles oder von oben",
        "themen":[{"w":["krieg","1864","1866","1870","danemark","osterreich","frankreich"],"gut":"Du nennst die Kriege als Weg zur Einheit.","tipp":"Nenne die Kriege, die zur Einheit führten."},
                  {"w":["von oben","furst","militar","offizier","nicht das volk","kein parlament","ohne parlament","abgeordnete"],"gut":"Du erklärst, warum man von einer Gründung von oben spricht.","tipp":"Erkläre, wer das Reich gründete und wer nicht beteiligt war."},
                  {"w":["gemalde","bild","werner","maler"],"gut":"Du gehst auf das Gemälde ein.","tipp":"Gehe kurz auf das Gemälde von Anton von Werner ein."}],
        "voll":"Sehr gut. Du verbindest Ereignisse, Deutung und Bildquelle zu einem begründeten Urteil."},
  "lc":["Ich kann die drei Einigungskriege mit Gegnern und Ergebnissen nennen.",
        "Ich kann erklären, was eine Reichsgründung „von oben“ bedeutet.",
        "Ich kann ein Gemälde als Bildquelle beschreiben und kritisch prüfen."],
  "komp":{"fachwissen":["zuord"],"zeit_raum":["zuord","kette"],"quellenarbeit":["wfragen","fehler"],"ursachen_folgen":["kette"],"perspektivitaet":["vonoben","darst"]},
  "next":"Weiter geht es mit Modul 011: Wie demokratisch war das Kaiserreich?"
 }
}

if __name__ == "__main__":
    build(M)
