import Navbar from "@/components/layout/Navbar";
import FooterDriver from "@/components/layout/FooterDriver";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ScrollDriver from "@/components/layout/ScrollDriver";
import HeroSection from "@/components/sections/HeroSection";
import AboutShowcase from "@/components/sections/AboutShowcase";
import StealthShowcase from "@/components/sections/StealthShowcase";
import XumanShowcase from "@/components/sections/XumanShowcase";
import StyleAIShowcase from "@/components/sections/StyleAIShowcase";
import ResearchShowcase from "@/components/sections/ResearchShowcase";
import FusionMLShowcase from "@/components/sections/FusionMLShowcase";
import IoTShowcase from "@/components/sections/IoTShowcase";
import PersonalProjectsShowcase from "@/components/sections/PersonalProjectsShowcase";
import PublicationsShowcase from "@/components/sections/PublicationsShowcase";
import ContactSection from "@/components/sections/ContactSection";

// ─── Scroll Driver architecture ───────────────────────────────────────────────
//
// All sections are stacked at position: absolute; inset: 0 inside a
// position: fixed; inset: 0 container managed by ScrollDriver.
//
// An invisible div behind the fixed container is the ONLY element that
// physically scrolls — its scroll position is mapped to an active section
// index and cross-fade transitions are applied to section wrappers.
//
// html and body are both overflow: hidden (see globals.css) so the browser
// never scrolls them. Wheel and touch events on the fixed layer are forwarded
// to the invisible scroll surface.
//
// sectionIds must match the order of children passed to ScrollDriver, and must
// also match SECTION_IDS_IN_ORDER in Navbar.tsx.

const SECTION_IDS = [
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
];

export default function Home() {
  return (
    <>
      {/* Fixed scroll progress bar at the very top of viewport (z-index 100) */}
      <ScrollProgress />

      {/*
        Navbar sits above the scroll driver (z-index 50). It reads scroll
        progress and active section from ScrollDriverContext and calls
        scrollToSection() for nav link navigation.
      */}
      <Navbar />

      {/*
        ============================================================
        SCROLL DRIVER — fixed viewport cross-fade scroll system
        Each child section occupies 100vh inside the fixed container.
        The ScrollDriver maps scroll position → active section → opacity.
        ============================================================
      */}
      <ScrollDriver sectionIds={SECTION_IDS}>
        <HeroSection />
        <AboutShowcase />
        <StealthShowcase />
        <XumanShowcase />
        <StyleAIShowcase />
        <ResearchShowcase />
        <FusionMLShowcase />
        <IoTShowcase />
        <PersonalProjectsShowcase />
        <PublicationsShowcase />
        <ContactSection />
      </ScrollDriver>

      {/*
        FooterDriver reads ScrollDriverContext and shows the Footer only
        when ContactSection (index 10) is the active section. It renders
        as position: fixed; bottom: 0 so it overlays the contact section.
      */}
      <FooterDriver />
    </>
  );
}
