"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserStats } from "@/lib/api";
import { ProductivityStats as StatsType } from "@/types";
import ProgressChart from "../ProgressChart";
import StreakCard from "../StreakCard";
import WeeklyProductivityCard from "../WeeklyProductivityCard";
import QuotesCard from "../QuotesCard";
import { Skeleton } from "./skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./carousel";

const HOMECARD = () => {
  const { data: stats, isLoading, isError } = useQuery<StatsType>({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  });
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading) return (
    <div className="space-y-6 mb-6">
      <div className="space-y-3">
        <div className="space-y-4">
          {/* Skeleton for carousel */}
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-full h-[350px] rounded-2xl" />
            <div className="flex gap-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="w-2 h-2 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isError) return <div className="text-center p-4 text-destructive">Failed to load statistics</div>;

  if (!stats) return null;

  return (
    <div className="space-y-6 mb-6">
      {/* 3D Carousel Container */}
      <div className="relative px-12">
        <style jsx global>{`
          .carousel-3d .carousel-item {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.4;
            transform: scale(0.75);
            filter: blur(2px);
          }

          .carousel-3d .carousel-item.is-active {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
            box-shadow: 0 0 40px rgba(34, 211, 238, 0.4),
                        0 0 80px rgba(34, 211, 238, 0.2),
                        0 0 120px rgba(34, 211, 238, 0.1);
          }
        `}</style>

        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="carousel-3d w-full"
        >
          <CarouselContent className="-ml-4">
            {/* Slide 1: Progress Chart */}
            <CarouselItem className={`pl-4 carousel-item ${current === 0 ? 'is-active' : ''}`}>
              <div className="p-1">
                <div className="rounded-2xl overflow-hidden">
                  <ProgressChart stats={stats} />
                </div>
              </div>
            </CarouselItem>

            {/* Slide 2: Streak Card */}
            <CarouselItem className={`pl-4 carousel-item ${current === 1 ? 'is-active' : ''}`}>
              <div className="p-1">
                <StreakCard streak={stats.active_streak} />
              </div>
            </CarouselItem>

            {/* Slide 3: Weekly Productivity */}
            <CarouselItem className={`pl-4 carousel-item ${current === 2 ? 'is-active' : ''}`}>
              <div className="p-1">
                <WeeklyProductivityCard />
              </div>
            </CarouselItem>

            {/* Slide 4: Quotes */}
            <CarouselItem className={`pl-4 carousel-item ${current === 3 ? 'is-active' : ''}`}>
              <div className="p-1">
                <QuotesCard />
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* Carousel Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? 'w-8 bg-cyan-500'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HOMECARD;
