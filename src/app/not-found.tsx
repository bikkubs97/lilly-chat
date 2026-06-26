"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartHandshake } from "lucide-react";
import Header from "./_partials/header";
import Footer from "./_partials/footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <div className="mb-6 flex justify-center">
            <HeartHandshake className="w-24 h-24 text-fuchsia-400 opacity-80" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-white">404</h1>
          <p className="text-2xl md:text-3xl font-bold mb-3 text-fuchsia-300">Page Not Found</p>
          <p className="text-slate-300 mb-8 text-lg">
            Oops! The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/chat">Start Chatting</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
