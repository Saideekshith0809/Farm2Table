import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
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

export default function FarmerDashboardScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const stats = { totalEarnings: 25000, pendingOrders: 8, activeProducts: 12, completedOrders: 45 };
  const recentOrders = [
    { id: 1, buyer: 'Rahul Mehta', product: 'Fresh Tomatoes', quantity: 5, amount: 200, status: 'Pending', time: '2 min ago' },
    { id: 2, buyer: 'Sneha Patel', product: 'Organic Spinach', quantity: 3, amount: 90, status: 'Accepted', time: '15 min ago' },
    { id: 3, buyer: 'Vikram Singh', product: 'Premium Mangoes', quantity: 2, amount: 240, status: 'Pending', time: '1 hr ago' },
  ];
  const statCards = [
    { icon: 'currency-inr', label: 'Earnings', value: `₹${stats.totalEarnings.toLocaleString()}`, gradient: ['#00C853', '#00E676'] },
    { icon: 'clock-outline', label: 'Pending', value: stats.pendingOrders, gradient: ['#FF9800', '#FFB74D'] },
    { icon: 'package-variant', label: 'Products', value: stats.activeProducts, gradient: ['#2196F3', '#42A5F5'] },
    { icon: 'check-circle', label: 'Completed', value: stats.completedOrders, gradient: ['#7C4DFF', '#B388FF'] },
  ];
  const headerScale = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0.95], extrapolate: 'clamp' });

  return (
    <View style={s.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <Animated.View style={{ transform: [{ scale: headerScale }] }}>
          <LinearGradient colors={['rgba(46,125,50,0.1)', 'rgba(46,125,50,0.02)', 'transparent']} style={s.hero}>
            <View style={s.heroRow}>
              <View>
                <Text style={s.greeting}>Welcome Back! 🌾</Text>
                <Text style={s.heroTitle}>Your Farm{'\n'}Dashboard</Text>
              </View>
              <TouchableOpacity style={s.notifBtn}>
                <Icon name="bell-outline" size={24} color="#2E7D32" />
                <View style={s.notifDot} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <AnimatedSection delay={100}>
          <View style={s.statsGrid}>
            {statCards.map((st, i) => (
              <View key={i} style={s.statWrap}>
                <LinearGradient colors={st.gradient} style={s.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <View style={s.statIconBg}><Icon name={st.icon} size={24} color="#FFFFFF" /></View>
                  <Text style={s.statVal}>{st.value}</Text>
                  <Text style={s.statLbl}>{st.label}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
        </AnimatedSection>

        {/* Chart */}
        <AnimatedSection delay={200}>
          <View style={s.section}>
            <View style={s.secHeader}>
              <Text style={s.secTitle}>Revenue Overview</Text>
              <View style={s.periodBadge}><Text style={s.periodText}>This Week</Text></View>
            </View>
            <View style={s.chartCard}>
              <View style={s.chartBars}>
                {[40, 65, 50, 78, 90, 60, 85].map((v, i) => (
                  <View key={i} style={s.barWrap}>
                    <LinearGradient colors={i === 4 ? ['#2E7D32', '#43A047'] : ['#F0F0F0', '#E0E0E0']} style={[s.bar, { height: v }]} />
                    <Text style={s.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </AnimatedSection>

        {/* Orders */}
        <AnimatedSection delay={300}>
          <View style={s.section}>
            <View style={s.secHeader}>
              <Text style={s.secTitle}>Recent Orders</Text>
              <TouchableOpacity><Text style={s.seeAll}>View All →</Text></TouchableOpacity>
            </View>
            {recentOrders.map((o, i) => (
              <AnimatedSection key={o.id} delay={400 + i * 100}>
                <View style={s.orderCard}>
                  <LinearGradient colors={o.status === 'Pending' ? ['#FFA000', '#FFB300'] : ['#2E7D32', '#43A047']} style={s.orderAvatar}>
                    <Text style={s.avatarTxt}>{o.buyer.charAt(0)}</Text>
                  </LinearGradient>
                  <View style={s.orderInfo}>
                    <Text style={s.orderBuyer}>{o.buyer}</Text>
                    <Text style={s.orderProd}>{o.product} · {o.quantity} kg</Text>
                  </View>
                  <View style={s.orderRight}>
                    <Text style={s.orderAmt}>₹{o.amount}</Text>
                    <View style={[s.statusDot, { backgroundColor: o.status === 'Pending' ? '#FFA000' : '#2E7D32' }]} />
                  </View>
                </View>
              </AnimatedSection>
            ))}
          </View>
        </AnimatedSection>

        {/* Actions */}
        <AnimatedSection delay={600}>
          <View style={s.section}>
            <Text style={s.secTitle}>Quick Actions</Text>
            <View style={s.actionsRow}>
              {[{ icon: 'plus-circle', label: 'Add Product', color: '#2E7D32' }, { icon: 'chart-line', label: 'Analytics', color: '#1976D2' }].map((a, i) => (
                <TouchableOpacity key={i} activeOpacity={0.8} style={s.actionCard}>
                  <View style={[s.actionCardInner, { backgroundColor: '#FFFFFF' }]}>
                    <View style={[s.actionIconBg, { backgroundColor: a.color + '15' }]}>
                      <Icon name={a.icon} size={32} color={a.color} />
                    </View>
                    <Text style={[s.actionText, { color: '#1A1C1A' }]}>{a.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </AnimatedSection>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  hero: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 16, color: '#5C635C', marginBottom: 6, fontWeight: '600' },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#1A1C1A', lineHeight: 40, letterSpacing: -1 },
  notifBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  notifDot: { position: 'absolute', top: 12, right: 14, width: 9, height: 9, borderRadius: 5, backgroundColor: '#E53935', borderWidth: 2, borderColor: '#FFFFFF' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, marginTop: 12 },
  statWrap: { width: '50%', padding: 8 },
  statCard: { borderRadius: 24, padding: 20, minHeight: 120, justifyContent: 'flex-end', elevation: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  statIconBg: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statVal: { fontSize: 26, fontWeight: '900', color: '#FFFFFF' },
  statLbl: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2, fontWeight: '700', textTransform: 'uppercase' },
  section: { marginTop: 32, paddingHorizontal: 20 },
  secHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  secTitle: { fontSize: 20, fontWeight: '800', color: '#1A1C1A', letterSpacing: -0.5 },
  seeAll: { color: '#2E7D32', fontSize: 14, fontWeight: '700' },
  periodBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  periodText: { fontSize: 12, color: '#2E7D32', fontWeight: '800' },
  chartCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 110, paddingHorizontal: 4 },
  barWrap: { alignItems: 'center', flex: 1 },
  bar: { width: 22, borderRadius: 11, marginBottom: 10 },
  barLabel: { fontSize: 11, color: '#9E9E9E', fontWeight: '700' },
  orderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8 },
  orderAvatar: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  orderInfo: { flex: 1, marginLeft: 16 },
  orderBuyer: { fontSize: 16, fontWeight: '700', color: '#1A1C1A' },
  orderProd: { fontSize: 13, color: '#9E9E9E', marginTop: 3 },
  orderRight: { alignItems: 'flex-end' },
  orderAmt: { fontSize: 18, fontWeight: '900', color: '#2E7D32' },
  statusDot: { width: 9, height: 9, borderRadius: 5, marginTop: 8 },
  actionsRow: { flexDirection: 'row', marginTop: 8, paddingHorizontal: 2 },
  actionCard: { flex: 1, marginRight: 12 },
  actionCardInner: { borderRadius: 24, padding: 20, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  actionIconBg: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  actionText: { fontSize: 14, fontWeight: '800' },
});
