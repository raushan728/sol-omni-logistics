"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ThreeScene from "../../../components/ThreeScene";
import dynamic from "next/dynamic";
const CyberMap = dynamic(
  () => import("../../../components/Dashboard/CyberMap"),
  { ssr: false }
);
import useOmniProgram from "../../../hooks/useOmniProgram";
import { CheckCircle, Truck, Package, Clock } from "lucide-react";

export default function TrackingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { getShipment, confirmDelivery } = useOmniProgram();
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const data = await getShipment(id);
        setShipment(data);
        setLoading(false);
      }
    };
    fetch();
  }, [id, getShipment]);

  const handleConfirm = async () => {
    try {
      await confirmDelivery(id);
      alert("Delivery Confirmed! Funds Released.");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Confirmation Failed. Are you the receiver?");
    }
  };

  if (loading)
    return (
      <div className="w-full h-screen bg-[#020617] flex items-center justify-center text-[#00f3ff]">
        LOADING SATELLITE FEED...
      </div>
    );

  if (!shipment)
    return (
      <div className="w-full h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <ThreeScene className="fixed inset-0 opacity-20 pointer-events-none" />
        <h1 className="text-2xl font-bold tracking-widest mb-4">
          SHIPMENT NOT FOUND
        </h1>
        <p className="text-gray-500 text-sm">ID: {id}</p>
      </div>
    );

  const isDelivered = shipment.account.status === "Delivered";

  return (
    <div className="w-full flex-1 relative text-white flex flex-col overflow-hidden">
      {/* ThreeScene removed */}

      {/* Header */}
      <header className="relative z-10 p-6 bg-slate-950/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 shadow-inner">
            <Package className="w-6 h-6 text-[#bd00ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              TRACKING: {id}
            </h1>
            <p className="text-xs text-gray-400 uppercase font-mono">
              Global Freight Network
            </p>
          </div>
        </div>
        <div
          className={`px-4 py-2 rounded font-bold uppercase text-xs border ${
            isDelivered
              ? "bg-[#00ff9d]/20 text-[#00ff9d] border-[#00ff9d]/30"
              : "bg-blue-500/20 text-blue-500 border-blue-500/30"
          }`}
        >
          {shipment.account.status}
        </div>
      </header>

      <main className="flex-1 relative z-0 flex flex-col md:flex-row h-full">
        {/* Map */}
        <div className="flex-1 relative h-full">
          <CyberMap
            zoom={8}
            markers={[
              {
                id: "target",
                type: "truck",
                position: {
                  lat: shipment.account.currentLat || 0,
                  lng: shipment.account.currentLng || 0,
                },
              },
            ]}
          />
        </div>

        {/* Details Panel */}
        <div className="w-full md:w-96 bg-slate-950/80 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col z-20 shadow-2xl h-full">
          <h2 className="text-[#00f3ff] text-xs font-bold uppercase mb-8 tracking-widest">
            Shipment Details
          </h2>

          <div className="space-y-8 flex-1">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Truck className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">
                  Current Location
                </label>
                <div className="text-sm font-mono text-white mt-1">
                  {shipment.account.currentLat?.toFixed(4) || "0.0000"},{" "}
                  {shipment.account.currentLng?.toFixed(4) || "0.0000"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Clock className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">ETA</label>
                <div className="text-sm font-mono text-white mt-1">
                  In Transit
                </div>
              </div>
            </div>
          </div>

          {!isDelivered && (
            <button
              onClick={handleConfirm}
              className="w-full py-4 mt-8 bg-[#00ff9d] hover:bg-[#00e08a] text-black font-bold uppercase tracking-widest rounded shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> Confirm Delivery
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
