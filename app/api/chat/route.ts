import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini_api_key = process.env.GEMINI_API_KEY;
console.log('Gemini API key:', gemini_api_key);
if (!gemini_api_key) {
  throw new Error('GEMINI_API_KEY is not defined');
}
const googleAI = new GoogleGenerativeAI(gemini_api_key);

// Define default and customizable instructions
// const defaultInstructions = "You are a helpful assistant.";

const customInstructions = `Think of me as your thoughtful friend. When you ask me something, I'll take my time to really consider it, just like we would chat over coffee. I want to understand things deeply, so I might ask myself questions and explore different angles.

Sometimes, I might feel unsure, and that's okay! We'll work through it together, step by step. If I make a mistake, I'll try to backtrack and rethink. My aim is to be helpful and positive, and if I offer some advice, it's only because I care about you.

Think of our conversation as a journey of discovery. I'll be there to explore with you, offer my perspective, and maybe help you see things in a new light. And remember, if it turns out something isn't quite possible, I'll let you know gently. Let's learn and grow together!
`;

const gemini_config = {
  temperature: 0.9,
  topP: 0.9,
  topK: 10,
  maxOutputTokens: 2000,
  // safetySettings: [
  //   {
  //     category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  //     threshold: "MEDIUM_AND_HIGH" // Or "ONLY_HIGH", "MEDIUM_AND_HIGH"
  //   },
  //   {
  //     category: "HARM_CATEGORY_HATE_SPEECH",
  //     threshold: "MEDIUM_AND_HIGH"
  //   },
  //   {
  //     category: "HARM_CATEGORY_HARASSMENT",
  //     threshold: "MEDIUM_AND_HIGH"
  //   },
  //   {
  //     category: "HARM_CATEGORY_DANGEROUS_CONTENT",
  //     threshold: "MEDIUM_AND_HIGH"
  //   }
  // ],
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: gemini_config,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json(); // Only expect the message from the user
    console.log('Received message:', message);

    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct the prompt: custom instructions followed by the user's message
    const prompt = [
      { text: customInstructions },
      { text: message }
    ];
    console.log('Generated prompt:', prompt);

    const result = await geminiModel.generateContent(prompt);
    console.log('Gemini result:', JSON.stringify(result, null, 2));

    if (!result.response || !result.response.text()) {
      console.error('Error: No valid response from Gemini API');
      return new Response(JSON.stringify({ error: 'Failed to generate response from Gemini' }), {
        status: 502, // Bad Gateway - problem with upstream server
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const responseText = result.response.text();
    console.log('Gemini response text:', responseText);

    return new Response(JSON.stringify({ text: responseText }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Failed to process request', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}