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
    <div className="w-full h-screen relative bg-[#020617] text-white overflow-hidden flex flex-col p-8">
      <ThreeScene className="fixed inset-0 opacity-20 pointer-events-none" />

      <header className="relative z-10 mb-8">
        <h1 className="text-3xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          SHIPMENT MANIFEST
        </h1>
        <p className="text-gray-400 text-sm mt-1">Global Cargo Operations</p>
      </header>

      <div className="relative z-10 flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/10">
              <th className="p-4">Tracking ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Route</th>
              <th className="p-4">Price</th>
              <th className="p-4">Updated</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s, i) => (
              <tr
                key={i}
                className="group border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4 font-bold text-[#00f3ff] drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
                  {s.account.trackingId}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      s.account.status === "Intransit"
                        ? "bg-blue-500/20 text-blue-400"
                        : s.account.status === "Delivered"
                        ? "bg-[#00ff9d]/20 text-[#00ff9d]"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {s.account.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-300">
                  {s.account.origin || "Depot A"}{" "}
                  <span className="text-gray-600">→</span>{" "}
                  {s.account.destination || "Pending"}
                </td>
                <td className="p-4 text-sm font-mono text-[#bd00ff]">
                  {Number(s.account.price) / 1000000000} SOL
                </td>
                <td className="p-4 text-xs text-gray-500">Now</td>
              </tr>
            ))}
            {shipments.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-500 uppercase tracking-widest text-xs"
                >
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
