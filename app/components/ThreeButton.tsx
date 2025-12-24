"use client";

import { Text } from "@react-three/drei";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ThreeButtonProps {
  position?: [number, number, number];
  text?: string;
  onClick?: () => void;
  color?: string;
}

export default function ThreeButton({
  position = [0, 0, 0],
  text = "Button",
  onClick,
  color = "#00f3ff",
}: ThreeButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  // Smooth animation using lerp
  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = pressed ? 0.95 : hovered ? 1.05 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 10
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        setHovered(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => {
        setPressed(false);
        if (onClick) onClick();
      }}
    >
      {/* Glow Effect (Backplate) */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[3.2, 1.2, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Button Body */}
      <mesh>
        <boxGeometry args={[3, 1, 0.2]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Text Label */}
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.4}
        color={hovered ? color : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        // font="/fonts/Inter-Bold.ttf" // Commented out to use default if font missing
      >
        {text.toUpperCase()}
      </Text>
    </group>
  );
}
