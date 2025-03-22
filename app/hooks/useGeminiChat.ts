import { useState } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export function useGeminiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `yikes, error ${response.status}! not the vibe...`);
        }

        if (!data.text) {
          throw new Error('bestie the response is giving empty vibes');
        }

        const assistantMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: data.text,
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } else {
        // If the response is not JSON, treat it as text
        const text = await response.text();
        throw new Error(`unexpected response: ${text} (that's so random)"`);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error instanceof Error ? error.message : 'something broke, and I\'m literally crying rn');
    } finally {
      setIsLoading(false);
    }
  };

  const addBotMessage = "hey bestie! ✨ I'm here for all the vibes and hot takes. what's on your mind?";
  return {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    addBotMessage,
  };
}

