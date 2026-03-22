"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// =============================================================================
// TYPES
// =============================================================================

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Building {
  id: string;
  tileX: number;
  tileY: number;
  tileW: number;
  tileH: number;
  label: string;
  theme: BuildingTheme;
  dialoguePages: string[];
}

type BuildingTheme = "lab" | "office" | "library" | "arcade" | "mailbox";

interface SpriteImages {
  labHouse: HTMLImageElement | null;
  officeHouse: HTMLImageElement | null;
  libraryHouse: HTMLImageElement | null;
  arcadeBuilding: HTMLImageElement | null;
  tree1: HTMLImageElement | null;
  tree2: HTMLImageElement | null;
  treeDark: HTMLImageElement | null;
  ekTree: HTMLImageElement | null;
  rock: HTMLImageElement | null;
  lamp: HTMLImageElement | null;
  fence: HTMLImageElement | null;
}

const EMPTY_SPRITES: SpriteImages = {
  labHouse: null,
  officeHouse: null,
  libraryHouse: null,
  arcadeBuilding: null,
  tree1: null,
  tree2: null,
  treeDark: null,
  ekTree: null,
  rock: null,
  lamp: null,
  fence: null,
};

/** Returns true if the image is fully loaded and decodable */
function imgReady(img: HTMLImageElement | null): img is HTMLImageElement {
  return img !== null && img.complete && img.naturalWidth > 0;
}

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
}

interface GrassState {
  disturbedAt: number;
  direction: number;
}

interface FlowerPatch {
  tx: number;
  ty: number;
  offsets: Array<{ ox: number; oy: number; color: string; size: number }>;
}

interface Rock {
  tx: number;
  ty: number;
  ox: number;
  oy: number;
  size: number;
}

interface LampPost {
  tx: number;
  ty: number;
}

interface Bench {
  tx: number;
  ty: number;
  facing: "up" | "down";
}

interface PondTile {
  col: number;
  row: number;
}

// =============================================================================
// WORLD CONSTANTS
// =============================================================================

const TILE = 32;
const WORLD_COLS = 50;
const WORLD_ROWS = 35;
const WORLD_W = WORLD_COLS * TILE;
const WORLD_H = WORLD_ROWS * TILE;

const PLAYER_W = 20;
const PLAYER_H = 28;
const MOVE_SPEED = 2.6;
const INTERACT_DIST = 20;

const SPAWN_X = 15 * TILE - PLAYER_W / 2;
const SPAWN_Y = 12 * TILE - PLAYER_H / 2;

// =============================================================================
// HGSS COLOR PALETTE
// =============================================================================

const PAL = {
  grassLight: "#78c850",
  grassMid: "#60a840",
  grassShadow: "#4e9030",
  grassDark: "#3a7820",
  pathLight: "#d8c090",
  pathMid: "#c0a870",
  pathEdge: "#a89060",
  pathDark: "#907848",
  water1: "#70b0e0",
  water2: "#5898c8",
  water3: "#4880b0",
  waterShine: "#a0d0f0",
  woodLight: "#a87840",
  woodDark: "#906830",
  roofGreen: "#607850",
  roofBrown: "#905040",
  roofBlue: "#506888",
  fenceWood: "#b08850",
  fenceDark: "#8a6830",
};

// =============================================================================
// TILE TYPES
// =============================================================================

const enum Tile {
  GRASS = 0,
  PATH = 1,
  FLOWER_GRASS = 2,
  BUILDING_BLOCK = 3,
  TREE = 4,
  FENCE = 5,
  WATER = 6,
  HEDGE = 7,
}

// =============================================================================
// WORLD MAP (38 cols x 27 rows)
// =============================================================================
// 0=grass 1=path 2=flower 3=building 4=tree 5=fence 6=water 7=hedge

// prettier-ignore
const RAW_MAP: number[] = [
  // Row 0 — top hedge border (50 cols)
  7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7,
  // Row 1 — hedge border with trees
  7,4,0,0,0,0,4,0,0,0, 0,4,0,0,0,0,0,4,0,0, 0,0,4,0,0,0,0,0,4,0, 0,4,0,0,0,0,4,0,0,0, 0,4,0,0,0,4,0,0,4,7,
  // Row 2 — open grass before buildings
  7,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,7,
  // Row 3 — building row top
  7,0,4,0,3,3,3,3,3,0, 0,0,3,3,3,3,3,0,0,0, 4,0,3,3,3,3,3,0,0,4, 0,0,2,2,0,0,0,0,0,0, 4,0,0,2,0,0,4,0,0,7,
  // Row 4
  7,0,0,0,3,3,3,3,3,0, 0,0,3,3,3,3,3,0,0,0, 0,0,3,3,3,3,3,0,0,0, 0,0,2,0,2,0,0,0,0,0, 0,0,0,0,2,0,0,0,0,7,
  // Row 5
  7,0,0,0,3,3,3,3,3,0, 0,0,3,3,3,3,3,0,0,0, 0,0,3,3,3,3,3,0,0,0, 0,2,0,2,0,2,0,0,0,0, 0,0,2,0,0,2,0,0,0,7,
  // Row 6
  7,0,0,0,3,3,3,3,3,0, 0,0,3,3,3,3,3,0,0,0, 0,0,3,3,3,3,3,0,0,0, 0,0,2,0,2,0,0,0,0,0, 0,0,0,2,0,0,0,0,0,7,
  // Row 7 — upper main path
  7,0,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,0,7,
  // Row 8
  7,0,1,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,1,0,0, 0,0,0,0,0,0,0,1,0,0, 0,0,0,0,0,0,0,1,0,0, 0,0,0,0,0,0,0,0,0,7,
  // Row 9
  7,0,2,2,0,0,2,0,0,0, 0,2,0,0,0,0,0,0,0,2, 0,0,0,2,0,0,2,0,0,0, 0,0,0,0,0,0,0,0,0,4, 0,0,2,0,0,0,2,0,0,7,
  // Row 10
  7,0,0,0,4,0,0,0,2,0, 0,0,2,0,4,0,0,0,2,0, 0,4,0,0,0,0,0,0,0,0, 0,0,4,0,0,0,0,0,0,0, 0,0,0,4,0,0,0,0,0,7,
  // Row 11
  7,2,0,0,0,0,0,0,0,0, 0,0,0,1,1,1,1,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,2,0,0,0,0,0,0,0,7,
  // Row 12 — centre path & welcome sign
  7,0,0,4,0,0,0,2,0,0, 1,1,1,1,1,1,1,1,1,1, 1,0,0,4,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,4, 0,0,0,0,0,0,4,0,0,7,
  // Row 13
  7,0,2,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,0,1, 1,0,0,0,0,2,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,2,0,0,0,0,0,0,7,
  // Row 14
  7,0,0,0,2,0,4,0,0,1, 1,0,4,0,0,0,0,0,0,1, 1,0,0,0,4,0,0,0,0,0, 0,0,0,0,0,4,0,0,0,0, 0,0,0,0,2,0,0,0,0,7,
  // Row 15 — lower main path
  7,0,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,0,7,
  // Row 16
  7,0,1,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,1,0,0, 0,0,0,0,0,0,0,1,0,0, 0,0,0,0,0,0,0,1,0,0, 0,0,0,0,0,0,0,0,0,7,
  // Row 17 — bottom building row
  7,0,0,3,3,3,3,3,0,0, 0,0,0,0,0,0,0,0,0,0, 0,3,3,3,0,0,0,0,0,0, 0,0,0,0,4,0,0,0,0,0, 0,2,0,0,0,4,0,0,0,7,
  // Row 18
  7,0,0,3,3,3,3,3,0,0, 0,2,0,0,0,0,0,2,0,0, 0,3,3,3,0,0,4,0,0,0, 0,0,2,0,0,0,0,0,0,0, 0,0,0,2,0,0,0,0,0,7,
  // Row 19
  7,0,0,3,3,3,3,3,0,0, 0,0,0,0,4,0,0,0,0,0, 0,3,3,3,0,0,0,0,0,0, 0,0,0,2,0,0,0,0,0,2, 0,0,0,0,0,0,2,0,0,7,
  // Row 20
  7,0,0,0,4,0,0,0,0,0, 0,2,0,0,0,0,0,0,2,0, 0,0,0,0,0,4,0,0,0,0, 2,0,0,0,0,0,0,4,0,0, 0,0,0,0,0,0,0,0,0,7,
  // Row 21
  7,0,0,0,0,0,2,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,2,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,4,0,0,2,0,0,0,0,7,
  // Row 22 — garden / flower area
  7,0,0,2,2,2,2,0,0,0, 0,0,0,4,0,0,0,0,0,0, 0,0,0,0,0,0,2,2,2,0, 0,0,0,0,0,4,0,0,0,0, 0,0,2,2,2,0,0,0,0,7,
  // Row 23
  7,0,2,2,2,2,2,2,0,0, 0,0,0,0,0,4,0,0,0,0, 0,4,0,0,0,2,2,2,2,2, 0,0,0,0,0,0,0,0,0,0, 0,2,2,2,2,2,0,0,0,7,
  // Row 24
  7,0,0,2,2,2,2,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,2,2,2,0, 0,0,4,0,0,0,0,0,0,0, 0,0,2,2,2,0,0,0,0,7,
  // Row 25
  7,4,0,0,0,0,0,0,4,0, 0,0,4,0,0,0,0,4,0,0, 0,0,0,0,4,0,0,0,0,0, 4,0,0,0,0,4,0,0,0,0, 4,0,0,0,0,0,4,0,0,7,
  // Row 26 — extended area path
  7,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,7,
  // Row 27
  7,0,0,0,2,0,0,4,0,0, 0,0,0,0,4,0,0,0,0,0, 0,0,4,0,0,0,0,0,0,0, 0,0,2,0,0,0,0,4,0,0, 0,0,0,0,2,0,0,4,0,7,
  // Row 28
  7,0,0,0,0,0,0,0,0,0, 2,0,0,0,0,0,2,0,0,4, 0,0,0,0,2,0,0,0,4,0, 0,0,0,0,0,2,0,0,0,0, 0,0,0,0,0,0,0,0,0,7,
  // Row 29
  7,0,4,0,0,2,2,2,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,4,0,0,0,0,0,0,0,0, 2,2,0,4,0,0,0,0,0,7,
  // Row 30
  7,0,0,0,2,2,2,2,2,0, 0,0,4,0,0,0,0,0,0,0, 0,0,0,4,0,0,2,0,0,0, 0,0,0,0,0,0,0,0,4,0, 2,2,2,0,0,0,4,0,0,7,
  // Row 31
  7,0,0,0,0,2,2,2,0,0, 0,0,0,0,0,0,0,0,4,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,4,0,0,0,0,0,0, 0,2,2,0,0,0,0,0,0,7,
  // Row 32
  7,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,4,0,0,0,0,0,4,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,4,0,0,0,7,
  // Row 33 — near bottom
  7,4,0,0,0,4,0,0,0,0, 4,0,0,0,4,0,0,0,0,4, 0,0,0,0,0,4,0,0,0,0, 0,4,0,0,0,0,4,0,0,0, 0,4,0,0,0,0,0,4,0,7,
  // Row 34 — bottom hedge border
  7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7,
];

function tileAt(col: number, row: number): Tile {
  if (col < 0 || col >= WORLD_COLS || row < 0 || row >= WORLD_ROWS) return Tile.HEDGE;
  return RAW_MAP[row * WORLD_COLS + col] as Tile;
}

function isSolid(col: number, row: number): boolean {
  const t = tileAt(col, row);
  return (
    t === Tile.BUILDING_BLOCK ||
    t === Tile.TREE ||
    t === Tile.FENCE ||
    t === Tile.WATER ||
    t === Tile.HEDGE
  );
}

// =============================================================================
// BUILDINGS
// =============================================================================

const BUILDINGS: Building[] = [
  {
    id: "lab",
    tileX: 4, tileY: 3, tileW: 5, tileH: 5,
    label: "Research Lab",
    theme: "lab",
    dialoguePages: [
      "RESEARCH LAB",
      "FusionML — AI Lead\nML surrogates for fusion plasma\nprediction.\nCollab: MIT, Princeton, LBNL.\n+25% efficiency over baselines.",
      "IoT Security Research\nLLM + RAG pipeline for attack\ndetection.\nPublished at AAAI 2025 &\nIEEE DSAA-SF 2024.",
    ],
  },
  {
    id: "office",
    tileX: 12, tileY: 3, tileW: 5, tileH: 5,
    label: "Experience",
    theme: "office",
    dialoguePages: [
      "EXPERIENCE",
      "Xuman.AI — Founding Engineer\n(Aug 2025 – Present)\nBuilt 0 to 1. Shipped iOS & Android.\nLed ~9 engineers.",
      "Style.AI — Founder (2025)\nAI fashion assistant.\nLLMs + Computer Vision.\n200+ users in first month.",
      "Corizo — ML Intern (2022–2023)\nModels for conversational data.\n+17% accuracy improvement.",
    ],
  },
  {
    id: "library",
    tileX: 22, tileY: 3, tileW: 5, tileH: 5,
    label: "Publications",
    theme: "library",
    dialoguePages: [
      "PUBLICATIONS",
      "AAAI 2025\n\"Intelligent IoT Attack\nDetection via ODLLM\"",
      "FusionML Case Study\nGenAI for RF Heating\nin Fusion Energy",
      "IEEE DSAA-SF 2024\nIoT Security Research Proposal",
      "TROPHY: SF Hacks 2024\nBest GenAI Hack Winner!",
    ],
  },
  {
    id: "arcade",
    tileX: 3, tileY: 17, tileW: 5, tileH: 5,
    label: "Projects",
    theme: "arcade",
    dialoguePages: [
      "PROJECTS",
      "Xuman.AI\nFull-stack marketplace.\nReact Native · NestJS\nLiveKit · Stripe Connect",
      "Style.AI\nAI fashion assistant.\nLLMs + Computer Vision.",
      "More: FusionML · IoT Attack\nDetection · Emotion Detector\nStock Trading Bot · ...",
    ],
  },
  {
    id: "mailbox",
    tileX: 21, tileY: 17, tileW: 3, tileH: 4,
    label: "Contact",
    theme: "mailbox",
    dialoguePages: [
      "CONTACT",
      "Email:\nsatvikrohella@gmail.com",
      "LinkedIn:\nlinkedin.com/in/\nsatvik-verma-b2000",
      "GitHub:\ngithub.com/Satvik-Verma",
      "Google Scholar:\nscholar.google.com/citations\n?user=5LnzwLkAAAAJ",
    ],
  },
];

// =============================================================================
// SEEDED RNG
// =============================================================================

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const rng = seeded(42);

// =============================================================================
// DECORATIVE ELEMENTS
// =============================================================================

const FLOWER_COLORS = ["#ffffff", "#ffcc44", "#ff88cc", "#ff6644", "#aaddff", "#ccffaa"];

