"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, Stars } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import ThreeCard from "../../components/ThreeCard";
import RegistrationForm from "../../components/RegistrationForm";
import useOmniProgram, { UserRole } from "../../hooks/useOmniProgram";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { checkUserRole, wallet } = useOmniProgram();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("GUEST");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Modal State
  const [showForm, setShowForm] = useState<"company" | "driver" | null>(null);

  const handleSelectRole = async (selectedRole: UserRole) => {
    if (!wallet) {
      alert("Please connect your wallet first.");
      return;
    }

    // Special quick path for guest
    if (selectedRole === "GUEST") {
      router.push("/track");
      return;
    }

    setLoading(true);
    // Real check
    const result = await checkUserRole();
    setLoading(false);

    if (selectedRole === "ADMIN") {
      if (result.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        // Show Registration Form for Company
        setShowForm("company");
      }
    } else if (selectedRole === "DRIVER") {
      if (result.role === "DRIVER") {
        router.push("/driver/dashboard");
      } else {
        // Show Registration Form for Driver
        setShowForm("driver");
      }
    }
  };

  return (
    <div className="w-full h-screen relative bg-black">
      <div className="absolute top-10 left-0 w-full text-center z-10 pointer-events-none">
        <h1 className="text-4xl font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          IDENTIFY YOURSELF
        </h1>
        <p className="text-gray-400 mt-2">Select your access portal</p>
      </div>

      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ambientLight intensity={0.3} />
            <Stars
              radius={100}
              depth={50}
              count={5000} // Ensuring visuals match
              factor={4}
              saturation={0}
              fade
              speed={1}
            />

            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
              {/* Only show cards if form is NOT showing */}
              {!showForm && (
                <>
                  {/* Admin Card */}
                  <ThreeCard
                    position={[-4, 0, 0]}
                    role="LOGISTICS PROVIDER"
                    title="Enterprise Portal"
                    color="#00f3ff" // Cyan
                    iconType="warehouse"
                    onClick={() => handleSelectRole("ADMIN")}
                    isHovered={hoveredCard === "ADMIN"}
                    onHover={(h) => setHoveredCard(h ? "ADMIN" : null)}
                  />

                  {/* Driver Card */}
                  <ThreeCard
                    position={[0, 0, 0]}
                    role="DELIVERY PARTNER"
                    title="Fleet App"
                    color="#bd00ff" // Purple
                    iconType="truck" // Truck representation
                    onClick={() => handleSelectRole("DRIVER")}
                    isHovered={hoveredCard === "DRIVER"}
                    onHover={(h) => setHoveredCard(h ? "DRIVER" : null)}
                  />

                  {/* Customer Card */}
                  <ThreeCard
                    position={[4, 0, 0]}
                    role="CUSTOMER"
                    title="Track Package"
                    color="#00ff9d" // Green
                    iconType="package"
                    onClick={() => handleSelectRole("GUEST")}
                    isHovered={hoveredCard === "GUEST"}
                    onHover={(h) => setHoveredCard(h ? "GUEST" : null)}
                  />
                </>
              )}
            </Float>
          </Suspense>
        </Canvas>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-[#00f3ff] animate-pulse text-xl">
            VERIFYING CREDENTIALS...
          </div>
        </div>
      )}

      {showForm && (
        <RegistrationForm
          type={showForm}
          onSuccess={() => {
            setShowForm(null);
            // After success, re-check role and route
            checkUserRole().then((res) => {
              if (res.role === "ADMIN") router.push("/admin/dashboard");
              if (res.role === "DRIVER") router.push("/driver/dashboard");
            });
          }}
          onCancel={() => setShowForm(null)}
        />
      )}
    </div>
  );
}
