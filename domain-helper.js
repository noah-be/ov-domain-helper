//
// ov-domain-helper - Overte tablet app for bootstrapping a new domain.
// Load this file as a client script in Overte Interface.
//
// Copyright 2026 Noah and OV Domain Helper contributors.
// SPDX-License-Identifier: Apache-2.0
// Distributed under the Apache License, Version 2.0.
// See the accompanying LICENSE file or http://www.apache.org/licenses/LICENSE-2.0.html
//
(function () {
    "use strict";

    var APP_NAME = "DOMAIN";
    var APP_ID = "org.overte.ov-domain-helper";
    var VERSION = 1;
    var SEARCH_RADIUS = 16384;
    var UI_URL = Script.resolvePath("ui/index.html");
    var ICON_URL = Script.resolvePath("domain-helper.svg");
    var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
    var button = tablet.addButton({ text: APP_NAME, icon: ICON_URL, activeIcon: ICON_URL });
    var onScreen = false;
    var entityIDs = { zone: null, ground: null, light: null, spawn: null };
    var lastSnapshot = null;

    var DEFAULT_CONFIG = {
        name: "My Overte World",
        center: { x: 0, y: 0, z: 0 },
        size: { x: 2000, y: 1000, z: 2000 },
        skyboxURL: "",
        skyColor: "#8fb9df",
        ambientURL: "",
        ambientIntensity: 0.55,
        sunColor: "#fff4df",
        sunIntensity: 1.0,
        sunAzimuth: 135,
        sunElevation: 45,
        castShadows: true,
        hazeEnabled: false,
        hazeRange: 1000,
        hazeColor: "#b7c9d6",
        groundEnabled: true,
        groundShape: "Cube",
        groundSize: { x: 500, y: 0.5, z: 500 },
        groundColor: "#6f8d58",
        groundMaterialURL: "",
        groundCollisionless: false,
        lightEnabled: false,
        lightColor: "#ffffff",
        lightIntensity: 1.0,
        lightFalloffRadius: 20,
        spawnMarker: true
    };

    function clone(value) { return JSON.parse(JSON.stringify(value)); }

    function clamp(value, min, max) {
        value = Number(value);
        return isFinite(value) ? Math.max(min, Math.min(max, value)) : min;
    }

    function color(hex, fallback) {
        var match = /^#?([0-9a-f]{6})$/i.exec(String(hex || ""));
        var value = match ? match[1] : fallback.replace("#", "");
        return {
            red: parseInt(value.slice(0, 2), 16),
            green: parseInt(value.slice(2, 4), 16),
            blue: parseInt(value.slice(4, 6), 16)
        };
    }

    function marker(role, config) {
        return JSON.stringify({
            ovDomainHelper: {
                app: APP_ID,
                version: VERSION,
                role: role,
                config: role === "zone" ? config : undefined
            }
        });
    }

    function parseMarker(userData) {
        try {
            var data = JSON.parse(userData || "{}");
            return data.ovDomainHelper && data.ovDomainHelper.app === APP_ID ? data.ovDomainHelper : null;
        } catch (ignore) { return null; }
    }

    function discover() {
        entityIDs = { zone: null, ground: null, light: null, spawn: null };
        Entities.findEntities(MyAvatar.position, SEARCH_RADIUS).forEach(function (id) {
            var props = Entities.getEntityProperties(id, ["userData"]);
            var data = parseMarker(props.userData);
            if (data && entityIDs.hasOwnProperty(data.role) && !entityIDs[data.role]) {
                entityIDs[data.role] = id;
            }
        });
        return entityIDs;
    }

    function sanitize(input) {
        var c = clone(DEFAULT_CONFIG);
        input = input || {};
        Object.keys(c).forEach(function (key) {
            if (input[key] !== undefined) { c[key] = input[key]; }
        });
        ["center", "size", "groundSize"].forEach(function (key) {
            c[key] = c[key] || DEFAULT_CONFIG[key];
            ["x", "y", "z"].forEach(function (axis) {
                c[key][axis] = clamp(c[key][axis], key === "center" ? -16384 : 0.1, 32768);
            });
        });
        c.ambientIntensity = clamp(c.ambientIntensity, 0, 10);
        c.sunIntensity = clamp(c.sunIntensity, 0, 10);
        c.sunAzimuth = clamp(c.sunAzimuth, 0, 360);
        c.sunElevation = clamp(c.sunElevation, -90, 90);
        c.hazeRange = clamp(c.hazeRange, 1, 10000);
        c.lightIntensity = clamp(c.lightIntensity, 0, 100);
        c.lightFalloffRadius = clamp(c.lightFalloffRadius, 0.1, 1000);
        return c;
    }

    function sunDirection(config) {
        var azimuth = config.sunAzimuth * Math.PI / 180;
        var elevation = config.sunElevation * Math.PI / 180;
        return {
            x: -Math.cos(elevation) * Math.sin(azimuth),
            y: -Math.sin(elevation),
            z: -Math.cos(elevation) * Math.cos(azimuth)
        };
    }

    function zoneProperties(c) {
        var skyURL = String(c.skyboxURL || "").trim();
        var ambientURL = String(c.ambientURL || skyURL).trim();
        return {
            type: "Zone",
            name: "OV Domain Helper · Environment",
            position: c.center,
            dimensions: c.size,
            shapeType: "box",
            keyLightMode: "enabled",
            keyLight: {
                color: color(c.sunColor, "#fff4df"),
                intensity: c.sunIntensity,
                direction: sunDirection(c),
                castShadows: Boolean(c.castShadows)
            },
            ambientLightMode: "enabled",
            ambientLight: { ambientIntensity: c.ambientIntensity, ambientURL: ambientURL },
            skyboxMode: "enabled",
            backgroundMode: skyURL ? "skybox" : "color",
            skybox: { color: color(c.skyColor, "#8fb9df"), url: skyURL },
            hazeMode: c.hazeEnabled ? "enabled" : "disabled",
            haze: { hazeColor: color(c.hazeColor, "#b7c9d6"), hazeRange: c.hazeRange },
            userData: marker("zone", c)
        };
    }

    function groundProperties(c) {
        return {
            type: "Shape",
            shape: c.groundShape === "Cylinder" ? "Cylinder" : "Cube",
            name: "OV Domain Helper · Ground",
            position: { x: c.center.x, y: c.center.y - c.groundSize.y / 2, z: c.center.z },
            dimensions: c.groundSize,
            color: color(c.groundColor, "#6f8d58"),
            materialURL: String(c.groundMaterialURL || "").trim(),
            collisionless: Boolean(c.groundCollisionless),
            dynamic: false,
            userData: marker("ground")
        };
    }

    function lightProperties(c) {
        return {
            type: "Light",
            name: "OV Domain Helper · Fill Light",
            position: { x: c.center.x, y: c.center.y + 5, z: c.center.z },
            dimensions: { x: c.lightFalloffRadius * 2, y: c.lightFalloffRadius * 2, z: c.lightFalloffRadius * 2 },
            color: color(c.lightColor, "#ffffff"),
            intensity: c.lightIntensity,
            falloffRadius: c.lightFalloffRadius,
            isSpotlight: false,
            userData: marker("light")
        };
    }

    function spawnProperties(c) {
        return {
            type: "Shape",
            shape: "Cylinder",
            name: "OV Domain Helper · Spawn Marker",
            position: { x: c.center.x, y: c.center.y + 0.03, z: c.center.z },
            dimensions: { x: 2, y: 0.06, z: 2 },
            color: { red: 62, green: 190, blue: 210 },
            alpha: 0.65,
            collisionless: true,
            dynamic: false,
            userData: marker("spawn")
        };
    }

    function snapshot() {
        var result = {};
        Object.keys(entityIDs).forEach(function (role) {
            if (entityIDs[role]) {
                result[role] = Entities.getEntityProperties(entityIDs[role]);
            }
        });
        return result;
    }

    function upsert(role, enabled, properties) {
        var id = entityIDs[role];
        if (!enabled) {
            if (id) { Entities.deleteEntity(id); }
            entityIDs[role] = null;
            return;
        }
        if (id) {
            Entities.editEntity(id, properties);
        } else {
            entityIDs[role] = Entities.addEntity(properties);
        }
    }

    function applyConfig(rawConfig) {
        if (!Entities.canRez()) {
            throw new Error("Keine Berechtigung zum Erstellen von Domain-Entities.");
        }
        discover();
        lastSnapshot = snapshot();
        var c = sanitize(rawConfig);
        upsert("zone", true, zoneProperties(c));
        upsert("ground", c.groundEnabled, groundProperties(c));
        upsert("light", c.lightEnabled, lightProperties(c));
        upsert("spawn", c.spawnMarker, spawnProperties(c));
        send({ type: "applied", config: c, entities: entityIDs });
    }

    function removeManaged() {
        discover();
        Object.keys(entityIDs).forEach(function (role) {
            if (entityIDs[role]) { Entities.deleteEntity(entityIDs[role]); }
        });
        entityIDs = { zone: null, ground: null, light: null, spawn: null };
        send({ type: "removed" });
    }

    function undo() {
        if (!lastSnapshot) { throw new Error("Es gibt noch keinen Zustand zum Wiederherstellen."); }
        removeManaged();
        Object.keys(lastSnapshot).forEach(function (role) {
            var props = lastSnapshot[role];
            delete props.id;
            entityIDs[role] = Entities.addEntity(props);
        });
        lastSnapshot = null;
        send({ type: "undone", config: currentConfig() });
    }

    function currentConfig() {
        discover();
        if (!entityIDs.zone) { return clone(DEFAULT_CONFIG); }
        var data = parseMarker(Entities.getEntityProperties(entityIDs.zone, ["userData"]).userData);
        return data && data.config ? sanitize(data.config) : clone(DEFAULT_CONFIG);
    }

    function send(message) { tablet.emitScriptEvent(JSON.stringify(message)); }

    function status() {
        discover();
        send({
            type: "state",
            version: VERSION,
            canRez: Entities.canRez(),
            config: currentConfig(),
            entities: entityIDs,
            hasSetup: Boolean(entityIDs.zone)
        });
    }

    function onWebEvent(raw) {
        var message;
        try { message = JSON.parse(raw); } catch (ignore) { return; }
        try {
            if (message.type === "ready" || message.type === "refresh") { status(); }
            else if (message.type === "apply") { applyConfig(message.config); }
            else if (message.type === "remove") { removeManaged(); }
            else if (message.type === "undo") { undo(); }
        } catch (error) {
            send({ type: "error", message: String(error.message || error) });
        }
    }

    function onClicked() {
        if (onScreen) { tablet.gotoHomeScreen(); }
        else { tablet.gotoWebScreen(UI_URL); }
    }

    function onScreenChanged(type, url) {
        onScreen = url === UI_URL || String(url).indexOf("ov-domain-helper/ui/index.html") !== -1;
        button.editProperties({ isActive: onScreen });
    }

    button.clicked.connect(onClicked);
    tablet.screenChanged.connect(onScreenChanged);
    tablet.webEventReceived.connect(onWebEvent);

    Script.scriptEnding.connect(function () {
        button.clicked.disconnect(onClicked);
        tablet.screenChanged.disconnect(onScreenChanged);
        tablet.webEventReceived.disconnect(onWebEvent);
        tablet.removeButton(button);
    });
}());
