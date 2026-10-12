import sys; sys.path.insert(0, '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/gesch/w_8842/j8')
from eng8 import build, chronos, task

BEREICH = "Nation und politische Teilhabe"

JAHRE = [1815, 1832, 1848, 1866, 1871, 1890, 1918]
def xj(j): return 40 + (j - 1810) / 110 * 560

def zeit_svg():
    s = ('<div class="svgwrap"><svg class="bild" viewBox="0 0 640 200" role="img" aria-label="Zeitstrahl von 1810 bis 1920 mit sieben markierten Jahren: 1815, 1832, 1848, 1866, 1871, 1890 und 1918. Die Markierungen sind antippbar.">'
         '<rect width="640" height="200" fill="#f7f8fa"/>'
         '<path d="M30 100 H612" stroke="#37546b" stroke-width="5"/><path d="M612 90 l16 10 l-16 10 z" fill="#37546b"/>')
    for d in range(1810, 1921, 10):
        x = xj(d)
        s += '<path d="M%.0f 94 v12" stroke="#55606a" stroke-width="2"/>' % x
    s += '<text x="%.0f" y="190" font-size="17" text-anchor="middle" fill="#55606a">1810</text>' % xj(1810)
    s += '<text x="%.0f" y="190" font-size="17" text-anchor="middle" fill="#55606a">1920</text>' % xj(1920)
    for i, j in enumerate(JAHRE):
        x = xj(j); up = i % 2 == 0
        ty = 52 if up else 158
        s += ('<g class="hot" data-task="hot" id="h013J%d" tabindex="0" role="button" aria-label="Jahr %d">'
              '<path d="M%.0f 100 V%d" stroke="#aa6d18" stroke-width="2"/>'
              '<circle cx="%.0f" cy="100" r="13" fill="#aa6d18" stroke="#fff" stroke-width="3"/>'
              '<rect x="%.0f" y="%d" width="64" height="34" rx="8" fill="#fff" stroke="#aa6d18" stroke-width="2"/>'
              '<text x="%.0f" y="%d" font-size="21" font-weight="700" text-anchor="middle" fill="#172430">%d</text>'
              '<rect x="%.0f" y="%d" width="66" height="%d" fill="#000" opacity="0"/></g>') % (
              j, j, x, (ty + 34 if up else ty), x, x - 32, ty, x, ty + 25, j,
              x - 33, (ty if up else 114), (86 - ty if up else ty + 34 - 114))
    s += '</svg></div>'
    return s

inhalt = '''
<section class="card" id="zeitstrahl">
<h2>Der Zeitstrahl</h2>
<p>Von 1815 bis 1918 ist viel passiert. Tippe auf dem Zeitstrahl das gesuchte Jahr an. Du kannst auch die Knöpfe unter dem Bild benutzen.</p>
''' + zeit_svg() + '''
''' + task('hot') + '''
</section>

<section class="card" id="epochen">
<h2>Ereignisse ordnen</h2>
<p>Ordne jedes Ereignis dem passenden Zeitabschnitt zu.</p>
''' + task('zuord') + '''
</section>

<section class="card" id="begriffe">
<h2>Fachbegriffe</h2>
<p>Wiederhole die wichtigsten Begriffe aus den Modulen 008 bis 012.</p>
''' + task('begriffe') + '''
</section>

<section class="card" id="ursachen">
<h2>Ursachen und Folgen</h2>
<p>Geschichte ist eine Kette von Ursachen und Folgen. Finde zu jeder Ursache die passende Folge.</p>
''' + task('ursachen') + '''
</section>

<section class="card" id="quelle">
<h2>Quellen wiederholen</h2>
<p>In den Modulen hast du mit vielen Quellen gearbeitet: einem Lied, Reden, einem Brief, Verfassungen, einem Gemälde und einer Streitschrift.</p>
<div class="akte">
 <span class="stamp">Merkkasten</span>
 <p>Eine <strong>Quelle</strong> stammt aus der Zeit, die man untersucht. Eine <strong>Darstellung</strong> entsteht später und erklärt die Vergangenheit, zum Beispiel ein Schulbuchtext. An jede Quelle stellt man die W-Fragen: <strong>Wer</strong> hat sie gemacht? <strong>Wann</strong>? <strong>Für wen</strong>? <strong>Warum</strong>? Und: Was sagt sie, und was sagt sie nicht?</p>
</div>
''' + task('quellen') + '''
''' + task('werner') + '''
</section>

<section class="card" id="merksaetze">
<h2>Merksätze prüfen</h2>
<p>Nicht jeder Satz, den man oft hört, stimmt. Manche sind zu einfach.</p>
''' + task('merksatz') + '''
''' + task('wahr') + '''
''' + task('teilhabe', 'weiter') + '''
</section>
'''

