"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

const directionOffset = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export default function FadeInOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  distance,
}: FadeInOnScrollProps) {
  const offset = directionOffset[direction];
  const d = distance ?? Math.abs(offset.y || offset.x);

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: offset.y ? (offset.y > 0 ? d : -d) : 0,
        x: offset.x ? (offset.x > 0 ? d : -d) : 0,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
