// Export types
export * from "./types/airport.js";
export * from "./types/infrastructure.js";
export * from "./types/operational.js";
export * from "./types/search.js";

// Export database functions
export { getDatabase, closeDatabase } from "./database.js";

// Export query functions
export {
  getAirportByICAO,
  getAirportByIATA,
  getAirportByFAA,
  getAirportsByCountry,
  getAirportsByState,
  getAirportsByCity,
  getAirportsByType,
  getAirportsWithTowers,
  searchAirports,
  countAirports,
} from "./queries.js";
