# -*- coding: utf-8 -*-
from common import *

m = Modul("002", "Wie veränderten Maschinen die Arbeit?", "Arbeit",
          "Industrialisierung und soziale Frage · Akte 002",
          "Ein Handwerker bestimmte selbst, wann er eine Pause machte. In der Fabrik gaben Glocke, Uhr und Maschine den Takt an. In diesem Modul findest du heraus, wie sich die Arbeit veränderte und was das für die Menschen bedeutete.",
          "Weiter geht es mit Modul 003: Warum wuchsen die Städte so schnell?",
          badges=[dict(id="abz1", name="Werkstattkenner", tasks=["formen"]),
                  dict(id="abz2", name="Rechenprofi", tasks=["nadel"]),
                  dict(id="abz3", name="Quellenprüfer", tasks=["s1", "s2"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])])

m.section("formen", "Handwerk, Manufaktur, Fabrik", "Drei Arten zu arbeiten",
    '<p>Vor der Industrialisierung arbeiteten die meisten Menschen in der Landwirtschaft, im <strong>Handwerk</strong> oder in <strong>Heimarbeit</strong>. Schon im 17. und 18. Jahrhundert gab es außerdem <strong>Manufakturen</strong>, also große Werkstätten. Mit der <strong>Fabrik</strong> kam etwas Neues hinzu: die Maschine mit eigenem Antrieb.</p>'
    + m.zuord("formen",
        [("handwerk", "Handwerk"), ("manufaktur", "Manufaktur"), ("fabrik", "Fabrik")],
        [("Ein Meister arbeitet mit Geselle und Lehrling in seiner Werkstatt", "handwerk"),
         ("Ein Stück wird von einer Person von Anfang bis Ende hergestellt", "handwerk"),
         ("Die Werkzeuge gehören dem Handwerker selbst", "handwerk"),
         ("Viele Menschen arbeiten unter einem Dach, aber noch von Hand", "manufaktur"),
         ("Jeder erledigt nur einen Handgriff, zum Beispiel beim Herstellen von Nadeln", "manufaktur"),
         ("Gab es schon vor der Industrialisierung, etwa für Porzellan oder Tuch", "manufaktur"),
         ("Eine Dampfmaschine treibt viele Maschinen gleichzeitig an", "fabrik"),
         ("Die Maschine bestimmt das Arbeitstempo", "fabrik"),
         ("Die Arbeiter besitzen nur ihre Arbeitskraft und bekommen dafür Lohn", "fabrik")],
        "Alle neun richtig. Der große Unterschied: In der Manufaktur war die Arbeit schon aufgeteilt, aber noch Handarbeit. In der Fabrik übernahmen Maschinen mit eigenem Antrieb die Arbeit. Die Menschen bedienten sie.",
        "Frage dich: Arbeitet hier ein Meister mit eigenem Werkzeug, arbeiten viele von Hand zusammen, oder läuft eine Maschine?",
        "Arbeitsformen unterscheiden", ["fachwissen"],
        hilfe="Merke dir: Handwerk = wenige Menschen, eigenes Werkzeug, ganzes Stück. Manufaktur = viele Menschen, Handarbeit, aufgeteilte Schritte. Fabrik = Maschinen mit Antrieb, Lohnarbeit."))

SMITH = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Adam Smith, „Der Wohlstand der Nationen“, London 1776, Buch 1, Kapitel 1.</strong> Der schottische Gelehrte beschreibt, wie in einer kleinen Manufaktur Stecknadeln hergestellt werden.</p>
 <blockquote class="q"><p><em>Vereinfacht wiedergegeben:</em> Ein ungelernter Arbeiter allein könnte an einem Tag kaum eine Nadel herstellen, sicher keine zwanzig. In der Manufaktur ist die Arbeit dagegen aufgeteilt: Einer zieht den Draht, ein anderer streckt ihn, ein dritter schneidet ihn, ein vierter spitzt ihn, ein fünfter schleift das obere Ende für den Kopf. So entstehen etwa achtzehn Arbeitsschritte. Smith hat eine kleine Manufaktur gesehen, in der nur zehn Männer arbeiteten. Zusammen stellten sie an einem Tag mehr als 48.000 Nadeln her.</p>
 <p class="orig">Englischer Wortlaut eines Satzes: „One man draws out the wire; another straights it; a third cuts it; a fourth points it; a fifth grinds it at the top for receiving the head.“</p></blockquote>
