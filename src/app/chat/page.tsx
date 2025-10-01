"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Header from "../_partials/header";

interface Message {
    role: "assistant" | "user";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi there! How can I support you today?" },
    ]);
    const [input, setInput] = useState<string>("");
    const [isThinking, setIsThinking] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    function scrollToBottom(): void {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    async function handleSendMessage(): Promise<void> {
        if (!input.trim()) return;

        const newMessages: Message[] = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setIsThinking(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: { reply?: string } = await response.json();
            const reply = data.reply || "Sorry, I couldn't get a response.";

            setTimeout(() => {
                setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
                setIsThinking(false);
            }, 1200);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Something went wrong. Please try again." },
            ]);
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
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white ">
            {/* Header */}
            <Header />

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 md:mx-28">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${msg.role === "user"
                                    ? "bg-purple-500 text-white rounded-br-none"
                                    : "bg-pink-500 text-gray-800 rounded-bl-none"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* Thinking Animation */}
                {isThinking && (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <div className="px-4 py-2 bg-gray-100 rounded-2xl shadow-sm rounded-bl-none flex items-center">
                            <span className="flex space-x-1">
                                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-150" />
                                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300" />
                            </span>
                        </div>
                        <span className="text-xs">Lilly is thinking…</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-white/80 backdrop-blur-md px-2 md:px-28 py-3 flex items-center gap-2 sticky bottom-0">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setInput(e.target.value)
                    }
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 resize-none border rounded-xl px-4 pt-2 focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[44px]"
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isThinking}
                    className="rounded-full bg-pink-500 hover:bg-pink-600 shadow-md"
                >
                    <Send size={24} />
                </Button>
            </div>
        </div>
    );
}
