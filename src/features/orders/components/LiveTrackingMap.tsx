import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';

interface LiveTrackingMapProps {
  progress: number;
  restaurantCoordinates?: { lat: number; lng: number } | null;
  deliveryCoordinates?: { lat: number; lng: number } | null;
}

const containerStyle = { width: '100%', height: '100%', borderRadius: '16px' };

// mapId is required for AdvancedMarkerElement
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: 'cooperative',
  clickableIcons: false,
  mapId: 'DEMO_MAP_ID',
};

// Stable outside component — never changes reference
const MAP_LIBRARIES: any = ['marker', 'routes'];

// HTML strings for markers
const RESTAURANT_ICON = `
  <div style="width:44px;height:44px;background:white;border-radius:50%;
    box-shadow:0 4px 14px rgba(0,0,0,0.25);display:flex;align-items:center;
    justify-content:center;border:2px solid #e2e8f0;transform:translate(-50%,-50%)">
    <img src="https://cdn-icons-png.flaticon.com/512/3448/3448624.png"
      style="width:26px;height:26px;object-fit:contain"/>
  </div>`;

const HOME_ICON = `
  <div style="width:44px;height:44px;background:white;border-radius:50%;
    box-shadow:0 4px 14px rgba(0,0,0,0.25);display:flex;align-items:center;
    justify-content:center;border:2px solid #e2e8f0;transform:translate(-50%,-50%)">
    <img src="https://cdn-icons-png.flaticon.com/512/10443/10443196.png"
      style="width:26px;height:26px;object-fit:contain"/>
  </div>`;

const DRIVER_ICON = `
  <div style="width:48px;height:48px;background:#ecfdf5;border-radius:50%;
    box-shadow:0 4px 14px rgba(0,189,111,0.35);display:flex;align-items:center;
    justify-content:center;border:2.5px solid #00bd6f;transform:translate(-50%,-50%)">
    <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
      style="width:28px;height:28px;object-fit:contain"/>
  </div>`;

function makeAdvancedMarker(
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  html: string,
  title: string
): google.maps.marker.AdvancedMarkerElement {
  const el = document.createElement('div');
  el.innerHTML = html;
  return new window.google.maps.marker.AdvancedMarkerElement({
    map,
    position,
    title,
    content: el,
  });
}

