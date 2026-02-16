import { Command } from "commander";
import chalk from "chalk";
import type { Airport } from "./types/airport.js";
import {
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
  closeDatabase,
} from "./index.js";

const program = new Command();

program
  .name("airport-db")
  .description("Query airport data from the command line")
  .version("0.1.0")
  .option("--icao <code>", "Get airport by ICAO code")
  .option("--iata <code>", "Get airport by IATA code")
  .option("--faa <code>", "Get airport by FAA code")
  .option("--stats", "Show database statistics")
  .action((options: any) => {
    // Handle option-based queries at the root level
    if (options.icao) {
      try {
        const airport = getAirportByICAO(options.icao.toUpperCase());
        if (airport) {
          printAirport(airport);
        } else {
          console.log(
            chalk.yellow(`No airport found with ICAO code: ${options.icao}`),
          );
        }
      } catch (error) {
        console.error(chalk.red("Error:"), (error as Error).message);
      } finally {
        closeDatabase();
      }
    } else if (options.iata) {
      try {
        const airport = getAirportByIATA(options.iata.toUpperCase());
        if (airport) {
          printAirport(airport);
        } else {
          console.log(
            chalk.yellow(`No airport found with IATA code: ${options.iata}`),
          );
        }
      } catch (error) {
        console.error(chalk.red("Error:"), (error as Error).message);
      } finally {
        closeDatabase();
      }
    } else if (options.faa) {
      try {
        const airport = getAirportByFAA(options.faa.toUpperCase());
        if (airport) {
          printAirport(airport);
        } else {
          console.log(
            chalk.yellow(`No airport found with FAA code: ${options.faa}`),
          );
        }
      } catch (error) {
        console.error(chalk.red("Error:"), (error as Error).message);
      } finally {
        closeDatabase();
      }
    } else if (options.stats) {
      try {
        const total = countAirports();
        console.log(chalk.blue("Airport Database Statistics"));
        console.log("");
        console.log(`Total Airports: ${chalk.cyan(total)}`);
      } catch (error) {
        console.error(chalk.red("Error:"), (error as Error).message);
      } finally {
        closeDatabase();
      }
    }
  });

