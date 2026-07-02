import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    alert('Logged out successfully. Please restart the app.');
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'account-edit-outline', label: 'Edit Profile', color: '#00C853' },
        { icon: 'map-marker-outline', label: 'Addresses', color: '#42A5F5' },
        { icon: 'credit-card-outline', label: 'Payment Methods', color: '#FF9800' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'bell-outline', label: 'Notifications', color: '#E040FB' },
        { icon: 'translate', label: 'Language', subtitle: 'English', color: '#00BCD4' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', color: '#69F0AE' },
        { icon: 'shield-check-outline', label: 'Privacy Policy', color: '#7C4DFF' },
        { icon: 'file-document-outline', label: 'Terms & Conditions', color: '#FFD54F' },
      ],
    },
  ];

  const avatarScale = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0.75], extrapolate: 'clamp' });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          <View style={styles.profileCard}>
            <Animated.View style={[styles.avatarContainer, { transform: [{ scale: avatarScale }] }]}>
              <LinearGradient colors={['#2E7D32', '#43A047']} style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </LinearGradient>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Icon name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john.doe@example.com</Text>
            <Text style={styles.phone}>+91 98765 43210</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Addresses</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₹2.4k</Text>
                <Text style={styles.statLabel}>Spent</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, sIdx) => (
          <AnimatedSection key={sIdx} section={section} index={sIdx} />
        ))}

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7} style={styles.logoutButton}>
            <Icon name="logout" size={20} color="#E53935" />
            <Text style={styles.logoutText}>Logout from Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0 · Made with ❤️ for Farmers</Text>
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

function AnimatedSection({ section, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, delay: (index + 1) * 150, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.sectionCard}>
          {section.items.map((item, iIdx) => (
            <TouchableOpacity key={iIdx} activeOpacity={0.6} style={styles.menuItem} onPress={() => alert(item.label)}>
              <View style={[styles.menuIconWrapper, { backgroundColor: `${item.color}10` }]}>
                <Icon name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
              </View>
              <Icon name="chevron-right" size={20} color="#E0E0E0" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: { paddingTop: 60, paddingHorizontal: 20 },
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 36, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#FFFFFF' },
  editAvatarBtn: { position: 'absolute', bottom: -4, right: -4, width: 34, height: 34, borderRadius: 12, backgroundColor: '#43A047', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF', elevation: 2 },
  name: { fontSize: 26, fontWeight: '900', color: '#1A1C1A', marginTop: 18, letterSpacing: -0.5 },
  email: { fontSize: 14, color: '#9E9E9E', marginTop: 4, fontWeight: '500' },
  phone: { fontSize: 13, color: '#C0C0C0', marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 28, backgroundColor: '#F9FAF9', borderRadius: 20, padding: 18, width: '100%', borderWidth: 1, borderColor: '#F0F0F0' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#2E7D32' },
  statLabel: { fontSize: 11, color: '#9E9E9E', marginTop: 4, fontWeight: '600', textTransform: 'uppercase' },
  statDivider: { width: 1, height: 30, backgroundColor: '#E0E0E0' },
  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#BDBDBD', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, marginLeft: 8 },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuIconWrapper: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  menuContent: { flex: 1, marginLeft: 16 },
  menuLabel: { fontSize: 16, fontWeight: '700', color: '#1A1C1A' },
  menuSubtitle: { fontSize: 13, color: '#9E9E9E', marginTop: 2 },
  logoutContainer: { paddingHorizontal: 20, marginTop: 32 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 22, backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#FFCDD2' },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#E53935', marginLeft: 10 },
  version: { textAlign: 'center', color: '#BDBDBD', fontSize: 12, marginTop: 24, fontWeight: '500' },
});
