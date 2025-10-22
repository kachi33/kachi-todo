import { useQuery } from "@tanstack/react-query";
import { fetchUserStats } from "@/lib/api";
import { ProductivityStats as StatsType } from "@/types";
import ProgressChart from "../ProgressChart";

const HOMECARD = () => {
  const { data: stats, isLoading, isError } = useQuery<StatsType>({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  });

  if (isLoading) return <div className="text-center p-4 text-muted-foreground">Loading stats...</div>;

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