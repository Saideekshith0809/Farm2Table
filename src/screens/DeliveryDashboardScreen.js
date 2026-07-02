import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AnimatedSection = ({ children, delay = 0 }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, delay, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
      {children}
    </Animated.View>
  );
};

export default function DeliveryDashboardScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const stats = {
    deliveriesToday: 8,
    earningsToday: 1250,
    rating: 4.9,
    activeTime: '5h 20m',
  };

  const currentTask = {
    id: 'DEL-992',
    buyer: 'Sarah Johnson',
    address: '123 Green Valley, Sector 4',
    items: 'Fresh Tomatoes, Organic Spinach',
    amount: 450,
    distance: '2.4 km',
    status: 'Picked Up',
  };

  const recentHistory = [
    { id: 1, buyer: 'Mike Ross', amount: 320, time: '20 min ago', status: 'Delivered' },
    { id: 2, buyer: 'Rachel Zane', amount: 580, time: '1 hr ago', status: 'Delivered' },
    { id: 3, buyer: 'Harvey Specter', amount: 210, time: '3 hrs ago', status: 'Delivered' },
  ];

  const headerScale = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0.95], extrapolate: 'clamp' });

  return (
    <View style={s.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Hero Header */}
        <Animated.View style={[s.heroContainer, { transform: [{ scale: headerScale }] }]}>
          <LinearGradient colors={['rgba(46,125,50,0.1)', 'rgba(46,125,50,0.02)', 'transparent']} style={s.heroGradient}>
            <View style={s.heroContent}>
              <View>
                <Text style={s.greeting}>Good Evening, Delivery Partner! 🛵</Text>
                <Text style={s.heroTitle}>Delivery{'\n'}Command Center</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsOnline(!isOnline)}
                activeOpacity={0.8}
                style={[s.statusToggle, isOnline ? s.statusOnline : s.statusOffline]}
              >
                <View style={[s.toggleIndicator, { backgroundColor: isOnline ? '#43A047' : '#E53935' }]} />
                <Text style={[s.statusText, { color: isOnline ? '#2E7D32' : '#E53935' }]}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Grid */}
        <AnimatedSection delay={100}>
          <View style={s.statsGrid}>
            {[
              { icon: 'bike', label: 'Deliveries', value: stats.deliveriesToday, gradient: ['#2E7D32', '#43A047'] },
              { icon: 'currency-inr', label: 'Earnings', value: `₹${stats.earningsToday}`, gradient: ['#1976D2', '#2196F3'] },
              { icon: 'star', label: 'Rating', value: stats.rating, gradient: ['#FFA000', '#FFB300'] },
              { icon: 'clock-outline', label: 'Online', value: stats.activeTime, gradient: ['#673AB7', '#7E57C2'] },
            ].map((stat, i) => (
              <View key={i} style={s.statWrap}>
                <LinearGradient colors={stat.gradient} style={s.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <View style={s.statIconBg}><Icon name={stat.icon} size={22} color="#FFFFFF" /></View>
                  <Text style={s.statVal}>{stat.value}</Text>
                  <Text style={s.statLbl}>{stat.label}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
        </AnimatedSection>

        {/* Active Task */}
        {isOnline && (
          <AnimatedSection delay={200}>
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Active Assignment</Text>
                <View style={s.taskBadge}>
                  <Text style={s.taskBadgeText}>{currentTask.id}</Text>
                </View>
              </View>
              <View style={s.activeCard}>
                <View style={s.activeCardInner}>
                  <View style={s.taskTop}>
                    <View style={s.taskAvatar}>
                      <Text style={s.avatarText}>{currentTask.buyer.charAt(0)}</Text>
                    </View>
                    <View style={s.taskInfo}>
                      <Text style={s.taskBuyer}>{currentTask.buyer}</Text>
                      <Text style={s.taskAddress}>{currentTask.address}</Text>
                    </View>
                    <View style={s.taskDistWrap}>
                      <Icon name="map-marker-distance" size={16} color="#2E7D32" />
                      <Text style={s.taskDist}>{currentTask.distance}</Text>
                    </View>
                  </View>
                  <View style={s.divider} />
                  <View style={s.taskDetails}>
                    <Text style={s.detailLabel}>ITEMS: <Text style={s.detailValue}>{currentTask.items}</Text></Text>
                    <Text style={s.detailLabel}>COLLECT: <Text style={s.detailValue}>₹{currentTask.amount}</Text></Text>
                  </View>
                  <View style={s.taskActions}>
                    <TouchableOpacity style={s.actionBtnSecondary}>
                      <Icon name="navigation" size={22} color="#2E7D32" />
                      <Text style={s.actionTextSecondary}>Navigate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.actionBtnPrimary}>
                      <LinearGradient colors={['#2E7D32', '#43A047']} style={s.actionGrad}>
                        <Icon name="check-all" size={22} color="#FFFFFF" />
                        <Text style={s.actionTextPrimary}>Complete</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </AnimatedSection>
        )}

        {/* Recent Deliveries */}
        <AnimatedSection delay={400}>
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Delivery History</Text>
              <TouchableOpacity><Text style={s.seeAll}>See All →</Text></TouchableOpacity>
            </View>
            {recentHistory.map((h, i) => (
              <View key={h.id} style={s.historyCard}>
                <View style={s.historyStatusIcon}>
                  <Icon name="check-circle" size={20} color="#2E7D32" />
                </View>
                <View style={s.historyInfo}>
                  <Text style={s.historyBuyer}>{h.buyer}</Text>
                  <Text style={s.historyTime}>{h.time}</Text>
                </View>
                <View style={s.historyRight}>
                  <Text style={s.historyAmount}>+₹{h.amount}</Text>
                  <Text style={s.historyStatusText}>Delivered</Text>
                </View>
              </View>
            ))}
          </View>
        </AnimatedSection>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  scrollContent: { paddingBottom: 20 },
  heroContainer: { paddingTop: 0 },
  heroGradient: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 13, color: '#5C635C', marginBottom: 6, fontWeight: '600' },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#1A1C1A', lineHeight: 38, letterSpacing: -1 },
  statusToggle: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  toggleIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusOnline: { borderColor: '#E8F5E9' },
  statusOffline: { borderColor: '#FFEBEE' },
  statusText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, marginTop: 12 },
  statWrap: { width: '50%', padding: 8 },
  statCard: { borderRadius: 24, padding: 18, minHeight: 110, justifyContent: 'flex-end', elevation: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  statIconBg: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statVal: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  statLbl: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.85)', marginTop: 2, textTransform: 'uppercase' },
  section: { marginTop: 32, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1A1C1A', letterSpacing: -0.5 },
  taskBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  taskBadgeText: { fontSize: 11, color: '#2E7D32', fontWeight: '900' },
  activeCard: { marginBottom: 10 },
  activeCardInner: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
  taskTop: { flexDirection: 'row', alignItems: 'center' },
  taskAvatar: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#43A047', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  taskInfo: { flex: 1, marginLeft: 16 },
  taskBuyer: { fontSize: 18, fontWeight: '800', color: '#1A1C1A' },
  taskAddress: { fontSize: 13, color: '#9E9E9E', marginTop: 3, fontWeight: '500' },
  taskDistWrap: { alignItems: 'center', backgroundColor: '#F9FAF9', padding: 8, borderRadius: 14 },
  taskDist: { fontSize: 12, color: '#2E7D32', fontWeight: '800', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  taskDetails: { marginBottom: 24 },
  detailLabel: { fontSize: 12, color: '#BDBDBD', fontWeight: '800', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  detailValue: { color: '#1A1C1A', fontWeight: '700', fontSize: 14 },
  taskActions: { flexDirection: 'row', gap: 12 },
  actionBtnSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 18, backgroundColor: '#F1F8F1', borderWidth: 1, borderColor: '#C8E6C9' },
  actionBtnPrimary: { flex: 1.5 },
  actionGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 18, elevation: 6, shadowColor: '#2E7D32', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  actionTextSecondary: { marginLeft: 8, fontSize: 15, fontWeight: '800', color: '#2E7D32' },
  actionTextPrimary: { marginLeft: 8, fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  seeAll: { color: '#2E7D32', fontSize: 14, fontWeight: '700' },
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 24, marginBottom: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  historyStatusIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F8F1', justifyContent: 'center', alignItems: 'center' },
  historyInfo: { flex: 1, marginLeft: 16 },
  historyBuyer: { fontSize: 16, fontWeight: '700', color: '#1A1C1A' },
  historyTime: { fontSize: 12, color: '#9E9E9E', marginTop: 3, fontWeight: '500' },
  historyRight: { alignItems: 'flex-end' },
  historyAmount: { fontSize: 17, fontWeight: '900', color: '#2E7D32' },
  historyStatusText: { fontSize: 10, color: '#4CAF50', fontWeight: '800', marginTop: 4 },
});
