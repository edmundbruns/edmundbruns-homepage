"""DOI von Zenodo auf der Homepage eintragen.

Aufruf:
    python3 tools/doi_eintragen.py dokumentieren 10.5281/zenodo.1234567
    python3 tools/doi_eintragen.py klassenrat 10.5281/zenodo.7654321

Ergänzt die DOI im Zitiervorschlag auf der Publikationsseite und,
beim Klassenrat, zusätzlich auf der Seite des Praxishefts.
Ein zweiter Aufruf ersetzt eine bereits eingetragene DOI.
"""
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

WERKE = {
    "dokumentieren": {
        "zitat": "Bruns, Edmund (2026). Gut dokumentieren in der Schulsozialarbeit. Praxislehrbuch.",
        "seiten": ["publikationen/index.html"],
    },
    "klassenrat": {
        "zitat": "Bruns, Edmund (2026). Der Klassenrat von Klasse 1 bis 10. Praxisheft für Niedersachsen.",
        "seiten": ["publikationen/index.html"],
        "klassenrat_seite": "schulsozialarbeit/klassenrat/index.html",
    },
}


def doi_link(doi):
    return f'DOI: <a href="https://doi.org/{doi}" target="_blank" rel="noopener">{doi}</a>'


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in WERKE:
        sys.exit(__doc__)
    werk, doi = WERKE[sys.argv[1]], sys.argv[2].strip()
    doi = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi)
    if not re.fullmatch(r"10\.\d{4,9}/\S+", doi):
        sys.exit(f"Das sieht nicht wie eine DOI aus: {doi}")

    for seite in werk["seiten"]:
        pfad = SITE / seite
        s = pfad.read_text(encoding="utf-8")
        i = s.find(werk["zitat"])
        if i < 0:
            sys.exit(f"Zitiervorschlag nicht gefunden in {seite}")
        ende = s.find("</p>", i)
        abschnitt = s[i:ende]
        abschnitt = re.sub(r" DOI: <a [^>]*>[^<]*</a>", "", abschnitt)
        abschnitt = re.sub(r" Online: \S+$", "", abschnitt)
        abschnitt += " " + doi_link(doi)
        s = s[:i] + abschnitt + s[ende:]
        pfad.write_text(s, encoding="utf-8")
        print(f"eingetragen: {seite}")

    if "klassenrat_seite" in werk:
        pfad = SITE / werk["klassenrat_seite"]
        s = pfad.read_text(encoding="utf-8")
        s = re.sub(r' Dauerhaft zitierbar unter DOI: <a [^>]*>[^<]*</a>\.', "", s)
        marke = "Bitte nenne dabei „Dr. Edmund Bruns, www.edmundbruns.com“."
        if marke not in s:
            sys.exit("Lizenzhinweis auf der Klassenrat-Seite nicht gefunden")
        s = s.replace(marke, marke + f" Dauerhaft zitierbar unter {doi_link(doi)}.", 1)
        pfad.write_text(s, encoding="utf-8")
        print(f"eingetragen: {werk['klassenrat_seite']}")


if __name__ == "__main__":
    main()
