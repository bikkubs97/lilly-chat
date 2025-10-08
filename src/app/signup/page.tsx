"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "../_partials/header";
import Footer from "../_partials/footer";

export default function SignupPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Regex for strong password: at least one letter, one number, one special character
  const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^_-]).*$/;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    // Required fields validation
    if (!nickname.trim() || !email.trim() || !password || !rePassword) {
      setError("All fields are required.");
      return;
    }

    // Nickname length
    if (nickname.trim().length < 3) {
      setError("Nickname must be at least 3 characters long.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Strong password check
    if (!strongPasswordRegex.test(password)) {
      setError(
        "Password must contain at least one letter, one number, and one special character."
      );
      return;
    }

    // Password match
    if (password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Signup failed.");
        return;
      }

      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-purple-400">
            Sign Up to Lilly
          </h1>

          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          {success && (
            <p className="text-green-500 text-center font-medium">{success}</p>
          )}

          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Re-enter Password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-transform rounded-full py-3 text-white text-lg shadow-lg"
          >
            Sign Up
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
