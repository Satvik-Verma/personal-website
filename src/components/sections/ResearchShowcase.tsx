"use client";

import { motion } from "framer-motion";
import VideoShowcase from "./VideoShowcase";
import { experience } from "@/data/profile";

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

const sfsuRole = experience.find((r) => r.id === "sfsu")!;

// Purple accent — research/academic
const ACCENT = "#8b5cf6";
const ACCENT_LIGHT = "#a78bfa";
const LINE_GRADIENT = "linear-gradient(90deg, #8b5cf6, transparent)";

const STATS = [
  { value: "4", label: "Publications", accent: ACCENT },
  { value: "AAAI", label: "Accepted", accent: ACCENT },
  { value: "HPC", label: "NERSC Perlmutter", accent: ACCENT_LIGHT },
];

// ─── ResearchShowcase ────────────────────────────────────────────────────────

export default function ResearchShowcase() {
  return (
    <VideoShowcase id="research" overlayOpacity={0.45}>
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
              boxShadow: "0 0 8px rgba(139,92,246,0.5)",
            }}
          />
          <span
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: ACCENT }}
          >
            Research
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
              "linear-gradient(135deg, rgba(167,139,250,1) 0%, rgba(139,92,246,0.85) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SFSU Research
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-xl font-medium tracking-tight mb-2"
          style={{ color: ACCENT_LIGHT }}
        >
          {sfsuRole.role}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-medium tracking-wide mb-8"
          style={{ color: "rgba(161,161,170,0.6)" }}
        >
          {sfsuRole.period} &middot; {sfsuRole.location}
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

        {/* Sub-project blocks — FusionML and IoT Security as glass cards within this section */}
        {sfsuRole.subProjects &&
          sfsuRole.subProjects.map((sub, subIndex) => (
            <motion.div
              key={sub.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: 0.5 + subIndex * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="glass-card p-5 mb-4 max-w-3xl"
              style={{ borderRadius: "16px" }}
            >
              <h3
                className="text-base md:text-lg font-bold tracking-tight mb-2 flex items-center gap-2"
                style={{ color: "#fafafa" }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: ACCENT,
                    boxShadow: `0 0 8px ${ACCENT}80`,
                  }}
                />
                {sub.name}
              </h3>
              {sub.bullets.map((bullet, i) => (
                <p
                  key={i}
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: "rgba(161,161,170,0.9)" }}
                >
                  {bullet}
                </p>
              ))}
            </motion.div>
          ))}

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-2 mt-4"
        >
          {sfsuRole.techStack.map((tech) => (
            <TechBadge key={tech} label={tech} accent={ACCENT} />
          ))}
        </motion.div>
      </div>
    </VideoShowcase>
  );
}
