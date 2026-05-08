import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'app.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL,
      grade TEXT NOT NULL,
      school TEXT NOT NULL,
      major TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create unique indexes for email and phone lookups
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)
    WHERE email IS NOT NULL
  `);
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone)
    WHERE phone IS NOT NULL
  `);
}
