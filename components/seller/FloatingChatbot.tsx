"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Bot } from "lucide-react";
import Chatbot from "@/components/seller/Chatbot";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center space-x-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg transition-transform transform hover:scale-110 px-4 py-2 w-auto h-auto text-base"
        >
          {isOpen ? <X size={28} /> : <><Bot size={20} /><span className="text-base">Chatbot</span></>}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-8 z-50 w-full bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col md:max-w-md md:right-8 md:bottom-8 h-fit max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="flex items-center gap-2 text-teal-600 font-semibold">
              <Bot size={18} />
              <span>Chatbot</span>
            </div>
            <button
              type="button"
              aria-label="Close chatbot"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-md p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          <Chatbot />
        </div>
      )}
    </>
  );
}
