# -*- coding: utf-8 -*-
from common import *

m = Modul("003", "Warum wuchsen die Städte so schnell?", "Städte",
          "Industrialisierung und soziale Frage · Akte 003",
          "1849 lebten in Essen knapp 9.000 Menschen. Im Jahr 1900 waren es fast 119.000. Wie konnte eine kleine Stadt in fünfzig Jahren so wachsen? Und warum blieb das Emsland zur gleichen Zeit ländlich?",
          "Weiter geht es mit Modul 004: Wie lebten Arbeiterfamilien?",
          badges=[dict(id="abz1", name="Kartenleser", tasks=["karte"]),
                  dict(id="abz2", name="Ursachenforscher", tasks=["pushpull", "kette"]),
                  dict(id="abz3", name="Statistikprüfer", tasks=["s1", "s2", "q1"]),
                  dict(id="abz4", name="Begründer", tasks=["a2"])])

# ---------- Karte Nordwestdeutschland ----------
LON0, LAT0, K = 6.2, 54.0, 190
KX = K * 0.61
def P(lon, lat):
    return proj(lon, lat, LON0, LAT0, K, KX, 15, 15)
def path(pts, close=False):
    return 'M' + ' L'.join(f'{x} {y}' for x, y in (P(*p) for p in pts)) + (' Z' if close else '')

COAST = [(6.2,53.42),(6.8,53.45),(6.95,53.33),(7.1,53.25),(7.25,53.3),(7.05,53.48),(7.2,53.62),(7.5,53.68),(8.0,53.71),(8.1,53.55),(8.17,53.42),(8.3,53.45),(8.25,53.6),(8.5,53.65),(8.55,53.55),(8.6,53.85),(8.75,53.88),(9.0,53.88),(9.4,53.95),(10.2,53.95)]
land = path(COAST + [(10.2,51.0),(6.2,51.0)], True)
GRENZE = [(7.2,53.25),(7.21,53.0),(7.07,52.82),(7.07,52.65),(6.75,52.65),(6.7,52.48),(7.0,52.45),(7.05,52.24),(6.7,52.05),(6.8,51.95),(6.4,51.85),(6.1,51.84)]
nl = path([(6.2,53.42),(6.8,53.45),(6.95,53.33),(7.1,53.25),(7.2,53.25)] + GRENZE[1:] + [(6.1,53.42)], True)
EMS = [(8.6,51.85),(8.3,51.9),(7.99,51.95),(7.6,52.1),(7.38,52.28),(7.25,52.52),(7.22,52.69),(7.27,52.9),(7.33,53.08),(7.38,53.2),(7.2,53.33),(7.1,53.3)]
RHEIN = [(6.8,51.0),(6.78,51.25),(6.76,51.43),(6.6,51.66),(6.3,51.82),(6.1,51.86)]
WESER = [(9.4,51.5),(9.15,52.1),(9.0,52.4),(8.95,52.75),(8.8,53.08),(8.55,53.55)]
KANAL = [(7.47,51.51),(7.34,51.65),(7.63,51.96),(7.58,52.27),(7.44,52.30)]
BAHN = [(7.2,53.37),(7.45,53.23),(7.39,53.08),(7.29,52.69),(7.32,52.52),(7.44,52.28),(8.05,52.28),(8.6,52.2)]
STADT = [  # id, name, lon, lat, dx, dy, anchor, hot
    ("hEmden", "Emden", 7.2, 53.37, -11, 5, "end", True),
    ("hPapenburg", "Papenburg", 7.39, 53.08, 11, 2, "start", True),
    ("hMeppen", "Meppen", 7.29, 52.69, 11, 5, "start", False),
    ("hLingen", "Lingen", 7.32, 52.52, 11, 6, "start", True),
    ("hRheine", "Rheine", 7.44, 52.28, -11, 16, "end", False),
    ("hOsnabrueck", "Osnabrück", 8.05, 52.28, 0, 22, "middle", False),
    ("hMuenster", "Münster", 7.63, 51.96, 11, 5, "start", False),
    ("hDortmund", "Dortmund", 7.47, 51.51, 10, 18, "start", True),
    ("hEssen", "Essen", 7.01, 51.46, -11, 18, "end", True),
    ("hBremen", "Bremen", 8.8, 53.08, 11, 5, "start", False),
    ("hOldenburg", "Oldenburg", 8.21, 53.14, 0, -12, "middle", False),
    ("hHannover", "Hannover", 9.73, 52.37, -11, -10, "end", True),
]
staedte = ''
for sid, nm, lo, la, dx, dy, anc, ishot in STADT:
    x, y = P(lo, la)
    dot = f'<circle cx="{x}" cy="{y}" r="6.5" fill="#fff" stroke="#37546b" stroke-width="2.5"/><circle cx="{x}" cy="{y}" r="2.8" fill="#9b352d"/>'
    lab = f'<text x="{x+dx}" y="{y+dy}" text-anchor="{anc}" font-size="15" font-weight="700" fill="#14232d" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">{nm}</text>'
    if ishot:
        staedte += f'<g id="{sid}" class="hot" data-task="karte" tabindex="0" role="button" aria-label="{nm}"><circle cx="{x}" cy="{y}" r="16" fill="#fff" fill-opacity=".01"/>{dot}{lab}</g>'
    else:
        staedte += f'<g aria-hidden="true">{dot}{lab}</g>'
