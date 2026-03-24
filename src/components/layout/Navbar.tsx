"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { identity } from "@/data/profile";
import { useScrollDriver } from "@/components/layout/ScrollDriver";

/*
  Navbar
  ======
  Fixed nav bar that slides in once the user has scrolled past the hero.

  Under the ScrollDriver architecture, `window.scrollY` is always 0 —
  the body never scrolls. We read scroll progress from the ScrollDriver
  context instead.

  Nav link clicks call `scrollToSection(index)` on the ScrollDriver so the
  invisible scroll surface jumps to the right position.

  Active section detection uses the ScrollDriver's `activeSection` index
  mapped back to NAV_LINKS via the SECTION_IDS_IN_ORDER array.
*/

// ─── Section order as rendered in page.tsx ────────────────────────────────────
//
// This must mirror the order of children passed to ScrollDriver in page.tsx.
// Index 0 = HeroSection, 1 = AboutShowcase, etc.

const SECTION_IDS_IN_ORDER = [
  "hero",         // 0  HeroSection
  "about",        // 1  AboutShowcase
  "experience",   // 2  StealthShowcase
  "xuman",        // 3  XumanShowcase
  "styleai",      // 4  StyleAIShowcase
  "research",     // 5  ResearchShowcase
  "fusionml",     // 6  FusionMLShowcase
  "iot",          // 7  IoTShowcase
  "personal",     // 8  PersonalProjectsShowcase
  "publications", // 9  PublicationsShowcase
  "contact",      // 10 ContactSection
] as const;

export default function Navbar() {
  const { activeSection, overallProgress, scrollToSection, totalSections } =
    useScrollDriver();

  // Show nav once user has scrolled past the hero (progress > 1/totalSections)
  const heroFraction = totalSections > 0 ? 1 / totalSections : 0.1;
  const visible = overallProgress > heroFraction * 0.8;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // "Scrolled" feel (stronger glass background) once we're past the hero
  useEffect(() => {
    setScrolled(overallProgress > heroFraction * 0.5);
  }, [overallProgress, heroFraction]);

  // The ID of the currently active section
  const activeSectionId = SECTION_IDS_IN_ORDER[activeSection] ?? "";

  // ── Nav link click handler ─────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const idx = SECTION_IDS_IN_ORDER.indexOf(
        targetId as (typeof SECTION_IDS_IN_ORDER)[number]
      );
      if (idx !== -1) {
        scrollToSection(idx);
      }
      setMobileOpen(false);
    },
    [scrollToSection]
  );

  // ── Logo click — scroll back to section 0 (Hero) ──────────────────────────
  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollToSection(0);
    },
    [scrollToSection]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{ paddingTop: "8px" }}
        >
          {/*
            The nav bar itself is a liquid-glass floating panel.
            Centered at desktop, full-width on mobile.
          */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav
              className={cn(
                "liquid-glass h-12 px-4 flex items-center justify-between",
                "transition-all duration-500",
                scrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.5)]" : ""
              )}
              style={{
                background: scrolled
                  ? "rgba(10,10,15,0.7)"
                  : "rgba(255,255,255,0.04)",
              }}
            >
              {/* Logo / Name */}
              <a
                href="#"
                onClick={handleLogoClick}
                className="text-sm font-semibold tracking-tight transition-colors duration-200"
                style={{ color: "#fafafa" }}
              >
                {identity.name.split(" ")[0]}{" "}
                <span style={{ color: "#3b82f6" }}>
                  {identity.name.split(" ")[1]}
                </span>
              </a>

              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-0.5">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    activeSectionId === link.href.replace("#", "");
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={cn(
                        "relative px-3 py-1.5 text-sm font-medium rounded-xl transition-all duration-200",
                        isActive
                          ? "text-[#fafafa]"
                          : "text-[#a1a1aa] hover:text-[#fafafa]"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-xl glass-pill"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </a>
                  );
                })}
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex flex-col gap-[5px] p-2 group"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <span
                  className={cn(
                    "block h-[1.5px] w-5 rounded transition-all duration-300 origin-center",
                    mobileOpen
                      ? "rotate-45 translate-y-[6.5px] bg-[#fafafa]"
                      : "bg-[#a1a1aa]"
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] w-5 rounded transition-all duration-300",
                    mobileOpen
                      ? "opacity-0 scale-x-0 bg-[#fafafa]"
                      : "bg-[#a1a1aa]"
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] w-5 rounded transition-all duration-300 origin-center",
                    mobileOpen
                      ? "-rotate-45 -translate-y-[6.5px] bg-[#fafafa]"
                      : "bg-[#a1a1aa]"
                  )}
                />
              </button>
            </nav>
          </div>

          {/* Mobile Slide-in Panel — also liquid glass */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden overflow-hidden mx-4 mt-1 rounded-2xl"
                style={{
                  background: "rgba(8,8,12,0.92)",
                  backdropFilter: "blur(40px) saturate(160%)",
                  WebkitBackdropFilter: "blur(40px) saturate(160%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                  boxShadow:
                    "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <nav className="px-4 py-3 flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.05,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={cn(
                        "px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                        activeSectionId === link.href.replace("#", "")
                          ? "bg-[rgba(59,130,246,0.15)] text-[#3b82f6] border border-[rgba(59,130,246,0.25)]"
                          : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[rgba(255,255,255,0.05)]"
                      )}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
