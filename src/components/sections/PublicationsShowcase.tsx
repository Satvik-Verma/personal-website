"use client";

import VideoShowcase from "./VideoShowcase";
import ProgressReveal from "@/components/animation/ProgressReveal";
import { publications, awards } from "@/data/profile";

// ─── Accent palette ─────────────────────────────────────────────────────────

const PRIMARY_ACCENT = "#3b82f6";
const SECONDARY_ACCENT = "#60a5fa";
const LINE_GRADIENT = "linear-gradient(90deg, #3b82f6, transparent)";

const TYPE_ACCENT: Record<string, { label: string; color: string }> = {
  paper: { label: "Paper", color: "#3b82f6" },
  forum: { label: "Forum", color: "#8b5cf6" },
};

// ─── PublicationsShowcase ───────────────────────────────────────────────────

export default function PublicationsShowcase() {
  return (
    <VideoShowcase id="publications" overlayOpacity={0.45}>
      <div className="w-full">
        {/* Eyebrow */}
        <ProgressReveal start={0.0} className="mb-4 flex items-center gap-3">
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
        </ProgressReveal>

        {/* Title */}
        <ProgressReveal
          start={0.1}
          className="heading-gradient text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-2 md:mb-3"
        >
          Publications
        </ProgressReveal>

        {/* Subtitle */}
        <ProgressReveal start={0.15}>
          <p
            className="text-sm md:text-xl font-medium tracking-tight mb-6 md:mb-8"
            style={{ color: SECONDARY_ACCENT }}
          >
            Published at AAAI, IEEE, APS. SF Hacks winner.
          </p>
        </ProgressReveal>

        {/* Publication list — compact, works on any screen */}
        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          {publications.map((pub, i) => {
            const config = TYPE_ACCENT[pub.type] ?? { label: pub.type, color: "#3b82f6" };
            return (
              <ProgressReveal key={pub.title} start={0.25 + i * 0.08}>
                <div
                  className="glass-card p-4 md:p-5"
                  style={{ borderRadius: "14px" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm md:text-base font-bold leading-snug mb-1 line-clamp-2"
                        style={{ color: "#fafafa" }}
                      >
                        {pub.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span style={{ color: config.color }} className="font-semibold">
                          {pub.venue}
                        </span>
                        <span style={{ color: "rgba(161,161,170,0.4)" }}>&middot;</span>
                        <span style={{ color: "rgba(161,161,170,0.5)" }}>{pub.year}</span>
                        {pub.link && (
                          <>
                            <span style={{ color: "rgba(161,161,170,0.4)" }}>&middot;</span>
                            <a
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold hover:underline"
                              style={{ color: SECONDARY_ACCENT }}
                            >
                              Read &rarr;
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className="shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full"
                      style={{
                        color: config.color,
                        background: `${config.color}15`,
                        border: `1px solid ${config.color}30`,
                      }}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              </ProgressReveal>
            );
          })}
        </div>

        {/* Award */}
        <ProgressReveal start={0.65} className="flex flex-wrap gap-3">
          {awards.map((award) => (
            <a
              key={award.title}
              href={award.link}
              target="_blank"
              rel="noopener noreferrer"
              className="award-card p-4 rounded-xl flex items-center gap-3 hover:brightness-110 transition-all"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 shrink-0"
                style={{ color: "#f59e0b" }}
              >
                <path d="M5 3a2 2 0 0 0-2 2c0 1.38.56 2.63 1.46 3.53A3.99 3.99 0 0 0 7 10.93V12H6a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-1v-1.07A3.99 3.99 0 0 0 15.54 8.53 3 3 0 0 0 15 3H5zm8 2a1 1 0 0 1 1 1c0 .7-.22 1.34-.6 1.87A2 2 0 0 1 12 9H8a2 2 0 0 1-1.4-3.13A2.01 2.01 0 0 1 6 5h7zM6 14h8v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1z" />
              </svg>
              <div>
                <p className="text-sm font-bold" style={{ color: "#f59e0b" }}>
                  {award.title}
                </p>
                <p className="text-xs" style={{ color: "#a1a1aa" }}>
                  {award.event} &middot; {award.year}
                </p>
              </div>
              <svg viewBox="0 0 16 16" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="w-3 h-3 shrink-0 ml-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.5l7-7m0 0H5m6.5 0V11" />
              </svg>
            </a>
          ))}
        </ProgressReveal>
      </div>
    </VideoShowcase>
  );
}
