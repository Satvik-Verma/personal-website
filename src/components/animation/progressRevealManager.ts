/**
 * progressRevealManager — singleton rAF loop for ProgressReveal elements.
 *
 * Instead of spinning up one requestAnimationFrame per ProgressReveal instance
 * (which can be 50+ on a content-heavy page), we maintain a single global loop
 * that checks every registered element on each frame.
 *
 * Design constraints:
 *  - Zero React re-renders. All state is imperative DOM style manipulation.
 *  - GPU-compositor-only properties: opacity and transform (translateY).
 *    No layout-triggering props like top/left/width/height.
 *  - CSS transition handles the smooth animation; JS only sets the target state.
 *  - respects prefers-reduced-motion: transitions are skipped instantly.
 */

import { sectionProgressRef, activeSectionRef } from "@/components/layout/ScrollDriver";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RevealEntry {
  el: HTMLElement;
  /** 0-1 progress threshold within the active section at which this element reveals */
  start: number;
  /** Which section index this element lives in */
  sectionIndex: number;
  /** Cached revealed state to avoid redundant style writes */
  revealed: boolean;
}

// ─── Module-level state ──────────────────────────────────────────────────────

const entries: Set<RevealEntry> = new Set();
let rafHandle: number | null = null;

// Detect prefers-reduced-motion once at module load.
// If true, elements snap to their final state instantly with no transition.
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── rAF loop ────────────────────────────────────────────────────────────────

function tick() {
  const progress = sectionProgressRef.current;
  const activeSection = activeSectionRef.current;

  for (const entry of entries) {
    // Only reveal when this element's section is the currently active one.
    // This prevents elements in off-screen sections from firing.
    const shouldReveal =
      entry.sectionIndex === activeSection && progress >= entry.start;

    if (shouldReveal === entry.revealed) continue; // no change — skip style write

    entry.revealed = shouldReveal;

    if (shouldReveal) {
      entry.el.style.opacity = "1";
      entry.el.style.transform = "translateY(0px)";
    } else {
      entry.el.style.opacity = "0";
      entry.el.style.transform = "translateY(24px)";
    }
  }

  rafHandle = requestAnimationFrame(tick);
}

function startLoop() {
  if (rafHandle !== null) return;
  rafHandle = requestAnimationFrame(tick);
}

function stopLoop() {
  if (rafHandle !== null) {
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Register a DOM element for scroll-progress-driven reveal.
 * Returns the entry so the caller can pass it to `unregister()` on unmount.
 */
export function register(
  el: HTMLElement,
  start: number,
  sectionIndex: number
): RevealEntry {
  // Apply initial hidden state immediately (before first rAF tick).
  if (prefersReducedMotion) {
    // Reduced-motion: skip the transition entirely; reveal at once.
    el.style.opacity = "1";
    el.style.transform = "translateY(0px)";
  } else {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    // The CSS transition class is applied in ProgressReveal — we do not
    // touch it here so we don't fight with the component's className.
  }

  const entry: RevealEntry = { el, start, sectionIndex, revealed: false };
  entries.add(entry);
  startLoop();
  return entry;
}

/**
 * Unregister an entry when its component unmounts.
 * If no entries remain the rAF loop is stopped to save resources.
 */
export function unregister(entry: RevealEntry) {
  entries.delete(entry);
  if (entries.size === 0) stopLoop();
}
