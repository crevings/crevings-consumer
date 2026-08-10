/**
 * Capacitor configuration for the Crevings consumer app.
 *
 * Consumed by `npx cap add android` / `npx cap sync` when generating the
 * native Android shell from this repo (run those from the project root with
 * @capacitor/cli installed — the CLI is intentionally NOT a runtime
 * dependency; the CI web build is pure Vite). `webDir` points at the Vite
 * build output (`dist`).
 *
 * Runtime permissions (microphone / location) are declared automatically by
 * the installed plugins:
 *   - @capacitor-community/speech-recognition → RECORD_AUDIO
 *   - @capacitor/geolocation                 → ACCESS_FINE/COARSE_LOCATION
 */

interface CapacitorServerConfig {
  /** Scheme used inside the WebView; https avoids mixed-content blocking. */
  androidScheme?: string;
  /** Hosts the WebView is allowed to navigate to / fetch from. */
  allowNavigation?: string[];
}

interface CapacitorAndroidConfig {
  backgroundColor?: string;
}

interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: CapacitorServerConfig;
  android?: CapacitorAndroidConfig;
}

const config: CapacitorConfig = {
  appId: "com.crevings.consumer",
  appName: "Crevings",
  webDir: "dist",
  server: {
    androidScheme: "https",
    allowNavigation: ["backend.crevings.com", "*.crevings.com"],
  },
  android: {
    backgroundColor: "#ffffff",
  },
};

export default config;