rx, ry = P(7.27, 53.06)
rhede = f'<path d="M{rx} {ry-7} l2 5 h5 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 h5 Z" fill="#aa6d18"/><text x="{rx-10}" y="{ry+5}" text-anchor="end" font-size="13" font-weight="700" fill="#8f5a12" paint-order="stroke" stroke="#fff" stroke-width="3">Rhede</text>'
rcx, rcy = P(7.15, 51.5)
ruhr = f'<ellipse cx="{rcx}" cy="{rcy}" rx="{round(0.48*KX)}" ry="{round(0.13*K)}" fill="#3a3a3a" fill-opacity=".18" stroke="#3a3a3a" stroke-dasharray="4 3"/>'

KARTE = f'''<div class="svgwrap"><svg class="pic" style="max-width:560px;margin:auto" viewBox="0 0 480 560" role="img" aria-label="Schematische Karte von Nordwestdeutschland um 1900 mit Ems, Rhein, Weser, Ruhrgebiet, Dortmund-Ems-Kanal, der Eisenbahn von Emden nach Rheine und Osnabrück sowie den Städten Emden, Papenburg, Meppen, Lingen, Rheine, Osnabrück, Münster, Dortmund, Essen, Bremen, Oldenburg und Hannover">
<rect width="480" height="560" fill="#dcebf3"/>
<path d="{land}" fill="#eee6cf" stroke="#9c8a63" stroke-width="2"/>
<path d="{nl}" fill="#e4e2da" stroke="none"/>
<path d="{path(GRENZE)}" fill="none" stroke="#8a8378" stroke-width="2" stroke-dasharray="7 4"/>
<path d="{path(RHEIN)}" fill="none" stroke="#6f9cb6" stroke-width="4"/>
<path d="{path(WESER)}" fill="none" stroke="#6f9cb6" stroke-width="3"/>
<path d="{path(EMS)}" fill="none" stroke="#5b93b5" stroke-width="4"/>
{ruhr}
<path d="{path(KANAL)}" fill="none" stroke="#1f6fa8" stroke-width="3.5" stroke-dasharray="8 4"/>
<path d="{path(BAHN)}" fill="none" stroke="#3a3a3a" stroke-width="5"/>
<path d="{path(BAHN)}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 6"/>
<text x="{P(7.0,51.36)[0]}" y="{P(7.0,51.36)[1]+22}" font-size="14" font-weight="800" fill="#3a3a3a" paint-order="stroke" stroke="#eee6cf" stroke-width="4">Ruhrgebiet</text>
<text x="{P(7.6,53.85)[0]}" y="{P(7.6,53.85)[1]}" font-size="17" fill="#5f88a3" font-style="italic">Nordsee</text>
<text x="10" y="{P(6.3,52.95)[1]}" font-size="14" fill="#7b7468" font-style="italic">Nieder-</text>
<text x="10" y="{P(6.3,52.95)[1]+17}" font-size="14" fill="#7b7468" font-style="italic">lande</text>
<text x="{P(7.36,52.1)[0]+10}" y="{P(7.36,52.1)[1]}" font-size="13" fill="#3b6f93" font-style="italic" paint-order="stroke" stroke="#eee6cf" stroke-width="3">Ems</text>
{staedte}
{rhede}
<g transform="translate(286 418)">
 <rect width="186" height="132" rx="10" fill="#fff" stroke="#c9d3da"/>
 <text x="10" y="21" font-size="14" font-weight="800" fill="#37546b">Legende</text>
 <path d="M10 40 H40" stroke="#3a3a3a" stroke-width="5"/><path d="M10 40 H40" stroke="#fff" stroke-width="2" stroke-dasharray="6 6"/><text x="48" y="45" font-size="13" fill="#14232d">Eisenbahn ab 1854</text>
 <path d="M10 62 H40" stroke="#1f6fa8" stroke-width="3.5" stroke-dasharray="8 4"/><text x="48" y="67" font-size="13" fill="#14232d">Kanal, 1899</text>
 <path d="M10 84 H40" stroke="#6f9cb6" stroke-width="3.5"/><text x="48" y="89" font-size="13" fill="#14232d">Fluss</text>
 <path d="M25 99 l2 5 h5 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 h5 Z" fill="#aa6d18"/><text x="48" y="111" font-size="13" fill="#14232d">deine Schule</text>
 <text x="10" y="126" font-size="11" fill="#56616a">Schematische Karte</text>
</g>
</svg></div>'''

