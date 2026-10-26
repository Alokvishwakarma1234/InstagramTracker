import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PINK = '#E1306C';
const muted = '#9CA3AF';

export default function App() {
  const [tab, setTab] = useState('Overview');
  const [connected, setConnected] = useState(false);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <ScrollView contentContainerStyle={s.page}>
        <View style={s.header}>
          <View><Text style={s.eyebrow}>SOCIAL INSIGHTS</Text><Text style={s.title}>InstaTracker</Text></View>
          <View style={s.avatar}><Text style={s.avatarText}>IT</Text></View>
        </View>
        <View style={s.hero}>
          <Text style={s.heroTag}>YOUR ACCOUNT, AT A GLANCE</Text>
          <Text style={s.heroTitle}>Understand your{"\n"}Instagram growth.</Text>
          <Text style={s.body}>Track available account insights and compare follower lists securely.</Text>
          <TouchableOpacity style={s.primary} onPress={() => setConnected(!connected)}>
            <Text style={s.primaryText}>{connected ? 'Demo connected ✓' : 'Connect Instagram'}</Text>
          </TouchableOpacity>
          <Text style={s.note}>{connected ? 'Preview mode only — no account was connected.' : 'Official login requires a configured Meta developer app and backend.'}</Text>
        </View>
        <View style={s.tabs}>{['Overview','Followers','Reports'].map(t => <TouchableOpacity key={t} onPress={() => setTab(t)} style={[s.tab, tab===t && s.tabActive]}><Text style={[s.tabText,tab===t&&s.tabTextActive]}>{t}</Text></TouchableOpacity>)}</View>
        <Text style={s.section}>{tab === 'Overview' ? 'Account overview' : tab === 'Followers' ? 'Follower tools' : 'Your reports'}</Text>
        {tab === 'Overview' ? <View style={s.stats}>
          <Stat label="Followers" value="—" hint="Connect account" />
          <Stat label="Following" value="—" hint="Connect account" />
          <Stat label="Engagement" value="—" hint="Insights access" />
          <Stat label="Growth" value="—" hint="Compare over time" />
        </View> : tab === 'Followers' ? <View style={s.card}><Text style={s.cardTitle}>Follower comparison</Text><Text style={s.body}>Import your Instagram data export to compare followers and following, and find accounts that may not follow you back.</Text><TouchableOpacity style={s.secondary} onPress={() => setConnected(true)}><Text style={s.secondaryText}>View demo state</Text></TouchableOpacity></View> : <View style={s.card}><Text style={s.cardTitle}>Reports</Text><Text style={s.body}>Your reports will appear here after supported data is connected or imported.</Text></View>}
        <View style={s.notice}><Text style={s.noticeTitle}>Privacy & accuracy</Text><Text style={s.body}>Instagram does not provide an official API for naming profile visitors or individual people who searched for your profile. This preview uses demo data only.</Text></View>
        <Text style={s.footer}>INSTATRACKER • PREVIEW BUILD</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({label, value, hint}: {label:string; value:string; hint:string}) {
  return <View style={s.stat}><Text style={s.statLabel}>{label}</Text><Text style={s.statValue}>{value}</Text><Text style={s.statHint}>{hint}</Text></View>;
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#09090B'}, page:{padding:20,paddingBottom:40},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:24},
  eyebrow:{color:PINK,fontSize:10,fontWeight:'800',letterSpacing:2}, title:{color:'#FAFAFA',fontSize:27,fontWeight:'800',marginTop:4},
  avatar:{width:44,height:44,borderRadius:15,backgroundColor:'#27272A',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#3F3F46'},
  avatarText:{color:'#FAFAFA',fontWeight:'800'},
  hero:{backgroundColor:'#18181B',borderRadius:24,padding:22,borderWidth:1,borderColor:'#3F3F46'},
  heroTag:{color:'#F9A8D4',fontSize:10,fontWeight:'800',letterSpacing:1.3}, heroTitle:{color:'#FFF',fontSize:29,fontWeight:'800',lineHeight:35,marginTop:12},
  body:{color:'#A1A1AA',fontSize:13,lineHeight:20,marginTop:10}, primary:{backgroundColor:PINK,borderRadius:14,paddingVertical:14,alignItems:'center',marginTop:18},
  primaryText:{color:'#FFF',fontWeight:'800',fontSize:14}, note:{color:'#71717A',fontSize:10,lineHeight:15,marginTop:10},
  tabs:{flexDirection:'row',backgroundColor:'#18181B',padding:4,borderRadius:14,marginTop:22},
  tab:{flex:1,alignItems:'center',paddingVertical:11,borderRadius:10},tabActive:{backgroundColor:'#3F1D2D'},tabText:{color:muted,fontSize:12,fontWeight:'700'},tabTextActive:{color:'#F9A8D4'},
  section:{color:'#FAFAFA',fontSize:18,fontWeight:'800',marginTop:24,marginBottom:12},
  stats:{flexDirection:'row',flexWrap:'wrap',gap:10},stat:{width:'48%',flexGrow:1,backgroundColor:'#18181B',borderRadius:18,padding:16,borderWidth:1,borderColor:'#27272A'},
  statLabel:{color:'#A1A1AA',fontSize:12},statValue:{color:'#FFF',fontSize:26,fontWeight:'800',marginTop:8},statHint:{color:'#71717A',fontSize:10,marginTop:5},
  card:{backgroundColor:'#18181B',borderRadius:18,padding:18,borderWidth:1,borderColor:'#27272A'},cardTitle:{color:'#FAFAFA',fontSize:16,fontWeight:'800'},
  secondary:{alignSelf:'flex-start',paddingVertical:10,paddingHorizontal:14,borderRadius:10,borderWidth:1,borderColor:'#52525B',marginTop:16},secondaryText:{color:'#FAFAFA',fontWeight:'700',fontSize:12},
  notice:{marginTop:18,backgroundColor:'#111827',borderRadius:16,padding:16,borderWidth:1,borderColor:'#1F2937'},noticeTitle:{color:'#FDE68A',fontSize:13,fontWeight:'800'},
  footer:{color:'#52525B',fontSize:9,letterSpacing:2,textAlign:'center',marginTop:28}
});
