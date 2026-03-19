"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import FloatingKeyboard from "./FloatingKeyboard";
import * as THREE from "three";

export default function HeroCanvas() {
  return (
    <Canvas
      style={{ background: "transparent", position: "absolute", inset: 0 }}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
      dpr={[1, 1.5]}
    >
      {/* Ambient fill — keep low so keycap colors punch through */}
      <ambientLight intensity={0.25} />

      {/* Key light — top-right, cool blue, main highlight on keycap faces */}
      <pointLight position={[8, 10, 6]} intensity={140} color="#4a9eff" decay={2} />

      {/* Rim light — left side, purple, wraps the keyboard edge */}
      <pointLight position={[-9, -4, 5]} intensity={90} color="#9b6dff" decay={2} />

      {/* Warm accent — slightly below, creates warm reflection on base underside */}
      <pointLight position={[2, -8, -2]} intensity={60} color="#ff9d4a" decay={2} />

      {/* Teal fill — top-left, lifts shadows on the keycap faces */}
      <pointLight position={[-6, 10, 3]} intensity={45} color="#2dd4bf" decay={2} />

      {/* Directional key light for crisp keycap shadows */}
      <directionalLight
        position={[4, 9, 6]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Studio HDRI for realistic reflections on the metallic base and clearcoat keycaps */}
      <Environment preset="studio" />

      <FloatingKeyboard />
    </Canvas>
  );
}
