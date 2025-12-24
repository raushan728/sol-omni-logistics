"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import 'leaflet/dist/leaflet.css'; // Using CDN in layout.tsx to avoid build module resolution errors
import L from "leaflet";

// Fix for default Leaflet markers in Next.js
// But we are using custom markers so maybe less critical, but good practice.
// Creating a Custom Neon Icon
const createNeonIcon = (color: string) => {
  return L.divIcon({
    className: "custom-neon-marker",
    html: `<div style="
            background-color: ${color};
            width: 12px;
            height: 12px;
            border-radius: 50%;
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
            position: relative;
        ">
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 24px;
                height: 24px;
                border: 2px solid ${color};
                border-radius: 50%;
                opacity: 0.5;
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
        </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MarkerData {
  id: string;
  position: { lat: number; lng: number };
  type: "truck" | "warehouse";
  label?: string;
}

interface CyberMapProps {
  zoom?: number;
  center?: { lat: number; lng: number };
  markers?: MarkerData[];
}

// Sub-component to handle map movements
function MapUpdater({
  center,
  zoom,
}: {
  center?: { lat: number; lng: number };
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function CyberMap({
  zoom = 4,
  center,
  markers = [],
}: CyberMapProps) {
  // Default center (San Francisco) if none provided
  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const mapCenter: [number, number] = center
    ? [center.lat, center.lng]
    : defaultCenter;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: "#020617" }}
        zoomControl={false}
      >
        {/* Dark Matter Tiles - Free & Cyberpunk */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater center={center} zoom={zoom} />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            icon={createNeonIcon(
              marker.type === "warehouse" ? "#00f3ff" : "#bd00ff"
            )}
          >
            <Popup className="cyber-popup">
              <div className="text-black font-bold">
                {marker.label || marker.id}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Global Styles for the ping animation if not in tailwind config */}
      <style jsx global>{`
        @keyframes ping {
          75%,
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        .leaflet-popup-content-wrapper {
          background: rgba(0, 0, 0, 0.8) !important;
          border: 1px solid #00f3ff !important;
          backdrop-filter: blur(10px);
          color: white !important;
        }
        .leaflet-popup-tip {
          background: #00f3ff !important;
        }
      `}</style>
    </div>
  );
}
