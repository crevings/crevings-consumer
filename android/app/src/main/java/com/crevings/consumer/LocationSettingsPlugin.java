package com.crevings.consumer;

import android.app.Activity;
import android.content.Intent;
import android.provider.Settings;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.activity.result.contract.ActivityResultContracts;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.Priority;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.tasks.Task;

/**
 * Native Capacitor plugin that prompts the user to enable GPS / Location
 * Services via the Google Play Services in-app dialog (the same dialog
 * shown by Google Maps, Uber, etc.).
 *
 * If Play Services is unavailable (rare), falls back to opening the
 * system Location Settings screen.
 *
 * Registered in MainActivity.onCreate().
 */
@CapacitorPlugin(name = "LocationSettings")
public class LocationSettingsPlugin extends Plugin {

    private ActivityResultLauncher<IntentSenderRequest> locationSettingsLauncher;

    @Override
    public void load() {
        // Register the Activity Result launcher during plugin initialization
        // so the callback is tied to the Activity lifecycle.
        locationSettingsLauncher = getActivity().getActivityResultRegistry().register(
            "location_settings_resolution",
            new ActivityResultContracts.StartIntentSenderForResult(),
            result -> {
                PluginCall savedCall = getSavedCall();
                if (savedCall == null) return;

                if (result.getResultCode() == Activity.RESULT_OK) {
                    // User enabled location from the in-app dialog
                    savedCall.resolve();
                } else {
                    // User dismissed / cancelled the dialog
                    savedCall.reject("User declined to enable location services");
                }
            }
        );
    }

    /**
     * Shows the Google Play Services in-app location-enable dialog.
     * If location is already enabled, resolves immediately.
     * If Play Services isn't available, falls back to the system settings intent.
     */
    @PluginMethod()
    public void openLocationSettings(PluginCall call) {
        // Save the call so the ActivityResult callback can resolve/reject it
        saveCall(call);

        // Build a LocationRequest that requires high accuracy (GPS)
        LocationRequest locationRequest = new LocationRequest.Builder(
                Priority.PRIORITY_HIGH_ACCURACY, 10000)
                .setMinUpdateIntervalMillis(5000)
                .build();

        LocationSettingsRequest settingsRequest = new LocationSettingsRequest.Builder()
                .addLocationRequest(locationRequest)
                .setAlwaysShow(true) // Forces the dialog even if the user previously said no
                .build();

        SettingsClient settingsClient = LocationServices.getSettingsClient(getContext());
        Task<LocationSettingsResponse> task = settingsClient.checkLocationSettings(settingsRequest);

        task.addOnSuccessListener(getActivity(), response -> {
            // Location is already enabled — resolve immediately
            PluginCall saved = getSavedCall();
            if (saved != null) {
                saved.resolve();
            }
        });

        task.addOnFailureListener(getActivity(), e -> {
            if (e instanceof ResolvableApiException) {
                // Show the Google Play Services in-app dialog
                try {
                    ResolvableApiException resolvable = (ResolvableApiException) e;
                    IntentSenderRequest intentSenderRequest =
                            new IntentSenderRequest.Builder(resolvable.getResolution()).build();
                    locationSettingsLauncher.launch(intentSenderRequest);
                } catch (Exception ex) {
                    // Couldn't launch the resolution dialog — fall back to system settings
                    fallbackToSystemSettings(call);
                }
            } else {
                // Play Services not available or other failure — fall back
                fallbackToSystemSettings(call);
            }
        });
    }

    /**
     * Fallback: opens the Android system Location Settings screen.
     * Used when Google Play Services is unavailable.
     */
    private void fallbackToSystemSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            // Resolve since we can't track what happens in system settings
            call.resolve();
        } catch (Exception ex) {
            call.reject("Could not open location settings", ex);
        }
    }
}
