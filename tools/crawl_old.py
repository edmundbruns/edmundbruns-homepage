import re, os, hashlib, threading, queue, urllib.parse, sys
import requests

BASE = sys.argv[2] if len(sys.argv) > 2 else 'https://bruns-homepage.pages.dev'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'full'
S = requests.Session()
S.headers['User-Agent'] = 'Mozilla/5.0 (site backup for owner)'

home = S.get(BASE + '/').content
HOME_HASH = hashlib.md5(home).hexdigest()
nf = S.get(BASE + '/__gibt-es-nicht-xyz/').content
NF_HASH = hashlib.md5(nf).hexdigest()

seen = set(); lock = threading.Lock(); q = queue.Queue()
saved = {}; missing = []; skipped_ext = set()

TEXT_EXT = ('.html', '.htm', '.css', '.js', '.json', '.webmanifest', '.svg', '.txt', '.xml')

def norm(u):
    u = urllib.parse.urljoin(BASE + '/', u)
    p = urllib.parse.urlsplit(u)
    if p.netloc != urllib.parse.urlsplit(BASE).netloc:
        return None
    path = urllib.parse.unquote(p.path)
    if '${' in path or '`' in path or '{' in path:
        return None
    path = re.sub(r'/+', '/', path)
    return path

def local_path(path):
    if path.endswith('/'):
        return path + 'index.html'
    return path

def add(path):
    if not path: return
    with lock:
        if path in seen: return
        seen.add(path)
    q.put(path)

def extract(path, text, ctype):
    base = BASE + path
    found = set()
    for m in re.finditer(r'''(?:href|src|data-fallback|poster|action|content)\s*=\s*["']([^"'#]+)''', text):
        found.add(m.group(1))
    for m in re.finditer(r'''srcset\s*=\s*["']([^"']+)''', text):
        for part in m.group(1).split(','):
            found.add(part.strip().split(' ')[0])
    for m in re.finditer(r'url\(\s*["\']?([^"\')]+)', text):
        found.add(m.group(1))
    # JS-/Daten-Strings mit Pfaden
    for m in re.finditer(r'''["'`]((?:\.\.?/|/)[A-Za-z0-9_\-./%äöüÄÖÜß]+)["'`]''', text):
        found.add(m.group(1))
    for m in re.finditer(r'''["']([A-Za-z0-9_\-./]+\.(?:png|jpe?g|webp|gif|svg|pdf|docx|xlsx|mp3|mp4|js|css|json|ico|woff2?|html))(?:\?[^"']*)?["']''', text):
        found.add(m.group(1))
    for f in found:
        f = f.strip()
        if not f or f.startswith(('data:', 'mailto:', 'javascript:', 'tel:', '#')): continue
        if f.startswith('//'): continue
        if f.startswith('http') and not f.startswith(BASE): continue
        u = urllib.parse.urljoin(base, f)
        p = norm(u)
        if p: add(p)

def worker():
    while True:
        path = q.get()
        try:
            fetch(path)
        except Exception as e:
            missing.append((path, 'ERR ' + str(e)[:80]))
        q.task_done()

def fetch(path):
    r = S.get(BASE + urllib.parse.quote(path), timeout=60, allow_redirects=True)
    if r.status_code != 200:
        missing.append((path, r.status_code)); return
    body = r.content
    h = hashlib.md5(body).hexdigest()
    if path not in ('/', '/index.html') and h in (HOME_HASH, NF_HASH) and not path.endswith('404.html'):
        missing.append((path, 'fallback')); return
    lp = local_path(path)
    # Verzeichnis-URL ohne Slash, die auf /x/ umgeleitet wurde
    final = urllib.parse.urlsplit(r.url).path
    if final.endswith('/') and not path.endswith('/') and not lp.endswith('.html'):
        lp = path + '/index.html'
    out = os.path.join(OUT, lp.lstrip('/'))
    with lock:
        if out in saved.values():
            return
        saved[path] = out
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'wb') as f:
        f.write(body)
    ct = r.headers.get('content-type', '')
    if 'text' in ct or 'javascript' in ct or 'json' in ct or 'svg' in ct or lp.endswith(TEXT_EXT):
        try:
            extract(final if final.endswith('/') else path, body.decode('utf-8', 'ignore'), ct)
        except Exception:
            pass

