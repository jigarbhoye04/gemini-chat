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
import { AlertCircle, CircleArrowRight, LeafyGreen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function GeminiChat() {
   const {
      messages,
      input,
      isLoading,
      error,
      handleInputChange,
      handleSubmit,
   } = useGeminiChat();

   return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
         <div className="relative mx-auto top-0 p-4">
            <Alert variant="destructive" className="mb-4">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Disclaimer!</AlertTitle>
               <AlertDescription>
                  Do not enter any sensitive info.<br />
                  as this uses free tier API.
               </AlertDescription>
            </Alert>
            <Alert variant="default" className="mb-4">
               <CircleArrowRight className="h-4 w-4" />
               <AlertTitle>Info</AlertTitle>
               <AlertDescription>
                  Gemini AI chatbot.<br />
                  upd: version 0.1.0
               </AlertDescription>
            </Alert>
         </div>
         <Card className="w-full max-w-6xl h-full flex flex-col">
            <CardHeader>
               <CardTitle>Gemini AI Chat</CardTitle>
            </CardHeader>
            <CardContent className="h-[70vh] overflow-y-auto">
               {error && (
                  <Alert variant="destructive" className="mb-4">
                     <AlertCircle className="h-4 w-4" />
                     <AlertTitle>Error</AlertTitle>
                     <AlertDescription>{error}</AlertDescription>
                  </Alert>
               )}
               {messages.map((m) => (
                  <div
                     key={m.id}
                     className={`mb-4 ${
                        m.role === "user" ? "text-right" : "text-left"
                     }`}
                  >
                     <span
                        className={`inline-block p-2 rounded-lg ${
                           m.role === "user"
                              ? "bg-blue-500 text-white max-w-3xl"
                              : "bg-gray-200 text-black max-w-3xl"
                        }`}
                     >
                        {m.role === "user" ? (
                           m.content
                        ) : (
                           <ReactMarkdown>{m.content}</ReactMarkdown>
                        )}
                     </span>
                  </div>
               ))}
               {isLoading && (
                  <div className="text-left">
                     <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                           <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
                           <div className="w-24 h-6 rounded bg-gray-300 animate-pulse"></div>
                        </div>
                        <div className="w-32 h-6 rounded bg-gray-300 animate-pulse"></div>
                        <div className="w-24 h-6 rounded bg-gray-300 animate-pulse"></div>
                        <div className="w-32 h-6 rounded bg-gray-300 animate-pulse"></div>
                        <div className="mt-2 text-gray-500">
                           Gemini is thinking...
                        </div>
                     </div>
                  </div>
               )}
            </CardContent>
            <CardFooter>
               <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Input
                     value={input}
                     onChange={handleInputChange}
                     placeholder="Ask Gemini something..."
                     className="flex grow"
                  />
                  <Button type="submit" disabled={isLoading}>
                     Send
                  </Button>
               </form>
            </CardFooter>
         </Card>
      </div>
   );
}
