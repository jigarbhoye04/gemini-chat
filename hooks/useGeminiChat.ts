import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export function useGeminiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize with a welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: "Hey there! ✨ I'm Gemini, your AI assistant. How can I help you today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Cancel any existing request
    cancelRequest();

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
        signal: abortControllerRef.current.signal
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `Error ${response.status}: Something went wrong`);
        }

        if (!data.text) {
          throw new Error('The response was empty');
        }

        const assistantMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: data.text,
          timestamp: new Date()
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } else {
        // If the response is not JSON, treat it as text
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was canceled');
      } else {
        console.error('Error in handleSubmit:', error);
        setError(error instanceof Error ? error.message : 'Something went wrong with your request');
      }
    } finally {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const clearChat = () => {
    cancelRequest();
    const welcomeMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: "Chat cleared! How can I help you with something new?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setError(null);
  };

  return {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    clearChat,
    cancelRequest
  };
}

