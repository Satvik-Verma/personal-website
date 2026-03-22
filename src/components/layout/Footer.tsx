"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { socialLinks, identity } from "@/data/profile";

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case "scholar":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 10a8 8 0 0 1 7.162 3.44L24 9.5z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Footer() {
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const router = useRouter();

  return (
    <footer className="footer-glass relative">
      {/* Top gradient line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.2) 30%, rgba(139,92,246,0.15) 60%, transparent 100%)",
          boxShadow: "0 0 8px rgba(59,130,246,0.1)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Name + tagline */}
          <div>
            <p
              className="text-base font-semibold tracking-tight"
              style={{ color: "#fafafa" }}
            >
              {identity.name.split(" ")[0]}{" "}
              <span style={{ color: "#3b82f6" }}>{identity.name.split(" ")[1]}</span>
            </p>
            <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
              {identity.location}
            </p>
          </div>

          {/* Social links + Resume */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target={link.platform !== "email" ? "_blank" : undefined}
                rel={link.platform !== "email" ? "noopener noreferrer" : undefined}
                aria-label={link.label}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  color: "#71717a",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fafafa";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.4), 0 0 12px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#71717a";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)";
                }}
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}

            {/* Resume download — skeuomorphic */}
            <a
              href="/Satvik_Verma_Resume.pdf"
              download
              className="skeu-button flex items-center gap-2 px-4 py-2 text-sm font-medium text-white"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M8 1a.75.75 0 0 1 .75.75v5.5h2.69L8 10.69 4.56 7.25h2.69v-5.5A.75.75 0 0 1 8 1zm-4.25 9a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5z" />
              </svg>
              Resume
            </a>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-8 mb-0"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)",
          }}
        />

        {/* Bottom row */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#52525b" }}>
            &copy; {new Date().getFullYear()} {identity.name}. Built with Next.js &amp; Three.js.
          </p>

          {/* Easter egg — glowing pixel-game button */}
          <div className="relative">
            <motion.button
              onClick={() => {
                if (!easterEggOpen) {
                  setEasterEggOpen(true);
                } else {
                  router.push("/game");
                }
              }}
              className="relative text-xs overflow-hidden"
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid rgba(74,255,170,0.25)",
                background: "rgba(74,255,170,0.04)",
                color: easterEggOpen ? "#4affaa" : "#52525b",
                fontFamily: "monospace",
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 16px rgba(74,255,170,0.18), 0 0 32px rgba(74,255,170,0.08)",
              }}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#4affaa";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,255,170,0.45)";
              }}
              onMouseLeave={(e) => {
                if (!easterEggOpen) {
                  (e.currentTarget as HTMLElement).style.color = "#52525b";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,255,170,0.25)";
                }
              }}
            >
              {easterEggOpen ? "Enter Satvik's World →" : "Wanna see something cool?"}
            </motion.button>

            <AnimatePresence>
              {easterEggOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: 8 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className="easter-egg-glass absolute bottom-full right-0 mb-3 w-64 p-4 rounded-2xl"
                  style={{ border: "1px solid rgba(74,255,170,0.2)" }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
                    A hidden{" "}
                    <span style={{ color: "#4affaa", fontFamily: "monospace" }}>
                      pixel-art RPG
                    </span>{" "}
                    lives here. Explore Satvik&apos;s world and discover his work — one building at a time.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span style={{ color: "#4affaa", fontFamily: "monospace", fontSize: 10 }}>
                      ↑ click the button to play
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
}
