"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../_partials/header";
import Footer from "../../_partials/footer";
import { Button } from "@/components/ui/button";

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function JournalEntryPage() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [message, setMessage] = useState("Loading journal entry…");

  useEffect(() => {
    async function fetchEntry() {
      const token = window.localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to view this journal entry.");
        return;
      }

      try {
        const res = await fetch(`/api/journal/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || "Unable to load this journal entry.");
          return;
        }

        setEntry(data.journalEntry);
        setMessage("");
      } catch (error) {
        console.error(error);
        setMessage("Could not load this journal entry.");
      }
    }

    fetchEntry();
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white">
      <Header />
      <main className="mx-auto flex-1 w-full max-w-6xl px-6 pb-14 pt-24">
        <Button asChild variant="secondary" size="sm">
          <Link href="/journal">← Back to Journal</Link>
        </Button>

        {message ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-slate-300">{message}</div>
        ) : entry ? (
          <article className="mt-8 rounded-3xl border border-purple-700/30 bg-slate-950/80 p-6 shadow-lg shadow-black/20 sm:p-10">
            <p className="text-sm text-slate-400">{new Date(entry.createdAt).toLocaleString()}</p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{entry.title}</h1>
            <div className="mt-8 whitespace-pre-line text-lg leading-8 text-slate-200">{entry.content}</div>
          </article>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
