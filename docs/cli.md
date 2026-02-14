# Command Line Interface

Query airports from the terminal.

## Installation

The CLI is included when you install the package:

```bash
npm install -g airport-db @tabletopandroid/airport-db-data-sqlite
```

Or use `npx` without installing:

```bash
npx airport-db --icao klzu
```

## Lookup Commands

### By Code

```bash
# ICAO code
airport-db --icao klzu

# IATA code
airport-db --iata lzu

# FAA identifier
airport-db --faa lzu

# Alternative: subcommand syntax
airport-db icao klzu
airport-db iata lzu
```

### By Location

```bash
# All airports in country
airport-db country us --limit 10

# Airports in state
airport-db state california --limit 5
airport-db state "New York" US

# Airports in city
airport-db city "Los Angeles" --limit 20
```

### By Type

```bash
# All large airports worldwide
airport-db type large_airport --limit 10

# All heliports
airport-db type heliport --limit 5
```

### Special Queries

```bash
# All airports with control towers
airport-db towers --limit 15

# Database statistics
airport-db --stats
airport-db stats
```

## Advanced Search

Use `search` with multiple filters:

```bash
airport-db search \
  --country-code US \
  --state California \
  --towers \
  --type large_airport \
  --limit 5
```

**Available filters:**

```
--icao <code>           ICAO code (exact)
--iata <code>           IATA code (exact)
--name <name>           Name (partial match)
--country <name>        Country (partial match)
--country-code <code>   ISO country code
--state <state>         State/province
--city <city>           City
--type <type>           Airport type
--towers                Only towered airports
--limit <n>             Results limit (default: 20)
```

## Examples

### Find international airports

```bash
airport-db search \
  --country-code US \
  --type large_airport \
  --towers
```

### Find regional alternatives

```bash
airport-db city "New York" --limit 10
```

### Check statistics

```bash
airport-db --stats

# Output:
# Airport Database Statistics
#
# Total Airports: 41,830
```

### Airport details

```bash
$ airport-db icao klzu

════════════════════════════════════════════════════════
Gwinnett County Airport
════════════════════════════════════════════════════════

Identity:
  ICAO: KLZU
  IATA: LZU
  Type: small_airport

Location:
  Coordinates: 33.9912, -84.1926
  Elevation: 1,026 ft
  Country: United States
  State: Georgia
  City: Lawrenceville
  Timezone: America/New_York

Infrastructure:
  Runways: 3
    - 08/26: 8,000x150 ft, asphalt (Lit)
    - 09/27: 9,000x150 ft, asphalt (Lit)
    - 15/33: 6,000x150 ft, asphalt
  Control Tower: Yes
  Fuel Types: Jet A, 100LL

Operational:
  AIRAC Cycle: 2601
  Frequencies:
    ATIS: 126.30
    Tower: 118.10
    Ground: 121.85
```

## Output Options

All commands support `--limit` to control result count:

```bash
airport-db country us --limit 5   # Show first 5
airport-db search --towers --limit 1
```

Without `--limit`, default is 20 results.

## Help

```bash
airport-db --help
airport-db icao --help
airport-db search --help
```
