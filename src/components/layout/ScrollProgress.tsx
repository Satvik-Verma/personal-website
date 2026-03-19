"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  // Spring-smoothed scroll value for silky motion
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

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
          // Bloom effect — the bar glows outward
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
