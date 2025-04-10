"use client"
import { SideBar } from './side-bar'
import { useState } from "react";

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState<string>("");

  return (
    <div className="flex h-full w-full bg-pink-100 dark:bg-gray-200">
      <SideBar />
      <div className="flex h-full flex-1">
        {children}
      </div>
    </div>
  );
}