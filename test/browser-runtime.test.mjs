import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import {
  initializeBrowserDatabase,
  isBrowserDatabaseInitialized,
  closeDatabase,
  countAirports,
  getAirportByICAO,
} from "../dist/browser.js";

const DIST_ASSETS_DIR = path.resolve(process.cwd(), "dist", "assets");
const SQLITE_PATH = path.join(DIST_ASSETS_DIR, "airports.sqlite");
const SQLJS_WASM_PATH = path.join(DIST_ASSETS_DIR, "sql-wasm.wasm");

test("browser runtime requires initialization before querying", () => {
  closeDatabase();
  assert.equal(isBrowserDatabaseInitialized(), false);

  assert.throws(
    () => getAirportByICAO("KJFK"),
    /Browser database is not initialized/,
  );
});

test("browser runtime initializes with bundled assets and runs queries", async () => {
  closeDatabase();
  assert.ok(fs.existsSync(SQLITE_PATH));
  assert.ok(fs.existsSync(SQLJS_WASM_PATH));

  const sqliteBytes = fs.readFileSync(SQLITE_PATH);

  await initializeBrowserDatabase({
    databaseUrl: sqliteBytes,
    wasmUrl: SQLJS_WASM_PATH,
  });

  assert.equal(isBrowserDatabaseInitialized(), true);
  assert.ok(countAirports() > 0);
});
