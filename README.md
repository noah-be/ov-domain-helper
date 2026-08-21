# OV Domain Helper

Eine Tablet-App für [Overte](https://overte.org/), die eine frische Domain mit den wichtigsten Welt-Entities einrichtet.

## Aktueller Funktionsumfang

- zentrale Environment-Zone mit Skybox, Ambient Light, Sonne und Haze
- konfigurierbarer Boden mit Kollision und optionalem Material
- optionales Fülllicht und Spawn-Marker
- Vorlagen für Tageslicht, Sonnenuntergang, Nacht und Studio
- vorhandenes Setup erkennen und bearbeiten
- einmaliges Rückgängig sowie sicheres Entfernen ausschließlich eigener Entities
- Berechtigungsprüfung vor Änderungen

## Installation

1. Repository herunterladen oder klonen.
2. In Overte **Settings → Running Scripts** öffnen.
3. `domain-helper.js` über **From Disk** laden.
4. Im Tablet die App **DOMAIN** öffnen.

Die Oberfläche wird relativ zum Skript geladen. Das gesamte Repository muss deshalb zusammenbleiben.

## Bedienung

Wähle eine Vorlage oder passe die Bereiche **Umgebung**, **Boden** und **Licht** an. **Welt anwenden** erzeugt oder aktualisiert die verwalteten Entities. Änderungen sind persistent in der Domain und erfordern Rez-Rechte.

Die App kennzeichnet ihre Entities in `userData` mit `org.overte.ov-domain-helper`. Fremde Entities werden weder verändert noch entfernt.

## Entwicklung

Es gibt absichtlich keinen Build-Schritt und keine externen Abhängigkeiten. JavaScript muss mit der in Overte eingebetteten Script Engine kompatibel bleiben; deshalb verwendet das Clientskript ES5-Syntax.

Tests ausführen:

```sh
node tests/domain-helper.test.js
```

## Roadmap

- Import/Export von Konfigurationen
- eigene und gemeinschaftliche Presets
- Wasser- und Terrain-Unterstützung
- Spawn-Ausrichtung und Begrenzungen
- persistenter Verlauf statt einfachem Rückgängig

## Lizenz

[Apache License 2.0](LICENSE)