function removeMarker(marker: google.maps.marker.AdvancedMarkerElement | null) {
  if (marker) marker.map = null;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  progress,
  restaurantCoordinates,
  deliveryCoordinates,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: MAP_LIBRARIES,
  });

  // Memoize as primitives so downstream effects only fire when values actually change
  const restLat = restaurantCoordinates?.lat ?? null;
  const restLng = restaurantCoordinates?.lng ?? null;
  const delivLat = deliveryCoordinates?.lat ?? null;
  const delivLng = deliveryCoordinates?.lng ?? null;

  const restPt = useMemo<google.maps.LatLngLiteral | null>(
    () => (restLat !== null && restLng !== null ? { lat: Number(restLat), lng: Number(restLng) } : null),
    [restLat, restLng]
  );
  const delivPt = useMemo<google.maps.LatLngLiteral | null>(
    () => (delivLat !== null && delivLng !== null ? { lat: Number(delivLat), lng: Number(delivLng) } : null),
    [delivLat, delivLng]
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const restMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const homeMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const driverMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const routePointsRef = useRef<google.maps.LatLngLiteral[]>([]);
  const initializedRef = useRef(false); // guard against double-init

  // ── Draw route between real coordinates ──────────────────────────────────
  const drawRoute = useCallback(async (map: google.maps.Map, from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral) => {
    // Cleanup previous polyline
    polylineRef.current?.setMap(null);
    polylineRef.current = null;

    const drawPolyline = (points: google.maps.LatLngLiteral[]) => {
      routePointsRef.current = points;
      polylineRef.current = new window.google.maps.Polyline({
        path: points,
        map,
        strokeColor: '#00bd6f',
        strokeOpacity: 0.95,
        strokeWeight: 5,
        zIndex: 1,
      });
    };

    try {
      // Use modern Routes API
      const { Route } = await window.google.maps.importLibrary('routes') as any;
      const result = await Route.computeRoutes({
        origin: { location: { latLng: { latitude: from.lat, longitude: from.lng } } },
        destination: { location: { latLng: { latitude: to.lat, longitude: to.lng } } },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        languageCode: 'en-US',
      }, {
        otherArgs: {
          headers: { 'X-Goog-FieldMask': 'routes.polyline.encodedPolyline' }
        }
      });

      if (result?.routes?.[0]?.polyline?.encodedPolyline) {
        const { encoding } = await window.google.maps.importLibrary('geometry') as any;
        const path = encoding.decodePath(result.routes[0].polyline.encodedPolyline)
          .map((p: google.maps.LatLng) => ({ lat: p.lat(), lng: p.lng() }));
        drawPolyline(path);
        return;
      }
    } catch (_) {
      // Routes API failed or not enabled — fall through to straight-line
    }

    // Straight-line interpolation between real points (no static fallback)
    const steps = 20;
    const pts: google.maps.LatLngLiteral[] = [];
    for (let i = 0; i <= steps; i++) {
      pts.push({
        lat: from.lat + (to.lat - from.lat) * (i / steps),
        lng: from.lng + (to.lng - from.lng) * (i / steps),
      });
    }
    drawPolyline(pts);
  }, []);

  // ── Initialize map: place markers + route once ────────────────────────────
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    if (initializedRef.current) return; // prevent double-init
    initializedRef.current = true;

    if (!restPt) return;

    // Place restaurant marker
    restMarkerRef.current = makeAdvancedMarker(map, restPt, RESTAURANT_ICON, 'Restaurant');

    if (delivPt) {
      // Place home marker
      homeMarkerRef.current = makeAdvancedMarker(map, delivPt, HOME_ICON, 'Delivery Address');

      // Fit both points into view
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(restPt);
      bounds.extend(delivPt);
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });

      // Draw route
      drawRoute(map, restPt, delivPt);
    } else {
      map.setCenter(restPt);
      map.setZoom(15);
    }
  }, [restPt, delivPt, drawRoute]);

  const onMapUnmount = useCallback(() => {
    // Clean up all markers and polyline imperatively
    removeMarker(restMarkerRef.current);
    removeMarker(homeMarkerRef.current);
    removeMarker(driverMarkerRef.current);
    polylineRef.current?.setMap(null);
    restMarkerRef.current = null;
    homeMarkerRef.current = null;
    driverMarkerRef.current = null;
    polylineRef.current = null;
    routePointsRef.current = [];
    mapRef.current = null;
    initializedRef.current = false;
  }, []);

  // ── Update driver position when progress changes ──────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const pts = routePointsRef.current;
    if (!map || pts.length < 2 || progress < 50) {
      removeMarker(driverMarkerRef.current);
      driverMarkerRef.current = null;
      return;
    }

    const ratio = (progress - 50) / 50;
    const totalSeg = pts.length - 1;
    const segFloat = ratio * totalSeg;
    const segIdx = Math.min(Math.floor(segFloat), totalSeg - 1);
    const segProg = segFloat - segIdx;
    const s = pts[segIdx], e = pts[segIdx + 1];
    const driverPos = {
      lat: s.lat + (e.lat - s.lat) * segProg,
      lng: s.lng + (e.lng - s.lng) * segProg,
    };

    if (driverMarkerRef.current) {
      driverMarkerRef.current.position = driverPos;
    } else {
      driverMarkerRef.current = makeAdvancedMarker(map, driverPos, DRIVER_ICON, 'Delivery Partner');
    }
  }, [progress]);

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center rounded-2xl gap-2">
        <MapPin className="w-8 h-8 text-red-400" />
        <p className="text-sm text-slate-500">Map failed to load</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-100">
        <Loader2 className="w-8 h-8 text-[#00bd6f] animate-spin" />
      </div>
    );
  }

  if (!restPt) {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center rounded-2xl gap-2 border border-slate-100">
        <MapPin className="w-8 h-8 text-slate-300" />
        <p className="text-sm text-slate-400 text-center px-4">Location data unavailable</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={restPt}
      zoom={14}
      onLoad={onMapLoad}
      onUnmount={onMapUnmount}
      options={MAP_OPTIONS}
    />
  );
};
