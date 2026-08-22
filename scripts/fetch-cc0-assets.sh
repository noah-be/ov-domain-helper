#!/usr/bin/env bash
# Copyright 2026 Noah and OV Domain Helper contributors.
# SPDX-License-Identifier: Apache-2.0
# Downloads selected CC0 assets from Poly Haven and creates app-sized derivatives.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

mkdir -p "$project_root/assets/skyboxes" "$project_root/assets/materials"
mkdir -p "$project_root/assets/audio"

skyboxes=(
  autumn_field_puresky
  aristea_wreck_puresky
  kloofendal_overcast_puresky
  kloofendal_misty_morning_puresky
  qwantani_sunrise_puresky
  belfast_sunset_puresky
  qwantani_night_puresky
  qwantani_moonrise_puresky
  snow_field_puresky
)

materials=(
  leafy_grass
  aerial_sand
  dirt_floor
  concrete_floor_01
  cobblestone_05
  snow_01
  dark_wooden_planks
  blue_metal_plate
)

for asset in "${skyboxes[@]}"; do
  metadata="$work_dir/$asset.json"
  source="$work_dir/$asset-source.jpg"
  curl --fail --silent --show-error "https://api.polyhaven.com/files/$asset" -o "$metadata"
  curl --fail --location --silent --show-error "$(jq -r '.tonemapped.url' "$metadata")" -o "$source"
  magick "$source" -resize '2048x1024^' -gravity center -extent 2048x1024 -strip -interlace Plane -quality 82 "$project_root/assets/skyboxes/$asset.jpg"
done

for asset in "${materials[@]}"; do
  metadata="$work_dir/$asset.json"
  destination="$project_root/assets/materials/$asset"
  mkdir -p "$destination"
  curl --fail --silent --show-error "https://api.polyhaven.com/files/$asset" -o "$metadata"
  curl --fail --location --silent --show-error "$(jq -r '.Diffuse["1k"].jpg.url' "$metadata")" -o "$destination/albedo.jpg"
  curl --fail --location --silent --show-error "$(jq -r '.Rough["1k"].jpg.url' "$metadata")" -o "$destination/roughness.jpg"
  curl --fail --location --silent --show-error "$(jq -r '.nor_gl["1k"].jpg.url' "$metadata")" -o "$destination/normal.jpg"
done

declare -A audio_urls=(
  [forest_birds]="https://cdn.freesound.org/previews/723/723913_2008500-hq.mp3"
  [ocean_waves]="https://cdn.freesound.org/previews/852/852844_17997500-hq.mp3"
  [coastal_wind]="https://cdn.freesound.org/previews/852/852845_17997500-hq.mp3"
  [city_rain]="https://cdn.freesound.org/previews/607/607228_11069322-hq.mp3"
  [night_crickets]="https://cdn.freesound.org/previews/805/805466_13973196-hq.mp3"
  [fireplace]="https://cdn.freesound.org/previews/852/852107_18387771-hq.mp3"
  [city_ambience]="https://cdn.freesound.org/previews/325/325506_5600514-hq.mp3"
)

for asset in "${!audio_urls[@]}"; do
  source="$work_dir/$asset-source.mp3"
  curl --fail --location --silent --show-error "${audio_urls[$asset]}" -o "$source"
  if [[ "$asset" == "ocean_waves" || "$asset" == "city_rain" || "$asset" == "night_crickets" ]]; then
    ffmpeg -hide_banner -loglevel error -y -i "$source" -filter_complex \
      "[0:a]asplit=2[x][y];[x]atrim=start=5:end=35,asetpts=PTS-STARTPTS[a];[y]atrim=start=0:end=5,asetpts=PTS-STARTPTS[b];[a][b]acrossfade=d=5:c1=tri:c2=tri,loudnorm=I=-12:LRA=11:TP=-1[out]" \
      -map "[out]" -ar 48000 -b:a 128k "$project_root/assets/audio/$asset.mp3"
  else
    ffmpeg -hide_banner -loglevel error -y -i "$source" -af "loudnorm=I=-12:LRA=11:TP=-1" \
      -ar 48000 -b:a 128k "$project_root/assets/audio/$asset.mp3"
  fi
done

echo "CC0 asset derivatives updated in $project_root/assets"
