"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I'm JANI-AI. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);

    // Fake bot response (replace with real API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `You said: "${input}"` },
      ]);
    }, 600);

    setInput("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-white border border-[#77af9c] shadow-lg transition-all z-200"
        >
          <MessageCircle className="text-[#77af9c] w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-10 right-6 w-[350px] max-w-[90vw] h-[500px] flex flex-col rounded-2xl shadow-2xl border border-[#77af9c] bg-white overflow-hidden z-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-[#77af9c] text-white p-4">
              <h2 className="text-lg font-semibold">JANI-AI</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-green-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    msg.role === "bot"
                      ? "bg-[#a1e9d1] text-green-900 self-start"
                      : "bg-[#77af9c] text-white self-end"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#77af9c] bg-white flex items-center gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-full border border-[#77af9c] focus:outline-none focus:ring-2 focus:ring-[#77af9c]"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-full bg-[#77af9c] hover:bg-[#77af9c] transition-colors"
              >
                <Send className="text-white w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
