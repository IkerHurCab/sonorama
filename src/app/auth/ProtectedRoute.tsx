"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Error403 } from "@/app/error/403";

interface ProtectedRouteProps {
  requiredRoles?: number[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ requiredRoles, children }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const validateAccess = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        const userRole = data.user?.roles_id;

        if (!requiredRoles || requiredRoles.length === 0) {
          setIsAuthorized(true);
        } else {
          const hasRole = requiredRoles.includes(userRole);
          setIsAuthorized(hasRole);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setIsAuthorized(false);
      }
    };

    validateAccess();
  }, [requiredRoles, router]);

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-200"></div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return <Error403 />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
