# -*- coding: utf-8 -*-
from common import *

m = Modul("004", "Wie lebten Arbeiterfamilien?", "Familien",
          "Industrialisierung und soziale Frage · Akte 004",
          "Eine Stube, eine Küche, vier Menschen. Dazu manchmal ein fremder Schlafgänger. Wie kam eine Arbeiterfamilie um 1890 mit ihrem Lohn aus, wie wohnte sie, und wer in der Familie trug welche Last?",
          "Weiter geht es mit Modul 005: Kinderarbeit: Notwendigkeit oder Unrecht?",
          badges=[dict(id="abz1", name="Haushaltsprofi", tasks=["budget"]),
                  dict(id="abz2", name="Hausforscher", tasks=["haus"]),
                  dict(id="abz3", name="Quellenprüfer", tasks=["s1", "s2"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])])

# ---------- Haushaltsbuch ----------
POSTEN = [("Haushalt: Essen, Licht", 924), ("Wohnung (Miete)", 259), ("Mann: Bier, Tabak, Sammlungen", 162),
          ("Kleidung und Schuhe", 92.5), ("Verschiedenes, Zeitung", 67), ("Heizung", 45), ("Steuern und Kassenbeiträge", 43), ("Arzt und Apotheke", 20)]
def f(x): return (f'{x:,.2f}' if x % 1 else f'{x:,.0f}').replace(',', 'X').replace('.', ',').replace('X', '.')
rows = ''.join(f'<tr><td>{n}</td><td class="n">{f(v)} Mark</td><td class="n">{round(v/1700*100)} %</td></tr>' for n, v in POSTEN)
TAB = f'<div class="tblwrap"><table class="tbl"><thead><tr><th>Ausgabe im Jahr</th><th class="n">Betrag</th><th class="n">Anteil am Einkommen</th></tr></thead><tbody>{rows}<tr><th>Einkommen</th><th class="n">1.700 Mark</th><th class="n">100 %</th></tr></tbody></table></div>'
svg = '<svg class="pic" viewBox="0 0 380 300" role="img" aria-label="Balkendiagramm der Jahresausgaben einer Berliner Facharbeiterfamilie 1890" style="max-width:560px;margin:auto"><rect width="380" height="300" fill="#fbfaf6"/>'
for i, (n, v) in enumerate(POSTEN):
    y = 14 + i * 35
    w = v / 924 * 200
    svg += f'<text x="8" y="{y+12}" font-size="13" fill="#14232d">{n}</text>'
    svg += f'<rect x="8" y="{y+17}" width="{w:.0f}" height="12" rx="3" fill="{"#aa6d18" if i < 2 else "#37546b"}"/><text x="{14+w:.0f}" y="{y+28}" font-size="12" font-weight="700" fill="#14232d">{round(v/1700*100)} %</text>'
svg += '</svg>'

