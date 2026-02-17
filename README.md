# airport-db

**Type-safe TypeScript library for querying airport data.** Comprehensive global coverage with ICAO, IATA, and FAA codes. Runway, tower, and operational data included.

## Install

```bash
npm install airport-db
```

## Use

Two primary use cases are supported:

- Node.js (library and CLI): no initialization required.
- Browser apps (Vite/Webpack): call `initializeBrowserDatabase()` once before querying.

### Node.js

```js
import { getAirportsByCountry } from "airport-db";

const us = getAirportsByCountry("US");
console.log(`${us.length} airports in the US`);
```

### Browser (Vite/Webpack)

```typescript
import databaseUrl from "airport-db/assets/sqlite?url";
import wasmUrl from "airport-db/assets/wasm?url";
import { initializeBrowserDatabase, getAirportByICAO } from "airport-db";

await initializeBrowserDatabase({ databaseUrl, wasmUrl });

const airport = getAirportByICAO("KLAX");
```

Use local package assets for browser initialization. Importing asset URLs lets Vite/Webpack rewrite hashed filenames correctly at build time.
If your bundler does not support `?url`, use its equivalent "asset URL import" configuration.

Optional: pass custom asset URLs if you want to host assets yourself.

```typescript
await initializeBrowserDatabase({
  databaseUrl: "/url/to/other/airports.sqlite",
  wasmUrl: "/url/to/other/sql-wasm.wasm",
});
```

If you use a custom cross-origin `databaseUrl`, your host/CDN must return `Access-Control-Allow-Origin` for browser access.

## Get Started

- **[Quick Start](./docs/quick-start.md)** — Installation & first query
- **[API Reference](./docs/api-reference.md)** — All functions & types
- **[Examples](./docs/examples.md)** — Common use cases
- **[Data Structure](./docs/data-structure.md)** — Type definitions
- **[Extending](./docs/extending.md)** — Add custom data
- **[CLI](./docs/cli.md)** — Command-line tool
- **[Release Workflow](./docs/release.md)** - Release workflow

## Features

✅ **40k+ airports** worldwide  
✅ **Type-safe** TypeScript first  
✅ **Runway data** dimensions, surfaces, lighting  
✅ **Operational** AIRAC cycles, frequencies  
✅ **Fast queries** SQLite-backed  
✅ **Simple API** Find by name, code, location, type

## License

[MIT](./LICENSE) — Use freely, modify, and share

---

Built with ✈️ for aviation developers
