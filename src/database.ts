import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

export interface BrowserDatabaseInitOptions {
  databaseUrl?: string | ArrayBuffer | Uint8Array;
  wasmUrl?: string;
}

export interface QueryStatement {
  get: (...params: any[]) => any;
  all: (...params: any[]) => any[];
}

export interface QueryDatabase {
  prepare: (sql: string) => QueryStatement;
  close: () => void;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

/**
 * Get the path to the airports.sqlite database file
 * Since this project uses local file reference, we construct the path
 */
function getDatabasePath(): string {
  try {
    const entryPath = require.resolve("@tabletopandroid/airport-db-data-sqlite");
    const pkgRoot = path.dirname(path.dirname(entryPath));
    return path.join(pkgRoot, "dist", "airports.sqlite");
  } catch (err) {
    console.error("Error resolving database path:", err);
    // Fallback to relative path (for development or direct usage)
    return path.join(
      __dirname,
      "..",
      "..",
      "airport-db-data-sqlite",
      "dist",
      "airports.sqlite",
    );
  }
}

/**
 * Get or create the SQLite database connection
 * The database is opened in read-only mode
 */
let dbInstance: Database.Database | null = null;

export function getDatabase(): QueryDatabase {
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

export async function initializeBrowserDatabase(
  _options?: BrowserDatabaseInitOptions,
): Promise<void> {
  throw new Error(
    "[airport-db] initializeBrowserDatabase is only available in browser builds.",
  );
}

export function isBrowserDatabaseInitialized(): boolean {
  return false;
}

export default getDatabase;
