"use client";

import ThreeScene from "../../../components/ThreeScene";
import { Truck, Shield, AlertTriangle } from "lucide-react";
import useOmniProgram from "../../../hooks/useOmniProgram";
import { useEffect, useState } from "react";

export default function FleetPage() {
  const { getAllDrivers, emergencySwap } = useOmniProgram();
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllDrivers();
      if (data) setDrivers(data);
    };
    fetch();
  }, [getAllDrivers]);

  const handleSwap = async (driverKey: string) => {
    const trackingId = prompt("ENTER SHIPMENT ID TO ASSIGN (Emergency Swap):");
    if (!trackingId) return;

    try {
      await emergencySwap(trackingId, driverKey);
      alert("Shipment Dispatched to Driver via Emergency Protocol!");
    } catch (e) {
      console.error(e);
      alert("Failed to swap/assign shipment.");
    }
  };

  return (
    <div className="w-full flex-1 relative text-white flex flex-col p-8 overflow-hidden">
      {/* ThreeScene removed */}

      <header className="relative z-10 mb-8 flex justify-between items-center bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            FLEET COMMAND
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Active Personnel & Assets
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#bd00ff]/10 border border-[#bd00ff]/30 text-[#bd00ff] text-xs font-bold uppercase shadow-[0_0_15px_rgba(189,0,255,0.2)]">
            <Truck className="w-4 h-4" /> {drivers.length} Registered
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-auto custom-scrollbar pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => {
            const status = driver.account.status || "Active"; // Assuming status field
            const isSick = status.toLowerCase() === "sick";

            return (
              <div
                key={driver.publicKey.toString()}
                className="group relative bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-[#bd00ff]/50 transition-all hover:shadow-[0_0_30px_rgba(189,0,255,0.2)]"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bd00ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#bd00ff]/20 flex items-center justify-center border border-[#bd00ff]/30 text-[#bd00ff] font-bold shadow-[0_0_10px_rgba(189,0,255,0.3)]">
                    {driver.account.name ? driver.account.name.charAt(0) : "D"}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      !isSick
                        ? "bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30"
                        : "bg-red-500/10 text-red-500 border border-red-500/30"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {driver.account.name}
                </h3>
                <p className="text-xs text-gray-400 mb-4 font-mono">
                  {driver.publicKey.toString().slice(0, 8)}...
                </p>

                <div className="space-y-2 text-sm border-t border-white/5 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">License</span>
                    <span className="text-gray-300 font-mono">
                      {driver.account.license || "N/A"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSwap(driver.publicKey.toString())}
                    className="w-full mt-4 py-2 bg-white/5 hover:bg-[#bd00ff]/20 hover:text-[#bd00ff] border border-white/10 rounded text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 group-hover:border-[#bd00ff]/30"
                  >
                    <AlertTriangle className="w-3 h-3" /> Emergency Swap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