tasks = [
 {"id":"hot","type":"hot","key":"zeitstrahl","name":"Zeitstrahl","tag":"Zeitleiste",
  "targets":[{"id":"h013J1848","tipp":"Tippe auf das Jahr, in dem die Nationalversammlung in der Paulskirche zusammentrat.","ok":"Richtig. Im Mai 1848 trat die Nationalversammlung in Frankfurt zusammen."},
             {"id":"h013J1871","tipp":"Tippe auf das Jahr, in dem Wilhelm I. in Versailles zum Kaiser ausgerufen wurde.","ok":"Richtig. Am 18. Januar 1871 wurde das Kaiserreich ausgerufen."},
             {"id":"h013J1832","tipp":"Tippe auf das Jahr des Hambacher Festes.","ok":"Richtig. Im Mai 1832 feierten 20.000 bis 30.000 Menschen in Hambach für Einheit und Freiheit."},
             {"id":"h013J1918","tipp":"Tippe auf das Jahr, in dem Frauen in Deutschland das Wahlrecht bekamen.","ok":"Richtig. Im November 1918 erhielten Frauen das Wahlrecht."}],
  "all":[{"id":"h013J%d" % j,"name":str(j)} for j in JAHRE],
  "fertig":"Alle vier Jahre gefunden.",
  "ok":"Du hast den Überblick: Vom Wiener Kongress bis zum Frauenwahlrecht vergingen mehr als hundert Jahre."},
 {"id":"zuord","type":"zuord","key":"epochen","name":"Ereignisse ordnen","tag":"Zuordnen",
  "titel":"Welcher Zeitabschnitt?",
  "frage":"Ordne jede Karte dem passenden Zeitabschnitt zu.",
  "zones":[{"id":"vormaerz","t":"1815 bis 1847: Deutscher Bund"},{"id":"rev","t":"1848 und 1849: Revolution"},{"id":"gruendung","t":"1864 bis 1871: Reichsgründung"},{"id":"reich","t":"1871 bis 1914: Kaiserreich"}],
  "cards":[{"id":"c1","t":"Karlsbader Beschlüsse","z":"vormaerz"},
           {"id":"c2","t":"Göttinger Sieben","z":"vormaerz"},
           {"id":"c3","t":"Grundrechte des deutschen Volkes","z":"rev"},
           {"id":"c4","t":"Kaiserkrone wird abgelehnt","z":"rev"},
           {"id":"c5","t":"Schlacht bei Königgrätz","z":"gruendung"},
           {"id":"c6","t":"Emser Depesche","z":"gruendung"},
           {"id":"c7","t":"Kulturkampf","z":"reich"},
           {"id":"c8","t":"Hauptmann von Köpenick","z":"reich"}],
  "hilfe":"Wenn du unsicher bist: Göttingen gehörte zu Hannover und der Protest war 1837. Königgrätz war 1866, die Emser Depesche 1870.",
  "ok":"Alle richtig. Du kannst die Ereignisse sicher den Zeitabschnitten zuordnen.",
  "hint":"Prüfe die rot markierten Karten. Der Lernweg „Sicher werden“ zeigt dir eine Hilfe."},
 {"id":"begriffe","type":"sel","key":"begriffe","name":"Fachbegriffe","tag":"Begriffe","wide":True,
  "titel":"Welcher Begriff passt?",
  "frage":"Wähle zu jeder Erklärung den passenden Fachbegriff.",
  "choices":["Nationalbewegung","Restauration","Grundrechte","Gottesgnadentum","Reichsgründung von oben","Dreiklassenwahlrecht","Militarismus"],
  "rows":[{"t":"Menschen, die nach 1815 Einheit und Freiheit für Deutschland forderten","ok":"Nationalbewegung","fb":"Denke an Wartburg und Hambach."},
          {"t":"Die Fürsten stellen nach 1815 die alte Ordnung wieder her","ok":"Restauration","fb":"Das Wort bedeutet Wiederherstellung."},
          {"t":"Rechte jedes Menschen gegenüber dem Staat, 1848 in der Paulskirche beschlossen","ok":"Grundrechte","fb":"Zum Beispiel Meinungs- und Glaubensfreiheit."},
          {"t":"Ein König erhält seine Macht von Gott, nicht vom Volk","ok":"Gottesgnadentum","fb":"Damit begründete Friedrich Wilhelm IV. seine Ablehnung."},
          {"t":"Fürsten und Militär schaffen 1871 den Nationalstaat, nicht das Volk","ok":"Reichsgründung von oben","fb":"Denke an Versailles."},
          {"t":"Die Stimmen der Reichen zählen mehr als die der Armen","ok":"Dreiklassenwahlrecht","fb":"So wurde in Preußen gewählt."},
          {"t":"Uniform, Gehorsam und Militär prägen das ganze Leben","ok":"Militarismus","fb":"Denke an den Hauptmann von Köpenick."}],
  "hilfe":"Lies jede Erklärung und suche das Schlüsselwort: Einheit, wiederherstellen, Rechte, Gott, von oben, Steuern, Uniform.",
  "ok":"Alle Begriffe sitzen. Mit diesen Wörtern kannst du die Geschichte des 19. Jahrhunderts genau beschreiben.",
  "hint":"Die richtigen Auswahlen sind grün umrandet."},
 {"id":"ursachen","type":"sel","key":"ursachen_folgen","name":"Ursachen und Folgen","tag":"Ursache und Folge","wide":True,
  "titel":"Was folgte daraus?",
  "frage":"Wähle zu jeder Ursache die passende Folge.",
  "choices":["Die Fürsten beschließen Zensur und Überwachung","Die Verfassung der Paulskirche tritt nicht in Kraft","Frankreich erklärt Preußen den Krieg","Das Sozialistengesetz verbietet sozialdemokratische Vereine","Viele Menschen wandern nach Amerika aus"],
  "rows":[{"t":"Studenten fordern 1817 auf der Wartburg Einheit und Freiheit.","ok":"Die Fürsten beschließen Zensur und Überwachung","fb":"Denke an die Karlsbader Beschlüsse von 1819."},
          {"t":"Friedrich Wilhelm IV. lehnt 1849 die Kaiserkrone ab.","ok":"Die Verfassung der Paulskirche tritt nicht in Kraft","fb":"Ohne Kaiser und gegen Preußen und Österreich konnte die Verfassung nicht gelten."},
          {"t":"Bismarck veröffentlicht 1870 die gekürzte Emser Depesche.","ok":"Frankreich erklärt Preußen den Krieg","fb":"Frankreich fühlte sich beleidigt."},
          {"t":"Die Sozialdemokraten gewinnen immer mehr Anhänger.","ok":"Das Sozialistengesetz verbietet sozialdemokratische Vereine","fb":"Bismarck sah sie als Reichsfeinde."},
          {"t":"Heuerleute im Emsland haben kein eigenes Land und wenig Aussicht auf Besserung.","ok":"Viele Menschen wandern nach Amerika aus","fb":"In Amerika gab es Land zu kaufen."}],
  "hilfe":"Jede Folge passt genau zu einer Ursache.",
  "ok":"Sehr gut. Du erkennst Zusammenhänge über das ganze Jahrhundert.",
  "hint":"Die richtigen Auswahlen sind grün umrandet."},
 {"id":"quellen","type":"sel","key":"quellen_erkennen","name":"Quellen erkennen","tag":"Quellen erkennen","wide":True,
  "titel":"Wer hat das gesagt oder geschrieben?",
  "frage":"Wähle zu jedem Zitat die passende Quelle.",
  "choices":["Johann Georg August Wirth, Hambacher Fest 1832","Hoffmann von Fallersleben, Lied der Deutschen 1841","Friedrich Wilhelm IV., Brief an Bunsen 1848","Reichsverfassung 1871","Hedwig Dohm, Schrift zum Frauenstimmrecht 1876"],
  "rows":[{"t":"„Hoch! Dreimal hoch leben die vereinigten Freistaaten Deutschlands!“","ok":"Johann Georg August Wirth, Hambacher Fest 1832","fb":"Freistaaten, also Republiken: eine Rede auf einem großen Fest."},
          {"t":"„Einigkeit und Recht und Freiheit für das deutsche Vaterland!“","ok":"Hoffmann von Fallersleben, Lied der Deutschen 1841","fb":"Heute ist das unsere Nationalhymne."},
          {"t":"„Einen solchen imaginären Reif, aus Dreck und Letten gebacken …“","ok":"Friedrich Wilhelm IV., Brief an Bunsen 1848","fb":"Es geht um eine Krone, die ein König ablehnt."},
          {"t":"„Der Reichstag geht aus allgemeinen und direkten Wahlen mit geheimer Abstimmung hervor.“","ok":"Reichsverfassung 1871","fb":"Ein Gesetzestext über den Reichstag."},
          {"t":"„Die Menschenrechte haben kein Geschlecht.“","ok":"Hedwig Dohm, Schrift zum Frauenstimmrecht 1876","fb":"Eine Forderung der Frauenbewegung."}],
  "hilfe":"Achte auf Schlüsselwörter: Freistaaten, Vaterland, Reif, Reichstag, Geschlecht.",
  "ok":"Alle Quellen erkannt. Jede zeigt eine andere Perspektive: Revolutionär, Dichter, König, Staat und Frauenrechtlerin.",
  "hint":"Die richtigen Auswahlen sind grün umrandet."},
 {"id":"werner","type":"mc","key":"quellenkritik","name":"Quellenkritik Gemälde","tag":"Quellenkritik",
  "frage":"Anton von Werner malte 1885 die Kaiserproklamation von 1871 als Geschenk für Bismarck. Was gilt für dieses Bild?",
  "opts":[{"v":"a","t":"Es zeigt vor allem, wie man sich 1885 an die Reichsgründung erinnern wollte. Manche Details hat der Maler verändert.","ok":True,"fb":"Richtig. Bismarck in weißer Uniform und der eingefügte Roon zeigen: Das Bild ist eine Deutung im Sinne der Auftraggeber."},
          {"v":"b","t":"Es zeigt genau, was am 18. Januar 1871 geschah, weil der Maler dabei war.","fb":"Er war dabei, aber er malte 14 Jahre später im Auftrag und veränderte einiges, zum Beispiel Bismarcks Uniform."},
          {"v":"c","t":"Es ist wertlos für Historiker, weil es nicht ganz stimmt.","fb":"Auch ein ungenaues Bild ist wertvoll. Es zeigt, wie die Zeit um 1885 die Reichsgründung sehen wollte."}]},
 {"id":"merksatz","type":"mc","key":"merksatz","name":"Merksatz prüfen","tag":"Merksatz prüfen",
  "frage":"Welcher dieser Merksätze ist zu einfach und deshalb irreführend?",
  "opts":[{"v":"a","t":"„Mit der Reichsgründung 1871 war Deutschland eine Demokratie.“","ok":True,"fb":"Richtig erkannt. Es gab ein Männerwahlrecht für den Reichstag, aber der Kaiser ernannte den Kanzler, Frauen durften nicht wählen, und in Preußen galt das Dreiklassenwahlrecht. Das Kaiserreich war eine konstitutionelle Monarchie."},
          {"v":"b","t":"„Die Grundrechte von 1848 wirkten bis ins Grundgesetz weiter.“","fb":"Dieser Satz stimmt. Viele Grundrechte von 1848 stehen heute fast gleich im Grundgesetz."},
          {"v":"c","t":"„Die Nationalbewegung forderte Einheit und Freiheit.“","fb":"Dieser Satz stimmt. Das war ihr Motto."}]},
 {"id":"wahr","type":"multi","key":"aussagen","name":"Aussagen prüfen","tag":"Mehrfachauswahl",
  "frage":"Welche Aussagen stimmen? Wähle alle zutreffenden aus.",
  "opts":[{"v":"emsland","t":"Das Emsland gehörte bis 1866 zum Königreich Hannover und danach zu Preußen.","ok":True},
          {"v":"windthorst","t":"Ludwig Windthorst vertrat das Emsland im Reichstag und war Bismarcks Gegenspieler im Kulturkampf.","ok":True},
          {"v":"frauen","t":"Frauen durften im Kaiserreich den Reichstag mitwählen.","fb":"Frauen durften erst ab November 1918 wählen."},
          {"v":"krone","t":"Friedrich Wilhelm IV. nahm die Kaiserkrone 1849 dankbar an.","fb":"Er lehnte sie ab, weil sie vom Parlament und nicht von den Fürsten kam."},
          {"v":"krieg","t":"Vor der Reichsgründung führte Preußen drei Kriege.","ok":True}],
  "hilfe":"Drei Aussagen stimmen.",
  "ok":"Richtig. Du kennst wichtige Fakten aus der ganzen Einheit, auch aus unserer Region.",
  "hint":"Drei Aussagen stimmen."},
 {"id":"teilhabe","type":"frei","key":"weiterdenken_teilhabe","name":"Weiterdenken Teilhabe","tag":"Weiterdenken · Urteil",
  "frage":"Wer gewann zwischen 1815 und 1914 politische Teilhabe dazu, und wer blieb ausgeschlossen? Nenne mindestens zwei Gruppen und begründe.",
  "platz":"Mehr Teilhabe bekamen ..., weil ... Ausgeschlossen blieben ...",
  "min":70,"kurz":"Deine Antwort ist noch sehr kurz. Nenne eine Gruppe, die Teilhabe gewann, und eine, die ausgeschlossen blieb.",
  "gruppen":[{"w":["manner","mann","wahler","burger","arbeiter"],"tipp":"Nenne eine Gruppe, die mehr Teilhabe bekam, zum Beispiel die Männer mit dem Reichstagswahlrecht."},
             {"w":["frau","katholik","sozialdemokrat","arm","polen"],"tipp":"Nenne eine Gruppe, die ausgeschlossen oder benachteiligt blieb."},
             {"w":["reichstag","wahlrecht","dreiklassen","sozialistengesetz","kulturkampf","1918","1871"],"tipp":"Belege mit einem Fachbegriff oder Ereignis."}],
  "gut":"Ein abgewogenes Urteil. Du zeigst, dass Teilhabe im 19. Jahrhundert wuchs, aber ungleich verteilt blieb."},
]

