import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customBikeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', // A bike icon
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const restaurantIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3170/3170733.png', // Store icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const homeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', // Home icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface LiveTrackingMapProps {
  progress: number; // 0 to 100
}

// Simulated route points (Restaurant to Home)
const routePoints: [number, number][] = [
  [12.9716, 77.5946], // Restaurant (Bangalore center)
  [12.9730, 77.5960],
  [12.9750, 77.5980],
  [12.9780, 77.6010],
  [12.9810, 77.6050],
  [12.9830, 77.6080], // Home
];

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 1 });
  }, [center, map]);
  return null;
};

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ progress }) => {
  const [driverPosition, setDriverPosition] = useState<[number, number]>(routePoints[0]);

  useEffect(() => {
    // Calculate driver position based on progress (50% to 100% is the actual driving part)
    // 0-50: At restaurant
    // 50-100: Moving to home
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

      const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress;
      const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress;

      setDriverPosition([lat, lng]);
    }
  }, [progress]);

  return (
    <MapContainer center={driverPosition} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      <Polyline positions={routePoints} color="#00bd6f" weight={4} opacity={0.7} dashArray="10, 10" />
      
      <Marker position={routePoints[0]} icon={restaurantIcon}>
        <Popup>Restaurant</Popup>
      </Marker>
      
      <Marker position={routePoints[routePoints.length - 1]} icon={homeIcon}>
        <Popup>Delivery Location</Popup>
      </Marker>

      {progress >= 50 && (
        <Marker position={driverPosition} icon={customBikeIcon}>
          <Popup>Driver is here</Popup>
        </Marker>
      )}

      <MapUpdater center={driverPosition} />
    </MapContainer>
  );
};
