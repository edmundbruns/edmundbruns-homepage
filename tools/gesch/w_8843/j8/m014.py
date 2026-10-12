import maps

HINWEIS = '''<div class="notice calm"><strong>Bevor du startest:</strong> In diesem Themenbereich geht es um Eroberung, Gewalt und Rassismus. Wir sprechen darüber sachlich und mit Respekt vor den Menschen, die darunter gelitten haben. Rassistische Begriffe stehen hier nur, wenn sie in einer Quelle vorkommen. Dann werden sie eingeordnet.</div>'''

KARTE = '<p class="hint mobilehint">Tipp: Wische auf der Karte nach links und rechts, um alle Gebiete zu sehen.</p><div class="svgwrap mapscroll" data-start="0.62">' + maps.svg(
    (700, 272), 2, -170, 80, task='k1',
    label='Schematische Weltkarte der Kolonialreiche um 1914. Die Gebiete der Kolonialmächte sind farbig, unabhängige Staaten hell.',
    hot={
        'indien': ('indien', 'Großes Gebiet in Südasien'),
        'ceylon': ('indien', 'Großes Gebiet in Südasien'),
        'kongo': ('kongo', 'Gebiet in der Mitte Afrikas'),
        'aethiopien': ('unabh', 'Weißes Gebiet in Ostafrika'),
        'liberia': ('unabh', 'Weißes Gebiet in Westafrika'),
        'ndlindien': ('ndlindien', 'Inselgebiet in Südostasien'),
        'indochina': ('indochina', 'Gebiet auf der Halbinsel in Südostasien'),
        'dsw': ('dsw', 'Gebiet im Südwesten Afrikas'),
        'frafrika': ('frafrika', 'Großes Gebiet im Westen und Norden Afrikas'),
    }) + '''</div>
<ul class="mapkey" aria-label="Legende der Karte">
 <li><i style="background:#e3a19b"></i>Großbritannien</li>
 <li><i style="background:#9ab8de"></i>Frankreich</li>
 <li><i style="background:#e6c15c"></i>Deutsches Reich</li>
 <li><i style="background:#b9a3d4"></i>Belgien</li>
 <li><i style="background:#9fd0a8"></i>Portugal</li>
 <li><i style="background:#f0b27a"></i>Niederlande</li>
 <li><i style="background:#8fd0cc"></i>Italien</li>
 <li><i style="background:#e8e0a6"></i>Spanien und Dänemark</li>
 <li><i style="background:#c5a48c"></i>USA</li>
 <li><i style="background:#f0b6cb"></i>Japan</li>
 <li><i style="background:#d9cfc1"></i>Russisches Reich</li>
 <li><i style="background:#fff;border-color:#55616b"></i>unabhängig in Afrika</li>
 <li><i style="background:#eeece6"></i>andere Staaten</li>
</ul>
<p class="hint">Dunkler gefärbt sind die Mutterländer in Europa und Japan, heller ihre Kolonien.</p>
<div class="legendlist"><span>Karte: eigene schematische Darstellung, Grenzen stark vereinfacht</span></div>'''

FERRY = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Jules Ferry, Rede in der französischen Abgeordnetenkammer, Paris, 28. Juli 1885.</strong> Gekürzt und aus dem Französischen übersetzt, vereinfacht wiedergegeben.</p>
 <p>Ferry war zweimal französischer Regierungschef und ein bekannter Befürworter der Kolonialpolitik. An diesem Tag stritt das Parlament darüber, ob Frankreich Geld für einen Kriegszug nach Madagaskar ausgeben sollte.</p>
 <p class="quote">(1) „Man kann die Kolonialpolitik auf drei Arten von Gedanken zurückführen: auf wirtschaftliche Gedanken, auf Gedanken der Zivilisation und auf Gedanken politischer und vaterländischer Art.“</p>
 <p class="quote">(2) „Was unserer großen Industrie immer mehr fehlt, das sind Absatzmärkte.“</p>
 <p class="quote">(3) „Man muss offen sagen, dass die höheren Rassen ein Recht gegenüber den niederen Rassen haben. [...] Sie haben die Pflicht, die niederen Rassen zu zivilisieren.“</p>
 <p class="quote">(4) „Sich aus den Angelegenheiten der Welt herauszuhalten [...], das heißt für eine große Nation abzudanken und vom ersten Rang auf den dritten oder vierten abzusteigen.“</p>
