import { useState, useEffect } from "react";
import Sidebar from "./component/Sidebar";
import ChatWindow from "./component/ChatWindow";
import InputBar from "./component/InputBar";
import { sendToAI } from "./services/api";
import { speak } from "./utils/speak";
import { Menu } from "lucide-react";
import "./App.css";
import Auth from "./component/Auth";

export default function App() {
  /* =========================
     USER ID (Persistent)
  ========================= */

  const [userId] = useState(() => {
    let storedId = localStorage.getItem("userId");

    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem("userId", storedId);
    }

    return storedId;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  /* =========================
     STATES
  ========================= */

  const [voiceOn, setVoiceOn] = useState(true);

  const [chat, setChat] = useState([
    {
      role: "assistant",
      text: "Hello! I'm Jarvis 🤖",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [conversations, setConversations] = useState([]);

  const [activeConversationId, setActiveConversationId] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  /* =========================
     MOBILE DETECTION
  ========================= */

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* =========================
     LOAD SAVED CONVERSATIONS
  ========================= */

  useEffect(() => {
    const saved = localStorage.getItem("conversations");

    if (saved) {
      setConversations(JSON.parse(saved));
    }
  }, []);

  /* =========================
     SAVE CONVERSATIONS
  ========================= */

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage = async (messageText) => {
    const text = messageText || input;

    if (!text.trim() || isTyping) return;

    /* ----- USER MESSAGE ----- */

    const userMessage = {
      role: "user",
      text,
      timestamp: new Date(),
    };

    setChat((prev) => [...prev, userMessage]);

    setInput("");

    setIsTyping(true);

    /* ----- CREATE NEW CHAT TITLE ----- */

    if (!activeConversationId) {
      const newId = Date.now().toString();

      const title = text.slice(0, 30) + (text.length > 30 ? "..." : "");

      setConversations((prev) => [
        {
          id: newId,
          title,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...prev,
      ]);

      setActiveConversationId(newId);
    }

    try {
      /* ----- SEND TO AI ----- */

      const reply = await sendToAI(text);

      /* ----- AI MESSAGE ----- */

      const assistantMessage = {
        role: "assistant",
        text: reply,
        timestamp: new Date(),
      };

      setChat((prev) => [...prev, assistantMessage]);

      /* ----- SPEAK RESPONSE ----- */

      if (voiceOn && reply) {
        speak(reply);
      }

      /* ----- UPDATE CONVERSATION ----- */

      if (activeConversationId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  updatedAt: new Date(),
                }
              : conv,
          ),
        );
      }
    } catch (error) {
      console.error("API ERROR:", error);

      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* =========================
     NEW CHAT
  ========================= */

  const handleNewChat = () => {
    const newId = Date.now().toString();

    setConversations((prev) => [
      {
        id: newId,
        title: "New Conversation",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...prev,
    ]);

    setActiveConversationId(newId);

    setChat([
      {
        role: "assistant",
        text: "Hello! I'm Jarvis 🤖",
        timestamp: new Date(),
      },
    ]);

    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  /* =========================
     SELECT CHAT
  ========================= */

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);

    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  /* =========================
     DELETE CHAT
  ========================= */

  const handleDeleteConversation = (id) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));

    if (activeConversationId === id) {
      setActiveConversationId(null);

      setChat([
        {
          role: "assistant",
          text: "Hello! I'm Jarvis 🤖",
          timestamp: new Date(),
        },
      ]);
    }
  };
  // Logout function
  const handleLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("conversations");
    setIsAuthenticated(false);
  }




  if (!isAuthenticated) {
    return (
      <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="app">
      {/* ================= Sidebar ================= */}

      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}

      />

      {/* ================= Main Chat ================= */}

      <div className="chat-container">
        {/* ===== Mobile Menu Button ===== */}

        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 bg-[#1a1a1f] p-2 rounded-xl border border-gray-800 shadow-lg text-gray-300 hover:text-white md:hidden"
          >
            <Menu size={20} />
          </button>
        )}

        {/* ===== Chat Window ===== */}

        <ChatWindow chat={chat} isTyping={isTyping} />

        {/* ===== Input ===== */}

        <InputBar
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          isLoading={isTyping}
          voiceOn={voiceOn}
          onToggleVoice={() => setVoiceOn(!voiceOn)}
        />
      </div>
    </div>
  );
}
