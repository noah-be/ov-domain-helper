# Bundled asset library

The images in this directory are optimized derivatives of selected
[Poly Haven](https://polyhaven.com/) assets. Poly Haven publishes all of its
HDRIs and textures under the [CC0 license](https://polyhaven.com/license),
allowing modification and redistribution for any purpose.

Skyboxes are downscaled tonemapped JPG derivatives at 2048×1024. Materials use
the original 1K JPG albedo, OpenGL normal, and roughness maps. The reduced sizes
keep the Community Apps package practical while providing useful defaults.

Ambient sounds are loudness-normalized 128 kbps MP3 derivatives of CC0 Freesound
recordings. Long recordings are reduced to 30-second crossfade loops. Each
individual sound page and creator is listed in the catalog.

Detailed titles, authors, source pages, and intended uses are recorded in
[`catalog.json`](catalog.json). The derivatives can be regenerated with
`scripts/fetch-cc0-assets.sh`.

The rest of OV Domain Helper is Apache-2.0 licensed. The files below
`assets/skyboxes/` and `assets/materials/` remain available under CC0.
