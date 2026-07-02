import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Fresh Tomatoes', price: 40, quantity: 2, unit: 'kg', farmer: 'Rajesh Kumar', image: '🍅', gradient: ['#FF6B6B', '#EE5A24'] },
    { id: 2, name: 'Organic Spinach', price: 30, quantity: 1, unit: 'kg', farmer: 'Priya Sharma', image: '🥬', gradient: ['#00C853', '#00E676'] },
  ]);

  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const updateQuantity = (id, delta) => {
    setCartItems(items => items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const renderCartItem = ({ item, index }) => (
    <AnimatedCartItem item={item} index={index} updateQuantity={updateQuantity} removeItem={removeItem} />
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerAnim }]}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.itemCountBadge}>
          <Text style={styles.itemCountText}>{cartItems.length}</Text>
        </View>
      </Animated.View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <Icon name="cart-outline" size={60} color="#E0E0E0" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some fresh produce to get started</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Products')}>
            <LinearGradient colors={['#2E7D32', '#43A047']} style={styles.shopButton}>
              <Icon name="shopping" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.shopButtonText}>Browse Products</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id.toString()}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={() => alert('Proceeding to checkout...')}>
                <LinearGradient colors={['#2E7D32', '#43A047']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.checkoutButton}>
                  <Text style={styles.checkoutText}>Checkout</Text>
                  <View style={styles.checkoutPrice}>
                    <Text style={styles.checkoutPriceText}>₹{total}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

function AnimatedCartItem({ item, index, updateQuantity, removeItem }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, delay: index * 100, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }] }}>
      <View style={styles.cartItemContainer}>
        <View style={styles.cartItemCard}>
          <View style={styles.itemImageWrapper}>
            <LinearGradient colors={item.gradient} style={styles.itemImgBg}>
              <Text style={styles.itemEmoji}>{item.image}</Text>
            </LinearGradient>
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemFarmer}>{item.farmer}</Text>
            <Text style={styles.itemPrice}>₹{item.price}/{item.unit}</Text>
          </View>
          <View style={styles.itemActions}>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}>
                <Icon name="minus" size={16} color="#2E7D32" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
                <Icon name="plus" size={16} color="#2E7D32" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteBtn}>
              <Icon name="trash-can-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1C1A', letterSpacing: -1 },
  itemCountBadge: { marginLeft: 12, backgroundColor: '#2E7D32', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  itemCountText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  list: { flex: 1 },
  cartItemContainer: { paddingHorizontal: 20, marginBottom: 14 },
  cartItemCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, alignItems: 'center' },
  itemImageWrapper: { width: 64, height: 64, borderRadius: 18, overflow: 'hidden' },
  itemImgBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemEmoji: { fontSize: 34 },
  itemDetails: { flex: 1, marginLeft: 16 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1A1C1A' },
  itemFarmer: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  itemPrice: { fontSize: 14, color: '#2E7D32', fontWeight: '800', marginTop: 4 },
  itemActions: { alignItems: 'flex-end', paddingRight: 4 },
  quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7F5', borderRadius: 14, padding: 2 },
  qtyBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, elevation: 1 },
  qtyValue: { fontSize: 15, fontWeight: '800', color: '#1A1C1A', marginHorizontal: 10 },
  deleteBtn: { marginTop: 10, padding: 4 },
  summaryContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: -5 } },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#9E9E9E', fontWeight: '500' },
  summaryValue: { fontSize: 14, color: '#1A1C1A', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  totalLabel: { fontSize: 18, fontWeight: '800', color: '#1A1C1A' },
  totalValue: { fontSize: 24, fontWeight: '900', color: '#2E7D32' },
  checkoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 20, marginTop: 16, elevation: 8, shadowColor: '#2E7D32', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  checkoutText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginRight: 10 },
  checkoutPrice: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  checkoutPriceText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIconWrapper: { width: 100, height: 100, borderRadius: 36, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#1A1C1A', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: '#9E9E9E', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  shopButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20, elevation: 6 },
  shopButtonText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
});
