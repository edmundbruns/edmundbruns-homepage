# DOI über Zenodo

Zenodo (zenodo.org, betrieben vom CERN) vergibt kostenlos dauerhafte DOIs. Die Lizenz CC BY-NC 4.0 bleibt erhalten.
Dieser Ordner wird nicht veröffentlicht, nur `site/` geht online.

## Ablauf je Werk (etwa 10 Minuten)

1. Auf zenodo.org anmelden, am einfachsten mit dem GitHub-Konto (edmundbruns) oder ORCID.
2. Oben auf **New upload**.
3. Dateien hochladen, siehe `dateien` in der JSON-Datei.
4. Bei „Do you already have a DOI?“ **No** wählen und **Get a DOI now!** klicken. Die DOI ist damit reserviert,
   aber noch nicht aktiv. Wer sie ins PDF schreiben will, kann das jetzt tun und die Datei neu hochladen.
5. Felder aus der JSON-Datei übernehmen: Ressourcentyp, Titel, Datum, Autor, Beschreibung, Lizenz, Schlagwörter, Sprache,
   verwandte Adresse.
6. **Publish**. Achtung: Ein veröffentlichter Eintrag lässt sich nicht löschen, nur durch neue Versionen ergänzen.
7. Die DOI (Form `10.5281/zenodo.1234567`) auf der Homepage eintragen:

```
python3 tools/doi_eintragen.py dokumentieren 10.5281/zenodo.1234567
python3 tools/doi_eintragen.py klassenrat 10.5281/zenodo.7654321
```

Das Skript ergänzt die DOI im Zitiervorschlag auf der Publikationsseite und auf der Klassenrat-Seite.

## Neue Fassung

Bei Änderungen am PDF auf Zenodo **New version** wählen. Es entsteht eine neue Versions-DOI, die erste DOI zeigt
dann automatisch immer auf die neueste Fassung (Concept-DOI).
