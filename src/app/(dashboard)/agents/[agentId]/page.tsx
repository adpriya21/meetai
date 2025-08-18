import { AgentIdView, 
  AgentsIdViewError,
   AgentsIdViewLoading } from "@/modules/agents/ui/views/agent-id-view";
import { getQueryClient, trpc} from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";


interface Props {
  params: Promise<{agentId: string}>
};
const Page = async({params}: Props) => {

  const {agentId}=await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({id: agentId}),

  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsIdViewLoading/>}>
        <ErrorBoundary fallback={<AgentsIdViewError/>}>
        </ErrorBoundary>
        
        <AgentIdView agentId={agentId} />
      </Suspense>
    </HydrationBoundary>
  );

};
export default Page;