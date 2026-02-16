# Release Workflow

This project uses Changesets for versioning and publishing.

> npm version > git push > npm publish > gh release create

## Maintainer Flow

1. Create a changeset:

```bash
npm run changeset
```

2. Apply version and changelog updates:

```bash
npm run version-packages
```

3. Commit the version/changelog changes.

4. Push the version commit to `main`.

The GitHub Action in `.github/workflows/release.yml` is the single publish path:
- publishes package to npmjs
- creates GitHub Release for the same version tag

## CI Requirements

Configure repository secret:
- `NPM_TOKEN`: npm automation token with publish rights for `airport-db`

Built-in GitHub auth:
- `GITHUB_TOKEN` is provided automatically by GitHub Actions and is used for release creation.

Notes:
- You can still run `npm run publish-packages` manually, but the preferred publish path is the GitHub Action.
