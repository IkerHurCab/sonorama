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
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      setIsAuthorized(true);
      return;
    }

    const checkUserRole = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        const userData = data.user;
        const hasRequiredRole = requiredRoles.includes(userData.roles_id);
        setIsAuthorized(hasRequiredRole);
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsAuthorized(false);
      }
    };

    checkUserRole();
  }, [token, requiredRoles, router]);

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-200"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Error403 />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
