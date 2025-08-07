import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSendMessage, disabled, placeholder = "Ask me anything..." }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 bg-background border-t border-chat-border">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-chat-input border-chat-border focus:border-primary focus:ring-primary/20"
      />
      <Button 
        type="submit" 
        disabled={!message.trim() || disabled}
        className="px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};