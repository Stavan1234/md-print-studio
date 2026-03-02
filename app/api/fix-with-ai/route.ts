import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Lazy initialization of Groq client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let groqClient: any = null;

function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

export async function POST(request: Request) {
  const { content } = await request.json();
  if (!content) {
    return NextResponse.json({ error: 'No content' }, { status: 400 });
  }

  // Try Google AI first
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 4096,
      }
    });

    const prompt = `Fix any LaTeX syntax errors in the following markdown. Preserve all markdown formatting (headings, lists, etc.). Only return the corrected version, no explanations:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fixed = response.text();

    return NextResponse.json({ fixed });
  } catch (googleError) {
    console.error('Google AI error:', googleError);
    
    // Check if it's a quota error
    const errorMessage = googleError instanceof Error ? googleError.message : String(googleError);
    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      // Try Groq as fallback if available
      const groq = getGroqClient();
      if (groq) {
        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are a LaTeX expert. Fix any LaTeX syntax errors in the markdown. Preserve all markdown formatting. Only return the corrected version, no explanations.'
              },
              {
                role: 'user',
                content: content
              }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0,
            max_tokens: 4096,
          });
          
          const fixed = chatCompletion.choices[0]?.message?.content || '';
          return NextResponse.json({ fixed });
        } catch (groqError) {
          console.error('Groq fallback error:', groqError);
          return NextResponse.json({ 
            error: 'AI quota exceeded. Please try again later or add GROQ_API_KEY for fallback.' 
          }, { status: 429 });
        }
      }
      
      return NextResponse.json({ 
        error: 'AI quota exceeded. Please try again later.' 
      }, { status: 429 });
    }
    
    return NextResponse.json({ error: 'AI fix failed' }, { status: 500 });
  }
}
