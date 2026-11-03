# Google-Apps-Skripte hinter den Abgaben

Stand: 03.11.2026. Geprüft im Apps-Script-Editor über „Bereitstellen > Bereitstellungen verwalten“.

Jede Lernseite schickt ihre Abgabe an eine Web-App-Adresse (`https://script.google.com/macros/s/<Bereitstellungs-ID>/exec`). Die Adresse bleibt gleich, solange beim Aktualisieren **dieselbe Bereitstellung bearbeitet** und nur eine neue Version gewählt wird. Eine „Neue Bereitstellung“ erzeugt dagegen eine neue Adresse, und alle Seiten müssten geändert werden.

## Verzeichnis

| Bereich | Seiten | Bereitstellungs-ID (Anfang) | Apps-Script-Projekt | Quellcode |
|---|---|---|---|---|
| Mathe Klasse 5 | 25 | `AKfycbwRhFYy` | „Unbenanntes Projekt“ `1_R470-SHFFuAZbynQq00grLD8xfLw-CS_4jHbYRDJIOjf4cQTeVbnVoK` (an Tabelle Mathe 5) | nur im Editor |
| Mathe Klasse 6 | 27 | `AKfycbyeeIOW` | „SOL Mathe 6 Backend“ `1XwKHNk8Ch8UHD2VF53bYAeh230swpQwyzqUk7pO-_jOfEYuuQUKuMbfT` | nur im Editor |
| Mathe Klasse 8 und 9 | 59 | `AKfycbxpbjq4` | „SOL Mathe Auswertung“ `181_113U6BUVpuLFH6Y_HT30xCtQPBiuo4gj_7yBzhdT0f2GdDTGYU1h0` | `tools/sol8/apps-script/Code.gs` |
| Geschichte (5 bis 9, Quellenarbeit) | 50 | `AKfycbxW2bLm` | „SOL Geschichte Jahrgang 7“ `1ggPJuclUQ0yrnwAi66fN1W7p6-ZZPxSxBn1a8SiF1pSlVZ4oLdgZnP5I` | nur im Editor |
| Soziales Lernen 001 | 1 | `AKfycbxBhjv6` | „Soziales Lernen - alle Module“ `1RnKKks8pGk6RBqrlAiJBYnU_uZSTBThO1MNMhAxTEvmXSpbDD4g8Gn9i` | nur im Editor |
| Schachdiplom 4 | 1 | `AKfycbwNXivO` | „Ludgerus-Schachdiplom 4“ `1dUHwhFnkpfDhyDCVsORUMfVMA44HtfEBrshsYQ3_gPlGPYS38sJzjNG_` | nur im Editor |
| Schachdiplom 5 | 1 | `AKfycbzWT-4T` | „Ludgerus-Schachdiplom 5 · Blockabgaben“ `1VCvbvsD1_QrhkRS5IuoGE-FiijwFurUchUZy4sJWPcD_1imwESaye6Mi` | `tools/diplom5/google-apps-script.gs` |
| Schachschule 2 (`apps/`) | 1 | `AKfycbwiNpmS` | „Unbenanntes Projekt“ `1BK-E9HLs2g0USN3X-816ZqUcKS6J8hl79pEGe3U4nrT6qHAk3PlGgBfL` (an Tabelle „Ludgerus-Schachschule 2 – Lernfortschritt“) | nur im Editor |
| Schachschule 3 (`apps/`) | 1 | `AKfycbwS8nAE` | „Ludgerus-Schachschule 3 · Modulabgaben“ `1ifKzym-xphkVfrWe-mc3g6OvbnPEaSvYu9xSGPpVyNiCD6y-m96QpE-k` | Repo `ludgerus-schachschule-3`, `google-apps-script.gs` |
| Rätsel einreichen | 1 | `AKfycbzuFNpl` | **noch nicht zugeordnet** | unbekannt |

Weitere Skripte ohne Lernseite: „SOL-Abgaben · Übersicht“ (`tools/abgaben-uebersicht/Code.gs`), „SOL – zentrale Abgabe-Benachrichtigung“, alte Netlify-Webhooks und Diplom 1.

Das Projekt-Kürzel öffnet den Editor direkt: `https://script.google.com/d/<Projekt-ID>/edit`

## Skript aktualisieren, ohne dass sich die Adresse ändert

1. Editor öffnen: `https://script.google.com/d/<Projekt-ID>/edit`
2. Vorher den bisherigen Code sichern (Versionsverlauf reicht, besser zusätzlich als Datei).
3. Code ersetzen und speichern (Strg + S).
4. **Bereitstellen > Bereitstellungen verwalten**, die aktive Bereitstellung wählen, auf den **Stift** klicken.
5. Bei **Version** „Neue Version“ wählen, kurze Beschreibung eintragen, **Bereitstellen**.
6. Prüfen: Die Bereitstellungs-ID muss dieselbe sein wie vorher. Ein GET auf die `/exec`-Adresse muss antworten. Danach eine Testabgabe mit klar erkennbarem Testnamen senden und die Zeile in der Tabelle wieder löschen.

Nie „Neue Bereitstellung“ wählen, außer die Adresse soll sich bewusst ändern.