</div>
<div class="notice warn"><strong>Einordnung:</strong> In Satz (3) spricht Ferry von „höheren“ und „niederen Rassen“. Das ist rassistisch. Menschen lassen sich nicht in Rassen einteilen, und keine Gruppe ist mehr wert als eine andere. Wir zeigen den Satz nur, weil er verrät, wie Eroberungen damals begründet wurden. In Modul 017 erfährst du mehr darüber.</div>
<div class="notice"><strong>Schon damals gab es Widerspruch:</strong> Ferry zitierte in seiner Rede selbst einen Abgeordneten, der seine Politik verspottete. Dieser Abgeordnete, Camille Pelletan, hatte gefragt: „Was ist das für eine Zivilisation, die man mit Kanonenschüssen aufzwingt?“</div>'''

M = {
 'num': '014',
 'titel': 'Warum eroberten europäische Mächte Kolonien?',
 'bereich': 'Imperialismus und Weltpolitik',
 'intro': 'Um 1914 beherrschten wenige Staaten große Teile der Erde. In Afrika waren nur noch zwei Länder unabhängig. In diesem Modul untersuchst du, warum europäische Mächte so viele Gebiete eroberten und wie sie das begründeten.',
 'hinweis': HINWEIS,
 'ziele': [
  'Du erklärst die Begriffe Imperialismus und Kolonie.',
  'Du ordnest wirtschaftliche, politische und ideologische Gründe für die Eroberungen.',
  'Du erklärst, warum die Eroberungen gerade nach 1880 so schnell gingen.',
  'Du beschreibst, was auf der Berliner Konferenz 1884/85 geschah und wer dort fehlte.',
  'Du liest eine Karte der Kolonialreiche um 1914 und prüfst eine Rede aus dem Jahr 1885.',
 ],
 'mission_pre': '''<div class="notice"><strong>Ein Blick in einen Laden um 1900:</strong> In vielen Städten und Dörfern Deutschlands gab es einen „Kolonialwarenladen“. Dort kaufte man Kaffee, Kakao, Tee, Reis, Zucker und Gewürze. Viele dieser Waren wurden in Gebieten angebaut, die europäische Staaten erobert hatten. Fahrräder rollten auf Reifen aus Kautschuk, Kleidung war aus Baumwolle. Der Alltag in Europa war eng mit den Kolonien verbunden.</div>''',
 'fall': 'In einem alten Schulbuch von 1910 hat Chronos diesen Satz gefunden und auf eine Karteikarte geschrieben: <em>„Die Europäer eroberten Kolonien, um den Menschen dort zu helfen.“</em>',
 'auftrag': 'Untersuche, welche Gründe hinter den Eroberungen standen und wie sie gerechtfertigt wurden. Am Ende entscheidest du, ob die Karteikarte stimmt.',
 'chronos': 'So stand es damals in vielen Büchern. Aber ein Satz wird nicht wahr, nur weil er gedruckt ist. Wir prüfen die Gründe genau, hören auf die Befürworter und auch auf die, die schon damals widersprochen haben.',
 'diagnose': [
  {'tag': 'Begriff', 'frage': 'Was ist eine Kolonie?', 'right': 'a',
   'opts': [('a', 'Ein Gebiet, das ein fremder Staat beherrscht, ohne dass die Menschen dort mitbestimmen dürfen'), ('b', 'Ein Bundesland, das sich freiwillig einem Staat anschließt'), ('c', 'Eine Stadt, die von Auswanderern ganz neu gegründet wird')]},
  {'tag': 'Richtig oder falsch', 'frage': 'Um 1914 wurde fast ganz Afrika von europäischen Staaten beherrscht.', 'right': 'r',
   'opts': [('r', 'Das stimmt'), ('f', 'Das stimmt nicht')]},
  {'tag': 'Vermutung', 'frage': 'Was brauchte die Industrie in Europa aus den Kolonien vor allem?', 'right': 'a',
   'opts': [('a', 'Rohstoffe wie Kautschuk, Baumwolle und Kupfer'), ('b', 'Fertige Maschinen und Lokomotiven'), ('c', 'Arbeiter für die Fabriken in Europa')]},
 ],
 'diag_msg': ['Eine Kolonie ist ein Gebiet unter fremder Herrschaft.', 'Um 1914 waren in Afrika nur Äthiopien und Liberia unabhängig.', 'Die Fabriken in Europa brauchten vor allem Rohstoffe.'],
 'sections': [
  {'id': 'begriffe', 'nav': 'Was ist Imperialismus?', 'h2': 'Was ist Imperialismus?',
   'pre': '''<p>Das Wort <strong>Imperialismus</strong> kommt vom lateinischen „imperium“, das heißt Herrschaft oder Reich. Gemeint ist das Streben von Staaten, ihre Macht über andere Länder und Völker auszudehnen.</p>
<p>Kolonien gab es schon seit etwa 1500, du kennst die Eroberungen in Amerika. Neu war nach 1880 das Tempo: In nur rund 30 Jahren teilten die Industriestaaten fast ganz Afrika und große Teile Asiens und des Pazifiks unter sich auf. Man nennt diese Zeit deshalb <strong>Hochimperialismus</strong>.</p>
<ul class="timeline">
 <li><b>um 1500 bis 1800:</b> Spanien, Portugal, England, Frankreich und die Niederlande erobern Gebiete in Amerika, Afrika und Asien.</li>
 <li><b>um 1880:</b> Europäische Staaten beherrschen in Afrika erst wenige Küstengebiete.</li>
 <li><b>1884/85:</b> Berliner Konferenz über Afrika.</li>
 <li><b>1914:</b> In Afrika sind nur noch Äthiopien und Liberia unabhängig.</li>
