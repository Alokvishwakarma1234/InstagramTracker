# InstaTracker

Native Android app built with Kotlin and Jetpack Compose.

## Current status
- Initial dark dashboard UI
- Navigation shells for Home, Import, and Compare
- Room/SQLite dependencies configured
- GitHub Actions workflow to build a debug APK

## Build an APK without Android Studio
1. Open the **Actions** tab in this repository.
2. Select **Android APK**.
3. Choose **Run workflow** on the `main` branch, or wait for the push-triggered build.
4. Open the completed workflow run.
5. Download the `InstaTracker-debug-apk` artifact and extract `app-debug.apk`.
6. Transfer/install the APK on your Android phone. Android may ask you to allow installs from that download source.

## Important limitations
Instagram does not provide an official list of profile visitors or individual profile-searchers. This app will not fabricate those identities. The initial data-analysis workflow will use an Instagram account data export selected by the user, processed locally.

## Tech
- Kotlin + Jetpack Compose
- Room + SQLite
- GitHub Actions cloud build
