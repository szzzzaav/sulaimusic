import { twMerge } from "tailwind-merge";
import Carousel, { CarouselItem } from "./carousel";
import SongCard from "./songCard";

interface ContentAreaProps {
  children?: React.ReactNode;
}

export default function ContentArea({ children }: ContentAreaProps) {
  return (
    <div className="w-full h-full bg-[#121212] rounded-xl overflow-hidden">
      <div className="w-full h-full bg-[#121212] overflow-y-auto overflow-x-hidden flex flex-col">
        {children}
        <RecommendArea />
        <NewSongArea />
        <HotSongArea />
      </div>
    </div>
  );
}

export const RecommendArea = () => {
  return (
    <>
      <div className="w-full p-4 flex items-center justify-between">
        <span className="text-white text-xl font-bold">推荐歌曲</span>
      </div>
      <Carousel className="gap-4">
        <CarouselItem>
          <SongCard />
        </CarouselItem>
        <CarouselItem>
          <SongCard />
        </CarouselItem>
        <CarouselItem>
          <SongCard />
        </CarouselItem>
        <CarouselItem>
          <SongCard />
        </CarouselItem>
        <CarouselItem>
          <SongCard />
        </CarouselItem>
        <CarouselItem>
          <SongCard />
        </CarouselItem>
      </Carousel>
    </>
  );
};

export const NewSongArea = () => {
  return (
    <>
      <div className="w-full p-4 flex items-center justify-between">
        <span className="text-white text-xl font-bold">今日上新</span>
      </div>
      <Carousel className="gap-4">
        <CarouselItem>
          <SongCard />
        </CarouselItem>
      </Carousel>
    </>
  );
};

export const HotSongArea = () => {
  return (
    <>
      <div className="w-full p-4 flex items-center justify-between">
        <span className="text-white text-xl font-bold">热门歌曲</span>
      </div>
      <Carousel className="gap-4">
        <CarouselItem>
          <SongCard />
        </CarouselItem>
      </Carousel>
    </>
  );
};
