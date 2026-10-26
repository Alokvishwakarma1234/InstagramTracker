import express from "express";
import crypto from "node:crypto";

const app = express();
app.disable("x-powered-by");

const {
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  INSTAGRAM_REDIRECT_URI,
  APP_REDIRECT_URI = "instatracker://oauth",
  PORT = "3000",
} = process.env;

const sessions = new Map();
const pendingStates = new Map();

function configReady() {
  return Boolean(INSTAGRAM_APP_ID && INSTAGRAM_APP_SECRET && INSTAGRAM_REDIRECT_URI);
}

app.get("/health", (_req, res) => res.json({ ok: true, service: "instatracker-oauth" }));

app.get("/auth/instagram", (_req, res) => {
  if (!configReady()) {
    return res.status(503).send("Instagram OAuth is not configured. Set the backend environment variables first.");
  }
  const state = crypto.randomBytes(24).toString("hex");
  pendingStates.set(state, Date.now());
  // Keep the state store small and short-lived.
  for (const [key, created] of pendingStates) {
    if (Date.now() - created > 10 * 60 * 1000) pendingStates.delete(key);
  }
  const url = new URL("https://www.instagram.com/oauth/authorize");
  url.searchParams.set("client_id", INSTAGRAM_APP_ID);
  url.searchParams.set("redirect_uri", INSTAGRAM_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "instagram_business_basic");
  url.searchParams.set("state", state);
  res.redirect(url.toString());
});

app.get("/auth/instagram/callback", async (req, res) => {
  const { code, state, error, error_description } = req.query;
  if (error) return res.status(400).send(`Instagram authorization failed: ${String(error_description || error)}`);
  const created = pendingStates.get(String(state || ""));
  pendingStates.delete(String(state || ""));
  if (!state || !created || Date.now() - created > 10 * 60 * 1000) {
    return res.status(400).send("Invalid or expired OAuth state. Please return to InstaTracker and try again.");
  }
  if (!code || !configReady()) return res.status(400).send("Missing authorization code or server configuration.");

  try {
    const form = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: "authorization_code",
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      code: String(code),
    });
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Instagram token exchange failed:", tokenData.error_type || tokenData.error_message || tokenResponse.status);
      return res.status(502).send("Instagram token exchange failed. Check Meta app configuration and redirect URI.");
    }

    const longTokenUrl = new URL("https://graph.instagram.com/access_token");
    longTokenUrl.searchParams.set("grant_type", "ig_exchange_token");
    longTokenUrl.searchParams.set("client_secret", INSTAGRAM_APP_SECRET);
    longTokenUrl.searchParams.set("access_token", tokenData.access_token);
    const longTokenResponse = await fetch(longTokenUrl);
    const longTokenData = await longTokenResponse.json();
    const accessToken = longTokenData.access_token || tokenData.access_token;

    const meUrl = new URL("https://graph.instagram.com/v26.0/me");
    meUrl.searchParams.set("fields", "user_id,username,account_type");
    meUrl.searchParams.set("access_token", accessToken);
    const meResponse = await fetch(meUrl);
    const me = await meResponse.json();
    if (!meResponse.ok || !me.username) {
      console.error("Instagram profile request failed:", me.error?.type || me.error?.message || meResponse.status);
      return res.status(502).send("Could not read the authorized Instagram profile. Confirm it is a Business or Creator account.");
    }

    const session = crypto.randomBytes(32).toString("hex");
    sessions.set(session, { accessToken, userId: String(me.user_id || tokenData.user_id || ""), username: me.username, accountType: me.account_type || "unknown", createdAt: Date.now() });
    // This in-memory prototype loses sessions when the server restarts. Store sessions securely in a database before production use.
    const appUrl = new URL(APP_REDIRECT_URI);
    appUrl.searchParams.set("session", session);
    appUrl.searchParams.set("username", me.username);
    appUrl.searchParams.set("account_type", me.account_type || "unknown");
    res.redirect(302, appUrl.toString());
  } catch (err) {
    console.error("OAuth callback error:", err?.message || "unknown error");
    res.status(502).send("Instagram connection failed. Please try again.");
  }
});

app.get("/api/me", (req, res) => {
  const session = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const record = sessions.get(session);
  if (!record) return res.status(401).json({ error: "session_invalid", message: "Please reconnect Instagram." });
  res.set("Cache-Control", "no-store");
  res.json({ username: record.username, account_type: record.accountType, user_id: record.userId });
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`InstaTracker OAuth backend listening on port ${PORT}`);
});
