"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import FadeInOnScroll from "@/components/animation/FadeInOnScroll";
import StaggerChildren, { StaggerItem } from "@/components/animation/StaggerChildren";
import { publications, awards } from "@/data/profile";
import type { Publication } from "@/types";

function PublicationCard({ pub }: { pub: Publication }) {
  const typeConfig = {
    paper: {
      label: "Conference Paper",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M9 4.804A7.968 7.968 0 0 0 5.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0 1 5.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0 1 14.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0 0 14.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 1 1-2 0V4.804z" />
        </svg>
      ),
      color: "#3b82f6",
      glow: "rgba(59,130,246,0.12)",
    },
    forum: {
      label: "Student Forum",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M2 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
            clipRule="evenodd"
          />
          <path d="M15 7h1a2 2 0 0 1 2 2v5.5a1.5 1.5 0 0 1-3 0V7z" />
        </svg>
      ),
      color: "#8b5cf6",
      glow: "rgba(139,92,246,0.12)",
    },
  };

  const config = typeConfig[pub.type];

  return (
    <div
      className="group relative overflow-hidden p-6 md:p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        // GLASSMORPHISM — frosted dark glass
        background: "rgba(16,16,24,0.6)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        boxShadow: [
          "0 8px 32px rgba(0,0,0,0.45)",
          "inset 0 1px 0 rgba(255,255,255,0.08)",
        ].join(", "),
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.backdropFilter = "blur(24px) saturate(200%)";
        (el.style as unknown as Record<string, string>).WebkitBackdropFilter = "blur(24px) saturate(200%)";
        el.style.borderTopColor = `${config.color}40`;
        el.style.boxShadow = [
          "0 16px 48px rgba(0,0,0,0.55)",
          `0 0 40px ${config.glow}`,
          "inset 0 1px 0 rgba(255,255,255,0.1)",
        ].join(", ");
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.backdropFilter = "blur(16px) saturate(180%)";
        (el.style as unknown as Record<string, string>).WebkitBackdropFilter = "blur(16px) saturate(180%)";
        el.style.borderTopColor = "rgba(255,255,255,0.12)";
        el.style.boxShadow = [
          "0 8px 32px rgba(0,0,0,0.45)",
          "inset 0 1px 0 rgba(255,255,255,0.08)",
        ].join(", ");
      }}
    >
      {/* Accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top right, ${config.glow}, transparent 60%)`,
          borderRadius: "20px",
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Icon — skeuomorphic pill button */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(160deg, ${config.color}20, ${config.color}08)`,
            border: `1px solid ${config.color}30`,
            borderTop: `1px solid ${config.color}50`,
            color: config.color,
            boxShadow: [
              `inset 0 1px 0 rgba(255,255,255,0.08)`,
              `0 0 16px ${config.color}15`,
              `0 2px 8px rgba(0,0,0,0.4)`,
            ].join(", "),
          }}
        >
          {config.icon}
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {/* Type badge — glass pill */}
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              background: `${config.color}12`,
              color: config.color,
              border: `1px solid ${config.color}28`,
              borderTop: `1px solid ${config.color}45`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 10px ${config.color}10`,
            }}
          >
            {config.label}
          </span>
          <span className="text-xs" style={{ color: "#52525b" }}>{pub.year}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold leading-snug mb-2" style={{ color: "#fafafa" }}>
        {pub.title}
      </h3>

      {/* Venue */}
      <p
        className="text-xs font-semibold uppercase tracking-wide mb-3"
        style={{ color: "#3b82f6" }}
      >
        {pub.venue}
      </p>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
        {pub.description}
      </p>
    </div>
  );
}

export default function PublicationsSection() {
  return (
    <section
      id="publications"
      className="py-24 md:py-32 relative"
    >
      <div className="section-divider" />

      <div className="max-w-6xl mx-auto px-6 pt-1">
        <SectionHeading
          title="Research & Awards"
          subtitle="4 publications across AAAI, IEEE, and fusion energy. Winner at SF Hacks."
        />

        {/* Publications grid — glassmorphism */}
        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12"
          delay={0.1}
        >
          {publications.map((pub) => (
            <StaggerItem key={pub.title}>
              <PublicationCard pub={pub} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Awards — skeuomorphic gold feel */}
        <FadeInOnScroll delay={0.2}>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#52525b" }}
            >
              Awards
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {awards.map((award) => (
                <div
                  key={award.title}
                  className="award-card group relative overflow-hidden p-5 rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Gold sheen overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(245,158,11,0.04) 0%, transparent 50%)",
                      borderRadius: "inherit",
                    }}
                  />

                  {/* Trophy icon — skeuomorphic embossed */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.08) 100%)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      borderTop: "1px solid rgba(245,158,11,0.5)",
                      borderBottom: "1px solid rgba(0,0,0,0.4)",
                      boxShadow: [
                        "inset 0 1px 0 rgba(255,255,255,0.08)",
                        "0 0 16px rgba(245,158,11,0.12)",
                        "0 2px 8px rgba(0,0,0,0.4)",
                      ].join(", "),
                    }}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ color: "#f59e0b" }}>
                      <path d="M5 3a2 2 0 0 0-2 2c0 1.38.56 2.63 1.46 3.53A3.99 3.99 0 0 0 7 10.93V12H6a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-1v-1.07A3.99 3.99 0 0 0 15.54 8.53 3 3 0 0 0 15 3H5zm8 2a1 1 0 0 1 1 1c0 .7-.22 1.34-.6 1.87A2 2 0 0 1 12 9H8a2 2 0 0 1-1.4-3.13A2.01 2.01 0 0 1 6 5h7zM6 14h8v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1z" />
                    </svg>
                  </div>

                  <p
                    className="text-sm font-bold"
                    style={{
                      color: "#f59e0b",
                      textShadow: "0 0 12px rgba(245,158,11,0.3)",
                    }}
                  >
                    {award.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#a1a1aa" }}>{award.event}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#52525b" }}>{award.year}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
