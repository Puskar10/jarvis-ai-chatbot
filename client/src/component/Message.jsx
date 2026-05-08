export default function Message({ role, text, timestamp, isLast }) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} ${isLast ? 'animate-fade-in-up' : 'animate-slide-in'} group`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-md ${
        isUser 
          ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-gray-200' 
          : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
      }`}>
        {isUser ? 'U' : 'AI'}
      </div>
      
      {/* Bubble */}
      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl relative ${
        isUser 
          ? 'bg-[#1e1e24] text-gray-100 rounded-br-sm border border-gray-800' 
          : 'bg-[#2a2a32] text-gray-200 rounded-bl-sm border border-white/5 shadow-sm'
      }`}>
        <div className="leading-relaxed break-words whitespace-pre-wrap text-sm">
          {text}
        </div>
        {timestamp && (
          <div className={`text-[10px] mt-1.5 ${isUser ? 'text-gray-500' : 'text-gray-400'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}