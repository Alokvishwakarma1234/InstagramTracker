package com.alok.instatracker

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.weight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

private val Ink = Color(0xFF0D0F14)
private val Panel = Color(0xFF191D27)
private val Violet = Color(0xFF9C7BFF)
private val Muted = Color(0xFF9AA3B2)

class MainActivity : ComponentActivity() {
    private val prefs by lazy { getSharedPreferences("instatracker", MODE_PRIVATE) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleOAuthIntent(intent)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme(primary = Violet, background = Ink, surface = Panel, onBackground = Color.White, onSurface = Color.White)) {
                InstaTrackerApp(
                    initialHandle = prefs.getString("session_handle", null),
                    initialUsername = prefs.getString("username", null),
                    onConnect = { openInstagramLogin() },
                    onDisconnect = { disconnect() },
                    onRefreshProfile = { fetchProfile() }
                )
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleOAuthIntent(intent)
    }

    private fun baseUrl(): String = BuildConfig.API_BASE_URL.trimEnd('/')

    private fun openInstagramLogin() {
        if (baseUrl().contains("YOUR_BACKEND_HOST")) {
            notifyApp("Setup required: deploy backend and set API_BASE_URL in app/build.gradle.kts.")
            return
        }
        try {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("${baseUrl()}/auth/instagram")))
        } catch (_: Exception) {
            notifyApp("Could not open the browser.")
        }
    }

    private fun handleOAuthIntent(intent: Intent?) {
        val uri = intent?.data ?: return
        if (uri.scheme != "instatracker" || uri.host != "oauth" || uri.path != "/callback") return
        val error = uri.getQueryParameter("error")
        if (!error.isNullOrBlank()) {
            notifyApp(error)
            return
        }
        val ticket = uri.getQueryParameter("session")
        if (ticket.isNullOrBlank()) {
            notifyApp("Instagram connection did not return a session. Please retry.")
            return
        }
        Thread {
            try {
                val body = JSONObject().put("session", ticket).toString()
                val response = request("POST", "/api/mobile/session", body = body)
                val handle = response.getString("sessionHandle")
                prefs.edit().putString("session_handle", handle).apply()
                runOnUiThread {
                    notifyApp("Instagram authorization completed. Loading profile…")
                    setContent {
                        MaterialTheme(colorScheme = darkColorScheme(primary = Violet, background = Ink, surface = Panel, onBackground = Color.White, onSurface = Color.White)) {
                            InstaTrackerApp(
                                initialHandle = handle,
                                initialUsername = prefs.getString("username", null),
                                onConnect = { openInstagramLogin() },
                                onDisconnect = { disconnect() },
                                onRefreshProfile = { fetchProfile() }
                            )
                        }
                    }
                }
            } catch (_: Exception) {
                notifyApp("Could not finish connection. Check the backend URL and try again.")
            }
        }.start()
    }

    private fun fetchProfile(): Pair<String?, String?> {
        val handle = prefs.getString("session_handle", null) ?: return null to "Connect Instagram first."
        return try {
            val response = request("GET", "/api/me", token = handle)
            val username = response.optString("username").takeIf { it.isNotBlank() && it != "null" }
            prefs.edit().putString("username", username).apply()
            username to null
        } catch (e: Exception) {
            null to (e.message ?: "Could not load profile.")
        }
    }

    private fun disconnect() {
        val handle = prefs.getString("session_handle", null)
        if (handle != null && !baseUrl().contains("YOUR_BACKEND_HOST")) {
            Thread { try { request("DELETE", "/api/session", token = handle) } catch (_: Exception) {} }.start()
        }
        prefs.edit().remove("session_handle").remove("username").apply()
        notifyApp("Disconnected from InstaTracker.")
    }

    private fun request(method: String, path: String, body: String? = null, token: String? = null): JSONObject {
        val connection = (URL(baseUrl() + path).openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 15000
            readTimeout = 15000
            setRequestProperty("Accept", "application/json")
            if (body != null) {
                doOutput = true
                setRequestProperty("Content-Type", "application/json")
            }
            if (token != null) setRequestProperty("Authorization", "Bearer $token")
        }
        try {
            if (body != null) connection.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            val code = connection.responseCode
            val stream = if (code in 200..299) connection.inputStream else connection.errorStream
            val text = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            if (code !in 200..299) throw IllegalStateException(JSONObject(text).optString("error", "Request failed ($code)"))
            return if (text.isBlank()) JSONObject() else JSONObject(text)
        } finally {
            connection.disconnect()
        }
    }

    private fun notifyApp(message: String) {
        runOnUiThread {
            setContent {
                MaterialTheme(colorScheme = darkColorScheme(primary = Violet, background = Ink, surface = Panel, onBackground = Color.White, onSurface = Color.White)) {
                    InstaTrackerApp(
                        initialHandle = prefs.getString("session_handle", null),
                        initialUsername = prefs.getString("username", null),
                        initialMessage = message,
                        onConnect = { openInstagramLogin() },
                        onDisconnect = { disconnect() },
                        onRefreshProfile = { fetchProfile() }
                    )
                }
            }
        }
    }
}

