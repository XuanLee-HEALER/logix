import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export interface Preferences {
  topicOrder: string[];
  columns: number;
}

const dbPath = process.env.DB_PATH ?? "./data/logix.db";
const dir = dirname(dbPath);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);
db.run("PRAGMA journal_mode = WAL");
db.run(
  `CREATE TABLE IF NOT EXISTS preferences (
    ip TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
);

const getStmt = db.prepare<{ data: string }, [string]>(
  "SELECT data FROM preferences WHERE ip = ?",
);
const setStmt = db.prepare(
  `INSERT INTO preferences (ip, data, updated_at) VALUES (?1, ?2, ?3)
   ON CONFLICT(ip) DO UPDATE SET data = ?2, updated_at = ?3`,
);

export function getPreferences(ip: string): Preferences | null {
  const row = getStmt.get(ip);
  if (!row) return null;
  return JSON.parse(row.data) as Preferences;
}

export function setPreferences(ip: string, prefs: Preferences): void {
  setStmt.run(ip, JSON.stringify(prefs), Date.now());
}
