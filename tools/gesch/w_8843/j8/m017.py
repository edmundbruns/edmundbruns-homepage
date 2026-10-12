HINWEIS = '''<div class="notice calm"><strong>Bevor du startest:</strong> In diesem Modul geht es um Rassismus. Wir erklären, wie er funktioniert, ohne rassistische Wörter und Bilder zu wiederholen. Manche von euch haben selbst Rassismus erlebt. Niemand muss hier etwas Persönliches erzählen. Wenn dich etwas belastet, sprich mit deiner Lehrkraft oder mit der Schulsozialarbeit.</div>'''

KREIS = '''<p>Rassismus und Ausbeutung verstärkten sich gegenseitig. Man kann sich das wie einen Kreislauf vorstellen:</p>
<div class="kreis" aria-label="Kreislauf von Rassismus und Ausbeutung in vier Schritten">
 <div><strong>Ideen:</strong> Europäer erklären sich selbst für „höher“ und andere für „niedriger“.</div>
 <div><strong>Gesetze:</strong> Für Kolonisierte gelten weniger Rechte und härtere Strafen.</div>
 <div><strong>Ausbeutung:</strong> Land, Arbeit und Rohstoffe werden genommen. Firmen und Siedler verdienen daran.</div>
 <div><strong>Bilder:</strong> Werbung, Schulbücher und Völkerschauen verbreiten die Ideen in Europa. Der Kreislauf beginnt von vorn.</div>
</div>'''

ULRIKAB = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Abraham Ulrikab, Tagebuch, Berlin, Oktober und November 1880.</strong> Auszüge. Übersetzt aus dem Inuktitut von dem Missionar Carl Gottlieb Kretschmer. Rechtschreibung wie in der Übersetzung.</p>
 <p>Abraham Ulrikab war ein Inuk aus Hebron in Labrador, im Nordosten des heutigen Kanada. Er war Christ und konnte lesen und schreiben. 1880 reiste er mit seiner Frau Ulrike, den Töchtern Sara und Maria und fünf weiteren Inuit nach Europa. Ein Mitarbeiter des Hamburger Tierhändlers Carl Hagenbeck hatte sie angeworben. Sie wurden im Tierpark in Hamburg und im Zoologischen Garten in Berlin ausgestellt. Abraham schrieb ein Tagebuch.</p>
 <p class="quote">„Ja auszugehen am Tage ist unmöglich vor Menschen, weil wir völlig von ihnen umgeben sind, von sehr verschiedenen Gesichtern.“</p>
 <p class="quote">„Unsere Mitmenschen, die Fuchsfamilie (Terrianiakut) hören auf vergnügt zu sein, weil sie müde sind der Leute. Und wir im andern Hause sind geduldig gewesen, obwohl wir auch groß müde sind.“</p>
 <p class="quote">„Es ist gar zu lange bis übers Jahr, weil wir gerne schnell zurück kehren möchten in unser Land, weil wir’s unvermögend sind, hier immer zu sein, ja gewiß, es ist unmöglich.“</p>
 <p>Abraham berichtet auch, dass der Begleiter der Gruppe einen jungen Inuk namens Tobias mit einer Hundepeitsche schlug.</p>
 <p class="hint">Fundort: deutsche Übersetzung von Kretschmer, hier nach „German History in Documents and Images“ des Deutschen Historischen Instituts Washington. Das Original in Inuktitut ist verschollen.</p>
