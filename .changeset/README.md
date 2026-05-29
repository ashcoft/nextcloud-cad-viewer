# Changesets

This project uses [changesets](https://github.com/changesets/changesets) to manage versioning and changelog entries.

## Creating a Changeset

Before merging changes to `main`, create a changeset file to document what changed:

```bash
pnpm changeset
```

This will prompt you to:
1. Select which packages changed (just `nextcloud-cad-viewer`)
2. Choose the bump type: `patch` (bug fix), `minor` (new feature), or `major` (breaking change)
3. Write a short description of the changes

Alternatively, create a changeset file manually in `.changeset/`:

```markdown
---
"nextcloud-cad-viewer": minor
---

Add new feature for CAD file viewing
```

## How It Works

1. When a PR is merged to `main` with a changeset file, the workflow creates a "Version PR"
2. The Version PR updates `package.json` version based on changeset types
3. When the Version PR is merged, a GitHub Release is created automatically
4. Changeset files are consumed and removed after being processed

## Release Flow

1. **Auto-release (Changeset)**
   - Add a changeset file to your PR
   - Merge PR to `main`
   - Changesets action creates a version bump PR
   - Merge the version PR → Release is published

2. **Manual Release**
   - Go to Actions → "release" workflow
   - Click "Run workflow"
   - Optionally specify a version number
   - Release is published with your specified version

## Bump Types

| Type | When to Use | Example Version |
|------|-------------|-----------------|
| patch | Bug fixes | 1.0.0 → 1.0.1 |
| minor | New features (backward compatible) | 1.0.0 → 1.1.0 |
| major | Breaking changes | 1.0.0 → 2.0.0 |
