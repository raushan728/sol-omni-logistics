"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, Grid } from "@react-three/drei";
import { Suspense, ReactNode } from "react";
import ThreeButton from "./ThreeButton";

interface ThreeSceneProps {
  children?: ReactNode;
  className?: string;
}

export default function ThreeScene({
  children,
  className = "",
}: ThreeSceneProps) {
  return (
    <div className={`w-full h-full absolute top-0 left-0 -z-10 ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 5, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} color="#00f3ff" />
          <pointLight position={[10, 10, 10]} intensity={1} color="#bd00ff" />

          <Grid
            infiniteGrid
            fadeDistance={50}
            sectionColor="#bd00ff"
            cellColor="#00f3ff"
            sectionSize={5}
            cellSize={1}
          />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <ThreeButton
              position={[0, 0, 0]}
              text="ENTER WORLD"
              onClick={() => console.log("Entered")}
            />
          </Float>

          {/* Floating Particles or accents */}
          <mesh position={[-5, 2, -5]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#00f3ff" wireframe />
          </mesh>
          <mesh position={[5, -2, -5]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#bd00ff" wireframe />
          </mesh>

          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
