import React from 'react';
export function Error404() {
    return (
        <div className="min-h-screen bg-pink-100 flex flex-col text-center items-center justify-center">
            <img src="../../../public/404.png" className="w-1/4" />
            <p className="mt-4 font-mono text-3xl font-semibold  ">Page not found</p>
            <br></br>
            <p className="">"¡Oops! Parece que te has perdido. La página que buscas no existe o ha sido movida. <br></br> Regresa a la página principal o revisa la URL e inténtalo de nuevo."</p>
        </div>
    );
};