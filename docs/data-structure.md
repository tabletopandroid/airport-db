# Data Structure

Complete TypeScript-shaped data model for airport records.

## Airport

Main object returned by query functions.

```typescript
interface Airport {
  identity: AirportIdentity;
  location: AirportLocation;
  infrastructure: AirportInfrastructure;
  operational?: AirportOperational;
}
```

## AirportIdentity

Codes and classification.

```typescript
interface AirportIdentity {
  icao: string; // ICAO code (required, globally unique)
  iata?: string; // IATA code (3 letters, optional)
  faa?: string; // FAA LID (mostly US)
  local?: string; // Local identifier
  name: string; // Airport name
  type: AirportType; // Classification
  typeSource?: AirportTypeSource; // Source of type info
  status?: AirportStatus; // Operational status
  isPublicUse?: boolean; // Public vs private use
}
```

**AirportType values:**

- `large_airport`
- `medium_airport`
- `small_airport`
- `heliport`
- `seaplane_base`
- `balloonport`
- `ultralight_park`
- `gliderport`
- `closed`
- `other`

**AirportStatus values:**

- `operational`
- `closed`
- `military`
- `private`

## AirportLocation

Geographic and administrative data.

```typescript
interface AirportLocation {
  latitude: number; // Decimal degrees
  longitude: number; // Decimal degrees
  elevationFt: number; // Feet above MSL
  country: string; // Country name
  countryCode: string; // ISO 3166-1 alpha-2
  state?: string; // State/province name
  county?: string; // County/district
  city?: string; // Nearest city
  zip?: string; // Postal code
  timezone?: string; // IANA timezone (e.g., "America/New_York")
  magneticVariation?: number; // Degrees (east positive)
}
```

## AirportInfrastructure

Physical facilities.

```typescript
interface AirportInfrastructure {
  runways: Runway[]; // List of runways
  hasTower: boolean; // Active control tower present
  fuelTypes?: FuelType[]; // Available aviation fuels
  hasFBO?: boolean; // Fixed Base Operator on field
  hasHangars?: boolean; // Hangar space available
  hasTieDowns?: boolean; // Aircraft tie-down spaces
}
```

### Runway

Runway data is split between the `runways` and `runway_ends` tables.

```typescript
interface Runway {
  id: number; // Runway row ID
  lengthFt: number; // Length in feet
  widthFt: number; // Width in feet
  surface: RunwaySurface; // Pavement type
  lighted: boolean; // From `runways.lighted`
  ends?: RunwayEnd[]; // Optional per-end metadata
}

interface RunwayEnd {
  ident: string; // End identifier (e.g., "09", "27")
  headingDegT: number; // True heading in degrees
  latitudeDeg: number; // Decimal degrees
  longitudeDeg: number; // Decimal degrees
  displacedThresholdFt?: number; // Feet
  elevationFt?: number; // Feet above MSL
}
```

**RunwaySurface values:**

- `asphalt`
- `concrete`
- `dirt`
- `grass`
- `gravel`
- `water`
- `unknown`

**FuelType values:**

- `100LL`
- `JetA`
- `MOGAS`
- `UL94`
- `SAF`
- Any custom string value

## AirportOperational

Flight operations data.

```typescript
interface AirportOperational {
  airacCycle: string; // AIRAC cycle (e.g., "2601")
  frequencies?: AirportFrequencies;
}
```

### AirportFrequencies

```typescript
interface AirportFrequencies {
  atis?: string;
  tower?: string;
  ground?: string;
  clearance?: string;
  unicom?: string;
  approach?: string;
  departure?: string;
}
```

## SearchOptions

Used with `searchAirports()` for advanced queries.

```typescript
interface SearchOptions {
  icao?: string; // Exact match
  iata?: string; // Exact match
  name?: string; // Partial, case-insensitive
  country?: string; // Partial match
  countryCode?: string; // ISO alpha-2 exact
  state?: string;
  city?: string;
  type?: string; // Classification type
  hasTower?: boolean; // Filter by tower
}
```

## Notes

- Optional fields: `?` indicates data may not be available.
- Elevations: all elevation fields are feet above mean sea level.
- Coordinates: WGS84 (EPSG:4326).
- AIRAC: format `YYCC` where `YY` is year and `CC` is cycle number.
- Runway refactor: runway ends are modeled separately from base runway dimensions/surface.
