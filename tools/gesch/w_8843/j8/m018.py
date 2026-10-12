import maps

KARTE = '<p class="hint mobilehint">Tipp: Wische auf der Karte nach links und rechts, um alle Gebiete zu sehen.</p><div class="svgwrap mapscroll" data-start="0.55">' + maps.svg(
    (700, 272), 2, -170, 80, task='h1',
    label='Schematische Weltkarte der Kolonialreiche um 1914 zur Wiederholung.',
    hot={
        'kongo': ('kongo', 'Gebiet in der Mitte Afrikas'),
        'dsw': ('dsw', 'Gebiet im Südwesten Afrikas'),
        'doa': ('doa', 'Gebiet an der Ostküste Afrikas südlich des Äquators'),
        'aethiopien': ('aethiopien', 'Weißes Gebiet in Ostafrika'),
        'indien': ('indien', 'Großes Gebiet in Südasien'),
        'kamerun': ('kamerun', 'Gebiet am Knick der Westküste Afrikas'),
    }) + '''</div>
<ul class="mapkey" aria-label="Legende der Karte">
 <li><i style="background:#e3a19b"></i>Großbritannien</li>
 <li><i style="background:#9ab8de"></i>Frankreich</li>
 <li><i style="background:#e6c15c"></i>Deutsches Reich</li>
 <li><i style="background:#b9a3d4"></i>Belgien</li>
 <li><i style="background:#9fd0a8"></i>Portugal</li>
 <li><i style="background:#f0b27a"></i>Niederlande</li>
 <li><i style="background:#8fd0cc"></i>Italien</li>
 <li><i style="background:#fff;border-color:#55616b"></i>unabhängig in Afrika</li>
</ul>
<div class="legendlist"><span>Karte: eigene schematische Darstellung, Grenzen stark vereinfacht</span></div>'''

RUECKBLICK = '''<div class="akte">
 <span class="stamp">Rückblick</span>
 <p>In den Modulen 014 bis 017 hast du mit fünf Quellen gearbeitet:</p>
 <ul>
  <li><strong>Jules Ferry</strong>, Rede im französischen Parlament, 1885</li>
  <li><strong>Bernhard von Bülow</strong>, Rede im Reichstag über den „Platz an der Sonne“, 1897</li>
  <li><strong>Samuel Maharero</strong>, Brief an Gouverneur Leutwein, 1904</li>
  <li><strong>Lothar von Trotha</strong>, Proklamation an die Herero, 1904</li>
  <li><strong>Abraham Ulrikab</strong>, Tagebuch aus Berlin, 1880</li>
 </ul>
</div>'''

