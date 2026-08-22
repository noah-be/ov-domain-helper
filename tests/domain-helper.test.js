"use strict";

// Copyright 2026 Noah and OV Domain Helper contributors.
// SPDX-License-Identifier: Apache-2.0
// Distributed under the Apache License, Version 2.0.
// See the accompanying LICENSE file or http://www.apache.org/licenses/LICENSE-2.0.html

var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

var nextID = 1;
var store = {};
var webHandler;
var emitted = [];
var buttonHandler;

function signal(capture) {
    return {
        connect: function (handler) { if (capture) { capture(handler); } },
        disconnect: function () {}
    };
}

var context = {
    console: console,
    print: function () {},
    isFinite: isFinite,
    JSON: JSON,
    Math: Math,
    Tablet: {
        getTablet: function () {
            return {
                addButton: function () {
                    return {
                        clicked: signal(function (handler) { buttonHandler = handler; }),
                        editProperties: function () {}
                    };
                },
                removeButton: function () {},
                gotoHomeScreen: function () {},
                gotoWebScreen: function () {},
                emitScriptEvent: function (message) { emitted.push(JSON.parse(message)); },
                screenChanged: signal(),
                webEventReceived: signal(function (handler) { webHandler = handler; })
            };
        }
    },
    Script: {
        resolvePath: function (path) { return "file:///test/" + path; },
        scriptEnding: signal()
    },
    MyAvatar: { position: { x: 0, y: 1, z: 0 } },
    Entities: {
        canRez: function () { return true; },
        findEntities: function () { return Object.keys(store); },
        getEntityProperties: function (id) { return JSON.parse(JSON.stringify(store[id] || {})); },
        addEntity: function (props) {
            var id = "entity-" + nextID++;
            store[id] = JSON.parse(JSON.stringify(props));
            return id;
        },
        editEntity: function (id, props) {
            Object.keys(props).forEach(function (key) { store[id][key] = JSON.parse(JSON.stringify(props[key])); });
        },
        deleteEntity: function (id) { delete store[id]; }
    }
};

vm.runInNewContext(fs.readFileSync("domain-helper.js", "utf8"), context);
assert.strictEqual(typeof webHandler, "function", "web bridge should be connected");
assert.strictEqual(typeof buttonHandler, "function", "tablet button should be connected");

var config = {
    name: "Test World",
    center: { x: 10, y: 2, z: 30 },
    size: { x: 100, y: 80, z: 100 },
    groundSize: { x: 50, y: 1, z: 50 },
    groundEnabled: true,
    lightEnabled: true,
    spawnMarker: true
};

webHandler(JSON.stringify({ type: "apply", config: config }));
assert.strictEqual(Object.keys(store).length, 4, "apply should create four managed entities");
assert.strictEqual(emitted[emitted.length - 1].type, "applied");

webHandler(JSON.stringify({ type: "apply", config: config }));
assert.strictEqual(Object.keys(store).length, 4, "second apply should update instead of duplicating");

config.groundMaterialPreset = "leafy_grass";
config.groundMaterialScale = 10; // Legacy 0.2.0 value must not override the new physical tile size.
webHandler(JSON.stringify({ type: "apply", config: config }));
assert.strictEqual(Object.keys(store).length, 5, "material preset should add one managed Material entity");
var materialID = Object.keys(store).filter(function (id) { return store[id].type === "Material"; })[0];
assert(materialID, "material entity should exist");
assert(store[materialID].parentID, "material entity should be parented to the ground");
assert.strictEqual(store[materialID].materialURL, "materialData");
assert.strictEqual(store[materialID].materialRepeat, true);
assert.strictEqual(store[materialID].materialMappingScale.x, 50, "50m ground should repeat every 1m");
assert.strictEqual(store[materialID].materialMappingScale.y, 50, "50m ground should repeat every 1m");
assert(JSON.parse(store[materialID].materialData).materials.albedoMap.indexOf("leafy_grass/albedo.jpg") !== -1);

config.ambientSoundPreset = "forest_birds";
config.ambientSoundVolume = 0.25;
webHandler(JSON.stringify({ type: "apply", config: config }));
assert.strictEqual(Object.keys(store).length, 6, "ambient preset should add one managed Sound entity");
var soundID = Object.keys(store).filter(function (id) { return store[id].type === "Sound"; })[0];
assert(soundID, "ambient Sound entity should exist");
assert(store[soundID].soundURL.indexOf("audio/forest_birds.mp3") !== -1);
assert.strictEqual(store[soundID].playing, true);
assert.strictEqual(store[soundID].loop, true);
assert.strictEqual(store[soundID].positional, false);
assert.strictEqual(store[soundID].localOnly, true);
assert.strictEqual(store[soundID].volume, 0.25);

store.foreign = { type: "Box", name: "User content", userData: "{}" };
webHandler(JSON.stringify({ type: "remove" }));
assert.deepStrictEqual(Object.keys(store), ["foreign"], "remove must preserve unmarked entities");

console.log("domain-helper tests passed");
