import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

function resolvePackageRoot(specifier) {
  const entryPath = require.resolve(specifier);
  return path.dirname(path.dirname(entryPath));
}

function copyFile(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function main() {
  const thisFile = fileURLToPath(import.meta.url);
  const repoRoot = path.resolve(path.dirname(thisFile), "..");
  const distAssetsDir = path.join(repoRoot, "dist", "assets");

  const dataPkgRoot = resolvePackageRoot(
    "@tabletopandroid/airport-db-data-sqlite",
  );
  const sqliteSource = path.join(dataPkgRoot, "dist", "airports.sqlite");
  const sqliteTarget = path.join(distAssetsDir, "airports.sqlite");

  const sqlJsRoot = resolvePackageRoot("sql.js");
  const wasmSource = path.join(sqlJsRoot, "dist", "sql-wasm.wasm");
  const wasmTarget = path.join(distAssetsDir, "sql-wasm.wasm");

  copyFile(sqliteSource, sqliteTarget);
  copyFile(wasmSource, wasmTarget);

  console.log(`[airport-db] Copied browser assets to ${distAssetsDir}`);
}

try {
  main();
} catch (error) {
  console.error(`[airport-db] ${(error && error.message) || error}`);
  process.exit(1);
}
