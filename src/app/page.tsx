"use client";

import { useState, useEffect, useCallback } from "react";
import { Guest } from "@/types/guest";
import Sparkles from "@/components/Sparkles";
import GuestForm from "@/components/GuestForm";
import GuestList from "@/components/GuestList";
import StatsBar from "@/components/StatsBar";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    const session = sessionStorage.getItem("admin_auth");
    if (session === "true") {
      setAuthenticated(true);
    }
    setCheckingSession(false);
  }, []);

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
    if (authenticated) {
      fetchGuests();
    }
  }, [authenticated, fetchGuests]);

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        sessionStorage.setItem("admin_auth", "true");
        setAuthenticated(true);
      } else {
        setLoginError("Contraseña incorrecta");
      }
    } catch {
      setLoginError("Error de conexion");
    } finally {
      setLoginLoading(false);
    }
  }

  // Logout
  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    setAuthenticated(false);
    setPassword("");
    setGuests([]);
  }

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

  // Loading check
  if (checkingSession) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <Sparkles />
        <p className="text-foreground/50 font-medium text-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen px-4 relative">
        <Sparkles />

        <div className="relative z-10 w-full max-w-sm space-y-8 text-center">
          {/* Monster icon */}
          <div className="monster-bounce inline-block text-7xl">👾</div>

          <div>
            <h1 className="font-display text-3xl font-bold text-shimmer">
              Cumple de Taddeo
            </h1>
            <p className="text-foreground/50 mt-2 font-medium">
              Panel de Administracion
            </p>
          </div>

          <form onSubmit={handleLogin} className="card-glow rounded-2xl p-6 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/70 mb-1 text-left">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña..."
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {loginError && (
              <p className="text-accent-pink text-sm font-medium">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-primary-dark to-primary py-3 px-6 font-bold text-background text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 glow-pulse"
            >
              {loginLoading ? "Verificando..." : "🎵 Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
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
            <button
              onClick={handleLogout}
              className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground/60 hover:border-accent-pink hover:text-accent-pink transition-all"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-6xl px-4 py-8 space-y-8">
        {/* Stats */}
        <StatsBar guests={guests} />

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