</div>
<details class="gloss"><summary>Wörter, die heute ungewohnt sind</summary><div class="body"><strong>unvermögend sein:</strong> etwas nicht können oder nicht aushalten. <strong>groß müde:</strong> sehr müde. <strong>übers Jahr:</strong> in einem Jahr. Der Vertrag lief ein Jahr lang.</div></details>
<div class="notice calm"><strong>Was danach geschah:</strong> Keiner der acht Inuit kehrte nach Hause zurück. Sie waren vor der Reise nicht gegen Pocken geimpft worden. Bis Januar 1881 starben alle acht in Europa, unter ihnen Abraham, Ulrike, Sara und Maria. Ihre Skelette kamen in Museumssammlungen. Erst 2014 machte eine kanadische Forscherin öffentlich, wo sie sich befanden.</div>'''

M = {
 'num': '017',
 'titel': 'Wie wirkten Rassismus und Ausbeutung zusammen?',
 'bereich': 'Imperialismus und Weltpolitik',
 'intro': 'Wie konnte es sein, dass viele Menschen in Europa Landraub, Zwangsarbeit und Gewalt in den Kolonien für richtig hielten? Eine wichtige Antwort lautet: Rassismus. In diesem Modul untersuchst du, wie rassistische Ideen Ausbeutung rechtfertigten, wie sie in Europa verbreitet wurden und was davon bis heute nachwirkt.',
 'hinweis': HINWEIS,
 'ziele': [
  'Du erklärst in drei Schritten, wie Rassismus funktioniert.',
  'Du zeigst, wie rassistische Behauptungen Zwangsarbeit, Landraub und ungleiche Rechte rechtfertigten.',
  'Du beschreibst, was Völkerschauen waren und wie Menschen sich dagegen behaupteten.',
  'Du wertest das Tagebuch von Abraham Ulrikab als Quelle aus.',
  'Du nennst Folgen des kolonialen Rassismus bis heute und Wege, ihm zu begegnen.',
 ],
 'mission_pre': '''<div class="notice"><strong>Ein Blick in eine Zeitschrift um 1900:</strong> Werbung für Kaffee, Kakao, Schokolade und Seife zeigte oft Schwarze Menschen als Diener oder als lächerliche Figuren. Solche Bilder zeigen wir hier bewusst nicht. Sie sollten vermitteln, Weiße seien von Natur aus überlegen und zum Herrschen bestimmt. Und sie verkauften Waren, die in den Kolonien unter Zwang angebaut wurden.</div>''',
 'fall': 'Auf Chronos’ Karteikarte steht: <em>„Rassismus war damals einfach eine falsche Meinung einzelner Leute. Mit der Ausbeutung in den Kolonien hatte er nichts zu tun.“</em>',
 'auftrag': 'Untersuche, wie Rassismus funktionierte, wem er nützte und welche Folgen er hatte. Am Ende entscheidest du über die Karte.',
 'chronos': 'Auch in meinem Archiv stehen Bücher, die Menschen in „Rassen“ einteilen und bewerten. Früher standen sie im Regal für Wissenschaft. Heute stehen sie im Regal für Quellen, weil sie zeigen, wie man Unrecht begründet hat. Schauen wir genau hin.',
 'diagnose': [
  {'tag': 'Begriff', 'frage': 'Was ist Rassismus?', 'right': 'a',
   'opts': [('a', 'Menschen werden nach Herkunft, Hautfarbe oder Aussehen in Gruppen eingeteilt, abgewertet und benachteiligt'), ('b', 'Jede Meinung über ein anderes Land'), ('c', 'Ein Fachbegriff aus der Biologie für Tierarten')]},
  {'tag': 'Richtig oder falsch', 'frage': 'Nach heutigem Wissen lassen sich Menschen biologisch in Rassen einteilen.', 'right': 'f',
   'opts': [('r', 'Das stimmt'), ('f', 'Das stimmt nicht')]},
  {'tag': 'Vermutung', 'frage': 'Was waren „Völkerschauen“?', 'right': 'a',
   'opts': [('a', 'Veranstaltungen, bei denen Menschen aus anderen Erdteilen wie Ausstellungsstücke vorgeführt wurden'), ('b', 'Theaterstücke über die Geschichte der Völker'), ('c', 'Internationale Sportfeste')]},
 ],
 'diag_msg': ['Rassismus heißt: einteilen, abwerten, benachteiligen.', 'Menschliche Rassen gibt es nicht. Die genetischen Unterschiede zwischen Menschen haben keine festen Grenzen.', 'In Völkerschauen wurden Menschen wie Ausstellungsstücke gezeigt.'],
 'sections': [
  {'id': 'begriff', 'nav': 'Was ist Rassismus?', 'h2': 'Wie Rassismus funktioniert',
   'pre': '''<p>Rassismus funktioniert in drei Schritten. <strong>Erstens</strong> werden Menschen nach äußeren Merkmalen wie der Hautfarbe in Gruppen eingeteilt, die man „Rassen“ nannte. <strong>Zweitens</strong> werden diese Gruppen bewertet: Man dichtet ihnen Eigenschaften an und stellt sie als „höher“ oder „niedriger“ dar. <strong>Drittens</strong> werden damit ungleiche Rechte, Zwang und Gewalt begründet.</p>
