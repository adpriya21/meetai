import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  description: string;
  image?: string
}

export const EmptyState: React.FC<Props> = ({ 
  title,
  description,
image = "/empty.svg" }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-y-4">
      <Image src={image} alt="Empty state illustration" width={240} height={240} />
      
      <AlertCircleIcon className="size-6 text-red-500" />
      
      <div className="flex flex-col gap-y-2">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
