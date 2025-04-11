"use client"
import Image from 'next/image'

import React, { useState, useEffect, useRef } from "react";
export function NavBar() {
    const [modalAbierto, setModalAbierto] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const toggleModal = () => {
        setModalAbierto(!modalAbierto);
    };
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
        <nav className='w-full h-20 bg-[url(/fondo-inverted.png)] bg-cover bg-[top_left_-10rem] text-white'>
            <div className='w-full h-20 bg-black/80 backdrop-blur-sm p-4 flex items-center'>
                <Image
                    src="/bell-white.png"
                    alt="White Bell Icon"
                    width={25}
                    height={25}
                    className="w-[25px] h-[25px] ml-auto mr-3 duration-400 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
                />
                <Image
                    onClick={toggleModal}
                    alt="User Icon"
                    src="/user-white.png"
                    width={35}
                    height={35}
                    className="w-[35px] h-[35px] mr-3 duration-400 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
                />
                {modalAbierto && (
                    <div ref={modalRef} className="absolute top-18 right-12 w-48  bg-[url(/fondo-inverted.png)] text-white rounded-sm shadow-lg drop-shadow-[0px_10px_10px_rgba(0,0,0,0.5)]">
                        <div className='w-full h-full bg-black/60 rounded-sm backdrop-blur-sm p-4 '>
                            <p className="font-semibold">Usuario</p>
                            <ul className="drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]">
                                <li className="py-2 cursor-pointer hover:bg-black/60 px-2 rounded ">Perfil</li>
                                <li className="py-2 cursor-pointer hover:bg-black/60 px-2 rounded">Configuración</li>
                                <li className="py-2 cursor-pointer hover:bg-black/60 px-2 rounded">Cerrar sesión</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}