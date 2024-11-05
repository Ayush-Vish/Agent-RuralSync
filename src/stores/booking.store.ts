/* eslint-disable @typescript-eslint/no-explicit-any */
import { AGENT_BASE_URL } from "@/constants";
import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface Booking {
  _id: string;
  client: string;
  serviceProvider: string;
  service: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  paymentStatus: string;
  location: {
    type: string;
    coordinates: number[];
    _id: string;
  };
  extraTasks: any[];
  createdAt: string;
  updatedAt: string;
  agent: string;
}

interface DashboardState {
  totalBookings: number;
  pendingBookings: Booking[];
  inProgressBookings: Booking[];
  completedBookings: Booking[];
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  totalBookings: 0,
  pendingBookings: [],
  inProgressBookings: [],
  completedBookings: [],

  fetchDashboardData: async () => {
    try {
      console.log("fkksjnkmsnd");

      const response = await axiosInstance.get(AGENT_BASE_URL , {
        withCredentials: true, // Include credentials for cookies
      });
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
}));
