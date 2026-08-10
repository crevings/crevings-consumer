package com.crevings.consumer;

import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register native plugins BEFORE the bridge initializes
        // so src/services/*.ts can access them via registerPlugin().
        registerPlugin(AppSettingsPlugin.class);
        registerPlugin(LocationSettingsPlugin.class);
        super.onCreate(savedInstanceState);

        keepWebViewInsideSystemBars();
    }

    /**
     * Force the app content to stay inside the visible area (below the status
     * bar, above the navigation bar) on EVERY Android version.
     *
     * Capacitor 8.5's SystemBars plugin only pads the WebView natively on
     * Android 16+, and otherwise relies on CSS env(safe-area-inset-*), which
     * needs a very new WebView (Chromium >= 140) plus viewport-fit=cover. On
     * Android 15 — or any device with an older WebView — the app content draws
     * under the system bars. Padding the same parent view the bridge listens
     * on makes the behavior deterministic everywhere: the WebView is inset by
     * the status bar, navigation bar, gesture-nav insets, and the soft
     * keyboard when it opens. This is the "not full screen" look the app
     * wants — content never sits under the Android buttons.
     */
    private void keepWebViewInsideSystemBars() {
        getBridge().getWebView().post(() -> {
            View webViewParent = (View) getBridge().getWebView().getParent();
            ViewCompat.setOnApplyWindowInsetsListener(webViewParent, (v, insets) -> {
                Insets systemBars = insets.getInsets(
                        WindowInsetsCompat.Type.systemBars()
                                | WindowInsetsCompat.Type.displayCutout());
                Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
                boolean keyboardVisible = insets.isVisible(WindowInsetsCompat.Type.ime());
                v.setPadding(
                        systemBars.left,
                        systemBars.top,
                        systemBars.right,
                        keyboardVisible ? ime.bottom : systemBars.bottom);
                return insets;
            });
            webViewParent.requestApplyInsets();
        });
    }
}
