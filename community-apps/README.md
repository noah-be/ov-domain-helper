# Community Apps submission preparation

This directory contains the metadata prepared for a future submission to
[`overte-org/community-apps`](https://github.com/overte-org/community-apps).
It is preparation material only; it is not part of the application package.

## Package layout

Copy the repository contents into `applications/ov-domain-helper`, excluding:

- `.git/`
- `.github/`
- `community-apps/`
- `tests/`

The required files are already in the expected locations:

- main script: `domain-helper.js`
- 50×50 inactive tablet icon: `domain-helper.svg`
- UI: `ui/`
- license: `LICENSE`

## Metadata

The production More app currently consumes `applications/metadata.js`.
`metadata-entry.js` contains the exact object to add to its `metadata.applications`
array. `metadata-entry.json` is also provided for the newer metadata v2 schema
present in the upstream repository.

Before a future pull request, regenerate or edit the upstream metadata files from
the latest upstream `master` branch to avoid overwriting concurrent submissions.

## Acceptance checklist

- [x] Main JavaScript file and icon are directly in the application folder.
- [x] Folder and file names use only accepted characters.
- [x] Tablet icon declares a 50×50 display size.
- [x] Source files carry Apache-2.0 license references.
- [x] Application has no required external service dependency.
- [x] Metadata description states the required rez permission.
- [x] Automated create/update/removal safety test passes.
- [ ] Perform a final interactive test in the current Overte release.
- [ ] Rebase metadata changes on the latest Community Apps `master` branch.
