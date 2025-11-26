// src/api/ai-response/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client using the public key available on the server
// NOTE: For best security practices in production, you should use a non-public key 
// and pass it explicitly here, but this setup makes development easier.
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
});

// Handle POST requests
export async function POST(request: Request) {
    try {
        const { text } = await request.json(); 

        if (!text) {
            return NextResponse.json({ error: "Missing 'text' in request body" }, { status: 400 });
        }

        // 2. Call the LLM (Large Language Model) to generate the response
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo", 
            messages: [
                { role: "system", content: "You are a helpful and engaging AI assistant in a real-time voice call. Keep your responses concise and professional." },
                { role: "user", content: text },
            ],
        });

        const aiResponseText = completion.choices[0].message.content;

        // 3. Return the generated text response back to the client
        return NextResponse.json({ text: aiResponseText }, { status: 200 });

    } catch (error) {
        // Log the detailed error on the server side
        console.error("AI Response API Error:", error); 
        return NextResponse.json(
            { error: "Failed to generate AI response. Check server logs." }, 
            { status: 500 }
        );
    }
}

// **NOTE: The convertAudioToText and convertTextToAudio functions should NOT be in this file. 
// They belong in lib/openai.ts, which is detailed next.**