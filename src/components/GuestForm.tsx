"use client";

import { useState } from "react";

const ALLERGY_OPTIONS = [
  "Ninguna",
  "Gluten",
  "Lactosa",
  "Frutos Secos",
  "Mariscos",
  "Otra",
];

interface GuestFormProps {
  onGuestAdded: () => void;
}

export default function GuestForm({ onGuestAdded }: GuestFormProps) {
  const [name, setName] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleAllergy(allergy: string) {
    setSelectedAllergies((prev) => {
      if (allergy === "Ninguna") {
        return prev.includes("Ninguna") ? [] : ["Ninguna"];
      }
      const without = prev.filter((a) => a !== "Ninguna");
      if (without.includes(allergy)) {
        return without.filter((a) => a !== allergy);
      }
      return [...without, allergy];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    const allergies = selectedAllergies
      .map((a) => (a === "Otra" ? customAllergy.trim() || "Otra" : a))
      .filter((a) => a !== "Ninguna")
      .join(", ");

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), allergies }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear invitado");
      }

      setName("");
      setSelectedAllergies([]);
      setCustomAllergy("");
      onGuestAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-glow rounded-2xl p-6 space-y-5">
      <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
        👾 Nuevo Invitado
      </h2>

      {/* Name input */}
      <div>
        <label htmlFor="guest-name" className="block text-sm font-medium text-foreground/70 mb-1">
          Nombre
        </label>
        <input
          id="guest-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del invitado..."
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Allergy chips */}
      <div>
        <label className="block text-sm font-medium text-foreground/70 mb-2">
          Alergias
        </label>
        <div className="flex flex-wrap gap-2">
          {ALLERGY_OPTIONS.map((allergy) => {
            const isActive = selectedAllergies.includes(allergy);
            return (
              <button
                key={allergy}
                type="button"
                onClick={() => toggleAllergy(allergy)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                  isActive
                    ? "bg-secondary/30 border-secondary text-foreground"
                    : "bg-surface border-border text-foreground/60 hover:border-foreground/30"
                }`}
              >
                {allergy}
              </button>
            );
          })}
        </div>

        {/* Custom allergy input */}
        {selectedAllergies.includes("Otra") && (
          <input
            type="text"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="Especifica la alergia..."
            className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
          />
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-accent-pink text-sm font-medium">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-primary-dark to-primary py-3 px-6 font-bold text-background text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 glow-pulse"
      >
        {loading ? "Agregando..." : "🎵 Agregar Invitado"}
      </button>
    </form>
  );
}