m.section("budget", "Das Haushaltsbuch", "Das Haushaltsbuch einer Familie",
    '<p>Der Berliner Schriftsteller Otto von Leixner besuchte um 1890 Arbeiterfamilien und schrieb auf, wie sie mit ihrem Geld auskamen. Eine dieser Familien: Der Vater ist Former in einer Werkstatt für Bronzewaren, also ein gelernter Facharbeiter. Die Mutter, früher Dienstmädchen, führt den Haushalt. Die beiden Kinder sind noch klein. Alle vier leben in einem Zimmer mit Küche.</p>'
    '<div class="akte"><span class="stamp">Quelle</span><p><strong>Otto von Leixner, „Soziale Briefe aus Berlin“, 1891.</strong> Die Zahlen gelten für ein Jahr, das Einkommen beträgt im Durchschnitt 1.700 Mark. Einzelposten sind hier zusammengefasst.</p>'
    + TAB + '<blockquote class="q"><p>„Die Frau erhält 18 Mark für den Haushalt der Woche, also 2,57 Mark für den Tag, 64 Pfennige für den Kopf; davon muß noch Beleuchtung bezahlt werden.“</p></blockquote></div>'
    '<div class="svgwrap">' + svg + '</div><div class="legendlist" aria-hidden="true"><span>Diagramm: eigene Darstellung nach Leixner</span></div>'
    + m.luecke("budget",
        ["Die Familie verdient im Jahr ", ("1.700", ["170", "17.000"]), " Mark. Für die Miete zahlt sie 259 Mark, das ist etwa ",
         ("15 Prozent", ["50 Prozent", "2 Prozent"]), ". Für den Haushalt, vor allem für Essen, gibt sie ", ("mehr als die Hälfte", ["ein Zehntel", "fast nichts"]),
         " ihres Einkommens aus. Die Mutter bekommt jede Woche ", ("18", ["180", "1,80"]), " Mark für den Haushalt. Pro Person und Tag sind das nur ",
         ("64 Pfennige", ["6,40 Mark", "4 Pfennige"]), "."],
        "Alles richtig. Mehr als die Hälfte des Geldes ging für Essen weg. Heute gibt eine Familie in Deutschland nur einen viel kleineren Teil ihres Einkommens für Lebensmittel aus.",
        "Lies die Tabelle und das Zitat noch einmal genau.",
        "Haushaltsbudget", ["fachwissen", "quellenarbeit"], tag="Lückentext",
        intro='<p><strong>Rechne mit:</strong> Wähle in jeder Lücke den passenden Wert.</p>')
    + m.mc("sparen", "B1. Die Familie sparte 1889 genau 82 Mark. Warum war Sparen für Arbeiterfamilien so wichtig?",
        [("a", "Damit sie im Sommer verreisen konnten."),
         ("b", "Weil es kaum Absicherung gab. Krankengeld war knapp, eine Altersrente gab es erst ab 1889 und erst ab 70 Jahren, eine Arbeitslosenversicherung gar nicht."),
         ("c", "Weil Banken das vorschrieben.")],
        "b",
        {"a": "Reisen konnte sich eine Arbeiterfamilie damals nicht leisten. Leixner schreibt, dass Ausflüge in den Zoo an billigen Sonntagen schon etwas Besonderes waren.",
         "b": "Richtig. Wurde der Vater krank, verletzt oder arbeitslos, fehlte schnell das Geld für Miete und Essen. Ein kleines Polster konnte die Familie vor der Not retten. Wie der Staat darauf reagierte, lernst du in Modul 006.",
         "c": "Nein. Niemand schrieb das Sparen vor. Leixner betont, dass die Familie nichts auf Pump kaufte, um nicht in Schulden zu geraten."},
        "Absicherung", ["ursachen_folgen", "fachwissen"], tag="Auswahl mit Erklärung"))

# ---------- Mietskaserne ----------
def stock(x, w, y0, n, fill, fenster="#cfe0ef"):
    s = ''
    for i in range(n):
        y = y0 - (i + 1) * 40
        s += f'<rect x="{x}" y="{y}" width="{w}" height="40" fill="{fill}" stroke="#6f675c" stroke-width="1.5"/>'
        for fx in range(x + 12, x + w - 18, 26):
            s += f'<rect x="{fx}" y="{y+10}" width="12" height="18" fill="{fenster}" stroke="#6f675c"/>'
    return s
