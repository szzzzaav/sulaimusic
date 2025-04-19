import { AiFillHome } from "react-icons/ai";
import { PiWaveform } from "react-icons/pi";
import { Input } from "./ui/input";
import { RiSearch2Line } from "react-icons/ri";
import { Button } from "./ui/button";
import { FaBell } from "react-icons/fa";

export default function NavBar() {
  return (
    <div className="w-full h-15 flex items-center justify-between p-2 relative">
      <div className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 p-2">
        <PiWaveform className="text-zinc-400 w-8 h-8" />
      </div>
      <SearchBar />
      <UserButton />
    </div>
  );
}

const SearchBar = () => {
  return (
    <div className="flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2">
      <div className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 p-2">
        <AiFillHome className="text-zinc-400 w-8 h-8" />
      </div>
      <div className="flex items-center justify-center bg-zinc-900 rounded-[500px] p-2 gap-2 hover:bg-zinc-800 transition-all cursor-pointer border-2 border-transparent focus-within:shadow-[inset_0_0_0_2px_white] duration-300">
        <RiSearch2Line className="text-zinc-400 w-8 h-8" />
        <input
          type="text"
          placeholder="今天想听什么"
          className="bg-transparent outline-none text-zinc-400 w-100 h-8"
        />
      </div>
    </div>
  );
};

const UserButton = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 p-2">
        <FaBell className="text-zinc-400 w-5 h-5" />
      </div>
      <Button
        className="bg-white hover:bg-gray-100 text-black  rounded-full px-8 py-3 border-none shadow-none transition-colors cursor-pointer h-13 font-bold text-md"
        variant="default"
      >
        登录
      </Button>
    </div>
  );
};
