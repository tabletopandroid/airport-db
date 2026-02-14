# Data Structure

Complete TypeScript types for airport data.

## Airport

Main object returned by all query functions.

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
  iata?: string; // IATA code (3 letters, not all airports have)
  faa?: string; // FAA LID (US only)
  local?: string; // Local identifier
  name: string; // Airport name
  type: AirportType; // Classification
  typeSource?: string; // Source of type info
  status?: AirportStatus; // Operational status
  isPublicUse?: boolean; // Public vs private
}
```

**AirportType values:**

- `large_airport`
- `medium_airport`
- `small_airport`
- `heliport`
- `airstrip`
- `balloonport`
- `ultralight`
- `gliderport`
- `hangliding`
- `parachuting`

**AirportStatus values:**

- `operational`
- `closed`
- `closed_permanently`

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

```typescript
interface Runway {
  id: string; // Designation (e.g., "09/27")
  lengthFt: number; // Length in feet
  widthFt: number; // Width in feet
  surface: RunwaySurface; // Pavement type
  lighting?: boolean; // Runway lights
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
```

**RunwaySurface values:**

- `asphalt`
- `concrete`
- `dirt`
- `grass`
- `gravel`
- `metal`
- `water`
- `unknown`

**FuelType values:**

- `Jet A`
- `Jet A-1`
- `Jet B`
- `TS-1`
- `100LL` (80/87)
- `100` (87/91)
- `Autogas` (Mogas)
- `Unknown`

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
  atis?: number; // MHz
  tower?: number; // MHz
  ground?: number; // MHz
  clearance?: number; // MHz
  unicom?: number; // MHz
  approach?: number; // MHz
  departure?: number; // MHz
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

- **Optional fields** — `?` indicates data may not be available
- **Elevations** — All in feet above mean sea level
- **Coordinates** — WGS84 (EPSG:4326)
- **AIRAC** — Format "YYCC": YY = year (26 = 2026), CC = cycle (01-13)
- **Frequencies** — Integer MHz values (divide by 1000 for MHz, e.g., `11895` = 118.95 MHz)
