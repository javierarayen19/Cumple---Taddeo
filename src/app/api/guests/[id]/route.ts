import db, { initDB } from "@/lib/db";

// PATCH — confirm or decline a guest
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDB();

    const { id } = await params;
    const { action, decline_reason } = await request.json();

    if (action === "confirm") {
      const result = await db.execute({
        sql: "UPDATE guests SET confirmed = 1, declined = 0, decline_reason = '' WHERE id = ?",
        args: [id],
      });

      if (result.rowsAffected === 0) {
        return Response.json({ error: "Invitado no encontrado" }, { status: 404 });
      }

      return Response.json({ success: true, action: "confirmed" });
    }

    if (action === "decline") {
      const result = await db.execute({
        sql: "UPDATE guests SET declined = 1, confirmed = 0, decline_reason = ? WHERE id = ?",
        args: [decline_reason?.trim() ?? "", id],
      });

      if (result.rowsAffected === 0) {
        return Response.json({ error: "Invitado no encontrado" }, { status: 404 });
      }

      return Response.json({ success: true, action: "declined" });
    }

    return Response.json(
      { error: "Acción no válida. Usa 'confirm' o 'decline'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PATCH /api/guests/[id] error:", error);
    return Response.json({ error: "Error del servidor" }, { status: 500 });
  }
}
