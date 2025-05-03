import Image from "next/image";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PlayCardContent() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    function updatePosition() {
      if (textRef.current) {
        const textWidth = textRef.current.offsetWidth;
        const containerWidth = textRef.current.parentElement?.offsetWidth || 0;

        const endPosition = containerWidth - textWidth;

        document.documentElement.style.setProperty("--text-end-position", `${endPosition}px`);
      }

      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        document.documentElement.style.setProperty("--original-image-width", `${rect.width}px`);
        document.documentElement.style.setProperty("--original-image-height", `${rect.height}px`);
      }
    }

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isAnimating) {
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 10000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-3">
      <div
        ref={imageContainerRef}
        className="rounded-2xl relative overflow-hidden aspect-square w-full"
      >
        <Image src="/images/1.png" fill className="object-cover h-full w-full" alt="" />
      </div>
      <div className="w-full text-4xl font-bold text-white flex items-center justify-center relative gap-2">
        <div
          className="overflow-hidden w-full h-10 relative text-marquee"
          onMouseEnter={handleMouseEnter}
        >
          <div
            ref={textRef}
            className={`marquee-content whitespace-nowrap text-start text-3xl h-10 absolute ${
              isAnimating ? "animate-marquee" : ""
            }`}
          >
            Start From the Bottom
          </div>
        </div>
        <button className="text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors">
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
