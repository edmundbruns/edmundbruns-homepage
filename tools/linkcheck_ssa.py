"""Linkprüfung für den Bereich Schulsozialarbeit.

Prüft alle Links der Seite site/schulsozialarbeit/index.html:
1. Ist das Ziel erreichbar (kein 404)?
2. Passt bei SOL-Modulen (Linktext beginnt mit z. B. "2.1") der Seitentitel
   oder die Hauptüberschrift des Ziels zur Modulnummer?
3. Enthält ein verlinktes Werkzeug noch alte Webador-Adressen?

Aufruf: python3 tools/linkcheck_ssa.py
Exit-Code 1 bei Fehlern, damit die GitHub Action rot wird und eine Mail kommt.
"""
import html
import re
import sys
import urllib.request
from pathlib import Path

SEITE = Path(__file__).resolve().parent.parent / "site" / "schulsozialarbeit" / "index.html"
LINK = re.compile(r'<a[^>]+href="(https?://[^"]+)"[^>]*>(.*?)</a>', re.S | re.I)
TAG = re.compile(r"<[^>]+>")


def laden(url):
    req = urllib.request.Request(url, headers={"User-Agent": "eb-linkcheck"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.status, r.read().decode("utf-8", "replace")


def modul_passt(nr, text):
    band, modul = nr.split(".")
    text = html.unescape(text).lower()
    muster = [rf"band\s*{band}\W{{0,4}}\s*modul\s*{modul}\b", rf"\b{band}\.{modul}\b"]
    return any(re.search(m, text) for m in muster)


def main():
    quelltext = SEITE.read_text(encoding="utf-8")
    fehler, geprueft = [], 0
    for url, inhalt in sorted(set(LINK.findall(quelltext))):
        linktext = " ".join(TAG.sub(" ", inhalt).split())
        try:
            status, body = laden(url)
        except Exception as e:  # noqa: BLE001
            fehler.append(f"NICHT ERREICHBAR  {url}  ({e})")
            continue
        geprueft += 1
        m = re.match(r"(\d)\.(\d)\b", linktext)
        if m and "github.io" in url:
            kopf = " ".join(TAG.sub(" ", " ".join(re.findall(r"<title>.*?</title>|<h1[^>]*>.*?</h1>", body, re.S | re.I)[:2])).split())
            if not modul_passt(m.group(0), kopf):
                fehler.append(f"FALSCHES MODUL  Link „{linktext}“ -> {url} zeigt „{kopf[:90]}“")
        if "github.io" in url and "webadorsite.com" in body:
            fehler.append(f"ALTE WEBADOR-ADRESSE  in {url}")
    print(f"{geprueft} Links geprüft, {len(fehler)} Fehler.")
    for f in fehler:
        print(" -", f)
    return 1 if fehler else 0


if __name__ == "__main__":
    sys.exit(main())
