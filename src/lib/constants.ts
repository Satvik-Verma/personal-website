export const ANIMATION = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeIn: [0.4, 0, 0.2, 1] as const,
  spring: { type: "spring" as const, stiffness: 300, damping: 20 },
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
  },
  stagger: 0.08,
};

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Contact", href: "#contact" },
] as const;
