"use client";

import { useState, useEffect } from "react";

interface Guest {
  id: string;
  name: string;
  allergies: string;
  confirmed: boolean;
  declined: boolean;
  decline_reason: string;
}

interface Props {
  guest: Guest;
  partyDate: string;
  partyTime: string;
  partyLocation: string;
}

// Floating musical notes for background decoration
const FLOATING_NOTES = [
  { emoji: "🎵", left: "5%", duration: "7s", delay: "0s", size: "1.5rem" },
  { emoji: "🎶", left: "15%", duration: "9s", delay: "1s", size: "1.2rem" },
  { emoji: "🎸", left: "25%", duration: "11s", delay: "2s", size: "1.8rem" },
  { emoji: "🎤", left: "40%", duration: "8s", delay: "0.5s", size: "1.4rem" },
  { emoji: "⭐", left: "55%", duration: "10s", delay: "3s", size: "1.3rem" },
  { emoji: "🎵", left: "65%", duration: "7.5s", delay: "1.5s", size: "1.6rem" },
  { emoji: "👾", left: "75%", duration: "9.5s", delay: "2.5s", size: "1.7rem" },
  { emoji: "🎶", left: "85%", duration: "8.5s", delay: "0.8s", size: "1.1rem" },
  { emoji: "🎮", left: "92%", duration: "10.5s", delay: "3.5s", size: "1.4rem" },
  { emoji: "🎵", left: "50%", duration: "12s", delay: "4s", size: "1.3rem" },
];