</div>'''

m.section("arbeitsteilung", "Die Stecknadel-Rechnung", "Die Stecknadel-Rechnung",
    '<p>Ein Grund, warum Manufakturen und Fabriken so viel mehr herstellten, heißt <strong>Arbeitsteilung</strong>. Der Ökonom Adam Smith hat sie an einem berühmten Beispiel erklärt.</p>' + SMITH +
    m.mc("nadel", "N1. Zehn Arbeiter stellen zusammen etwa 48.000 Nadeln am Tag her. Wie viele Nadeln sind das ungefähr pro Person?",
        [("a", "Etwa 480"), ("b", "Etwa 48"), ("c", "Etwa 4.800")], "c",
        {"a": "Rechne noch einmal: 48.000 geteilt durch 10.",
         "b": "Das ist zu wenig. Rechne: 48.000 geteilt durch 10.",
         "c": "Richtig. 4.800 Nadeln pro Person statt vielleicht 20. So rechnete Smith selbst. Arbeitsteilung steigerte die Menge enorm. In der Fabrik wurde sie später mit Maschinen noch weiter getrieben."},
        "Arbeitsteilung berechnen", ["fachwissen", "quellenarbeit"], tag="Rechnen mit der Quelle") +
    m.text("q2", "Weiterdenken. Smith lobte die Arbeitsteilung, warnte später im selben Buch aber auch: Wer sein Leben lang nur wenige einfache Handgriffe macht, verlernt das Nachdenken und wird, so Smith, „so dumm und unwissend, wie ein Mensch nur werden kann“ (vereinfacht übersetzt). Was meinte er damit? Gilt das auch für Arbeit heute, zum Beispiel am Fließband oder im Paketlager?",
        "Smith meinte, dass ... Heute ist das ähnlich, weil ...",
        dict(min=60, worte=14, need=2, gruppen=[
            dict(w=["eintonig", "gleich", "handgriff", "immer", "wiederhol", "langweil", "nachdenk", "denken", "lernen", "einfach"], miss="Erkläre, was eintönige Arbeit mit dem Denken macht."),
            dict(w=["heute", "fliessband", "lager", "paket", "jetzt", "maschin", "roboter"], miss="Stelle einen Bezug zu heute her.")],
            ok="Gut durchdacht. Smith sah beide Seiten: Arbeitsteilung bringt viel mehr Waren, aber eintönige Arbeit kann Menschen geistig verkümmern lassen. Diese Frage stellt man sich auch heute."),
        "Weiterdenken Smith", ["perspektivitaet"], tag="Weiterdenken · zweite Sicht"))

QUELLE = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Fabrikordnung der Ravensberger Spinnerei, Bielefeld, 1856 (Auszug).</strong> Die Ravensberger Spinnerei war eine der größten Flachsspinnereien in Deutschland. Die Fabrikordnung hing in der Fabrik aus. Wer eingestellt wurde, musste sich an sie halten.</p>
 <blockquote class="q">
 <p>„§ 2. Die Arbeit beginnt an jedem Tage, außer an den Sonntagen und den gesetzlichen Feiertagen, des Sommers 5 ½ Uhr, des Winters früh 6 Uhr, und dauert mit Ausnahme von ½ Stunde Frühstückszeit, 1 Stunde Mittagsruhe (12 bis 1 Uhr) im Sommer bis Abends 7 Uhr, im Winter bis Abends 7 ½ Uhr, also volle 12 Stunden, und ist es den Arbeitern nicht gestattet, sich innerhalb dieser Zeit ohne Erlaubnis zu entfernen.</p>
 <p>§ 4. Der jedesmalige Beginn der Arbeit wird durch das Läuten einer Glocke angezeigt, in der Art, dass ½ Stunde vor Beginn zum ersten Mal und 20 Minuten später zum zweiten Mal angeschlagen wird, und müssen sämtliche Personen fünf Minuten nachher bei ihrer Arbeit stehen. […]</p>
 <p>§ 5. Jedem Arbeiter, der zu spät in die Arbeit kommt, oder ohne Erlaubnis zu Hause bleibt, wird die Strafe von dem doppelten Werte derer Zeit seines Ausbleibens auferlegt, die geringste Strafe wird für ¼ Tag gerechnet.</p>
 <p>§ 7. Während der Arbeitszeit sind sämtliche in der Fabrik beschäftigten Personen den Fabrikverwaltern, deren Stellvertretern und den Aufsehern unbedingten Gehorsam schuldig […].</p>
 <p>§ 12. […] ebenso ist dem Arbeiter unnützes Plaudern, Fluchen, Streiten, Singen unanständiger Lieder und überhaupt jedes Störung verursachende unanständige Benehmen bei Strafe untersagt.“</p>
 </blockquote>
 <p class="wort"><strong>Worterklärungen:</strong> auferlegt = verhängt · unbedingter Gehorsam = Gehorsam ohne Widerspruch · untersagt = verboten</p>
</div>'''

