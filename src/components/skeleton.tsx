import { twMerge } from "tailwind-merge";

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge("h-full w-full bg-neutral-800 rounded-sm skeleton-animate", className)}
    />
  );
};
