import { AirportLocation } from "./infrastructure.js";
import { AirportInfrastructure } from "./infrastructure.js";
import { AirportOperational } from "./operational.js";

/**
 * Airport classification types
 */
export type AirportType =
  | "large_airport"
  | "medium_airport"
  | "small_airport"
  | "heliport"
  | "seaplane_base"
  | "balloonport"
  | "ultralight_park"
  | "gliderport"
  | "closed"
  | "other";

/**
 * Data source for airport type classification
 */
export type AirportTypeSource =
  | "ourairports"
  | "openflights"
  | "faa"
  | "icao"
  | "derived"
  | "unknown";

/**
 * Operational status of an airport
 */
export type AirportStatus = "operational" | "closed" | "military" | "private";

/**
 * Stable identifiers and classification for an airport
 */
export interface AirportIdentity {
  /** ICAO code - primary lookup key */
  icao: string;
  /** IATA code (optional) */
  iata?: string;
  /** FAA identifier (optional) */
  faa?: string;
  /** Local identifier (optional) */
  local?: string;
  /** Airport name */
  name: string;
  /** Airport classification type */
  type: AirportType;
  /** Source of the type classification */
  typeSource?: AirportTypeSource;
  /** Operational status */
  status?: AirportStatus;
  /** Whether the airport is available for public use */
  isPublicUse?: boolean;
}

/**
 * Complete airport record combining identity, location, infrastructure, and operational data
 */
export interface Airport {
  /** Identity and classification data */
  identity: AirportIdentity;
  /** Geographic and regional metadata */
  location: AirportLocation;
  /** Physical airport characteristics */
  infrastructure: AirportInfrastructure;
  /** Optional AIRAC-aware operational metadata */
  operational?: AirportOperational;
}

/**
 * Base interface for extending airport data
 */
export interface AirportExtension {}

/**
 * Airport record with custom extensions
 * @template T - Extension type
 */
export type ExtendedAirport<T = AirportExtension> = Airport & T;
