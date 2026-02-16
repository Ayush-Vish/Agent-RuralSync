import { create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { AGENT_BASE_URL } from '@/constants';

interface LocationSession {
  _id: string;
  booking: {
    _id: string;
    address: string;
    bookingDate: string;
    bookingTime: string;
    status: string;
  };
  isActive: boolean;
  lastUpdated: string;
}

interface LocationState {
  isSharing: boolean;
  currentBookingId: string | null;
  watchId: number | null;
  lastPosition: { latitude: number; longitude: number } | null;
  activeSessions: LocationSession[];
  error: string | null;

  startSharing: (bookingId: string) => void;
  stopSharing: (bookingId: string) => Promise<void>;
  sendLocation: (bookingId: string, position: GeolocationPosition) => Promise<void>;
  fetchActiveSessions: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  isSharing: false,
  currentBookingId: null,
  watchId: null,
  lastPosition: null,
  activeSessions: [],
  error: null,

  startSharing: (bookingId: string) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    // Clear any existing watch
    const existingWatchId = get().watchId;
    if (existingWatchId !== null) {
      navigator.geolocation.clearWatch(existingWatchId);
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        set({
          lastPosition: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
        await get().sendLocation(bookingId, position);
      },
      (error) => {
        console.error('Geolocation error:', error);
        set({ error: error.message });
        toast.error('Failed to get location: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000,
      }
    );

    set({
      isSharing: true,
      currentBookingId: bookingId,
      watchId,
      error: null,
    });

    toast.success('Location sharing started');
  },

  stopSharing: async (bookingId: string) => {
    const { watchId } = get();
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    try {
      await axiosInstance.post(`${AGENT_BASE_URL}bookings/${bookingId}/location/stop`);
      set({
        isSharing: false,
        currentBookingId: null,
        watchId: null,
        lastPosition: null,
      });
      toast.success('Location sharing stopped');
    } catch (error) {
      console.error('Failed to stop sharing:', error);
      toast.error('Failed to stop location sharing');
    }
  },

  sendLocation: async (bookingId: string, position: GeolocationPosition) => {
    try {
      await axiosInstance.post(`${AGENT_BASE_URL}bookings/${bookingId}/location`, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed ? position.coords.speed * 3.6 : undefined, // Convert m/s to km/h
        accuracy: position.coords.accuracy,
      });
    } catch (error) {
      console.error('Failed to send location:', error);
    }
  },

  fetchActiveSessions: async () => {
    try {
      const res = await axiosInstance.get(`${AGENT_BASE_URL}location/sessions`);
      set({ activeSessions: res.data.data || [] });
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  },
}));
