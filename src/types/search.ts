import { AirportType } from "./airport";
import { RunwaySurface } from "./infrastructure";

/**
 * Query options for searching airports
 */
export interface SearchOptions {
  /** Search by ICAO code */
  icao?: string;
  /** Search by IATA code */
  iata?: string;
  /** Search by airport name (partial match) */
  name?: string;
  /** Filter by country name */
  country?: string;
  /** Filter by ISO country code */
  countryCode?: string;
  /** Filter by state or province */
  state?: string;
  /** Filter by city */
  city?: string;
  /** Filter by airport type */
  type?: AirportType;
  /** Filter airports with control tower */
  hasTower?: boolean;
  /** Minimum runway length in feet */
  minRunwayLengthFt?: number;
  /** Maximum runway length in feet */
  maxRunwayLengthFt?: number;
  /** Filter by runway surface material */
  surface?: RunwaySurface;
}
