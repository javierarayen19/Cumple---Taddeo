"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface Guest {
  id: string;
  name: string;
  allergies: string;
  confirmed: boolean;
  declined: boolean;
  decline_reason: string;
  companions_count: number;
  companions_names: string;
}

interface Props {
  guest: Guest;
  partyDate: string;
  partyTime: string;
  partyLocation: string;
  partyLocationUrl: string;
}

const ALLERGY_OPTIONS = [
  { label: "Ninguna", icon: "✅" },
  { label: "Gluten", icon: "🌾" },
  { label: "Lactosa", icon: "🥛" },
  { label: "Frutos Secos", icon: "🥜" },
  { label: "Mariscos", icon: "🦐" },
  { label: "Huevo", icon: "🥚" },
  { label: "Otra", icon: "📝" },
];

// Monster images — scattered as small decorations across the page
const MONSTER_IMAGES = [
  "/monster1.jpg",
  "/monster2.jpg",
  "/monster3.jpeg",
  "/monster4.png",
  "/monster5.jpg",
];

// Generate random positions for scattered monsters
function generateScatteredMonsters(count: number) {
  const imgs = [];
  for (let i = 0; i < count; i++) {
    imgs.push({
      src: MONSTER_IMAGES[i % MONSTER_IMAGES.length],
      top: `${8 + Math.random() * 80}%`,
      left: Math.random() > 0.5 ? `${-2 + Math.random() * 12}%` : `${78 + Math.random() * 14}%`,
      size: 50 + Math.floor(Math.random() * 30),
      delay: `${Math.random() * 4}s`,
      duration: `${5 + Math.random() * 4}s`,
      rotate: Math.floor(Math.random() * 30 - 15),
    });
  }
  return imgs;
}

// Floating particles configuration
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  emoji: ["🎵", "🎶", "⭐", "✨", "🎵", "🎶", "⭐", "✨", "🎵"][i % 9],
  left: `${(i * 5.5 + Math.random() * 3) % 100}%`,
  duration: `${7 + Math.random() * 8}s`,
  delay: `${Math.random() * 6}s`,
  size: `${1 + Math.random() * 0.8}rem`,
}));

// --- SVG Icons ---
function CalendarIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  );
}

function NavigationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function CalendarPlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="12" y1="14" x2="12" y2="18" />
      <line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

// --- Countdown helper ---
function getCountdown(dateStr: string): { days: number; hours: number; minutes: number; seconds: number; passed: boolean } | null {
  // Try to parse date like "Sabado 12 de Abril 2026" or "12 de Abril 2026" or ISO
  const months: Record<string, number> = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
  };

  // Try extracting day + month + year from Spanish format
  const match = dateStr.match(/(\d{1,2})\s+de\s+(\w+)\s+(\d{4})/i);
  if (match) {
    const day = parseInt(match[1]);
    const monthName = match[2].toLowerCase();
    const year = parseInt(match[3]);
    const monthIndex = months[monthName];
    if (monthIndex !== undefined) {
      const target = new Date(year, monthIndex, day, 0, 0, 0);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff < -86400000) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        passed: false,
      };
    }
  }

  // Fallback: try Date.parse
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    const diff = parsed - Date.now();
    if (diff < -86400000) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      passed: false,
    };
  }

  return null; // Cannot parse date
}

// --- Google Calendar URL builder ---
function buildGoogleCalendarUrl(date: string, time: string, location: string): string {
  // Try to build a proper date
  const months: Record<string, string> = {
    enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
    julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12",
  };

  let startDate = "";
  const match = date.match(/(\d{1,2})\s+de\s+(\w+)\s+(\d{4})/i);
  if (match) {
    const day = match[1].padStart(2, "0");
    const month = months[match[2].toLowerCase()] || "01";
    const year = match[3];

    // Parse time like "15:00" or "15:00 hrs"
    const timeMatch = time.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const hour = timeMatch[1].padStart(2, "0");
      const min = timeMatch[2];
      startDate = `${year}${month}${day}T${hour}${min}00`;
      // End time: 3 hours later
      const endHour = String(Math.min(23, parseInt(hour) + 3)).padStart(2, "0");
      const endDate = `${year}${month}${day}T${endHour}${min}00`;

      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: "Cumple de Taddeo - 9 Años! 🎵👾",
        dates: `${startDate}/${endDate}`,
        details: "Fiesta de cumpleaños de Taddeo - My Singing Monsters Party! 🎵🎮👾",
        location: location,
      });

      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    }
  }

  // Fallback: just open Google Calendar with event title
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Cumple de Taddeo - 9 Años! 🎵👾",
    details: `Fecha: ${date}\nHora: ${time}\nLugar: ${location}\n\nMy Singing Monsters Party! 🎵🎮👾`,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}


