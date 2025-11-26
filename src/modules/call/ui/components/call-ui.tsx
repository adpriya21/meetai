"use client";

import { useState } from "react";
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
    // ⚠️ No change needed here, we just rely on useCall() inside the component
    meetingName: string;
};

export const CallUI = ({ meetingName }: Props) => {
    // We rely on the parent (CallConnect) to wrap us in <StreamCall>
    const call = useCall(); 
    
    // Check for call existence before setting up state to avoid errors
    if (!call) return null; 

    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

    const handleJoin = async () => {
        await call.join();
        setShow("call");
    };

    const handleLeave = () => {
        call.endCall();
        setShow("ended");
    };

    return (
        <StreamTheme className="h-full">
            {show === "lobby" && <CallLobby onJoin={handleJoin} />}
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
            {show === "ended" && <CallEnded />}
        </StreamTheme>
    );
};