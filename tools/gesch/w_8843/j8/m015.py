import maps

HINWEIS = '''<div class="notice calm"><strong>Bevor du startest:</strong> In diesem Modul geht es um Zwangsarbeit, Gewalt und Tod. Wir beschreiben das sachlich und zeigen keine Bilder von Gewalt. Wenn dich etwas belastet, mach eine Pause und sprich mit deiner Lehrkraft oder mit der Schulsozialarbeit.</div>'''

AFRIKA = '<div class="svgwrap">' + maps.svg(
    (375, 372), 5, -20, 38, task='h1',
    label='Schematische Karte Afrikas um 1914 mit den Kolonialgebieten. Die gesuchten Gebiete sind antippbar.',
    hot={
        'kongo': ('kongo', 'Gebiet in der Mitte Afrikas'),
        'doa': ('doa', 'Gebiet an der Ostküste südlich des Äquators'),
        'kamerun': ('kamerun', 'Gebiet am Knick der Westküste'),
        'aethiopien': ('aethiopien', 'Weißes Gebiet im Nordosten'),
        'dsw': ('dsw', 'Gebiet im Südwesten'),
        'nigeria': ('nigeria', 'Gebiet an der Westküste nördlich des Äquators'),
        'angola': ('angola', 'Gebiet an der Westküste südlich des Kongo'),
    }) + '''</div>
<ul class="mapkey" aria-label="Legende der Karte">
 <li><i style="background:#e3a19b"></i>Großbritannien</li>
 <li><i style="background:#9ab8de"></i>Frankreich</li>
 <li><i style="background:#e6c15c"></i>Deutsches Reich</li>
 <li><i style="background:#b9a3d4"></i>Belgien</li>
 <li><i style="background:#9fd0a8"></i>Portugal</li>
 <li><i style="background:#8fd0cc"></i>Italien</li>
 <li><i style="background:#e8e0a6"></i>Spanien</li>
 <li><i style="background:#fff;border-color:#55616b"></i>unabhängig</li>
</ul>
<div class="legendlist"><span>Karte: eigene schematische Darstellung, Grenzen um 1914 stark vereinfacht</span></div>'''

PERSONEN = '''<div class="persons" aria-label="Fünf Beispiele">
 <div class="person"><strong>Kinjikitile Ngwale</strong><p>Heiler in Deutsch-Ostafrika. Er verteilte 1905 ein „Maji“, ein Wasser, das Mut machen und vor Kugeln schützen sollte. Die Kolonialmacht ließ ihn 1905 hinrichten.</p></div>
 <div class="person"><strong>Rudolf Duala Manga Bell</strong><p>König der Duala in Kamerun. Er schrieb ab 1912 Bittschriften und beauftragte einen Anwalt in Berlin, um die Enteignung seines Volkes zu verhindern. 1914 wurde er nach einem unfairen Prozess gehängt.</p></div>
 <div class="person"><strong>Menelik II.</strong><p>Kaiser von Äthiopien. Sein Heer besiegte 1896 bei Adwa die italienischen Truppen.</p></div>
 <div class="person"><strong>Familien im Kongo</strong><p>Viele verließen ihre Dörfer und versteckten sich im Wald, um der Kautschukpflicht zu entgehen.</p></div>
 <div class="person"><strong>Arbeiter auf Baumwollfeldern</strong><p>Sie arbeiteten langsam, blieben fern oder beschädigten Pflanzen.</p></div>
</div>'''

MAHARERO = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Samuel Maharero, Brief an Gouverneur Theodor Leutwein, 6. März 1904.</strong> Auszüge. Rechtschreibung wie in der Vorlage, Wörter in eckigen Klammern hat der Herausgeber ergänzt.</p>
 <p>Samuel Maharero war Oberhaupt der Herero in Deutsch-Südwestafrika, dem heutigen Namibia. Im Januar 1904 hatten die Herero den Kampf gegen die deutsche Kolonialherrschaft begonnen. Gouverneur Leutwein fragte Maharero in einem Brief nach den Gründen. Maharero antwortete:</p>
 <p class="quote">„Der Anfang des Krieges ist nicht jetzt in diesem Jahr durch mich begonnen worden, sondern er ist begonnen worden von den Weißen; wie Du weißt, wie viele Hereros durch die weißen Leute, besonders Händler, mit Gewehren und in Gefängnissen getötet sind. Und immer, wenn ich diese Sache nach Windhuk brachte, immer kostete das Blut meiner Leute [nicht mehr, als] einige [Stück] Kleinvieh, nämlich fünfzig oder fünfzehn.“</p>
 <p class="quote">„Die Händler vermehrten die Not noch in der Weise, daß sie aus sich selbst meinen Leuten auf Borg gaben. Nachdem sie so getan, raubten sie sie aus, bis sie soweit gingen, sich bezahlen zu lassen, indem sie für 1 Pfund [Sterling] Schuld zwei oder drei Rinder gewaltsam wegnahmen. Diese Dinge sind es, die den Krieg in diesem Lande erweckt haben.“</p>
 <p class="hint">Fundort: Paul Rohrbach, Deutsche Kolonialwirtschaft, Band 1, Berlin 1907, S. 333 f., hier nach der Quellensammlung „German History in Documents and Images“ des Deutschen Historischen Instituts Washington.</p>
