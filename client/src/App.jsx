import { useState, useEffect } from "react";
import Sidebar from "./component/Sidebar";
import ChatWindow from "./component/ChatWindow";
import InputBar from "./component/InputBar";
import Auth from "./component/Auth";

import {
  sendToAI,
  getConversations,
  getConversationMessages,
  deleteConversationFromDB,
} from "./services/api";

import { speak } from "./utils/speak";
import { Menu } from "lucide-react";
import "./App.css";

export default function App() {
  /* =========================
     AUTH STATE
  ========================= */

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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  /* =========================
     LOAD CONVERSATIONS FROM DB
  ========================= */

  const loadConversations = async () => {
    try {
      const data = await getConversations();

      const formatted = data.map((conv) => ({
        id: conv._id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      }));

      setConversations(formatted);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage = async (messageText) => {
    const text = messageText || input;

    if (!text.trim() || isTyping) return;

    const userMessage = {
      role: "user",
      text,
      timestamp: new Date(),
    };

    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await sendToAI(text, activeConversationId);

      const reply = data.reply;

      if (!activeConversationId) {
        setActiveConversationId(data.conversationId);
      }

      const assistantMessage = {
        role: "assistant",
        text: reply,
        timestamp: new Date(),
      };

      setChat((prev) => [...prev, assistantMessage]);

      if (voiceOn && reply) {
        speak(reply);
      }

      await loadConversations();
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
    setActiveConversationId(null);

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
     SELECT CONVERSATION
  ========================= */

  const handleSelectConversation = async (id) => {
    try {
      setActiveConversationId(id);

      const messages = await getConversationMessages(id);

      const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        text: msg.message,
        timestamp: new Date(msg.createdAt),
      }));

      setChat(formattedMessages);

      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  /* =========================
     DELETE CONVERSATION
  ========================= */

  const handleDeleteConversation = async (id) => {
    try {
      await deleteConversationFromDB(id);

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
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("conversations");
    localStorage.removeItem("userId");

    setIsAuthenticated(false);
    setActiveConversationId(null);
    setConversations([]);

    setChat([
      {
        role: "assistant",
        text: "Hello! I'm Jarvis 🤖",
        timestamp: new Date(),
      },
    ]);
  };

  /* =========================
     AUTH PAGE
  ========================= */

  if (!isAuthenticated) {
    return (
      <Auth
        onAuthSuccess={() => {
          setIsAuthenticated(true);
        }}
      />
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="app">
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

      <div className="chat-container">
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 bg-[#1a1a1f] p-2 rounded-xl border border-gray-800 shadow-lg text-gray-300 hover:text-white md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <ChatWindow chat={chat} isTyping={isTyping} />

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