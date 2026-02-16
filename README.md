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
import { initializeBrowserDatabase, getAirportByICAO } from "airport-db";

await initializeBrowserDatabase();

const airport = getAirportByICAO("KLAX");
```

No extra asset setup is required. `airport-db` ships browser assets and loads them automatically.

Optional: pass custom asset URLs if you want to host assets yourself.

```typescript
await initializeBrowserDatabase({
  databaseUrl: "/airports.sqlite",
  wasmUrl: "/sql-wasm.wasm",
});
```

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