M = {
 'num': '018',
 'titel': 'Lerncheck: Imperialismus und Weltpolitik',
 'leitfrage': 'Was war Imperialismus, und was geht er uns heute an?',
 'bereich': 'Imperialismus und Weltpolitik',
 'akte_label': 'Lerncheck', 'badge_label': 'Lerncheck', 'start_label': 'Lerncheck starten',
 'diag_titel': 'Warmlaufen', 'diag_intro': 'Drei kurze Fragen zum Aufwärmen. Sie werden nicht benotet.',
 'ziele_titel': 'Das prüfst du in diesem Lerncheck',
 'intro': 'Dieses Modul ist eine Wiederholung. Du prüfst noch einmal, was du in den Modulen 014 bis 017 über die Gründe des Imperialismus, die Erfahrungen der Kolonisierten, die Rolle des Deutschen Reichs und den Rassismus gelernt hast. Am Ende schätzt du selbst ein, wie sicher du dich fühlst.',
 'hinweis': '<div class="notice calm"><strong>Zur Erinnerung:</strong> Auch in dieser Wiederholung geht es um Gewalt, Völkermord und Rassismus. Wenn dich etwas belastet, sprich mit deiner Lehrkraft oder mit der Schulsozialarbeit.</div>',
 'ziele': [
  'Du findest wichtige Orte des Imperialismus auf der Weltkarte wieder.',
  'Du ordnest Ereignisse und Begriffe den Themen der Module 014 bis 017 zu.',
  'Du bringst wichtige Ereignisse in die richtige zeitliche Reihenfolge und verbindest Ursachen und Folgen.',
  'Du ordnest die Quellen der Module nach ihrer Perspektive ein.',
  'Du prüfst, welche Begriffe aus der Kolonialzeit beschönigen.',
 ],
 'mission_pre': '',
 'fall': 'Chronos will die Akte „Imperialismus“ schließen. Auf der letzten Karteikarte steht: <em>„Der Imperialismus ist lange vorbei. Mit uns heute hat er nichts mehr zu tun.“</em>',
 'auftrag': 'Zeige mit deinem Wissen aus den Modulen 014 bis 017, ob dieser Satz stimmt. Am Ende entscheidest du über die Karte.',
 'chronos': 'Du hast Gründe und Rechtfertigungen geprüft, Stimmen von Betroffenen gelesen und dich mit Verbrechen beschäftigt, die Deutsche begangen haben. Bevor ich die Akte schließe, brauche ich dein Urteil: Ist das alles wirklich nur Vergangenheit?',
 'diagnose': [
  {'tag': 'Wiederholung', 'frage': 'Was bedeutet Imperialismus?', 'right': 'a',
   'opts': [('a', 'Das Streben von Staaten, ihre Herrschaft über andere Länder und Völker auszudehnen'), ('b', 'Der Handel zwischen gleichberechtigten Staaten'), ('c', 'Der Zusammenschluss von Staaten zu einem Bund')]},
  {'tag': 'Richtig oder falsch', 'frage': 'Äthiopien wurde 1896 von Italien erobert.', 'right': 'f',
   'opts': [('r', 'Das stimmt'), ('f', 'Das stimmt nicht')]},
  {'tag': 'Wiederholung', 'frage': 'Wer war Samuel Maharero?', 'right': 'a',
   'opts': [('a', 'Das Oberhaupt der Herero in Deutsch-Südwestafrika'), ('b', 'Ein deutscher General'), ('c', 'Der König von Belgien')]},
 ],
 'diag_msg': ['Imperialismus heißt: Herrschaft ausdehnen.', 'Äthiopien besiegte 1896 bei Adwa das italienische Heer und blieb unabhängig.', 'Samuel Maharero war Oberhaupt der Herero.'],
 'sections': [
  {'id': 'orte', 'nav': 'Orte wiederfinden', 'h2': 'Orte des Imperialismus',
   'pre': '<p>Auf der Karte siehst du die Welt um 1914. Tippe im Bild auf das gesuchte Gebiet oder benutze die Knöpfe darunter.</p>',
   'tasks': [
    {'id': 'h1', 'type': 'hot', 'tag': 'Kartenarbeit', 'name': 'Orte wiederfinden', 'key': 'orte', 'komp': 'zeit_raum', 'svg': KARTE,
     'seq': [
      ['kongo', 'Finde das Gebiet, in dem Menschen unter Gewalt Kautschuk für König Leopold II. sammeln mussten (Modul 015).', 'Richtig. Der Kongo-Freistaat wurde zum Sinnbild für Ausbeutung durch Zwangsarbeit.'],
      ['dsw', 'Finde das Gebiet, in dem deutsche Truppen 1904 bis 1908 den Völkermord an den Herero und Nama verübten (Modul 016).', 'Richtig. Deutsch-Südwestafrika ist das heutige Namibia.'],
      ['doa', 'Finde das Gebiet, in dem 1905 der Maji-Maji-Krieg begann (Modul 015).', 'Richtig. Deutsch-Ostafrika umfasste das heutige Tansania, Ruanda und Burundi.'],
      ['aethiopien', 'Finde das Land, das 1896 bei Adwa seine Unabhängigkeit verteidigte (Modul 014 und 015).', 'Richtig. Äthiopien blieb neben Liberia als einziges Land Afrikas unabhängig.'],
     ],
     'all': [['kongo', 'Kongo'], ['dsw', 'Deutsch-Südwestafrika'], ['doa', 'Deutsch-Ostafrika'], ['kamerun', 'Kamerun'], ['aethiopien', 'Äthiopien'], ['indien', 'Britisch-Indien']],
     'wrong': {'kamerun': 'Das ist Kamerun, die Heimat von Rudolf Duala Manga Bell.', 'indien': 'Das ist Britisch-Indien, die wichtigste Kolonie Großbritanniens.'},
     'fertig': 'Alle vier Orte gefunden.', 'ok': 'Damit hast du alle vier Orte gefunden.'},
   ]},
  {'id': 'themen', 'nav': 'Themen ordnen', 'h2': 'Themen ordnen',
   'pre': '<p>Ordne jede Karte dem Modul zu, in dem sie vor allem vorkam.</p>',
   'tasks': [
    {'id': 'z1', 'type': 'zuord', 'tag': 'Zuordnen', 'name': 'Themen ordnen', 'key': 'themen_ordnen', 'komp': 'fachwissen',
     'frage': 'Wohin gehört jede Karte?',
     'zones': [['gruende', '014: Gründe für Kolonien'], ['erfahrung', '015: Erfahrungen der Kolonisierten'], ['reich', '016: Das Deutsche Reich'], ['rassismus', '017: Rassismus und Ausbeutung']],
     'cards': [
      ['Rohstoffe und Absatzmärkte für die Industrie', 'gruende'],
      ['Berliner Konferenz 1884/85', 'gruende'],
      ['Kautschuk-Zwangsarbeit im Kongo', 'erfahrung'],
      ['Widerstand durch Flucht, Bittschriften und Kampf', 'erfahrung'],
      ['Bülows Rede vom „Platz an der Sonne“', 'reich'],
      ['Völkermord an den Herero und Nama', 'reich'],
      ['Völkerschauen in Zoos und Ausstellungen', 'rassismus'],
      ['Passmarken und Prügelstrafen nur für Afrikaner', 'rassismus'],
     ],
     'ok': 'Alle acht richtig. Die vier Themen hängen eng zusammen: Wirtschaftliche Interessen führten zur Eroberung, Rassismus rechtfertigte sie, und die Kolonisierten bezahlten den Preis und wehrten sich.',
     'hint': 'Prüfe bei den rot umrandeten Karten: Geht es um Gründe, um das Erleben der Betroffenen, um Deutschland oder um Rassismus?',
     'post': '<div class="notice" data-lw="sicher"><strong>Hilfe:</strong> 014: Rohstoffe, Märkte, Konferenz. 015: Kongo, Widerstand. 016: Bülow, Herero und Nama. 017: Völkerschauen, Passmarken.</div>'},
    {'id': 'm1', 'type': 'multi', 'tag': 'Stimmt das?', 'name': 'Aussagen prüfen', 'key': 'aussagen', 'komp': 'fachwissen',
     'frage': 'Welche Aussagen stimmen? Wähle alle zutreffenden aus.',
     'opts': [('anerk', 'Die Bundesregierung bezeichnete die Verbrechen an den Herero und Nama 2021 als Völkermord.'),
              ('konf', 'Auf der Berliner Konferenz war kein Afrikaner vertreten.'),
              ('hunger', 'Im Maji-Maji-Krieg starben die meisten Menschen an Hunger.'),
              ('klein', 'Die deutschen Kolonien waren zusammen kleiner als Bayern.'),
              ('rassen', 'Menschen lassen sich biologisch klar in Rassen einteilen.')],
     'right': ['anerk', 'konf', 'hunger'],
     'wrongfb': {'klein': 'Nein. Die deutschen Kolonien waren zusammen etwa fünfmal so groß wie das Deutsche Reich.', 'rassen': 'Nein. Menschliche Rassen gibt es nicht. Die Einteilung war eine Erfindung des Rassismus.'},
     'ok': 'Richtig. Du hast die wichtigsten Fakten noch gut im Kopf.',
     'hint': 'Es sind drei Aussagen richtig.'},
   ]},
  {'id': 'zeit', 'nav': 'Zeit und Folgen', 'h2': 'Zeitleiste und Wirkungen',
   'pre': '<p>Bringe zuerst die Ereignisse in die richtige Reihenfolge. Verbinde danach Ursachen und Folgen.</p>',
   'tasks': [
    {'id': 'o1', 'type': 'order', 'tag': 'Zeitleiste', 'name': 'Zeitleiste', 'key': 'zeitleiste', 'komp': 'zeit_raum',
     'frage': 'Bringe die Ereignisse mit den Pfeilen in die richtige zeitliche Reihenfolge.',
     'items': [
      '1884/85: Berliner Konferenz über Afrika',
      '1896: Äthiopien besiegt Italien bei Adwa',
      '1897: Bülow fordert im Reichstag einen „Platz an der Sonne“',
      '1904: Beginn des Kriegs in Deutsch-Südwestafrika, Trothas Befehl',
      '1919: Deutschland muss im Versailler Vertrag alle Kolonien abgeben',
      '2021: Die Bundesregierung bezeichnet die Verbrechen als Völkermord',
     ],
     'ok': 'Genau. Zwischen der Berliner Konferenz und dem Verlust der deutschen Kolonien lagen nur 35 Jahre. Bis zur Anerkennung des Völkermords dauerte es dagegen über hundert Jahre.',
     'hint': 'Achte auf die Jahreszahlen am Anfang jeder Karte.'},
    {'id': 'p1', 'type': 'match', 'tag': 'Ursache und Folge', 'name': 'Ursachen und Folgen', 'key': 'ursache_folge', 'komp': 'ursachen_folgen',
     'frage': 'Welche Folge gehört zu welcher Ursache? Wähle aus.',
     'rows': [('Die Industrie braucht immer mehr Kautschuk.', 'Zwangsarbeit im Kongo'),
              ('Die Kolonialverwaltung verlangt Steuern in Geld.', 'Menschen müssen für Europäer arbeiten'),
              ('Deutsche Truppen verbrennen im Maji-Maji-Krieg Felder und Vorräte.', 'Hungersnot in Ostafrika'),
              ('Rassistische Ideen erklären Europäer für „überlegen“.', 'Ungleiche Rechte in den Kolonien')],
     'choices': ['Zwangsarbeit im Kongo', 'Menschen müssen für Europäer arbeiten', 'Hungersnot in Ostafrika', 'Ungleiche Rechte in den Kolonien'],
     'ok': 'Alles richtig. Du kannst Ursachen und Folgen sicher verbinden.',
     'hint': 'Frage dich bei jeder Ursache: Was geschah als Nächstes mit den Menschen in den Kolonien?'},
   ]},
  {'id': 'quellen', 'nav': 'Quellen wiederholen', 'h2': 'Quellen wiederholen',
   'pre': RUECKBLICK,
   'tasks': [
    {'id': 'q1', 'type': 'match', 'tag': 'Perspektiven', 'name': 'Quellen und Perspektiven', 'key': 'quellen_perspektiven', 'komp': 'quellenarbeit',
     'frage': 'Aus welcher Perspektive stammt jede Quelle? Wähle aus.',
     'rows': [('Jules Ferry, Rede 1885', 'Befürworter der Kolonialpolitik'),
              ('Bernhard von Bülow, Rede 1897', 'Befürworter der Kolonialpolitik'),
              ('Samuel Maharero, Brief 1904', 'Betroffener der Kolonialherrschaft'),
              ('Abraham Ulrikab, Tagebuch 1880', 'Betroffener der Kolonialherrschaft'),
              ('Lothar von Trotha, Proklamation 1904', 'Täter eines Völkermords')],
     'choices': ['Befürworter der Kolonialpolitik', 'Betroffener der Kolonialherrschaft', 'Täter eines Völkermords'],
     'ok': 'Alles richtig. Für ein vollständiges Bild braucht man alle Perspektiven: die der Befürworter, um ihre Rechtfertigungen zu verstehen, die der Täter als Beweis und die der Betroffenen, um ihr Erleben zu kennen.',
     'hint': 'Frage dich: Wer warb für Kolonien, wer litt unter ihnen, und wer gab einen Befehl zur Vernichtung?'},
    {'id': 'q2', 'type': 'single', 'tag': 'Quellenkritik', 'name': 'Quellenlage', 'key': 'quellenkritik', 'komp': 'quellenarbeit',
     'frage': 'Warum gibt es von Kolonisierten weniger schriftliche Quellen als von Kolonialbeamten?',
     'opts': [('a', 'Die Kolonialverwaltung bewahrte vor allem ihre eigenen Akten auf. Viele Betroffene gaben ihr Wissen mündlich weiter, und ihre Zeugnisse wurden oft nicht gesammelt.'),
              ('b', 'Weil die Kolonisierten nichts zu sagen hatten.'),
              ('c', 'Weil alle Quellen von Kolonisierten im Krieg verbrannt sind.')],
     'right': 'a',
     'ok': 'Richtig. Deshalb sind Quellen wie Mahareros Brief oder Abrahams Tagebuch so wertvoll. Heute befragen Forschende auch Nachfahren und sammeln mündliche Überlieferungen.',
     'fb': {'b': 'Nein. Sie hatten viel zu sagen, wie Mahareros Brief und Manga Bells Bittschriften zeigen. Ihre Stimmen wurden nur seltener aufbewahrt.', 'c': 'Nein. Das wäre zu einfach. Überlege, wer damals Archive führte.'}},
   ]},
  {'id': 'begriffe', 'nav': 'Begriffe prüfen', 'h2': 'Begriffe prüfen',
   'pre': '<div class="notice warn"><strong>Zur Erinnerung:</strong> Viele Wörter aus der Kolonialzeit klingen harmlos, beschreiben aber Herrschaft und Gewalt aus der Sicht der Kolonialmächte. Beispiele sind „Schutzgebiet“ für eine Kolonie, „Zivilisierungsmission“ für die Rechtfertigung von Eroberung oder „Aufstand“ für den Widerstand gegen eine fremde Herrschaft.</div>',
   'tasks': [
    {'id': 'b1', 'type': 'single', 'tag': 'Sprachkritik', 'name': 'Begriffe prüfen', 'key': 'begriffe', 'komp': 'perspektivitaet',
     'frage': 'Warum setzen Historikerinnen und Historiker Wörter wie „Schutzgebiet“ oder „Zivilisierungsmission“ in Anführungszeichen?',
     'opts': [('a', 'Die Wörter stammen aus der Sicht der Kolonialmächte und beschönigen Herrschaft und Gewalt. Die Anführungszeichen zeigen: Das ist nicht unsere Sicht.'),
              ('b', 'Weil die Wörter besonders lang sind.'),
              ('c', 'Weil man sie in der Kolonialzeit falsch geschrieben hat.')],
     'right': 'a',
     'ok': 'Richtig. Wer Wörter der Kolonialmächte einfach übernimmt, übernimmt leicht auch ihre Sicht. Deshalb prüfen wir Begriffe genauso kritisch wie Quellen.',
     'fb': {'b': 'Nein, um die Länge geht es nicht. Überlege, aus wessen Sicht die Wörter stammen.', 'c': 'Nein. Die Schreibweise ist nicht das Problem, sondern die Sichtweise.'}},
    {'id': 'w1', 'type': 'text', 'lw': 'weiter', 'score': False, 'tag': 'Weiterdenken · Sprachkritik', 'name': 'Begriff untersuchen', 'key': 'weiterdenken_begriff', 'komp': 'perspektivitaet',
     'frage': 'Wähle einen Begriff: „Schutzgebiet“, „Entdeckung“, „Aufstand“ oder „Zivilisierungsmission“. Erkläre, was er verschleiert und welches Wort besser passt.',
     'ph': 'Der Begriff ... verschleiert, dass ... Besser passt ..., weil ...',
     'need': [{'kw': ['schutz', 'entdeck', 'aufstand', 'zivilis'], 'miss': 'Nenne zuerst den Begriff, den du untersuchst.'},
              {'kw': ['herrschaft', 'gewalt', 'erober', 'widerstand', 'krieg', 'kolonie', 'besser', 'statt', 'beschonig', 'verschleier', 'rechtfertig', 'begegnung'], 'miss': 'Erkläre dann, was der Begriff verschleiert, und schlage ein besseres Wort vor.'}],
     'ok': 'Sehr gut. Du hast gezeigt, dass Sprache eine Perspektive transportiert. Das ist eine wichtige Fähigkeit, nicht nur im Fach Geschichte.',
     'short': 'Deine Antwort ist noch sehr kurz. Schreibe zwei Sätze: „Der Begriff ... verschleiert, dass ...“ und „Besser passt ..., weil ...“'},
   ]},
 ],
 'glossar': [
  ('Imperialismus', 'Das Streben von Staaten, ihre Herrschaft über andere Länder auszudehnen, besonders zwischen etwa 1880 und 1914.'),
  ('Kolonie', 'Ein Gebiet, das ein fremder Staat beherrscht. Die Menschen dort dürfen nicht mitbestimmen.'),
  ('Berliner Konferenz', 'Treffen von 14 Staaten 1884/85 in Berlin. Sie legten Regeln für die Aufteilung Afrikas fest, ohne Afrikanerinnen und Afrikaner.'),
  ('Zwangsarbeit', 'Arbeit gegen den eigenen Willen, oft ohne oder mit sehr wenig Lohn und unter Androhung von Strafen.'),
  ('Widerstand', 'Alle Handlungen, mit denen sich Menschen gegen eine Herrschaft wehren, vom bewaffneten Kampf bis zur Verweigerung im Alltag.'),
  ('Völkermord', 'Taten in der Absicht, eine Gruppe ganz oder teilweise zu vernichten. Die Verbrechen an den Herero und Nama 1904 bis 1908 waren ein Völkermord.'),
  ('Rassismus', 'Eine Ideologie, die Menschen einteilt, bewertet und benachteiligt. Er diente in der Kolonialzeit zur Rechtfertigung von Ausbeutung.'),
  ('Völkerschau', 'Vorführung von Menschen aus anderen Erdteilen zur Unterhaltung des Publikums in Zoos und Ausstellungen.'),
  ('Täterquelle', 'Eine Quelle von denen, die Verbrechen begangen haben, zum Beispiel Trothas Proklamation von 1904.'),
  ('Perspektive', 'Die Sicht, aus der jemand etwas wahrnimmt und beschreibt. Quellen zeigen immer eine Perspektive.'),
 ],
 'lerncheck': [
  'Ich kann Gründe, Formen und Folgen des Imperialismus erklären.',
  'Ich kann die Rolle des Deutschen Reichs im Kolonialismus beschreiben und beurteilen.',
  'Ich kann Quellen und Begriffe aus der Kolonialzeit nach ihrer Perspektive einordnen.',
 ],
 'abschluss': {
  'h2': 'Abschlussmission: die letzte Karteikarte',
  'karte': 'Auf Chronos’ letzter Karteikarte steht: <em>„Der Imperialismus ist lange vorbei. Mit uns heute hat er nichts mehr zu tun.“</em>',
  'frage': 'Wie entscheidest du?',
  'opts': [('ok', 'Die Karte stimmt so.'),
           ('teil', 'Die Karte ist falsch. Die Kolonialzeit ist vorbei, aber ihre Folgen wirken nach: in rassistischen Vorurteilen, in Museen und Straßennamen, in den Grenzen und der Wirtschaft vieler Länder und in der Frage, wie Deutschland Verantwortung übernimmt, etwa gegenüber Namibia.'),
           ('weiter', 'Die Karte ist falsch, denn die deutschen Kolonien bestehen bis heute weiter.')],
  'right': ['teil'],
  'fb': {'ok': 'Prüfe noch einmal: Worüber wurde 2021 und 2024 in Deutschland diskutiert? Und was hast du über Rassismus heute gelernt?',
         'teil': 'Gut entschieden. Begründe deine Entscheidung jetzt in A2.',
         'weiter': 'Nein. Deutschland verlor seine Kolonien 1919. Die Folgen der Kolonialzeit wirken aber bis heute nach.'},
  'a2': 'Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, was Imperialismus war und warum er uns heute noch etwas angeht. Nutze mindestens zwei Beispiele aus den Modulen 014 bis 017.',
  'ph': 'Lieber Chronos, du darfst die Akte noch nicht schließen, weil ...',
  'help': '„Imperialismus bedeutete, dass ...“ · „Ein Beispiel ist ..., denn ...“ · „Bis heute wirkt nach, dass ..., deshalb ...“',
  'crit': {
   'kurz': 'Chronos braucht mehr als einen Satz. Schreibe drei bis fünf Sätze mit mindestens zwei Beispielen.',
   'gruppen': [
    {'kw': ['imperialismus', 'kolonie', 'erober', 'herrschaft', 'rohstoff', 'macht', 'berliner', 'aufteil', 'ausbeut'], 'miss': 'Erkläre kurz, was Imperialismus war, zum Beispiel die Eroberung und Ausbeutung von Kolonien.'},
    {'kw': ['herero', 'nama', 'volkermord', 'maji', 'kongo', 'zwangsarbeit', 'widerstand', 'rassis', 'volkerschau', 'maharero', 'ulrikab', 'bulow', 'trotha', 'ferry', 'kautschuk'], 'miss': 'Nenne ein konkretes Beispiel aus den Modulen, etwa den Völkermord an den Herero und Nama oder die Zwangsarbeit im Kongo.'},
    {'kw': ['heute', 'folge', 'nachwirk', 'strasse', 'erinner', 'anerkenn', 'museum', 'gebeine', 'vorurteil', 'verantwort', '2021', 'namibia', 'diskrimin', 'grenze'], 'miss': 'Erkläre, was davon bis heute nachwirkt, zum Beispiel Rassismus, Straßennamen oder die Anerkennung von 2021.'},
   ],
   'gut': 'Sehr gut. Du verbindest Vergangenheit und Gegenwart und begründest dein Urteil mit Beispielen. Chronos lässt die Akte offen, denn Erinnern ist eine Aufgabe, die bleibt.'},
  'post': '<div class="notice calm"><strong>Zum Schluss:</strong> Wenn dich die Inhalte dieses Themenbereichs beschäftigen, sprich mit deiner Lehrkraft oder mit der Schulsozialarbeit.</div>',
 },
 'next': 'Damit hast du den Themenbereich Imperialismus und Weltpolitik und den Jahrgang 8 abgeschlossen. In Jahrgang 9 geht es weiter mit Modul 001: Warum begann 1914 ein Weltkrieg?',
 'lw_weiter': 'Du bekommst zusätzlich eine Aufgabe zur Sprachkritik.',
}
