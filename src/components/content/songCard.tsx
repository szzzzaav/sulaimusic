import Image from "next/image";
export default function SongCard() {
  return (
    <div className="hover:bg-zinc-900 rounded-xl flex flex-col justify-start items-start transition-all duration-300 p-4 flex-shrink-0 h-[19rem] cursor-pointer">
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-48 h-48 relative mb-2">
          <Image src="/images/1.png" alt="" fill className="rounded-xl object-cover" />
        </div>
        <div className="text-white text-sm font-bold mt-2 text-start whitespace-wrap w-48">
          SongNamesdadhkasjdkla
        </div>
        <div className="text-zinc-400 text-xs text-start w-full truncate">ArtistName</div>
      </div>
    </div>
  );
}
