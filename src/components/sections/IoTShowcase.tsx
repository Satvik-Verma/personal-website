"use client";

import VideoShowcase from "./VideoShowcase";
import ProgressReveal from "@/components/animation/ProgressReveal";
import { projects } from "@/data/profile";

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

const iotProject = projects.find((p) => p.id === "iot-security")!;

// Amber accent — security/threat intelligence flavour
const ACCENT = "#f59e0b";
const ACCENT_LIGHT = "#fbbf24";
const LINE_GRADIENT = "linear-gradient(90deg, #f59e0b, transparent)";

const STATS = [
  { value: "AAAI", label: "SS 2025", accent: ACCENT },
  { value: "IEEE", label: "DSAA-SF", accent: ACCENT },
  { value: "LLM", label: "RAG-Based", accent: ACCENT_LIGHT },
];

// ─── IoTShowcase ─────────────────────────────────────────────────────────────

export default function IoTShowcase() {
  return (
    <VideoShowcase id="iot" overlayOpacity={0.45}>
      <div className="w-full">
        {/* Eyebrow */}
        <ProgressReveal start={0.0} className="mb-5 flex items-center gap-3">
          <div
            className="h-[1px] w-10 shrink-0"
            style={{
              background: LINE_GRADIENT,
              boxShadow: "0 0 8px rgba(245,158,11,0.5)",
            }}
          />
          <span
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: ACCENT }}
          >
            Research Project
          </span>
        </ProgressReveal>

        {/* Title */}
        <ProgressReveal
          start={0.1}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-3"
          style={{
            background:
              "linear-gradient(135deg, rgba(251,191,36,1) 0%, rgba(245,158,11,0.85) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          IoT Attack Detection
        </ProgressReveal>

        {/* Subtitle */}
        <ProgressReveal start={0.2}>
          <p
            className="text-base md:text-xl font-medium tracking-tight mb-8"
            style={{ color: ACCENT_LIGHT }}
          >
            LLM / RAG-Based IoT Security on Edge Devices
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

        {/* Description */}
        <ProgressReveal start={0.45}>
          <p
            className="max-w-3xl text-sm md:text-base leading-relaxed mb-8"
            style={{ color: "rgba(161,161,170,0.9)" }}
          >
            {iotProject.description} Evaluated on public IoT datasets using
            feature ranking and knowledge-base prompting to enable efficient
            on-device attack classification without cloud dependency.
          </p>
        </ProgressReveal>

        {/* Tech badges */}
        <ProgressReveal start={0.55} className="flex flex-wrap gap-2 mb-8">
          {iotProject.techStack.map((tech) => (
            <TechBadge key={tech} label={tech} accent={ACCENT} />
          ))}
        </ProgressReveal>

        {/* Paper link */}
        {iotProject.link && (
          <ProgressReveal start={0.65}>
            <a
              href={iotProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-[14px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(251,191,36,0.9) 0%, rgba(217,119,6,1) 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderTop: "1px solid rgba(255,255,255,0.28)",
                borderBottom: "1px solid rgba(0,0,0,0.35)",
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.22)",
                  "inset 0 -2px 0 rgba(0,0,0,0.2)",
                  "0 4px 12px rgba(245,158,11,0.35)",
                  "0 2px 4px rgba(0,0,0,0.4)",
                ].join(", "),
                color: "#0a0a0a",
              }}
            >
              Read Paper
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10.5V12.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2M3 10.5l5-5m0 0h3.5M8 5.5V2"
                />
              </svg>
            </a>
          </ProgressReveal>
        )}
      </div>
    </VideoShowcase>
  );
}
