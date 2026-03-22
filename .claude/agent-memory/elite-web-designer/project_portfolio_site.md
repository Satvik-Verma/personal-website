---
name: Satvik Verma Personal Website — Project Context
description: Tech stack, design system, component architecture, and build status for satvikverma personal portfolio
type: project
---

This is a premium Apple-inspired dark-mode portfolio site for Satvik Verma, a founding engineer based in San Francisco.

**Tech Stack:** Next.js 16.2 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion 12, @react-three/fiber + @react-three/rapier + @react-three/drei (Three.js 0.183), Geist font.

**Build command:** `node node_modules/next/dist/bin/next build` (npm run build broken due to .bin/next path issue with Node v23; direct node path works fine).

**Design System:**
- Background: `#0a0a0a`, Surface: `#141414`, Surface-hover: `#1a1a1a`
- Border: `#262626`, Text primary: `#fafafa`, Text secondary: `#a1a1aa`
- Accent: `#3b82f6` (blue), Accent hover: `#60a5fa`
- Font: Geist Sans / Geist Mono (loaded as CSS variables)
- Sections: `py-24 md:py-32`, content `max-w-6xl mx-auto px-6`
- Cards: `rounded-2xl border border-[#262626] bg-[#141414]`
- Hover glow pattern: radial-gradient rgba(59,130,246,0.06) top-left

**Component Architecture (all built):**
- `src/components/layout/` — Navbar.tsx, Footer.tsx, ScrollProgress.tsx
- `src/components/ui/` — Badge.tsx, SectionHeading.tsx, StatCard.tsx
- `src/components/animation/` — FadeInOnScroll.tsx, StaggerChildren.tsx, TextReveal.tsx (pre-built)
- `src/components/sections/` — HeroSection.tsx, AboutSection.tsx, ExperienceSection.tsx, ProjectsSection.tsx, PublicationsSection.tsx, ContactSection.tsx
- `src/components/three/` — HeroCanvas.tsx, SkillBall.tsx, SkillBallCluster.tsx, MouseAttractor.tsx, HeroFallback.tsx
- `src/app/page.tsx` — Main page composing all sections

**Hero Tech Stack Display (updated March 2026):** Replaced `TechMarquee` (dual-row scrolling ticker — user hated it) with a `TechOrbit` component — two concentric rings of glassmorphic skill chips that orbit a central point using pure CSS `transform: rotate()` on the GPU compositor. Outer ring (8 chips, 190px radius) rotates clockwise at 80s; inner ring (6 chips, 130px radius) rotates counter-clockwise at 55s. Each chip sits in a 3-layer DOM stack: (1) static `translate` for positioning, (2) CSS counter-rotation animation to keep text upright, (3) Framer Motion `whileHover` spring for scale feedback. Hover over the whole assembly pauses both rings via `.orbit-assembly:hover` CSS selector. Domain colors: blue=languages, green=backend, purple=AI/ML, teal=real-time, amber=Azure, pink=React Native. Faint ring track lines + central pulsing blue dot. Mobile fallback: compact `MobileTechList` flex-wrap of glass pills (hidden on md+). CSS keyframes in globals.css: `orbit-cw`, `orbit-ccw`, `chip-upright-cw`, `chip-upright-ccw`. Utility classes: `.orbit-ring-outer`, `.orbit-ring-inner`, `.orbit-chip-outer`, `.orbit-chip-inner`.

**3D Hero (updated March 2026):** Replaced physics skill balls with a `FloatingKeyboard` — a 3D mechanical keyboard using RoundedBox + Text from drei. 14 colorful keycaps (MeshPhysicalMaterial, clearcoat:1.0) arranged 4×4 grid on a metallic dark base (MeshStandardMaterial). Floats with sinusoidal Y animation, gentle oscillating pitch/yaw, mouse-reactive parallax tilt (±8° via state.pointer with 0.06 lerp damping). Keyboard tilted -22° pitch / +16° yaw for 3/4 product-render perspective. LED strip accent on front edge. Positioned at [1.6, 0, 0] in scene so it clears the left text panel. HeroFallback for mobile (CSS float animations). Dynamic import with ssr:false for HeroCanvas. Old files (SkillBall.tsx, SkillBallCluster.tsx) deleted.

**Design Upgrade — Liquid Glass / Glassmorphism / Skeuomorphism (March 2026):**
- globals.css now contains `.liquid-glass`, `.glass-card`, `.skeu-card`, `.skeu-button`, `.glass-pill`, `.award-card`, `.contact-glass-card`, `.footer-glass`, `.easter-egg-glass` utility classes
- Body background has a subtle gradient mesh (blue/purple radial gradients baked in) + noise texture overlay via `body::after`
- Four fixed gradient orbs in page.tsx (blue, purple, teal, pink) drift with CSS keyframe animations; they sit at z-0 and make glass effects pop
- Navbar is a floating liquid-glass pill (not full-width), centered within max-w-6xl
- HeroSection: text sits on a frosted liquid-glass panel with prismatic border; name uses `heading-gradient` class; CTAs are skeu-button + glass-pill
- HeroCanvas: 5-point light rig (ambient + 4 point lights) + ACESFilmic tone mapping; environment preset "studio"
- SkillBall: MeshPhysicalMaterial with clearcoat:1.0, clearcoatRoughness:0.08, metalness:0.35, roughness:0.18
- HeroFallback: glassmorphism frosted-glass skill badges
- AboutSection, ExperienceSection, PublicationsSection, ContactSection, ProjectsSection: all "use client" (needed for onMouseEnter handlers)
- SectionHeading: heading-gradient text + accent-bar-glow underline bar
- Badge: glass-pill style (translucent, blur, per-variant tint)
- StatCard: glassmorphism with stat-number-glow on hover
- ScrollProgress: 3px bar with glow/bloom shadow, glass track layer
- Footer: footer-glass, social icons as glass squares, easter-egg as easter-egg-glass
- TypeScript note: `WebkitBackdropFilter` on CSSStyleDeclaration requires cast `(el.style as unknown as Record<string, string>).WebkitBackdropFilter`

**Why:** Premium design upgrade — Apple iOS 26-inspired liquid glass + glassmorphism + skeuomorphism across all 17 components.

**How to apply:** When modifying components, maintain the established color tokens and hover-glow pattern. The rapier Physics component uses `gravity={[0, -0.5, 0]}` for gentle float. Navbar appears only after scrolling past 80% of viewport height. All section components must be "use client" if they contain event handlers.
