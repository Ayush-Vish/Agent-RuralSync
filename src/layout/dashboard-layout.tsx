// BookingDashboard.tsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import BookingDialog, { Booking } from '@/components/BookingDialoge';
import { useDashboardStore } from '@/stores/booking.store';


export default function BookingDashboard() {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const totalBookings = useDashboardStore((state) => state.totalBookings);
  const pendingBookings = useDashboardStore((state) => state.pendingBookings);
  const inProgressBookings = useDashboardStore((state) => state.inProgressBookings);
  const completedBookings = useDashboardStore((state) => state.completedBookings);
  const fetchDashboardData = useDashboardStore((state) => state.fetchDashboardData);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const renderBookingTable = (bookings: Booking[], title: string) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.client}</TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={booking.status === 'Completed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setSelectedBookingId(booking._id)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Booking Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
        {/* Render other cards as necessary */}
      </div>
      {renderBookingTable(pendingBookings, "Pending Bookings")}
      {renderBookingTable(inProgressBookings, "In Progress Bookings")}
      {renderBookingTable(completedBookings, "Completed Bookings")}
      <BookingDialog bookingId={selectedBookingId} onClose={() => setSelectedBookingId(null)} />
    </div>
  );
}
