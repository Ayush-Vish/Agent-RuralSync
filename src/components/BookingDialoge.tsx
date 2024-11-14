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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/stores/booking.store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BookingDialogProps {
  bookingId: string | null;
  onClose: () => void;
}

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
  const updateExtraTask = useDashboardStore((state) => state.updateExtraTask);
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
    try {
      await addExtraTask(bookingId!, newTask);
      setNewTask({ description: "", extraPrice: "" });
    } catch (err) {
      console.error("Error adding extra task:", err);
    }
  };

  const handleUpdateExtraTask = async (
    taskId: string,
    updatedTask: { description: string; extraPrice: string }
  ) => {
    try {
      await updateExtraTask(bookingId!, taskId, updatedTask);
    } catch (err) {
      console.error("Error updating extra task:", err);
    }
  };

  const handleDeleteExtraTask = async (taskId: string) => {
    try {
      await deleteExtraTask(bookingId!, taskId);
    } catch (err) {
      console.error("Error deleting extra task:", err);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await markBookingAsPaid(bookingId!);
    } catch (err) {
      console.error("Error marking booking as paid:", err);
    }
  };

  if (!bookingId) return null;

  return (
    <Dialog open={!!bookingId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected booking.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}

        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {!loading && !error && booking && (
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <UserIcon className="h-4 w-4" />
              <span className="col-span-3">{booking.client?.name}</span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <MailIcon className="h-4 w-4" />
              <span className="col-span-3">{booking.client?.email}</span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <CalendarIcon className="h-4 w-4" />
              <span className="col-span-3">
                {new Date(booking.bookingDate).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <ClockIcon className="h-4 w-4" />
              <span className="col-span-3">{booking.bookingTime}</span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <MapPinIcon className="h-4 w-4" />
              <span className="col-span-3">
                {booking.location?.coordinates?.join(", ")}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <PackageIcon className="h-4 w-4" />
              <span className="col-span-3">{booking.service}</span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <UserIcon className="h-4 w-4" />
              <span className="col-span-3">
                {booking.serviceProvider?.name}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <MailIcon className="h-4 w-4" />
              <span className="col-span-3">
                {booking.serviceProvider?.email}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="font-semibold">
                Status:
              </Label>
              <Select onValueChange={(value) => handleStatusChange(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={booking.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <CreditCardIcon className="h-4 w-4" />
              <Badge
                variant={
                  booking.paymentStatus === "Paid" ? "default" : "destructive"
                }
              >
                {booking.paymentStatus}
              </Badge>
              {booking.paymentStatus === "Unpaid" && (
                <Button onClick={handleMarkAsPaid} className="col-span-2">
                  Mark as Paid
                </Button>
              )}
            </div>

            {booking.agent && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <UserIcon className="h-4 w-4" />
                  <span className="col-span-3">{booking.agent?.name}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <MailIcon className="h-4 w-4" />
                  <span className="col-span-3">{booking.agent?.email}</span>
                </div>
              </>
            )}

            <div className="col-span-1 sm:col-span-2">
              <h4 className="font-semibold mb-2">Extra Tasks:</h4>
              {booking.extraTasks && booking.extraTasks.length > 0 ? (
                <ul className="space-y-2">
                  {booking.extraTasks.map((task: any, index: number) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{task.description}</span>
                      <span className="font-medium">${task.extraPrice}</span>
                      <Button
                        onClick={() => handleDeleteExtraTask(task._id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No extra tasks</p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <h4 className="font-semibold mb-2">Add Extra Task:</h4>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <Label htmlFor="extraPrice">Price</Label>
                <Input
                  id="extraPrice"
                  value={newTask.extraPrice}
                  onChange={(e) =>
                    setNewTask({ ...newTask, extraPrice: e.target.value })
                  }
                />
                <Button onClick={handleAddExtraTask}>Add Task</Button>
              </div>
            </div>
          </div>
        )}

        <Button onClick={onClose} variant="outline" className="mt-4 w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
