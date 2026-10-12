"""Generator für SOL-Geschichtsmodule Jahrgang 5 (Module 011 bis 015).
Aufruf: python3 build.py 011 [012 ...]
Gerüst, CSS und Technik folgen der Vorlage klasse-6/004."""
import sys, json, os, importlib, html

ROOT = '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/'
J = '5'
ENDPOINT = "https://script.google.com/macros/s/AKfycbxW2bLm50-p5pe5bVAzRtLPVPYWJ3g8vy1igABoN3LWr1FxzHsRkFWJSNrPLZYw-W7F6Q/exec"

CSS = r"""
:root{--ink:#2b1d14;--paper:#fff;--cream:#f3ebe3;--soft:#f3ebe3;--bg:#f6f1ea;--green:#8a4317;--gold:#aa6d18;--gold-text:#8f5a12;--red:#9b352d;--blue:#1168c4;--line:#ddd3c7;--ok:#1d6b4f;--okbg:#eaf4ef;--warn:#7a4b12;--warnbg:#fdf5e7;--bad:#9b352d;--badbg:#fbeeee;--shadow:0 14px 40px #2e1a0e14;--radius:18px;--focus:#1168c4}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.58 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;overflow-x:hidden}
button,input,select,textarea{font:inherit}
button,input,select,textarea{min-height:44px}
button{cursor:pointer}
a{color:var(--blue)}
:focus-visible{outline:4px solid var(--focus);outline-offset:3px;border-radius:6px}
header{background:linear-gradient(130deg,#2e1a0e,#8a4317);color:#fbf6f1;padding:20px 16px 26px}
.shell{max-width:1040px;margin:auto}
.topline{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;font-weight:700;letter-spacing:.02em}
.tools{display:flex;gap:8px;flex-wrap:wrap}
.tools button{background:#fbf6f1;color:#2e1a0e;border:0;border-radius:12px;padding:9px 12px;font-weight:750;min-height:44px}
.hero{margin-top:18px;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:end}
@media(max-width:720px){.hero{grid-template-columns:1fr}}
.eyebrow{font-weight:800;color:#e9c98f;text-transform:uppercase;letter-spacing:.09em;font-size:.8rem}
.hero h1{font-size:clamp(1.7rem,4.4vw,2.9rem);line-height:1.08;margin:.3rem 0;overflow-wrap:break-word;hyphens:auto}
.hero p{margin:.4rem 0;color:#f4e8de;max-width:66ch}
.badge{background:#ffffff22;border:1px solid #ffffff55;border-radius:16px;padding:14px 16px;text-align:center;min-width:120px}
.badge strong{display:block;font-size:1.9rem;line-height:1}
.progress{position:sticky;top:0;z-index:20;background:#fffffff2;border-bottom:1px solid var(--line);backdrop-filter:blur(6px)}
.progress .shell{display:flex;align-items:center;gap:12px;padding:8px 16px}
.track{flex:1;height:12px;background:var(--cream);border-radius:999px;overflow:hidden;border:1px solid var(--line)}
.bar{height:100%;width:0;background:linear-gradient(90deg,#8a4317,#c08a2e);transition:width .35s}
.ptext{font-weight:750;font-size:.9rem;white-space:nowrap}
.layout{max-width:1040px;margin:22px auto;padding:0 16px;display:grid;grid-template-columns:210px 1fr;gap:20px;align-items:start}
@media(max-width:900px){.layout{grid-template-columns:1fr}.side{position:static!important}}
.layout>main{min-width:0}
.side{position:sticky;top:64px;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:10px;box-shadow:var(--shadow)}
.side nav{display:grid;gap:2px}
.side a{display:block;padding:9px 10px;border-radius:10px;text-decoration:none;color:#3b2a1f;font-weight:650;font-size:.94rem}
.side a:hover{background:var(--cream)}
.card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:20px;margin-bottom:18px;box-shadow:var(--shadow)}
@media(max-width:480px){.card{padding:16px 14px}.task{padding:12px}}
.card h2{margin:.1rem 0 .7rem;font-size:1.35rem;color:var(--green)}
.card h3{margin:1.1rem 0 .4rem;font-size:1.08rem;color:#3b2a1f}
.chronos{display:flex;gap:12px;align-items:flex-start;background:var(--cream);border:1px solid var(--line);border-left:6px solid var(--gold);border-radius:14px;padding:12px 14px;margin:12px 0}
.chronos .av{flex:0 0 46px}
.chronos p{margin:.15rem 0}
.chronos .who{font-weight:800;color:var(--gold-text)}
.akte{border:2px dashed var(--gold);border-radius:14px;padding:14px;background:#fdf8ee;margin:12px 0}
.akte .stamp{display:inline-block;border:2px solid var(--red);color:var(--red);font-weight:800;letter-spacing:.12em;padding:3px 9px;border-radius:6px;transform:rotate(-3deg);font-size:.78rem}
.akte blockquote{margin:.6rem 0;padding:.2rem 0 .2rem 14px;border-left:4px solid var(--gold);font-style:italic}
.notice{background:var(--cream);border:1px solid var(--line);border-left:5px solid var(--blue);border-radius:12px;padding:12px 14px;margin:12px 0}
.notice.warn{border-left-color:var(--gold);background:var(--warnbg)}
.notice.privacy{border-left-color:var(--green);font-size:.94rem}
.notice.calm{border-left-color:#6d5a4b;background:#f7f3ee}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.field{display:grid;gap:5px}
.field label,.legend{font-weight:750;color:#3b2a1f}
input[type=text],input[type=email],select,textarea{width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:12px;background:#fff}
textarea{min-height:96px;resize:vertical}
.hint{font-size:.88rem;color:#62574e}
.btn{background:var(--green);color:#fbf6f1;border:0;border-radius:12px;padding:12px 16px;font-weight:750;margin:6px 6px 0 0}
.btn.sec{background:#fff;color:var(--green);border:1px solid var(--green)}
.btn.gold{background:var(--gold)}
.btn.danger{background:#fff;color:var(--red);border:1px solid var(--red)}
.btn:disabled{opacity:.55;cursor:not-allowed}
.fb{display:none;margin-top:11px;padding:12px;border-radius:12px;font-weight:680}
.fb.show{display:block}
.fb.ok{color:var(--ok);background:var(--okbg);border:1px solid #9ccbb0}
.fb.hint{color:var(--warn);background:var(--warnbg);border:1px solid #e8c99a}
.fb.bad{color:var(--bad);background:var(--badbg);border:1px solid #ddaaaa}
.task{border:1px solid var(--line);border-radius:14px;padding:14px;margin:14px 0;background:#fff}
.task .tag{display:inline-block;background:var(--cream);border:1px solid var(--line);border-radius:999px;padding:3px 11px;font-size:.78rem;font-weight:800;color:#62574e;letter-spacing:.04em}
.task fieldset{border:0;padding:0;margin:0;min-width:0}
.opts{display:grid;gap:8px;margin-top:8px}
.opts label{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:12px;padding:11px 12px;background:#fff;cursor:pointer}
.opts label:hover{background:var(--cream)}
.opts input{margin-top:3px;min-height:auto;width:20px;height:20px;flex:0 0 auto}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
.chip{border:2px solid var(--line);background:#fff;border-radius:999px;padding:9px 14px;font-weight:700;min-height:44px}
.chip[aria-pressed=true]{border-color:var(--green);background:#f6e9de}
.chip.ok{border-color:var(--ok);background:var(--okbg)}
.chip.no{border-color:var(--bad);background:var(--badbg)}
.zones{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:10px}
.zone{border:2px dashed var(--line);border-radius:14px;padding:10px;background:#fff;min-height:104px}
.zone.over{border-color:var(--gold);background:#fffaf0}
.zone h4{margin:.1rem 0 .5rem;font-size:.98rem;color:var(--green)}
.zone .drop{display:flex;flex-wrap:wrap;gap:6px;min-height:44px}
.piece{border:2px solid var(--line);background:#fff;border-radius:10px;padding:8px 11px;font-weight:700;min-height:44px;display:inline-flex;align-items:center;gap:6px;text-align:left}
.piece[aria-pressed=true]{border-color:var(--gold);background:#fffaf0}
.piece.ok{border-color:var(--ok);background:var(--okbg)}
.piece.no{border-color:var(--bad);background:var(--badbg)}
.piece.ok::after,.chip.ok::after{content:' \2713';font-weight:900;color:var(--ok)}
.piece.no::after,.chip.no::after{content:' \2717';font-weight:900;color:var(--bad)}
.order{display:grid;gap:8px;margin:10px 0}
.orow{display:flex;gap:8px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:9px 10px;background:#fff}
.orow .nr{flex:0 0 auto;font-weight:900;color:var(--gold-text);min-width:1.4em}
.orow span{flex:1;font-weight:650}
.orow button{width:44px;min-height:44px;border:1px solid var(--line);background:var(--cream);border-radius:10px;font-size:1.1rem;font-weight:800;flex:0 0 auto}
.svgwrap{border:1px solid var(--line);border-radius:14px;background:#fff;padding:8px;margin-top:10px}
.svgwrap svg{width:100%;height:auto;display:block;touch-action:manipulation}
svg text{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
.hot{cursor:pointer;transition:filter .15s}
.hot:focus-visible{outline:4px solid var(--focus)}
.svgwrap .hot:hover{filter:drop-shadow(0 0 5px #aa6d1899)}
.hot.found{filter:drop-shadow(0 0 6px #17633b)}
.legendlist{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.legendlist span{font-size:.86rem;border:1px solid var(--line);border-radius:999px;padding:4px 10px;background:var(--cream)}
.gaptext{line-height:2.3}
.gaptext select{width:auto;max-width:100%;display:inline-block;padding:6px 8px;margin:2px 0;font-weight:700}
.selrows{display:grid;gap:10px;margin-top:10px}
.selrow{border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:#fff;display:grid;gap:6px}
.selrow p{margin:0;font-weight:650}
select.ok{border:2px solid var(--ok);background:var(--okbg)}
select.no{border:2px solid var(--bad);background:var(--badbg)}
.persons{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:10px 0}
.person{border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:#fdfaf6}
.person strong{color:var(--green)}
details.gloss{border:1px solid var(--line);border-radius:12px;background:#fff;margin:8px 0}
details.gloss>summary{cursor:pointer;padding:11px 13px;font-weight:750;color:var(--green);list-style:none;display:flex;gap:9px;align-items:center;min-height:44px}
details.gloss>summary::-webkit-details-marker{display:none}
details.gloss>summary::before{content:'+';font-weight:900;color:var(--gold-text);width:1.1em;text-align:center}
details.gloss[open]>summary::before{content:'\2212'}
details.gloss .body{padding:0 13px 13px;color:#4a3d33}
.scale{display:flex;gap:8px;flex-wrap:wrap}
.scale label{flex:1 1 120px;border:1px solid var(--line);border-radius:12px;padding:10px;text-align:center;background:#fff;cursor:pointer;font-weight:700}
.scale input{margin-right:6px}
.result{display:none;margin-top:14px}
.result.show{display:block}
.score{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.ring{width:120px;height:120px;border-radius:50%;background:conic-gradient(var(--green) var(--p,0%),var(--cream) 0);display:grid;place-items:center;font-weight:900;font-size:1.2rem;color:var(--green)}
.ring i{background:var(--paper);width:88px;height:88px;border-radius:50%;display:grid;place-items:center;font-style:normal}
.lamp{width:18px;height:18px;border-radius:50%;display:inline-block;background:#bbb;margin-right:8px;border:1px solid #0002}
.lamp.g{background:#2f8f5b}.lamp.y{background:#d8a325}.lamp.r{background:#b6483f}
.pay{background:#2a1d14;color:#f1e9e1;border-radius:12px;padding:12px;font:13px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;word-break:break-word;max-height:260px;overflow:auto}
.badges{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.abz{border:2px solid var(--line);border-radius:12px;padding:8px 12px;font-weight:800;color:#8b8279;background:#fff;font-size:.9rem}
.abz.on{border-color:var(--gold);color:var(--gold-text);background:#fffaf0}
table.mini{border-collapse:collapse;width:100%;font-size:.95rem;margin:8px 0}
table.mini th,table.mini td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top}
table.mini th{background:var(--cream)}
.tablewrap{overflow-x:auto}
footer{max-width:1040px;margin:10px auto 40px;padding:0 16px;color:#62574e;font-size:.9rem}
body.easy{font-size:19px}
body.easy .card{padding:22px}
body.easy p,body.easy li{line-height:1.75;max-width:62ch}
body:not(.lw-weiter) [data-lw="weiter"]{display:none}
body.lw-sicher [data-lw="standard"]{display:none}
body:not(.lw-sicher) [data-lw="sicher"]{display:none}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
@media print{header,.progress,.side,.tools,.no-print,.btn{display:none!important}.layout{display:block}.card{box-shadow:none;break-inside:avoid}.result{display:block!important}body{background:#fff;font-size:11pt}}
"""

