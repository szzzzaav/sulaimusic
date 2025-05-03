import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
export const UserSignInModal = ({
  isOpen,
  onClose,
  openSignUp,
}: {
  isOpen: boolean;
  onClose: () => void;
  openSignUp: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed z-50 bg-black/50 backdrop-blur-2xl inset-0 flex items-center justify-center">
      <div
        className="bg-[#121212] w-96 h-[80vh] rounded-lg flex flex-col items-center justify-start p-4 relative gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white text-xl font-bold justify-self-start">登录到sulaimusic</div>
        <h1>登录</h1>
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-2 right-2 text-zinc-400 cursor-pointer"
        >
          <XIcon />
        </Button>
        <Button className="w-full rounded-full bg-zinc-800 hover:bg-zinc-700 cursor-pointer h-12 flex items-center justify-center gap-2">
          <FcGoogle />
          使用Google登录
        </Button>
        <Button className="w-full rounded-full bg-zinc-800 hover:bg-zinc-700 cursor-pointer h-12 flex items-center justify-center gap-2">
          <IoLogoGithub />
          使用Github登录
        </Button>
        <div className="text-zinc-400 text-sm flex items-center w-full justify-center gap-2 text-nowrap">
          <span className="w-1/2 h-[0.5px] bg-zinc-400/50"></span>
          <span>或者</span>
          <span className="w-1/2 h-[0.5px] bg-zinc-400/50"></span>
        </div>
        <form className="w-full flex flex-col gap-6 h-full text-white">
          <input
            type="email"
            placeholder="邮箱"
            className="w-full rounded-sm bg-zinc-800 hover:bg-zinc-700 cursor-pointer h-12 flex items-center justify-center gap-4 indent-4 outline-none"
          />
          <input
            type="password"
            placeholder="密码"
            className="w-full rounded-sm bg-zinc-800 hover:bg-zinc-700 cursor-pointer h-12 flex items-center justify-center gap-4 indent-4 outline-none"
          />
          <Button
            type="submit"
            className="w-full rounded-full cursor-pointer h-12 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            登录
          </Button>
        </form>
        <div className="text-zinc-400 text-sm flex items-center w-full justify-center gap-2 text-nowrap">
          没有账号？点击
          <span
            onClick={openSignUp}
            className="text-transparent cursor-pointer underline bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 self-end"
          >
            注册
          </span>
        </div>
      </div>
    </div>
  );
};
