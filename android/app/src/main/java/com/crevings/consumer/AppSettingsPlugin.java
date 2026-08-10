package com.crevings.consumer;

import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * AppSettings — tiny native bridge that opens this app's entry in the OS
 * Settings app via ACTION_APPLICATION_DETAILS_SETTINGS.
 *
 * Why this exists: Capacitor 8 removed App.openUrl() from @capacitor/app, and
 * the "app-settings:" URL scheme only works on iOS. On Android the only
 * reliable way to reach the app-settings page (needed after a permission is
 * hard-denied) is a native Intent, so the WebView JS cannot do it alone.
 *
 * Registered from MainActivity.onCreate() and invoked from
 * src/services/permissions.ts (registerPlugin('AppSettings')).
 */
@CapacitorPlugin(name = "AppSettings")
public class AppSettingsPlugin extends Plugin {

  @PluginMethod
  public void open(PluginCall call) {
    try {
      Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      intent.setData(Uri.fromParts("package", getContext().getPackageName(), null));
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      getContext().startActivity(intent);
      call.resolve(new JSObject());
    } catch (Exception ex) {
      call.reject(ex.getMessage());
    }
  }
}
