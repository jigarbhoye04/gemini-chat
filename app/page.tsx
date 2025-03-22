"use client";

import { useGeminiChat } from "./hooks/useGeminiChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Send, Info, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

export default function GeminiChat() {
   const {
      messages,
      input,
      isLoading,
      error,
      handleInputChange,
      handleSubmit,
   } = useGeminiChat();

   const messagesEndRef = useRef<HTMLDivElement>(null);
   const [showNotice, setShowNotice] = useState(true);

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

   return (
      <div className="flex items-center justify-center min-h-screen bg-background">
         <div className="w-full max-w-3xl h-[90vh] px-4 md:px-0 flex flex-col gap-3">
            {/* Main chat interface */}
            <Card className="w-full h-full flex flex-col shadow-sm overflow-hidden rounded-lg">
               <CardHeader className="border-b py-3">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                           <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                           <CardTitle className="text-lg font-medium">vibe check ✨</CardTitle>
                           <p className="text-xs text-muted-foreground">powered by gemini (so quirky fr)</p>
                        </div>
                     </div>
                     
                     <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">no cap</span>
                     </Button>
                  </div>
               </CardHeader>
               
               <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {error && (
                     <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>yikes bestie 😬</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                     </Alert>
                  )}
                  
                  {messages.length === 0 && (
                     <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-3 max-w-sm">
                           <Sparkles className="h-8 w-8 mx-auto text-primary/50" />
                           <h3 className="text-xl font-medium">hey bestie! let's chat ✌️</h3>
                           <p className="text-sm text-muted-foreground">
                              drop your thoughts below and we'll give the most unseriously serious takes ever. no cap.
                           </p>
                        </div>
                     </div>
                  )}
                  
                  {messages.map((m) => (
                     <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                     >
                        <div
                           className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${
                              m.role === "user"
                                 ? "bg-primary text-primary-foreground"
                                 : "bg-muted border border-border"
                           }`}
                        >
                           {m.role === "user" ? (
                              <p className="text-sm">{m.content}</p>
                           ) : (
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                 <ReactMarkdown>{m.content}</ReactMarkdown>
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
                  
                  {isLoading && (
                     <div className="flex justify-start">
                        <div className="max-w-[70%] rounded-lg bg-muted border-border p-3">
                           <div className="flex gap-1 items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-150"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-300"></div>
                              <span className="text-xs text-muted-foreground ml-1">thinking (in a quirky way)...</span>
                           </div>
                        </div>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
               </CardContent>
               
               <CardFooter className="border-t p-3">
                  <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                     <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="spill the tea..."
                        className="flex-1"
                     />
                     <Button 
                        type="submit" 
                        size="sm"
                        disabled={isLoading}
                     >
                        {isLoading ? "Loading..." : "Send"}
                     </Button>
                  </form>
               </CardFooter>
            </Card>
            
            {/* Status information */}
            {showNotice && (
               <div className="absolute top-4 right-4">
                  <Alert className="bg-background border shadow-sm w-auto max-w-xs">
                     <AlertCircle className="h-4 w-4" />
                     <AlertTitle className="text-sm font-medium">bestie, listen up 👀</AlertTitle>
                     <AlertDescription className="text-xs">
                        don't share your secret rizz techniques here (it's not that secure fr fr)
                     </AlertDescription>
                  </Alert>
               </div>
            )}
         </div>
         
         {/* Footer attribution */}
         <div className="absolute bottom-2 text-xs text-muted-foreground">
            vibes by gemini • living rent-free in your browser
         </div>
      </div>
   );
}
