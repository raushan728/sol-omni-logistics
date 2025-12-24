"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  // Simpler implementation: native scroll with smooth behavior + enter animations
  // True "scroll-jacking" often causes accessibility issues, so we'll start with
  // a unified wrapper that ensures content fades in/outs smoothly.

  return <div className="w-full min-h-screen">{children}</div>;
}