const FLOWER_PATCHES: FlowerPatch[] = (() => {
  const patches: FlowerPatch[] = [];
  for (let row = 0; row < WORLD_ROWS; row++) {
    for (let col = 0; col < WORLD_COLS; col++) {
      if (tileAt(col, row) === Tile.FLOWER_GRASS) {
        const count = 4 + Math.floor(rng() * 4);
        const offsets: FlowerPatch["offsets"] = [];
        for (let i = 0; i < count; i++) {
          offsets.push({
            ox: 3 + Math.floor(rng() * 26),
            oy: 3 + Math.floor(rng() * 26),
            color: FLOWER_COLORS[Math.floor(rng() * FLOWER_COLORS.length)],
            size: rng() > 0.5 ? 2 : 1,
          });
        }
        patches.push({ tx: col, ty: row, offsets });
      }
    }
  }
  return patches;
})();

const ROCKS: Rock[] = (() => {
  const rocks: Rock[] = [];
  const positions: [number, number][] = [
    [3, 9], [8, 10], [18, 9], [25, 10], [7, 13], [20, 14],
    [35, 10], [1, 20], [35, 20], [15, 21], [33, 22],
    [42, 9], [45, 13], [38, 20], [44, 21], [10, 28], [25, 29],
    [36, 27], [47, 30], [15, 31], [42, 32],
  ];
  for (const [tc, tr] of positions) {
    const t = tileAt(tc, tr);
    if (t === Tile.GRASS || t === Tile.FLOWER_GRASS) {
      rocks.push({
        tx: tc, ty: tr,
        ox: 8 + Math.floor(rng() * 16),
        oy: 8 + Math.floor(rng() * 16),
        size: 5 + Math.floor(rng() * 4),
      });
    }
  }
  return rocks;
})();

const LAMP_POSTS: LampPost[] = [
  { tx: 2, ty: 7 }, { tx: 9, ty: 7 }, { tx: 18, ty: 7 }, { tx: 27, ty: 7 }, { tx: 35, ty: 7 }, { tx: 43, ty: 7 },
  { tx: 2, ty: 15 }, { tx: 9, ty: 15 }, { tx: 18, ty: 15 }, { tx: 27, ty: 15 }, { tx: 35, ty: 15 }, { tx: 43, ty: 15 },
];

const BENCHES: Bench[] = [
  { tx: 30, ty: 8, facing: "down" },
  { tx: 10, ty: 20, facing: "down" },
  { tx: 15, ty: 8, facing: "down" },
  { tx: 33, ty: 16, facing: "down" },
  { tx: 42, ty: 8, facing: "down" },
  { tx: 38, ty: 16, facing: "down" },
  { tx: 20, ty: 28, facing: "down" },
  { tx: 44, ty: 26, facing: "down" },
];

// Pond tiles — a natural pond shape on the right side
const POND_TILES: PondTile[] = (() => {
  const tiles: PondTile[] = [];
  for (let row = 0; row < WORLD_ROWS; row++) {
    for (let col = 0; col < WORLD_COLS; col++) {
      if (tileAt(col, row) === Tile.WATER) {
        tiles.push({ col, row });
      }
    }
  }
  return tiles;
})();

function generateStars(): Star[] {
  const r = seeded(77);
  const stars: Star[] = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: r() * WORLD_W,
      y: r() * WORLD_H * 0.15,
      size: r() < 0.1 ? 1.8 : r() < 0.3 ? 1.2 : 0.8,
      phase: r() * Math.PI * 2,
      speed: 0.5 + r() * 1.5,
    });
  }
  return stars;
}

const STARS = generateStars();

// =============================================================================
// HELPERS
// =============================================================================

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function rectExpanded(r: Rect, by: number): Rect {
  return { x: r.x - by, y: r.y - by, w: r.w + by * 2, h: r.h + by * 2 };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buildingPixelRect(b: Building): Rect {
  return {
    x: b.tileX * TILE,
    y: b.tileY * TILE,
    w: b.tileW * TILE,
    h: b.tileH * TILE,
  };
}

// =============================================================================
// BUILDING THEME DATA
// =============================================================================

interface ThemeData {
  wallTop: string;
  wallBot: string;
  roofMain: string;
  roofLight: string;
  roofDark: string;
  door: string;
  doorFrame: string;
  windowGlass: string;
  windowFrame: string;
  sign: string;
  signText: string;
  accent: string;
  shutterColor: string;
  flowerBox: string;
  chimney: string;
}

const THEMES: Record<BuildingTheme, ThemeData> = {
  lab: {
    wallTop: "#4a7eb8", wallBot: "#3a6098",
    roofMain: "#506888", roofLight: "#607898", roofDark: "#405870",
    door: "#1a2f50", doorFrame: "#2a4a70",
    windowGlass: "#9cd4f8", windowFrame: "#2a5a80",
    sign: "#1a3a5a", signText: "#7fb3ff", accent: "#7fb3ff",
    shutterColor: "#2a5070", flowerBox: "#8a5030",
    chimney: "#4a5a6a",
  },
  office: {
    wallTop: "#a07850", wallBot: "#806038",
    roofMain: "#905040", roofLight: "#a06050", roofDark: "#703830",
    door: "#3a2010", doorFrame: "#5a3820",
    windowGlass: "#f5d9a0", windowFrame: "#6d4c30",
    sign: "#3a2010", signText: "#ffc87a", accent: "#ffc87a",
    shutterColor: "#6d4c30", flowerBox: "#5a6a30",
    chimney: "#6a4a30",
  },
  library: {
    wallTop: "#b06858", wallBot: "#905040",
    roofMain: "#607850", roofLight: "#708860", roofDark: "#506840",
    door: "#3e1808", doorFrame: "#5a3020",
    windowGlass: "#f7c878", windowFrame: "#8b4030",
    sign: "#3e1808", signText: "#ffb86c", accent: "#ffb86c",
    shutterColor: "#7a4838", flowerBox: "#6a5030",
    chimney: "#7a5040",
  },
  arcade: {
    wallTop: "#388858", wallBot: "#286840",
    roofMain: "#2a5838", roofLight: "#3a6848", roofDark: "#1a4828",
    door: "#0a3018", doorFrame: "#1a5030",
    windowGlass: "#a8ffcc", windowFrame: "#1a6038",
    sign: "#0a2818", signText: "#4affaa", accent: "#4affaa",
    shutterColor: "#1a5838", flowerBox: "#8a5030",
    chimney: "#3a5840",
  },
  mailbox: {
    wallTop: "#c03030", wallBot: "#8a1818",
    roofMain: "#701010", roofLight: "#881818", roofDark: "#500808",
    door: "#400808", doorFrame: "#600808",
    windowGlass: "#ff9999", windowFrame: "#8a1818",
    sign: "#500808", signText: "#ff6b6b", accent: "#ff6b6b",
    shutterColor: "#8a1818", flowerBox: "#500808",
    chimney: "#5a1010",
  },
};

// =============================================================================
// DRAWING HELPERS
// =============================================================================

type GrassStateMap = Map<string, GrassState>;

function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size = 9,
  color = "#fafafa",
  align: CanvasTextAlign = "left"
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// =============================================================================
// GROUND TILE RENDERERS — HGSS-style dithered grass with rich texture
// =============================================================================

function drawGrassTile(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  col: number, row: number,
  grassStates: GrassStateMap,
  now: number,
  t: number
) {
  const tileKey = `${col},${row}`;
  const g = grassStates.get(tileKey);
  const disturbedMs = g ? now - g.disturbedAt : Infinity;
  const isDisturbed = disturbedMs < 500;

  const checker = (col + row) % 2 === 0;

  // Code-drawn grass base
  ctx.fillStyle = checker ? PAL.grassLight : PAL.grassMid;
  ctx.fillRect(px, py, TILE, TILE);

  // Dithered texture — scattered darker pixels for natural look
  const dRng = seeded(col * 73 + row * 37);
  ctx.fillStyle = PAL.grassShadow;
  for (let i = 0; i < 8; i++) {
    const dx = Math.floor(dRng() * TILE);
    const dy = Math.floor(dRng() * TILE);
    if ((dx + dy) % 3 === 0) {
      ctx.fillRect(px + dx, py + dy, 1, 1);
    }
  }

  // Occasional darker grass patch (subtle)
  if (dRng() > 0.7) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = PAL.grassDark;
    const patchX = Math.floor(dRng() * 16);
    const patchY = Math.floor(dRng() * 16);
    ctx.fillRect(px + patchX, py + patchY, 8 + Math.floor(dRng() * 8), 6 + Math.floor(dRng() * 6));
    ctx.restore();
  }

  // Draw grass blades — 5-6 per tile, HGSS-style with 2-3 shades per blade
  const bladePositions = [
    { ox: 5, oy: 24 }, { ox: 13, oy: 19 }, { ox: 22, oy: 26 },
    { ox: 9, oy: 29 }, { ox: 27, oy: 20 },
  ];

  for (let i = 0; i < bladePositions.length; i++) {
    const { ox, oy } = bladePositions[i];
    let sway = 0;
    const idleSway = Math.sin(t * 1.5 + i * 2.1 + col * 0.3 + row * 0.2) * 2.0;

    if (isDisturbed) {
      const progress = disturbedMs / 500;
      const disturbMag = (1 - progress) * (g!.direction < 0 ? -5 : 5);
      sway = lerp(disturbMag, idleSway, progress);
    } else {
      sway = idleSway;
    }

    const bladeH = 8 + (i % 3) * 2;
    const baseX = px + ox;
    const baseY = py + oy;

    // Dark base of blade
    ctx.strokeStyle = PAL.grassDark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(
      baseX + sway * 0.4, baseY - bladeH * 0.4,
      baseX + sway * 0.7, baseY - bladeH * 0.7
    );
    ctx.stroke();

    // Mid-tone blade
    ctx.strokeStyle = PAL.grassShadow;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(
      baseX + sway * 0.5, baseY - bladeH * 0.5,
      baseX + sway, baseY - bladeH
    );
    ctx.stroke();

    // Light tip
    ctx.strokeStyle = checker ? "#90e068" : PAL.grassLight;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(baseX + sway * 0.6, baseY - bladeH * 0.6);
    ctx.lineTo(baseX + sway, baseY - bladeH);
    ctx.stroke();
  }
}

function drawPathTile(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  col: number, row: number
) {
  // HGSS-style dirt path
  ctx.fillStyle = PAL.pathMid;
  ctx.fillRect(px, py, TILE, TILE);

  // Subtle checker texture
  if ((col + row) % 2 === 0) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = PAL.pathLight;
    ctx.fillRect(px, py, TILE, TILE);
    ctx.restore();
  }

  // Scattered dirt texture pixels
  const pr = seeded(col * 47 + row * 23);
  for (let i = 0; i < 10; i++) {
    const dx = Math.floor(pr() * (TILE - 2));
    const dy = Math.floor(pr() * (TILE - 2));
    ctx.fillStyle = pr() > 0.5 ? PAL.pathDark : PAL.pathLight;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(px + dx, py + dy, pr() > 0.5 ? 2 : 1, pr() > 0.5 ? 2 : 1);
  }
  ctx.globalAlpha = 1;

  // Path-to-grass transition edges with individual pixels
  const top = tileAt(col, row - 1) !== Tile.PATH && tileAt(col, row - 1) !== Tile.BUILDING_BLOCK;
  const bot = tileAt(col, row + 1) !== Tile.PATH && tileAt(col, row + 1) !== Tile.BUILDING_BLOCK;
  const left = tileAt(col - 1, row) !== Tile.PATH && tileAt(col - 1, row) !== Tile.BUILDING_BLOCK;
  const right = tileAt(col + 1, row) !== Tile.PATH && tileAt(col + 1, row) !== Tile.BUILDING_BLOCK;

  // Draw dirt-to-grass transition with dithered edge
  const eRng = seeded(col * 59 + row * 83);
  if (top) {
    ctx.fillStyle = PAL.pathEdge;
    ctx.fillRect(px, py, TILE, 2);
    // Dithered transition pixels
    for (let i = 0; i < TILE; i += 2) {
      if (eRng() > 0.4) {
        ctx.fillStyle = PAL.grassMid;
        ctx.fillRect(px + i, py, 1, 1);
      }
    }
  }
  if (bot) {
    ctx.fillStyle = PAL.pathEdge;
    ctx.fillRect(px, py + TILE - 2, TILE, 2);
    for (let i = 0; i < TILE; i += 2) {
      if (eRng() > 0.4) {
        ctx.fillStyle = PAL.grassMid;
        ctx.fillRect(px + i, py + TILE - 1, 1, 1);
      }
    }
  }
  if (left) {
    ctx.fillStyle = PAL.pathEdge;
    ctx.fillRect(px, py, 2, TILE);
    for (let i = 0; i < TILE; i += 2) {
      if (eRng() > 0.4) {
        ctx.fillStyle = PAL.grassMid;
        ctx.fillRect(px, py + i, 1, 1);
      }
    }
  }
  if (right) {
    ctx.fillStyle = PAL.pathEdge;
    ctx.fillRect(px + TILE - 2, py, 2, TILE);
    for (let i = 0; i < TILE; i += 2) {
      if (eRng() > 0.4) {
        ctx.fillStyle = PAL.grassMid;
        ctx.fillRect(px + TILE - 1, py + i, 1, 1);
      }
    }
  }
}

// =============================================================================
// WATER / POND RENDERER — animated waves, HGSS-style
// =============================================================================

function drawWaterTile(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  col: number, row: number,
  t: number
) {
  // Base water color
  ctx.fillStyle = PAL.water2;
  ctx.fillRect(px, py, TILE, TILE);

  // Animated wave pattern
  const wave1 = Math.sin(t * 2.0 + col * 0.8 + row * 0.3) * 0.5 + 0.5;
  const wave2 = Math.sin(t * 1.5 + col * 0.5 - row * 0.7) * 0.5 + 0.5;

  // Light wave stripe
  ctx.save();
  ctx.globalAlpha = 0.25 * wave1;
  ctx.fillStyle = PAL.water1;
  ctx.fillRect(px, py + 4 + wave1 * 4, TILE, 6);
  ctx.restore();

  // Dark wave stripe
  ctx.save();
  ctx.globalAlpha = 0.2 * wave2;
  ctx.fillStyle = PAL.water3;
  ctx.fillRect(px, py + 16 + wave2 * 4, TILE, 5);
  ctx.restore();

  // Shimmer highlight — small sparkle
  const shimmer = Math.sin(t * 3.0 + col * 2.1 + row * 1.7);
  if (shimmer > 0.7) {
    ctx.save();
    ctx.globalAlpha = (shimmer - 0.7) * 2;
    ctx.fillStyle = PAL.waterShine;
    const sx = px + 8 + Math.sin(t + col) * 6;
    const sy = py + 8 + Math.cos(t * 0.8 + row) * 6;
    ctx.fillRect(sx, sy, 3, 1);
    ctx.fillRect(sx + 1, sy - 1, 1, 3);
    ctx.restore();
  }

  // Shore edges — where water meets grass, draw a foam/transition line
  const isWater = (c: number, r: number) => tileAt(c, r) === Tile.WATER;
  if (!isWater(col, row - 1)) {
    // Top shore
    ctx.fillStyle = PAL.water1;
    ctx.globalAlpha = 0.5 + 0.2 * Math.sin(t * 1.5 + col);
    ctx.fillRect(px, py, TILE, 3);
    ctx.fillStyle = "#b0d8f0";
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < TILE; i += 3) {
      ctx.fillRect(px + i, py, 2, 1);
    }
    ctx.globalAlpha = 1;
  }
  if (!isWater(col, row + 1)) {
    ctx.fillStyle = PAL.water3;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(px, py + TILE - 3, TILE, 3);
    ctx.globalAlpha = 1;
  }
  if (!isWater(col - 1, row)) {
    ctx.fillStyle = PAL.water1;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(px, py, 3, TILE);
    ctx.globalAlpha = 1;
  }
  if (!isWater(col + 1, row)) {
    ctx.fillStyle = PAL.water3;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(px + TILE - 3, py, 3, TILE);
    ctx.globalAlpha = 1;
  }
}

