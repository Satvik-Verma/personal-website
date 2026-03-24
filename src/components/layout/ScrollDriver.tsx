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

interface ScrollDriverContextValue {
  scrollToSection: (index: number) => void;
  activeSection: number;
  totalSections: number;
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

// ─── Section Progress Refs ───────────────────────────────────────────────────
// These refs are module-level singletons. ProgressReveal reads them imperatively
// without triggering React re-renders on every scroll frame.

export const sectionProgressRef: { current: number } = { current: 0 };
export const activeSectionRef: { current: number } = { current: 0 };

/** Returns the module-level refs for imperative rAF-based reading. */
export function useScrollDriverProgressRef() {
  return { sectionProgressRef, activeSectionRef };
}

// ─── Section Index Context ───────────────────────────────────────────────────
// Each section wrapper in ScrollDriver sets this context to its index.
// ProgressReveal reads it to know which section it lives in, so it only
// reveals when that section is the active one.

export const SectionIndexContext = createContext<number>(0);

export function useSectionIndex() {
  return useContext(SectionIndexContext);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScrollDriverProps {
  children: ReactNode[];
  sectionIds?: string[];
}

const ENTRY_TRANSITION = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s 0s";
const EXIT_TRANSITION = "opacity 0.6s ease, visibility 0s 0.6s";
const VH_PER_SECTION = 150;

// ─── ScrollDriver ─────────────────────────────────────────────────────────────

export default function ScrollDriver({ children, sectionIds }: ScrollDriverProps) {
  const totalSections = children.length;
  const scrollSurfaceRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const prevActiveSectionRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  const scrollToSection = useCallback((index: number) => {
    const el = scrollSurfaceRef.current;
    if (!el) return;
    const target = Math.max(0, Math.min(index, totalSections - 1));
    const scrollHeight = el.scrollHeight - window.innerHeight;
    const targetScrollTop = (target / totalSections) * scrollHeight;
    el.scrollTo({ top: targetScrollTop, behavior: "smooth" });
  }, [totalSections]);

  // Helper: set section visibility. Only the active section is fully rendered.
  // Adjacent sections get visibility:hidden (hidden but in DOM for fast swap).
  // All others get visibility:hidden + no will-change (fully skipped by browser).
  const applySectionState = useCallback((index: number, state: "active" | "entering" | "exiting" | "hidden") => {
    const el = sectionRefs.current[index];
    if (!el) return;
    switch (state) {
      case "active":
        el.style.transition = "none";
        el.style.opacity = "1";
        el.style.visibility = "visible";
        el.style.pointerEvents = "auto";
        break;
      case "entering":
        el.style.visibility = "visible";
        el.style.transition = ENTRY_TRANSITION;
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        break;
      case "exiting":
        el.style.transition = EXIT_TRANSITION;
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        // visibility goes hidden after the 0.6s opacity transition
        break;
      case "hidden":
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
        break;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== undefined) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = undefined;
      const el = scrollSurfaceRef.current;
      if (!el) return;

      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) return;

      const sectionFloat = (scrollTop / scrollHeight) * totalSections;
      const newActive = Math.min(Math.floor(sectionFloat), totalSections - 1);
      const rawProgress = scrollTop / scrollHeight;

      // Compute 0-1 progress within the active section.
      // The active section occupies a 1/totalSections slice of the scroll range.
      // We remap the first 80% of that slice to 0→1 so elements reveal well
      // before the cross-fade to the next section begins.
      const progressInSection = sectionFloat - newActive;
      const remapped = Math.min(progressInSection / 0.8, 1.0);

      // Write to module-level refs — no React re-renders on scroll frames.
      sectionProgressRef.current = remapped;
      activeSectionRef.current = newActive;

      document.documentElement.style.setProperty(
        "--scroll-driver-progress",
        rawProgress.toFixed(4)
      );

      if (newActive !== prevActiveSectionRef.current) {
        const prev = prevActiveSectionRef.current;
        prevActiveSectionRef.current = newActive;

        // Exit the old section
        applySectionState(prev, "exiting");
        // Enter the new section
        applySectionState(newActive, "entering");

        // Pre-show adjacent sections (visibility hidden but ready)
        // Hide all others completely
        for (let i = 0; i < totalSections; i++) {
          if (i === newActive || i === prev) continue;
          applySectionState(i, "hidden");
        }

        setActiveSection(newActive);
      }

      setOverallProgress(rawProgress);
    });
  }, [totalSections, applySectionState]);

  // Init
  useEffect(() => {
    const el = scrollSurfaceRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll, { passive: true });

    // Show section 0, hide all others
    applySectionState(0, "active");
    for (let i = 1; i < totalSections; i++) {
      applySectionState(i, "hidden");
    }

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, totalSections, applySectionState]);

  // Wheel forwarding
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

  // Touch forwarding
  useEffect(() => {
    const fixed = document.getElementById("scroll-driver-fixed");
    const surface = scrollSurfaceRef.current;
    if (!fixed || !surface) return;

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
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

  const contextValue: ScrollDriverContextValue = {
    scrollToSection,
    activeSection,
    totalSections,
    overallProgress,
  };

  return (
    <ScrollDriverContext.Provider value={contextValue}>
      {/* Invisible scroll surface */}
      <div
        ref={scrollSurfaceRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div style={{ height: `${totalSections * VH_PER_SECTION + 100}vh` }} />
      </div>

      {/* Fixed viewport container */}
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
            <SectionIndexContext.Provider key={index} value={index}>
              <div
                id={sectionId ? `scroll-driver-wrapper-${sectionId}` : undefined}
                ref={(el) => { sectionRefs.current[index] = el; }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100vh",
                  opacity: 0,
                  visibility: "hidden",
                  pointerEvents: "none",
                  contain: "layout style paint",
                }}
              >
                {child}
              </div>
            </SectionIndexContext.Provider>
          );
        })}
      </div>
    </ScrollDriverContext.Provider>
  );
}
