import { Capacitor } from "@capacitor/core";
import { PushNotifications, ActionPerformed, PushNotificationSchema, Token } from "@capacitor/push-notifications";
import { BASE_URL } from "@/api/fetcher";

let isPushInitialized = false;
let registeredToken: string | null = null;

/**
 * Initialize Firebase Cloud Messaging push notifications for the consumer app.
 *
 * Flow:
 * 1. Verifies if running in native mobile environment (Capacitor Android / iOS).
 * 2. Checks and requests notification permissions from the user.
 * 3. Registers the device with FCM and receives the registration token.
 * 4. Persists the token to the backend so background push works.
 * 5. Attaches foreground / tap event listeners.
 */
export async function initPushNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  if (isPushInitialized) {
    return;
  }
  isPushInitialized = true;

  try {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      console.warn("[Push] Notification permission not granted:", permStatus.receive);
      return;
    }

    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register();

    // On successful registration, FCM assigns a device token
    await PushNotifications.addListener("registration", (token: Token) => {
      console.log("🔥 [FCM] Token received:", token.value);
      registeredToken = token.value;
      try {
        localStorage.setItem("fcm_device_token", token.value);
      } catch {}
      // Persist to backend (fire-and-forget)
      void persistToken(token.value);
    });

    // Registration failed (e.g. Google Play services issue, missing google-services.json)
    await PushNotifications.addListener("registrationError", (error: any) => {
      console.error("[Push] FCM Registration Error:", JSON.stringify(error));
    });

    // Foreground notification — SSE is the primary channel while app is open,
    // but we still show a banner so the user knows something happened.
    await PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
      console.log("[Push] Foreground notification:", notification);
      // The notification banner is shown automatically by the OS for notification-type
      // messages. For data-only messages, the app can show a custom UI here.
      // Currently the backend sends notification-type messages, so the OS handles display.
    });

    // User tapped on the push notification banner — navigate to relevant screen
    await PushNotifications.addListener("pushNotificationActionPerformed", (action: ActionPerformed) => {
      console.log("[Push] Notification tapped:", action);
      // Could deep-link to order tracking based on action.notification.data.orderId
    });
  } catch (err: any) {
    console.error("[Push] Failed to initialize push notifications:", err?.message || err);
  }
}

async function persistToken(token: string): Promise<void> {
  try {
    const platform = Capacitor.getPlatform();
    const res = await fetch(`${BASE_URL}/consumer/notifications/devices`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, platform }),
    });
    if (!res.ok) {
      console.error(`[Push] Token persist failed (${res.status})`);
    }
  } catch (err) {
    console.error("[Push] Failed to persist FCM token:", err);
  }
}

/**
 * Remove this device's token from the backend (call on logout).
 */
export async function unregisterPushNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const token = registeredToken || getSavedFcmToken();
  registeredToken = null;
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/consumer/notifications/devices`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      console.error(`[Push] Token unregister failed (${res.status})`);
    }
  } catch (err) {
    console.error("[Push] Failed to unregister FCM token:", err);
  }
}

export function getSavedFcmToken(): string | null {
  try {
    return localStorage.getItem("fcm_device_token");
  } catch {
    return null;
  }
}