// Get airport by ICAO
program
  .command("icao <code>")
  .description("Get airport by ICAO code")
  .action((code: string) => {
    try {
      const airport = getAirportByICAO(code.toUpperCase());
      if (airport) {
        printAirport(airport);
      } else {
        console.log(chalk.yellow(`No airport found with ICAO code: ${code}`));
      }
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Get airport by IATA
program
  .command("iata <code>")
  .description("Get airport by IATA code")
  .action((code: string) => {
    try {
      const airport = getAirportByIATA(code.toUpperCase());
      if (airport) {
        printAirport(airport);
      } else {
        console.log(chalk.yellow(`No airport found with IATA code: ${code}`));
      }
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Get airports by country
program
  .command("country <code>")
  .description("Get all airports in a country by ISO code")
  .option("-l, --limit <n>", "Limit results", "20")
  .action((code: string, options: any) => {
    try {
      const airports = getAirportsByCountry(code.toUpperCase());
      const limit = parseInt(options.limit);
      console.log(
        chalk.blue(
          `Found ${airports.length} airports in ${code.toUpperCase()}`,
        ),
      );
      console.log("");

      airports.slice(0, limit).forEach((airport: Airport, index: number) => {
        console.log(
          `${index + 1}. ${chalk.cyan(airport.identity.icao)} ${chalk.gray(
            airport.identity.iata || "N/A",
          )} - ${airport.identity.name}`,
        );
        console.log(`   Type: ${airport.identity.type}`);
        console.log(
          `   Location: ${airport.location.city}, ${airport.location.state}`,
        );
        console.log("");
      });

      if (airports.length > limit) {
        console.log(
          chalk.gray(`... and ${airports.length - limit} more results`),
        );
      }
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Get airports by state
program
  .command("state <state> [countryCode]")
  .description("Get airports by state/province")
  .option("-l, --limit <n>", "Limit results", "20")
  .action((state: string, countryCode: string, options: any) => {
    try {
      const airports = getAirportsByState(state, countryCode);
      const limit = parseInt(options.limit);
      console.log(
        chalk.blue(
          `Found ${airports.length} airports in ${state}${
            countryCode ? ` (${countryCode})` : ""
          }`,
        ),
      );
      console.log("");

      airports.slice(0, limit).forEach((airport: Airport, index: number) => {
        console.log(
          `${index + 1}. ${chalk.cyan(airport.identity.icao)} - ${
            airport.identity.name
          }`,
        );
        console.log(`   City: ${airport.location.city || "N/A"}`);
        console.log("");
      });

      if (airports.length > limit) {
        console.log(
          chalk.gray(`... and ${airports.length - limit} more results`),
        );
      }
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Get airports by city
program
  .command("city <city>")
  .description("Get airports in a city")
  .option("-l, --limit <n>", "Limit results", "20")
  .action((city: string, options: any) => {
    try {
      const airports = getAirportsByCity(city);
      const limit = parseInt(options.limit);
      console.log(chalk.blue(`Found ${airports.length} airports in ${city}`));
      console.log("");

      airports.slice(0, limit).forEach((airport: Airport, index: number) => {
        console.log(
          `${index + 1}. ${chalk.cyan(airport.identity.icao)} - ${
            airport.identity.name
          }`,
        );
        console.log(`   Country: ${airport.location.country}`);
        console.log("");
      });

      if (airports.length > limit) {
        console.log(
          chalk.gray(`... and ${airports.length - limit} more results`),
        );
      }
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Get airports by type
program
  .command("type <type>")
  .description("Get airports by type (e.g., large_airport, small_airport)")
  .option("-l, --limit <n>", "Limit results", "20")
  .action((type: string, options: any) => {
    try {
      const airports = getAirportsByType(type);
      const limit = parseInt(options.limit);
      console.log(chalk.blue(`Found ${airports.length} ${type} airports`));
      console.log("");

      airports.slice(0, limit).forEach((airport: Airport, index: number) => {
        console.log(
          `${index + 1}. ${chalk.cyan(airport.identity.icao)} - ${
            airport.identity.name
          }`,
        );
        console.log(`   Country: ${airport.location.country}`);
        console.log("");
      });

      if (airports.length > limit) {
        console.log(
          chalk.gray(`... and ${airports.length - limit} more results`),
        );
      }
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Get airports with towers
program
  .command("towers")
  .description("Get all airports with control towers")
  .option("-l, --limit <n>", "Limit results", "20")
  .action((options: any) => {
    try {
      const airports = getAirportsWithTowers();
      const limit = parseInt(options.limit);
      console.log(chalk.blue(`Found ${airports.length} airports with towers`));
      console.log("");

      airports.slice(0, limit).forEach((airport: Airport, index: number) => {
        console.log(
          `${index + 1}. ${chalk.cyan(airport.identity.icao)} - ${
            airport.identity.name
          }`,
        );
        console.log(`   Country: ${airport.location.country}`);
        console.log("");
      });

      if (airports.length > limit) {
        console.log(
          chalk.gray(`... and ${airports.length - limit} more results`),
        );
      }
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Advanced search
program
  .command("search")
  .description("Advanced search with multiple criteria")
  .option("-i, --icao <code>", "ICAO code")
  .option("-a, --iata <code>", "IATA code")
  .option("-n, --name <name>", "Airport name (partial match)")
  .option("-c, --country <country>", "Country")
  .option("-cc, --country-code <code>", "ISO country code")
  .option("-s, --state <state>", "State/province")
  .option("-y, --city <city>", "City")
  .option("-t, --type <type>", "Airport type")
  .option("-T, --towers", "Only airports with towers")
  .option("-l, --limit <n>", "Limit results", "20")
  .action((options: any) => {
    try {
      const searchOpts: any = {};
      if (options.icao) searchOpts.icao = options.icao;
      if (options.iata) searchOpts.iata = options.iata;
      if (options.name) searchOpts.name = options.name;
      if (options.country) searchOpts.country = options.country;
      if (options.countryCode) searchOpts.countryCode = options.countryCode;
      if (options.state) searchOpts.state = options.state;
      if (options.city) searchOpts.city = options.city;
      if (options.type) searchOpts.type = options.type;
      if (options.towers) searchOpts.hasTower = true;

      const airports = searchAirports(searchOpts);
      const limit = parseInt(options.limit);

      console.log(chalk.blue(`Found ${airports.length} matching airports`));
      console.log("");

      airports.slice(0, limit).forEach((airport: Airport, index: number) => {
        console.log(
          `${index + 1}. ${chalk.cyan(airport.identity.icao)} ${chalk.gray(
            airport.identity.iata || "N/A",
          )} - ${airport.identity.name}`,
        );
        console.log(`   Type: ${airport.identity.type}`);
        console.log(
          `   Location: ${airport.location.city || "N/A"}, ${
            airport.location.state || "N/A"
          }`,
        );
        console.log("");
      });

      if (airports.length > limit) {
        console.log(
          chalk.gray(`... and ${airports.length - limit} more results`),
        );
      }
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Statistics
program
  .command("stats")
  .description("Show database statistics")
  .action(() => {
    try {
      const total = countAirports();
      console.log(chalk.blue("Airport Database Statistics"));
      console.log("");
      console.log(`Total Airports: ${chalk.cyan(total)}`);
    } catch (error) {
      console.error(chalk.red("Error:"), (error as Error).message);
    } finally {
      closeDatabase();
    }
  });

// Helper function to print airport details
function printAirport(airport: Airport): void {
  console.log("");
  console.log(chalk.cyan("═".repeat(60)));
  console.log(chalk.bold.cyan(airport.identity.name));
  console.log(chalk.cyan("═".repeat(60)));
  console.log("");

  console.log(chalk.bold("Identity:"));
  console.log(`  ICAO: ${airport.identity.icao}`);
  if (airport.identity.iata) console.log(`  IATA: ${airport.identity.iata}`);
  if (airport.identity.faa) console.log(`  FAA: ${airport.identity.faa}`);
  console.log(`  Type: ${airport.identity.type}`);
  if (airport.identity.status)
    console.log(`  Status: ${airport.identity.status}`);
  console.log("");

  console.log(chalk.bold("Location:"));
  console.log(
    `  Coordinates: ${airport.location.latitude.toFixed(4)}, ${airport.location.longitude.toFixed(
      4,
    )}`,
  );
  console.log(
    `  Elevation: ${airport.location.elevationFt.toLocaleString()} ft`,
  );
  console.log(`  Country: ${airport.location.country}`);
  if (airport.location.state) console.log(`  State: ${airport.location.state}`);
  if (airport.location.city) console.log(`  City: ${airport.location.city}`);
  if (airport.location.timezone)
    console.log(`  Timezone: ${airport.location.timezone}`);
  console.log("");

  console.log(chalk.bold("Infrastructure:"));
  console.log(
    `  Runways: ${airport.infrastructure.runways.length || "Unknown"}`,
  );
  if (airport.infrastructure.runways.length > 0) {
    airport.infrastructure.runways.forEach((rwy: any) => {
      const runwayLabel =
        Array.isArray(rwy.ends) && rwy.ends.length > 0
          ? rwy.ends.map((end: any) => end.ident).join("/")
          : `Runway ${rwy.id}`;
      console.log(
        `    - ${runwayLabel}: ${rwy.lengthFt}x${rwy.widthFt} ft, ${rwy.surface}${
          rwy.lighted ? " (Lit)" : ""
        }`,
      );
    });
  }
  console.log(
    `  Control Tower: ${airport.infrastructure.hasTower ? "Yes" : "No"}`,
  );
  if (
    airport.infrastructure.fuelTypes &&
    airport.infrastructure.fuelTypes.length > 0
  ) {
    console.log(`  Fuel Types: ${airport.infrastructure.fuelTypes.join(", ")}`);
  }
  console.log(`  FBO: ${airport.infrastructure.hasFBO ? "Yes" : "No"}`);
  console.log(`  Hangars: ${airport.infrastructure.hasHangars ? "Yes" : "No"}`);
  console.log(
    `  Tie-downs: ${airport.infrastructure.hasTieDowns ? "Yes" : "No"}`,
  );

  if (airport.operational) {
    console.log("");
    console.log(chalk.bold("Operational:"));
    console.log(`  AIRAC Cycle: ${airport.operational.airacCycle}`);
    if (airport.operational.frequencies) {
      const freq = airport.operational.frequencies;
      console.log("  Frequencies:");
      if (freq.atis) console.log(`    ATIS: ${freq.atis}`);
      if (freq.tower) console.log(`    Tower: ${freq.tower}`);
      if (freq.ground) console.log(`    Ground: ${freq.ground}`);
      if (freq.clearance) console.log(`    Clearance: ${freq.clearance}`);
      if (freq.unicom) console.log(`    UNICOM: ${freq.unicom}`);
      if (freq.approach) console.log(`    Approach: ${freq.approach}`);
      if (freq.departure) console.log(`    Departure: ${freq.departure}`);
    }
  }

  console.log("");
  console.log(chalk.cyan("═".repeat(60)));
  console.log("");
}

export function runCLI(args: string[]): void {
  program.parse(args, { from: "user" });
}
