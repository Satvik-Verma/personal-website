"use client";

import { motion } from "framer-motion";
import VideoShowcase from "./VideoShowcase";
import { publications, awards } from "@/data/profile";

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

// ─── Accent palette ─────────────────────────────────────────────────────────

const PRIMARY_ACCENT = "#3b82f6";
const SECONDARY_ACCENT = "#60a5fa";
const LINE_GRADIENT = "linear-gradient(90deg, #3b82f6, transparent)";

const PUB_STATS = [
  { value: "4", label: "Publications", accent: "#3b82f6" },
  { value: "AAAI", label: "Top Venue", accent: "#3b82f6" },
  { value: "IEEE", label: "DSAA-SF", accent: "#60a5fa" },
];

// Pub type config
const TYPE_ACCENT: Record<string, { label: string; color: string }> = {
  paper: { label: "Conference Paper", color: "#3b82f6" },
  forum: { label: "Student Forum", color: "#8b5cf6" },
};

// ─── PublicationsShowcase ───────────────────────────────────────────────────

export default function PublicationsShowcase() {
  return (
    <VideoShowcase id="publications" overlayOpacity={0.45}>
      <div className="w-full py-8">
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
              boxShadow: "0 0 8px rgba(59,130,246,0.5)",
            }}
          />
          <span
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: PRIMARY_ACCENT }}
          >
            Research & Awards
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="heading-gradient text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-3"
        >
          Publications
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-xl font-medium tracking-tight mb-8"
          style={{ color: SECONDARY_ACCENT }}
        >
          4 publications across AAAI, IEEE, and fusion energy. Winner at SF
          Hacks.
        </motion.p>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {PUB_STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              accent={stat.accent}
              delay={0.35 + i * 0.08}
            />
          ))}
        </motion.div>

        {/* Publication cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {publications.map((pub, i) => {
            const config = TYPE_ACCENT[pub.type] ?? {
              label: pub.type,
              color: "#3b82f6",
            };
            return (
              <motion.div
                key={pub.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.4 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="glass-card p-6 flex flex-col"
                style={{ borderRadius: "18px" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <TechBadge label={config.label} accent={config.color} />
                  <span
                    className="text-xs font-medium"
                    style={{ color: "rgba(161,161,170,0.5)" }}
                  >
                    {pub.year}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold leading-snug mb-2"
                  style={{ color: "#fafafa" }}
                >
                  {pub.title}
                </h3>

                {/* Venue */}
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: config.color }}
                >
                  {pub.venue}
                </p>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed flex-grow"
                  style={{ color: "rgba(161,161,170,0.9)" }}
                >
                  {pub.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Awards section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-4"
        >
          {awards.map((award) => (
            <div
              key={award.title}
              className="award-card p-5 rounded-xl flex items-center gap-4"
            >
              {/* Trophy icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.08) 100%)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderTop: "1px solid rgba(245,158,11,0.5)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 16px rgba(245,158,11,0.12)",
                }}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  style={{ color: "#f59e0b" }}
                >
                  <path d="M5 3a2 2 0 0 0-2 2c0 1.38.56 2.63 1.46 3.53A3.99 3.99 0 0 0 7 10.93V12H6a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-1v-1.07A3.99 3.99 0 0 0 15.54 8.53 3 3 0 0 0 15 3H5zm8 2a1 1 0 0 1 1 1c0 .7-.22 1.34-.6 1.87A2 2 0 0 1 12 9H8a2 2 0 0 1-1.4-3.13A2.01 2.01 0 0 1 6 5h7zM6 14h8v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1z" />
                </svg>
              </div>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{
                    color: "#f59e0b",
                    textShadow: "0 0 12px rgba(245,158,11,0.3)",
                  }}
                >
                  {award.title}
                </p>
                <p className="text-xs" style={{ color: "#a1a1aa" }}>
                  {award.event} &middot; {award.year}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </VideoShowcase>
  );
}
