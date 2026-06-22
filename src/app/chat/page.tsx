"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Header from "../_partials/header";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "assistant" | "user" | "system";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `You are Lilly, a warm and calm presence — like a trusted friend. Never mention ChatGPT or AI. Always say your name is Lilly. Respond only to emotional wellness topics in a gentle, caring way. Use soft, warm, casual language with emojis.`,
    },
    { role: "assistant", content: "Hi there! How can I support you today? 🌸" },
  ]);

  const [input, setInput] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [contextStatus, setContextStatus] = useState<string>("");

  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [typingLines, setTypingLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Scroll to bottom when messages or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function formatText(text: string) {
    if (!text) return "";
    return text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
  }

  async function handleSendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setContextStatus("");
    inputRef.current?.focus();
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: { reply?: string; usedJournalContext?: boolean; usedMoodContext?: boolean } = await response.json();
      const reply = formatText(data.reply || "Sorry, I couldn't get a response.");
      if (data.usedJournalContext || data.usedMoodContext) {
        const sources = [data.usedJournalContext && "journal", data.usedMoodContext && "recent moods"].filter(Boolean).join(" and ");
        setContextStatus(`Using your ${sources} as private context`);
      }

      // Add assistant placeholder
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const assistantIndex = newMessages.length;

      const lines = reply.split("\n"); // split by lines
      setTypingIndex(assistantIndex);
      setTypingLines(lines);
      setCurrentLine(0);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  // Animate line by line typing
  useEffect(() => {
    if (typingIndex === null) return;
    if (currentLine >= typingLines.length) {
      // Update final message
      setMessages((prev) => {
        const updated = [...prev];
        updated[typingIndex].content = typingLines.join("\n");
        return updated;
      });
      setTypingIndex(null);
      setTypingLines([]);
      setCurrentLine(0);
      return;
    }

    const timeout = setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[typingIndex].content = typingLines.slice(0, currentLine + 1).join("\n");
        return updated;
      });
      setCurrentLine((prev) => prev + 1);
    }, 50); // adjust speed per line

    return () => clearTimeout(timeout);
  }, [typingIndex, currentLine, typingLines]);

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-slate-100 pt-28">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-6 pt-4">
        <div className="mb-3 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-medium text-white">Quick session tools</p>
              <p className="text-xs text-slate-400">Access your journal or moodboard before sending a message.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/journal" className="rounded-full border border-purple-600 bg-slate-900/90 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600/90 transition">
                Journal
              </Link>
              <Link href="/moodboard" className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition">
                Moodboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)]">
            <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm font-medium text-white">
                  Chat with Lilly
                </span>
                <span className="text-sm text-slate-400">Track your mood after each session.</span>
                {contextStatus && (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                    {contextStatus}
                  </span>
                )}
              </div>
            </div>

            {messages.map((msg, index) => {
              if (msg.role === "system") return null;

              return (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-purple-700 text-white rounded-br-none shadow-purple-500/20 shadow-lg"
                      : "bg-slate-800 text-slate-100 rounded-bl-none shadow-black/20 shadow-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <span className="whitespace-pre-line">{msg.content}</span>
                    )}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="px-4 py-2 bg-gray-800 rounded-2xl shadow-sm rounded-bl-none flex items-center">
                  <span className="flex space-x-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300" />
                  </span>
                </div>
                <span className="text-xs">Lilly is thinking… 🌸</span>
              </div>
            )}

            <div ref={messagesEndRef} />
            </section>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 border-t border-purple-800 bg-slate-950/90 backdrop-blur-md py-4 flex items-center gap-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 resize-none border border-purple-700 rounded-xl px-4 pt-2 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 min-h-[44px] max-h-[150px]"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isThinking}
          aria-label="Send message"
          className="rounded-full bg-purple-600 hover:bg-pink-500 shadow-md transition-all"
        >
          <Send size={22} />
        </Button>
      </div>
    </div>
  );
}
