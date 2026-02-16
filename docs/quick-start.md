# Quick Start

Get up and running in 2 minutes.

## Runtime Notes

- Node.js works out of the box.
- Browser apps are supported via SQL.js and require one-time initialization.

## 1. Install

```bash
npm install airport-db
```

## 2. Import & Query

```typescript
import { getAirportByICAO } from "airport-db";

const airport = getAirportByICAO("KLZU");
if (airport) {
  console.log(airport.identity.name);
  console.log(`${airport.location.city}, ${airport.location.country}`);
}
```

### Browser (Vite/Webpack)

```typescript
import { initializeBrowserDatabase, getAirportByICAO } from "airport-db";

await initializeBrowserDatabase();

const airport = getAirportByICAO("KLZU");
```

`initializeBrowserDatabase(...)` must be called before any query function.
No extra browser asset setup is required.

## 3. Common Tasks

### Find by code

```typescript
import {
  getAirportByICAO,
  getAirportByIATA,
  getAirportByFAA,
} from "airport-db";

getAirportByICAO("KLZU"); // ICAO
getAirportByIATA("LZU"); // IATA
getAirportByFAA("LZU"); // FAA
```

### Search by location

```typescript
import {
  getAirportsByCountry,
  getAirportsByState,
  getAirportsByCity,
} from "airport-db";

getAirportsByCountry("US"); // All airports in country
getAirportsByState("California"); // All in state/province
getAirportsByCity("Los Angeles"); // All in city
```

### Filter by type

```typescript
import { getAirportsByType, getAirportsWithTowers } from "airport-db";

getAirportsByType("large_airport"); // By type
getAirportsWithTowers(); // Only towered airports
```

### Advanced search

```typescript
import { searchAirports } from "airport-db";

const results = searchAirports({
  countryCode: "US",
  state: "Texas",
  hasTower: true,
  type: "medium_airport",
});
```

## 4. What You Get

Each airport includes:

```typescript
{
  identity: {
    icao: "KLZU",
    iata: "LZU",
    name: "Gwinnett County Airport",
    type: "small_airport"
  },
  location: {
    latitude: 40.6413,
    longitude: -73.7781,
    elevationFt: 13,
    country: "United States",
    city: "Georgia",
    timezone: "America/New_York"
  },
  infrastructure: {
    runways: [...],
    hasTower: true,
    fuelTypes: ["Jet A", "100LL"]
  },
  operational: {
    airacCycle: "2601"
  }
}
```

See [Data Structure](./data-structure.md) for complete type reference.

## 5. Next Steps

- **[API Reference](./api-reference.md)** — All available functions
- **[Examples](./examples.md)** — More use cases
- **[CLI](./cli.md)** — Command-line queries
