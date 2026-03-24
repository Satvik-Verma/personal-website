"use client";

/*
  FooterDriver
  ============
  Under the ScrollDriver architecture, the body does not scroll and all
  sections are position: fixed. This thin wrapper makes the Footer visible
  only when the last section (ContactSection, index 10) is the active section.

  It renders the Footer as a fixed element at the bottom of the viewport,
  overlaid on top of the contact section. The footer fades in/out matching
  the contact section's own entry/exit transitions.
*/

import { useScrollDriver } from "@/components/layout/ScrollDriver";
import Footer from "@/components/layout/Footer";

/** The index of ContactSection inside ScrollDriver's children array. */
const CONTACT_SECTION_INDEX = 10;

export default function FooterDriver() {
  const { activeSection, totalSections } = useScrollDriver();

  // Show footer only on the last section
  const isVisible = activeSection === CONTACT_SECTION_INDEX ||
    (totalSections > 0 && activeSection === totalSections - 1);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Footer />
    </div>
  );
}