m.section("quelle", "Die Quelle", "Die Quelle: Eine Fabrikordnung von 1856",
    '<p>Chronos hat im Archiv eine echte Fabrikordnung gefunden. Sie stammt nicht aus England, sondern aus Bielefeld, nicht weit von Niedersachsen. Auch in Deutschland entstanden ab etwa 1835 immer mehr Fabriken.</p>' + QUELLE +
    chronos("Eine Fabrikordnung ist eine besondere Quelle. Sie zeigt, was die Fabrikleitung wollte. Ob sich alle daran hielten und wie die Arbeiterinnen das fanden, steht nicht drin.") +
    m.multi("s1", "S1. Welche Regeln enthält diese Fabrikordnung? Wähle alle zutreffenden aus.",
        [("zwoelf", "Die Arbeitszeit beträgt volle zwölf Stunden am Tag."),
         ("pausen", "Die Arbeiter dürfen ihre Pausen selbst festlegen."),
         ("glocke", "Eine Glocke zeigt den Arbeitsbeginn an."),
         ("strafe", "Wer zu spät kommt, zahlt mindestens den Lohn für einen Viertel Tag als Strafe."),
         ("wahl", "Die Arbeiter wählen ihre Aufseher selbst."),
         ("plaudern", "Plaudern, Fluchen und Streiten sind bei Strafe verboten.")],
        ["zwoelf", "glocke", "strafe", "plaudern"],
        "Genau. Die Ordnung regelt Zeit, Pünktlichkeit und Verhalten bis ins Kleinste. Die Fabrikleitung wollte, dass die teuren Maschinen ohne Störung liefen.",
        {"pausen": "Nein. § 2 legt die Pausen genau fest. Ohne Erlaubnis durfte niemand die Arbeit verlassen.",
         "wahl": "Nein. Nach § 7 schuldeten alle den Aufsehern unbedingten Gehorsam. Mitbestimmung gab es nicht."},
        "Fabrikordnung auswerten", ["quellenarbeit", "fachwissen"], tag="Quellenarbeit") +
    m.mc("s2", "S2. Wer hat diese Fabrikordnung geschrieben, und für wen?",
        [("a", "Die Arbeiterinnen und Arbeiter, um sich gegen die Fabrik zu schützen"),
         ("b", "Die Fabrikleitung, für die Beschäftigten. Sie zeigt die Regeln aus Sicht der Unternehmer, nicht wie die Arbeiter sie erlebten."),
         ("c", "Eine Historikerin im Jahr 2020")],
        "b",
        {"a": "Nein. Die Regeln dienen der Fabrik, nicht dem Schutz der Arbeiter. Lies § 7 noch einmal.",
         "b": "Richtig. Die Fabrikordnung ist eine Quelle aus der Sicht der Unternehmer. Sie verrät, was erwünscht und verboten war. Wie streng sie wirklich umgesetzt wurde und was die Arbeiterinnen dachten, müsste man in anderen Quellen suchen.",
         "c": "Nein. Der Text stammt von 1856, er ist eine Quelle, keine Darstellung."},
        "Quellenkritik", ["quellenarbeit", "perspektivitaet"], tag="Quellenkritik"))

