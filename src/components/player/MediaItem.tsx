"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import { Skeleton } from "../skeleton";
export const MediaItem = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md">
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Skeleton className="min-h-[48px] min-w-[48px]" />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-20 rounded-sm" />
            <Skeleton className="h-4 w-20 rounded-sm" />
          </>
        ) : (
          <>
            <p className="text-white truncate">develop</p>
            <p className="text-neutral-400 text-sm truncate">sulaimuezzz</p>
          </>
        )}
      </div>
    </div>
  );
};
