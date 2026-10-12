"""Kompletter Durchlauf eines J8-Moduls: python3 run.py NNN [lernweg]"""
import sys, json
from playwright.sync_api import sync_playwright
N = sys.argv[1]; LW = sys.argv[2] if len(sys.argv) > 2 else 'weiter'
URL = f'http://localhost:8843/geschichte/klasse-8/{N}/'
SHOT = f'/tmp/claude-0/-home-claude/69a08ffa-3513-56f3-855c-86cc8c62b736/scratchpad/shots/'
import os; os.makedirs(SHOT, exist_ok=True)
fehler = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for vw in (390, 1280):
        pg = b.new_page(viewport={'width': vw, 'height': 900})
        errs = []
        pg.on('pageerror', lambda e: errs.append('JS: ' + str(e)[:200]))
        pg.on('console', lambda m: errs.append('Konsole: ' + m.text[:200]) if m.type == 'error' else None)
        pg.on('dialog', lambda d: d.accept())
        pg.goto(URL); pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(300)
        pg.fill('#name', 'Testperson'); pg.fill('#klasse', 'R8c'); pg.fill('#email', 'test@schule.de')
        pg.click(f'[data-lwbtn="{LW}"]')
        pg.click('#startBtn')
        for i in (1, 2, 3):
            pg.check(f'input[name="d{i}"] >> nth=0')
        pg.click('#dCheck')
        cfg = pg.evaluate('CFG')
        for t in cfg['tasks']:
            tid, ty = t['id'], t['type']
            if t.get('lw') == 'weiter' and LW != 'weiter':
                continue
            if ty == 'single':
                pg.check(f'input[name="{tid}"][value="{t["right"]}"]'); pg.click(f'[data-check="{tid}"]')
            elif ty == 'multi':
                for v in t['right']:
                    pg.check(f'input[name="{tid}"][value="{v}"]')
                pg.click(f'[data-check="{tid}"]')
            elif ty == 'zuord':
                for k, c in enumerate(t['cards']):
                    pg.click(f'#pc-{tid} .piece[data-k="{k}"]')
                    pg.click(f'.zone[data-task="{tid}"][data-zone="{c[1]}"]')
                pg.click(f'[data-check="{tid}"]')
            elif ty in ('order', 'rank'):
                if ty == 'order':
                    for _ in range(30):
                        o = pg.evaluate(f'S.t["{tid}"].ord')
                        if o == sorted(o): break
                        pos = next(i for i, v in enumerate(o) if v != i)
                        cur = o.index(pos)
                        pg.click(f'#or-{tid} button[data-mv="{cur}"][data-dir="-1"]')
                else:
                    pg.fill(f'#rk-{tid}', 'Ich habe diese Reihenfolge gewählt, weil der erste Grund am wichtigsten war und die anderen daraus folgten.')
                pg.click(f'[data-check="{tid}"]')
            elif ty == 'hot':
                for z in t['seq']:
                    if vw == 1280:
                        loc = pg.locator(f'.hot[data-task="{tid}"][data-hot="{z[0]}"] :is(path,circle)').last
                        loc.scroll_into_view_if_needed(); pg.wait_for_timeout(600)
                        bb = loc.bounding_box()
                        pg.mouse.click(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2)
                    else:
                        pg.click(f'#ha-{tid} .chip[data-hw="{z[0]}"]')
            elif ty in ('gap', 'match'):
                for k, r in enumerate(t['right']):
                    pg.select_option(f'#sel-{tid}-{k}', r)
                pg.click(f'[data-check="{tid}"]')
            elif ty == 'text':
                txt = 'Ich denke, dass ' + ' und '.join(g['kw'][0] for g in t['need']) + ' wichtig sind, weil man daran sieht, wie es damals war. Deshalb ist das bedeutsam.'
                pg.fill(f'#tx-{tid}', txt); pg.click(f'[data-check="{tid}"]')
            pg.wait_for_timeout(80)
            st = pg.evaluate(f'!!S.done["{tid}"]')
            if t.get('score', True) and not st:
                fehler.append(f'[{vw}] Aufgabe {tid} ({ty}) nicht gelöst: ' + pg.inner_text(f'#fb-{tid}')[:150])
        for i in (1, 2, 3):
            pg.check(f'input[name="lc{i}"][value="Sicher"]')
        pg.check(f'input[name="a1"][value="{cfg["a1right"][0]}"]')
        a2 = 'Lieber Chronos, ' + '. Außerdem '.join(g['kw'][0] for g in cfg['a2']['gruppen']) + ' spielten eine Rolle, weil das damals sehr wichtig war. Deshalb muss die Karte geändert werden.'
        pg.fill('#a2', a2); pg.click('#a2Check')
        if not pg.evaluate('(S.punkte.a2||0)>=1'):
            fehler.append(f'[{vw}] a2 nicht voll: ' + pg.inner_text('#a2Fb')[:200])
        pg.fill('#rCan', 'Gründe'); pg.click('#buildBtn'); pg.wait_for_timeout(200)
        pg.click('#sendBtn'); pg.wait_for_timeout(200)
        sf = pg.inner_text('#sendFb')
        if 'Vorschau-Modus' not in sf: fehler.append(f'[{vw}] Senden: ' + sf[:100])
        pt = pg.inner_text('#ptext'); ring = pg.inner_text('#ringTxt')
        pl = pg.evaluate('payload()')
        if pl['bearbeitungsstand'] != 100: fehler.append(f'[{vw}] Fortschritt {pt}')
        if pl['punkte'] != pl['max_punkte']: fehler.append(f'[{vw}] Punkte {pl["punkte"]}/{pl["max_punkte"]}')
        print(vw, pt, ring, pl['klasse'], pl['jahrgang'], pl['modul_id'], json.dumps(pl['kompetenzen']), pl['lernweg'])
        pg.screenshot(path=f'{SHOT}{N}_{vw}_done.png', full_page=True)
        pg.reload(); pg.wait_for_timeout(400)
        pt2 = pg.inner_text('#ptext')
        if pt2 != pt: fehler.append(f'[{vw}] Neuladen: {pt2} statt {pt}')
        sw = pg.evaluate('document.documentElement.scrollWidth > innerWidth + 2')
        if sw: fehler.append(f'[{vw}] Querscroll')
        fehler += [f'[{vw}] ' + e for e in errs]
        pg.close()
    b.close()
print('DURCHLAUF', N, 'OK' if not fehler else 'PROBLEME')
for f in fehler: print(' -', f)
