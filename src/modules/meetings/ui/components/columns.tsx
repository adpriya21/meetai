"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  CornerDownRightIcon,
  ClockArrowUpIcon,
  CircleCheckIcon,
  LoaderIcon,
  CircleXIcon,
  ClockFadingIcon,
} from "lucide-react";
import { format } from "date-fns";
import humanizeDuration from "humanize-duration";
import { cn } from "@/lib/utils";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap: Record<string, string> = {
  upcoming: "bg-yellow-100 text-yellow-700 border border-yellow-400",
  active: "bg-blue-100 text-blue-700 border border-blue-400",
  completed: "bg-green-100 text-green-700 border border-green-400",
  processing: "bg-purple-100 text-purple-700 border border-purple-400",
  cancelled: "bg-red-100 text-red-700 border border-red-400",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{row.original.name}</span>

        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-muted-foreground max-w-[200px] truncate capitalize">
              {row.original.agent.name}
            </span>
          </div>
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-4"
          />
          <span>
            {row.original.startedAt
              ? format(new Date(row.original.startedAt), "MMM d")
              : ""}
          </span>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusIconMap;
      const Icon = statusIconMap[status];

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize flex items-center gap-x-1 [&>svg]:size-4",
            statusColorMap[status]
          )}
        >
          <Icon
            className={cn(
              "size-4",
              status === "processing" && "animate-spin"
            )}
          />
          {status}
        </Badge>
      );
    },
  },

  {
  accessorKey: "duration",
  header: "Duration",
  cell: ({ row }) => {
    return (
      <Badge
        variant="outline"
        className="capitalize flex items-center gap-x-2 [&>svg]:size-4"
      >
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "No duration"}
      </Badge>
    );
  },


  },
];
