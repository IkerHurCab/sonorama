"use client"
import Image from 'next/image'

import React from 'react';
export function Error500() {
    return (
        <div className="min-h-screen bg-pink-100 flex flex-col text-center items-center justify-center">
            <Image src="../../../public/500.png" className="w-1/4" alt=""/>
            <p className="mt-4 font-mono text-3xl font-semibold  ">Algo ha ido mal en el servidor</p>
            <br></br>
            <p className="">&quot;¡Ups! Algo salió mal en nuestro servidor. Estamos trabajando para solucionarlo. Por favor, inténtalo de nuevo más tarde.<br></br> Regresa a la página principal o revisa la URL e inténtalo de nuevo&quot;</p>
        </div>
    );
};