# AGENTS.md

## Purpose
This file guides coding agents working in this repository (`airport-db`). Keep changes focused, typed, and release-safe.

## Scope
- Primary scope: this package only (`airport-db`).
- Data generation/import work belongs in sibling repo `../airport-db-data-sqlite` unless explicitly requested.

## Tech Stack
- TypeScript (ESM)
- Node.js >= 18
- SQLite access via `better-sqlite3`
- CLI built with `commander` and `chalk`

## Project Layout
- `src/index.ts`: public library exports
- `src/queries.ts`: query helpers and business logic
- `src/database.ts`: SQLite connection/loading
- `src/cli.ts`: CLI behavior
- `src/bin/airport-db.ts`: CLI entrypoint source
- `src/types/`: domain types and shared interfaces
- `docs/`: user-facing docs and references
- `dist/`: build output (generated)

## Working Rules
- Prefer minimal, targeted edits.
- Preserve public API compatibility unless the task explicitly requests a breaking change.
- Keep runtime code in `src/`; do not hand-edit generated `dist/` files.
- Update docs in `docs/` when behavior or API changes.
- Follow existing TypeScript style and naming in nearby files.

## Commands
- Install: `npm install`
- Build: `npm run build`
- Dev run: `npm run dev`
- Watch: `npm run watch`
- CLI (built): `node dist/bin/airport-db.js --help`

## Verification Checklist
For non-trivial changes, run:
1. `npm run build`
2. If CLI-related: `node dist/bin/airport-db.js --help`
3. If API-related: verify exports and types in `dist/index.d.ts`

## Release Notes
- `prepublishOnly` runs `npm run build`.
- Package publishes `dist/`, `README.md`, and `LICENSE` only.

## Safety
- Do not delete user changes you did not make.
- Avoid destructive git commands.
- If requirements are ambiguous, choose the smallest safe change and document assumptions.
