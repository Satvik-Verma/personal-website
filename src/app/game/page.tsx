import type { Metadata } from "next";
import Link from "next/link";
import GameLoader from "@/components/game/GameLoader";

export const metadata: Metadata = {
  title: "Satvik's World — Easter Egg",
  description: "A hidden pixel-art RPG world by Satvik Verma.",
  robots: { index: false, follow: false },
};

export default function GamePage() {
  return (
    /*
      Full-screen takeover — no layout chrome (navbar, scroll, etc).
      The Back button sits as a persistent overlay so it's always
      reachable even if the player misses the ESC hint in the HUD.
    */
    <main
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#0d0d24",
      }}
    >
      <GameLoader />

      {/* Back button — bottom-left corner, doesn't block the HUD */}
      <Link
        href="/"
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 8,
          background: "rgba(5, 10, 20, 0.82)",
          border: "1px solid rgba(59,130,246,0.3)",
          color: "#a1a1aa",
          fontFamily: "monospace",
          fontSize: 11,
          textDecoration: "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow:
            "0 2px 12px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.05)",
          letterSpacing: "0.05em",
          transition: "color 0.15s, border-color 0.15s",
        }}
      >
        {/* Left chevron */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ width: 13, height: 13 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 12L6 8l4-4" />
        </svg>
        Back to Portfolio
      </Link>
    </main>
  );
}
