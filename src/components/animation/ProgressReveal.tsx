"use client";

/**
 * ProgressReveal — scroll-progress-driven element reveal.
 *
 * Renders its children inside a wrapper div that starts invisible
 * (opacity: 0, translateY: 24px) and becomes visible once the scroll
 * progress within the active section reaches the `start` threshold.
 *
 * Performance characteristics:
 *  - One shared rAF loop for all instances (see progressRevealManager).
 *  - Zero React re-renders during scroll.
 *  - GPU-only properties: opacity + transform. No layout triggers.
 *  - CSS transition on the wrapper handles the smooth animation.
 *  - Correctly reads which section it belongs to via SectionIndexContext,
 *    so elements in off-screen sections never accidentally reveal.
 *  - Respects prefers-reduced-motion via the manager.
 */

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { register, unregister } from "./progressRevealManager";
import { useSectionIndex } from "@/components/layout/ScrollDriver";

// ─── Props ───────────────────────────────────────────────────────────────────

interface ProgressRevealProps {
  children: ReactNode;
  /**
   * Progress threshold (0-1) within the active section when this element
   * starts revealing. 0.0 = appears as soon as the section becomes active.
   */
  start?: number;
  className?: string;
  /** Forwarded to the wrapper div — useful for gradient text on block elements */
  style?: CSSProperties;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProgressReveal({
  children,
  start = 0,
  className,
  style,
}: ProgressRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionIndex = useSectionIndex();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const entry = register(el, start, sectionIndex);
    return () => unregister(entry);
    // start and sectionIndex are stable for a given element's lifetime;
    // if they change the component will re-render and re-register cleanly.
  }, [start, sectionIndex]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        // Caller style first so transition/willChange below always win.
        ...style,
        // Initial hidden state is set by the manager on register().
        // The CSS transition here drives the smooth reveal animation.
        // cubic-bezier(0.16, 1, 0.3, 1) is a fast-out-extra-slow-in spring-ish curve
        // that feels premium — same easing used throughout the portfolio.
        transition:
          "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        // Hint to the browser to keep this on the compositor layer.
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
