# OV Domain Helper

A tablet app for [Overte](https://overte.org/) that sets up a fresh domain with the essential world entities.

**Version:** 0.2.2

## Current features

- central environment zone with skybox, ambient light, sun, and haze
- configurable ground with collisions and optional material
- optional fill light and spawn marker
- daylight, sunset, night, and studio presets
- bundled CC0 library with nine skies and eight PBR ground materials
- bundled CC0 ambient library with seven environmental sound loops and volume control
- detection and editing of an existing managed setup
- single-level undo and safe removal of owned entities only
- permission check before making changes

## Installation

1. Download or clone the repository.
2. In Overte, open **Settings → Running Scripts**.
3. Load `domain-helper.js` using **From Disk**.
4. Open the **DOMAIN** app on the tablet.

The interface is loaded relative to the main script, so the repository files must remain together.

## Usage

Choose a preset or customize the **Environment**, **Ground**, **Light**, and **Audio** sections. **Apply world** creates or updates the managed entities. Changes persist in the domain and require permission to rez entities.

The Audio section offers forest birds, ocean waves, coastal wind, city rain, night crickets, fireplace, and city ambience. The selected sound is created as a non-positional loop, so visitors hear it throughout the domain at the configured volume.

Ground material sharpness is controlled with **Texture tile size (meters)**. The default value of `1` repeats a material every meter regardless of the total ground dimensions. Use a smaller value for finer detail or a larger value for broader patterns.

The app marks its entities in `userData` with `org.overte.ov-domain-helper`. It never edits or removes unrelated entities.

## Permissions and network access

The app needs permission to create and edit domain entities. It does not transmit user data and requires no external service. Network requests are only made when a user enters their own skybox, ambient-map, or material URLs.

The bundled skies and ground materials come from Poly Haven, and the ambient sounds come from Freesound. All bundled assets are available under CC0. Sources and authors are documented in [`assets/catalog.json`](assets/catalog.json).

## Community Apps

The repository is structurally prepared for a future Overte Community Apps submission. Metadata and the submission checklist are located in [`community-apps/`](community-apps/). This preparation is not a submission.

## Development

There is intentionally no build step and no external runtime dependency. Client JavaScript must remain compatible with Overte's embedded scripting engine, so the client script uses ES5 syntax.

Run the tests with:

```sh
node tests/domain-helper.test.js
node tests/submission.test.js
```

## Roadmap

The prioritized provisional release plan is documented in [`ROADMAP.md`](ROADMAP.md). The next areas of focus are real-world testing, a proper landing area, configuration import/export with snapshots, and automated setup validation.

## License

[Apache License 2.0](LICENSE)
