"""Kompletter Durchlauf eines Moduls: python3 run.py NNN [breite]"""
import sys, json
from playwright.sync_api import sync_playwright
nr = sys.argv[1]; vw = int(sys.argv[2]) if len(sys.argv) > 2 else 1280
URL = f'http://localhost:8842/geschichte/klasse-8/{nr}/'
OUT = '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/gesch/w_8842/j8/shots/'
import os; os.makedirs(OUT, exist_ok=True)
A2 = {
 '008': 'Für die Nationalbewegung bedeutete Nation mehr als ein Gefühl. Sie forderte Einheit, weil es nach dem Wiener Kongress nur den Deutschen Bund mit fast 40 Staaten gab. Außerdem wollte sie Freiheit, zum Beispiel eine Verfassung und Pressefreiheit. Ein Beleg dafür ist das Hambacher Fest 1832 mit Schwarz-Rot-Gold. Deshalb hatten die Fürsten Angst und setzten Zensur ein.',
 '009': 'Die Revolution scheiterte aus mehreren Gründen. Die Nationalversammlung in der Paulskirche beschloss zwar Grundrechte und eine Verfassung, aber sie hatte kein eigenes Heer. Deshalb blieb die Macht bei den Fürsten. Außerdem lehnte Friedrich Wilhelm IV. die Kaiserkrone ab, weil er König von Gottes Gnaden sein wollte. Danach schlug das Militär die letzten Aufstände nieder, das war die Gegenrevolution. Trotzdem wirkten die Grundrechte später weiter.',
 '010': 'Das Kaiserreich entstand 1871 von oben. Bismarck führte drei Einigungskriege, 1864 gegen Dänemark, 1866 gegen Österreich und 1870/71 gegen Frankreich. Danach riefen die Fürsten und Offiziere im Spiegelsaal von Versailles Wilhelm I. zum Kaiser aus, das Volk und das Parlament waren nicht dabei. Deshalb war die Einheit erreicht, aber die Freiheit blieb zurück. Das Gemälde von Anton von Werner zeigt vor allem Militär.',
 '011': 'Das Kaiserreich war nur teilweise demokratisch. Der Reichstag wurde nach dem allgemeinen Männerwahlrecht gewählt und durfte Gesetze und den Haushalt beschließen. Aber der Kaiser ernannte den Reichskanzler, deshalb konnte das Parlament die Regierung nicht absetzen. Außerdem galt in Preußen das Dreiklassenwahlrecht, und Frauen durften nicht wählen. Mit dem Kulturkampf und dem Sozialistengesetz wurden Katholiken und Sozialdemokraten unterdrückt.',
 '012': 'Die Gesellschaft veränderte sich stark, weil Technik und Industrie den Alltag prägten. Elektrisches Licht, Eisenbahn und Fahrrad machten das Leben schneller. Gleichzeitig war der Militarismus sehr stark, das zeigt der Hauptmann von Köpenick 1906 mit seiner Uniform. Die Frauenbewegung forderte Bildung und Wahlrecht, aber Frauen blieben benachteiligt. Deshalb hatte nicht jeder die gleichen Chancen, und viele wanderten nach Amerika aus.',
 '013': 'Die Einheit wurde 1871 erreicht, aber vor allem von oben durch Bismarck und die Fürsten. Die Freiheit kam nur teilweise, weil die Revolution 1848/49 gescheitert war. Zwar gab es im Kaiserreich einen Reichstag mit allgemeinem Männerwahlrecht, aber der Kaiser ernannte den Reichskanzler. Außerdem durften Frauen nicht wählen und in Preußen galt das Dreiklassenwahlrecht. Deshalb blieb die politische Teilhabe begrenzt.',
}
FREI = 'Das ist so, weil die erste Strophe in der NS-Zeit als Herrschaft und Eroberung missbraucht wurde. Die dritte Strophe nennt Einigkeit, Recht und Freiheit, deshalb passt sie zur Demokratie. ' \
       'Außerdem gilt: Die Fürsten und der König hatten das Militär und das Heer, deshalb setzten sie sich gegen das Parlament durch, aber die Grundrechte wirken bis heute im Grundgesetz. ' \
       'Das Bild ist eine Darstellung aus Sicht des Auftraggebers, der Maler zeigt Bismarck in weißer Uniform, aber in Wirklichkeit trug er eine blaue. ' \
       'Heute dürfen alle wählen, Frauen und Männer gleich, damals nur Männer ab 25, deshalb war die Teilhabe ungleich. ' \
       'Gemeinsam ist Auswanderung wegen Armut und Arbeit, unterschiedlich ist die Sprache und die Heimat, weil Menschen damals in die USA nach Amerika gingen. ' \
       'Einheit kam 1871 von oben durch Bismarck und Krieg, Freiheit durch Grundrechte kam erst später mit der Demokratie und dem Grundgesetz.'
