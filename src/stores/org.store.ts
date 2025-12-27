import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { AGENT_BASE_URL } from "@/constants";

// Organization types
export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type BusinessHour = { start: string; end: string } | "Closed";

export type SocialMedia = Partial<{
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}>;

export interface OrganizationAPI {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  description: string;
  website?: string;
  logo?: string;
  images?: string[];
  socialMedia?: SocialMedia;
  categories?: string[];
  businessHours?: Record<Day, BusinessHour>;
  location?: {
    coordinates: [longitude: number, latitude: number];
  };
  isVerified: boolean;
  agentCount: number;
  serviceCount: number;
  clients: number;
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface OrgState {
  orgDetails: OrganizationAPI | null;
  isLoading: boolean;
  setOrgDetails: (details: OrganizationAPI) => void;
  getOrgDetails: () => Promise<boolean>;
}

export const useOrgStore = create<OrgState>((set) => ({
  orgDetails: null,
  isLoading: false,

  setOrgDetails: (details) => set({ orgDetails: details }),

  getOrgDetails: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`${AGENT_BASE_URL}org-detail`);
      const data = res.data;

      set({ orgDetails: data.data, isLoading: false });
      return true;
    } catch (error) {
      console.error("Error fetching organization details:", error);
      toast.error("Failed to fetch organization details");
      set({ isLoading: false, orgDetails: null });
      return false;
    }
  },
}));
