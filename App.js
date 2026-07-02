import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Animated, StyleSheet, Platform } from 'react-native';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FarmerDashboardScreen from './src/screens/FarmerDashboardScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import DeliveryDashboardScreen from './src/screens/DeliveryDashboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',
    accent: '#43A047',
    background: '#F8FAF8',
    surface: '#FFFFFF',
  },
};

const TAB_COLORS = {
  active: '#2E7D32',
  inactive: '#9E9E9E',
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabBarSurface}>
        <View style={tabStyles.inner}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Products') iconName = isFocused ? 'shopping' : 'shopping-outline';
            else if (route.name === 'Cart') iconName = isFocused ? 'cart' : 'cart-outline';
            else if (route.name === 'Orders') iconName = 'package-variant';
            else if (route.name === 'Profile') iconName = isFocused ? 'account' : 'account-outline';
            else if (route.name === 'Dashboard') iconName = 'view-dashboard';

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <View key={route.key} style={tabStyles.tabItem}>
                {isFocused && (
                  <View style={tabStyles.activeBackground} />
                )}
                <Icon
                  name={iconName}
                  size={isFocused ? 26 : 22}
                  color={isFocused ? TAB_COLORS.active : TAB_COLORS.inactive}
                  onPress={onPress}
                />
                {isFocused && <View style={tabStyles.activeDot} />}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarSurface: {
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    paddingTop: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: -8,
    left: 4,
    right: 4,
    bottom: -8,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2E7D32',
    marginTop: 4,
  },
});

// Buyer Tab Navigation
function BuyerTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Farmer Tab Navigation
function FarmerTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={FarmerDashboardScreen} />
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Delivery Tab Navigation
function DeliveryTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DeliveryDashboardScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const type = await AsyncStorage.getItem('userType');
      if (token && type) {
        setIsAuthenticated(true);
        setUserType(type);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <>
                <Stack.Screen name="Login">
                  {props => <LoginScreen {...props} onLogin={(type) => {
                    setIsAuthenticated(true);
                    setUserType(type);
                  }} />}
                </Stack.Screen>
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            ) : (
              <>
                {userType === 'buyer' ? (
                  <>
                    <Stack.Screen name="BuyerTabs" component={BuyerTabs} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                  </>
                ) : userType === 'farmer' ? (
                  <>
                    <Stack.Screen name="FarmerTabs" component={FarmerTabs} />
                    <Stack.Screen name="AddProduct" component={AddProductScreen} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="DeliveryTabs" component={DeliveryTabs} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                  </>
                )}
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}