HAUS = ('<div class="svgwrap"><svg class="pic" viewBox="0 0 400 380" role="img" aria-label="Schematischer Querschnitt durch eine Berliner Mietskaserne mit Straße, Vorderhaus, Hof, Hinterhaus, Keller und Dachkammern" style="max-width:600px;margin:auto">'
        '<rect width="400" height="380" fill="#e8f0f5"/><rect x="0" y="300" width="400" height="80" fill="#cbbfa9"/>'
        '<rect x="0" y="292" width="40" height="8" fill="#8a8378"/><text x="3" y="285" font-size="12" font-weight="700" fill="#14232d">Straße</text>'
        '<g id="hVorder" class="hot" data-task="haus" tabindex="0" role="button" aria-label="Vorderhaus">' + stock(40, 120, 300, 5, "#efe3c8")
        + '<path d="M40 100 h120" stroke="#9c7b45" stroke-width="5"/><path d="M48 104 q8 -10 16 0 M78 104 q8 -10 16 0 M108 104 q8 -10 16 0 M138 104 q8 -10 16 0" stroke="#9c7b45" stroke-width="2" fill="none"/></g>'
        '<g id="hHof" class="hot" data-task="haus" tabindex="0" role="button" aria-label="Hof"><rect x="160" y="100" width="70" height="200" fill="#d7dee3"/><rect x="160" y="290" width="70" height="10" fill="#9a9488"/>'
        '<rect x="182" y="262" width="26" height="28" fill="#b5a68c" stroke="#6f675c"/><text x="195" y="281" text-anchor="middle" font-size="10" fill="#14232d">WC</text>'
        '<path d="M165 250 h60" stroke="#56616a" stroke-width="1.5" marker-start="url(#pf)" marker-end="url(#pf)"/></g>'
        '<g id="hHinter" class="hot" data-task="haus" tabindex="0" role="button" aria-label="Hinterhaus">' + stock(230, 130, 300, 5, "#ddd3bf", "#9fb0bd") + '</g>'
        '<g id="hDach" class="hot" data-task="haus" tabindex="0" role="button" aria-label="Dachkammer"><path d="M226 100 L295 52 L364 100 Z" fill="#9c5a3c" stroke="#6f675c" stroke-width="2"/><rect x="284" y="72" width="22" height="18" fill="#9fb0bd" stroke="#6f675c"/></g>'
        '<path d="M36 100 L100 58 L164 100 Z" fill="#9c5a3c" stroke="#6f675c" stroke-width="2"/>'
        '<g id="hKeller" class="hot" data-task="haus" tabindex="0" role="button" aria-label="Keller"><rect x="40" y="300" width="320" height="42" fill="#a89a82" stroke="#6f675c" stroke-width="1.5"/>'
        '<rect x="56" y="306" width="14" height="8" fill="#7e8b95"/><rect x="250" y="306" width="14" height="8" fill="#7e8b95"/><rect x="300" y="306" width="14" height="8" fill="#7e8b95"/></g>'
        '<defs><marker id="pf" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#56616a"/></marker></defs>'
        '<text x="200" y="368" text-anchor="middle" font-size="12" fill="#56616a">Querschnitt, schematisch, nicht maßstabsgetreu</text>'
        '</svg></div>')

m.section("wohnung", "Die Mietskaserne", "Die Mietskaserne",
    '<p>In den schnell wachsenden Großstädten, besonders in Berlin, entstanden riesige Mietshäuser mit mehreren Hinterhöfen. Man nannte sie <strong>Mietskasernen</strong>. Je weiter hinten und je höher oder tiefer eine Wohnung lag, desto billiger und schlechter war sie meist. Tippe im Querschnitt auf den gesuchten Teil des Hauses.</p>'
    + HAUS + '<div class="legendlist" aria-hidden="true"><span>Zeichnung: eigene schematische Darstellung, kein bestimmtes Haus</span></div>'
    + m.hot("haus",
        [("hVorder", "Gesucht ist der Teil zur Straße hin, mit Licht und Verzierungen an der Fassade. Hier wohnten eher Familien mit mehr Geld.",
          "Richtig, das Vorderhaus. Große Fenster, Stuck und Licht. Hier wohnten zum Beispiel Beamte oder Kaufleute."),
         ("hHinter", "Gesucht ist der Teil weit hinten, mit wenig Licht. Hier lebten viele Arbeiterfamilien in einer Stube mit Küche.",
          "Richtig, das Hinterhaus. In die engen Wohnungen kam oft kaum Sonne."),
         ("hHof", "Gesucht ist der Bereich, der nach der Bauordnung nur etwa 5,34 mal 5,34 Meter groß sein musste, damit eine Feuerspritze wenden konnte.",
          "Richtig, der Hof. Dort standen oft auch die Toiletten, die sich viele Familien teilen mussten."),
         ("hKeller", "Gesucht ist der feuchte, dunkle Bereich unter der Erde, der trotzdem als Wohnung oder Werkstatt vermietet wurde.",
          "Richtig, der Keller. Kellerwohnungen waren billig, aber feucht und ungesund."),
         ("hDach", "Gesucht ist der Raum unter dem Dach, im Sommer heiß und im Winter kalt. Oft schliefen hier Untermieter.",
          "Richtig, die Dachkammer. Hier wohnten oft Schlafgänger oder junge Arbeiterinnen, die sich kein eigenes Zimmer leisten konnten.")],
        [("hVorder", "Vorderhaus"), ("hHinter", "Hinterhaus"), ("hHof", "Hof"), ("hKeller", "Keller"), ("hDach", "Dachkammer")],
        "Alle fünf gefunden. In einem Haus lebten Arm und weniger Arm getrennt: vorne und oben im Licht, hinten, unten und unter dem Dach in Enge.",
        "Bildarbeit Mietskaserne", ["fachwissen", "zeit_raum"], tag="Bildarbeit"))

