"""Prüft ein Geschichtsmodul: python3 gcheck.py JAHRGANG NNN PORT
Erwartet einen Webserver auf PORT im Ordner upload/."""
import sys, re, json
from playwright.sync_api import sync_playwright
jg, mid, port = sys.argv[1], sys.argv[2], sys.argv[3]
URL = f'http://localhost:{port}/geschichte/klasse-{jg}/{mid}/'
SHOT = '../../shots_g/'
import os; os.makedirs(SHOT, exist_ok=True)
other = '6' if jg != '6' else '7'
probleme = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for vw in (1280, 390):
        pg = b.new_page(viewport={'width': vw, 'height': 900})
        errs = []
        pg.on('pageerror', lambda e: errs.append('JS: ' + str(e)[:160]))
        pg.on('console', lambda m: errs.append('Konsole: ' + m.text[:160]) if m.type == 'error' else None)
        r = pg.goto(URL); pg.wait_for_timeout(600)
        if r.status != 200: probleme.append(f'HTTP {r.status}')
        pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(500)
        for sel in ['#name', '#klasse', '#email', '#startBtn', '#startFb', '#sendBtn', '#sendFb']:
            if pg.locator(sel).count() != 1: probleme.append(f'Element {sel} fehlt oder doppelt')
        pg.fill('#name', 'Test Person'); pg.fill('#email', 'test@schule.de')
        pg.fill('#klasse', f'Klasse {other}b'); pg.click('#startBtn'); pg.wait_for_timeout(200)
        t1 = pg.inner_text('#startFb')
        if f'Jahrgang {jg}' not in t1: probleme.append(f'Fremde Klasse wird nicht abgelehnt: {t1[:80]}')
        pg.fill('#klasse', f'Klasse {jg} b'); pg.click('#startBtn'); pg.wait_for_timeout(300)
        try:
            pl = pg.evaluate('payload()')
            if str(pl.get('jahrgang')) != jg: probleme.append(f"payload.jahrgang = {pl.get('jahrgang')}")
            if pl.get('modul_id') != mid: probleme.append(f"payload.modul_id = {pl.get('modul_id')}")
            if pl.get('klasse') != f'{jg}b': probleme.append(f"payload.klasse = {pl.get('klasse')}")
            if pl.get('fach') != 'Geschichte': probleme.append('payload.fach fehlt')
            for k in ['abgabe_id', 'pflichtaufgaben', 'kompetenzen', 'bearbeitungsstand', 'name', 'email', 'lernweg', 'punkte', 'max_punkte']:
                if k not in pl: probleme.append(f'payload.{k} fehlt')
        except Exception as e:
            probleme.append('payload() nicht aufrufbar: ' + str(e)[:100])
        sw = pg.evaluate('document.documentElement.scrollWidth > innerWidth + 2')
        if sw: probleme.append(f'Querscroll bei {vw}px')
        txt = pg.inner_text('body')
        for bad, name in [(' – ', 'Gedankenstrich'), (' — ', 'Geviertstrich'), ('Lehrkraft-Übersicht', 'Lehrkraftbereich'), ('Technische Dokumentation', 'Technikblock'), ('lorem', 'Platzhalter'), ('TODO', 'TODO')]:
            if bad.lower() in txt.lower(): probleme.append(f'{name} im Text')
        if pg.locator('.teacher, .doc, #lehrkraft, #doku, #payloadView').count(): probleme.append('interner Lehrkraft- oder Technikblock vorhanden')
        pg.screenshot(path=f'{SHOT}{jg}_{mid}_{vw}.png', full_page=True)
        probleme += [f'[{vw}] ' + e for e in errs]
        pg.close()
    b.close()
print(f'Geschichte {jg}/{mid}:', 'OK' if not probleme else 'PROBLEME')
for x in dict.fromkeys(probleme): print(' -', x)
