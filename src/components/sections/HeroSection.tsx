"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import TextReveal from "@/components/animation/TextReveal";
import HeroFallback from "@/components/three/HeroFallback";
import HeroErrorBoundary from "@/components/three/HeroErrorBoundary";
import { identity } from "@/data/profile";

// Dynamic import with ssr:false — Three.js can't run on server
const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

// Scroll indicator — wrapped in a liquid glass pill
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      {/* Glass pill container */}
      <div
        className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderTop: "1px solid rgba(255,255,255,0.16)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <span className="text-[9px] font-semibold text-[#52525b] tracking-[0.2em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            className="w-3.5 h-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWebglSupported(hasWebGL());
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      {/* 3D Canvas or Fallback */}
      <div className="absolute inset-0 z-0">
        {mounted ? (
          (isMobile || !webglSupported) ? (
            <HeroFallback />
          ) : (
            <HeroErrorBoundary>
              <Suspense fallback={<HeroFallback />}>
                <HeroCanvas />
              </Suspense>
            </HeroErrorBoundary>
          )
        ) : (
          <div className="absolute inset-0 bg-[#0a0a0a]" />
        )}
      </div>

      {/* Radial vignette — softens the 3D scene edges */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_35%,rgba(10,10,10,0.8)_100%)]" />
      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-56 z-[1] bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-32 flex flex-col items-start">

        {/*
          Liquid glass content panel — the text floats on a dreamy
          translucent surface that blurs the physics balls behind it.
        */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-8 md:p-10 max-w-2xl"
          style={{
            background: "rgba(10,10,15,0.45)",
            backdropFilter: "blur(32px) saturate(150%)",
            WebkitBackdropFilter: "blur(32px) saturate(150%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "28px",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 60px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {/* Subtle prismatic border sheen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "28px",
              padding: "1px",
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.15), rgba(255,255,255,0.05))",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            }}
          />

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 flex items-center gap-2"
          >
            <div
              className="h-[1px] w-8"
              style={{
                background: "linear-gradient(90deg, #3b82f6, transparent)",
                boxShadow: "0 0 6px rgba(59,130,246,0.6)",
              }}
            />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: "#3b82f6" }}>
              {identity.location}
            </span>
          </motion.div>

          {/* Name — gradient text achieved via className on the wrapper */}
          <TextReveal
            text={identity.name}
            delay={0.5}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.0] mb-4 heading-gradient"
          />

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 text-lg md:text-xl font-medium tracking-tight max-w-xl"
            style={{ color: "#60a5fa" }}
          >
            {identity.title}
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-sm md:text-base max-w-md leading-relaxed italic"
            style={{ color: "#71717a" }}
          >
            {identity.tagline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {/* Primary — skeuomorphic pressable button */}
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="skeu-button inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white"
            >
              See My Work
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path
                  fillRule="evenodd"
                  d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06z"
                />
              </svg>
            </a>

            {/* Secondary — glass pill button */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="glass-pill inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: "#fafafa" }}
            >
              Get In Touch
            </a>
          </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