m.section("alltag", "Wer trug welche Last?", "Wer trug welche Last?",
    '<p>In Arbeiterfamilien musste jeder mithelfen. Viele Mütter arbeiteten neben dem Haushalt für Geld, als Wäscherin, Näherin in Heimarbeit oder in der Fabrik. Diese doppelte Arbeit nennt man <strong>Doppelbelastung</strong>. Ordne die Tätigkeiten zu, so wie sie in vielen Familien verteilt waren.</p>'
    '<div class="notice warn"><strong>Hinweis:</strong> Die Aufteilung ist eine Darstellung typischer Verhältnisse. Sie war nicht in jeder Familie gleich.</div>'
    + m.zuord("alltag",
        [("vater", "Vater"), ("mutter", "Mutter"), ("kinder", "Kinder")],
        [("Arbeitet elf Stunden und länger in der Fabrik", "vater"),
         ("Legt vom Wochenlohn das Geld für die Miete beiseite", "vater"),
         ("Kauft mit 18 Mark in der Woche für die ganze Familie ein", "mutter"),
         ("Näht abends in Heimarbeit für ein paar Pfennige dazu", "mutter"),
         ("Wäscht gegen Geld die Wäsche anderer Familien", "mutter"),
         ("Holen Wasser vom Hof und passen auf die kleinen Geschwister auf", "kinder"),
         ("Gehen zur Schule und tragen danach Zeitungen aus", "kinder")],
        "Alle richtig. Ohne die Arbeit der Mütter und Kinder hätte das Geld in vielen Familien nicht gereicht. Die Mütter trugen dabei die doppelte Last von Erwerbsarbeit und Haushalt.",
        "Frage dich: Wer verdiente den Hauptlohn, wer verwaltete das Haushaltsgeld, und was konnten Kinder neben der Schule tun?",
        "Rollen in der Familie", ["perspektivitaet", "fachwissen"], tag="Zuordnen")
    + m.multi("hoffnung", "H1. Arbeiterfamilien waren nicht nur Opfer. Was half ihnen, ihre Lage zu verbessern? Wähle alle passenden aus.",
        [("spar", "Sparen, zum Beispiel bei einer Sparkasse"),
         ("verein", "Vereine, Volksbüchereien und Bildungsangebote für Arbeiter"),
         ("kasse", "Gewerkschaften und gemeinsame Kassen für Notfälle"),
         ("erbe", "Ein Erbe vom Gutsherrn"),
         ("ausbildung", "Eine Ausbildung, um Facharbeiter zu werden"),
         ("urlaub", "Bezahlter Urlaub am Meer")],
        ["spar", "verein", "kasse", "ausbildung"],
        "Genau. Viele Familien kämpften mit Sparsamkeit, Bildung und Zusammenhalt um ein besseres Leben. Leixners Former lieh sich zum Beispiel Bücher aus der Volksbücherei.",
        {"erbe": "Ein Erbe vom Gutsherrn war für Arbeiterfamilien keine realistische Hoffnung.",
         "urlaub": "Bezahlten Urlaub gab es für Arbeiter vor dem Ersten Weltkrieg praktisch nicht."},
        "Wege aus der Not", ["perspektivitaet"], tag="Mehrfachauswahl"))

