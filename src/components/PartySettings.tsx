"use client";

import { useState, useEffect } from "react";

export default function PartySettings() {
  const [settings, setSettings] = useState({
    party_date: "",
    party_time: "",
    party_location: "",
    admin_whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          party_date: data.party_date || "",
          party_time: data.party_time || "",
          party_location: data.party_location || "",
          admin_whatsapp: data.admin_whatsapp || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card-glow rounded-2xl p-6 text-center">
        <p className="text-foreground/50 animate-pulse">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="card-glow rounded-2xl p-6 space-y-5">
      <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
        ⚙️ Configurar Invitación
      </h2>

      {/* Fecha */}
      <div>
        <label
          htmlFor="party-date"
          className="block text-sm font-medium text-foreground/70 mb-1"
        >
          📅 Fecha
        </label>
        <input
          id="party-date"
          type="text"
          value={settings.party_date}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, party_date: e.target.value }))
          }
          placeholder="Ej: Sábado 12 de Abril 2026"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Hora */}
      <div>
        <label
          htmlFor="party-time"
          className="block text-sm font-medium text-foreground/70 mb-1"
        >
          🕐 Hora
        </label>
        <input
          id="party-time"
          type="text"
          value={settings.party_time}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, party_time: e.target.value }))
          }
          placeholder="Ej: 15:00 hrs"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
        />
      </div>

      {/* Lugar */}
      <div>
        <label
          htmlFor="party-location"
          className="block text-sm font-medium text-foreground/70 mb-1"
        >
          📍 Lugar
        </label>
        <input
          id="party-location"
          type="text"
          value={settings.party_location}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, party_location: e.target.value }))
          }
          placeholder="Ej: Salón de Fiestas Monster, Av. Principal 123"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 transition-all"
        />
      </div>

      {/* WhatsApp admin */}
      <div>
        <label
          htmlFor="admin-whatsapp"
          className="block text-sm font-medium text-foreground/70 mb-1"
        >
          📱 Tu WhatsApp (para recibir notificaciones)
        </label>
        <input
          id="admin-whatsapp"
          type="text"
          value={settings.admin_whatsapp}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, admin_whatsapp: e.target.value }))
          }
          placeholder="Ej: +56912345678"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <p className="text-xs text-foreground/40 mt-1">
          Cuando alguien confirme o rechace, se abrirá WhatsApp para avisarte
        </p>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-gradient-to-r from-secondary to-accent-pink py-3 px-6 font-bold text-white text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
      >
        {saving ? "Guardando..." : saved ? "✅ Guardado!" : "💾 Guardar Configuración"}
      </button>
    </div>
  );
}
