# Fix Deprecated ProGuard File in Speech Recognition Plugin

The project build is failing because the `:capacitor-community-speech-recognition` plugin uses the deprecated `proguard-android.txt` file. Android Gradle Plugin (AGP) now requires using `proguard-android-optimize.txt` for R8 optimizations.

## User Review Required

> [!IMPORTANT]
> The fix will be applied to a file inside `node_modules`. This means that if you run `npm install` or `capacitor update` again, the change might be overwritten unless you use a tool like `patch-package` or the fix is updated in the plugin's source repository.

## Proposed Changes

### capacitor-community-speech-recognition

#### [MODIFY] [build.gradle](file:///C:/xces/crevings-consumer/node_modules/@capacitor-community/speech-recognition/android/build.gradle)

Update the `proguardFiles` configuration to use `proguard-android-optimize.txt`.

```diff
-            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
+            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
```

## Verification Plan

### Manual Verification
- Run the Android build to ensure the error is resolved.
- Specifically, run `./gradlew :capacitor-community-speech-recognition:assembleRelease` to verify the module builds correctly.
