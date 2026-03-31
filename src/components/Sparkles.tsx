"use client";

const PARTICLES = [
  { emoji: "🎵", left: "5%", duration: "7s", delay: "0s", size: "1.4rem" },
  { emoji: "🎶", left: "12%", duration: "9s", delay: "1.2s", size: "1.2rem" },
  { emoji: "👾", left: "20%", duration: "8s", delay: "0.5s", size: "1.6rem" },
  { emoji: "🎸", left: "30%", duration: "10s", delay: "2s", size: "1.3rem" },
  { emoji: "⭐", left: "38%", duration: "7.5s", delay: "0.8s", size: "1.1rem" },
  { emoji: "🎤", left: "45%", duration: "9.5s", delay: "1.5s", size: "1.5rem" },
  { emoji: "🎵", left: "55%", duration: "8.5s", delay: "3s", size: "1.2rem" },
  { emoji: "👾", left: "62%", duration: "7s", delay: "0.3s", size: "1.7rem" },
  { emoji: "🎶", left: "70%", duration: "10s", delay: "2.5s", size: "1rem" },
  { emoji: "⭐", left: "78%", duration: "8s", delay: "1s", size: "1.4rem" },
  { emoji: "🎸", left: "85%", duration: "9s", delay: "3.5s", size: "1.3rem" },
  { emoji: "🎤", left: "92%", duration: "7.5s", delay: "0.7s", size: "1.1rem" },
  { emoji: "🎵", left: "48%", duration: "11s", delay: "4s", size: "1.5rem" },
  { emoji: "👾", left: "15%", duration: "8.5s", delay: "2.2s", size: "1rem" },
];

export default function Sparkles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="float-note"
          style={
            {
              left: p.left,
              "--duration": p.duration,
              "--delay": p.delay,
              "--size": p.size,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </>
  );
}
