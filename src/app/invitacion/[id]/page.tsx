import { getDb, initDb } from "@/lib/db";
import { notFound } from "next/navigation";
import InvitationClient from "./InvitationClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvitacionPage({ params }: Props) {
  const { id } = await params;

  await initDb();

  // Fetch guest
  const guestRow = await getDb().execute({
    sql: "SELECT id, name, allergies, confirmed, declined, decline_reason, companions_count, companions_names FROM guests WHERE id = ?",
    args: [id],
  });

  if (guestRow.rows.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-monster-gradient px-4 text-center">
        <div className="text-8xl mb-6 monster-bounce">👾</div>
        <h1 className="font-[var(--font-display)] text-4xl font-bold text-shimmer mb-4">
          Oops! Invitado no encontrado
        </h1>
        <p className="text-xl text-[var(--foreground)]/70 max-w-md">
          Este monstruo no aparece en nuestra lista... 🎵
          <br />
          Verifica tu enlace de invitacion!
        </p>
        <div className="mt-8 text-4xl">🎵 👾 🎶 👾 🎵</div>
      </div>
    );
  }

  const row = guestRow.rows[0];
  const guest = {
    id: row.id as string,
    name: row.name as string,
    allergies: (row.allergies as string) || "",
    confirmed: row.confirmed === 1,
    declined: row.declined === 1,
    decline_reason: (row.decline_reason as string) || "",
    companions_count: Number(row.companions_count) || 0,
    companions_names: (row.companions_names as string) || "",
  };

  // Fetch party settings
  const settingsRows = await getDb().execute(
    "SELECT key, value FROM settings WHERE key IN ('party_date', 'party_time', 'party_location', 'party_location_url')"
  );

  const settings: Record<string, string> = {};
  for (const r of settingsRows.rows) {
    settings[r.key as string] = r.value as string;
  }

  return (
    <InvitationClient
      guest={guest}
      partyDate={settings.party_date || "Abril 2026"}
      partyTime={settings.party_time || "A confirmar"}
      partyLocation={settings.party_location || "A confirmar"}
      partyLocationUrl={settings.party_location_url || ""}
    />
  );
}
