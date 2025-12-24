"use client";

import { useState, useEffect } from "react";
import { Truck, Navigation, AlertOctagon } from "lucide-react";
import ThreeScene from "../../../components/ThreeScene";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
const CyberMap = dynamic(
  () => import("../../../components/Dashboard/CyberMap"),
  { ssr: false }
);
import useOmniProgram from "../../../hooks/useOmniProgram";

export default function DriverDashboard() {
  const { publicKey } = useWallet();
  const { getAllShipments, updateLocation, toggleDriverStatus } =
    useOmniProgram();
  const [activeShipment, setActiveShipment] = useState<any>(null);
  const [status, setStatus] = useState("Active");
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch assigned shipment
    const fetch = async () => {
      const all = await getAllShipments();
      if (all) {
        // Basic filter: find shipment where driver field matches this wallet
        const myShipment = all.find(
          (s: any) =>
            s.account.driver &&
            publicKey &&
            s.account.driver.toString() === publicKey.toString() &&
            s.account.status !== "Delivered"
        );
        setActiveShipment(myShipment);
      }
    };
    if (publicKey) fetch();
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
    <div className="w-full h-screen relative bg-[#020617] text-white overflow-hidden flex flex-col">
      <ThreeScene className="fixed inset-0 opacity-20" />

      {/* HUD Header */}
      <header className="relative z-10 p-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#00ff9d] drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
            DRIVER HUD
          </h1>
          <p className="text-xs text-gray-400">
            UNIT:{" "}
            {publicKey ? publicKey.toString().slice(0, 8) : "DISCONNECTED"}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 border rounded font-bold uppercase text-xs flex items-center gap-2 transition-all ${
              status === "Active"
                ? "border-[#00ff9d]/30 text-[#00ff9d] bg-[#00ff9d]/10"
                : "border-red-500/30 text-red-500 bg-red-500/10"
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

      <main className="flex-1 relative z-0 flex">
        {/* Map Section */}
        <div className="flex-1 relative border-r border-white/10">
          <CyberMap zoom={6} markers={mapMarkers} />
          {/* Floating Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[400]">
            <button
              onClick={handleSyncGPS}
              disabled={gpsLoading}
              className="px-8 py-4 bg-[#bd00ff] hover:bg-[#a200db] rounded-full text-white font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(189,0,255,0.5)] flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {gpsLoading ? (
                <Navigation className="animate-spin w-5 h-5" />
              ) : (
                <Navigation className="w-5 h-5" />
              )}
              Sync GPS Chain
            </button>
          </div>
        </div>

        {/* Shipment Info Panel */}
        <aside className="w-80 bg-black/60 backdrop-blur-xl p-6 flex flex-col">
          <h2 className="text-[#00f3ff] text-sm font-bold uppercase mb-6 tracking-wider border-b border-[#00f3ff]/20 pb-2">
            Current Mission
          </h2>

          {activeShipment ? (
            <div className="space-y-6">
              <div>
                <label className="text-gray-500 text-xs uppercase">
                  Tracking ID
                </label>
                <div className="text-xl font-mono text-white dashed-underline">
                  {activeShipment.account.trackingId}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase">
                  Destination
                </label>
                <div className="text-sm text-gray-300">
                  {activeShipment.account.destination ||
                    "Coordinates Encrypted"}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase">
                  Cargo Value
                </label>
                <div className="text-sm text-[#bd00ff] font-mono">
                  {(Number(activeShipment.account.price) / 1e9).toFixed(2)} SOL
                </div>
              </div>

              <div className="mt-auto pt-8">
                <div className="p-4 rounded bg-[#00ff9d]/5 border border-[#00ff9d]/20 text-[#00ff9d] text-xs text-center uppercase tracking-widest animate-pulse">
                  En Route
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <Truck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No Active Assignments</p>
              <p className="text-xs mt-2">Standby at Depot</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
