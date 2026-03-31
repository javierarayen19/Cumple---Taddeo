"use client";

import { Guest } from "@/types/guest";

interface StatsBarProps {
  guests: Guest[];
}

export default function StatsBar({ guests }: StatsBarProps) {
  const total = guests.length;
  const confirmed = guests.filter((g) => g.confirmed).length;
  const pending = guests.filter((g) => !g.confirmed && !g.declined).length;
  const declined = guests.filter((g) => g.declined).length;

  const stats = [
    { label: "Total", value: total, emoji: "👾", color: "text-accent-blue", bg: "bg-accent-blue/15" },
    { label: "Confirmados", value: confirmed, emoji: "✅", color: "text-primary", bg: "bg-primary/15" },
    { label: "Pendientes", value: pending, emoji: "⏳", color: "text-accent-yellow", bg: "bg-accent-yellow/15" },
    { label: "Rechazados", value: declined, emoji: "❌", color: "text-accent-pink", bg: "bg-accent-pink/15" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="card-glow rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">{stat.emoji}</p>
          <p className={`font-display text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
