"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import StaggerChildren, { StaggerItem } from "@/components/animation/StaggerChildren";
import { projects } from "@/data/profile";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const categoryConfig = {
  product:  { label: "Product",  color: "#3b82f6", glow: "rgba(59,130,246,0.15)"  },
  research: { label: "Research", color: "#8b5cf6", glow: "rgba(139,92,246,0.15)"  },
  personal: { label: "Personal", color: "#10b981", glow: "rgba(16,185,129,0.15)"  },
};

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V12.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2M3 10.5l5-5m0 0h3.5M8 5.5V2" />
    </svg>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const cat = categoryConfig[project.category];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden flex flex-col cursor-default",
        featured ? "p-7 md:p-8" : "p-5 md:p-6"
      )}
      style={{
        // GLASSMORPHISM — intensifies on hover
        background: "rgba(16,16,24,0.6)",
        backdropFilter: hovered ? "blur(24px) saturate(200%)" : "blur(16px) saturate(180%)",
        WebkitBackdropFilter: hovered ? "blur(24px) saturate(200%)" : "blur(16px) saturate(180%)",
        border: hovered
          ? `1px solid ${cat.color}25`
          : "1px solid rgba(255,255,255,0.07)",
        borderTop: hovered
          ? `1px solid ${cat.color}45`
          : "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        boxShadow: hovered
          ? [
              `0 20px 60px rgba(0,0,0,0.55)`,
              `0 8px 24px rgba(0,0,0,0.45)`,
              `0 0 40px ${cat.glow}`,
              `inset 0 1px 0 rgba(255,255,255,0.12)`,
            ].join(", ")
          : [
              "0 8px 32px rgba(0,0,0,0.45)",
              "0 2px 8px rgba(0,0,0,0.3)",
              "inset 0 1px 0 rgba(255,255,255,0.08)",
            ].join(", "),
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/*
        Accent color glow that bleeds up through the glass on hover.
        Each project category gets its own color tint.
      */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${cat.glow}, transparent 65%)`,
          borderRadius: "20px",
        }}
      />

      {/* Category badge — glass pill */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: `${cat.color}12`,
            border: `1px solid ${cat.color}28`,
            borderTop: `1px solid ${cat.color}45`,
            color: cat.color,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 12px ${cat.color}10`,
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{
              background: cat.color,
              boxShadow: `0 0 4px ${cat.color}`,
            }}
          />
          {cat.label}
        </span>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title}`}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg"
            style={{
              color: "#a1a1aa",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fafafa";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#a1a1aa";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            }}
          >
            <ExternalLinkIcon />
          </a>
        )}
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-bold tracking-tight leading-tight",
          featured ? "text-xl md:text-2xl" : "text-base md:text-lg"
        )}
        style={{ color: "#fafafa" }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "mt-2 leading-relaxed flex-grow",
          featured ? "text-sm md:text-base" : "text-sm"
        )}
        style={{ color: "#a1a1aa" }}
      >
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="py-24 md:py-32 relative"
    >
      <div className="section-divider" />

      <div className="max-w-6xl mx-auto px-6 pt-1">
        <SectionHeading
          title="Projects"
          subtitle="Things I've built — from idea to production."
        />

        {/* Featured: 2-column bento */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5" delay={0.1}>
          {featuredProjects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} featured />
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Other projects: responsive grid */}
        <StaggerChildren
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          delay={0.2}
          stagger={0.07}
        >
          {otherProjects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
