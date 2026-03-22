---
name: Sprite Image Integration
description: Integrated extracted HGSS PNG sprite files into GameCanvas.tsx for buildings, trees, and rocks with fallback to code-drawn versions
type: project
---

Integrated external PNG sprite images from /public/game/sprites/ into the 2D RPG game canvas.

**Building sprites** (EnglishKiwi tileset):
- `ek-house-blue.png` (96x104) → Lab (Research)
- `ek-house-teal.png` (80x100) → Office (Experience)
- `ek-house-red.png` (80x104) → Library (Publications)
- `ek-building-lg.png` (128x100) → Arcade (Projects)
- Sprites are scaled to match each building's tile footprint, with aspect ratio preserved
- Bottom of sprite aligns with bottom of building tile area
- When a sprite is drawn, the code-drawn roof pass is skipped (sprite includes the roof)
- Building signs are always drawn ON TOP of sprites

**Tree sprites** (Lightbulb15):
- `tree-green-1.png`, `tree-green-2.png`, `tree-dark.png`
- Split into canopy (top 70%) and trunk (bottom 30%) offscreen canvases for depth layering
- Tree variant is deterministically selected per tile using `(col * 73 + row * 37) % 3`
- Trees render at 1 tile wide, ~1.8 tiles tall

**Rock sprites**: `ek-rock.png` drawn at 20x20px centered on rock position

**Why:** Replace procedural code-drawn buildings/trees with authentic extracted pixel art sprites for a closer match to HGSS visual style.

**How to apply:** All sprite rendering has a graceful fallback — if a sprite fails to load (onerror resolves the promise), `imgReady()` returns false and the original code-drawn version is used. The mailbox remains code-drawn (no sprite). The character remains code-drawn.
