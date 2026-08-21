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

store.foreign = { type: "Box", name: "User content", userData: "{}" };
webHandler(JSON.stringify({ type: "remove" }));
assert.deepStrictEqual(Object.keys(store), ["foreign"], "remove must preserve unmarked entities");

console.log("domain-helper tests passed");
