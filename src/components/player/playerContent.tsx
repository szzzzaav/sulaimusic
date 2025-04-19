import { MediaItem } from "./MediaItem";

export const PlayerContent = () => {
  return (
    <div className="grid grid-cols md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem />
        </div>
      </div>
    </div>
  );
};
