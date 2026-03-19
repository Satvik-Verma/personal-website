"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

// ─── Keycap data — vibrant colors like the reference ────────────────────────

const KEYCAPS = [
  { label: "JS", color: "#f0db4f", textColor: "#323330" },
  { label: "TS", color: "#3178c6", textColor: "#ffffff" },
  { label: "Py", color: "#3b82f6", textColor: "#ffffff" },
  { label: "C++", color: "#00599c", textColor: "#ffffff" },
  { label: "React", color: "#61dafb", textColor: "#20232a" },
  { label: "NestJS", color: "#e0234e", textColor: "#ffffff" },
  { label: "AWS", color: "#ff9900", textColor: "#232f3e" },
  { label: "PG", color: "#336791", textColor: "#ffffff" },
  { label: "Redis", color: "#dc382d", textColor: "#ffffff" },
  { label: "AI", color: "#8b5cf6", textColor: "#ffffff" },
  { label: "Node", color: "#339933", textColor: "#ffffff" },
  { label: "Git", color: "#f05032", textColor: "#ffffff" },
  { label: "Docker", color: "#2496ed", textColor: "#ffffff" },
  { label: "K8s", color: "#326ce5", textColor: "#ffffff" },
  { label: "Azure", color: "#0078d4", textColor: "#ffffff" },
  { label: "GQL", color: "#e10098", textColor: "#ffffff" },
];

// ─── Layout ─────────────────────────────────────────────────────────────────

const COLS = 4;
const KEY_SIZE = 0.72;
const KEY_HEIGHT = 0.55; // Tall chunky keycaps like candy blocks
const KEY_GAP = 0.12;
const KEY_STEP = KEY_SIZE + KEY_GAP;
const KEY_RADIUS = 0.1;

const BASE_PAD = 0.3;
const GRID_W = COLS * KEY_STEP - KEY_GAP;
const ROWS = Math.ceil(KEYCAPS.length / COLS);
const GRID_D = ROWS * KEY_STEP - KEY_GAP;
const BASE_W = GRID_W + BASE_PAD * 2;
const BASE_D = GRID_D + BASE_PAD * 2;
const BASE_H = 0.18;

const START_X = -GRID_W / 2 + KEY_SIZE / 2;
const START_Z = -GRID_D / 2 + KEY_SIZE / 2;
const CAP_Y = BASE_H / 2 + KEY_HEIGHT / 2 + 0.01;

// ─── Seeded random for deterministic slight offsets ─────────────────────────

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

// ─── Keycap component ───────────────────────────────────────────────────────

function Keycap({
  position,
  color,
  textColor,
  label,
}: {
  position: [number, number, number];
  color: string;
  textColor: string;
  label: string;
}) {
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const emissive = useMemo(() => new THREE.Color(color).multiplyScalar(0.1), [color]);

  // Tiny random offset and rotation for organic feel
  const h = hash(label);
  const offsetX = ((h % 100) - 50) / 2000;
  const offsetZ = (((h >> 4) % 100) - 50) / 2000;
  const tiltZ = ((h % 60) - 30) / 8000;

  return (
    <group
      position={[position[0] + offsetX, position[1], position[2] + offsetZ]}
      rotation={[0, 0, tiltZ]}
    >
      {/* Keycap body — tall chunky block */}
      <RoundedBox
        args={[KEY_SIZE, KEY_HEIGHT, KEY_SIZE]}
        radius={KEY_RADIUS}
        smoothness={4}
        castShadow
      >
        <meshPhysicalMaterial
          color={baseColor}
          emissive={emissive}
          emissiveIntensity={0.8}
          metalness={0.05}
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          envMapIntensity={2.0}
          ior={1.5}
          specularIntensity={1.0}
          specularColor={new THREE.Color("#ffffff")}
          sheen={0.5}
          sheenRoughness={0.25}
          sheenColor={new THREE.Color(color)}
        />
      </RoundedBox>

      {/* Concave dish — darker inset on top face */}
      <RoundedBox
        args={[KEY_SIZE - 0.12, 0.04, KEY_SIZE - 0.12]}
        radius={0.06}
        smoothness={3}
        position={[0, KEY_HEIGHT / 2 - 0.01, 0]}
      >
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.85)}
          metalness={0.05}
          roughness={0.35}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Label on top */}
      <Text
        position={[0, KEY_HEIGHT / 2 + 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={label.length > 4 ? 0.12 : 0.18}
        maxWidth={KEY_SIZE - 0.15}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color={textColor}
        fontWeight={700}
        outlineWidth={0.005}
        outlineColor="rgba(0,0,0,0.4)"
      >
        {label}
      </Text>
    </group>
  );
}

// ─── LED strip ──────────────────────────────────────────────────────────────

function LEDStrip() {
  return (
    <mesh position={[0, -BASE_H / 2 + 0.01, BASE_D / 2 + 0.02]} rotation={[0.1, 0, 0]}>
      <planeGeometry args={[BASE_W - 0.3, 0.06]} />
      <meshBasicMaterial color="#4a9eff" transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Main keyboard ──────────────────────────────────────────────────────────

export default function FloatingKeyboard() {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const smoothPointer = useRef(new THREE.Vector2(0, 0));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Float
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.12;
      groupRef.current.position.z = Math.sin(t * 0.3 + 1.2) * 0.03;
      // Rock
      groupRef.current.rotation.x = 0.55 + Math.sin(t * 0.4 + 0.5) * 0.02;
      groupRef.current.rotation.y = -0.35 + Math.cos(t * 0.35) * 0.015;
      groupRef.current.rotation.z = 0.08 + Math.sin(t * 0.28 + 2.0) * 0.008;
    }

    if (tiltRef.current) {
      smoothPointer.current.x += (pointer.x - smoothPointer.current.x) * 0.05;
      smoothPointer.current.y += (pointer.y - smoothPointer.current.y) * 0.05;
      tiltRef.current.rotation.x = -smoothPointer.current.y * 0.1;
      tiltRef.current.rotation.y = smoothPointer.current.x * 0.1;
    }
  });

  return (
    <group ref={tiltRef} position={[2.2, 0, 0]} scale={0.6}>
      <group ref={groupRef} rotation={[0.55, -0.35, 0.08]}>
        {/* Keyboard base */}
        <RoundedBox
          args={[BASE_W, BASE_H, BASE_D]}
          radius={0.15}
          smoothness={6}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial
            color="#0d0d0f"
            metalness={0.8}
            roughness={0.18}
            envMapIntensity={1.4}
          />
        </RoundedBox>

        {/* Inner plate */}
        <RoundedBox
          args={[BASE_W - 0.2, BASE_H + 0.005, BASE_D - 0.2]}
          radius={0.12}
          smoothness={4}
        >
          <meshStandardMaterial
            color="#161618"
            metalness={0.6}
            roughness={0.3}
            envMapIntensity={0.9}
          />
        </RoundedBox>

        <LEDStrip />

        {/* Keycaps */}
        {KEYCAPS.map((key, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const pos: [number, number, number] = [
            START_X + col * KEY_STEP,
            CAP_Y,
            START_Z + row * KEY_STEP,
          ];
          return (
            <Keycap
              key={key.label}
              position={pos}
              color={key.color}
              textColor={key.textColor}
              label={key.label}
            />
          );
        })}
      </group>
    </group>
  );
}
