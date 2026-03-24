"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { identity, heroSkills } from "@/data/profile";

// ─── Mouse-reactive aurora gradient ─────────────────────────────────────────

function AuroraBackground() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  const gradX = useTransform(smoothX, [0, 1], ["20%", "80%"]);
  const gradY = useTransform(smoothY, [0, 1], ["20%", "80%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Primary aurora blob — blue, follows mouse */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          left: gradX,
          top: gradY,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Secondary aurora — purple */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        animate={{ x: [0, 100, -50, 0], y: [0, -80, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          right: "10%",
          top: "20%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Tertiary aurora — teal accent */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        animate={{ x: [0, -60, 80, 0], y: [0, 60, -40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          left: "15%",
          bottom: "10%",
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Warm accent — pink/rose */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        animate={{ x: [0, 40, -30, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          right: "25%",
          bottom: "25%",
          background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// ─── Orbit Tech Rings ────────────────────────────────────────────────────────
//
// Two concentric rings of glassmorphic skill chips orbiting a central point.
// The outer ring rotates clockwise (80s), the inner counter-clockwise (55s).
// Each chip counter-rotates at the same rate so its text stays upright.
// Animation runs entirely on the GPU compositor via transform: rotate() —
// zero layout recalcs, zero paint, locked 60fps.
//
// On hover over the assembly both rings pause. On hover over a single chip
// Framer Motion provides a subtle scale + glow spring (whileHover only,
// not a continuous loop — correct use of Framer Motion).

// Domain color mapping — drives the glow tint per chip
const DOMAIN_COLORS: Record<string, string> = {
  Python:     "#3b82f6",
  TypeScript: "#3b82f6",
  "C++":      "#3b82f6",
  NestJS:     "#10b981",
  PostgreSQL: "#10b981",
  Redis:      "#10b981",
  Prisma:     "#10b981",
  LLMs:       "#8b5cf6",
  LangGraph:  "#8b5cf6",
  RAG:        "#8b5cf6",
  WebRTC:     "#06b6d4",
  Azure:      "#f59e0b",
  Stripe:     "#8b5cf6",
  "React Native": "#ec4899",
};

// Assign chips to rings. Outer ring gets the marquee-label skills, inner the rest.
const OUTER_SKILLS = heroSkills.slice(0, 8);   // 8 chips on the large ring
const INNER_SKILLS = heroSkills.slice(8);       // 6 chips on the small ring

interface OrbitChipProps {
  label: string;
  color: string;
  angle: number;           // degrees — position on the ring
  radius: number;          // px — ring radius
  counterRotateClass: string; // CSS class that counter-rotates to keep text upright
}

function OrbitChip({ label, color, angle, radius, counterRotateClass }: OrbitChipProps) {
  // Convert polar → cartesian to place the chip on the circumference.
  const rad = (angle * Math.PI) / 180;
  const x = radius * Math.cos(rad);
  const y = radius * Math.sin(rad);

  // Three-layer transform stack — each lives on its own DOM element so they
  // never conflict:
  //
  //   Layer 1 (outermost): translate(x, y) — positions the chip on the circle.
  //                        Static inline style; never animated.
  //
  //   Layer 2 (middle):    CSS animation via `ringClass` — counter-rotates so
  //                        the chip text stays upright as the parent ring spins.
  //
  //   Layer 3 (innermost): Framer Motion whileHover scale spring — user intent
  //                        interaction only, not a continuous loop.

  // Layer 1 — positional translate, never touched by animation
  return (
    <div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        translate: `calc(-50% + ${x}px) calc(-50% + ${y}px)`,
      }}
    >
      {/* Layer 2 — CSS counter-rotation to keep text upright */}
      <div className={counterRotateClass}>
        {/* Layer 3 — Framer Motion hover spring */}
        <motion.div
          whileHover={{ scale: 1.18 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="relative cursor-default select-none"
          style={{ willChange: "transform" }}
        >
          {/* Chip body — glassmorphism */}
          <div
            className="relative px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap"
            style={{
              color,
              background: `${color}0d`,
              backdropFilter: "blur(10px) saturate(140%)",
              WebkitBackdropFilter: "blur(10px) saturate(140%)",
              border: `1px solid ${color}28`,
              borderTop: `1px solid ${color}40`,
              boxShadow: `
                inset 0 1px 0 ${color}18,
                0 2px 8px rgba(0,0,0,0.35),
                0 0 12px ${color}0a
              `,
            }}
          >
            {label}
            {/* Top-edge specular highlight — skeuomorphic detail */}
            <div
              className="absolute inset-x-2 top-0 h-px rounded-full opacity-40"
              style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface OrbitRingProps {
  skills: typeof heroSkills;
  radius: number;
  ringClass: string;   // the CSS animation class on the ring container
  chipClass: string;   // the CSS counter-rotation class on each chip wrapper
}

function OrbitRing({ skills, radius, ringClass, chipClass }: OrbitRingProps) {
  const count = skills.length;
  // Distribute chips evenly, offset the start angle slightly so the first
  // chip isn't sitting at the 3-o'clock dead horizontal — a -90° offset
  // puts the first chip at 12 o'clock for a balanced look.
  const startOffset = -90;

  return (
    // The ring container is the element that physically rotates.
    // It has no visual presence — just a coordinate system.
    <div
      className={`absolute rounded-full ${ringClass}`}
      style={{
        width: radius * 2,
        height: radius * 2,
        left: "50%",
        top: "50%",
        marginLeft: -radius,
        marginTop: -radius,
      }}
    >
      {skills.map((skill, i) => {
        const angle = startOffset + (360 / count) * i;
        const color = DOMAIN_COLORS[skill.label] ?? skill.color;
        return (
          <OrbitChip
            key={skill.label}
            label={skill.label}
            color={color}
            angle={angle}
            radius={radius}
            counterRotateClass={chipClass}
          />
        );
      })}
    </div>
  );
}

function TechOrbit() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      // orbit-assembly class lets CSS pause animations on hover
      className="orbit-assembly absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {/*
        The assembly is centred on the right 40% of the hero.
        On mobile it's hidden — skills are shown in a compact inline list instead.
      */}
      <div
        className="absolute hidden md:block"
        style={{
          // Sit the orbit centre in the right third of the hero, vertically centred
          right: "8%",
          top: "50%",
          transform: "translateY(-50%)",
          // The outer ring is 380px diameter; the assembly needs that much space
          width: 380,
          height: 380,
          // Enable pointer events only on this area so chips are hoverable
          pointerEvents: "auto",
        }}
      >
        {/* Faint ring track lines — purely decorative, no animation */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 0,
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            // Inner track: sized to match inner ring radius (130px) centered in 380px container
            width: 260,
            height: 260,
            left: "50%",
            top: "50%",
            marginLeft: -130,
            marginTop: -130,
            border: "1px solid rgba(255,255,255,0.03)",
          }}
        />

        {/* Central pulsing dot — the gravitational focus */}
        <div
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            left: "50%",
            top: "50%",
            marginLeft: -3,
            marginTop: -3,
            background: "rgba(59,130,246,0.6)",
            boxShadow: "0 0 12px rgba(59,130,246,0.5), 0 0 24px rgba(59,130,246,0.2)",
          }}
        >
          {/* Expanding ring pulse — CSS only */}
          <div
            className="absolute rounded-full"
            style={{
              inset: -8,
              border: "1px solid rgba(59,130,246,0.2)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
        </div>

        {/* Outer ring — 8 chips, clockwise, 190px radius */}
        <OrbitRing
          skills={OUTER_SKILLS}
          radius={190}
          ringClass="orbit-ring-outer"
          chipClass="orbit-chip-outer"
        />

        {/* Inner ring — 6 chips, counter-clockwise, 130px radius */}
        <OrbitRing
          skills={INNER_SKILLS}
          radius={130}
          ringClass="orbit-ring-inner"
          chipClass="orbit-chip-inner"
        />
      </div>
    </motion.div>
  );
}

// ─── Mobile tech skill list (fallback for small screens) ────────────────────
//
// The orbit needs 380×380 px to breathe — too cramped on mobile.
// Instead we show a simple, elegant 2-column wrap of glass pills.

function MobileTechList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 flex md:hidden flex-wrap gap-2"
    >
      {heroSkills.map((skill) => {
        const color = DOMAIN_COLORS[skill.label] ?? skill.color;
        return (
          <span
            key={skill.label}
            className="px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{
              color,
              background: `${color}0d`,
              border: `1px solid ${color}22`,
              boxShadow: `0 1px 4px rgba(0,0,0,0.3)`,
            }}
          >
            {skill.label}
          </span>
        );
      })}
    </motion.div>
  );
}

// ─── Scroll indicator ───────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <div
        className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          border: "1px solid rgba(255,255,255,0.1)",
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
          <svg viewBox="0 0 16 16" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden flex items-center"
    >
      {/* Aurora background */}
      {mounted && <AuroraBackground />}

      {/* Orbiting tech rings — desktop only, positioned right of the text */}
      {mounted && <TechOrbit />}

      {/* Radial vignette */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_35%,rgba(10,10,10,0.85)_100%)]" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-56 z-[1] bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-32">
        {/* On mobile the orbit is hidden, so text spans full width.
            On desktop we cap at ~48% to leave room for the orbit ring on the right. */}
        <div className="max-w-full md:max-w-[48%]">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex items-center gap-3"
          >
            <div
              className="h-[1px] w-10"
              style={{
                background: "linear-gradient(90deg, #3b82f6, transparent)",
                boxShadow: "0 0 8px rgba(59,130,246,0.5)",
              }}
            />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#3b82f6" }}>
              {identity.location}
            </span>
          </motion.div>

          {/* Name — massive, black weight for maximum commanding presence */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6 heading-gradient"
          >
            {identity.name}
          </motion.h1>

          {/* Title — blur-to-clear entrance adds cinematic reveal depth */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl font-medium tracking-tight"
            style={{ color: "#60a5fa" }}
          >
            {identity.title}
          </motion.p>

          {/* Tagline — staggered blur-to-clear after title */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-base md:text-lg max-w-lg leading-relaxed italic"
            style={{ color: "#52525b" }}
          >
            {identity.tagline}
          </motion.p>

          {/* CTA buttons — final item in the entrance sequence */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="skeu-button inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white"
            >
              See My Work
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06z" />
              </svg>
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="glass-pill inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: "#fafafa" }}
            >
              Get In Touch
            </a>
          </motion.div>

          {/* Mobile tech list — only visible below md breakpoint */}
          <MobileTechList />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