m.section("karte", "Vom Emsland ins Ruhrgebiet", "Vom Emsland ins Ruhrgebiet: Kartenarbeit",
    '<p>Die Karte zeigt Nordwestdeutschland um 1900. Ganz oben liegt das Emsland mit Rhede, dem Ort deiner Schule. Weiter südlich liegt das Ruhrgebiet. Lies die Legende und löse fünf Suchaufträge.</p>'
    + KARTE +
    '<div class="legendlist" aria-hidden="true"><span>Karte: eigene schematische Darstellung, Grenzen und Flussläufe vereinfacht</span></div>'
    + m.hot("karte",
        [("hEssen", "Gesucht ist die Stadt im Ruhrgebiet, in der die Gussstahlfabrik der Familie Krupp stand. Sie wuchs bis 1900 auf fast 119.000 Einwohner.",
          "Richtig, Essen. Zechen und die Krupp-Werke brauchten Zehntausende Arbeitskräfte. Viele kamen aus ländlichen Gebieten."),
         ("hDortmund", "Gesucht ist die Ruhrgebietsstadt, in der der Kanal von 1899 beginnt.",
          "Richtig, Dortmund. Der Dortmund-Ems-Kanal verband das Ruhrgebiet mit der Ems und dem Seehafen Emden. So kamen Kohle und Erz auf dem Wasser billig ans Ziel."),
         ("hLingen", "Gesucht ist die Stadt an der Ems, in der ab 1855 die großen Werkstätten der Eisenbahn entstanden. Das war einer der wenigen großen Industriebetriebe im Emsland.",
          "Richtig, Lingen. In den Eisenbahnwerkstätten wurden später Lokomotiven repariert. Hunderte Menschen fanden dort Arbeit."),
         ("hPapenburg", "Gesucht ist die Werftstadt ganz in der Nähe deiner Schule. Schon 1854 fuhr von hier ein Zug nach Emden.",
          "Richtig, Papenburg. Die Strecke Emden bis Papenburg war der erste Abschnitt der Emslandbahn. Ab 1856 fuhren die Züge durchgehend über Rheine bis Löhne."),
         ("hHannover", "Gesucht ist die Hauptstadt der Provinz, zu der das Emsland damals gehörte. Sie wuchs von etwa 28.000 Einwohnern (1848) auf über 300.000 (1910).",
          "Richtig, Hannover. Bis 1866 war Hannover Hauptstadt eines Königreichs, danach einer preußischen Provinz. Auch hier entstanden große Fabriken.")],
        [(s[0], s[1]) for s in STADT if s[7]],
        "Alle fünf gefunden. Die Karte zeigt: Eisenbahn und Kanal verbanden das ländliche Emsland mit dem Industriegebiet an der Ruhr.",
        "Kartenarbeit", ["zeit_raum", "fachwissen"]))

