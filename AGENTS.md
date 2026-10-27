# Agent Instructions for CAD Viewer App

This document provides instructions and tips for AI agents working on this repository. Read this before making changes. FOLLOW GUIDANCE AS CLOSELY AS POSSIBLE.

## Project Overview

This is a Nextcloud app called `cad_viewer` that integrates the `@mlightcad/cad-viewer` library to view DWG and DXF files entirely in Nextcloud 34-35.

## Technical Stack

- **Backend:** PHP ^8.4
- **Nextcloud Compatibility:** Target Nextcloud 34 (uses `nextcloud/ocp:dev-stable34`).
- **Frontend:** Vue 3 with Element Plus
- **Build Tool:** Webpack for bundling

## Prerequisites

- **Node.js:** >= 24 (for `@mlightcad/cad-viewer`)
- **pnpm:** >= 10 (package manager)

---

## Backend (PHP)

The PHP backend follows Nextcloud app conventions with a layered architecture.

- **PHP**: ^8.4

### Layers

| Layer          | Lives in                   | Responsibility                                                      |
| -------------- | -------------------------- | ------------------------------------------------------------------- |
| **Controllers**| `lib/Controller/`          | Handle HTTP requests, parse input, call services, format responses |
| **Services**   | `lib/Service/` (if exists) | Business logic. Assume caller is already authenticated             |
| **Listeners**   | `lib/Listener/`            | Nextcloud event listeners reacting to system events                 |

### Cross-layer Rules

- **Don't reach across layers.** Controllers do not access models/stores directly.
- **Keep controllers thin.** Delegate business logic to services.
- **Use Nextcloud APIs.** Prefer OCP APIs over raw PHP for portability.

### Security & Privacy

Before opening a PR, scan the diff for:
- Logs, error messages, or responses leaking internal paths, secrets, tokens, or user data
- Debug routes, test credentials, or commented-out auth checks
- Endpoints returning more than the caller needs

When in doubt, return less. Auth-, permission-, or data-export-related changes deserve an explicit callout in the PR description.

---

## Frontend (Vue 3)

Located in `src/`. Follow Vue 3 Composition API patterns.

### File Conventions

- **Naming:** `PascalCase` for components and types, `camelCase` for utilities
- **TypeScript:** Preferred for new files; convert existing JS opportunistically
- **Tests:** Jest tests go next to the code, named `*.test.ts`
- **Reuse types before inventing them.** Search for existing types first

### Comments

Keep comments light. Prefer self-documenting code. Add comments **only** when:
- The _why_ is non-obvious (a workaround, subtle invariant)
- A non-trivial usage detail would trip the next reader

Don't restate what the code already says.

---

## Dependencies

| Type     | Manager  | Command                                      |
| -------- | -------- | -------------------------------------------- |
| Backend  | Composer | `composer install`                           |
| Frontend | pnpm     | `pnpm install`                               |

When updating dependencies:
- Ensure PHP compatibility with `composer.lock` updates (use `--ignore-platform-reqs` if needed)
- Run `pnpm install` after any package.json changes
- Check that groups in `dependabot.yml` still apply correctly after updates

---

## Testing

### Backend Tests (PHPUnit)
```bash
composer test:unit
```
Note: Unit tests may fail locally if they depend on Nextcloud core classes not fully mocked.

### Frontend Tests (Jest)
```bash
pnpm test
```

### Static Analysis
```bash
composer psalm        # Psalm type checking
composer phpstan      # PHPStan (if configured)
pnpm run lint         # ESLint
pnpm run stylelint    # Stylelint
```

---

## GitHub Actions Workflows

- All workflows use consistent **pinned hashes** for actions
- Use `v` prefix for `shivammathur/setup-php` tags (e.g., `v2.37.0`)
- Follows Nextcloud organization template patterns for CI/CD

### Key Workflows

| Workflow                          | Purpose                              |
| --------------------------------- | ------------------------------------ |
| `release.yml`                    | Release with semantic-release         |
| `dependabot-approve-merge.yml`   | Auto-approve and merge Dependabot PRs|
| `lint-*.yml`                      | Code quality checks                  |
| `phpunit-*.yml`                   | PHP unit tests                       |
| `node-test.yml`                   | Frontend tests                       |
| `openapi.yml`                     | API documentation generation         |

### Release Process