errs = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': vw, 'height': 900})
    pg.on('pageerror', lambda e: errs.append('JS: ' + str(e)[:200]))
    pg.on('console', lambda m: errs.append('Konsole: ' + m.text[:200]) if m.type == 'error' else None)
    pg.on('dialog', lambda d: d.accept())
    pg.goto(URL); pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(300)
    pg.fill('#name', 'Test Person'); pg.fill('#klasse', 'R8b'); pg.fill('#email', 'test@schule.de')
    pg.click('[data-lwbtn="weiter"]'); pg.click('#startBtn')
    assert 'Mission' in pg.inner_text('#startFb'), pg.inner_text('#startFb')
    M = pg.evaluate('M')
    for i, q in enumerate(M['diag']):
        pg.check(f'input[name="d{i+1}"][value="{q["ok"]}"]')
    pg.fill('#dText', 'Ich denke an Fahnen und Fußball.')
    pg.click('#dCheck')
    for t in M['tasks']:
        el = f'#t-{t["id"]}'; ty = t['type']
        if ty == 'mc':
            v = [o for o in t['opts'] if o.get('ok')][0]['v']
            pg.check(f'input[name="{t["id"]}"][value="{v}"]'); pg.click(f'{el} [data-act=check]')
        elif ty == 'multi':
            for o in t['opts']:
                if o.get('ok'): pg.check(f'input[name="{t["id"]}"][value="{o["v"]}"]')
            pg.click(f'{el} [data-act=check]')
        elif ty == 'zuord':
            for c in t['cards']:
                pg.click(f'{el} .pool .piece[data-k="{c["id"]}"]')
                pg.click(f'{el} .zone[data-zone="{c["z"]}"] h4')
            pg.click(f'{el} [data-act=check]')
        elif ty == 'order':
            for _ in range(60):
                a = pg.evaluate(f'S.ord["{t["id"]}"]')
                if a == sorted(a): break
                pos = next(i for i in range(len(a) - 1) if a[i] > a[i + 1])
                pg.click(f'{el} button[data-mv="{pos}"][data-dir="1"]')
            pg.click(f'{el} [data-act=check]')
        elif ty == 'hot':
            for z in t['targets']:
                pg.locator('#' + z['id']).click()
        elif ty == 'sel':
            gaps = t['gaps'] if t.get('text') else t['rows']
            for i, g in enumerate(gaps):
                pg.select_option(f'#{t["id"]}-{i}', label=g['ok'])
            pg.click(f'{el} [data-act=check]')
        elif ty == 'frei':
            pg.fill(f'#{t["id"]}Text', FREI); pg.click(f'{el} [data-act=check]')
            cls = pg.get_attribute(f'#fb-{t["id"]}', 'class')
            if 'ok' not in cls: errs.append(f'Freitext {t["id"]} nicht ok: ' + pg.inner_text(f'#fb-{t["id"]}')[:200])
            continue
        cls = pg.get_attribute(f'#fb-{t["id"]}', 'class')
        if 'ok' not in cls: errs.append(f'Aufgabe {t["id"]} nicht gelöst: ' + pg.inner_text(f'#fb-{t["id"]}')[:200])
    for i in range(len(M['lc'])):
        pg.check(f'input[name="lc{i+1}"][value="Sicher"]')
    v = [o for o in M['a1'] if o['ok']][0]['v']
    pg.check(f'input[name="a1"][value="{v}"]')
    pg.fill('#a2', A2[nr]); pg.click('#a2Check')
    if 'ok' not in pg.get_attribute('#a2Fb', 'class'): errs.append('A2: ' + pg.inner_text('#a2Fb')[:400])
    pg.click('#buildBtn'); pg.wait_for_timeout(200)
    pg.click('#sendBtn'); pg.wait_for_timeout(300)
    sf = pg.inner_text('#sendFb')
    if 'Vorschau-Modus' not in sf: errs.append('Senden: ' + sf)
    pt = pg.inner_text('#ptext'); pl = pg.evaluate('payload()')
    print('Fortschritt:', pt, '| Punkte', pl['punkte'], '/', pl['max_punkte'], '| klasse', pl['klasse'], '| lücken', pl['auffaelligkeiten'])
    print('Kompetenzen', pl['kompetenzen'])
    a, bb = pt.split(' von ')
    if a.strip() != bb.split()[0]: errs.append('Fortschritt nicht voll: ' + pt)
    if pl['punkte'] != pl['max_punkte']: errs.append('Punkte nicht voll')
    pg.screenshot(path=f'{OUT}{nr}_{vw}_fertig.png', full_page=True)
    pg.reload(); pg.wait_for_timeout(500)
    pt2 = pg.inner_text('#ptext'); pl2 = pg.evaluate('payload()')
    if pt2 != pt or pl2['punkte'] != pl['punkte']: errs.append(f'Neuladen: {pt2} {pl2["punkte"]}')
    print('Nach Neuladen:', pt2, pl2['punkte'])
    b.close()
print('DURCHLAUF', nr, vw, 'OK' if not errs else 'PROBLEME')
for e in errs: print(' -', e)
