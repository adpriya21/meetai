// src/components/CallActive.tsx
"use client";

import { useState, FormEvent } from 'react';
import {
    CallControls,
    SpeakerLayout,
    useCall,
} from "@stream-io/video-react-sdk";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { LoaderIcon, SendIcon } from 'lucide-react';
import { convertTextToAudio } from '@/lib/openai'; 

// --- Interface for Props ---
interface Props {
    onLeave: () => void;
    meetingName: string;
    // Made optional to resolve the TypeScript error from the parent component
    meetingId?: string; 
};

type AiStatus = 'idle' | 'thinking' | 'speaking';

export const CallActive = ({ onLeave, meetingName, meetingId }: Props) => {
    const call = useCall();
    const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
    const [textInput, setTextInput] = useState<string>('');
    

    // --- 1. Simplified Finalization Handler ---
    const handleCallEnd = async () => {
        // If the ID is missing, we cannot finalize or log, so we exit safely.
        if (!meetingId) {
            console.warn("Meeting ID missing. Skipping finalization.");
            onLeave();
            return;
        }

        try {
            alert("Call ending... Processing report. Please wait."); 

            // Call the unified serverless function to handle summary/recording
            const response = await fetch('/api/finalize-meeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meetingId }),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Unknown server error" }));
                throw new Error(`Finalization API Failed: Status ${response.status}. Details: ${errorData.error || 'Check server logs.'}`);
            }

            // Navigate away (onLeave routes to CallReport)
            onLeave(); 

        } catch (error: any) {
            console.error("The finalization process failed:", error.message || error);
            alert(`Error finalizing call. Proceeding to report attempt. Error: ${error.message}`);
            onLeave(); 
        }
    }

    // --- 2. Text-to-Speech Interaction Loop ---
    const startAiInteraction = async (userText: string) => {
        if (!userText.trim()) return;

        try {
            setTextInput('');
            
            // Note: Per-turn logging is now removed here for simplification
            
            // 1. Call the AI Endpoint (LLM)
            setAiStatus('thinking');
            
            const aiResponse = await fetch('/api/ai-response', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: userText }),
            });

            if (!aiResponse.ok) {
                 const errorData = await aiResponse.json().catch(() => ({ error: "Unknown server error" }));
                 throw new Error(`LLM API Failed: Status ${aiResponse.status}. Details: ${errorData.error || 'Check server logs.'}`);
            }
            
            const data = await aiResponse.json();
            const aiResponseText = data.text;
            
            // Note: Per-turn logging is now removed here for simplification


            // 2. Text-to-Speech (TTS)
            setAiStatus('speaking');
            const audioBlobResponse = await convertTextToAudio(aiResponseText, 'nova'); 

            // 3. Play the Audio Response 
            const audioUrl = URL.createObjectURL(audioBlobResponse);
            const audio = new Audio(audioUrl);
            
            try {
                await audio.play();
                // 4. Cleanup and Reset
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    setAiStatus('idle');
                };
            } catch (playError) {
                console.error("Audio playback failed:", playError);
                alert("Audio Playback Blocked! Click 'OK' and try again. (Browser auto-play policy)");
                URL.revokeObjectURL(audioUrl);
                setAiStatus('idle'); 
            }

        } catch (error: any) {
            console.error("The full STS loop failed:", error.message || error);
            setAiStatus('idle'); 
            alert(`AI interaction failed. Error: ${error.message || 'Check console.'}`);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        startAiInteraction(textInput);
    };
    
    // UI mapping for status display
    const statusText: Record<AiStatus, string> = {
        idle: "Ask the AI Agent...",
        thinking: "AI is processing...",
        speaking: "AI is responding...",
    };

    const isProcessing = aiStatus !== 'idle';

    return (
        <div className="flex flex-col justify-between p-4 h-full text-white">
            <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
               <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                 <Image src="/logo.svg" width={22} height={22} alt="Logo" />
               </Link> 
               <h4 className="text-base">
                 {meetingName}
               </h4>
            </div>
            
            <SpeakerLayout />

            {/* TEXT INPUT FOR AI INTERACTION */}
            <form onSubmit={handleSubmit} className="flex gap-2 p-2">
                <Input
                    className="flex-grow bg-[#222] border-none text-white placeholder-gray-400"
                    placeholder={statusText[aiStatus]}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={isProcessing}
                />
                 <Button 
                    type="submit"
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
                    disabled={isProcessing || !textInput.trim()}
                 >
                    {isProcessing ? (
                        <LoaderIcon className="size-4 animate-spin" />
                    ) : (
                        <SendIcon className="size-4" />
                    )}
                    Send
                 </Button>
            </form>
            
            <div className="bg-[#101213] rounded-full px-4">
                {/* Use the handleCallEnd function for the hang-up button */}
                <CallControls onLeave={handleCallEnd} />
            </div>
        </div>
    );
};