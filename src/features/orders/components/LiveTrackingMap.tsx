import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';

interface LiveTrackingMapProps {
  progress: number;
  orderStatus?: string;
  driverCoordinates?: { lat: number; lng: number } | null;
  restaurantCoordinates?: { lat: number; lng: number } | null;
  deliveryCoordinates?: { lat: number; lng: number } | null;
}

const containerStyle = { width: '100%', height: '100%', borderRadius: '16px' };

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  gestureHandling: 'greedy',
  clickableIcons: false,
  draggable: true,
  scrollwheel: true,
  mapId: 'DEMO_MAP_ID',
};

const MAP_LIBRARIES: ("marker" | "routes")[] = ['marker', 'routes'];

// ── Pin-style markers (tip of the pin anchors the exact location) ────────────
// AdvancedMarkerElement anchors custom HTML content at its bottom-center by
// default, so the pin's pointed tip (the bottom of this markup) sits precisely
// on the coordinate — like Uber Eats / Swiggy / Zomato. No CSS transform is
// applied: translating here would double-shift the pin off its lat/lng.
const pinMarkerHtml = (color: string, size: number, iconSvg: string) => `
  <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 8px 12px rgba(0,0,0,0.3));">
    <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #ffffff;box-shadow:0 4px 14px rgba(0,0,0,0.18);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">
      ${iconSvg}
    </div>
    <div style="width:0;height:0;border-left:${Math.round(size * 0.32)}px solid transparent;border-right:${Math.round(size * 0.32)}px solid transparent;border-top:${Math.round(size * 0.4)}px solid ${color};margin-top:-3px;"></div>
  </div>`;

const RESTAURANT_ICON = pinMarkerHtml(
  '#3b82f6',
  44,
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
      <path d="M2 7h20"/>
    </svg>`
);

const HOME_ICON = pinMarkerHtml(
  '#ef4444',
  44,
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`
);

