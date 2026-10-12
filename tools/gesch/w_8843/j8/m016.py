import maps

K, L0, B0 = 3, -20, 58
def xy(lon, lat):
    return maps.pt(lon, lat, K, L0, B0)

def dot(lon, lat, r=3.2, fill='#e6c15c'):
    x, y = xy(lon, lat)
    return f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="{fill}" stroke="#7a5a12" stroke-width="1"/>'

def hit(lon, lat, r=15):
    x, y = xy(lon, lat)
    return f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="#ffffff" fill-opacity="0.01" stroke="#a07a12" stroke-width="1" stroke-dasharray="3 3"/>'

def farbe(m):
    return {'deu': '#e6c15c', 'deu_h': '#a07a12', 'ind': '#ffffff'}.get(m, '#e2e0da')

INSELN = ''.join(dot(lo, la, 2.4) for lo, la in [(134.5, 7.5), (138.1, 9.5), (151.8, 7.4), (158.2, 6.9), (163, 5.3), (145.7, 15.2), (145.5, 18), (168, 9), (171.2, 7.1), (166.9, -0.5)])
ki_x, ki_y = xy(120.3, 36.1)
KARTE = '<p class="hint mobilehint">Tipp: Wische auf der Karte nach links und rechts. Die Kolonien im Pazifik liegen ganz rechts.</p><div class="svgwrap mapscroll" data-start="0">' + maps.svg(
    (645, 282), K, L0, B0, task='k1', faerben=farbe,
    label='Schematische Karte von Afrika bis zum Pazifik um 1914. Die deutschen Kolonien sind gelb, das Deutsche Reich dunkelgelb.',
    hot={
        'dsw': ('dsw', 'Gelbes Gebiet im Südwesten Afrikas'),
        'doa': ('doa', 'Gelbes Gebiet an der Ostküste Afrikas'),
        'kamerun': ('kamerun', 'Gelbes Gebiet am Knick der Westküste Afrikas'),
        'togo': ('togo', 'Schmales gelbes Gebiet an der Westküste Afrikas'),
        'kwl': ('kwl', 'Gelbes Gebiet auf der großen Insel nördlich von Australien'),
    },
    hot_extra={
        'togo': (hit(1, 8, 12), ''),
        'kiautschou': (dot(120.3, 36.1, 4) + hit(120.3, 36.1), 'Gelber Punkt an der Küste Chinas'),
        'samoa': (dot(188.2, -13.8, 4) + hit(188.2, -13.8), 'Gelber Punkt mitten im Pazifik'),
    },
    extra=INSELN) + '''</div>
<ul class="mapkey" aria-label="Legende der Karte">
 <li><i style="background:#a07a12"></i>Deutsches Reich</li>
 <li><i style="background:#e6c15c"></i>deutsche Kolonien und Inseln</li>
 <li><i style="background:#e2e0da"></i>andere Kolonien und Staaten</li>
 <li><i style="background:#fff;border:1px dashed #a07a12"></i>Hilfskreis zum Antippen kleiner Gebiete</li>
</ul>
<div class="legendlist"><span>Karte: eigene schematische Darstellung, Grenzen um 1914 stark vereinfacht</span></div>'''

HINWEIS = '''<div class="notice calm"><strong>Bevor du startest:</strong> In diesem Modul geht es um einen Völkermord. Du liest auch einen Befehl, in dem ein deutscher General die Tötung von Menschen anordnet. Wir behandeln das ernst und sachlich. Wenn dich etwas belastet, mach eine Pause und sprich mit deiner Lehrkraft oder mit der Schulsozialarbeit.</div>'''

BUELOW = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Bernhard von Bülow, Rede im Deutschen Reichstag, Berlin, 6. Dezember 1897.</strong> Auszüge, Rechtschreibung wie im Protokoll. In Klammern stehen die Zurufe der Abgeordneten.</p>
 <p>Bülow war damals Staatssekretär des Auswärtigen Amtes, also für die Außenpolitik zuständig. Von 1900 bis 1909 war er Reichskanzler. Wenige Wochen vor der Rede hatten deutsche Kriegsschiffe die Bucht von Kiautschou in China besetzt. Als Anlass diente die Ermordung von zwei deutschen Missionaren.</p>
 <p class="quote">„Die Zeiten, wo der Deutsche dem einen seiner Nachbarn die Erde überließ, dem anderen das Meer und sich selbst den Himmel reservirte, wo die reine Doktrin thront [...] diese Zeiten sind vorüber. Wir betrachten es als eine unserer vornehmsten Aufgaben, gerade in Ostasien die Interessen unserer Schiffahrt, unseres Handels und unserer Industrie zu fördern und zu pflegen.“</p>
 <p class="quote">„Wir müssen verlangen, daß der deutsche Missionar und der deutsche Unternehmer, die deutschen Waaren, die deutsche Flagge und das deutsche Schiff in China geradeso geachtet werden, wie diejenigen anderer Mächte. (Lebhaftes Bravo.) [...] Mit einem Worte: wir wollen niemand in den Schatten stellen, aber wir verlangen auch unseren Platz an der Sonne. (Bravo!)“</p>
 <p class="hint">Fundort: Stenographische Berichte über die Verhandlungen des Reichstags, IX. Legislaturperiode, V. Session 1897/98, Band 1, Berlin 1898, S. 60, hier nach „German History in Documents and Images“.</p>
