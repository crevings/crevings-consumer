/**
 * permissions.ts — Capacitor-aware app-settings helpers shared by the
 * microphone and location permission-denial UIs.
 *
 * Once the OS permission dialog has been answered "deny" (or "don't ask
 * again"), the only way back is the app's settings page, opened via the
 * `app-settings:` URL scheme. This module owns that helper plus the
 * Capacitor-native detection used by both permission flows.
 */

interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
}

export const isCapacitorNative = (): boolean => {
  if (typeof window === "undefined") return false;
  const cap = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  return !!cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform();
};

/** Opens the OS app-settings page for this app (native only). No-op on web. */
export const openAppSettings = async (): Promise<void> => {
  if (!isCapacitorNative()) return;
  try {
    const { App } = await import("@capacitor/app");
    // Capacitor 8 removed App.openUrl from the public API — call it via the
    // runtime plugin registry (works on Capacitor 5-8 native builds).
    await (App as unknown as { openUrl?: (options: { url: string }) => Promise<void> }).openUrl?.({
      url: "app-settings:",
    });
  } catch {
    // best effort — ignore
  }
};

/** Backwards-compatible alias used by the location picker. */
export const openLocationSettings = openAppSettings;
