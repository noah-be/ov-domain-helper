// Copyright 2026 Noah and OV Domain Helper contributors.
// SPDX-License-Identifier: Apache-2.0
// Distributed under the Apache License, Version 2.0.
// See the accompanying LICENSE file or http://www.apache.org/licenses/LICENSE-2.0.html
(function () {
  "use strict";
  var state = {};
  var fields = ["name","skyboxURL","skyColor","ambientURL","ambientIntensity","sunColor","sunIntensity","sunAzimuth","sunElevation","castShadows","hazeEnabled","hazeRange","hazeColor","groundEnabled","groundShape","groundColor","groundMaterialURL","groundCollisionless","lightEnabled","lightColor","lightIntensity","lightFalloffRadius","spawnMarker"];
  var vectors = { center:["centerX","centerY","centerZ"], size:["sizeX","sizeY","sizeZ"], groundSize:["groundSizeX","groundSizeY","groundSizeZ"] };
  var presets = {
    daylight:{ label:"Tageslicht", note:"Heller, neutraler Start", skyColor:"#8fb9df", ambientIntensity:0.55, sunColor:"#fff4df", sunIntensity:1, sunAzimuth:135, sunElevation:45, hazeEnabled:false, groundColor:"#6f8d58" },
    sunset:{ label:"Sonnenuntergang", note:"Warm und atmosphärisch", skyColor:"#d77b62", ambientIntensity:0.35, sunColor:"#ffb066", sunIntensity:1.3, sunAzimuth:255, sunElevation:10, hazeEnabled:true, hazeRange:850, hazeColor:"#d59c86", groundColor:"#665b50" },
    night:{ label:"Nacht", note:"Kühl mit wenig Licht", skyColor:"#07142d", ambientIntensity:0.12, sunColor:"#9fbaff", sunIntensity:0.18, sunAzimuth:210, sunElevation:55, hazeEnabled:false, groundColor:"#26352f", lightEnabled:true, lightColor:"#b9d5ff", lightIntensity:2 },
    studio:{ label:"Studio", note:"Neutral für Entwicklung", skyColor:"#454c54", ambientIntensity:0.8, sunColor:"#ffffff", sunIntensity:0.8, sunAzimuth:135, sunElevation:55, groundColor:"#777b80", lightEnabled:true, lightIntensity:1.5, lightFalloffRadius:30 }
  };
  function el(id){ return document.getElementById(id); }
  function emit(message){ if(window.EventBridge){ EventBridge.emitWebEvent(JSON.stringify(message)); } }
  function notice(text, type){ var n=el("notice"); n.textContent=text; n.className="notice "+(type||""); }
  function setConfig(c){ state=c; fields.forEach(function(k){ var input=el(k); if(!input||c[k]===undefined)return; if(input.type==="checkbox")input.checked=Boolean(c[k]); else input.value=c[k]; }); Object.keys(vectors).forEach(function(k){ vectors[k].forEach(function(id,i){ el(id).value=c[k]["xyz"[i]]; }); }); outputs(); }
  function getConfig(){ var c=JSON.parse(JSON.stringify(state)); fields.forEach(function(k){ var input=el(k); if(!input)return; c[k]=input.type==="checkbox"?input.checked:(input.type==="number"||input.type==="range"?Number(input.value):input.value); }); Object.keys(vectors).forEach(function(k){ c[k]={}; vectors[k].forEach(function(id,i){ c[k]["xyz"[i]]=Number(el(id).value); }); }); return c; }
  function outputs(){ el("ambientIntensityOut").textContent=Number(el("ambientIntensity").value).toFixed(2); el("sunIntensityOut").textContent=Number(el("sunIntensity").value).toFixed(2); }
  Object.keys(presets).forEach(function(key){ var p=presets[key],b=document.createElement("button"); b.className="preset"; b.innerHTML=p.label+"<span>"+p.note+"</span>"; b.onclick=function(){ var c=getConfig(); Object.keys(p).forEach(function(k){ if(k!=="label"&&k!=="note")c[k]=p[k]; }); setConfig(c); notice("Vorlage „"+p.label+"“ gewählt. Noch nicht angewendet."); }; el("presets").appendChild(b); });
  document.querySelectorAll("nav button").forEach(function(b){ b.onclick=function(){ document.querySelectorAll("nav button,main section").forEach(function(x){x.classList.remove("active");}); b.classList.add("active"); document.querySelector('[data-panel="'+b.dataset.tab+'"]').classList.add("active"); }; });
  ["ambientIntensity","sunIntensity"].forEach(function(id){el(id).addEventListener("input",outputs);});
  el("apply").onclick=function(){ notice("Welt wird aktualisiert …"); emit({type:"apply",config:getConfig()}); };
  el("undo").onclick=function(){ emit({type:"undo"}); };
  el("refresh").onclick=function(){ emit({type:"refresh"}); };
  el("remove").onclick=function(){ el("confirmDialog").showModal(); };
  el("cancelRemove").onclick=function(){ el("confirmDialog").close(); };
  el("confirmRemove").onclick=function(){ el("confirmDialog").close(); emit({type:"remove"}); };
  function receive(raw){ var m; try{m=JSON.parse(raw);}catch(e){return;} if(m.type==="state"){setConfig(m.config); notice(m.canRez?(m.hasSetup?"Vorhandenes Setup geladen.":"Bereit für eine neue Welt."):"Nur Lesen: Dir fehlt die Rez-Berechtigung.",m.canRez?"success":"error"); el("apply").disabled=!m.canRez;} else if(m.type==="applied"){setConfig(m.config);notice("Welt erfolgreich aktualisiert.","success");} else if(m.type==="removed"){notice("Verwaltetes Setup entfernt.","success");} else if(m.type==="undone"){setConfig(m.config);notice("Vorheriger Zustand wiederhergestellt.","success");} else if(m.type==="error"){notice(m.message,"error");} }
  if(window.EventBridge){ EventBridge.scriptEventReceived.connect(receive); emit({type:"ready"}); } else { notice("Vorschau im Browser – keine Verbindung zu Overte.","error"); }
}());
