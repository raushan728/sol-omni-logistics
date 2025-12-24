"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useOmniProgram from "../hooks/useOmniProgram";
import { Loader2 } from "lucide-react";
import * as THREE from "three"; // For ID generation usually, or we use random string

interface RegistrationFormProps {
  type: "company" | "driver";
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RegistrationForm({
  type,
  onSuccess,
  onCancel,
}: RegistrationFormProps) {
  const {
    initializeCompany,
    registerDriver,
    isLoading: isProgramLoading,
  } = useOmniProgram();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [companyName, setCompanyName] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (type === "company") {
        if (!companyName || !registrationId)
          throw new Error("All fields required");
        // Note: initializeCompany in useOmniProgram currently takes no args in the hook wrapper
        console.log("Registering company:", companyName, registrationId);
        const tx = await initializeCompany(companyName, registrationId);
        if (tx) onSuccess();
      } else {
        if (!driverName || !licenseNumber)
          throw new Error("All fields required");
        console.log("Registering driver:", driverName, licenseNumber);
        const tx = await registerDriver(driverName, licenseNumber);
        if (tx) onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-xl" // Fixed full screen + Heavy Blur
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-md p-8 rounded-2xl border-2 border-cyan-500/50 bg-slate-900/80 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-2xl overflow-hidden animate-pulse-slow"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Neon Top Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <h2 className="text-2xl font-bold text-white mb-2 tracking-widest text-center uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
            {type === "company" ? "Company Register" : "Driver License"}
          </h2>
          <p className="text-cyan-200/70 text-center mb-8 text-xs font-medium tracking-wide">
            {type === "company"
              ? "Initialize global logistics protocol"
              : "Register your vehicle on-chain"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === "company" ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all shadow-inner"
                    placeholder="e.g. Sol-Omni Logistics"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Registration ID
                  </label>
                  <input
                    type="text"
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-inner"
                    placeholder="e.g. REG-8842-X"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#00ff9d] uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00ff9d] focus:border-transparent transition-all shadow-inner"
                    placeholder="e.g. Alex Rider"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all shadow-inner"
                    placeholder="e.g. DL-9920-SOL"
                  />
                </div>
              </>
            )}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-200 text-sm text-center">
                {error}
              </div>
            )}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors font-bold uppercase text-xs tracking-widest hover:text-cyan-400"
                disabled={isLoading || isProgramLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${
                  isLoading || isProgramLoading
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
                }`}
                disabled={isLoading || isProgramLoading}
              >
                {isLoading || isProgramLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Initialize"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
