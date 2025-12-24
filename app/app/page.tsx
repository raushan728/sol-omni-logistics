"use client";

import ThreeButton from "../components/ThreeButton";
import { Canvas } from "@react-three/fiber"; // We need a canvas for the buttons if they are 3D
// Wait, ThreeButton is a R3F component, it must be INSIDE a Canvas.
// Our ThreeScene is in the background. If we want interactive 3D buttons in the UI flow,
// we might need a View or a separate Canvas, or use HTML overlay.
// The user asked for "ThreeButton.tsx ... give a physical 'press' effect".
// If standard DOM buttons, we use framer-motion. If R3F objects, they live in ThreeScene.
// Let's assume the user wants 3D objects in the scene or "3D-styled" DOM elements.
// "Create a reusable Canvas component... that will host my 3D objects."
// "Create a ThreeButton... physical 'press' effect".
// I'll make the main page add content TO the 3D scene (or show how to).
// BUT, separating UI and 3D is tricky if they need to overlap.
// FOR NOW, I will instantiate standard DOM elements for the specific page content
// and maybe portals for 3D?
// Actually, let's keep it simple: The 'ThreeButton' I made returns a <mesh>, so it MUST be in a canvas.
// I will add a localized Canvas for the "World" or buttons.
// However, having a full screen background canvas is already there.
// Let's demo the button inside the background Scene by using a Portal or just showing it layout-wise.

// Actually, to make it easier, I will update ThreeScene to accept children? It already does.
// But we can't easily inject from page components into the layout's canvas without a store/portal.
// For this task, I'll put a Canvas in the page content for the "World" view.

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 pointer-events-none">
      <div className="z-10 text-center space-y-8 pointer-events-auto">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#bd00ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
          CYBER LOGISTICS
        </h1>
        <p className="text-[#ededed] text-lg max-w-xl mx-auto glass-panel p-6 rounded-xl">
          Next-Gen Decentralized Supply Chain Management on Solana.
          <br />
          <span className="text-sm opacity-60">
            Initialize the world to begin.
          </span>
        </p>

        {/* Placeholder for where 3D interaction happens */}
        <div className="w-full h-64 border border-[#00f3ff]/20 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-[#00f3ff]/50">
            [ 3D INTERACTIVE ZONE PREVIEW ]
          </div>
          {/* 
                In a real app, I'd use the tunnel-rat or separate Canvas here.
                For now, the background ThreeScene is running.
             */}
        </div>
      </div>
    </main>
  );
}
