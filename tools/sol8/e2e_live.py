"""Durchlauf eines Moduls im Browser: python3 e2e.py 001 [port] [way]"""
import sys, json
from playwright.sync_api import sync_playwright
mid = sys.argv[1]; port = sys.argv[2] if len(sys.argv) > 2 else '8775'; way = sys.argv[3] if len(sys.argv) > 3 else 'S'
import os as _os
JG = _os.environ.get('JG', '8')
URL = f'https://www.edmundbruns.com/mathe/klasse-{JG}/{mid}/'
SHOT = '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/shots8/'
import os; os.makedirs(SHOT, exist_ok=True)

ANSWER_JS = '''(t)=>t.inputs.map(inp=>{
  if(inp.kind==='frac') return M.fstr(inp.answer);
  if(inp.kind==='num') return String(inp.answer).replace('.',',');
  if(inp.kind==='term') return inp.answer;
  if(inp.kind==='mc') return String(inp.answer);
  return [].concat(inp.answer)[0];})'''

def fill(pg, prefix, task, root):
    vals = pg.evaluate(ANSWER_JS, task)
    for i, (inp, v) in enumerate(zip(task['inputs'], vals)):
        if inp['kind'] == 'mc':
            pg.locator(f'{root} input[name="{prefix}-{i}"][value="{v}"]').evaluate('e=>e.click()')
        else:
            pg.fill(f'{root} #{prefix}-{i}', v)

