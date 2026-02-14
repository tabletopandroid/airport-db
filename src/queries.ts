import { getDatabase } from "./database.js";
import type {
  Airport,
  AirportIdentity,
  AirportLocation,
  AirportInfrastructure,
  AirportOperational,
  SearchOptions,
} from "./types";

/**
 * Get an airport by ICAO code
 */
export function getAirportByICAO(icao: string): Airport | undefined {
  const db = getDatabase();

  const airportRow = db
    .prepare("SELECT id FROM airports WHERE icao = ?")
    .get(icao) as { id: number } | undefined;

  if (!airportRow) return undefined;

  const identity = db
    .prepare(
      `SELECT 
        icao, iata, faa, local, name, type, type_source as typeSource, 
        status, is_public_use as isPublicUse
      FROM airports WHERE id = ?`,
    )
    .get(airportRow.id) as any;

  const location = db
    .prepare(
      `SELECT 
        latitude, longitude, elevation_ft as elevationFt, country, country_code as countryCode,
        state, county, city, zip, timezone, magnetic_variation as magneticVariation
      FROM airports WHERE id = ?`,
    )
    .get(airportRow.id) as any;

  const infrastructure = getInfrastructureById(airportRow.id);
  const operational = getOperationalById(airportRow.id);

  if (!location) return undefined;

  return {
    identity,
    location,
    infrastructure: infrastructure || { runways: [], hasTower: false },
    operational,
  };
}

/**
 * Get an airport by IATA code
 */
export function getAirportByIATA(iata: string): Airport | undefined {
  const db = getDatabase();
  const icao = db
    .prepare("SELECT icao FROM airports WHERE iata = ?")
    .get(iata) as { icao: string } | undefined;

  if (!icao) return undefined;
  return getAirportByICAO(icao.icao);
}

/**
 * Get an airport by FAA identifier
 */
export function getAirportByFAA(faa: string): Airport | undefined {
  const db = getDatabase();
  const icao = db
    .prepare("SELECT icao FROM airports WHERE faa = ?")
    .get(faa) as { icao: string } | undefined;

  if (!icao) return undefined;
  return getAirportByICAO(icao.icao);
}

/**
 * Search airports by country code
 */
export function getAirportsByCountry(countryCode: string): Airport[] {
  const db = getDatabase();
  const results = db
    .prepare("SELECT icao FROM airports WHERE country_code = ? ORDER BY name")
    .all(countryCode) as Array<{ icao: string }>;

  return results
    .map((r) => getAirportByICAO(r.icao))
    .filter(Boolean) as Airport[];
}

/**
 * Search airports by state/province
 */
export function getAirportsByState(
  state: string,
  countryCode?: string,
): Airport[] {
  const db = getDatabase();
  let results: Array<{ icao: string }>;

  if (countryCode) {
    results = db
      .prepare(
        "SELECT icao FROM airports WHERE state = ? AND country_code = ? ORDER BY name",
      )
      .all(state, countryCode) as Array<{ icao: string }>;
  } else {
    results = db
      .prepare("SELECT icao FROM airports WHERE state = ? ORDER BY name")
      .all(state) as Array<{ icao: string }>;
  }

  return results
    .map((r) => getAirportByICAO(r.icao))
    .filter(Boolean) as Airport[];
}

/**
 * Search airports by city
 */
export function getAirportsByCity(city: string): Airport[] {
  const db = getDatabase();
  const results = db
    .prepare("SELECT icao FROM airports WHERE city = ? ORDER BY name")
    .all(city) as Array<{ icao: string }>;

  return results
    .map((r) => getAirportByICAO(r.icao))
    .filter(Boolean) as Airport[];
}

/**
 * Search airports by type
 */
export function getAirportsByType(type: string): Airport[] {
  const db = getDatabase();
  const results = db
    .prepare("SELECT icao FROM airports WHERE type = ? ORDER BY name")
    .all(type) as Array<{ icao: string }>;

  return results
    .map((r) => getAirportByICAO(r.icao))
    .filter(Boolean) as Airport[];
}

/**
 * Get all airports with control towers
 */
