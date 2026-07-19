import React, { useEffect, useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { GoogleMap, useJsApiLoader, PolylineF } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';

interface LiveTrackingMapProps {
  progress: number; // 0 to 100
  restaurantCoordinates?: { lat: number; lng: number } | null;
  deliveryCoordinates?: { lat: number; lng: number } | null;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px'
};

// Fallback Bengaluru coordinates (Restaurant to Home)
const defaultRoutePoints = [
  { lat: 12.9716, lng: 77.5946 }, // Restaurant
  { lat: 12.9730, lng: 77.5960 },
  { lat: 12.9750, lng: 77.5980 },
  { lat: 12.9780, lng: 77.6010 },
  { lat: 12.9810, lng: 77.6050 },
  { lat: 12.9830, lng: 77.6080 }, // Home
];

// Premium silver/light map design style config without 'styles' property (styles are cloud-managed when mapId is present)
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  gestureHandling: "cooperative",
  mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
};

// Define libraries as a completely stable static array outside the component to prevent reload warnings
const MAP_LIBRARIES: ("marker" | "places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places", "marker", "geometry"];

// Custom React component wrapping Google Maps AdvancedMarkerElement
interface AdvancedMarkerProps {
  map: google.maps.Map | null;
  position: { lat: number; lng: number };
  title?: string;
  children: React.ReactNode;
}

