"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserStats } from "@/lib/api";
import { ProductivityStats as StatsType } from "@/types";
import ProgressChart from "../ProgressChart";
import StreakCard from "../StreakCard";
import TodayActivityCard from "../TodayActivityCard";
import QuotesCard from "../QuotesCard";
import { Skeleton } from "./skeleton";
import { Button } from "./button";
import { AlertCircle, RefreshCw, TrendingUp } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const HOMECARD = () => {
  const { data: stats, isLoading, isError, refetch } = useQuery<StatsType>({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  });

  if (isLoading) return (
    <div className="space-y-6 mb-6">
      <div className="space-y-3">
        <div className="space-y-4">
          {/* Skeleton for carousel */}
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-full h-70 rounded-2xl" />
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

  if (isError) return (
    <div className="space-y-6 mb-6">
      <div className="flex flex-col items-center justify-center p-8 bg-linear-to-br from-card to-card/80 rounded-2xl border border-destructive/50 h-full min-h-[300px]">
        {/* Error Icon */}
        <AlertCircle className="h-16 w-16 text-destructive mb-6" />

        {/* Error Message */}
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Failed to Load Statistics
        </h3>
        <p className="text-center text-muted-foreground mb-6 max-w-md">
          We couldn't retrieve your productivity data. Please check your connection and try again.
        </p>

        {/* Retry Button */}
        <Button
          onClick={() => refetch()}
          className="flex items-center gap-2"
          variant="default"
          size="md"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="space-y-2 md:mb-6">
      {/* Swiper Carousel Container */}
      <div className="relative">
        <style jsx global>{`
          /* Navigation buttons - Change color and size here */
          .swiper-button-next,
          .swiper-button-prev {
            color: grey; /* Change to any color: #ff0000 for red, #00ff00 for green, etc. */
            width: 50px; /* Change width */
            height: 50px; /* Change height */
          }

          /* Arrow icon size */
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 28px; /* Change arrow icon size (default is 44px) */
            font-weight: bold;
          }

          /* Optional: Add background to buttons */
          .swiper-button-next,
          .swiper-button-prev {
            background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
            border-radius: 50%; /* Make circular */
            padding: 8px;
          }

          /* Pagination dots styling */
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: grey;
            opacity: 0.3;
            transition: all 0.3s;
          }

          .swiper-pagination-bullet-active {
            width: 12px;
            height: 12px;
            border-radius: 4px;
            border-radius: 50%;
            background: grey; /* Change active dot color */
            opacity: 1;
          }
        `}</style>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          loop={true}
          autoplay={{
            delay: 20000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
    
          }}
          navigation={true}
          className="w-full m-0 text-muted-foreground"
        >
          {/* Slide 1: Progress Chart */}
          <SwiperSlide className=" max-w-xs bg-card border border-border rounded-2xl shadow-lg ">
              <div className="bg-card border border-border rounded-2xl shadow-lg p-4">
                <ProgressChart stats={stats} />
              </div>
          </SwiperSlide>

          {/* Slide 2: Streak Card */}
          <SwiperSlide className=" max-w-xs bg-card border border-border rounded-2xl shadow-lg ">
              <div className="bg-card border border-border rounded-2xl shadow-lg p-4">
                <StreakCard stats={stats} />
              </div>
          </SwiperSlide>

          {/* Slide 3: Today's Activity */}
          <SwiperSlide className=" max-w-xs bg-card border border-border rounded-2xl shadow-lg ">
              <div className="bg-card border border-border rounded-2xl shadow-lg p-4">
                <TodayActivityCard stats={stats} />
              </div>
          </SwiperSlide>

          {/* Slide 4: Quotes */}
          <SwiperSlide className=" max-w-xs bg-card border border-border rounded-2xl shadow-lg ">
              <QuotesCard />
          </SwiperSlide>
        </Swiper>
      </div>
      
    </div>
  );
};

export default HOMECARD;
