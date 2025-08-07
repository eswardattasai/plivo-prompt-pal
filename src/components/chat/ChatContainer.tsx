import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatContainer = ({ messages, isLoading }: ChatContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background via-background to-secondary/20"
    >
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                AI
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to AskMe Bot</h3>
            <p className="text-muted-foreground text-sm">
              I'm your helpful AI assistant. Ask me anything and I'll do my best to help you!
            </p>
          </div>
        </div>
      )}
      
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message.content}
          isUser={message.isUser}
          timestamp={message.timestamp}
        />
      ))}
      
      {isLoading && (
        <ChatMessage
          message=""
          isUser={false}
          timestamp={new Date()}
          isLoading={true}
        />
      )}
    </div>
  );
};