<p>Im 19. Jahrhundert gaben viele Wissenschaftler dem Rassismus einen scheinbar wissenschaftlichen Anstrich. Sie vermaßen Schädel und stellten Ranglisten von Menschengruppen auf, an deren Spitze sie meist sich selbst setzten. Heute ist klar: Diese Einteilungen waren falsch. Die genetischen Unterschiede zwischen Menschen verlaufen fließend, ohne feste Grenzen.</p>
<div class="akte"><span class="stamp">Darstellung</span><p><strong>Jenaer Erklärung, 2019.</strong> Wissenschaftlerinnen und Wissenschaftler der Deutschen Zoologischen Gesellschaft stellten 2019 in Jena fest:</p><p class="quote">„Das Konzept der Rasse ist das Ergebnis von Rassismus und nicht dessen Voraussetzung.“</p></div>''',
   'tasks': [
    {'id': 'o1', 'type': 'order', 'tag': 'Schritte ordnen', 'name': 'Wie Rassismus funktioniert', 'key': 'rassismus_schritte', 'komp': 'ursachen_folgen',
     'frage': 'Bringe die Schritte mit den Pfeilen in die richtige Reihenfolge.',
     'items': [
      'Menschen werden nach Hautfarbe oder Herkunft in Gruppen eingeteilt.',
      'Den Gruppen werden Eigenschaften angedichtet. Sie werden als „höher“ oder „niedriger“ bewertet.',
      'Mit dieser Bewertung werden ungleiche Rechte, Zwang und Gewalt gerechtfertigt.',
      'Wer davon Vorteile hat, verteidigt die Rangordnung. Sie wird im Alltag weitergegeben.',
     ],
     'ok': 'Genau. Rassismus ist also mehr als ein Vorurteil. Er ordnet Menschen in eine Rangordnung und begründet damit Benachteiligung, von der andere profitieren.',
     'hint': 'Am Anfang steht das Einteilen, dann das Bewerten, dann das Benachteiligen.'},
    {'id': 's1', 'type': 'single', 'tag': 'Darstellung verstehen', 'name': 'Jenaer Erklärung', 'key': 'jenaer_erklaerung', 'komp': 'fachwissen',
     'frage': 'Was meinen die Forschenden mit dem Satz: „Das Konzept der Rasse ist das Ergebnis von Rassismus und nicht dessen Voraussetzung“?',
     'opts': [('a', 'Zuerst wollten Menschen andere abwerten und beherrschen. Dafür erfanden sie die Einteilung in „Rassen“. Man hat keine Rassen entdeckt, die es vorher gab.'),
              ('b', 'Es gibt Rassen, aber man soll nicht darüber sprechen.'),
              ('c', 'Rassismus entsteht, weil es große biologische Unterschiede zwischen Menschen gibt.')],
     'right': 'a',
     'ok': 'Richtig. Die Idee der „Rassen“ diente von Anfang an dazu, Herrschaft und Ausbeutung zu rechtfertigen. Deshalb setzen wir das Wort in Anführungszeichen, wenn wir über die Geschichte sprechen.',
     'fb': {'b': 'Nein. Die Forschenden sagen gerade, dass es keine menschlichen Rassen gibt.', 'c': 'Nein, umgekehrt: Nicht Unterschiede erzeugen Rassismus, sondern Rassismus erfindet Rangordnungen.'}},
   ]},
  {'id': 'rechtfertigung', 'nav': 'Rechtfertigung', 'h2': 'Rassismus als Rechtfertigung für Ausbeutung',
   'pre': KREIS + '''<p>In den Kolonien wurde Rassismus zu Gesetz. In Deutsch-Südwestafrika zum Beispiel galten für Europäer und Afrikaner unterschiedliche Regeln. Prügelstrafen durften nur gegen Afrikanerinnen und Afrikaner verhängt werden. Kolonialpolitiker behaupteten, Afrikaner müssten „zur Arbeit erzogen“ werden. So begründeten sie Zwangsarbeit.</p>''',
   'tasks': [
    {'id': 'p1', 'type': 'match', 'tag': 'Behauptung und Folge', 'name': 'Behauptungen und Folgen', 'key': 'behauptung_folge', 'komp': 'ursachen_folgen',
     'frage': 'Welche Folge in den Kolonien wurde mit welcher Behauptung gerechtfertigt? Wähle aus.',
     'persons_html': '<p class="hint">Die Sätze geben Behauptungen aus der Kolonialzeit sinngemäß wieder. Sie sind falsch und rassistisch. Wir zeigen sie nur, um zu verstehen, wie Unrecht begründet wurde.</p>',
     'rows': [
      ('Behauptung: „Die Einheimischen müssen zur Arbeit erzogen werden.“', 'Zwangsarbeit'),
      ('Behauptung: „Europäer sind zum Herrschen bestimmt.“', 'keine Mitbestimmung'),
      ('Behauptung: „Die Einheimischen verstehen nur Strenge.“', 'Prügelstrafen'),
      ('Behauptung: „Die Einheimischen nutzen das Land nicht richtig.“', 'Enteignung von Land'),
     ],
     'choices': ['Zwangsarbeit', 'keine Mitbestimmung', 'Prügelstrafen', 'Enteignung von Land'],
     'ok': 'Alles richtig. Jede dieser Behauptungen hatte eine Aufgabe: Sie sollte ein Unrecht als normal oder sogar als gut erscheinen lassen. Wer davon profitierte, hatte ein Interesse daran, dass sie geglaubt wurden.',
     'hint': 'Frage bei jeder Behauptung: Welches Unrecht sollte damit gerechtfertigt werden?'},
    {'id': 'g1', 'type': 'gap', 'tag': 'Lückentext', 'name': 'Rangordnung in Deutsch-Südwestafrika', 'key': 'rangordnung', 'komp': 'fachwissen',
     'frage': 'Wähle in jeder Lücke das passende Wort.',
     'text': 'In Deutsch-Südwestafrika galten für Europäer und Afrikaner unterschiedliche {}. Ab 1907 musste jeder Afrikaner ab sieben Jahren eine {} tragen und sie jedem Weißen auf Verlangen zeigen. Ehen zwischen deutschen Männern und afrikanischen Frauen wurden 1907 für {} erklärt. So entstand eine {}, in der die Hautfarbe über die Rechte eines Menschen entschied.',
     'gaps': [{'opts': ['Uhrzeiten', 'Gesetze', 'Sportarten'], 'right': 'Gesetze'},
              {'opts': ['Passmarke', 'Uniform', 'Krone'], 'right': 'Passmarke'},
              {'opts': ['vorbildlich', 'verpflichtend', 'ungültig'], 'right': 'ungültig'},
              {'opts': ['Rangordnung', 'Demokratie', 'Freundschaft'], 'right': 'Rangordnung'}],
     'ok': 'Alles richtig. Die Kolonialverwaltung schrieb die rassistische Rangordnung in Gesetze und Verordnungen. Rassismus war also nicht nur eine Meinung, sondern geltendes Recht.',
     'hint': 'Denke an das, was du in Modul 016 über Deutsch-Südwestafrika gelernt hast.'},
   ]},
  {'id': 'voelkerschau', 'nav': 'Völkerschauen', 'h2': 'Menschen als Ausstellungsstücke',
   'pre': '''<p>Ab den 1870er-Jahren veranstalteten der Hamburger Tierhändler Carl Hagenbeck und andere Unternehmer sogenannte <strong>Völkerschauen</strong>. Menschen aus Afrika, Asien, Amerika oder der Arktis wurden in Zoos, auf Jahrmärkten und in Ausstellungen vorgeführt. Sie mussten Tänze, Kämpfe oder angeblichen Alltag zeigen. Millionen Menschen in Europa kamen zum Zuschauen. Die Schauen verbreiteten das Bild von „wilden“ Fremden und „zivilisierten“ Europäern.</p>
