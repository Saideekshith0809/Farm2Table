import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated,
} from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AnimatedCard = ({ children, index, scrollY }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(animValue, {
      toValue: 1,
      delay: index * 120,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={{
      opacity: animValue,
      transform: [
        { translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
        { scale: animValue.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
      ],
    }}>
      {children}
    </Animated.View>
  );
};

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = () => {
    setFeaturedProducts([
      { id: 1, name: 'Fresh Tomatoes', price: 40, unit: 'kg', farmer: 'Rajesh Kumar', location: 'Pune', image: '🍅', rating: 4.5, gradient: ['#FF6B6B', '#EE5A24'] },
      { id: 2, name: 'Organic Spinach', price: 30, unit: 'kg', farmer: 'Priya Sharma', location: 'Nashik', image: '🥬', rating: 4.8, gradient: ['#00C853', '#00E676'] },
      { id: 3, name: 'Fresh Carrots', price: 35, unit: 'kg', farmer: 'Amit Patil', location: 'Satara', image: '🥕', gradient: ['#F39C12', '#E67E22'], rating: 4.6 },
      { id: 4, name: 'Premium Mangoes', price: 120, unit: 'kg', farmer: 'Suresh Reddy', location: 'Ratnagiri', image: '🥭', gradient: ['#FDCB6E', '#F39C12'], rating: 4.9 },
    ]);
  };

  const categories = [
    { name: 'Vegetables', icon: '🥬', gradient: ['#00C853', '#00E676'] },
    { name: 'Fruits', icon: '🍎', gradient: ['#FF6B6B', '#EE5A24'] },
    { name: 'Grains', icon: '🌾', gradient: ['#F39C12', '#E67E22'] },
    { name: 'Dairy', icon: '🥛', gradient: ['#74B9FF', '#0984E3'] },
    { name: 'Organic', icon: '🌱', gradient: ['#55EFC4', '#00B894'] },
  ];

  const headerTranslate = scrollY.interpolate({ inputRange: [0, 120], outputRange: [0, -30], extrapolate: 'clamp' });
  const headerScale = scrollY.interpolate({ inputRange: [0, 120], outputRange: [1, 0.95], extrapolate: 'clamp' });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerTranslate }, { scale: headerScale }] }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Hello! 👋</Text>
              <Text style={styles.headerTitle}>Farm2Table</Text>
            </View>
            <TouchableOpacity style={styles.notifButton}>
              <Icon name="bell-outline" size={22} color="#2E7D32" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Fresh produce, direct from farm</Text>
        </Animated.View>

        {/* Search Bar */}
        <AnimatedCard index={0} scrollY={scrollY}>
          <View style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
              <Icon name="magnify" size={22} color="#9E9E9E" style={{ marginLeft: 14 }} />
              <Searchbar
                placeholder="Search products, farmers..."
                placeholderTextColor="#9E9E9E"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.searchInput}
                iconColor="transparent"
                theme={{ colors: { onSurfaceVariant: '#9E9E9E' } }}
              />
            </View>
          </View>
        </AnimatedCard>

        {/* Categories */}
        <AnimatedCard index={1} scrollY={scrollY}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
              {categories.map((cat, i) => (
                <TouchableOpacity key={i} activeOpacity={0.7} style={styles.categoryCardOuter}>
                  <View style={[styles.categoryCard, { backgroundColor: '#FFFFFF' }]}>
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </AnimatedCard>

        {/* Featured Products */}
        <AnimatedCard index={2} scrollY={scrollY}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                <Text style={styles.seeAll}>See All →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
              {featuredProducts.map((product, i) => (
                <TouchableOpacity key={product.id} style={styles.featuredCard} activeOpacity={0.8} onPress={() => navigation.navigate('ProductDetail', { product })}>
                  <View style={styles.featuredCardInner}>
                    <View style={styles.featuredImageContainer}>
                      <LinearGradient colors={product.gradient} style={styles.featuredImageBg}>
                        <Text style={styles.featuredEmoji}>{product.image}</Text>
                      </LinearGradient>
                    </View>
                    <Text style={styles.featuredName}>{product.name}</Text>
                    <View style={styles.featuredFarmer}>
                      <Icon name="account" size={12} color="#9E9E9E" />
                      <Text style={styles.featuredFarmerName}>{product.farmer}</Text>
                    </View>
                    <View style={styles.featuredBottom}>
                      <Text style={styles.featuredPrice}>₹{product.price}<Text style={styles.featuredUnit}>/{product.unit}</Text></Text>
                      <View style={styles.ratingBadge}>
                        <Icon name="star" size={12} color="#FFC107" />
                        <Text style={styles.ratingText}>{product.rating}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </AnimatedCard>

        {/* All Products Vertical */}
        <AnimatedCard index={3} scrollY={scrollY}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Now</Text>
            {featuredProducts.map((product, i) => (
              <AnimatedCard key={product.id} index={i + 4} scrollY={scrollY}>
                <TouchableOpacity activeOpacity={0.8} style={styles.productRow} onPress={() => navigation.navigate('ProductDetail', { product })}>
                  <View style={styles.productCard}>
                    <View style={styles.productImageWrapper}>
                      <LinearGradient colors={product.gradient} style={styles.productImgBg}>
                        <Text style={styles.productEmoji}>{product.image}</Text>
                      </LinearGradient>
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <View style={styles.productMeta}>
                        <Icon name="map-marker" size={12} color="#9E9E9E" />
                        <Text style={styles.productLocation}>{product.location}</Text>
                      </View>
                      <View style={styles.productMeta}>
                        <Icon name="star" size={12} color="#FFC107" />
                        <Text style={styles.productRating}>{product.rating}</Text>
                      </View>
                    </View>
                    <View style={styles.productPriceSection}>
                      <Text style={styles.productPrice}>₹{product.price}</Text>
                      <TouchableOpacity>
                        <LinearGradient colors={['#2E7D32', '#43A047']} style={styles.addToCartMini}>
                          <Icon name="plus" size={18} color="#FFFFFF" />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </AnimatedCard>
            ))}
          </View>
        </AnimatedCard>

        {/* Nearby Farmers CTA */}
        <AnimatedCard index={8} scrollY={scrollY}>
          <View style={styles.section}>
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient colors={['#2E7D32', '#43A047']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaCard}>
                <View style={styles.ctaContent}>
                  <Icon name="map-marker-radius" size={44} color="#FFFFFF" />
                  <View style={styles.ctaText}>
                    <Text style={styles.ctaTitle}>Find Local Farmers</Text>
                    <Text style={styles.ctaDescription}>Discover fresh produce near you</Text>
                  </View>
                  <Icon name="chevron-right" size={28} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  scrollContent: { paddingTop: 0 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 13, color: '#5C635C', marginBottom: 4, fontWeight: '500' },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#1A1C1A', letterSpacing: -1 },
  headerSubtitle: { fontSize: 14, color: '#5C635C', marginTop: 4 },
  notifButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  notifDot: { position: 'absolute', top: 11, right: 13, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E53935', borderWidth: 1.5, borderColor: '#FFFFFF' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 10 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  searchBar: { flex: 1, backgroundColor: 'transparent', elevation: 0, borderRadius: 16, height: 50 },
  searchInput: { fontSize: 14, color: '#1A1C1A' },
  section: { marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1A1C1A', paddingHorizontal: 24, marginBottom: 16, letterSpacing: -0.5 },
  seeAll: { color: '#2E7D32', fontSize: 14, fontWeight: '600' },
  categoryCardOuter: { alignItems: 'center', marginRight: 16 },
  categoryCard: { width: 68, height: 68, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  categoryIcon: { fontSize: 32 },
  categoryName: { fontSize: 12, color: '#5C635C', marginTop: 8, fontWeight: '600' },
  featuredCard: { width: 180, marginRight: 16, borderRadius: 24, overflow: 'visible', padding: 4 },
  featuredCardInner: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, elevation: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  featuredImageContainer: { marginBottom: 12 },
  featuredImageBg: { width: '100%', height: 100, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  featuredEmoji: { fontSize: 56 },
  featuredName: { fontSize: 15, fontWeight: '700', color: '#1A1C1A', marginBottom: 4 },
  featuredFarmer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featuredFarmerName: { fontSize: 11, color: '#9E9E9E', marginLeft: 4 },
  featuredBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredPrice: { fontSize: 18, fontWeight: '800', color: '#2E7D32' },
  featuredUnit: { fontSize: 12, fontWeight: '400', color: '#9E9E9E' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9C4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  ratingText: { fontSize: 11, color: '#FBC02D', marginLeft: 3, fontWeight: '700' },
  productRow: { paddingHorizontal: 20, marginBottom: 14 },
  productCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, alignItems: 'center' },
  productImageWrapper: { width: 64, height: 64, borderRadius: 18, overflow: 'hidden' },
  productImgBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  productEmoji: { fontSize: 34 },
  productInfo: { flex: 1, marginLeft: 16 },
  productName: { fontSize: 16, fontWeight: '700', color: '#1A1C1A', marginBottom: 4 },
  productMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  productLocation: { fontSize: 12, color: '#9E9E9E', marginLeft: 4 },
  productRating: { fontSize: 12, color: '#5C635C', marginLeft: 4, fontWeight: '500' },
  productPriceSection: { alignItems: 'flex-end', paddingRight: 4 },
  productPrice: { fontSize: 18, fontWeight: '800', color: '#2E7D32', marginBottom: 8 },
  addToCartMini: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  ctaCard: { marginHorizontal: 20, borderRadius: 24, padding: 24, elevation: 8, shadowColor: '#2E7D32', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
  ctaContent: { flexDirection: 'row', alignItems: 'center' },
  ctaText: { flex: 1, marginLeft: 16 },
  ctaTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  ctaDescription: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
