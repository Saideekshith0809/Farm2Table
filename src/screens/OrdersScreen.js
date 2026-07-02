import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OrdersScreen() {
  const [filter, setFilter] = useState('all');
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const orders = [
    {
      id: 1, orderNumber: 'ORD-2024-001', date: '2024-01-28', farmer: 'Rajesh Kumar',
      products: [{ name: 'Fresh Tomatoes', quantity: 2, price: 80 }, { name: 'Organic Spinach', quantity: 1, price: 30 }],
      total: 110, status: 'Delivered', deliveryDate: '2024-01-29',
    },
    {
      id: 2, orderNumber: 'ORD-2024-002', date: '2024-01-30', farmer: 'Priya Sharma',
      products: [{ name: 'Fresh Carrots', quantity: 3, price: 105 }],
      total: 105, status: 'In Transit', estimatedDelivery: '2024-01-31',
    },
    {
      id: 3, orderNumber: 'ORD-2024-003', date: '2024-01-31', farmer: 'Amit Patil',
      products: [{ name: 'Fresh Apples', quantity: 2, price: 240 }],
      total: 240, status: 'Processing', estimatedDelivery: '2024-02-01',
    },
  ];

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'active') return o.status === 'Processing' || o.status === 'In Transit';
    if (filter === 'completed') return o.status === 'Delivered';
    return true;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Delivered': return { gradient: ['#00C853', '#00E676'], icon: 'check-circle', color: '#00C853' };
      case 'In Transit': return { gradient: ['#2196F3', '#42A5F5'], icon: 'truck-delivery', color: '#42A5F5' };
      case 'Processing': return { gradient: ['#FF9800', '#FFB74D'], icon: 'clock-outline', color: '#FFB74D' };
      default: return { gradient: ['#666', '#888'], icon: 'help-circle', color: '#888' };
    }
  };

  const filters = [
    { key: 'all', label: 'All', icon: 'format-list-bulleted' },
    { key: 'active', label: 'Active', icon: 'truck-fast' },
    { key: 'completed', label: 'Done', icon: 'check-all' },
  ];

  const renderOrder = ({ item, index }) => <AnimatedOrderCard order={item} index={index} getStatusConfig={getStatusConfig} />;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerAnim }]}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSub}>{filteredOrders.length} orders total</Text>
      </Animated.View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            activeOpacity={0.7}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Icon name={f.icon} size={16} color={filter === f.key ? '#FFFFFF' : '#9E9E9E'} />
            <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Icon name="clipboard-list-outline" size={60} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
  );
}

function AnimatedOrderCard({ order, index, getStatusConfig }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, delay: index * 120, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, []);

  const config = getStatusConfig(order.status);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
      <View style={styles.orderCard}>
        <View style={styles.orderCardInner}>
          {/* Header Row */}
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderNumber}>{order.orderNumber}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: config.color + '15' }]}>
              <Icon name={config.icon} size={14} color={config.color} />
              <Text style={[styles.statusText, { color: config.color }]}>{order.status}</Text>
            </View>
          </View>

          {/* Farmer */}
          <View style={styles.farmerRow}>
            <View style={styles.farmerChip}>
              <Icon name="account" size={14} color="#9E9E9E" />
              <Text style={styles.farmerName}>{order.farmer}</Text>
            </View>
          </View>

          {/* Products */}
          <View style={styles.productsBox}>
            {order.products.map((product, i) => (
              <View key={i} style={styles.productRow}>
                <Text style={styles.productName}>{product.name} <Text style={{ color: '#9E9E9E', fontWeight: '400' }}>× {product.quantity}</Text></Text>
                <Text style={styles.productPrice}>₹{product.price}</Text>
              </View>
            ))}
          </View>

          <View style={styles.cardDivider} />

          {/* Footer */}
          <View style={styles.orderFooter}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{order.total}</Text>
            </View>
            {order.status !== 'Delivered' && (
              <View style={styles.deliveryBadge}>
                <Icon name="clock-outline" size={14} color="#2E7D32" />
                <Text style={styles.deliveryText}>ETA: {order.estimatedDelivery}</Text>
              </View>
            )}
          </View>

          {/* Timeline */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineDotsRow}>
              <View style={[styles.timelineDot, { backgroundColor: '#2E7D32' }]} />
              <View style={[styles.timelineLine, { backgroundColor: order.status === 'Processing' ? '#EEEEEE' : '#2E7D32' }]} />
              <View style={[styles.timelineDot, { backgroundColor: order.status === 'Processing' ? '#EEEEEE' : config.color }]} />
              <View style={[styles.timelineLine, { backgroundColor: order.status === 'Delivered' ? '#2E7D32' : '#EEEEEE' }]} />
              <View style={[styles.timelineDot, { backgroundColor: order.status === 'Delivered' ? '#2E7D32' : '#EEEEEE' }]} />
            </View>
            <View style={styles.timelineLabels}>
              <Text style={styles.timelineLabel}>Placed</Text>
              <Text style={[styles.timelineLabel, { textAlign: 'center' }]}>Shipped</Text>
              <Text style={[styles.timelineLabel, { textAlign: 'right' }]}>Delivered</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1C1A', letterSpacing: -1 },
  headerSub: { fontSize: 13, color: '#9E9E9E', marginTop: 4 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 12, marginBottom: 16 },
  filterTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 16, marginHorizontal: 4, backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  filterTabActive: { backgroundColor: '#2E7D32', elevation: 4, shadowColor: '#2E7D32', shadowOpacity: 0.2 },
  filterLabel: { fontSize: 13, fontWeight: '700', color: '#9E9E9E', marginLeft: 6 },
  filterLabelActive: { color: '#FFFFFF' },
  listContainer: { paddingBottom: 100 },
  orderCard: { paddingHorizontal: 20, marginBottom: 16 },
  orderCardInner: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  orderNumber: { fontSize: 16, fontWeight: '800', color: '#1A1C1A' },
  orderDate: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '800', marginLeft: 4 },
  farmerRow: { marginBottom: 16 },
  farmerChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  farmerName: { fontSize: 12, color: '#5C635C', marginLeft: 6, fontWeight: '600' },
  productsBox: { backgroundColor: '#F8FAF8', borderRadius: 16, padding: 14, marginBottom: 16 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  productName: { fontSize: 14, color: '#1A1C1A', fontWeight: '600' },
  productPrice: { fontSize: 14, color: '#5C635C', fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 16 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  totalLabel: { fontSize: 11, color: '#9E9E9E', fontWeight: '700', textTransform: 'uppercase' },
  totalAmount: { fontSize: 24, fontWeight: '900', color: '#2E7D32', marginTop: 2 },
  deliveryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  deliveryText: { fontSize: 12, color: '#2E7D32', marginLeft: 6, fontWeight: '700' },
  timelineContainer: { marginTop: 4 },
  timelineDotsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 4 },
  timelineDot: { width: 10, height: 10, borderRadius: 5 },
  timelineLine: { flex: 1, height: 2 },
  timelineLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  timelineLabel: { fontSize: 10, color: '#9E9E9E', fontWeight: '600', width: 60 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyIconWrapper: { width: 100, height: 100, borderRadius: 36, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 4 },
  emptyText: { fontSize: 16, color: '#9E9E9E', fontWeight: '700', marginTop: 12 },
});
