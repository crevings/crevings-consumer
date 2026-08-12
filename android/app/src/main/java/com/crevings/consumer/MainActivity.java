package com.crevings.consumer;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register native plugins BEFORE the bridge initializes
        // so src/services/*.ts can access them via registerPlugin().
        registerPlugin(AppSettingsPlugin.class);
        registerPlugin(LocationSettingsPlugin.class);
        super.onCreate(savedInstanceState);

        makeStatusBarWhiteAndNavTransparent();
        setupCleanEdgeToEdgeLayout();
    }

    /**
     * True dynamic edge-to-edge status bar:
     * Status bar is 100% TRANSPARENT so whatever background color the web page
     * has (green loading screen, white header, slate/dark modals) automatically
     * shines through behind the status bar dynamically!
     */
    private void makeStatusBarWhiteAndNavTransparent() {
        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // Status bar MUST be transparent so page background color blends in dynamically
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.WHITE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setStatusBarContrastEnforced(false);
            window.setNavigationBarContrastEnforced(true);
        }

        WindowInsetsControllerCompat controller = new WindowInsetsControllerCompat(window, window.getDecorView());
        controller.setAppearanceLightStatusBars(true);
        controller.setAppearanceLightNavigationBars(true);
    }

    /**
     * Allow WebView to extend behind status bar while handling keyboard inset at bottom.
     */
    private void setupCleanEdgeToEdgeLayout() {
        getBridge().getWebView().post(() -> {
            View webViewParent = (View) getBridge().getWebView().getParent();
            webViewParent.setBackgroundColor(Color.TRANSPARENT);
            getBridge().getWebView().setBackgroundColor(Color.TRANSPARENT);

            ViewCompat.setOnApplyWindowInsetsListener(webViewParent, (v, insets) -> {
                Insets systemBars = insets.getInsets(
                        WindowInsetsCompat.Type.systemBars()
                                | WindowInsetsCompat.Type.displayCutout());
                Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
                boolean keyboardVisible = insets.isVisible(WindowInsetsCompat.Type.ime());

                // Top: 0 (WebView extends behind transparent status bar)
                // Bottom: systemBars.bottom (exact height of 3-button nav / gesture bar) or ime.bottom when typing
                int bottomPadding = keyboardVisible ? ime.bottom : systemBars.bottom;
                v.setPadding(0, 0, 0, bottomPadding);
                return insets;
            });
            webViewParent.requestApplyInsets();
        });
    }
}
