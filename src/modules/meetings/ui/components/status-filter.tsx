"use client";

import {
  ClockArrowUpIcon,
  LoaderIcon,
  CircleCheckIcon,
  CircleXIcon,
  VideoIcon,
} from "lucide-react";
import { MeetingStatus } from "../../types";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { CommandSelect } from "@/components/command-select";

export const meetingStatusOptions = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon className="w-4 h-4" />
        {MeetingStatus.Upcoming}
      </div>
    ),
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon className="w-4 h-4 animate-spin" />
        {MeetingStatus.Active}
      </div>
    ),
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon className="w-4 h-4 text-green-600" />
        {MeetingStatus.Completed}
      </div>
    ),
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon className="w-4 h-4 animate-spin text-purple-600" />
        {MeetingStatus.Processing}
      </div>
    ),
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon className="w-4 h-4 text-red-600" />
        {MeetingStatus.Cancelled}
      </div>
    ),
  },
];

export const StatusFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <CommandSelect
      placeholder="Status"
      className="h-9"
      options={meetingStatusOptions} // corrected here
      onSelect={(value) =>
        setFilters({ status: value as MeetingStatus })
      }
      value={filters.status ?? ""}
    />
  );
};
