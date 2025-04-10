"use client";

import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";

export default function DashboardHome() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    return (
        <div className="h-screen flex">
            <div className="w-1/2 p-20">
                <h1 className="text-4xl">
                    Hola, {username}, bienvenido de nuevo
                </h1>
            </div>
            <div className="w-1/2 h-full p-6">
                <Calendar />
            </div>
        </div>
    );
}