"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

interface LoginProps {
    onLoginSuccess: (token: string, name: string, userId: string) => void;
}

export default function Login({ onLoginSuccess = () => {} }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Invalid credentials");
                }
                return res.json();
            })
            .then((data) => {
                onLoginSuccess(data.token, data.user.username, data.user.id);
                router.push("/home");
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    return (
        <div className="flex h-full">
            <div className="w-3/5 h-full flex items-center absolute right-0 top-0 p-20 bg-pink-100">
                <div>
                    <Link href="/">
                        <img
                            src="logo.png"
                            className="w-5/100 absolute right-3 top-3 transition-all duration-800 hover:cursor-pointer hover:w-6/100"
                            alt="Logo"
                        />
                    </Link>
                    <img src="/comilla.png" className="w-1/9" alt="Comilla" />
                    <p className="mt-10 text-6xl">
                        La música es el lenguaje universal <br /> de la humanidad
                    </p>
                    <br />
                    <p className="mt-4 text-3xl">Henry Wadsworth Longfellow</p>
                </div>
            </div>
            <div className="bg-[url(/fondo-inverted.png)] h-full bg-no-repeat bg-cover w-2/5 flex flex-col items-center shadow-lg absolute">
                <img src="logo-blanco.png" className="h-full" alt="Logo Blanco" />
                <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                    <h1 className="text-3xl text-center mb-4 text-white font-bold drop-shadow-md">
                        Iniciar Sesión
                    </h1>
                    {error && (
                        <p className="text-red-500 text-center mb-4">{error}</p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                        <div className="flex flex-col">
                            <label className="text-white font-semibold drop-shadow-sm">
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                id="Email"
                                placeholder="Enter your Email"
                                className="bg-white p-2 w-full rounded-md shadow-md focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-white font-semibold drop-shadow-sm">
                                Password
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                className="bg-white p-2 w-full rounded-md shadow-md focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-6 w-full bg-sky-200 text-black px-4 py-2 rounded-md shadow-md transition-all duration-800 ease-in-out transform hover:scale-105 cursor-pointer"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}