export function getAirportsWithTowers(): Airport[] {
  const db = getDatabase();
  const results = db
    .prepare("SELECT icao FROM airports WHERE has_tower = 1 ORDER BY name")
    .all() as Array<{ icao: string }>;

  return results
    .map((r) => getAirportByICAO(r.icao))
    .filter(Boolean) as Airport[];
}

/**
 * Get infrastructure details for an airport
 */
function getInfrastructureById(
  airportId: number,
): AirportInfrastructure | undefined {
  const db = getDatabase();

  const runways = db
    .prepare(
      `SELECT 
        id, length_ft as lengthFt, width_ft as widthFt, surface, lighting
      FROM runways WHERE airport_id = ?`,
    )
    .all(airportId);

  const hasTower = db
    .prepare("SELECT has_tower FROM airports WHERE id = ?")
    .get(airportId) as { has_tower: boolean } | undefined;

  const infra = db
    .prepare(
      `SELECT has_fbo as hasFBO, has_hangars as hasHangars, has_tie_downs as hasTieDowns
      FROM infrastructure WHERE airport_id = ?`,
    )
    .get(airportId) as any | undefined;

  const fuelTypes = db
    .prepare("SELECT fuel_type FROM fuel_available WHERE airport_id = ?")
    .all(airportId) as Array<{ fuel_type: string }>;

  if (!hasTower) return undefined;

  return {
    runways: runways as any[],
    hasTower: hasTower.has_tower,
    fuelTypes: fuelTypes.map((f) => f.fuel_type),
    hasFBO: infra?.hasFBO,
    hasHangars: infra?.hasHangars,
    hasTieDowns: infra?.hasTieDowns,
  };
}

/**
 * Get operational data for an airport
 */
function getOperationalById(airportId: number): AirportOperational | undefined {
  const db = getDatabase();

  const operational = db
    .prepare(
      `SELECT airac_cycle as airacCycle FROM operational WHERE airport_id = ?`,
    )
    .get(airportId) as { airacCycle: string } | undefined;

  if (!operational) return undefined;

  const frequencies = db
    .prepare(
      `SELECT atis, tower, ground, clearance, unicom, approach, departure
      FROM frequencies WHERE airport_id = ?`,
    )
    .get(airportId) as any | undefined;

  return {
    airacCycle: operational.airacCycle,
    frequencies: frequencies || undefined,
  };
}

/**
 * Advanced search with multiple criteria
 */
export function searchAirports(options: SearchOptions): Airport[] {
  const db = getDatabase();

  let query = "SELECT icao FROM airports WHERE 1=1";
  const params: (string | number | boolean)[] = [];

  if (options.icao) {
    query += " AND icao = ?";
    params.push(options.icao.toUpperCase());
  }

  if (options.iata) {
    query += " AND iata = ?";
    params.push(options.iata.toUpperCase());
  }

  if (options.name) {
    query += " AND name LIKE ?";
    params.push(`%${options.name}%`);
  }

  if (options.country) {
    query += " AND country LIKE ?";
    params.push(`%${options.country}%`);
  }

  if (options.countryCode) {
    query += " AND country_code = ?";
    params.push(options.countryCode.toUpperCase());
  }

  if (options.state) {
    query += " AND state = ?";
    params.push(options.state);
  }

  if (options.city) {
    query += " AND city = ?";
    params.push(options.city);
  }

  if (options.type) {
    query += " AND type = ?";
    params.push(options.type);
  }

  if (options.hasTower !== undefined) {
    query += " AND has_tower = ?";
    params.push(options.hasTower ? 1 : 0);
  }

  query += " ORDER BY name LIMIT 100";

  const results = db.prepare(query).all(...params) as Array<{ icao: string }>;

  return results
    .map((r) => getAirportByICAO(r.icao))
    .filter(Boolean) as Airport[];
}

/**
 * Get total number of airports in the database
 */
export function countAirports(): number {
  const db = getDatabase();
  const result = db.prepare("SELECT COUNT(*) as count FROM airports").get() as {
    count: number;
  };
  return result.count;
}
