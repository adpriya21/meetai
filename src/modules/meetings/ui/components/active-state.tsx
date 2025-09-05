import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // ✅ Missing import
import { VideoIcon } from "lucide-react";

interface Props {
  meetingId: string;
}

export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/active.svg" // ✅ better to use "active.svg" instead of "upcoming.svg"
        title="Meeting is Live"
        description="The meeting is currently active. You can join now."
      />

      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        {/* Join Meeting Button */}
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`} className="flex items-center gap-2">
            <VideoIcon className="w-4 h-4" />
            Join Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
