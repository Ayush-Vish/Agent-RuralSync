"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
  Plus,
  X,
} from "lucide-react";
import MapView from "@/components/map/MapView";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/stores/booking.store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { BookingDialogProps, ExtraTask } from "@/types";

export default function BookingDialog({
  bookingId,
  onClose,
}: BookingDialogProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ description: "", extraPrice: "" });

  const booking = useDashboardStore((state) => state.currentBooking);
  const fetchBooking = useDashboardStore((state) => state.fetchBooking);
  const updateBookingStatus = useDashboardStore(
    (state) => state.updateBookingStatus
  );
  const addExtraTask = useDashboardStore((state) => state.addExtraTask);
  const deleteExtraTask = useDashboardStore((state) => state.deleteExtraTask);
  const markBookingAsPaid = useDashboardStore(
    (state) => state.markBookingAsPaid
  );

  const handleFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchBooking(bookingId!);
    } catch (err) {
      setError("Failed to fetch booking details");
      console.error("Error fetching booking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      handleFetch();
    }
  }, [bookingId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateBookingStatus(bookingId!, newStatus);
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  const handleAddExtraTask = async () => {
    if (!newTask.description || !newTask.extraPrice) return;
    try {
      await addExtraTask(bookingId!, newTask);
      setNewTask({ description: "", extraPrice: "" });
    } catch (err) {
      console.error("Error adding extra task:", err);
    }
  };

  const handleDeleteExtraTask = async (taskId: string) => {
    try {
      await deleteExtraTask(bookingId!, taskId);
    } catch (err) {
      console.error("Error deleting extra task:", err);
    }
  };

  const handleMarkAsPaid = async (method: string) => {
    try {
      await markBookingAsPaid(bookingId!, method);
    } catch (err) {
      console.error("Error marking booking as paid:", err);
    }
  };

  if (!bookingId) return null;

  return (
    <Dialog open={!!bookingId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected booking.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {!loading && !error && booking && (
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {/* Client Info */}
            <div className="flex items-center gap-3">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{booking.client?.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{booking.client?.email}</span>
            </div>

            {/* Schedule Info */}
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(booking.bookingDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{booking.bookingTime}</span>
            </div>

            {/* Location & Map */}
            <div className="col-span-2 space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <span className="text-sm font-semibold block">Service Address</span>
                  <p className="text-sm text-muted-foreground">
                    {booking.address || "No address provided"}
                  </p>
                </div>
              </div>
              
              {booking.location?.coordinates && (
                <div className="rounded-lg overflow-hidden border">
                  <MapView
                    latitude={booking.location.coordinates[1]}
                    longitude={booking.location.coordinates[0]}
                    address={booking.address}
                    height="200px"
                    zoom={15}
                  />
                </div>
              )}
            </div>

            {/* Service & Provider */}
            <div className="flex items-center gap-3 mt-2">
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{booking.service.name}</span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{booking.serviceProvider?.name}</span>
            </div>

            {/* Status Management */}
            <div className="col-span-2 grid grid-cols-2 gap-4 border-t pt-4 mt-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground">Booking Status</Label>
                <Select value={booking.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ... inside your return JSX */}
<div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
  <CreditCardIcon className="h-4 w-4" />
  <div className="col-span-3 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <Badge variant={booking.paymentStatus === "Paid" ? "default" : "destructive"}>
        {booking.paymentStatus}
      </Badge>
      <span className="font-bold text-lg">${booking.totalPrice}</span>
    </div>

    {booking.paymentStatus !== "Paid" && (
      <div className="flex gap-2">
        <Button 
          onClick={() => handleMarkAsPaid("CASH")} 
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Collect Cash
        </Button>
        <Button variant="outline" disabled className="flex-1">
          Online (Soon)
        </Button>
      </div>
    )}
  </div>
</div>
              
            </div>

            {/* Extra Tasks Section */}
            <div className="col-span-2 border-t pt-4 space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4" /> Additional Tasks
              </h4>
              
              {booking.extraTasks && booking.extraTasks.length > 0 ? (
                <div className="space-y-2">
                  {booking.extraTasks.map((task: ExtraTask, index: number) => (
                    <div key={task._id || index} className="flex justify-between items-center bg-muted/50 p-2 rounded-md text-sm">
                      <span className="flex-1">{task.description}</span>
                      <span className="font-bold mr-4">${task.extraPrice}</span>
                      <Button
                        onClick={() => handleDeleteExtraTask(task._id!)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No extra tasks added to this job.</p>
              )}

              {/* Add Task Form */}
              {booking.status !== "COMPLETED" && (
                <div className="grid grid-cols-3 gap-2 bg-secondary/20 p-3 rounded-lg border border-dashed">
                  <div className="col-span-2">
                    <Input
                      placeholder="Task description..."
                      className="text-xs"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Price"
                      className="text-xs"
                      value={newTask.extraPrice}
                      onChange={(e) => setNewTask({ ...newTask, extraPrice: e.target.value })}
                    />
                  </div>
                  <Button size="sm" onClick={handleAddExtraTask} className="col-span-3 h-8">
                    Add Extra Task
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <Button onClick={onClose} variant="outline" className="mt-4 w-full">
          Close Details
        </Button>
      </DialogContent>
    </Dialog>
  );
}
