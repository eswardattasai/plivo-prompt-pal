interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isUser, timestamp, isLoading }: ChatMessageProps) => {
  if (isLoading) {
    return (
      <div className="flex items-start gap-3 mb-4 animate-message-slide-in">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-medium">
          AI
        </div>
        <div className="bg-chat-bot border border-chat-border rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] shadow-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dots"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dots" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dots" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 mb-4 animate-message-slide-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        isUser 
          ? 'bg-chat-user text-chat-user-foreground' 
          : 'bg-accent text-accent-foreground'
      }`}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className={`rounded-2xl px-4 py-3 max-w-[80%] shadow-sm ${
        isUser 
          ? 'bg-chat-user text-chat-user-foreground rounded-tr-sm' 
          : 'bg-chat-bot border border-chat-border text-chat-bot-foreground rounded-tl-sm'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        <p className={`text-xs mt-1 opacity-70 ${
          isUser ? 'text-chat-user-foreground' : 'text-muted-foreground'
        }`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};