</div>
<details class="gloss"><summary>Wörter, die heute ungewohnt sind</summary><div class="body"><strong>auf Borg geben:</strong> auf Kredit verkaufen, also ohne dass sofort bezahlt wird. <strong>Kleinvieh:</strong> Schafe und Ziegen. <strong>Windhuk:</strong> Sitz der deutschen Kolonialverwaltung, heute Windhoek. <strong>Pfund Sterling:</strong> britisches Geld.</div></details>
<div class="chronos">''' + '''{AV}<div><p class="who">Chronos, Archivar</p><p>In den Akten der Kolonialverwaltung findest du tausende Seiten über die Herero. Von den Herero selbst gibt es nur wenige schriftliche Zeugnisse. Dieser Brief ist eines davon. Lies ihn deshalb besonders genau.</p></div>
</div>'''

M = {
 'num': '015',
 'titel': 'Wie erlebten Kolonisierte den Imperialismus?',
 'bereich': 'Imperialismus und Weltpolitik',
 'intro': 'Die Geschichte des Kolonialismus wird oft aus der Sicht der Eroberer erzählt. In diesem Modul wechselst du die Perspektive: Was bedeutete Kolonialherrschaft für die Menschen in Afrika, und wie wehrten sie sich?',
 'hinweis': HINWEIS,
 'ziele': [
  'Du beschreibst, wie Kolonialherrschaft den Alltag der Menschen veränderte.',
  'Du erklärst am Beispiel des Kongo-Freistaats, wie Ausbeutung und Gewalt zusammenhingen.',
  'Du unterscheidest verschiedene Formen von Widerstand.',
  'Du erklärst Ursachen und Folgen des Maji-Maji-Kriegs in Deutsch-Ostafrika.',
  'Du wertest einen Brief des Herero-Oberhaupts Samuel Maharero aus.',
 ],
 'mission_pre': '''<div class="notice"><strong>Zum Nachdenken:</strong> In alten Büchern steht oft, die Kolonialmächte hätten Afrika „erschlossen“, „befriedet“ oder „entwickelt“. Diese Wörter stammen aus der Sicht der Eroberer. Wie klingt dieselbe Geschichte, wenn man die Menschen fragt, deren Land erobert wurde?</div>''',
 'fall': 'Auf einer alten Karteikarte steht: <em>„Die Menschen in den Kolonien haben die fremde Herrschaft einfach hingenommen.“</em>',
 'auftrag': 'Untersuche, was Kolonialherrschaft für die Menschen bedeutete und wie sie gehandelt haben. Am Ende entscheidest du über die Karte.',
 'chronos': 'Diese Karte habe ich vor vielen Jahren geschrieben. Damals hatte ich fast nur Akten der Kolonialverwaltung gelesen. Heute weiß ich: Wer nur die Akten der Herrschenden liest, hört nur eine Seite. Suchen wir die andere.',
 'diagnose': [
  {'tag': 'Begriff', 'frage': 'Was bedeutet Zwangsarbeit?', 'right': 'a',
   'opts': [('a', 'Menschen müssen gegen ihren Willen arbeiten, oft ohne oder für sehr wenig Lohn'), ('b', 'Arbeit in einer Fabrik mit einem festen Vertrag'), ('c', 'Freiwillige Hilfe in der Nachbarschaft')]},
  {'tag': 'Richtig oder falsch', 'frage': 'In den Kolonien hatten Einheimische dieselben Rechte wie die Europäer.', 'right': 'f',
   'opts': [('r', 'Das stimmt'), ('f', 'Das stimmt nicht')]},
  {'tag': 'Vermutung', 'frage': 'Woher wissen wir, wie Kolonisierte die Herrschaft erlebten?', 'right': 'a',
   'opts': [('a', 'Aus Briefen, Bittschriften, Zeugenaussagen und mündlichen Erzählungen, auch wenn davon weniger erhalten ist als von den Akten der Kolonialherren'), ('b', 'Gar nicht, es gibt keine Zeugnisse von ihnen'), ('c', 'Nur aus Berichten der Kolonialbeamten')]},
 ],
 'diag_msg': ['Zwangsarbeit heißt: Arbeit gegen den eigenen Willen.', 'Einheimische hatten in den Kolonien deutlich weniger Rechte.', 'Es gibt Zeugnisse von Betroffenen. Man muss sie aber oft gezielt suchen.'],
 'sections': [
  {'id': 'alltag', 'nav': 'Was sich änderte', 'h2': 'Was Kolonialherrschaft im Alltag bedeutete',
   'pre': '''<p>Mit der Kolonialherrschaft kamen Beamte, Soldaten, Händler, Siedler und Missionare. Sie bestimmten nun über Land, Arbeit und Recht. Die Menschen, die dort lebten, durften nicht mitentscheiden. Für sie galten eigene, härtere Gesetze.</p>''',
   'tasks': [
    {'id': 'z1', 'type': 'zuord', 'tag': 'Zuordnen', 'name': 'Veränderungen im Alltag', 'key': 'alltag_zuordnen', 'komp': 'fachwissen',
     'frage': 'Ordne jede Karte dem Lebensbereich zu, in den die Kolonialherrschaft eingriff.',
     'zones': [['land', 'Land und Besitz'], ['arbeit', 'Arbeit und Steuern'], ['recht', 'Recht und Gewalt'], ['kultur', 'Kultur und Glaube']],
     'cards': [
      ['Siedler und Gesellschaften nehmen Weideland und Wasserstellen', 'land'],
      ['Familien verlieren ihr Vieh durch Schulden oder Beschlagnahme', 'land'],
      ['Eine Hütten- oder Kopfsteuer muss in Geld bezahlt werden', 'arbeit'],
      ['Dörfer müssen Baumwolle oder Kautschuk für die Kolonialherren liefern', 'arbeit'],
      ['Für Einheimische gelten härtere Gesetze, auch Prügelstrafen', 'recht'],
      ['Kolonialbeamte setzen Herrscher ab und andere ein', 'recht'],
      ['Religiöse Bräuche werden verboten oder verspottet', 'kultur'],
      ['Die eigene Kultur wird als „rückständig“ abgewertet', 'kultur'],
     ],
     'ok': 'Alle acht richtig. Kolonialherrschaft griff in jeden Lebensbereich ein. Besonders folgenreich war die Steuer in Geld: Wer kein Geld hatte, musste für die Europäer arbeiten.',
     'hint': 'Frage dich: Geht es um Besitz, um Arbeit und Abgaben, um Gesetze und Strafen oder um Glauben und Kultur?',
     'post': '<div class="notice" data-lw="sicher"><strong>Hilfe:</strong> Land und Besitz: Weideland, Vieh. Arbeit und Steuern: Abgaben, Lieferpflichten. Recht und Gewalt: Gesetze, Strafen, Herrscher. Kultur und Glaube: Bräuche, Abwertung.</div>'},
    {'id': 's1', 'type': 'single', 'tag': 'Ursache und Folge', 'name': 'Steuer in Geld', 'key': 'steuer_geld', 'komp': 'ursachen_folgen',
     'frage': 'Warum verlangten Kolonialverwaltungen Steuern in Geld und nicht in Waren wie Getreide oder Vieh?',
     'opts': [('a', 'Wer Geld brauchte, musste auf Plantagen, beim Bahnbau oder für Händler arbeiten. So bekamen die Kolonialherren billige Arbeitskräfte.'),
              ('b', 'Weil Geld leichter zu tragen ist als Getreide.'),
              ('c', 'Weil die Menschen in Afrika sich das so gewünscht hatten.')],
     'right': 'a',
     'ok': 'Richtig. Die Geldsteuer war ein Werkzeug, um Menschen zur Arbeit für die Kolonialwirtschaft zu zwingen. Ihre eigenen Felder blieben dabei oft liegen.',
     'fb': {'b': 'Das klingt praktisch, war aber nicht der Grund. Überlege: Wie kam jemand an Geld, der bisher von seinen Feldern und seinem Vieh lebte?', 'c': 'Nein. Niemand wurde gefragt. Die Steuer wurde mit Zwang eingetrieben.'}},
   ]},
  {'id': 'kongo', 'nav': 'Kongo-Freistaat', 'h2': 'Der Kongo-Freistaat: Kautschuk um jeden Preis',
   'pre': '''<p>Von 1885 bis 1908 gehörte das riesige Kongogebiet dem belgischen König Leopold II. persönlich. Ab etwa 1890 stieg in Europa und Amerika die Nachfrage nach <strong>Kautschuk</strong>, dem Rohstoff für Gummi. Man brauchte ihn für Fahrrad- und Autoreifen und für Kabel. Im Kongo wuchsen Lianen, aus deren Saft man Kautschuk gewinnen konnte.</p>
