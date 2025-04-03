"use client";
import { useState, useEffect, useRef } from "react";
import { Home, BookOpen, Music2, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
    const [modalAbierto, setModalAbierto] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [username, setUsername] = useState<string | null>(null);

    const toggleModal = () => {
        setModalAbierto(!modalAbierto);
    };

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalAbierto(false);
            }
        };
        if (modalAbierto) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalAbierto]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[url(/fondo-inverted.png)] bg-cover text-white">
            <div className="relative flex items-center justify-between mx-auto px-4 dark:bg-black bg-black/80 backdrop-blur-sm">
                <Link href="/">
                    <img
                        className="w-9 transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)] hover:cursor-pointer"
                        src="logo-blanco.png"
                        alt="Logo"
                    />
                </Link>
                <div className="flex-grow flex items-center justify-center space-x-8 h-16">
                    <Link href="/" className="transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)] flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        <span>Inicio</span>
                    </Link>
                    <Link href="/articles" className="transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)] flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Artículos</span>
                    </Link>
                    <Link href="/instruments" className="transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)] flex items-center gap-2">
                        <Music2 className="w-5 h-5" />
                        <span>Instrumentos</span>
                    </Link>
                </div>
                <div className="ml-auto flex items-center justify-center space-x-8 h-16">
                    <button onClick={toggleModal} className="transition-all absolute duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)]">
                        <User className="w-5 h-5" />
                    </button>
                    {modalAbierto && (
                        <motion.div
                            ref={modalRef}
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-20 right-5 w-48 bg-[url(/fondo-inverted.png)] text-white rounded-sm shadow-lg drop-shadow-[0px_10px_10px_rgba(0,0,0,0.5)]"
                        >
                            <div className="w-full h-full bg-black/90 rounded-sm backdrop-blur-sm p-4">
                                <p className="font-semibold">{username}</p>
                                <ul className="drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]">
                                    <li className="py-2 cursor-pointer hover:bg-black/60 px-2 rounded">
                                        <Link href="/home/perfil">Perfil</Link>
                                    </li>
                                    <li className="py-2 cursor-pointer hover:bg-black/60 px-2 rounded">Configuración</li>
                                    <li className="py-2 cursor-pointer hover:bg-black/60 px-2 rounded">Cerrar sesión</li>
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </nav>
    );
}