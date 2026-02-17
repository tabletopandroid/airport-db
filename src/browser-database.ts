import initSqlJs from "sql.js";
import type { Database as SqlJsDatabase, SqlJsStatic } from "sql.js";
import type {
  BrowserDatabaseInitOptions,
  QueryDatabase,
  QueryStatement,
} from "./database.js";

class BrowserStatement implements QueryStatement {
  constructor(
    private readonly db: SqlJsDatabase,
    private readonly sql: string,
  ) {}

  get(...params: any[]): any {
    const stmt = this.db.prepare(this.sql);
    try {
      if (params.length > 0) {
        stmt.bind(params as any[]);
      }

      if (!stmt.step()) {
        return undefined;
      }

      return stmt.getAsObject();
    } finally {
      stmt.free();
    }
  }

  all(...params: any[]): any[] {
    const stmt = this.db.prepare(this.sql);
    try {
      if (params.length > 0) {
        stmt.bind(params as any[]);
      }

      const rows: any[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      return rows;
    } finally {
      stmt.free();
    }
  }
}

class BrowserDatabase implements QueryDatabase {
  constructor(private readonly db: SqlJsDatabase) {}

  prepare(sql: string): QueryStatement {
    return new BrowserStatement(this.db, sql);
  }

  close(): void {
    this.db.close();
  }
}

let dbInstance: BrowserDatabase | null = null;
const DEFAULT_CDN_DATABASE_URL =
  "https://cdn.tabletopandroid.com/v0.2.1/airports.sqlite";
const BUNDLED_DATABASE_URL = new URL(
  "./assets/airports.sqlite",
  import.meta.url,
).toString();
const DEFAULT_SQLJS_WASM_URL = new URL(
  "./assets/sql-wasm.wasm",
  import.meta.url,
).toString();

function resolveBytes(databaseBytes: ArrayBuffer | Uint8Array): Uint8Array {
  if (databaseBytes instanceof Uint8Array) {
    return databaseBytes;
  }

  return new Uint8Array(databaseBytes);
}

function isLikelyCorsOrNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return error.name === "TypeError";
}

async function fetchDatabaseBytesFromUrl(
  databaseUrl: string,
): Promise<Uint8Array> {
  try {
    const response = await fetch(databaseUrl, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(
        `[airport-db] Failed to fetch SQLite database from "${databaseUrl}" (${response.status} ${response.statusText})`,
      );
    }

    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    if (isLikelyCorsOrNetworkError(error)) {
      throw new Error(
        `[airport-db] Could not fetch SQLite database from "${databaseUrl}". ` +
          "This is commonly caused by CORS or network restrictions. " +
          "If you use a custom CDN/database URL, ensure it serves Access-Control-Allow-Origin. " +
          "You can also pass a same-origin URL or ArrayBuffer/Uint8Array bytes to initializeBrowserDatabase(...).",
      );
    }
    throw error;
  }
}

export async function initializeBrowserDatabase(
  options: BrowserDatabaseInitOptions = {},
): Promise<void> {
  if (dbInstance) {
    return;
  }

  const sqlJsConfig: { locateFile: (file: string) => string } = {
    locateFile: () => options.wasmUrl || DEFAULT_SQLJS_WASM_URL,
  };

  const SQL: SqlJsStatic = await initSqlJs(sqlJsConfig);

  let bytes: Uint8Array;
  if (typeof options.databaseUrl === "string") {
    bytes = await fetchDatabaseBytesFromUrl(options.databaseUrl);
  } else if (options.databaseUrl) {
    bytes = resolveBytes(options.databaseUrl);
  } else {
    try {
      bytes = await fetchDatabaseBytesFromUrl(DEFAULT_CDN_DATABASE_URL);
    } catch (_cdnError) {
      bytes = await fetchDatabaseBytesFromUrl(BUNDLED_DATABASE_URL);
    }
  }

  dbInstance = new BrowserDatabase(new SQL.Database(bytes));
}

export function isBrowserDatabaseInitialized(): boolean {
  return dbInstance !== null;
}

export function getDatabase(): QueryDatabase {
  if (!dbInstance) {
    throw new Error(
      "[airport-db] Browser database is not initialized. Call initializeBrowserDatabase(...) before querying.",
    );
  }
  return dbInstance;
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