</ul>''',
   'tasks': [
    {'id': 'g1', 'type': 'gap', 'tag': 'Lückentext', 'name': 'Grundbegriffe', 'key': 'grundbegriffe', 'komp': 'fachwissen',
     'frage': 'Wähle in jeder Lücke das passende Wort.',
     'text': 'Unter {} versteht man das Streben von Staaten, ihre Macht über andere Länder auszudehnen. Besonders schnell ging das zwischen etwa 1880 und {}. Ein Gebiet, das ein fremder Staat beherrscht, heißt {}. Manchmal herrschten die Großmächte auch ohne Eroberung, zum Beispiel über Verträge und Kredite. Das nennt man {} Herrschaft.',
     'gaps': [{'opts': ['Industrialisierung', 'Imperialismus', 'Demokratie'], 'right': 'Imperialismus'},
              {'opts': ['1648', '1789', '1914'], 'right': '1914'},
              {'opts': ['Kolonie', 'Kanton', 'Kommune'], 'right': 'Kolonie'},
              {'opts': ['freiwillige', 'informelle', 'königliche'], 'right': 'informelle'}],
     'ok': 'Alles richtig. Ein Beispiel für informelle Herrschaft ist China: Es blieb ein eigener Staat, musste aber Häfen und Handelsrechte an die Großmächte abgeben.',
     'hint': 'Lies den Text oben noch einmal. Achte auf die Jahreszahlen in der Zeitleiste.'},
   ]},
  {'id': 'motive', 'nav': 'Gründe ordnen', 'h2': 'Drei Arten von Gründen',
   'pre': '''<p>Historikerinnen und Historiker ordnen die Gründe für den Imperialismus meist in drei Gruppen:</p>
<ul>
 <li><strong>Wirtschaftliche Gründe:</strong> Es geht um Rohstoffe, Märkte und Gewinne.</li>
 <li><strong>Politische und militärische Gründe:</strong> Es geht um Macht, Ansehen und Stützpunkte.</li>
 <li><strong>Ideologische Gründe:</strong> Eine Ideologie ist eine Weltanschauung. Hier geht es um Vorstellungen, mit denen man die Eroberung rechtfertigte, zum Beispiel die falsche Idee, Europäer seien anderen Menschen überlegen.</li>
