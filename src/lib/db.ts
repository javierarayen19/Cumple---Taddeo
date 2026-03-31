import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;

// ---------------------------------------------------------------------------
// Schema initialisation — called once on first request
// ---------------------------------------------------------------------------

let initialised = false;

export async function initDB() {
  if (initialised) return;

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS guests (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      allergies   TEXT DEFAULT '',
      confirmed   INTEGER DEFAULT 0,
      declined    INTEGER DEFAULT 0,
      decline_reason TEXT DEFAULT '',
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed default settings (INSERT OR IGNORE so existing values are kept)
  const defaults: [string, string][] = [
    ["notification_email", ""],
    ["party_date", ""],
    ["party_time", ""],
    ["party_location", ""],
    ["birthday_person", "Taddeo"],
    ["party_age", "9"],
    ["admin_password", "Taddeo2026."],
  ];

  for (const [key, value] of defaults) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
      args: [key, value],
    });
  }

  initialised = true;
}
