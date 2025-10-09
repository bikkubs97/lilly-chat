"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Header from "../_partials/header";
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
      content: `
You are Lilly, a warm and calm presence — like a trusted friend.
Never mention ChatGPT or AI. Always say your name is Lilly.
Respond only to emotional wellness topics in a gentle, caring way.
Use soft, warm, casual language with emojis.
`
    },
    { role: "assistant", content: "Hi there! How can I support you today? 🌸" },
  ]);
  const [input, setInput] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Capitalize first letter
  function formatText(text: string): string {
    if (!text) return "";
    const trimmed = text.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  // Send message
  async function handleSendMessage(): Promise<void> {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed }
    ];

    setMessages(newMessages);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: { reply?: string } = await response.json();
      const reply = formatText(data.reply || "Sorry, I couldn't get a response.");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-200">
      <Header />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 md:mx-28">
        {messages.map((msg, index) =>
          msg.role === "system" ? null : (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm ${
                  msg.role === "user"
                    ? "bg-purple-700 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-200 rounded-bl-none"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <span className="whitespace-pre-line">{msg.content}</span>
                )}
              </div>
            </div>
          )
        )}

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
      </div>

      <div className="border-t border-gray-700 bg-gray-900/80 backdrop-blur-md px-2 md:px-28 py-3 flex items-center gap-2 sticky bottom-0">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 resize-none border border-gray-700 rounded-xl px-4 pt-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px] max-h-[150px]"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isThinking}
          className="rounded-full bg-purple-600 hover:bg-purple-700 shadow-md transition-all"
        >
          <Send size={22} />
        </Button>
      </div>
    </div>
  );
}
