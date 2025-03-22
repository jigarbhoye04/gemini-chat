"use client";

import { useGeminiChat } from "@/hooks/useGeminiChat";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Send, Info, Sparkles, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState, KeyboardEvent, FormEvent, ChangeEvent } from "react";

export default function Home() {
   const {
      messages,
      input,
      isLoading,
      error,
      handleInputChange,
      handleSubmit,
   } = useGeminiChat();

   const messagesEndRef = useRef<HTMLDivElement>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const [showNotice, setShowNotice] = useState<boolean>(true);
   const [textareaHeight, setTextareaHeight] = useState<string>("80px");
   
   // Wrapper function to handle type conversion
   const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(e as unknown as ChangeEvent<HTMLInputElement>);
      // Auto-resize textarea based on content
      const textarea = e.target;
      textarea.style.height = "80px";
      const newHeight = Math.min(300, Math.max(80, textarea.scrollHeight));
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(`${newHeight}px`);
   };

   // Auto-scroll to bottom when messages change
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   // Hide notice after 10 seconds
   useEffect(() => {
      const timer = setTimeout(() => {
         setShowNotice(false);
      }, 10000);

      return () => clearTimeout(timer);
   }, []);

   // Handle keyboard events with proper typing
   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
         // Reset textarea height after sending
         if (textareaRef.current) {
            textareaRef.current.style.height = "80px";
            setTextareaHeight("80px");
         }
      }
   };

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   return (
      <main className="flex flex-col h-svh bg-gradient-to-br from-background to-background/95">
         <header className="border-b border-border p-4 bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
                     Gemini Chat
                  </h1>
                  <span className="bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                     Powered by Google AI
                  </span>
               </div>
               
               {messages.length > 3 && (
                  <button 
                     onClick={scrollToBottom}
                     className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                     aria-label="Scroll to bottom"
                  >
                     <ChevronDown className="h-4 w-4" />
                  </button>
               )}
            </div>
         </header>

         <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6" id="chat-container">
               <div className="max-w-6xl mx-auto space-y-6 pb-4">
                  {showNotice && (
                     <Alert className="mb-4 border-accent/50 bg-accent/10 text-accent-foreground animate-in fade-in duration-500">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="font-medium">Welcome to Gemini Chat</AlertTitle>
                        <AlertDescription className="text-sm">
                           This is a demo of Google's Gemini AI. Your conversations aren't saved beyond this session.
                        </AlertDescription>
                     </Alert>
                  )}

                  {error && (
                     <Alert variant="destructive" className="mb-4 animate-in slide-in-from-top duration-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-medium">Error Occurred</AlertTitle>
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                     </Alert>
                  )}

                  {messages.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-[70vh] text-muted-foreground animate-in fade-in duration-500">
                        <div className="text-6xl mb-4 animate-float">✨</div>
                        <h2 className="text-xl md:text-2xl font-medium mb-2 text-foreground">Start a conversation!</h2>
                        <p className="text-center max-w-md">Ask Gemini a question or start a conversation. Try asking about science, math, coding, or creative writing.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 w-full max-w-lg">
                           {[
                              "Explain quantum computing in simple terms",
                              "Write a short poem about technology",
                              "Help me solve: 3x + 5 = 20",
                              "What are some healthy breakfast ideas?"
                           ].map((suggestion, i) => (
                              <button 
                                 key={i}
                                 className="text-sm text-left bg-secondary/50 hover:bg-secondary p-3 rounded-lg transition-colors hover-scale"
                                 onClick={() => {
                                    if (textareaRef.current) {
                                       textareaRef.current.value = suggestion;
                                       handleInputChange({ target: { value: suggestion } } as any);
                                    }
                                 }}
                              >
                                 {suggestion}
                              </button>
                           ))}
                        </div>
                     </div>
                  ) : (
                     messages.map((msg, index) => (
                        <div
                           key={index}
                           className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4 animate-in slide-in-from-${msg.role === "user" ? "right" : "left"} duration-300`}
                        >
                           <div
                              className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                                 msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border/50"
                              }`}
                           >
                              <div className="break-words whitespace-pre-wrap">
                                 {msg.role === "user" ? (
                                    <p className="text-sm md:text-base">{msg.content}</p>
                                 ) : (
                                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))
                  )}
                  {isLoading && (
                     <div className="flex justify-start mb-4 animate-in fade-in duration-200">
                        <div className="bg-card border border-border/50 text-foreground rounded-2xl px-4 py-3 max-w-[90%] sm:max-w-[85%] md:max-w-[75%] shadow-sm">
                           <div className="flex space-x-2 items-center">
                              <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse"></div>
                              <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse delay-150"></div>
                              <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse delay-300"></div>
                           </div>
                        </div>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
               </div>
            </div>

            <form 
               onSubmit={(e) => {
                  handleSubmit(e);
                  // Reset textarea height after sending
                  if (textareaRef.current) {
                     textareaRef.current.style.height = "80px";
                     setTextareaHeight("80px");
                  }
               }} 
               className="border-t border-border p-4 bg-card/80 backdrop-blur-sm sticky bottom-0"
            >
               <div className="max-w-6xl mx-auto flex gap-2 items-end relative">
                  <textarea
                     ref={textareaRef}
                     value={input}
                     onChange={handleTextAreaChange}
                     placeholder="Ask me anything..."
                     className="flex-1 text-base md:text-lg bg-background resize-none border rounded-xl p-3 min-h-[80px] focus:outline-none transition-input focus:border-primary shadow-sm hover:border-input/80"
                     style={{ height: textareaHeight }}
                     disabled={isLoading}
                     onKeyDown={handleKeyDown}
                  />
                  <button
                     type="submit"
                     disabled={isLoading || !input.trim()}
                     className="p-3 h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center hover-scale"
                     aria-label="Send message"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                     >
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                     </svg>
                  </button>
               </div>
               <div className="max-w-6xl mx-auto">
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                     Press Enter to send, Shift+Enter for new line
                  </p>
               </div>
            </form>
         </div>
      </main>
   );
}