with sync_playwright() as p:
    b = p.chromium.launch()
    for vw in ((1280, 900), (390, 844)):
        ctx = b.new_context(viewport={'width': vw[0], 'height': vw[1]})
        pg = ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.on('dialog', lambda d: d.accept())
        pg.goto(URL); pg.wait_for_timeout(300)
        tag = f'{mid}_{vw[0]}'
        pg.screenshot(path=SHOT + tag + '_start.png')
        # Validierung
        pg.fill('#lerncode', 'M'); pg.click('#startBtn'); bad1 = pg.inner_text('#startFb')
        pg.fill('#lerncode', 'xx'); pg.fill('#klasse', f'Klasse {int(JG)-1}b' if JG != '7' else 'Klasse 8b'); pg.click('#startBtn'); bad2 = pg.inner_text('#startFb')
        pg.fill('#klasse', f'Klasse {JG} b'); pg.fill('#email', 'mia.schulte@test'); pg.click('#startBtn'); bad3 = pg.inner_text('#startFb')
        pg.fill('#email', 'test.claude@example.com')
        pg.locator(f'input[name=way][value={way}]').check(force=True)
        pg.click('#startBtn'); pg.wait_for_timeout(200)
        st = pg.evaluate('SOL8.state()')
        assert st['lerncode'] == 'XX' and st['klasse'] == f'{JG}b', st
        assert pg.is_visible('#sec-einstieg'), 'Start führt nicht zum Einstieg'
        pg.screenshot(path=SHOT + tag + '_einstieg.png')
        # Diagnose
        pg.click('#nav a[data-sec=diagnose]')
        n = pg.evaluate('MODULE.diagnose.length')
        for i in range(n):
            ans = pg.evaluate(f'MODULE.diagnose[{i}].answer')
            pg.locator(f'input[name=dg{i}][value="{ans}"]').check(force=True)
        pg.click('#dgBtn')
        # Erklärung
        pg.click('#nav a[data-sec=erklaerung]'); pg.click('#exOk'); pg.screenshot(path=SHOT + tag + '_erklaerung.png', full_page=False)
        # Entdecken: alle Bedienelemente zweimal verändern
        pg.click('#nav a[data-sec=entdecken]')
        pg.evaluate('''()=>{const r=document.querySelector('#explore');
          r.querySelectorAll('select').forEach(s=>{for(let k=0;k<2;k++){s.selectedIndex=(s.selectedIndex+1)%s.options.length;s.dispatchEvent(new Event('change',{bubbles:true}));}});
          r.querySelectorAll('input[type=range]').forEach(s=>{for(let k=0;k<3;k++){s.value=String(+s.value+ +(s.step||1));s.dispatchEvent(new Event('input',{bubbles:true}));}});
          r.querySelectorAll('button').forEach(x=>{x.click();x.click();});}''')
        pg.wait_for_timeout(200); pg.screenshot(path=SHOT + tag + '_entdecken.png')
        # Beispiel
        pg.click('#nav a[data-sec=beispiel]')
        for _ in range(8):
            if pg.is_enabled('#bsNext'): pg.click('#bsNext')
        # Üben: erst falsch, dann Tipp, dann richtig
        pg.click('#nav a[data-sec=ueben]'); pg.wait_for_timeout(200)
        slots = pg.evaluate('SOL8.state().slots.length')
        for i in range(slots):
            task = pg.evaluate(f'SOL8.state().slots[{i}].task')
            if i == 0:
                if task['inputs'][0]['kind'] != 'mc':
                    pg.fill(f'#slot{i} #s{i}-0', '99999')
                    pg.click(f'#slot{i} button[data-a=check]')
                pg.click(f'#slot{i} button[data-a=hint]')
            fill(pg, f's{i}', task, f'#slot{i}')
            pg.click(f'#slot{i} button[data-a=check]')
            fbt = pg.inner_text(f'#slot{i} .fb')
            assert 'Richtig' in fbt, (i, task['key'], fbt)
        pg.screenshot(path=SHOT + tag + '_ueben.png')
        # Weiterdenken
        pg.click('#nav a[data-sec=weiterdenken]'); pg.wait_for_timeout(100)
        task = pg.evaluate('SOL8.state().extra.task'); fill(pg, 'sx', task, '#slotx'); pg.click('#slotx button[data-a=check]')
        assert 'Richtig' in pg.inner_text('#slotx .fb')
        # Test: alle richtig bis auf die letzte
        pg.click('#nav a[data-sec=test]'); pg.wait_for_timeout(100)
        items = pg.evaluate('SOL8.state().test.items')
        for i, t in enumerate(items):
            if i < len(items) - 1: fill(pg, f't{i}', t, f'#ti{i}')
            elif t['inputs'][0]['kind'] != 'mc':
                for k in range(len(t['inputs'])): pg.fill(f'#ti{i} #t{i}-{k}', '12345')
            else:
                pg.locator(f'#ti{i} input[name="t{i}-0"][value="{(t["inputs"][0]["answer"]+1)%len(t["inputs"][0]["options"])}"]').check(force=True)
        pg.click('#tBtn'); tsum = pg.inner_text('#tSum')
        # Lerncheck
        pg.click('#nav a[data-sec=lerncheck]')
        for i in range(pg.evaluate('MODULE.lerncheck.length')): pg.locator(f'input[name=lc{i}][value="1"]').check(force=True)
        pg.click('#nav a[data-sec=ergebnis]'); sendfb = ''
        if vw[0] == 1280:
            pg.click('#sendBtn'); pg.wait_for_timeout(25000); sendfb = pg.inner_text('#sendFb')
        pg.screenshot(path=SHOT + tag + '_ergebnis.png')
        payload = pg.evaluate('SOL8.payload()')
        sw = pg.evaluate('document.documentElement.scrollWidth') > vw[0] + 1
        print(f'[{vw[0]}] Validierung: {bad1[:40]!r} | {bad2[:40]!r} | {bad3[:40]!r}')
        print(f'[{vw[0]}] Test: {tsum[:60]} | Senden: {sendfb[:50]} | Fortschritt: {pg.inner_text("#progText")} | Querscroll: {sw} | Fehler: {errs[:3]}')
        if vw[0] == 1280: print(json.dumps({k: payload[k] for k in ('lerncode','klasse','email','lernweg','bearbeitungsstand','test_punkte','test_max','uebungen_geloest','tipps_genutzt','weiterdenken_geloest')}, ensure_ascii=False))
        ctx.close()
    b.close()
