"use strict";

// Copyright 2026 Noah and OV Domain Helper contributors.
// SPDX-License-Identifier: Apache-2.0
// Distributed under the Apache License, Version 2.0.
// See the accompanying LICENSE file or http://www.apache.org/licenses/LICENSE-2.0.html

var assert = require("assert");
var fs = require("fs");
var path = require("path");

var root = path.resolve(__dirname, "..");
function read(file) { return fs.readFileSync(path.join(root, file), "utf8"); }

["domain-helper.js", "domain-helper.svg", "LICENSE", "ui/index.html", "ui/app.js", "ui/style.css"].forEach(function (file) {
    assert(fs.existsSync(path.join(root, file)), "missing package file: " + file);
});

var catalog = JSON.parse(read("assets/catalog.json"));
assert.strictEqual(catalog.license, "CC0-1.0");
assert(catalog.skyboxes.length >= 8, "library should cover the basic sky conditions");
assert(catalog.materials.length >= 8, "library should cover the basic ground types");
catalog.skyboxes.forEach(function (asset) {
    assert(fs.existsSync(path.join(root, "assets", asset.file)), "missing skybox: " + asset.id);
});
catalog.materials.forEach(function (asset) {
    ["albedo.jpg", "normal.jpg", "roughness.jpg"].forEach(function (map) {
        assert(fs.existsSync(path.join(root, "assets", asset.directory, map)), "missing material map: " + asset.id + "/" + map);
    });
});

var icon = read("domain-helper.svg");
assert(/<svg[^>]+width="50"[^>]+height="50"/.test(icon), "icon must declare a 50x50 size");

["domain-helper.js", "ui/index.html", "ui/app.js", "ui/style.css"].forEach(function (file) {
    assert(read(file).indexOf("Apache License, Version 2.0") !== -1, file + " needs an Apache-2.0 reference");
});

var metadataV2 = JSON.parse(read("community-apps/metadata-entry.json"));
assert.strictEqual(metadataV2.appBaseDirectory, "ov-domain-helper");
assert.strictEqual(metadataV2.appScriptVersions.Stable, "domain-helper.js");
assert.strictEqual(metadataV2.appIcon, "domain-helper.svg");

var legacyEntry = read("community-apps/metadata-entry.js");
assert(legacyEntry.indexOf('"jsfile": "ov-domain-helper/domain-helper.js"') !== -1);
assert(legacyEntry.indexOf('"caption": "DOMAIN"') !== -1);

function walk(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
        if (entry.name === ".git") { return; }
        assert(/^[a-zA-Z0-9_.-]+$/.test(entry.name), "unsupported filename: " + entry.name);
        if (entry.isDirectory()) { walk(path.join(directory, entry.name)); }
    });
}
walk(root);

console.log("community submission checks passed");