// =============================================================================
// HEDGE RENDERER — dense green border, HGSS-style
// =============================================================================

function drawHedgeTile(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  col: number, row: number
) {
  // Dark green base
  ctx.fillStyle = "#2a5020";
  ctx.fillRect(px, py, TILE, TILE);

  // Leaf texture — overlapping circles
  const hRng = seeded(col * 97 + row * 53);
  const colors = ["#3a6830", "#2a5820", "#4a7840", "#325a28"];
  for (let i = 0; i < 6; i++) {
    const cx = px + Math.floor(hRng() * TILE);
    const cy = py + Math.floor(hRng() * TILE);
    const r = 4 + Math.floor(hRng() * 6);
    ctx.fillStyle = colors[Math.floor(hRng() * colors.length)];
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Highlight dots
  ctx.fillStyle = "#5a9848";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(
      px + Math.floor(hRng() * (TILE - 2)),
      py + Math.floor(hRng() * (TILE - 2)),
      2, 2
    );
  }

  // Dark edge at bottom
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#1a3810";
  ctx.fillRect(px, py + TILE - 4, TILE, 4);
  ctx.restore();
}

// =============================================================================
// FLOWER PATCHES — HGSS-style multi-petal flowers
// =============================================================================

function drawFlowerPatch(ctx: CanvasRenderingContext2D, patch: FlowerPatch, t: number) {
  const px = patch.tx * TILE;
  const py = patch.ty * TILE;

  for (const { ox, oy, color, size } of patch.offsets) {
    const bob = Math.sin(t * 1.6 + ox * 0.15 + oy * 0.1) * 0.8;
    const fx = px + ox;
    const fy = py + oy + bob;

    if (size >= 2) {
      // Larger 5-petal flower
      ctx.fillStyle = color;
      ctx.fillRect(fx - 1, fy - 2, 3, 1);  // top petal
      ctx.fillRect(fx - 2, fy - 1, 1, 2);  // left petal
      ctx.fillRect(fx + 2, fy - 1, 1, 2);  // right petal
      ctx.fillRect(fx - 1, fy + 1, 3, 1);  // bottom petal
      ctx.fillRect(fx - 1, fy - 1, 3, 2);  // center fill
      // Center
      ctx.fillStyle = "#ffee66";
      ctx.fillRect(fx, fy - 1, 1, 2);
      ctx.fillRect(fx - 1, fy, 3, 1);
    } else {
      // Small cross flower
      ctx.fillStyle = color;
      ctx.fillRect(fx - 1, fy, 3, 1);
      ctx.fillRect(fx, fy - 1, 1, 3);
      ctx.fillStyle = "#ffff88";
      ctx.fillRect(fx, fy, 1, 1);
    }

    // Tiny stem pixel below flower
    ctx.fillStyle = PAL.grassDark;
    ctx.fillRect(fx, fy + (size >= 2 ? 2 : 1), 1, 2);
  }
}

// =============================================================================
// ROCKS — HGSS-style with highlights and shadow
// =============================================================================

