# -*- coding: utf-8 -*-
"""Gemeinsamer Baukasten fuer SOL-Geschichte Jahrgang 8 (Module 001 bis 007).
Erzeugt eigenstaendige HTML-Dateien nach der Vorlage klasse-6/004."""
import json, html, re, os

ROOT = '/tmp/claude-0/-home-claude/e3cb1aec-9a36-5edf-8129-346c7c0e3f39/scratchpad/'
J = '8'
ENDPOINT = "https://script.google.com/macros/s/AKfycbxW2bLm50-p5pe5bVAzRtLPVPYWJ3g8vy1igABoN3LWr1FxzHsRkFWJSNrPLZYw-W7F6Q/exec"
BEREICH = "Industrialisierung und soziale Frage"

def esc(s):
    return html.escape(s, quote=True)

CSS = r"""
:root{--ink:#14232d;--paper:#fff;--cream:#e7ecf0;--soft:#e7ecf0;--bg:#f4f2ec;--green:#37546b;--gold:#aa6d18;--gold-text:#8f5a12;--red:#9b352d;--blue:#1168c4;--line:#d4d8dc;--ok:#1d6b4f;--okbg:#eaf4ef;--warn:#7a4b12;--warnbg:#fdf5e7;--bad:#9b352d;--badbg:#fbeeee;--shadow:0 14px 40px #14232d14;--radius:18px;--focus:#1168c4}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.58 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;overflow-x:hidden}
button,input,select,textarea{font:inherit}
button,input,select,textarea{min-height:44px}
button{cursor:pointer}
a{color:var(--blue)}
:focus-visible{outline:4px solid var(--focus);outline-offset:3px;border-radius:6px}
header{background:linear-gradient(130deg,#18242e,#37546b);color:#f6f9fb;padding:20px 16px 26px}
.shell{max-width:1040px;margin:auto}
.topline{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;font-weight:700;letter-spacing:.02em}
.tools{display:flex;gap:8px;flex-wrap:wrap}
.tools button{background:#f6f9fb;color:#18242e;border:0;border-radius:12px;padding:9px 12px;font-weight:750;min-height:44px}
.hero{margin-top:18px;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:end}
@media(max-width:720px){.hero{grid-template-columns:1fr}}
.eyebrow{font-weight:800;color:#e9c98f;text-transform:uppercase;letter-spacing:.09em;font-size:.8rem}
.hero h1{font-size:clamp(1.7rem,4.4vw,2.9rem);line-height:1.08;margin:.3rem 0}
.hero p{margin:.4rem 0;color:#e6eef3;max-width:66ch}
.badge{background:#ffffff22;border:1px solid #ffffff55;border-radius:16px;padding:14px 16px;text-align:center;min-width:120px}
.badge strong{display:block;font-size:1.9rem;line-height:1}
.progress{position:sticky;top:0;z-index:20;background:#fffffff2;border-bottom:1px solid var(--line);backdrop-filter:blur(6px)}
.progress .shell{display:flex;align-items:center;gap:12px;padding:8px 16px}
.track{flex:1;height:12px;background:var(--cream);border-radius:999px;overflow:hidden;border:1px solid var(--line)}
.bar{height:100%;width:0;background:linear-gradient(90deg,#2c4a60,#b87824);transition:width .35s}
.ptext{font-weight:750;font-size:.9rem;white-space:nowrap}
.layout{max-width:1040px;margin:22px auto;padding:0 16px;display:grid;grid-template-columns:210px minmax(0,1fr);gap:20px;align-items:start}
@media(max-width:900px){.layout{grid-template-columns:minmax(0,1fr)}.side{position:static!important}}
.side{position:sticky;top:64px;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:10px;box-shadow:var(--shadow)}
.side nav{display:grid;gap:2px}
.side a{display:block;padding:9px 10px;border-radius:10px;text-decoration:none;color:#28343d;font-weight:650;font-size:.94rem}
.side a:hover{background:var(--cream)}
.card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:20px;margin-bottom:18px;box-shadow:var(--shadow);min-width:0}
@media(max-width:480px){.card{padding:16px 14px}}
.card h2{margin:.1rem 0 .7rem;font-size:1.35rem;color:var(--green)}
.card h3{margin:1.1rem 0 .4rem;font-size:1.08rem;color:#28343d}
.chronos{display:flex;gap:12px;align-items:flex-start;background:var(--cream);border:1px solid var(--line);border-left:6px solid var(--gold);border-radius:14px;padding:12px 14px;margin:12px 0}
.chronos .av{flex:0 0 46px}
.chronos p{margin:.15rem 0}
.chronos .who{font-weight:800;color:var(--gold-text)}
.akte{border:2px dashed var(--gold);border-radius:14px;padding:14px;background:#fdf8ee;margin:12px 0}
.akte .stamp{display:inline-block;border:2px solid var(--red);color:var(--red);font-weight:800;letter-spacing:.12em;padding:3px 9px;border-radius:6px;transform:rotate(-3deg);font-size:.78rem}
.notice{background:var(--cream);border:1px solid var(--line);border-left:5px solid var(--blue);border-radius:12px;padding:12px 14px;margin:12px 0}
.notice.warn{border-left-color:var(--gold);background:var(--warnbg)}
.notice.privacy{border-left-color:var(--green);font-size:.94rem}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.field{display:grid;gap:5px;min-width:0}
.field label,.legend{font-weight:750;color:#28343d}
input[type=text],input[type=email],select,textarea{width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:12px;background:#fff}
textarea{min-height:96px;resize:vertical}
.hint{font-size:.88rem;color:#56616a}
.btn{background:var(--green);color:#f6f9fb;border:0;border-radius:12px;padding:12px 16px;font-weight:750;margin:6px 6px 0 0}
.btn.sec{background:#fff;color:var(--green);border:1px solid var(--green)}
.btn.gold{background:var(--gold)}
.btn.danger{background:#fff;color:var(--red);border:1px solid var(--red)}
.btn:disabled{opacity:.55;cursor:not-allowed}
.fb{display:none;margin-top:11px;padding:12px;border-radius:12px;font-weight:680}
.fb.show{display:block}
.fb.ok{color:var(--ok);background:var(--okbg);border:1px solid #9ccbb0}
.fb.hint{color:var(--warn);background:var(--warnbg);border:1px solid #e8c99a}
.fb.bad{color:var(--bad);background:var(--badbg);border:1px solid #ddaaaa}
.task{border:1px solid var(--line);border-radius:14px;padding:14px;margin:14px 0;background:#fff;min-width:0}
@media(max-width:480px){.task{padding:12px 10px}}
.task .tag{display:inline-block;background:var(--cream);border:1px solid var(--line);border-radius:999px;padding:3px 11px;font-size:.78rem;font-weight:800;color:#56616a;letter-spacing:.04em}
.opts{display:grid;gap:8px;margin-top:8px}
.opts label{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:12px;padding:11px 12px;background:#fff;cursor:pointer}
.opts label:hover{background:var(--cream)}
.opts input{margin-top:3px;min-height:auto;width:20px;height:20px;flex:0 0 auto}
fieldset{min-width:0}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
.chip{border:2px solid var(--line);background:#fff;border-radius:999px;padding:9px 14px;font-weight:700;min-height:44px}
.chip[aria-pressed=true]{border-color:var(--green);background:#e6edf3}
.chip.ok{border-color:var(--ok);background:var(--okbg)}
.chip.no{border-color:var(--bad);background:var(--badbg)}
.zones{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:10px}
.zones.z4{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.zones.z3{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}
.task>label.legend{display:block;margin:8px 0 4px}
.zone{border:2px dashed var(--line);border-radius:14px;padding:10px;background:#fff;min-height:104px;cursor:pointer}
.zone.over{border-color:var(--gold);background:#fffaf0}
.zone h4{margin:.1rem 0 .5rem;font-size:.98rem;color:var(--green)}
.zone .drop{display:flex;flex-wrap:wrap;gap:6px;min-height:44px}
.piece{border:2px solid var(--line);background:#fff;border-radius:10px;padding:8px 11px;font-weight:650;min-height:44px;display:inline-flex;align-items:center;gap:6px;text-align:left;max-width:100%;color:var(--ink)}
.piece[aria-pressed=true]{border-color:var(--gold);background:#fffaf0;box-shadow:0 0 0 3px #aa6d1833}
.piece.ok{border-color:var(--ok);background:var(--okbg)}
.piece.no{border-color:var(--bad);background:var(--badbg)}
.piece.ok::after,.chip.ok::after{content:' \2713';font-weight:900;color:var(--ok)}
.piece.no::after,.chip.no::after{content:' \2717';font-weight:900;color:var(--bad)}
.order{display:grid;gap:8px;margin:10px 0}
.orow{display:flex;gap:8px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:9px 10px;background:#fff}
.orow .nr{flex:0 0 auto;width:28px;height:28px;border-radius:50%;background:var(--cream);display:grid;place-items:center;font-weight:800;font-size:.85rem;color:var(--green)}
.orow span.t{flex:1;font-weight:650;min-width:0}
.orow button{width:44px;min-height:44px;border:1px solid var(--line);background:var(--cream);border-radius:10px;font-size:1.1rem;font-weight:800;flex:0 0 auto}
.orow.ok{border-color:var(--ok);background:var(--okbg)}
.svgwrap{border:1px solid var(--line);border-radius:14px;background:#fff;padding:8px;margin-top:10px;overflow:hidden}
svg.pic{width:100%;height:auto;display:block;touch-action:manipulation}
.hot{cursor:pointer;transition:filter .15s}
.svgwrap .hot:hover{filter:drop-shadow(0 0 5px #aa6d18aa)}
.hot.found{filter:drop-shadow(0 0 6px #17633b)}
.hot:focus-visible{outline:4px solid var(--focus)}
.legendlist{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.legendlist span{font-size:.86rem;border:1px solid var(--line);border-radius:999px;padding:4px 10px;background:var(--cream)}
details.gloss{border:1px solid var(--line);border-radius:12px;background:#fff;margin:8px 0}
details.gloss>summary{cursor:pointer;padding:11px 13px;font-weight:750;color:var(--green);list-style:none;display:flex;gap:9px;align-items:center;min-height:44px}
details.gloss>summary::-webkit-details-marker{display:none}
details.gloss>summary::before{content:'+';font-weight:900;color:var(--gold-text);width:1.1em;text-align:center}
details.gloss[open]>summary::before{content:'\2212'}
details.gloss .body{padding:0 13px 13px;color:#36434c}
.scale{display:flex;gap:8px;flex-wrap:wrap}
.scale label{flex:1 1 120px;border:1px solid var(--line);border-radius:12px;padding:10px;text-align:center;background:#fff;cursor:pointer;font-weight:700}
.scale input{margin-right:6px;min-height:auto}
.result{display:none;margin-top:14px}
.result.show{display:block}
.score{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.ring{width:120px;height:120px;border-radius:50%;background:conic-gradient(var(--green) var(--p,0%),var(--cream) 0);display:grid;place-items:center;font-weight:900;font-size:1.2rem;color:var(--green)}
.ring i{background:var(--paper);width:88px;height:88px;border-radius:50%;display:grid;place-items:center;font-style:normal}
.lamp{width:18px;height:18px;border-radius:50%;display:inline-block;background:#bbb;margin-right:8px;border:1px solid #0002;vertical-align:middle}
.lamp.g{background:#2f8f5b}.lamp.y{background:#d8a325}.lamp.r{background:#b6483f}
.pay{background:#1f2a33;color:#e7eef3;border-radius:12px;padding:12px;font:13px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;word-break:break-word;max-height:260px;overflow:auto}
.badges{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.abz{border:2px solid var(--line);border-radius:12px;padding:8px 12px;font-weight:800;color:#80878d;background:#fff;font-size:.9rem}
.abz.on{border-color:var(--gold);color:var(--gold-text);background:#fffaf0}
blockquote.q{margin:10px 0;padding:10px 14px;border-left:4px solid var(--green);background:#fff;border-radius:0 10px 10px 0}
blockquote.q p{margin:.35rem 0}
.orig{font-size:.9rem;color:#56616a;font-style:italic}
.cloze{line-height:2.4}
.cloze select{width:auto;max-width:100%;display:inline-block;margin:2px 3px;padding:6px 8px;border-radius:10px;border:2px solid var(--line);background:#fff;font-weight:700;min-height:44px}
.cloze select.ok{border-color:var(--ok);background:var(--okbg)}
.cloze select.no{border-color:var(--bad);background:var(--badbg)}
.tbl{width:100%;border-collapse:collapse;font-size:.95rem;margin:8px 0}
.tbl th,.tbl td{border-bottom:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:top}
.tbl th{background:var(--cream);font-weight:800}
.tbl td.n,.tbl th.n{text-align:right;white-space:nowrap}
.tblwrap{overflow-x:auto;max-width:100%}
.wort{font-size:.9rem;color:#36434c}
footer{max-width:1040px;margin:10px auto 40px;padding:0 16px;color:#56616a;font-size:.9rem}
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

CHRONOS_AV = '<svg width="46" height="46" aria-hidden="true" focusable="false" viewBox="0 0 46 46"><circle cx="23" cy="23" r="22" fill="#e7ecf0" stroke="#aa6d18" stroke-width="2"/><circle cx="23" cy="18" r="7" fill="#37546b"/><path d="M9 40c2-9 8-13 14-13s12 4 14 13" fill="#37546b"/><path d="M14 14c4-6 14-6 18 0" stroke="#aa6d18" stroke-width="2" fill="none"/></svg>'

def chronos(text, who="Chronos, Archivar"):
    return f'<div class="chronos"><div class="av">{CHRONOS_AV}</div><div><p class="who">{who}</p><p>{text}</p></div></div>'


class Modul:
    def __init__(self, nr, titel, kurz, eyebrow, hero, next_txt, badges=None, sensibel=False):
        self.nr = nr; self.titel = titel; self.kurz = kurz; self.eyebrow = eyebrow
        self.hero = hero; self.next_txt = next_txt; self.badges = badges or []
        self.sensibel = sensibel
        self.tasks = []        # Konfiguration fuer JS
        self.sections = []     # (id, navtitel, html)
        self.diag = None; self.abs = None
        self.lc = []

    # ---------- Bausteine ----------
    def _reg(self, cfg):
        self.tasks.append(cfg); return cfg

    def mc(self, id, legend, opts, richtig, fbs, name, komp, tag="Auswahl", zusatz=False):
        """opts: list of (value, text). fbs: dict value->Rueckmeldung"""
        self._reg(dict(id=id, typ='mc', richtig=richtig, fb=fbs, name=name, komp=komp, zusatz=zusatz))
        o = ''.join(f'<label><input type="radio" name="{id}" value="{v}"><span>{t}</span></label>' for v, t in opts)
        return (f'<div class="task"><span class="tag">{tag}</span>'
                f'<fieldset style="border:0;padding:0;margin:0"><legend class="legend">{legend}</legend><div class="opts">{o}</div></fieldset>'
                f'<button class="btn" type="button" id="{id}Check">Prüfen</button>'
                f'<div class="fb" id="{id}Fb" role="status" aria-live="polite"></div></div>')

    def multi(self, id, legend, opts, richtig, ok, hinweis, name, komp, fehlt="Es fehlen noch # zutreffende Antworten. ", tipp="", tag="Mehrfachauswahl"):
        self._reg(dict(id=id, typ='multi', richtig=richtig, ok=ok, hinweis=hinweis, fehlt=fehlt, tipp=tipp, name=name, komp=komp))
        o = ''.join(f'<label><input type="checkbox" name="{id}" value="{v}"><span>{t}</span></label>' for v, t in opts)
        return (f'<div class="task"><span class="tag">{tag}</span>'
                f'<fieldset style="border:0;padding:0;margin:0"><legend class="legend">{legend}</legend><div class="opts">{o}</div></fieldset>'
                f'<button class="btn" type="button" id="{id}Check">Prüfen</button>'
                f'<button class="btn sec" type="button" id="{id}Reset">Zurücksetzen</button>'
                f'<div class="fb" id="{id}Fb" role="status" aria-live="polite"></div></div>')

    def zuord(self, id, zones, pieces, ok, hint, name, komp, hilfe=None, tag="Zuordnen", intro=""):
        """zones: list (key, titel); pieces: list (text, zonekey)"""
        pcs = [dict(k=f'{id}k{i+1}', t=t, z=z) for i, (t, z) in enumerate(pieces)]
        self._reg(dict(id=id, typ='zuord', pieces=pcs, ok=ok, hint=hint, name=name, komp=komp, zones=[z for z, _ in zones]))
        zh = ''.join(f'<div class="zone" data-task="{id}" data-zone="{k}" tabindex="0" role="button" aria-label="Ablegen bei {esc(t)}"><h4>{t}</h4><div class="drop"></div></div>' for k, t in zones)
        h = (f'<div class="task"><span class="tag">{tag}</span>{intro}'
             f'<p class="hint">Tippe eine Karte an und danach das passende Feld. Mit der Maus kannst du die Karten auch ziehen. Eine falsch abgelegte Karte kannst du wieder antippen und neu ablegen.</p>'
             f'<div class="chips" id="{id}Pieces" aria-label="Karten zum Zuordnen"></div>'
             f'<div class="zones z{len(zones)}">{zh}</div>'
             f'<button class="btn" type="button" id="{id}Check">Zuordnung prüfen</button>'
             f'<button class="btn sec" type="button" id="{id}Reset">Zurücksetzen</button>'
             f'<div class="fb" id="{id}Fb" role="status" aria-live="polite"></div>')
        if hilfe:
            h += f'<div class="notice" data-lw="sicher"><strong>Hilfe:</strong> {hilfe}</div>'
        return h + '</div>'

    def order(self, id, items, ok, hint, name, komp, tag="Reihenfolge", intro=""):
        self._reg(dict(id=id, typ='order', items=items, ok=ok, hint=hint, name=name, komp=komp))
        return (f'<div class="task"><span class="tag">{tag}</span>{intro}'
                f'<div class="order" id="{id}List" aria-label="Liste zum Ordnen"></div>'
                f'<button class="btn" type="button" id="{id}Check">Reihenfolge prüfen</button>'
                f'<button class="btn sec" type="button" id="{id}Reset">Neu mischen</button>'
                f'<div class="fb" id="{id}Fb" role="status" aria-live="polite"></div></div>')

    def hot(self, id, finds, alle, done, name, komp, tag="Kartenarbeit", titel="Suchauftrag"):
        """finds: list (ziel_id, tipp, ok); alle: list (id, name)"""
        self._reg(dict(id=id, typ='hot', finds=[dict(z=z, tipp=t, ok=o) for z, t, o in finds],
                       alle=[dict(id=i, n=n) for i, n in alle], done=done, name=name, komp=komp))
        return (f'<div class="task"><span class="tag">{tag}</span><h3>{titel}</h3>'
                f'<p id="{id}Task">Tippe im Bild auf den gesuchten Ort.</p>'
                f'<div class="chips" id="{id}Alt" aria-label="Auswahl, gleichwertig zum Antippen im Bild"></div>'
                f'<button class="btn sec" type="button" id="{id}Reset">Aufgabe zurücksetzen</button>'
                f'<div class="fb" id="{id}Fb" role="status" aria-live="polite"></div></div>')

    def luecke(self, id, parts, ok, hint, name, komp, tag="Lückentext", intro=""):
        """parts: list of strings and tuples (richtig, [falsch...]) """
        richtig = []; out = []; n = 0
        for p in parts:
            if isinstance(p, str):
                out.append(p)
            else:
                r, falsch = p
                opts = sorted([r] + list(falsch), key=lambda s: (len(s) * 7 + sum(map(ord, s))) % 11)
                sel = ''.join(f'<option value="{esc(o)}">{o}</option>' for o in opts)
                out.append(f'<select id="{id}_{n}" aria-label="Lücke {n+1}"><option value="">bitte wählen</option>{sel}</select>')
                richtig.append(r); n += 1
        self._reg(dict(id=id, typ='luecke', richtig=richtig, ok=ok, hint=hint, name=name, komp=komp))
        return (f'<div class="task"><span class="tag">{tag}</span>{intro}<p class="cloze">{"".join(out)}</p>'
                f'<button class="btn" type="button" id="{id}Check">Prüfen</button>'
                f'<div class="fb" id="{id}Fb" role="status" aria-live="polite"></div></div>')

    def text(self, id, legend, placeholder, krit, name, komp, tag="Weiterdenken", zusatz=True, sicher=None, lw='weiter'):
        self._reg(dict(id=id, typ='text', krit=krit, name=name, komp=komp, zusatz=zusatz))
        attr = f' data-lw="{lw}"' if lw else ''
        h = (f'<div class="task"{attr}><span class="tag">{tag}</span>'
             f'<label class="legend" for="{id}">{legend}</label>'
             f'<textarea id="{id}" placeholder="{esc(placeholder)}"></textarea>')
        if sicher:
            h += f'<p class="hint" data-lw="sicher"><strong>Satzanfänge:</strong> {sicher}</p>'
        h += (f'<p class="hint">Offene Antworten werden zusätzlich von der Lehrkraft gelesen.</p>'
              f'<button class="btn" type="button" id="{id}Check">Antwort prüfen</button>'
              f'<div class="fb" id="{id}Fb" role="status" aria-live="polite"></div></div>')
        return h

    def section(self, id, nav, h2, body):
        self.sections.append((id, nav, f'<section class="card" id="{id}">\n<h2>{h2}</h2>\n{body}\n</section>'))


# ---------------- Feste Abschnitte ----------------

def start_section(m, ziele, startlabel):
    li = ''.join(f'<li>{z}</li>' for z in ziele)
    return f'''<section class="card" id="start">
<h2>Bevor du beginnst</h2>
<div class="grid2">
 <div class="field"><label for="name">Name oder Lerncode</label><input type="text" id="name" autocomplete="name" maxlength="80" required><span class="hint">Wenn du deinen Namen nicht eingeben möchtest, nutze deinen Lerncode.</span></div>
 <div class="field"><label for="klasse">Klasse</label><input type="text" id="klasse" maxlength="30" required placeholder="zum Beispiel 8a"><span class="hint">Möglich sind zum Beispiel 8a, Klasse 8a, R8a oder nur 8.</span></div>
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
<h3>Das lernst du in diesem Modul</h3>
<ul>{li}</ul>
<div class="notice privacy"><strong>Datenschutz:</strong> Deine Eingaben werden nur auf diesem Gerät gespeichert, damit du später weiterarbeiten kannst. Erst wenn du am Ende auf „Ergebnis an die Lehrkraft senden“ tippst, werden die angezeigten Angaben übertragen. Es gibt keine Werbung, kein Tracking und keine Weitergabe an Dritte. Mit „Gespeicherten Stand löschen“ entfernst du alles wieder von diesem Gerät.</div>
<button class="btn" type="button" id="startBtn">{startlabel}</button>
<button class="btn danger" type="button" id="clearBtn">Gespeicherten Stand löschen</button>
<div class="fb" id="startFb" role="status" aria-live="polite"></div>
</section>'''


def diag_section(m, fragen, msgs, h2="Was glaubst du?", intro="Drei kurze Fragen zum Einstieg. Sie werden nicht benotet und helfen dir nur bei der Einschätzung."):
    """fragen: list of (name, tag, legend, opts[(v,t)], richtig)"""
    h = f'<p>{intro}</p>'
    for n, tag, leg, opts, r in fragen:
        o = ''.join(f'<label><input type="radio" name="{n}" value="{v}"><span>{t}</span></label>' for v, t in opts)
        h += f'<div class="task"><span class="tag">{tag}</span><fieldset style="border:0;padding:0;margin:0"><legend class="legend">{leg}</legend><div class="opts">{o}</div></fieldset></div>'
    h += '<button class="btn" type="button" id="dCheck">Einschätzung auswerten</button><div class="fb" id="dFb" role="status" aria-live="polite"></div>'
    m.diag = dict(fragen=[dict(n=n, r=r) for n, _, _, _, r in fragen], **msgs)
    return f'<section class="card" id="diagnose">\n<h2>{h2}</h2>\n{h}\n</section>'


def glossar_section(begriffe, nachweise):
    g = ''.join(f'<details class="gloss"><summary>{t}</summary><div class="body">{b}</div></details>' for t, b in begriffe)
    nw = ''.join(f'<li>{x}</li>' for x in nachweise)
    g += f'<h3>Woher stammen die Texte?</h3><details class="gloss"><summary>Nachweise der Quellen und Zahlen</summary><div class="body"><ul>{nw}</ul></div></details>'
    return f'<section class="card" id="glossar">\n<h2>Fachwörter</h2>\n{g}\n</section>'


def lerncheck_section(aussagen):
    h = '<p>Wähle für jede der drei Aussagen genau eine Antwort. Das ist keine Note, sondern deine eigene Einschätzung.</p><div id="selfcheck">'
    for i, a in enumerate(aussagen, 1):
        h += (f'<div class="task"><fieldset style="border:0;padding:0;margin:0"><legend class="legend">{a}</legend>'
              f'<div class="scale"><label><input type="radio" name="lc{i}" value="Noch unsicher">Noch unsicher</label>'
              f'<label><input type="radio" name="lc{i}" value="Geht schon">Geht schon</label>'
              f'<label><input type="radio" name="lc{i}" value="Sicher">Sicher</label></div></fieldset></div>')
    h += '''</div>
<div class="grid2">
 <div class="field"><label for="rCan">Das habe ich heute verstanden</label><textarea id="rCan"></textarea></div>
 <div class="field"><label for="rHard">Das fiel mir noch schwer</label><textarea id="rHard"></textarea></div>
</div>
<div class="field"><label for="rOpen">Diese Frage ist bei mir noch offen</label><textarea id="rOpen"></textarea></div>
<p class="hint">Schreibe hier nichts Privates. Es geht nur um dein Lernen im Fach Geschichte.</p>'''
    return f'<section class="card" id="lerncheck">\n<h2>Mein Lerncheck</h2>\n{h}\n</section>'


def abschluss_section(m, h2, akte, a1_legend, a1_opts, a1_ok, a1_fb, a2_legend, a2_placeholder, a2_sicher, krit, extra=""):
    o = ''.join(f'<label><input type="radio" name="a1" value="{v}"><span>{t}</span></label>' for v, t in a1_opts)
    m.abs = dict(ok=a1_ok, fb=a1_fb, krit=krit)
    return f'''<section class="card" id="abschluss">
<h2>{h2}</h2>
<div class="akte"><span class="stamp">Zu prüfen</span>{akte}</div>
<div class="task">
 <span class="tag">Entscheidung</span>
 <fieldset style="border:0;padding:0;margin:0"><legend class="legend">A1. {a1_legend}</legend><div class="opts">{o}</div></fieldset>
 <button class="btn" type="button" id="a1Check">Entscheidung prüfen</button>
 <div class="fb" id="a1Fb" role="status" aria-live="polite"></div>
</div>
<div class="task">
 <span class="tag">Begründung</span>
 <label class="legend" for="a2">A2. {a2_legend}</label>
 <textarea id="a2" placeholder="{esc(a2_placeholder)}"></textarea>
 <p class="hint" data-lw="sicher"><strong>Satzanfänge:</strong> {a2_sicher}</p>
 <p class="hint">Offene Antworten werden zusätzlich von der Lehrkraft gelesen.</p>
 <button class="btn gold" type="button" id="a2Check">Begründung prüfen</button>
 <div class="fb" id="a2Fb" role="status" aria-live="polite"></div>
</div>{extra}
</section>'''


ERGEBNIS = '''<section class="card" id="ergebnis">
<h2>Dein Ergebnis</h2>
<p class="notice"><strong>So gibst du ab:</strong> Schritt 1: „Ergebnis erstellen“. Danach erscheint deine Auswertung und der Knopf zum Senden (Schritt 2).</p>
<button class="btn" type="button" id="buildBtn">Ergebnis erstellen</button>
<div class="fb" id="buildFb" role="status" aria-live="polite"></div>
<div class="result" id="resultPanel">
 <div class="score">
  <div class="ring" id="ring"><i id="ringTxt">0 / 0</i></div>
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
  <button class="btn sec" type="button" id="printBtn">Drucken</button>
 </div>
 <h3>Welche Daten werden gesendet?</h3>
 <p>Zeitstempel, Name oder Lerncode, Klasse, E-Mail, Modulnummer und Modultitel, Themenbereich, Lernweg, Fortschritt, die Ergebnisse aller Aufgaben, deine Freitexte, der Lerncheck, die Gesamtpunktzahl und Hinweise auf Auffälligkeiten. Keine versteckten Gerätedaten.</p>
 <button class="btn gold" type="button" id="sendBtn">Ergebnis an die Lehrkraft senden</button>
 <button class="btn sec" type="button" id="retryBtn" hidden>Erneut senden</button>
 <div class="fb" id="sendFb" role="status" aria-live="polite"></div>
</div>
</section>'''


JS = r"""
"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const CFG=__CFG__;
const TASKS=__TASKS__;
const DIAG=__DIAG__;
const ABS=__ABS__;
const S={lernweg:"standard",done:{},punkte:{},placed:{},order:{},hot:{},fbs:{},texts:{},sent:false,built:false};
const TMAP={};TASKS.forEach(t=>TMAP[t.id]=t);
const PFLICHT=TASKS.filter(t=>!t.zusatz);
const SCHRITTE=["start","diagnose"].concat(PFLICHT.map(t=>t.id),["lerncheck","abschluss"]);
const MAXP=PFLICHT.length+3;

