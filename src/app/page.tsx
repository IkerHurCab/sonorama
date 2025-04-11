"use client";

import { useState } from "react";
import Home from "./home/page";
import Landing from "./landing/page";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {

  const [token] = useState<string | null>(null);

  return (
          <Landing />
  );
}
