"use client";

import VideoShowcase from "./VideoShowcase";
import ProgressReveal from "@/components/animation/ProgressReveal";

// ─── Stat card ────────────────────────────────────────────────────────────────

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

// ─── Xuman Showcase ───────────────────────────────────────────────────────────

const XUMAN_TECH = [
  { label: "React Native (Expo)", accent: "#ec4899" },
  { label: "NestJS", accent: "#10b981" },
  { label: "Postgres/Prisma", accent: "#10b981" },
  { label: "Redis", accent: "#10b981" },
  { label: "LiveKit/WebRTC", accent: "#06b6d4" },
  { label: "Stripe Connect", accent: "#8b5cf6" },
  { label: "Azure", accent: "#f59e0b" },
];

const XUMAN_STATS = [
  { value: "8", label: "Engineers Led", accent: "#3b82f6" },
  { value: "iOS", label: "App Store Live", accent: "#3b82f6" },
  { value: "~3mo", label: "Concept to Ship", accent: "#60a5fa" },
];

export default function XumanShowcase() {
  return (
    <VideoShowcase
      id="xuman"
      videoSrc="/videos/xuman.mp4"
      overlayOpacity={0.55}
    >
      <div className="w-full">
        {/* Eyebrow */}
        <ProgressReveal start={0.0} className="mb-5 flex items-center gap-3">
          <div
            className="h-[1px] w-10 shrink-0"
            style={{
              background: "linear-gradient(90deg, #3b82f6, transparent)",
              boxShadow: "0 0 8px rgba(59,130,246,0.5)",
            }}
          />
          <span
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: "#3b82f6" }}
          >
            Current Role
          </span>
        </ProgressReveal>

        {/* Title */}
        <ProgressReveal
          start={0.1}
          className="heading-gradient text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-3"
        >
          Xuman.AI
        </ProgressReveal>

        {/* Subtitle */}
        <ProgressReveal start={0.2}>
          <p
            className="text-base md:text-xl font-medium tracking-tight mb-8"
            style={{ color: "#60a5fa" }}
          >
            Marketplace with Agentic AI Workflows
          </p>
        </ProgressReveal>

        {/* Stat cards — horizontal strip */}
        <ProgressReveal start={0.3} className="flex flex-wrap gap-3 mb-8">
          {XUMAN_STATS.map((stat) => (
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
            className="max-w-2xl text-sm md:text-base leading-relaxed mb-8"
            style={{ color: "rgba(161,161,170,0.9)" }}
          >
            Took Xuman from concept to production in ~3 months with a team of two.
            React Native (Expo) mobile client, NestJS microservices, Postgres/Prisma,
            Redis caching, LiveKit/WebRTC real-time video, Stripe Connect payments,
            and Azure deployments. iOS live on the App Store.
          </p>
        </ProgressReveal>

        {/* Tech stack badges */}
        <ProgressReveal start={0.55} className="flex flex-wrap gap-2 mb-10">
          {XUMAN_TECH.map(({ label, accent }) => (
            <TechBadge key={label} label={label} accent={accent} />
          ))}
        </ProgressReveal>

        {/* CTA */}
        <ProgressReveal start={0.65}>
          <a
            href="https://xuman.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="skeu-button inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white"
          >
            Visit Website
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.5l7-7m0 0H5m6.5 0V11" />
            </svg>
          </a>
        </ProgressReveal>
      </div>
    </VideoShowcase>
  );
}
