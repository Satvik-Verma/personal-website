"use client";

import { motion } from "framer-motion";
import VideoShowcase from "./VideoShowcase";
import { projects } from "@/data/profile";

// ─── Reusable atoms ──────────────────────────────────────────────────────────

interface StatCardProps {
  value: string;
  label: string;
  accent: string;
  delay?: number;
}

function StatCard({ value, label, accent, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card flex flex-col items-center justify-center text-center px-5 py-4 min-w-[96px]"
      style={{ borderRadius: "16px" }}
    >
      <span
        className="text-2xl md:text-3xl font-black tracking-tight leading-none"
        style={{
          color: accent,
          textShadow: `0 0 20px ${accent}55, 0 0 40px ${accent}25`,
        }}
      >
        {value}
      </span>
      <span
        className="mt-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
        style={{ color: "rgba(161,161,170,0.8)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function TechBadge({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="glass-pill inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide"
      style={{
        color: accent,
        background: `${accent}0d`,
        border: `1px solid ${accent}28`,
        borderTop: `1px solid ${accent}42`,
        boxShadow: `inset 0 1px 0 ${accent}18, 0 0 12px ${accent}0a`,
      }}
    >
      {label}
    </span>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const fusionProject = projects.find((p) => p.id === "fusionml")!;

// Teal/cyan accent — science/data flavour, distinct from blue (Xuman) and purple (research)
const ACCENT = "#06b6d4";
const ACCENT_LIGHT = "#22d3ee";
const LINE_GRADIENT = "linear-gradient(90deg, #06b6d4, transparent)";

const STATS = [
  { value: "25%", label: "Efficiency Gain", accent: ACCENT },
  { value: "MIT", label: "Multi-Inst.", accent: ACCENT },
  { value: "HPC", label: "NERSC", accent: ACCENT_LIGHT },
];

// ─── FusionMLShowcase ────────────────────────────────────────────────────────

export default function FusionMLShowcase() {
  return (
    <VideoShowcase id="fusionml" overlayOpacity={0.45}>
      <div className="w-full">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 flex items-center gap-3"
        >
          <div
            className="h-[1px] w-10 shrink-0"
            style={{
              background: LINE_GRADIENT,
              boxShadow: "0 0 8px rgba(6,182,212,0.5)",
            }}
          />
          <span
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: ACCENT }}
          >
            Research Project
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-3"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,211,238,1) 0%, rgba(6,182,212,0.85) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          FusionML
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-xl font-medium tracking-tight mb-8"
          style={{ color: ACCENT_LIGHT }}
        >
          ML Surrogates for Fusion Tokamak Plasma Prediction
        </motion.p>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              accent={stat.accent}
              delay={0.35 + i * 0.08}
            />
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl text-sm md:text-base leading-relaxed mb-8"
          style={{ color: "rgba(161,161,170,0.9)" }}
        >
          {fusionProject.description} Collaborated across research stakeholders
          including MIT, Princeton Plasma Physics Lab, and LBNL. Ran large-scale
          training on NERSC Perlmutter HPC clusters.
        </motion.p>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {fusionProject.techStack.map((tech) => (
            <TechBadge key={tech} label={tech} accent={ACCENT} />
          ))}
        </motion.div>

        {/* Paper link */}
        {fusionProject.link && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={fusionProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-[14px]"
              style={{
                background: "linear-gradient(180deg, rgba(34,211,238,0.9) 0%, rgba(6,182,212,1) 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderTop: "1px solid rgba(255,255,255,0.28)",
                borderBottom: "1px solid rgba(0,0,0,0.35)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 0 rgba(0,0,0,0.2), 0 4px 12px rgba(6,182,212,0.35), 0 2px 4px rgba(0,0,0,0.4)",
                color: "#0a0a0a",
              }}
            >
              Read Paper
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.5l7-7m0 0H5m6.5 0V11" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </VideoShowcase>
  );
}
