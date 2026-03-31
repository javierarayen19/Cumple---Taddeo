import { getDb, initDb } from "@/lib/db";

// GET — return all settings as a key-value object
export async function GET() {
  try {
    await initDb();

    const result = await getDb().execute("SELECT key, value FROM settings");

    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      settings[row.key as string] = row.value as string;
    }

    return Response.json(settings);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return Response.json({ error: "Error al obtener configuración" }, { status: 500 });
  }
}

// PATCH — update one or more settings
export async function PATCH(request: Request) {
  try {
    await initDb();

    const updates: Record<string, string> = await request.json();

    if (!updates || typeof updates !== "object") {
      return Response.json({ error: "Formato inválido" }, { status: 400 });
    }

    for (const [key, value] of Object.entries(updates)) {
      await getDb().execute({
        sql: "UPDATE settings SET value = ? WHERE key = ?",
        args: [value, key],
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return Response.json({ error: "Error al actualizar configuración" }, { status: 500 });
  }
}
