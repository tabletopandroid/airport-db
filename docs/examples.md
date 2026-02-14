# Examples

Practical use cases and patterns.

## Find Alternatives

Get all airports in the same city as a reference airport.

```typescript
import { getAirportByICAO, getAirportsByCity } from "airport-db";

const reference = getAirportByICAO("KLZU");
if (reference?.location.city) {
  const alternatives = getAirportsByCity(reference.location.city);
  console.log(`Alternatives near ${reference.identity.name}:`);
  alternatives.forEach((apt) => {
    console.log(`  ${apt.identity.icao} - ${apt.identity.name}`);
  });
}
```

## Filter by Infrastructure

Find towered airports with multiple runways.

```typescript
import { getAirportsByCountry } from "airport-db";

const usa = getAirportsByCountry("US");
const suitable = usa.filter(
  (apt) =>
    apt.infrastructure.hasTower && apt.infrastructure.runways.length >= 2,
);

console.log(`Found ${suitable.length} multi-runway towered airports in USA`);
```

## Search by Elevation

Find high-elevation airports (useful for aircraft performance calculations).

```typescript
import { getDatabase } from "airport-db";

const db = getDatabase();
const highElevation = db
  .prepare(
    `
  SELECT * FROM airports 
  WHERE elevation_ft > 5000 
  ORDER BY elevation_ft DESC
`,
  )
  .all();

highElevation.slice(0, 10).forEach((apt: any) => {
  console.log(`${apt.icao} - ${apt.elevation_ft} ft`);
});
```

## List Fuel Types Available

Find what fuel is available at an airport.

```typescript
import { getAirportByICAO } from "airport-db";

const airport = getAirportByICAO("KLZU");
if (airport?.infrastructure.fuelTypes?.length) {
  console.log(`Available fuel at ${airport.identity.name}:`);
  airport.infrastructure.fuelTypes.forEach((fuel) => {
    console.log(`  - ${fuel}`);
  });
} else {
  console.log("Fuel data unavailable");
}
```

## Map Large Airports by Region

Group large airports by state.

```typescript
import { getAirportsByType } from "airport-db";

const large = getAirportsByType("large_airport");
const byState: Record<string, typeof large> = {};

large.forEach((apt) => {
  const state = apt.location.state || "International";
  if (!byState[state]) byState[state] = [];
  byState[state].push(apt);
});

Object.entries(byState).forEach(([state, airports]) => {
  console.log(`${state}: ${airports.length} large airports`);
});
```

## Find All Heliports in a City

```typescript
import { getAirportsByCity, getAirportsByType } from "airport-db";

const cities = ["Los Angeles", "New York", "Miami"];
const allHelis = getAirportsByType("heliport");

cities.forEach((city) => {
  const helis = allHelis.filter((h) => h.location.city === city);
  if (helis.length) {
    console.log(`Heliports in ${city}: ${helis.length}`);
    helis.forEach((h) => console.log(`  ${h.identity.icao}`));
  }
});
```

## Distance Calculation

Calculate distance between two airports (Haversine formula).

```typescript
import { getAirportByICAO } from "airport-db";

function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const klzu = getAirportByICAO("KLZU");
const klax = getAirportByICAO("KLAX");

if (klzu && klax) {
  const dist = distance(
    klzu.location.latitude,
    klzu.location.longitude,
    klax.location.latitude,
    klax.location.longitude,
  );
  console.log(`Distance: ${dist.toFixed(0)} miles`);
}
```

## Nearby Airports (Simple Grid Search)

Find airports within a bounding box.

```typescript
import { getDatabase } from "airport-db";

function nearby(lat: number, lon: number, miles: number) {
  const lat_offset = miles / 69; // ~69 miles per degree latitude
  const lon_offset = miles / (69 * Math.cos((lat * Math.PI) / 180));

  const db = getDatabase();
  return db
    .prepare(
      `
    SELECT * FROM airports
    WHERE latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
    ORDER BY 
      (latitude - ?) * (latitude - ?) +
      (longitude - ?) * (longitude - ?)
  `,
    )
    .all(
      lat - lat_offset,
      lat + lat_offset,
      lon - lon_offset,
      lon + lon_offset,
      lat,
      lat,
      lon,
      lon,
    );
}

const results = nearby(40.6413, -73.7781, 50); // Near JFK
console.log(`Found ${results.length} airports within 50 miles`);
```

## Check Field Conditions

Determine if airport meets certain criteria.

```typescript
function canLand(airport: any): {
  hasTower: boolean;
  hasMultipleRunways: boolean;
  elevationOK: boolean;
  fuelAvailable: boolean;
} {
  return {
    hasTower: airport.infrastructure.hasTower,
    hasMultipleRunways: airport.infrastructure.runways.length > 1,
    elevationOK: airport.location.elevationFt < 8000,
    fuelAvailable: (airport.infrastructure.fuelTypes?.length || 0) > 0,
  };
}

import { getAirportByICAO } from "airport-db";
const apt = getAirportByICAO("KLZU");
if (apt) {
  const conditions = canLand(apt);
  console.log(conditions);
}
```
