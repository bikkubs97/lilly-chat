// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { HeartHandshake, Menu, UserIcon, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [nickname, setNickname] = useState<string | null>(null);

    function isActive(href: string) {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    }

    function desktopLinkClass(href: string) {
        return `rounded-full px-3 py-2 transition ${
            isActive(href)
                ? "bg-fuchsia-400/15 text-white ring-1 ring-fuchsia-300/40"
                : "text-slate-200 hover:bg-white/5 hover:text-white"
        }`;
    }

    function desktopActionClass(href: string) {
        return `rounded-full px-5 py-2 text-white transition-transform shadow-md shadow-purple-500/20 hover:scale-105 ${
            isActive(href) ? "bg-fuchsia-500" : "bg-purple-600 hover:bg-fuchsia-500"
        }`;
    }

    function mobileLinkClass(href: string, variant: "quiet" | "action" = "quiet") {
        if (isActive(href)) {
            return "block rounded-full border border-fuchsia-300/50 bg-fuchsia-400/20 px-5 py-3 text-center text-white transition";
        }

        if (variant === "action") {
            return "block rounded-full bg-purple-600 px-5 py-3 text-center text-white transition hover:bg-fuchsia-500";
        }

        return "block rounded-full bg-slate-900/90 px-5 py-3 text-center text-white transition hover:bg-slate-800";
    }

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
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-950/60 backdrop-blur-3xl shadow-black/10 shadow-sm backdrop-saturate-150">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                {/* Logo */}
                <Link href={'/'}>
                    <div className="flex items-center gap-2">
                        <HeartHandshake className="w-6 h-6 text-fuchsia-400" />
                        <h1 className="text-xl font-bold tracking-tight text-white">Lilly.live</h1>
                    </div>
                </Link>
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-200">
                    <Link href="/" className={desktopLinkClass("/")}>
                        Home
                    </Link>
                    <Link href="/chat" className={desktopLinkClass("/chat")}>
                        Chat
                    </Link>
                    {!nickname && (
                        <Link href="/signup" className={desktopLinkClass("/signup")}>
                            Sign Up
                        </Link>
                    )}

                    {nickname ? (
                        <>
                            <div className="flex items-center gap-2 text-white font-medium">
                                <UserIcon />
                                <p>{nickname}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="rounded-full text-white px-5 py-2 bg-purple-600 hover:bg-fuchsia-500 hover:scale-105 transition-transform shadow-md shadow-purple-500/20"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className={desktopActionClass("/login")}
                        >
                            Login
                        </Link>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button className="text-white" onClick={toggleMenu}>
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
{menuOpen && (
    <div className="md:hidden px-6 py-4 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/20 space-y-4">
        <Link
            href="/"
            onClick={toggleMenu}
            className={mobileLinkClass("/")}
        >
            Home
        </Link>
        <Link
            href="/chat"
            onClick={toggleMenu}
            className={mobileLinkClass("/chat", "action")}
        >
            Chat
        </Link>
        {!nickname && (
            <Link
                href="/signup"
                onClick={toggleMenu}
                className={mobileLinkClass("/signup", "action")}
            >
                Sign Up
            </Link>
        )}

        {nickname ? (
            <>
                <div className="rounded-3xl bg-slate-900/90 px-4 py-3 text-center text-sm font-medium text-white">
                    Hi {nickname}
                </div>
                <button
                    onClick={() => {
                        handleLogout();
                        toggleMenu();
                    }}
                    className="w-full rounded-full px-5 py-3 bg-purple-600 text-white hover:bg-fuchsia-500 transition shadow-md shadow-purple-500/20"
                >
                    Logout
                </button>
            </>
        ) : (
            <Link
                href="/login"
                onClick={toggleMenu}
                className={mobileLinkClass("/login", "action")}
            >
                Login
            </Link>
        )}
    </div>
)}

                
            
        </header>
    );
}