EBSEND = r"""<script>/* Abgabe senden und Antwort des Auswertungssystems lesen */
window.ebSend=async function(url,payload){var r,t="",j=null;
 try{r=await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});t=await r.text();}
 catch(e){return{ok:false,msg:"Keine Verbindung zum Auswertungssystem. Prüfe das Internet und versuche es noch einmal."};}
 try{j=JSON.parse(t);}catch(e){}
 if(j&&(j.ok===true||/^(ok|gespeichert|success)$/i.test(String(j.status||""))))return{ok:true,data:j};
 return{ok:false,msg:(j&&(j.error||j.message))?String(j.error||j.message):"Das Auswertungssystem hat die Abgabe nicht bestätigt."};};
</script>"""

def av():
    return ('<div class="av"><svg width="46" height="46" aria-hidden="true" focusable="false" viewBox="0 0 46 46">'
            '<circle cx="23" cy="23" r="22" fill="#f6ede4" stroke="#aa6d18" stroke-width="2"/>'
            '<circle cx="23" cy="18" r="7" fill="#8a4317"/><path d="M9 40c2-9 8-13 14-13s12 4 14 13" fill="#8a4317"/>'
            '<path d="M14 14c4-6 14-6 18 0" stroke="#aa6d18" stroke-width="2" fill="none"/></svg></div>')