# ---------- Tagesablauf als SVG ----------
ROWS = [("t500", "5.00", "Erste Glocke läutet", "#e7ecf0"),
        ("t520", "5.20", "Zweite Glocke läutet", "#e7ecf0"),
        ("t525", "5.25", "Alle müssen an der Arbeit stehen", "#fdf0d8"),
        ("t530", "5.30", "Die Maschinen laufen an", "#dfe9df"),
        ("tfrueh", "vormittags", "½ Stunde Frühstück", "#e7ecf0"),
        ("tmittag", "12.00 bis 13.00", "Mittagsruhe", "#e7ecf0"),
        ("t1900", "19.00", "Arbeitsende im Sommer", "#dfe9df")]
svg = '<svg class="pic" viewBox="0 0 380 520" role="img" aria-label="Arbeitstag im Sommer nach der Fabrikordnung der Ravensberger Spinnerei von 1856" style="max-width:520px;margin:auto"><rect width="380" height="520" fill="#fbfaf6"/>'
svg += '<text x="190" y="30" text-anchor="middle" font-size="18" font-weight="800" fill="#37546b">Ein Sommertag in der Spinnerei, 1856</text>'
svg += '<line x1="40" y1="52" x2="40" y2="500" stroke="#37546b" stroke-width="4"/>'
for i, (rid, zeit, txt, col) in enumerate(ROWS):
    y = 58 + i * 64
    svg += (f'<g id="{rid}" class="hot" data-task="tag" tabindex="0" role="button" aria-label="{zeit}: {txt}">'
            f'<rect x="58" y="{y}" width="310" height="52" rx="10" fill="{col}" stroke="#b9c3cb"/>'
            f'<circle cx="40" cy="{y+26}" r="9" fill="#fff" stroke="#aa6d18" stroke-width="3"/>'
            f'<text x="72" y="{y+22}" font-size="17" font-weight="800" fill="#37546b">{zeit}</text>'
            f'<text x="72" y="{y+43}" font-size="17" fill="#14232d">{txt}</text></g>')
svg += '</svg>'

m.section("zeit", "Die Uhr bestimmt den Tag", "Die Uhr bestimmt den Tag",
    '<p>Auf einem Bauernhof richtete sich die Arbeit nach Tageslicht, Wetter und Jahreszeit. In der Fabrik zählte die Uhr. Diese neue Pünktlichkeit nennt man <strong>Zeitdisziplin</strong>. Die Zeitleiste zeigt einen Sommertag nach der Fabrikordnung.</p>'
    '<div class="svgwrap">' + svg + '</div><div class="legendlist" aria-hidden="true"><span>Eigene Darstellung nach § 2 und § 4 der Fabrikordnung</span></div>'
    + m.hot("tag",
        [("t500", "Finde den Zeitpunkt, an dem man zum ersten Mal an die Arbeit erinnert wird.", "Richtig, 5.00 Uhr. Eine halbe Stunde vor Beginn läutete die erste Glocke. Viele hatten da noch einen langen Fußweg vor sich."),
         ("t525", "Finde den Zeitpunkt, ab dem jemand als zu spät gilt.", "Richtig, 5.25 Uhr. Fünf Minuten nach der zweiten Glocke musste man an der Maschine stehen."),
         ("tmittag", "Finde die längste Pause des Tages.", "Richtig, die Mittagsruhe von 12 bis 13 Uhr. Dazu kam nur eine halbe Stunde Frühstück."),
         ("t1900", "Finde das Ende des Arbeitstages.", "Richtig, 19 Uhr. Von 5.30 bis 19 Uhr sind das 13 ½ Stunden in der Fabrik, davon 12 Stunden Arbeit.")],
        [(r[0], r[1]) for r in ROWS],
        "Alle vier gefunden. Der ganze Tag war durch Glocke und Uhr geregelt.",
        "Zeitleiste des Arbeitstages", ["zeit_raum", "quellenarbeit"], tag="Zeitleiste", titel="Suchauftrag")
    + m.mc("spaet", "Z1. Eine Spinnerin kommt an einem Sommertag um 5.40 Uhr statt um 5.25 Uhr. Was passiert nach § 5?",
        [("a", "Nichts, eine Viertelstunde ist nicht schlimm."),
         ("b", "Ihr werden nur 15 Minuten Lohn abgezogen."),
         ("c", "Sie muss als Strafe den Lohn für einen Viertel Tag zahlen.")],
        "c",
        {"a": "Doch. Nach § 5 wurde jedes Zuspätkommen bestraft.",
         "b": "Lies § 5 genau: Die Strafe ist das Doppelte der versäumten Zeit, mindestens aber ein Viertel Tag.",
         "c": "Richtig. Die geringste Strafe war ein Viertel Tageslohn, also etwa drei Stunden Arbeit für 15 Minuten Verspätung. So erzog die Fabrik zur Pünktlichkeit."},
        "Zeitdisziplin", ["quellenarbeit", "ursachen_folgen"], tag="Auswahl mit Erklärung"))

