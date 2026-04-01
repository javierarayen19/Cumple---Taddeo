import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendNotificationEmail({
  to,
  guestName,
  action,
  reason,
}: {
  to: string;
  guestName: string;
  action: "confirmed" | "declined";
  reason?: string;
}) {
  const r = getResend();
  if (!r || !to) return;

  const isConfirmed = action === "confirmed";

  const subject = isConfirmed
    ? `🎉 ¡${guestName} confirmó que va al cumple de Taddeo!`
    : `😢 ${guestName} no puede ir al cumple de Taddeo`;

  const html = isConfirmed
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #1a3a1a; color: #fff8e7; border-radius: 16px;">
        <div style="text-align: center; font-size: 48px; margin-bottom: 16px;">🎉👾🎵</div>
        <h1 style="text-align: center; color: #7ec636; font-size: 24px; margin-bottom: 8px;">¡Nuevo confirmado!</h1>
        <p style="text-align: center; font-size: 20px; margin-bottom: 24px;">
          <strong style="color: #ffd740;">${guestName}</strong> confirmó que va al cumple de Taddeo 🥳
        </p>
        <div style="background: rgba(126,198,54,0.15); border: 1px solid #7ec636; border-radius: 12px; padding: 16px; text-align: center;">
          <span style="font-size: 14px; color: #a8e63e;">Estado: ✅ Confirmado</span>
        </div>
        <p style="text-align: center; margin-top: 20px; font-size: 12px; color: rgba(255,248,231,0.5);">
          🎵 Cumple de Taddeo — My Singing Monsters Party 👾
        </p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #1a3a1a; color: #fff8e7; border-radius: 16px;">
        <div style="text-align: center; font-size: 48px; margin-bottom: 16px;">😢👾</div>
        <h1 style="text-align: center; color: #e85d9a; font-size: 24px; margin-bottom: 8px;">No puede ir</h1>
        <p style="text-align: center; font-size: 20px; margin-bottom: 24px;">
          <strong style="color: #ffd740;">${guestName}</strong> no puede ir al cumple de Taddeo
        </p>
        ${reason ? `
        <div style="background: rgba(232,93,154,0.15); border: 1px solid #e85d9a; border-radius: 12px; padding: 16px; text-align: center;">
          <span style="font-size: 14px; color: #e85d9a;">Motivo: ${reason}</span>
        </div>
        ` : ""}
        <p style="text-align: center; margin-top: 20px; font-size: 12px; color: rgba(255,248,231,0.5);">
          🎵 Cumple de Taddeo — My Singing Monsters Party 👾
        </p>
      </div>
    `;

  try {
    await r.emails.send({
      from: "Cumple de Taddeo <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });
  } catch (error) {
    console.error("Error enviando email:", error);
  }
}