const AdvancedMarker: React.FC<AdvancedMarkerProps> = ({ map, position, title, children }) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    if (!map) return;

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      title,
      content: container
    });
    markerRef.current = marker;

    return () => {
      marker.map = null;
    };
  }, [map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = position;
    }
  }, [position]);

  return ReactDOM.createPortal(children, container);
};

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ progress, restaurantCoordinates, deliveryCoordinates }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: MAP_LIBRARIES
  });

  const [routePoints, setRoutePoints] = useState<{ lat: number; lng: number }[]>(defaultRoutePoints);
  const [driverPosition, setDriverPosition] = useState(defaultRoutePoints[0]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Set initial map center to avoid re-centering trigger during state changes
  const initialCenter = useMemo(() => {
    if (restaurantCoordinates?.lat && restaurantCoordinates?.lng) {
      return restaurantCoordinates;
    }
    return defaultRoutePoints[0];
  }, [restaurantCoordinates?.lat, restaurantCoordinates?.lng]);

  // Dynamic route calculation
  useEffect(() => {
    if (!isLoaded) return;

    let active = true;

    if (restaurantCoordinates?.lat && restaurantCoordinates?.lng && deliveryCoordinates?.lat && deliveryCoordinates?.lng) {
      (async () => {
        try {
          const { Route } = await window.google.maps.importLibrary("routes") as any;
          const request = {
            origin: {
              location: new window.google.maps.LatLng(restaurantCoordinates.lat, restaurantCoordinates.lng)
            },
            destination: {
              location: new window.google.maps.LatLng(deliveryCoordinates.lat, deliveryCoordinates.lng)
            },
            travelMode: "DRIVING",
            fields: ["path"],
          };

          const response = await Route.computeRoutes(request);
          if (!active) return;

          if (response && response.routes && response.routes[0]?.path) {
            const path = response.routes[0].path.map((point: any) => {
              const lat = typeof point.lat === 'function' ? point.lat() : (point.lat !== undefined ? point.lat : point.latitude);
              const lng = typeof point.lng === 'function' ? point.lng() : (point.lng !== undefined ? point.lng : point.longitude);
              return { lat, lng };
            });
            setRoutePoints(path);
          } else {
            console.error("No path found in computeRoutes response", response);
            setRoutePoints(defaultRoutePoints);
          }
        } catch (error) {
          if (!active) return;
          console.error("computeRoutes failed:", error);
          setRoutePoints(defaultRoutePoints);
        }
      })();
    } else {
      setRoutePoints(defaultRoutePoints);
    }

    return () => {
      active = false;
    };
  }, [isLoaded, restaurantCoordinates?.lat, restaurantCoordinates?.lng, deliveryCoordinates?.lat, deliveryCoordinates?.lng]);

  // Update driver position along routePoints
  useEffect(() => {
    if (routePoints.length === 0) return;

    if (progress <= 50) {
      setDriverPosition(routePoints[0]);
    } else {
      const driveProgress = (progress - 50) / 50; // 0 to 1
      const totalSegments = routePoints.length - 1;
      const currentSegmentFloat = driveProgress * totalSegments;
      const currentSegmentIndex = Math.min(Math.floor(currentSegmentFloat), totalSegments - 1);
      const segmentProgress = currentSegmentFloat - currentSegmentIndex;

      const startPoint = routePoints[currentSegmentIndex];
      const endPoint = routePoints[currentSegmentIndex + 1];

      const lat = startPoint.lat + (endPoint.lat - startPoint.lat) * segmentProgress;
      const lng = startPoint.lng + (endPoint.lng - startPoint.lng) * segmentProgress;

      setDriverPosition({ lat, lng });
    }
  }, [progress, routePoints]);

  // Pan the map to follow the driver smoothly using direct imperative call
  useEffect(() => {
    if (mapRef.current && driverPosition) {
      mapRef.current.panTo(driverPosition);
    }
  }, [driverPosition]);

  // Fit bounds dynamically as soon as map and coordinates are both loaded
  useEffect(() => {
    if (mapInstance && restaurantCoordinates?.lat && deliveryCoordinates?.lat) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(restaurantCoordinates);
      bounds.extend(deliveryCoordinates);
      mapInstance.fitBounds(bounds);
    }
  }, [mapInstance, restaurantCoordinates?.lat, restaurantCoordinates?.lng, deliveryCoordinates?.lat, deliveryCoordinates?.lng]);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapInstance(map);
  };

  const onUnmount = () => {
    mapRef.current = null;
    setMapInstance(null);
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-100">
        <Loader2 className="w-8 h-8 text-[#00bd6f] animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={initialCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={MAP_OPTIONS}
    >
      {/* Route Line */}
      {routePoints.length > 0 && (
        <PolylineF
          path={routePoints}
          options={{
            strokeColor: '#00bd6f',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            icons: [{
              icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
              offset: '0',
              repeat: '20px'
            }]
          }}
        />
      )}

      {/* Restaurant Marker (Premium Advanced storefront marker) */}
      {routePoints.length > 0 && (
        <AdvancedMarker
          map={mapInstance}
          position={routePoints[0]}
          title="Restaurant"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-slate-100 p-1.5 transform -translate-x-1/2 -translate-y-1/2">
            <img src="https://cdn-icons-png.flaticon.com/512/3448/3448624.png" alt="Restaurant" className="w-full h-full object-contain" />
          </div>
        </AdvancedMarker>
      )}

      {/* Home Marker (Premium Advanced 3D house location pin) */}
      {routePoints.length > 0 && (
        <AdvancedMarker
          map={mapInstance}
          position={routePoints[routePoints.length - 1]}
          title="Delivery Address"
        >
          <div className="w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-slate-100 p-1.5 transform -translate-x-1/2 -translate-y-1/2">
            <img src="https://cdn-icons-png.flaticon.com/512/10443/10443196.png" alt="Home" className="w-full h-full object-contain" />
          </div>
        </AdvancedMarker>
      )}

      {/* Driver Marker (Premium Advanced emerald delivery boy scooter icon) */}
      {progress >= 50 && (
        <AdvancedMarker
          map={mapInstance}
          position={driverPosition}
          title="Delivery Partner"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 rounded-full shadow-[0_4px_12px_rgba(0,189,111,0.25)] border-2 border-[#00bd6f] p-1.5 transform -translate-x-1/2 -translate-y-1/2">
            <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" alt="Driver" className="w-full h-full object-contain" />
          </div>
        </AdvancedMarker>
      )}
    </GoogleMap>
  );
};