m.section("perspektiven", "Wer sieht das wie?", "Wer sieht das wie?",
    '<p>Die Fabrik veränderte das Leben ganz unterschiedlicher Menschen. Ordne jede Aussage der Person zu, die so denken könnte.</p>'
    '<div class="notice warn"><strong>Wichtig:</strong> Diese Aussagen sind keine Zitate. Sie wurden für dieses Modul formuliert und fassen typische Sichtweisen zusammen.</div>'
    + m.zuord("persp",
        [("besitzer", "Fabrikbesitzer"), ("spinnerin", "Arbeiterin in der Spinnerei"), ("weber", "Handweber zu Hause")],
        [("Meine Maschinen sind teuer. Sie müssen ohne Unterbrechung laufen, sonst verliere ich Geld.", "besitzer"),
         ("Ohne Pünktlichkeit und Gehorsam funktioniert ein großer Betrieb nicht.", "besitzer"),
         ("Die Glocke läutet um fünf. Wer zu spät kommt, verliert einen Viertel Tageslohn.", "spinnerin"),
         ("Im Spinnsaal ist es heiß und nass, aber jeden Samstag gibt es Lohn in bar.", "spinnerin"),
         ("Das Fabrikgarn ist billiger als unseres. Wir verdienen immer weniger.", "weber"),
         ("Ich teile meine Zeit selbst ein, aber ich muss immer länger arbeiten, damit es reicht.", "weber")],
        "Alle richtig. Dieselbe Veränderung sah für jeden anders aus: Der Unternehmer dachte an Kosten, die Arbeiterin an Lohn und Strafen, der Handweber an seine verlorene Arbeit.",
        "Überlege: Wer denkt an Kosten, wer erlebt Glocke und Spinnsaal, und wer arbeitet zu Hause am eigenen Webstuhl?",
        "Perspektiven zuordnen", ["perspektivitaet"], tag="Perspektivwechsel",
        hilfe="Der Handweber arbeitete zu Hause und verkaufte seine Ware an einen Händler. Die billigere Fabrikware machte ihm Konkurrenz."))

