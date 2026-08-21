# OV Domain Helper

Eine Tablet-App für [Overte](https://overte.org/), die eine frische Domain mit den wichtigsten Welt-Entities einrichtet.

**Version:** 0.2.0

## Aktueller Funktionsumfang

- zentrale Environment-Zone mit Skybox, Ambient Light, Sonne und Haze
- konfigurierbarer Boden mit Kollision und optionalem Material
- optionales Fülllicht und Spawn-Marker
- Vorlagen für Tageslicht, Sonnenuntergang, Nacht und Studio
- integrierte CC0-Bibliothek mit neun Himmeln und acht PBR-Bodenmaterialien
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

## Berechtigungen und Netzwerkzugriffe

Die App benötigt die Berechtigung, Domain-Entities zu erstellen und zu bearbeiten. Sie überträgt keine Nutzerdaten und benötigt keinen externen Dienst. Netzwerkzugriffe entstehen nur, wenn ein Benutzer selbst URLs für Skybox-, Ambient- oder Material-Assets einträgt.

Die mitgelieferten Himmel und Bodenmaterialien stammen von Poly Haven und stehen unter CC0. Quellen und Urheber sind in [`assets/catalog.json`](assets/catalog.json) dokumentiert.

## Community Apps

Das Repository ist strukturell für eine spätere Einreichung bei Overte Community Apps vorbereitet. Die Metadaten und Prüfliste liegen unter [`community-apps/`](community-apps/). Diese Vorbereitung ist noch keine Einreichung.

## Entwicklung

Es gibt absichtlich keinen Build-Schritt und keine externen Abhängigkeiten. JavaScript muss mit der in Overte eingebetteten Script Engine kompatibel bleiben; deshalb verwendet das Clientskript ES5-Syntax.

Tests ausführen:

```sh
node tests/domain-helper.test.js
node tests/submission.test.js
```

## Roadmap

Die priorisierte, vorläufige Versionsplanung steht in der
[`ROADMAP.md`](ROADMAP.md). Als nächste Schwerpunkte sind Praxistests, ein echter
Startbereich, Import/Export mit Snapshots sowie eine automatische
Abschlussprüfung vorgesehen.

## Lizenz

[Apache License 2.0](LICENSE)