def chronos(text):
    return f'<div class="chronos">{av()}<div><p class="who">Chronos, Archivar</p><p>{text}</p></div></div>'

def lwattr(t):
    return f' data-lw="{t["lw"]}"' if t.get('lw') else ''

def esc(s):
    return html.escape(s, quote=True)

def render_task(t):
    i = t['id']; ty = t['type']
    out = [f'<div class="task" id="t-{i}"{lwattr(t)}>', f' <span class="tag">{t["tag"]}</span>']
    if t.get('pre'): out.append(t['pre'])
    if ty in ('single', 'multi'):
        inp = 'radio' if ty == 'single' else 'checkbox'
        out.append(f' <fieldset><legend class="legend">{t["frage"]}</legend><div class="opts">')
        for o in t['opts']:
            out.append(f'  <label><input type="{inp}" name="{i}" value="{o[0]}"><span>{o[1]}</span></label>')
        out.append(' </div></fieldset>')
        out.append(f' <button class="btn" type="button" data-check="{i}">Prüfen</button>')
        if ty == 'multi': out.append(f' <button class="btn sec" type="button" data-reset="{i}">Zurücksetzen</button>')
    elif ty == 'zuord':
        out.append(f' <p>{t["frage"]}</p><p class="hint">Du kannst die Karten mit der Maus ziehen. Du kannst sie aber auch antippen und danach das Ziel antippen. Beides zählt gleich.</p>')
        out.append(f' <div class="chips" id="pc-{i}" aria-label="Karten zum Zuordnen"></div><div class="zones">')
        for z in t['zones']:
            out.append(f'  <div class="zone" data-task="{i}" data-zone="{z[0]}" tabindex="0" role="button" aria-label="Ablegen bei {esc(z[1])}"><h4>{z[1]}</h4><div class="drop"></div></div>')
        out.append(' </div>')
        out.append(f' <button class="btn" type="button" data-check="{i}">Zuordnung prüfen</button><button class="btn sec" type="button" data-reset="{i}">Zurücksetzen</button>')
    elif ty in ('order', 'rank'):
        out.append(f' <p>{t["frage"]}</p><div class="order" id="or-{i}"></div>')
        if ty == 'rank':
            out.append(f' <label class="legend" for="rk-{i}">{t["why"]}</label><textarea id="rk-{i}" placeholder="{esc(t.get("ph",""))}"></textarea>')
            if t.get('help'): out.append(f' <p class="hint" data-lw="sicher"><strong>Satzanfänge:</strong> {t["help"]}</p>')
            out.append(f' <button class="btn" type="button" data-check="{i}">Gewichtung prüfen</button>')
        else:
            out.append(f' <button class="btn" type="button" data-check="{i}">Reihenfolge prüfen</button><button class="btn sec" type="button" data-reset="{i}">Neu mischen</button>')
    elif ty == 'hot':
        out.append(f' <h3>Suchauftrag</h3><p id="ht-{i}">Tippe im Bild auf den gesuchten Bereich.</p>')
        out.append(f' <div class="chips" id="ha-{i}" aria-label="Auswahl, gleichwertig zum Antippen im Bild"></div>')
        out.append(f' <button class="btn sec" type="button" data-reset="{i}">Aufgabe zurücksetzen</button>')
    elif ty == 'gap':
        out.append(f' <p>{t["frage"]}</p>')
        parts = t['text'].split('{}')
        s = parts[0]
        for k, g in enumerate(t['gaps']):
            opts = ''.join(f'<option value="{esc(o)}">{o}</option>' for o in g['opts'])
            s += f'<select id="sel-{i}-{k}" aria-label="Lücke {k+1}"><option value="">Bitte wählen</option>{opts}</select>' + parts[k+1]
        out.append(f' <p class="gaptext">{s}</p>')
        out.append(f' <button class="btn" type="button" data-check="{i}">Lückentext prüfen</button>')
    elif ty == 'match':
        out.append(f' <p>{t["frage"]}</p>')
        if t.get('persons_html'): out.append(t['persons_html'])
        out.append(' <div class="selrows">')
        for k, r in enumerate(t['rows']):
            opts = ''.join(f'<option value="{esc(o)}">{o}</option>' for o in t['choices'])
            out.append(f'  <div class="selrow"><p id="lb-{i}-{k}">{r[0]}</p><select id="sel-{i}-{k}" aria-labelledby="lb-{i}-{k}"><option value="">Bitte wählen</option>{opts}</select></div>')
        out.append(' </div>')
        out.append(f' <button class="btn" type="button" data-check="{i}">Prüfen</button>')
    elif ty == 'text':
        out.append(f' <label class="legend" for="tx-{i}">{t["frage"]}</label><textarea id="tx-{i}" placeholder="{esc(t.get("ph",""))}"></textarea>')
        if t.get('help'): out.append(f' <p class="hint" data-lw="sicher"><strong>Satzanfänge:</strong> {t["help"]}</p>')
        out.append(' <p class="hint">Offene Antworten werden zusätzlich von der Lehrkraft gelesen.</p>')
        out.append(f' <button class="btn" type="button" data-check="{i}">Antwort prüfen</button>')
    if t.get('post'): out.append(t['post'])
    out.append(f' <div class="fb" id="fb-{i}" role="status" aria-live="polite"></div>')
    out.append('</div>')
    return '\n'.join(out)

