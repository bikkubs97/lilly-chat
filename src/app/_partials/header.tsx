// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { HeartHandshake, Menu, UserIcon, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CHAT_SESSION_STORAGE_KEY = "lilly.chatSessionMessages";

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
        return `rounded-full px-3 py-2 transition-colors duration-200 ${
            isActive(href)
                ? "bg-fuchsia-400/15 text-white ring-1 ring-fuchsia-300/40"
                : "text-slate-200 hover:bg-white/5 hover:text-white"
        }`;
    }

    function desktopActionClass(href: string) {
        return `inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all duration-200 ${
            isActive(href) ? "bg-fuchsia-500" : "bg-purple-600 hover:-translate-y-0.5 hover:bg-fuchsia-500 hover:shadow-lg hover:shadow-fuchsia-500/20"
        }`;
    }

    function mobileLinkClass(href: string, variant: "quiet" | "action" = "quiet") {
        if (isActive(href)) {
            return "block rounded-full border border-fuchsia-300/50 bg-fuchsia-400/20 px-5 py-3 text-center font-semibold text-white transition-colors duration-200";
        }

        if (variant === "action") {
            return "block rounded-full bg-purple-600 px-5 py-3 text-center font-semibold text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:bg-fuchsia-500";
        }

        return "block rounded-full border border-white/10 bg-slate-900/90 px-5 py-3 text-center font-semibold text-white transition-colors duration-200 hover:border-fuchsia-300/40 hover:bg-slate-800";
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

    async function saveMoodBeforeLogout(token: string) {
        const storedMessages = localStorage.getItem(CHAT_SESSION_STORAGE_KEY);
        if (!storedMessages) return;

        try {
            const messages = JSON.parse(storedMessages);
            const hasUserMessages = Array.isArray(messages) && messages.some((message) => message?.role === "user");

            if (!hasUserMessages) {
                localStorage.removeItem(CHAT_SESSION_STORAGE_KEY);
                return;
            }

            const response = await fetch("/api/moodboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ messages }),
            });

            if (response.ok) {
                localStorage.removeItem(CHAT_SESSION_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Unable to register mood before logout", error);
        }
    }

    async function handleLogout() {
        const token = localStorage.getItem("token");
        if (token) {
            await saveMoodBeforeLogout(token);
        }

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
                    <Link href="/journal" className={desktopLinkClass("/journal")}>
                        Journal
                    </Link>
                    <Link href="/moodboard" className={desktopLinkClass("/moodboard")}>
                        Moodboard
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
                            <Button
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
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
                    <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
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
        <Link
            href="/journal"
            onClick={toggleMenu}
            className={mobileLinkClass("/journal")}
        >
            Journal
        </Link>
        <Link
            href="/moodboard"
            onClick={toggleMenu}
            className={mobileLinkClass("/moodboard")}
        >
            Moodboard
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
                <Button
                    onClick={() => {
                        handleLogout();
                        toggleMenu();
                    }}
                    className="w-full"
                >
                    Logout
                </Button>
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
