package com.crevings.consumer;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register the native AppSettings plugin BEFORE the bridge initializes
        // so src/services/permissions.ts can open the OS app-settings page.
        registerPlugin(AppSettingsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