Releases use [semantic-release](https://github.com/semantic-release/semantic-release) with conventional commits:

1. `feat`, `perf`, `fix`, `fix(deps)` and breaking changes trigger a release; other commit types do not
2. When PR is merged to `main` or `stable`, semantic-release runs first, bumps the version and creates a draft GitHub Release
3. The workflow then builds the tagged version of the Nextcloud app and attaches the archives (tar.gz and zip) to that release before publishing it

| Commit Type | Release Type |
|-------------|-------------|
| BREAKING CHANGE (`feat!` or a `BREAKING CHANGE:` footer) | major |
| `feat`, `perf`, `fix(deps)` | minor |
| `fix` | patch |
| `chore`, `docs`, `refactor`, `test`, `build`, `ci`, `style`, `revert`, `deps` | none |

Releases are deliberately limited, so routine dependency bumps (`chore(deps)`)
and maintenance commits do not create a release each. That noise came from
`chore`, not from `fix`, so bug fixes are released as patches: a fix that lands
on its own (for example a regression in a shipped version) must be able to reach
users without waiting for a feature to be released alongside it. See
`release.config.js`; note that the `fix` rules are scope-narrowed, because a
`release: false` rule outranks other release types and a plain
`{ type: 'fix', release: false }` would also suppress `fix(deps)`.

Example commit messages:
```
feat: add new viewer feature      # → minor release
perf: speed up rendering          # → minor release
fix(deps): bump @mlightcad/...    # → minor release
feat!: drop the legacy API        # → major release
fix: resolve rendering issue      # → patch release
chore(deps): bump element-plus    # → no release
docs: update README               # → no release
```

### Release Workflow Details

The `release.yml` workflow has two jobs, and the order matters:

- **`release`** runs first: it runs semantic-release, which bumps
  `appinfo/info.xml` and `package.json`, commits them, creates the tag and
  creates a **draft** GitHub release. It exposes the released `version` and a
  `published` flag as job outputs.
- **`build`** runs only when `published` is true: it checks out `v<version>`,
  verifies the version in `appinfo/info.xml`, builds the app, creates the
  archives, verifies the version inside the archive, uploads them to the
  release and finally publishes the draft.

Building before semantic-release produced archives whose `appinfo/info.xml`
still carried the previous tag's version, so the archives were always one
version behind. The build job also has no need for a write credential, so its
checkout uses `persist-credentials: false`.

The GitHub release is created as a **draft** and only published by the build
job once the archives are attached. If the build job fails, the release stays
a draft (never public and empty); re-run the failed `build` job, or publish
the draft manually after attaching the archives.

App archives are attached to releases with descriptive labels:
- `cad_viewer.tar.gz` → "Nextcloud App (tar.gz)"
- `cad_viewer.zip` → "Nextcloud App (zip)"

---

## Dependabot Configuration

The repository uses Dependabot for automated dependency updates:

| Ecosystem       | Schedule  | Groups                                      |
| --------------- | --------- | ------------------------------------------ |
| npm             | Daily     | mlightcad-ecosystem, vue-dependencies, babel-dependencies |
| composer        | Daily     | -                                          |
| github-actions  | Weekly    | -                                          |

PR limits: 10 for npm/composer, 5 for actions.

---

## Code Style & Conventions

- **Boy Scout Rule:** Fix obvious typos, dead imports, or missing type hints in files you're already touching. Don't mix in unrelated refactors.
- **Understand what you commit.** AI assistance is fine; shipping code you couldn't defend in review is not.
- **Understand the codebase first.** Match the shape of similar things already in the tree before adding new patterns.
- **Run it, don't just compile it.** "It type-checks" is not "It works." Exercise code paths at least once.

---

## Known Issues

- Local Psalm analysis may fail if the target PHP version is not supported
- Some tests require a full Nextcloud environment and may not pass in a minimal sandbox
- Frontend builds require Node.js >= 24

---

## Semantic Release Configuration

The project uses semantic-release for automated releases. Configuration is in `release.config.js`:

### GitHub Assets Configuration

The `@semantic-release/github` plugin runs with `assets: null` and
`draftRelease: true`: semantic-release creates the tag and a **draft** release,
but attaches no assets itself.

The `build` job then attaches the archives with `gh release upload` and
publishes the draft with `gh release edit --draft=false`:

```yaml
# release.config.js
['@semantic-release/github', { assets: null, draftRelease: true }]
```

```bash
# .github/workflows/release.yml (build job)
gh release upload "$TAG" build/artifacts/cad_viewer.tar.gz --clobber
gh release upload "$TAG" build/artifacts/cad_viewer.zip --clobber
gh release edit "$TAG" --draft=false
```

### Version Bumping
The `bump-version` Makefile target is called by semantic-release's exec plugin during the prepare phase:
```javascript
prepareCmd: 'make bump-version VERSION=${nextRelease.version}',
```

---

## Makefile Targets

| Target          | Description                                      |
| -------------- | ------------------------------------------------ |
| `make bump-version VERSION=x.x.x` | Bump the version in `appinfo/info.xml` |
| `make appstore` | Build the Nextcloud app archive (tar.gz and zip) |
| `make production-setup` | Clean and build for production         |
| `make dev-setup` | Clean and build for development                  |

Usage:
```bash
# Bump version
make bump-version VERSION=0.3.0

# Build app archive
make appstore
```

---

## Documentation

| Document               | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `README.md`            | Project overview and quickstart              |
| `docs/COMPATIBILITY.md`| Nextcloud version compatibility              |
| `docs/DEVELOPMENT.md`  | Development setup and workflow               |
| `wiki/User-Guide.md`   | End-user documentation                       |