</ul>''',
   'tasks': [
    {'id': 'z1', 'type': 'zuord', 'tag': 'Zuordnen', 'name': 'Gründe ordnen', 'key': 'motive_zuordnen', 'komp': 'ursachen_folgen',
     'frage': 'Ordne jede Karte der passenden Gruppe zu.',
     'zones': [['wirt', 'Wirtschaftliche Gründe'], ['pol', 'Politische und militärische Gründe'], ['ideo', 'Ideologische Gründe']],
     'cards': [
      ['Rohstoffe wie Kautschuk, Baumwolle und Kupfer billig beschaffen', 'wirt'],
      ['Neue Käufer für Waren aus den Fabriken finden', 'wirt'],
      ['Geld gewinnbringend in Bergwerken und Plantagen anlegen', 'wirt'],
      ['Häfen und Kohlestationen für die Kriegsflotte sichern', 'pol'],
      ['Als Großmacht mit den anderen Staaten mithalten', 'pol'],
      ['Die Menschen im eigenen Land von Problemen ablenken', 'pol'],
      ['Die Behauptung, Europäer seien anderen Menschen überlegen', 'ideo'],
      ['Die Idee, man müsse anderen die eigene „Zivilisation“ bringen', 'ideo'],
      ['Menschen sollten zum Christentum bekehrt werden', 'ideo'],
     ],
     'ok': 'Alle neun richtig. Oft wirkten die Gründe zusammen: Wer Rohstoffe wollte, brauchte Häfen, Schiffe und Soldaten. Und die Behauptung, man sei überlegen und bringe „Zivilisation“, sollte die Eroberung im eigenen Land rechtfertigen.',
     'hint': 'Frage dich bei jeder Karte: Geht es um Geld und Waren, um Macht und Militär oder um eine Vorstellung, mit der man die Eroberung begründete?',
     'post': '<div class="notice" data-lw="sicher"><strong>Hilfe:</strong> Wirtschaft: Rohstoffe, Käufer, Gewinne. Politik: Flotte, Großmacht, Ablenkung. Ideologie: Überlegenheitsdenken, „Zivilisation“, Mission.</div>'},
   ]},
  {'id': 'technik', 'nav': 'Warum gerade jetzt?', 'h2': 'Warum gerade jetzt?',
   'pre': '''<p>Lange Zeit kamen Europäer kaum ins Innere Afrikas. Krankheiten wie Malaria waren für sie oft tödlich, und viele afrikanische Staaten konnten sich gut verteidigen. Im 19. Jahrhundert änderte sich das: Die Industrialisierung brachte Dampfschiffe, Eisenbahnen und den Telegrafen. Das Medikament Chinin schützte vor Malaria. Und neue Waffen wie das Maschinengewehr gaben kleinen europäischen Truppen eine große Überlegenheit.</p>''',
   'tasks': [
    {'id': 'o1', 'type': 'order', 'tag': 'Ursache und Folge', 'name': 'Wirkungskette', 'key': 'wirkungskette', 'komp': 'ursachen_folgen',
     'frage': 'Bringe die Kette mit den Pfeilen in die richtige Reihenfolge. Sie beginnt mit der Ursache und endet mit der Folge.',
     'items': [
      'Die Industrialisierung in Europa braucht immer mehr Rohstoffe und Käufer.',
      'Die Industriestaaten konkurrieren um Märkte, Macht und Ansehen.',
      'Mit Dampfschiffen, Chinin und Maschinengewehren können sie weit entfernte Gebiete erreichen und erobern.',
      'Zwischen etwa 1880 und 1914 teilen sie fast ganz Afrika und große Teile Asiens unter sich auf.',
     ],
     'ok': 'Genau. Die Industrialisierung schuf Bedarf und Konkurrenz, die Technik machte die Eroberung möglich. Die Folge war die Aufteilung fast der ganzen Welt.',
     'hint': 'Was war zuerst da: der Bedarf, der Wettbewerb, die Mittel oder das Ergebnis?'},
    {'id': 's1', 'type': 'single', 'tag': 'Erklären', 'name': 'Überlegenheit der Eroberer', 'key': 'ueberlegenheit', 'komp': 'ursachen_folgen',
     'frage': 'Warum konnten oft nur wenige tausend europäische Soldaten riesige Gebiete erobern?',
     'opts': [('a', 'Sie hatten überlegene Waffen wie Maschinengewehre und nutzten Streit zwischen afrikanischen Herrschern für sich aus.'),
              ('b', 'Die Menschen in Afrika begrüßten die Eroberer und wollten von ihnen regiert werden.'),
              ('c', 'Die Gebiete waren menschenleer, deshalb gab es keinen Widerstand.')],
     'right': 'a',
     'ok': 'Richtig. Die Waffentechnik war entscheidend. Außerdem schlossen die Eroberer Verträge mit einzelnen Herrschern und spielten Gruppen gegeneinander aus. Widerstand gab es trotzdem überall, mehr dazu in Modul 015.',
     'fb': {'b': 'Nein. Fast überall wehrten sich Menschen gegen die Eroberung. Sie unterlagen meist wegen der Waffen der Europäer.', 'c': 'Nein. In Afrika lebten um 1880 viele Millionen Menschen in Königreichen, Städten und Dörfern.'}},
   ]},
  {'id': 'berlin', 'nav': 'Berliner Konferenz', 'h2': 'Die Berliner Konferenz 1884/85',
   'pre': '''<p>Vom 15. November 1884 bis zum 26. Februar 1885 trafen sich auf Einladung von Reichskanzler Otto von Bismarck Vertreter von 14 Staaten in Berlin: fast alle europäischen Staaten, dazu die USA und das Osmanische Reich. Es ging um Afrika. <strong>Kein einziger Afrikaner war eingeladen.</strong></p>
