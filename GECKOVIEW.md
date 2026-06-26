# GeckoView Web Engine Integration for Areka (Android)

Areka now natively supports **Mozilla GeckoView**, a high-performance, private, and standards-compliant rendering engine, as a robust alternative to Android's default Chromium-based System WebView.

---

## Why GeckoView?

- **Rendering Consistency**: Bypass fragmentation across older Android devices by bundling a fixed, modern browser engine directly with your APK.
- **Privacy First**: Benefit from Mozilla's advanced tracking protection and privacy-focused web standards out of the box.
- **Independent Engine**: Perfect for developers and users who prefer non-Chromium browser architectures (Firefox Quantum/Gecko).

---

## Native Implementation & Files

We have integrated GeckoView into your Android project structure using the following configurations:

### 1. Repository Configuration (`/android/build.gradle`)
Added Mozilla's official Maven repository to fetch the required binaries:
```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
        maven {
            url "https://maven.mozilla.org/maven2/"
        }
    }
}
```

### 2. Dependency Inclusion (`/android/app/build.gradle`)
Added the official stable GeckoView package:
```groovy
dependencies {
    // ... other dependencies
    implementation "org.mozilla.geckoview:geckoview-stable:112.0.20230406110156"
}
```

### 3. Custom GeckoActivity (`/android/app/src/main/java/com/areka/app/GeckoActivity.java`)
We created a fully native `GeckoActivity` that:
- Initializes a shared, performant `GeckoRuntime`.
- Sets up a full-screen `GeckoView` wrapper matching Areka's color theme (`#07111F`).
- Automatically loads our high-fidelity compiled compiled assets directly from local storage: `file:///android_asset/public/index.html`.

---

## How to Switch Your Default Launcher

We have already declared both activities in your `AndroidManifest.xml` (`MainActivity` and `GeckoActivity`).

### To Boot with GeckoView by Default:
To make GeckoView the primary launcher engine instead of the default Capacitor Chromium webview, update `/android/app/src/main/AndroidManifest.xml` to move the `<intent-filter>` launcher tag to `.GeckoActivity`:

```xml
        <!-- Standard WebView Launcher (Disable if launching with Gecko) -->
        <activity
            android:name=".MainActivity"
            ...
            android:exported="true">
            <!-- Remove intent-filter from here to make Gecko primary -->
        </activity>

        <!-- GeckoView Launcher -->
        <activity
            android:name=".GeckoActivity"
            android:label="Areka"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
```

---

## Compiling Your Android Build

Once you copy the built assets to your Android folder (`npx cap sync`), you can compile your brand-new Android APK embedding Mozilla GeckoView using standard Android Studio or command-line Gradle!
