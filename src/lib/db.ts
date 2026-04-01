import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) {
      throw new Error("TURSO_DATABASE_URL no está configurada en las variables de entorno");
    }
    client = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

// ---------------------------------------------------------------------------
// Schema initialisation — called once on first request
// ---------------------------------------------------------------------------

let initialised = false;

export async function initDb() {
  if (initialised) return;
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS guests (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      allergies   TEXT NOT NULL DEFAULT '',
      confirmed   INTEGER NOT NULL DEFAULT 0,
      declined    INTEGER NOT NULL DEFAULT 0,
      decline_reason TEXT NOT NULL DEFAULT '',
      companions_count INTEGER NOT NULL DEFAULT 0,
      companions_names TEXT NOT NULL DEFAULT '',
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate existing databases that lack the new columns
  try { await db.execute("ALTER TABLE guests ADD COLUMN companions_count INTEGER NOT NULL DEFAULT 0"); } catch {}
  try { await db.execute("ALTER TABLE guests ADD COLUMN companions_names TEXT NOT NULL DEFAULT ''"); } catch {}

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed default settings
  const defaults: [string, string][] = [
    ["notification_email", ""],
    ["party_date", ""],
    ["party_time", ""],
    ["party_location", ""],
    ["birthday_person", "Taddeo"],
    ["party_age", "9"],
    ["admin_password", "Taddeo2026."],
    ["admin_whatsapp", ""],
    ["party_location_url", ""],
  ];

  for (const [key, value] of defaults) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
      args: [key, value],
    });
  }

  initialised = true;
}