QUELLE = '''<div class="akte">
 <span class="stamp">Quelle</span>
 <p><strong>Paul Göhre, „Drei Monate Fabrikarbeiter und Handwerksbursche“, Leipzig 1891 (Auszug).</strong> Göhre war ein junger evangelischer Theologe. 1890 arbeitete er drei Monate lang als einfacher Arbeiter in einer Maschinenfabrik in Chemnitz und wohnte bei Arbeiterfamilien. Danach schrieb er ein Buch darüber.</p>
 <blockquote class="q">
 <p>„Das Traurige an dem ganzen Wohnungswesen dieser Leute war vielmehr ein andres, schon oft beklagtes: das Mißverhältnis zwischen der Enge der Räume und der Zahl ihrer Bewohner. […] Weitaus die meisten Familien hatten eine Schar Kinder, hatten Schlafleute und Kostgänger. […]</p>
 <p>In dieser einzigen Stube, die natürlich Wohnzimmer, Schlafzimmer, Besuchszimmer und Küche zugleich war, stand ein einziges Bett für die Eltern, ein Kinderwagen, ein Tisch, ein paar Stühle, eine Kommode, ein Kleiderschrank und Küchenzeug eng zusammen.“</p>
 <p>An anderer Stelle schreibt er: „Jedenfalls […] war die Zahl der Familien, die bei aller Beschränktheit der Lebenshaltung und Wohnung so gut als möglich auf Adrettheit und Anstand zu halten versuchten und auch thatsächlich hielten, unendlich größer, als diejenigen, bei denen das aus irgend einem Grunde nicht der Fall war.“</p>
 </blockquote>
 <p class="wort"><strong>Worterklärungen:</strong> Mißverhältnis = schlechtes Verhältnis · Schlafleute = Untermieter, die nur ein Bett mieten · Kostgänger = Untermieter, die auch mitessen · Adrettheit = Ordentlichkeit, Sauberkeit · thatsächlich = alte Schreibweise für tatsächlich</p>
</div>'''

