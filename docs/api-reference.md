# API Reference

Complete function documentation.

## Environment

- Node.js: all functions are supported with no initialization.
- Browser: call `initializeBrowserDatabase(...)` once before querying.

## Identity Lookups

### `getAirportByICAO(icao: string): Airport | undefined`

Find airport by ICAO code (4 letters, globally unique).

```typescript
const airport = getAirportByICAO("KLZU");
```

### `getAirportByIATA(iata: string): Airport | undefined`

Find airport by IATA code (3 letters, primarily commercial airports).

```typescript
const airport = getAirportByIATA("JFK");
```

### `getAirportByFAA(faa: string): Airport | undefined`

Find airport by FAA identifier (US airports only).

```typescript
const airport = getAirportByFAA("JFK");
```

## Geographic Queries

### `getAirportsByCountry(countryCode: string): Airport[]`

All airports in a country. Use ISO 3166-1 alpha-2 country codes (e.g., "US", "GB").

```typescript
const allUS = getAirportsByCountry("US"); // 5,000+
const allUK = getAirportsByCountry("GB"); // 400+
```

### `getAirportsByState(state: string, countryCode?: string): Airport[]`

Airports in a state/province. Country optional.

```typescript
const texas = getAirportsByState("Texas", "US");
const ontario = getAirportsByState("Ontario", "CA");
```

### `getAirportsByCity(city: string): Airport[]`

All airports in a city (multiple results common).

```typescript
const los_angeles = getAirportsByCity("Los Angeles"); // KLAX, KLGB, KSNA...
```

## Classification Queries

### `getAirportsByType(type: string): Airport[]`

Airports by type string. Common types:

- `large_airport` — International hubs (1,000+ seats)
- `medium_airport` — Regional centers (500-1,000 seats)
- `small_airport` — Local service (< 500 seats)
- `heliport` — Helicopter only
- `airstrip` — Bush/remote

```typescript
const large = getAirportsByType("large_airport");
const helis = getAirportsByType("heliport");
```

### `getAirportsWithTowers(): Airport[]`

Airports with active control towers.

```typescript
const towered = getAirportsWithTowers();
```

## Advanced Search

### `searchAirports(options: SearchOptions): Airport[]`

Complex queries with multiple criteria.

```typescript
const results = searchAirports({
  countryCode: "US",
  state: "California",
  hasTower: true,
  type: "large_airport",
});
```

**SearchOptions:**

```typescript
interface SearchOptions {
  icao?: string; // Exact match
  iata?: string; // Exact match
  name?: string; // Partial match (case-insensitive)
  country?: string; // Partial match
  countryCode?: string; // ISO alpha-2
  state?: string;
  city?: string;
  type?: string;
  hasTower?: boolean;
}
```

## Utility Functions

### `initializeBrowserDatabase(options?: BrowserDatabaseInitOptions): Promise<void>`

Browser-only initialization for SQL.js.

```typescript
await initializeBrowserDatabase({
  databaseUrl: "/airports.sqlite",
  wasmUrl: "/sql-wasm.wasm",
});
```

Or with defaults (recommended):

```typescript
await initializeBrowserDatabase();
```

**BrowserDatabaseInitOptions:**

```typescript
interface BrowserDatabaseInitOptions {
  databaseUrl?: string | ArrayBuffer | Uint8Array;
  wasmUrl?: string;
}
```

### `isBrowserDatabaseInitialized(): boolean`

Returns whether browser database initialization has completed.

### `countAirports(): number`

Total number of airports in database.

```typescript
const total = countAirports(); // 40,000+
```

### `getDatabase(): Database`

Direct access to SQLite database for custom queries (read-only).

```typescript
import { getDatabase } from "airport-db";

const db = getDatabase();
const result = db
  .prepare(
    `
  SELECT COUNT(*) as count 
  FROM airports 
  WHERE elevation_ft > 5000
`,
  )
  .get();
```

### `closeDatabase(): void`

Close database connection. Called automatically on process exit.

```typescript
import { closeDatabase } from "airport-db";

closeDatabase();
```

## Return Types

All query functions return `Airport` objects. See [Data Structure](./data-structure.md) for complete type definitions.
