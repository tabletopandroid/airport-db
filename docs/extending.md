# Extending airport-db

Add custom data to airports without modifying the core library.

## Overview

You can extend airport data in three ways:

1. **Type-level extension** — Add custom properties via TypeScript types
2. **Application-level merging** — Join custom data at query time
3. **Database extension** — Add custom tables to the SQLite database

Start with approach #1 for most use cases. Use #3 for performance-critical applications.

## 1. Type-Level Extension (TypeScript)

Extend the `Airport` type with custom properties.

### Basic Extension

```typescript
import type { Airport } from "airport-db";
import { getAirportByICAO } from "airport-db";

interface CustomAirportData {
  riskScore?: number; // 0-100
  operatorNotes?: string;
  lastInspection?: Date;
  inNetwork?: boolean;
}

type EnhancedAirport = Airport & CustomAirportData;

function getEnhancedAirport(
  icao: string,
  customData: Record<string, CustomAirportData>,
): EnhancedAirport | undefined {
  const airport = getAirportByICAO(icao);
  if (!airport) return undefined;

  const custom = customData[icao] || {};
  return {
    ...airport,
    ...custom,
  };
}

// Usage
const customDB = {
  KLZU: { riskScore: 45, inNetwork: true },
  KJFK: { riskScore: 15, operatorNotes: "Major hub" },
};

const enhanced = getEnhancedAirport("KLZU", customDB);
console.log(enhanced.riskScore); // 45
```

### With Factory Pattern

```typescript
class AirportService {
  private customData: Map<string, CustomAirportData>;

  constructor() {
    this.customData = new Map();
  }

  addCustomData(icao: string, data: CustomAirportData) {
    this.customData.set(icao, data);
  }

  getAirport(icao: string): EnhancedAirport | undefined {
    const airport = getAirportByICAO(icao);
    if (!airport) return undefined;

    const custom = this.customData.get(icao) || {};
    return { ...airport, ...custom };
  }

  getAirportsByCountryEnhanced(countryCode: string): EnhancedAirport[] {
    return getAirportsByCountry(countryCode)
      .map((apt) => ({
        ...apt,
        ...(this.customData.get(apt.identity.icao) || {}),
      }))
      .filter((apt): apt is EnhancedAirport =>
        this.customData.has(apt.identity.icao),
      );
  }
}

// Usage
const service = new AirportService();
service.addCustomData("KLZU", { riskScore: 45 });
service.addCustomData("KJFK", { riskScore: 15 });

const airport = service.getAirport("KLZU");
```

## 2. Separate Custom Database

Maintain custom data in a separate SQLite database, join at query time.

### Setup

```typescript
import Database from "better-sqlite3";
import { getDatabase } from "airport-db";

// Initialize custom database
const customDb = new Database("custom-airports.db");

customDb.exec(`
  CREATE TABLE IF NOT EXISTS airport_extensions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    airport_id INTEGER NOT NULL UNIQUE,
    risk_score INTEGER,
    operator_notes TEXT,
    last_inspection DATE,
    in_network BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airport_id) REFERENCES airports(id)
  );

  CREATE INDEX idx_airport_extensions_airport_id
  ON airport_extensions(airport_id);
`);

export class AirportExtensionService {
  getExtendedAirport(icao: string): EnhancedAirport | undefined {
    const mainDb = getDatabase();

    // Get airport with ID from main database
    const airport = mainDb
      .prepare(`SELECT id FROM airports WHERE icao = ?`)
      .get(icao) as { id: number } | undefined;

    if (!airport) return undefined;

    // Get base airport data
    const baseAirport = mainDb
      .prepare(`SELECT * FROM airports WHERE id = ?`)
      .get(airport.id);

    // Join with custom data
    const custom = customDb
      .prepare(
        `SELECT risk_score, operator_notes, last_inspection, in_network
         FROM airport_extensions WHERE airport_id = ?`,
      )
      .get(airport.id) as any;

    return {
      ...baseAirport,
      riskScore: custom?.risk_score,
      operatorNotes: custom?.operator_notes,
      lastInspection: custom?.last_inspection
        ? new Date(custom.last_inspection)
        : undefined,
      inNetwork: custom?.in_network || false,
    };
  }

  addExtension(airportId: number, extension: Partial<CustomAirportData>) {
    const stmt = customDb.prepare(`
      INSERT INTO airport_extensions 
      (airport_id, risk_score, operator_notes, last_inspection, in_network)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(airport_id) DO UPDATE SET
        risk_score = excluded.risk_score,
        operator_notes = excluded.operator_notes,
        last_inspection = excluded.last_inspection,
        in_network = excluded.in_network,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      airportId,
      extension.riskScore,
      extension.operatorNotes,
      extension.lastInspection?.toISOString(),
      extension.inNetwork ? 1 : 0,
    );
  }
}
```

### Usage

```typescript
const extensionService = new AirportExtensionService();

// Add custom data
extensionService.addExtension(1, {
  riskScore: 45,
  inNetwork: true,
  operatorNotes: "Regional hub",
});

