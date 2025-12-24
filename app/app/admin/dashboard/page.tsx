"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const CyberMap = dynamic(
  () => import("../../../components/Dashboard/CyberMap"),
  { ssr: false }
);
import useOmniProgram from "../../../hooks/useOmniProgram";
import { Package, Truck, Users, Activity, Settings } from "lucide-react";
import ThreeScene from "../../../components/ThreeScene";

import Link from "next/link"; // Added Link
import { Loader2 } from "lucide-react"; // Added Loader

export default function AdminDashboard() {
  const { getAllShipments, createShipment } = useOmniProgram();
  const [shipments, setShipments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeTrucks: 0,
    totalShipments: 0,
    totalRevenue: "0 SOL",
  });

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShipment, setNewShipment] = useState({
    receiver: "",
    price: "",
    trackingId: "",
  });
  const [creating, setCreating] = useState(false);

  // Poll for updates (Real-time dashboard)
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllShipments();
      if (data) {
        setShipments(data);

        // Calculate Stats
        const active = data.filter(
          (s: any) => s.account.status !== "Delivered"
        ).length;
        const revenue = data.reduce(
          (acc: number, curr: any) => acc + (Number(curr.account.price) || 0),
          0
        );

        setStats({
          activeTrucks: active,
          totalShipments: data.length,
          totalRevenue: `${(revenue / 1000000000).toFixed(2)} SOL`,
        });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [getAllShipments]);
  const markers = shipments.map((s) => ({
    id: s.publicKey.toString(),
    type: "truck" as const,
    position: {
      lat: s.account.currentLat || 37.7749,
      lng: s.account.currentLng || -122.4194,
    },
    label: s.account.trackingId || "Unknown",
  }));

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const tid =
        newShipment.trackingId || `SHIP-${Math.floor(Math.random() * 10000)}`;
      // receiver, price, trackingId
      await createShipment(
        newShipment.receiver,
        Number(newShipment.price),
        tid
      );
      alert("Shipment Created Successfully!");
      setShowCreateModal(false);
      setNewShipment({ receiver: "", price: "", trackingId: "" });
      // Force refresh logic could go here
    } catch (err) {
      console.error(err);
      alert("Failed to create shipment.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-6rem)] relative text-white overflow-hidden flex">
      {/* Note: ThreeScene removed as it is global now */}

      {/* Sidebar with Neon Glow */}
      <aside className="w-20 md:w-64 border-r border-[#00f3ff]/20 bg-slate-950/60 backdrop-blur-md flex flex-col z-40 shadow-[5px_0_30px_rgba(0,243,255,0.1)] h-full">
        <div className="p-6">
          <h1 className="hidden md:block text-[#00f3ff] font-bold text-xl tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            COMMAND
          </h1>
          <div className="md:hidden text-[#00f3ff] font-bold text-xl">CMD</div>
        </div>

        <nav className="flex-1 space-y-4 px-4 mt-8">
          <Link href="/admin/dashboard">
            <div className="flex items-center gap-4 p-3 rounded-lg cursor-pointer bg-[#00f3ff]/10 text-[#00f3ff] border border-[#00f3ff]/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <Activity className="w-6 h-6" />
              <span className="hidden md:block font-medium tracking-wide text-sm">
                Overview
              </span>
            </div>
          </Link>
          <Link href="/admin/fleet">
            <div className="flex items-center gap-4 p-3 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Truck className="w-6 h-6" />
              <span className="hidden md:block font-medium tracking-wide text-sm">
                Fleet
              </span>
            </div>
          </Link>
          <Link href="/admin/shipments">
            <div className="flex items-center gap-4 p-3 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Package className="w-6 h-6" />
              <span className="hidden md:block font-medium tracking-wide text-sm">
                Shipments
              </span>
            </div>
          </Link>
          <Link href="/admin/settings">
            <div className="flex items-center gap-4 p-3 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Settings className="w-6 h-6" />
              <span className="hidden md:block font-medium tracking-wide text-sm">
                Settings
              </span>
            </div>
          </Link>
        </nav>

        {/* Create Button */}
        <div className="p-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full py-3 bg-[#bd00ff] hover:bg-[#a200db] rounded-lg text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(189,0,255,0.4)] transition-all active:scale-95 border border-[#bd00ff]/50"
          >
            + New Shipment
          </button>
        </div>

        {/* Active Shipments Mini-List */}
        <div className="p-4 border-t border-white/10 hidden md:block bg-black/20">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
            Recent Activity
          </h3>
          <div className="space-y-2 h-32 overflow-y-auto custom-scrollbar">
            {shipments.slice(0, 5).map((s, i) => (
              <div key={i} className="text-xs flex justify-between">
                <span className="text-white font-mono">
                  {s.account.trackingId}
                </span>
                <span
                  className={`text-${
                    s.account.status === "Delivered" ? "green" : "yellow"
                  }-400 font-bold`}
                >
                  {s.account.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-0 h-full">
        {/* Top Stats Bar */}
        <header className="h-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between px-8 z-30 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            <h2 className="text-lg font-bold tracking-wider text-white">
              GLOBAL OPS{" "}
              <span className="text-gray-500 text-sm font-normal">
                | LIVE MAP
              </span>
            </h2>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded bg-black/30 border border-white/5">
              <Truck className="w-5 h-5 text-[#bd00ff]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Fleet Active
                </span>
                <span className="text-sm font-bold text-white leading-none">
                  {stats.activeTrucks} UNITS
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded bg-black/30 border border-white/5">
              <Package className="w-5 h-5 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Volume
                </span>
                <span className="text-sm font-bold text-white leading-none">
                  {stats.totalShipments} BOXES
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded bg-black/30 border border-white/5">
              <Activity className="w-5 h-5 text-[#00ff9d]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Revenue
                </span>
                <span className="text-sm font-bold text-white leading-none">
                  {stats.totalRevenue}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Map Area */}
        <div className="flex-1 relative z-0 w-full h-full">
          <CyberMap
            zoom={4} // Zoomed out for global view
            markers={markers}
          />

          {/* Overlay Cards */}
          <div className="absolute top-4 right-4 w-72 bg-slate-950/80 backdrop-blur-md border border-white/10 p-4 rounded-xl pointer-events-auto z-[400] shadow-2xl">
            <h3 className="text-[#00f3ff] text-xs font-bold uppercase mb-3 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Live Feed
            </h3>
            <div className="space-y-3">
              {shipments.length > 0 ? (
                shipments.slice(0, 3).map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
                    <span className="text-gray-300">
                      ID{" "}
                      <span className="text-white font-mono">
                        {s.account.trackingId}
                      </span>
                    </span>
                    <span className="ml-auto text-gray-500 font-mono text-[10px]">
                      Just Now
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-xs italic">
                  No active data stream
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#020617] border border-[#bd00ff]/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(189,0,255,0.2)] relative">
            {/* 3D Decorative Modal Elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#bd00ff]/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-[#00f3ff]/20 blur-3xl rounded-full pointer-events-none" />

            <h2 className="text-2xl font-bold text-white mb-6 tracking-widest uppercase text-center flex items-center justify-center gap-3">
              <Package className="w-6 h-6 text-[#bd00ff]" /> New Shipment
            </h2>
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#bd00ff] uppercase tracking-wider">
                  Receiver Wallet
                </label>
                <input
                  type="text"
                  value={newShipment.receiver}
                  onChange={(e) =>
                    setNewShipment({ ...newShipment, receiver: e.target.value })
                  }
                  placeholder="Public Key"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#bd00ff]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#bd00ff] uppercase tracking-wider">
                  Price (SOL)
                </label>
                <input
                  type="number"
                  value={newShipment.price}
                  onChange={(e) =>
                    setNewShipment({ ...newShipment, price: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#bd00ff]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#bd00ff] uppercase tracking-wider">
                  Tracking ID (Optional)
                </label>
                <input
                  type="text"
                  value={newShipment.trackingId}
                  onChange={(e) =>
                    setNewShipment({
                      ...newShipment,
                      trackingId: e.target.value,
                    })
                  }
                  placeholder="Auto-generated if empty"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#bd00ff]"
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-lg font-bold uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 bg-[#bd00ff] hover:bg-[#a200db] text-white rounded-lg font-bold uppercase text-xs shadow-[0_0_20px_rgba(189,0,255,0.4)] flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Initialize"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
