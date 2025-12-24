"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styled from "styled-components"; // Or use CSS/Tailwind wrapper

// We can wrap the standard button or build a custom one.
// For "Cyber-Enterprise", let's wrap it to match the neon theme.

export default function WalletButton() {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative">
        <WalletMultiButton
          className="!bg-black !text-white !font-bold !border !border-glass-border !rounded-lg hover:!scale-105 transition-transform"
          style={{
            background: "#050505",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
}
