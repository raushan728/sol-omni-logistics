"use client";

import { useState, useEffect } from "react";
import { Truck, Navigation, AlertOctagon } from "lucide-react";
import ThreeScene from "../../../components/ThreeScene";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
const CyberMap = dynamic(
  () => import("../../../components/Dashboard/CyberMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-900 animate-pulse flex items-center justify-center text-[#00f3ff] font-mono text-xs">
        INITIALIZING SATELLITE UPLINK...
      </div>
    ),
  }
);
import useOmniProgram from "../../../hooks/useOmniProgram";

import { formatStatus, formatPrice } from "../../../utils/format";

export default function DriverDashboard() {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false); // Client-side check

  useEffect(() => {
    setMounted(true);
  }, []);
  const { getAllShipments, updateLocation, toggleDriverStatus } =
    useOmniProgram();
  const [activeShipment, setActiveShipment] = useState<any>(null);
  const [status, setStatus] = useState("Active");
  const [gpsLoading, setGpsLoading] = useState(false);

  // 3D Loader state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch assigned shipment
    const fetch = async () => {
      if (!publicKey) return;

      setIsLoading(true);
      console.log("Connected Driver Wallet:", publicKey.toString());

      const all = await getAllShipments(); // Fetch ALL (Raw)

      console.log("All Shipments Found:", all.length);

      if (all) {
        // Filter: find ALL shipments where currentDriver matches this wallet
        // Note: Anchor converts snake_case to camelCase -> currentDriver
        const myMissions = all.filter((s: any) => {
          const driverKey = s.account.currentDriver
            ? s.account.currentDriver.toString()
            : "";
          const myKey = publicKey.toString();
          const status = formatStatus(s.account.status); // Allow Created, InTransit etc

          return driverKey === myKey && status !== "Delivered";
        });

        console.log("Missions found for Driver:", myMissions);

        if (myMissions.length > 0) {
          const myShipment = myMissions[0]; // Take the first active one
          console.log("Setting Active Mission:", myShipment.account.trackingId);
          setActiveShipment(myShipment);
        } else {
          console.log("No active mission found for this driver.");
          setActiveShipment(null);
        }
      }
      setIsLoading(false);
    };

    fetch();
    // Poll for updates
    const interval = setInterval(fetch, 10000);
    return () => clearInterval(interval);
  }, [publicKey, getAllShipments]);

  const handleSyncGPS = () => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await updateLocation(latitude, longitude);
          alert("GPS Synced On-Chain!");
        } catch (e) {
          console.error(e);
          alert("Failed to sync GPS.");
        } finally {
          setGpsLoading(false);
        }
      });
    } else {
      alert("Geolocation not available.");
      setGpsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = status === "Active" ? "Sick" : "Active";
    try {
      await toggleDriverStatus(newStatus);
      setStatus(newStatus);
      alert(`Status updated to ${newStatus}`);
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  const mapMarkers = activeShipment
    ? [
        {
          id: "my-truck",
          position: {
            lat: activeShipment.account.currentLat || 0,
            lng: activeShipment.account.currentLng || 0,
          },
          type: "truck" as const,
          label: "MY TRUCK",
        },
      ]
    : [];

  return (
    <div className="w-full flex-1 relative text-white flex flex-col overflow-hidden">
      {/* ThreeScene is Global */}

      {/* HUD Header */}
      <header className="relative z-10 p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#00ff9d] drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
            DRIVER HUD
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            UNIT:{" "}
            {publicKey ? publicKey.toString().slice(0, 8) : "DISCONNECTED"}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 border rounded font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
              status === "Active"
                ? "border-[#00ff9d]/30 text-[#00ff9d] bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20"
                : "border-red-500/30 text-red-500 bg-red-500/10 hover:bg-red-500/20"
            }`}
          >
            {status === "Active" ? (
              <Truck className="w-4 h-4" />
            ) : (
              <AlertOctagon className="w-4 h-4" />
            )}
            {status}
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-0 flex h-full">
        {/* Map Section */}
        <div className="flex-1 relative border-r border-white/10 h-full">
          {mounted && <CyberMap zoom={6} markers={mapMarkers} />}
          {/* Floating Controls */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-[400] w-full flex justify-center pointer-events-none">
            {activeShipment ? (
              <button
                onClick={handleSyncGPS}
                disabled={gpsLoading}
                className="pointer-events-auto px-8 py-4 bg-[#bd00ff] hover:bg-[#a200db] rounded-full text-white font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(189,0,255,0.6)] flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 border border-[#bd00ff]/50 backdrop-blur-sm"
              >
                {gpsLoading ? (
                  <Navigation className="animate-spin w-5 h-5" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
                Sync GPS
              </button>
            ) : (
              <div className="px-6 py-3 bg-black/50 backdrop-blur text-gray-400 text-xs uppercase font-bold border border-white/10 rounded-full">
                Awaiting Assignment...
              </div>
            )}
          </div>
        </div>

        {/* Shipment Info Panel */}
        <aside className="w-80 bg-slate-950/80 backdrop-blur-xl p-6 flex flex-col border-l border-white/10 h-full shadow-2xl">
          <h2 className="text-[#00f3ff] text-sm font-bold uppercase mb-6 tracking-wider border-b border-[#00f3ff]/20 pb-2 flex items-center gap-2">
            <Truck className="w-4 h-4" /> Current Mission
          </h2>

          {activeShipment ? (
            <div className="space-y-6 relative">
              {/* Decorative holographic effect */}
              <div className="absolute -inset-4 bg-[#00ff9d]/5 blur-xl -z-10 rounded-full opacity-50" />

              <div>
                <label className="text-gray-500 text-xs uppercase font-bold">
                  Tracking ID
                </label>
                <div className="text-xl font-mono text-white dashed-underline drop-shadow-md">
                  {activeShipment.account.trackingId}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase font-bold">
                  Destination
                </label>
                <div className="text-sm text-gray-300 bg-black/30 p-2 rounded border border-white/5 mt-1">
                  {activeShipment.account.destination
                    ? activeShipment.account.destination
                        .toString()
                        .slice(0, 20) + "..."
                    : "Coordinates Encrypted"}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase font-bold">
                  Cargo Value
                </label>
                <div className="text-sm text-[#bd00ff] font-mono font-bold">
                  {formatPrice(activeShipment.account.price)} SOL
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-xs uppercase font-bold">
                  Status
                </label>
                <div className="text-lg text-[#00ff9d] font-bold uppercase drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">
                  {formatStatus(activeShipment.account.status)}
                </div>
              </div>

              <div className="mt-auto pt-8">
                <div className="p-4 rounded bg-[#00ff9d]/5 border border-[#00ff9d]/20 text-[#00ff9d] text-xs text-center uppercase tracking-widest animate-pulse font-bold shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                  En Route to Recipient
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                <Truck className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm font-bold text-gray-400">
                No Active Assignments
              </p>
              <p className="text-xs mt-2 text-gray-600">Standby at Depot</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
