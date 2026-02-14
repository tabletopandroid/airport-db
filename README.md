# 📦 `airport-db`

A modern, structured, and extensible airport database for Node.js applications.

`airport-db` provides developer-friendly airport metadata designed for:

- Aviation platforms
- Flight simulation tools
- Mapping and GIS applications
- Analytics systems
- Aviation research
- Backend APIs

Unlike basic ICAO/IATA lookup libraries, `airport-db` includes structured infrastructure, geographic context, and optional AIRAC-aware operational data.

# ✈️ Installation

```bash
npm install airport-db
```

# 🚀 Quick Start

```ts
import { getAirport, searchAirports } from "airport-db";

const jfk = getAirport("KJFK");

console.log(jfk.identity.name);
// John F Kennedy International Airport

const results = searchAirports({
  country: "US",
  minRunwayLength: 5000,
});
```

# 🧱 Data Architecture

`airport-db` is structured into layered domains:

```
Airport
├── identity
├── location
├── infrastructure
└── operational (optional / AIRAC-versioned)
```

Each airport record is normalized and typed.

# 📘 Schema Overview

## 1️⃣ Identity

Stable identifiers and classification.

```ts
identity: {
  icao: string
  iata?: string
  faa?: string
  local?: string
  name: string
  type:
    | "large_airport"
    | "medium_airport"
    | "small_airport"
    | "heliport"
    | "seaplane_base"
    | "closed"
  status?: "operational" | "closed" | "military" | "private"
}
```

## 2️⃣ Location

Geographic and regional context.

```ts
location: {
  latitude: number
  longitude: number
  elevationFt: number
  country: string
  countryCode: string
  state?: string
  county?: string
  city?: string
  zip?: string
  timezone?: string
  magneticVariation?: number
}
```

## 3️⃣ Infrastructure

Physical airport characteristics.

```ts
infrastructure: {
  runways: {
    id: string
    lengthFt: number
    widthFt: number
    surface: "asphalt" | "concrete" | "grass" | "gravel" | "water"
    lighting: boolean
  }[]
  hasTower: boolean
  fuelTypes?: ("100LL" | "JetA" | "MOGAS")[]
  hasFBO?: boolean
  hasHangars?: boolean
  hasTieDowns?: boolean
}
```

## 4️⃣ Operational (Optional)

AIRAC-aligned operational metadata.

```ts
operational?: {
  airacCycle: string
  frequencies?: {
    atis?: string
    tower?: string
    ground?: string
    unicom?: string
  }
}
```

Operational data may update independently of core identity data.

# 🔁 Versioning & AIRAC

`airport-db` uses semantic versioning:

```
MAJOR.MINOR.PATCH
```

When applicable, releases may align with AIRAC cycles:

```
v1.4.0  → AIRAC 2601
v1.5.0  → AIRAC 2602
```

Operational layers may update every 28 days.

Core identity data updates less frequently.

# 🔍 Query Utilities

Built-in helpers:

```ts
getAirport(icao: string)
getAirportByIATA(iata: string)
searchAirports(filters: SearchOptions)
getNearbyAirports(lat: number, lon: number, radiusNm: number)
```

Example:

```ts
const nearby = getNearbyAirports(33.6407, -84.4277, 50);
```

# 🧩 Extensibility

`airport-db` is intentionally neutral.

Developers may extend airport records using:

```ts
declare module "airport-db" {
  interface AirportExtension {
    customField?: string;
  }
}
```

This allows:

- Economic layers
- Risk modeling
- Agency tagging
- Application-specific metadata

Without polluting the core schema.

# 🌍 Data Sources

`airport-db` aggregates publicly available aviation datasets including:

- National aviation authority publications
- Public airport master records
- Open geographic datasets

Redistribution is limited to legally permitted public-domain or licensed data.

# ⚖️ Licensing

This package includes only redistributable airport metadata.

It does **not** include:

- Proprietary procedure coding (SIDs/STARs)
- Commercial navigation datasets
- Restricted redistribution data
