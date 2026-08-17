import { Capacitor } from "@capacitor/core";
import { PushNotifications, ActionPerformed, PushNotificationSchema, Token } from "@capacitor/push-notifications";

let isPushInitialized = false;

/**
 * Initialize Firebase Cloud Messaging push notifications for the consumer app.
 *
 * Flow:
 * 1. Verifies if running in native mobile environment (Capacitor Android / iOS).
 * 2. Checks and requests notification permissions from the user.
 * 3. Registers the device with FCM and receives the registration token.
 * 4. Logs the token for testing and attaches foreground / tap event listeners.
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
      console.log("🔥 ==================================================");
      console.log("🔥 [FCM REGISTRATION TOKEN]:");
      console.log(token.value);
      console.log("🔥 ==================================================");
      try {
        localStorage.setItem("fcm_device_token", token.value);
      } catch {}
    });

    // Registration failed (e.g. Google Play services issue, missing google-services.json)
    await PushNotifications.addListener("registrationError", (error: any) => {
      console.error("[Push] FCM Registration Error:", JSON.stringify(error));
    });

    // Show or log notification received when app is in foreground
    await PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
      console.log("[Push] Notification received in foreground:", notification);
    });

    // User tapped on the push notification banner
    await PushNotifications.addListener("pushNotificationActionPerformed", (action: ActionPerformed) => {
      console.log("[Push] Notification action performed / tapped:", action);
    });
  } catch (err: any) {
    console.error("[Push] Failed to initialize push notifications:", err?.message || err);
  }
}

export function getSavedFcmToken(): string | null {
  try {
    return localStorage.getItem("fcm_device_token");
  } catch {
    return null;
  }
}
