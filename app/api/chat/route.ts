import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini_api_key = process.env.GEMINI_API_KEY; 
console.log('Gemini API key:', gemini_api_key);
const googleAI = new GoogleGenerativeAI(gemini_api_key);

// Define default and customizable instructions
const defaultInstructions = "You are a helpful assistant. Please format your responses in Markdown.";
const customInstructionsPlaceholder = "<<CUSTOM_INSTRUCTIONS>>";

const gemini_config = {
  temperature: 0.9, // Slightly lower temperature for more predictable responses
  topP: 0.9,       // Adjust topP and topK together
  topK: 10,
  maxOutputTokens: 2000, // Adjust as needed
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: gemini_config,
});

export async function POST(req: Request) {
  try {
    const { message, customInstructions } = await req.json();
    console.log('Received message:', message);
    console.log('Received custom instructions:', customInstructions);

    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct the prompt with default and custom instructions
    const prompt = [
      { text: defaultInstructions.replace(customInstructionsPlaceholder, customInstructions || "") },
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