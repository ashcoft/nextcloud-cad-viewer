# Agent Instructions for CAD Viewer App

This document provides instructions and tips for AI agents working on this repository. Read this before making changes. FOLLOW GUIDANCE AS CLOSELY AS POSSIBLE.

## Project Overview

This is a Nextcloud app called `cad_viewer` that integrates the `@mlightcad/cad-viewer` library to view DWG and DXF files entirely in Nextcloud 33+.

## Technical Stack

- **Backend:** PHP ^8.4
- **Nextcloud Compatibility:** Target Nextcloud 33 (uses `nextcloud/ocp:dev-stable33`).
- **Frontend:** Vue 3 with Element Plus
- **Build Tool:** Webpack for bundling

## Prerequisites

- **Node.js:** >= 24 (for `@mlightcad/cad-viewer`)
- **pnpm:** >= 10 (package manager)

---

## Backend (PHP)

The PHP backend follows Nextcloud app conventions with a layered architecture.

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
| `dependabot-approve-merge.yml`   | Auto-approve and merge Dependabot PRs|
| `lint-*.yml`                      | Code quality checks                  |
| `phpunit-*.yml`                   | PHP unit tests                       |
| `node-test.yml`                   | Frontend tests                       |
| `openapi.yml`                     | API documentation generation         |

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

## Documentation

| Document               | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `README.md`            | Project overview and quickstart              |
| `docs/COMPATIBILITY.md`| Nextcloud version compatibility              |
| `docs/DEVELOPMENT.md`  | Development setup and workflow               |
| `wiki/User-Guide.md`   | End-user documentation                       |