for start in ['/geschichte/klasse-5/','/geschichte/klasse-6/','/geschichte/klasse-7/','/geschichte/klasse-8/','/geschichte/klasse-9/','/geschichte/klasse-10/','/geschichte/klasse-5/001/','/geschichte/klasse-5/002/','/geschichte/klasse-5/003/','/geschichte/klasse-5/004/','/geschichte/klasse-5/005/','/geschichte/klasse-5/006/','/geschichte/klasse-5/007/','/geschichte/klasse-5/008/','/geschichte/klasse-5/009/','/geschichte/klasse-5/010/','/geschichte/klasse-5/011/','/geschichte/klasse-5/012/','/geschichte/klasse-5/013/','/geschichte/klasse-5/014/','/geschichte/klasse-5/015/','/geschichte/klasse-5/016/','/geschichte/klasse-5/017/','/geschichte/klasse-5/018/','/geschichte/klasse-5/019/','/geschichte/klasse-5/020/','/geschichte/klasse-5/021/','/geschichte/klasse-5/022/','/geschichte/klasse-5/023/','/geschichte/klasse-5/024/','/geschichte/klasse-5/025/','/geschichte/klasse-5/026/','/geschichte/klasse-5/027/','/geschichte/klasse-6/001/','/geschichte/klasse-6/002/','/geschichte/klasse-6/003/','/geschichte/klasse-6/004/','/geschichte/klasse-6/005/','/geschichte/klasse-6/006/','/geschichte/klasse-6/007/','/geschichte/klasse-6/008/','/geschichte/klasse-6/009/','/geschichte/klasse-6/010/','/geschichte/klasse-6/011/','/geschichte/klasse-6/012/','/geschichte/klasse-6/013/','/geschichte/klasse-6/014/','/geschichte/klasse-6/015/','/geschichte/klasse-6/016/','/geschichte/klasse-6/017/','/geschichte/klasse-6/018/','/geschichte/klasse-6/019/','/geschichte/klasse-6/020/','/geschichte/klasse-6/021/','/geschichte/klasse-6/022/','/geschichte/klasse-6/023/','/geschichte/klasse-6/024/','/geschichte/klasse-6/025/','/geschichte/klasse-6/026/','/geschichte/klasse-6/027/','/geschichte/klasse-7/001/','/geschichte/klasse-7/002/','/geschichte/klasse-7/003/','/geschichte/klasse-7/004/','/geschichte/klasse-7/005/','/geschichte/klasse-7/006/','/geschichte/klasse-7/007/','/geschichte/klasse-7/008/','/geschichte/klasse-7/009/','/geschichte/klasse-7/010/','/geschichte/klasse-7/011/','/geschichte/klasse-7/012/','/geschichte/klasse-7/013/','/geschichte/klasse-7/014/','/geschichte/klasse-7/015/','/geschichte/klasse-7/016/','/geschichte/klasse-7/017/','/geschichte/klasse-7/018/','/geschichte/klasse-7/019/','/geschichte/klasse-7/020/','/geschichte/klasse-7/021/','/geschichte/klasse-7/022/','/geschichte/klasse-7/023/','/geschichte/klasse-7/024/','/geschichte/klasse-7/025/','/geschichte/klasse-7/026/','/geschichte/klasse-7/027/','/geschichte/klasse-8/001/','/geschichte/klasse-8/002/','/geschichte/klasse-8/003/','/geschichte/klasse-8/004/','/geschichte/klasse-8/005/','/geschichte/klasse-8/006/','/geschichte/klasse-8/007/','/geschichte/klasse-8/008/','/geschichte/klasse-8/009/','/geschichte/klasse-8/010/','/geschichte/klasse-8/011/','/geschichte/klasse-8/012/','/geschichte/klasse-8/013/','/geschichte/klasse-8/014/','/geschichte/klasse-8/015/','/geschichte/klasse-8/016/','/geschichte/klasse-8/017/','/geschichte/klasse-8/018/','/geschichte/klasse-8/019/','/geschichte/klasse-8/020/','/geschichte/klasse-8/021/','/geschichte/klasse-8/022/','/geschichte/klasse-8/023/','/geschichte/klasse-8/024/','/geschichte/klasse-8/025/','/geschichte/klasse-8/026/','/geschichte/klasse-8/027/','/geschichte/klasse-9/001/','/geschichte/klasse-9/002/','/geschichte/klasse-9/003/','/geschichte/klasse-9/004/','/geschichte/klasse-9/005/','/geschichte/klasse-9/006/','/geschichte/klasse-9/007/','/geschichte/klasse-9/008/','/geschichte/klasse-9/009/','/geschichte/klasse-9/010/','/geschichte/klasse-9/011/','/geschichte/klasse-9/012/','/geschichte/klasse-9/013/','/geschichte/klasse-9/014/','/geschichte/klasse-9/015/','/geschichte/klasse-9/016/','/geschichte/klasse-9/017/','/geschichte/klasse-9/018/','/geschichte/klasse-9/019/','/geschichte/klasse-9/020/','/geschichte/klasse-9/021/','/geschichte/klasse-9/022/','/geschichte/klasse-9/023/','/geschichte/klasse-9/024/','/geschichte/klasse-9/025/','/geschichte/klasse-9/026/','/geschichte/klasse-9/027/','/geschichte/klasse-10/001/','/geschichte/klasse-10/002/','/geschichte/klasse-10/003/','/geschichte/klasse-10/004/','/geschichte/klasse-10/005/','/geschichte/klasse-10/006/','/geschichte/klasse-10/007/','/geschichte/klasse-10/008/','/geschichte/klasse-10/009/','/geschichte/klasse-10/010/','/geschichte/klasse-10/011/','/geschichte/klasse-10/012/','/geschichte/klasse-10/013/','/geschichte/klasse-10/014/','/geschichte/klasse-10/015/','/geschichte/klasse-10/016/','/geschichte/klasse-10/017/','/geschichte/klasse-10/018/','/geschichte/klasse-10/019/','/geschichte/klasse-10/020/','/geschichte/klasse-10/021/','/geschichte/klasse-10/022/','/geschichte/klasse-10/023/','/geschichte/klasse-10/024/','/geschichte/klasse-10/025/','/geschichte/klasse-10/026/','/geschichte/klasse-10/027/','/schulsozialarbeit/soziales-lernen/001/','/schulsozialarbeit/soziales-lernen/002/','/schulsozialarbeit/soziales-lernen/003/','/schulsozialarbeit/soziales-lernen/004/','/schulsozialarbeit/soziales-lernen/005/','/schulsozialarbeit/soziales-lernen/006/','/schulsozialarbeit/soziales-lernen/007/','/schulsozialarbeit/soziales-lernen/008/','/schulsozialarbeit/soziales-lernen/009/','/schulsozialarbeit/soziales-lernen/010/','/schulsozialarbeit/soziales-lernen/011/','/schulsozialarbeit/soziales-lernen/012/','/schulsozialarbeit/soziales-lernen/013/','/schulsozialarbeit/soziales-lernen/014/','/schulsozialarbeit/soziales-lernen/015/','/schulsozialarbeit/soziales-lernen/016/','/schulsozialarbeit/soziales-lernen/017/','/schulsozialarbeit/soziales-lernen/018/','/schulsozialarbeit/soziales-lernen/019/','/schulsozialarbeit/soziales-lernen/020/','/schulsozialarbeit/soziales-lernen/021/','/schulsozialarbeit/soziales-lernen/022/','/schulsozialarbeit/soziales-lernen/023/','/schulsozialarbeit/soziales-lernen/024/','/schulsozialarbeit/soziales-lernen/025/','/schulsozialarbeit/soziales-lernen/026/','/schulsozialarbeit/soziales-lernen/027/','/schulsozialarbeit/soziales-lernen/028/','/schulsozialarbeit/soziales-lernen/029/','/schulsozialarbeit/soziales-lernen/030/','/assets/search-index.json','/assets/icon-192.png','/assets/icon-512.png','/assets/icon-maskable-512.png'] + ['/', '/404.html', '/manifest.html', '/manifest.webmanifest', '/robots.txt', '/sitemap.xml', '/_redirects', '/_headers',
              '/assets/site.css', '/assets/site.js', '/assets/materials.js', '/assets/og-image.png', '/sw.js', '/favicon.ico']:
    add(start)
for _ in range(12):
    threading.Thread(target=worker, daemon=True).start()
q.join()
print('saved', len(saved))
print('missing', len(missing))
with open('crawl-missing.txt', 'w') as f:
    for m in sorted(missing, key=str): f.write(f'{m}\n')
