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
          <div className="relative z-10 w-full min-h-screen flex flex-col">
            {/* Header */}
            <header className="w-full p-6 flex justify-between items-center bg-transparent pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-4">
                <div className="font-bold text-xl tracking-widest text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                  SOL-OMNI
                </div>
              </div>
              <div className="pointer-events-auto flex items-center gap-4">
                <WalletButton />
              </div>
            </header>

            {/* Main Content */}
            <SmoothScroll>
              <PageTransition>{children}</PageTransition>
            </SmoothScroll>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
