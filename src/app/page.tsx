"use client";

import { useState } from "react";
 import Login from "./login/page";
 import Register from "./register/page";
// import { LayoutDashboard } from "./dashboard/layout";
import Home from "./home/page";
import Landing from "./landing/page";
// import Layout from "@/components/taskForm/layout";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useRouter } from "next/navigation"; // Reemplazo de react-router-dom

export default function App() {
  
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const handleLoginSuccess = (receivedToken: string, receivedUser: string, receivedId: string) => {
    localStorage.setItem("token", receivedToken);
    localStorage.setItem("username", receivedUser);
    localStorage.setItem("userId", receivedId);
    setToken(receivedToken);
    console.log("id", receivedId);
  };

  return (
    <div>
      {token ? (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ) : (
        <>
          <Landing />
        </>
      )}
    </div>
  );
}
