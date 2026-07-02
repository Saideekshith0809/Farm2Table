import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, Animated, TouchableOpacity, Dimensions,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [userType, setUserType] = useState('buyer');
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    checkUserType();
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const checkUserType = async () => {
    const type = await require('@react-native-async-storage/async-storage').default.getItem('userType');
    if (type) setUserType(type);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => q > 1 ? q - 1 : 1);

  const addToCart = () => {
    alert(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
    navigation.goBack();
  };

  const imageScale = scrollY.interpolate({ inputRange: [-100, 0, 200], outputRange: [1.3, 1, 0.8], extrapolate: 'clamp' });
  const imageTranslate = scrollY.interpolate({ inputRange: [0, 200], outputRange: [0, -60], extrapolate: 'clamp' });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      {/* Float Header */}
      <View style={styles.floatHeader}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#1A1C1A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn}>
          <Icon name="share-variant-outline" size={22} color="#1A1C1A" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Parallax Image */}
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }, { translateY: imageTranslate }] }]}>
          <LinearGradient colors={product.gradient || ['#2E7D32', '#43A047']} style={styles.imageBg}>
            <Text style={styles.productEmoji}>{product.image}</Text>
          </LinearGradient>
          {product.organic && (
            <View style={styles.organicBadge}>
              <Icon name="leaf" size={14} color="#2E7D32" />
              <Text style={styles.organicText}>Organic</Text>
            </View>
          )}
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.contentSheet, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <View style={styles.dragHandle} />

          <View style={styles.detailsContainer}>
            {/* Name + Category */}
            <View style={styles.nameRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.category}>{product.category}</Text>
              </View>
              <TouchableOpacity style={styles.heartBtn}>
                <Icon name="heart-outline" size={24} color="#E53935" />
              </TouchableOpacity>
            </View>

            {/* Price + Rating */}
            <View style={styles.priceRatingRow}>
              <View>
                <Text style={styles.price}>₹{product.price}<Text style={styles.unit}>/{product.unit}</Text></Text>
              </View>
              <View style={styles.ratingBadge}>
                <Icon name="star" size={16} color="#FBC02D" />
                <Text style={styles.ratingValue}>{product.rating}</Text>
                <Text style={styles.reviews}>(120)</Text>
              </View>
            </View>

            {/* Farmer Card */}
            <View style={styles.sectionLabel}><Text style={styles.sectionTitle}>Farmer</Text></View>
            <View style={styles.farmerCard}>
              <View style={styles.farmerInner}>
                <View style={styles.farmerAvatar}>
                  <Icon name="account" size={28} color="#2E7D32" />
                </View>
                <View style={styles.farmerInfo}>
                  <Text style={styles.farmerName}>{product.farmer}</Text>
                  <View style={styles.farmerLocation}>
                    <Icon name="map-marker" size={12} color="#9E9E9E" />
                    <Text style={styles.farmerLocationText}>{product.location}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.messageBtn}>
                  <Icon name="message-text-outline" size={20} color="#2E7D32" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.sectionLabel}><Text style={styles.sectionTitle}>About</Text></View>
            <Text style={styles.description}>
              Fresh, high-quality {product.name.toLowerCase()} directly from the farm.
              Harvested daily to ensure maximum freshness and nutritional value.
              {product.organic && ' Grown using 100% organic farming methods without synthetic pesticides.'}
            </Text>

            {/* Stock */}
            <View style={styles.stockRow}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>{product.stock} {product.unit} in stock</Text>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* Bottom Bar */}
      {userType === 'buyer' && (
        <View style={styles.bottomBar}>
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.qtyBtn} onPress={decrementQuantity}>
                <Icon name="minus" size={18} color="#2E7D32" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={incrementQuantity}>
                <Icon name="plus" size={18} color="#2E7D32" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={addToCart} activeOpacity={0.8} style={{ flex: 1 }}>
            <LinearGradient colors={['#2E7D32', '#43A047']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addToCartBtn}>
              <Icon name="cart-plus" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
              <Text style={styles.addToCartPrice}>₹{product.price * quantity}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  floatHeader: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  headerBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  imageContainer: { height: 320, justifyContent: 'center', alignItems: 'center' },
  imageBg: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  productEmoji: { fontSize: 120 },
  organicBadge: { position: 'absolute', top: 60, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, elevation: 4 },
  organicText: { marginLeft: 5, color: '#2E7D32', fontSize: 12, fontWeight: '700' },
  contentSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 36, borderTopRightRadius: 36, marginTop: -35, minHeight: height * 0.5, elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: -10 } },
  dragHandle: { width: 40, height: 5, borderRadius: 2.5, backgroundColor: '#E0E0E0', alignSelf: 'center', marginTop: 14, marginBottom: 8 },
  detailsContainer: { padding: 24 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start' },
  productName: { fontSize: 28, fontWeight: '800', color: '#1A1C1A', letterSpacing: -1 },
  category: { fontSize: 15, color: '#9E9E9E', marginTop: 2, fontWeight: '600' },
  heartBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF5F5', justifyContent: 'center', alignItems: 'center' },
  priceRatingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  price: { fontSize: 32, fontWeight: '800', color: '#2E7D32' },
  unit: { fontSize: 16, fontWeight: '500', color: '#9E9E9E' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9C4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ratingValue: { fontSize: 16, fontWeight: '800', color: '#FBC02D', marginLeft: 4 },
  reviews: { fontSize: 13, color: '#BDBDBD', marginLeft: 4 },
  sectionLabel: { marginTop: 28, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1C1A', letterSpacing: -0.5 },
  farmerCard: { borderRadius: 24, backgroundColor: '#F8FAF8', borderWidth: 1, borderColor: '#EEEEEE' },
  farmerInner: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  farmerAvatar: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  farmerInfo: { flex: 1, marginLeft: 16 },
  farmerName: { fontSize: 17, fontWeight: '700', color: '#1A1C1A' },
  farmerLocation: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  farmerLocationText: { fontSize: 12, color: '#9E9E9E', marginLeft: 4 },
  messageBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  description: { fontSize: 15, color: '#5C635C', lineHeight: 24, fontWeight: '400' },
  stockRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  stockDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32', marginRight: 8 },
  stockText: { fontSize: 14, color: '#2E7D32', fontWeight: '700' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, paddingBottom: 36, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0F0F0', alignItems: 'center', elevation: 20 },
  quantitySection: { marginRight: 20 },
  quantityLabel: { fontSize: 11, color: '#9E9E9E', marginBottom: 6, textAlign: 'center', fontWeight: '700', textTransform: 'uppercase' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 16, padding: 4 },
  qtyBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, elevation: 2 },
  qtyValue: { fontSize: 18, fontWeight: '800', color: '#1A1C1A', marginHorizontal: 16 },
  addToCartBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 20, elevation: 8, shadowColor: '#2E7D32', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  addToCartText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginRight: 10 },
  addToCartPrice: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
});
