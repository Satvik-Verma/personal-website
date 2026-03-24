"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoShowcaseProps {
  videoSrc?: string;
  posterSrc?: string;
  children: React.ReactNode;
  /** Black overlay opacity (0–1). Default 0.40 */
  overlayOpacity?: number;
  /** Video scale factor for subtle depth. Default 1.05 */
  videoScale?: number;
  /** section id attribute for nav anchor links */
  id?: string;
}

// ─── Animated gradient fallback ──────────────────────────────────────────────
//
// When no videoSrc is provided (or the file hasn't been uploaded yet) we render
// a rich animated aurora mesh so the section looks intentional, not broken.
// Pure CSS transforms only — no paint recalcs.

function GradientFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Deep dark base */}
      <div className="absolute inset-0" style={{ background: "#060608" }} />

      {/* Aurora blob 1 — slow drift, blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: "120vw",
          height: "80vh",
          top: "-20vh",
          left: "-20vw",
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "orb-drift-1 32s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Aurora blob 2 — medium drift, purple */}
      <div
        className="absolute rounded-full"
        style={{
          width: "80vw",
          height: "80vh",
          bottom: "-10vh",
          right: "-10vw",
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.14) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "orb-drift-2 44s ease-in-out infinite 6s",
          willChange: "transform",
        }}
      />

      {/* Aurora blob 3 — subtle teal */}
      <div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vh",
          top: "30%",
          left: "20%",
          background:
            "radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "orb-drift-3 28s ease-in-out infinite 3s",
          willChange: "transform",
        }}
      />

      {/* Subtle grid texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

// ─── VideoShowcase ────────────────────────────────────────────────────────────
//
// Stacked sticky scroll: each section is position:sticky top:0, filling 100vh.
// Later sections in DOM order slide up and cover earlier ones because they have
// higher z-index (set by the parent wrapper in page.tsx).

export default function VideoShowcase({
  videoSrc,
  posterSrc,
  children,
  overlayOpacity = 0.4,
  videoScale = 1.05,
  id,
}: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Ensure video plays on mount — some browsers need an explicit call
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => {
      // Autoplay blocked — video will remain on poster frame, which is fine.
    });
  }, []);

  return (
    <section
      id={id}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* ── Video layer (or fallback) ─────────────────────────────────────── */}
      {videoSrc ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          onLoadedData={() => setVideoLoaded(true)}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${videoScale})`,
            transformOrigin: "center center",
            willChange: "transform, opacity",
            opacity: videoLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      ) : (
        <GradientFallback />
      )}

      {/* ── Dark overlay ──────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${overlayOpacity})`,
          zIndex: 1,
        }}
      />

      {/* ── Radial vignette ───────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
          zIndex: 2,
        }}
      />

      {/* ── Content overlay ───────────────────────────────────────────────── */}
      <div
        className="relative w-full h-full max-w-6xl mx-auto px-6 flex items-center"
        style={{ zIndex: 10 }}
      >
        {children}
      </div>
    </section>
  );
}
