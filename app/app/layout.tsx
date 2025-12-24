import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "../components/WalletProvider";
import SmoothScroll from "../components/SmoothScroll";
import PageTransition from "../components/PageTransition";
import ThreeScene from "../components/ThreeScene";
import WalletButton from "../components/WalletButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sol-Omni Logistics",
  description: "AI-Driven 3D Logistics ERP on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Leaflet CSS from CDN for reliability */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.className} bg-[#000510] text-white antialiased`}
      >
        <WalletProvider>
          {/* 3D Background - Fixed */}
          <ThreeScene className="fixed inset-0" />

          {/* UI Overlay */}
          <div className="relative z-10 w-full min-h-screen flex flex-col font-sans">
            {/* Header - Fixed absolute to stay on top but allow scroll behind if needed, or just normal flow */}
            <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-[#020617]/90 to-transparent pointer-events-none transition-all duration-300">
              <div className="pointer-events-auto flex items-center gap-4">
                <div className="font-bold text-2xl tracking-[0.2em] text-[#00f3ff] drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] filter contrast-125">
                  SOL-OMNI
                </div>
              </div>
              <div className="pointer-events-auto flex items-center gap-4">
                <WalletButton />
              </div>
            </header>

            {/* Main Content - Padded from top to avoid header overlap */}
            <main className="flex-1 flex flex-col w-full pt-24">
              <SmoothScroll>
                <PageTransition>{children}</PageTransition>
              </SmoothScroll>
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