m.section("quelle", "Die Quelle", "Die Quelle: Ein Pfarrer als Fabrikarbeiter",
    '<p>Chronos hat einen Bericht von 1891 herausgesucht. Sein Verfasser wollte wissen, wie Arbeiter wirklich leben, und hat es selbst ausprobiert.</p>' + QUELLE
    + chronos("Achte auf den letzten Satz. Göhre widerspricht da jemandem, ohne ihn zu nennen. Frag dich, wem.")
    + m.multi("s1", "S1. Was beschreibt Göhre? Wähle alle zutreffenden Aussagen aus.",
        [("enge", "In engen Räumen lebten zu viele Menschen."),
         ("schlaf", "Viele Familien nahmen Schlafleute und Kostgänger auf."),
         ("stube", "Eine einzige Stube diente als Wohn-, Schlaf- und Besuchszimmer und als Küche."),
         ("ordnung", "Die meisten Familien versuchten, trotz der Enge auf Ordnung und Sauberkeit zu achten."),
         ("haus", "Die meisten Arbeiter wohnten in eigenen Häusern mit Garten."),
         ("egal", "Den Arbeiterfamilien war Ordnung egal.")],
        ["enge", "schlaf", "stube", "ordnung"],
        "Genau. Göhre beschreibt die Enge sehr deutlich. Gleichzeitig betont er, dass die meisten Familien auf Ordnung achteten.",
        {"haus": "Das steht nicht im Text. Göhre beschreibt enge Mietwohnungen.",
         "egal": "Im Gegenteil. Göhre schreibt, dass die meisten Familien „so gut als möglich“ auf Ordnung hielten."},
        "Quelle auswerten", ["quellenarbeit"], tag="Quellenarbeit")
    + m.mc("s2", "S2. Göhre war Theologe und kein Arbeiter. Was bedeutet das für seinen Bericht?",
        [("a", "Er kennt das Arbeiterleben besser als die Arbeiter selbst."),
         ("b", "Sein Bericht ist wertlos, weil er nur drei Monate dort war."),
         ("c", "Er hat vieles selbst gesehen, blieb aber ein Beobachter von außen. Er schrieb für bürgerliche Leser und wollte deren Vorurteile über Arbeiter widerlegen.")],
        "c",
        {"a": "Nein. Göhre war nur drei Monate dort und konnte jederzeit zurück in sein altes Leben. Die Arbeiter selbst kannten ihr Leben viel genauer.",
         "b": "Nicht ganz. Drei Monate sind kurz, aber Göhre hat selbst mitgearbeitet und mitgewohnt. Das macht seinen Bericht wertvoll, man muss nur seinen Blickwinkel beachten.",
         "c": "Richtig. Göhre war ein Augenzeuge mit einem Ziel: Er wollte bürgerlichen Lesern zeigen, wie Arbeiter wirklich lebten. Deshalb betont er ihre Ordnung, gegen das Vorurteil, Arbeiter seien unordentlich. Was die Familien selbst dachten, erfahren wir nur durch seine Augen."},
        "Quellenkritik", ["quellenarbeit", "perspektivitaet"], tag="Quellenkritik")
    + m.mc("q1", "S3. Leixners Haushaltsbuch beschreibt die Familie eines „besser gestellten“ Facharbeiters. Was folgt daraus?",
        [("a", "So lebten alle Arbeiterfamilien in Deutschland."),
         ("b", "Familien ungelernter Arbeiter hatten oft noch weniger Geld. Ein einzelnes Beispiel darf man nicht verallgemeinern."),
         ("c", "Facharbeiter waren damals reich.")],
        "b",
        {"a": "Vorsicht. Leixner selbst nennt die Familie „besser gestellt“. Ungelernte Arbeiter verdienten deutlich weniger.",
         "b": "Richtig. Eine Quelle zeigt immer nur einen Ausschnitt. Um zu wissen, wie typisch ein Fall ist, braucht man viele Quellen oder Statistiken.",
         "c": "Nein. Auch die Facharbeiterfamilie lebte in einem Zimmer mit Küche und musste jeden Pfennig umdrehen."},
        "Verallgemeinern prüfen", ["quellenarbeit", "historisches_urteil"], tag="Quelle und Darstellung")
    + m.text("q2", "Weiterdenken. Göhre schreibt, dass die meisten Familien trotz Enge auf Ordnung achteten. Warum war ihm dieser Satz wohl so wichtig? An wen richtete er sich, und welches Bild wollte er verändern?",
        "Göhre wollte zeigen, dass ... Er richtete sich an ..., weil ...",
        dict(min=60, worte=15, need=2, gruppen=[
            dict(w=["vorurteil", "bild", "dachten", "glaubten", "meinung", "unordentlich", "schmutzig", "faul"], miss="Erkläre, welches Vorurteil Göhre widerlegen wollte."),
            dict(w=["burger", "leser", "reich", "kirche", "oberschicht", "gebildet"], miss="Nenne, an wen er sich richtete, zum Beispiel an bürgerliche Leser.")],
            ok="Gut erkannt. Göhre schrieb für bürgerliche Leser, von denen viele glaubten, Arbeiter seien unordentlich oder selbst schuld an ihrer Lage. Er wollte zeigen: Das Problem war die Wohnungsnot, nicht die Menschen."),
        "Weiterdenken Standort", ["perspektivitaet"], tag="Weiterdenken · Standort des Verfassers"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Akte 004</span>
 <p><strong>Fall:</strong> Auf einer Karteikarte steht: <em>„Alle Arbeiterfamilien lebten gleich: arm, eng und ohne Hoffnung.“</em></p>
 <p><strong>Dein Auftrag:</strong> Untersuche Geld, Wohnung und Alltag von Arbeiterfamilien. Am Ende entscheidest du, ob die Karte stimmt.</p>
</div>
<p><strong>Zum Einstieg:</strong> Stell dir vor, deine ganze Familie lebt, kocht und schläft in einem einzigen Zimmer. Abends kommt noch ein fremder junger Mann nach Hause, der bei euch ein Bett gemietet hat. Für viele Familien in den Großstädten um 1890 war das Alltag.</p>
{chronos("Ich habe die Karteikarte von einem alten Zeitungsartikel abgeschrieben. Jetzt frage ich mich, ob der Verfasser je eine Arbeiterwohnung von innen gesehen hat.")}
<p><strong>Leitfrage:</strong> Wie lebten Arbeiterfamilien?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Haushaltsprofi</span>
 <span class="abz" id="abz2">Hausforscher</span>
 <span class="abz" id="abz3">Quellenprüfer</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Wortbedeutung", "D1. Was ist ein Schlafgänger?",
     [("a", "Ein Nachtwächter in der Fabrik"), ("b", "Jemand, der in einer fremden Wohnung nur ein Bett mietet"), ("c", "Ein Schlafwandler")], "b"),
    ("d2", "Schätzfrage", "D2. Wie viel ihres Geldes gab eine Arbeiterfamilie um 1890 ungefähr für Essen aus?",
     [("a", "Etwa ein Zehntel"), ("b", "Etwa die Hälfte"), ("c", "Fast nichts, Essen war billig")], "b"),
    ("d3", "Vermutung", "D3. Was ist eine Mietskaserne?",
     [("a", "Ein großes Mietshaus mit Hinterhöfen für viele Familien"), ("b", "Eine Unterkunft für Soldaten"), ("c", "Eine Villa am Stadtrand")], "a")],
    dict(alle="Drei von drei. Deine Vermutungen passen gut. Probiere ruhig den Lernweg Weiterdenken.",
         fast="Zwei von drei. Gute Grundlage.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da.",
         extra=[dict(n="d2", v="a", m="Ein Hinweis vorab: Heute ist es etwa so wenig. Um 1890 war es viel mehr.")]))

