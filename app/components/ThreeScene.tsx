"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Grid, Stars } from "@react-three/drei";
import { Suspense, ReactNode, useRef } from "react";
import * as THREE from "three";

interface ThreeSceneProps {
  children?: ReactNode;
  className?: string;
}

function FloatingObjects() {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (mesh1.current) {
      mesh1.current.rotation.x += delta * 0.2;
      mesh1.current.rotation.y += delta * 0.3;
    }
    if (mesh2.current) {
      mesh2.current.rotation.x -= delta * 0.2;
      mesh2.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <mesh ref={mesh1} position={[-5, 2, -5]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#00f3ff" wireframe />
      </mesh>
      <mesh ref={mesh2} position={[5, -2, -5]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#bd00ff" wireframe />
      </mesh>
    </>
  );
}

export default function ThreeScene({
  children,
  className = "",
}: ThreeSceneProps) {
  return (
    <div
      className={`w-full h-full absolute top-0 left-0 -z-10 ${className}`}
      style={{ pointerEvents: "none", background: "#020617" }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 5, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Cyber Environment */}
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={["#020617", 5, 30]} />

          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#bd00ff" />

          {/* Permanent Neon Grid */}
          <Grid
            infiniteGrid
            fadeDistance={50}
            sectionColor="#bd00ff"
            cellColor="#00f3ff"
            sectionSize={5}
            cellSize={1}
          />

          {/* Permanent Starfield - Tuned for subtlety */}
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={3}
            saturation={0}
            fade
            speed={1}
          />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {children}
          </Float>

          <FloatingObjects />
        </Suspense>
      </Canvas>
    </div>
  );
}