M = {
 "nr":"013","titel":"Lerncheck: Nation, Reich und politische Teilhabe","bereich":BEREICH,
 "hero":"Vom Wiener Kongress bis zum Kaiserreich: Hier wiederholst du die Module 008 bis 012. Zeitstrahl, Begriffe, Ursachen und Folgen, Quellen und Merksätze. Am Ende fällst du ein Urteil über die große Frage des Jahrhunderts: Einheit und Freiheit.",
 "ziele":["Du ordnest die wichtigsten Ereignisse von 1815 bis 1918 zeitlich ein.",
          "Du erklärst zentrale Fachbegriffe der Einheit.",
          "Du verbindest Ursachen und Folgen.",
          "Du erkennst Quellen wieder und prüfst sie kritisch.",
          "Du beurteilst, wie Einheit und Freiheit im 19. Jahrhundert verwirklicht wurden."],
 "mission":'''<div class="akte">
 <span class="stamp">Akte 013</span>
 <p><strong>Fall:</strong> Chronos räumt die Akten von fünf Ermittlungen zusammen: Nation, Revolution, Reichsgründung, Kaiserreich und Alltag. Auf dem Deckel der Sammelmappe steht eine Karteikarte: „1871 wurden Einheit und Freiheit gemeinsam erreicht.“</p>
 <p><strong>Dein Auftrag:</strong> Zeige, was du gelernt hast, und prüfe am Ende diese Karte.</p>
</div>''' + chronos("Fünf Akten, ein Jahrhundert. Ich bin stolz auf dich, wenn du hier alles ordnest. Aber sei streng mit meiner Karteikarte. Die Nationalbewegung hatte ja ein Motto mit zwei Wörtern. Wurden wirklich beide erfüllt?"),
 "dtext":"Was ist dir aus den Modulen 008 bis 012 am stärksten im Gedächtnis geblieben?",
 "inhalt":inhalt,
 "nav":[("zeitstrahl","Zeitstrahl"),("epochen","Ereignisse ordnen"),("begriffe","Fachbegriffe"),("ursachen","Ursachen und Folgen"),("quelle","Quellen"),("merksaetze","Merksätze")],
 "glossar":[("Nation","Gemeinschaft von Menschen, die sich durch Sprache, Geschichte und Kultur verbunden fühlen."),
            ("Deutscher Bund","Lockerer Bund von fast 40 deutschen Staaten von 1815 bis 1866."),
            ("Nationalversammlung","Gewähltes Parlament in der Frankfurter Paulskirche 1848 und 1849."),
            ("Grundrechte","Rechte jedes Menschen gegenüber dem Staat, 1848 erstmals für ganz Deutschland beschlossen."),
            ("Einigungskriege","Kriege Preußens 1864, 1866 und 1870/71, die zur Reichsgründung führten."),
            ("Konstitutionelle Monarchie","Monarchie mit Verfassung und Parlament, in der der Monarch die Regierung bestimmt."),
            ("Politische Teilhabe","Die Möglichkeit, an politischen Entscheidungen mitzuwirken, zum Beispiel durch Wahlen, Parteien oder Vereine.")],
 "karte":"1871 wurden Einheit und Freiheit gemeinsam erreicht.",
 "a1frage":"Wie entscheidest du über die Karteikarte?",
 "a2frage":"Schreibe Chronos eine Nachricht. Beurteile in drei bis fünf Sätzen, ob 1871 Einheit und Freiheit erreicht wurden. Nutze Wissen aus mindestens zwei Modulen.",
 "a2platz":"Lieber Chronos, deine Karte stimmt nur zur Hälfte, weil ...",
 "a2satz":"„Die Einheit wurde 1871 erreicht, weil ...“ · „Die Freiheit kam nur teilweise, denn ...“ · „Schon 1848 ...“ · „Außerdem ...“ · „Deshalb ...“",
 "data":{
  "tasks":tasks,
  "badges":[{"n":"Zeitkenner","ids":["hot","zuord"]},{"n":"Begriffsprofi","ids":["begriffe"]},{"n":"Quellenprüfer","ids":["quellen","werner"]},{"n":"Begründer","ids":["a2"]}],
  "diag":[{"tag":"Wiederholung","frage":"Was war das Motto der Nationalbewegung?","opts":[{"v":"a","t":"Einheit und Freiheit"},{"v":"b","t":"Ruhe und Ordnung"},{"v":"c","t":"Gott und König"}],"ok":"a","tipp":"Das Motto lautete Einheit und Freiheit."},
          {"tag":"Richtig oder falsch","frage":"Das Kaiserreich wurde 1871 in Versailles ausgerufen.","opts":[{"v":"r","t":"Das stimmt"},{"v":"f","t":"Das stimmt nicht"}],"ok":"r","tipp":"Es war der Spiegelsaal von Versailles."},
          {"tag":"Vermutung","frage":"Was meinst du: Wurde 1871 eher die Einheit oder eher die Freiheit verwirklicht?","opts":[{"v":"a","t":"Eher die Einheit"},{"v":"b","t":"Eher die Freiheit"},{"v":"c","t":"Keins von beiden"}],"ok":"a"}],
  "a1":[{"v":"ok","t":"Die Karte stimmt. 1871 wurden beide Ziele erreicht.","ok":False,"fb":"Die Einheit ja. Aber denk an den Kanzler, den der Kaiser ernannte, an das Dreiklassenwahlrecht, an Frauen ohne Wahlrecht und an das Sozialistengesetz."},
         {"v":"teil","t":"Die Karte stimmt nur zur Hälfte. Die Einheit wurde von oben erreicht, die Freiheit nur teilweise: Männerwahlrecht ja, aber keine Regierung durch das Parlament und viele Ausgeschlossene.","ok":True,"fb":"Genau so urteilen viele Historikerinnen und Historiker: Einheit vor Freiheit."},
         {"v":"falsch","t":"Die Karte ist völlig falsch. 1871 wurde gar nichts erreicht.","ok":False,"fb":"Die Einheit wurde 1871 erreicht, und es gab ein für die Zeit modernes Männerwahlrecht. Das ist nicht nichts."}],
  "a2":{"start":"Beginne mit: „Die Einheit wurde 1871 erreicht, weil ...“",
        "fach":[["einheit","Einheit"],["freiheit","Freiheit"],["von oben","von oben"],["bismarck","Bismarck"],["reichstag","Reichstag"],["grundrecht","Grundrechte"],["paulskirche","Paulskirche"],["revolution","Revolution"],["dreiklassen","Dreiklassenwahlrecht"],["kanzler","Reichskanzler"],["wahlrecht","Wahlrecht"],["nationalbewegung","Nationalbewegung"]],
        "fachTipp":"Einheit, Freiheit, Reichstag, Revolution oder von oben",
        "themen":[{"w":["einheit","1871","kaiserreich","reich","bismarck"],"gut":"Du gehst auf die Einheit von 1871 ein.","tipp":"Erkläre, wie die Einheit 1871 erreicht wurde."},
                  {"w":["freiheit","wahlrecht","frauen","kanzler","dreiklassen","sozialistengesetz","teilweise"],"gut":"Du prüfst, wie es um die Freiheit stand.","tipp":"Prüfe, wie es um die Freiheit stand, zum Beispiel beim Wahlrecht oder beim Reichskanzler."},
                  {"w":["1848","paulskirche","revolution","nationalversammlung","grundrecht","hambach","wartburg","1832"],"gut":"Du nutzt Wissen aus einem früheren Modul.","tipp":"Nutze Wissen aus einem früheren Modul, zum Beispiel über 1848."}],
        "voll":"Sehr gut. Du verbindest Wissen aus mehreren Modulen zu einem begründeten Urteil."},
  "lc":["Ich kann die wichtigsten Ereignisse von 1815 bis 1918 zeitlich ordnen.",
        "Ich kann die zentralen Fachbegriffe dieser Einheit erklären.",
        "Ich kann begründet beurteilen, wie Einheit und Freiheit im 19. Jahrhundert verwirklicht wurden."],
  "komp":{"fachwissen":["begriffe","wahr"],"zeit_raum":["hot","zuord"],"quellenarbeit":["quellen","werner"],"ursachen_folgen":["ursachen"],"perspektivitaet":["merksatz"]},
  "next":"Weiter geht es mit Modul 014: Warum eroberten europäische Mächte Kolonien?"
 }
}

if __name__ == "__main__":
    build(M)
