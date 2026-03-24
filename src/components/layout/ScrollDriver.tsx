"use client";

import {
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// ─── Scroll Driver Context ────────────────────────────────────────────────────
//
// Exposes imperative navigation so Navbar and other consumers can scroll to
// a specific section by index without reaching into the DOM themselves.

interface ScrollDriverContextValue {
  /** Smoothly scrolls the driver div to show the section at the given index. */
  scrollToSection: (index: number) => void;
  /** The currently active section index (floor of the scroll-derived float). */
  activeSection: number;
  /** Total number of sections registered in the driver. */
  totalSections: number;
  /** 0-1 overall progress across all sections (for the scroll progress bar). */
  overallProgress: number;
}

const ScrollDriverContext = createContext<ScrollDriverContextValue>({
  scrollToSection: () => undefined,
  activeSection: 0,
  totalSections: 0,
  overallProgress: 0,
});

export function useScrollDriver() {
  return useContext(ScrollDriverContext);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScrollDriverProps {
  /**
   * Array of section React nodes. Each is rendered stacked at
   * position: absolute; inset: 0 inside the fixed viewport container.
   */
  children: ReactNode[];
  /**
   * Section IDs in order, so the driver can forward them as wrapper IDs
   * that Navbar IntersectionObserver and anchor-link navigation can target.
   * Length must match children.
   */
  sectionIds?: string[];
}

// ─── Timing constants (mirror Style.AI) ──────────────────────────────────────
//
// Entry  — 0.8 s, cubic-bezier(0.16, 1, 0.3, 1)  (spring-like ease-out)
// Exit   — 0.6 s, ease
// Each section occupies 150 vh of artificial scroll space.

const ENTRY_TRANSITION = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
const EXIT_TRANSITION = "opacity 0.6s ease";
const VH_PER_SECTION = 150; // artificial scroll height per section

// ─── ScrollDriver ─────────────────────────────────────────────────────────────

export default function ScrollDriver({ children, sectionIds }: ScrollDriverProps) {
  const totalSections = children.length;

  // The invisible div that provides the scroll surface
  const scrollSurfaceRef = useRef<HTMLDivElement>(null);
  // One ref per section wrapper for imperative opacity control
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Track which section is active for context consumers
  const [activeSection, setActiveSection] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  // Track previous active section for exit transition
  const prevActiveSectionRef = useRef(0);
  // rAF handle
  const rafRef = useRef<number | undefined>(undefined);
  // Reduce repaints — only update DOM when section changes or transition needed
  const lastScrollTop = useRef(0);

  // ── Scroll-to-section helper (exposed via context) ────────────────────────
  const scrollToSection = useCallback((index: number) => {
    const el = scrollSurfaceRef.current;
    if (!el) return;
    // Clamp
    const target = Math.max(0, Math.min(index, totalSections - 1));
    // The midpoint of each section's scroll range gives a clean landing
    const scrollHeight = el.scrollHeight - window.innerHeight;
    const targetScrollTop = (target / totalSections) * scrollHeight;
    el.scrollTo({ top: targetScrollTop, behavior: "smooth" });
  }, [totalSections]);

  // ── Main scroll handler ────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (rafRef.current !== undefined) return; // already scheduled
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = undefined;
      const el = scrollSurfaceRef.current;
      if (!el) return;

      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) return;

      // Normalise to [0, totalSections)
      const sectionFloat = (scrollTop / scrollHeight) * totalSections;
      const newActiveSection = Math.min(
        Math.floor(sectionFloat),
        totalSections - 1
      );
      const rawProgress = scrollTop / scrollHeight; // 0-1 overall

      lastScrollTop.current = scrollTop;

      // Update CSS custom property for ScrollProgress to read
      document.documentElement.style.setProperty(
        "--scroll-driver-progress",
        rawProgress.toFixed(4)
      );

      // Only update section visibility when the active section changes
      if (newActiveSection !== prevActiveSectionRef.current) {
        const prev = prevActiveSectionRef.current;
        prevActiveSectionRef.current = newActiveSection;

        // Apply transitions
        const prevEl = sectionRefs.current[prev];
        const nextEl = sectionRefs.current[newActiveSection];

        if (prevEl) {
          prevEl.style.transition = EXIT_TRANSITION;
          prevEl.style.opacity = "0";
          prevEl.style.pointerEvents = "none";
        }
        if (nextEl) {
          nextEl.style.transition = ENTRY_TRANSITION;
          nextEl.style.opacity = "1";
          nextEl.style.pointerEvents = "auto";
        }

        setActiveSection(newActiveSection);
      }

      setOverallProgress(rawProgress);
    });
  }, [totalSections]);

  // ── Wire up scroll listener on the surface div ────────────────────────────
  useEffect(() => {
    const el = scrollSurfaceRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll, { passive: true });

    // Initialise: show section 0
    const firstEl = sectionRefs.current[0];
    if (firstEl) {
      firstEl.style.transition = "none";
      firstEl.style.opacity = "1";
      firstEl.style.pointerEvents = "auto";
    }
    // All other sections start invisible
    for (let i = 1; i < totalSections; i++) {
      const sEl = sectionRefs.current[i];
      if (sEl) {
        sEl.style.transition = "none";
        sEl.style.opacity = "0";
        sEl.style.pointerEvents = "none";
      }
    }

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, totalSections]);

  // ── Forward wheel events from the fixed overlay to the scroll surface ─────
  //
  // The fixed container sits on top of the scroll surface in z-order; without
  // forwarding, wheel deltas on the fixed layer would not scroll the surface.
  useEffect(() => {
    const fixed = document.getElementById("scroll-driver-fixed");
    const surface = scrollSurfaceRef.current;
    if (!fixed || !surface) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      surface.scrollBy({ top: e.deltaY, behavior: "auto" });
    };

    fixed.addEventListener("wheel", onWheel, { passive: false });
    return () => fixed.removeEventListener("wheel", onWheel);
  }, []);

  // ── Touch forwarding (mobile swipe on fixed layer → scroll surface) ───────
  useEffect(() => {
    const fixed = document.getElementById("scroll-driver-fixed");
    const surface = scrollSurfaceRef.current;
    if (!fixed || !surface) return;

    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const delta = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      surface.scrollBy({ top: delta, behavior: "auto" });
    };

    fixed.addEventListener("touchstart", onTouchStart, { passive: true });
    fixed.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      fixed.removeEventListener("touchstart", onTouchStart);
      fixed.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // ── Context value ──────────────────────────────────────────────────────────
  const contextValue: ScrollDriverContextValue = {
    scrollToSection,
    activeSection,
    totalSections,
    overallProgress,
  };

  return (
    <ScrollDriverContext.Provider value={contextValue}>
      {/*
        ── Invisible scroll surface ──────────────────────────────────────────
        Lives BEHIND the fixed content layer (z-index: 0).
        It is the only element that actually scrolls.
        overflow-y: scroll forces a scrollbar to exist even without content
        overflow; we use artificial height to create scroll space.
      */}
      <div
        ref={scrollSurfaceRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflowY: "scroll",
          // iOS momentum scrolling
          WebkitOverflowScrolling: "touch",
          // Make the element invisible; pointer-events disabled so clicks
          // pass through to the fixed content layer above
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {/*
          The inner div's height is what creates the scroll space.
          totalSections × VH_PER_SECTION gives each section ~1.5 screens
          of scroll travel — enough for intentional pacing without fatigue.
          We add 100vh so the last section can fully "settle" at the bottom.
        */}
        <div style={{ height: `${totalSections * VH_PER_SECTION + 100}vh` }} />
      </div>

      {/*
        ── Fixed viewport container ──────────────────────────────────────────
        Covers the entire viewport. Sections are stacked inside it via
        position: absolute; inset: 0. The active section is opacity: 1;
        all others are opacity: 0.

        id="scroll-driver-fixed" lets the wheel/touch handlers find this
        element to forward events to the scroll surface.
      */}
      <div
        id="scroll-driver-fixed"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
        }}
      >
        {children.map((child, index) => {
          const sectionId = sectionIds?.[index];
          return (
            <div
              key={index}
              id={sectionId ? `scroll-driver-wrapper-${sectionId}` : undefined}
              ref={(el) => { sectionRefs.current[index] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100vh",
                // Opacity and pointer-events are set imperatively in handleScroll
                // and during init — no inline defaults needed here (set in useEffect)
                opacity: 0,
                pointerEvents: "none",
                // Promote to GPU compositor layer for smooth cross-fades
                willChange: "opacity",
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </ScrollDriverContext.Provider>
  );
}
