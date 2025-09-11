import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CallView } from "@/modules/call/ui/views/call-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export const Page = async ({ params }: Props) => {
  const { meetingId } = await params;


  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }


  //  call the function
  const queryClient = getQueryClient();

  //  prefetch query
  await queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  // You probably also want to return a component with hydration
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <CallView meetingId={meetingId} />
    </HydrationBoundary>
  );
};

export default Page;
