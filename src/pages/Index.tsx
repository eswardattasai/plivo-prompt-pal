import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { messages, isLoading, sendMessage, canSendMessage, queriesLeft } = useChat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-chat-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AskMe Bot</h1>
              <p className="text-sm text-muted-foreground">Your AI Assistant</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {queriesLeft} queries left
          </Badge>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col shadow-xl bg-background/50 backdrop-blur-sm">
        <ChatContainer messages={messages} isLoading={isLoading} />
        <ChatInput 
          onSendMessage={sendMessage}
          disabled={!canSendMessage}
          placeholder={canSendMessage ? "Ask me anything..." : "Rate limit reached"}
        />
      </div>
    </div>
  );
};

export default Index;
