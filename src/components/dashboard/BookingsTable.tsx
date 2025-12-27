import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, AlertCircle, User, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Booking, BookingStatus } from "@/types";

interface BookingsTableProps {
  bookings: Booking[];
  emptyMessage: string;
  onViewDetails: (bookingId: string) => void;
}

const statusStyles: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
  "COMPLETED": { variant: "default", className: "bg-green-600" },
  "IN_PROGRESS": { variant: "secondary", className: "bg-purple-600 text-white" },
  "PENDING": { variant: "outline", className: "border-yellow-500 text-yellow-600" },
  "CONFIRMED": { variant: "outline", className: "border-blue-500 text-blue-600" },
  "CANCELLED": { variant: "destructive", className: "" },
  "NOT_ASSIGNED": { variant: "outline", className: "border-gray-400 text-gray-500" },
};

export function BookingsTable({ bookings, emptyMessage, onViewDetails }: BookingsTableProps) {
  const isMobile = useIsMobile();

  if (!bookings || bookings.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center text-muted-foreground">
          <AlertCircle className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <p className="font-medium">{emptyMessage}</p>
          <p className="text-sm mt-1">Check back later for new bookings</p>
        </div>
      </div>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            onClick={() => onViewDetails(booking._id)}
            className="bg-card rounded-lg border p-4 space-y-3 cursor-pointer active:bg-muted/50 transition-colors"
          >
            {/* Header: Client & Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{booking.client || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">{booking.service || "N/A"}</p>
                </div>
              </div>
              <Badge 
                variant={statusStyles[booking.status]?.variant || "outline"}
                className={`font-medium text-xs ${statusStyles[booking.status]?.className || ""}`}
              >
                {booking.status}
              </Badge>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>
                  {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {booking.address ||
                    (booking.location?.coordinates
                      ? `${booking.location.coordinates[1]?.toFixed(2)}, ${booking.location.coordinates[0]?.toFixed(2)}`
                      : "N/A")}
                </span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                Tap to view details
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Service</TableHead>
            <TableHead className="font-semibold">Date & Time</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow 
              key={booking._id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{booking.client || "N/A"}</TableCell>
              <TableCell>{booking.service || "N/A"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate max-w-[150px]">
                    {booking.address || 
                     (booking.location?.coordinates ? 
                      `${booking.location.coordinates[1]?.toFixed(4)}, ${booking.location.coordinates[0]?.toFixed(4)}` : 
                      'N/A'
                     )}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={statusStyles[booking.status]?.variant || "outline"}
                  className={`font-medium ${statusStyles[booking.status]?.className || ""}`}
                >
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewDetails(booking._id)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
