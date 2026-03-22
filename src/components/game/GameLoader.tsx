"use client";

import dynamic from "next/dynamic";

// Thin client wrapper so ssr:false is legal inside a Client Component.
const GameCanvas = dynamic(() => import("./GameCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        background: "#0d0d24",
        color: "#4affaa",
        fontFamily: "monospace",
        fontSize: "14px",
        letterSpacing: "0.1em",
      }}
    >
      Loading world...
    </div>
  ),
});

export default function GameLoader() {
  return <GameCanvas />;
}
