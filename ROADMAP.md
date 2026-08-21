# Vorläufige Roadmap

Diese Roadmap beschreibt die derzeit geplante Entwicklung von OV Domain Helper.
Reihenfolge und Umfang können sich nach Praxistests und Rückmeldungen aus der
Overte-Community ändern.

## Leitbild

OV Domain Helper soll aus einer frischen Domain in wenigen nachvollziehbaren
Schritten eine sichere, visuell brauchbare und später weiterhin wartbare Welt
machen. Änderungen sollen reproduzierbar, übertragbar und ohne Gefährdung
fremder Entities sein.

## 0.2.1 – Praxistest und Stabilisierung

- Skyboxes und Ambient Lighting in Desktop und VR prüfen
- PBR-Material-Mapping und Kachelung in Overte prüfen
- Laden über eine öffentliche Skript-URL testen
- Tablet-Oberfläche auf kleinen Auflösungen kontrollieren
- fehlende Rez-, Edit- und Delete-Rechte verständlich behandeln
- wiederholtes Anwenden, Rückgängig und Entfernen in einer echten Domain testen
- gefundene Kompatibilitätsprobleme korrigieren

## 0.3.0 – Startbereich und Sicherheit

- Position und Blickrichtung des Startbereichs einstellen
- aktuelle Avatarposition und -ausrichtung übernehmen
- Startplattform mit konfigurierbarer Größe erzeugen
- optionalen Fallschutz oder unsichtbare Begrenzungen anlegen
- Rückkehrpunkt für abgestürzte Avatare bereitstellen
- optionales Willkommensschild mit Domainname und Beschreibung erzeugen
- Unterschied zwischen Spawn-Marker und tatsächlichem Domain-Landepunkt erklären

## 0.4.0 – Konfiguration, Export und Backups

- vollständige Konfiguration als JSON exportieren
- JSON-Konfiguration validieren und importieren
- benannte Snapshots vor Änderungen erstellen
- mehrere Rückgängig-Schritte ermöglichen
- Setups zwischen Domains übertragen
- Unterschiede zwischen gespeichertem und aktuellem Zustand anzeigen

## 0.5.0 – Wasser, Terrain und Weltvorlagen

- konfigurierbare Wasserfläche ergänzen
- Terrain- und eigene GLTF-Modell-URLs unterstützen
- sichtbares Gelände mit vereinfachter Kollisionsfläche kombinieren
- Vorlagen für Insel, flache Landschaft, Ozean, Schneefeld und Weltraumplattform
- zusätzliche frei lizenzierte Materialien und Umgebungsassets aufnehmen

## 0.6.0 – Assistent und Live-Vorschau

- geführten Einrichtungsassistenten implementieren
- Expertenmodus mit direktem Zugriff auf alle Einstellungen erhalten
- Änderungen zunächst als lokale Vorschau darstellen
- Vorschau übernehmen oder vollständig verwerfen
- Vorher-/Nachher-Ansicht anbieten

Der Assistent soll diese Schritte abbilden:

1. Weltart auswählen
2. Größe und Mittelpunkt bestimmen
3. Himmel und Tageszeit festlegen
4. Boden, Terrain oder Wasser konfigurieren
5. Startbereich einrichten
6. Sicherheit und Begrenzungen prüfen
7. Zusammenfassung kontrollieren
8. Welt erstellen

## 0.7.0 – Diagnose und Konflikterkennung

- prüfen, ob der Startpunkt über kollidierbarem Boden liegt
- prüfen, ob der Startbereich innerhalb der Environment-Zone liegt
- Asset-URLs auf Erreichbarkeit und unterstützte Formate prüfen
- überlappende Environment-Zones erkennen
- gesperrte oder nicht mehr bearbeitbare Setup-Entities melden
- unzureichende Rechte für Aktualisierung oder Entfernung erkennen
- unpassende Größenverhältnisse zwischen Boden und Zone melden
- Komponentenübersicht mit Status und gezielten Aktionen anzeigen

## Später – Tageszeit und Wetter

- feste Tageszeit oder laufenden Tag-Nacht-Zyklus anbieten
- Zyklusgeschwindigkeit konfigurieren
- Sonne, Skybox und Ambient Light synchron umschalten
- klare, bewölkte, neblige und regnerische Umgebungen anbieten
- optionale Ambient Sounds ergänzen
- persistente Ausführung über ein geeignetes Server-Entity- oder
  Assignment-Client-Skript untersuchen

## Ziel für 1.0.0

- alle Kernabläufe in Desktop und VR getestet
- sichere Verwaltung ausschließlich eigener Entities
- stabiler Einrichtungsassistent mit Expertenmodus
- Startbereich, Environment, Boden, Wasser und grundlegendes Terrain
- Import, Export, Snapshots und Wiederherstellung
- automatische Abschlussprüfung ohne kritische Befunde
- vollständige Benutzer- und Entwicklerdokumentation
- für Overte Community Apps geprüft und einreichungsbereit

## Nächste Prioritäten

Die nächsten drei funktionalen Schwerpunkte nach der Stabilisierung sind:

1. echter Startbereich mit Blickrichtung und Fallschutz
2. Import, Export und wiederherstellbare Snapshots
3. automatische Abschlussprüfung und Konflikterkennung
