"use client";

import { useState } from "react";
import { Package, Search, MapPin, ArrowRight } from "lucide-react";
import ThreeScene from "../../components/ThreeScene";
import { useRouter } from "next/navigation";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/track/${trackingId}`);
    }
  };

  return (
    <div className="w-full h-screen relative bg-[#020617] text-white overflow-hidden flex flex-col items-center justify-center p-4">
      <ThreeScene className="fixed inset-0 opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] mb-2">
            OMNI-TRACK
          </h1>
          <p className="text-[#00f3ff] text-sm uppercase tracking-widest">
            Global Logistics Network
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00f3ff] to-[#bd00ff] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <form
            onSubmit={handleSearch}
            className="relative flex bg-black border border-white/10 rounded-lg p-1"
          >
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="ENTER TRACKING ID"
              className="flex-1 bg-transparent text-white px-4 py-4 outline-none font-mono tracking-wider placeholder-gray-600"
            />
            <button
              type="submit"
              className="bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] px-6 rounded transition-all"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded border border-white/5 bg-white/5 backdrop-blur">
            <Package className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <span className="text-xs uppercase text-gray-500">Secure</span>
          </div>
          <div className="p-4 rounded border border-white/5 bg-white/5 backdrop-blur">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <span className="text-xs uppercase text-gray-500">Live</span>
          </div>
          <div className="p-4 rounded border border-white/5 bg-white/5 backdrop-blur">
            <Search className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <span className="text-xs uppercase text-gray-500">Global</span>
          </div>
        </div>
      </div>
    </div>
  );
}
