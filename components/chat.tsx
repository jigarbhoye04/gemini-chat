import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Define types for our components
interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

interface ChatContainerProps {
  children: React.ReactNode;
}

interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  isLoading?: boolean;
}

interface Message {
  text: string;
  isUser: boolean;
}

// Redesigned message component with card styling and shadows
const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
          <Sparkles size={16} className="text-primary" />
        </div>
      )}
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-xl px-5 py-3.5 shadow-sm ${
          isUser
            ? 'bg-primary text-primary-foreground shadow-primary/10'
            : 'bg-card text-card-foreground shadow-muted/10 border border-border/30'
        }`}
      >
        {isUser ? (
          <div className="break-words whitespace-pre-wrap text-sm md:text-base leading-relaxed">{message}</div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none break-words">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ml-2">
          <span className="text-xs font-medium text-primary">You</span>
        </div>
      )}
    </div>
  );
};

// Enhanced chat container with improved scrolling
const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-6xl mx-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      {children}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Modern input area with animations and micro-interactions
const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Type a message...",
  isLoading = false 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit(e);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <form onSubmit={handleFormSubmit} className="border-t border-border/50 p-4 bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="relative flex items-end gap-2 bg-card rounded-2xl shadow-sm border border-border/40 p-2 transition-all focus-within:border-primary/50 focus-within:shadow-md focus-within:shadow-primary/5">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 text-base md:text-lg bg-transparent resize-none p-3 max-h-[200px] focus:outline-none"
            rows={1}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }
            }}
          />
          <button 
            type="submit"
            disabled={!value.trim() || isLoading}
            className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center h-12 w-12 self-end"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span className="sr-only">Send</span>
          </button>
        </div>
        <div className="text-xs text-muted-foreground mt-2 px-3">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">Shift+Enter</kbd> for new line
        </div>
      </div>
    </form>
  );
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const newMessage: Message = { text: inputValue, isUser: true };
    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue }),
      });

      const data: { text: string } = await response.json();
      if (data.text) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.text, isUser: false },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      <div className="border-b border-border/50 p-4 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gemini Chat
            </h1>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            AI Assistant
          </div>
        </div>
      </div>
      <ChatContainer>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-2 text-foreground">How can I help you today?</h2>
            <p className="text-center max-w-md">Ask a question or start a conversation with Gemini AI.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div className="bg-card text-card-foreground rounded-xl px-5 py-3.5 max-w-[85%] md:max-w-[70%] shadow-sm border border-border/30">
              <div className="flex space-x-2 items-center h-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </ChatContainer>
      <ChatInput
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
        placeholder="Ask me anything..."
      />
    </div>
  );
};

export default Chat;