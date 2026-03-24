"use client";

import { motion } from "framer-motion";
import VideoShowcase from "./VideoShowcase";
import { bio, bioExtended, education } from "@/data/profile";

// ─── Accent palette ──────────────────────────────────────────────────────────

const ACCENT = "#3b82f6";
const ACCENT_LIGHT = "#60a5fa";
const LINE_GRADIENT = "linear-gradient(90deg, #3b82f6, transparent)";

// ─── AboutShowcase ───────────────────────────────────────────────────────────

export default function AboutShowcase() {
  return (
    <VideoShowcase id="about" overlayOpacity={0.45}>
      <div className="w-full max-w-3xl">
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
            style={{ color: ACCENT }}
          >
            About
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="heading-gradient text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-10"
        >
          Engineer. Builder.{"\n"}Researcher.
        </motion.h2>

        {/* Primary bio */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg leading-relaxed mb-6"
          style={{ color: "rgba(250,250,250,0.85)" }}
        >
          {bio}
        </motion.p>

        {/* Extended bio */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base leading-relaxed mb-10"
          style={{ color: "rgba(161,161,170,0.7)" }}
        >
          {bioExtended}
        </motion.p>

        {/* Education + location — minimal footer line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          style={{ color: "rgba(161,161,170,0.5)" }}
        >
          {education.map((edu) => (
            <span key={edu.degree} className="flex items-center gap-2">
              <span style={{ color: ACCENT_LIGHT }}>{edu.degree}</span>
              <span>&middot;</span>
              <span>{edu.school}</span>
            </span>
          ))}
          <span className="flex items-center gap-2">
            <span style={{ color: ACCENT_LIGHT }}>San Francisco, CA</span>
          </span>
        </motion.div>
      </div>
    </VideoShowcase>
  );
}
