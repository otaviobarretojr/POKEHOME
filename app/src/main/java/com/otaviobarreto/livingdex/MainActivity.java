package com.otaviobarreto.livingdex;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.HapticFeedbackConstants;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.window.OnBackInvokedDispatcher;

public class MainActivity extends Activity {
    private WebView webView;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        webView = new WebView(this);
        setContentView(webView);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
        webView.addJavascriptInterface(new NativeBridge(), "LivingDexNative");
        if (state == null || webView.restoreState(state) == null) {
            webView.loadUrl("file:///android_asset/index.html");
        }
        if (android.os.Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
    }

    private class NativeBridge {
        @JavascriptInterface public void haptic(String kind) {
            runOnUiThread(() -> {
                if (webView == null) return;
                int effect = "confirm".equals(kind) ? HapticFeedbackConstants.CONFIRM : HapticFeedbackConstants.CLOCK_TICK;
                webView.performHapticFeedback(effect);
            });
        }
    }

    private void handleBack() {
        webView.evaluateJavascript("(function(){if(window.f12HandleAndroidBack){return !!window.f12HandleAndroidBack();}return false;})()", value -> {
            if (!"true".equals(value)) {
                if (webView.canGoBack()) webView.goBack(); else finish();
            }
        });
    }

    @Override public void onBackPressed() { handleBack(); }
    @Override protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); if (webView != null) webView.saveState(out); }
    @Override protected void onDestroy() { if(webView!=null){webView.destroy(); webView=null;} super.onDestroy(); }
}