<p>1896 fand im Treptower Park in Berlin die Erste Deutsche Kolonialausstellung statt. Vom 1. Mai bis zum 15. Oktober wurden dort 106 Menschen aus den deutschen Kolonien ausgestellt.</p>
<div class="persons" aria-label="Zwei Menschen aus der Ausstellung von 1896">
 <div class="person"><strong>Kwelle Ndumbe</strong><p>Er kam aus Kamerun. In der Ausstellung kaufte er sich ein Opernglas und betrachtete damit die Besucherinnen und Besucher, die ihn anstarrten.</p></div>
 <div class="person"><strong>Martin Dibobe</strong><p>Geboren 1876 in Kamerun. Nach der Ausstellung blieb er in Berlin, machte eine Ausbildung und wurde Zugführer bei der Berliner Hochbahn. 1919 schrieb er mit 17 anderen Afrikanern aus den früheren Kolonien eine Bittschrift an die deutsche Regierung und das Parlament. Sie forderten gleiche Rechte.</p></div>
</div>''',
   'tasks': [
    {'id': 'm1', 'type': 'multi', 'tag': 'Mehrfachauswahl', 'name': 'Völkerschauen', 'key': 'voelkerschauen', 'komp': 'fachwissen',
     'frage': 'Welche Aussagen über Völkerschauen stimmen? Wähle alle zutreffenden aus.',
     'opts': [('geld', 'Die Veranstalter verdienten mit den Schauen viel Geld.'),
              ('bild', 'Sie verbreiteten ein falsches Bild von „wilden“ Menschen und europäischer Überlegenheit.'),
              ('krank', 'Manche Ausgestellte erkrankten in Europa und starben.'),
              ('echt', 'Sie zeigten den Alltag der Menschen genau so, wie er wirklich war.'),
              ('gleich', 'Die Ausgestellten wurden wie Gäste mit gleichen Rechten behandelt.')],
     'right': ['geld', 'bild', 'krank'],
     'wrongfb': {'echt': 'Nein. Die Veranstalter bestimmten, was gezeigt wurde, und wählten aus, was die Zuschauer für „wild“ und „fremd“ hielten.', 'gleich': 'Nein. Die Ausgestellten wurden angestarrt, oft eingezäunt und hatten kaum Rechte gegenüber den Veranstaltern.'},
     'ok': 'Richtig. Völkerschauen machten aus Menschen eine Ware für Zuschauer. Sie zeigten nicht die Wirklichkeit, sondern das Bild, das die Veranstalter verkaufen wollten.',
     'hint': 'Denke daran, wer die Schauen plante und wer daran verdiente.'},
    {'id': 's2', 'type': 'single', 'tag': 'Perspektive', 'name': 'Der Blick zurück', 'key': 'blick_zurueck', 'komp': 'perspektivitaet',
     'frage': 'Kwelle Ndumbe betrachtete die Besucher mit einem Opernglas. Was zeigt diese Geschichte?',
     'opts': [('a', 'Er drehte die Rollen um: Die Zuschauer wurden selbst zu Beobachteten. Er zeigte, dass er kein Ausstellungsstück war, sondern ein Mensch mit eigenem Blick.'),
              ('b', 'Er wollte die Tiere im Park besser sehen.'),
              ('c', 'Sie zeigt nichts Besonderes, weil er nur ein Besucher war.')],
     'right': 'a',
     'ok': 'Richtig. Mit einer einfachen Handlung widersprach er der Rolle, die ihm zugedacht war. Auch das war eine Form von Widerstand.',
     'fb': {'b': 'Lies noch einmal genau: Wen betrachtete er mit dem Opernglas?', 'c': 'Doch. Er war nicht als Besucher da, sondern als Ausgestellter. Gerade deshalb ist sein Blick zurück bedeutsam.'}},
   ]},
  {'id': 'quelle', 'nav': 'Die Quelle', 'h2': 'Die Quelle: das Tagebuch von Abraham Ulrikab',
   'pre': ULRIKAB,
   'tasks': [
    {'id': 'q1', 'type': 'multi', 'tag': 'Quellenarbeit', 'name': 'Quellenarbeit Ulrikab', 'key': 'quelle_ulrikab', 'komp': 'quellenarbeit',
     'frage': 'Was erfährst du aus den Auszügen über Abrahams Erleben? Wähle alle zutreffenden Aussagen aus.',
     'opts': [('eng', 'Die Inuit waren ständig von Menschen umgeben und konnten tagsüber kaum hinausgehen.'),
              ('muede', 'Sie waren erschöpft von den vielen Zuschauern.'),
              ('heim', 'Sie wollten möglichst schnell nach Hause zurück.'),
              ('ruhm', 'Sie genossen es, in Berlin berühmt zu sein.'),
              ('frei', 'Sie konnten jederzeit nach Labrador zurückfahren.')],
     'right': ['eng', 'muede', 'heim'],
     'wrongfb': {'ruhm': 'Davon steht nichts im Text. Abraham schreibt, dass sie „groß müde“ sind.', 'frei': 'Nein. Sie hatten einen Vertrag für ein Jahr und schreiben, wie lange ihnen diese Zeit vorkommt.'},
     'ok': 'Genau. Abraham beschreibt Enge, Erschöpfung und Heimweh. Die Zuschauer sahen eine Vorführung, Abraham erlebte eine Zeit großer Belastung.',
     'hint': 'Lies die drei Auszüge noch einmal. Zu jedem passt eine richtige Aussage.'},
    {'id': 'q2', 'type': 'single', 'tag': 'Quellenkritik', 'name': 'Quellenkritik Ulrikab', 'key': 'quellenkritik', 'komp': 'quellenarbeit',
     'frage': 'Das Tagebuch kennen wir nur aus der Übersetzung eines Missionars. Warum ist es trotzdem eine besonders wertvolle Quelle?',
     'opts': [('a', 'Es ist der einzige bekannte Bericht eines Menschen, der selbst in einer Völkerschau von Hagenbeck ausgestellt wurde. Fast alle anderen Quellen stammen von Veranstaltern, Zeitungen und Zuschauern.'),
              ('b', 'Weil Übersetzungen immer fehlerfrei sind.'),
              ('c', 'Weil Carl Hagenbeck das Tagebuch selbst geschrieben hat.')],
     'right': 'a',
     'ok': 'Richtig. Wer? Abraham Ulrikab. Wann? 1880, während der Reise. Für wen? Vermutlich für sich und seine Gemeinde in Labrador. Warum? Um festzuhalten, was er erlebte. Was fehlt? Der Originaltext und die Stimmen der anderen sieben Inuit.',
     'fb': {'b': 'Nein. Bei jeder Übersetzung kann sich etwas verändern. Das muss man bedenken.', 'c': 'Nein. Abraham schrieb es selbst in seiner Sprache Inuktitut.'}},
    {'id': 'q3', 'type': 'single', 'tag': 'Quelle oder Darstellung', 'name': 'Quelle und Darstellung', 'key': 'quelle_darstellung', 'komp': 'quellenarbeit',
     'frage': 'Das Tagebuch ist eine Quelle. Was davon ist eine Darstellung?',
     'opts': [('a', 'Ein Dokumentarfilm aus dem Jahr 2016 über Abraham Ulrikab'),
              ('b', 'Ein Plakat, das 1880 für die Völkerschau in Berlin warb'),
              ('c', 'Ein Zeitungsbericht vom Oktober 1880 über die Inuit im Zoo')],
     'right': 'a',
     'ok': 'Richtig. Der Film entstand viel später und erzählt die Geschichte mit Hilfe von Quellen. Plakat und Zeitungsbericht stammen aus der Zeit selbst.',
     'fb': {'b': 'Noch nicht. Das Plakat stammt aus dem Jahr 1880. Es ist eine Quelle.', 'c': 'Noch nicht. Der Zeitungsbericht erschien 1880. Er ist eine Quelle.'}},
    {'id': 'w1', 'type': 'text', 'lw': 'weiter', 'score': False, 'tag': 'Weiterdenken · Gegenwart', 'name': 'Namen statt Ausstellungsstücke', 'key': 'weiterdenken_namen', 'komp': 'perspektivitaet',
     'frage': 'Warum ist es wichtig, Abraham, Ulrike, Sara und Maria mit Namen zu nennen, statt nur von „den Inuit im Zoo“ zu sprechen? Was folgt daraus für den Umgang mit menschlichen Gebeinen in Museen heute?',
     'ph': 'Es ist wichtig, ihre Namen zu nennen, weil ... Für Museen bedeutet das, dass ...',
     'need': [{'kw': ['name', 'mensch', 'person', 'wurde', 'individu', 'familie', 'geschichte', 'personlich', 'objekt', 'gegenstand'], 'miss': 'Erkläre zuerst, was sich ändert, wenn man die Namen nennt: Wer wird dann sichtbar?'},
              {'kw': ['museum', 'gebeine', 'skelett', 'zuruck', 'ruckgabe', 'ruckfuhr', 'respekt', 'grab', 'beerdig', 'ausstell', 'nachfahren', 'heimat'], 'miss': 'Schreibe dann, was das für Gebeine in Museen bedeutet.'}],
     'ok': 'Sehr gut durchdacht. Namen machen aus Ausstellungsstücken wieder Menschen mit Familie und Geschichte. Deshalb fordern Nachfahren heute, dass Gebeine aus Sammlungen zurückgegeben und würdig bestattet werden.',
     'short': 'Deine Antwort ist noch sehr kurz. Schreibe zwei Sätze: „Es ist wichtig, ihre Namen zu nennen, weil ...“ und „Für Museen bedeutet das, dass ...“'},
   ]},
  {'id': 'heute', 'nav': 'Folgen bis heute', 'h2': 'Folgen bis heute',
   'pre': '''<p>Mit dem Ende der Kolonien verschwand der Rassismus nicht. Rassistische Bilder fand man noch lange in Werbung, Kinderbüchern und Schulbüchern. Viele Schwarze Menschen und People of Color in Deutschland erleben bis heute Benachteiligung, zum Beispiel bei der Wohnungssuche, bei der Arbeit oder durch Beleidigungen. Das Grundgesetz verbietet in Artikel 3, dass jemand wegen seiner Herkunft benachteiligt wird.</p>