// Query with extensions
const airport = extensionService.getExtendedAirport("KLZU");
console.log(airport?.riskScore); // 45
```

### Advantages

✅ Isolates custom data from core database  
✅ Easy to backup/version separately  
✅ Works with read-only core database  
✅ Scales well with large datasets  
✅ Clean schema separation

## 3. Extending the Core Database

Add custom tables to the airports.sqlite database directly (for bundled distributions).

### Add Custom Tables

```typescript
import { getDatabase } from "airport-db";

const db = getDatabase();

// Add your custom table
db.exec(`
  CREATE TABLE IF NOT EXISTS airport_ratings (
    airport_id INTEGER PRIMARY KEY,
    safety_rating REAL,
    fueling_rating REAL,
    facilities_rating REAL,
    comment TEXT,
    FOREIGN KEY (airport_id) REFERENCES airports(id) ON DELETE CASCADE
  );

  CREATE INDEX idx_ratings_airport_id ON airport_ratings(airport_id);
`);
```

### Query with Joins

```typescript
function getAirportWithRatings(icao: string): EnhancedAirport | undefined {
  const db = getDatabase();

  const result = db
    .prepare(
      `SELECT 
        a.*, 
        r.safety_rating,
        r.fueling_rating,
        r.facilities_rating,
        r.comment
      FROM airports a
      LEFT JOIN airport_ratings r ON a.id = r.airport_id
      WHERE a.icao = ?`,
    )
    .get(icao) as any;

  if (!result) return undefined;

  return {
    identity: { ...result },
    location: { ...result },
    infrastructure: { runways: [], hasTower: result.has_tower },
    safetyRating: result.safety_rating,
    fuelingRating: result.fueling_rating,
    facilitiesRating: result.facilities_rating,
    comment: result.comment,
  };
}
```

## Example: Batch Operations

### Load Custom Data from File

```typescript
import fs from "fs";

interface CustomDataFile {
  airports: {
    icao: string;
    riskScore: number;
    tags: string[];
  }[];
}

function loadCustomData(filePath: string): Map<string, CustomAirportData> {
  const file = JSON.parse(fs.readFileSync(filePath, "utf-8")) as CustomDataFile;
  const map = new Map<string, CustomAirportData>();

  for (const airport of file.airports) {
    map.set(airport.icao, {
      riskScore: airport.riskScore,
      tags: airport.tags,
    });
  }

  return map;
}

// Usage
const customData = loadCustomData("./custom-airports.json");
const klzu = getEnhancedAirport("KLZU", Object.fromEntries(customData));
```

### Custom Data File Format

```json
{
  "airports": [
    {
      "icao": "KLZU",
      "riskScore": 45,
      "tags": ["regional", "tower"],
      "operatorNotes": "Well-maintained facility"
    },
    {
      "icao": "KJFK",
      "riskScore": 15,
      "tags": ["major-hub", "international"],
      "operatorNotes": "Primary airport"
    }
  ]
}
```

## Best Practices

### ✅ Do

- Keep custom types separate from core types
- Use meaningful property names
- Document extension fields in your code
- Version custom data independently
- Use migrations for schema changes
- Index frequently-queried custom fields

### ❌ Don't

- Modify airport-db core data
- Store redundant data (like ICAO in extensions)
- Deep-merge without type safety
- Assume all airports have extensions
- Ignore referential integrity in extensions

## Real-World Examples

### Risk Management System

```typescript
interface AirportRisk extends CustomAirportData {
  riskScore: number; // 0-100
  weatherRisk: "low" | "medium" | "high";
  securityLevel: number; // 1-5
  lastIncident?: Date;
}

function getHighRiskAirports(
  countryCode: string,
  threshold: number = 70,
): EnhancedAirport[] {
  return getAirportsByCountry(countryCode)
    .map((apt) => ({
      ...apt,
      ...(customDB[apt.identity.icao] || {}),
    }))
    .filter((apt) => (apt.riskScore || 0) >= threshold);
}
```

### Operator Network

```typescript
interface OperatorNetwork extends CustomAirportData {
  inNetwork: boolean;
  operatorId: string;
  contractExpiry?: Date;
  discount?: number; // percentage
}

function getNetworkAirports(operatorId: string): EnhancedAirport[] {
  const customService = new AirportService();
  return customService.getNetworkAirports(operatorId);
}
```

### Performance Metrics

```typescript
interface PerformanceMetrics extends CustomAirportData {
  turnaroundTime: number; // minutes
  onTimePercentage: number; // %
  fuelPrice: number; // $ per gallon
}
```

## Troubleshooting

**Issue**: Type errors when spreading custom data  
**Solution**: Use `Partial<CustomData>` for optional fields

**Issue**: Performance with large extensions  
**Solution**: Use separate database approach (#2) with proper indexing

**Issue**: Stale custom data  
**Solution**: Implement a `lastUpdated` field and refresh logic

**Issue**: Migrations breaking extensions  
**Solution**: Version your extensions independently from airport-db versions
