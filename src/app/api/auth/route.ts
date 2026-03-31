import { getDb, initDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    await initDb();

    const { password } = await request.json();

    if (!password) {
      return Response.json({ error: "Se requiere contraseña" }, { status: 400 });
    }

    // Check env var first, then DB setting
    const envPassword = process.env.ADMIN_PASSWORD?.trim();

    if (envPassword && password === envPassword) {
      return Response.json({ success: true });
    }

    // Fallback: check DB
    const row = await getDb().execute({
      sql: "SELECT value FROM settings WHERE key = ?",
      args: ["admin_password"],
    });
    const dbPassword = (row.rows[0]?.value as string)?.trim();

    if (dbPassword && password === dbPassword) {
      return Response.json({ success: true });
    }

    return Response.json({ error: "Contraseña incorrecta" }, { status: 401 });
  } catch (error) {
    console.error("Auth error:", error);
    return Response.json({ error: "Error del servidor" }, { status: 500 });
  }
}
