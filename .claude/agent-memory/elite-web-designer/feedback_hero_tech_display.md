---
name: Hero tech stack display — rejected patterns
description: What the user has rejected for displaying the tech stack in the hero section, and what was ultimately chosen
type: feedback
---

Do not use floating pills that bob up and down, and do not use horizontal scrolling marquee/ticker strips for the hero tech stack display. Both were tried and explicitly rejected.

**Why:** Floating pills were described as "laggy and ugly." The horizontal marquee (dual-row counter-scrolling ticker) was the replacement attempt — the user hated it even more than the floating pills.

**How to apply:** If the hero tech display ever needs revisiting, do not reintroduce either of these patterns. The current solution is the `TechOrbit` component (two concentric CSS-animated orbit rings with glassmorphic chips). Any replacement should be at least as spatially interesting and must be GPU-composited (no JS animation loops).
