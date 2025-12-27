import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface PerformanceCardProps {
  completionRate: number;
  activeBookings: number;
  completedCount: number;
}

export function PerformanceCard({ completionRate, activeBookings, completedCount }: PerformanceCardProps) {
  const getPerformanceLabel = (rate: number) => {
    if (rate >= 80) return { text: "Excellent", color: "text-green-600" };
    if (rate >= 60) return { text: "Good", color: "text-blue-600" };
    if (rate >= 40) return { text: "Average", color: "text-yellow-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const performance = getPerformanceLabel(completionRate);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Overview
        </CardTitle>
        <CardDescription>Your booking statistics at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Completion Rate */}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground font-medium">Completion Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">{completionRate}%</span>
              <span className={`text-sm font-medium ${performance.color}`}>
                {performance.text}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  completionRate >= 80 ? "bg-green-600" :
                  completionRate >= 60 ? "bg-blue-600" :
                  completionRate >= 40 ? "bg-yellow-600" : "bg-red-600"
                }`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Active Bookings */}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground font-medium">Active Bookings</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">{activeBookings}</span>
              <span className="text-sm text-muted-foreground">tasks</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Pending and in-progress bookings
            </p>
          </div>

          {/* Completed */}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground font-medium">Total Completed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">{completedCount}</span>
              <span className="text-sm text-muted-foreground">bookings</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Successfully finished jobs
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