m.section("gruende", "Gründe für den Umzug", "Weg vom Land, hin zur Stadt",
    '<p>Zwischen 1850 und 1914 verließen Millionen Menschen in Deutschland ihre Dörfer. Man spricht von <strong>Landflucht</strong> oder <strong>Binnenwanderung</strong>. Manche Gründe drückten die Menschen vom Land weg, andere zogen sie in die Städte. Ordne zu.</p>'
    + m.zuord("pushpull",
        [("weg", "Gründe, das Dorf zu verlassen"), ("hin", "Gründe, in die Industriestadt zu ziehen")],
        [("Den Hof erbt meist nur ein Kind, die Geschwister gehen leer aus", "weg"),
         ("Die Bevölkerung wächst, aber die Zahl der Höfe nicht", "weg"),
         ("Landarbeiter verdienen wenig und sind vom Gutsherrn abhängig", "weg"),
         ("Heimweber verlieren gegen billige Fabrikware ihr Einkommen", "weg"),
         ("Zechen und Fabriken suchen Tausende Arbeitskräfte", "hin"),
         ("Es gibt regelmäßig Lohn in bar", "hin"),
         ("Verwandte und Bekannte sind schon dort und helfen beim Ankommen", "hin"),
         ("Werber der Zechen versprechen Arbeit und Wohnung", "hin")],
        "Alle acht richtig. Meist kam beides zusammen: Not auf dem Land und Hoffnung auf Arbeit in der Stadt. Die Eisenbahn machte den Weg schnell und bezahlbar.",
        "Frage dich: Beschreibt die Karte ein Problem auf dem Land oder eine Chance in der Stadt?",
        "Gründe der Landflucht", ["ursachen_folgen", "perspektivitaet"], tag="Zuordnen",
        hilfe="Im Nordwesten Deutschlands galt oft das Anerbenrecht: Ein Kind bekam den ganzen Hof, damit er nicht zersplitterte.")
    + m.mc("emsland", "E1. Warum blieb das Emsland lange ländlich, während das Ruhrgebiet zum Industriegebiet wurde?",
        [("a", "Industrie war im Emsland gesetzlich verboten."),
         ("b", "Im Emsland gab es kaum Kohle und Erz und viel Moor. Viele Menschen suchten deshalb Arbeit anderswo: als Saisonarbeiter in den Niederlanden, im Ruhrgebiet oder in Amerika."),
         ("c", "Die Menschen im Emsland wollten nicht arbeiten.")],
        "b",
        {"a": "Nein, ein solches Verbot gab es nicht. Es fehlten aber die Voraussetzungen, die du aus Modul 001 kennst.",
         "b": "Richtig. Ohne Bodenschätze fehlte die Grundlage für Schwerindustrie. Schon seit dem 17. Jahrhundert gingen Menschen aus dem Emsland jeden Sommer als „Hollandgänger“ zur Arbeit in die Niederlande. Im 19. Jahrhundert zogen viele ins Ruhrgebiet oder wanderten nach Amerika aus.",
         "c": "Das ist ein Vorurteil. Die Menschen arbeiteten hart, nur gab es vor Ort wenig Industrie. Denke an die Voraussetzungen aus Modul 001."},
        "Regionaler Vergleich", ["zeit_raum", "ursachen_folgen"], tag="Regionalgeschichte"))

m.section("folgen", "Enge, Schmutz, Krankheit", "Enge, Schmutz und Krankheit",
    '<p>Die Städte wuchsen schneller, als Häuser, Wasserleitungen und Abwasserkanäle gebaut werden konnten. Die Folgen waren oft schlimm.</p>'
    + m.order("kette",
        ["Tausende Menschen ziehen in kurzer Zeit in die Stadt.",
         "Häuser werden schnell und eng gebaut. Viele Familien teilen sich eine Toilette auf dem Hof.",
         "Abwasser gelangt in Brunnen und Flüsse, aus denen Trinkwasser kommt.",
         "Krankheiten wie die Cholera breiten sich aus. 1892 starben in Hamburg etwa 8.600 Menschen.",
         "Die Städte bauen Kanalisation, Wasserwerke mit Filtern und eine Müllabfuhr."],
        "Genau. Schnelles Wachstum führte zu Enge und schmutzigem Wasser, das führte zu Seuchen. Erst danach reagierten die Städte mit Kanalisation und sauberem Trinkwasser. In Hamburg wurde nach 1892 ein Filterwerk gebaut.",
        "Frage dich: Was musste zuerst passieren, damit Wasser verschmutzt wurde? Und wann reagierten die Städte?",
        "Ursache und Folge", ["ursachen_folgen"], tag="Ursache-Folge-Kette",
        intro='<p><strong>Auftrag:</strong> Bringe die Kette in die richtige Reihenfolge, von der Ursache bis zur Reaktion der Städte.</p>')
    + m.luecke("luecke",
        ["Die erste deutsche Eisenbahn fuhr ", ("1835", ["1735", "1905"]), " zwischen Nürnberg und Fürth. Im Emsland fuhr ab 1854 ein Zug von Emden nach ",
         ("Papenburg", ["Berlin", "München"]), ". Die Eisenbahn brauchte große Mengen ", ("Kohle und Stahl", ["Holz und Stroh", "Wolle und Leinen"]),
         ". Das ließ das Ruhrgebiet weiter wachsen. Seit 1899 verbindet der ", ("Dortmund-Ems-Kanal", ["Nord-Ostsee-Kanal", "Suezkanal"]),
         " das Ruhrgebiet mit der Ems. Emden wurde dadurch ein wichtiger ", ("Seehafen", ["Flughafen", "Bahnhof"]), " für das Ruhrgebiet."],
        "Alles richtig. Eisenbahn und Kanal waren beides: Folge der Industrialisierung, weil sie Kohle und Stahl brauchten, und Ursache für weiteres Wachstum, weil sie Menschen und Waren transportierten.",
        "Tipp: Sieh dir die Karte und die Legende noch einmal an.",
        "Verkehrswege", ["fachwissen", "zeit_raum"], tag="Lückentext",
        intro='<p><strong>Eisenbahn und Kanal:</strong> Wähle in jeder Lücke das passende Wort.</p>'))

