// Copyright 2026 Noah and OV Domain Helper contributors.
// SPDX-License-Identifier: Apache-2.0
// Distributed under the Apache License, Version 2.0.
// See the accompanying LICENSE file or http://www.apache.org/licenses/LICENSE-2.0.html
(function () {
  "use strict";
  var state = {};
  var fields = ["name","skyboxURL","skyboxPreset","skyColor","ambientURL","ambientIntensity","sunColor","sunIntensity","sunAzimuth","sunElevation","castShadows","hazeEnabled","hazeRange","hazeColor","groundEnabled","groundShape","groundColor","groundMaterialURL","groundMaterialPreset","groundTextureSize","groundCollisionless","lightEnabled","lightColor","lightIntensity","lightFalloffRadius","ambientSoundPreset","ambientSoundVolume","spawnMarker"];
  var vectors = { center:["centerX","centerY","centerZ"], size:["sizeX","sizeY","sizeZ"], groundSize:["groundSizeX","groundSizeY","groundSizeZ"] };
  var presets = {
    daylight:{ label:"Daylight", note:"Bright, neutral starting point", skyboxPreset:"autumn_field_puresky", groundMaterialPreset:"leafy_grass", ambientSoundPreset:"forest_birds", skyColor:"#8fb9df", ambientIntensity:0.55, sunColor:"#fff4df", sunIntensity:1, sunAzimuth:135, sunElevation:45, hazeEnabled:false, groundColor:"#ffffff" },
    sunset:{ label:"Sunset", note:"Warm and atmospheric", skyboxPreset:"belfast_sunset_puresky", groundMaterialPreset:"dirt_floor", ambientSoundPreset:"ocean_waves", skyColor:"#d77b62", ambientIntensity:0.35, sunColor:"#ffb066", sunIntensity:1.3, sunAzimuth:255, sunElevation:10, hazeEnabled:true, hazeRange:850, hazeColor:"#d59c86", groundColor:"#ffffff" },
    night:{ label:"Night", note:"Cool with low light", skyboxPreset:"qwantani_night_puresky", groundMaterialPreset:"cobblestone_05", ambientSoundPreset:"night_crickets", skyColor:"#07142d", ambientIntensity:0.12, sunColor:"#9fbaff", sunIntensity:0.18, sunAzimuth:210, sunElevation:55, hazeEnabled:false, groundColor:"#ffffff", lightEnabled:true, lightColor:"#b9d5ff", lightIntensity:2 },
    studio:{ label:"Studio", note:"Neutral for development", skyboxPreset:"", groundMaterialPreset:"concrete_floor_01", ambientSoundPreset:"", skyColor:"#454c54", ambientIntensity:0.8, sunColor:"#ffffff", sunIntensity:0.8, sunAzimuth:135, sunElevation:55, groundColor:"#ffffff", lightEnabled:true, lightIntensity:1.5, lightFalloffRadius:30 }
  };
  var skyboxes = [
    ["","Color only",""],
    ["autumn_field_puresky","Clear day","autumn_field_puresky.jpg"],
    ["aristea_wreck_puresky","Clouds","aristea_wreck_puresky.jpg"],
    ["kloofendal_overcast_puresky","Overcast","kloofendal_overcast_puresky.jpg"],
    ["kloofendal_misty_morning_puresky","Misty morning","kloofendal_misty_morning_puresky.jpg"],
    ["qwantani_sunrise_puresky","Sunrise","qwantani_sunrise_puresky.jpg"],
    ["belfast_sunset_puresky","Sunset","belfast_sunset_puresky.jpg"],
    ["qwantani_night_puresky","Starry night","qwantani_night_puresky.jpg"],
    ["qwantani_moonrise_puresky","Moonrise","qwantani_moonrise_puresky.jpg"],
    ["snow_field_puresky","Winter sky","snow_field_puresky.jpg"]
  ];
  var materials = [
    ["","Color only",""], ["leafy_grass","Grass","leafy_grass"], ["aerial_sand","Sand","aerial_sand"],
    ["dirt_floor","Dirt","dirt_floor"], ["concrete_floor_01","Concrete","concrete_floor_01"],
    ["cobblestone_05","Cobblestone","cobblestone_05"], ["snow_01","Snow","snow_01"],
    ["dark_wooden_planks","Wood","dark_wooden_planks"], ["blue_metal_plate","Metal","blue_metal_plate"]
  ];
  var sounds = [
    ["","No ambience"], ["forest_birds","Forest birds"], ["ocean_waves","Ocean waves"],
    ["coastal_wind","Coastal wind"], ["city_rain","City rain"], ["night_crickets","Night crickets"],
    ["fireplace","Fireplace"], ["city_ambience","City ambience"]
  ];
  function el(id){ return document.getElementById(id); }
  function emit(message){ if(window.EventBridge){ EventBridge.emitWebEvent(JSON.stringify(message)); } }
  function notice(text, type){ var n=el("notice"); n.textContent=text; n.className="notice "+(type||""); }
  function setConfig(c){ state=c; fields.forEach(function(k){ var input=el(k); if(!input||c[k]===undefined)return; if(input.type==="checkbox")input.checked=Boolean(c[k]); else input.value=c[k]; }); Object.keys(vectors).forEach(function(k){ vectors[k].forEach(function(id,i){ el(id).value=c[k]["xyz"[i]]; }); }); selectAsset("skyboxLibrary",c.skyboxPreset||""); selectAsset("materialLibrary",c.groundMaterialPreset||""); selectAsset("audioLibrary",c.ambientSoundPreset||""); outputs(); }
  function getConfig(){ var c=JSON.parse(JSON.stringify(state)); fields.forEach(function(k){ var input=el(k); if(!input)return; c[k]=input.type==="checkbox"?input.checked:(input.type==="number"||input.type==="range"?Number(input.value):input.value); }); Object.keys(vectors).forEach(function(k){ c[k]={}; vectors[k].forEach(function(id,i){ c[k]["xyz"[i]]=Number(el(id).value); }); }); return c; }
  function outputs(){ el("ambientIntensityOut").textContent=Number(el("ambientIntensity").value).toFixed(2); el("sunIntensityOut").textContent=Number(el("sunIntensity").value).toFixed(2); el("ambientSoundVolumeOut").textContent=Math.round(Number(el("ambientSoundVolume").value)*100)+"%"; }
  function selectAsset(container,id){ document.querySelectorAll("#"+container+" .asset").forEach(function(b){b.classList.toggle("selected",b.dataset.id===id);}); }
  function buildAssets(container,items,type){ items.forEach(function(item){ var b=document.createElement("button"); var imagePath; b.className="asset"+(item[0]?"":" none")+(type==="audio"?" audio":""); b.dataset.id=item[0]; if(item[2]){imagePath=type==="sky"?"skyboxes/"+item[2]:"materials/"+item[2]+"/albedo.jpg";b.style.backgroundImage="url('../assets/"+imagePath+"')";} b.innerHTML="<span>"+item[1]+"</span>"; b.onclick=function(){ if(type==="sky"){state.skyboxPreset=item[0];el("skyboxURL").value="";}else if(type==="material"){state.groundMaterialPreset=item[0];el("groundMaterialURL").value="";}else{state.ambientSoundPreset=item[0];} selectAsset(container,item[0]); }; el(container).appendChild(b); }); }
  buildAssets("skyboxLibrary",skyboxes,"sky"); buildAssets("materialLibrary",materials,"material");
  buildAssets("audioLibrary",sounds,"audio");
  Object.keys(presets).forEach(function(key){ var p=presets[key],b=document.createElement("button"); b.className="preset"; b.innerHTML=p.label+"<span>"+p.note+"</span>"; b.onclick=function(){ var c=getConfig(); Object.keys(p).forEach(function(k){ if(k!=="label"&&k!=="note")c[k]=p[k]; }); setConfig(c); notice(p.label+" preset selected. Changes have not been applied yet."); }; el("presets").appendChild(b); });
  document.querySelectorAll("nav button").forEach(function(b){ b.onclick=function(){ document.querySelectorAll("nav button,main section").forEach(function(x){x.classList.remove("active");}); b.classList.add("active"); document.querySelector('[data-panel="'+b.dataset.tab+'"]').classList.add("active"); }; });
  ["ambientIntensity","sunIntensity","ambientSoundVolume"].forEach(function(id){el(id).addEventListener("input",outputs);});
  el("apply").onclick=function(){ notice("Updating world…"); emit({type:"apply",config:getConfig()}); };
  el("undo").onclick=function(){ emit({type:"undo"}); };
  el("refresh").onclick=function(){ emit({type:"refresh"}); };
  el("remove").onclick=function(){ el("confirmDialog").showModal(); };
  el("cancelRemove").onclick=function(){ el("confirmDialog").close(); };
  el("confirmRemove").onclick=function(){ el("confirmDialog").close(); emit({type:"remove"}); };
  function receive(raw){ var m; try{m=JSON.parse(raw);}catch(e){return;} if(m.type==="state"){setConfig(m.config); notice(m.canRez?(m.hasSetup?"Existing setup loaded.":"Ready to create a new world."):"Read only: You do not have permission to rez entities.",m.canRez?"success":"error"); el("apply").disabled=!m.canRez;} else if(m.type==="applied"){setConfig(m.config);notice("World updated successfully.","success");} else if(m.type==="removed"){notice("Managed setup removed.","success");} else if(m.type==="undone"){setConfig(m.config);notice("Previous state restored.","success");} else if(m.type==="error"){notice(m.message,"error");} }
  if(window.EventBridge){ EventBridge.scriptEventReceived.connect(receive); emit({type:"ready"}); } else { notice("Browser preview — not connected to Overte.","error"); }
}());
