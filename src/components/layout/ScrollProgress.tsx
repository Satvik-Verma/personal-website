"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

/*
  ScrollProgress
  ==============
  Reads scroll progress from the CSS custom property `--scroll-driver-progress`
  that ScrollDriver sets on :root on every scroll event.

  We poll via requestAnimationFrame rather than listening to a scroll event
  on the body (which no longer scrolls under the ScrollDriver architecture).

  The raw value is spring-smoothed for silky motion before driving scaleX.
*/

export default function ScrollProgress() {
  const rawProgress = useMotionValue(0);

  const scaleX = useSpring(rawProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let lastValue = 0;

    const tick = () => {
      const style = getComputedStyle(document.documentElement);
      const val = parseFloat(
        style.getPropertyValue("--scroll-driver-progress") || "0"
      );
      if (val !== lastValue) {
        lastValue = val;
        rawProgress.set(val);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [rawProgress]);

  return (
    <>
      {/*
        LIQUID GLASS TRACK
        A barely-visible frosted glass trough that the progress bar
        slides along. Makes the bar feel embedded in a real surface.
      */}
      <div
        className="progress-track fixed top-0 left-0 right-0 z-[99] h-[3px]"
        aria-hidden="true"
      />

      {/*
        GLOW PROGRESS BAR
        The bar itself uses a gradient and has a bloom/glow effect via
        box-shadow. The glow color shifts from blue to purple to pink
        matching the gradient direction.
      */}
      <motion.div
        className="progress-bar-glow fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left"
        style={{
          scaleX,
          background:
            "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
          boxShadow: [
            "0 0 6px rgba(139,92,246,0.8)",
            "0 0 16px rgba(59,130,246,0.5)",
            "0 0 32px rgba(59,130,246,0.25)",
            "0 1px 0 rgba(255,255,255,0.1)",
          ].join(", "),
        }}
      />
    </>
  );
}
