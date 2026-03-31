"use client";

import { Guest } from "@/types/guest";

interface GuestListProps {
  guests: Guest[];
  onDelete: (id: string) => void;
}

function getStatusBadge(guest: Guest) {
  if (guest.confirmed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
        Confirmado
      </span>
    );
  }
  if (guest.declined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-accent-pink/20 px-2.5 py-1 text-xs font-bold text-accent-pink">
        Rechazado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-accent-yellow/20 px-2.5 py-1 text-xs font-bold text-accent-yellow">
      Pendiente
    </span>
  );
}

function buildInvitationMessage(guest: Guest) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/invitacion/${guest.id}`;
  return `🎵🎮 Hola ${guest.name}! Estas invitado/a al cumple de Taddeo que cumple 9 años! 🥳🎂\n\nAbre tu invitacion aqui:\n${url}\n\nTe esperamos! 👾🎵`;
}

function copyToClipboard(text: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
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

export default function GuestList({ guests, onDelete }: GuestListProps) {
  if (guests.length === 0) {
    return (
      <div className="card-glow rounded-2xl p-8 text-center">
        <p className="text-4xl mb-3">👾</p>
        <p className="text-foreground/50 font-medium">
          No hay invitados aun. Agrega el primero!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
        🎤 Lista de Invitados
      </h2>

      {guests.map((guest) => {
        const message = buildInvitationMessage(guest);
        const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

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
              {/* Copy link */}
              <button
                onClick={() => copyToClipboard(message)}
                className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-accent-blue hover:text-accent-blue transition-all"
                title="Copiar invitacion"
              >
                📋 Copiar
              </button>

              {/* WhatsApp */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-primary hover:text-primary transition-all"
              >
                💬 WhatsApp
              </a>

              {/* Delete */}
              <button
                onClick={() => onDelete(guest.id)}
                className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-accent-pink hover:text-accent-pink transition-all ml-auto"
                title="Eliminar invitado"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
