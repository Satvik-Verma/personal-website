"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { Stat } from "@/types";
import { cn } from "@/lib/utils";

interface StatCardProps {
  stat: Stat;
  className?: string;
  delay?: number;
}

export default function StatCard({ stat, className, delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => setHasAnimated(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, delay]);

  return (
    <div
      ref={ref}
      className={cn("group relative overflow-hidden p-6 transition-all duration-300", className)}
      style={{
        // GLASSMORPHISM stat card
        background: "rgba(16,16,24,0.6)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "18px",
        boxShadow: [
          "0 8px 32px rgba(0,0,0,0.4)",
          "inset 0 1px 0 rgba(255,255,255,0.08)",
        ].join(", "),
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-3px)";
        el.style.backdropFilter = "blur(24px) saturate(200%)";
        (el.style as unknown as Record<string, string>).WebkitBackdropFilter = "blur(24px) saturate(200%)";
        el.style.borderTopColor = "rgba(59,130,246,0.35)";
        el.style.boxShadow = [
          "0 16px 48px rgba(0,0,0,0.55)",
          "0 0 40px rgba(59,130,246,0.08)",
          "inset 0 1px 0 rgba(255,255,255,0.1)",
        ].join(", ");
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "";
        el.style.backdropFilter = "blur(16px) saturate(180%)";
        (el.style as unknown as Record<string, string>).WebkitBackdropFilter = "blur(16px) saturate(180%)";
        el.style.borderTopColor = "rgba(255,255,255,0.12)";
        el.style.boxShadow = [
          "0 8px 32px rgba(0,0,0,0.4)",
          "inset 0 1px 0 rgba(255,255,255,0.08)",
        ].join(", ");
      }}
    >
      {/* Top-left sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(140deg, rgba(255,255,255,0.025) 0%, transparent 45%)",
          borderRadius: "18px",
        }}
      />

      {/* Hover accent glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top left, rgba(59,130,246,0.08), transparent 70%)",
          borderRadius: "18px",
        }}
      />

      {/*
        STAT VALUE — number has accent color with glow bloom.
        Animates from invisible to visible when the card enters viewport.
      */}
      <div
        className={cn(
          "text-3xl md:text-4xl font-bold tabular-nums transition-all duration-700",
          hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        )}
        style={{
          transitionDelay: `${delay}s`,
          // Accent color with bloom glow
          color: "#3b82f6",
          textShadow: hasAnimated
            ? "0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.2)"
            : "none",
        }}
      >
        {stat.value}
      </div>

      {/* Label */}
      <div
        className={cn(
          "mt-1.5 text-sm font-medium transition-all duration-700",
          hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        )}
        style={{
          transitionDelay: `${delay + 0.1}s`,
          color: "#a1a1aa",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}