gloss = glossar_section([
    ("Facharbeiter", "Ein Arbeiter mit Ausbildung, zum Beispiel Former, Schlosser oder Dreher. Er verdiente mehr als ein ungelernter Arbeiter."),
    ("Ungelernter Arbeiter", "Ein Arbeiter ohne Berufsausbildung. Er verdiente wenig und verlor seine Arbeit oft als Erster."),
    ("Mietskaserne", "Großes Mietshaus mit Vorderhaus, Seitenflügeln und Hinterhäusern um enge Höfe, vor allem in Berlin."),
    ("Schlafgänger, Kostgänger", "Untermieter, die in einer fremden Wohnung nur ein Bett mieteten, Kostgänger aßen dort auch mit. Familien verdienten so dazu."),
    ("Doppelbelastung", "Frauen arbeiteten für Geld und versorgten zusätzlich Haushalt und Kinder."),
    ("Heimarbeit", "Bezahlte Arbeit zu Hause, zum Beispiel Nähen oder Kleben, meist für sehr wenig Geld."),
    ("Mark und Pfennig", "Die Währung im Deutschen Reich ab 1873. Eine Mark hatte 100 Pfennige."),
    ("Haushaltsbudget", "Die Planung von Einnahmen und Ausgaben eines Haushalts.")],
    ["Otto von Leixner, 1888 bis 1891. Soziale Briefe aus Berlin, Berlin 1891, S. 183 bis 188. Nach dem Abdruck bei German History in Documents and Images (GHDI), „Haushaltsführung und Lebensweise der Familie eines besser gestellten Facharbeiters in Berlin (1890)“. Einzelposten der Ausgaben für dieses Modul zusammengefasst.",
     "Paul Göhre, Drei Monate Fabrikarbeiter und Handwerksbursche. Eine praktische Studie, Leipzig 1891, S. 20 bis 26. Nach dem Abdruck bei GHDI, „Arbeiterwohnungen in Chemnitz und Berlin (1890)“. Wortlaut mit alter Rechtschreibung.",
     "Mindestgröße der Berliner Höfe von 5,34 mal 5,34 Metern nach der Baupolizeiordnung (Feuerspritze).",
     "Querschnitt, Diagramm und Rollenkarten sind eigene Darstellungen."])

