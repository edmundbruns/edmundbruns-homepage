# Eigenständige Lern-Apps

Diese Lern-Apps laufen unter eigenen Adressen, nicht unter www.edmundbruns.com. Die Homepage verlinkt sie unter Schach › Fortgeschrittene.

| Ordner | Adresse | Cloudflare-Projekt |
|---|---|---|
| `ludgerus-schachschule-2/` | https://ludgerusschachdiplom2.pages.dev/ | `ludgerusschachdiplom2` |
| `ludgerus-schachschule-3/` | https://ludgerusdiplom3.pages.dev/ | `ludgerusdiplom3` |

## Warum eigene Adressen?

Die Apps speichern den Lernstand im Browser. Dieser Speicher hängt an der Adresse. Ein Umzug auf die Homepage würde den Lernstand aller Kinder löschen. Deshalb bleiben die Adressen gleich.

## Veröffentlichung

Jede Änderung in `apps/` auf `main` wird automatisch veröffentlicht (`.github/workflows/apps-deploy.yml`). Ein Direkt-Upload im Cloudflare-Dashboard ist nicht mehr nötig.

## Quellen

- Schachschule 3 wird im Repo `edmundbruns/ludgerus-schachschule-3` gebaut (`build.py`). Die fertige `index.html` von dort hierher kopieren.
- Schachschule 2 hat kein eigenes Bau-Repo. Die `index.html` hier ist die Arbeitsfassung (Stand: Live-Seite vom 03.11.2026). Das ältere Repo `edmundbruns/ludgerusdiplom2` enthält eine frühere, andere Fassung.

Die Abgaben laufen weiter über die Google-Apps-Skripte der jeweiligen App. Daran ändert sich nichts.
