import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Trash2, 
  Settings, 
  User,
  X,
  Menu
} from "lucide-react";

export default function Sidebar({ 
  conversations, 
  activeConversationId, 
  onNewChat, 
  onSelectConversation, 
  onDeleteConversation,
  isOpen = false,        // controlled by parent (for mobile)
  onClose = () => {}     // close drawer (mobile only)
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredConversations = conversations?.filter(conv =>
    conv.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const groupConversations = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const groups = { today: [], yesterday: [], older: [] };

    filteredConversations.forEach(conv => {
      const convDate = new Date(conv.updatedAt || conv.createdAt);
      if (convDate.toDateString() === today.toDateString()) groups.today.push(conv);
      else if (convDate.toDateString() === yesterday.toDateString()) groups.yesterday.push(conv);
      else groups.older.push(conv);
    });
    return groups;
  };

  const groups = groupConversations();

  const renderConversationGroup = (title, convs) => {
    if (convs.length === 0) return null;
    return (
      <div className="mt-4 first:mt-0">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {title}
        </h3>
        <div className="space-y-0.5">
          {convs.map(conv => (
            <div
              key={conv.id}
              onClick={() => {
                onSelectConversation?.(conv.id);
                if (isMobile) onClose(); // close drawer after selection on mobile
              }}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activeConversationId === conv.id
                  ? "bg-gray-800/80 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="text-sm truncate">{conv.title || "New conversation"}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation?.(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                aria-label="Delete conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sidebar content (shared between desktop and mobile drawer)
  const SidebarContent = () => (
    <>
      {/* Header / Logo + New Chat */}
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">J</span>
            </div>
            <h1 className="text-white font-semibold text-lg tracking-tight">Jarvis</h1>
          </div>
          <button
            onClick={onNewChat}
            className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            aria-label="New chat"
          >
            <Plus size={18} />
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-medium py-2 rounded-xl transition-all duration-200 shadow-md"
        >
          <Plus size={16} />
          <span>New conversation</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-1.5 pl-9 pr-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-8">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
            <p>No conversations yet</p>
            <p className="text-xs mt-1">Click "New conversation" to start</p>
          </div>
        ) : (
          <>
            {renderConversationGroup("Today", groups.today)}
            {renderConversationGroup("Yesterday", groups.yesterday)}
            {renderConversationGroup("Previous 7 days", groups.older)}
          </>
        )}
      </div>

      {/* Footer / User Profile */}
      <div className="border-t border-gray-800/50 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/40 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-sm font-medium">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">User</p>
            <p className="text-xs text-gray-500 truncate">user@example.com</p>
          </div>
          <Settings size={16} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
        </div>
      </div>
    </>
  );

  // Desktop: permanent sidebar
  if (!isMobile) {
    return (
      <aside className="w-72 h-screen bg-[#111114] border-r border-gray-800/50 flex flex-col flex-shrink-0">
        <SidebarContent />
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2a32; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3a3a44; }
        `}</style>
      </aside>
    );
  }

  // Mobile: drawer with overlay
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#111114] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col shadow-2xl`}
      >
        {/* Close button inside drawer (mobile) */}
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-1 rounded-lg bg-gray-800/60 text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Hamburger button (visible only on mobile) */}
      <button
        onClick={() => onClose ? onClose() : null} // This should be a toggle; we'll handle outside
        className="fixed top-4 left-4 z-30 md:hidden bg-[#1a1a1f] p-2 rounded-xl border border-gray-800 shadow-lg text-gray-300 hover:text-white"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
    </>
  );
}