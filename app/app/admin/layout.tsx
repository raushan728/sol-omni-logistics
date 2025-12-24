"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useOmniProgram from "../../hooks/useOmniProgram";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallet, checkUserRole } = useOmniProgram();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!wallet) {
      // If wallet disconnects, maybe redirect to home or keep waiting?
      // Usually redirect to home or onboarding
      return;
    }

    const verify = async () => {
      setIsChecking(true);
      const { role } = await checkUserRole();
      if (role !== "ADMIN") {
        router.push("/onboarding");
      } else {
        setIsAuthorized(true);
      }
      setIsChecking(false);
    };

    verify();
  }, [wallet, checkUserRole, router]);

  if (isChecking || !isAuthorized) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#020617] text-[#00f3ff]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-widest uppercase animate-pulse">
          Verifying Clearance...
        </h2>
      </div>
    );
  }

  return <>{children}</>;
}
