/**
 * Radio frequencies for airport communication
 */
export interface AirportFrequencies {
  /** ATIS (Automatic Terminal Information Service) frequency */
  atis?: string;
  /** Air Traffic Control tower frequency */
  tower?: string;
  /** Ground control frequency */
  ground?: string;
  /** Clearance delivery frequency */
  clearance?: string;
  /** UNICOM frequency for general aviation */
  unicom?: string;
  /** Approach control frequency */
  approach?: string;
  /** Departure control frequency */
  departure?: string;
}

/**
 * Operational metadata that may update per AIRAC cycle
 * AIRAC (Aeronautical Information Regulation and Control) cycles occur every 28 days
 */
export interface AirportOperational {
  /** AIRAC cycle identifier formatted as "YYCC" (e.g., "2601") */
  airacCycle: string;
  /** Radio frequencies for airport communication */
  frequencies?: AirportFrequencies;
}
