"use client";

import { motion } from "framer-motion";
import VideoShowcase from "./VideoShowcase";
import { projects } from "@/data/profile";

// ─── Reusable atoms ─────────────────────────────────────────────────────────

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

// ─── Category colour map ────────────────────────────────────────────────────

const CATEGORY_ACCENT: Record<string, string> = {
  research: "#8b5cf6",
  personal: "#10b981",
  product: "#3b82f6",
};

// ─── Filter to remaining (non-featured) projects ────────────────────────────

const remainingProjects = projects.filter((p) => !p.featured);

// ─── Accent palette ─────────────────────────────────────────────────────────

const PRIMARY_ACCENT = "#06b6d4";
const LINE_GRADIENT = "linear-gradient(90deg, #06b6d4, transparent)";

// ─── ProjectsShowcase ───────────────────────────────────────────────────────

export default function ProjectsShowcase() {
  return (
    <VideoShowcase overlayOpacity={0.45}>
      <div id="projects" className="w-full py-8" style={{ scrollMarginTop: "5rem" }}>
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
            style={{ color: PRIMARY_ACCENT }}
          >
            More Projects
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
          Projects
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-xl font-medium tracking-tight mb-12"
          style={{ color: "rgba(6,182,212,0.85)" }}
        >
          Research and personal explorations beyond the flagship products.
        </motion.p>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {remainingProjects.map((project, i) => {
            const accent = CATEGORY_ACCENT[project.category] ?? "#3b82f6";
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="glass-card p-6 flex flex-col"
                style={{ borderRadius: "18px" }}
              >
                {/* Category pill */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="glass-pill inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1"
                    style={{
                      color: accent,
                      background: `${accent}12`,
                      border: `1px solid ${accent}28`,
                      borderTop: `1px solid ${accent}45`,
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{
                        background: accent,
                        boxShadow: `0 0 4px ${accent}`,
                      }}
                    />
                    {project.category.charAt(0).toUpperCase() +
                      project.category.slice(1)}
                  </span>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title}`}
                      className="text-xs font-semibold flex items-center gap-1 transition-colors duration-200"
                      style={{ color: "rgba(161,161,170,0.7)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "#fafafa";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(161,161,170,0.7)";
                      }}
                    >
                      View
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 10.5V12.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2M3 10.5l5-5m0 0h3.5M8 5.5V2"
                        />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-bold tracking-tight leading-tight mb-2"
                  style={{ color: "#fafafa" }}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed flex-grow mb-5"
                  style={{ color: "rgba(161,161,170,0.9)" }}
                >
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <TechBadge key={tech} label={tech} accent={accent} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </VideoShowcase>
  );
}
