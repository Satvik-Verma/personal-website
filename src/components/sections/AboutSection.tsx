"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import StatCard from "@/components/ui/StatCard";
import FadeInOnScroll from "@/components/animation/FadeInOnScroll";
import { bio, bioExtended, stats, education, skillCategories, leadership, certifications } from "@/data/profile";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      {/* Subtle section divider at top */}
      <div className="section-divider" />

      <div className="max-w-6xl mx-auto px-6 pt-1">
        <SectionHeading
          title="About Me"
          subtitle="Engineer, builder, and researcher based in San Francisco."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Bio + Education */}
          <FadeInOnScroll direction="left">
            <div className="space-y-6">
              <p className="text-base md:text-lg leading-[1.8]" style={{ color: "#a1a1aa" }}>
                {bio}
              </p>
              <p className="text-base leading-[1.8]" style={{ color: "#a1a1aa" }}>
                {bioExtended}
              </p>

              {/*
                Education card — glassmorphism treatment.
                The frosted surface sits above the background gradient orbs.
              */}
              {/* Education cards */}
              <div className="mt-8 space-y-3">
                {education.map((edu) => (
                  <div
                    key={edu.degree}
                    className="inline-flex items-start gap-4 p-5 w-full"
                    style={{
                      background: "rgba(20,20,28,0.6)",
                      backdropFilter: "blur(16px) saturate(180%)",
                      WebkitBackdropFilter: "blur(16px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderTop: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "18px",
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(59,130,246,0.12)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 16px rgba(59,130,246,0.15)",
                      }}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ color: "#3b82f6" }}>
                        <path d="M10.394 2.08a1 1 0 0 0-.788 0l-7 3a1 1 0 0 0 0 1.84L5.25 8.051a.999.999 0 0 1 .356-.257l4-1.714a1 1 0 1 1 .788 1.838L7.667 9.088l1.94.831a1 1 0 0 0 .787 0l7-3a1 1 0 0 0 0-1.838l-7-3zM3.31 9.397 5 10.12v4.102a8.969 8.969 0 0 0-1.05-.174 1 1 0 0 1-.89-.89 11.115 11.115 0 0 1 .25-3.762zM9.3 16.573A9.026 9.026 0 0 0 10 17a9.026 9.026 0 0 0 .7-.427V13.28l-1 .428-1-.428v3.293zM7 11.429v1.835l-1.579-.679a9.054 9.054 0 0 1-1.055 3.006A1 1 0 0 0 6 17h8a1 1 0 0 0 1.579-.914 9.054 9.054 0 0 1-1.055-3.006L13 13.264v-1.835l-3 1.286-3-1.286z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#fafafa" }}>
                        {edu.degree}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#a1a1aa" }}>
                        {edu.school} &middot; {edu.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leadership */}
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#52525b" }}>
                  Leadership
                </p>
                {leadership.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-start gap-3 p-4"
                    style={{
                      background: "rgba(20,20,28,0.5)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "14px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div
                      className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(139,92,246,0.12)",
                        border: "1px solid rgba(139,92,246,0.25)",
                      }}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" style={{ color: "#8b5cf6" }}>
                        <path d="M13 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 15a4 4 0 0 0-8 0v3h8v-3zM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 18v-3a5.972 5.972 0 0 0-.75-2.906A3.005 3.005 0 0 1 19 15v3h-3zM4.75 12.094A5.973 5.973 0 0 0 4 15v3H1v-3a3 3 0 0 1 3.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#fafafa" }}>
                        {lead.role} — {lead.organization}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#71717a" }}>
                        {lead.period}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#52525b" }}>
                  Certifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <span
                      key={cert.title}
                      className="text-xs px-3 py-1.5"
                      style={{
                        color: "#a1a1aa",
                        background: "rgba(16,185,129,0.06)",
                        border: "1px solid rgba(16,185,129,0.15)",
                        borderRadius: "10px",
                      }}
                    >
                      {cert.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills overview — glass-backed category rows */}
              <div className="mt-4 space-y-3">
                {skillCategories.map((cat) => (
                  <div key={cat.domain} className="flex flex-wrap items-start gap-y-1.5 gap-x-2">
                    <span
                      className="text-xs font-semibold w-28 flex-shrink-0 pt-0.5 uppercase tracking-wide"
                      style={{ color: "#52525b" }}
                    >
                      {cat.domain}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-0.5 transition-all duration-200 hover:-translate-y-0.5"
                          style={{
                            color: "#a1a1aa",
                            background: "rgba(20,20,28,0.7)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderTop: "1px solid rgba(255,255,255,0.11)",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "#fafafa";
                            (e.target as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "#a1a1aa";
                            (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInOnScroll>

          {/* Right: Stats grid */}
          <FadeInOnScroll direction="right" delay={0.15}>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: "#52525b" }}
              >
                By the numbers
              </p>

              {/*
                Stats grid — each card is a glassmorphism panel.
                The glass-card class handles the base style;
                StatCard renders the animated number.
              */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <StatCard
                    key={stat.label}
                    stat={stat}
                    delay={i * 0.1}
                  />
                ))}
              </div>

            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
