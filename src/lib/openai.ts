// lib/openai.ts

/**
 * Converts an audio Blob into text using the OpenAI Whisper API.
 * @param audioBlob The audio data to transcribe as a Blob object.
 * @returns A Promise that resolves to the transcribed text.
 */
async function convertAudioToText(audioBlob: Blob): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("NEXT_PUBLIC_OPENAI_API_KEY environment variable is not set.");
    }

    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm'); 
        formData.append('model', 'whisper-1');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`, 
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.text(); 
            throw new Error(`OpenAI STT API Error ${response.status}: ${response.statusText}. Details: ${errorData}`);
        }

        const data: { text: string } = await response.json();
        return data.text;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw error;
    }
}

/**
 * Converts a string of text into an audio Blob using the OpenAI TTS API.
 * @param text The text string to convert to speech.
 * @returns A Promise that resolves to an audio Blob (audio/mpeg).
 */
async function convertTextToAudio(
    text: string, 
    voice: string = 'nova', 
    model: string = 'tts-1'
): Promise<Blob> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("NEXT_PUBLIC_OPENAI_API_KEY environment variable is not set.");
    }
    
    // Check if the input text is empty before making the API call
    if (!text || text.trim() === '') {
        throw new Error("Input text for TTS cannot be empty.");
    }

    try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ 
                // FIX APPLIED HERE: The API requires 'input'
                input: text, 
                model, 
                voice,
                response_format: 'mp3',
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`OpenAI TTS API Error ${response.status}: ${response.statusText}. Details: ${errorData}`);
        }

        const audioBuffer = await response.arrayBuffer();
        return new Blob([audioBuffer], { type: 'audio/mpeg' }); 
    } catch (error) {
        console.error('Error converting text to audio:', error);
        throw error;
    }
}

export { convertAudioToText, convertTextToAudio };