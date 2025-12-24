import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "../components/WalletProvider";
import SmoothScroll from "../components/SmoothScroll";
import PageTransition from "../components/PageTransition";
import ThreeScene from "../components/ThreeScene";
import WalletButton from "../components/WalletButton";

export const metadata: Metadata = {
  title: "Sol-Omni Logistics",
  description: "High-end 3D Logistics ERP on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-dark-bg text-foreground overflow-hidden">
        <WalletProvider>
          {/* Background 3D Layer */}
          <div className="fixed inset-0 z-0">
            <ThreeScene />
          </div>

          {/* Foreground UI */}
          <div className="relative z-10 w-full h-full flex flex-col">
            <header className="p-6 flex justify-between items-center z-50 pointer-events-none">
              <div className="text-xl font-bold tracking-widest text-[#00f3ff] pointer-events-auto cursor-pointer">
                SOL-OMNI
              </div>
              <div className="pointer-events-auto">
                <WalletButton />
              </div>
            </header>
            <SmoothScroll>
              <PageTransition>{children}</PageTransition>
            </SmoothScroll>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