export default function InvitationClient({
  guest,
  partyDate,
  partyTime,
  partyLocation,
}: Props) {
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [status, setStatus] = useState<"pending" | "confirmed" | "declined">(
    guest.confirmed ? "confirmed" : guest.declined ? "declined" : "pending"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [justConfirmed, setJustConfirmed] = useState(false);

  // Staged reveal of sections
  useEffect(() => {
    const delays = [0, 500, 1200, 1800, 2200, 2600];
    const timers: NodeJS.Timeout[] = [];

    delays.forEach((delay, index) => {
      const timer = setTimeout(() => {
        setVisibleSections((prev) => [...prev, index]);
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const sendWhatsAppNotification = (whatsappUrl: string) => {
    if (whatsappUrl) {
      // Open WhatsApp in new tab to send notification to admin
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/guests/${guest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm" }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus("confirmed");
        setJustConfirmed(true);
        if (data.whatsappUrl) {
          sendWhatsAppNotification(data.whatsappUrl);
        }
      }
    } catch {
      alert("Hubo un error, intenta de nuevo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!showDeclineInput) {
      setShowDeclineInput(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/guests/${guest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline", decline_reason: declineReason }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus("declined");
        if (data.whatsappUrl) {
          sendWhatsAppNotification(data.whatsappUrl);
        }
      }
    } catch {
      alert("Hubo un error, intenta de nuevo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVisible = (section: number) => visibleSections.includes(section);

  return (
    <div className="min-h-screen bg-monster-gradient relative overflow-hidden">
      {/* Background gradient blurs */}
      <div
        className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: "var(--primary)" }}
      />
      <div
        className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ background: "var(--secondary)" }}
      />
      <div
        className="fixed top-[40%] left-[60%] w-[300px] h-[300px] rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{ background: "var(--accent-yellow)" }}
      />

      {/* Floating musical notes */}
      {FLOATING_NOTES.map((note, i) => (
        <div
          key={i}
          className="float-note"
          style={{
            left: note.left,
            "--duration": note.duration,
            "--delay": note.delay,
            "--size": note.size,
          } as React.CSSProperties}
        >
          {note.emoji}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 max-w-lg mx-auto">
        {/* Section 1 — Guest greeting (arriba de todo) */}
        <section
          className={`w-full text-center mb-6 transition-all duration-700 ease-out ${
            isVisible(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="card-glow p-6">
            <div className="text-5xl mb-3 monster-bounce">🥳</div>
            <h2
              className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold mb-3"
              style={{ color: "var(--accent-pink)" }}
            >
              Hola {guest.name}!
            </h2>

            {guest.allergies && (
              <div
                className="rounded-xl p-3 mb-4 text-sm"
                style={{
                  background: "rgba(251, 146, 60, 0.15)",
                  border: "1px solid var(--accent-orange)",
                }}
              >
                <span className="font-bold" style={{ color: "var(--accent-orange)" }}>
                  ⚠️ Alergias registradas:
                </span>{" "}
                {guest.allergies}
              </div>
            )}

            <p className="text-lg" style={{ color: "var(--foreground)", opacity: 0.9 }}>
              ¡Prepárate para cantar, jugar y pasarla increíble con los monstruos! 🎶👾
            </p>
          </div>
        </section>

        {/* Section 2 — Welcome + Title */}
        <section
          className={`w-full text-center mb-8 transition-all duration-700 ease-out ${
            isVisible(1) ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90"
          }`}
        >
          <p
            className="text-xl font-[var(--font-body)] font-semibold tracking-wide mb-4"
            style={{ color: "var(--foreground)", opacity: 0.85 }}
          >
            Estás invitado/a a...
          </p>
          <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl font-bold leading-tight mb-3 msm-title"
            style={{ color: "var(--accent-lime)" }}>
            Cumple de TADDEO
          </h1>
          <div
            className={`inline-block ${isVisible(1) ? "monster-bounce" : ""}`}
          >
            <span
              className="text-3xl sm:text-4xl font-[var(--font-display)] font-bold msm-title"
              style={{ color: "var(--accent-yellow)" }}
            >
              ¡Cumple 9 años!
            </span>
          </div>
          {/* Monster decorative row */}
          <div className="flex justify-center gap-3 mt-4 text-3xl">
            <span className="monster-bounce" style={{ animationDelay: "0s" }}>👾</span>
            <span className="monster-bounce" style={{ animationDelay: "0.2s" }}>🎸</span>
            <span className="monster-bounce" style={{ animationDelay: "0.4s" }}>🎤</span>
            <span className="monster-bounce" style={{ animationDelay: "0.6s" }}>🎮</span>
            <span className="monster-bounce" style={{ animationDelay: "0.8s" }}>👾</span>
          </div>
        </section>

        {/* Section 3 — Party details */}
        <section
          className={`w-full mb-8 transition-all duration-700 ease-out ${
            isVisible(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col gap-4">
            {/* Date card */}
            <div
              className="card-glow p-5 flex items-center gap-4"
              style={{ borderColor: "var(--primary)", borderWidth: "2px" }}
            >
              <span className="text-4xl">📅</span>
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "var(--primary)" }}
                >
                  Fecha
                </p>
                <p className="text-lg font-bold font-[var(--font-display)]">
                  {partyDate}
                </p>
              </div>
            </div>

            {/* Time card */}
            <div
              className="card-glow p-5 flex items-center gap-4"
              style={{ borderColor: "var(--secondary)", borderWidth: "2px" }}
            >
              <span className="text-4xl">🕐</span>
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "var(--secondary)" }}
                >
                  Hora
                </p>
                <p className="text-lg font-bold font-[var(--font-display)]">
                  {partyTime}
                </p>
              </div>
            </div>

            {/* Location card */}
            <div
              className="card-glow p-5 flex items-center gap-4"
              style={{ borderColor: "var(--accent-orange)", borderWidth: "2px" }}
            >
              <span className="text-4xl">📍</span>
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "var(--accent-orange)" }}
                >
                  Lugar
                </p>
                <p className="text-lg font-bold font-[var(--font-display)]">
                  {partyLocation}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 — RSVP buttons */}
        <section
          className={`w-full mb-8 transition-all duration-700 ease-out ${
            isVisible(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {status === "pending" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full py-5 px-6 rounded-2xl text-xl font-[var(--font-display)] font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 glow-pulse cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  color: "var(--background)",
                  border: "none",
                }}
              >
                🎵 ¡Siii, voy a ir!
              </button>

              {!showDeclineInput ? (
                <button
                  onClick={handleDecline}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl text-lg font-[var(--font-display)] font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    opacity: 0.7,
                  }}
                >
                  No puedo ir 😢
                </button>
              ) : (
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Cuéntanos por qué no puedes venir (opcional)"
                    rows={3}
                    className="w-full rounded-xl p-3 mb-3 text-sm resize-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      outline: "none",
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeclineInput(false)}
                      className="flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer"
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDecline}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      style={{
                        background: "rgba(239,68,68,0.2)",
                        border: "1px solid rgba(239,68,68,0.4)",
                        color: "#fca5a5",
                      }}
                    >
                      Confirmar que no voy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "confirmed" && (
            <div className="card-glow p-6 text-center">
              <div className="text-5xl mb-3">
                {justConfirmed ? (
                  <span className="inline-flex gap-2">
                    <span className="monster-bounce" style={{ animationDelay: "0s" }}>🎉</span>
                    <span className="monster-bounce" style={{ animationDelay: "0.15s" }}>🥳</span>
                    <span className="monster-bounce" style={{ animationDelay: "0.3s" }}>🎊</span>
                    <span className="monster-bounce" style={{ animationDelay: "0.45s" }}>⭐</span>
                    <span className="monster-bounce" style={{ animationDelay: "0.6s" }}>🎵</span>
                  </span>
                ) : (
                  "🎉"
                )}
              </div>
              <h3
                className="font-[var(--font-display)] text-2xl font-bold mb-2"
                style={{ color: "var(--primary)" }}
              >
                ¡Yeeei! ¡Te esperamos!
              </h3>
              <p style={{ color: "var(--foreground)", opacity: 0.8 }}>
                ¡Va a ser la mejor fiesta de monstruos! 🎵👾🎶
              </p>
            </div>
          )}

          {status === "declined" && (
            <div className="card-glow p-6 text-center">
              <div className="text-5xl mb-3">😢</div>
              <h3
                className="font-[var(--font-display)] text-2xl font-bold mb-2"
                style={{ color: "var(--accent-pink)" }}
              >
                ¡Qué pena que no puedas venir!
              </h3>
              <p style={{ color: "var(--foreground)", opacity: 0.8 }}>
                ¡Te vamos a extrañar! 🎵
              </p>
            </div>
          )}
        </section>

        {/* Section 6 — Footer */}
        <section
          className={`w-full text-center mt-4 mb-8 transition-all duration-700 ease-out ${
            isVisible(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex justify-center gap-2 text-2xl mb-3">
            <span className="monster-bounce" style={{ animationDelay: "0s" }}>🎵</span>
            <span className="monster-bounce" style={{ animationDelay: "0.3s" }}>👾</span>
            <span className="monster-bounce" style={{ animationDelay: "0.6s" }}>🎶</span>
            <span className="monster-bounce" style={{ animationDelay: "0.9s" }}>👾</span>
            <span className="monster-bounce" style={{ animationDelay: "1.2s" }}>🎵</span>
          </div>
          <p
            className="font-[var(--font-display)] text-lg font-semibold"
            style={{ color: "var(--foreground)", opacity: 0.5 }}
          >
            🎵 My Singing Monsters Party 🎵
          </p>
        </section>
      </div>
    </div>
  );
}
