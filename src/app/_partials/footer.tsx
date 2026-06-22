
"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-950/90 border-t border-white/10 py-10 shadow-inner shadow-black/20 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                        <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/chat" className="hover:text-fuchsia-300 transition">Chat</Link></li>
                            <li><Link href="/journal" className="hover:text-fuchsia-300 transition">Journal</Link></li>
                            <li><Link href="/moodboard" className="hover:text-fuchsia-300 transition">Moodboard</Link></li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <h3 className="text-sm font-semibold text-white mb-3">Resources</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/privacy" className="hover:text-fuchsia-300 transition">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-fuchsia-300 transition">Terms of Service</Link></li>
                            <li><a href="mailto:bikku4444@gmail.com" className="hover:text-fuchsia-300 transition">Contact</a></li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <h3 className="text-sm font-semibold text-white mb-3">About</h3>
                        <p className="text-sm text-slate-400">
                            Lilly is your loyal companion for emotional wellness and self-reflection.
                        </p>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-6 text-center">
                    <p className="text-sm text-slate-300">
                        &copy; Bikku BS — Not a substitute for clinical therapy.
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                        Built to be calm, welcoming, and easy to use.
                    </p>
                </div>
            </div>
        </footer>
    );
}
