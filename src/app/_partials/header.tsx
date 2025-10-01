// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { HeartHandshake, Menu, UserIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [nickname, setNickname] = useState<string | null>(null);

    function toggleMenu() {
        setMenuOpen((prev) => !prev);
    }

    // Check JWT on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setNickname(payload.nickname);
            } catch (err) {
                console.error("Invalid token", err);
                localStorage.removeItem("token");
            }
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        setNickname(null);
        router.push("/login");
    }

    return (
        <header className="sticky top-0 z-20 bg-black-500/70 backdrop-blur-lg shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href={'/'}>
                    <div className="flex items-center gap-2">

                        <HeartHandshake className="w-6 h-6 text-pink-500" />
                        <h1 className="text-xl font-bold tracking-tight text-zinc-100">Lilly.live</h1>

                    </div>
                </Link>
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">


                    {nickname ? (
                        <>

                            <div className="flex text-white font-medium">
                                <UserIcon />
                                <p className="ml-2">{nickname}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="rounded-full text-white px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-transform shadow-md"
                            >
                                Logout
                            </button>

                        </>
                    ) : (
                        <Link href="/login" className="hover:text-pink-600 transition-colors">
                            Login
                        </Link>
                    )}


                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden px-6 py-4 bg-white/95 backdrop-blur-md border-t shadow-sm space-y-4">
                    <Link href="/chat" onClick={toggleMenu} className="block">
                        Chat
                    </Link>

                    {nickname ? (
                        <>
                            <span className="block text-gray-800 font-medium">Hi {nickname}</span>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                router.push('login')
                            }}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Login
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}
