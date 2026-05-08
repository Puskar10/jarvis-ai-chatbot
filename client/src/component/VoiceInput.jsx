import { useState, useRef } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";

export default function VoiceInput({ setInput, onSend, disabled = false }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = () => {
    // Clear any previous errors
    setError(null);

    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Create recognition instance
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // can be made configurable
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    // Set up event handlers
    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);

      // Auto-send after voice input (optional)
      if (onSend && transcript.trim()) {
        setTimeout(() => onSend(transcript), 100);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      recognitionRef.current = null;

      // User-friendly error messages
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please allow mic access.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else if (event.error === "audio-capture") {
        setError("No microphone found. Please check your mic.");
      } else {
        setError(`Voice error: ${event.error}`);
      }
      setTimeout(() => setError(null), 3000);
    };

    // Start listening
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setError("Could not start voice input.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const handleClick = () => {
    if (disabled) return;
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`rounded-xl p-2 transition-all duration-200 ${
          listening
            ? "bg-red-500/20 text-red-400 animate-pulse"
            : "text-gray-400 hover:text-white hover:bg-gray-800"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={listening ? "Stop recording" : "Voice input"}
        title={listening ? "Stop listening" : "Start voice input"}
      >
        {listening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>

      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap z-10 pointer-events-none animate-fade-in-up">
          <div className="flex items-center gap-1">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-red-500/90"></div>
        </div>
      )}
    </div>
  );
}