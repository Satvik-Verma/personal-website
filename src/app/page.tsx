import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import PublicationsSection from "@/components/sections/PublicationsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      {/* Fixed scroll progress bar at the very top of viewport */}
      <ScrollProgress />

      {/* Sticky nav — slides in after user scrolls past hero */}
      <Navbar />

      {/*
        ============================================================
        GLOBAL GRADIENT ORBS
        Fixed, large, blurred color pools that drift slowly.
        They sit below all content (z-0) and make glass effects
        pop by giving the blur something saturated to blend.
        ============================================================
      */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        {/* Blue orb — top-left anchor */}
        <div
          style={{
            position: "fixed",
            top: "-10vh",
            left: "-10vw",
            width: "70vw",
            height: "70vw",
            maxWidth: "900px",
            maxHeight: "900px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(59,130,246,0.14) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "orb-drift-1 28s ease-in-out infinite",
            zIndex: 0,
          }}
        />

        {/* Purple orb — bottom-right anchor */}
        <div
          style={{
            position: "fixed",
            bottom: "-15vh",
            right: "-10vw",
            width: "65vw",
            height: "65vw",
            maxWidth: "800px",
            maxHeight: "800px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(139,92,246,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "orb-drift-2 34s ease-in-out infinite",
            zIndex: 0,
          }}
        />

        {/* Emerald orb — mid-right */}
        <div
          style={{
            position: "fixed",
            top: "40vh",
            right: "5vw",
            width: "40vw",
            height: "40vw",
            maxWidth: "500px",
            maxHeight: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(16,185,129,0.07) 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "orb-drift-3 22s ease-in-out infinite 4s",
            zIndex: 0,
          }}
        />

        {/* Pink accent orb — mid-left, subtle */}
        <div
          style={{
            position: "fixed",
            top: "60vh",
            left: "5vw",
            width: "35vw",
            height: "35vw",
            maxWidth: "400px",
            maxHeight: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(236,72,153,0.06) 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "orb-drift-1 40s ease-in-out infinite 8s",
            zIndex: 0,
          }}
        />
      </div>

      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <PublicationsSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
