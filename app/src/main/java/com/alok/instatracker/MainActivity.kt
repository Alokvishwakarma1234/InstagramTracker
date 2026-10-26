package com.alok.instatracker

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.weight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.CompareArrows
import androidx.compose.material.icons.filled.FileUpload
import androidx.compose.material.icons.filled.Insights
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Ink = Color(0xFF0D0F14)
private val Panel = Color(0xFF191D27)
private val Violet = Color(0xFF9C7BFF)
private val Muted = Color(0xFF9AA3B2)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { InstaTrackerApp() }
    }
}

@Composable
private fun InstaTrackerApp() {
    var selectedTab by remember { mutableIntStateOf(0) }

    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Violet,
            background = Ink,
            surface = Panel,
            onBackground = Color.White,
            onSurface = Color.White
        )
    ) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Ink
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                Box(modifier = Modifier.weight(1f)) {
                    when (selectedTab) {
                        0 -> DashboardScreen(onImport = { selectedTab = 1 })
                        1 -> ImportScreen()
                        else -> CompareScreen()
                    }
                }

                NavigationBar(containerColor = Panel) {
                    NavigationBarItem(
                        selected = selectedTab == 0,
                        onClick = { selectedTab = 0 },
                        icon = { Icon(Icons.Default.Analytics, contentDescription = "Dashboard") },
                        label = { Text("Home") }
                    )
                    NavigationBarItem(
                        selected = selectedTab == 1,
                        onClick = { selectedTab = 1 },
                        icon = { Icon(Icons.Default.FileUpload, contentDescription = "Import data") },
                        label = { Text("Import") }
                    )
                    NavigationBarItem(
                        selected = selectedTab == 2,
                        onClick = { selectedTab = 2 },
                        icon = { Icon(Icons.Default.CompareArrows, contentDescription = "Compare") },
                        label = { Text("Compare") }
                    )
                }
            }
        }
    }
}

@Composable
private fun DashboardScreen(onImport: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(horizontal = 20.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = Modifier.weight(1f)) {
                Text("INSTATRACKER", color = Violet, fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 2.sp)
                Text("Your account overview", color = Color.White, fontSize = 25.sp, fontWeight = FontWeight.Bold)
            }
            Icon(Icons.Default.Insights, contentDescription = null, tint = Violet)
        }

        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Panel)
        ) {
            Column(modifier = Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("YOUR INSTAGRAM DATA", color = Muted, fontSize = 11.sp, letterSpacing = 1.3.sp)
                Text("Import to get started", fontSize = 22.sp, fontWeight = FontWeight.SemiBold)
                Text(
                    "Bring in your Instagram data export to compare followers and following privately on this phone.",
                    color = Muted,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Button(onClick = onImport, modifier = Modifier.fillMaxWidth()) {
                    Icon(Icons.Default.FileUpload, contentDescription = null, modifier = Modifier.padding(end = 8.dp))
                    Text("Import Instagram data")
                }
            }
        }

        Text("OVERVIEW", color = Muted, fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.5.sp)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            MetricCard(title = "Followers", value = "—", subtitle = "Import data first", modifier = Modifier.weight(1f))
            MetricCard(title = "Following", value = "—", subtitle = "Import data first", modifier = Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            MetricCard(title = "Not following back", value = "—", subtitle = "Awaiting data", modifier = Modifier.weight(1f))
            MetricCard(title = "New / unfollowed", value = "—", subtitle = "Needs 2 imports", modifier = Modifier.weight(1f))
        }

        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF211C33))
        ) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Lock, contentDescription = null, tint = Violet)
                Spacer(Modifier.padding(4.dp))
                Column {
                    Text("Privacy-first", fontWeight = FontWeight.SemiBold)
                    Text("No Instagram password required. No visitor names are invented.", color = Muted, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
private fun MetricCard(title: String, value: String, subtitle: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Panel)
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(title, color = Muted, fontSize = 12.sp)
            Text(value, fontSize = 25.sp, fontWeight = FontWeight.Bold)
            Text(subtitle, color = Muted, fontSize = 10.sp)
        }
    }
}

@Composable
private fun ImportScreen() {
    Column(
        modifier = Modifier.fillMaxSize().padding(22.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Import data", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text(
            "The import flow will let you select your Instagram data export ZIP. Processing will happen on your phone.",
            color = Muted,
            fontSize = 14.sp
        )
        Card(shape = RoundedCornerShape(20.dp), colors = CardDefaults.cardColors(containerColor = Panel)) {
            Column(modifier = Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Icon(Icons.Default.FileUpload, contentDescription = null, tint = Violet)
                Text("Instagram data export", fontWeight = FontWeight.SemiBold)
                Text("Choose the ZIP exported through Instagram Accounts Center. Import functionality is the next implementation step.", color = Muted, fontSize = 13.sp)
            }
        }
    }
}

@Composable
private fun CompareScreen() {
    Column(
        modifier = Modifier.fillMaxSize().padding(22.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Compare accounts", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text("After importing data, this screen will show accounts you follow that do not appear in your follower list.", color = Muted, fontSize = 14.sp)
        Card(shape = RoundedCornerShape(20.dp), colors = CardDefaults.cardColors(containerColor = Panel)) {
            Column(modifier = Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(Icons.Default.CompareArrows, contentDescription = null, tint = Violet)
                Text("Waiting for imported data", fontWeight = FontWeight.SemiBold)
                Text("No comparison is calculated until your data is imported.", color = Muted, fontSize = 13.sp)
            }
        }
    }
}
