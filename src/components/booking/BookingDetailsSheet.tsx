"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Package,
  User,
  Plus,
  Trash2,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Navigation,
  DollarSign,
} from "lucide-react";
import MapView from "@/components/map/MapView";
import { useDashboardStore } from "@/stores/booking.store";
import { useIsMobile } from "@/hooks/use-mobile";
import type { BookingDialogProps, ExtraTask } from "@/types";

// Status configuration
const statusConfig: Record<string, { color: string; bgColor: string; icon: typeof CheckCircle }> = {
  PENDING: { color: "text-yellow-700", bgColor: "bg-yellow-100 border-yellow-300", icon: Clock },
  IN_PROGRESS: { color: "text-purple-700", bgColor: "bg-purple-100 border-purple-300", icon: Loader2 },
  COMPLETED: { color: "text-green-700", bgColor: "bg-green-100 border-green-300", icon: CheckCircle },
  CANCELLED: { color: "text-red-700", bgColor: "bg-red-100 border-red-300", icon: AlertCircle },
  CONFIRMED: { color: "text-blue-700", bgColor: "bg-blue-100 border-blue-300", icon: CheckCircle },
};

export default function BookingDetailsSheet({ bookingId, onClose }: BookingDialogProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ description: "", extraPrice: "" });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const isMobile = useIsMobile();

  const booking = useDashboardStore((state) => state.currentBooking);
  const fetchBooking = useDashboardStore((state) => state.fetchBooking);
  const updateBookingStatus = useDashboardStore((state) => state.updateBookingStatus);
  const addExtraTask = useDashboardStore((state) => state.addExtraTask);
  const deleteExtraTask = useDashboardStore((state) => state.deleteExtraTask);
  const markBookingAsPaid = useDashboardStore((state) => state.markBookingAsPaid);

  useEffect(() => {
    if (bookingId) {
      handleFetch();
    }
  }, [bookingId]);

  const handleFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchBooking(bookingId!);
    } catch (err) {
      setError("Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateBookingStatus(bookingId!, newStatus);
  };

  const handleAddExtraTask = async () => {
    if (!newTask.description || !newTask.extraPrice) return;
    setIsAddingTask(true);
    await addExtraTask(bookingId!, newTask);
    setNewTask({ description: "", extraPrice: "" });
    setIsAddingTask(false);
  };

  const handleDeleteExtraTask = async (taskId: string) => {
    await deleteExtraTask(bookingId!, taskId);
  };

  const handleMarkAsPaid = async () => {
    await markBookingAsPaid(bookingId!, "CASH");
  };

  const StatusIcon = booking?.status ? statusConfig[booking.status]?.icon || Clock : Clock;

  return (
    <Sheet open={!!bookingId} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={`p-0 flex flex-col ${
          isMobile 
            ? "h-[90vh] rounded-t-2xl" 
            : "w-full sm:max-w-lg"
        }`}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center py-2">
            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
          </div>
        )}
        
        {/* Header */}
        <SheetHeader className={`px-6 ${isMobile ? 'py-3' : 'py-4'} border-b bg-muted/30`}>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg">Booking Details</SheetTitle>
              <SheetDescription className="text-xs mt-0.5">
                {bookingId ? `#${bookingId.slice(-8).toUpperCase()}` : ""}
              </SheetDescription>
            </div>
            {booking && (
              <Badge 
                variant="outline" 
                className={`${statusConfig[booking.status]?.bgColor} ${statusConfig[booking.status]?.color} border font-medium`}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {booking.status}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading booking details...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={handleFetch}>
                Try Again
              </Button>
            </div>
          ) : booking ? (
            <div className="px-6 py-4 space-y-6">
              {/* Client Section */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Client Information
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.client?.name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{booking.client?.email}</p>
                    </div>
                  </div>
                  {booking.client?.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.client.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </section>

              <Separator />

              {/* Schedule & Location */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Schedule & Location
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-sm">
                        {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-medium text-sm">{booking.bookingTime || "TBD"}</p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                {booking.location?.coordinates && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {booking.address || `${booking.location.coordinates[1].toFixed(4)}, ${booking.location.coordinates[0].toFixed(4)}`}
                      </span>
                    </div>
                    <div className="rounded-lg overflow-hidden border h-40">
                      <MapView
                        latitude={booking.location.coordinates[1]}
                        longitude={booking.location.coordinates[0]}
                        address={booking.address}
                        height="160px"
                        zoom={15}
                      />
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Navigation className="h-4 w-4" />
                      Open in Maps
                    </Button>
                  </div>
                )}
              </section>

              <Separator />

              {/* Service Details */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Service Details
                </h3>
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{booking.service?.name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Provider: {booking.serviceProvider?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Status Management */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Status Management
                </h3>
                <div className="space-y-2">
                  <Label className="text-xs">Update Status</Label>
                  <Select value={booking.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="IN_PROGRESS">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          In Progress
                        </div>
                      </SelectItem>
                      <SelectItem value="COMPLETED">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          Completed
                        </div>
                      </SelectItem>
                      <SelectItem value="CANCELLED">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          Cancelled
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>

              <Separator />

              {/* Extra Tasks */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Extra Tasks
                  </h3>
                  {booking.extraTasks && booking.extraTasks.length > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {booking.extraTasks.length} tasks
                    </span>
                  )}
                </div>

                {booking.extraTasks && booking.extraTasks.length > 0 ? (
                  <div className="space-y-2">
                    {booking.extraTasks.map((task: ExtraTask, index: number) => (
                      <div
                        key={task._id || index}
                        className="flex items-center justify-between bg-muted/30 rounded-lg p-3 group"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">${task.extraPrice}</span>
                          {task._id && booking.status !== "COMPLETED" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                              onClick={() => handleDeleteExtraTask(task._id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg">
                    No extra tasks added
                  </p>
                )}

                {/* Add Task Form */}
                {booking.status !== "COMPLETED" && (
                  <div className="bg-muted/20 rounded-lg p-3 border border-dashed space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Task description..."
                        className="col-span-2 h-9 text-sm"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        className="h-9 text-sm"
                        value={newTask.extraPrice}
                        onChange={(e) => setNewTask({ ...newTask, extraPrice: e.target.value })}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleAddExtraTask}
                      disabled={!newTask.description || !newTask.extraPrice || isAddingTask}
                      className="w-full gap-2"
                    >
                      {isAddingTask ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Add Extra Task
                    </Button>
                  </div>
                )}
              </section>

              <Separator />

              {/* Payment Section */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Payment
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Total Amount</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      ${booking.totalPrice || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={booking.paymentStatus === "Paid" ? "default" : "destructive"}
                      className={booking.paymentStatus === "Paid" ? "bg-green-600" : ""}
                    >
                      {booking.paymentStatus}
                    </Badge>
                    {booking.paymentStatus !== "Paid" && (
                      <Button
                        size="sm"
                        onClick={handleMarkAsPaid}
                        className="bg-green-600 hover:bg-green-700 gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        Collect Payment
                      </Button>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </ScrollArea>

        {/* Footer Actions */}
        {booking && (
          <div className="px-6 py-4 border-t bg-muted/30">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close
              </Button>
              {booking.client?.email && (
                <Button variant="outline" className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Client
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
