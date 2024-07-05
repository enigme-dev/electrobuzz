import { useState, useRef, ReactNode, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselApi, CarouselContent } from "./ui/carousel";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TCarouselImageProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function CarouselImage({
  children,
  delay = 4000,
  className,
}: TCarouselImageProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(Autoplay({ delay }));

  const handleNext = () => {
    if (api) {
      api.scrollNext();
    }
  };

  const handlePrev = () => {
    if (api) {
      api.scrollPrev();
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      className={twMerge("w-full", className)}
      setApi={setApi}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>{children}</CarouselContent>
      <div className="absolute right-0 -mt-12 mr-2 hidden sm:inline-grid grid-cols-3 items-center bg-black/60 text-white rounded-lg">
        <Button
          variant="ghost"
          className="p-2 hover:bg-transparent hover:text-white"
          onClick={handlePrev}
          disabled={current === 1}
        >
          <ChevronLeft size={20} />
        </Button>
        <span className="w-10 text-sm text-center">{`${current}/${count}`}</span>
        <Button
          variant="ghost"
          className="p-2 hover:bg-transparent hover:text-white"
          onClick={handleNext}
          disabled={current === count}
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </Carousel>
  );
}