# ---------- Statistik ----------
DATA = [("Berlin", 966859, 1587794, 2071257), ("Hamburg", 264675, 323923, 931035), ("Hannover", 106677, 163593, 302375),
        ("Essen", 54790, 78706, 294653), ("Dortmund", 57742, 89663, 214226), ("Duisburg", 37380, 59285, 229438), ("Bremen", 102532, 125684, 217437)]
def f(n): return f'{n:,}'.replace(',', '.')
rows = ''.join(f'<tr><td>{c}</td><td class="n">{f(a)}</td><td class="n">{f(b)}</td><td class="n">{f(d)}</td></tr>' for c, a, b, d in DATA)
TABLE = f'<div class="tblwrap"><table class="tbl"><caption class="hint" style="caption-side:bottom;text-align:left;padding-top:6px">Einwohnerzahlen nach dem Statistischen Jahrbuch für das Deutsche Reich</caption><thead><tr><th>Stadt</th><th class="n">1875</th><th class="n">1890</th><th class="n">1910</th></tr></thead><tbody>{rows}</tbody></table></div>'
# Balkendiagramm 1875 und 1910 (ohne Berlin und Hamburg)
bars = [d for d in DATA if d[0] not in ("Berlin", "Hamburg")]
svg = '<svg class="pic" viewBox="0 0 380 330" role="img" aria-label="Balkendiagramm: Einwohner 1875 und 1910 in Hannover, Essen, Dortmund, Duisburg und Bremen" style="max-width:560px;margin:auto"><rect width="380" height="330" fill="#fbfaf6"/>'
svg += '<text x="10" y="22" font-size="15" font-weight="800" fill="#37546b">Einwohner 1875 und 1910</text>'
scale = 190 / 310000
for i, (c, a, b, d) in enumerate(bars):
    y = 40 + i * 54
    svg += f'<text x="10" y="{y+20}" font-size="15" font-weight="700" fill="#14232d">{c}</text>'
    svg += f'<rect x="100" y="{y+2}" width="{a*scale:.0f}" height="16" fill="#9fb1bf"/><text x="{100+a*scale+6:.0f}" y="{y+15}" font-size="12" fill="#14232d">{f(a)}</text>'
    svg += f'<rect x="100" y="{y+22}" width="{d*scale:.0f}" height="16" fill="#37546b"/><text x="{100+d*scale+6:.0f}" y="{y+35}" font-size="12" fill="#14232d">{f(d)}</text>'
svg += '<rect x="100" y="312" width="14" height="10" fill="#9fb1bf"/><text x="120" y="321" font-size="12" fill="#14232d">1875</text><rect x="170" y="312" width="14" height="10" fill="#37546b"/><text x="190" y="321" font-size="12" fill="#14232d">1910</text></svg>'

