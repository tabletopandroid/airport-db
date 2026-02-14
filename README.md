# airport-db

**Type-safe TypeScript library for querying airport data.** Comprehensive global coverage with ICAO, IATA, and FAA codes. Runway, tower, and operational data included.

## Install

```bash
npm install airport-db @tabletopandroid/airport-db-data-sqlite
```

## Use

```typescript
import { getAirportByICAO, getAirportsByCountry } from "airport-db";

const airport = getAirportByICAO("KLZU");
console.log(airport?.identity.name); // Gwinnett County Airport

const us = getAirportsByCountry("US");
console.log(`${us.length} airports in the US`);
```

## Get Started

- **[Quick Start](./docs/quick-start.md)** — Installation & first query
- **[API Reference](./docs/api-reference.md)** — All functions & types
- **[Examples](./docs/examples.md)** — Common use cases
- **[Data Structure](./docs/data-structure.md)** — Type definitions
- **[Extending](./docs/extending.md)** — Add custom data
- **[CLI](./docs/cli.md)** — Command-line tool

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
