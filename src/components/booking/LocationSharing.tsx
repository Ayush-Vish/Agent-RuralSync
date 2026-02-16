import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocationStore } from '@/stores/location.store';
import {
  Navigation,
  NavigationOff,
  MapPin,
  Wifi,
  WifiOff,
  Radio,
  Clock,
  Gauge
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const pulseIcon = L.divIcon({
  className: 'custom-pulse-marker',
  html: `
    <div style="position: relative; width: 20px; height: 20px;">
      <div style="
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 16px; height: 16px; border-radius: 50%;
        background: #3b82f6; border: 3px solid white;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
      "></div>
      <div style="
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(59, 130, 246, 0.2);
        animation: pulse 2s ease-in-out infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; } 50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; } }
    </style>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

interface LocationSharingProps {
  bookingId: string;
  bookingAddress?: string;
  compact?: boolean;
}

export default function LocationSharing({ bookingId, bookingAddress, compact = false }: LocationSharingProps) {
  const { isSharing, currentBookingId, lastPosition, startSharing, stopSharing } = useLocationStore();
  const [mountedMap, setMountedMap] = useState(false);

  const isActive = isSharing && currentBookingId === bookingId;

  useEffect(() => {
    setMountedMap(true);
  }, []);

  const handleToggle = () => {
    if (isActive) {
      stopSharing(bookingId);
    } else {
      startSharing(bookingId);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant={isActive ? 'destructive' : 'default'}
          size="sm"
          onClick={handleToggle}
          className="gap-1.5"
        >
          {isActive ? (
            <>
              <NavigationOff className="h-3.5 w-3.5" />
              Stop Sharing
            </>
          ) : (
            <>
              <Navigation className="h-3.5 w-3.5" />
              Share Location
            </>
          )}
        </Button>
        {isActive && (
          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50/50 animate-pulse">
            <Radio className="h-2.5 w-2.5 mr-1" />
            Broadcasting
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="h-4 w-4 text-primary" />
              Live Location
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {bookingAddress || 'Share your live location with the customer'}
            </CardDescription>
          </div>
          {isActive && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-600">Live</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Mini Map */}
        {isActive && lastPosition && mountedMap && (
          <div className="h-[180px] rounded-lg overflow-hidden border">
            <MapContainer
              center={[lastPosition.latitude, lastPosition.longitude]}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[lastPosition.latitude, lastPosition.longitude]}
                icon={pulseIcon}
              >
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Location Info */}
        {isActive && lastPosition && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground p-2 rounded-md bg-muted/50">
              <MapPin className="h-3 w-3" />
              <span>{lastPosition.latitude.toFixed(5)}, {lastPosition.longitude.toFixed(5)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground p-2 rounded-md bg-muted/50">
              <Wifi className="h-3 w-3 text-emerald-500" />
              <span>Connected</span>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <Button
          variant={isActive ? 'destructive' : 'default'}
          onClick={handleToggle}
          className="w-full gap-2"
          size="sm"
        >
          {isActive ? (
            <>
              <NavigationOff className="h-4 w-4" />
              Stop Sharing Location
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              Start Sharing Location
            </>
          )}
        </Button>

        {!isActive && (
          <p className="text-[11px] text-center text-muted-foreground">
            Your location will be shared with the customer and service provider for this booking.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
