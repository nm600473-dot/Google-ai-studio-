package com.areka.app;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.appcompat.app.AppCompatActivity;
import org.mozilla.geckoview.GeckoRuntime;
import org.mozilla.geckoview.GeckoSession;
import org.mozilla.geckoview.GeckoView;

public class GeckoActivity extends AppCompatActivity {
    private GeckoView mGeckoView;
    private GeckoSession mSession;
    private static GeckoRuntime sRuntime;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Enable edge-to-edge support matching modern Android styles
        Window window = getWindow();
        window.getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        );
        window.setStatusBarColor(android.graphics.Color.TRANSPARENT);

        // Programmatically create full-screen GeckoView container
        mGeckoView = new GeckoView(this);
        mGeckoView.setBackgroundColor(android.graphics.Color.parseColor("#07111F"));
        setContentView(mGeckoView);

        // Initialize GeckoSession
        mSession = new GeckoSession();

        // Ensure runtime is shared across app sessions
        if (sRuntime == null) {
            sRuntime = GeckoRuntime.create(this);
        }

        // Bind session and runtime
        mSession.open(sRuntime);
        mGeckoView.setSession(mSession);

        // Load modern web application assets compiled into the android assets directory
        mSession.loadUri("file:///android_asset/public/index.html");
    }

    @Override
    protected void onDestroy() {
        if (mSession != null) {
            mSession.close();
        }
        super.onDestroy();
    }
}
