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
import { AlertCircle, CircleArrowRight, Send, Info } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
         <div className="w-full max-w-6xl h-[90vh] px-4 md:px-0 flex flex-col">
            {/* Main chat interface */}
            <Card className="w-full h-full flex flex-col shadow-xl bg-slate-950/40 backdrop-blur-sm border-slate-700 overflow-hidden rounded-xl">
               <CardHeader className="border-b border-slate-800 bg-slate-900/60 py-4">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                           <span className="text-white font-medium text-lg">G</span>
                        </div>
                        <div>
                           <CardTitle className="text-xl font-bold text-white">Gemini AI Chat</CardTitle>
                           <p className="text-xs text-slate-400">Powered by Google AI</p>
                        </div>
                     </div>
                     
                     <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-slate-800">
                        <Info className="h-5 w-5" />
                        <span className="sr-only">Information</span>
                     </Button>
                  </div>
               </CardHeader>
               
               <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {error && (
                     <Alert variant="destructive" className="mb-4 border-red-900 bg-red-950/50 text-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                     </Alert>
                  )}
                  
                  {messages.map((m) => (
                     <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                     >
                        <div
                           className={`max-w-[85%] md:max-w-[70%] rounded-2xl shadow-md ${
                              m.role === "user"
                                 ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
                                 : "bg-slate-800/70 border border-slate-700 text-slate-100"
                           }`}
                        >
                           <div className="p-4">
                              {m.role === "user" ? (
                                 <p className="text-sm md:text-base">{m.content}</p>
                              ) : (
                                 <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
                  
                  {isLoading && (
                     <div className="flex justify-start">
                        <div className="max-w-[70%] rounded-2xl bg-slate-800/70 border border-slate-700 p-4">
                           <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
                              <div className="text-sm font-medium text-slate-200">Gemini</div>
                           </div>
                           <div className="flex gap-2 items-center mt-2">
                              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-150"></div>
                              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-300"></div>
                              <span className="text-xs text-slate-400 ml-1">thinking...</span>
                           </div>
                        </div>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
               </CardContent>
               
               <CardFooter className="border-t border-slate-800 bg-slate-900/60 p-4">
                  <form onSubmit={handleSubmit} className="flex w-full space-x-2 justify-center">
                     <div className="w-full max-w-3xl flex space-x-2">
                        <Input
                           value={input}
                           onChange={handleInputChange}
                           placeholder="Message Gemini..."
                           className="flex-1 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <Button 
                           type="submit" 
                           disabled={isLoading}
                           className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 text-white px-4"
                        >
                           <Send className="h-4 w-4 mr-1" />
                           <span className="hidden sm:inline">Send</span>
                        </Button>
                     </div>
                  </form>
               </CardFooter>
            </Card>
            
            {/* Status information - now as a floating badge */}
            {showNotice && (
               <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Alert className="bg-red-900/40 border border-red-800 text-white shadow-lg backdrop-blur-sm w-auto max-w-xs">
                     <AlertCircle className="h-4 w-4" />
                     <AlertTitle className="text-sm font-medium">Security Notice</AlertTitle>
                     <AlertDescription className="text-xs">
                        Do not share sensitive information (free tier API)
                     </AlertDescription>
                  </Alert>
               </div>
            )}
         </div>
         
         {/* Footer attribution */}
         <div className="absolute bottom-2 text-xs text-slate-500">
            Gemini AI v0.1.0 • Designed By 
         </div>
      </div>
   );
}