/* ---------- Hilfsfunktionen ---------- */
function fb(id,msg,art){const e=$(id);if(!e)return;e.textContent=msg;e.className="fb show "+(art||"hint");}
function fbClear(id){const e=$(id);if(e){e.className="fb";e.textContent="";}}
function fbT(tid,msg,art){S.fbs[tid]={m:msg,a:art};fb("#"+tid+"Fb",msg,art);}
function fbTClear(tid){delete S.fbs[tid];fbClear("#"+tid+"Fb");}
function norm(t){return String(t||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ß/g,"ss").toLowerCase().trim();}
function hat(t,liste){return liste.some(w=>t.includes(w));}
function saetze(t){return t.split(/[.!?]+/).filter(s=>s.trim().length>8).length;}
function val(n){return (document.querySelector('input[name="'+n+'"]:checked')||{}).value;}
const VERKN=["weil","denn","deshalb","deswegen","dadurch","damit","sodass","so dass","darum","daher","also","trotzdem","aber","jedoch","obwohl","wahrend","einerseits","andererseits"];
function mische(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

/* ---------- Fortschritt und Abzeichen ---------- */
function fortschritt(){
 const n=SCHRITTE.filter(k=>S.done[k]).length, pct=Math.round(n/SCHRITTE.length*100);
 $("#pfill").style.width=pct+"%"; $("#pbar").setAttribute("aria-valuenow",pct);
 $("#ptext").textContent=n+" von "+SCHRITTE.length+" Schritten";
 (CFG.badges||[]).forEach(b=>{const e=document.getElementById(b.id);if(e)e.classList.toggle("on",b.tasks.every(k=>k==="a2"?(S.punkte.a2||0)>=1:!!S.done[k]));});
}
function fertig(k,p){S.done[k]=true;if(p!==undefined)S.punkte[k]=p;fortschritt();speichern();}
function offen(k){delete S.done[k];S.punkte[k]=0;fortschritt();speichern();}

/* ---------- Lernweg ---------- */
function setLernweg(w){
 S.lernweg=w;
 document.body.classList.remove("lw-sicher","lw-standard","lw-weiter");
 document.body.classList.add("lw-"+w);
 $$("[data-lwbtn]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lwbtn===w)));
 $("#lwInfo").textContent={
  sicher:"Sicher werden: Du bekommst zusätzliche Hilfen und Satzanfänge.",
  standard:"Standard: ausgewogene Mischung aus Erklärung und eigener Arbeit.",
  weiter:"Weiterdenken: Du bekommst zusätzlich anspruchsvolle Aufgaben, zum Beispiel eine zweite Quelle."}[w];
 speichern();
}
$$("[data-lwbtn]").forEach(b=>b.addEventListener("click",()=>setLernweg(b.dataset.lwbtn)));

/* ---------- Start und Pflichtfelder ---------- */
function klasseOk(v){
 const t=norm(v).replace(/[^a-z0-9]/g,"");
 if(!t)return{ok:false,msg:"Bitte trage deine Klasse ein, zum Beispiel 8a."};
 const m=t.match(/(?:^|[^0-9])8([a-z]?)$/);
 if(!m)return{ok:false,msg:"Diese Klasse gehört nicht zu Jahrgang 8. Schreibe zum Beispiel 8a, Klasse 8b oder nur 8."};
 return{ok:true,wert:"8"+(m[1]||"")};
}
function pflichtOk(zeigen){
 const n=$("#name").value.trim(), e=$("#email"), k=klasseOk($("#klasse").value);
 if(!n){if(zeigen)fb("#startFb","Bitte trage deinen Namen oder deinen Lerncode ein.","bad");return false;}
 if(!k.ok){if(zeigen)fb("#startFb",k.msg,"bad");return false;}
 if(!e.value.trim()){if(zeigen)fb("#startFb","Bitte trage deine E-Mail-Adresse ein, zum Beispiel name@schule.de.","bad");return false;}
 if(!e.checkValidity()){if(zeigen)fb("#startFb","Die E-Mail-Adresse sieht nicht vollständig aus. Sie braucht ein @ und einen Punkt, zum Beispiel name@schule.de.","bad");return false;}
 return true;
}
$("#startBtn").addEventListener("click",()=>{
 if(!pflichtOk(true))return;
 fertig("start");
 fb("#startFb",CFG.startOk,"ok");
 location.hash="mission";
});

/* ---------- Einstieg ---------- */
$("#dCheck").addEventListener("click",()=>{
 const fr=DIAG.fragen, offenD=fr.filter(f=>!val(f.n));
 if(offenD.length){fb("#dFb","Beantworte bitte zuerst alle drei Fragen. Raten ist ausdrücklich erlaubt.","hint");return;}
 const r=fr.filter(f=>val(f.n)===f.r).length;
 let m=r===fr.length?DIAG.alle:(r===fr.length-1?DIAG.fast:DIAG.wenig.replace("#",r));
 (DIAG.extra||[]).forEach(x=>{if(val(x.n)===x.v)m+=" "+x.m;});
 fb("#dFb",m,r>=2?"ok":"hint");S.fbs.d={m:m,a:r>=2?"ok":"hint"};
 fertig("diagnose");
});

/* ---------- Auswahl ---------- */
function initMc(t){
 $("#"+t.id+"Check").addEventListener("click",()=>{
  const v=val(t.id);
  if(!v){fbT(t.id,"Bitte wähle zuerst eine Antwort aus.","hint");return;}
  const ok=v===t.richtig, m=(t.fb&&t.fb[v])||(ok?"Richtig.":"Noch nicht.");
  if(ok){fbT(t.id,m,"ok");fertig(t.id,1);}else{fbT(t.id,m,"hint");if(!t.zusatz)offen(t.id);}
 });
}
function initMulti(t){
 $("#"+t.id+"Check").addEventListener("click",()=>{
  const sel=$$('input[name="'+t.id+'"]:checked').map(i=>i.value);
  if(!sel.length){fbT(t.id,"Wähle zuerst mindestens eine Antwort aus.","hint");return;}
  const fehlt=t.richtig.filter(x=>!sel.includes(x)), zuviel=sel.filter(x=>!t.richtig.includes(x));
  if(!fehlt.length&&!zuviel.length){fbT(t.id,t.ok,"ok");fertig(t.id,1);return;}
  let m="";
  zuviel.forEach(z=>{if(t.hinweis&&t.hinweis[z])m+=t.hinweis[z]+" ";});
  if(fehlt.length)m+=(fehlt.length===1?"Es fehlt noch eine zutreffende Antwort. ":t.fehlt.replace("#",fehlt.length));
  fbT(t.id,(m+(t.tipp||"")).trim(),"hint");offen(t.id);
 });
 $("#"+t.id+"Reset").addEventListener("click",()=>{$$('input[name="'+t.id+'"]').forEach(i=>i.checked=false);fbTClear(t.id);offen(t.id);});
}

/* ---------- Zuordnen mit Antippen oder Ziehen ---------- */
let gew=null;
function pieceHtml(t,p,cls){return '<button type="button" class="piece'+(cls?" "+cls:"")+'" draggable="true" data-task="'+t.id+'" data-k="'+p.k+'" aria-pressed="'+(gew&&gew.k===p.k?"true":"false")+'">'+p.t+'</button>';}
function zeichneZ(t){
 const pl=S.placed[t.id]||(S.placed[t.id]={});
 const offenP=t.pieces.filter(p=>!pl[p.k]);
 $("#"+t.id+"Pieces").innerHTML=offenP.map(p=>pieceHtml(t,p)).join("")||'<span class="hint">Alle Karten sind zugeordnet.</span>';
 $$('.zone[data-task="'+t.id+'"] .drop').forEach(d=>d.innerHTML="");
 t.pieces.forEach(p=>{const z=pl[p.k];if(z){const d=document.querySelector('.zone[data-task="'+t.id+'"][data-zone="'+z+'"] .drop');
  if(d)d.insertAdjacentHTML("beforeend",pieceHtml(t,p,S.done[t.id]?"ok":""));}});
 $$('.piece[data-task="'+t.id+'"]').forEach(b=>{
  b.addEventListener("click",e=>{e.stopPropagation();
   if(gew&&gew.k===b.dataset.k){gew=null;b.setAttribute("aria-pressed","false");return;}
   $$(".piece").forEach(x=>x.setAttribute("aria-pressed","false"));
   gew={task:t.id,k:b.dataset.k};b.setAttribute("aria-pressed","true");
   fbT(t.id,"Karte ausgewählt. Tippe jetzt auf das Feld, in das sie gehört. Mit der Tastatur: Feld anspringen und Eingabetaste drücken.","hint");
  });
  b.addEventListener("dragstart",e=>{gew={task:t.id,k:b.dataset.k};try{e.dataTransfer.setData("text/plain",b.dataset.k);}catch(x){}});
 });
}
function ablegen(t,zone){
 if(!gew||gew.task!==t.id){fbT(t.id,"Wähle zuerst eine Karte aus, dann das Feld.","hint");return;}
 S.placed[t.id][gew.k]=zone;gew=null;
 if(S.done[t.id]){offen(t.id);}
 zeichneZ(t);fbTClear(t.id);speichern();
}
function initZuord(t){
 $$('.zone[data-task="'+t.id+'"]').forEach(z=>{
  z.addEventListener("click",()=>ablegen(t,z.dataset.zone));
  z.addEventListener("keydown",e=>{if(e.target!==z)return;if(e.key==="Enter"||e.key===" "){e.preventDefault();ablegen(t,z.dataset.zone);}});
  z.addEventListener("dragover",e=>{e.preventDefault();z.classList.add("over");});
  z.addEventListener("dragleave",()=>z.classList.remove("over"));
  z.addEventListener("drop",e=>{e.preventDefault();z.classList.remove("over");ablegen(t,z.dataset.zone);});
 });
 $("#"+t.id+"Check").addEventListener("click",()=>{
  const pl=S.placed[t.id], rest=t.pieces.filter(p=>!pl[p.k]);
  if(rest.length){fbT(t.id,"Es sind noch "+rest.length+" Karten übrig. Ordne zuerst alle zu.","hint");return;}
  let r=0;
  t.pieces.forEach(p=>{const ok=pl[p.k]===p.z;if(ok)r++;const el=document.querySelector('.piece[data-k="'+p.k+'"]');if(el){el.classList.remove("ok","no");el.classList.add(ok?"ok":"no");}});
  if(r===t.pieces.length){fbT(t.id,t.ok,"ok");fertig(t.id,1);}
  else{fbT(t.id,r+" von "+t.pieces.length+" stimmen bereits. Die grün umrandeten Karten sitzen richtig. "+t.hint,"hint");offen(t.id);}
 });
 $("#"+t.id+"Reset").addEventListener("click",()=>{S.placed[t.id]={};gew=null;offen(t.id);zeichneZ(t);fbTClear(t.id);speichern();});
}

/* ---------- Reihenfolge ---------- */
function zeichneO(t,fokus){
 const o=S.order[t.id], fertigO=!!S.done[t.id];
 $("#"+t.id+"List").innerHTML=o.map((i,pos)=>
  '<div class="orow'+(fertigO?" ok":"")+'"><span class="nr" aria-hidden="true">'+(pos+1)+'</span><span class="t">'+t.items[i]+'</span>'+
  '<button type="button" data-mv="'+pos+'" data-dir="-1" aria-label="Nach oben: '+t.items[i].replace(/"/g,"")+'">&#8593;</button>'+
  '<button type="button" data-mv="'+pos+'" data-dir="1" aria-label="Nach unten: '+t.items[i].replace(/"/g,"")+'">&#8595;</button></div>').join("");
 $$("#"+t.id+"List button").forEach(b=>b.addEventListener("click",()=>{
  const p=+b.dataset.mv,d=+b.dataset.dir,n=p+d;
  if(n<0||n>=o.length)return;
  [o[p],o[n]]=[o[n],o[p]];if(S.done[t.id])offen(t.id);zeichneO(t,{pos:n,dir:d});speichern();}));
 if(fokus){const b=document.querySelector("#"+t.id+'List button[data-mv="'+fokus.pos+'"][data-dir="'+fokus.dir+'"]')||document.querySelector("#"+t.id+'List button[data-mv="'+fokus.pos+'"]');if(b)b.focus();}
}
function mischeO(t){const idx=t.items.map((_,i)=>i);let o;do{o=mische(idx);}while(o.join()===idx.join());S.order[t.id]=o;}
function initOrder(t){
 if(!S.order[t.id]||S.order[t.id].length!==t.items.length)mischeO(t);
 zeichneO(t);
 $("#"+t.id+"Check").addEventListener("click",()=>{
  const o=S.order[t.id], r=o.filter((v,i)=>v===i).length;
  if(r===o.length){S.done[t.id]=true;zeichneO(t);fbT(t.id,t.ok,"ok");fertig(t.id,1);}
  else{fbT(t.id,r+" von "+o.length+" stehen schon an der richtigen Stelle. "+t.hint,"hint");offen(t.id);}
 });
 $("#"+t.id+"Reset").addEventListener("click",()=>{offen(t.id);mischeO(t);zeichneO(t);fbTClear(t.id);speichern();});
}

/* ---------- Bild- und Kartenarbeit ---------- */
function hotAufgabe(t){
 const idx=S.hot[t.id]||0;
 t.finds.forEach((f,i)=>{const el=document.getElementById(f.z);if(el)el.classList.toggle("found",i<idx);});
 if(idx>=t.finds.length){$("#"+t.id+"Task").textContent=t.done;$("#"+t.id+"Alt").innerHTML="";return;}
 const z=t.finds[idx];
 $("#"+t.id+"Task").textContent="Suchauftrag "+(idx+1)+" von "+t.finds.length+": "+z.tipp;
 $("#"+t.id+"Alt").innerHTML=t.alle.map(x=>'<button type="button" class="chip" data-hot="'+x.id+'">'+x.n+'</button>').join("");
 $$("#"+t.id+"Alt .chip").forEach(b=>b.addEventListener("click",()=>hotWahl(t,b.dataset.hot)));
}
function hotWahl(t,id){
 const idx=S.hot[t.id]||0, z=t.finds[idx]; if(!z)return;
 if(id===z.z){
  S.hot[t.id]=idx+1;
  if(idx+1>=t.finds.length){fbT(t.id,z.ok+" Damit hast du alle "+t.finds.length+" gefunden.","ok");fertig(t.id,1);}
  else{fbT(t.id,z.ok,"ok");}
  hotAufgabe(t);speichern();
 }else{
  const g=t.alle.find(x=>x.id===id);
  fbT(t.id,"Das ist „"+(g?g.n:"ein anderer Ort")+"“. Lies die Beschreibung noch einmal genau und sieh dir das Bild an.","hint");speichern();
 }
}
function initHot(t){
 $$('.hot[data-task="'+t.id+'"]').forEach(g=>{
  g.addEventListener("click",()=>hotWahl(t,g.id));
  g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();hotWahl(t,g.id);}});
 });
 $("#"+t.id+"Reset").addEventListener("click",()=>{S.hot[t.id]=0;offen(t.id);fbTClear(t.id);hotAufgabe(t);speichern();});
 hotAufgabe(t);
}

/* ---------- Lückentext ---------- */
function initLuecke(t){
 $("#"+t.id+"Check").addEventListener("click",()=>{
  let r=0,leer=0;
  t.richtig.forEach((w,i)=>{const s=$("#"+t.id+"_"+i);s.classList.remove("ok","no");if(!s.value){leer++;return;}const ok=s.value===w;if(ok)r++;s.classList.add(ok?"ok":"no");});
  if(leer){fbT(t.id,"Fülle zuerst alle "+t.richtig.length+" Lücken aus. Noch offen: "+leer+".","hint");return;}
  if(r===t.richtig.length){fbT(t.id,t.ok,"ok");fertig(t.id,1);}
  else{fbT(t.id,r+" von "+t.richtig.length+" Lücken stimmen. Die rot markierten musst du noch einmal prüfen. "+t.hint,"hint");offen(t.id);}
 });
 t.richtig.forEach((w,i)=>{const s=$("#"+t.id+"_"+i);s.addEventListener("change",()=>{s.classList.remove("ok","no");});});
}

/* ---------- Freitexte ---------- */
function bewerte(roh,k){
 const t=norm(roh), wort=t.split(/\s+/).filter(Boolean).length;
 if(t.length<(k.min||40)||wort<(k.worte||10))return{p:0,lab:"zu knapp",msg:k.knapp||"Deine Antwort ist noch sehr kurz. Schreibe mindestens zwei vollständige Sätze."};
 const treffer=k.gruppen.filter(g=>hat(t,g.w)), fehl=k.gruppen.filter(g=>!hat(t,g.w));
 const verkn=hat(t,VERKN), genug=saetze(roh)>=(k.saetze||2), need=k.need||k.gruppen.length;
 if(treffer.length>=need&&verkn&&genug)return{p:1,lab:"vollständig",msg:k.ok};
 let m="Du bist auf dem richtigen Weg. ";
 if(treffer.length<need)m+=fehl.slice(0,2).map(g=>g.miss).join(" ")+" ";
 if(!verkn)m+="Verbinde deine Aussagen mit „weil“, „deshalb“ oder „dadurch“. ";
 if(!genug)m+="Schreibe mindestens "+(k.saetze||2)+" vollständige Sätze. ";
 return{p:(treffer.length>=1?0.5:0.25),lab:"teilweise",msg:m.trim()};
}
function initText(t){
 $("#"+t.id+"Check").addEventListener("click",()=>{
  const r=bewerte($("#"+t.id).value,t.krit);
  S.texts[t.id]=r.lab;fbT(t.id,r.msg,r.p>=1?"ok":"hint");
  if(!t.zusatz){if(r.p>=1)fertig(t.id,1);else offen(t.id);}else speichern();
 });
}

/* ---------- Abschlussmission ---------- */
function pruefeAbschluss(){
 const a1=val("a1");
 if(a1&&S.a2geprueft&&(S.punkte.a2||0)>0)fertig("abschluss");else{delete S.done.abschluss;fortschritt();speichern();}
}
$("#a1Check").addEventListener("click",()=>{
 const v=val("a1");
 if(!v){fbT("a1","Bitte wähle zuerst eine Entscheidung aus.","hint");return;}
 const ok=ABS.ok.includes(v);S.punkte.a1=ok?1:0;
 fbT("a1",ABS.fb[v]||"",ok?"ok":"hint");pruefeAbschluss();
});
$("#a2Check").addEventListener("click",()=>{
 const r=bewerte($("#a2").value,ABS.krit);
 S.punkte.a2=r.p>=1?1:(r.p>0?0.5:0);S.a2lab=r.lab;S.a2geprueft=true;
 fbT("a2",r.msg,r.p>=1?"ok":"hint");pruefeAbschluss();
});

/* ---------- Lerncheck ---------- */
function lerncheckWerte(){return[1,2,3].map(i=>val("lc"+i)||"");}
$("#selfcheck").addEventListener("change",()=>{
 if(lerncheckWerte().every(Boolean))fertig("lerncheck",1);else{delete S.done.lerncheck;S.punkte.lerncheck=0;fortschritt();}
 speichern();
});

/* ---------- Speichern ---------- */
function sammle(){
 const d={inputs:{},radios:{},checks:[],state:S};
 $$("input[id],textarea[id],select[id]").forEach(e=>{if(e.type!=="radio"&&e.type!=="checkbox")d.inputs[e.id]=e.value;});
 $$("input[type=radio]:checked").forEach(e=>d.radios[e.name]=e.value);
 $$("input[type=checkbox]:checked").forEach(e=>d.checks.push(e.name+"|"+e.value));
 return d;
}
function speichern(){try{localStorage.setItem(CFG.key,JSON.stringify(sammle()));}catch(e){}}
function laden(){
 let d;try{d=JSON.parse(localStorage.getItem(CFG.key)||"null");}catch(e){d=null;}
 if(!d)return false;
 Object.entries(d.inputs||{}).forEach(([k,v])=>{const e=document.getElementById(k);if(e)e.value=v;});
 Object.entries(d.radios||{}).forEach(([n,v])=>{$$('input[type=radio][name="'+n+'"]').forEach(e=>{if(e.value===v)e.checked=true;});});
 (d.checks||[]).forEach(s=>{const i=s.indexOf("|");if(i<0)return;const n=s.slice(0,i),v=s.slice(i+1);
  $$('input[type=checkbox][name="'+n+'"]').forEach(e=>{if(e.value===v)e.checked=true;});});
 Object.assign(S,d.state||{});
 return true;
}
$("#clearBtn").addEventListener("click",()=>{
 if(!confirm("Möchtest du wirklich alle auf diesem Gerät gespeicherten Eingaben dieses Moduls löschen? Das lässt sich nicht rückgängig machen."))return;
 try{localStorage.removeItem(CFG.key);}catch(e){}
 location.reload();
});
let t0;document.addEventListener("input",()=>{clearTimeout(t0);t0=setTimeout(speichern,350);});
document.addEventListener("change",()=>{clearTimeout(t0);t0=setTimeout(speichern,200);});

/* ---------- Ergebnis ---------- */
function eins(b){return b?1:0;}
function punkteGesamt(){return PFLICHT.reduce((s,t)=>s+(S.punkte[t.id]||0),0)+(S.punkte.a1||0)+(S.punkte.a2||0)+(S.punkte.lerncheck||0);}
function kompetenz(k){const ts=PFLICHT.filter(t=>(t.komp||[]).includes(k));if(k==="historisches_urteil")return eins((S.punkte.a1||0)>=1&&(S.punkte.a2||0)>=1&&ts.every(t=>(S.punkte[t.id]||0)>=1));return eins(ts.length>0&&ts.every(t=>(S.punkte[t.id]||0)>=1));}
function payload(){
 const k=klasseOk($("#klasse").value);
 const pkt=Math.round(punkteGesamt()*10)/10, pct=Math.round(pkt/MAXP*100);
 const luecken=[];
 PFLICHT.forEach(t=>{if(!((S.punkte[t.id]||0)>=1))luecken.push(t.name);});
 if(!((S.punkte.a1||0)>=1))luecken.push("Abschlussentscheidung");
 if(!((S.punkte.a2||0)>=1))luecken.push("Begründung");
 const erg={};PFLICHT.forEach(t=>erg[t.id]=S.punkte[t.id]||0);
 erg.entscheidung=S.punkte.a1||0;erg.begruendung=S.punkte.a2||0;erg.lerncheck=S.punkte.lerncheck||0;
 const pfl={};PFLICHT.forEach(t=>pfl[t.id]={correct:(S.punkte[t.id]||0)>=1});
 pfl.entscheidung={correct:(S.punkte.a1||0)>=1};pfl.begruendung={correct:(S.punkte.a2||0)>=1};
 const zus={},zusB={};TASKS.filter(t=>t.zusatz).forEach(t=>{const e=document.getElementById(t.id);if(e&&e.tagName==="TEXTAREA"){zus[t.id]=e.value.trim();zusB[t.id]=S.texts[t.id]||"nicht bearbeitet";}else{zusB[t.id]=(S.punkte[t.id]||0)>=1?"richtig":"nicht gelöst";}});
 if(!S.abgabeId)S.abgabeId=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():Date.now()+"-"+Math.random().toString(16).slice(2);
 return{schema:"1.0",fach:"Geschichte",jahrgang:"8",modul_id:CFG.modul,modul_titel:CFG.titel,
  themenbereich:CFG.bereich,dateiversion:CFG.version,
  zeitstempel:new Date().toISOString(),
  name:$("#name").value.trim(),klasse:k.ok?k.wert:$("#klasse").value.trim(),email:$("#email").value.trim(),
  lernweg:S.lernweg,fortschritt:SCHRITTE.filter(x=>S.done[x]).length+" von "+SCHRITTE.length,
  ergebnisse:erg,
  freitexte:Object.assign({leitfrage:$("#a2").value.trim(),begruendung:$("#a2").value.trim(),
   verstanden:$("#rCan").value.trim(),schwierig:$("#rHard").value.trim(),offene_frage:$("#rOpen").value.trim()},zus),
  bewertung_freitexte:Object.assign({begruendung:S.a2lab||"nicht bearbeitet"},zusB),
  lerncheck:lerncheckWerte(),
  punkte:pkt,max_punkte:MAXP,prozent:pct,
  auffaelligkeiten:luecken,
  bearbeitungsstand:Math.round(SCHRITTE.filter(x=>S.done[x]).length/SCHRITTE.length*100),
  pflichtaufgaben:pfl,
  kompetenzen:{fachwissen:kompetenz("fachwissen"),zeit_raum:kompetenz("zeit_raum"),quellenarbeit:kompetenz("quellenarbeit"),
   ursachen_folgen:kompetenz("ursachen_folgen"),perspektivitaet:kompetenz("perspektivitaet"),historisches_urteil:kompetenz("historisches_urteil")},
  abschlusstest_punkte:pkt,
  abschlusstest_max:MAXP,
  selbsteinschaetzung:lerncheckWerte().filter(v=>v==="Sicher").length,
  fehlende_bereiche:luecken,
  hosting_modus:/(pages\.dev|netlify\.app|edmundbruns\.com)$/.test(location.hostname)?"live":"lokal",
  schema_version:"1.0",
  modul_nummer:CFG.modul,
  abgabe_id:S.abgabeId};
}
function zusammenfassung(p){
 return "SOL Geschichte 8, Modul "+p.modul_id+": "+p.modul_titel
 +"\nName: "+(p.name||"-")+"\nKlasse: "+(p.klasse||"-")+"\nLernweg: "+p.lernweg
 +"\nFortschritt: "+p.fortschritt+"\nPunkte: "+p.punkte+" von "+p.max_punkte+" ("+p.prozent+" Prozent)"
 +"\nNoch zu sichern: "+(p.auffaelligkeiten.join(", ")||"nichts")
 +"\nLerncheck: "+(p.lerncheck.filter(Boolean).join(" | ")||"nicht vollständig")
 +"\nBegründung: "+p.bewertung_freitexte.begruendung;
}
function ergebnisBauen(still){
 if(!pflichtOk(!still)){if(!still)location.hash="start";return null;}
 if(!val("a1")){if(!still){fb("#buildFb","Bitte triff zuerst in der Abschlussmission deine Entscheidung (A1).","bad");location.hash="abschluss";}return null;}
 if(!lerncheckWerte().every(Boolean)){if(!still){fb("#buildFb","Bitte fülle zuerst alle drei Aussagen im Lerncheck aus.","bad");location.hash="lerncheck";}return null;}
 S.punkte.a1=ABS.ok.includes(val("a1"))?1:0;
 fbClear("#buildFb");
 const p=payload();
 $("#resultPanel").classList.add("show");
 $("#ring").style.setProperty("--p",p.prozent+"%");
 $("#ringTxt").textContent=p.punkte+" / "+p.max_punkte;
 const l=$("#lamp");l.className="lamp "+(p.prozent>=80?"g":p.prozent>=50?"y":"r");
 $("#lampTxt").textContent=p.prozent>=80?"Sicher unterwegs":p.prozent>=50?"Gute Grundlage, einzelne Stellen prüfen":"Wiederholung sinnvoll";
 $("#empfehlung").textContent=p.prozent>=80?CFG.next:(p.auffaelligkeiten.length?"Sieh dir noch einmal an: "+p.auffaelligkeiten.join(", ")+". Danach geht es weiter: "+CFG.next:"Wiederhole die Abschnitte, die dir schwerfielen.");
 const zeilen=PFLICHT.map(t=>[t.name,S.punkte[t.id]||0]).concat([["Abschlussentscheidung",S.punkte.a1||0],["Begründung",S.punkte.a2||0],["Lerncheck",S.punkte.lerncheck||0]]);
 $("#analyse").innerHTML=zeilen.map(([n,v])=>"<li><strong>"+n+":</strong> "+(v>=1?"vollständig":v>0?"teilweise":"noch offen")+" ("+v+" P.)</li>").join("");
 $("#summary").textContent=zusammenfassung(p);
 S.built=true;fortschritt();speichern();if(!still)location.hash="ergebnis";
 return p;
}
$("#buildBtn").addEventListener("click",()=>ergebnisBauen(false));
$("#printBtn").addEventListener("click",()=>window.print());
$("#copyBtn").addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText($("#summary").textContent);fb("#sendFb","Die Zusammenfassung wurde kopiert.","ok");}
 catch(e){fb("#sendFb","Kopieren war nicht möglich. Markiere den Text bitte von Hand.","hint");}
});
async function senden(){
 const p=ergebnisBauen(true)||ergebnisBauen(false);
 if(!p)return;
 const live=/(pages\.dev|netlify\.app|edmundbruns\.com)$/.test(location.hostname);
 if(!live){fb("#sendFb","Vorschau-Modus: Hier wird nichts gesendet. Auf der veröffentlichten Seite geht dein Ergebnis an die Lehrkraft. Dein Stand bleibt auf diesem Gerät gespeichert.","hint");return;}
 const b=$("#sendBtn");b.disabled=true;
 fb("#sendFb","Übertragung läuft ...","hint");
 try{
  const r=await ebSend(CFG.endpoint,p);
  if(!r.ok){speichern();$("#retryBtn").hidden=false;fb("#sendFb","Nicht gespeichert: "+r.msg+" Deine Arbeit bleibt auf diesem Gerät. Prüfe deine Angaben und tippe dann auf „Erneut senden“.","bad");return;}
  S.sent=true;speichern();
  $("#retryBtn").hidden=true;
  fb("#sendFb","Gespeichert ✓ Dein Ergebnis ist bei deiner Lehrkraft angekommen. Falls die E-Mail-Rückmeldung freigegeben ist, erhältst du sie an deine Adresse.","ok");
 }catch(e){
  $("#retryBtn").hidden=false;
  fb("#sendFb","Die Übertragung hat nicht geklappt, vermutlich wegen der Internetverbindung. Deine Arbeit ist nicht verloren, sie ist auf diesem Gerät gespeichert. Du kannst es mit „Erneut senden“ noch einmal versuchen oder die Zusammenfassung kopieren und der Lehrkraft schicken.","bad");
 }finally{b.disabled=false;}
}
$("#sendBtn").addEventListener("click",senden);
$("#retryBtn").addEventListener("click",senden);

