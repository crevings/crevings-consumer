import React, { useRef } from "react";
import { Loader2 } from "lucide-react";
import { GoogleMap } from "@react-google-maps/api";

/** Classic Google-Maps style teardrop pin (brand green body + white centre dot) */
export const DropPin = ({ className = "w-11 h-[52px]" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 2C8.13 2 5 5.13 5 8.5c0 5.25 7 13.5 7 13.5s7-8.25 7-13.5C19 5.13 15.87 2 12 2z"
      fill="#00bd6f"
      stroke="#ffffff"
      strokeWidth="1.4"
    />
    <circle cx="12" cy="8.6" r="3" fill="#ffffff" />
  </svg>
);

interface LocationMapCanvasProps {
  center: { lat: number; lng: number };
  isMoving: boolean;
  isLocating: boolean;
  onLocateMe: () => void;
  /** Fired once the map is ready and whenever the user drags the pin. */
  onCenterChange: (lat: number, lng: number) => void;
  /** Mutable ref shared with the parent so it can panTo() programmatically. */
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

/**
 * Interactive map canvas: the draggable Google Map with a center-anchored
 * teardrop pin, a precision circle, a tooltip bubble and the "Use current
 * location" pill. Pure presentation — all state lives in the parent view.
 */
export const LocationMapCanvas: React.FC<LocationMapCanvasProps> = ({
  center,
  isMoving,
  isLocating,
  onLocateMe,
  onCenterChange,
  mapRef,
}) => {
  const isDragging = useRef(false);

  return (
    <div className="flex-1 relative overflow-hidden z-0">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={15}
        onLoad={(map) => {
          mapRef.current = map;
          // Auto-populate the address from the pin's initial position
          const c = map.getCenter();
          if (c) {
            onCenterChange(c.lat(), c.lng());
          }
        }}
        onDragStart={() => {
          isDragging.current = true;
        }}
        onIdle={() => {
          if (mapRef.current && isDragging.current) {
            const c = mapRef.current.getCenter();
            if (c) {
              onCenterChange(c.lat(), c.lng());
            }
            isDragging.current = false;
          }
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: "greedy",
        }}
      />

      {/* Center overlay: precision circle + teardrop pin + tooltip */}
      <div className="absolute left-1/2 top-1/2 z-10 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
        {/* Translucent precision circle around the drop point */}
        <div className="absolute left-0 top-0 w-[46vw] h-[46vw] max-w-[250px] max-h-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-400/40 bg-sky-400/10" />

        {/* Teardrop pin with tip anchored to the exact map center */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 -bottom-1 transition-transform duration-200 ${isMoving ? "-translate-y-1 scale-110" : "scale-100"}`}
          style={{ filter: "drop-shadow(0 6px 5px rgba(0,0,0,0.28))" }}
        >
          <DropPin />
        </div>

        {/* Tooltip bubble above pin */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[74px]">
          <div className="relative bg-slate-900/95 text-white text-[11px] font-semibold px-4 py-2 rounded-xl shadow-xl whitespace-nowrap flex items-center gap-1.5">
            {isMoving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-300" />
                <span>Locating...</span>
              </>
            ) : (
              <span>Move pin to your exact delivery location</span>
            )}
            {/* Caret pointing down at the pin */}
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900/95 rotate-45" />
          </div>
        </div>
      </div>

      {/* Use current location pill (below the pin) */}
      <button
        onClick={onLocateMe}
        disabled={isLocating}
        className="absolute left-1/2 -translate-x-1/2 top-[calc(50%+108px)] z-20 bg-white text-[#00bd6f] rounded-full px-5 py-2.5 shadow-xl border border-slate-100 text-[13px] font-bold hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-75"
      >
        {isLocating && <Loader2 className="w-4 h-4 animate-spin text-[#00bd6f]" />}
        <span>{isLocating ? "Getting location..." : "Use current location"}</span>
      </button>
    </div>
  );
};