</div>
<details class="gloss"><summary>Wörter, die heute ungewohnt sind</summary><div class="body"><strong>reservirte:</strong> reservierte, also für sich behielt. <strong>Doktrin:</strong> Lehre, Theorie. Gemeint ist: Die Deutschen hätten sich früher nur mit Gedanken und Dichtung beschäftigt statt mit Weltpolitik. <strong>vornehmste:</strong> wichtigste. <strong>Waaren:</strong> Waren.</div></details>'''

TROTHA = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Lothar von Trotha, Proklamation an das Volk der Herero, Osombo-Windhuk, 2. Oktober 1904.</strong> Auszug aus einer Abschrift. Trotha war Oberbefehlshaber der deutschen Truppen in Deutsch-Südwestafrika.</p>
 <p class="quote">„Das Volk der Herero muß jedoch das Land verlassen. [...] Innerhalb der Deutschen Grenze wird jeder Herero mit oder ohne Gewehr, mit oder ohne Vieh erschossen, ich nehme keine Weiber und keine Kinder mehr auf, treibe sie zu ihrem Volke zurück oder lasse auch auf sie schießen.“</p>
 <p class="hint">Fundort: Abschrift im Bundesarchiv, hier nach „German History in Documents and Images“. „Weiber“ ist ein altes, heute abwertendes Wort für Frauen.</p>
</div>
<div class="notice warn"><strong>Einordnung:</strong> Dieser Text ist eine Täterquelle. Er zeigt die Absicht, die Herero aus dem Land zu treiben und auch Frauen und Kinder nicht zu verschonen. Der Befehl wurde Ende 1904 auf Druck aus Berlin zurückgenommen. Doch da waren schon Zehntausende Menschen in der Wüste verdurstet, und das Sterben in den Lagern ging weiter.</div>'''

OPFER = '''<div class="persons" aria-label="Zwei Lebenswege">
 <div class="person"><strong>Hendrik Witbooi</strong><p>Kaptein der Nama. Er führte ab Oktober 1904 die Nama im Kampf gegen die deutsche Kolonialherrschaft. Er starb im Oktober 1905 an einer Verwundung. In Namibia gilt er heute als Nationalheld, sein Bild ist auf Geldscheinen.</p></div>
 <div class="person"><strong>Cornelius Fredericks</strong><p>Kirchenältester in Bethanien und Anführer der Nama. Er kämpfte bis zu seiner Kapitulation im März 1906. Danach wurde er mit seinen Leuten in das Lager auf der Haifischinsel bei Lüderitz gebracht. Dort starb er im Februar 1907. Seit 2022 trägt eine Straße in Berlin seinen Namen.</p></div>
</div>'''

