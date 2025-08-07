import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Message } from '@/components/chat/ChatContainer';

const STORAGE_KEY = 'askme-chat-history';
const MAX_QUERIES_PER_SESSION = 5;
const RATE_LIMIT_KEY = 'askme-query-count';

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  canSendMessage: boolean;
  queriesLeft: number;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })) : [];
    } catch {
      return [];
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Rate limiting
  const getQueryCount = useCallback(() => {
    try {
      return parseInt(sessionStorage.getItem(RATE_LIMIT_KEY) || '0', 10);
    } catch {
      return 0;
    }
  }, []);
  
  const incrementQueryCount = useCallback(() => {
    try {
      const current = getQueryCount();
      sessionStorage.setItem(RATE_LIMIT_KEY, (current + 1).toString());
    } catch {
      // Ignore localStorage errors
    }
  }, [getQueryCount]);
  
  const queriesLeft = MAX_QUERIES_PER_SESSION - getQueryCount();
  const canSendMessage = queriesLeft > 0 && !isLoading;
  
  // Save messages to localStorage (keep only last 3)
  const saveMessages = useCallback((newMessages: Message[]) => {
    try {
      const toSave = newMessages.slice(-3); // Keep only last 3 messages
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignore localStorage errors
    }
  }, []);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!canSendMessage) {
      toast.error('Rate limit reached. You can send up to 5 messages per session.');
      return;
    }
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => {
      const updated = [...prev, userMessage];
      saveMessages(updated);
      return updated;
    });
    
    setIsLoading(true);
    incrementQueryCount();
    
    try {
      // Call AI API (this will be implemented via Supabase Edge Function)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => {
        const updated = [...prev, aiMessage];
        saveMessages(updated);
        return updated;
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Sorry, I encountered an error. Please try again.');
      
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'I apologize, but I encountered an error processing your request. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => {
        const updated = [...prev, errorMessage];
        saveMessages(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [canSendMessage, incrementQueryCount, saveMessages]);
  
  return {
    messages,
    isLoading,
    sendMessage,
    canSendMessage,
    queriesLeft,
  };
};
