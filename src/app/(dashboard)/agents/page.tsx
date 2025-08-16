import { LoadingState } from "@/components/loading-state";
import { AgentsView, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { AgentsListHeader } from "@/modules/agents/ui/components/list-header";
import { auth } from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  
   });
   if (!session){
    redirect("/sign-in");
   }
  
  const queryClient = getQueryClient();

  // Prefetch agents data
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
    <AgentsListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewLoading />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    </>
  );
};

export default Page;
