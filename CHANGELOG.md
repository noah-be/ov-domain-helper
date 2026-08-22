# Changelog

All notable changes to OV Domain Helper are documented here.

## 0.2.1 - 2026-08-22

- Fixed blurry ground materials by deriving UV repeat counts from ground dimensions.
- Replaced the ambiguous tiling scale with a physical texture tile size in meters.
- Enabled material repetition explicitly and defaulted ground textures to a 1 m tile size.

## 0.2.0 - 2026-08-21

- Added a bundled CC0 library with nine optimized Poly Haven skies.
- Added eight bundled PBR ground materials and proper child Material entities.
- Added visual sky and material pickers to the tablet interface.
- Connected the four quick-start presets to suitable bundled assets.
- Added full asset provenance and a reproducible asset preparation script.

## 0.1.0 - 2026-08-21

- Added environment zone configuration for skybox, ambient light, sun, and haze.
- Added configurable ground, optional fill light, and spawn marker.
- Added daylight, sunset, night, and studio presets.
- Added managed-entity discovery, updates without duplication, undo, and safe removal.
- Added rez-permission handling and an automated Overte API test harness.
- Prepared package layout and metadata for Overte Community Apps submission.
