import { auth } from "@/lib/auth";
import { getQueryClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { CallView } from "@/modules/call/ui/views/call-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  // ✅ MUST await params (Next.js 15 rule)
  const { meetingId } = await params;

  // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Prefetch meeting data
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CallView meetingId={meetingId} />
    </HydrationBoundary>
  );
};

export default Page;
