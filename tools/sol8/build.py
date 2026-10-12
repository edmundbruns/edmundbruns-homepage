"""Baut SOL-Mathe-Module als eigenständige HTML-Dateien.
Aufruf: python3 build.py [Modulnummern ...]   (ohne Angabe: alle in modules/)"""
import json, os, re, sys, html as H

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', 'upload'))
sys.path.insert(0, os.path.join(HERE, '..'))
from send_helper import HELPER

CONF = json.load(open(os.path.join(HERE, 'config.json'), encoding='utf-8'))
JG = os.environ.get('JG', '8')
CONF['jahrgang'] = JG
MODDIR = 'modules' if JG == '8' else 'modules' + JG
THEMES = {  # Leitfarbe je Jahrgang
  '8': '',
  '9': ':root{--brand:#1d4ed8;--brand2:#1e3a8a;--soft:#e8eefc;--line:#cfd9ef;--paper:#f4f7fc}.track{background:#dde6f7}#nav a.active{color:#1e3a8a}.facts>div,.summary>div{border-color:#cdd9f3}.merk{border-color:#1d4ed8}.merk b:first-child{color:#1e3a8a}.btn.ghost{background:#e5ecf9}.btn.ghost:hover{background:#d3def3}input:not([type]),input[inputmode],.way span,.chip span{border-color:#b3c0da}input:disabled{background:#eef2f8}',
  '10': ':root{--brand:#9f1239;--brand2:#6b0f2a;--soft:#fbe9ee;--line:#efd0d8;--paper:#fcf5f7}.track{background:#f5dbe2}#nav a.active{color:#6b0f2a}.facts>div,.summary>div{border-color:#f0cdd6}.merk{border-color:#9f1239}.merk b:first-child{color:#6b0f2a}.btn.ghost{background:#f6e6eb}.btn.ghost:hover{background:#efd3dc}input:not([type]),input[inputmode],.way span,.chip span{border-color:#d4b6bf}input:disabled{background:#f8eff2}'}

def read(p):
    return open(os.path.join(HERE, p), encoding='utf-8').read()

def meta(js, field):
    m = re.search(field + r":\s*'((?:[^'\\]|\\.)*)'", js)
    return m.group(1).replace("\\'", "'") if m else ''

def build(mid):
    js = read(MODDIR + '/%s.js' % mid)
    title, lead = meta(js, 'title'), re.sub(r'<[^>]+>', '', meta(js, 'lead'))
    jg = CONF['jahrgang']
    config = {
        'jahrgang': jg, 'endpoint': CONF.get('endpoint', ''), 'iservDomain': CONF.get('iservDomain', ''),
        'version': CONF['version'], 'backUrl': '../index.html'
    }
    out = f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Modul {mid} · {H.escape(title)} | SOL Mathematik {jg}</title>
<meta name="description" content="{H.escape(lead)}">
<link rel="canonical" href="https://www.edmundbruns.com/mathe/klasse-{jg}/{mid}/">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="{"#1e3a8a" if JG == "9" else "#6b0f2a" if JG == "10" else "#3d2a73"}">
<link rel="icon" href="../../../assets/favicon.svg" type="image/svg+xml">
<style>
{read('style.css')}
{THEMES.get(JG, '')}
</style>
{HELPER}</head>
<body>
<div id="app"><noscript><p style="padding:20px">Dieses Lernmodul braucht JavaScript. Bitte aktiviere JavaScript in deinem Browser.</p></noscript></div>
<script>
{read('mathlib.js')}
</script>
<script>
window.CONFIG = {json.dumps(config, ensure_ascii=False)};
{js}
window.MODULE = MODULE;
</script>
<script>
{read('engine.js')}
</script>
</body>
</html>
'''
    target = os.path.join(ROOT, 'mathe', 'klasse-%s' % jg, mid, 'index.html')
    os.makedirs(os.path.dirname(target), exist_ok=True)
    open(target, 'w', encoding='utf-8').write(out)
    return target, title

if __name__ == '__main__':
    ids = sys.argv[1:] or sorted(f[:-3] for f in os.listdir(os.path.join(HERE, MODDIR)) if f.endswith('.js'))
    for i in ids:
        t, title = build(i)
        print('gebaut', i, title, os.path.getsize(t) // 1024, 'KB')
