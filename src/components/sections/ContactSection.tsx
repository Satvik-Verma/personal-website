"use client";

import { motion } from "framer-motion";
import ProgressReveal from "@/components/animation/ProgressReveal";
import { socialLinks, identity } from "@/data/profile";
import type { SocialLink } from "@/types";

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case "scholar":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 10a8 8 0 0 1 7.162 3.44L24 9.5z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      );
    default:
      return null;
  }
}

const socialMeta: Record<string, { label: string; sublabel: string; color: string }> = {
  linkedin: { label: "LinkedIn",       sublabel: "Connect professionally",  color: "#0077B5" },
  github:   { label: "GitHub",         sublabel: "See the code",            color: "#e2e8f0" },
  scholar:  { label: "Google Scholar", sublabel: "Read the research",       color: "#4285F4" },
  email:    { label: "Email",          sublabel: identity.email,            color: "#10b981" },
};

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24 md:py-32 relative"
      style={{ height: "100vh", background: "#0a0a0a" }}
    >
      <div className="section-divider" />

      <div className="max-w-6xl mx-auto px-6 pt-1">
        {/* Centered heading */}
        <ProgressReveal start={0.0}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-4"
              style={{ color: "#3b82f6" }}
            >
              Let&apos;s talk
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
              style={{
                background: "linear-gradient(135deg, #fafafa 0%, #c8c8d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Let&apos;s build something{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                together
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#a1a1aa" }}>
              Open to full-time roles, interesting collaborations, and conversations about building great products.
            </p>
          </div>
        </ProgressReveal>

        {/*
          GLASSMORPHISM SOCIAL CARDS
          Each platform gets its own color bleeding through the frosted glass.
          The icon container carries the per-platform accent color.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {socialLinks.map((link, i) => {
            const meta = socialMeta[link.platform];
            return (
              <ProgressReveal key={link.platform} start={0.2 + i * 0.08}>
                <motion.a
                  href={link.url}
                  target={link.platform !== "email" ? "_blank" : undefined}
                  rel={link.platform !== "email" ? "noopener noreferrer" : undefined}
                  className="group relative overflow-hidden flex flex-col gap-4 p-5 contact-glass-card"
                  style={{ borderRadius: "20px" }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Per-platform color bleed through the glass */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at center bottom, ${meta.color}12, transparent 70%)`,
                      borderRadius: "20px",
                    }}
                  />
                  {/* Top-left glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at top left, ${meta.color}08, transparent 60%)`,
                      borderRadius: "20px",
                    }}
                  />

                  {/* Icon — skeuomorphic button feel */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(160deg, ${meta.color}20, ${meta.color}08)`,
                      border: `1px solid ${meta.color}28`,
                      borderTop: `1px solid ${meta.color}45`,
                      borderBottom: `1px solid rgba(0,0,0,0.3)`,
                      color: meta.color,
                      boxShadow: [
                        `inset 0 1px 0 rgba(255,255,255,0.08)`,
                        `0 0 20px ${meta.color}15`,
                        `0 2px 8px rgba(0,0,0,0.4)`,
                      ].join(", "),
                    }}
                  >
                    <SocialIcon platform={link.platform} />
                  </div>

                  {/* Labels */}
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#fafafa" }}>
                      {meta.label}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#71717a" }}>
                      {meta.sublabel}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0"
                    style={{ color: "#a1a1aa" }}
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path
                        fillRule="evenodd"
                        d="M4.22 11.78a.75.75 0 0 1 0-1.06l5.44-5.44H6a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75V10a.75.75 0 0 1-1.5 0V6.81l-5.44 5.44a.75.75 0 0 1-1.06 0z"
                      />
                    </svg>
                  </div>
                </motion.a>
              </ProgressReveal>
            );
          })}
        </div>

        {/* Resume CTA — skeuomorphic pressable button */}
        <ProgressReveal start={0.55}>
          <div className="text-center">
            <a
              href="/Satvik_Verma_Resume.pdf"
              download
              className="skeu-button inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm3.293-7.707a1 1 0 0 1 1.414 0L9 10.586V3a1 1 0 1 1 2 0v7.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Resume
            </a>
            <p className="mt-3 text-xs" style={{ color: "#52525b" }}>
              PDF &middot; Updated {new Date().getFullYear()}
            </p>
          </div>
        </ProgressReveal>
      </div>
    </section>
  );
}
