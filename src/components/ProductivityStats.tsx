import { useQuery } from "@tanstack/react-query";
import { fetchUserStats } from "@/lib/api";
import { ProductivityStats as StatsType } from "@/types";
import { CheckCircle, Clock, Target, TrendingUp, Calendar, Zap } from "lucide-react";
import ProgressChart from "./ProgressChart";

const ProductivityStats = () => {
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
      {/* Productivity Score */}
      <div className="text-center">
        <div className={`text-4xl font-bold ${getScoreColor(stats.total_productivity_score)}`}>
          {stats.total_productivity_score}
        </div>
        <div className="text-sm text-muted-foreground">
          Productivity Score - {getScoreLabel(stats.total_productivity_score)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Todos */}
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-primary mr-2" />
            <span className="text-2xl font-bold text-card-foreground">{stats.total_todos}</span>
          </div>
          <div className="text-xs text-muted-foreground">Total Tasks</div>
        </div>

        {/* Completed Todos */}
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-2xl font-bold text-card-foreground">{stats.completed_todos}</span>
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>

        {/* Pending Todos */}
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-2xl font-bold text-card-foreground">{stats.pending_todos}</span>
          </div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>

        {/* Completion Rate */}
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-2xl font-bold text-card-foreground">{stats.completion_rate}%</span>
          </div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Today's Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-accent/50 border border-border rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-xl font-bold text-foreground">{stats.todos_created_today}</span>
            </div>
            <div className="text-xs text-muted-foreground">Created</div>
          </div>

          <div className="bg-accent/50 border border-border rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-xl font-bold text-foreground">{stats.todos_completed_today}</span>
            </div>
            <div className="text-xs text-muted-foreground">Finished</div>
          </div>
        </div>
      </div>

      {/* Active Streak */}
      <div className="bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-border rounded-lg p-4 text-center">
          <span className="text-3xl">🔥</span>
          <span className="text-2xl font-bold text-foreground ml-2">{stats.active_streak}</span>
          Day{stats.active_streak !== 1 ? 's' : ''} Active Streak
          Keep completing tasks to maintain your streak!
      </div>

      {/* Progress Chart */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Progress Overview</h3>
        <ProgressChart stats={stats} />
      </div>
    </div>
  );
};

export default ProductivityStats;