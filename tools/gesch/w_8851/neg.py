import sys
from playwright.sync_api import sync_playwright
res=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    for mid in sys.argv[1:] or ['001','002','003','004','005']:
        errs=[]
        pg=b.new_page(viewport={'width':390,'height':800})
        pg.on('pageerror', lambda e: errs.append('JS: '+str(e)[:150]))
        pg.goto(f'http://localhost:8851/geschichte/klasse-5/{mid}/'); pg.evaluate('localStorage.clear()'); pg.reload()
        pg.click('[data-lwbtn="sicher"]')
        pg.click('#buildBtn')
        if 'Namen' not in pg.inner_text('#startFb'): errs.append('build ohne Namen: '+pg.inner_text('#startFb'))
        pg.fill('#name','A'); pg.fill('#klasse','6b'); pg.fill('#email','a@b.de'); pg.click('#startBtn')
        if 'Jahrgang 5' not in pg.inner_text('#startFb'): errs.append('6b akzeptiert')
        for k,ok in [('15b',False),('15',False),('5',True),('Klasse 5c',True),('R5b',True),('5 b',True),('25a',False)]:
            pg.fill('#klasse',k); r=pg.evaluate('klasseOk(document.querySelector("#klasse").value).ok')
            if r!=ok: errs.append(f'klasse {k} -> {r}')
        tasks=pg.evaluate('TASKS')
        for t in tasks:
            tid=t['id']
            if t['typ']=='mc':
                falsch=[v for v in t['fb'] if v!=t['richtig']][0]
                pg.check(f'input[name="{tid}"][value="{falsch}"]'); pg.click(f'#{tid}Check')
                if 'hint' not in pg.get_attribute(f'#{tid}Fb','class'): errs.append(tid+' falsch nicht als Hinweis')
            if t['typ']=='luecke':
                pg.click(f'#{tid}Check')
                if 'Fülle' not in pg.inner_text(f'#{tid}Fb'): errs.append(tid+' leer')
            if t['typ']=='zuord':
                pc=t['pieces'][1]; pg.click(f'.piece[data-k="{pc["k"]}"]'); pg.focus(f'.zone[data-task="{tid}"][data-zone="{pc["z"]}"]'); pg.keyboard.press('Enter')
        pg.fill('#a2','Zu kurz.'); pg.click('#a2Check')
        if 'kurz' not in pg.inner_text('#a2Fb'): errs.append('a2 kurz: '+pg.inner_text('#a2Fb'))
        pg.wait_for_timeout(500); pg.reload(); pg.wait_for_timeout(300)
        for t in tasks:
            if t['typ']=='zuord':
                pc=t['pieces'][1]
                if pg.locator(f'.zone[data-task="{t["id"]}"] .piece[data-k="{pc["k"]}"]').count()!=1: errs.append('Zuordnung nach Neuladen verloren '+t['id'])
        if not pg.evaluate('document.body.classList.contains("lw-sicher")'): errs.append('Lernweg nicht gespeichert')
        sw=pg.evaluate('document.documentElement.scrollWidth > innerWidth + 2')
        if sw: errs.append('Querscroll')
        print(mid,'OK' if not errs else errs)
        pg.close()
    b.close()
