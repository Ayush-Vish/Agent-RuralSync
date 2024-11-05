'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from 'lucide-react'
import { useDashboardStore } from '@/stores/booking.store'

type Booking = {
  _id: string
  client: string
  serviceProvider: string
  service: string
  bookingDate: string
  bookingTime: string
  status: string
  paymentStatus: string
  location: {
    type: string
    coordinates: number[]
  }
}

export default function BookingDashboard() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const totalBookings = useDashboardStore((state) => state.totalBookings)
  const pendingBookings = useDashboardStore((state) => state.pendingBookings)
  const inProgressBookings = useDashboardStore((state) => state.inProgressBookings)
  const completedBookings = useDashboardStore((state) => state.completedBookings)
  const fetchDashboardData = useDashboardStore((state) => state.fetchDashboardData)
  const handleFetch =async () => {
    await fetchDashboardData()
  }
   useEffect(() => {
    handleFetch()
  }, [])

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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                          Detailed information about the selected booking.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedBooking && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <UserIcon className="h-4 w-4" />
                            <span className="col-span-3">{selectedBooking.client}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="col-span-3">
                              {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <ClockIcon className="h-4 w-4" />
                            <span className="col-span-3">{selectedBooking.bookingTime}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <MapPinIcon className="h-4 w-4" />
                            <span className="col-span-3">
                              {selectedBooking.location.coordinates.join(', ')}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-semibold">Service:</span>
                            <span className="col-span-3">{selectedBooking.service}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-semibold">Provider:</span>
                            <span className="col-span-3">{selectedBooking.serviceProvider}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-semibold">Status:</span>
                            <Badge variant={selectedBooking.status === 'Completed' ? 'default' : 'secondary'}>
                              {selectedBooking.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-semibold">Payment:</span>
                            <Badge variant={selectedBooking.paymentStatus === 'Paid' ? 'default' : 'destructive'}>
                              {selectedBooking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings.length}</div>
          </CardContent>
        </Card>
      </div>
      {renderBookingTable(pendingBookings, "Pending Bookings")}
      {renderBookingTable(inProgressBookings, "In Progress Bookings")}
      {renderBookingTable(completedBookings, "Completed Bookings")}
    </div>
  )
}
