# Provisional roadmap

This roadmap describes the current development plan for OV Domain Helper. Its order and scope may change based on real-world testing and feedback from the Overte community.

## Vision

OV Domain Helper should turn a fresh domain into a safe, visually useful, and maintainable world through a small number of understandable steps. Changes should be reproducible and portable without putting unrelated entities at risk.

## 0.2.1 – Real-world testing and stabilization

- test skyboxes and ambient lighting in desktop and VR modes
- verify PBR material mapping and tiling in Overte
- test loading from a public script URL
- check the tablet interface at small resolutions
- handle missing rez, edit, and delete permissions clearly
- test repeated application, undo, and removal in a real domain
- fix any compatibility issues discovered during testing

## 0.3.0 – Landing area and safety

- configure landing position and facing direction
- use the avatar's current position and orientation
- generate a landing platform with a configurable size
- add optional fall protection or invisible boundaries
- provide a return point for avatars that fall out of the world
- create an optional welcome sign with domain name and description
- explain the difference between the spawn marker and the domain's actual landing point

## 0.4.0 – Configuration, export, and backups

- export the complete configuration as JSON
- validate and import JSON configurations
- create named snapshots before changes
- support multiple undo steps
- transfer setups between domains
- show differences between saved and current state

## 0.5.0 – Water, terrain, and world presets

- add a configurable water surface
- support terrain and custom GLTF model URLs
- combine visible terrain with simplified collision geometry
- add island, flat landscape, ocean, snowfield, and space-platform presets
- include additional freely licensed materials and environment assets

## 0.6.0 – Setup wizard and live preview

- implement a guided setup wizard
- retain an expert mode with direct access to every setting
- show changes as a local preview first
- apply or discard the entire preview
- provide a before-and-after view

The wizard should cover these steps:

1. Choose a world type
2. Set the size and center
3. Select the sky and time of day
4. Configure ground, terrain, or water
5. Set up the landing area
6. Check safety and boundaries
7. Review the summary
8. Create the world

## 0.7.0 – Diagnostics and conflict detection

- verify that the landing point is above collidable ground
- verify that the landing area is inside the environment zone
- check asset URLs for availability and supported formats
- detect overlapping environment zones
- report locked or no-longer-editable setup entities
- detect insufficient permissions for updating or removing the setup
- report unsuitable size relationships between the ground and zone
- show a component overview with statuses and targeted actions

## Later – Time of day and weather

- provide a fixed time or a running day/night cycle
- configure cycle speed
- synchronize the sun, skybox, and ambient light
- provide clear, cloudy, foggy, and rainy environments
- add optional ambient sounds
- investigate persistent execution through a suitable server entity or assignment-client script

## Target for 1.0.0

- all core workflows tested in desktop and VR modes
- safe management of owned entities only
- stable setup wizard with expert mode
- landing area, environment, ground, water, and basic terrain
- import, export, snapshots, and recovery
- automated final validation without critical findings
- complete user and developer documentation
- reviewed and ready for Overte Community Apps submission

## Next priorities

The next three functional priorities after stabilization are:

1. a proper landing area with facing direction and fall protection
2. import, export, and recoverable snapshots
3. automated final validation and conflict detection