<p>Viele Museen prüfen heute, woher ihre Sammlungen stammen, und geben Gegenstände und Gebeine zurück. Und viele Menschen achten darauf, welche Wörter sie benutzen. Sie verwenden Selbstbezeichnungen, also die Namen, die Menschen für sich selbst gewählt haben.</p>''',
   'tasks': [
    {'id': 'o2', 'type': 'order', 'tag': 'Zeitleiste', 'name': 'Zeitleiste 1870 bis 2019', 'key': 'zeitleiste', 'komp': 'zeit_raum',
     'frage': 'Bringe die Ereignisse aus diesem Modul mit den Pfeilen in die richtige zeitliche Reihenfolge.',
     'items': [
      '1870er-Jahre: Carl Hagenbeck beginnt in Hamburg mit Völkerschauen.',
      '1880: Abraham Ulrikab und seine Familie werden in Hamburg und Berlin ausgestellt.',
      '1896: Erste Deutsche Kolonialausstellung im Treptower Park in Berlin.',
      '1907: In Deutsch-Südwestafrika wird die Passmarke für Afrikaner Pflicht.',
      '1919: Martin Dibobe und andere fordern in einer Bittschrift gleiche Rechte.',
      '2019: Die Jenaer Erklärung stellt fest, dass es keine menschlichen Rassen gibt.',
     ],
     'ok': 'Genau. Rassistische Ideen wurden über Jahrzehnte verbreitet und in Gesetze geschrieben. Ebenso lange gab es Menschen, die sich dagegen wehrten. Dass die Wissenschaft die Idee der Rassen klar zurückweist, ist noch gar nicht lange her.',
     'hint': 'Achte auf die Jahreszahlen am Anfang jeder Karte.'},
    {'id': 'm2', 'type': 'multi', 'tag': 'Handeln', 'name': 'Was gegen Rassismus hilft', 'key': 'handeln_heute', 'komp': 'perspektivitaet',
     'frage': 'Welche Handlungen helfen gegen Rassismus? Wähle alle zutreffenden aus.',
     'opts': [('hilfe', 'Wenn jemand rassistisch beleidigt wird, der Person beistehen und Hilfe holen.'),
              ('worte', 'Selbstbezeichnungen verwenden, zum Beispiel „Schwarze Menschen“.'),
              ('fragen', 'Bei Bildern und Wörtern fragen: Wer hat sie gemacht, und wen werten sie ab?'),
              ('witz', 'Rassistische Witze weitererzählen, weil sie „nur Spaß“ sind.'),
              ('weg', 'Wegschauen, weil es einen selbst nicht betrifft.')],
     'right': ['hilfe', 'worte', 'fragen'],
     'wrongfb': {'witz': 'Rassistische Witze verletzen und geben alte Abwertungen weiter, auch wenn sie als Spaß gemeint sind.', 'weg': 'Wegschauen lässt Betroffene allein. Schon kleine Zeichen der Unterstützung helfen.'},
     'ok': 'Richtig. Gegen Rassismus hilft Wissen, wie du es in diesem Modul gesammelt hast, und Handeln im Alltag. Du musst dabei nicht alles allein lösen: Lehrkräfte und Schulsozialarbeit unterstützen dich.',
     'hint': 'Frage dich bei jeder Handlung: Hilft sie den Betroffenen oder schadet sie ihnen?'},
   ]},
 ],
 'glossar': [
  ('Rassismus', 'Eine Ideologie, die Menschen nach Herkunft, Hautfarbe oder Aussehen in Gruppen einteilt, bewertet und benachteiligt. Rassismus zeigt sich in Gedanken, Worten, Bildern, Gesetzen und Taten.'),
  ('„Rasse“', 'Ein Begriff, mit dem Menschen in angeblich feste Gruppen eingeteilt wurden. Menschliche Rassen gibt es nicht. Deshalb steht das Wort in Anführungszeichen.'),
  ('Rangordnung', 'Eine Ordnung, in der manche Gruppen oben und andere unten stehen. Ein anderes Wort dafür ist Hierarchie.'),
  ('Völkerschau', 'Eine Veranstaltung, bei der Menschen aus anderen Erdteilen zur Unterhaltung des Publikums vorgeführt wurden, etwa ab den 1870er-Jahren bis in die 1930er-Jahre.'),
  ('Kolonialausstellung', 'Eine Ausstellung, die für die Kolonien werben sollte. In Berlin wurden 1896 dabei 106 Menschen aus den deutschen Kolonien ausgestellt.'),
  ('Stereotyp', 'Ein vereinfachtes, festes Bild von einer Gruppe, das allen ihren Mitgliedern dieselben Eigenschaften zuschreibt.'),
  ('Schwarz', 'Eine Selbstbezeichnung. Sie wird großgeschrieben, weil sie keine Farbe beschreibt, sondern gemeinsame Erfahrungen mit Rassismus.'),
  ('Selbstbezeichnung', 'Ein Name, den Menschen für sich selbst gewählt haben, im Unterschied zu Namen, die andere ihnen gegeben haben.'),
  ('Inuk und Inuit', 'Inuk ist ein Mensch aus dem Volk der Inuit, das in der Arktis lebt, zum Beispiel in Kanada und Grönland. Inuit ist die Mehrzahl.'),
 ],
 'lerncheck': [
  'Ich kann erklären, wie Rassismus Menschen einteilt, bewertet und benachteiligt.',
  'Ich kann an Beispielen zeigen, wie Rassismus Ausbeutung in den Kolonien rechtfertigte.',
  'Ich kann Folgen des kolonialen Rassismus bis heute nennen.',
 ],
 'abschluss': {
  'h2': 'Abschlussmission: die Karteikarte',
  'karte': 'Auf Chronos’ Karteikarte steht: <em>„Rassismus war damals einfach eine falsche Meinung einzelner Leute. Mit der Ausbeutung in den Kolonien hatte er nichts zu tun.“</em>',
  'frage': 'Wie entscheidest du?',
  'opts': [('ok', 'Die Karte stimmt so.'),
           ('teil', 'Die Karte ist falsch. Rassismus war ein ganzes System aus Ideen, Gesetzen und Bildern. Er diente dazu, Landraub, Zwangsarbeit und Gewalt zu rechtfertigen, und wurde in Europa über Werbung, Bücher und Völkerschauen verbreitet. Seine Folgen wirken bis heute.'),
           ('vorbei', 'Die Karte ist falsch. Aber heute gibt es überhaupt keinen Rassismus mehr.')],
  'right': ['teil'],
  'fb': {'ok': 'Prüfe noch einmal: Standen die rassistischen Regeln in Deutsch-Südwestafrika nur in den Köpfen einzelner Leute oder in Gesetzen?',
         'teil': 'Gut entschieden. Begründe deine Entscheidung jetzt in A2.',
         'vorbei': 'Der erste Teil stimmt. Aber leider erleben Menschen auch heute Rassismus. Denke an den Abschnitt „Folgen bis heute“.'},
  'a2': 'Schreibe Chronos eine kurze Nachricht. Erkläre in zwei bis vier Sätzen, wie Rassismus und Ausbeutung in der Kolonialzeit zusammenwirkten. Nenne ein Beispiel und eine Folge bis heute.',
  'ph': 'Lieber Chronos, deine Karte stimmt nicht, weil ...',
  'help': '„Rassismus stellte Europäer als ... dar, deshalb ...“ · „Ein Beispiel ist ..., denn ...“ · „Bis heute wirkt das nach, weil ...“',
  'crit': {
   'kurz': 'Chronos braucht mehr als einen Satz. Schreibe zwei bis vier Sätze zu Rassismus, Ausbeutung und den Folgen.',
   'gruppen': [
    {'kw': ['rassis', 'uberlegen', 'rangordnung', 'hierarch', 'rasse', 'abwert', 'hoher', 'niedrig', 'vorurteil'], 'miss': 'Erkläre, was Rassismus behauptete, zum Beispiel eine Rangordnung von „höher“ und „niedriger“.'},
    {'kw': ['ausbeut', 'zwangsarbeit', 'arbeit', 'land', 'gewalt', 'gesetz', 'passmarke', 'recht', 'prugel', 'enteign', 'rechtfertig', 'volkerschau', 'werbung', 'gewinn'], 'miss': 'Nenne ein Beispiel, wie Rassismus Ausbeutung rechtfertigte oder verbreitet wurde, etwa Zwangsarbeit, Passmarken oder Völkerschauen.'},
    {'kw': ['heute', 'folge', 'nachwirk', 'diskrimin', 'benachteilig', 'museum', 'gebeine', 'strasse', 'worter', 'bilder', 'beleidig'], 'miss': 'Nenne noch eine Folge bis heute, zum Beispiel Benachteiligung oder rassistische Bilder und Wörter.'},
   ],
   'gut': 'Sehr gut. Du zeigst, dass Rassismus und Ausbeutung zusammengehörten: Die Ideen rechtfertigten das Unrecht, und wer vom Unrecht profitierte, verbreitete die Ideen weiter. Genau deshalb wirken sie bis heute nach.'},
  'post': '<div class="notice calm"><strong>Zum Schluss:</strong> Wenn du selbst Rassismus erlebst oder erlebt hast, bist du damit nicht allein. Du kannst dich jederzeit an deine Lehrkraft oder an die Schulsozialarbeit wenden. Das gilt auch, wenn dich die Inhalte dieses Moduls beschäftigen.</div>',
 },
 'next': 'Weiter geht es mit Modul 018: Lerncheck: Imperialismus und Weltpolitik.',
 'lw_weiter': 'Du bekommst zusätzlich eine Aufgabe zum Umgang mit Namen und Gebeinen heute.',
}
