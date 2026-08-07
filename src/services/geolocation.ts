// Capacitor-aware geolocation helper.
// - In a Capacitor native app (Android/iOS) it uses @capacitor/geolocation, which shows
//   the proper OS permission dialog (ACCESS_FINE_LOCATION on Android).
// - On web / browser preview it falls back to navigator.geolocation.

export interface GeoPosition {
  lat: number;
  lng: number;
}

interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
}

export const isCapacitorNative = (): boolean => {
  if (typeof window === 'undefined') return false;
  const cap = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  return !!cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
};

const getBrowserPosition = (): Promise<GeoPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const err = new Error('Geolocation is not supported on this device') as Error & { code: number };
      err.code = 2; // POSITION_UNAVAILABLE
      reject(err);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

/**
 * Requests location permission (OS dialog on native, browser prompt on web)
 * and resolves with the current position once granted.
 */
export const requestLocationAndGetPosition = async (): Promise<GeoPosition> => {
  // Native (Capacitor) path — triggers the proper Android/iOS permission dialog
  if (isCapacitorNative()) {
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      const perm = await Geolocation.requestPermissions();
      if (perm.location !== 'granted') {
        const err = new Error('Location permission denied') as Error & { code: number };
        err.code = 1; // PERMISSION_DENIED
        throw err;
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e) {
      if ((e as { code?: number } | null)?.code === 1) throw e; // user denied — surface as-is
      // Plugin unavailable / runtime failure — try the webview's browser API
      return getBrowserPosition();
    }
  }
  return getBrowserPosition();
};

/** Opens the OS app-settings page (native only). No-op on web. */
export const openLocationSettings = async (): Promise<void> => {
  if (!isCapacitorNative()) return;
  try {
    const { App } = await import('@capacitor/app');
    // Capacitor 8 removed App.openUrl from the public API — call it via the
    // runtime plugin registry (works on Capacitor 5-7 native builds).
    await (App as unknown as { openUrl?: (options: { url: string }) => Promise<void> }).openUrl?.({ url: 'app-settings:' });
  } catch {
    // best effort — ignore
  }
};
