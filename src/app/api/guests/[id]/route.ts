import { getDb, initDb } from "@/lib/db";
import { sendNotificationEmail } from "@/lib/email";

// PATCH — confirm or decline a guest
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();

    const { id } = await params;
    const { action, decline_reason, allergies } = await request.json();

    // Get guest name
    const guestRow = await getDb().execute({
      sql: "SELECT name FROM guests WHERE id = ?",
      args: [id],
    });

    if (guestRow.rows.length === 0) {
      return Response.json({ error: "Invitado no encontrado" }, { status: 404 });
    }

    const guestName = guestRow.rows[0].name as string;

    // Get notification email
    const emailRow = await getDb().execute({
      sql: "SELECT value FROM settings WHERE key = 'notification_email'",
      args: [],
    });
    const notificationEmail = (emailRow.rows[0]?.value as string) || "";

    if (action === "confirm") {
      const allergiesValue = allergies?.trim() ?? "";
      await getDb().execute({
        sql: "UPDATE guests SET confirmed = 1, declined = 0, decline_reason = '', allergies = ? WHERE id = ?",
        args: [allergiesValue, id],
      });

      // Send email notification
      if (notificationEmail) {
        await sendNotificationEmail({
          to: notificationEmail,
          guestName,
          action: "confirmed",
        });
      }

      return Response.json({ success: true, action: "confirmed" });
    }

    if (action === "decline") {
      await getDb().execute({
        sql: "UPDATE guests SET declined = 1, confirmed = 0, decline_reason = ? WHERE id = ?",
        args: [decline_reason?.trim() ?? "", id],
      });

      // Send email notification
      if (notificationEmail) {
        await sendNotificationEmail({
          to: notificationEmail,
          guestName,
          action: "declined",
          reason: decline_reason?.trim(),
        });
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
