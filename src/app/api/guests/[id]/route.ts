import { getDb, initDb } from "@/lib/db";

// PATCH — confirm or decline a guest
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();

    const { id } = await params;
    const { action, decline_reason } = await request.json();

    // Get guest name for notification
    const guestRow = await getDb().execute({
      sql: "SELECT name FROM guests WHERE id = ?",
      args: [id],
    });

    if (guestRow.rows.length === 0) {
      return Response.json({ error: "Invitado no encontrado" }, { status: 404 });
    }

    const guestName = guestRow.rows[0].name as string;

    // Get admin whatsapp number
    const waRow = await getDb().execute({
      sql: "SELECT value FROM settings WHERE key = 'admin_whatsapp'",
      args: [],
    });
    const adminWhatsapp = (waRow.rows[0]?.value as string) || "";

    if (action === "confirm") {
      await getDb().execute({
        sql: "UPDATE guests SET confirmed = 1, declined = 0, decline_reason = '' WHERE id = ?",
        args: [id],
      });

      // Build WhatsApp notification URL
      let whatsappUrl = "";
      if (adminWhatsapp) {
        const phone = adminWhatsapp.replace(/\D/g, "");
        const msg = `🎉 ¡${guestName} confirmó que va al cumple de Taddeo! 🥳👾🎵`;
        whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      }

      return Response.json({ success: true, action: "confirmed", whatsappUrl });
    }

    if (action === "decline") {
      await getDb().execute({
        sql: "UPDATE guests SET declined = 1, confirmed = 0, decline_reason = ? WHERE id = ?",
        args: [decline_reason?.trim() ?? "", id],
      });

      let whatsappUrl = "";
      if (adminWhatsapp) {
        const phone = adminWhatsapp.replace(/\D/g, "");
        const reason = decline_reason?.trim() ? ` Motivo: ${decline_reason.trim()}` : "";
        const msg = `😢 ${guestName} no puede ir al cumple de Taddeo.${reason}`;
        whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      }

      return Response.json({ success: true, action: "declined", whatsappUrl });
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