def js_task(t):
    """Nur die Daten, die das Skript braucht."""
    keep = {k: v for k, v in t.items() if k not in ('pre', 'post', 'opts_html', 'persons_html', 'frage', 'tag', 'svg', 'text', 'ph', 'help', 'why')}
    if t['type'] == 'single' or t['type'] == 'multi':
        keep['opts'] = [o[0] for o in t['opts']]
    if t['type'] in ('gap',):
        keep['right'] = [g['right'] for g in t['gaps']]; keep.pop('gaps', None)
    if t['type'] == 'match':
        keep['right'] = [r[1] for r in t['rows']]; keep['rows'] = len(t['rows']); keep.pop('choices', None)
    return keep

def page(M):
    N = M['num']
    tasks = []
    for s in M['sections']:
        for t in s.get('tasks', []):
            tasks.append(t)
    nav = [('start', 'Start'), ('mission', 'Die Mission'), ('diagnose', 'Was glaubst du?')] + \
          [(s['id'], s['nav']) for s in M['sections']] + \
          [('glossar', 'Fachwörter'), ('lerncheck', 'Lerncheck'), ('abschluss', 'Abschlussmission'), ('ergebnis', 'Ergebnis')]
    h = []
    h.append(f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#8a4317">
<meta name="description" content="SOL Geschichte Jahrgang {J}, Modul {N}: {esc(M['titel'])}">
<title>SOL Geschichte {J} | Modul {N} | {esc(M['titel'])}</title>
<style>{CSS}</style>
{EBSEND}
</head>
<body class="lw-standard">
<header>
 <div class="shell">
  <div class="topline">
   <div>SOL Geschichte {J} · Oberschule Niedersachsen</div>
   <div class="tools" aria-label="Lesehilfen">
    <button type="button" id="easyBtn" aria-pressed="false">Leichter lesen</button>
    <button type="button" id="speakBtn">Vorlesen</button>
    <button type="button" id="stopBtn">Stopp</button>
   </div>
  </div>
  <div class="hero">
   <div>
    <div class="eyebrow">{M['bereich']} · Ermittlungsakte {N}</div>
    <h1>{M['titel']}</h1>
    <p>{M['intro']}</p>
   </div>
   <div class="badge"><span>Modul</span><strong>{N}</strong><span>45 bis 60 Minuten</span></div>
  </div>
 </div>
</header>
<div class="progress"><div class="shell"><div class="track" role="progressbar" aria-label="Lernfortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="pbar"><div class="bar" id="pfill"></div></div><div class="ptext" id="ptext">0 Schritte</div></div></div>
<div class="layout">
<aside class="side no-print"><nav aria-label="Modulabschnitte">
''' + '\n'.join(f' <a href="#{a}">{b}</a>' for a, b in nav) + '''
</nav></aside>
<main id="content">
''')
    goals = '\n'.join(f' <li>{g}</li>' for g in M['ziele'])
    h.append(f'''
<section class="card" id="start">
<h2>Bevor du beginnst</h2>
<div class="grid2">
 <div class="field"><label for="name">Name oder Lerncode</label><input type="text" id="name" autocomplete="name" maxlength="80" required><span class="hint">Wenn du deinen Namen nicht eingeben möchtest, nutze deinen Lerncode.</span></div>
 <div class="field"><label for="klasse">Klasse</label><input type="text" id="klasse" maxlength="30" required placeholder="zum Beispiel 5a"><span class="hint">Möglich sind zum Beispiel 5a, Klasse 5a, R5a oder nur 5.</span></div>
 <div class="field"><label for="email">E-Mail-Adresse</label><input type="email" id="email" autocomplete="email" maxlength="120" required><span class="hint">An diese Adresse kann deine Rückmeldung gehen.</span></div>
 <fieldset class="field" style="border:0;padding:0;margin:0"><legend class="legend">Mein Lernweg</legend>
  <div class="chips" role="radiogroup" aria-label="Lernweg wählen">
   <button type="button" class="chip" data-lwbtn="sicher" aria-pressed="false">Sicher werden</button>
   <button type="button" class="chip" data-lwbtn="standard" aria-pressed="true">Standard</button>
   <button type="button" class="chip" data-lwbtn="weiter" aria-pressed="false">Weiterdenken</button>
  </div>
  <p class="hint" id="lwInfo">Standard: ausgewogene Mischung aus Erklärung und eigener Arbeit.</p>
 </fieldset>
</div>
<h3>{M.get('ziele_titel','Das lernst du in diesem Modul')}</h3>
<ul>
{goals}
</ul>
<div class="notice privacy"><strong>Datenschutz:</strong> Deine Eingaben werden nur auf diesem Gerät gespeichert, damit du später weiterarbeiten kannst. Erst wenn du am Ende auf „Ergebnis an die Lehrkraft senden“ tippst, werden die angezeigten Angaben übertragen. Es gibt keine Werbung, kein Tracking und keine Weitergabe an Dritte. Mit „Gespeicherten Stand löschen“ entfernst du alles wieder von diesem Gerät.</div>
<button class="btn" type="button" id="startBtn">Ermittlung starten</button>
<button class="btn danger" type="button" id="clearBtn">Gespeicherten Stand löschen</button>
<div class="fb" id="startFb" role="status" aria-live="polite"></div>
</section>

<section class="card" id="mission">
<h2>Die Mission</h2>
{M['mission_pre']}
<div class="akte">
 <span class="stamp">Akte {N}</span>
 <p><strong>Fall:</strong> {M['fall']}</p>
 <p><strong>Dein Auftrag:</strong> {M['auftrag']}</p>
</div>
{chronos(M['chronos'])}
<p><strong>Leitfrage:</strong> {M['titel'] if not M['titel'].startswith('Lerncheck') else M['leitfrage']}</p>
<div class="badges" aria-label="Deine Abzeichen">
''' + '\n'.join(f' <span class="abz" id="abz{k+1}">{b[0]}</span>' for k, b in enumerate(M['badges'])) + '''
</div>
</section>
''')
    # Diagnose
    d = []
    for k, q in enumerate(M['diagnose']):
        opts = '\n'.join(f'   <label><input type="radio" name="d{k+1}" value="{o[0]}"><span>{o[1]}</span></label>' for o in q['opts'])
        d.append(f'''<div class="task">
 <span class="tag">{q['tag']}</span>
 <fieldset><legend class="legend">D{k+1}. {q['frage']}</legend>
  <div class="opts">
{opts}
  </div>
 </fieldset>
</div>''')
    h.append(f'''
<section class="card" id="diagnose">
<h2>{M.get('diag_titel','Was glaubst du?')}</h2>
<p>{M.get('diag_intro','Drei kurze Fragen zum Einstieg. Sie werden nicht benotet und helfen dir nur bei der Einschätzung.')}</p>
''' + '\n'.join(d) + '''
<button class="btn" type="button" id="dCheck">Einschätzung auswerten</button>
<div class="fb" id="dFb" role="status" aria-live="polite"></div>
</section>
''')
    for s in M['sections']:
        h.append(f'\n<section class="card" id="{s["id"]}">\n<h2>{s["h2"]}</h2>\n{s.get("pre","")}\n')
        for t in s.get('tasks', []):
            if t['type'] == 'hot':
                h.append(t['svg'])
            h.append(render_task(t))
        h.append(s.get('post', '') + '\n</section>\n')
    gl = '\n'.join(f'<details class="gloss"><summary>{a}</summary><div class="body">{b}</div></details>' for a, b in M['glossar'])
    h.append(f'\n<section class="card" id="glossar">\n<h2>Fachwörter</h2>\n<p>Tippe auf ein Wort, um die Erklärung zu öffnen.</p>\n{gl}\n</section>\n')
    lc = '\n'.join(f''' <div class="task"><fieldset><legend class="legend">{a}</legend>
  <div class="scale"><label><input type="radio" name="lc{k+1}" value="Noch unsicher">Noch unsicher</label><label><input type="radio" name="lc{k+1}" value="Geht schon">Geht schon</label><label><input type="radio" name="lc{k+1}" value="Sicher">Sicher</label></div></fieldset></div>''' for k, a in enumerate(M['lerncheck']))
    h.append(f'''
<section class="card" id="lerncheck">
<h2>Mein Lerncheck</h2>
<p>Wähle für jede der drei Aussagen genau eine Antwort. Das ist keine Note, sondern deine eigene Einschätzung.</p>
<div id="selfcheck">
{lc}
</div>
<div class="grid2">
 <div class="field"><label for="rCan">Das habe ich heute verstanden</label><textarea id="rCan"></textarea></div>
 <div class="field"><label for="rHard">Das fiel mir noch schwer</label><textarea id="rHard"></textarea></div>
</div>
<div class="field"><label for="rOpen">Diese Frage ist bei mir noch offen</label><textarea id="rOpen"></textarea></div>
<p class="hint">Schreibe hier nichts Privates. Es geht nur um dein Lernen im Fach Geschichte.</p>
</section>
''')
    A = M['abschluss']
    aopts = '\n'.join(f'   <label><input type="radio" name="a1" value="{o[0]}"><span>{o[1]}</span></label>' for o in A['opts'])
    h.append(f'''
<section class="card" id="abschluss">
<h2>{A['h2']}</h2>
<div class="akte">
 <span class="stamp">Zu prüfen</span>
 <p>{A['karte']}</p>
</div>
{A.get('pre','')}
<div class="task">
 <span class="tag">Entscheidung</span>
 <fieldset><legend class="legend">A1. {A['frage']}</legend>
  <div class="opts">
{aopts}
  </div>
 </fieldset>
 <div class="fb" id="a1Fb" role="status" aria-live="polite"></div>
</div>
<div class="task">
 <span class="tag">Begründung</span>
 <label class="legend" for="a2">A2. {A['a2']}</label>
 <textarea id="a2" placeholder="{esc(A['ph'])}"></textarea>
 <p class="hint" data-lw="sicher"><strong>Satzanfänge:</strong> {A['help']}</p>
 <p class="hint">Achte auf: mindestens zwei Sätze, Verknüpfungswörter wie „weil“ oder „deshalb“ und passende Fachbegriffe. Offene Antworten werden zusätzlich von der Lehrkraft gelesen.</p>
 <button class="btn gold" type="button" id="a2Check">Nachricht prüfen</button>
 <div class="fb" id="a2Fb" role="status" aria-live="polite"></div>
</div>
{A.get('post','')}
</section>

<section class="card" id="ergebnis">
<h2>Dein Ergebnis</h2>
<p class="notice"><strong>So gibst du ab:</strong> Schritt 1: „Ergebnis erstellen“. Danach erscheint deine Auswertung und der Knopf zum Senden (Schritt 2).</p>
<button class="btn" type="button" id="buildBtn">Ergebnis erstellen</button>
<div class="result" id="resultPanel">
 <div class="score">
  <div class="ring" id="ring"><i id="ringTxt">0</i></div>
  <div>
   <p><span class="lamp" id="lamp"></span><strong id="lampTxt">Noch nicht ausgewertet</strong></p>
   <p id="empfehlung"></p>
  </div>
 </div>
 <h3>Aufgabenüberblick</h3>
 <ul id="analyse"></ul>
 <h3>Zusammenfassung für die Lehrkraft</h3>
 <div class="pay" id="summary"></div>
 <div class="no-print">
  <button class="btn sec" type="button" id="copyBtn">Zusammenfassung kopieren</button>
  <button class="btn sec" type="button" onclick="window.print()">Drucken</button>
 </div>
 <h3>Welche Daten werden gesendet?</h3>
 <p>Zeitstempel, Name oder Lerncode, Klasse, E-Mail, Modulnummer und Modultitel, Themenbereich, Lernweg, Fortschritt, die Ergebnisse aller Aufgaben, deine Freitexte, der Lerncheck, die Gesamtpunktzahl und Hinweise auf Auffälligkeiten. Keine versteckten Gerätedaten.</p>
 <button class="btn gold" type="button" id="sendBtn">Ergebnis an die Lehrkraft senden</button>
 <button class="btn sec" type="button" id="retryBtn" hidden>Erneut senden</button>
 <div class="fb" id="sendFb" role="status" aria-live="polite"></div>
</div>
</section>
</main></div>
<footer>SOL Geschichte {J} · Modul {N} · Keine Cookies, kein Tracking · Dr. Edmund Bruns</footer>
<form name="sol-geschichte-{J}" method="POST" data-netlify="true" netlify-honeypot="bot-field" hidden>
 <input name="form-name" value="sol-geschichte-{J}"><input name="bot-field">
 <input name="payload"><input name="modul_id"><input name="name"><input name="klasse"><input name="email"><input name="lernweg"><input name="punkte"><input name="zusammenfassung">
</form>
''')
    cfg = {
        'modul': N, 'titel': M['titel'], 'bereich': M['bereich'], 'version': '1.0.0',
        'key': f'sol-geschichte-{J}-{N}', 'endpoint': ENDPOINT,
        'jahrgang': J,
        'diag': [q['right'] for q in M['diagnose']], 'diagMsg': M['diag_msg'],
        'tasks': [js_task(t) for t in tasks],
        'badges': [b[1] for b in M['badges']], 'badgeMsg': [b[0] for b in M['badges']],
        'a1right': A['right'], 'a1fb': A['fb'], 'a2': A['crit'],
        'next': M['next'], 'lwWeiter': M['lw_weiter'],
    }
    cj = json.dumps(cfg, ensure_ascii=False).replace('</', '<\\/')
    h.append('<script>\n"use strict";\nconst CFG=' + cj + ';\n' + open(os.path.join(os.path.dirname(__file__), 'engine.js'), encoding='utf-8').read() + '\n</script>\n</body>\n</html>\n')
    return ''.join(h)

if __name__ == '__main__':
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    for n in sys.argv[1:]:
        mod = importlib.import_module('m' + n)
        out = page(mod.M)
        d = ROOT + f'upload/geschichte/klasse-{J}/{n}'
        os.makedirs(d, exist_ok=True)
        open(d + '/index.html', 'w', encoding='utf-8').write(out)
        print(n, len(out.encode()), 'Bytes')
