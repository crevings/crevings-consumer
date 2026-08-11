// Capacitor-aware geolocation helper.
// - In a Capacitor native app (Android/iOS) it uses @capacitor/geolocation, which shows
//   the proper OS permission dialog (ACCESS_FINE_LOCATION on Android).
// - On web / browser preview it falls back to navigator.geolocation.
// Every failure is normalized to a LocationError with a POSIX-style code, so
// callers never have to sniff error message strings.

import { Capacitor, registerPlugin } from "@capacitor/core";
import { isCapacitorNative } from "./permissions";

export { isCapacitorNative };

export interface GeoPosition {
  lat: number;
  lng: number;
}

/**
 * Extended error codes:
 *   1 = user denied permission
 *   2 = position unavailable / unsupported
 *   3 = request timed out
 *   4 = device Location Services (GPS) turned off (permission granted but hardware disabled)
 */
export type LocationErrorCode = 1 | 2 | 3 | 4;

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

/** True when GPS / Location Services are turned off at the device level (or any non-denial location failure). */
export const isLocationServicesDisabled = (err: unknown): boolean => {
  if (err instanceof LocationError) {
    return err.code !== 1;
  }
  return !isLocationPermissionDenied(err);
};

/** True when a raw error (native or web) means the user denied access. */
const isDenialError = (err: unknown): boolean => {
  if (err instanceof LocationError) return err.code === 1;
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  // @capacitor/geolocation rejects with message-based denial text; the browser
  // API rejects with `code: 1` (already normalized above) or a PERMISSION_DENIED message.
  return msg.includes("denied") || msg.includes("permission");
};

// ── Native plugin bridge: enable GPS via Google Play Services in-app dialog ──
interface LocationSettingsPlugin {
  openLocationSettings(): Promise<void>;
}
const LocationSettingsBridge = registerPlugin<LocationSettingsPlugin>("LocationSettings");

/**
 * Shows the Google Play Services in-app dialog to enable GPS / Location
 * Services on Android. The dialog appears inside the app (no redirect to
 * system settings). Resolves when the user taps "Turn on" / "OK", rejects
 * when the user dismisses the dialog.
 *
 * On iOS or web this is a no-op (those platforms don't have an equivalent).
 */
export const openDeviceLocationSettings = async (): Promise<void> => {
  if (!isCapacitorNative()) return;
  if (Capacitor.getPlatform() === "android") {
    await LocationSettingsBridge.openLocationSettings();
  }
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
        if (err.code === 1) {
          reject(new LocationError(err.message || "Location permission denied", 1));
        } else if (err.code === 2) {
          // POSITION_UNAVAILABLE — very likely GPS is turned off
          reject(
            new LocationError(
              "Your device's location service (GPS) appears to be turned off. Please turn on GPS to get your location.",
              4
            )
          );
        } else {
          const code: LocationErrorCode = err.code === 3 ? 3 : 2;
          reject(new LocationError(err.message || "Could not determine your location", code));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

/**
 * Requests location permission (OS dialog on native, browser prompt on web)
 * and resolves with the current position once granted.
 *
 * Rejects with a LocationError:
 *   - code 1 → user denied permission
 *   - code 2 → position unavailable / unsupported
 *   - code 3 → request timed out
 *   - code 4 → device Location Services (GPS) turned off
 */
export const requestLocationAndGetPosition = async (): Promise<GeoPosition> => {
  // Native (Capacitor) path — triggers the proper Android/iOS permission dialog
  if (isCapacitorNative()) {
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      const checked = await Geolocation.checkPermissions();
      let perm = checked;
      if (perm.location !== "granted") {
        perm = await Geolocation.requestPermissions();
      }
      if (perm.location !== "granted") {
        // 'denied' or 'prompt' (dialog dismissed) → treat as denial.
        throw new LocationError("Location permission denied", 1);
      }
      // Permission granted — now try to get the actual position.
      try {
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
        return { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (posErr) {
        throw new LocationError(
          "Your device's location service (GPS) is turned off or unavailable. Please turn on GPS.",
          4
        );
      }
    } catch (e) {
      // Re-throw our own LocationErrors directly (code 1 or code 4)
      if (e instanceof LocationError) throw e;
      if (isDenialError(e)) {
        throw new LocationError("Location permission denied", 1);
      }
      // Plugin unavailable / runtime failure — fall back to the webview's browser API.
      try {
        return await getBrowserPosition();
      } catch (browserErr) {
        throw browserErr instanceof LocationError
          ? browserErr
          : new LocationError(
              "Your device's location service (GPS) is turned off. Please turn on GPS to get your location.",
              4
            );
      }
    }
  }
  return getBrowserPosition();
};
