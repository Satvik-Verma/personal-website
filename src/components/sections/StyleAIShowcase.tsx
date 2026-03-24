"use client";

import { motion } from "framer-motion";
import VideoShowcase from "./VideoShowcase";

// ─── Stat card ────────────────────────────────────────────────────────────────

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

// ─── Tech badge ───────────────────────────────────────────────────────────────

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

// ─── Style.AI Showcase ────────────────────────────────────────────────────────

const STYLEAI_TECH = [
  { label: "React Native", accent: "#f0abfc" },
  { label: "FastAPI", accent: "#a78bfa" },
  { label: "PyTorch", accent: "#c084fc" },
  { label: "Computer Vision", accent: "#f0abfc" },
  { label: "Python", accent: "#a78bfa" },
];

const STYLEAI_STATS = [
  { value: "200+", label: "Users (Month 1)", accent: "#c084fc" },
  { value: "30%", label: "Faster Decisions", accent: "#c084fc" },
  { value: "0→1", label: "Founder Build", accent: "#a78bfa" },
];

// Purple-to-pink accent for visual differentiation from Xuman's blue palette
const PRIMARY_ACCENT = "#c084fc";
const LINE_GRADIENT = "linear-gradient(90deg, #c084fc, transparent)";

export default function StyleAIShowcase() {
  return (
    <VideoShowcase
      id="styleai"
      videoSrc="/videos/styleai.mp4"
      overlayOpacity={0.58}
    >
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
              boxShadow: "0 0 8px rgba(192,132,252,0.5)",
            }}
          />
          <span
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: PRIMARY_ACCENT }}
          >
            Founded Project
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
            // Purple-to-pink gradient for the title, distinct from Xuman's white/grey
            background:
              "linear-gradient(135deg, rgba(240,171,252,1) 0%, rgba(192,132,252,0.85) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Style.AI
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-xl font-medium tracking-tight mb-8"
          style={{ color: "#d8b4fe" }}
        >
          AI-Powered Fashion Intelligence
        </motion.p>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {STYLEAI_STATS.map((stat, i) => (
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
          className="max-w-2xl text-sm md:text-base leading-relaxed mb-8"
          style={{ color: "rgba(161,161,170,0.9)" }}
        >
          Full-stack AI wardrobe assistant (React Native, FastAPI, PyTorch) that
          scans clothing via computer vision, generates personalized outfit
          recommendations, and uses an active learning pipeline trained on 52K+
          images. 200+ users in the first month.
        </motion.p>

        {/* Tech stack badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {STYLEAI_TECH.map(({ label, accent }) => (
            <TechBadge key={label} label={label} accent={accent} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="https://styleai.fashion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-[14px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(167,139,250,1) 0%, rgba(126,105,216,1) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderTop: "1px solid rgba(255,255,255,0.3)",
              borderBottom: "1px solid rgba(0,0,0,0.35)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.2), 0 4px 12px rgba(139,92,246,0.35), 0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            Visit Website
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.5l7-7m0 0H5m6.5 0V11" />
            </svg>
          </a>
        </motion.div>
      </div>
    </VideoShowcase>
  );
}
