/**
 * Runway surface material types
 */
export type RunwaySurface =
  | "asphalt"
  | "concrete"
  | "grass"
  | "gravel"
  | "water"
  | "dirt"
  | "unknown";

/**
 * Runway specifications and characteristics
 */
export interface Runway {
  /** Unique runway identifier */
  id: string;
  /** Runway length in feet */
  lengthFt: number;
  /** Runway width in feet */
  widthFt: number;
  /** Surface material type */
  surface: RunwaySurface;
  /** Whether the runway has lighting */
  lighting: boolean;
}

/**
 * Available fuel types at an airport
 * Extensible to support region-specific or emerging classifications
 */
export type FuelType = "100LL" | "JetA" | "MOGAS" | "UL94" | "SAF" | string;

/**
 * Physical airport infrastructure characteristics
 */
export interface AirportInfrastructure {
  /** Array of runways at the airport */
  runways: Runway[];
  /** Whether the airport has an air traffic control tower */
  hasTower: boolean;
  /** Available fuel types */
  fuelTypes?: FuelType[];
  /** Whether the airport has a Fixed Base Operator */
  hasFBO?: boolean;
  /** Whether the airport has hangars */
  hasHangars?: boolean;
  /** Whether the airport has tie-down facilities */
  hasTieDowns?: boolean;
}

/**
 * Geographic and regional metadata for an airport
 */
export interface AirportLocation {
  /** Latitude in decimal degrees */
  latitude: number;
  /** Longitude in decimal degrees */
  longitude: number;
  /** Elevation above mean sea level in feet */
  elevationFt: number;
  /** Country name */
  country: string;
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
  /** State or province name */
  state?: string;
  /** County or district name */
  county?: string;
  /** City name */
  city?: string;
  /** Postal code or ZIP code */
  zip?: string;
  /** IANA timezone identifier */
  timezone?: string;
  /** Magnetic variation in degrees (may be AIRAC-dependent) */
  magneticVariation?: number;
}
