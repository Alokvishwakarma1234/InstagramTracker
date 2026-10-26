# InstaTracker

Native Android app built with Kotlin and Jetpack Compose.

## Current status
- Native Instagram connection screen
- OAuth browser redirect and Android deep-link callback scaffold
- Backend starter in `backend/` for server-side token exchange
- Official profile lookup attempt after authorization
- GitHub Actions cloud build for debug APK

## Important: Meta setup is required before login can work

This repository does **not** include an Instagram app ID, app secret, or deployed backend. Login will stay in setup-required mode until you configure these.

1. Create/configure an app in [Meta for Developers](https://developers.facebook.com/) and enable the current **Instagram API with Instagram Login** product. Confirm the account types and permissions your app is eligible for.
2. Deploy `backend/` to an HTTPS Node.js host.
3. Set backend environment variables from `backend/.env.example`: `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`, `INSTAGRAM_REDIRECT_URI` (exactly the callback URL configured in Meta), `APP_CALLBACK_URI=instatracker://oauth/callback`, and a long random `OAUTH_STATE_SECRET`.
4. Set the backend's public HTTPS URL in `app/build.gradle.kts` as `API_BASE_URL` instead of `https://YOUR_BACKEND_HOST`, then push to GitHub to trigger a new APK build.
5. Configure valid test accounts/permissions and complete Meta's review or business verification requirements that apply to your use case.

Never put `INSTAGRAM_APP_SECRET` in Android code or commit a real `.env` file. The backend sample keeps tokens off the phone, but its session storage is in-memory for development only; deploy a production-ready encrypted session store with expiry/revocation and user-data deletion before real users use it.

## What official authorization can and cannot show

Instagram Login is intended for eligible professional accounts and the permissions Meta grants to the app. Personal accounts may not be eligible. A successful login does not grant unrestricted access to follower/following lists.

The official API does not provide identities of profile visitors, individual profile searchers, or a definitive list of accounts that blocked you. InstaTracker must not fabricate these results. Follower comparison from a user-downloaded Instagram data export can be added separately.

## Build APK without Android Studio
1. Open the **Actions** tab.
2. Select **Android APK** and wait for a successful build.
3. Open the run and download the `InstaTracker-debug-apk` artifact.
4. Extract `app-debug.apk` and install it on your Android phone.

## Tech
- Kotlin + Jetpack Compose
- Node.js backend for OAuth token exchange
- GitHub Actions cloud build
