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
  // Static gradient mesh — no animations, no blur filters, minimal GPU cost.
  // The global fixed orbs in page.tsx provide the ambient movement.
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(59,130,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 60%),
            #060608
          `,
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
