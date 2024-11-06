/* eslint-disable @typescript-eslint/no-explicit-any */
import { AGENT_BASE_URL } from "@/constants";
import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { Booking } from "@/components/BookingDialoge";

interface Location {
  type: string
  coordinates: number[]
  _id: string
}

interface Client {
  _id: string
  name: string
  email: string
}

interface ServiceProvider {
  _id: string
  name: string
  email: string
}

interface Agent {
  _id: string
  name: string
  email: string
}

interface BookingDetails {
  _id: string
  client: Client
  serviceProvider: ServiceProvider
  service: string
  bookingDate: string
  bookingTime: string
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled" | "Not Assigned"
  paymentStatus: 'Paid' | 'Unpaid'
  location: Location
  extraTasks: any[] // Assuming extraTasks is an array, update if needed
  createdAt: string
  updatedAt: string
  agent: Agent
}

interface DashboardState {
  totalBookings: number;
  pendingBookings: Booking[];
  inProgressBookings: Booking[];
  completedBookings: Booking[];
  currentBooking: BookingDetails | null;  // Updated type
  fetchBooking: (bookingId: string) => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  updateBookingStatus: (bookingId: string, status: string) => Promise<void>;
  addExtraTask: (bookingId: string, task: { description: string; extraPrice: string }) => Promise<void>;
  updateExtraTask: (bookingId: string, taskId: string, task: { description: string; extraPrice: string }) => Promise<void>;
  deleteExtraTask: (bookingId: string, taskId: string) => Promise<void>;
  markBookingAsPaid: (bookingId: string) => Promise<void>;
}
export const useDashboardStore = create<DashboardState>((set, get) => ({
  totalBookings: 0,
  pendingBookings: [],
  inProgressBookings: [],
  completedBookings: [],
  currentBooking: null,


  fetchDashboardData: async () => {
    try {
      
      const response = await axiosInstance.get("http://localhost:5000/agent/dashboard");
      if(!response.data){
        toast.error("Failed to fetch dashboard data");
        return;
      }
      console.log("snsdkf")
      console.log(response.data);
      console.log(await response.data); 

      const { totalBookings, pendingBookings, inProgressBookings, completedBookings } = await  response.data;

      set({
        totalBookings,
        pendingBookings,
        inProgressBookings,
        completedBookings,
      });

      toast.success("Dashboard data fetched successfully");

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("An error occurred while loading dashboard data");
    }
  },
  fetchBooking : async (bookingId: string) =>  {
    try {
      const response = await axiosInstance.get(AGENT_BASE_URL + `get/${bookingId}`);
      if(!response.data){
        toast.error("Failed to fetch booking data");
        return;
      }
      set({currentBooking: response.data.booking});

    } catch (error) {
      console.error("Failed to fetch booking data:", error);
      toast.error("An error occurred while loading booking data");
    }
  },
  updateBookingStatus: async (bookingId: string, status: string) => {
    try {
      const response = await axiosInstance.patch(
        `${AGENT_BASE_URL}bookings/${bookingId}/status`,
        { status }
      );
      
      if (!response.data) {
        toast.error("Failed to update booking status");
        return;
      }

      // Update the current booking if it's the one being modified
      const currentBooking = get().currentBooking;
      if (currentBooking && currentBooking._id === bookingId) {
        set({ currentBooking: response.data.booking });
      }

      // Refresh dashboard data to update lists
      await get().fetchDashboardData();
      
      toast.success(`Booking status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update booking status:", error);
      toast.error("An error occurred while updating booking status");
    }
  },

  addExtraTask: async (bookingId: string, task: { description: string; extraPrice: string }) => {
    try {
      const response = await axiosInstance.post(
        `${AGENT_BASE_URL}bookings/${bookingId}/extra-tasks`,
        task
      );
      
      if (!response.data) {
        toast.error("Failed to add extra task");
        return;
      }

      // Update current booking with new task
      set({ currentBooking: response.data.booking });
      toast.success("Extra task added successfully");
    } catch (error) {
      console.error("Failed to add extra task:", error);
      toast.error("An error occurred while adding extra task");
    }
  },

  updateExtraTask: async (bookingId: string, taskId: string, task: { description: string; extraPrice: string }) => {
    try {
      const response = await axiosInstance.patch(
        `${AGENT_BASE_URL}bookings/${bookingId}/extra-tasks/${taskId}`,
        task
      );
      
      if (!response.data) {
        toast.error("Failed to update extra task");
        return;
      }

      // Update current booking with modified task
      set({ currentBooking: response.data.booking });
      toast.success("Extra task updated successfully");
    } catch (error) {
      console.error("Failed to update extra task:", error);
      toast.error("An error occurred while updating extra task");
    }
  },

  deleteExtraTask: async (bookingId: string, taskId: string) => {
    try {
      const response = await axiosInstance.delete(
        `${AGENT_BASE_URL}bookings/${bookingId}/extra-tasks/${taskId}`
      );
      
      if (!response.data) {
        toast.error("Failed to delete extra task");
        return;
      }

      // Update current booking without deleted task
      set({ currentBooking: response.data.booking });
      toast.success("Extra task deleted successfully");
    } catch (error) {
      console.error("Failed to delete extra task:", error);
      toast.error("An error occurred while deleting extra task");
    }
  },
  markBookingAsPaid: async (bookingId: string) => {
    try {
      const response = await axiosInstance.post(
        `${AGENT_BASE_URL}booking/${bookingId}/pay`
      );
      
      if (!response.data) {
        toast.error("Failed to mark booking as paid");
        return;
      }

      // Update the current booking's payment status
      set({ currentBooking: response.data.booking });
      toast.success("Booking marked as paid successfully");
    } catch (error) {
      console.error("Failed to mark booking as paid:", error);
      toast.error("An error occurred while marking booking as paid");
    }
  },
}));
