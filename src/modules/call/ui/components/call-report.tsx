// src/components/CallReport.tsx
"use client";

// REMOVED: import { api } from "@/trpc/react"; 
import { Loader2, FileText, Mic, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from 'react';

// ----------------------------------------------------------------------
// ⚠️ MOCK PLACEHOLDERS - REPLACE WITH ACTUAL tRPC HOOK LATER ⚠️
// ----------------------------------------------------------------------

// Define the expected Meeting structure for the mock data
interface MockMeeting {
    id: string;
    name: string;
    status: 'Processing' | 'Completed';
    summary?: string;
    transcriptUrl?: string; // We'll use this field to hold the full text for the mock
    recordingUrl?: string;
    createdAt: Date;
}

// Custom hook to simulate fetching the report data (useQuery replacement)
const useMockReportQuery = (id: string, options: { refetchInterval: (data: MockMeeting | undefined) => boolean, enabled: boolean }) => {
    // Simulate initial loading (processing) then completed state after a delay
    const [status, setStatus] = useState<'Processing' | 'Completed'>('Processing');
    const [data, setData] = useState<MockMeeting | undefined>();

    useEffect(() => {
        if (!id || !options.enabled) return;

        // Simulate fetching initial data
        setData({
            id: id,
            name: `Mock Meeting ${id.substring(0, 4)}`,
            status: 'Processing',
            createdAt: new Date(),
        });

        // Simulate successful completion after 3 seconds
        const timer = setTimeout(() => {
            setStatus('Completed');
            setData({
                id: id,
                name: `MOCK Report: ${id.substring(0, 4)}`,
                status: 'Completed',
                createdAt: new Date(Date.now() - 3600000), // 1 hour ago
                summary: "### Key Takeaways\n* The tRPC client import failed.\n* The application successfully used mock data.\n\n### Next Steps\n1. Locate and fix the real '@/trpc/react' path.\n2. Replace these mock functions with the actual tRPC hooks (getOne.useQuery).",
                transcriptUrl: "User: Hello AI, can you help me?\nAI: Yes, I am here to assist. What is your question?\nUser: I need to debug my tRPC setup.\nAI: You should check your client file paths first!",
                recordingUrl: "https://mock.url/recording.mp3",
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, options.enabled]);

    return {
        data: data?.status === 'Completed' ? data : { ...data, status: status },
        isLoading: status === 'Processing',
        isError: !id,
    };
};
// ----------------------------------------------------------------------


interface CallReportProps {
    meetingId: string; // The ID of the completed meeting
}

export const CallReport = ({ meetingId }: CallReportProps) => {
    const router = useRouter();
    
    // 1. Use the mock query hook instead of the real tRPC hook
    const { data: meeting, isLoading, isError } = useMockReportQuery(
        meetingId,
        { 
            refetchInterval: (data) => data?.status === 'Completed' ? false : 3000,
            enabled: !!meetingId
        }
    );

    // ... (rest of the component logic remains the same, but imports 'useEffect' and 'useState')
    // NOTE: I am adding useEffect and useState imports to the very top now.
    
    // --- Loading & Error States ---

    if (isError || !meetingId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white">
                <h2 className="text-xl text-red-500">Error Loading Report</h2>
                <p className="mt-2 text-gray-400">Could not find or load the final meeting details.</p>
                <Button onClick={() => router.push('/')} className="mt-4 bg-blue-600 hover:bg-blue-700">Go Home</Button>
            </div>
        );
    }
    
    // Show processing screen while the summary/recording is being generated
    if (isLoading || meeting?.status === 'Processing' || !meeting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white">
                <Loader2 className="size-8 animate-spin text-green-500" />
                <p className="mt-4 font-semibold">Finalizing meeting report (AI & Recording)...</p>
                <p className="text-sm text-gray-400">This can take up to a minute. Please wait.</p>
            </div>
        );
    }

    // Function to format the start time
    const formatStartTime = (timestamp: Date | undefined) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleString();
    };

    // --- Display the Completed Report ---

    // transcriptUrl is used to hold the full mock transcript text
    const formattedTranscript = meeting.transcriptUrl || "No turn-by-turn transcript available.";

    return (
        <div className="max-w-4xl mx-auto p-6 bg-[#101213] min-h-screen text-white rounded-lg shadow-2xl">
            <h1 className="text-4xl font-extrabold text-center mb-4 text-green-400">{meeting.name}</h1>
            <div className="text-center text-sm text-gray-400 mb-8 flex items-center justify-center gap-2">
                <Clock className="size-4" />
                <span>Start Time: {formatStartTime(meeting.createdAt)}</span>
            </div>
            
            <div className="space-y-8">
                
                {/* --- 🎧 Recording Section --- */}
                <section className="bg-[#1e1e1e] p-5 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-green-400">
                        <Mic className="size-6" /> Full Meeting Recording
                    </h2>
                    {meeting.recordingUrl ? (
                        <audio controls src={meeting.recordingUrl} className="w-full bg-gray-900 rounded-md p-2">
                            Your browser does not support the audio element.
                        </audio>
                    ) : (
                        <p className="text-sm text-yellow-500">Recording URL is not available.</p>
                    )}
                </section>

                {/* --- 📝 Summary Section --- */}
                <section className="bg-[#1e1e1e] p-5 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                        <BookOpen className="size-6" /> AI Summary & Key Takeaways
                    </h2>
                    {meeting.summary ? (
                        <p className="whitespace-pre-wrap leading-relaxed text-gray-200 p-2 bg-gray-900 rounded-md">
                            {meeting.summary}
                        </p>
                    ) : (
                        <p className="text-sm text-red-400">Error: Summary could not be generated.</p>
                    )}
                </section>

                {/* --- 📜 Transcript Section --- */}
                <section className="bg-[#1e1e1e] p-5 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                        <FileText className="size-6" /> Full Interaction Transcript
                    </h2>
                    <pre className="p-4 bg-[#0a0a0a] rounded-md text-sm whitespace-pre-wrap overflow-x-auto text-gray-300 max-h-96 border border-gray-800">
                        {formattedTranscript}
                    </pre>
                </section>
                
            </div>
            
            <div className="mt-10 text-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 rounded-full shadow-lg">
                    <Link href="/">Return to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
};