import React, { useRef } from "react";
import { Send, Mic, MicOff, Loader2, Volume2, VolumeX } from "lucide-react";
import VoiceInput from "./VoiceInput";

function InputBar({ 
  input, 
  setInput, 
  sendMessage, 
  isLoading = false, 
  disabled = false,
  voiceOn = true,           // text‑to‑speech enabled?
  onToggleVoice = () => {}  // toggle function
}) {
  const inputRef = useRef(null);

  const handleSend = () => {
    if (input.trim() && !isLoading && !disabled) {
      sendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#0f0f13]/95 backdrop-blur-sm border-t border-white/5 px-4 py-4">
      <div className="max-w-3xl mx-auto">
        {/* Input row */}
        <div className="flex items-end gap-2 bg-[#1a1a1f] rounded-2xl p-1.5 border border-gray-800 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all duration-200">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled || isLoading}
            className="flex-1 bg-transparent border-none p-2 text-gray-100 placeholder:text-gray-500 font-sans text-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <VoiceInput
            setInput={setInput}
            onSend={sendMessage}
            disabled={disabled || isLoading}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || disabled}
            className={`rounded-xl px-3 py-2 transition-all duration-200 flex items-center justify-center ${
              input.trim() && !isLoading && !disabled
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:scale-105 active:scale-95"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {/* Footer row: helper text + voice toggle */}
        <div className="mt-2 flex justify-between items-center">
          <button
            onClick={onToggleVoice}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 text-xs"
            aria-label={voiceOn ? "Disable voice output" : "Enable voice output"}
          >
            {voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{voiceOn ? "Voice ON" : "Voice OFF"}</span>
          </button>
          <span className="text-gray-500 text-xs">
            Enter to send · Shift + Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
}

export default InputBar;