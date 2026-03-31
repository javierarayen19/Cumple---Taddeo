import type { Metadata } from "next";
import { Fredoka, Nunito, Luckiest_Guy } from "next/font/google";
import "./globals.css";

const luckiestGuy = Luckiest_Guy({
  variable: "--font-luckiest",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cumple de Taddeo - 9 Años 🎵👾",
  description:
    "Fiesta de cumpleaños temática de My Singing Monsters para Taddeo. ¡Registra tu asistencia y únete a la diversión!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${luckiestGuy.variable} ${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] font-[var(--font-body)]">
        {children}
      </body>
    </html>
  );
}
