/* eslint-disable @typescript-eslint/no-explicit-any */
import { AGENT_BASE_URL } from "@/constants";
import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import type { 
  Booking, 
  BookingDetails
} from "@/types/service";

// Re-export types for backward compatibility
export type { Booking, BookingDetails };

interface DashboardState {
  totalBookings: number;
  pendingBookings: Booking[];
  inProgressBookings: Booking[];
  completedBookings: Booking[];
  currentBooking: BookingDetails | null;
  isLoading: boolean;
  isBookingLoading: boolean;
  error: string | null;
  fetchBooking: (bookingId: string) => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  updateBookingStatus: (bookingId: string, status: string) => Promise<void>;
  addExtraTask: (bookingId: string, task: { description: string; extraPrice: string }) => Promise<void>;
  updateExtraTask: (bookingId: string, taskId: string, task: { description: string; extraPrice: string }) => Promise<void>;
  deleteExtraTask: (bookingId: string, taskId: string) => Promise<void>;
  markBookingAsPaid: (bookingId: string, method: string) => Promise<void>;
}
export const useDashboardStore = create<DashboardState>((set, get) => ({
  totalBookings: 0,
  pendingBookings: [],
  inProgressBookings: [],
  completedBookings: [],
  currentBooking: null,
  isLoading: false,
  isBookingLoading: false,
  error: null,

  fetchDashboardData: async () => {
  try {
    set({ isLoading: true, error: null });
    const response = await axiosInstance.get(AGENT_BASE_URL + "dashboard");
    const data = await response.data;
    // Accessing the nested 'data' from our standard API response
    console.log(data);
    set({isLoading: false });
    const { stats, bookings } = data.data;

    set({
      totalBookings: stats.total,
      pendingBookings: bookings.pending,       // Array
      inProgressBookings: bookings.inProgress, // Array
      completedBookings: bookings.completed,   // Array
      isLoading: false,
    });
  } catch (error: any) {
    set({ isLoading: false, error: error?.message || "Failed to fetch dashboard data" });
    toast.error("Failed to fetch dashboard data");
  }
},
  fetchBooking : async (bookingId: string) =>  {
    try {
      set({ isBookingLoading: true, error: null });
      const response = await axiosInstance.get(AGENT_BASE_URL + `get/${bookingId}`);
      if(!response.data){
        set({ isBookingLoading: false, error: "Failed to fetch booking data" });
        toast.error("Failed to fetch booking data");
        return;
      }
      console.log("Fetched booking data:", response.data.booking);
      set({ currentBooking: response.data.booking, isBookingLoading: false, error: null });

    } catch (error) {
      console.error("Failed to fetch booking data:", error);
      set({ isBookingLoading: false, error: "An error occurred while loading booking data" });
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
  markBookingAsPaid: async (bookingId: string, method: string = "CASH") => {
    try {
        const response = await axiosInstance.post(`${AGENT_BASE_URL}booking/${bookingId}/pay`, { method });
        set({ currentBooking: response.data.booking });
        toast.success(`Payment recorded via ${method}`);
        await get().fetchDashboardData();
    } catch (error) {
        toast.error("Failed to record payment");
    }
}
}));
