"use client";
import Link from 'next/link';
import LogoutButton from '../reutilizables/LogoutBtn';
import { useState } from 'react';
import Image from 'next/image'


export default function Landing() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch("http://127.0.0.1:8000/api/logout", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userName");
                setToken(null);
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="min-h-screen bg-[url(/fondo.png)] bg-cover relative">
            <div className='bg-black/50 min-h-screen text-white flex'>
                <Image
                    src="/logo-blanco.png"
                    alt="White Logo"
                    width={52}
                    height={52}
                    className="w-13 right-4 top-4 absolute drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
                />
                <div className="absolute bottom-40 left-20 p-4">
                    <h1 className='text-6xl my-4 drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]'>SONORAMA</h1>
                    <p className='text-2xl my-4 drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]'>
                        VIVE LA EXPERIENCIA DE LA MUSICA CON NOSOTROS
                    </p>
                    {!token ? (
                        <Link href="/login">
                            <button className='bg-white/20 my-4 py-1.5 px-6 mr-4 cursor-pointer rounded-sm transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] hover:bg-white/40'>
                                Login
                            </button>
                        </Link>
                    ) : (
                        <Link href="/">
                            <LogoutButton onLogout={handleLogout} />
                        </Link>
                    )}

                    <Link href="/home">
                        <button className='bg-white/20 my-4 py-1.5 px-6 mr-4 cursor-pointer rounded-sm transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] hover:bg-white/40'>
                            Home
                        </button>
                    </Link>
                    <Link href="/dashboard">
                        <button className='bg-white/20 my-4 py-1.5 px-6 mr-4 cursor-pointer rounded-sm transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] hover:bg-white/40'>
                            Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}