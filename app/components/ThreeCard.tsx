"use client";

import { Text, useCursor, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

interface ThreeCardProps {
  position: [number, number, number];
  title: string;
  role: string;
  color: string;
  iconType: "warehouse" | "truck" | "package";
  onClick: () => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

function WarehouseIcon({
  color,
  hovered,
}: {
  color: string;
  hovered: boolean;
}) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial
          color={color}
          wireframe={!hovered}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
        />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.2, 0.5, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.4}
          wireframe
        />
      </mesh>
    </group>
  );
}

function TruckIcon({ color, hovered }: { color: string; hovered: boolean }) {
  return (
    <group>
      <mesh position={[0.2, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.6]} />
        <meshStandardMaterial
          color={color}
          wireframe={!hovered}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.2}
        />
      </mesh>
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.2}
        />
      </mesh>
      <mesh position={[-0.5, -0.3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.5, -0.3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function PackageIcon({ color, hovered }: { color: string; hovered: boolean }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color={color} linewidth={2} />
      </lineSegments>
      <mesh position={[0, 0, 0]} scale={1.05}>
        <boxGeometry args={[1, 0.1, 1.05]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
      <mesh position={[0, 0, 0]} scale={1.05} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1, 0.1, 1.05]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
    </group>
  );
}

export default function ThreeCard({
  position,
  title,
  role,
  color,
  iconType,
  onClick,
  isHovered,
  onHover,
}: ThreeCardProps) {
  const groupRef = useRef<THREE.Group>(null);

  useCursor(isHovered);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      const targetScale = isHovered ? 1.05 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 10
      );

      if (isHovered) {
        const mouseX = state.mouse.x * 0.5;
        const mouseY = state.mouse.y * 0.5;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          -mouseY,
          delta * 5
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          mouseX,
          delta * 5
        );
      } else {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          0,
          delta * 5
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          0,
          delta * 5
        );
      }
    }
  });

  return (
    <group position={position}>
      {/* HITBOX */}
      <mesh
        visible={false}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(false);
        }}
      >
        <boxGeometry args={[3.8, 6, 1]} />
      </mesh>

      <group ref={groupRef}>
        {/* Glass Backplate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.5, 5, 0.2]} />
          <meshPhysicalMaterial
            color={color}
            transparent
            opacity={0.1}
            roughness={0.1}
            metalness={0.9}
            transmission={0.5}
            thickness={0.5}
            emissive={color}
            emissiveIntensity={isHovered ? 0.2 : 0}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(3.5, 5, 0.2)]} />
            <lineBasicMaterial
              color={color}
              transparent
              opacity={isHovered ? 1 : 0.5}
            />
          </lineSegments>
        </mesh>

        {/* Floating Icon */}
        <group position={[0, 1.5, 0.5]} scale={0.8}>
          {iconType === "warehouse" && (
            <WarehouseIcon color={color} hovered={isHovered} />
          )}
          {iconType === "truck" && (
            <TruckIcon color={color} hovered={isHovered} />
          )}
          {iconType === "package" && (
            <PackageIcon color={color} hovered={isHovered} />
          )}
        </group>

        {/* Text */}
        <Text
          position={[0, -0.5, 0.3]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {role}
        </Text>
        <Text
          position={[0, -1.0, 0.3]}
          fontSize={0.16}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {title.toUpperCase()}
        </Text>

        {/* HTML Button - High Contrast Neon */}
        <Html position={[0, -2, 0.3]} transform center>
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 0 25px cyan" }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="px-8 py-3 rounded-none font-bold text-xs tracking-widest uppercase transition-colors duration-300 pointer-events-auto bg-black/80 text-white border border-white/20 backdrop-blur-md cursor-pointer"
            style={{
              borderColor: color,
              textShadow: `0 0 10px ${color}`,
            }}
          >
            Select
          </motion.button>
        </Html>
      </group>
    </group>
  );
}
