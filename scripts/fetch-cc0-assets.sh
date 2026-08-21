#!/usr/bin/env bash
# Copyright 2026 Noah and OV Domain Helper contributors.
# SPDX-License-Identifier: Apache-2.0
# Downloads selected CC0 assets from Poly Haven and creates app-sized derivatives.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

mkdir -p "$project_root/assets/skyboxes" "$project_root/assets/materials"

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

echo "CC0 asset derivatives updated in $project_root/assets"
