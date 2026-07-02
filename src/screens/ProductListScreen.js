import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, FlatList, TouchableOpacity, Animated, ScrollView, Dimensions,
} from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ProductListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userType, setUserType] = useState(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProducts();
    checkUserType();
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const checkUserType = async () => {
    const type = await AsyncStorage.getItem('userType');
    setUserType(type);
  };

  const loadProducts = async () => {
    try {
      const { getProducts } = require('../services/api');
      const data = await getProducts();
      const gradients = [['#FF6B6B', '#EE5A24'], ['#00C853', '#00E676'], ['#74B9FF', '#0984E3'], ['#FDCB6E', '#F39C12'], ['#A29BFE', '#6C5CE7'], ['#55EFC4', '#00B894']];
      const mappedProducts = data.map((workshop, i) => ({
        id: workshop._id,
        name: workshop.title,
        category: workshop.category,
        price: workshop.fee === 'Free' ? 0 : parseInt(workshop.fee.replace('₹', '')),
        unit: 'session',
        farmer: workshop.trainerName || 'Village Trainer',
        location: `${workshop.district || ''}, ${workshop.state || ''}`,
        stock: workshop.maxParticipants - workshop.enrolledCount,
        image: workshop.image || '🎨',
        rating: workshop.rating || 0,
        organic: workshop.skillLevel === 'Beginner',
        gradient: gradients[i % gradients.length],
      }));
      setProducts(mappedProducts);
    } catch (err) {
      console.error('Error loading workshops:', err);
    }
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item, index }) => {
    return (
      <AnimatedProductCard item={item} index={index} navigation={navigation} userType={userType} />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <Text style={styles.headerTitle}>Products</Text>
        <Text style={styles.headerSub}>{filteredProducts.length} items available</Text>
      </Animated.View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Icon name="magnify" size={22} color="#9E9E9E" />
          <View style={styles.searchInput}>
            <Text
              style={styles.searchPlaceholder}
              onPress={() => {}}
            >
              {searchQuery || 'Search products or farmers...'}
            </Text>
          </View>
        </View>
      </View>

      {/* Category Chips */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="package-variant-closed" size={60} color="#E0E0E0" />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />

      {userType === 'farmer' && (
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('AddProduct')}>
          <LinearGradient colors={['#2E7D32', '#43A047']} style={styles.fab}>
            <Icon name="plus" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

function AnimatedProductCard({ item, index, navigation, userType }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, delay: index * 80, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
      <TouchableOpacity style={styles.productCard} activeOpacity={0.8} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
        <View style={styles.productCardInner}>
          <View style={styles.productImageWrapper}>
            <LinearGradient colors={item.gradient || ['#2E7D32', '#43A047']} style={styles.productImgBg}>
              <Text style={styles.productEmoji}>{item.image}</Text>
              {item.organic && (
                <View style={styles.organicBadge}>
                  <Text style={{ fontSize: 10 }}>🌱</Text>
                </View>
              )}
            </LinearGradient>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.productMeta}>
              <Icon name="account" size={12} color="#9E9E9E" />
              <Text style={styles.productMetaText}>{item.farmer}</Text>
            </View>
            <View style={styles.productMeta}>
              <Icon name="map-marker" size={12} color="#9E9E9E" />
              <Text style={styles.productMetaText}>{item.location}</Text>
            </View>
            <View style={styles.productBottom}>
              <View style={styles.ratingBadge}>
                <Icon name="star" size={11} color="#FFC107" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <Text style={styles.stockText}>Stock: {item.stock}</Text>
            </View>
          </View>
          <View style={styles.priceSection}>
            <Text style={styles.productPrice}>₹{item.price}</Text>
            <Text style={styles.productUnit}>/{item.unit}</Text>
            {userType === 'buyer' && (
              <TouchableOpacity activeOpacity={0.7}>
                <LinearGradient colors={['#2E7D32', '#43A047']} style={styles.addBtn}>
                  <Icon name="cart-plus" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1C1A', letterSpacing: -1 },
  headerSub: { fontSize: 13, color: '#5C635C', marginTop: 4 },
  searchContainer: { paddingHorizontal: 20, marginTop: 12, marginBottom: 12 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, height: 50, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  searchInput: { flex: 1, marginLeft: 10 },
  searchPlaceholder: { fontSize: 14, color: '#9E9E9E' },
  categoryContainer: { marginBottom: 12 },
  categoryChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, marginRight: 10, backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  categoryChipActive: { backgroundColor: '#2E7D32' },
  categoryChipText: { fontSize: 13, color: '#5C635C', fontWeight: '700' },
  categoryChipTextActive: { color: '#FFFFFF' },
  listContainer: { paddingBottom: 100 },
  productCard: { paddingHorizontal: 20, marginBottom: 14 },
  productCardInner: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, alignItems: 'center' },
  productImageWrapper: { width: 70, height: 70, borderRadius: 18, overflow: 'hidden' },
  productImgBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  productEmoji: { fontSize: 38 },
  organicBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#FFFFFF', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  productInfo: { flex: 1, marginLeft: 16 },
  productName: { fontSize: 16, fontWeight: '700', color: '#1A1C1A', marginBottom: 4 },
  productMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  productMetaText: { fontSize: 12, color: '#9E9E9E', marginLeft: 4 },
  productBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9C4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 8 },
  ratingText: { fontSize: 11, color: '#FBC02D', marginLeft: 3, fontWeight: '700' },
  stockText: { fontSize: 11, color: '#9E9E9E' },
  priceSection: { alignItems: 'flex-end', paddingRight: 4 },
  productPrice: { fontSize: 18, fontWeight: '800', color: '#2E7D32' },
  productUnit: { fontSize: 11, color: '#9E9E9E', marginBottom: 8 },
  addBtn: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#9E9E9E', marginTop: 12 },
  fab: { position: 'absolute', bottom: 90, right: 20, width: 58, height: 58, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#2E7D32', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
});
