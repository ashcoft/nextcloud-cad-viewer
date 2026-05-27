# CI Failure Review (Runs 26491902998 and 26491976272)

## What failed

The `build` job fails during `make build-js-production` (`webpack --mode production`) with:

- `export 'AcApFontUtil' ... was not found in '@mlightcad/cad-simple-viewer'`
- Exit code 2 from `make build-js-production` (CI reports overall exit code 2 for the job).

## Root cause

The repository currently pins:

- `@mlightcad/cad-viewer`: `1.5.1`
- `@mlightcad/cad-simple-viewer`: `1.5.0`

`@mlightcad/cad-viewer@1.5.1` expects symbols from `@mlightcad/cad-simple-viewer@1.5.1` (including `AcApFontUtil`), but lock resolution in this repo installs `cad-simple-viewer@1.5.0` in the path used by `cad-viewer`, causing unresolved exports at bundle time.

## Secondary warning in Actions

The workflow also emits a warning that `skjnldsv/read-package-engines-version-actions` targets deprecated Node 20 (forced by GitHub to Node 24). This is currently only a warning and not the failing condition.

## Recommended fix

1. Align `@mlightcad/cad-simple-viewer` to the version expected by `@mlightcad/cad-viewer` (preferably both at `1.5.1` or another known-compatible pair).
2. Regenerate `pnpm-lock.yaml`.
3. Re-run CI.
4. Optionally replace `skjnldsv/read-package-engines-version-actions` with an action that natively targets Node 24 to remove the warning.

## Notes about local reproduction

In this environment, fetching newer private `@mlightcad/*` package versions from npm returned HTTP 403, so I could only validate and document the failure, not complete dependency alignment.