<p>Leopolds Verwaltung und private Gesellschaften verlangten von jedem Dorf feste Mengen. Wer zu wenig brachte, wurde hart bestraft. Soldaten nahmen Frauen und Kinder als Geiseln, bis die Männer genug geliefert hatten. Es gab Morde und Verstümmelungen. Viele Menschen flohen, Felder blieben leer, Hunger und Krankheiten breiteten sich aus.</p>
<div class="person"><strong>Nsala aus dem Dorf Wala</strong><p>Im Mai 1904 töteten Wächter einer Kautschukgesellschaft seine fünfjährige Tochter Boali und seine Frau, weil das Dorf nicht genug Kautschuk geliefert hatte. Nsala brachte Beweise zu der britischen Missionarin Alice Seeley Harris. Sie fotografierte ihn am 14. Mai 1904, wie er trauernd auf einer Veranda sitzt. Das Foto wurde in Europa gezeigt und machte viele Menschen auf das Unrecht aufmerksam. Wir zeigen es hier bewusst nicht.</p></div>
<p>Berichte von Betroffenen, Missionaren und dem britischen Diplomaten Roger Casement (1904) lösten in Europa eine große Protestbewegung aus. 1908 musste Leopold den Kongo an den belgischen Staat abgeben. Die Zwangsarbeit endete damit aber nicht sofort.</p>''',
   'tasks': [
    {'id': 'o1', 'type': 'order', 'tag': 'Ursache und Folge', 'name': 'Kautschuk-Kette', 'key': 'kautschuk_kette', 'komp': 'ursachen_folgen',
     'frage': 'Bringe die Kette mit den Pfeilen in die richtige Reihenfolge, von der Ursache bis zur Folge.',
     'items': [
      'In Europa und Amerika werden immer mehr Reifen und Kabel aus Gummi gebraucht.',
      'Leopold II. und private Gesellschaften verlangen von jedem Dorf feste Mengen Kautschuk.',
      'Wer zu wenig liefert, wird bestraft. Soldaten nehmen Geiseln und wenden schwere Gewalt an.',
      'Menschen fliehen, Felder bleiben leer, Hunger und Krankheiten breiten sich aus.',
      'Berichte über die Verbrechen lösen Proteste aus. 1908 muss Leopold den Kongo abgeben.',
     ],
     'ok': 'Genau. Die Nachfrage in den Industriestaaten und die Gier nach Gewinn führten zu einem System der Gewalt. Erst der öffentliche Druck beendete Leopolds Herrschaft.',
     'hint': 'Beginne mit dem, was in Europa und Amerika gebraucht wurde. Ende mit der Reaktion in Europa.'},
    {'id': 's2', 'type': 'single', 'tag': 'Zahlen prüfen', 'name': 'Opferzahlen im Kongo', 'key': 'opferzahlen', 'komp': 'quellenarbeit',
     'frage': 'Wie viele Menschen starben im Kongo-Freistaat? Fachleute nennen Schätzungen von etwa einer Million bis zu zehn Millionen. Warum ist die Spannbreite so groß?',
     'opts': [('a', 'Vor 1924 gab es keine Volkszählung. Man muss aus Berichten und späteren Zahlen schätzen, und Gewalt, Hunger und Krankheiten wirkten zusammen.'),
              ('b', 'Weil die genauen Zahlen in Belgien geheim gehalten werden.'),
              ('c', 'Weil jede Forscherin und jeder Forscher einfach eine Zahl rät.')],
     'right': 'a',
     'ok': 'Richtig. Genaue Zahlen gibt es nicht. Sicher ist aber, dass sehr viele Menschen durch das Kautschuk-System starben. Hinter jeder Zahl stehen Menschen wie Boali und ihre Mutter.',
     'fb': {'b': 'Nein. Das Problem ist ein anderes: Damals hat niemand die Menschen im Kongo gezählt.', 'c': 'Nein. Fachleute schätzen mit festen Methoden, zum Beispiel aus späteren Volkszählungen und Berichten. Sicher ist, dass sehr viele Menschen starben. Unsicher ist nur die genaue Zahl.'}},
   ]},
  {'id': 'widerstand', 'nav': 'Widerstand', 'h2': 'Widerstand hatte viele Formen',
   'pre': '''<p>Die Menschen in den Kolonien waren nicht nur Opfer. Sie handelten selbst und wehrten sich auf viele verschiedene Arten. Manche griffen zu den Waffen. Andere schrieben Briefe und Bittschriften, zogen vor Gericht, flohen oder verweigerten die Arbeit im Alltag.</p>''' + PERSONEN,
   'tasks': [
    {'id': 'p1', 'type': 'match', 'tag': 'Zuordnen', 'name': 'Formen des Widerstands', 'key': 'widerstand_formen', 'komp': 'perspektivitaet',
     'frage': 'Welche Form von Widerstand zeigt jedes Beispiel? Wähle aus.',
     'rows': [('Kinjikitile Ngwale verteilt ein „Maji“, das Mut machen und schützen soll.', 'religiöse Bewegung'),
              ('Rudolf Duala Manga Bell schreibt Bittschriften und beauftragt einen Anwalt.', 'Bittschriften und Recht'),
              ('Menelik II. besiegt mit seinem Heer die italienischen Truppen.', 'bewaffneter Kampf'),
              ('Familien im Kongo verlassen ihre Dörfer und verstecken sich im Wald.', 'Flucht'),
              ('Arbeiter auf Baumwollfeldern arbeiten absichtlich langsam.', 'Verweigerung im Alltag')],
     'choices': ['bewaffneter Kampf', 'Bittschriften und Recht', 'religiöse Bewegung', 'Flucht', 'Verweigerung im Alltag'],
     'ok': 'Alles richtig. Widerstand war vielfältig. Auch wer langsam arbeitete oder floh, zeigte: Ich nehme diese Herrschaft nicht hin. Viele Menschen bezahlten ihren Widerstand mit dem Leben.',
     'hint': 'Lies die Kurzbiografien oben noch einmal. Frage dich: Waffen, Papier und Gericht, Glaube, Weggehen oder Bremsen im Alltag?'},
    {'id': 'h1', 'type': 'hot', 'tag': 'Kartenarbeit', 'name': 'Orte des Widerstands', 'key': 'orte_widerstand', 'komp': 'zeit_raum', 'svg': AFRIKA,
     'seq': [
      ['kongo', 'Finde den Kongo-Freistaat, in dem Menschen vor der Kautschukpflicht in die Wälder flohen.', 'Richtig. Der Kongo liegt in der Mitte Afrikas, rund um den großen Fluss Kongo.'],
      ['doa', 'Finde Deutsch-Ostafrika, wo 1905 der Maji-Maji-Krieg begann. Heute liegt dort vor allem Tansania.', 'Richtig. Deutsch-Ostafrika umfasste das heutige Tansania, Ruanda und Burundi.'],
      ['kamerun', 'Finde Kamerun, die Heimat von Rudolf Duala Manga Bell.', 'Richtig. Kamerun liegt dort, wo die Westküste Afrikas einen Knick macht.'],
      ['aethiopien', 'Finde Äthiopien, das 1896 bei Adwa seine Unabhängigkeit verteidigte.', 'Richtig. Äthiopien ist auf der Karte weiß, weil es nicht erobert wurde.'],
     ],
     'all': [['kongo', 'Kongo'], ['doa', 'Deutsch-Ostafrika'], ['kamerun', 'Kamerun'], ['aethiopien', 'Äthiopien'], ['dsw', 'Deutsch-Südwestafrika'], ['nigeria', 'Nigeria'], ['angola', 'Angola']],
     'wrong': {'dsw': 'Dort kämpften ab 1904 die Herero und Nama, dazu mehr in der Quelle und in Modul 016.', 'nigeria': 'Nigeria war eine britische Kolonie.', 'angola': 'Angola war eine portugiesische Kolonie.'},
     'fertig': 'Alle vier Orte gefunden.', 'ok': 'Widerstand gab es in ganz Afrika, nicht nur an diesen vier Orten.'},
   ]},
  {'id': 'majimaji', 'nav': 'Maji-Maji', 'h2': 'Der Maji-Maji-Krieg 1905 bis 1907',
   'pre': '''<p>In Deutsch-Ostafrika mussten Dorfbewohner ab 1902 auf Feldern Baumwolle für den Verkauf nach Deutschland anbauen. Sie bekamen dafür kaum Geld, und ihre eigenen Felder blieben liegen. 1905 erhöhte der Gouverneur zudem die Steuern. Im Juli 1905 rissen Männer in den Matumbi-Bergen Baumwollpflanzen aus. Das war der Beginn eines Krieges, an dem sich bald mehr als 20 Volksgruppen beteiligten.</p>
