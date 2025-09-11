"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MeetingIdViewHeader } from "../components/meetings-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { ActiveState } from "../components/active-state";
import { useState } from "react";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { Upcoming } from "../components/upcoming-state";
import { ProcessingState } from "../components/processing-state";
import { CancelledState } from "../components/cancelled-state";
// 🔹 If you want a Completed component, create one and import it here
// import { CompletedState } from "../components/completed-state";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  // Confirm dialog hook
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    "The following action will remove this meeting"
  );

  // Suspense Query
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  // Remove mutation
  const removeMeeting = useMutation({
    mutationFn: (payload: { id: string }) => trpc.meetings.remove.mutate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
      router.push("/meetings");
    },
  });

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data?.status === "active";
  const isUpcoming = data?.status === "upcoming";
  const isCancelled = data?.status === "cancelled";
  const isCompleted = data?.status === "completed";
  const isProcessing = data?.status === "processing";

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data?.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isCompleted && <div>Completed</div>}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcoming && (
          <Upcoming
            meetingId={meetingId}
            onCancelMeeting={() => {}}
            isCancelling={false}
          />
        )}
      </div>
    </>
  );
};

// Loading Component
export const MeetingIdViewLoading = () => (
  <LoadingState
    title="Loading Meeting"
    description="This may take a few seconds"
  />
);

// Error Component
export const MeetingIdViewError = () => (
  <ErrorState
    title="Error Loading Meeting"
    description="Something went wrong"
  />
);