"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center z-10 pointer-events-none">
      {/* 3D Scene Background is handled in layout.tsx */}

      <div className="pointer-events-auto bg-black/40 backdrop-blur-md p-10 rounded-2xl border border-glass-border shadow-[0_0_50px_rgba(0,243,255,0.2)]">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] mb-4">
          SOL-OMNI
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-300 tracking-[0.5em] font-light mb-8">
          CYBER LOGISTICS
        </h2>

        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="cursor-pointer inline-block px-8 py-4 bg-neon-blue/10 border border-neon-blue hover:bg-neon-blue/20 transition-all rounded-none text-neon-blue font-bold tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
              onClick={() => router.push("/onboarding")}
            >
              ENTER WORLD
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
