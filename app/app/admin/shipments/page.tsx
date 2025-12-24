"use client";

import ThreeScene from "../../../components/ThreeScene";
import { Package, ArrowRight, Calendar } from "lucide-react";
import useOmniProgram from "../../../hooks/useOmniProgram";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Loader2 } from "lucide-react";
import { formatStatus, formatPrice } from "../../../utils/format";

export default function ShipmentsPage() {
  const { getAllShipments, getAllDrivers, emergencySwap, wallet } =
    useOmniProgram();
  const [shipments, setShipments] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Assignment Modal State
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchData = async () => {
    if (!wallet) return;
    try {
      const [companyPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("company"), wallet.publicKey.toBuffer()],
        new PublicKey("tyWeb5FudPxigpWFYeCP9yKwYHBxsqB3jwJa6bjzTJn")
      );

      const [sData, dData] = await Promise.all([
        getAllShipments(companyPda),
        getAllDrivers(companyPda), // Filter drivers for the dropdown too!
      ]);
      if (sData) setShipments(sData);
      if (dData) setDrivers(dData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!wallet) return;

    // 1. Reset State Cleanly
    setIsLoading(true);
    setShipments([]);
    setDrivers([]);

    const fetch = async () => {
      try {
        // 2. Derive Current Company PDA
        const [currentCompanyPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("company"), wallet.publicKey.toBuffer()],
          new PublicKey("tyWeb5FudPxigpWFYeCP9yKwYHBxsqB3jwJa6bjzTJn")
        );

        // 3. Fetch ALL Data (Raw)
        const [allShipments, allDrivers] = await Promise.all([
          getAllShipments(),
          getAllDrivers(),
        ]);

        // 4. Strict Client-Side Filter
        if (allShipments) {
          const myShipments = allShipments.filter(
            (s: any) =>
              s.account.company.toString() === currentCompanyPda.toString()
          );
          setShipments(myShipments);
        }

        if (allDrivers) {
          const myDrivers = allDrivers.filter(
            (d: any) =>
              d.account.company.toString() === currentCompanyPda.toString()
          );
          setDrivers(myDrivers);
        }
      } catch (e) {
        console.error("Shipments Fetch Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
    const interval = setInterval(fetch, 15000); // Auto-refresh
    return () => clearInterval(interval);
  }, [getAllShipments, getAllDrivers, wallet]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#020617] text-[#00f3ff]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-widest uppercase animate-pulse">
          Scanning Manifests...
        </h2>
      </div>
    );
  }

  const handleAssign = async () => {
    if (!selectedShipment || !selectedDriver) return;
    setIsAssigning(true);
    try {
      await emergencySwap(selectedShipment.account.trackingId, selectedDriver);
      alert("Driver Assigned Successfully!");
      setSelectedShipment(null);
      setSelectedDriver("");
      fetchData(); // Refresh list
    } catch (e) {
      console.error(e);
      alert("Assignment Failed");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="w-full flex-1 relative text-white flex flex-col p-8 overflow-hidden">
      {/* ThreeScene removed */}

      <header className="relative z-10 mb-8 bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            SHIPMENT MANIFEST
          </h1>
          <p className="text-gray-400 text-sm mt-1">Global Cargo Operations</p>
        </div>
        <div className="p-3 bg-[#00f3ff]/10 rounded-lg border border-[#00f3ff]/30">
          <Calendar className="w-5 h-5 text-[#00f3ff]" />
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-auto custom-scrollbar bg-slate-950/40 backdrop-blur-md rounded-xl border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-white/10 bg-white/5 sticky top-0 z-20 backdrop-blur-xl">
              <th className="p-6">Tracking ID</th>
              <th className="p-6">Status</th>
              <th className="p-6">Route</th>
              <th className="p-6">Price</th>
              <th className="p-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s, i) => {
              const statusStr = formatStatus(s.account.status);

              // Determine Badge Styles
              let badgeClass =
                "bg-gray-500/10 text-gray-400 border-gray-500/30";
              if (statusStr === "Created")
                badgeClass =
                  "bg-[#00f3ff]/10 text-[#00f3ff] border-[#00f3ff]/30 shadow-[0_0_10px_rgba(0,243,255,0.2)]";
              if (statusStr === "In Transit")
                badgeClass =
                  "bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]";
              if (statusStr === "Delivered")
                badgeClass =
                  "bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30 shadow-[0_0_10px_rgba(0,255,157,0.2)]";
              if (statusStr === "Disputed")
                badgeClass =
                  "bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]";

              return (
                <tr
                  key={i}
                  className="group border-b border-white/5 hover:bg-[#00f3ff]/5 transition-colors"
                >
                  <td className="p-6 font-bold text-[#00f3ff] drop-shadow-[0_0_5px_rgba(0,243,255,0.5)] font-mono">
                    {s.account.trackingId}
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${badgeClass}`}
                    >
                      {statusStr}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">
                        {s.account.origin || "Depot A"}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                      <span className="text-white">
                        {s.account.destination || "Pending"}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-mono text-[#bd00ff] font-bold">
                    {formatPrice(s.account.price)} SOL
                  </td>
                  <td className="p-6">
                    <button
                      onClick={() => setSelectedShipment(s)}
                      className="px-4 py-2 bg-white/5 hover:bg-[#bd00ff] hover:text-white text-[#bd00ff] border border-[#bd00ff]/30 rounded text-xs font-bold uppercase transition-all"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              );
            })}

            {shipments.length === 0 && (
              <tr>
                <td colSpan={5} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center h-full opacity-50">
                    {/* 3D Placeholder Effect using CSS/SVG */}
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 border-4 border-[#00f3ff]/20 rounded-full animate-ping" />
                      <div className="absolute inset-2 border-2 border-[#bd00ff]/30 rounded-full animate-spin-slow" />
                      <Package className="absolute inset-0 m-auto w-10 h-10 text-white/40" />
                    </div>
                    <p className="text-[#00f3ff] uppercase tracking-[0.2em] text-sm font-bold">
                      No Active Manifests
                    </p>
                    <p className="text-gray-500 text-xs mt-2 font-mono">
                      Initialize shipments via dashboard
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#020617] border border-[#bd00ff]/50 p-8 rounded-2xl w-full max-w-md relative shadow-[0_0_50px_rgba(189,0,255,0.2)]">
            <h3 className="text-xl font-bold text-white mb-4">Assign Driver</h3>
            <p className="text-gray-400 text-sm mb-6">
              Shipment:{" "}
              <span className="text-[#00f3ff] font-mono">
                {selectedShipment.account.trackingId}
              </span>
            </p>

            <label className="text-xs font-bold text-[#bd00ff] uppercase mb-2 block">
              Select Driver
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full bg-[#020617] border border-cyan-500/30 rounded p-3 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="" className="bg-[#020617]">
                -- Choose Unit --
              </option>
              {drivers.map((d: any) => (
                <option
                  key={d.publicKey.toString()}
                  value={d.publicKey.toString()}
                  className="bg-[#020617] text-white"
                >
                  {d.account.name} ({formatStatus(d.account.status)}) -{" "}
                  {d.publicKey.toString().slice(0, 6)}...
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedShipment(null)}
                className="flex-1 py-3 border border-white/10 rounded text-white font-bold uppercase text-xs hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={isAssigning || !selectedDriver}
                className="flex-1 py-3 bg-[#bd00ff] hover:bg-[#a200db] rounded text-white font-bold uppercase text-xs shadow-[0_0_20px_rgba(189,0,255,0.4)] disabled:opacity-50"
              >
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
