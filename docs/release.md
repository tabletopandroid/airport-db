# Release Workflow

This project uses Changesets for versioning and publishing.

> npm version > git push > npm publish > gh release create

1. Create a changeset:

```bash
npm run changeset
```

2. Apply version and changelog updates:

```bash
npm run version-packages
```

3. Commit the version/changelog changes.

4. Publish to npmjs:

```bash
npm run publish-packages
```

5. Create a GitHub Release for the published version:

```bash
npm run release:github
```

Or run npm publish + GitHub release together:

```bash
npm run release
```

Requirements:

- npm auth configured (`npm login` locally or `NPM_TOKEN` in CI).
- GitHub CLI (`gh`) installed and authenticated for release creation.