@Composable
private fun InstaTrackerApp(
    initialHandle: String?,
    initialUsername: String?,
    initialMessage: String? = null,
    onConnect: () -> Unit,
    onDisconnect: () -> Unit,
    onRefreshProfile: () -> Pair<String?, String?>
) {
    var connected by remember { mutableStateOf(!initialHandle.isNullOrBlank()) }
    var username by remember { mutableStateOf(initialUsername) }
    var message by remember { mutableStateOf(initialMessage) }
    var loading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Surface(modifier = Modifier.fillMaxSize(), color = Ink) {
        Column(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text("INSTATRACKER", color = Violet, fontSize = 13.sp, fontWeight = FontWeight.Bold, letterSpacing = 2.sp)
            Text(if (connected) "Account connection" else "Connect your Instagram", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text(
                if (connected) "Instagram authorization is saved on this device. Only official API fields are shown."
                else "Sign in on Instagram's official website. InstaTracker never asks for or stores your Instagram password.",
                color = Muted, fontSize = 14.sp
            )
            Card(shape = RoundedCornerShape(22.dp), colors = CardDefaults.cardColors(containerColor = Panel)) {
                Column(modifier = Modifier.fillMaxWidth().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Icon(if (connected) Icons.Default.Lock else Icons.Default.OpenInBrowser, contentDescription = null, tint = Violet)
                    Text(if (connected) "Connected" else "Official Instagram Login", fontSize = 19.sp, fontWeight = FontWeight.SemiBold)
                    if (connected) {
                        Text(username?.let { "@$it" } ?: "Authorized account", color = Color.White, fontSize = 18.sp)
                        Text("Available now: basic profile information, if granted by Meta.", color = Muted, fontSize = 13.sp)
                        Button(
                            onClick = {
                                loading = true
                                scope.launch {
                                    val result = withContext(Dispatchers.IO) { onRefreshProfile() }
                                    username = result.first ?: username
                                    message = result.second ?: if (username != null) "Profile loaded." else "Connected; username was not returned."
                                    loading = false
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            enabled = !loading
                        ) {
                            if (loading) CircularProgressIndicator()
                            else Text("Refresh profile")
                        }
                        OutlinedButton(onClick = { onDisconnect(); connected = false; username = null }, modifier = Modifier.fillMaxWidth()) {
                            Text("Disconnect")
                        }
                    } else {
                        Text("Instagram Login requires a configured Meta Developer app and deployed HTTPS backend. Personal accounts may not be eligible for this API.", color = Muted, fontSize = 13.sp)
                        Button(onClick = onConnect, modifier = Modifier.fillMaxWidth()) {
                            Icon(Icons.Default.OpenInBrowser, contentDescription = null, modifier = Modifier.padding(end = 8.dp))
                            Text("Continue with Instagram")
                        }
                    }
                }
            }
            if (!message.isNullOrBlank()) {
                Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color(0xFF211C33))) {
                    Text(message!!, modifier = Modifier.padding(14.dp), color = Color.White, fontSize = 13.sp)
                }
            }
            Spacer(Modifier.weight(1f))
            Text("Not available through Instagram's official API: profile visitors, individual profile searches, or a list of people who blocked you. These are never fabricated.", color = Muted, fontSize = 12.sp)
        }
    }
}
