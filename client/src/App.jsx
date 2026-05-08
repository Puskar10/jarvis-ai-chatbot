import { useState, useEffect } from "react";
import Sidebar from "./component/Sidebar";
import ChatWindow from "./component/ChatWindow";
import InputBar from "./component/InputBar";
import { sendToAI } from "./services/api";
import { speak } from "./utils/speak";
import { Menu } from "lucide-react";
import "./App.css";

export default function App() {
  // ========== State ==========
  const [voiceOn, setVoiceOn] = useState(true);          // text‑to‑speech toggle
  const [chat, setChat] = useState([
    { role: "assistant", text: "Hello! I'm Jarvis 🤖", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);   // list of past conversations
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // ========== Detect mobile for sidebar ==========
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ========== Save conversations to localStorage (optional) ==========
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  // Load saved conversations on mount
  useEffect(() => {
    const saved = localStorage.getItem("conversations");
    if (saved) setConversations(JSON.parse(saved));
  }, []);

  // ========== Send message to AI ==========
  const sendMessage = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || isTyping) return;

    // Add user message
    const userMessage = { role: "user", text, timestamp: new Date() };
    const updatedChat = [...chat, userMessage];
    setChat(updatedChat);
    setInput("");
    setIsTyping(true);

    // Auto‑save conversation title (first message)
    if (chat.length === 1 && !activeConversationId) {
      const newId = Date.now().toString();
      const title = text.slice(0, 30) + (text.length > 30 ? "..." : "");
      setConversations(prev => [{ id: newId, title, createdAt: new Date(), updatedAt: new Date() }, ...prev]);
      setActiveConversationId(newId);
    }

    try {
      // Prepare messages for API (excluding timestamp)
      const apiMessages = updatedChat.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const reply = await sendToAI(apiMessages);

      const assistantMessage = { role: "assistant", text: reply, timestamp: new Date() };
      setChat(prev => [...prev, assistantMessage]);

      // Voice output if enabled
      if (voiceOn && reply) {
        speak(reply);
      }

      // Update conversation's updatedAt
      if (activeConversationId) {
        setConversations(prev => prev.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, updatedAt: new Date(), title: conv.title || text.slice(0, 30) }
            : conv
        ));
      }
    } catch (error) {
      console.error("API error:", error);
      setChat(prev => [...prev, {
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ========== Sidebar Handlers ==========
  const handleNewChat = () => {
    const newId = Date.now().toString();
    setConversations(prev => [{
      id: newId,
      title: "New conversation",
      createdAt: new Date(),
      updatedAt: new Date()
    }, ...prev]);
    setActiveConversationId(newId);
    setChat([{ role: "assistant", text: "Hello! I'm Jarvis 🤖", timestamp: new Date() }]);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    // Load conversation messages from a backend or local storage
    // For demo, we just simulate loading from an array (you'd replace with real fetch)
    const selected = conversations.find(c => c.id === id);
    if (selected && selected.messages) {
      setChat(selected.messages);
    } else {
      setChat([{ role: "assistant", text: "Start a new conversation", timestamp: new Date() }]);
    }
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleDeleteConversation = (id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      if (conversations.length > 1) {
        const next = conversations.find(c => c.id !== id);
        handleSelectConversation(next.id);
      } else {
        handleNewChat();
      }
    }
  };

  return (
    <div className="app">
      {/* Sidebar – responsive drawer */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="chat-container">
        {/* Hamburger menu button (mobile only) */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 bg-[#1a1a1f] p-2 rounded-xl border border-gray-800 shadow-lg text-gray-300 hover:text-white md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        )}

        <ChatWindow
          chat={chat}
          isTyping={isTyping}
          // Voice output toggle is now inside InputBar, so we don't pass here
        />

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