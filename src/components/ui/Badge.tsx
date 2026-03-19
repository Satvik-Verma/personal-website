"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted";
}

export default function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  /*
    GLASS PILL BADGES
    Default: translucent frosted glass with a faint border — floats above bg
    Accent: blue-tinted glass with the accent color bleeding through
    Muted: darkest glass, lowest contrast — for de-emphasized tags
  */

  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "100px",
    padding: "2px 10px",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    transition: "all 0.18s ease",
    backdropFilter: "blur(8px) saturate(150%)",
    WebkitBackdropFilter: "blur(8px) saturate(150%)",
    lineHeight: "1.6",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      color: "#a1a1aa",
      background: "rgba(20,20,28,0.7)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderTop: "1px solid rgba(255,255,255,0.11)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 6px rgba(0,0,0,0.35)",
    },
    accent: {
      color: "#60a5fa",
      background: "rgba(59,130,246,0.12)",
      border: "1px solid rgba(59,130,246,0.25)",
      borderTop: "1px solid rgba(59,130,246,0.4)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 12px rgba(59,130,246,0.12), 0 2px 6px rgba(0,0,0,0.3)",
    },
    muted: {
      color: "#71717a",
      background: "rgba(15,15,20,0.75)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 4px rgba(0,0,0,0.3)",
    },
  };

  return (
    <span
      className={cn(className)}
      style={{ ...baseStyles, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        if (variant === "default") {
          (e.currentTarget as HTMLElement).style.color = "#fafafa";
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(59,130,246,0.28)";
          (e.currentTarget as HTMLElement).style.borderTopColor =
            "rgba(59,130,246,0.45)";
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "default") {
          (e.currentTarget as HTMLElement).style.color = "#a1a1aa";
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLElement).style.borderTopColor =
            "rgba(255,255,255,0.11)";
        }
      }}
    >
      {children}
    </span>
  );
}
