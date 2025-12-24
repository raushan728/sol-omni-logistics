"use client";

import ThreeScene from "../../../components/ThreeScene";
import { Package, ArrowRight, Calendar } from "lucide-react";
import useOmniProgram from "../../../hooks/useOmniProgram";
import { useEffect, useState } from "react";

export default function ShipmentsPage() {
  const { getAllShipments } = useOmniProgram();
  const [shipments, setShipments] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllShipments();
      if (data) setShipments(data);
    };
    fetch();
  }, [getAllShipments]);

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
              <th className="p-6">Updated</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s, i) => (
              <tr
                key={i}
                className="group border-b border-white/5 hover:bg-[#00f3ff]/5 transition-colors"
              >
                <td className="p-6 font-bold text-[#00f3ff] drop-shadow-[0_0_5px_rgba(0,243,255,0.5)] font-mono">
                  {s.account.trackingId}
                </td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                      s.account.status === "Intransit"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : s.account.status === "Delivered"
                        ? "bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                    }`}
                  >
                    {s.account.status}
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
                  {Number(s.account.price) / 1000000000} SOL
                </td>
                <td className="p-6 text-xs text-gray-500 font-mono">
                  Just Now
                </td>
              </tr>
            ))}
            {shipments.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-gray-500 uppercase tracking-widest text-xs"
                >
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  No active shipments found in ledger
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