function drawRock(ctx: CanvasRenderingContext2D, rock: Rock) {
  const rx = rock.tx * TILE + rock.ox;
  const ry = rock.ty * TILE + rock.oy;
  const sz = rock.size;

  // Ground shadow
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(rx + 2, ry + sz * 0.6, sz + 2, sz * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Rock body (dark base)
  ctx.fillStyle = "#7a7a86";
  ctx.beginPath();
  ctx.ellipse(rx, ry, sz + 1, sz * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rock body (lighter overlay)
  ctx.fillStyle = "#9090a0";
  ctx.beginPath();
  ctx.ellipse(rx - 1, ry - 1, sz, sz * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight (top-left)
  ctx.fillStyle = "#b8b8cc";
  ctx.fillRect(rx - sz * 0.5, ry - sz * 0.3, 3, 2);

  // Dark accent (bottom-right)
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#4a4a58";
  ctx.fillRect(rx + sz * 0.2, ry + sz * 0.1, 3, 2);
  ctx.restore();
}

// =============================================================================
// LAMP POSTS — HGSS-style with warm glow
// =============================================================================

function drawLampPost(ctx: CanvasRenderingContext2D, lp: LampPost, t: number) {
  const lx = lp.tx * TILE + TILE / 2;
  const ly = lp.ty * TILE + TILE;

  // Warm glow halo
  ctx.save();
  const glow = ctx.createRadialGradient(lx, ly - 30, 0, lx, ly - 30, 28);
  glow.addColorStop(0, "rgba(255,230,100,0.22)");
  glow.addColorStop(0.6, "rgba(255,220,80,0.08)");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(lx, ly - 30, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Shadow at base
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(lx, ly + 2, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Pole (darker at bottom, lighter at top)
  ctx.fillStyle = "#3a3a4a";
  ctx.fillRect(lx - 2, ly - 34, 4, 36);
  ctx.fillStyle = "#4a4a5a";
  ctx.fillRect(lx - 2, ly - 34, 2, 36);

  // Base plate
  ctx.fillStyle = "#2a2a38";
  ctx.fillRect(lx - 4, ly, 8, 3);

  // Lamp housing
  ctx.fillStyle = "#2a2a38";
  ctx.fillRect(lx - 6, ly - 34, 12, 5);
  ctx.fillRect(lx - 4, ly - 38, 8, 4);

  // Light bulb with flicker
  const flicker = 0.85 + 0.15 * Math.sin(t * 7 + lx * 0.1);
  ctx.save();
  ctx.globalAlpha = flicker;
  ctx.fillStyle = "#ffe866";
  ctx.beginPath();
  ctx.arc(lx, ly - 36, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // Inner bright core
  ctx.fillStyle = "#fff8cc";
  ctx.beginPath();
  ctx.arc(lx, ly - 36, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// =============================================================================
// BENCHES — wooden park benches
// =============================================================================

function drawBench(ctx: CanvasRenderingContext2D, bench: Bench) {
  const px = bench.tx * TILE + TILE / 2;
  const py = bench.ty * TILE + TILE / 2;

  // Shadow
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(px, py + 10, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Legs
  ctx.fillStyle = PAL.fenceDark;
  ctx.fillRect(px - 12, py + 2, 3, 8);
  ctx.fillRect(px + 9, py + 2, 3, 8);

  // Seat (3 planks)
  ctx.fillStyle = PAL.fenceWood;
  ctx.fillRect(px - 14, py - 2, 28, 3);
  ctx.fillStyle = PAL.woodLight;
  ctx.fillRect(px - 14, py + 1, 28, 3);
  ctx.fillStyle = PAL.fenceWood;
  ctx.fillRect(px - 14, py + 4, 28, 2);

  // Back rest (if facing down, bench has backrest visible)
  if (bench.facing === "down") {
    ctx.fillStyle = PAL.woodDark;
    ctx.fillRect(px - 13, py - 8, 26, 3);
    ctx.fillStyle = PAL.fenceWood;
    ctx.fillRect(px - 13, py - 5, 26, 3);
    // Backrest supports
    ctx.fillStyle = PAL.fenceDark;
    ctx.fillRect(px - 12, py - 8, 2, 10);
    ctx.fillRect(px + 10, py - 8, 2, 10);
  }

  // Highlight on seat
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#fff";
  ctx.fillRect(px - 12, py - 2, 20, 1);
  ctx.restore();
}

// =============================================================================
// POKEMON-STYLE TREES — Pixel-perfect HGSS sprite approach
// =============================================================================
// HGSS trees are pre-drawn pixel art sprites, NOT circles/gradients.
// Each tree is a 32x48 pixel artwork where every pixel was intentionally placed
// by Game Freak artists. We replicate this by defining the tree as a hardcoded
// pixel array and blitting it via an offscreen canvas (rendered once, stamped
// everywhere with drawImage). This is the only way to get authentic HGSS trees
// without importing external sprite sheet PNGs.
//
// Color palette (compact char codes):
//   . = transparent
//   O = dark green outline      #1B4A0E
//   D = medium-dark green       #2D6B1A
//   M = medium green (body)     #3E8A28
//   L = light green             #5AAE38
//   B = bright highlight        #72C848
//   S = shadow green            #1A3E0A
//   T = trunk dark              #4A2E18
//   U = trunk mid               #6B4226
//   V = trunk light             #7D5A3C
//   G = ground shadow           #2A1A08
// =============================================================================

const TREE_COLOR_MAP: Record<string, string | null> = {
  ".": null,
  O: "#1B4A0E",
  D: "#2D6B1A",
  M: "#3E8A28",
  L: "#5AAE38",
  B: "#72C848",
  S: "#1A3E0A",
  T: "#4A2E18",
  U: "#6B4226",
  V: "#7D5A3C",
  G: "#2A1A08",
};

// 32 wide x 48 tall pixel-art tree sprite.
// Each string is one row; each character is one pixel.
const TREE_SPRITE: string[] = [
  // Row 0-5: Top crown puffs — sparse highlights poking up
  "................................", // 0
  "..........OOOO..................", // 1
  ".........OBBLMO.................", // 2
  "........OBLBLMO..OOO............", // 3
  ".......OMLLBMDO.OBLMO...........", // 4
  "......OMLBLMLMOOOBLLMO..........", // 5
  // Row 6-11: Upper canopy widens with highlight clusters
  ".....OMLBLBLLMDDMLLBLMO.........", // 6
  "....OMBLBLLLMDDMMLLBLLMO........", // 7
  "...OMBLBLLBLMMMMLLLBLBLMO.......", // 8
  "..OMLBLBLLLMLLLMLLBLLBLMO.......", // 9
  "..OBLBLBLLBLLLBLLBLLLBLMO.......", // 10
  ".OMBLBLBLLLLLBLBLBLLBLMDOO......", // 11
  // Row 12-17: Main upper canopy — widest area starts, mixed greens
  ".OBLBLBLLBLLLLLLLBLBLLMDDMO.....", // 12
  "OMLBLBLBLLLBLLBLLLLLBLMDDMO.....", // 13
  "OBLBLBLLBLLLLBLLLBLLBLMDDMMO....", // 14
  "OMBLBLBLLLBLLLLLBLLLBLDDDMMO....", // 15
  "OBLBLBLLBLLLLBLLBLLLBLDDDDMO....", // 16
  "OMLBLBLLLBLLLLLLLLBLBMDDDDMO....", // 17
  // Row 18-23: Full width canopy body — lush mixed greens
  "OBLBLBLLBLLLBLBLLLBLBMDDDDDMO...", // 18
  "OMLBLBLLLLBLLLLLBLLLMDDDDDDMO...", // 19 -- 30px canopy
  "OBLBLBLLLBLLBLLLBLBLMMDDDDDMMO..", // 20
  "OBLBLBLLBLLLLLBLLLBMMDDSDDDDMO..", // 21
  "OMLBLLLBLLBLLLLLBLBMMDDSDDDMMO..", // 22
  "OBLBLBLLLLLBLBLLLBMMDDDSDDDDMO..", // 23
  // Row 24-29: Mid canopy — more medium/dark tones on right side
  "OBLBLLBLLBLLLLLBLBMMDDDSDDDMO...", // 24
  "OMLBLLLBLLLBLLLLBMMDDDDSDDDMO...", // 25
  "OBLBLLLLBLLLLBLBMMDDDDSDDDDMO...", // 26
  "OMLBLLLLLBLLLLLBMMDDDDSDDDMO....", // 27
  ".OBLBLLLLLLBLLBMMDDDDDSDDDMO....", // 28
  ".OMLBLLLBLLLLLBMMDDDDSDDDMO.....", // 29
  // Row 30-35: Lower canopy — narrowing, darker, shadow-heavy
  "..OBLBLLLLLBLLBMMDDDDSDDMO......", // 30
  "..OMLBLLLLLLLLBMMDDDDSDMO.......", // 31
  "...OBLBLLLBLLLBMMDDDSDDMO.......", // 32
  "...OMLBLLLLLLBMMDDDDSDMO........", // 33
  "....OMBLLLLLBMMDDDDSMO..........", // 34
  "....OOMLBLLLBMMDDDDMO...........", // 35
  // Row 36-39: Canopy bottom edge — trunk starts to peek through
  ".....OOMBLLLBMMDDMO.............", // 36
  "......OOMLLLMMDDMO..............", // 37
  ".......OODMMMDOMO...............", // 38
  "........OOTMUDOO................", // 39
  // Row 40-43: Trunk visible — three-tone shading
  ".........OTVUUOO................", // 40
  ".........OTVUUTO................", // 41
  ".........OTVUUTO................", // 42
  ".........OTUUUTO................", // 43
  // Row 44-47: Trunk base with root flare and ground shadow
  "........OTVUUUTOO...............", // 44
  "........OTTVUUTOO...............", // 45
  ".......GGOTTTOOOGG..............", // 46
  "......GGG..OO..GGGG.............", // 47
];

// Split point: rows 0..TREE_CANOPY_SPLIT are drawn in the canopy pass (over character),
// rows TREE_CANOPY_SPLIT.. are drawn in the trunk pass (under character).
const TREE_CANOPY_SPLIT = 40;

// Offscreen canvases for the two halves — rendered once, reused forever
let _treeTrunkCanvas: HTMLCanvasElement | null = null;
let _treeCanopyCanvas: HTMLCanvasElement | null = null;

function ensureTreeSpriteCached(): void {
  if (_treeCanopyCanvas && _treeTrunkCanvas) return;

  const w = TREE_SPRITE[0].length; // 32
  const h = TREE_SPRITE.length;    // 48

  // Build full sprite onto a temporary canvas
  const full = document.createElement("canvas");
  full.width = w;
  full.height = h;
  const fCtx = full.getContext("2d")!;

  // Draw each pixel
  for (let y = 0; y < h; y++) {
    const row = TREE_SPRITE[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      const color = TREE_COLOR_MAP[ch];
      if (color) {
        fCtx.fillStyle = color;
        fCtx.fillRect(x, y, 1, 1);
      }
    }
  }

  // Split into canopy (top) and trunk (bottom) offscreen canvases
  _treeCanopyCanvas = document.createElement("canvas");
  _treeCanopyCanvas.width = w;
  _treeCanopyCanvas.height = TREE_CANOPY_SPLIT;
  const cCtx = _treeCanopyCanvas.getContext("2d")!;
  cCtx.drawImage(full, 0, 0, w, TREE_CANOPY_SPLIT, 0, 0, w, TREE_CANOPY_SPLIT);

  _treeTrunkCanvas = document.createElement("canvas");
  _treeTrunkCanvas.width = w;
  _treeTrunkCanvas.height = h - TREE_CANOPY_SPLIT;
  const tCtx = _treeTrunkCanvas.getContext("2d")!;
  tCtx.drawImage(
    full,
    0, TREE_CANOPY_SPLIT, w, h - TREE_CANOPY_SPLIT,
    0, 0, w, h - TREE_CANOPY_SPLIT
  );
}

function drawTreeTrunk(ctx: CanvasRenderingContext2D, tx: number, ty: number) {
  ensureTreeSpriteCached();
  if (!_treeTrunkCanvas) return;
  const spriteX = tx * TILE + TILE / 2 - 16;
  const spriteY = ty * TILE + TILE - 48 + TREE_CANOPY_SPLIT;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(_treeTrunkCanvas, spriteX, spriteY);
}

function drawTreeCanopy(ctx: CanvasRenderingContext2D, tx: number, ty: number) {
  ensureTreeSpriteCached();
  if (!_treeCanopyCanvas) return;
  const spriteX = tx * TILE + TILE / 2 - 16;
  const spriteY = ty * TILE + TILE - 48;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(_treeCanopyCanvas, spriteX, spriteY);
}

// =============================================================================
// HGSS-QUALITY BUILDINGS — oblique 3/4 view 3D projection
// =============================================================================
// HGSS creates 3D illusion via oblique top-down projection:
//  - Front wall visible head-on
//  - Right side wall visible as a narrow parallelogram (shadow side)
//  - Roof drawn as 3D shape: front slope, right slope, ridge line receding
//  - Consistent lighting: top-left = light, bottom-right = shadow
//  - Every surface has highlight (TL) and shadow (BR) edges
//  - Eave underside visible as thick dark strip
//  - Ground shadow extends right and down

// Depth offset for the oblique side wall (how far the "back" corner
// is shifted up-right to fake the 3D perspective)
const SIDE_DEPTH = 14;
const SIDE_WIDTH = 16;

function drawBuildingBase(ctx: CanvasRenderingContext2D, b: Building) {
  const { x, y, w, h } = buildingPixelRect(b);
  const th = THEMES[b.theme];

  // The front face occupies x,y,w,h as before.
  // The right side wall is a parallelogram: bottom-left at (x+w, y+h),
  // top-left at (x+w, y), top-right at (x+w+SIDE_WIDTH, y-SIDE_DEPTH),
  // bottom-right at (x+w+SIDE_WIDTH, y+h-SIDE_DEPTH).

  const sw = SIDE_WIDTH;  // side wall pixel width
  const sd = SIDE_DEPTH;  // side wall upward shift (oblique offset)

  // ── GROUND SHADOW (extends right + down, fading) ──
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#000";
  // Main shadow rectangle behind and to the right
  ctx.beginPath();
  ctx.moveTo(x + 6, y + h);
  ctx.lineTo(x + w + sw + 8, y + h - sd + 4);
  ctx.lineTo(x + w + sw + 8, y + h - sd + 10);
  ctx.lineTo(x + 6, y + h + 8);
  ctx.closePath();
  ctx.fill();
  // Softer extended shadow
  ctx.globalAlpha = 0.10;
  ctx.beginPath();
  ctx.moveTo(x + 6, y + h + 8);
  ctx.lineTo(x + w + sw + 8, y + h - sd + 10);
  ctx.lineTo(x + w + sw + 8, y + h - sd + 16);
  ctx.lineTo(x + 6, y + h + 14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ── FOUNDATION — stone base strip (front face) ──
  const foundH = 10;
  ctx.fillStyle = "#4a4040";
  ctx.fillRect(x, y + h - foundH, w, foundH);
  // Foundation texture (stone blocks)
  ctx.fillStyle = "#5a5050";
  for (let fx = x + 2; fx < x + w - 2; fx += 8) {
    ctx.fillRect(fx, y + h - foundH + 1, 6, 3);
    ctx.fillRect(fx + 3, y + h - foundH + 5, 6, 3);
  }
  // Foundation highlight on top edge
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y + h - foundH, w, 1);
  ctx.restore();

  // ── FOUNDATION — right side wall (parallelogram) ──
  ctx.save();
  ctx.fillStyle = "#3a3232";
  ctx.beginPath();
  ctx.moveTo(x + w, y + h - foundH);
  ctx.lineTo(x + w + sw, y + h - foundH - sd);
  ctx.lineTo(x + w + sw, y + h - sd);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  // Side foundation texture
  ctx.fillStyle = "#4a4242";
  for (let fy = 0; fy < foundH; fy += 4) {
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(x + w, y + h - foundH + fy);
    ctx.lineTo(x + w + sw, y + h - foundH - sd + fy);
    ctx.stroke();
  }
  ctx.restore();

  // ── FRONT WALL — gradient with brick texture ──
  const wallTop = y;
  const wallBot = y + h - foundH;
  const wallH = wallBot - wallTop;
  const wallGrad = ctx.createLinearGradient(x, wallTop, x, wallBot);
  wallGrad.addColorStop(0, th.wallTop);
  wallGrad.addColorStop(1, th.wallBot);
  ctx.fillStyle = wallGrad;
  ctx.fillRect(x, wallTop, w, wallH);

  // Front wall brick/plank lines
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = "#000";
  for (let py2 = wallTop + 6; py2 < wallBot; py2 += 6) {
    ctx.fillRect(x, py2, w, 1);
  }
  // Vertical mortar lines (offset per row for brick pattern)
  for (let py2 = wallTop + 6; py2 < wallBot; py2 += 12) {
    for (let px2 = x + 8; px2 < x + w - 4; px2 += 16) {
      ctx.fillRect(px2, py2, 1, 6);
    }
    for (let px2 = x + 16; px2 < x + w - 4; px2 += 16) {
      ctx.fillRect(px2, py2 + 6, 1, 6);
    }
  }
  ctx.restore();

  // Front wall left highlight (light source is top-left)
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, wallTop, 3, wallH);
  ctx.restore();

  // Front wall right shadow edge (darker where it meets the side wall)
  ctx.save();
  ctx.globalAlpha = 0.18;
  const frontRShadow = ctx.createLinearGradient(x + w - 18, wallTop, x + w, wallTop);
  frontRShadow.addColorStop(0, "transparent");
  frontRShadow.addColorStop(1, "#000");
  ctx.fillStyle = frontRShadow;
  ctx.fillRect(x + w - 18, wallTop, 18, wallH);
  ctx.restore();

  // Front wall top highlight edge
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, wallTop, w, 2);
  ctx.restore();

  // ── RIGHT SIDE WALL (parallelogram — the 3D magic!) ──
  // This is what makes it look 3D: a visible side face in shadow
  ctx.save();
  // Draw the parallelogram
  ctx.beginPath();
  ctx.moveTo(x + w, wallTop);            // front-top-right of front face
  ctx.lineTo(x + w + sw, wallTop - sd);  // back-top-right (shifted up-right)
  ctx.lineTo(x + w + sw, wallBot - sd);  // back-bottom-right
  ctx.lineTo(x + w, wallBot);            // front-bottom-right
  ctx.closePath();

  // Side wall is darker (in shadow)
  const sideGrad = ctx.createLinearGradient(x + w, wallTop, x + w + sw, wallTop - sd);
  sideGrad.addColorStop(0, th.wallBot);
  sideGrad.addColorStop(1, th.wallBot);
  ctx.fillStyle = sideGrad;
  ctx.fill();

  // Darken the entire side wall (it's the shadow face)
  ctx.globalAlpha = 0.30;
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();

  // Side wall horizontal mortar lines
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  for (let py2 = wallTop + 6; py2 < wallBot; py2 += 6) {
    ctx.beginPath();
    ctx.moveTo(x + w, py2);
    ctx.lineTo(x + w + sw, py2 - sd);
    ctx.stroke();
  }
  ctx.restore();

  // Side wall right edge highlight (catches a sliver of light)
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + w + sw, wallTop - sd);
  ctx.lineTo(x + w + sw, wallBot - sd);
  ctx.stroke();
  ctx.restore();

  // ── DOOR (on front face) ──
  if (b.theme !== "mailbox") {
    const dw = Math.round(w * 0.2);
    const dh = Math.round(h * 0.35);
    const dx = x + Math.round(w * 0.4 - dw / 2);  // slightly left of center (HGSS style)
    const dy = wallBot - dh;

    // Door recess shadow (the door is set INTO the wall)
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#000";
    ctx.fillRect(dx - 4, dy - 4, dw + 8, dh + 4);
    ctx.restore();

    // Door frame (thick, darker)
    ctx.fillStyle = th.doorFrame;
    ctx.fillRect(dx - 3, dy - 3, dw + 6, dh + 3);

    // Door arch detail (semicircle above door)
    ctx.save();
    ctx.fillStyle = th.doorFrame;
    ctx.beginPath();
    ctx.arc(dx + dw / 2, dy, dw / 2 + 3, Math.PI, 0);
    ctx.fill();
    ctx.restore();

    // Door fill
    ctx.fillStyle = th.door;
    ctx.fillRect(dx, dy, dw, dh);

    // Door panel recesses (carved panels)
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(dx + 3, dy + 3, dw - 6, dh * 0.4 - 2);
    ctx.strokeRect(dx + 3, dy + dh * 0.45, dw - 6, dh * 0.4 - 2);
    ctx.restore();
    // Panel highlight (top-left of each panel)
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#fff";
    ctx.fillRect(dx + 3, dy + 3, dw - 6, 1);
    ctx.fillRect(dx + 3, dy + dh * 0.45, dw - 6, 1);
    ctx.restore();

    // Door knob
    ctx.fillStyle = "#d4a840";
    ctx.beginPath();
    ctx.arc(dx + dw * 0.75, dy + dh * 0.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Knob highlight
    ctx.fillStyle = "#f0c860";
    ctx.fillRect(dx + dw * 0.75 - 1, dy + dh * 0.5 - 1, 1, 1);

    // Door step (stone steps, 3D perspective)
    ctx.fillStyle = "#6a5a48";
    ctx.fillRect(dx - 6, wallBot - 3, dw + 12, 3);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(dx - 4, wallBot, dw + 8, foundH);
    // Step highlight
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#fff";
    ctx.fillRect(dx - 6, wallBot - 3, dw + 12, 1);
    ctx.restore();

    // Door warm light glow on ground
    ctx.save();
    const doorGlow = ctx.createRadialGradient(
      dx + dw / 2, y + h, 0,
      dx + dw / 2, y + h, 24
    );
    doorGlow.addColorStop(0, th.accent + "28");
    doorGlow.addColorStop(1, "transparent");
    ctx.fillStyle = doorGlow;
    ctx.fillRect(dx - 14, y + h - 4, dw + 28, 22);
    ctx.restore();

    // ── WINDOWS with shutters and flower boxes (on front face) ──
    const winW = Math.round(w * 0.15);
    const winH = Math.round(winW * 0.9);
    const winY = wallTop + Math.round(wallH * 0.2);
    const winLeft = x + Math.round(w * 0.08);
    const winRight = x + w - Math.round(w * 0.1) - winW;

    for (const wx of [winLeft, winRight]) {
      const isRightWin = wx === winRight;

      // Window recess shadow (windows are set into the wall)
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#000";
      ctx.fillRect(wx - 3, winY - 3, winW + 6, winH + 6);
      ctx.restore();

      // Shutters (side panels)
      ctx.fillStyle = th.shutterColor;
      ctx.fillRect(wx - 5, winY - 1, 4, winH + 2);
      ctx.fillRect(wx + winW + 1, winY - 1, 4, winH + 2);
      // Shutter detail lines
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#000";
      ctx.fillRect(wx - 4, winY + winH * 0.3, 2, 1);
      ctx.fillRect(wx - 4, winY + winH * 0.6, 2, 1);
      ctx.fillRect(wx + winW + 2, winY + winH * 0.3, 2, 1);
      ctx.fillRect(wx + winW + 2, winY + winH * 0.6, 2, 1);
      ctx.restore();

      // Window frame (recessed)
      ctx.fillStyle = th.windowFrame;
      ctx.fillRect(wx - 2, winY - 2, winW + 4, winH + 4);

      // Glass — slightly darker if on the shadow (right) side
      ctx.save();
      ctx.globalAlpha = isRightWin ? 0.55 : 0.7;
      ctx.fillStyle = th.windowGlass;
      ctx.fillRect(wx, winY, winW, winH);
      ctx.restore();

      // Glass reflection — bright spot in upper-left (HGSS signature!)
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(wx + 2, winY + 2, 3, 2);  // bright glint
      ctx.globalAlpha = 0.20;
      ctx.fillRect(wx + 2, winY + 4, 2, winH - 6);  // fading reflection stripe
      ctx.restore();

      // Cross-pane dividers
      ctx.strokeStyle = th.windowFrame;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(wx + winW / 2, winY);
      ctx.lineTo(wx + winW / 2, winY + winH);
      ctx.moveTo(wx, winY + winH / 2);
      ctx.lineTo(wx + winW, winY + winH / 2);
      ctx.stroke();

      // Window sill (with 3D thickness)
      ctx.fillStyle = th.windowFrame;
      ctx.fillRect(wx - 4, winY + winH + 2, winW + 8, 4);
      // Sill underside shadow
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#000";
      ctx.fillRect(wx - 4, winY + winH + 5, winW + 8, 2);
      ctx.restore();

      // Flower box below sill
      ctx.fillStyle = th.flowerBox;
      ctx.fillRect(wx - 3, winY + winH + 7, winW + 6, 5);
      // Flowers in box
      const fColors = ["#ff6688", "#ffcc44", "#ff8866", "#ffffff"];
      const fRng = seeded(wx * 13 + winY * 7);
      for (let fi = 0; fi < 4; fi++) {
        const ffx = wx - 1 + fi * (winW / 3);
        ctx.fillStyle = fColors[Math.floor(fRng() * fColors.length)];
        ctx.fillRect(ffx, winY + winH + 5, 2, 2);
        ctx.fillStyle = "#4a8830";
        ctx.fillRect(ffx + 1, winY + winH + 7, 1, 3);
      }
    }

    // ── WINDOW ON SIDE WALL (right face — proves the building has depth!) ──
    if (w > 4 * TILE) {
      const sWinW = 10;
      const sWinH = 10;
      const sWinX = x + w + sw * 0.3;
      const sWinY = wallTop + wallH * 0.25;
      const sWinShift = -(sd * 0.3);  // oblique Y offset

      // Window recess on side wall
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(sWinX - 1, sWinY + sWinShift - 1);
      ctx.lineTo(sWinX + sWinW + 1, sWinY + sWinShift - 1 - (sd * sWinW / sw));
      ctx.lineTo(sWinX + sWinW + 1, sWinY + sWinShift + sWinH + 1 - (sd * sWinW / sw));
      ctx.lineTo(sWinX - 1, sWinY + sWinShift + sWinH + 1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Side window glass (darker, in shadow)
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = th.windowGlass;
      ctx.beginPath();
      ctx.moveTo(sWinX, sWinY + sWinShift);
      ctx.lineTo(sWinX + sWinW, sWinY + sWinShift - (sd * sWinW / sw));
      ctx.lineTo(sWinX + sWinW, sWinY + sWinShift + sWinH - (sd * sWinW / sw));
      ctx.lineTo(sWinX, sWinY + sWinShift + sWinH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Side window glint (tiny)
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#fff";
      ctx.fillRect(sWinX + 1, sWinY + sWinShift + 1, 2, 1);
      ctx.restore();
    }

    // ── CHIMNEY (sits on the roof, visible in 3D) ──
    if (b.theme !== "arcade") {
      const chX = x + w * 0.7;
      const chW = 10;
      const chH = 22;

      // Chimney front face
      ctx.fillStyle = th.chimney;
      ctx.fillRect(chX, y - chH + 4, chW, chH);
      // Chimney right side (3D parallelogram, small)
      ctx.save();
      ctx.fillStyle = th.chimney;
      ctx.beginPath();
      ctx.moveTo(chX + chW, y - chH + 4);
      ctx.lineTo(chX + chW + 4, y - chH + 4 - 3);
      ctx.lineTo(chX + chW + 4, y + 4 - 3);
      ctx.lineTo(chX + chW, y + 4);
      ctx.closePath();
      ctx.fill();
      // Darken the chimney side
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();

      // Chimney cap (front)
      ctx.fillStyle = th.chimney;
      ctx.fillRect(chX - 2, y - chH + 2, chW + 4, 4);
      // Chimney cap right side
      ctx.save();
      ctx.fillStyle = th.chimney;
      ctx.beginPath();
      ctx.moveTo(chX + chW + 2, y - chH + 2);
      ctx.lineTo(chX + chW + 6, y - chH + 2 - 3);
      ctx.lineTo(chX + chW + 6, y - chH + 6 - 3);
      ctx.lineTo(chX + chW + 2, y - chH + 6);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();
      // Chimney cap top face
      ctx.save();
      ctx.fillStyle = th.chimney;
      ctx.beginPath();
      ctx.moveTo(chX - 2, y - chH + 2);
      ctx.lineTo(chX - 2 + 4, y - chH + 2 - 3);
      ctx.lineTo(chX + chW + 6, y - chH + 2 - 3);
      ctx.lineTo(chX + chW + 2, y - chH + 2);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();

      // Chimney mortar lines
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#000";
      for (let cy = y - chH + 6; cy < y + 4; cy += 4) {
        ctx.fillRect(chX, cy, chW, 1);
      }
      ctx.restore();
      // Chimney front highlight (left edge)
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#fff";
      ctx.fillRect(chX, y - chH + 4, 2, chH);
      ctx.restore();
    }
  }
}

function drawBuildingRoof(ctx: CanvasRenderingContext2D, b: Building) {
  if (b.theme === "mailbox") return;
  const { x, y, w } = buildingPixelRect(b);
  const th = THEMES[b.theme];
  const roofH = 30;
  const overhang = 10;
  const eaveThick = 5;  // visible thickness of eave underside

  const sw = SIDE_WIDTH;
  const sd = SIDE_DEPTH;

  // ─────────────────────────────────────────────────────
  // HGSS 3D ROOF — the roof is a 3D shape with:
  //   - Front slope (triangle/trapezoid facing the viewer)
  //   - Right slope (visible side face, in shadow)
  //   - Ridge line running from front peak backward/upward
  //   - Eave underside strip showing roof thickness
  // ─────────────────────────────────────────────────────

  // Front face ridge peak
  const peakX = x + w / 2;
  const peakY = y - roofH;

  // Back ridge peak (shifted for oblique perspective)
  const backPeakX = peakX + sw;
  const backPeakY = peakY - sd;

  // Front eave corners (overhanging the front wall)
  const frontLeftX = x - overhang;
  const frontLeftY = y;
  const frontRightX = x + w + overhang;
  const frontRightY = y;

  // Back eave corners (overhanging the back of the building)
  // Back-left eave not drawn (hidden behind front slope in this projection)
  const backRightX = frontRightX + sw;
  const backRightY = frontRightY - sd;

  // ── FRONT ROOF SLOPE (main visible face) ──
  ctx.beginPath();
  ctx.moveTo(frontLeftX, frontLeftY);   // front-left eave
  ctx.lineTo(peakX, peakY);             // front peak
  ctx.lineTo(frontRightX, frontRightY); // front-right eave
  ctx.closePath();

  const frontRoofGrad = ctx.createLinearGradient(x, peakY, x, y);
  frontRoofGrad.addColorStop(0, th.roofLight);
  frontRoofGrad.addColorStop(0.4, th.roofMain);
  frontRoofGrad.addColorStop(1, th.roofDark);
  ctx.fillStyle = frontRoofGrad;
  ctx.fill();

  // Front slope shingle rows (horizontal lines)
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  for (let s = 0; s < roofH; s += 4) {
    const progress = s / roofH;
    const leftX2 = lerp(frontLeftX, peakX, progress);
    const rightX2 = lerp(frontRightX, peakX, progress);
    const sy = y - s;
    ctx.beginPath();
    ctx.moveTo(leftX2 + 1, sy);
    ctx.lineTo(rightX2 - 1, sy);
    ctx.stroke();
  }
  ctx.restore();

  // Individual shingle dashes
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  for (let s = 2; s < roofH - 2; s += 4) {
    const progress = s / roofH;
    const leftX2 = lerp(frontLeftX, peakX, progress);
    const rightX2 = lerp(frontRightX, peakX, progress);
    const sy = y - s;
    const offset = (s % 8 === 2) ? 4 : 0;
    for (let sx = leftX2 + 4 + offset; sx < rightX2 - 4; sx += 8) {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx, sy + 3);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Front slope left-side highlight (light from top-left)
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.beginPath();
  ctx.moveTo(frontLeftX, frontLeftY);
  ctx.lineTo(peakX, peakY);
  ctx.lineTo(peakX - 4, frontLeftY);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.restore();

  // ── RIGHT ROOF SLOPE (side face — in shadow, creates 3D) ──
  ctx.beginPath();
  ctx.moveTo(frontRightX, frontRightY);  // front-right eave
  ctx.lineTo(peakX, peakY);               // front peak
  ctx.lineTo(backPeakX, backPeakY);       // back peak
  ctx.lineTo(backRightX, backRightY);     // back-right eave
  ctx.closePath();

  ctx.fillStyle = th.roofDark;
  ctx.fill();

  // Additional darkening (shadow side)
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();

  // Right slope shingle lines (diagonal, following the oblique angle)
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  for (let s = 4; s < roofH; s += 4) {
    const progress = s / roofH;
    // Interpolate between the eave edge and the ridge for this row
    const frontPt = lerp(frontRightY, peakY, progress);
    const backPt = lerp(backRightY, backPeakY, progress);
    const frontXPt = lerp(frontRightX, peakX, progress);
    const backXPt = lerp(backRightX, backPeakX, progress);
    ctx.beginPath();
    ctx.moveTo(frontXPt, frontPt);
    ctx.lineTo(backXPt, backPt);
    ctx.stroke();
  }
  ctx.restore();

  // ── ROOF TOP FACE (visible from above — the flat top surface of the ridge) ──
  // This is a narrow parallelogram along the ridge, showing the ridge cap
  ctx.save();
  const ridgeW = 6;
  ctx.fillStyle = th.roofLight;
  ctx.beginPath();
  ctx.moveTo(peakX - ridgeW / 2, peakY);
  ctx.lineTo(backPeakX - ridgeW / 2, backPeakY);
  ctx.lineTo(backPeakX + ridgeW / 2, backPeakY);
  ctx.lineTo(peakX + ridgeW / 2, peakY);
  ctx.closePath();
  ctx.fill();
  // Ridge highlight
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.restore();

  // ── EAVE UNDERSIDE (front — dark strip showing roof thickness) ──
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 0.40;
  ctx.beginPath();
  ctx.moveTo(frontLeftX, frontLeftY);
  ctx.lineTo(frontRightX, frontRightY);
  ctx.lineTo(frontRightX, frontRightY + eaveThick);
  ctx.lineTo(frontLeftX, frontLeftY + eaveThick);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Eave fascia board (lighter strip at very bottom of eave)
  ctx.save();
  ctx.fillStyle = th.roofDark;
  ctx.fillRect(frontLeftX, frontLeftY + eaveThick - 2, frontRightX - frontLeftX, 2);
  ctx.restore();

  // ── EAVE UNDERSIDE (right side — darker) ──
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.moveTo(frontRightX, frontRightY);
  ctx.lineTo(backRightX, backRightY);
  ctx.lineTo(backRightX, backRightY + eaveThick);
  ctx.lineTo(frontRightX, frontRightY + eaveThick);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ── THEME-SPECIFIC ROOF ORNAMENTS ──
  if (b.theme === "lab") {
    // Antenna with blinking light — on the ridge
    const antX = peakX + sw * 0.3;
    const antY = peakY - sd * 0.3;
    ctx.fillStyle = "#3a3a4a";
    ctx.fillRect(antX - 1, antY - 18, 2, 18);
    // Antenna cross
    ctx.fillRect(antX - 4, antY - 14, 8, 2);
    // Red light
    ctx.fillStyle = "#ff4444";
    ctx.beginPath();
    ctx.arc(antX, antY - 18, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#ff6666";
    ctx.beginPath();
    ctx.arc(antX, antY - 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (b.theme === "arcade") {
    // Neon star on ridge
    const sx = peakX + sw * 0.2;
    const sy2 = peakY - sd * 0.2 - 10;
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#4affaa";
    ctx.beginPath();
    ctx.arc(sx, sy2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Star shape
    ctx.fillStyle = "#4affaa";
    ctx.beginPath();
    ctx.moveTo(sx, sy2 - 6);
    ctx.lineTo(sx + 2, sy2 - 2);
    ctx.lineTo(sx + 6, sy2);
    ctx.lineTo(sx + 2, sy2 + 2);
    ctx.lineTo(sx, sy2 + 6);
    ctx.lineTo(sx - 2, sy2 + 2);
    ctx.lineTo(sx - 6, sy2);
    ctx.lineTo(sx - 2, sy2 - 2);
    ctx.closePath();
    ctx.fill();
  }

  if (b.theme === "library") {
    // Small round window in the front gable
    const gx = x + w / 2;
    const gy = y - roofH * 0.5;
    ctx.fillStyle = th.windowFrame;
    ctx.beginPath();
    ctx.arc(gx, gy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = th.windowGlass;
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(gx, gy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Cross divider in round window
    ctx.strokeStyle = th.windowFrame;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gx - 4, gy); ctx.lineTo(gx + 4, gy);
    ctx.moveTo(gx, gy - 4); ctx.lineTo(gx, gy + 4);
    ctx.stroke();
    // Round window glint
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#fff";
    ctx.fillRect(gx - 2, gy - 2, 2, 1);
    ctx.restore();
  }
}

function drawBuildingSign(ctx: CanvasRenderingContext2D, b: Building) {
  const { x, y, w } = buildingPixelRect(b);
  const th = THEMES[b.theme];
  const signW = Math.min(w + 24, 130);
  const signH = 20;
  const sx = x + w / 2 - signW / 2;
  const sy = y - 62;  // raised to clear the taller 3D oblique roof

  // Sign posts (wooden)
  ctx.fillStyle = PAL.woodDark;
  ctx.fillRect(sx + signW * 0.25 - 2, sy + signH, 4, 16);
  ctx.fillRect(sx + signW * 0.75 - 2, sy + signH, 4, 16);
  // Post highlights
  ctx.fillStyle = PAL.woodLight;
  ctx.fillRect(sx + signW * 0.25 - 2, sy + signH, 2, 16);
  ctx.fillRect(sx + signW * 0.75 - 2, sy + signH, 2, 16);

  // Sign board with wooden border
  ctx.fillStyle = PAL.fenceWood;
  ctx.fillRect(sx - 2, sy - 2, signW + 4, signH + 4);

  const signGrad = ctx.createLinearGradient(sx, sy, sx, sy + signH);
  signGrad.addColorStop(0, th.sign);
  signGrad.addColorStop(1, th.sign + "cc");
  ctx.fillStyle = signGrad;
  ctx.fillRect(sx, sy, signW, signH);

  // Double border (RPG style)
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(sx, sy, signW, signH);
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 1;
  ctx.strokeRect(sx + 2, sy + 2, signW - 4, signH - 4);
  ctx.restore();

  // Corner ornaments
  ctx.fillStyle = th.accent;
  ctx.fillRect(sx + 1, sy + 1, 3, 3);
  ctx.fillRect(sx + signW - 4, sy + 1, 3, 3);
  ctx.fillRect(sx + 1, sy + signH - 4, 3, 3);
  ctx.fillRect(sx + signW - 4, sy + signH - 4, 3, 3);

  // Sign text
  drawPixelText(ctx, b.label, sx + signW / 2, sy + 5, 9, th.signText, "center");
}

// =============================================================================
// MAILBOX (special renderer)
// =============================================================================

function drawMailbox(ctx: CanvasRenderingContext2D, b: Building) {
  const px = b.tileX * TILE + (b.tileW * TILE) / 2;
  const py = b.tileY * TILE + b.tileH * TILE - 8;

  // Ground shadow
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(px, py + 4, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Post (wooden, with texture)
  ctx.fillStyle = "#5a3818";
  ctx.fillRect(px - 4, py - 42, 8, 44);
  ctx.fillStyle = "#6a4820";
  ctx.fillRect(px - 4, py - 42, 3, 44);
  // Post cap
  ctx.fillStyle = "#4a2810";
  ctx.fillRect(px - 5, py - 44, 10, 4);

  // Mailbox body
  const mx = px - 20, my = py - 76, mw = 40, mh = 30;
  ctx.fillStyle = "#cc2828";
  ctx.fillRect(mx, my + 10, mw, mh - 10);
  // Rounded top
  ctx.beginPath();
  ctx.ellipse(px, my + 10, 20, 12, 0, Math.PI, 0);
  ctx.fill();

  // Side shading
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#000";
  ctx.fillRect(mx + mw - 8, my + 10, 8, mh - 10);
  ctx.restore();

  // Left highlight
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#ff8888";
  ctx.fillRect(mx + 2, my + 4, 10, mh - 4);
  ctx.restore();

  // Mail slot
  ctx.fillStyle = "#6a0808";
  ctx.fillRect(mx + 5, my + 16, mw - 10, 3);

  // Flag
  ctx.fillStyle = "#dd3333";
  ctx.fillRect(px + 16, my - 4, 4, 20);
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(px + 16, my - 4, 16, 10);
  // Flag detail
  ctx.fillStyle = "#dd3333";
  ctx.fillRect(px + 18, my - 2, 12, 1);

  // Mailbox label
  ctx.fillStyle = "#fff";
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MAIL", px, my + 24);
  ctx.restore();

  // Sign above
  const sw = 76, sh = 18;
  const sx2 = px - sw / 2, sy2 = my - 30;
  ctx.fillStyle = "#500808";
  ctx.fillRect(sx2, sy2, sw, sh);
  ctx.strokeStyle = "#ff6b6b";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(sx2, sy2, sw, sh);
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = "#ff6b6b";
  ctx.lineWidth = 1;
  ctx.strokeRect(sx2 + 2, sy2 + 2, sw - 4, sh - 4);
  ctx.restore();
  drawPixelText(ctx, "Contact", px, sy2 + 4, 8, "#ff6b6b", "center");
}

// =============================================================================
// WELCOME SIGN — HGSS-style wooden signpost
// =============================================================================

function drawWelcomeSign(ctx: CanvasRenderingContext2D) {
  const cx = WORLD_COLS * TILE / 2;
  const cy = 12 * TILE + 8;
  const sw = 260, sh = 26;
  const sx = cx - sw / 2;

  // Posts (wooden)
  ctx.fillStyle = PAL.woodDark;
  ctx.fillRect(sx + 28, cy + sh, 5, 22);
  ctx.fillRect(sx + sw - 33, cy + sh, 5, 22);
  ctx.fillStyle = PAL.woodLight;
  ctx.fillRect(sx + 28, cy + sh, 2, 22);
  ctx.fillRect(sx + sw - 33, cy + sh, 2, 22);

  // Sign board (wooden frame)
  ctx.fillStyle = PAL.fenceWood;
  ctx.fillRect(sx - 3, cy - 3, sw + 6, sh + 6);

  // Sign board inner
  ctx.fillStyle = "#1a3a28";
  ctx.fillRect(sx, cy, sw, sh);

  // Wood grain on frame
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#000";
  for (let gy = cy - 2; gy < cy + sh + 2; gy += 3) {
    ctx.fillRect(sx - 2, gy, sw + 4, 1);
  }
  ctx.restore();

  // Inner border
  ctx.strokeStyle = "#4affaa";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(sx, cy, sw, sh);
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = "#4affaa";
  ctx.lineWidth = 1;
  ctx.strokeRect(sx + 3, cy + 3, sw - 6, sh - 6);
  ctx.restore();

  // Corner decorations
  ctx.fillStyle = "#4affaa";
  ctx.fillRect(sx + 2, cy + 2, 4, 4);
  ctx.fillRect(sx + sw - 6, cy + 2, 4, 4);
  ctx.fillRect(sx + 2, cy + sh - 6, 4, 4);
  ctx.fillRect(sx + sw - 6, cy + sh - 6, 4, 4);

  drawPixelText(ctx, "Welcome to Satvik's World!", cx, cy + 7, 9, "#4affaa", "center");
}

// =============================================================================
// CHARACTER SPRITE — HGSS-quality with hat, backpack, proper shoes
// =============================================================================

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: number,
  walkFrame: number
) {
  const w = PLAYER_W;
  const bob = walkFrame === 0 ? 0 : -1;

  // Character shadow
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + PLAYER_H + 2, w * 0.55, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // === SHOES ===
  const shoeMain = "#2a2020";
  const shoeSole = "#1a1010";
  ctx.fillStyle = shoeMain;
  if (walkFrame === 1) {
    ctx.fillRect(x + 2, y + PLAYER_H - 3 + bob, 7, 4);
    ctx.fillRect(x + w - 9, y + PLAYER_H + 1 + bob, 7, 3);
    ctx.fillStyle = shoeSole;
    ctx.fillRect(x + 2, y + PLAYER_H + bob, 7, 1);
    ctx.fillRect(x + w - 9, y + PLAYER_H + 3 + bob, 7, 1);
  } else if (walkFrame === 2) {
    ctx.fillRect(x + 2, y + PLAYER_H + 1 + bob, 7, 3);
    ctx.fillRect(x + w - 9, y + PLAYER_H - 3 + bob, 7, 4);
    ctx.fillStyle = shoeSole;
    ctx.fillRect(x + 2, y + PLAYER_H + 3 + bob, 7, 1);
    ctx.fillRect(x + w - 9, y + PLAYER_H + bob, 7, 1);
  } else {
    ctx.fillRect(x + 2, y + PLAYER_H - 1 + bob, 7, 4);
    ctx.fillRect(x + w - 9, y + PLAYER_H - 1 + bob, 7, 4);
    ctx.fillStyle = shoeSole;
    ctx.fillRect(x + 2, y + PLAYER_H + 2 + bob, 7, 1);
    ctx.fillRect(x + w - 9, y + PLAYER_H + 2 + bob, 7, 1);
  }
  // Shoe highlights
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#888";
  if (walkFrame === 1) {
    ctx.fillRect(x + 3, y + PLAYER_H - 3 + bob, 3, 1);
  } else if (walkFrame === 2) {
    ctx.fillRect(x + w - 8, y + PLAYER_H - 3 + bob, 3, 1);
  } else {
    ctx.fillRect(x + 3, y + PLAYER_H - 1 + bob, 3, 1);
    ctx.fillRect(x + w - 8, y + PLAYER_H - 1 + bob, 3, 1);
  }
  ctx.restore();

  // === PANTS ===
  ctx.fillStyle = "#2a2a50";
  if (walkFrame === 1) {
    ctx.fillRect(x + 3, y + PLAYER_H - 10 + bob, 7, 9);
    ctx.fillRect(x + w - 10, y + PLAYER_H - 7 + bob, 7, 8);
  } else if (walkFrame === 2) {
    ctx.fillRect(x + 3, y + PLAYER_H - 7 + bob, 7, 8);
    ctx.fillRect(x + w - 10, y + PLAYER_H - 10 + bob, 7, 9);
  } else {
    ctx.fillRect(x + 3, y + PLAYER_H - 9 + bob, 7, 10);
    ctx.fillRect(x + w - 10, y + PLAYER_H - 9 + bob, 7, 10);
  }
  // Pant crease
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#000";
  ctx.fillRect(x + w / 2 - 1, y + PLAYER_H - 9 + bob, 2, 8);
  ctx.restore();

  // === BELT ===
  ctx.fillStyle = "#3a2a18";
  ctx.fillRect(x + 2, y + PLAYER_H - 10 + bob, w - 4, 2);
  // Belt buckle
  ctx.fillStyle = "#c0a040";
  ctx.fillRect(x + w / 2 - 1, y + PLAYER_H - 10 + bob, 3, 2);

  // === SHIRT / BODY ===
  ctx.fillStyle = "#2050a0";
  ctx.fillRect(x + 2, y + 12 + bob, w - 4, 12);

  // Shirt stripe detail
  ctx.fillStyle = "#2860b0";
  ctx.fillRect(x + 3, y + 14 + bob, w - 6, 2);

  // Collar
  ctx.fillStyle = "#3070c0";
  ctx.fillRect(x + 5, y + 12 + bob, w - 10, 3);

  // === BACKPACK (visible from side/back) ===
  if (direction === 1 || direction === 2) {
    // Backpack visible on back/left side
    ctx.fillStyle = "#c04030";
    ctx.fillRect(x + w - 2, y + 13 + bob, 5, 10);
    ctx.fillStyle = "#a03020";
    ctx.fillRect(x + w - 2, y + 13 + bob, 5, 2);
    // Strap
    ctx.fillStyle = "#802818";
    ctx.fillRect(x + w - 2, y + 12 + bob, 1, 12);
  } else if (direction === 3) {
    ctx.fillStyle = "#c04030";
    ctx.fillRect(x - 3, y + 13 + bob, 5, 10);
    ctx.fillStyle = "#a03020";
    ctx.fillRect(x - 3, y + 13 + bob, 5, 2);
    ctx.fillStyle = "#802818";
    ctx.fillRect(x + 2, y + 12 + bob, 1, 12);
  } else if (direction === 0) {
    // Facing down — backpack not visible, but show straps on shoulders
    ctx.fillStyle = "#802818";
    ctx.fillRect(x + 3, y + 12 + bob, 2, 6);
    ctx.fillRect(x + w - 5, y + 12 + bob, 2, 6);
  }

  // === ARMS ===
  ctx.fillStyle = "#2050a0";
  if (walkFrame === 1) {
    ctx.fillRect(x - 2, y + 13 + bob + 2, 5, 8);
    ctx.fillRect(x + w - 3, y + 13 + bob - 2, 5, 8);
  } else if (walkFrame === 2) {
    ctx.fillRect(x - 2, y + 13 + bob - 2, 5, 8);
    ctx.fillRect(x + w - 3, y + 13 + bob + 2, 5, 8);
  } else {
    ctx.fillRect(x - 2, y + 13 + bob, 5, 9);
    ctx.fillRect(x + w - 3, y + 13 + bob, 5, 9);
  }
  // Arm sleeve cuffs
  ctx.fillStyle = "#3070c0";
  if (walkFrame === 1) {
    ctx.fillRect(x - 2, y + 19 + bob + 2, 5, 2);
    ctx.fillRect(x + w - 3, y + 19 + bob - 2, 5, 2);
  } else if (walkFrame === 2) {
    ctx.fillRect(x - 2, y + 19 + bob - 2, 5, 2);
    ctx.fillRect(x + w - 3, y + 19 + bob + 2, 5, 2);
  } else {
    ctx.fillRect(x - 2, y + 20 + bob, 5, 2);
    ctx.fillRect(x + w - 3, y + 20 + bob, 5, 2);
  }

  // === HANDS ===
  ctx.fillStyle = "#d4916a";
  if (walkFrame === 1) {
    ctx.fillRect(x - 1, y + 21 + bob + 2, 4, 3);
    ctx.fillRect(x + w - 3, y + 21 + bob - 2, 4, 3);
  } else if (walkFrame === 2) {
    ctx.fillRect(x - 1, y + 21 + bob - 2, 4, 3);
    ctx.fillRect(x + w - 3, y + 21 + bob + 2, 4, 3);
  } else {
    ctx.fillRect(x - 1, y + 22 + bob, 4, 3);
    ctx.fillRect(x + w - 3, y + 22 + bob, 4, 3);
  }

  // === HEAD ===
  const skinColor = "#d4916a";
  const skinShadow = "#b87858";
  ctx.fillStyle = skinColor;
  ctx.fillRect(x + 3, y + 3 + bob, w - 6, 10);
  // Cheek shadow
  ctx.fillStyle = skinShadow;
  ctx.fillRect(x + 3, y + 9 + bob, 2, 3);
  ctx.fillRect(x + w - 5, y + 9 + bob, 2, 3);
  // Neck
  ctx.fillStyle = skinColor;
  ctx.fillRect(x + 7, y + 11 + bob, w - 14, 3);

  // === HAIR ===
  ctx.fillStyle = "#1a0e00";
  ctx.fillRect(x + 3, y + 2 + bob, w - 6, 5);
  ctx.fillRect(x + 3, y + 2 + bob, 3, 9);
  ctx.fillRect(x + w - 6, y + 2 + bob, 3, 7);
  // Hair highlight
  ctx.fillStyle = "#3a2410";
  ctx.fillRect(x + 6, y + 2 + bob, 4, 2);
  // Hair detail — individual pixel strands
  ctx.fillStyle = "#2a1808";
  ctx.fillRect(x + 5, y + 3 + bob, 1, 3);
  ctx.fillRect(x + 8, y + 3 + bob, 1, 2);

  // === EYES ===
  if (direction === 0) {
    // Facing down
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 5, y + 7 + bob, 4, 3);
    ctx.fillRect(x + 11, y + 7 + bob, 4, 3);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(x + 6, y + 8 + bob, 2, 2);
    ctx.fillRect(x + 12, y + 8 + bob, 2, 2);
    // Eye shine
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 6, y + 8 + bob, 1, 1);
    ctx.fillRect(x + 12, y + 8 + bob, 1, 1);
    // Mouth hint
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#8a5a4a";
    ctx.fillRect(x + 8, y + 11 + bob, 4, 1);
    ctx.restore();
  } else if (direction === 1) {
    // Facing up
    ctx.fillStyle = "#1a0e00";
    ctx.fillRect(x + 3, y + 2 + bob, w - 6, 10);
    // Hair back detail
    ctx.fillStyle = "#2a1808";
    ctx.fillRect(x + 5, y + 6 + bob, 2, 4);
    ctx.fillRect(x + 10, y + 5 + bob, 2, 5);
  } else if (direction === 2) {
    // Facing left
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 4, y + 7 + bob, 4, 3);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(x + 4, y + 8 + bob, 2, 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 4, y + 8 + bob, 1, 1);
    // Nose hint
    ctx.fillStyle = skinShadow;
    ctx.fillRect(x + 3, y + 9 + bob, 1, 2);
  } else {
    // Facing right
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + w - 8, y + 7 + bob, 4, 3);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(x + w - 6, y + 8 + bob, 2, 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + w - 5, y + 8 + bob, 1, 1);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(x + w - 4, y + 9 + bob, 1, 2);
  }

  // === HAT (cap style matching HGSS protagonist) ===
  ctx.fillStyle = "#c03030";
  ctx.fillRect(x + 4, y - 2 + bob, w - 8, 5);  // dome
  ctx.fillRect(x + 2, y + 1 + bob, w - 4, 3);   // base
  // Brim
  ctx.fillStyle = "#a02020";
  ctx.fillRect(x + 1, y + 2 + bob, w - 2, 2);
  // Hat band
  ctx.fillStyle = "#202020";
  ctx.fillRect(x + 4, y + 1 + bob, w - 8, 1);
  // Hat emblem (white semicircle on front)
  if (direction !== 1) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + w / 2 - 2, y - 1 + bob, 4, 2);
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(x + w / 2 - 1, y - 2 + bob, 2, 1);
  }
  // Brim extension for facing direction
  if (direction === 2) {
    ctx.fillStyle = "#a02020";
    ctx.fillRect(x - 2, y + 2 + bob, 5, 2);
  } else if (direction === 3) {
    ctx.fillStyle = "#a02020";
    ctx.fillRect(x + w - 3, y + 2 + bob, 5, 2);
  } else if (direction === 0) {
    ctx.fillStyle = "#a02020";
    ctx.fillRect(x, y + 3 + bob, w, 1);
  }
}

// =============================================================================
// INTERACTION PROMPT
// =============================================================================

function drawInteractPrompt(
  ctx: CanvasRenderingContext2D,
  worldX: number,
  worldY: number,
  accentColor: string,
  t: number
) {
  const bounce = Math.sin(t * 4) * 4;
  const ax = worldX;
  const ay = worldY - 44 + bounce;

  // Arrow (chevron)
  ctx.save();
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(ax - 6, ay);
  ctx.lineTo(ax + 6, ay);
  ctx.lineTo(ax, ay + 8);
  ctx.closePath();
  ctx.fill();

  // "SPACE" badge
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  drawRoundedRect(ctx, ax - 24, ay + 10, 48, 14, 3);
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, ax - 24, ay + 10, 48, 14, 3);
  ctx.stroke();
  ctx.fillStyle = accentColor;
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SPACE", ax, ay + 17);
  ctx.restore();
}

// =============================================================================
// DIALOGUE BOX — HGSS-style with proper border pattern
// =============================================================================

function drawDialogueBox(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  building: Building,
  pageIndex: number,
  typewriterChars: number
) {
  const th = THEMES[building.theme];
  const bh = Math.round(canvasH * 0.26);
  const bw = Math.min(canvasW - 32, 760);
  const bx = (canvasW - bw) / 2;
  const by = canvasH - bh - 16;
  const pad = 16;

  // Name tag above box
  const nameTag = building.label.toUpperCase();
  const ntW = nameTag.length * 8 + 24;

  // Name tag background with HGSS-style shape
  ctx.fillStyle = th.sign;
  drawRoundedRect(ctx, bx + 10, by - 24, ntW, 22, 4);
  ctx.fill();
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, bx + 10, by - 24, ntW, 22, 4);
  ctx.stroke();
  drawPixelText(ctx, nameTag, bx + 22, by - 21, 9, th.accent, "left");

  // Main box background — dark with slight theme tint
  ctx.fillStyle = "rgba(5,8,18,0.96)";
  drawRoundedRect(ctx, bx, by, bw, bh, 10);
  ctx.fill();

  // HGSS-style double border with rounded corners
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, bx, by, bw, bh, 10);
  ctx.stroke();

  // Inner border
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, bx + 5, by + 5, bw - 10, bh - 10, 7);
  ctx.stroke();
  ctx.restore();

  // Corner decorations (diamond shapes like HGSS)
  const corners = [
    [bx + 6, by + 6],
    [bx + bw - 10, by + 6],
    [bx + 6, by + bh - 10],
    [bx + bw - 10, by + bh - 10],
  ];
  for (const [cx, cy] of corners) {
    ctx.fillStyle = th.accent;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy);
    ctx.lineTo(cx + 4, cy + 2);
    ctx.lineTo(cx + 2, cy + 4);
    ctx.lineTo(cx, cy + 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Inner top glow
  ctx.save();
  const innerGlow = ctx.createLinearGradient(bx, by, bx, by + bh * 0.3);
  innerGlow.addColorStop(0, th.accent + "15");
  innerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = innerGlow;
  drawRoundedRect(ctx, bx + 3, by + 3, bw - 6, bh - 6, 8);
  ctx.fill();
  ctx.restore();

  // Portrait box (left side)
  const portSize = bh - pad * 2;
  const portX = bx + pad;
  const portY = by + pad;

  // Portrait frame
  ctx.fillStyle = th.sign;
  drawRoundedRect(ctx, portX - 1, portY - 1, portSize + 2, portSize + 2, 4);
  ctx.fill();
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, portX - 1, portY - 1, portSize + 2, portSize + 2, 4);
  ctx.stroke();

  // Portrait icon
  ctx.save();
  ctx.font = `${portSize * 0.45}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    building.theme === "lab" ? "⚗" :
    building.theme === "office" ? "💼" :
    building.theme === "library" ? "📚" :
    building.theme === "arcade" ? "🕹" : "📬",
    portX + portSize / 2, portY + portSize / 2
  );
  ctx.restore();

  const textX = portX + portSize + 16;
  const textMaxW = bw - portSize - pad * 3;
  const page = building.dialoguePages[pageIndex];
  const lines = page.split("\n");
  const isFirstPage = pageIndex === 0;

  if (isFirstPage) {
    // Big title
    ctx.save();
    ctx.fillStyle = th.accent;
    ctx.font = `bold 18px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(lines[0], textX, by + pad + 8);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#52525b";
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("[ SPACE to read ]", textX, by + bh - pad);
    ctx.restore();
  } else {
    // Typewriter text rendering
    const fullText = page;
    const visibleText = fullText.slice(0, typewriterChars);
    const visibleLines = visibleText.split("\n");

    const lineH = 18;
    let ty2 = by + pad + 4;
    for (let li = 0; li < visibleLines.length; li++) {
      const line = visibleLines[li];
      const isTitle = li === 0;
      ctx.save();
      ctx.font = isTitle ? `bold 11px monospace` : `10px monospace`;
      ctx.fillStyle = isTitle ? th.accent : "#dde8f0";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(line, textX, ty2, textMaxW);
      ctx.restore();
      ty2 += lineH;
    }

    // Typewriter cursor
    const isComplete = typewriterChars >= fullText.length;
    if (!isComplete) {
      ctx.save();
      ctx.fillStyle = th.accent;
      ctx.globalAlpha = Math.sin(Date.now() * 0.008) > 0 ? 1 : 0;
      ctx.fillRect(textX + 2, ty2, 7, 11);
      ctx.restore();
    }

    // Page dots
    const total = building.dialoguePages.length;
    const dotGap = 12;
    const dotsStartX = bx + bw / 2 - ((total - 1) * dotGap) / 2;
    for (let i = 0; i < total; i++) {
      ctx.beginPath();
      ctx.arc(dotsStartX + i * dotGap, by + bh - 12, 3, 0, Math.PI * 2);
      ctx.fillStyle = i === pageIndex ? th.accent : "rgba(255,255,255,0.18)";
      ctx.fill();
    }

    // Hint text
    const isLast = pageIndex === building.dialoguePages.length - 1;
    if (isComplete) {
      const arrow = isLast ? "[ ESC close ]" : "[ SPACE next ]";
      ctx.save();
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(Date.now() * 0.006);
      ctx.fillStyle = th.accent;
      ctx.font = "8px monospace";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(arrow, bx + bw - pad, by + bh - pad);
      ctx.restore();
    }
  }
}

// =============================================================================
// HUD
// =============================================================================

function drawHUD(ctx: CanvasRenderingContext2D, cw: number, ch: number) {
  // Top-left: game title card
  ctx.save();
  ctx.fillStyle = "rgba(5,8,18,0.85)";
  drawRoundedRect(ctx, 12, 12, 178, 40, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(59,130,246,0.5)";
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 12, 12, 178, 40, 8);
  ctx.stroke();
  // Inner accent line
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "rgba(59,130,246,0.8)";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 15, 15, 172, 34, 6);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#60a5fa";
  ctx.font = "bold 13px monospace";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText("Satvik's World", 24, 20);
  ctx.fillStyle = "#52525b";
  ctx.font = "8px monospace";
  ctx.fillText("Arrows/WASD  ·  SPACE to interact", 24, 37);
  ctx.restore();

  // Top-right: ESC hint
  ctx.save();
  ctx.fillStyle = "rgba(5,8,18,0.78)";
  drawRoundedRect(ctx, cw - 180, 12, 168, 28, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, cw - 180, 12, 168, 28, 8);
  ctx.stroke();
  ctx.fillStyle = "#52525b";
  ctx.font = "8px monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("ESC — Back to Portfolio", cw - 20, 26);
  ctx.restore();

  void ch; // satisfy linter
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const grassStatesRef = useRef<GrassStateMap>(new Map());
  const spritesRef = useRef<SpriteImages>({ ...EMPTY_SPRITES });

  // Offscreen canvases for split tree sprites (canopy vs trunk for depth)
  const treeSpriteCache = useRef<{
    tree1Canopy: HTMLCanvasElement | null;
    tree1Trunk: HTMLCanvasElement | null;
    tree2Canopy: HTMLCanvasElement | null;
    tree2Trunk: HTMLCanvasElement | null;
    treeDarkCanopy: HTMLCanvasElement | null;
    treeDarkTrunk: HTMLCanvasElement | null;
  }>({
    tree1Canopy: null, tree1Trunk: null,
    tree2Canopy: null, tree2Trunk: null,
    treeDarkCanopy: null, treeDarkTrunk: null,
  });

  const stateRef = useRef({
    x: SPAWN_X,
    y: SPAWN_Y,
    direction: 0 as 0 | 1 | 2 | 3,
    walkFrame: 0,
    walkTimer: 0,
    walkCycle: 0,
    keys: {} as Record<string, boolean>,
    camX: SPAWN_X + PLAYER_W / 2,
    camY: SPAWN_Y + PLAYER_H / 2,
    activeBuilding: null as Building | null,
    dialoguePage: 0,
    dialogueJustOpened: false,
    spaceWasDown: false,
    escWasDown: false,
    typewriterChars: 0,
    typewriterTimer: 0,
    typewriterComplete: false,
    shakeFrames: 0,
    flashAlpha: 0,
    time: 0,
    animationId: 0,
    scale: 1,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    stateRef.current.keys[e.key] = true;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    stateRef.current.keys[e.key] = false;
  }, []);

  // ── SPRITE LOADING ──
  useEffect(() => {
    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); // fallback to code-drawn
        img.src = src;
      });

    /** Split a tree sprite into canopy (top 70%) and trunk (bottom 30%) offscreen canvases */
    function splitTreeSprite(
      img: HTMLImageElement
    ): { canopy: HTMLCanvasElement; trunk: HTMLCanvasElement } | null {
      if (!imgReady(img)) return null;
      const splitRow = Math.round(img.naturalHeight * 0.7);
      const canopy = document.createElement("canvas");
      canopy.width = img.naturalWidth;
      canopy.height = splitRow;
      const cCtx = canopy.getContext("2d");
      if (cCtx) {
        cCtx.imageSmoothingEnabled = false;
        cCtx.drawImage(img, 0, 0, img.naturalWidth, splitRow, 0, 0, img.naturalWidth, splitRow);
      }
      const trunk = document.createElement("canvas");
      trunk.width = img.naturalWidth;
      trunk.height = img.naturalHeight - splitRow;
      const tCtx = trunk.getContext("2d");
      if (tCtx) {
        tCtx.imageSmoothingEnabled = false;
        tCtx.drawImage(
          img,
          0, splitRow, img.naturalWidth, img.naturalHeight - splitRow,
          0, 0, img.naturalWidth, img.naturalHeight - splitRow
        );
      }
      return { canopy, trunk };
    }

    Promise.all([
      loadImg("/game/sprites/ek-house-blue.png"),   // 0 → lab
      loadImg("/game/sprites/ek-house-teal.png"),   // 1 → office
      loadImg("/game/sprites/ek-house-red.png"),    // 2 → library
      loadImg("/game/sprites/ek-building-lg.png"),  // 3 → arcade
      loadImg("/game/sprites/tree-green-1.png"),    // 4
      loadImg("/game/sprites/tree-green-2.png"),    // 5
      loadImg("/game/sprites/tree-dark.png"),        // 6
      loadImg("/game/sprites/ek-tree.png"),          // 7
      loadImg("/game/sprites/ek-rock.png"),          // 8
      loadImg("/game/sprites/ek-lamp.png"),          // 9
      loadImg("/game/sprites/ek-fence.png"),         // 10
    ]).then(([lab, office, library, arcade, t1, t2, tDark, ekT, rock, lamp, fence]) => {
      const s = spritesRef.current;
      s.labHouse = lab;
      s.officeHouse = office;
      s.libraryHouse = library;
      s.arcadeBuilding = arcade;
      s.tree1 = t1;
      s.tree2 = t2;
      s.treeDark = tDark;
      s.ekTree = ekT;
      s.rock = rock;
      s.lamp = lamp;
      s.fence = fence;

      // Pre-split tree sprites for depth layering
      const cache = treeSpriteCache.current;
      const split1 = splitTreeSprite(t1);
      if (split1) { cache.tree1Canopy = split1.canopy; cache.tree1Trunk = split1.trunk; }
      const split2 = splitTreeSprite(t2);
      if (split2) { cache.tree2Canopy = split2.canopy; cache.tree2Trunk = split2.trunk; }
      const splitD = splitTreeSprite(tDark);
      if (splitD) { cache.treeDarkCanopy = splitD.canopy; cache.treeDarkTrunk = splitD.trunk; }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const state = stateRef.current;
    const grassStates = grassStatesRef.current;
    const sprites = spritesRef.current;
    const treeCache = treeSpriteCache.current;

    /** Map building theme to the corresponding sprite image */
    function getSpriteForBuilding(theme: BuildingTheme): HTMLImageElement | null {
      switch (theme) {
        case "lab": return sprites.labHouse;
        case "office": return sprites.officeHouse;
        case "library": return sprites.libraryHouse;
        case "arcade": return sprites.arcadeBuilding;
        default: return null;
      }
    }

    /**
     * Pick a tree sprite variant based on tile position (deterministic).
     * Returns the canopy and trunk canvases plus the original image dimensions.
     */
    function getTreeSpriteForTile(col: number, row: number): {
      canopy: HTMLCanvasElement | null;
      trunk: HTMLCanvasElement | null;
      img: HTMLImageElement | null;
    } {
      const hash = ((col * 73 + row * 37) >>> 0) % 3;
      if (hash === 0 && treeCache.tree1Canopy) {
        return { canopy: treeCache.tree1Canopy, trunk: treeCache.tree1Trunk, img: sprites.tree1 };
      }
      if (hash === 1 && treeCache.tree2Canopy) {
        return { canopy: treeCache.tree2Canopy, trunk: treeCache.tree2Trunk, img: sprites.tree2 };
      }
      if (hash === 2 && treeCache.treeDarkCanopy) {
        return { canopy: treeCache.treeDarkCanopy, trunk: treeCache.treeDarkTrunk, img: sprites.treeDark };
      }
      return { canopy: null, trunk: null, img: null };
    }

    // ── UPDATE ──

    function update() {
      const keys = state.keys;
      const now = Date.now();

      if (!state.activeBuilding) {
        let dx = 0, dy = 0;
        if (keys["ArrowLeft"]  || keys["a"] || keys["A"]) dx -= MOVE_SPEED;
        if (keys["ArrowRight"] || keys["d"] || keys["D"]) dx += MOVE_SPEED;
        if (keys["ArrowUp"]    || keys["w"] || keys["W"]) dy -= MOVE_SPEED;
        if (keys["ArrowDown"]  || keys["s"] || keys["S"]) dy += MOVE_SPEED;

        if (dx !== 0 && dy !== 0) {
          const f = 1 / Math.sqrt(2);
          dx *= f; dy *= f;
        }

        if (dy > 0)      state.direction = 0;
        else if (dy < 0) state.direction = 1;
        else if (dx < 0) state.direction = 2;
        else if (dx > 0) state.direction = 3;

        const moving = dx !== 0 || dy !== 0;
        if (moving) {
          state.walkTimer++;
          if (state.walkTimer >= 10) {
            state.walkTimer = 0;
            state.walkCycle = 1 - state.walkCycle;
            state.walkFrame = state.walkCycle === 0 ? 1 : 2;
          }
        } else {
          state.walkFrame = 0;
          state.walkTimer = 0;
        }

        const newX = state.x + dx;
        const newY = state.y + dy;

        function playerCollidesAt(px: number, py: number): boolean {
          const footY = py + PLAYER_H - 6;
          const checks = [
            [px + 3, footY],
            [px + PLAYER_W - 4, footY],
            [px + 3, py + PLAYER_H - 1],
            [px + PLAYER_W - 4, py + PLAYER_H - 1],
          ];
          for (const [cx2, cy2] of checks) {
            const tc = Math.floor(cx2 / TILE);
            const tr = Math.floor(cy2 / TILE);
            if (isSolid(tc, tr)) return true;
          }
          return false;
        }

        let finalX = state.x, finalY = state.y;

        if (!playerCollidesAt(newX, newY)) {
          finalX = clamp(newX, 4, WORLD_W - PLAYER_W - 4);
          finalY = clamp(newY, 4, WORLD_H - PLAYER_H - 4);
        } else {
          if (!playerCollidesAt(newX, state.y)) {
            finalX = clamp(newX, 4, WORLD_W - PLAYER_W - 4);
          }
          if (!playerCollidesAt(state.x, newY)) {
            finalY = clamp(newY, 4, WORLD_H - PLAYER_H - 4);
          }
        }

        state.x = finalX;
        state.y = finalY;

        // Grass disturbance
        if (moving) {
          const footCol = Math.floor((state.x + PLAYER_W / 2) / TILE);
          const footRow = Math.floor((state.y + PLAYER_H - 4) / TILE);
          const key = `${footCol},${footRow}`;
          const tile = tileAt(footCol, footRow);
          if (tile === Tile.GRASS || tile === Tile.FLOWER_GRASS) {
            const existing = grassStates.get(key);
            if (!existing || now - existing.disturbedAt > 300) {
              grassStates.set(key, {
                disturbedAt: now,
                direction: dx !== 0 ? (dx > 0 ? 1 : -1) : (dy > 0 ? 2 : -2),
              });
            }
          }
        }

        // Interact
        const spaceDown = keys[" "] || keys["Enter"];
        if (spaceDown && !state.spaceWasDown) {
          state.spaceWasDown = true;
          const playerRect: Rect = { x: state.x, y: state.y, w: PLAYER_W, h: PLAYER_H };
          for (const b of BUILDINGS) {
            const br = buildingPixelRect(b);
            const exp = rectExpanded(br, INTERACT_DIST);
            if (rectsOverlap(playerRect, exp)) {
              state.activeBuilding = b;
              state.dialoguePage = 0;
              state.dialogueJustOpened = true;
              state.typewriterChars = 0;
              state.typewriterTimer = 0;
              state.typewriterComplete = false;
              state.shakeFrames = 6;
              state.flashAlpha = 1;
              break;
            }
          }
        }
        if (!spaceDown) state.spaceWasDown = false;

      } else {
        // ── DIALOGUE MODE ──
        const spaceDown = keys[" "] || keys["Enter"];
        const escDown = keys["Escape"];

        if (!state.typewriterComplete) {
          state.typewriterTimer++;
          if (state.typewriterTimer >= 2) {
            state.typewriterTimer = 0;
            const page = state.activeBuilding!.dialoguePages[state.dialoguePage];
            state.typewriterChars = Math.min(state.typewriterChars + 1, page.length);
            if (state.typewriterChars >= page.length) {
              state.typewriterComplete = true;
            }
          }
        }

        if (escDown && !state.escWasDown) {
          state.escWasDown = true;
          state.activeBuilding = null;
          state.dialoguePage = 0;
        }
        if (!escDown) state.escWasDown = false;

        if (spaceDown && !state.spaceWasDown) {
          state.spaceWasDown = true;
          if (!state.dialogueJustOpened) {
            if (!state.typewriterComplete) {
              const page = state.activeBuilding!.dialoguePages[state.dialoguePage];
              state.typewriterChars = page.length;
              state.typewriterComplete = true;
            } else {
              const total = state.activeBuilding!.dialoguePages.length;
              if (state.dialoguePage < total - 1) {
                state.dialoguePage++;
                state.typewriterChars = 0;
                state.typewriterTimer = 0;
                state.typewriterComplete = false;
              } else {
                state.activeBuilding = null;
                state.dialoguePage = 0;
              }
            }
          }
          state.dialogueJustOpened = false;
        }
        if (!spaceDown) {
          state.spaceWasDown = false;
          state.dialogueJustOpened = false;
        }
      }

      // Screen effects decay
      if (state.shakeFrames > 0) state.shakeFrames--;
      if (state.flashAlpha > 0) state.flashAlpha = Math.max(0, state.flashAlpha - 0.06);

      // Camera
      const targetCamX = state.x + PLAYER_W / 2;
      const targetCamY = state.y + PLAYER_H / 2;
      state.camX = lerp(state.camX, targetCamX, 0.12);
      state.camY = lerp(state.camY, targetCamY, 0.12);

      const cw = canvas!.width;
      const ch = canvas!.height;
      const rawScaleX = cw / WORLD_W;
      const rawScaleY = ch / WORLD_H;
      // Use Math.max so the world FILLS the viewport (no dark borders)
      const rawScale = Math.max(rawScaleX, rawScaleY);
      state.scale = Math.max(1, Math.min(3, Math.ceil(rawScale * 2) / 2));

      state.time += 0.016;
    }

    // ── RENDER ──

    function render() {
      if (!canvas || !ctx) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const { scale, time } = state;
      const now = Date.now();

      ctx.imageSmoothingEnabled = false;

      // Screen shake
      const shakeX = state.shakeFrames > 0 ? (Math.random() - 0.5) * 3 : 0;
      const shakeY = state.shakeFrames > 0 ? (Math.random() - 0.5) * 3 : 0;

      const viewW = cw / scale;
      const viewH = ch / scale;

      const camLeft = clamp(state.camX - viewW / 2, 0, Math.max(0, WORLD_W - viewW));
      const camTop  = clamp(state.camY - viewH / 2, 0, Math.max(0, WORLD_H - viewH));

      // Clear entire canvas with dark background first — prevents any white bleed
      ctx.fillStyle = "#0f1729";
      ctx.fillRect(0, 0, cw, ch);

      ctx.save();
      ctx.translate(shakeX, shakeY);
      ctx.scale(scale, scale);
      ctx.translate(-camLeft, -camTop);

      // ── 1. SKY (top area) ──
      const skyH = 2 * TILE;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, skyH);
      skyGrad.addColorStop(0, "#080e20");
      skyGrad.addColorStop(1, "#0f1729");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, WORLD_W, skyH);

      // Stars
      for (const star of STARS) {
        const alpha = 0.35 + 0.65 * Math.abs(Math.sin(time * star.speed + star.phase));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── 2. GROUND TILES ──
      const startCol = Math.max(0, Math.floor(camLeft / TILE) - 1);
      const endCol   = Math.min(WORLD_COLS - 1, Math.ceil((camLeft + viewW) / TILE) + 1);
      const startRow = Math.max(0, Math.floor(camTop / TILE) - 1);
      const endRow   = Math.min(WORLD_ROWS - 1, Math.ceil((camTop + viewH) / TILE) + 1);

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const tile = tileAt(col, row);
          const px = col * TILE;
          const py = row * TILE;

          // ALWAYS draw grass as base layer first — prevents white bleed through sprite transparency
          drawGrassTile(ctx, px, py, col, row, grassStates, now, time);

          // Then draw the actual tile type on top
          if (tile === Tile.PATH) {
            drawPathTile(ctx, px, py, col, row);
          } else if (tile === Tile.BUILDING_BLOCK) {
            ctx.fillStyle = "#5a4a38";
            ctx.fillRect(px, py, TILE, TILE);
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = "#fff";
            if ((col + row) % 2 === 0) ctx.fillRect(px, py, TILE, TILE);
            ctx.restore();
          } else if (tile === Tile.WATER) {
            drawWaterTile(ctx, px, py, col, row, time);
          } else if (tile === Tile.HEDGE) {
            drawHedgeTile(ctx, px, py, col, row);
          }
          // GRASS, FLOWER_GRASS, TREE, FENCE — already have grass base, nothing more needed here
        }
      }

      // ── 3. FLOWER PATCHES ──
      for (const patch of FLOWER_PATCHES) {
        if (
          patch.tx >= startCol - 1 && patch.tx <= endCol + 1 &&
          patch.ty >= startRow - 1 && patch.ty <= endRow + 1
        ) {
          drawFlowerPatch(ctx, patch, time);
        }
      }

      // ── 4. ROCKS ──
      for (const rock of ROCKS) {
        if (
          rock.tx >= startCol - 1 && rock.tx <= endCol + 1 &&
          rock.ty >= startRow - 1 && rock.ty <= endRow + 1
        ) {
          const rockImg = sprites.rock;
          if (imgReady(rockImg)) {
            // Draw sprite rock centered on the rock's position
            const rx = rock.tx * TILE + rock.ox;
            const ry = rock.ty * TILE + rock.oy;
            const spriteW = 20; // target size for rock sprite in world pixels
            const spriteH = 20;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(rockImg, rx - spriteW / 2, ry - spriteH / 2, spriteW, spriteH);
          } else {
            drawRock(ctx, rock);
          }
        }
      }

      // ── 5. BENCHES ──
      for (const bench of BENCHES) {
        if (
          bench.tx >= startCol - 1 && bench.tx <= endCol + 1 &&
          bench.ty >= startRow - 1 && bench.ty <= endRow + 1
        ) {
          drawBench(ctx, bench);
        }
      }

      // ── 6. LAMP POSTS ──
      for (const lp of LAMP_POSTS) {
        if (
          lp.tx >= startCol - 1 && lp.tx <= endCol + 1 &&
          lp.ty >= startRow - 1 && lp.ty <= endRow + 1
        ) {
          drawLampPost(ctx, lp, time);
        }
      }

      // ── 7. TREE TRUNKS ──
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          if (tileAt(col, row) === Tile.TREE) {
            const ts = getTreeSpriteForTile(col, row);
            if (ts.trunk && ts.img && imgReady(ts.img)) {
              // Draw the trunk (bottom 30%) portion of the tree sprite.
              // The tree sprite is drawn so that the bottom aligns with the
              // bottom of the tile and it is horizontally centered.
              const drawW = TILE; // one tile wide
              const fullH = TILE * 1.8; // tree sprite is ~1.8 tiles tall
              const trunkH = fullH * 0.3;
              const canopyH = fullH * 0.7;
              const dx = col * TILE + TILE / 2 - drawW / 2;
              const dy = row * TILE + TILE - fullH + canopyH; // trunk starts after canopy
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(ts.trunk, dx, dy, drawW, trunkH);
            } else {
              drawTreeTrunk(ctx, col, row);
            }
          }
        }
      }

      // ── 8. BUILDING BASES ──
      const sortedBuildings = [...BUILDINGS].sort(
        (a, b2) => a.tileY - b2.tileY
      );

      // Track which buildings successfully drew sprites (skip roof for those)
      const buildingSpriteDrawn = new Set<string>();

      for (const b of sortedBuildings) {
        if (b.theme === "mailbox") {
          drawMailbox(ctx, b);
        } else {
          const bImg = getSpriteForBuilding(b.theme);
          if (imgReady(bImg)) {
            // Draw the sprite scaled to the building's tile footprint.
            // The sprite is drawn so the bottom edge aligns with the bottom
            // of the building's tile area, and it extends upward (buildings
            // are taller than their footprint to show the roof).
            const bx = b.tileX * TILE;
            const by = b.tileY * TILE;
            const bw = b.tileW * TILE;
            const bh = b.tileH * TILE;

            // Let the sprite extend upward beyond the footprint to show the roof.
            // The extra height is proportional to the sprite's aspect ratio.
            const spriteAspect = bImg.naturalHeight / bImg.naturalWidth;
            const drawW = bw;
            const drawH = drawW * spriteAspect;
            // Align bottom of sprite with bottom of building footprint
            const dx = bx;
            const dy = by + bh - drawH;

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(bImg, dx, dy, drawW, drawH);
            buildingSpriteDrawn.add(b.id);
          } else {
            drawBuildingBase(ctx, b);
          }
        }
        drawBuildingSign(ctx, b);
      }

      // ── 9. WELCOME SIGN ──
      drawWelcomeSign(ctx);

      // ── 10. INTERACTION PROMPTS ──
      if (!state.activeBuilding) {
        const playerRect: Rect = { x: state.x, y: state.y, w: PLAYER_W, h: PLAYER_H };
        for (const b of BUILDINGS) {
          const br = buildingPixelRect(b);
          const exp = rectExpanded(br, INTERACT_DIST);
          if (rectsOverlap(playerRect, exp)) {
            const cx2 = br.x + br.w / 2;
            const cy2 = br.y;
            const bth = THEMES[b.theme];
            drawInteractPrompt(ctx, cx2, cy2, bth.accent, time);
            break;
          }
        }
      }

      // ── 11. CHARACTER ──
      drawCharacter(ctx, state.x, state.y, state.direction, state.walkFrame);

      // ── 12. TREE CANOPIES (over character) ──
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          if (tileAt(col, row) === Tile.TREE) {
            const ts = getTreeSpriteForTile(col, row);
            if (ts.canopy && ts.img && imgReady(ts.img)) {
              const drawW = TILE;
              const fullH = TILE * 1.8;
              const canopyH = fullH * 0.7;
              const dx = col * TILE + TILE / 2 - drawW / 2;
              const dy = row * TILE + TILE - fullH; // canopy starts at top
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(ts.canopy, dx, dy, drawW, canopyH);
            } else {
              drawTreeCanopy(ctx, col, row);
            }
          }
        }
      }

      // ── 13. BUILDING ROOFS ──
      // Skip roofs for buildings that used sprite images (the sprite includes the roof)
      for (const b of sortedBuildings) {
        if (b.theme !== "mailbox" && !buildingSpriteDrawn.has(b.id)) {
          drawBuildingRoof(ctx, b);
        }
      }

      // ── Water edge grass overlay — grass tiles next to water get darkened edge ──
      for (const pt of POND_TILES) {
        const { col: wc, row: wr } = pt;
        // Check adjacent grass tiles and add a subtle darkening
        const adjacents: [number, number, string][] = [
          [wc - 1, wr, "right"],
          [wc + 1, wr, "left"],
          [wc, wr - 1, "bottom"],
          [wc, wr + 1, "top"],
        ];
        for (const [ac, ar, side] of adjacents) {
          const at = tileAt(ac, ar);
          if (at === Tile.GRASS || at === Tile.FLOWER_GRASS) {
            const apx = ac * TILE;
            const apy = ar * TILE;
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = PAL.water3;
            if (side === "right") ctx.fillRect(apx + TILE - 4, apy, 4, TILE);
            else if (side === "left") ctx.fillRect(apx, apy, 4, TILE);
            else if (side === "bottom") ctx.fillRect(apx, apy + TILE - 4, TILE, 4);
            else ctx.fillRect(apx, apy, TILE, 4);
            ctx.restore();
          }
        }
      }

      ctx.restore(); // undo camera transform

      // ── SCREEN FLASH ──
      if (state.flashAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = state.flashAlpha * 0.35;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, cw, ch);
        ctx.restore();
      }

      // ── HUD ──
      drawHUD(ctx, cw, ch);

      // ── DIALOGUE BOX ──
      if (state.activeBuilding) {
        drawDialogueBox(
          ctx, cw, ch,
          state.activeBuilding,
          state.dialoguePage,
          state.typewriterChars
        );
      }
    }

    // ── GAME LOOP ──
    function loop() {
      update();
      render();
      state.animationId = requestAnimationFrame(loop);
    }

    state.animationId = requestAnimationFrame(loop);

    // ESC back to portfolio
    function handleEscBack(e: KeyboardEvent) {
      if (e.key === "Escape" && !stateRef.current.activeBuilding) {
        router.push("/");
      }
    }
    window.addEventListener("keydown", handleEscBack);

    return () => {
      cancelAnimationFrame(state.animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleEscBack);
    };
  }, [handleKeyDown, handleKeyUp, router]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
        cursor: "none",
        imageRendering: "pixelated",
        background: "#080e20",
      }}
    />
  );
}
