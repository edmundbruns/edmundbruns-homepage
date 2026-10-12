import os, html

ROOT = os.path.join(os.path.dirname(__file__), '..', 'paket')
BASE_URL = 'https://bruns-homepage.pages.dev'

def rel(depth):
    return '../' * depth

def esc(s):
    return html.escape(s, quote=True)

SCHACH_NAV = [('einsteiger', 'Einsteiger'), ('fortgeschrittene', 'Fortgeschrittene'), ('schachgeschichte', 'Schachgeschichte'),
              ('schachlehrende', 'Schachlehrende'), ('schachweltmeister', 'Weltmeister'), ('verschiedenes', 'Verschiedenes')]

def schach_chipnav(depth, active='schachlehrende'):
    r = rel(depth - 1)  # path to /schach/
    items = ''.join(f'<a href="{r}{k}/index.html"{" class=\"active\"" if k == active else ""}>{v}</a>' for k, v in SCHACH_NAV)
    return f'<nav class="chipnav" aria-label="Schach-Bereiche"><div class="chipnav-inner shell">{items}</div></nav>'

def page(path, title, description, eyebrow, h1, lead, body, accent=('#1f6d67', '#d9eee2'), footer_title='Dr. Edmund Bruns',
         footer_note='Kostenlose Materialien aus der schulischen Praxis.', chipnav='', extra_head='', scripts='', breadcrumb=None):
    """path: relative path of the page inside site, e.g. 'schach/schachlehrende/ag-konzept/index.html'"""
    depth = path.count('/')
    r = rel(depth)
    url = BASE_URL + '/' + path.replace('index.html', '')
    bc = ''
    if breadcrumb:
        parts = [f'<a href="{r}index.html">Start</a>'] + [f'<a href="{r}{href}">{esc(t)}</a>' for t, href in breadcrumb]
        bc = '<nav class="eb-bc shell" aria-label="Brotkrumen">' + ' <span aria-hidden="true">›</span> '.join(parts) + '</nav>'
    doc = f'''<!doctype html>
<html lang="de">
<head>
  <script>try{{var d=document.documentElement,s=localStorage;if(s.getItem('eb-theme')==='dark')d.dataset.theme='dark';if(s.getItem('eb-reading')==='easy')d.dataset.reading='easy';}}catch(e){{}}</script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)} | Dr. Edmund Bruns</title>
  <meta name="description" content="{esc(description)}">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Dr. Edmund Bruns">
  <meta property="og:locale" content="de_DE">
  <meta property="og:title" content="{esc(title)} | Dr. Edmund Bruns">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{BASE_URL}/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#14292c">
  <link rel="manifest" href="{r}manifest.html">
  <link rel="apple-touch-icon" href="{r}assets/icon-180.png">
  <link rel="icon" href="{r}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="{r}assets/site.css">
  <link rel="stylesheet" href="{r}assets/eb-extra.css">
  <style>:root{{ --accent:{accent[0]}; --accent-soft:{accent[1]}; }}</style>
{extra_head}
</head>
<body id="top">
  <a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
  <header class="site-header" id="siteHeader">
    <nav class="nav shell" aria-label="Hauptnavigation">
      <a class="brand" href="{r}index.html"><span class="brand-mark" aria-hidden="true">EB</span><span>Dr. Edmund Bruns</span></a>
      <a class="nav-home" href="{r}index.html"><svg class="home-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg><span>Startseite</span></a>
    </nav>
  </header>

  <main id="inhalt">
    {bc}
    <section class="page-hero shell">
      <div class="eyebrow">{eyebrow}</div>
      <h1>{h1}</h1>
      <p class="lead">{lead}</p>
    </section>
    {chipnav}
{body}
  </main>

  <footer class="site-footer">
    <div class="footer-grid shell">
      <div>
        <div class="footer-title">{footer_title}</div>
        <div class="footer-note">{footer_note}</div>
      </div>
      <div class="footer-links">
        <a href="{r}index.html">Start</a>
        <a href="{r}kontakt/index.html">Kontakt</a>
        <a href="{r}impressum/index.html">Impressum</a>
        <a href="{r}datenschutz/index.html">Datenschutz</a>
      </div>
    </div>
    <div class="copyright shell">
      <span>© <span data-year></span> Dr. Edmund Bruns</span>
      <span>Soweit nicht anders angegeben: CC BY 4.0</span>
    </div>
  </footer>

  <a class="backtop" href="#top" aria-label="Nach oben">↑</a>
  <script src="{r}assets/site.js"></script>
  <script defer src="{r}assets/search.js"></script>
  <script defer src="{r}assets/ux.js"></script>
{scripts}
</body>
</html>
'''
    out = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(doc)
    return out

def section(inner, cls='section tight', id_=None):
    i = f' id="{id_}"' if id_ else ''
    return f'<section class="{cls}"{i}><div class="shell">{inner}</div></section>'

def print_btn(label='Seite drucken oder als PDF speichern'):
    return f'<p class="eb-noprint"><button class="btn secondary small" type="button" onclick="window.print()">🖨 {label}</button></p>'

def table(head, rows, cls='eb-table'):
    th = ''.join(f'<th scope="col">{h}</th>' for h in head)
    tr = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<div class="eb-table-wrap"><table class="{cls}"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div>'

def box(kind, title, inner):
    return f'<div class="eb-box {kind}"><strong>{title}</strong>{inner}</div>'

def ul(items):
    return '<ul>' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'

def ol(items, cls='eb-steps'):
    return f'<ol class="{cls}">' + ''.join(f'<li>{i}</li>' for i in items) + '</ol>'