const DRIVER_ICON = pinMarkerHtml(
  '#10b981',
  48,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <path d="M9 17h6"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>`
);

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
  driverCoordinates,
  restaurantCoordinates,
  deliveryCoordinates,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'live-tracking-map-script',
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: MAP_LIBRARIES,
  });

  const restLat = restaurantCoordinates?.lat ?? null;
  const restLng = restaurantCoordinates?.lng ?? null;
  const delivLat = deliveryCoordinates?.lat ?? null;
  const delivLng = deliveryCoordinates?.lng ?? null;
  const drvLat = driverCoordinates?.lat ?? null;
  const drvLng = driverCoordinates?.lng ?? null;

  const restPt = useMemo<google.maps.LatLngLiteral | null>(
    () => (restLat !== null && restLng !== null ? { lat: Number(restLat), lng: Number(restLng) } : null),
    [restLat, restLng]
  );
  const delivPt = useMemo<google.maps.LatLngLiteral | null>(
    () => (delivLat !== null && delivLng !== null ? { lat: Number(delivLat), lng: Number(delivLng) } : null),
    [delivLat, delivLng]
  );
  const drvPt = useMemo<google.maps.LatLngLiteral | null>(
    () => (drvLat !== null && drvLng !== null ? { lat: Number(drvLat), lng: Number(drvLng) } : null),
    [drvLat, drvLng]
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const restMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const homeMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const driverMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const currentStageRef = useRef<string>('');
  
  // Animation ref for smooth driver gliding
  const driverCurrentPosRef = useRef<google.maps.LatLngLiteral | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Tracks whether bounds have been fitted with the driver marker in view
  const fittedWithDriverRef = useRef(false);

  // ── Calculate real road route using Routes API or DirectionsService ────────
  const drawDirectionsRoute = useCallback(async (map: google.maps.Map, origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral, extraPoints: google.maps.LatLngLiteral[] = []) => {
    const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);
    const destLatLng = new window.google.maps.LatLng(destination.lat, destination.lng);

    // 1. Primary: Modern Routes API (Route.computeRoutes with fields mask)
    try {
      if (window.google?.maps?.importLibrary) {
        const routesLibrary = (await window.google.maps.importLibrary("routes")) as unknown as {
          Route?: {
            computeRoutes?: (request: Record<string, unknown>) => Promise<{
              routes?: Array<{
                createPolylines?: () => Array<{ getPath?: () => { getArray?: () => google.maps.LatLng[] } }>;
                polyline?: { encodedPolyline?: string };
              }>;
            }>;
          };
        };
        const { Route } = routesLibrary;
        if (Route?.computeRoutes) {
          const response = await Route.computeRoutes({
            origin: originLatLng,
            destination: destLatLng,
            travelMode: window.google.maps.TravelMode.DRIVING,
            fields: ['*'],
          });

          if (response?.routes?.[0]) {
            const route = response.routes[0];
            let path: google.maps.LatLng[] | null = null;

            if (typeof route.createPolylines === 'function') {
              const polylines = route.createPolylines();
              const pathArray = polylines?.[0]?.getPath?.()?.getArray?.();
              if (pathArray) {
                path = pathArray;
              }
            }

            if (!path && route.polyline?.encodedPolyline) {
              const geometryLibrary = (await window.google.maps?.importLibrary?.("geometry")) as unknown as { encoding?: { decodePath?: (polyline: string) => google.maps.LatLng[] } } | undefined;
              path = geometryLibrary?.encoding?.decodePath?.(route.polyline.encodedPolyline) ?? null;
            }

            if (path && path.length > 0) {
              polylineRef.current?.setMap(null);
              polylineRef.current = new window.google.maps.Polyline({
                path,
                map,
                strokeColor: '#00bd6f',
                strokeOpacity: 0.9,
                strokeWeight: 5,
                zIndex: 1,
              });

              const bounds = new window.google.maps.LatLngBounds();
              path.forEach((p: google.maps.LatLng) => bounds.extend(p));
              extraPoints.forEach((p) => bounds.extend(p));
              // Extra top padding so tall pin markers don't clip at the map edge
              map.fitBounds(bounds, { top: 80, right: 60, bottom: 60, left: 60 });
              return;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Routes API computeRoutes failed, attempting DirectionsService:', e);
    }

    // 2. Fallback: Classic DirectionsService (Guaranteed real road routing)
    try {
      if (window.google?.maps?.DirectionsService) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: originLatLng,
            destination: destLatLng,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK && result?.routes?.[0]?.overview_path) {
              const path = result.routes[0].overview_path;
              polylineRef.current?.setMap(null);
              polylineRef.current = new window.google.maps.Polyline({
                path,
                map,
                strokeColor: '#00bd6f',
                strokeOpacity: 0.9,
                strokeWeight: 5,
                zIndex: 1,
              });

              const bounds = new window.google.maps.LatLngBounds();
              path.forEach((p: google.maps.LatLng) => bounds.extend(p));
              extraPoints.forEach((p) => bounds.extend(p));
              // Extra top padding so tall pin markers don't clip at the map edge
              map.fitBounds(bounds, { top: 80, right: 60, bottom: 60, left: 60 });
            }
          }
        );
      }
    } catch (e) {
      console.error('DirectionsService route request failed:', e);
    }
  }, []);

  // ── Manage Static Endpoints & Always-Focused Route ─────────────────────────
  const updateMapStage = useCallback(() => {
    const map = mapRef.current;
    if (!map || !restPt) return;

    // 1. Static Markers
    if (!restMarkerRef.current) {
      restMarkerRef.current = makeAdvancedMarker(map, restPt, RESTAURANT_ICON, 'Restaurant');
    }

    if (delivPt && !homeMarkerRef.current) {
      homeMarkerRef.current = makeAdvancedMarker(map, delivPt, HOME_ICON, 'Delivery Address');
    }

    // 2. Always draw the real road route between the restaurant and the customer
    //    so the line visibly connects the two pins.
    if (delivPt && currentStageRef.current !== 'REST_TO_HOME') {
      currentStageRef.current = 'REST_TO_HOME';
      drawDirectionsRoute(map, restPt, delivPt, drvPt ? [drvPt] : []);
    }
  }, [restPt, delivPt, drvPt, drawDirectionsRoute]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    updateMapStage();
  }, [updateMapStage]);

  useEffect(() => {
    updateMapStage();
  }, [updateMapStage]);

  // ── Smooth Driver Marker Movement via requestAnimationFrame ───────────────
  const animateDriverMarker = useCallback((targetPos: google.maps.LatLngLiteral) => {
    const map = mapRef.current;
    if (!map) return;

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = makeAdvancedMarker(map, targetPos, DRIVER_ICON, 'Delivery Partner');
      driverCurrentPosRef.current = targetPos;
      return;
    }

    const startPos = driverCurrentPosRef.current || targetPos;
    const startTime = performance.now();
    const duration = 1000; // Smooth 1-second gliding transition

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);

      // Linear interpolation
      const currentLat = startPos.lat + (targetPos.lat - startPos.lat) * t;
      const currentLng = startPos.lng + (targetPos.lng - startPos.lng) * t;
      const interpolatedPos = { lat: currentLat, lng: currentLng };

      if (driverMarkerRef.current) {
        driverMarkerRef.current.position = interpolatedPos;
      }
      driverCurrentPosRef.current = interpolatedPos;

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (drvPt) {
      animateDriverMarker(drvPt);
    }
  }, [drvPt, animateDriverMarker]);

  // Driver coordinates usually stream in via SSE after the map first loads, so
  // once they arrive, re-fit the view once to keep driver + both pins + route
  // visible without re-zooming on every position update.
  useEffect(() => {
    if (!drvPt || fittedWithDriverRef.current) return;
    const map = mapRef.current;
    if (!map) return;
    const points = [restPt, delivPt, drvPt].filter(Boolean) as google.maps.LatLngLiteral[];
    if (points.length < 2) return;
    const bounds = new window.google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, { top: 80, right: 60, bottom: 60, left: 60 });
    fittedWithDriverRef.current = true;
  }, [drvPt, restPt, delivPt]);

  const onMapUnmount = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    removeMarker(restMarkerRef.current);
    removeMarker(homeMarkerRef.current);
    removeMarker(driverMarkerRef.current);
    polylineRef.current?.setMap(null);
    restMarkerRef.current = null;
    homeMarkerRef.current = null;
    driverMarkerRef.current = null;
    polylineRef.current = null;
    mapRef.current = null;
    currentStageRef.current = '';
    driverCurrentPosRef.current = null;
    fittedWithDriverRef.current = false;
  }, []);

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
