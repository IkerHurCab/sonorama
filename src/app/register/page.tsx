"use client"
import React from 'react';
import Link from 'next/link';

export default function Register() {
    const handleRegister = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        const formData = {
            username: (document.getElementById('username') as HTMLInputElement).value,
            password: (document.getElementById('password') as HTMLInputElement).value,
            confirmPassword: (document.getElementById('confirm-password') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            firstName: (document.getElementById('first-name') as HTMLInputElement).value,
            lastName: (document.getElementById('last-name') as HTMLInputElement).value
        };
        console.log('Form Data:', formData);
        const jsonFormData = JSON.stringify(formData);
        console.log('JSON Form Data:', jsonFormData);
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-3/5 min-h-screen flex items-center p-20 bg-pink-100">
                <div>
                    <Link href="/">
                        <img src="/logo.png" className="w-3/100 absolute left-3 top-3 transition-all duration-800 hover:cursor-pointer hover:w-4/100" alt="Logo" />
                    </Link>
                    <img src="/comilla.png" className="w-1/9" alt="Comilla" />
                    <p className="mt-10 text-6xl">
                        La música es el lenguaje universal <br /> de la humanidad
                    </p>
                    <br />
                    <p className="mt-4 text-3xl">Henry Wadsworth LongFellow</p>
                </div>
            </div>
            <div className="bg-[url('/fondo.png')] bg-no-repeat bg-cover p-8 w-2/5 h-full flex flex-col items-center shadow-lg absolute right-0 top-1/2 transform -translate-y-1/2">
                <img src="/assets/img/logo-blanco.png" alt="Logo Blanco" />
                <div className="w-full absolute inset-0 bg-black/70 backdrop-blur-sm p-30 pt-50">
                    <h1 className="text-3xl text-center mb-4 text-white font-bold drop-shadow-md">Register</h1>
                    <form className="space-y-4 w-full">
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col w-1/2 pr-2">
                                <label className="text-white font-semibold drop-shadow-sm">First Name</label>
                                <input
                                    type="text"
                                    id="first-name"
                                    placeholder="Enter your first name"
                                    className="bg-white border-white p-2 rounded-md shadow-md focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col w-1/2 pl-2">
                                <label className="text-white font-semibold drop-shadow-sm">Last Name</label>
                                <input
                                    type="text"
                                    id="last-name"
                                    placeholder="Enter your last name"
                                    className="bg-white p-2 rounded-md shadow-md focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-white font-semibold drop-shadow-sm">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                className="bg-white p-2 w-full rounded-md shadow-md focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-white font-semibold drop-shadow-sm">Email</label>
                            <input
                                type="text"
                                id="email"
                                placeholder="Enter your email"
                                className="bg-white p-2 w-full rounded-md shadow-md focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col w-1/2 pr-2">
                                <label className="text-white font-semibold drop-shadow-sm">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    className="bg-white p-2 rounded-md shadow-md focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col w-1/2 pl-2">
                                <label className="text-white font-semibold drop-shadow-sm">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    placeholder="Confirm your password"
                                    className="bg-white p-2 rounded-md shadow-md focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            className="mt-6 w-full bg-sky-200 text-black px-4 py-2 rounded-md shadow-md transition-all duration-800 ease-in-out transform hover:scale-104 cursor-pointer"
                            onClick={handleRegister}
                        >
                            Registrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
