---
name: HGSS Visual Upgrade for Portfolio Game
description: Complete rewrite of GameCanvas.tsx to match Pokemon HeartGold/SoulSilver visual quality — expanded world, detailed buildings, pond, hedges, benches, richer sprites, oblique 3D projection. Now with spritesheet integration from two HGSS tilesets.
type: project
---

Completed a full visual upgrade of the portfolio game at /game route (GameCanvas.tsx) to match HGSS quality.

**Key changes made (2026-03-19):**
- World expanded from 30x22 to 38x27 tiles, then further to 50x35 tiles (1600x1120px) to fill common viewports
- Pond/water tiles removed (replaced with grass, trees, flowers) — they were just solid blue blocks
- Camera scaling changed from Math.min (fit) to Math.max (fill) so world always fills viewport with no dark borders
- HGSS color palette: grass #78c850/#60a840/#4e9030, path #d8c090/#c0a870, water #70b0e0/#5898c8/#4880b0
- Buildings now have: shutters, flower boxes, chimneys, multi-layer roofs with shingle texture, door arches, stone foundations, brick/mortar detail
- Trees replaced with pixel-perfect HGSS-style sprite (32x48 pixel array, 10-color palette) rendered via offscreen canvas caching — no more circle/gradient approach. Sprite is split at row 40 for trunk-under-character / canopy-over-character two-pass rendering
- Character sprite: red cap with emblem, backpack (visible from side/back), belt with buckle, shoe soles, pant creases, cheek shadows
- Grass blades draw with 3 shades (dark base, mid stroke, light tip), dithered ground texture
- Path tiles have dithered grass-to-dirt transitions at edges
- Added benches (8 locations), hedge border tiles, animated water with wave/shimmer
- Dialogue box has HGSS-style diamond corner decorations, rounded name tag
- Arcade building at tileX:3 (shifted from 2)
- Spawn point at tile (23, 17) — centered for the 50x35 map
- Upper main path at row 7, lower main path at row 15, both extended to col 48
- Vertical path connections at cols 2, 9, 17, 27, 37

**Oblique 3D projection upgrade (2026-03-19):**
- Buildings now use HGSS-style "3/4 view" oblique projection for 3D illusion
- SIDE_DEPTH=14, SIDE_WIDTH=16 constants control the oblique offset
- drawBuildingBase: front wall + visible right side wall (parallelogram in shadow) + 3D foundation + side window on large buildings + 3D chimney with front/side/top faces
- drawBuildingRoof: front slope (triangle) + right slope (shadow face) + 3D ridge cap (parallelogram along ridge) + eave underside strips (5px thick, front and right) + fascia board
- Consistent directional lighting: top-left highlight, bottom-right shadow on every surface
- Windows are recessed (dark shadow behind frame), glass has upper-left glint (HGSS signature)
- Doors are recessed into wall with shadow surround
- Ground shadows extend as oblique parallelograms to right and below
- Sign Y offset raised to y-62 to clear taller 3D roofs

**Spritesheet integration (2026-03-19):**
- Two HGSS tilesets loaded as Image objects in public/game/:
  - img1: hgss_tileset_by_englishkiwi_d2d0xhk.png (766x576) — New Bark Town tiles
  - img2: pokemon_dppthgss_tileset_by_lightbulb15_d4eb7yc.png (4095x2048) — massive DPPt/HGSS collection
- Singleton SHEETS state tracks loading; initSpritesheets() called in useEffect
- All draw functions try spritesheets first, fall back to code-drawn graphics if not loaded
- Replaced elements: trees (EK_TREE at sx:176,sy:136,40x50), buildings (4 themes mapped to spritesheet houses via SPRITE_BUILDING_MAP), rocks (EK_ROCK at sx:252,sy:148,28x32), hedges (LB_HEDGE_TILES from large tileset), flower patches (LB_FLOWERS), lamp posts (EK_LAMP), grass tiles (EK_GRASS_TILES at y=50-98)
- Buildings drawn as single sprites include roof, so roof pass is skipped for sprite-drawn buildings (tracked via _spriteBuildingDrawn Set)
- ctx.imageSmoothingEnabled = false enforced on every render frame for pixel-perfect scaling
- EnglishKiwi tileset layout: y=0-46 rooftops, y=46-98 ground tiles, y=98-190 red/pink house + items, y=190-300 bottom buildings
- Lightbulb15 tileset: houses at y=976-1088, hedges at x=3648, flowers at x=3536

**Why:** User wanted the portfolio game to match HGSS visual fidelity — the previous version looked flat and basic. Spritesheet integration replaces code-drawn graphics with authentic HGSS pixel art. World expansion to 50x35 ensures no dark void on large monitors.

**How to apply:** Any future visual changes should maintain the HGSS palette, oblique 3D projection style (for fallback), and spritesheet-first rendering approach. Both tilesets are loaded at mount time; sprite coordinates are defined as constants at the top of GameCanvas.tsx with verified pixel positions. Camera uses Math.max(scaleX, scaleY) to fill viewport.
