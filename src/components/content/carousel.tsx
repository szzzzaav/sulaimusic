import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Carousel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number }[]>([]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateArrows = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;

      setShowLeft(scrollLeft > 0);
      const maxScrollLeft = scrollWidth - clientWidth;
      setShowRight(Math.ceil(scrollLeft) < Math.floor(maxScrollLeft) - 1);
    }
  };

  const handleLeftClick = () => {
    if (containerRef.current) {
      const width = dimensions[0]?.width || 0;
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft - width * 3,
        behavior: "smooth",
      });
    }
  };

  const handleRightClick = () => {
    if (containerRef.current) {
      const width = dimensions[0]?.width || 0;
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft + width * 3,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const childElements = containerRef.current.querySelectorAll(".carousel-item");
      const childDimensions = Array.from(childElements).map((child) => ({
        width: child.clientWidth,
      }));
      setDimensions(childDimensions);

      updateArrows();
    }
  }, [children]);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    updateArrows();
  }, [containerWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleScroll = () => {
        updateArrows();
      };

      container.addEventListener("scroll", handleScroll);

      const handleResize = () => {
        updateArrows();
        setContainerWidth(container.clientWidth);
      };
      window.addEventListener("resize", handleResize);

      const resizeObserver = new ResizeObserver(() => {
        updateArrows();
        const childElements = container.querySelectorAll(".carousel-item");
        const childDimensions = Array.from(childElements).map((child) => ({
          width: child.clientWidth,
        }));
        setDimensions(childDimensions);

        // 更新容器宽度
        setContainerWidth(container.clientWidth);
      });

      resizeObserver.observe(container);

      updateArrows();

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    updateArrows();
  }, [dimensions]);

  return (
    <div
      className={twMerge("w-full h-auto relative", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="w-full h-auto flex items-center overflow-hidden relative px-4"
        ref={containerRef}
      >
        {children}
      </div>
      <div
        className={twMerge(
          "absolute top-1/2 -left-3 -translate-y-1/2 z-10 cursor-pointer transition-all duration-300 rounded-full  bg-[#121212] shadow-2xl p-2",
          hover && showLeft ? "left-3" : "opacity-0"
        )}
        onClick={handleLeftClick}
      >
        <FaChevronLeft className="w-4 h-4 text-white" />
      </div>
      <div
        className={twMerge(
          "absolute top-1/2 -right-3 -translate-y-1/2 z-10 cursor-pointer transition-all duration-300 rounded-full  bg-[#121212] shadow-2xl p-2",
          hover && showRight ? "right-3" : "opacity-0"
        )}
        onClick={handleRightClick}
      >
        <FaChevronRight className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}

export const CarouselItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-auto h-auto carousel-item">{children}</div>;
};
