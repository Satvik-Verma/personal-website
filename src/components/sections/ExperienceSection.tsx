"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import FadeInOnScroll from "@/components/animation/FadeInOnScroll";
import { experience } from "@/data/profile";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 md:py-32 relative">
      <div className="section-divider" />

      <div className="max-w-6xl mx-auto px-6 pt-1">
        <SectionHeading
          title="Experience"
          subtitle="Building products from zero to production."
        />

        {/* Timeline */}
        <div className="relative">
          {/*
            SKEUOMORPHIC TIMELINE LINE
            Gradient with glow — looks like a lit fiber-optic cable
            running down the left side of the timeline.
          */}
          <div
            className="timeline-line absolute left-[7px] top-2 bottom-2 w-[2px] hidden sm:block"
            style={{ borderRadius: "100px" }}
          />

          <div className="space-y-10">
            {experience.map((role, roleIndex) => (
              <FadeInOnScroll key={role.id} delay={roleIndex * 0.1} direction="up">
                <div className="sm:pl-10 relative">
                  {/*
                    SKEUOMORPHIC TIMELINE DOT
                    Embossed circle with radial gradient, inner highlight,
                    outer ring glow — looks like a pressable LED indicator.
                  */}
                  <div
                    className="timeline-dot absolute left-0 top-1.5 w-[16px] h-[16px] rounded-full hidden sm:block"
                  />

                  {/*
                    SKEUOMORPHIC EXPERIENCE CARD
                    Multi-layer shadows + subtle texture gradient.
                    The top border highlight gives it a raised, physical feel.
                  */}
                  <div
                    className="group relative overflow-hidden p-6 md:p-7 transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(165deg, rgba(26,26,34,1) 0%, rgba(16,16,22,1) 55%, rgba(12,12,16,1) 100%)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      borderBottom: "1px solid rgba(0,0,0,0.5)",
                      borderRadius: "20px",
                      boxShadow: [
                        "inset 0 1px 0 rgba(255,255,255,0.07)",
                        "inset 0 -1px 0 rgba(0,0,0,0.4)",
                        "0 4px 20px rgba(0,0,0,0.5)",
                        "0 2px 6px rgba(0,0,0,0.4)",
                      ].join(", "),
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = "translateY(-3px)";
                      el.style.boxShadow = [
                        "inset 0 1px 0 rgba(255,255,255,0.11)",
                        "inset 0 -1px 0 rgba(0,0,0,0.5)",
                        "0 8px 32px rgba(0,0,0,0.6)",
                        "0 4px 12px rgba(0,0,0,0.5)",
                        "0 0 0 1px rgba(59,130,246,0.12)",
                      ].join(", ");
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = "";
                      el.style.boxShadow = [
                        "inset 0 1px 0 rgba(255,255,255,0.07)",
                        "inset 0 -1px 0 rgba(0,0,0,0.4)",
                        "0 4px 20px rgba(0,0,0,0.5)",
                        "0 2px 6px rgba(0,0,0,0.4)",
                      ].join(", ");
                    }}
                  >
                    {/* Sheen overlay — top-left light catch */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 40%)",
                        borderRadius: "20px",
                      }}
                    />

                    {/* Hover accent glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at top left, rgba(59,130,246,0.06), transparent 65%)",
                        borderRadius: "20px",
                      }}
                    />

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight" style={{ color: "#fafafa" }}>
                          {role.company}
                        </h3>
                        <p className="text-sm font-medium mt-0.5" style={{ color: "#3b82f6" }}>
                          {role.role}
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 flex-shrink-0">
                        {/*
                          Period badge — skeuomorphic label style.
                          Raised, with bottom shadow for depth.
                        */}
                        <span
                          className="text-xs font-medium px-3 py-1 whitespace-nowrap"
                          style={{
                            color: "#a1a1aa",
                            background:
                              "linear-gradient(180deg, rgba(30,30,40,1) 0%, rgba(20,20,26,1) 100%)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderTop: "1px solid rgba(255,255,255,0.12)",
                            borderBottom: "1px solid rgba(0,0,0,0.4)",
                            borderRadius: "100px",
                            boxShadow:
                              "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 6px rgba(0,0,0,0.4)",
                          }}
                        >
                          {role.period}
                        </span>
                        <span className="text-xs" style={{ color: "#52525b" }}>
                          {role.location}
                        </span>
                      </div>
                    </div>

                    {/* Bullet points */}
                    {role.bullets.length > 0 && (
                      <ul className="space-y-2 mb-5">
                        {role.bullets.map((bullet, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
                            <span
                              className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                              style={{
                                background: "radial-gradient(circle, #60a5fa, #3b82f6)",
                                boxShadow: "0 0 6px rgba(59,130,246,0.5)",
                                flexShrink: 0,
                              }}
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Sub-projects — nested glass panels */}
                    {role.subProjects && role.subProjects.length > 0 && (
                      <div className="mb-5 space-y-3">
                        {role.subProjects.map((sub) => (
                          <div
                            key={sub.name}
                            className="p-4"
                            style={{
                              background: "rgba(10,10,15,0.6)",
                              backdropFilter: "blur(8px)",
                              WebkitBackdropFilter: "blur(8px)",
                              border: "1px solid rgba(255,255,255,0.05)",
                              borderTop: "1px solid rgba(255,255,255,0.09)",
                              borderRadius: "14px",
                              boxShadow:
                                "inset 0 2px 8px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
                            }}
                          >
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "#fafafa" }}>
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  background: "#8b5cf6",
                                  boxShadow: "0 0 6px rgba(139,92,246,0.6)",
                                }}
                              />
                              {sub.name}
                            </h4>
                            <ul className="space-y-1.5">
                              {sub.bullets.map((bullet, i) => (
                                <li
                                  key={i}
                                  className="flex gap-3 text-sm leading-relaxed"
                                  style={{ color: "#71717a" }}
                                >
                                  <span
                                    className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                                    style={{ background: "#52525b" }}
                                  />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {role.techStack.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
