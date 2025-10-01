"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "../_partials/header";
import Footer from "../_partials/footer";

export default function LoginPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nickname || !email || !password || !rePassword) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    if (password !== rePassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    setError("");
    
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Signup failed.");
        setSuccess("");
        return;
      }

      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // 2 seconds delay before redirect

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSuccess("");
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white text-gray-900 flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white border border-blue-200 rounded-2xl shadow-xl p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-purple-700">Sign Up to Lilly</h1>

          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-center font-medium">{success}</p>
          )}

          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 border border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          <input
            type="password"
            placeholder="Re-enter Password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            className="w-full p-3 border border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform rounded-full py-3 text-white text-lg shadow-lg"
          >
            Sign Up
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
