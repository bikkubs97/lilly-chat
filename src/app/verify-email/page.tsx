"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "../_partials/header";
import Footer from "../_partials/footer";
import { Button } from "@/components/ui/button";

function VerifyEmailCard() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    async function verifyEmail() {
      if (!email || !token) {
        setMessage("");
        setError("This verification link is missing required information.");
        return;
      }

      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage("");
          setError(data.error || "Unable to verify your email.");
          return;
        }

        setIsVerified(true);
        setMessage(data.message || "Email verified successfully.");
      } catch (err) {
        console.error(err);
        setMessage("");
        setError("Something went wrong. Please try again.");
      }
    }

    verifyEmail();
  }, [email, token]);

  return (
    <div className="w-full max-w-md rounded-3xl border border-purple-700 bg-slate-950/95 p-8 text-center shadow-2xl shadow-black/30">
      <h1 className="text-3xl font-bold text-white">Verify email</h1>

      {message && (
        <p className="mt-5 text-sm font-medium text-green-400">{message}</p>
      )}

      {error && (
        <p className="mt-5 text-sm font-medium text-red-400">{error}</p>
      )}

      <Button asChild className="mt-8 w-full" size="lg">
        <Link href={isVerified ? "/login" : "/signup"}>
          {isVerified ? "Go to login" : "Back to signup"}
        </Link>
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white">
      <Header />

      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="text-sm font-medium text-slate-200">
              Loading verification...
            </div>
          }
        >
          <VerifyEmailCard />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}