/* ---------- Lesehilfen ---------- */
$("#easyBtn").addEventListener("click",()=>{
 document.body.classList.toggle("easy");
 $("#easyBtn").setAttribute("aria-pressed",String(document.body.classList.contains("easy")));
});
$("#speakBtn").addEventListener("click",()=>{
 if(!("speechSynthesis" in window)){alert("Vorlesen wird von diesem Browser nicht unterstützt.");return;}
 speechSynthesis.cancel();
 const txt=$$("main section").map(s=>s.innerText).join(". ");
 const u=new SpeechSynthesisUtterance(txt);u.lang="de-DE";u.rate=.95;speechSynthesis.speak(u);
});
$("#stopBtn").addEventListener("click",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();});
window.addEventListener("beforeunload",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();});

/* ---------- Start ---------- */
const wieder=laden();
setLernweg(S.lernweg||"standard");
TASKS.forEach(t=>{
 if(t.typ==="mc")initMc(t);else if(t.typ==="multi")initMulti(t);
 else if(t.typ==="zuord"){initZuord(t);zeichneZ(t);}
 else if(t.typ==="order")initOrder(t);else if(t.typ==="hot")initHot(t);
 else if(t.typ==="luecke")initLuecke(t);else if(t.typ==="text")initText(t);
});
Object.entries(S.fbs||{}).forEach(([k,v])=>{if(k==="d")fb("#dFb",v.m,v.a);else fb("#"+k+"Fb",v.m,v.a);});
TASKS.filter(t=>t.typ==="luecke"&&S.done[t.id]).forEach(t=>t.richtig.forEach((w,i)=>{const s=$("#"+t.id+"_"+i);if(s&&s.value===w)s.classList.add("ok");}));
fortschritt();
if(S.built)ergebnisBauen(true);
if(wieder&&SCHRITTE.some(k=>S.done[k])){
 fb("#startFb","Willkommen zurück. Dein gespeicherter Stand wurde geladen. Du kannst dort weitermachen, wo du aufgehört hast.","ok");
}
"""


def build(m, startlabel, ziele, mission_html, diag_html, glossar_html, lerncheck_html, abschluss_html, startOk):
    secs = [('start', 'Start', start_section(m, ziele, startlabel)),
            ('mission', 'Die Mission', mission_html),
            ('diagnose', 'Was glaubst du?' if 'Was glaubst du' in diag_html else 'Warmlaufen', diag_html)]
    for sid, nav, h in m.sections:
        secs.append((sid, nav, h))
    secs += [('glossar', 'Fachwörter', glossar_html), ('lerncheck', 'Lerncheck', lerncheck_html),
             ('abschluss', 'Abschlussmission', abschluss_html), ('ergebnis', 'Ergebnis', ERGEBNIS)]
    nav = '\n'.join(f' <a href="#{sid}">{n}</a>' for sid, n, _ in secs)
    body = '\n\n'.join(h for _, _, h in secs)
    cfg = dict(modul=m.nr, titel=m.titel, bereich=BEREICH, version="1.0.0", key=f"sol-geschichte-{J}-{m.nr}",
               endpoint=ENDPOINT, next=m.next_txt, badges=m.badges, startOk=startOk)
    js = (JS.replace('__CFG__', json.dumps(cfg, ensure_ascii=False))
            .replace('__TASKS__', json.dumps(m.tasks, ensure_ascii=False))
            .replace('__DIAG__', json.dumps(m.diag, ensure_ascii=False))
            .replace('__ABS__', json.dumps(m.abs, ensure_ascii=False)))
    js = js.replace('</', '<\\/')
    n_steps = 2 + len([t for t in m.tasks if not t.get('zusatz')]) + 2
    badge_lbl = 'Lerncheck' if m.titel.startswith('Lerncheck') else 'Modul'
    doc = f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#37546b">
<meta name="description" content="SOL Geschichte Jahrgang {J}, Modul {m.nr}: {esc(m.titel)}">
<title>SOL Geschichte {J} | Modul {m.nr} | {esc(m.titel)}</title>
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
    <div class="eyebrow">{m.eyebrow}</div>
    <h1>{m.titel}</h1>
    <p>{m.hero}</p>
   </div>
   <div class="badge"><span>{badge_lbl}</span><strong>{m.nr}</strong><span>45 bis 60 Minuten</span></div>
  </div>
 </div>
</header>
<div class="progress"><div class="shell"><div class="track" role="progressbar" aria-label="Lernfortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="pbar"><div class="bar" id="pfill"></div></div><div class="ptext" id="ptext">0 von {n_steps} Schritten</div></div></div>
<div class="layout">
<aside class="side no-print"><nav aria-label="Modulabschnitte">
{nav}
</nav></aside>
<main id="content">

{body}

</main></div>
<footer>SOL Geschichte {J} · Modul {m.nr} · Keine Cookies, kein Tracking · Dr. Edmund Bruns</footer>
<form name="sol-geschichte-{J}" method="POST" data-netlify="true" netlify-honeypot="bot-field" hidden>
 <input name="form-name" value="sol-geschichte-{J}"><input name="bot-field">
 <input name="payload"><input name="modul_id"><input name="name"><input name="klasse"><input name="email"><input name="lernweg"><input name="punkte"><input name="zusammenfassung">
</form>
<script>{js}</script>
</body>
</html>
'''
    out = os.path.join(ROOT, f'upload/geschichte/klasse-{J}/{m.nr}/index.html')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf8').write(doc)
    # Stilpruefung: keine Gedankenstriche mit Leerzeichen
    plain = re.sub(r'<[^>]+>', ' ', doc)
    for bad in (' – ', ' — ', ' -- '):
        if bad in plain and bad != ' -- ':
            print('WARNUNG Gedankenstrich in', m.nr)
    print(out, len(doc.encode('utf8')) // 1024, 'KB', 'Schritte:', n_steps, 'MaxPunkte:', len([t for t in m.tasks if not t.get('zusatz')]) + 3)
    return out


# ---------------- Kartenhilfe ----------------
def proj(lon, lat, lon0, lat0, k, kx, x0=0, y0=0):
    return (round(x0 + (lon - lon0) * kx, 1), round(y0 + (lat0 - lat) * k, 1))
