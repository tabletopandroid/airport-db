import test from "node:test";
import assert from "node:assert/strict";

import {
  getDatabase,
  closeDatabase,
  getAirportByICAO,
  getAirportByIATA,
  getAirportByFAA,
  searchAirports,
  countAirports,
} from "../dist/index.js";

function getSampleAirportRow() {
  const db = getDatabase();
  return db
    .prepare(
      "SELECT icao, iata, faa, country_code as countryCode FROM airports WHERE icao IS NOT NULL LIMIT 1",
    )
    .get();
}

test("node runtime can open database and return airport counts", () => {
  const dbCountRow = getDatabase()
    .prepare("SELECT COUNT(*) as count FROM airports")
    .get();

  assert.ok(typeof dbCountRow.count === "number");
  assert.equal(countAirports(), dbCountRow.count);
  assert.ok(countAirports() > 0);
});

test("getAirportByICAO returns a full airport record for a known ICAO", () => {
  const sample = getSampleAirportRow();
  assert.ok(sample?.icao);

  const airport = getAirportByICAO(sample.icao);
  assert.ok(airport);
  assert.equal(airport.identity.icao, sample.icao);
  assert.ok(airport.location.countryCode);
});

test("lookup helpers and search results are consistent", () => {
  const sample = getSampleAirportRow();
  assert.ok(sample?.icao);
  assert.ok(sample?.countryCode);

  const bySearch = searchAirports({ icao: sample.icao });
  assert.ok(bySearch.length >= 1);
  assert.equal(bySearch[0].identity.icao, sample.icao);

  const byCountrySearch = searchAirports({ countryCode: sample.countryCode });
  assert.ok(byCountrySearch.length >= 1);

  if (sample.iata) {
    const byIata = getAirportByIATA(sample.iata);
    assert.ok(byIata);
    assert.equal(byIata.identity.icao, sample.icao);
  }

  if (sample.faa) {
    const byFaa = getAirportByFAA(sample.faa);
    assert.ok(byFaa);
    assert.equal(byFaa.identity.icao, sample.icao);
  }
});

test("closeDatabase is safe and subsequent queries reopen the connection", () => {
  closeDatabase();
  closeDatabase();

  const total = countAirports();
  assert.ok(total > 0);
});