m.section("folgen", "Widerstand gegen Maschinen", "Widerstand gegen Maschinen",
    '<p>Nicht alle nahmen die Maschinen einfach hin. In England zerstörten zwischen 1811 und 1816 Arbeiter in mehreren Gegenden Webmaschinen. Man nannte sie „Ludditen“. In Schlesien erhoben sich 1844 die Weber gegen Fabrikanten und Händler.</p>'
    + m.mc("maschinen", "F1. Warum zerstörten Arbeiter Maschinen?",
        [("a", "Sie fürchteten um ihre Arbeit und ihren Lohn, weil Maschinen billiger herstellten."),
         ("b", "Maschinen waren damals verboten, und sie wollten das Gesetz durchsetzen."),
         ("c", "Sie langweilten sich bei der Arbeit.")],
        "a",
        {"a": "Richtig. Für viele Handwerker und Heimarbeiter bedeutete die Maschine Lohnverlust oder Arbeitslosigkeit. Die Zerstörung war ein verzweifelter Protest. Aufhalten konnte sie die Entwicklung nicht. Später organisierten sich Arbeiter auf andere Weise, zum Beispiel in Gewerkschaften.",
         "b": "Nein. Maschinen waren erlaubt. Im Gegenteil: In England wurde das Zerstören von Maschinen sogar mit dem Tod bestraft.",
         "c": "Das trifft den Kern nicht. Es ging um ihr Einkommen und damit um das Überleben ihrer Familien."},
        "Folgen für die Arbeiter", ["ursachen_folgen", "perspektivitaet"], tag="Ursache und Folge"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Akte 002</span>
 <p><strong>Fall:</strong> Auf einer Karteikarte im Archiv steht: <em>„Maschinen haben den Menschen die Arbeit erleichtert.“</em></p>
 <p><strong>Dein Auftrag:</strong> Prüfe, ob das für alle Menschen galt. Am Ende entscheidest du, ob die Karte stimmt oder ergänzt werden muss.</p>
</div>
<p><strong>Zum Einstieg:</strong> Wer bestimmt, wann dein Schultag beginnt? Der Gong, der Stundenplan, die Uhr. Das kommt dir selbstverständlich vor. Vor 200 Jahren war es für die meisten Menschen neu, dass eine Uhr ihren Arbeitstag regelte. Das begann mit der Fabrik.</p>
{chronos("Ich finde Maschinen praktisch. Mein Kaffee kommt aus einer. Aber eine Kollegin hat mir eine alte Fabrikordnung auf den Tisch gelegt und gefragt: Praktisch für wen? Finde es heraus.")}
<p><strong>Leitfrage:</strong> Wie veränderten Maschinen die Arbeit?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Werkstattkenner</span>
 <span class="abz" id="abz2">Rechenprofi</span>
 <span class="abz" id="abz3">Quellenprüfer</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Wortbedeutung", "D1. Was ist eine Manufaktur?",
     [("a", "Eine Fabrik mit Dampfmaschinen"), ("b", "Ein großer Betrieb, in dem viele Menschen arbeitsteilig von Hand arbeiten"), ("c", "Ein Bauernhof mit Tieren")], "b"),
    ("d2", "Richtig oder falsch", "D2. In den ersten Fabriken arbeiteten die Menschen oft zwölf Stunden und mehr am Tag.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "r"),
    ("d3", "Vermutung", "D3. Wem gehörten in einer Fabrik die Maschinen?",
     [("a", "Den Arbeiterinnen und Arbeitern"), ("b", "Dem Staat"), ("c", "Dem Fabrikbesitzer")], "c")],
    dict(alle="Drei von drei. Deine Vermutungen passen gut. Probiere ruhig den Lernweg Weiterdenken.",
         fast="Zwei von drei. Gute Grundlage. Im Modul klärst du den Rest.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da.",
         extra=[dict(n="d2", v="f", m="Ein Hinweis vorab: Zwölf Stunden Arbeit am Tag waren in vielen Fabriken normal.")]))

gloss = glossar_section([
    ("Handwerk", "Herstellung von Waren von Hand in kleinen Werkstätten. Ein Meister arbeitete mit Gesellen und Lehrlingen, die Werkzeuge gehörten ihm."),
    ("Heimarbeit", "Arbeit zu Hause, zum Beispiel Spinnen oder Weben. Ein Händler brachte Rohstoffe und kaufte die fertige Ware. Man nennt das auch Verlagssystem."),
    ("Manufaktur", "Großer Betrieb, in dem viele Menschen unter einem Dach von Hand und mit verteilten Arbeitsschritten arbeiteten."),
    ("Fabrik", "Großbetrieb, in dem Maschinen mit eigenem Antrieb, zum Beispiel durch Dampf, die Arbeit erledigen. Die Menschen bedienen die Maschinen gegen Lohn."),
    ("Arbeitsteilung", "Eine Arbeit wird in viele kleine Schritte zerlegt, und jeder übernimmt nur einen Schritt. So entsteht viel mehr in kürzerer Zeit."),
    ("Lohnarbeit", "Ein Mensch verkauft seine Arbeitskraft und bekommt dafür Geld. Werkzeuge, Maschinen und Waren gehören dem Arbeitgeber."),
    ("Fabrikordnung", "Regeln, die der Fabrikbesitzer für seinen Betrieb aufstellte, zum Beispiel zu Arbeitszeit, Pausen und Strafen."),
    ("Zeitdisziplin", "Die Pflicht, sich genau nach der Uhr zu richten: pünktlich anfangen, Pausen einhalten, nicht früher gehen."),
    ("Ludditen", "Englische Arbeiter, die zwischen 1811 und 1816 aus Protest Maschinen zerstörten.")],
    ["Fabrikordnung der Ravensberger Spinnerei, Bielefeld 1856, Auszug. Stadtarchiv Detmold M 2, Bielefeld Nr. 320. Abgedruckt in der Unterrichtsreihe „Die Geschichte der Industrialisierung in Bielefeld“ der Universität Bielefeld.",
     "Adam Smith, An Inquiry into the Nature and Causes of the Wealth of Nations, London 1776, Buch 1, Kapitel 1 (Stecknadeln) und Buch 5, Kapitel 1 (Warnung). Englischer Wortlaut nach der gemeinfreien Ausgabe, deutsche Wiedergabe für dieses Modul vereinfacht.",
     "Ludditen 1811 bis 1816, Weberaufstand in Schlesien 1844: Forschungsstand.",
     "Die Zeitleiste des Arbeitstages ist eine eigene Darstellung nach der Fabrikordnung."])