lc = lerncheck_section(["Ich kann beschreiben, wie Arbeiterfamilien in den Großstädten wohnten.",
                        "Ich kann ein Haushaltsbudget auswerten.",
                        "Ich kann erklären, warum eine einzelne Quelle nicht für alle Familien steht."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf der Karteikarte steht: <em>„Alle Arbeiterfamilien lebten gleich: arm, eng und ohne Hoffnung.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt so."),
     ("b", "Die Lebensbedingungen waren für die meisten hart und eng, aber sie unterschieden sich nach Lohn, Kinderzahl und Wohnort. Viele Familien versuchten mit Sparen, Bildung und Zusammenhalt, ihre Lage zu verbessern."),
     ("c", "Arbeiterfamilien ging es eigentlich gut."),
     ("d", "Nicht alle lebten gleich: Facharbeiter verdienten mehr als Ungelernte, und Mütter und Kinder trugen viel dazu bei, dass das Geld reichte. Hoffnungslos waren die meisten nicht.")],
    ["b", "d"],
    {"a": "Prüfe das noch einmal. Denke an den Unterschied zwischen Leixners Facharbeiter und ungelernten Arbeitern, und an Göhres Satz über Ordnung.",
     "b": "Gut entschieden. Du erkennst die Not und die Unterschiede. Begründe das jetzt in A2.",
     "c": "Das stimmt nicht. Selbst die besser gestellte Familie lebte zu viert in einem Zimmer und gab über die Hälfte für Essen aus.",
     "d": "Gut entschieden. Du unterscheidest zwischen verschiedenen Familien und siehst die Rolle von Müttern und Kindern. Begründe das jetzt in A2."},
    "Schreibe Chronos eine Nachricht. Beschreibe in drei bis fünf Sätzen, wie Arbeiterfamilien lebten. Gehe auf Wohnung, Geld und Unterschiede oder Hoffnungen ein und nutze eine der Quellen.",
    "Lieber Chronos, deine Karte stimmt nicht ganz, weil ...",
    "„Die meisten Familien wohnten sehr eng, zum Beispiel ...“ · „Das Geld reichte kaum, denn ...“ · „Aber nicht alle lebten gleich, weil ...“",
    dict(min=80, worte=20, need=3, saetze=3, gruppen=[
        dict(w=["wohn", "zimmer", "stube", "eng", "schlafg", "kostg", "hinterhaus", "mietskaserne", "miete"], miss="Beschreibe die Wohnung, zum Beispiel eine Stube für alles."),
        dict(w=["lohn", "mark", "geld", "essen", "nahrung", "spar", "budget", "halfte", "verdien"], miss="Gehe auf das Geld ein, zum Beispiel den Anteil für Essen."),
        dict(w=["unterschied", "facharbeiter", "ungelernt", "nicht alle", "mutter", "frau", "kinder", "hoffnung", "verein", "ordnung", "bildung"], miss="Zeige Unterschiede oder Hoffnungen, zum Beispiel Facharbeiter und Ungelernte.")],
        ok="Sehr gut. Du beschreibst Wohnung und Geld und zeigst, dass nicht alle gleich lebten. Genau das ist der Kern: harte Not für viele, aber mit großen Unterschieden und mit dem Willen, die Lage zu verbessern. Abzeichen Begründer freigeschaltet."))

build(m, "Ermittlung starten",
      ["Du wertest das Haushaltsbuch einer Arbeiterfamilie aus.",
       "Du erkundest den Aufbau einer Mietskaserne.",
       "Du erklärst, welche Arbeit Väter, Mütter und Kinder leisteten.",
       "Du wertest den Bericht eines Augenzeugen kritisch aus.",
       "Du prüfst, ob man ein einzelnes Beispiel verallgemeinern darf."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos wartet schon. Es geht weiter mit der Mission.")