m.section("quelle", "Die Quelle", "Die Quelle: Eine Statistik",
    '<p>Auch Zahlen können Quellen sein. Das Statistische Amt des Deutschen Reiches zählte regelmäßig die Einwohner. Hier ist ein Auszug.</p>'
    '<div class="akte"><span class="stamp">Quelle</span><p><strong>Statistisches Jahrbuch für das Deutsche Reich, Ausgaben 1881, 1893 und 1914.</strong> Die Zahlen stammen aus Volkszählungen. Das Jahrbuch wurde vom Kaiserlichen Statistischen Amt in Berlin herausgegeben, für Behörden, Politik und Wissenschaft.</p>'
    + TABLE + '</div><div class="svgwrap">' + svg + '</div><div class="legendlist" aria-hidden="true"><span>Diagramm: eigene Darstellung nach den Zahlen der Tabelle</span></div>'
    + chronos("Zahlen wirken so sicher. Aber auch eine Statistik hat einen Verfasser, einen Zweck und Grenzen. Prüfe genau, was sie zeigt und was nicht.")
    + m.mc("s1", "S1. Welche Stadt wuchs von 1875 bis 1910 im Verhältnis am stärksten?",
        [("a", "Berlin, weil es die meisten Einwohner hatte"),
         ("b", "Hannover"),
         ("c", "Duisburg, die Einwohnerzahl stieg auf mehr als das Sechsfache")],
        "c",
        {"a": "Berlin war die größte Stadt, aber es wuchs „nur“ auf etwa das Doppelte. Teile 1910 durch 1875.",
         "b": "Hannover wuchs auf fast das Dreifache. Es gibt eine Stadt, die noch stärker wuchs. Rechne 1910 geteilt durch 1875.",
         "c": "Richtig. 229.438 geteilt durch 37.380 ergibt etwa 6,1. Die Ruhrgebietsstädte Duisburg und Essen wuchsen besonders schnell, vor allem nach 1890."},
        "Statistik auswerten", ["quellenarbeit", "fachwissen"], tag="Quellenarbeit")
    + m.mc("s2", "S2. Essen hatte 1900 etwa 119.000 Einwohner, 1910 fast 295.000. Ab 1901 wurden Nachbargemeinden eingemeindet, zum Beispiel Altendorf mit über 63.000 Einwohnern. Was bedeutet das für die Statistik?",
        [("a", "Ein Teil des Wachstums entstand dadurch, dass die Stadtgrenze verschoben wurde. Nicht alle neuen „Essener“ waren zugezogen."),
         ("b", "Die Statistik ist gefälscht und deshalb wertlos."),
         ("c", "Das spielt keine Rolle, eine Zahl ist eine Zahl.")],
        "a",
        {"a": "Richtig. Wer Zahlen vergleicht, muss prüfen, ob dasselbe gezählt wurde. Die Menschen in Altendorf lebten schon vorher dort. Trotzdem war auch Altendorf durch Zuwanderung gewachsen.",
         "b": "Nein. Die Zahlen stimmen, sie messen nur etwas anderes als gedacht. Man muss sie mit diesem Wissen lesen.",
         "c": "Doch, es spielt eine Rolle. Wenn sich die Stadtgrenze ändert, vergleicht man nicht mehr dasselbe Gebiet."},
        "Quellenkritik Statistik", ["quellenarbeit", "zeit_raum"], tag="Quellenkritik")
    + m.multi("q1", "S3. Was verrät diese Statistik nicht? Wähle alle zutreffenden aus.",
        [("wohnen", "Wie die Menschen wohnten"),
         ("warum", "Warum die Menschen in die Städte zogen"),
         ("zahl", "Wie viele Einwohner Dortmund 1890 hatte"),
         ("besser", "Ob es den Zugezogenen in der Stadt besser ging"),
         ("wachstum", "Ob Hannover zwischen 1875 und 1910 gewachsen ist")],
        ["wohnen", "warum", "besser"],
        "Genau. Eine Statistik zeigt Mengen und Entwicklungen. Über Gründe, Gefühle und Lebensverhältnisse sagt sie nichts. Dafür braucht man andere Quellen, etwa Berichte und Briefe.",
        {"zahl": "Doch, das steht in der Tabelle: 89.663 Einwohner.",
         "wachstum": "Doch, das zeigt die Tabelle: von 106.677 auf 302.375."},
        "Grenzen der Statistik", ["quellenarbeit"], tag="Was sagt die Quelle nicht?")
    + m.text("q2", "Weiterdenken. Vergleiche Hannover und Essen zwischen 1890 und 1910. Welche Stadt wuchs schneller? Nenne mögliche Gründe und beachte dabei die Eingemeindungen.",
        "Zwischen 1890 und 1910 wuchs ... schneller, weil ... Man muss aber beachten, dass ...",
        dict(min=60, worte=15, need=2, gruppen=[
            dict(w=["essen"], miss="Nenne die Stadt, die schneller wuchs."),
            dict(w=["zeche", "kohle", "krupp", "industrie", "fabrik", "eingemeind", "grenze", "altendorf"], miss="Nenne einen Grund, zum Beispiel Kohle und Industrie oder die Eingemeindungen.")],
            ok="Gut verglichen. Essen wuchs fast auf das Vierfache, Hannover nicht ganz auf das Doppelte. Zechen und Krupp zogen Arbeitskräfte an, ein Teil des Zuwachses kam aber durch Eingemeindungen."),
        "Weiterdenken Vergleich", ["quellenarbeit"], tag="Weiterdenken · Vergleich"))

