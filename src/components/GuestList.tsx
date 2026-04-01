"use client";

import { useState } from "react";
import { Guest } from "@/types/guest";

interface GuestListProps {
  guests: Guest[];
  onDelete: (id: string) => void;
}

function getStatusBadge(guest: Guest) {
  if (guest.confirmed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
        ✅ Confirmado
      </span>
    );
  }
  if (guest.declined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-accent-pink/20 px-2.5 py-1 text-xs font-bold text-accent-pink">
        ❌ Rechazado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-accent-yellow/20 px-2.5 py-1 text-xs font-bold text-accent-yellow">
      ⏳ Pendiente
    </span>
  );
}

function getInvitationUrl(guestId: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/invitacion/${guestId}`;
}

function buildWhatsAppMessage(guest: Guest) {
  const url = getInvitationUrl(guest.id);
  return `🎵🎮 ¡Hola ${guest.name}! Estás invitado/a al cumple de Taddeo que cumple 9 años! 🥳🎂\n\n¡Abre tu invitación acá! 👇\n${url}\n\n¡Te esperamos! 👾🎵`;
}

export default function GuestList({ guests, onDelete }: GuestListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyLink(guestId: string) {
    const url = getInvitationUrl(guestId);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
    setCopiedId(guestId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function fallbackCopy(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  if (guests.length === 0) {
    return (
      <div className="card-glow rounded-2xl p-8 text-center">
        <p className="text-4xl mb-3">👾</p>
        <p className="text-foreground/50 font-medium">
          No hay invitados aún. ¡Agrega el primero!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
        🎤 Lista de Invitados ({guests.length})
      </h2>

      {guests.map((guest) => {
        const waMessage = buildWhatsAppMessage(guest);
        const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
        const isCopied = copiedId === guest.id;

        return (
          <div key={guest.id} className="card-glow rounded-2xl p-4 space-y-3">
            {/* Top row: name + status */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display font-semibold text-lg text-foreground truncate">
                {guest.name}
              </h3>
              {getStatusBadge(guest)}
            </div>

            {/* Allergies */}
            {guest.allergies && (
              <div className="flex flex-wrap gap-1.5">
                {guest.allergies.split(",").map((a, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-accent-orange/15 px-2 py-0.5 text-xs font-semibold text-accent-orange"
                  >
                    {a.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Decline reason */}
            {guest.declined && guest.decline_reason && (
              <p className="text-xs text-foreground/40 italic">
                Motivo: {guest.decline_reason}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Copy invitation link */}
              <button
                onClick={() => copyLink(guest.id)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isCopied
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-surface text-foreground/70 hover:border-accent-blue hover:text-accent-blue"
                }`}
                title="Copiar enlace de invitación"
              >
                {isCopied ? "✅ ¡Copiado!" : "🔗 Copiar enlace"}
              </button>

              {/* WhatsApp send invitation */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-primary hover:text-primary transition-all"
              >
                💬 Enviar por WhatsApp
              </a>

              {/* Delete */}
              <button
                onClick={() => {
                  if (confirm(`¿Eliminar a ${guest.name}?`)) {
                    onDelete(guest.id);
                  }
                }}
                className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-accent-pink hover:text-accent-pink transition-all ml-auto"
                title="Eliminar invitado"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