<p>Die Konferenz beschloss Regeln: Wer eine Küste in Afrika beanspruchte, sollte das den anderen mitteilen und das Gebiet auch tatsächlich beherrschen. Im Kongobecken sollte freier Handel gelten. Und die Staaten erkannten das riesige Kongogebiet als Staat unter der Herrschaft des belgischen Königs Leopold II. an.</p>''',
   'tasks': [
    {'id': 'm1', 'type': 'multi', 'tag': 'Mehrfachauswahl', 'name': 'Berliner Konferenz', 'key': 'berliner_konferenz', 'komp': 'fachwissen',
     'frage': 'Welche Aussagen über die Berliner Konferenz stimmen? Wähle alle zutreffenden aus.',
     'opts': [('ort', 'Vertreter von 14 Staaten trafen sich auf Einladung Bismarcks in Berlin.'),
              ('regeln', 'Sie legten Regeln fest, wie europäische Staaten Gebiete in Afrika beanspruchen konnten.'),
              ('kongo', 'Das Kongogebiet wurde als Staat unter König Leopold II. anerkannt.'),
              ('afrika', 'Vertreter afrikanischer Staaten verhandelten gleichberechtigt mit.'),
              ('lineal', 'Alle Grenzen Afrikas wurden auf der Konferenz mit dem Lineal gezogen.')],
     'right': ['ort', 'regeln', 'kongo'],
     'wrongfb': {'afrika': 'Kein einziger Afrikaner saß mit am Tisch. Über Afrika wurde ohne die Menschen dort entschieden.',
                 'lineal': 'Das ist ein verbreiteter Irrtum. Die meisten Grenzen wurden erst in den Jahren danach in einzelnen Verträgen festgelegt. Die Konferenz beschleunigte aber den Wettlauf um Afrika.'},
     'ok': 'Richtig. Die Konferenz zog nicht alle Grenzen, aber sie gab dem „Wettlauf um Afrika“ Regeln. Danach beeilten sich die Mächte, Gebiete zu besetzen. Die Menschen in Afrika wurden nicht gefragt.',
     'hint': 'Lies den Text über der Aufgabe genau.'},
    {'id': 'p1', 'type': 'match', 'tag': 'Perspektiven', 'name': 'Sichtweisen auf die Konferenz', 'key': 'perspektiven_konferenz', 'komp': 'perspektivitaet',
     'frage': 'Wer könnte das gesagt haben? Wähle zu jeder Aussage die passende Person oder Gruppe.',
     'persons_html': '<p class="hint">Die Sätze sind ausgedacht. Sie fassen aber Haltungen zusammen, die in Quellen belegt sind. Es ist also eine Darstellung, keine Quelle.</p>',
     'rows': [
      ('„Mit klaren Regeln vermeiden wir, dass die europäischen Mächte wegen Afrika gegeneinander Krieg führen.“', 'Reichskanzler Bismarck'),
      ('„Das Kongogebiet ist jetzt mein Staat. Elfenbein und Kautschuk werden mich reich machen.“', 'König Leopold II.'),
      ('„In einer fernen Stadt wurde über unser Land entschieden, und niemand hat uns gefragt.“', 'Herrscher in Zentralafrika'),
      ('„Freier Handel am Kongo ist gut für unsere Geschäfte.“', 'Kaufmann aus Hamburg'),
     ],
     'choices': ['Reichskanzler Bismarck', 'König Leopold II.', 'Herrscher in Zentralafrika', 'Kaufmann aus Hamburg'],
     'ok': 'Alles richtig. Dasselbe Ereignis sah aus jeder Sicht anders aus. Für die Menschen in Afrika bedeutete die Konferenz vor allem eines: Andere entschieden über ihr Land.',
     'hint': 'Überlege: Wer wollte Frieden zwischen den Mächten, wer wollte Reichtum, wer Handel, und wer wurde nicht gefragt?'},
   ]},
  {'id': 'karte', 'nav': 'Weltkarte 1914', 'h2': 'Die Welt um 1914',
   'pre': '''<p>Die Karte zeigt, wie die Welt kurz vor dem Ersten Weltkrieg aufgeteilt war. Tippe im Bild auf das gesuchte Gebiet oder benutze die Knöpfe darunter.</p>''',
   'tasks': [
    {'id': 'k1', 'type': 'hot', 'tag': 'Kartenarbeit', 'name': 'Weltkarte 1914', 'key': 'weltkarte', 'komp': 'zeit_raum', 'svg': KARTE,
     'seq': [
      ['indien', 'Finde die wichtigste Kolonie Großbritanniens. Sie liegt in Südasien, um 1914 lebten dort über 300 Millionen Menschen.', 'Richtig. Britisch-Indien, zu dem damals auch das heutige Pakistan, Bangladesch und Myanmar gehörten, galt als wichtigste Kolonie des Britischen Weltreichs.'],
      ['kongo', 'Finde das große Gebiet in der Mitte Afrikas, das bis 1908 dem belgischen König Leopold II. persönlich gehörte.', 'Richtig. Der Kongo war rund 75-mal so groß wie Belgien. 1908 übernahm der belgische Staat die Kolonie. Was die Menschen dort erlebten, untersuchst du in Modul 015.'],
      ['unabh', 'Finde eines der beiden afrikanischen Länder, die 1914 unabhängig waren. Sie sind auf der Karte weiß mit dunklem Rand.', 'Richtig. Äthiopien besiegte 1896 in der Schlacht von Adwa ein italienisches Heer und blieb unabhängig. Liberia war seit 1847 eine unabhängige Republik.'],
      ['dsw', 'Finde die deutsche Kolonie im Südwesten Afrikas. Heute heißt das Land Namibia.', 'Richtig. Deutsch-Südwestafrika war die einzige deutsche Kolonie, in die viele deutsche Siedler zogen. Mehr dazu in Modul 016.'],
     ],
     'all': [['indien', 'Britisch-Indien'], ['frafrika', 'Französisch-Westafrika'], ['kongo', 'Kongo'], ['dsw', 'Deutsch-Südwestafrika'], ['unabh', 'Äthiopien und Liberia'], ['indochina', 'Französisch-Indochina'], ['ndlindien', 'Niederländisch-Indien']],
     'wrong': {'frafrika': 'Dieses riesige Gebiet beherrschte Frankreich.', 'indochina': 'Das ist Französisch-Indochina, heute Vietnam, Laos und Kambodscha.', 'ndlindien': 'Das ist Niederländisch-Indien, das heutige Indonesien.'},
     'fertig': 'Alle vier Gebiete gefunden.', 'ok': 'Damit hast du alle vier Gebiete gefunden.',
     'post': '<div class="notice warn"><strong>Zur Karte:</strong> Sie ist stark vereinfacht. Das Russische Reich eroberte vor allem Gebiete in Asien, die direkt an das eigene Land grenzten. China, Persien und das Osmanische Reich blieben eigene Staaten, standen aber unter starkem Einfluss der Großmächte. Kanada und Australien gehörten zum Britischen Weltreich, regierten sich aber schon weitgehend selbst.</div>'},
    {'id': 'k2', 'type': 'single', 'tag': 'Karte auswerten', 'name': 'Karte auswerten', 'key': 'karte_auswerten', 'komp': 'zeit_raum',
     'frage': 'Welche Aussage kannst du aus der Karte ablesen?',
     'opts': [('a', 'Großbritannien und Frankreich beherrschten die größten Gebiete in Afrika und Asien.'),
              ('b', 'Das Deutsche Reich hatte das größte Kolonialreich der Welt.'),
              ('c', 'Der größte Teil Afrikas war um 1914 unabhängig.')],
     'right': 'a',
     'ok': 'Richtig. Großbritannien und Frankreich besaßen die größten Kolonialreiche. Das Deutsche Reich kam spät dazu, besaß aber auch Gebiete, die zusammen etwa fünfmal so groß waren wie Deutschland selbst.',
     'fb': {'b': 'Schau noch einmal auf die Farben. Die gelben Gebiete des Deutschen Reichs sind deutlich kleiner als die roten und blauen.', 'c': 'Schau noch einmal hin: Nur zwei Gebiete in Afrika sind weiß.'}},
   ]},
  {'id': 'quelle', 'nav': 'Die Quelle', 'h2': 'Die Quelle: Jules Ferry vor dem Parlament',
   'pre': FERRY,
   'tasks': [
    {'id': 'q1', 'type': 'match', 'tag': 'Quellenarbeit', 'name': 'Quellenarbeit Ferry', 'key': 'quelle_ferry', 'komp': 'quellenarbeit',
     'frage': 'Welche Art von Grund nennt Ferry in den Sätzen (2), (3) und (4)? Wähle jeweils aus.',
     'rows': [('Satz (2): Absatzmärkte für die Industrie', 'wirtschaftlicher Grund'),
              ('Satz (3): angebliches Recht und angebliche Pflicht, andere zu „zivilisieren“', 'ideologischer Grund'),
              ('Satz (4): nicht vom ersten auf den dritten Rang absteigen', 'politischer Grund')],
     'choices': ['wirtschaftlicher Grund', 'politischer Grund', 'ideologischer Grund'],
     'ok': 'Genau. Ferry nennt selbst alle drei Gruppen von Gründen. Satz (3) zeigt, wie Rassismus als Rechtfertigung diente: Wer andere für „niedriger“ erklärte, konnte die Eroberung als „Pflicht“ ausgeben.',
     'hint': 'Satz (1) verrät dir die drei Gruppen. Ordne die anderen Sätze danach.'},
    {'id': 'q2', 'type': 'single', 'tag': 'Quellenkritik', 'name': 'Quellenkritik Ferry', 'key': 'quellenkritik', 'komp': 'quellenarbeit',
     'frage': 'Ferry hielt die Rede, als das Parlament über Geld für einen Kriegszug nach Madagaskar abstimmen sollte. Was folgt daraus für deine Quellenarbeit?',
     'opts': [('a', 'Ferry wollte die Abgeordneten überzeugen. Er stellte die Kolonialpolitik deshalb so positiv wie möglich dar.'),
              ('b', 'Ferry war Regierungschef, also beschreibt er die Lage neutral und vollständig.'),
              ('c', 'Eine Rede ist keine Quelle, weil sie nur gesprochen wurde.')],
     'right': 'a',
     'ok': 'Richtig. Wer? Ein Befürworter der Kolonien. Für wen? Für Abgeordnete, die er überzeugen wollte. Warum? Er brauchte ihr Geld. Was fehlt? Die Sicht der Menschen in Madagaskar und in den anderen Kolonien.',
     'fb': {'b': 'Nein. Gerade ein Politiker, der für seine Politik wirbt, ist nicht neutral. Er wählt aus, was ihm hilft.', 'c': 'Doch, die Rede wurde mitgeschrieben und gedruckt. Das Protokoll ist eine Textquelle.'}},
    {'id': 'q3', 'type': 'single', 'tag': 'Quelle oder Darstellung', 'name': 'Quelle und Darstellung', 'key': 'quelle_darstellung', 'komp': 'quellenarbeit',
     'frage': 'Die Rede von Ferry ist eine Quelle. Was davon ist dagegen eine Darstellung?',
     'opts': [('a', 'Ein Lexikonartikel aus dem Jahr 2020 über Jules Ferry'),
              ('b', 'Das gedruckte Protokoll der Parlamentssitzung vom 28. Juli 1885'),
              ('c', 'Ein Zeitungsbericht vom 29. Juli 1885 über die Rede')],
     'right': 'a',
     'ok': 'Richtig. Der Lexikonartikel wurde viel später geschrieben. Jemand hat dafür Quellen ausgewertet und erklärt. Das Protokoll und die Zeitung von 1885 stammen aus der Zeit selbst, sie sind Quellen.',
     'fb': {'b': 'Noch nicht. Das Protokoll entstand am selben Tag. Es ist eine Quelle.', 'c': 'Noch nicht. Die Zeitung erschien einen Tag später, also in der Zeit selbst. Sie ist eine Quelle.'}},
    {'id': 'w1', 'type': 'text', 'lw': 'weiter', 'score': False, 'tag': 'Weiterdenken · Gegenstimme', 'name': 'Gegenstimme Clemenceau', 'key': 'weiterdenken_clemenceau', 'komp': 'perspektivitaet',
     'pre': '<div class="akte"><span class="stamp">Zweite Quelle</span><p><strong>Georges Clemenceau, Rede in der Abgeordnetenkammer, 31. Juli 1885.</strong> Gekürzt und übersetzt, vereinfacht wiedergegeben.</p><p class="quote">„Höhere Rassen! Niedere Rassen! Das ist schnell gesagt.“</p><p>Clemenceau erinnerte daran, dass deutsche Gelehrte nach dem Krieg von 1870/71 „wissenschaftlich“ bewiesen hätten, die Franzosen seien eine „niedere Rasse“ und hätten deshalb verloren. Er lehnte es ab, Eroberungen als Recht oder Pflicht zu bezeichnen.</p></div>',
     'frage': 'Erkläre, wie Clemenceau Ferry widerspricht. Warum ist sein Beispiel mit den deutschen Gelehrten für französische Abgeordnete besonders überzeugend?',
     'ph': 'Clemenceau widerspricht, indem ... Das Beispiel überzeugt, weil ...',
     'need': [{'kw': ['rasse', 'hoher', 'niedrig', 'niedere', 'uberlegen', 'einteil', 'behauptung', 'schnell gesagt'], 'miss': 'Erkläre zuerst, was Clemenceau an Ferrys Behauptung kritisiert.'},
              {'kw': ['deutsch', 'franzos', 'selbst', 'eigen', 'betroffen', 'gleiche', 'umgekehrt', 'krieg'], 'miss': 'Erkläre dann, warum das Beispiel wirkt: Wen hatten die deutschen Gelehrten für „niedriger“ erklärt?'}],
     'ok': 'Sehr gut durchdacht. Clemenceau zeigt: Wer andere für „niedriger“ erklärt, kann selbst so abgewertet werden. Solche Einteilungen sagen mehr über die Interessen derer, die sie machen, als über die Menschen, die eingeteilt werden.',
     'short': 'Deine Antwort ist noch sehr kurz. Schreibe zwei Sätze: „Clemenceau widerspricht, indem ...“ und „Das Beispiel überzeugt, weil ...“'},
   ]},
 ],
 'glossar': [
  ('Imperialismus', 'Das Streben von Staaten, ihre Herrschaft über andere Länder auszudehnen. Besonders stark zwischen etwa 1880 und 1914, deshalb heißt diese Zeit Hochimperialismus.'),
  ('Kolonie', 'Ein Gebiet, das von einem fremden Staat beherrscht wird. Die Menschen dort dürfen nicht mitbestimmen.'),
  ('Kolonialismus', 'Die Eroberung und Beherrschung fremder Gebiete und die Ausbeutung ihrer Menschen und Rohstoffe. Kolonialismus gab es schon seit etwa 1500.'),
  ('Rohstoffe', 'Stoffe aus der Natur, die in Fabriken weiterverarbeitet werden, zum Beispiel Kautschuk, Baumwolle oder Kupfer.'),
  ('Absatzmarkt', 'Ein Gebiet, in dem man Waren verkaufen kann.'),
  ('Kohlestation', 'Ein Hafen, in dem Dampfschiffe Kohle nachladen konnten. Für eine weltweite Kriegsflotte waren solche Häfen wichtig.'),
  ('Ideologie', 'Eine Weltanschauung, also eine feste Vorstellung davon, wie die Welt ist oder sein soll. Ideologien wurden oft genutzt, um Unrecht zu rechtfertigen.'),
  ('„Zivilisierungsmission“', 'Die Behauptung der Kolonialmächte, sie müssten anderen Völkern ihre Kultur und Ordnung bringen. Sie beruhte auf der falschen Vorstellung, Europäer seien überlegen, und diente als Rechtfertigung.'),
  ('Berliner Konferenz', 'Treffen von 14 Staaten in Berlin 1884/85. Sie legten Regeln für die Aufteilung Afrikas fest. Afrikanerinnen und Afrikaner waren nicht beteiligt.'),
  ('Quelle und Darstellung', 'Eine Quelle stammt aus der Zeit selbst, zum Beispiel eine Rede von 1885. Eine Darstellung wurde später über die Vergangenheit geschrieben, zum Beispiel ein Lexikonartikel von heute.'),
 ],
 'lerncheck': [
  'Ich kann wirtschaftliche, politische und ideologische Gründe für den Imperialismus unterscheiden.',
  'Ich kann erklären, was auf der Berliner Konferenz geschah und wer dort fehlte.',
  'Ich kann an einer Quelle zeigen, wie die Eroberung von Kolonien gerechtfertigt wurde.',
 ],
 'abschluss': {
  'h2': 'Abschlussmission: die Karteikarte',
  'karte': 'Auf Chronos’ Karteikarte steht: <em>„Die Europäer eroberten Kolonien, um den Menschen dort zu helfen.“</em>',
  'frage': 'Wie entscheidest du?',
  'opts': [('ok', 'Die Karte stimmt so.'),
           ('teil', 'Die Karte stimmt so nicht. Die wichtigsten Gründe waren Rohstoffe, Märkte, Macht und Ansehen. Die Idee, anderen zu „helfen“, war vor allem eine Rechtfertigung und beruhte auf der falschen Vorstellung, Europäer seien überlegen.'),
           ('geld', 'Die Karte stimmt nicht. Es ging nur um Geld, andere Gründe gab es überhaupt nicht.')],
  'right': ['teil'],
  'fb': {'ok': 'Prüfe noch einmal: Was sagt Ferry in seiner Rede über Absatzmärkte und den Rang Frankreichs? Wurden die Menschen in Afrika gefragt?',
         'teil': 'Gut entschieden. Begründe deine Entscheidung jetzt in A2.',
         'geld': 'Geld war sehr wichtig. Aber auch Macht, Ansehen, Flottenstützpunkte und das Überlegenheitsdenken spielten eine Rolle. Ein gutes Urteil berücksichtigt mehrere Gründe.'},
  'a2': 'Schreibe Chronos eine kurze Nachricht. Erkläre in zwei bis vier Sätzen, warum europäische Mächte Kolonien eroberten. Nenne mindestens einen wirtschaftlichen und einen weiteren Grund. Erkläre auch, warum „helfen“ nicht der eigentliche Grund war.',
  'ph': 'Lieber Chronos, deine Karte stimmt so nicht, weil ...',
  'help': '„Ein wichtiger Grund waren ..., weil die Fabriken ...“ · „Außerdem wollten die Staaten ...“ · „Die Idee, zu helfen, war eher eine Rechtfertigung, denn ...“',
  'crit': {
   'kurz': 'Chronos braucht mehr als einen Satz. Schreibe zwei bis vier Sätze mit mindestens zwei Gründen.',
   'gruppen': [
    {'kw': ['rohstoff', 'markt', 'absatz', 'handel', 'geld', 'gewinn', 'kautschuk', 'baumwolle', 'profit', 'reich', 'industrie', 'kupfer', 'wirtschaft', 'fabrik', 'kaufer', 'ware'], 'miss': 'Nenne einen wirtschaftlichen Grund, zum Beispiel Rohstoffe oder Absatzmärkte.'},
    {'kw': ['macht', 'ansehen', 'grossmacht', 'flotte', 'stutzpunkt', 'kohlestation', 'konkurrenz', 'prestige', 'uberlegen', 'zivilis', 'rassis', 'mission', 'politisch', 'ideolog', 'stolz', 'rang', 'militar', 'hafen'], 'miss': 'Nenne einen zweiten Grund, der nicht mit Geld zu tun hat, zum Beispiel Macht, Ansehen oder Überlegenheitsdenken.'},
    {'kw': ['rechtfertig', 'vorwand', 'ausrede', 'ausbeut', 'gewalt', 'gefragt', 'eigene interesse', 'eigenen vorteil', 'eigentlich', 'angeblich', 'behaupt', 'unterdr', 'zwang', 'erober', 'falsch', 'nicht geholfen', 'nicht um zu helfen', 'nicht helfen'], 'miss': 'Erkläre noch, warum „helfen“ nicht der eigentliche Grund war, zum Beispiel weil es eine Rechtfertigung war oder die Menschen nicht gefragt wurden.'},
   ],
   'gut': 'Sehr gut. Du hast mehrere Gründe genannt und gezeigt, dass die Rede vom „Helfen“ vor allem der Rechtfertigung diente. Genau so prüft man eine Aussage aus einem alten Schulbuch.'},
 },
 'next': 'Weiter geht es mit Modul 015: Wie erlebten Kolonisierte den Imperialismus?',
 'lw_weiter': 'Du bekommst zusätzlich eine Gegenstimme aus dem Parlament von 1885.',
}
