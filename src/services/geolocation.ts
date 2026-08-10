// Capacitor-aware geolocation helper.
// - In a Capacitor native app (Android/iOS) it uses @capacitor/geolocation, which shows
//   the proper OS permission dialog (ACCESS_FINE_LOCATION on Android).
// - On web / browser preview it falls back to navigator.geolocation.
// Every failure is normalized to a LocationError with a POSIX-style code, so
// callers never have to sniff error message strings.

import { isCapacitorNative, openAppSettings as openLocationSettings } from "./permissions";

export { isCapacitorNative, openLocationSettings };

export interface GeoPosition {
  lat: number;
  lng: number;
}

/** Mirrors the GeolocationPositionError codes (1 = denied, 2 = unavailable, 3 = timeout). */
export type LocationErrorCode = 1 | 2 | 3;

export class LocationError extends Error {
  readonly code: LocationErrorCode;

  constructor(message: string, code: LocationErrorCode) {
    super(message);
    this.name = "LocationError";
    this.code = code;
  }
}

/** True when a failure means the user denied location access (vs. a transient failure). */
export const isLocationPermissionDenied = (err: unknown): boolean =>
  err instanceof LocationError && err.code === 1;

/** True when a raw error (native or web) means the user denied access. */
const isDenialError = (err: unknown): boolean => {
  if (err instanceof LocationError) return err.code === 1;
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  // @capacitor/geolocation rejects with message-based denial text; the browser
  // API rejects with `code: 1` (already normalized above) or a PERMISSION_DENIED message.
  return msg.includes("denied") || msg.includes("permission");
};

const getBrowserPosition = (): Promise<GeoPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new LocationError("Geolocation is not supported on this device", 2));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const code: LocationErrorCode =
          err.code === 1 || err.code === 2 || err.code === 3 ? err.code : 2;
        reject(new LocationError(err.message || "Could not determine your location", code));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

/**
 * Requests location permission (OS dialog on native, browser prompt on web)
 * and resolves with the current position once granted.
 *
 * Rejects with a LocationError:
 *   - code 1 → user denied permission (show settings guidance, never retry-loop)
 *   - code 2 → position unavailable / unsupported
 *   - code 3 → request timed out
 */
export const requestLocationAndGetPosition = async (): Promise<GeoPosition> => {
  // Native (Capacitor) path — triggers the proper Android/iOS permission dialog
  if (isCapacitorNative()) {
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      const perm = await Geolocation.requestPermissions();
      if (perm.location !== "granted") {
        // 'denied' (hard block) or 'prompt' (dialog dismissed) → treat as denial.
        throw new LocationError("Location permission denied", 1);
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e) {
      if (isDenialError(e)) {
        throw e instanceof LocationError ? e : new LocationError("Location permission denied", 1);
      }
      // Plugin unavailable / runtime failure — fall back to the webview's browser API.
      try {
        return await getBrowserPosition();
      } catch (browserErr) {
        throw browserErr instanceof LocationError
          ? browserErr
          : new LocationError("Could not access your location", 2);
      }
    }
  }
  return getBrowserPosition();
};
