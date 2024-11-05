'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, PlusCircleIcon } from "lucide-react"

type ExtraTask = {
  description: string
  extraPrice: string
}

export type Booking = {
  _id: string
  client: string
  serviceProvider: string
  service: string
  bookingDate: string
  bookingTime: string
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Not Assigned'
  paymentStatus: 'Paid' | 'Unpaid'
  totalPrice: number
  location: {
    type: string
    coordinates: number[]
  }
  extraTasks: ExtraTask[]
  agent?: string
}

type BookingDetailsDialogProps = {
  booking: Booking
  onBookingSelect: (booking: Booking) => void
  onStatusChange: (bookingId: string, newStatus: Booking['status']) => void
  onPaymentStatusChange: (bookingId: string, newStatus: Booking['paymentStatus']) => void
  onExtraTaskAdd: (bookingId: string, task: ExtraTask) => void
  onTaskDescriptionAdd: (bookingId: string, description: string) => void
}

export default function BookingDetailsDialog({
  booking,
  onBookingSelect,
  onStatusChange,
  onPaymentStatusChange,
  onExtraTaskAdd,
  onTaskDescriptionAdd
}: BookingDetailsDialogProps) {
  const [newTask, setNewTask] = useState<ExtraTask>({ description: '', extraPrice: '' })
  const [taskDescription, setTaskDescription] = useState('')

  const handleExtraTaskAdd = () => {
    if (newTask.description && newTask.extraPrice) {
      onExtraTaskAdd(booking._id, newTask)
      setNewTask({ description: '', extraPrice: '' })
    }
  }

  const handleTaskDescriptionAdd = () => {
    if (taskDescription) {
      onTaskDescriptionAdd(booking._id, taskDescription)
      setTaskDescription('')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => onBookingSelect(booking)}>
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>Detailed information about the selected booking.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <UserIcon className="h-4 w-4" />
            {/* <span className="col-span-3">{booking.client}</span> */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <CalendarIcon className="h-4 w-4" />
            <span className="col-span-3">{new Date(booking.bookingDate).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <ClockIcon className="h-4 w-4" />
            <span className="col-span-3">{booking.bookingTime}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <MapPinIcon className="h-4 w-4" />
            <span className="col-span-3">{booking.location.coordinates.join(', ')}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Service:</span>
            <span className="col-span-3">{booking.service}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Provider:</span>
            <span className="col-span-3">{booking.serviceProvider}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Status:</span>
            <Select
              defaultValue={booking.status}
              onValueChange={(value) => onStatusChange(booking._id, value as Booking['status'])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Not Assigned">Not Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Payment:</span>
            <div className="col-span-3 flex items-center gap-2">
              <Badge variant={booking.paymentStatus === 'Paid' ? 'default' : 'destructive'}>
                {booking.paymentStatus}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPaymentStatusChange(booking._id, booking.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid')}
              >
                Toggle Payment Status
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Total Price:</span>
            <span className="col-span-3">${booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Booking History</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Created</Badge>
              <span>{new Date(booking.bookingDate).toLocaleString()}</span>
            </div>
            {booking.status !== 'Pending' && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Confirmed</Badge>
                <span>{new Date(booking.bookingDate).toLocaleString()}</span>
              </div>
            )}
            {booking.extraTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Badge variant="outline">Extra Task</Badge>
                <span>{task.description} (${task.extraPrice})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Add Extra Task</h4>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <Input
              placeholder="Extra Price"
              value={newTask.extraPrice}
              onChange={(e) => setNewTask({ ...newTask, extraPrice: e.target.value })}
            />
            <Button variant="outline" onClick={handleExtraTaskAdd}>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Add Task Description</h4>
          <Textarea
            placeholder="Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Button variant="outline" onClick={handleTaskDescriptionAdd}>
            Add Description
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}