mission = f'''<section class="card" id="mission">
<h2>Die Mission</h2>
<div class="akte">
 <span class="stamp">Akte 003</span>
 <p><strong>Fall:</strong> Auf einer Karteikarte steht: <em>„Die Menschen zogen in die Städte, weil das Leben dort besser war.“</em></p>
 <p><strong>Dein Auftrag:</strong> Prüfe die Gründe und die Folgen des Städtewachstums. Am Ende entscheidest du, ob die Karte stimmt.</p>
</div>
<p><strong>Zum Einstieg:</strong> Viele Familien im Emsland haben Vorfahren, die einmal fortgegangen sind: ins Ruhrgebiet, in die Niederlande oder nach Amerika. Vielleicht kennst du so eine Geschichte aus deiner eigenen Familie. Heute ist Umziehen für Arbeit normal. Im 19. Jahrhundert begann eine Wanderung, wie es sie vorher nie gegeben hatte.</p>
{chronos("Ich bin in einer kleinen Stadt geboren und in eine große gezogen. Freiwillig. Aber war das bei allen so? Ich habe da so meine Zweifel.")}
<p><strong>Leitfrage:</strong> Warum wuchsen die Städte so schnell?</p>
<div class="badges" aria-label="Deine Abzeichen">
 <span class="abz" id="abz1">Kartenleser</span>
 <span class="abz" id="abz2">Ursachenforscher</span>
 <span class="abz" id="abz3">Statistikprüfer</span>
 <span class="abz" id="abz4">Begründer</span>
</div>
</section>'''

diag = diag_section(m, [
    ("d1", "Wortbedeutung", "D1. Was bedeutet „Landflucht“?",
     [("a", "Menschen ziehen vom Land in die Städte"), ("b", "Ein Land wird von Feinden erobert"), ("c", "Bauern fliehen vor einem Unwetter")], "a"),
    ("d2", "Richtig oder falsch", "D2. Um 1800 lebte die große Mehrheit der Menschen in Deutschland auf dem Land.",
     [("r", "Das stimmt"), ("f", "Das stimmt nicht")], "r"),
    ("d3", "Vermutung", "D3. Welches Verkehrsmittel veränderte im 19. Jahrhundert den Transport von Menschen und Waren am stärksten?",
     [("a", "Das Auto"), ("b", "Die Eisenbahn"), ("c", "Das Flugzeug")], "b")],
    dict(alle="Drei von drei. Deine Vermutungen passen gut. Der Lernweg Weiterdenken könnte für dich spannend sein.",
         fast="Zwei von drei. Gute Grundlage. Im Modul erfährst du mehr.",
         wenig="Du hast # von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da.",
         extra=[dict(n="d3", v="a", m="Ein Hinweis vorab: Autos gab es erst ganz am Ende des 19. Jahrhunderts, und kaum jemand besaß eines.")]))

gloss = glossar_section([
    ("Urbanisierung", "Verstädterung: Immer mehr Menschen leben in Städten, und die Städte werden größer."),
    ("Landflucht", "Die Abwanderung vieler Menschen vom Land in die Städte und Industriegebiete."),
    ("Binnenwanderung", "Umzug innerhalb eines Landes, zum Beispiel aus Ostpreußen oder dem Emsland ins Ruhrgebiet."),
    ("Ruhrgebiet", "Industriegebiet an Ruhr und Emscher mit Städten wie Essen, Dortmund und Duisburg. Grundlage waren Steinkohle und Stahlindustrie."),
    ("Zeche", "Ein Bergwerk, in dem Kohle abgebaut wird."),
    ("Hollandgänger", "Menschen aus dem Emsland und Westfalen, die jedes Jahr für einige Monate in den Niederlanden arbeiteten, etwa beim Torfstechen oder bei der Heuernte."),
    ("Eingemeindung", "Ein Nachbarort wird Teil einer Stadt. Die Einwohnerzahl der Stadt steigt dadurch, ohne dass jemand umzieht."),
    ("Kanalisation", "Unterirdische Kanäle, die Abwasser aus der Stadt leiten."),
    ("Cholera", "Eine gefährliche Durchfallkrankheit, die vor allem durch verschmutztes Trinkwasser übertragen wird."),
    ("Statistik", "Eine Sammlung von Zahlen über viele Fälle, zum Beispiel Einwohnerzahlen. Sie zeigt Entwicklungen, aber keine Einzelschicksale.")],
    ["Statistisches Jahrbuch für das Deutsche Reich 1881, 1893 und 1914, nach dem Abdruck bei German History in Documents and Images (GHDI), „Das Wachstum großer Städte (1875 bis 1910)“.",
     "Einwohnerzahlen Essen 1849 (8.813) und 1900 (118.862) sowie Hannover 1848 (28.233): Volkszählungsergebnisse nach den Übersichten zur Einwohnerentwicklung der Städte. Eingemeindung Altendorf 1901 mit 63.238 Einwohnern (Stand 1900).",
     "Emslandbahn: Abschnitt Emden bis Papenburg eröffnet am 24. November 1854, durchgehender Verkehr ab 1856. Eisenbahnwerkstätten Lingen ab 1855. Dortmund-Ems-Kanal eröffnet am 11. August 1899.",
     "Cholera in Hamburg 1892: etwa 8.600 Tote, danach Bau eines Filterwerks für Trinkwasser.",
     "Karte und Diagramm sind eigene Darstellungen."])

