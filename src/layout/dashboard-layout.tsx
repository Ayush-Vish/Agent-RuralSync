// BookingDashboard.tsx - Refactored with modular components
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsSheet } from "@/components/booking";
import { useDashboardStore } from "@/stores/booking.store";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";

// Import modular dashboard components
import {
  StatsCard,
  PerformanceCard,
  BookingsTable,
  DashboardHeader,
  DashboardSkeleton,
  ErrorState,
} from "@/components/dashboard";

export default function BookingDashboard() {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Store selectors
  const totalBookings = useDashboardStore((state) => state.totalBookings);
  const pendingBookings = useDashboardStore((state) => state.pendingBookings);
  const inProgressBookings = useDashboardStore((state) => state.inProgressBookings);
  const completedBookings = useDashboardStore((state) => state.completedBookings);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);
  const fetchDashboardData = useDashboardStore((state) => state.fetchDashboardData);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  }, [fetchDashboardData]);

  // Calculate stats
  const pendingCount = pendingBookings?.length || 0;
  const inProgressCount = inProgressBookings?.length || 0;
  const completedCount = completedBookings?.length || 0;
  const activeBookings = pendingCount + inProgressCount;
  const completionRate = totalBookings > 0
    ? Math.round((completedCount / totalBookings) * 100)
    : 0;

  // Loading state
  if (isLoading && !isRefreshing) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error && !isRefreshing) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Bookings"
            value={totalBookings}
            subtitle="All time bookings"
            icon={Calendar}
            gradient="blue"
          />
          <StatsCard
            title="Pending"
            value={pendingCount}
            subtitle="Awaiting action"
            icon={Clock}
            gradient="yellow"
          />
          <StatsCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Active bookings"
            icon={Users}
            gradient="purple"
          />
          <StatsCard
            title="Completed"
            value={completedCount}
            subtitle={`${completionRate}% completion rate`}
            icon={CheckCircle2}
            gradient="green"
          />
        </div>

        {/* Performance Overview */}
        <PerformanceCard
          completionRate={completionRate}
          activeBookings={activeBookings}
          completedCount={completedCount}
        />

        {/* Bookings Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="pending" className="relative data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
              Pending
              {pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="inprogress" className="relative data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
              In Progress
              {inProgressCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-purple-500 text-white rounded-full">
                  {inProgressCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              Completed
              {completedCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                  {completedCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Pending Bookings
                </CardTitle>
                <CardDescription>Bookings waiting for your action</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingsTable
                  bookings={pendingBookings || []}
                  emptyMessage="No pending bookings at the moment"
                  onViewDetails={setSelectedBookingId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inprogress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  In Progress Bookings
                </CardTitle>
                <CardDescription>Currently active bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingsTable
                  bookings={inProgressBookings || []}
                  emptyMessage="No bookings in progress"
                  onViewDetails={setSelectedBookingId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Completed Bookings
                </CardTitle>
                <CardDescription>Your booking history</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingsTable
                  bookings={completedBookings || []}
                  emptyMessage="No completed bookings yet"
                  onViewDetails={setSelectedBookingId}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Details Sheet */}
      <BookingDetailsSheet
        bookingId={selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
      />
    </div>
  );
}
