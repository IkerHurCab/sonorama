"use client"

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { User } from "../../interfaces/user.interface";
import {
    getUsers,
  } from "../../services/dashboardService";

export function SideBar() {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Estado para manejar el hover
    const modalRef = useRef<HTMLDivElement>(null);
    const [username, setUsername] = useState<string | null>(null);
    
     useEffect(() => {
        setUsername(localStorage.getItem("username"))
    }, [])

    const toggleModal = () => {
        setModalAbierto(!modalAbierto);
    };
    if (isHovered) {
        console.log("Hovered");
    }
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
    useEffect(() => {
        if (!isHovered) {
            setModalAbierto(false);
        }
    }, [isHovered]);
    return (
        <div className="h-screen">
            <aside
                className={`h-full transition-all duration-500 text-white bg-[url(/fondo-inverted.png)] bg-no-repeat bg-cover ${isHovered ? 'w-[170px]' : 'w-[80px]'} `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={`transition-all duration-500 h-full dark:bg-black bg-black/80 backdrop-blur-sm p-4 flex flex-col items-center ${isHovered ? 'w-[170px]' : 'w-[80px]'} `}>
                    <div className='min-h-[58px]'>
                        <Link href="/">
                        <img src="/logo-blanco.png" className='w-10  transition-all duration-500 hover:cursor-pointer hover:w-11 ' />
                        </Link>
                    </div>
                    <hr className="w-full mt-2 mb-8 border-t-3 border-white rounded-2xl" />
                    <ul>
                        <li className="w-full min-h-[40px] text-center">
                            <Link className="flex items-center duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] rounded" href="/dashboard">
                                <img src="icon-home-white.png" className={`transition-all duration-500 mr-2 w-[20px]  h-[20px] ${isHovered ? '' : ''}`}></img>
                                <span className={` transition-all duration-500 ${isHovered ? 'text-[15px]' : 'text-[0px]'}`}>Inicio</span>
                            </Link>
                        </li>
                        <li className="w-full min-h-[40px] text-center">
                            <Link className="flex items-center duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] rounded" href="/dashboard/user">
                                <img src="icon-user-white.png" className=" w-[20px]  h-[20px] transition-all duration-500 mr-2"></img>
                                <span className={` transition-all duration-500 ${isHovered ? 'text-[15px]' : 'text-[0px]'}`}>Usuarios</span>
                            </Link>
                        </li>
                        <li className="w-full min-h-[40px] text-center">
                            <Link className="flex items-center duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] rounded" href="/dashboard/">
                                <img src="icon-cursos-white.png" className=" w-[20px]  h-[20px] transition-all duration-500 mr-2"></img>
                                <span className={` transition-all duration-500 ${isHovered ? 'text-[15px]' : 'text-[0px]'}`}>Cursos</span></Link></li>
                        <li className="w-full min-h-[40px] text-center">
                            <Link className="flex items-center duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] rounded" href="/dashboard/">
                                <img src="icon-articulo-white.png" className=" w-[20px]  h-[20px] transition-all duration-500 mr-2"></img>
                                <span className={`transition-all duration-500 ${isHovered ? 'text-[15px]' : 'text-[0px]'}`}>Articulos</span>
                            </Link>
                        </li>
                        <li className="w-full min-h-[40px] text-center">
                            <Link className="flex items-center duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] rounded" href="/dashboard/configuracion">
                                <img src="icon-config-white.png" className=" w-[20px]  h-[20px] transition-all duration-500 mr-2" ></img>
                                <span className={` transition-all duration-500 ${isHovered ? 'text-[15px]' : 'text-[0px]'}`}>
                                    Configuración
                                </span>
                            </Link>
                        </li>
                    </ul>
                    <div className='flex flex-col  mt-auto'>
                        <p className="flex mb-5 items-center duration-500 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] rounded"> <img src="/bell-white.png" className="transition-all duration-500 mr-2 w-[20px]  h-[20px] "></img><span className={` transition-all duration-500 ${isHovered ? 'text-[15px]' : 'text-[0px]'}`}>Notificaciones</span></p>
                        <p onClick={toggleModal} className="flex mb-5 items-center duration-500 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] rounded"> <img src="user-white.png" className='w-[23px] h-[23px] mr-2'></img><span className={` transition-all duration-500 ${isHovered ? 'text-[15px]' : 'text-[0px]'}`}>{username}</span></p>
                    </div>
                    {modalAbierto && (
                        <motion.div
                            ref={modalRef}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className=" w-30 text-white rounded-sm shadow-lg drop-shadow-[0px_10px_10px_rgba(0,0,0,0.5)]"
                        >
                            <ul>
                                <Link href="to={`/dashboard/user-info/${user.username}`}">
                                    <li className="py-1 duration-500 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] px-2 rounded ">Perfil</li>
                                </Link>
                                <Link href="/dashboard/configuracion">
                                    <li className="py-1 duration-500 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] px-2 rounded">Configuración</li>
                                </Link>
                                <li className="py-1 duration-500 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] px-2 rounded">Cerrar sesión</li>
                            </ul>
                        </motion.div>
                    )}
                </div>
            </aside>
        </div>
    );
}