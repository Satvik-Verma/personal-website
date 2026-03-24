"use client";

import VideoShowcase from "./VideoShowcase";
import ProgressReveal from "@/components/animation/ProgressReveal";
import { experience } from "@/data/profile";

// ─── Reusable atoms ──────────────────────────────────────────────────────────

interface StatCardProps {
  value: string;
  label: string;
  accent: string;
}

function StatCard({ value, label, accent }: StatCardProps) {
  return (
    <div
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
    </div>
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
        <ProgressReveal start={0.0} className="mb-5 flex items-center gap-3">
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
        </ProgressReveal>

        {/* Title */}
        <ProgressReveal
          start={0.1}
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
        </ProgressReveal>

        {/* Subtitle */}
        <ProgressReveal start={0.2}>
          <p
            className="text-base md:text-xl font-medium tracking-tight mb-2"
            style={{ color: ACCENT_LIGHT }}
          >
            {sfsuRole.role}
          </p>
        </ProgressReveal>

        <ProgressReveal start={0.25}>
          <p
            className="text-xs font-medium tracking-wide mb-8"
            style={{ color: "rgba(161,161,170,0.6)" }}
          >
            {sfsuRole.period} &middot; {sfsuRole.location}
          </p>
        </ProgressReveal>

        {/* Stat cards */}
        <ProgressReveal start={0.3} className="flex flex-wrap gap-3 mb-8">
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              accent={stat.accent}
            />
          ))}
        </ProgressReveal>

        {/* Sub-project blocks — FusionML and IoT Security as glass cards */}
        {sfsuRole.subProjects &&
          sfsuRole.subProjects.map((sub, subIndex) => (
            <ProgressReveal
              key={sub.name}
              start={0.45 + subIndex * 0.1}
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
            </ProgressReveal>
          ))}

        {/* Tech badges */}
        <ProgressReveal start={0.7} className="flex flex-wrap gap-2 mt-4">
          {sfsuRole.techStack.map((tech) => (
            <TechBadge key={tech} label={tech} accent={ACCENT} />
          ))}
        </ProgressReveal>
      </div>
    </VideoShowcase>
  );
}
