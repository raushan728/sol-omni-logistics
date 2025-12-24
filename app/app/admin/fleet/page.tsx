"use client";

import ThreeScene from "../../../components/ThreeScene";
import { Truck, Shield, AlertTriangle } from "lucide-react";
import useOmniProgram from "../../../hooks/useOmniProgram";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Loader2 } from "lucide-react";

export default function FleetPage() {
  const { getAllDrivers, emergencySwap, registerDriver, wallet } =
    useOmniProgram();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Registration State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    license: "",
    wallet: "",
  });

  useEffect(() => {
    if (!wallet) return;

    // 1. Reset State Cleanly
    setIsLoading(true);
    setDrivers([]);

    const fetch = async () => {
      try {
        // 2. Derive Current Company PDA
        const [currentCompanyPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("company"), wallet.publicKey.toBuffer()],
          new PublicKey("tyWeb5FudPxigpWFYeCP9yKwYHBxsqB3jwJa6bjzTJn")
        );

        // 3. Fetch ALL Drivers (Raw)
        const allDrivers = await getAllDrivers(); // Passing no args to get RAW list

        // 4. Strict Client-Side Filter
        if (allDrivers) {
          const myDrivers = allDrivers.filter(
            (d: any) =>
              d.account.company.toString() === currentCompanyPda.toString()
          );
          setDrivers(myDrivers);
        }
      } catch (e) {
        console.error("Fleet Fetch Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
    // Poll every 10s
    const interval = setInterval(fetch, 10000);
    return () => clearInterval(interval);
  }, [getAllDrivers, wallet]);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await registerDriver(newDriver.name, newDriver.license, newDriver.wallet);
      alert("Driver Personnel Registered On-Chain!");
      setShowRegisterModal(false);
      setNewDriver({ name: "", license: "", wallet: "" });

      // Refresh list
      const data = await getAllDrivers();
      if (data) setDrivers(data);
    } catch (err) {
      console.error(err);
      alert("Registration Failed. Ensure wallet is valid.");
    } finally {
      setRegistering(false);
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
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#bd00ff]/10 border border-[#bd00ff]/30 text-[#bd00ff] text-xs font-bold uppercase shadow-[0_0_15px_rgba(189,0,255,0.2)]">
            <Truck className="w-4 h-4" /> {drivers.length} Registered
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-[#00f3ff] hover:bg-[#00d0db] text-black font-bold text-xs uppercase rounded shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all active:scale-95"
          >
            + Register New Driver
          </button>
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

      {/* Register Driver Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#020617] border border-[#00f3ff]/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,243,255,0.2)] relative">
            {/* Close Button */}
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 tracking-widest uppercase text-center flex items-center justify-center gap-3">
              <Truck className="w-6 h-6 text-[#00f3ff]" /> Recruit Driver
            </h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, name: e.target.value })
                  }
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff]"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider">
                  License Number
                </label>
                <input
                  type="text"
                  value={newDriver.license}
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, license: e.target.value })
                  }
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff]"
                  placeholder="LIC-1234-5678"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider">
                  Wallet Address (Pubkey)
                </label>
                <input
                  type="text"
                  value={newDriver.wallet}
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, wallet: e.target.value })
                  }
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff]"
                  placeholder="Solana Wallet Address"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={registering}
                  className="w-full py-4 bg-[#00f3ff] hover:bg-[#00d0db] text-black font-bold uppercase tracking-widest rounded shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {registering ? "Processing Chain..." : "Confirm Recruitment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
