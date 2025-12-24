"use client";

import { useState } from "react";
import ThreeScene from "../../../components/ThreeScene";
import { Settings, Fuel, Save, Loader2 } from "lucide-react";
import useOmniProgram from "../../../hooks/useOmniProgram";

export default function SettingsPage() {
  const { depositGas } = useOmniProgram();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("Sol-Omni Logistics"); // Mock for visual

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await depositGas(Number(amount));
      alert("Gas deposited successfully!");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Deposit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 relative text-white flex flex-col p-8 overflow-y-auto custom-scrollbar">
      {/* ThreeScene removed */}

      <header className="relative z-10 mb-8 bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
        <h1 className="text-3xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] flex items-center gap-3">
          <Settings className="w-8 h-8 text-gray-400" /> SYSTEM CONFIG
        </h1>
        <p className="text-gray-400 text-sm mt-1 ml-11">
          Enterprise Parameters & Gas
        </p>
      </header>

      <div className="relative z-10 max-w-3xl space-y-8 pb-12">
        {/* Company Settings */}
        <div className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-xl font-bold text-[#00f3ff] mb-6 flex items-center gap-2">
            Company Identity
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mt-2 bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-[#00f3ff] outline-none transition-colors backdrop-blur-sm"
              />
            </div>
            <button className="px-6 py-2 bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff] rounded font-bold text-xs uppercase hover:bg-[#00f3ff]/20 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        {/* Gas Tank */}
        <div className="bg-slate-950/60 backdrop-blur-md border border-[#bd00ff]/30 rounded-xl p-8 shadow-[0_0_30px_rgba(189,0,255,0.1)]">
          <h2 className="text-xl font-bold text-[#bd00ff] mb-6 flex items-center gap-2">
            <Fuel className="w-6 h-6" /> Gas Tank Deposit
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Deposit SOL into the company Gas Tank to subsidize driver
            transaction fees.
          </p>
          <form onSubmit={handleDeposit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs font-bold text-[#bd00ff] uppercase tracking-wider">
                Amount (SOL)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full mt-2 bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-[#bd00ff] outline-none transition-colors backdrop-blur-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-[50px] px-8 bg-[#bd00ff] hover:bg-[#a200db] text-white rounded font-bold text-xs uppercase shadow-[0_0_20px_rgba(189,0,255,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Deposit Funds"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
