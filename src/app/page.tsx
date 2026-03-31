"use client";

import { useState, useEffect, useCallback } from "react";
import { Guest } from "@/types/guest";
import Sparkles from "@/components/Sparkles";
import GuestForm from "@/components/GuestForm";
import GuestList from "@/components/GuestList";
import StatsBar from "@/components/StatsBar";
import PartySettings from "@/components/PartySettings";

export default function Home() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(true);

  // Fetch guests
  const fetchGuests = useCallback(async () => {
    setLoadingGuests(true);
    try {
      const res = await fetch("/api/guests");
      if (res.ok) {
        const data = await res.json();
        setGuests(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingGuests(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Delete guest
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
      }
    } catch {
      // silently fail
    }
  }

  // Main admin panel
  return (
    <div className="relative min-h-screen flex flex-col">
      <Sparkles />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-surface/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl monster-bounce">👾</span>
            <div>
              <h1 className="font-display text-xl font-bold text-shimmer">
                🎵👾 Cumple de Taddeo - 9 Años
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="rounded-lg bg-secondary/20 px-2 py-0.5 text-[10px] font-bold text-secondary uppercase tracking-wider">
                  My Singing Monsters
                </span>
                <span className="rounded-lg bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <span className="rounded-xl bg-secondary/20 border border-secondary/30 px-4 py-2 text-sm font-bold text-secondary">
              🎤 Invitados
            </span>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-6xl px-4 py-8 space-y-8">
        {/* Stats */}
        <StatsBar guests={guests} />

        {/* Party Settings */}
        <PartySettings />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: form */}
          <div className="lg:col-span-2">
            <GuestForm onGuestAdded={fetchGuests} />
          </div>

          {/* Right: guest list */}
          <div className="lg:col-span-3">
            {loadingGuests && guests.length === 0 ? (
              <div className="card-glow rounded-2xl p-8 text-center">
                <p className="text-foreground/50 animate-pulse">Cargando invitados...</p>
              </div>
            ) : (
              <GuestList guests={guests} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 text-center">
        <p className="text-sm text-foreground/40 font-medium">
          Hecho con amor para Taddeo 🎵
        </p>
      </footer>
    </div>
  );
}
