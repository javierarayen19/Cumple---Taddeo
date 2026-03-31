import { type NextRequest } from "next/server";
import db, { initDB } from "@/lib/db";

// GET — return all guests
export async function GET() {
  try {
    await initDB();

    const result = await db.execute("SELECT * FROM guests ORDER BY created_at DESC");

    const guests = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      allergies: row.allergies,
      confirmed: row.confirmed === 1,
      declined: row.declined === 1,
      decline_reason: row.decline_reason,
      createdAt: row.created_at,
    }));

    return Response.json(guests);
  } catch (error) {
    console.error("GET /api/guests error:", error);
    return Response.json({ error: "Error al obtener invitados" }, { status: 500 });
  }
}

// POST — create a new guest
export async function POST(request: Request) {
  try {
    await initDB();

    const { name, allergies } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return Response.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const id = crypto.randomUUID();

    await db.execute({
      sql: "INSERT INTO guests (id, name, allergies) VALUES (?, ?, ?)",
      args: [id, name.trim(), allergies?.trim() ?? ""],
    });

    const guest = {
      id,
      name: name.trim(),
      allergies: allergies?.trim() ?? "",
      confirmed: false,
      declined: false,
      decline_reason: "",
      createdAt: new Date().toISOString(),
    };

    return Response.json(guest, { status: 201 });
  } catch (error) {
    console.error("POST /api/guests error:", error);
    return Response.json({ error: "Error al crear invitado" }, { status: 500 });
  }
}

// DELETE — remove a guest by query param ?id=...
export async function DELETE(request: NextRequest) {
  try {
    await initDB();

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Se requiere el id del invitado" }, { status: 400 });
    }

    const result = await db.execute({
      sql: "DELETE FROM guests WHERE id = ?",
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return Response.json({ error: "Invitado no encontrado" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/guests error:", error);
    return Response.json({ error: "Error al eliminar invitado" }, { status: 500 });
  }
}
