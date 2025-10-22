import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserStats } from "@/lib/api";
import { ProductivityStats as StatsType } from "@/types";
import ProgressChart from "../ProgressChart";
import { Skeleton } from "./skeleton";
import { Button } from "./button";

const HOMECARD = () => {
  const { data: stats, isLoading, isError } = useQuery<StatsType>({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  });


  if (isLoading) return (
    <div className="space-y-6 mb-6">
      <div className="space-y-3">
        <div className="space-y-4">
          {/* Skeleton for circular progress */}
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </div>
    </div>
  );

  if (isError) return <div className="text-center p-4 text-destructive">Failed to load statistics</div>;

  if (!stats) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Getting Started";
  };

  return (
    <div className="space-y-6">
      {/* Progress Chart */}
      <div className="space-y-3">
        <ProgressChart stats={stats} />
      </div>
    </div>
  );
};

export default HOMECARD;

// Testing loading state funtion
  // const [forceLoading, setForceLoading] = useState(false);
  // const showLoading = isLoading || forceLoading;


 {/* Toggle button for testing */}
      // <div className="flex justify-end">
      //   <Button
      //     variant="outline"
      //     size="sm"
      //     className=""
      //     onClick={() => setForceLoading(!forceLoading)}
      //   >
      //     {forceLoading ? "Show Loaded" : "Show Loading"}
      //   </Button>
      // </div>