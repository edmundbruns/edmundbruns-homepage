#!/usr/bin/env python3
# Modultexte für das Ludgerus-Schachdiplom 5 (Königsdiplom). Von Hand geschrieben, einfache Sprache, keine Gedankenstriche.
TEXTS = {
'k01': dict(
 concept='In der Lucena-Stellung hat eine Seite Turm und Bauer gegen Turm. Der Bauer steht kurz vor der Umwandlung, der eigene König steht davor und kommt nicht heraus. Mit dem Brückenbau stellst du deinen Turm so, dass er die Schachgebote der Gegenseite abfängt. Das Lernbeispiel zeigt die klassische Lucena-Stellung. In den Übungen aus echten Partien geht es um dasselbe Ziel: den Bauern sicher zur Umwandlung bringen.',
 merksatz='Turm und Bauer gegen Turm: Erst den gegnerischen König mit dem Turm abschneiden, dann eine Brücke bauen. Dein Turm stellt sich zwischen deinen König und die Schachs des gegnerischen Turms.',
 question='Erkläre, wie du den Bauern zur Umwandlung bringst. Welche Aufgabe hat dein Turm, und wie wehrst du die Schachgebote der Gegenseite ab?',
 motif=None),
'k02': dict(
 concept='Wer im Turmendspiel einen Bauern weniger hat, ist oft nicht verloren. Ein aktiver Turm, Schachs aus der Ferne und ein König vor dem gegnerischen Bauern halten das Remis. Wichtig ist, jeden gegnerischen Fortschritt sofort zu beantworten. Das Lernbeispiel zeigt die Philidor-Stellung. In den Übungen aus echten Partien findest du den genauen Verteidigungs- oder Gegenzug.',
 merksatz='In der Verteidigung gehört dein König vor den Bauern und dein Turm in die Aktivität. Gib Schach aus großer Entfernung und lass dich nicht in die Passivität drängen.',
 question='Erkläre deinen Plan im Turmendspiel. Was hat die Gegenseite gedroht, und wie haben dein König und dein Turm darauf reagiert?',
 motif=None),
'k03': dict(
 concept='Ein aktiver Turm ist im Endspiel oft mehr wert als ein Bauer. Besonders stark ist er auf der siebten Reihe: Dort greift er Bauern von der Seite an und schränkt den gegnerischen König ein.',
 merksatz='Turm auf die siebte Reihe! Von dort greift er Bauern an, sperrt den König ein und schafft Drohungen, die die Gegenseite kaum alle abwehren kann.',
 question='Erkläre, was dein Turm in dieser Stellung erreicht. Welche Ziele greift er an, und warum kann die Gegenseite nicht alles verteidigen?',
 motif='Aktiver Turm'),
'k04': dict(
 concept='Ein Turm gehört hinter den Freibauern, egal ob es dein eigener ist oder der des Gegners. Hinter dem eigenen Bauern wird er mit jedem Bauernschritt stärker. Vor dem Bauern dagegen steht er sich selbst im Weg.',
 merksatz='Türme gehören hinter die Freibauern. Je weiter der Bauer läuft, desto mehr Platz bekommt dein Turm, und der gegnerische Turm muss passiv vor dem Bauern stehen.',
 question='Erkläre, wie Turm und Freibauer hier zusammenarbeiten. Warum steht dein Turm richtig, und was kann die Gegenseite nicht mehr verhindern?',
 motif='Turm hinter dem Freibauern'),
'k05': dict(
 concept='Mit einer Dame gewinnst du meist gegen einen Bauern. Die Dame treibt den gegnerischen König mit Schachs vor seinen eigenen Bauern, damit dein König näher kommt. In Damenendspielen entscheiden oft Schachgebote, Gabeln und ein sicherer eigener König.',
 merksatz='Die Dame arbeitet mit Schachs und Doppelangriffen. Zwinge den gegnerischen König auf ein schlechtes Feld, gewinne dabei Zeit und hole erst dann deinen eigenen König heran.',
 question='Erkläre, wie deine Dame hier den Gewinn erreicht. Welche Schachs oder Doppelangriffe nutzt du, und was kann die Gegenseite nicht mehr retten?',
 motif='Damenschachs'),
'k06': dict(
 concept='Springerendspiele ähneln Bauernendspielen. Der Springer ist kurzbeinig und tut sich gegen Randbauern schwer. Oft entscheiden eine Springergabel oder ein Springerzug, der den gegnerischen Springer von seinen Feldern abschneidet.',
 merksatz='Im Springerendspiel zählt jeder Bauer. Achte auf Gabeln und darauf, dass dein Springer den Freibauern von hinten oder von der Seite aufhalten kann.',
 question='Erkläre, wie dein Springer hier den Vorteil erspielt. Welche Felder oder Figuren greift er an, und warum kann die Gegenseite nicht ausweichen?',
 motif='Springergabel'),
'k07': dict(
 concept='Läufer und Springer sind etwa gleich viel wert. Im Endspiel mit Bauern auf beiden Flügeln ist der Läufer meist stärker, weil er weite Wege schnell schafft. Der Springer ist stark bei geschlossenen Stellungen und auf festen Vorposten.',
 merksatz='Läufer gegen Springer: Öffne die Stellung und verteile die Bauern auf beide Flügel, wenn du den Läufer hast. Mit dem Springer suchst du feste Felder und Gabeln.',
 question='Erkläre, warum deine Leichtfigur hier stärker ist als die gegnerische. Welche Ziele erreicht sie, und was kann die andere Figur nicht verhindern?',
 motif='Leichtfigur besser als die andere'),
'k08': dict(
 concept='Im Bauernendspiel entscheidet oft, wer ziehen muss. Stehen sich die Könige mit einem Feld Abstand gegenüber, hat die Seite die Opposition, die nicht am Zug ist. Mit einem Dreiecksmanöver gibst du die Zugpflicht an die Gegenseite ab.',
 merksatz='Opposition: Die Könige stehen sich gegenüber, und die Gegenseite muss ziehen. Wer die Opposition hat, gewinnt im Bauernendspiel oft wichtige Felder.',
 question='Erkläre, wie du die Gegenseite in Zugzwang bringst. Welche Felder gewinnt dein König, und warum hilft der gegnerische Zug dir?',
 motif='Zugzwang'),
'k09': dict(
 concept='Ein Zwischenzug ist ein Zug, den du einschiebst, bevor du das scheinbar Selbstverständliche tust. Meist ist es ein Schach oder eine starke Drohung. Danach steht die Stellung für dich besser als beim sofortigen Zurückschlagen.',
 merksatz='Nicht automatisch zurückschlagen! Prüfe vorher Schachs und Drohungen. Ein Zwischenzug kann die ganze Abwicklung zu deinen Gunsten drehen.',
 question='Erkläre, warum du nicht sofort das Naheliegende spielst. Was gewinnt dein Zwischenzug, und wie musste die Gegenseite darauf antworten?',
 motif='Zwischenzug'),
'k10': dict(
 concept='Eine Figur ist überlastet, wenn sie zwei Aufgaben gleichzeitig erfüllen muss. Mit einer Ablenkung zwingst du sie, eine Aufgabe aufzugeben. Dann fällt das, was sie vorher geschützt hat.',
 merksatz='Frage bei jeder verteidigenden Figur: Welche Aufgaben hat sie? Hat sie zwei, lenke sie mit einem Opfer oder Schlagzug von einer davon ab.',
 question='Erkläre, welche gegnerische Figur überlastet ist. Wovon lenkst du sie ab, und was gewinnst du dadurch?',
 motif='Ablenkung'),
'k11': dict(
 concept='Bei der Hinlenkung zwingst du eine gegnerische Figur, meist den König, auf ein bestimmtes Feld. Oft geschieht das mit einem Opfer. Auf diesem Feld steht die Figur dann schlecht, zum Beispiel in einer Gabel oder im Mattnetz.',
 merksatz='Hinlenkung: Locke die gegnerische Figur mit einem Opfer auf ein Feld, auf dem du sie angreifen kannst. Das Opfer lohnt sich, wenn danach mehr zurückkommt.',
 question='Erkläre, auf welches Feld du die gegnerische Figur lockst. Warum steht sie dort schlecht, und was folgt danach?',
 motif='Hinlenkung'),
'k12': dict(
 concept='Bei der Räumung macht eine eigene Figur ein Feld oder eine Linie frei, oft mit Tempo. Bei der Verstellung stellst du eine Figur zwischen zwei gegnerische Figuren und unterbrichst ihre Verbindung.',
 merksatz='Steht dir eine eigene Figur im Weg, räume das Feld mit Tempo. Stehen zwei gegnerische Figuren in Verbindung, unterbrich sie durch eine Verstellung.',
 question='Erkläre, welche Linie oder welches Feld du freimachst oder sperrst. Welche Figur kann danach wirken, und was gewinnst du?',
 motif='Räumung'),
'k13': dict(
 concept='Beim Abzug zieht eine Figur weg und öffnet einer anderen eigenen Figur die Linie. So entstehen zwei Angriffe auf einmal. Beim Doppelschach geben beide Figuren gleichzeitig Schach. Dann muss der König ziehen.',
 merksatz='Abzug: Die vordere Figur zieht mit Drohung weg, die hintere greift an. Beim Doppelschach hilft kein Dazwischenstellen und kein Schlagen, nur ein Königszug.',
 question='Erkläre, welche Figur abzieht und welche dahinter angreift. Warum kann die Gegenseite nicht beide Drohungen abwehren?',
 motif='Abzugsangriff'),
'k14': dict(
 concept='Beim erstickten Matt steht der König zwischen eigenen Figuren eingesperrt, und ein Springer setzt matt. Typisch ist ein Damenopfer, das eine gegnerische Figur auf das letzte freie Fluchtfeld zwingt.',
 merksatz='Ersticktes Matt: Der König hat keine Fluchtfelder, weil eigene Figuren ihn einsperren. Ein Springerschach genügt. Oft geht ein Damenopfer voraus.',
 question='Erkläre, wie das Mattbild entsteht. Welche Figuren sperren den König ein, und welches Opfer erzwingt die Mattstellung?',
 motif='Ersticktes Matt'),
'k15': dict(
 concept='Beim Opferangriff gibst du Material, um den gegnerischen König freizulegen. Bekannt ist das Läuferopfer auf h7 oder h2. Danach kommen Dame und Springer schnell zum Angriff. Das Opfer lohnt sich nur, wenn du konkret rechnest.',
 merksatz='Ein Opfer gegen den König braucht Nachschub. Zähle vorher: Welche Figuren können nach dem Opfer sofort mit Schach oder Drohung angreifen?',
 question='Erkläre, warum sich dein Opfer lohnt. Welche Figuren greifen danach an, und warum kann sich die Gegenseite nicht verteidigen?',
 motif='Opfer'),
'k16': dict(
 concept='Viele Studien leben vom leisen Zug. Er gibt kein Schach und schlägt nichts, stellt aber eine Drohung auf, gegen die es keine gute Verteidigung gibt. Solche Züge findet nur, wer auch an ruhige Möglichkeiten denkt.',
 merksatz='Nicht nur Schachs und Schlagzüge prüfen! Ein leiser Zug kann eine Drohung aufstellen, die die Gegenseite nicht mehr abwehren kann.',
 question='Erkläre, was dein leiser Zug droht. Warum gibt es dagegen keine ausreichende Verteidigung?',
 motif='Ruhiger Zug'),
'k17': dict(
 concept='Fast immer verwandelt ein Bauer in eine Dame. Manchmal ist eine andere Figur besser. Ein Springer kann mit Schach eine Gabel geben, ein Turm oder Läufer vermeidet ein Patt. Das ist die Unterverwandlung.',
 merksatz='Prüfe vor jeder Umwandlung alle vier Figuren. Ein Springer gibt Schach wie keine Dame, ein Turm oder Läufer kann ein Patt verhindern.',
 question='Erkläre, warum du nicht in eine Dame umwandelst. Was leistet die gewählte Figur, das eine Dame hier nicht könnte?',
 motif='Unterverwandlung'),
'k18': dict(
 concept='Schmunzelschach: Die Dame ist die stärkste Figur, und trotzdem stellst du sie hier mitten in den Angriff. Solche Damenopfer sehen zuerst unmöglich aus. Sie funktionieren, weil danach Matt oder großer Materialgewinn folgt.',
 merksatz='Auch die Dame darf geopfert werden. Entscheidend ist nicht, was du hergibst, sondern was nach dem Opfer passiert.',
 question='Erkläre, warum dein Damenopfer funktioniert. Was passiert, wenn die Gegenseite die Dame nimmt, und was, wenn sie es nicht tut?',
 motif='Damenopfer'),
'k19': dict(
 concept='In diesem Modul stammen alle Stellungen aus Partien starker Spielerinnen und Spieler. Hier musst du selbst erkennen, welches Motiv passt. So übst du, was du in deinen eigenen Turnierpartien brauchst.',
 merksatz='In der Partie sagt dir niemand das Thema. Prüfe immer in dieser Reihenfolge: Schachs, Schlagzüge, Drohungen. Danach erst ruhige Pläne.',
 question='Erkläre, welches Motiv du in dieser Meisterpartie gefunden hast. Woran hast du es erkannt, und wie hat die Gegenseite reagiert?',
 motif=None),
}
GROUP_INTRO = {
 'Turmendspiele': 'turm',
 'Weitere Endspiele': 'bauer',
 'Taktik': 'laeufer',
 'Studien und Partiepraxis': 'dame',
}