lc = lerncheck_section(["Ich kann Handwerk, Manufaktur und Fabrik unterscheiden.",
                        "Ich kann erklären, was Arbeitsteilung und Zeitdisziplin bedeuten.",
                        "Ich kann eine Fabrikordnung als Quelle auswerten und ihre Sichtweise erkennen."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf der Karteikarte steht: <em>„Maschinen haben den Menschen die Arbeit erleichtert.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt so. Maschinen machten die Arbeit für alle leichter."),
     ("b", "Die Karte stimmt nur zum Teil. Maschinen steigerten die Menge der Waren, aber für viele Arbeiter wurde die Arbeit länger, eintöniger und strenger geregelt."),
     ("c", "Maschinen brachten allen Menschen nur Nachteile."),
     ("d", "Es kommt auf die Perspektive an. Für Fabrikbesitzer und Käufer brachten Maschinen Vorteile, für Arbeiter und Handweber oft Nachteile.")],
    ["b", "d"],
    {"a": "Prüfe das noch einmal. Denke an zwölf Stunden Arbeit, Strafen fürs Zuspätkommen und die Handweber, die ihr Einkommen verloren.",
     "b": "Gut entschieden. Du unterscheidest zwischen mehr Waren und den Arbeitsbedingungen. Begründe das jetzt in A2.",
     "c": "Das geht zu weit. Maschinen machten zum Beispiel Kleidung viel billiger, davon hatten auch einfache Leute etwas. Für die Arbeitenden waren die Bedingungen aber oft hart.",
     "d": "Gut entschieden. Du betrachtest die Frage aus mehreren Perspektiven. Begründe das jetzt in A2."},
    "Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, wie Maschinen die Arbeit veränderten. Nenne mindestens einen Vorteil und einen Nachteil und nutze ein Beispiel aus der Fabrikordnung.",
    "Lieber Chronos, die Karte muss ergänzt werden, weil ...",
    "„Maschinen stellten viel mehr her, deshalb ...“ · „Für die Arbeiter war das aber schwer, denn ...“ · „In der Fabrikordnung von 1856 steht zum Beispiel, dass ...“",
    dict(min=80, worte=20, need=3, saetze=3, gruppen=[
        dict(w=["mehr", "billig", "schnell", "menge", "waren", "produk", "nadel", "arbeitsteil"], miss="Nenne einen Vorteil, zum Beispiel mehr und billigere Waren."),
        dict(w=["lang", "stunden", "strafe", "eintonig", "gehorsam", "hart", "streng", "lohn", "nass", "heiss", "weniger"], miss="Nenne einen Nachteil für die Arbeiter, zum Beispiel lange Arbeitszeit oder Strafen."),
        dict(w=["glocke", "ordnung", "1856", "zu spat", "zuspat", "pause", "uhr", "punkt", "viertel", "§"], miss="Nutze ein Beispiel aus der Fabrikordnung, etwa Glocke, Strafe oder Pausen.")],
        ok="Sehr gut. Du zeigst beide Seiten und belegst sie mit der Quelle. Genau das ist der Kern: Maschinen brachten mehr Waren, aber die Arbeit wurde nach Uhr und Maschine geregelt. Abzeichen Begründer freigeschaltet."))

build(m, "Ermittlung starten",
      ["Du unterscheidest Handwerk, Manufaktur und Fabrik.",
       "Du erklärst Arbeitsteilung an einem berühmten Beispiel.",
       "Du wertest eine echte Fabrikordnung von 1856 aus.",
       "Du erklärst, was Zeitdisziplin bedeutet.",
       "Du betrachtest die Veränderung aus verschiedenen Perspektiven."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos wartet schon. Es geht weiter mit der Mission.")
