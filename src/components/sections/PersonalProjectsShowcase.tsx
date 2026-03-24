"use client";

import VideoShowcase from "./VideoShowcase";
import ProgressReveal from "@/components/animation/ProgressReveal";
import { projects } from "@/data/profile";

// ─── Reusable atoms ──────────────────────────────────────────────────────────

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

const personalProjects = projects.filter((p) => p.category === "personal");

// Pink accent — lighter / personal flavour, distinct from all other sections
const ACCENT = "#ec4899";
const ACCENT_LIGHT = "#f472b6";
const LINE_GRADIENT = "linear-gradient(90deg, #ec4899, transparent)";

// ─── PersonalProjectsShowcase ────────────────────────────────────────────────

export default function PersonalProjectsShowcase() {
  return (
    <VideoShowcase id="personal-projects" overlayOpacity={0.45}>
      <div className="w-full">
        {/* Eyebrow */}
        <ProgressReveal start={0.0} className="mb-5 flex items-center gap-3">
          <div
            className="h-[1px] w-10 shrink-0"
            style={{
              background: LINE_GRADIENT,
              boxShadow: "0 0 8px rgba(236,72,153,0.5)",
            }}
          />
          <span
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: ACCENT }}
          >
            Personal Projects
          </span>
        </ProgressReveal>

        {/* Title */}
        <ProgressReveal
          start={0.1}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-3"
          style={{
            background:
              "linear-gradient(135deg, rgba(244,114,182,1) 0%, rgba(236,72,153,0.85) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Side Explorations
        </ProgressReveal>

        {/* Subtitle */}
        <ProgressReveal start={0.2}>
          <p
            className="text-base md:text-xl font-medium tracking-tight mb-12"
            style={{ color: ACCENT_LIGHT }}
          >
            Tinkering with ideas outside the flagship work.
          </p>
        </ProgressReveal>

        {/* Project cards — 2-up layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
          {personalProjects.map((project, i) => (
            <ProgressReveal key={project.id} start={0.3 + i * 0.1}>
              <div
                className="glass-card p-6 flex flex-col"
                style={{ borderRadius: "18px" }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="glass-pill inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1"
                    style={{
                      color: ACCENT,
                      background: `${ACCENT}12`,
                      border: `1px solid ${ACCENT}28`,
                      borderTop: `1px solid ${ACCENT}45`,
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{
                        background: ACCENT,
                        boxShadow: `0 0 4px ${ACCENT}`,
                      }}
                    />
                    Personal
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
                      GitHub
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

                {/* Tech */}
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <TechBadge key={tech} label={tech} accent={ACCENT} />
                  ))}
                </div>
              </div>
            </ProgressReveal>
          ))}
        </div>
      </div>
    </VideoShowcase>
  );
}
