import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { Send, Sparkles, ScrollText, ChevronDown } from "lucide-react";

export default function ChatWindow({ chat, onSendMessage, isTyping = false }) {
  const endRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!userScrolled) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, userScrolled]);

  // Handle scroll events to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      setShowScrollButton(!isNearBottom);
      
      if (!isNearBottom) {
        setUserScrolled(true);
      } else {
        setUserScrolled(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    setUserScrolled(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const TypingIndicator = () => (
    <div className="flex gap-1.5 py-1">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-typing"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-typing animation-delay-200"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-typing animation-delay-400"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0f0f13] text-gray-100 font-sans">
      {/* Header - Minimal & Glossy */}
      <div className="sticky top-0 z-20 bg-[#1a1a1f]/80 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-1.5 shadow-lg shadow-cyan-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white text-base font-semibold tracking-tight">Nova AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-gray-400 text-xs">Ready to assist</p>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200">
          <ScrollText size={18} />
        </button>
      </div>

      {/* Messages Container - Custom scrollbar, smooth scrolling */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-700
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-600"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-1">
          {chat.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 animate-fade-in-up">
              <div className="text-7xl mb-4">✨</div>
              <h3 className="text-2xl font-medium bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                Start a conversation
              </h3>
              <p className="text-gray-400 mt-2 max-w-md">
                Ask me anything — from coding to creativity. I'm here to help.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-8">
                {["Explain quantum computing", "Write a poem about code", "Help me brainstorm ideas"].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInputValue(prompt);
                      // Optional: auto-send? For now just fill input
                    }}
                    className="bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200 backdrop-blur-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chat.map((msg, i) => (
                <Message 
                  key={msg.id || i} 
                  role={msg.role} 
                  text={msg.text}
                  timestamp={msg.timestamp}
                  isLast={i === chat.length - 1}
                />
              ))}
              {isTyping && (
                <div className="flex items-start gap-3 animate-slide-in">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm shadow-md">
                    ✨
                  </div>
                  <div className="bg-[#1e1e24] rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm border border-white/5">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </>
          )}
        </div>
      </div>

      {/* Scroll to bottom button - sleek */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-28 right-6 bg-[#1e1e24] backdrop-blur-md border border-white/10 rounded-full py-2 px-4 flex items-center gap-2 shadow-lg hover:bg-[#2a2a32] transition-all duration-200 text-sm font-medium text-gray-200 z-20 animate-slide-in-right"
        >
          <ChevronDown size={18} />
          <span>New messages</span>
        </button>
      )}

      {/* Input Area - Dark, clean, with focus glow */}
      {onSendMessage && (
        <div className="bg-[#0f0f13]/95 backdrop-blur-sm border-t border-white/5 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-[#1a1a1f] rounded-2xl p-1.5 border border-gray-800 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all duration-200">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none p-2 text-gray-100 placeholder:text-gray-500 font-sans text-sm resize-none outline-none max-h-32"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`rounded-xl px-3 py-2 transition-all duration-200 ${
                  inputValue.trim()
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:scale-105"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 text-center">
              <span className="text-gray-500 text-xs">Enter to send · Shift + Enter for new line</span>
            </div>
            
          </div>
        </div>
      )}

      {/* Global animation styles */}
      <style jsx global>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-typing { animation: typing 1.4s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.25s ease-out; }
        .animate-rotate { animation: rotate 4s linear infinite; }
      `}</style>
    </div>
  );
}