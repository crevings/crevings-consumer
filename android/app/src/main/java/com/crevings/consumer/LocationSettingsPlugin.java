package com.crevings.consumer;

import android.content.Intent;
import android.provider.Settings;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Tiny native Capacitor plugin that opens the Android system Location Settings
 * screen (the toggle to enable/disable GPS, Wi-Fi scanning, etc.).
 *
 * This is separate from AppSettingsPlugin which opens the *app-specific*
 * permission page. When the user has granted the app location permission but
 * their device GPS is turned off, this plugin takes them to the right place.
 *
 * Registered in MainActivity.onCreate() alongside AppSettingsPlugin.
 */
@CapacitorPlugin(name = "LocationSettings")
public class LocationSettingsPlugin extends Plugin {

    @PluginMethod()
    public void openLocationSettings(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
        call.resolve();
    }
}
