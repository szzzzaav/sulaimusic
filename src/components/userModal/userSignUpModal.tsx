import { XIcon, ChevronLeft, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { PiWaveform } from "react-icons/pi";
import { Checkbox } from "../ui/checkbox";

export const UserSignUpModal = ({
  isOpen,
  onClose,
  openSignIn,
}: {
  isOpen: boolean;
  onClose: () => void;
  openSignIn: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 合并出生日期
    const birthDate = `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}`;
    const submissionData = {
      ...formData,
      birthDate,
    };
    console.log("Form submitted:", submissionData);
    // 处理注册逻辑
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 bg-black/50 backdrop-blur-2xl inset-0 flex items-center justify-center">
      <div
        className="bg-[#121212] w-96 h-[80vh] rounded-lg flex flex-col items-center justify-start p-4 relative gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-full mb-4">
          <PiWaveform className="w-12 h-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>

        {/* 进度条 */}
        <div className="w-full relative mb-8">
          <div className="w-full h-1 bg-zinc-800 rounded-full">
            <div
              className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <div className="text-white text-sm mt-2 flex justify-between">
            <div>第{step}步，共3步</div>
          </div>
        </div>

        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-2 right-2 text-zinc-400 cursor-pointer"
        >
          <XIcon />
        </Button>

        {step > 1 && (
          <Button
            onClick={handleBack}
            variant="ghost"
            className="absolute top-2 left-2 text-zinc-400 cursor-pointer"
          >
            <ChevronLeft />
          </Button>
        )}

        {step === 1 && (
          <>
            <div className="text-white text-xl font-bold w-full">填写您的邮箱</div>
            <form
              className="w-full flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-white text-sm">
                  电子邮件地址
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full rounded-sm bg-zinc-800 hover:bg-zinc-700 h-12 px-4 outline-none text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 h-12 flex items-center justify-center text-white font-bold cursor-pointer"
              >
                下一步
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-white text-xl font-bold w-full">创建密码</div>
            <form
              className="w-full flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-white text-sm">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-sm bg-zinc-800 hover:bg-zinc-700 h-12 px-4 outline-none text-white"
                  required
                />
              </div>
              <div className="text-white text-sm">
                <p>密码须至少包含：</p>
                <ul className="list-disc pl-5 mt-2 text-indigo-400">
                  <li>1个字母</li>
                  <li>1个数字或特殊字符（例如：#?!&）</li>
                  <li>10个字符</li>
                </ul>
              </div>
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 h-12 flex items-center justify-center text-white font-bold cursor-pointer"
              >
                下一步
              </Button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-white text-xl font-bold w-full">介绍一下自己</div>
            <form className="w-full flex flex-col gap-6 overflow-y-auto" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="text-white text-sm">
                  名称
                </label>
                <p className="text-zinc-400 text-xs">此名称会显示在您的个人资料上</p>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-sm bg-zinc-800 hover:bg-zinc-700 h-12 px-4 outline-none text-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white text-sm">出生日期</label>
                <p className="text-zinc-400 text-xs">
                  为什么我们要您提供出生日期？
                  <span className="text-indigo-400 underline cursor-pointer">了解更多</span>
                </p>
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    name="birthYear"
                    placeholder="yyyy"
                    value={formData.birthYear}
                    onChange={handleChange}
                    className="w-1/3 rounded-sm bg-zinc-800 hover:bg-zinc-700 h-12 px-4 outline-none text-white"
                    required
                  />
                  <div className="w-1/3 relative">
                    <select
                      name="birthMonth"
                      value={formData.birthMonth}
                      onChange={handleChange}
                      className="w-full rounded-sm bg-zinc-800 hover:bg-zinc-700 h-12 px-4 pr-10 appearance-none outline-none text-white cursor-pointer"
                      required
                    >
                      <option value="" disabled>
                        月
                      </option>
                      <option value="01">1月</option>
                      <option value="02">2月</option>
                      <option value="03">3月</option>
                      <option value="04">4月</option>
                      <option value="05">5月</option>
                      <option value="06">6月</option>
                      <option value="07">7月</option>
                      <option value="08">8月</option>
                      <option value="09">9月</option>
                      <option value="10">10月</option>
                      <option value="11">11月</option>
                      <option value="12">12月</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    name="birthDay"
                    placeholder="dd"
                    value={formData.birthDay}
                    onChange={handleChange}
                    className="w-1/3 rounded-sm bg-zinc-800 hover:bg-zinc-700 h-12 px-4 outline-none text-white"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 h-12 flex items-center justify-center text-white font-bold cursor-pointer"
              >
                注册
              </Button>
            </form>
          </>
        )}

        {step === 1 && (
          <div className="text-zinc-400 text-sm flex items-center w-full justify-center gap-2 text-nowrap mt-auto">
            已有账号？点击
            <span
              onClick={openSignIn}
              className="text-transparent cursor-pointer underline bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 self-end"
            >
              登录
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
