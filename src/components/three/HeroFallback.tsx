"use client";

import { motion } from "framer-motion";
import { heroSkills } from "@/data/profile";

// CSS keyframe animations — no GSAP needed for fallback
const floatKeyframes = `
  @keyframes float-0 { 0%, 100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-14px) rotate(2deg); } }
  @keyframes float-1 { 0%, 100% { transform: translateY(0px) rotate(1deg); } 50% { transform: translateY(-10px) rotate(-3deg); } }
  @keyframes float-2 { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-18px) rotate(2deg); } }
  @keyframes float-3 { 0%, 100% { transform: translateY(0px) rotate(2deg); } 50% { transform: translateY(-12px) rotate(-1deg); } }
  @keyframes float-4 { 0%, 100% { transform: translateY(0px) rotate(-3deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
  @keyframes float-5 { 0%, 100% { transform: translateY(0px) rotate(1deg); } 50% { transform: translateY(-16px) rotate(-2deg); } }
  @keyframes float-6 { 0%, 100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-11px) rotate(1deg); } }
  @keyframes float-7 { 0%, 100% { transform: translateY(0px) rotate(3deg); } 50% { transform: translateY(-15px) rotate(-3deg); } }
  @keyframes grad-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes pulse-orb { 0%, 100% { opacity: 0.18; transform: scale(1); } 50% { opacity: 0.32; transform: scale(1.1); } }
  @keyframes pulse-orb-slow { 0%, 100% { opacity: 0.12; transform: scale(1); } 50% { opacity: 0.22; transform: scale(1.06); } }
`;

// Deterministic positions for each skill badge
const positions = [
  { left: "8%",  top: "18%" },
  { left: "72%", top: "12%" },
  { left: "20%", top: "65%" },
  { left: "60%", top: "55%" },
  { left: "38%", top: "25%" },
  { left: "82%", top: "42%" },
  { left: "5%",  top: "48%" },
  { left: "50%", top: "78%" },
  { left: "28%", top: "82%" },
  { left: "68%", top: "80%" },
  { left: "88%", top: "68%" },
  { left: "42%", top: "48%" },
  { left: "14%", top: "32%" },
  { left: "76%", top: "28%" },
];

export default function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: floatKeyframes }} />

      {/* Deep dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #0d1117 25%, #0a0f1e 50%, #0d0a1a 75%, #0a0a0a 100%)",
          backgroundSize: "400% 400%",
          animation: "grad-shift 14s ease infinite",
        }}
      />

      {/*
        RICHER GRADIENT ORBS for fallback — glassmorphism requires
        saturated color pools behind the translucent badges.
      */}
      {/* Blue — upper left */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "50vw",
          height: "50vw",
          top: "5%",
          left: "10%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
          animation: "pulse-orb 7s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />
      {/* Purple — lower right */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "45vw",
          height: "45vw",
          bottom: "5%",
          right: "5%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          animation: "pulse-orb 9s ease-in-out infinite 2s",
          filter: "blur(70px)",
        }}
      />
      {/* Teal — mid center */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "30vw",
          height: "30vw",
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%)",
          animation: "pulse-orb-slow 11s ease-in-out infinite 1s",
          filter: "blur(60px)",
        }}
      />

      {/*
        GLASSMORPHISM SKILL BADGES
        Each badge is a frosted glass pill — the color bleeds through
        the translucent surface from the emissive glow behind.
      */}
      {heroSkills.map((skill, i) => {
        const pos = positions[i % positions.length];
        const animIndex = i % 8;
        const duration = 3.5 + (i % 5) * 0.7;
        const delay = i * 0.3;

        return (
          <motion.div
            key={skill.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.3 + delay * 0.15,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              animation: `float-${animIndex} ${duration}s ease-in-out infinite ${delay * 0.2}s`,
            }}
          >
            {/*
              Glass pill badge — backdrop-blur with color-tinted glow.
              The border picks up the skill color for identity.
            */}
            <div
              style={{
                padding: `${7 + (skill.scale ?? 1)}px ${12 + (skill.scale ?? 1) * 2}px`,
                borderRadius: "100px",
                fontSize: `${10 + (skill.scale ?? 1) * 2}px`,
                fontWeight: 700,
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
                color: "#ffffff",
                // Frosted glass base
                background: `rgba(10, 10, 15, 0.55)`,
                backdropFilter: "blur(12px) saturate(180%)",
                WebkitBackdropFilter: "blur(12px) saturate(180%)",
                // Color-keyed border + top highlight
                border: `1px solid ${skill.color}30`,
                borderTop: `1px solid ${skill.color}50`,
                // Layered shadows — depth + color glow
                boxShadow: [
                  `inset 0 1px 0 rgba(255,255,255,0.1)`,
                  `0 4px 16px rgba(0,0,0,0.5)`,
                  `0 0 20px ${skill.color}15`,
                  `0 0 40px ${skill.color}08`,
                ].join(", "),
                // Subtle text shadow matching skill color
                textShadow: `0 0 12px ${skill.color}60`,
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              }}
            >
              {skill.label}
            </div>
          </motion.div>
        );
      })}

      {/* Subtle grid overlay — very faint dot grid for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #a1a1aa 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
