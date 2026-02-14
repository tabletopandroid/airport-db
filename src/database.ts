import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

/**
 * Get the path to the airports.sqlite database file
 * Since this project uses local file reference, we construct the path
 */
function getDatabasePath(): string {
  // Get path from node_modules/.pnpm or similar structure
  try {
    // Try resolving the data-sqlite package
    const dataPkgPath =
      require.resolve("@tabletopandroid/airport-db-data-sqlite");
    const pkgRoot = path.dirname(dataPkgPath);
    return path.join(pkgRoot, "data", "airports.sqlite");
  } catch (err) {
    console.error("Error resolving database path:", err);
    // Fallback to relative path (for development or direct usage)
    return path.join(
      __dirname,
      "..",
      "..",
      "airport-db-data-sqlite",
      "data",
      "airports.sqlite",
    );
  }
}

/**
 * Get or create the SQLite database connection
 * The database is opened in read-only mode
 */
let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    const dbPath = getDatabasePath();
    dbInstance = new Database(dbPath, { readonly: true });
  }
  return dbInstance;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export default getDatabase;
