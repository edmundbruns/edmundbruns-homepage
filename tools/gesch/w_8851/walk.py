# Kompletter Durchlauf eines Moduls: python3 walk.py NNN
import sys, json
from playwright.sync_api import sync_playwright
mid = sys.argv[1]
URL = f'http://localhost:8851/geschichte/klasse-5/{mid}/'
OUT = '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/gen/gesch/w_8851/'
TEXTE = json.load(open(OUT + 'texte.json', encoding='utf8'))[mid]

def run(vw):
    errs = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': vw, 'height': 900})
        pg.on('pageerror', lambda e: errs.append('JS: ' + str(e)[:200]))
        pg.on('console', lambda m: errs.append('Konsole: ' + m.text[:200]) if m.type == 'error' else None)
        pg.on('dialog', lambda d: d.accept())
        pg.goto(URL); pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(300)
        pg.fill('#name', 'Test Person'); pg.fill('#klasse', 'R5b'); pg.fill('#email', 'test@schule.de')
        pg.click('[data-lwbtn="weiter"]'); pg.click('#startBtn'); pg.wait_for_timeout(150)
        diag = pg.evaluate('DIAG')
        for f in diag['fragen']:
            pg.check(f'input[name="{f["n"]}"][value="{f["r"]}"]')
        pg.click('#dCheck')
        tasks = pg.evaluate('TASKS')
        for t in tasks:
            tid = t['id']; typ = t['typ']
            if typ == 'mc':
                pg.check(f'input[name="{tid}"][value="{t["richtig"]}"]'); pg.click(f'#{tid}Check')
            elif typ == 'multi':
                for v in t['richtig']:
                    pg.check(f'input[name="{tid}"][value="{v}"]')
                pg.click(f'#{tid}Check')
            elif typ == 'zuord':
                # erst eine Karte absichtlich falsch, dann korrigieren (Umlegen testen)
                p0 = t['pieces'][0]; falsch = [z for z in t['zones'] if z != p0['z']][0]
                pg.click(f'.piece[data-k="{p0["k"]}"]'); pg.click(f'.zone[data-task="{tid}"][data-zone="{falsch}"]')
                for pc in t['pieces']:
                    pg.click(f'.piece[data-k="{pc["k"]}"]'); pg.click(f'.zone[data-task="{tid}"][data-zone="{pc["z"]}"] h4')
                pg.click(f'#{tid}Check')
            elif typ == 'order':
                for _ in range(40):
                    o = pg.evaluate(f'S.order["{tid}"]')
                    if o == sorted(o): break
                    pos = next(i for i, v in enumerate(o) if v != i)
                    cur = o.index(pos)
                    pg.click(f'#{tid}List button[data-mv="{cur}"][data-dir="-1"]')
                pg.click(f'#{tid}Check')
            elif typ == 'hot':
                for i, f in enumerate(t['finds']):
                    if i == 0:
                        pg.click(f'#{f["z"]} > :first-child')
                    else:
                        pg.click(f'#{tid}Alt [data-hot="{f["z"]}"]')
            elif typ == 'luecke':
                for i, w in enumerate(t['richtig']):
                    pg.select_option(f'#{tid}_{i}', value=w)
                pg.click(f'#{tid}Check')
            elif typ == 'text':
                pg.fill(f'#{tid}', TEXTE[tid]); pg.click(f'#{tid}Check')
            fbcls = pg.get_attribute(f'#{tid}Fb', 'class')
            if 'ok' not in (fbcls or ''):
                errs.append(f'Aufgabe {tid} nicht als richtig gewertet: ' + pg.inner_text(f'#{tid}Fb')[:160])
        for i in (1, 2, 3):
            pg.check(f'input[name="lc{i}"][value="Sicher"]')
        pg.fill('#rCan', 'Viel gelernt.')
        ab = pg.evaluate('ABS')
        pg.check(f'input[name="a1"][value="{ab["ok"][0]}"]'); pg.click('#a1Check')
        pg.fill('#a2', TEXTE['a2']); pg.click('#a2Check')
        if 'ok' not in pg.get_attribute('#a2Fb', 'class'):
            errs.append('A2 nicht vollständig: ' + pg.inner_text('#a2Fb')[:200])
        pg.click('#buildBtn'); pg.wait_for_timeout(200)
        pg.click('#sendBtn'); pg.wait_for_timeout(300)
        st = pg.inner_text('#sendFb')
        if 'Vorschau-Modus' not in st: errs.append('Senden: ' + st[:100])
        pt = pg.inner_text('#ptext')
        a, _, bb = pt.split()[:3]
        if a != pt.split()[2]: errs.append('Fortschritt nicht voll: ' + pt)
        pl = pg.evaluate('payload()')
        if pl['prozent'] != 100: errs.append(f"Punkte {pl['punkte']}/{pl['max_punkte']}")
        if any(v != 1 for v in pl['kompetenzen'].values()): errs.append('Kompetenzen: ' + json.dumps(pl['kompetenzen']))
        ring = pg.inner_text('#ringTxt')
        pg.screenshot(path=f'{OUT}walk_{mid}_{vw}.png', full_page=True)
        # Neuladen
        pg.reload(); pg.wait_for_timeout(500)
        pt2 = pg.inner_text('#ptext')
        if pt2 != pt: errs.append(f'Nach Neuladen Fortschritt {pt2} statt {pt}')
        if not pg.is_visible('#resultPanel'): errs.append('Ergebnis nach Neuladen nicht sichtbar')
        if pg.input_value('#a2') != TEXTE['a2']: errs.append('Freitext nach Neuladen weg')
        sw = pg.evaluate('document.documentElement.scrollWidth > innerWidth + 2')
        if sw: errs.append('Querscroll')
        b.close()
    print(f'[{vw}] {pt} | Ring {ring} |', 'OK' if not errs else 'PROBLEME')
    for e in dict.fromkeys(errs): print('  -', e)

for vw in (1280, 390):
    run(vw)