<p>Der Heiler Kinjikitile Ngwale hatte ein „Maji“ verteilt, ein Wasser, das vor Kugeln schützen sollte. „Maji“ ist Swahili und bedeutet Wasser. Es schützte nicht vor den Maschinengewehren, aber es gab vielen Menschen Mut und verband Gruppen, die vorher getrennt waren.</p>
<p>Die deutsche Kolonialarmee, zu der auch viele afrikanische Soldaten gehörten, den sogenannten Askari, brannte Dörfer und Felder nieder und vernichtete Vorräte. Die Kolonialverwaltung selbst ging von etwa 75.000 Toten aus. Heute schätzen Fachleute, dass bis zu 300.000 Menschen starben, die meisten an Hunger. Zu den Opfern gehörte auch der Anführer Songea Mbano, den deutsche Truppen 1906 zusammen mit 66 weiteren Kämpfern hinrichteten.</p>
<p>2023 besuchte Bundespräsident Frank-Walter Steinmeier das Maji-Maji-Museum in Songea in Tansania. Er sagte, er schäme sich für das, was deutsche Kolonialsoldaten dort getan hatten, und bat die Nachfahren um Verzeihung.</p>''',
   'tasks': [
    {'id': 'g1', 'type': 'gap', 'tag': 'Lückentext', 'name': 'Maji-Maji-Krieg', 'key': 'maji_maji', 'komp': 'fachwissen',
     'frage': 'Wähle in jeder Lücke das passende Wort.',
     'text': 'Im Juli 1905 rissen Männer in Deutsch-Ostafrika Pflanzen auf einem {} aus. Sie wehrten sich gegen Zwangsarbeit und hohe {}. Der Heiler Kinjikitile verteilte {}, das Mut machen und vor Kugeln schützen sollte. Die deutschen Truppen verbrannten Dörfer und Felder. Die meisten Opfer starben deshalb an {}.',
     'gaps': [{'opts': ['Kaffeefeld', 'Baumwollfeld', 'Weinberg'], 'right': 'Baumwollfeld'},
              {'opts': ['Mieten', 'Steuern', 'Zölle'], 'right': 'Steuern'},
              {'opts': ['Salz', 'Gold', 'Wasser'], 'right': 'Wasser'},
              {'opts': ['Hunger', 'Kälte', 'Altersschwäche'], 'right': 'Hunger'}],
     'ok': 'Alles richtig. Der Krieg begann mit Widerstand gegen die Baumwoll-Zwangsarbeit. Die deutsche Kriegsführung der „verbrannten Erde“ führte zu einer Hungersnot, an der die meisten Menschen starben.',
     'hint': 'Lies den Text oben noch einmal genau. Achte auf die Wörter Baumwolle, Steuern und „Maji“.'},
    {'id': 's3', 'type': 'single', 'tag': 'Perspektive', 'name': 'Aufstand oder Krieg', 'key': 'begriffe_perspektive', 'komp': 'perspektivitaet',
     'frage': 'In deutschen Akten heißt das Ereignis „Maji-Maji-Aufstand“. In Tansania spricht man heute vom „Maji-Maji-Krieg“ und von Widerstand. Warum ist dieser Unterschied wichtig?',
     'opts': [('a', '„Aufstand“ klingt nach Ungehorsam gegen eine rechtmäßige Herrschaft. „Widerstand“ betont, dass sich Menschen gegen eine fremde Eroberung wehrten.'),
              ('b', 'Es handelt sich um zwei verschiedene Ereignisse.'),
              ('c', 'Der Unterschied ist egal, Wörter verändern nichts.')],
     'right': 'a',
     'ok': 'Richtig. Wörter verraten eine Perspektive. Wer „Aufstand“ sagt, sieht die Kolonialherrschaft als normal an. Viele Fachleute sprechen deshalb heute vom Maji-Maji-Krieg.',
     'fb': {'b': 'Nein, es geht um dasselbe Ereignis. Unterschiedlich ist nur die Sichtweise.', 'c': 'Doch. Wörter bewerten. Überlege, wer ein Interesse hatte, von „Aufstand“ zu sprechen.'}},
   ]},
  {'id': 'quelle', 'nav': 'Die Quelle', 'h2': 'Die Quelle: Samuel Mahareros Brief',
   'pre': MAHARERO,
   'tasks': [
    {'id': 'q1', 'type': 'multi', 'tag': 'Quellenarbeit', 'name': 'Quellenarbeit Maharero', 'key': 'quelle_maharero', 'komp': 'quellenarbeit',
     'frage': 'Welche Gründe für den Krieg nennt Maharero in diesen Auszügen? Wähle alle zutreffenden aus.',
     'opts': [('gewalt', 'Viele Herero wurden von Weißen getötet, auch in Gefängnissen.'),
              ('strafe', 'Wenn er sich in Windhuk beschwerte, wurden die Täter kaum bestraft.'),
              ('schulden', 'Händler verkauften auf Kredit und nahmen dann gewaltsam Rinder als Bezahlung.'),
              ('beute', 'Die Herero wollten deutsche Farmen erobern, um reich zu werden.'),
              ('religion', 'Es ging um einen Streit über Religion.')],
     'right': ['gewalt', 'strafe', 'schulden'],
     'wrongfb': {'beute': 'Davon steht im Brief nichts. Maharero beschreibt Gewalt und Unrecht, die seine Leute erlitten.', 'religion': 'Religion wird in diesen Auszügen nicht genannt.'},
     'ok': 'Genau. Maharero beschreibt Gewalt, fehlende Gerechtigkeit und den Verlust der Rinder, die für die Herero Lebensgrundlage und Reichtum waren. Für ihn hatten die Weißen den Krieg begonnen.',
     'hint': 'Lies beide Auszüge noch einmal Satz für Satz. Es sind drei Gründe.'},
    {'id': 'q2', 'type': 'single', 'tag': 'Quellenkritik', 'name': 'Quellenkritik Maharero', 'key': 'quellenkritik', 'komp': 'quellenarbeit',
     'frage': 'Den Brief kennen wir nur aus einer deutschen Übersetzung, die 1907 in einem Buch des deutschen Kolonialautors Paul Rohrbach erschien. Was folgt daraus?',
     'opts': [('a', 'Wir müssen bedenken, dass Übersetzung und Auswahl von Deutschen stammen. Trotzdem ist der Brief eine der wenigen Quellen, in denen ein Herero-Oberhaupt selbst seine Gründe nennt.'),
              ('b', 'Dann ist der Brief sicher gefälscht und wertlos.'),
              ('c', 'Dann zeigt der Brief nur die deutsche Sicht.')],
     'right': 'a',
     'ok': 'Richtig. Wer? Samuel Maharero. Wann? März 1904, mitten im Krieg. Für wen? Für den deutschen Gouverneur. Warum? Er wollte erklären, warum die Herero kämpften. Was fehlt? Der Originaltext in Otjiherero und die Sicht vieler anderer Betroffener.',
     'fb': {'b': 'Nein. Es gibt keinen Hinweis auf eine Fälschung. Eine Übersetzung muss man aber vorsichtig lesen.', 'c': 'Nein. Der Inhalt stammt von Maharero und widerspricht der deutschen Sicht deutlich. Nur die Übersetzung stammt von Deutschen.'}},
    {'id': 'q3', 'type': 'single', 'tag': 'Quelle oder Darstellung', 'name': 'Quelle und Darstellung', 'key': 'quelle_darstellung', 'komp': 'quellenarbeit',
     'frage': 'Mahareros Brief ist eine Quelle. Was davon ist eine Darstellung?',
     'opts': [('a', 'Ein Kapitel in einem Geschichtsbuch von 2020 über den Krieg in Namibia'),
              ('b', 'Ein Telegramm eines deutschen Offiziers aus dem Jahr 1904'),
              ('c', 'Eine Bittschrift von Rudolf Duala Manga Bell aus dem Jahr 1914')],
     'right': 'a',
     'ok': 'Richtig. Das Geschichtsbuch wurde viel später geschrieben und wertet Quellen aus. Telegramm und Bittschrift stammen aus der Zeit selbst.',
     'fb': {'b': 'Noch nicht. Das Telegramm entstand 1904, also in der Zeit selbst. Es ist eine Quelle.', 'c': 'Noch nicht. Die Bittschrift stammt aus der Zeit selbst. Sie ist eine Quelle.'}},
    {'id': 'w1', 'type': 'text', 'lw': 'weiter', 'score': False, 'tag': 'Weiterdenken · Perspektivwechsel', 'name': 'Perspektivwechsel', 'key': 'weiterdenken_perspektive', 'komp': 'perspektivitaet',
     'pre': '<div class="notice"><strong>Zur Einordnung:</strong> Viele Menschen in Deutschland glaubten 1904, die Herero hätten grundlos und aus Grausamkeit angegriffen. So stand es in vielen Zeitungen und Reden.</div>',
     'frage': 'Wie stellt Mahareros Brief diese Sicht in Frage? Erkläre, warum man beide Seiten kennen muss, um den Krieg zu verstehen.',
     'ph': 'Der Brief zeigt, dass ... Man muss beide Seiten kennen, weil ...',
     'need': [{'kw': ['grund', 'ursache', 'handler', 'rinder', 'getotet', 'gewalt', 'schuld', 'not', 'unrecht', 'gefangnis', 'bestraft'], 'miss': 'Nenne zuerst, welche Gründe Maharero nennt.'},
              {'kw': ['seite', 'sicht', 'perspektive', 'einseitig', 'deutsch', 'zeitung', 'beide', 'verschwieg', 'nur eine'], 'miss': 'Erkläre dann, warum eine Seite allein nicht reicht.'}],
     'ok': 'Sehr gut. Der Brief zeigt, dass die Herero Gründe hatten, die in Deutschland kaum jemand hören wollte. Wer nur eine Seite kennt, übernimmt deren Sicht, ohne es zu merken.',
     'short': 'Deine Antwort ist noch sehr kurz. Schreibe zwei Sätze: „Der Brief zeigt, dass ...“ und „Man muss beide Seiten kennen, weil ...“'},
   ]},
 ],
 'glossar': [
  ('Zwangsarbeit', 'Arbeit, die Menschen gegen ihren Willen leisten müssen, oft ohne oder für sehr wenig Lohn und unter Androhung von Strafen.'),
  ('Kautschuk', 'Der Saft bestimmter Pflanzen, aus dem Gummi hergestellt wird. Um 1900 wurde er für Reifen und Kabel dringend gebraucht.'),
  ('Kongo-Freistaat', 'Name des Kongogebiets von 1885 bis 1908, als es dem belgischen König Leopold II. persönlich gehörte. Trotz des Namens waren die Menschen dort nicht frei.'),
  ('Hütten- und Kopfsteuer', 'Steuern, die Kolonialverwaltungen pro Hütte oder pro Person in Geld verlangten. Sie zwangen viele Menschen zur Lohnarbeit.'),
  ('Maji-Maji', '„Maji“ ist Swahili und bedeutet Wasser. Der Maji-Maji-Krieg von 1905 bis 1907 war ein Krieg gegen die deutsche Kolonialherrschaft in Ostafrika.'),
  ('Askari', 'Afrikanische Soldaten in der deutschen Kolonialarmee. Die Kolonialmächte setzten in großer Zahl einheimische Soldaten ein.'),
  ('Verbrannte Erde', 'Eine Kriegsführung, bei der Dörfer, Felder und Vorräte zerstört werden, damit der Gegner nichts mehr zum Leben hat. Sie trifft vor allem Zivilisten.'),
  ('Widerstand', 'Alle Handlungen, mit denen sich Menschen gegen eine Herrschaft wehren, vom Kampf mit Waffen bis zum Langsam-Arbeiten.'),
  ('Bittschrift', 'Ein Schreiben an eine Regierung oder ein Parlament mit einer Bitte oder Beschwerde. Ein anderes Wort dafür ist Petition.'),
  ('Perspektive', 'Die Sicht, aus der jemand etwas wahrnimmt und beschreibt. Dasselbe Ereignis sieht aus verschiedenen Perspektiven unterschiedlich aus.'),
 ],
 'lerncheck': [
  'Ich kann beschreiben, wie Kolonialherrschaft das Leben der Menschen veränderte.',
  'Ich kann verschiedene Formen von Widerstand nennen und mit Beispielen belegen.',
  'Ich kann eine Quelle aus der Sicht von Kolonisierten auswerten und kritisch prüfen.',
 ],
 'abschluss': {
  'h2': 'Abschlussmission: die Karteikarte',
  'karte': 'Auf der alten Karteikarte steht: <em>„Die Menschen in den Kolonien haben die fremde Herrschaft einfach hingenommen.“</em>',
  'frage': 'Wie entscheidest du?',
  'opts': [('ok', 'Die Karte stimmt so.'),
           ('teil', 'Die Karte ist falsch. Die Menschen litten unter Landraub, Zwangsarbeit und Gewalt. Gleichzeitig wehrten sie sich auf viele Arten: mit Waffen, mit Briefen und Bittschriften, durch Flucht oder Verweigerung. Sie waren nicht nur Opfer, sondern handelten selbst.'),
           ('sieg', 'Die Karte ist falsch, denn die Kolonisierten haben die Europäer überall schnell besiegt.')],
  'right': ['teil'],
  'fb': {'ok': 'Prüfe noch einmal: Was taten Kinjikitile, Manga Bell, Menelik II. oder die Familien im Kongo?',
         'teil': 'Gut entschieden. Begründe deine Entscheidung jetzt in A2.',
         'sieg': 'Leider nicht. Nur Äthiopien konnte sich auf Dauer behaupten. Viele Widerstandskämpfe wurden brutal niedergeschlagen. Widerstand gab es aber überall.'},
  'a2': 'Schreibe Chronos eine kurze Nachricht. Erkläre in zwei bis vier Sätzen, was Kolonialherrschaft für die Menschen bedeutete. Nenne mindestens ein Beispiel für Widerstand.',
  'ph': 'Lieber Chronos, deine Karte stimmt nicht, weil ...',
  'help': '„Für die Menschen bedeutete Kolonialherrschaft ..., zum Beispiel ...“ · „Sie wehrten sich, indem ...“ · „Ein Beispiel dafür ist ..., denn ...“',
  'crit': {
   'kurz': 'Chronos braucht mehr als einen Satz. Schreibe zwei bis vier Sätze: Was erlebten die Menschen, und wie wehrten sie sich?',
   'gruppen': [
    {'kw': ['zwang', 'arbeit', 'steuer', 'land', 'gewalt', 'hunger', 'getotet', 'tot', 'kautschuk', 'baumwolle', 'rinder', 'vieh', 'ausbeut', 'strafe', 'rechte', 'geisel', 'leid', 'unterdr', 'enteign'], 'miss': 'Beschreibe, was die Menschen unter der Kolonialherrschaft erlebten, zum Beispiel Zwangsarbeit, Steuern oder Gewalt.'},
    {'kw': ['widerstand', 'wehr', 'kampf', 'krieg', 'maji', 'brief', 'bittschrift', 'petition', 'flucht', 'floh', 'verweiger', 'langsam', 'adwa', 'maharero', 'witbooi', 'kinjikitile', 'manga bell', 'menelik', 'anwalt'], 'miss': 'Nenne ein Beispiel für Widerstand, etwa den Maji-Maji-Krieg, Manga Bells Bittschriften oder die Flucht in den Wald.'},
   ],
   'gut': 'Sehr gut. Du zeigst beides: das Leid der Menschen und ihr eigenes Handeln. Genau das fehlte auf Chronos’ alter Karte.'},
  'post': '<div class="notice calm"><strong>Zum Schluss:</strong> Die Inhalte dieses Moduls sind schwer. Wenn dich etwas beschäftigt, sprich mit deiner Lehrkraft oder mit der Schulsozialarbeit. Darüber zu reden ist kein Zeichen von Schwäche.</div>',
 },
 'next': 'Weiter geht es mit Modul 016: Welche Rolle spielte das Deutsche Reich im Kolonialismus?',
 'lw_weiter': 'Du bekommst zusätzlich eine Aufgabe zum Perspektivwechsel.',
}
