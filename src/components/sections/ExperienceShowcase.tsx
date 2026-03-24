"use client";

import { motion } from "framer-motion";
import VideoShowcase from "./VideoShowcase";
import { experience } from "@/data/profile";

// ─── Reusable atoms ─────────────────────────────────────────────────────────

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

// ─── Data: pull the two remaining roles from profile.ts ─────────────────────

const stealthRole = experience.find((r) => r.id === "stealth")!;
const sfsuRole = experience.find((r) => r.id === "sfsu")!;

// ─── Accent palettes ────────────────────────────────────────────────────────

const STEALTH_ACCENT = "#10b981";
const STEALTH_ACCENT_LIGHT = "#34d399";
const STEALTH_LINE = "linear-gradient(90deg, #10b981, transparent)";

const SFSU_ACCENT = "#8b5cf6";
const SFSU_ACCENT_LIGHT = "#a78bfa";
const SFSU_LINE = "linear-gradient(90deg, #8b5cf6, transparent)";

// ─── Stealth stats ──────────────────────────────────────────────────────────

const STEALTH_STATS = [
  { value: "FHIR R4", label: "EHR Standard", accent: STEALTH_ACCENT },
  { value: "HIPAA", label: "Compliant", accent: STEALTH_ACCENT },
  { value: "0→1", label: "Integration Build", accent: STEALTH_ACCENT_LIGHT },
];

const SFSU_STATS = [
  { value: "4", label: "Publications", accent: SFSU_ACCENT },
  { value: "AAAI", label: "Accepted", accent: SFSU_ACCENT },
  { value: "HPC", label: "NERSC Perlmutter", accent: SFSU_ACCENT_LIGHT },
];

// ─── ExperienceShowcase ─────────────────────────────────────────────────────

export default function ExperienceShowcase() {
  return (
    <VideoShowcase overlayOpacity={0.45}>
      <div id="experience" className="w-full py-8 space-y-28" style={{ scrollMarginTop: "5rem" }}>
        {/* ─── Stealth Startup Block ─────────────────────────────────────── */}
        <div>
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
                background: STEALTH_LINE,
                boxShadow: "0 0 8px rgba(16,185,129,0.5)",
              }}
            />
            <span
              className="text-xs font-bold tracking-[0.22em] uppercase"
              style={{ color: STEALTH_ACCENT }}
            >
              Current Role
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(52,211,153,1) 0%, rgba(16,185,129,0.85) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {stealthRole.company}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-base md:text-xl font-medium tracking-tight mb-2"
            style={{ color: STEALTH_ACCENT_LIGHT }}
          >
            {stealthRole.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-xs font-medium tracking-wide mb-8"
            style={{ color: "rgba(161,161,170,0.6)" }}
          >
            {stealthRole.period} &middot; {stealthRole.location}
          </motion.p>

          {/* Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {STEALTH_STATS.map((stat, i) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                accent={stat.accent}
                delay={0.35 + i * 0.08}
              />
            ))}
          </motion.div>

          {/* Bullets */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="max-w-3xl space-y-3 mb-8"
          >
            {stealthRole.bullets.map((bullet, i) => (
              <p
                key={i}
                className="text-sm md:text-base leading-relaxed flex gap-3"
                style={{ color: "rgba(161,161,170,0.9)" }}
              >
                <span
                  className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${STEALTH_ACCENT_LIGHT}, ${STEALTH_ACCENT})`,
                    boxShadow: `0 0 6px ${STEALTH_ACCENT}80`,
                  }}
                />
                <span>{bullet}</span>
              </p>
            ))}
          </motion.div>

          {/* Tech badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-wrap gap-2"
          >
            {stealthRole.techStack.map((tech) => (
              <TechBadge key={tech} label={tech} accent={STEALTH_ACCENT} />
            ))}
          </motion.div>
        </div>

        {/* ─── SFSU Research Block ───────────────────────────────────────── */}
        <div>
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
                background: SFSU_LINE,
                boxShadow: "0 0 8px rgba(139,92,246,0.5)",
              }}
            />
            <span
              className="text-xs font-bold tracking-[0.22em] uppercase"
              style={{ color: SFSU_ACCENT }}
            >
              Research
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
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
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-base md:text-xl font-medium tracking-tight mb-2"
            style={{ color: SFSU_ACCENT_LIGHT }}
          >
            {sfsuRole.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
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
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {SFSU_STATS.map((stat, i) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                accent={stat.accent}
                delay={0.35 + i * 0.08}
              />
            ))}
          </motion.div>

          {/* Sub-projects as descriptive blocks */}
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
                      background: SFSU_ACCENT,
                      boxShadow: `0 0 8px ${SFSU_ACCENT}80`,
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
            transition={{
              duration: 0.6,
              delay: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {sfsuRole.techStack.map((tech) => (
              <TechBadge key={tech} label={tech} accent={SFSU_ACCENT} />
            ))}
          </motion.div>
        </div>
      </div>
    </VideoShowcase>
  );
}
