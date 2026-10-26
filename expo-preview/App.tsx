import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const C = { bg:'#09090B', panel:'#18181B', panel2:'#202024', border:'#303036', text:'#FAFAFA', muted:'#A1A1AA', dim:'#71717A', pink:'#E1306C', lilac:'#A78BFA', green:'#34D399', yellow:'#FBBF24', red:'#FB7185' };
type Tab = 'Home' | 'Followers' | 'Compare' | 'Insights' | 'Settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('Home');
  const [connected, setConnected] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const nav: {key:Tab; icon:string; label:string}[] = [
    {key:'Home',icon:'⌂',label:'Home'},
    {key:'Followers',icon:'♙',label:'Followers'},
    {key:'Compare',icon:'⇄',label:'Compare'},
    {key:'Insights',icon:'▥',label:'Insights'},
    {key:'Settings',icon:'⚙',label:'Settings'},
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.app}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
          <View style={s.header}>
            <View style={s.brandRow}><View style={s.logo}><Text style={s.logoText}>◎</Text></View><View><Text style={s.brand}>InstaTracker</Text><Text style={s.kicker}>SOCIAL ACCOUNT INSIGHTS</Text></View></View>
            <TouchableOpacity style={s.bell} onPress={() => setNotifications(!notifications)}><Text style={s.bellText}>{notifications ? '♧' : '♧'}</Text><View style={[s.dot,!notifications&&{backgroundColor:C.dim}]} /></TouchableOpacity>
          </View>

          {tab === 'Home' && <>
            <View style={s.welcome}><View style={s.pill}><View style={s.liveDot}/><Text style={s.pillText}>YOUR SOCIAL OVERVIEW</Text></View><Text style={s.heroTitle}>Your Instagram,{"\n"}made clearer.</Text><Text style={s.body}>Understand your audience with clear, privacy-first insights.</Text><TouchableOpacity style={s.primary} onPress={() => setConnected(!connected)}><Text style={s.primaryText}>{connected ? 'Demo profile connected ✓' : '＋  Connect Instagram'}</Text></TouchableOpacity><Text style={s.micro}>{connected ? 'Preview mode only. No Instagram account was connected.' : 'Real connection requires a configured Meta app and secure backend.'}</Text></View>
            <View style={s.sectionHead}><Text style={s.sectionTitle}>At a glance</Text><Text style={s.sectionHint}>ACCOUNT SNAPSHOT</Text></View>
            <View style={s.grid}>
              <Metric label="Followers" value={demoLoaded?'1,284':'—'} change={demoLoaded?'+4.8%':'Connect account'} icon="♙" tint={C.pink}/>
              <Metric label="Following" value={demoLoaded?'846':'—'} change={demoLoaded?'Last import':'Import data'} icon="⇄" tint={C.lilac}/>
              <Metric label="Not following back" value={demoLoaded?'73':'—'} change={demoLoaded?'From sample data':'Compare lists'} icon="↗" tint={C.yellow}/>
              <Metric label="New followers" value={demoLoaded?'28':'—'} change={demoLoaded?'Sample period':'Track over time'} icon="＋" tint={C.green}/>
            </View>
            <View style={s.sectionHead}><Text style={s.sectionTitle}>Quick actions</Text></View>
            <View style={s.actionRow}><Quick icon="⇄" title="Compare lists" subtitle="Find differences" onPress={()=>setTab('Compare')}/><Quick icon="⇧" title="Import data" subtitle="Load your export" onPress={()=>setTab('Followers')}/></View>
            <View style={s.notice}><Text style={s.noticeTitle}>ⓘ  A quick privacy note</Text><Text style={s.body}>Instagram does not provide an official API to reveal profile visitors or the people who searched for you. Avoid apps claiming they can show this.</Text></View>
          </>}

          {tab === 'Followers' && <>
            <PageTitle eyebrow="AUDIENCE TOOLS" title="Followers" subtitle="Bring in your own Instagram data to review your audience."/>
            <View style={s.card}><View style={s.iconBubble}><Text style={s.iconBubbleText}>⇧</Text></View><Text style={s.cardTitle}>Import Instagram data</Text><Text style={s.body}>Download your information from Instagram Accounts Center, then use it to compare follower and following lists. File selection is not enabled in this preview yet.</Text><TouchableOpacity style={s.primary} onPress={()=>{setDemoLoaded(true);}}><Text style={s.primaryText}>Load sample data</Text></TouchableOpacity><Text style={s.micro}>Loads clearly labelled demo numbers only — no personal data is read.</Text></View>
            <View style={s.card}><Text style={s.cardTitle}>What you can check</Text><Bullet text="Accounts you follow that may not follow you back"/><Bullet text="Followers and following totals from an imported snapshot"/><Bullet text="Changes between two exports, once history is available"/></View>
            {demoLoaded && <View style={s.success}><Text style={s.successText}>✓ Sample data loaded for preview. These are not your real account numbers.</Text></View>}
          </>}

          {tab === 'Compare' && <>
            <PageTitle eyebrow="LIST COMPARISON" title="Compare accounts" subtitle="Compare two follower snapshots without sharing your password."/>
            <View style={s.card}><Text style={s.cardTitle}>Your comparison</Text><View style={s.compareLine}><Text style={s.compareLabel}>Followers list</Text><Text style={s.compareValue}>{demoLoaded?'1,284 sample':'Not imported'}</Text></View><View style={s.hr}/><View style={s.compareLine}><Text style={s.compareLabel}>Following list</Text><Text style={s.compareValue}>{demoLoaded?'846 sample':'Not imported'}</Text></View><TouchableOpacity style={s.primary} onPress={()=>setDemoLoaded(true)}><Text style={s.primaryText}>{demoLoaded?'Refresh sample comparison':'Try sample comparison'}</Text></TouchableOpacity></View>
            <View style={s.card}><Text style={s.cardTitle}>Comparison results</Text>{demoLoaded ? <><Result label="Not following back" value="73 sample accounts" color={C.yellow}/><Result label="Mutual connections" value="773 sample accounts" color={C.green}/><Result label="New since last snapshot" value="28 sample accounts" color={C.lilac}/></> : <Text style={s.body}>Import your Instagram export to see results here. Sample results can be used to preview this screen.</Text>}</View>
          </>}

          {tab === 'Insights' && <>
            <PageTitle eyebrow="PERFORMANCE" title="Insights" subtitle="A simple place for supported account metrics and report history."/>
            <View style={s.card}><Text style={s.cardTitle}>Audience growth</Text><View style={s.chart}>{[32,48,40,64,53,76,68].map((h,i)=><View key={i} style={s.barWrap}><View style={[s.bar,{height:h,backgroundColor:i===5?C.pink:'#593047'}]}/><Text style={s.chartLabel}>{['M','T','W','T','F','S','S'][i]}</Text></View>)}</View><Text style={s.micro}>Illustrative chart only. Real insights appear when supported data is connected.</Text></View>
            <View style={s.grid}><Metric label="Engagement" value="—" change="Requires eligible insights" icon="♡" tint={C.pink}/><Metric label="Reach" value="—" change="Requires eligible insights" icon="◉" tint={C.lilac}/></View>
            <View style={s.notice}><Text style={s.noticeTitle}>Metrics availability</Text><Text style={s.body}>Official insights access depends on Instagram account type, Meta app configuration, permissions, and review status.</Text></View>
          </>}

          {tab === 'Settings' && <>
            <PageTitle eyebrow="PREFERENCES" title="Settings" subtitle="Control this app preview and understand how your data is handled."/>
            <View style={s.card}><Text style={s.cardTitle}>App preferences</Text><SettingRow title="Notifications" subtitle="Preview toggle only" value={notifications} onPress={()=>setNotifications(!notifications)}/><View style={s.hr}/><SettingRow title="Demo data" subtitle={demoLoaded?'Sample data loaded':'No sample data loaded'} value={demoLoaded} onPress={()=>setDemoLoaded(!demoLoaded)}/></View>
            <View style={s.card}><Text style={s.cardTitle}>Account connection</Text><Text style={s.body}>The Instagram connection button is currently a UI demo. It does not sign in, collect credentials, or connect to Meta.</Text><TouchableOpacity style={s.secondary} onPress={()=>setConnected(false)}><Text style={s.secondaryText}>Reset demo connection</Text></TouchableOpacity></View>
            <View style={s.card}><Text style={s.cardTitle}>Privacy & safety</Text><Bullet text="Never enter your Instagram password into unofficial tracker apps."/><Bullet text="Use an official data export for follower comparisons."/><Bullet text="Profile visitor and individual searcher identities are not available through the official API."/></View>
            <Text style={s.version}>INSTATRACKER PREVIEW • VERSION 1.0.0</Text>
          </>}
        </ScrollView>
        <View style={s.nav}>{nav.map(item=><TouchableOpacity key={item.key} onPress={()=>setTab(item.key)} style={s.navItem}><Text style={[s.navIcon,tab===item.key&&s.navSelected]}>{item.icon}</Text><Text style={[s.navLabel,tab===item.key&&s.navSelected]}>{item.label}</Text>{tab===item.key&&<View style={s.navIndicator}/>}</TouchableOpacity>)}</View>
      </View>
    </SafeAreaView>
  );
}
function PageTitle({eyebrow,title,subtitle}:{eyebrow:string;title:string;subtitle:string}){return <View style={s.pageTitle}><Text style={s.pageEyebrow}>{eyebrow}</Text><Text style={s.pageHeading}>{title}</Text><Text style={s.body}>{subtitle}</Text></View>}
function Metric({label,value,change,icon,tint}:{label:string;value:string;change:string;icon:string;tint:string}){return <View style={s.metric}><View style={[s.metricIcon,{backgroundColor:tint+'22'}]}><Text style={{color:tint,fontSize:18,fontWeight:'800'}}>{icon}</Text></View><Text style={s.metricLabel}>{label}</Text><Text style={s.metricValue}>{value}</Text><Text style={s.metricChange}>{change}</Text></View>}
function Quick({icon,title,subtitle,onPress}:{icon:string;title:string;subtitle:string;onPress:()=>void}){return <TouchableOpacity style={s.quick} onPress={onPress}><Text style={s.quickIcon}>{icon}</Text><Text style={s.quickTitle}>{title}</Text><Text style={s.quickSub}>{subtitle}</Text></TouchableOpacity>}
function Bullet({text}:{text:string}){return <View style={s.bulletRow}><Text style={s.bullet}>•</Text><Text style={s.bulletText}>{text}</Text></View>}
function Result({label,value,color}:{label:string;value:string;color:string}){return <View style={s.result}><View style={[s.resultDot,{backgroundColor:color}]}/><Text style={s.resultLabel}>{label}</Text><Text style={s.resultValue}>{value}</Text></View>}
function SettingRow({title,subtitle,value,onPress}:{title:string;subtitle:string;value:boolean;onPress:()=>void}){return <TouchableOpacity style={s.setting} onPress={onPress}><View style={{flex:1}}><Text style={s.settingTitle}>{title}</Text><Text style={s.settingSub}>{subtitle}</Text></View><View style={[s.switch,{backgroundColor:value?C.pink:'#3F3F46'}]}><View style={[s.switchKnob,value&&{alignSelf:'flex-end'}]}/></View></TouchableOpacity>}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},app:{flex:1,backgroundColor:C.bg},content:{paddingHorizontal:18,paddingTop:12,paddingBottom:28},
 header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:24},brandRow:{flexDirection:'row',alignItems:'center',gap:11},logo:{width:43,height:43,borderRadius:15,backgroundColor:C.pink,alignItems:'center',justifyContent:'center'},logoText:{color:'#fff',fontSize:29,fontWeight:'800',marginTop:-3},brand:{color:C.text,fontSize:20,fontWeight:'900',letterSpacing:-.5},kicker:{color:C.dim,fontSize:8,fontWeight:'800',letterSpacing:1.4,marginTop:3},bell:{width:42,height:42,borderRadius:14,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'},bellText:{color:C.text,fontSize:20},dot:{position:'absolute',right:10,top:9,width:6,height:6,borderRadius:3,backgroundColor:C.pink},
 welcome:{padding:22,borderRadius:25,backgroundColor:'#20131B',borderWidth:1,borderColor:'#4A2033',overflow:'hidden'},pill:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:7,backgroundColor:'#3B1B2B',paddingHorizontal:10,paddingVertical:7,borderRadius:20},liveDot:{width:6,height:6,borderRadius:3,backgroundColor:C.green},pillText:{fontSize:9,fontWeight:'800',letterSpacing:1.1,color:'#F9A8D4'},heroTitle:{fontSize:32,lineHeight:37,fontWeight:'900',letterSpacing:-.8,color:C.text,marginTop:18},body:{color:C.muted,fontSize:13,lineHeight:20,marginTop:8},primary:{marginTop:18,backgroundColor:C.pink,borderRadius:14,paddingVertical:14,paddingHorizontal:14,alignItems:'center'},primaryText:{color:'#fff',fontSize:13,fontWeight:'800'},micro:{color:C.dim,fontSize:10,lineHeight:15,marginTop:10},sectionHead:{marginTop:25,marginBottom:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{fontSize:17,fontWeight:'800',color:C.text},sectionHint:{fontSize:9,color:C.dim,letterSpacing:1,fontWeight:'800'},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:10},metric:{width:'48%',flexGrow:1,minHeight:144,padding:15,borderRadius:19,backgroundColor:C.panel,borderWidth:1,borderColor:'#29292F'},metricIcon:{width:34,height:34,borderRadius:11,alignItems:'center',justifyContent:'center',marginBottom:12},metricLabel:{color:C.muted,fontSize:11,fontWeight:'600'},metricValue:{color:C.text,fontSize:25,fontWeight:'900',marginTop:5},metricChange:{color:C.dim,fontSize:9,marginTop:4},
 actionRow:{flexDirection:'row',gap:10},quick:{flex:1,padding:15,borderRadius:17,backgroundColor:C.panel,borderWidth:1,borderColor:C.border},quickIcon:{fontSize:23,color:'#F9A8D4'},quickTitle:{color:C.text,fontSize:13,fontWeight:'800',marginTop:11},quickSub:{color:C.dim,fontSize:10,marginTop:4},
 notice:{marginTop:17,padding:16,borderRadius:17,backgroundColor:'#17151B',borderWidth:1,borderColor:'#3A2B42'},noticeTitle:{color:'#F9A8D4',fontSize:12,fontWeight:'800'},
 nav:{flexDirection:'row',paddingTop:10,paddingBottom:6,backgroundColor:'#111113',borderTopWidth:1,borderTopColor:'#29292F'},navItem:{flex:1,alignItems:'center',justifyContent:'center',paddingTop:4,gap:3},navIcon:{fontSize:20,color:C.dim},navLabel:{fontSize:9,fontWeight:'700',color:C.dim},navSelected:{color:'#F9A8D4'},navIndicator:{width:15,height:3,borderRadius:2,backgroundColor:C.pink,marginTop:1},
 pageTitle:{marginTop:4,marginBottom:21},pageEyebrow:{color:C.pink,fontSize:10,fontWeight:'900',letterSpacing:1.5},pageHeading:{color:C.text,fontSize:31,fontWeight:'900',letterSpacing:-.7,marginTop:8},
 card:{backgroundColor:C.panel,borderWidth:1,borderColor:C.border,borderRadius:20,padding:18,marginBottom:14},iconBubble:{width:48,height:48,borderRadius:16,backgroundColor:'#3B1B2B',alignItems:'center',justifyContent:'center',marginBottom:14},iconBubbleText:{fontSize:25,color:'#F9A8D4'},cardTitle:{color:C.text,fontSize:16,fontWeight:'800',marginBottom:6},success:{backgroundColor:'#10251F',borderWidth:1,borderColor:'#205C49',borderRadius:14,padding:14},successText:{color:C.green,fontSize:12,lineHeight:18,fontWeight:'700'},compareLine:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:14},compareLabel:{color:C.muted,fontSize:12},compareValue:{color:C.text,fontSize:12,fontWeight:'800'},hr:{height:1,backgroundColor:C.border},result:{flexDirection:'row',alignItems:'center',paddingVertical:12,gap:9},resultDot:{width:8,height:8,borderRadius:4},resultLabel:{color:C.muted,fontSize:12,flex:1},resultValue:{color:C.text,fontSize:11,fontWeight:'800'},bulletRow:{flexDirection:'row',alignItems:'flex-start',gap:9,marginTop:12},bullet:{color:C.pink,fontSize:18,lineHeight:20},bulletText:{flex:1,color:C.muted,fontSize:12,lineHeight:19},chart:{height:135,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',paddingTop:20,paddingBottom:4},barWrap:{alignItems:'center',justifyContent:'flex-end',height:110,gap:8},bar:{width:19,borderRadius:7,minHeight:10},chartLabel:{fontSize:10,color:C.dim},setting:{flexDirection:'row',alignItems:'center',paddingVertical:14},settingTitle:{color:C.text,fontSize:13,fontWeight:'700'},settingSub:{color:C.dim,fontSize:10,marginTop:4},switch:{width:42,height:24,borderRadius:20,padding:3,justifyContent:'center'},switchKnob:{width:18,height:18,borderRadius:9,backgroundColor:'#fff'},secondary:{alignSelf:'flex-start',borderWidth:1,borderColor:'#55555E',borderRadius:12,paddingVertical:11,paddingHorizontal:14,marginTop:15},secondaryText:{color:C.text,fontSize:12,fontWeight:'700'},version:{textAlign:'center',color:C.dim,fontSize:9,letterSpacing:1.4,marginTop:10}
});