export default function InvitationClient({
  guest,
  partyDate,
  partyTime,
  partyLocation,
  partyLocationUrl,
}: Props) {
  const [scatteredMonsters] = useState(() => generateScatteredMonsters(8));
  const [entered, setEntered] = useState(false);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [status, setStatus] = useState<"pending" | "confirmed" | "declined">(
    guest.confirmed ? "confirmed" : guest.declined ? "declined" : "pending"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [splashPulsing, setSplashPulsing] = useState(true);
  const [countdown, setCountdown] = useState(getCountdown(partyDate));

  // Companions state
  const [companionsCount, setCompanionsCount] = useState(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Splash pulse animation
  useEffect(() => {
    const interval = setInterval(() => setSplashPulsing((p) => !p), 1200);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(partyDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [partyDate]);

  // Staged reveal after entering
  useEffect(() => {
    if (!entered) return;
    const delays = [200, 800, 1500, 2100, 2600, 3100, 3600, 4100];
    const timers: NodeJS.Timeout[] = [];
    delays.forEach((delay, index) => {
      const timer = setTimeout(() => {
        setVisibleSections((prev) => [...prev, index]);
      }, delay);
      timers.push(timer);
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [entered]);

  const handleEnter = useCallback(() => {
    try {
      const audio = new Audio("/music.mp3");
      audio.loop = true;
      audio.volume = 0.5;
      audio.play();
      audioRef.current = audio;
    } catch {
      // Music is optional
    }
    setEntered(true);
  }, []);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (musicMuted) {
      audioRef.current.volume = 0.5;
    } else {
      audioRef.current.volume = 0;
    }
    setMusicMuted(!musicMuted);
  }, [musicMuted]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  function updateCompanionsCount(count: number) {
    const newCount = Math.max(0, Math.min(10, count));
    setCompanionsCount(newCount);
    setCompanionNames((prev) => {
      const arr = [...prev];
      while (arr.length < newCount) arr.push("");
      return arr.slice(0, newCount);
    });
  }

  function updateCompanionName(index: number, name: string) {
    setCompanionNames((prev) => {
      const arr = [...prev];
      arr[index] = name;
      return arr;
    });
  }

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const allergies = selectedAllergies
        .map((a) => (a === "Otra" ? customAllergy.trim() || "Otra" : a))
        .filter((a) => a !== "Ninguna")
        .join(", ");

      const res = await fetch(`/api/guests/${guest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
          allergies,
          companions_count: companionsCount,
          companions_names: companionNames.filter((n) => n.trim()).join(", "),
        }),
      });
      if (res.ok) {
        setStatus("confirmed");
        setJustConfirmed(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
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
        body: JSON.stringify({
          action: "decline",
          decline_reason: declineReason,
        }),
      });
      if (res.ok) {
        setStatus("declined");
      }
    } catch {
      alert("Hubo un error, intenta de nuevo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVisible = (section: number) => visibleSections.includes(section);

  const calendarUrl = buildGoogleCalendarUrl(partyDate, partyTime, partyLocation);

  // --- SPLASH SCREEN ---
  if (!entered) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        {/* Background glows */}
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-[100px]"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute w-[200px] h-[200px] rounded-full opacity-15 blur-[80px] translate-x-20 translate-y-20"
          style={{ background: "var(--accent-pink)" }}
        />

        {/* Floating particles */}
        {PARTICLES.slice(0, 8).map((p, i) => (
          <div
            key={i}
            className="float-note"
            style={{
              left: p.left,
              "--duration": p.duration,
              "--delay": p.delay,
              "--size": p.size,
              opacity: 0.3,
            } as React.CSSProperties}
          >
            {p.emoji}
          </div>
        ))}

        <div className="relative z-10 flex flex-col items-center text-center px-8">
          {/* Scattered monster decorations on splash */}
          {scatteredMonsters.slice(0, 4).map((m, i) => (
            <div
              key={i}
              className="fixed monster-float pointer-events-none"
              style={{
                top: m.top,
                left: m.left,
                animationDelay: m.delay,
                animationDuration: m.duration,
                opacity: 0.45,
                zIndex: 0,
              }}
            >
              <div
                className="rounded-full overflow-hidden"
                style={{
                  width: m.size,
                  height: m.size,
                  background: "rgba(26,58,26,0.9)",
                  transform: `rotate(${m.rotate}deg)`,
                }}
              >
                <Image
                  src={m.src}
                  alt=""
                  width={m.size}
                  height={m.size}
                  className="object-cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          ))}

          {/* Title */}
          <h1
            className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold mb-2 msm-title"
            style={{ color: "var(--accent-lime)" }}
          >
            Cumple de TADDEO
          </h1>
          <p
            className="text-lg mb-10 font-[var(--font-body)]"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            My Singing Monsters Party
          </p>

          {/* Tap to enter button */}
          <button
            onClick={handleEnter}
            className="splash-enter-btn relative px-10 py-5 rounded-2xl font-[var(--font-display)] text-xl font-bold cursor-pointer transition-transform duration-200 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "var(--background)",
              border: "none",
              transform: splashPulsing ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <MusicNoteIcon />
              <span>Toca para entrar</span>
              <MusicNoteIcon />
            </span>
          </button>

          <p
            className="mt-6 text-sm"
            style={{ color: "var(--foreground)", opacity: 0.3 }}
          >
            🔊 Activa el sonido para la mejor experiencia
          </p>
        </div>
      </div>
    );
  }

  // --- MAIN INVITATION ---
  return (
    <div className="min-h-screen bg-monster-gradient relative overflow-hidden">
      {/* Confetti explosion */}
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                "--x": `${Math.random() * 100}vw`,
                "--rotation": `${Math.random() * 720 - 360}deg`,
                "--delay": `${Math.random() * 0.5}s`,
                "--color": [
                  "var(--primary)",
                  "var(--secondary)",
                  "var(--accent-yellow)",
                  "var(--accent-pink)",
                  "var(--accent-lime)",
                ][i % 5],
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        aria-label={musicMuted ? "Activar música" : "Silenciar música"}
      >
        <VolumeIcon muted={musicMuted} />
      </button>

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

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="float-note"
          style={{
            left: p.left,
            "--duration": p.duration,
            "--delay": p.delay,
            "--size": p.size,
          } as React.CSSProperties}
        >
          {p.emoji}
        </div>
      ))}

      {/* Scattered monster decorations */}
      {scatteredMonsters.map((m, i) => (
        <div
          key={`monster-${i}`}
          className="fixed monster-float pointer-events-none"
          style={{
            top: m.top,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
            opacity: 0.3,
            zIndex: 1,
          }}
        >
          <div
            className="rounded-full overflow-hidden"
            style={{
              width: m.size,
              height: m.size,
              background: "rgba(26,58,26,0.9)",
              transform: `rotate(${m.rotate}deg)`,
            }}
          >
            <Image
              src={m.src}
              alt=""
              width={m.size}
              height={m.size}
              className="object-cover"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 max-w-lg mx-auto">
        {/* Section 0 — Guest greeting */}
        <section
          className={`w-full text-center mb-6 transition-all duration-700 ease-out ${
            isVisible(0)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="glass-card p-6">
            <div className="text-5xl mb-3 monster-bounce">🥳</div>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold mb-3 gradient-text">
              Hola {guest.name}!
            </h2>
            <p
              className="text-lg"
              style={{ color: "var(--foreground)", opacity: 0.9 }}
            >
              ¡Prepárate para cantar, jugar y pasarla increíble con los
              monstruos! 🎶👾
            </p>
          </div>
        </section>

        {/* Section 1 — Title + Monster image */}
        <section
          className={`w-full text-center mb-8 transition-all duration-700 ease-out ${
            isVisible(1)
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-90"
          }`}
        >
          <p
            className="text-xl font-[var(--font-body)] font-semibold tracking-wide mb-4"
            style={{ color: "var(--foreground)", opacity: 0.85 }}
          >
            Estás invitado/a a...
          </p>
          <h1
            className="font-[var(--font-display)] text-5xl sm:text-6xl font-bold leading-tight mb-3 msm-title"
            style={{ color: "var(--accent-lime)" }}
          >
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

          {/* Small monster showcase row */}
          <div className="flex justify-center gap-5 mt-6 mb-2">
            {MONSTER_IMAGES.sort(() => Math.random() - 0.5).slice(0, 3).map((src, i) => (
              <div
                key={i}
                className="monster-float"
                style={{ animationDelay: `${i * 0.6}s` }}
              >
                <div
                  className="rounded-full overflow-hidden shadow-lg"
                  style={{
                    width: 70,
                    height: 70,
                    background: "rgba(26,58,26,0.8)",
                    border: "2px solid rgba(126,198,54,0.25)",
                  }}
                >
                  <Image
                    src={src}
                    alt="MSM Monster"
                    width={70}
                    height={70}
                    className="object-cover"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Monster decorative row */}
          <div className="flex justify-center gap-3 mt-4 text-3xl">
            <span className="monster-bounce" style={{ animationDelay: "0s" }}>
              👾
            </span>
            <span className="monster-bounce" style={{ animationDelay: "0.2s" }}>
              🎸
            </span>
            <span className="monster-bounce" style={{ animationDelay: "0.4s" }}>
              🎤
            </span>
            <span className="monster-bounce" style={{ animationDelay: "0.6s" }}>
              🎮
            </span>
            <span className="monster-bounce" style={{ animationDelay: "0.8s" }}>
              👾
            </span>
          </div>
        </section>

        {/* Section 2 — Party details + Countdown */}
        <section
          className={`w-full mb-8 transition-all duration-700 ease-out ${
            isVisible(2)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Countdown timer */}
          {countdown && !countdown.passed && (
            <div className="glass-card p-5 mb-4 text-center">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--accent-pink)" }}
              >
                Cuenta regresiva
              </p>
              <div className="flex justify-center gap-3">
                {[
                  { value: countdown.days, label: "Días" },
                  { value: countdown.hours, label: "Hrs" },
                  { value: countdown.minutes, label: "Min" },
                  { value: countdown.seconds, label: "Seg" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-[var(--font-display)] font-bold"
                      style={{
                        background: "rgba(126,198,54,0.15)",
                        border: "1px solid rgba(126,198,54,0.3)",
                        color: "var(--accent-lime)",
                      }}
                    >
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <span
                      className="text-xs mt-1 font-semibold"
                      style={{ color: "var(--foreground)", opacity: 0.5 }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add to Calendar button */}
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                style={{
                  background: "rgba(245,166,35,0.2)",
                  border: "1px solid rgba(245,166,35,0.4)",
                  color: "var(--secondary)",
                }}
              >
                <CalendarPlusIcon />
                Agendar en mi calendario
              </a>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Date card */}
            <div className="glass-card p-5 flex items-center gap-4 card-tap-effect">
              <div className="flex-shrink-0">
                <CalendarIcon />
              </div>
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
            <div className="glass-card p-5 flex items-center gap-4 card-tap-effect">
              <div className="flex-shrink-0">
                <ClockIcon />
              </div>
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
            <div className="glass-card p-5 flex items-center gap-4 card-tap-effect">
              <div className="flex-shrink-0">
                <MapPinIcon />
              </div>
              <div className="flex-1">
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

            {/* Google Maps button */}
            {partyLocationUrl && (
              <a
                href={partyLocationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 flex items-center justify-center gap-3 card-tap-effect cursor-pointer transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: "rgba(245,166,35,0.1)",
                  border: "1px solid rgba(245,166,35,0.3)",
                }}
              >
                <NavigationIcon />
                <span
                  className="font-[var(--font-display)] text-lg font-bold"
                  style={{ color: "var(--accent-orange)" }}
                >
                  ¿Cómo llego?
                </span>
                <span className="text-sm" style={{ color: "var(--foreground)", opacity: 0.5 }}>
                  (Google Maps)
                </span>
              </a>
            )}
          </div>
        </section>

        {/* Section 3 — Allergy selection (only when pending) */}
        {status === "pending" && (
          <section
            className={`w-full mb-8 transition-all duration-700 ease-out ${
              isVisible(3)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="glass-card p-6">
              <h3
                className="font-[var(--font-display)] text-xl font-bold mb-1"
                style={{ color: "var(--secondary)" }}
              >
                🍽️ ¿Tienes alguna alergia?
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--foreground)", opacity: 0.6 }}
              >
                Selecciona para que preparemos todo pensando en ti
              </p>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map((opt) => {
                  const isActive = selectedAllergies.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => toggleAllergy(opt.label)}
                      className={`allergy-chip px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer active:scale-95 ${
                        isActive
                          ? "allergy-chip-active"
                          : "allergy-chip-inactive"
                      }`}
                      style={{
                        minHeight: "44px",
                        ...(isActive
                          ? {
                              background: "rgba(245, 166, 35, 0.25)",
                              borderColor: "var(--secondary)",
                              color: "var(--foreground)",
                            }
                          : {
                              background: "var(--surface)",
                              borderColor: "var(--border)",
                              color: "rgba(255,248,231,0.6)",
                            }),
                      }}
                    >
                      {opt.icon} {opt.label}
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
                  className="mt-4 w-full rounded-xl px-4 py-3 text-sm transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    outline: "none",
                    minHeight: "44px",
                  }}
                />
              )}
            </div>
          </section>
        )}

        {/* Section 4 — Companions (only when pending) */}
        {status === "pending" && (
          <section
            className={`w-full mb-8 transition-all duration-700 ease-out ${
              isVisible(4)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="glass-card p-6">
              <h3
                className="font-[var(--font-display)] text-xl font-bold mb-1 flex items-center gap-2"
                style={{ color: "var(--primary)" }}
              >
                <UsersIcon />
                ¿Vienes con alguien más?
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--foreground)", opacity: 0.6 }}
              >
                Indica si te acompaña alguien (papá, mamá, hermano/a...)
              </p>

              {/* Counter */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => updateCompanionsCount(companionsCount - 1)}
                  disabled={companionsCount <= 0}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 active:scale-90 cursor-pointer disabled:opacity-30 disabled:cursor-default"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  -
                </button>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-[var(--font-display)] font-bold"
                  style={{
                    background: "rgba(126,198,54,0.15)",
                    border: "1px solid rgba(126,198,54,0.3)",
                    color: "var(--accent-lime)",
                  }}
                >
                  {companionsCount}
                </div>
                <button
                  type="button"
                  onClick={() => updateCompanionsCount(companionsCount + 1)}
                  disabled={companionsCount >= 10}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 active:scale-90 cursor-pointer disabled:opacity-30 disabled:cursor-default"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  +
                </button>
              </div>

              {/* Companion name inputs */}
              {companionsCount > 0 && (
                <div className="space-y-3">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)", opacity: 0.7 }}
                  >
                    Nombre de tus acompañantes:
                  </p>
                  {Array.from({ length: companionsCount }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      value={companionNames[i] || ""}
                      onChange={(e) => updateCompanionName(i, e.target.value)}
                      placeholder={`Acompañante ${i + 1}`}
                      className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        outline: "none",
                        minHeight: "44px",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 5 — RSVP buttons */}
        <section
          className={`w-full mb-8 transition-all duration-700 ease-out ${
            isVisible(5)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {status === "pending" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full py-5 px-6 rounded-2xl text-xl font-[var(--font-display)] font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 pulse-glow cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  color: "var(--background)",
                  border: "none",
                  minHeight: "56px",
                }}
              >
                🎵 ¡Confirmo mi asistencia!
              </button>

              {!showDeclineInput ? (
                <button
                  onClick={handleDecline}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl text-lg font-[var(--font-display)] font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    opacity: 0.7,
                    minHeight: "52px",
                  }}
                >
                  Lo siento, no puedo asistir 😢
                </button>
              ) : (
                <div className="glass-card p-4">
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
                      className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        minHeight: "44px",
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDecline}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
                      style={{
                        background: "rgba(239,68,68,0.2)",
                        border: "1px solid rgba(239,68,68,0.4)",
                        color: "#fca5a5",
                        minHeight: "44px",
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
            <div className="glass-card p-6 text-center">
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
                ¡Gracias por confirmar! 🎉
              </h3>
              <p style={{ color: "var(--foreground)", opacity: 0.8 }}>
                ¡Te esperamos en la mejor fiesta de monstruos! 🎵👾🎶
              </p>
            </div>
          )}

          {status === "declined" && (
            <div className="glass-card p-6 text-center">
              <div className="text-5xl mb-3">😢</div>
              <h3
                className="font-[var(--font-display)] text-2xl font-bold mb-2"
                style={{ color: "var(--accent-pink)" }}
              >
                Lamentamos que no puedas asistir 😢
              </h3>
              <p style={{ color: "var(--foreground)", opacity: 0.8 }}>
                ¡Te vamos a extrañar mucho! Ojalá nos veamos pronto 🎵
              </p>
            </div>
          )}
        </section>

        {/* Section 6 — Footer */}
        <section
          className={`w-full text-center mt-4 mb-8 transition-all duration-700 ease-out ${
            isVisible(6)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
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
