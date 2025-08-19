"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { AgentIdViewHeader } from "@/modules/agents/ui/components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const[updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [RemoveConfirmation, ConfirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meetings`
  );

  const handleRemoveAgent = async () => {
    const ok = await ConfirmRemove();
    if (!ok) return;
    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
      open={updateAgentDialogOpen}
      onOpenChange={setUpdateAgentDialogOpen}
      initialValues={data}
      />
      <div className="flex-1 py-6 px-4 md:px-8 flex flex-col gap-y-6">
        {/* Header */}
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />

        {/* Card */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-6 py-6 flex flex-col gap-y-6">
            {/* Avatar + Name + Badge */}
            <div className="flex items-center gap-x-4">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-12"
              />
              <h2 className="text-2xl font-semibold">{data.name}</h2>
              <Badge
                variant="outline"
                className="flex items-center gap-x-2 text-blue-700 border-blue-200"
              >
                <VideoIcon className="size-4" />
                <span>
                  {data.meetingCount}{" "}
                  {data.meetingCount === 1 ? "meeting" : "meetings"}
                </span>
              </Badge>
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-y-2">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-neutral-700 leading-relaxed">
                {data.instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentsIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
};

export const AgentsIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  );
};