M = {
 'num': '016',
 'titel': 'Welche Rolle spielte das Deutsche Reich im Kolonialismus?',
 'bereich': 'Imperialismus und Weltpolitik',
 'intro': 'Das Deutsche Reich kam spät zu Kolonien, erst ab 1884. Trotzdem beherrschte es bis zum Ersten Weltkrieg Gebiete, die etwa fünfmal so groß waren wie Deutschland. In Deutsch-Südwestafrika verübten deutsche Truppen einen Völkermord. In diesem Modul untersuchst du die deutsche Kolonialgeschichte und wie wir heute daran erinnern.',
 'hinweis': HINWEIS,
 'ziele': [
  'Du nennst die deutschen Kolonien und zeigst sie auf einer Karte.',
  'Du wertest Bülows Rede vom „Platz an der Sonne“ als Quelle aus.',
  'Du beschreibst den Völkermord an den Herero und Nama 1904 bis 1908 und begründest, warum man von Völkermord spricht.',
  'Du erklärst, was die Bundesregierung 2021 anerkannt hat und warum darüber gestritten wird.',
  'Du beurteilst, wie heute an die Kolonialzeit erinnert wird, zum Beispiel mit Straßennamen.',
 ],
 'mission_pre': '''<div class="notice"><strong>Berlin-Wedding, August 2024:</strong> Arbeiter tauschen Straßenschilder aus. Die „Petersallee“ hatten die Nationalsozialisten 1939 nach Carl Peters benannt. Peters stammte aus Neuhaus an der Elbe im heutigen Niedersachsen. Er gründete die Kolonie Deutsch-Ostafrika und war wegen seiner Grausamkeit als „Hänge-Peters“ berüchtigt. 1986 wurde der Name offiziell einem anderen Mann gewidmet, einem Gegner der Nationalsozialisten mit demselben Nachnamen. Vielen reichte das nicht. Seit 2024 heißen die Abschnitte Anna-Mungunda-Allee und Maji-Maji-Allee. Für Mnyaka Sururu Mboro aus Tansania, der in Berlin lebt, ging damit ein jahrzehntelanger Einsatz zu Ende. Seine Großmutter hatte ihm als Kind von den Taten von Carl Peters erzählt.</div>''',
 'fall': 'Auf Chronos’ Karteikarte steht: <em>„Deutschland hatte nur wenige Kolonien und nur für kurze Zeit. Deshalb spielte es im Kolonialismus kaum eine Rolle.“</em>',
 'auftrag': 'Prüfe, welche Kolonien das Deutsche Reich besaß, wie es sie begründete und was dort geschah. Am Ende entscheidest du über die Karte.',
 'chronos': 'Diesen Satz habe ich oft gehört, auch von klugen Leuten. Er klingt beruhigend. Aber Geschichte ist nicht dazu da, uns zu beruhigen. Prüfen wir die Fakten, auch die schweren.',
 'diagnose': [
  {'tag': 'Schätzfrage', 'frage': 'Seit wann besaß das Deutsche Reich Kolonien?', 'right': 'a',
   'opts': [('a', 'Seit 1884'), ('b', 'Seit 1648'), ('c', 'Seit 1945')]},
  {'tag': 'Richtig oder falsch', 'frage': 'Die Bundesregierung hat die Verbrechen an den Herero und Nama als Völkermord bezeichnet.', 'right': 'r',
   'opts': [('r', 'Das stimmt'), ('f', 'Das stimmt nicht')]},
  {'tag': 'Vermutung', 'frage': 'Welche heutigen Staaten waren ganz oder teilweise deutsche Kolonien?', 'right': 'a',
   'opts': [('a', 'Namibia, Tansania, Kamerun und Togo'), ('b', 'Brasilien, Indien und Ägypten'), ('c', 'Kanada, Australien und Neuseeland')]},
 ],
 'diag_msg': ['Die ersten deutschen Kolonien entstanden 1884.', 'Die Bundesregierung tat das 2021.', 'Dazu gehören Namibia, Tansania, Kamerun und Togo.'],
 'sections': [
  {'id': 'kolonien', 'nav': 'Deutsche Kolonien', 'h2': 'Die deutschen Kolonien',
   'pre': '''<p>Reichskanzler Bismarck war lange gegen Kolonien. 1884 und 1885 stellte er aber Gebiete unter den „Schutz“ des Reiches, die deutsche Kaufleute und Gesellschaften in Afrika und im Pazifik erworben hatten. Das Wort „Schutzgebiet“ klang harmlos. Gemeint war Herrschaft.</p>
<p>Ein Beispiel ist der Bremer Kaufmann <strong>Adolf Lüderitz</strong>. Sein Vertreter kaufte 1883 dem Nama-Kaptein Joseph Fredericks Land an der Küste des heutigen Namibia ab. Im Vertrag stand eine Breite von 20 „geographischen Meilen“. Der Kaptein dachte an englische Meilen von rund 1,6 Kilometern. Gemeint waren aber deutsche geographische Meilen von rund 7,4 Kilometern. So verloren die Nama viel mehr Land, als sie verkaufen wollten.</p>
<p>Bis 1914 kamen Kolonien in Afrika, im Pazifik und in China zusammen. Sie waren zusammen rund 2,6 Millionen Quadratkilometer groß und hatten etwa 12 Millionen Einwohner. Deutsche lebten dort nur wenige zehntausend. Im Ersten Weltkrieg besetzten andere Mächte die Kolonien, 1919 musste Deutschland sie im Versailler Vertrag abgeben.</p>''',
   'tasks': [
    {'id': 'k1', 'type': 'hot', 'tag': 'Kartenarbeit', 'name': 'Deutsche Kolonien auf der Karte', 'key': 'kolonien_karte', 'komp': 'zeit_raum', 'svg': KARTE,
     'seq': [
      ['dsw', 'Finde die Kolonie, in die die meisten deutschen Siedler zogen. Heute heißt das Land Namibia.', 'Richtig. Deutsch-Südwestafrika war eine Siedlungskolonie. 1914 lebten dort rund 12.000 Deutsche, oft auf Farmen, die auf dem Land der Herero und Nama entstanden.'],
      ['doa', 'Finde die größte deutsche Kolonie mit den meisten Einwohnern. Hier fand 1905 bis 1907 der Maji-Maji-Krieg statt.', 'Richtig. Deutsch-Ostafrika umfasste das heutige Tansania, Ruanda und Burundi und hatte über sieben Millionen Einwohner.'],
      ['kiautschou', 'Finde das Gebiet an der Küste Chinas, das deutsche Kriegsschiffe 1897 besetzten.', 'Richtig. Kiautschou mit der Stadt Tsingtau, heute Qingdao, wurde ein Stützpunkt der deutschen Flotte. China musste es 1898 für 99 Jahre verpachten.'],
      ['samoa', 'Finde die Inseln mitten im Pazifik, die ab 1899 zum Deutschen Reich gehörten.', 'Richtig. Samoa liegt tausende Kilometer von Afrika entfernt. Das zeigt, wie weit das deutsche Kolonialreich reichte.'],
     ],
     'all': [['dsw', 'Deutsch-Südwestafrika'], ['kamerun', 'Kamerun'], ['togo', 'Togo'], ['doa', 'Deutsch-Ostafrika'], ['kiautschou', 'Kiautschou'], ['kwl', 'Deutsch-Neuguinea'], ['samoa', 'Samoa']],
     'wrong': {'kamerun': 'Das ist Kamerun in Westafrika.', 'togo': 'Das ist Togo, die kleinste deutsche Kolonie in Afrika.', 'kwl': 'Das ist Deutsch-Neuguinea im Pazifik.'},
     'fertig': 'Alle vier Gebiete gefunden.', 'ok': 'Damit hast du alle vier Gebiete gefunden. Das deutsche Kolonialreich reichte von Afrika bis in den Pazifik.'},
    {'id': 'm2', 'type': 'match', 'tag': 'Damals und heute', 'name': 'Kolonien und heutige Staaten', 'key': 'heutige_staaten', 'komp': 'fachwissen',
     'frage': 'Welcher heutige Staat liegt dort, wo die deutsche Kolonie war? Wähle aus.',
     'rows': [('Deutsch-Südwestafrika', 'Namibia'), ('Deutsch-Ostafrika', 'Tansania, Ruanda und Burundi'), ('Togo', 'Togo und ein Teil Ghanas'), ('Deutsch-Neuguinea', 'Papua-Neuguinea')],
     'choices': ['Namibia', 'Südafrika', 'Tansania, Ruanda und Burundi', 'Kenia', 'Togo und ein Teil Ghanas', 'Papua-Neuguinea'],
     'ok': 'Alles richtig. In diesen Staaten ist die deutsche Kolonialzeit bis heute Teil der Geschichte, die man in der Schule lernt.',
     'hint': 'Die Karte hilft dir. Südafrika und Kenia waren britische Kolonien.'},
   ]},
  {'id': 'platz', 'nav': 'Platz an der Sonne', 'h2': 'Die Quelle: „Platz an der Sonne“',
   'pre': BUELOW,
   'tasks': [
    {'id': 'q1', 'type': 'multi', 'tag': 'Quellenarbeit', 'name': 'Quellenarbeit Bülow', 'key': 'quelle_buelow', 'komp': 'quellenarbeit',
     'frage': 'Was fordert Bülow in diesen Auszügen? Wähle alle zutreffenden Aussagen aus.',
     'opts': [('achtung', 'Deutsche Missionare, Unternehmer, Waren und Schiffe sollen in China so geachtet werden wie die anderer Mächte.'),
              ('handel', 'In Ostasien sollen Schifffahrt, Handel und Industrie gefördert werden.'),
              ('sonne', 'Deutschland soll als Großmacht gleichberechtigt mit den anderen Weltpolitik betreiben.'),
              ('fragen', 'Die Menschen in China sollen gefragt werden, ob sie einverstanden sind.'),
              ('verzicht', 'Deutschland soll auf Kolonien und Stützpunkte verzichten.')],
     'right': ['achtung', 'handel', 'sonne'],
     'wrongfb': {'fragen': 'Von der Meinung der Menschen in China ist in der Rede keine Rede. Es geht nur um deutsche Interessen.', 'verzicht': 'Im Gegenteil: Bülow verteidigt die gerade erfolgte Besetzung von Kiautschou.'},
     'ok': 'Genau. Bülow verbindet wirtschaftliche Interessen mit dem Anspruch auf Gleichrang. Der „Platz an der Sonne“ wurde zum Schlagwort der deutschen Weltpolitik.',
     'hint': 'Lies die beiden Auszüge Satz für Satz. Es sind drei Aussagen richtig.'},
    {'id': 'q2', 'type': 'single', 'tag': 'Quellenkritik', 'name': 'Quellenkritik Bülow', 'key': 'quellenkritik_buelow', 'komp': 'quellenarbeit',
     'frage': 'Im Protokoll stehen Zurufe wie „(Bravo!)“ und „(Lebhaftes Bravo.)“. Was verraten sie dir?',
     'opts': [('a', 'Viele Abgeordnete stimmten Bülow zu. Die Kolonial- und Weltpolitik hatte im Reichstag starke Unterstützung.'),
              ('b', 'Alle Menschen in Deutschland waren für Kolonien.'),
              ('c', 'Die Zurufe hat später jemand erfunden, sie gehören nicht zur Quelle.')],
     'right': 'a',
     'ok': 'Richtig. Das Protokoll zeigt die Stimmung im Saal. Es gab aber auch Kritik, zum Beispiel von der SPD. Wer? Ein führender Politiker. Für wen? Für den Reichstag und die Öffentlichkeit. Warum? Er wollte die Besetzung von Kiautschou rechtfertigen.',
     'fb': {'b': 'Nein. Die Zurufe zeigen nur, wie Abgeordnete im Saal reagierten. Über alle Deutschen sagen sie nichts aus.', 'c': 'Nein. Stenografen schrieben die Zurufe während der Sitzung mit. Sie gehören zum Protokoll.'}},
   ]},
  {'id': 'voelkermord', 'nav': 'Herero und Nama', 'h2': 'Der Völkermord an den Herero und Nama',
   'pre': '''<p>In Deutsch-Südwestafrika verloren die Herero und Nama immer mehr Land und Vieh an Siedler und Händler. Afrikanerinnen und Afrikaner hatten weniger Rechte, Gewalt gegen sie wurde kaum bestraft. Im Januar 1904 begannen die Herero unter Samuel Maharero den Kampf. Dabei töteten sie über 100 Deutsche, vor allem Siedler. Maharero hatte befohlen, Frauen, Kinder und Missionare zu verschonen.</p>
<p>Das Reich schickte tausende Soldaten unter General Lothar von Trotha. Nach der Schlacht am Waterberg im August 1904 flohen die Herero mit Familien und Herden in die wasserarme Omaheke-Wüste. Deutsche Truppen riegelten die Wasserstellen ab. Zehntausende Menschen verdursteten. Ab Oktober 1904 kämpften auch die Nama. Gefangene Herero und Nama kamen in Lager, die die Deutschen selbst „Konzentrationslager“ nannten. Dort mussten sie Zwangsarbeit leisten, viele starben an Hunger, Kälte und Krankheiten.</p>
<p>Schätzungen gehen davon aus, dass bis zu 80 Prozent der Herero und etwa die Hälfte der Nama ums Leben kamen. Nach dem Krieg nahm die Kolonialverwaltung den Überlebenden ihr Land und ihr Vieh. Ab 1907 musste jeder Afrikaner ab sieben Jahren eine Passmarke tragen. Schädel von Getöteten wurden für rassistische „Forschung“ nach Deutschland gebracht. Seit 2011 hat Deutschland mehrfach Gebeine an Namibia zurückgegeben.</p>''' + OPFER + TROTHA,
   'tasks': [
    {'id': 'o1', 'type': 'order', 'tag': 'Zeitleiste', 'name': 'Zeitleiste 1904 bis 2021', 'key': 'zeitleiste', 'komp': 'ursachen_folgen',
     'frage': 'Bringe die Ereignisse mit den Pfeilen in die richtige zeitliche Reihenfolge.',
     'items': [
      'Januar 1904: Die Herero beginnen den Kampf gegen die deutsche Kolonialherrschaft.',
      'August 1904: Schlacht am Waterberg. Die Herero fliehen in die Omaheke-Wüste.',
      'Oktober 1904: Trotha erlässt seinen Befehl. Auch die Nama beginnen den Kampf.',
      '1905 bis 1908: Gefangene Herero und Nama leisten in Lagern Zwangsarbeit. Viele sterben.',
      '2021: Die Bundesregierung bezeichnet die Verbrechen als Völkermord.',
     ],
     'ok': 'Genau. Zwischen den Verbrechen und ihrer Anerkennung durch die Bundesregierung lagen mehr als hundert Jahre.',
     'hint': 'Achte auf die Monate und Jahreszahlen am Anfang jeder Karte.'},
    {'id': 's1', 'type': 'single', 'tag': 'Urteilen', 'name': 'Warum Völkermord', 'key': 'voelkermord_begriff', 'komp': 'fachwissen',
     'frage': 'Warum spricht man hier von einem Völkermord und nicht nur von einem Krieg?',
     'opts': [('a', 'Die deutsche Führung wollte die Herero und Nama als Volk vernichten oder vertreiben, auch Frauen und Kinder. Das zeigen Trothas Befehl, die abgeriegelten Wasserstellen und die Lager.'),
              ('b', 'Weil in dem Krieg auch deutsche Soldaten starben.'),
              ('c', 'Weil der Krieg mehrere Jahre dauerte.')],
     'right': 'a',
     'ok': 'Richtig. Ein Völkermord ist nach der Völkermordkonvention der Vereinten Nationen von 1948 eine Tat in der Absicht, eine Gruppe ganz oder teilweise zu vernichten. Entscheidend ist diese Absicht, nicht die Länge eines Krieges.',
     'fb': {'b': 'In jedem Krieg sterben Soldaten. Das macht ihn noch nicht zum Völkermord. Was war hier anders?', 'c': 'Die Dauer ist nicht entscheidend. Überlege, gegen wen sich die Gewalt richtete und mit welcher Absicht.'}},
    {'id': 'q3', 'type': 'single', 'tag': 'Quellenkritik', 'name': 'Täterquelle Trotha', 'key': 'quelle_trotha', 'komp': 'quellenarbeit',
     'frage': 'Trothas Proklamation ist eine Täterquelle. Was bedeutet das für die Arbeit mit ihr?',
     'opts': [('a', 'Sie zeigt die Absicht und Sprache der Täter. Was die Herero und Nama erlebten, muss man aus anderen Quellen ergänzen, etwa aus Berichten von Überlebenden.'),
              ('b', 'Eine Täterquelle ist wertlos und sollte nicht gelesen werden.'),
              ('c', 'Sie erzählt die ganze Geschichte des Krieges.')],
     'right': 'a',
     'ok': 'Richtig. Gerade weil Trotha seine Absicht selbst aufschrieb, ist die Quelle ein wichtiger Beleg. Sie zeigt aber nur die Sicht der Täter. Die Stimmen der Opfer, wie Samuel Mahareros Brief aus Modul 015, gehören dazu.',
     'fb': {'b': 'Nein. Täterquellen sind wichtige Beweise. Man muss sie nur kritisch lesen und einordnen.', 'c': 'Nein. Sie zeigt nur die Sicht und die Pläne des Generals.'}},
   ]},
  {'id': 'anerkennung', 'nav': 'Anerkennung 2021', 'h2': 'Anerkennung und Streit um die Versöhnung',
   'pre': '''<p>Am 28. Mai 2021 gab Außenminister Heiko Maas bekannt: Deutschland bezeichnet die Verbrechen an den Herero und Nama offiziell als das, was sie aus heutiger Sicht waren, als Völkermord. Er bat Namibia und die Nachfahren der Opfer um Vergebung. Deutschland sagte zu, über 30 Jahre 1,1 Milliarden Euro für Wiederaufbau und Entwicklung in Namibia bereitzustellen. Die Bundesregierung betonte, das sei keine rechtliche Entschädigung.</p>
<p>Viele Vertreterinnen und Vertreter der Herero und Nama kritisieren die Vereinbarung. Sie sagen, sie seien nicht ausreichend beteiligt worden, und fordern Reparationen, also Wiedergutmachung für die Nachfahren. Seit 2025 erinnert Namibia jedes Jahr am 28. Mai mit einem nationalen Gedenktag an den Völkermord. Die Diskussion ist bis heute nicht abgeschlossen.</p>''',
   'tasks': [
    {'id': 'g1', 'type': 'gap', 'tag': 'Lückentext', 'name': 'Anerkennung 2021', 'key': 'anerkennung', 'komp': 'fachwissen',
     'frage': 'Wähle in jeder Lücke das passende Wort.',
     'text': 'Im Jahr {} bezeichnete die Bundesregierung die Verbrechen an den Herero und Nama als Völkermord. Der Außenminister bat um {}. Deutschland will 1,1 Milliarden Euro für Projekte in {} bereitstellen. Viele Nachfahren fordern aber {}, also eine Wiedergutmachung direkt für die betroffenen Gemeinschaften.',
     'gaps': [{'opts': ['1919', '1990', '2021'], 'right': '2021'},
              {'opts': ['Vergebung', 'Verständnis', 'Geduld'], 'right': 'Vergebung'},
              {'opts': ['Tansania', 'Namibia', 'Kamerun'], 'right': 'Namibia'},
              {'opts': ['Reparationen', 'Kredite', 'Ruhe'], 'right': 'Reparationen'}],
     'ok': 'Alles richtig. Anerkennung und Entschuldigung waren ein wichtiger Schritt. Ob die Vereinbarung gerecht ist, darüber wird weiter gestritten, vor allem von den Nachfahren der Opfer.',
     'hint': 'Lies den Text über der Aufgabe noch einmal.'},
   ]},
  {'id': 'erinnern', 'nav': 'Erinnern heute', 'h2': 'Erinnern heute: Straßen und Denkmäler',
   'pre': '''<p>In vielen deutschen Städten erinnern Straßennamen und Denkmäler an die Kolonialzeit. Oft ehren sie Kolonialherren. Seit einigen Jahren werden solche Namen geändert. Im Afrikanischen Viertel in Berlin heißen seit 2022 der frühere Nachtigalplatz nun Manga-Bell-Platz und die frühere Lüderitzstraße nun Cornelius-Fredericks-Straße. 2024 folgte die Umbenennung der Petersallee.</p>
<p>In der Nachbarstadt Bremen, der Heimat von Adolf Lüderitz, steht ein großer Elefant aus Backstein. Er wurde 1932 als „Reichskolonialehrenmal“ gebaut, um die verlorenen Kolonien zu feiern. 1990 wurde er zum Antikolonialdenkmal umgewidmet. Seit 2009 erinnert daneben eine Gedenkstätte an den Völkermord an den Herero und Nama. Manche finden das gelungen, andere sagen, ein paar neue Schilder reichten nicht, um ein Kolonialdenkmal zu verändern.</p>''',
   'tasks': [
    {'id': 'p1', 'type': 'match', 'tag': 'Perspektiven', 'name': 'Sichtweisen zur Umbenennung', 'key': 'perspektiven_strassen', 'komp': 'perspektivitaet',
     'frage': 'Wer könnte das zur Umbenennung einer Straße sagen? Wähle zu jeder Aussage die passende Person.',
     'persons_html': '<p class="hint">Die Aussagen sind ausgedacht. Sie geben aber Meinungen wieder, die in solchen Debatten tatsächlich vorkommen. Es ist eine Darstellung, keine Quelle.</p>',
     'rows': [
      ('„Eine Straße nach einem grausamen Kolonialherrn ehrt ihn. Das verletzt die Nachfahren seiner Opfer.“', 'Aktivist aus Tansania'),
      ('„Ich muss jetzt meine Adresse überall ändern. Das macht viel Arbeit.“', 'Anwohnerin'),
      ('„Ein Schild mit Erklärung zeigt, wer die Person war. So kann man aus der Geschichte lernen.“', 'Museumsmitarbeiterin'),
      ('„Mit den neuen Namen ehren wir Menschen, die sich gegen Unrecht gewehrt haben.“', 'Politikerin im Bezirk'),
     ],
     'choices': ['Aktivist aus Tansania', 'Anwohnerin', 'Museumsmitarbeiterin', 'Politikerin im Bezirk'],
     'ok': 'Alles richtig. In der Debatte prallen verschiedene Sichtweisen aufeinander. Ein gutes Urteil nimmt sie ernst und wägt sie ab: Wer wird geehrt, und wessen Schmerz wird gesehen?',
     'hint': 'Frage dich: Wer ist persönlich betroffen, wer hat Aufwand, wer will erklären, und wer entscheidet über Namen?'},
    {'id': 'w1', 'type': 'text', 'lw': 'weiter', 'score': False, 'tag': 'Weiterdenken · Kontroverse', 'name': 'Lohnten sich die Kolonien', 'key': 'weiterdenken_kosten', 'komp': 'ursachen_folgen',
     'pre': '<div class="notice"><strong>Zahlen zum Nachdenken:</strong> Nach einer Übersicht des Deutschen Historischen Museums nahm das Reich vor dem Ersten Weltkrieg in Deutsch-Südwestafrika rund 24 Millionen Mark ein, gab dort aber rund 35 Millionen Mark aus. Auch in Deutsch-Ostafrika waren die Ausgaben höher als die Einnahmen. Gleichzeitig verdienten Handelsfirmen, Reedereien, Plantagen- und Bergbaugesellschaften gut, zum Beispiel ab 1908 mit Diamanten bei Lüderitz.</div>',
     'frage': 'Für den Staat waren die meisten Kolonien ein Verlustgeschäft. Wer hatte trotzdem Vorteile, und wer bezahlte den höchsten Preis? Begründe.',
     'ph': 'Vorteile hatten vor allem ..., weil ... Den höchsten Preis bezahlten ..., denn ...',
     'need': [{'kw': ['firma', 'firmen', 'unternehm', 'handler', 'gesellschaft', 'siedler', 'plantag', 'reeder', 'bergbau', 'diamant', 'kaufleute', 'kaufmann'], 'miss': 'Nenne zuerst, wer Vorteile hatte, zum Beispiel Firmen oder Siedler.'},
              {'kw': ['herero', 'nama', 'afrikan', 'einheimisch', 'kolonisiert', 'menschen in den kolonien', 'menschen dort', 'bevolkerung', 'opfer', 'zwangsarbeit', 'leben'], 'miss': 'Erkläre dann, wer den höchsten Preis bezahlte: die Menschen in den Kolonien.'}],
     'ok': 'Sehr gut durchdacht. Gewinne gingen an Firmen und Siedler, die Kosten trugen die Steuerzahler im Reich und vor allem die Menschen in den Kolonien mit ihrem Land, ihrer Arbeit und oft mit ihrem Leben.',
     'short': 'Deine Antwort ist noch sehr kurz. Schreibe zwei Sätze: „Vorteile hatten vor allem ..., weil ...“ und „Den höchsten Preis bezahlten ..., denn ...“'},
   ]},
 ],
 'glossar': [
  ('„Schutzgebiet“', 'So nannte das Deutsche Reich seine Kolonien. Das Wort sollte harmlos klingen. Tatsächlich ging es um Herrschaft über fremdes Land.'),
  ('Siedlungskolonie', 'Eine Kolonie, in die viele Menschen aus dem Mutterland zogen, um dort dauerhaft zu leben und Land zu bewirtschaften, zum Beispiel Deutsch-Südwestafrika.'),
  ('Pachtgebiet', 'Ein Gebiet, das ein Staat für eine bestimmte Zeit von einem anderen Staat „mietet“. China musste Kiautschou 1898 unter Druck für 99 Jahre verpachten.'),
  ('Weltpolitik', 'Das Ziel des Deutschen Reichs ab etwa 1897, weltweit als Großmacht aufzutreten, mit Kolonien, Stützpunkten und einer großen Flotte.'),
  ('Völkermord', 'Auch Genozid genannt. Taten in der Absicht, eine nationale, ethnische oder religiöse Gruppe ganz oder teilweise zu vernichten. So definiert es die Konvention der Vereinten Nationen von 1948.'),
  ('Konzentrationslager', 'So nannten die deutschen Kolonialbehörden 1904 bis 1908 die Lager für gefangene Herero und Nama. Dort mussten die Menschen unter schlimmsten Bedingungen Zwangsarbeit leisten.'),
  ('Täterquelle', 'Eine Quelle, die von denen stammt, die Verbrechen begangen haben. Sie zeigt deren Absichten und Sprache, aber nicht die Sicht der Opfer.'),
  ('Reparationen', 'Zahlungen als Wiedergutmachung für ein Unrecht, das ein Staat begangen hat.'),
  ('Erinnerungskultur', 'Die Art, wie eine Gesellschaft an ihre Vergangenheit erinnert, zum Beispiel mit Gedenktagen, Denkmälern, Museen und Straßennamen.'),
 ],
 'lerncheck': [
  'Ich kann die deutschen Kolonien nennen und auf einer Karte zeigen.',
  'Ich kann erklären, warum die Verbrechen an den Herero und Nama ein Völkermord waren.',
  'Ich kann begründen, warum heute über Erinnerung an die Kolonialzeit gestritten wird.',
 ],
 'abschluss': {
  'h2': 'Abschlussmission: die Karteikarte',
  'karte': 'Auf Chronos’ Karteikarte steht: <em>„Deutschland hatte nur wenige Kolonien und nur für kurze Zeit. Deshalb spielte es im Kolonialismus kaum eine Rolle.“</em>',
  'frage': 'Wie entscheidest du?',
  'opts': [('ok', 'Die Karte stimmt so.'),
           ('teil', 'Die Karte ist falsch. Das Deutsche Reich besaß von 1884 bis 1919 Kolonien, die zusammen etwa fünfmal so groß waren wie Deutschland. Deutsche Truppen verübten schwere Verbrechen, darunter den Völkermord an den Herero und Nama. Die Folgen wirken bis heute.'),
           ('kurz', 'Die Karte stimmt, weil Deutschland seine Kolonien schon 1919 wieder verlor.')],
  'right': ['teil'],
  'fb': {'ok': 'Prüfe noch einmal: Wie groß waren die deutschen Kolonien? Und was geschah in Deutsch-Südwestafrika und Deutsch-Ostafrika?',
         'teil': 'Gut entschieden. Begründe deine Entscheidung jetzt in A2.',
         'kurz': 'Die Zeit war kürzer als bei anderen Mächten. Aber eine kurze Zeit bedeutet nicht kleine Folgen. Denke an den Völkermord und den Maji-Maji-Krieg.'},
  'a2': 'Schreibe Chronos eine kurze Nachricht. Erkläre in zwei bis vier Sätzen, welche Rolle das Deutsche Reich im Kolonialismus spielte. Nenne ein Beispiel für deutsche Kolonialverbrechen und eines dafür, wie heute daran erinnert wird.',
  'ph': 'Lieber Chronos, deine Karte stimmt nicht, weil ...',
  'help': '„Das Deutsche Reich besaß Kolonien wie ..., die ...“ · „In Deutsch-Südwestafrika verübten deutsche Truppen ..., denn ...“ · „Heute wird daran erinnert, indem ...“',
  'crit': {
   'kurz': 'Chronos braucht mehr als einen Satz. Schreibe zwei bis vier Sätze zu den Kolonien, zu den Verbrechen und zur Erinnerung heute.',
   'gruppen': [
    {'kw': ['kolonie', 'namibia', 'sudwest', 'ostafrika', 'kamerun', 'togo', 'samoa', 'kiautschou', 'platz an der sonne', 'funfmal', 'gross', '1884', 'weltpolitik', 'schutzgebiet'], 'miss': 'Nenne, welche Kolonien das Deutsche Reich besaß oder wie groß sie waren.'},
    {'kw': ['volkermord', 'genozid', 'herero', 'nama', 'maji', 'trotha', 'verbrechen', 'vernicht', 'lager', 'getotet', 'verdurst', 'zwangsarbeit'], 'miss': 'Nenne ein Beispiel für deutsche Kolonialverbrechen, etwa den Völkermord an den Herero und Nama.'},
    {'kw': ['erinner', 'strasse', 'umbenenn', 'anerkenn', '2021', 'entschuldig', 'denkmal', 'vergebung', 'verzeihung', 'gedenk', 'gebeine', 'heute', 'elefant'], 'miss': 'Schreibe auch, wie heute an die Kolonialzeit erinnert wird, zum Beispiel mit neuen Straßennamen oder der Anerkennung 2021.'},
   ],
   'gut': 'Sehr gut. Du zeigst, dass das Deutsche Reich eine wichtige Kolonialmacht war, dass schwere Verbrechen geschahen und dass die Erinnerung daran bis heute eine Aufgabe ist.'},
  'post': '<div class="notice calm"><strong>Zum Schluss:</strong> Über einen Völkermord zu lernen, kann bedrücken oder wütend machen. Das ist verständlich. Wenn dich etwas beschäftigt, sprich mit deiner Lehrkraft oder mit der Schulsozialarbeit.</div>',
 },
 'next': 'Weiter geht es mit Modul 017: Wie wirkten Rassismus und Ausbeutung zusammen?',
 'lw_weiter': 'Du bekommst zusätzlich eine Aufgabe zur Frage, wer an den Kolonien verdiente.',
}
