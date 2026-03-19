"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { identity } from "@/data/profile";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setVisible(y > window.innerHeight * 0.8);
          setScrolled(y > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
      }
    },
    []
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
            It does NOT span the full width at desktop — it's centered and
            contained like a macOS toolbar. On mobile it goes full-width.
          */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav
              className={cn(
                "liquid-glass h-12 px-4 flex items-center justify-between",
                "transition-all duration-500",
                // When scrolled deeper, slightly increase opacity
                scrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.5)]" : ""
              )}
              style={{
                // Strengthen the glass feel when scrolled
                background: scrolled
                  ? "rgba(10,10,15,0.7)"
                  : "rgba(255,255,255,0.04)",
              }}
            >
              {/* Logo / Name */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
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
                  const isActive = activeSection === link.href.replace("#", "");
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
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                    mobileOpen ? "rotate-45 translate-y-[6.5px] bg-[#fafafa]" : "bg-[#a1a1aa]"
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] w-5 rounded transition-all duration-300",
                    mobileOpen ? "opacity-0 scale-x-0 bg-[#fafafa]" : "bg-[#a1a1aa]"
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] w-5 rounded transition-all duration-300 origin-center",
                    mobileOpen ? "-rotate-45 -translate-y-[6.5px] bg-[#fafafa]" : "bg-[#a1a1aa]"
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
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
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
                        activeSection === link.href.replace("#", "")
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
