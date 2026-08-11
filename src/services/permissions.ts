/**
 * permissions.ts — Capacitor-aware helpers for opening the OS app-settings
 * page, shared by the microphone and location permission-denial UIs.
 *
 * Once the OS permission dialog has been answered "deny" (or "don't ask
 * again"), the only way back is the app's settings page:
 *   - Android: a tiny native plugin (AppSettings, see
 *     android/app/src/main/java/com/crevings/consumer/AppSettingsPlugin.java)
 *     fires ACTION_APPLICATION_DETAILS_SETTINGS. This is the ONLY reliable
 *     Android path — App.openUrl() was removed from @capacitor/app in v8 and
 *     the "app-settings:" URL scheme is iOS-only.
 *   - iOS: "app-settings:" URL via the App plugin bridge (best effort).
 *   - Web: no-op (permissions are reset from the browser's site settings).
 */

import { Capacitor, registerPlugin } from "@capacitor/core";

interface AppSettingsPlugin {
  open(): Promise<void>;
}

/** Native Android bridge — registered from MainActivity.onCreate(). */
const AppSettings = registerPlugin<AppSettingsPlugin>("AppSettings");

export const isCapacitorNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/** Opens the OS app-settings page for this app (native only). No-op on web. */
export const openAppSettings = async (): Promise<void> => {
  if (!isCapacitorNative()) return;

  // Android → native Intent via AppSettingsPlugin (the only working path).
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.getPlatform() === "android") {
      await AppSettings.open();
      return;
    }
  } catch {
    // fall through to the best-effort bridge below
  }

  // iOS / fallback — "app-settings:" URL opens the app's settings page.
  try {
    const { App } = await import("@capacitor/app");
    await (App as unknown as { openUrl?: (options: { url: string }) => Promise<void> }).openUrl?.({
      url: "app-settings:",
    });
  } catch {
    // best effort — ignore
  }
};

/** Backwards-compatible alias used by the location picker. */
export const openLocationSettings = openAppSettings;
