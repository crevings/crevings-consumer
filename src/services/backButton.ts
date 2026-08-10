import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Android hardware back button handling for the Capacitor shell.
 *
 * Overlays (voice search, map picker, cart sheet) register a handler while
 * open via useHardwareBack. Pressing back pops the topmost overlay first;
 * when no overlay is open the default behavior is restored (history back when
 * possible, otherwise exit the app).
 *
 * Per the @capacitor/app docs, registering a backButton listener DISABLES the
 * WebView default, so the handler must replicate history.back()/exitApp().
 * The listener is a no-op outside the native Android shell.
 */

type BackHandler = () => boolean;

const handlers: BackHandler[] = [];
let listenerInitialized = false;

/** Register an overlay close handler; returns an unregister function. */
export function registerBackHandler(handler: BackHandler): () => void {
  handlers.push(handler);
  return () => {
    const idx = handlers.indexOf(handler);
    if (idx !== -1) handlers.splice(idx, 1);
  };
}

/**
 * React hook: while `active` (default true), hardware back runs `handler`
 * instead of the default navigation. Return `true` from the handler when it
 * consumed the event (e.g. closed an overlay).
 */
export function useHardwareBack(handler: BackHandler, active = true): void {
  useEffect(() => {
    if (!active) return;
    return registerBackHandler(handler);
  }, [handler, active]);
}

/** Wire up the native back button once at app boot (no-op on web/iOS). */
export function initBackButtonListener(): void {
  if (listenerInitialized || !Capacitor.isNativePlatform()) return;
  listenerInitialized = true;

  void import("@capacitor/app").then(({ App }) => {
    void App.addListener("backButton", async ({ canGoBack }) => {
      // Pop the most recently opened overlay first (LIFO).
      for (let i = handlers.length - 1; i >= 0; i--) {
        const handler = handlers[i];
        if (handler && handler()) return;
      }
      if (canGoBack) {
        window.history.back();
      } else {
        await App.exitApp();
      }
    });
  });
}
