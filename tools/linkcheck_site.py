"""Linkprüfung für die ganze Homepage.

Prüft alle HTML-Seiten in site/:
1. Interne Links: Gibt es die Zielseite oder Datei?
2. Externe Links: Ist das Ziel erreichbar? Dienste, die automatische
   Abfragen sperren (YouTube, Lichess, GitHub), gelten bei 403 oder 429 als in Ordnung.
3. Datenschutz-Wächter: Keine Google Fonts und keine Webador-Bilder mehr.

Aufruf: python3 tools/linkcheck_site.py
Exit-Code 1 bei Fehlern, damit die GitHub Action rot wird und eine Mail kommt.
"""
import concurrent.futures as cf
import html
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"
HREF = re.compile(r'(?:href|src)="([^"]+)"', re.I)
BOT_SPERRE = ("youtube.com", "youtu.be", "lichess.org", "github.com", "fonts.gstatic.com")
VERBOTEN = {
    "fonts.googleapis.com": "Google Fonts direkt eingebunden (Datenschutz)",
    "primary.jwwb.nl": "Bild oder Datei vom alten Webador-Server",
    "webadorsite.com": "Link auf die alte Webador-Seite",
}


def ist_platzhalter(u):
    return any(z in u for z in ("${", "' +", "+ '", "{{", "\n", "';"))


def intern_ok(seite, u):
    pfad = u.split("#")[0].split("?")[0]
    if not pfad:
        return True
    ziel = SITE / pfad.lstrip("/") if pfad.startswith("/") else (seite.parent / pfad)
    ziel = Path(html.unescape(str(ziel)))
    return ziel.exists() or (ziel / "index.html").exists() or ziel.with_suffix(".html").exists()


def extern_status(u):
    code = _abfrage(u)
    return code if code else _abfrage(u)


def _abfrage(u):
    req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (eb-linkcheck)"})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:  # noqa: BLE001
        return 0


def main():
    fehler, warnungen, extern = [], [], {}
    seiten = sorted(SITE.rglob("*.html"))
    for seite in seiten:
        text = seite.read_text(encoding="utf-8", errors="ignore")
        rel = seite.relative_to(SITE)
        for host, grund in VERBOTEN.items():
            if host in text and not str(rel).startswith("datenschutz"):
                fehler.append(f"{grund}: {rel}")
        for u in HREF.findall(text):
            u = html.unescape(u)
            if ist_platzhalter(u) or u.startswith(("mailto:", "tel:", "javascript:", "data:", "#")):
                continue
            if u.startswith(("http://", "https://")):
                if "edmundbruns.com" in u.split("/")[2]:
                    continue
                if any(h in u for h in ("fonts.googleapis.com", "fonts.gstatic.com")):
                    continue
                extern.setdefault(u.split("#")[0], rel)
            elif u.startswith("//"):
                continue
            elif not intern_ok(seite, u):
                fehler.append(f"INTERN FEHLT  {rel} -> {u}")
    with cf.ThreadPoolExecutor(12) as ex:
        for u, code in zip(extern, ex.map(extern_status, extern)):
            if code and code < 400:
                continue
            if code in (403, 429) and any(h in u for h in BOT_SPERRE):
                continue
            if not code:
                warnungen.append(f"keine Antwort (Server blockt evtl. automatische Abfragen)  {extern[u]} -> {u}")
                continue
            fehler.append(f"EXTERN {code}  {extern[u]} -> {u}")
    print(f"{len(seiten)} Seiten, {len(extern)} externe Links geprüft, {len(fehler)} Fehler.")
    for f in fehler:
        print(" -", f)
    if warnungen:
        print(f"{len(warnungen)} Warnungen (kein Fehler, bei Gelegenheit von Hand prüfen):")
        for w in warnungen:
            print(" ~", w)
    return 1 if fehler else 0


if __name__ == "__main__":
    sys.exit(main())