lc = lerncheck_section(["Ich kann Gründe nennen, warum Menschen vom Land in die Städte zogen.",
                        "Ich kann Folgen des schnellen Städtewachstums erklären.",
                        "Ich kann eine Statistik als Quelle auswerten und ihre Grenzen nennen."])

absch = abschluss_section(m, "Abschlussmission: die Karteikarte",
    '<p>Auf der Karteikarte steht: <em>„Die Menschen zogen in die Städte, weil das Leben dort besser war.“</em></p>',
    "Wie entscheidest du?",
    [("a", "Die Karte stimmt so. In der Stadt war das Leben einfach besser."),
     ("b", "Die Karte ist zu einfach. Viele zogen aus Not vom Land weg und hofften auf Arbeit. In der Stadt warteten aber oft enge Wohnungen und Krankheiten."),
     ("c", "Die Menschen wurden vom Staat gezwungen, in die Städte zu ziehen."),
     ("d", "Für manche wurde das Leben besser, für andere nicht. Entscheidend waren Arbeit und Lohn, nicht ein besseres Leben an sich.")],
    ["b", "d"],
    {"a": "Prüfe das noch einmal. Denke an die Cholera, an enge Wohnungen und an die Gründe, die Menschen vom Land wegdrückten.",
     "b": "Gut entschieden. Du unterscheidest zwischen Hoffnung und Wirklichkeit. Begründe das jetzt in A2.",
     "c": "Nein. Niemand wurde gezwungen. Die meisten gingen wegen Not auf dem Land und Arbeit in der Stadt.",
     "d": "Gut entschieden. Du zeigst, dass die Erfahrungen verschieden waren. Begründe das jetzt in A2."},
    "Schreibe Chronos eine Nachricht. Erkläre in drei bis fünf Sätzen, warum die Städte so schnell wuchsen. Nenne Gründe auf dem Land, Gründe in der Stadt und mindestens eine Folge.",
    "Lieber Chronos, die Menschen zogen in die Städte, weil ...",
    "„Auf dem Land gab es zu wenig Arbeit, deshalb ...“ · „In der Stadt suchten Zechen und Fabriken ...“ · „Eine Folge war, dass ...“",
    dict(min=80, worte=20, need=3, saetze=3, gruppen=[
        dict(w=["land", "dorf", "hof", "erb", "arm", "not", "bevolker", "landarbeit"], miss="Nenne einen Grund auf dem Land, zum Beispiel zu wenig Höfe oder Armut."),
        dict(w=["arbeit", "lohn", "fabrik", "zeche", "industrie", "krupp"], miss="Nenne einen Grund in der Stadt, zum Beispiel Arbeit in Zechen und Fabriken."),
        dict(w=["eng", "wohn", "krank", "cholera", "wasser", "hygien", "kanalis", "schmutz", "seuche"], miss="Nenne eine Folge, zum Beispiel enge Wohnungen oder Krankheiten.")],
        ok="Sehr gut. Du verbindest Gründe auf dem Land, Chancen in der Stadt und die Folgen. Genau das ist der Kern: Not und Hoffnung trieben die Menschen in die Städte, doch dort warteten oft Enge und Krankheit. Abzeichen Begründer freigeschaltet."))

build(m, "Ermittlung starten",
      ["Du findest wichtige Orte im Nordwesten Deutschlands auf einer Karte.",
       "Du erklärst, warum Menschen vom Land in die Städte zogen.",
       "Du vergleichst das ländliche Emsland mit dem Ruhrgebiet.",
       "Du erklärst Folgen des Städtewachstums, zum Beispiel Krankheiten.",
       "Du wertest eine Statistik als Quelle kritisch aus."],
      mission, diag, gloss, lc, absch,
      "Alles bereit. Chronos wartet schon. Es geht weiter mit der Mission.")
